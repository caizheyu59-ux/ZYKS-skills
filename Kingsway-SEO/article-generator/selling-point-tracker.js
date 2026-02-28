/**
 * Kingsway 卖点覆盖度追踪
 *
 * 记录每篇文章对应的卖点，追踪各卖点的覆盖情况
 * 用于发现内容盲区，指导选题方向
 */

const fs = require('fs');
const path = require('path');
const { sellingPoints, getAllSellingPoints } = require('./selling-points-material.js');

// 追踪数据文件路径
const TRACKING_FILE = path.join(__dirname, '.selling-point-tracking.json');

/**
 * 初始化追踪数据
 */
function initTracking() {
  if (!fs.existsSync(TRACKING_FILE)) {
    const initialData = {
      articles: [],
      sellingPoints: {}
    };

    // 初始化各卖点的统计数据
    for (const point of getAllSellingPoints()) {
      initialData.sellingPoints[point.id] = {
        id: point.id,
        name: point.name,
        tagline: point.tagline,
        articleCount: 0,
        platforms: {
          google: 0,
          baidu: 0,
          zhihu: 0,
          csdn: 0
        },
        lastArticleDate: null,
        coverage: 0, // 0-100
        priority: 'medium', // high/medium/low
        totalImpressions: 0,
        totalClicks: 0,
        totalInquiries: 0,
        avgCTR: 0,
        avgConversion: 0
      };
    }

    fs.writeFileSync(TRACKING_FILE, JSON.stringify(initialData, null, 2));
  }
}

/**
 * 记录文章关联的卖点
 * @param {Object} article - 文章对象
 */
function recordArticle(article) {
  initTracking();

  const trackingData = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));

  // 生成文章ID（如果未提供）
  const articleId = article.id || generateArticleId(article);
  article.id = articleId;

  // 添加到文章列表
  const articleEntry = {
    id: articleId,
    title: article.title,
    keyword: article.keyword,
    sellingPointId: article.sellingPointId,
    platform: article.platform,
    style: article.style,
    createdAt: article.createdAt || new Date().toISOString(),
    url: article.url
  };

  trackingData.articles.push(articleEntry);

  // 更新卖点统计
  const pointData = trackingData.sellingPoints[article.sellingPointId];
  if (pointData) {
    pointData.articleCount++;

    // 更新平台统计
    if (Array.isArray(article.platform)) {
      for (const p of article.platform) {
        if (pointData.platforms[p] !== undefined) {
          pointData.platforms[p]++;
        }
      }
    } else if (pointData.platforms[article.platform] !== undefined) {
      pointData.platforms[article.platform]++;
    }

    // 更新最后文章日期
    const articleDate = new Date(articleEntry.createdAt);
    if (!pointData.lastArticleDate || articleDate > new Date(pointData.lastArticleDate)) {
      pointData.lastArticleDate = articleEntry.createdAt;
    }

    // 计算覆盖度
    pointData.coverage = calculateCoverage(pointData);
  }

  fs.writeFileSync(TRACKING_FILE, JSON.stringify(trackingData, null, 2));

  return articleId;
}

/**
 * 更新文章效果数据
 * @param {string} articleId - 文章ID
 * @param {Object} performance - 效果数据
 */
function updatePerformance(articleId, performance) {
  initTracking();

  const trackingData = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
  const article = trackingData.articles.find(a => a.id === articleId);

  if (!article) {
    return false;
  }

  // 更新文章效果
  article.performance = {
    ...article.performance,
    ...performance,
    updatedAt: new Date().toISOString()
  };

  // 更新卖点统计
  const pointData = trackingData.sellingPoints[article.sellingPointId];
  if (pointData && performance) {
    if (performance.impressions) {
      pointData.totalImpressions += performance.impressions;
    }
    if (performance.clicks) {
      pointData.totalClicks += performance.clicks;
    }
    if (performance.inquiries) {
      pointData.totalInquiries += performance.inquiries;
    }

    // 计算平均值
    if (pointData.totalImpressions > 0) {
      pointData.avgCTR = (pointData.totalClicks / pointData.totalImpressions * 100).toFixed(2);
    }
    if (pointData.totalClicks > 0) {
      pointData.avgConversion = (pointData.totalInquiries / pointData.totalClicks * 100).toFixed(2);
    }

    // 根据效果更新优先级
    pointData.priority = calculatePriority(pointData);
  }

  fs.writeFileSync(TRACKING_FILE, JSON.stringify(trackingData, null, 2));

  return true;
}

/**
 * 获取覆盖度报告
 * @returns {Object} - 覆盖度报告
 */
function getCoverageReport() {
  initTracking();

  const trackingData = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));

  // 统计总数
  const totalArticles = trackingData.articles.length;

  // 计算各卖点的相对覆盖度
  const report = {
    summary: {
      totalArticles,
      totalSellingPoints: Object.keys(trackingData.sellingPoints).length
    },
    sellingPoints: [],
    recommendations: []
  };

  // 计算最大文章数（用于计算相对覆盖度）
  const maxArticles = Math.max(
    ...Object.values(trackingData.sellingPoints).map(p => p.articleCount),
    1
  );

  for (const [id, pointData] of Object.entries(trackingData.sellingPoints)) {
    const relativeCoverage = (pointData.articleCount / maxArticles * 100).toFixed(0);
    const status = getCoverageStatus(relativeCoverage);

    report.sellingPoints.push({
      ...pointData,
      relativeCoverage,
      status
    });
  }

  // 生成推荐
  report.recommendations = generateRecommendations(report.sellingPoints);

  return report;
}

/**
 * 获取卖点覆盖度可视化（Markdown 格式）
 * @returns {string} - Markdown 格式的覆盖度报告
 */
function getCoverageMarkdown() {
  const report = getCoverageReport();
  const date = new Date().toLocaleDateString('zh-CN');

  let md = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Kingsway 卖点覆盖度报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【更新时间】${date}

【总览】总文章数 ${report.summary.totalArticles} 篇 | 卖点数 ${report.summary.totalSellingPoints} 个

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;
  // 卖点表格
  md += `┌────────────────────┬────────┬────────┬──────────────────┬────────┬────────┐
│ 卖点                │ 文章数 │ 覆盖率 │ 转化率(CTR)      │ 平台   │ 状态   │
├────────────────────┼────────┼────────┼──────────────────┼────────┼────────┤\n`;

  for (const point of report.sellingPoints) {
    const statusEmoji = {
      'excellent': '🟢',
      'good': '🟡',
      'needs_improvement': '🟠',
      'low': '🔴'
    };

    const platformStr = Object.entries(point.platforms)
      .filter(([_, count]) => count > 0)
      .map(([platform, count]) => `${platform}:${count}`)
      .join(' ') || '-';

    const ctr = point.avgCTR || '-';
    const conversion = point.avgConversion ? `(${point.avgConversion}%)` : '';

    md += `│ ${point.name.padEnd(20)} │ ${String(point.articleCount).padStart(6)} │ ${String(point.relativeCoverage + '%').padStart(6)} │ ${String(ctr).padEnd(16)}${conversion} │ ${platformStr.padEnd(6)} │ ${statusEmoji[point.status]} ${getStatusText(point.status)} │\n`;
  }

  md += `└────────────────────┴────────┴────────┴──────────────────┴────────┴────────┘\n\n`;

  // 平台覆盖度
  md += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 平台覆盖度

| 平台 | 视频独立站 | 询盘按钮 | AI翻译 | CDN加速 |
|------|-----------|---------|--------|---------|\n`;

  const platforms = ['google', 'baidu', 'zhihu', 'csdn'];
  for (const platform of platforms) {
    const row = [`  ${platform}`];
    for (const point of report.sellingPoints) {
      const count = point.platforms[platform] || 0;
      row.push(count > 0 ? `${count}` : '-');
    }
    md += `|${row.join('|')}|\n`;
  }

  // 推荐部分
  md += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 内容建议\n`;

  if (report.recommendations.length === 0) {
    md += `各卖点覆盖较为均衡，可以继续保持当前策略。\n`;
  } else {
    for (const rec of report.recommendations) {
      md += `\n【${rec.priority === 'high' ? '高优先级' : '建议'}】${rec.sellingPoint}\n`;
      md += `   理由: ${rec.reason}\n`;
      md += `   当前: ${rec.current}\n`;
      md += `   建议: ${rec.suggestion}\n`;
    }
  }

  md += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  return md;
}

/**
 * 获取空白卖点（覆盖度最低的）
 * @param {number} limit - 返回数量
 * @returns {Array} - 空白卖点列表
 */
function getGaps(limit = 3) {
  const report = getCoverageReport();
  const gaps = report.sellingPoints
    .filter(p => p.status === 'low' || p.status === 'needs_improvement')
    .sort((a, b) => a.articleCount - b.articleCount)
    .slice(0, limit);

  return gaps.map(g => ({
    sellingPointId: g.id,
    name: g.name,
    articleCount: g.articleCount,
    priority: g.priority,
    reason: g.articleCount === 0 ? '完全空白' : '覆盖度较低'
  }));
}

/**
 * 获取高转化卖点（用于选题推荐）
 * @returns {Array} - 高转化卖点列表
 */
function getHighConvertingPoints() {
  const report = getCoverageReport();
  return report.sellingPoints
    .filter(p => parseFloat(p.avgConversion) > 3) // 转化率 > 3%
    .sort((a, b) => parseFloat(b.avgConversion) - parseFloat(a.avgConversion));
}

// ===== 辅助函数 =====

/**
 * 生成文章ID
 */
function generateArticleId(article) {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const keywordShort = article.keyword ? article.keyword.substring(0, 8) : 'article';
  const random = Math.random().toString(36).substring(2, 5);
  return `kw-${dateStr}-${keywordShort}-${random}`;
}

/**
 * 计算覆盖度
 */
function calculateCoverage(pointData) {
  // 目标文章数（假设每个卖点至少需要 10 篇才算覆盖）
  const target = 10;
  return Math.min(Math.round(pointData.articleCount / target * 100), 100);
}

/**
 * 计算优先级
 */
function calculatePriority(pointData) {
  // 根据转化率和覆盖度计算优先级
  const conversion = parseFloat(pointData.avgConversion) || 0;
  const coverage = pointData.coverage;

  if (conversion > 5 && coverage < 50) {
    return 'high'; // 高转化但覆盖低，优先补充
  } else if (conversion > 3 && coverage < 70) {
    return 'medium';
  } else if (coverage < 30) {
    return 'high'; // 覆盖度太低，优先补充
  } else {
    return 'low';
  }
}

/**
 * 获取覆盖度状态
 */
function getCoverageStatus(coverage) {
  if (coverage >= 80) return 'excellent';
  if (coverage >= 60) return 'good';
  if (coverage >= 30) return 'needs_improvement';
  return 'low';
}

/**
 * 获取状态文本
 */
function getStatusText(status) {
  const texts = {
    'excellent': '优秀',
    'good': '良好',
    'needs_improvement': '需改善',
    'low': '空白'
  };
  return texts[status] || status;
}

/**
 * 生成推荐
 */
function generateRecommendations(sellingPoints) {
  const recommendations = [];

  // 1. 转化率高但覆盖度低的
  for (const point of sellingPoints) {
    const conversion = parseFloat(point.avgConversion) || 0;
    if (conversion > 5 && point.articleCount < 5) {
      recommendations.push({
        priority: 'high',
        sellingPoint: point.name,
        reason: `转化率高 (${conversion}%) 但文章数少 (${point.articleCount}篇)`,
        current: `覆盖率 ${point.relativeCoverage}%`,
        suggestion: '优先增加此卖点的内容，转化效果好'
      });
    }
  }

  // 2. 完全空白的卖点
  for (const point of sellingPoints) {
    if (point.articleCount === 0) {
      recommendations.push({
        priority: 'medium',
        sellingPoint: point.name,
        reason: '完全没有覆盖',
        current: '0 篇文章',
        suggestion: '至少发布 2-3 篇文章建立基础覆盖'
      });
    }
  }

  // 3. 平台空白
  for (const platform of ['google', 'baidu', 'zhihu', 'csdn']) {
    for (const point of sellingPoints) {
      if ((point.platforms[platform] || 0) === 0 && point.articleCount > 0) {
        recommendations.push({
          priority: 'medium',
          sellingPoint: `${point.name} (${platform})`,
          reason: `此卖点在 ${platform} 平台无覆盖`,
          current: '0 篇',
          suggestion: `将现有文章分发到 ${platform} 平台`
        });
      }
    }
  }

  return recommendations.slice(0, 5); // 最多返回5条
}

/**
 * 重置追踪数据（测试用）
 */
function resetTracking() {
  if (fs.existsSync(TRACKING_FILE)) {
    fs.unlinkSync(TRACKING_FILE);
  }
}

// 导出
module.exports = {
  initTracking,
  recordArticle,
  updatePerformance,
  getCoverageReport,
  getCoverageMarkdown,
  getGaps,
  getHighConvertingPoints,
  resetTracking
};

// 如果是直接运行，输出示例
if (require.main === module) {
  console.log("=== Kingsway 卖点追踪系统 ===\n");

  // 输出当前覆盖度
  console.log(getCoverageMarkdown());

  // 输出空白卖点
  const gaps = getGaps();
  if (gaps.length > 0) {
    console.log("\n需要补充的卖点:");
    for (const gap of gaps) {
      console.log(`  - ${gap.name}: ${gap.reason}`);
    }
  }
}
