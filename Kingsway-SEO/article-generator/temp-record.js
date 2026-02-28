const { recordArticle } = require('./selling-point-tracker.js');

const articleData = {
  title: "视频也能直接询盘？转化率提升300%的秘密武器",
  keyword: "外贸获客",
  sellingPointId: "inquiry_button",
  platform: "baidu",
  style: "G",
  createdAt: new Date().toISOString()
};

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📝 记录文章到卖点追踪系统');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('文章信息：');
console.log('  标题: ' + articleData.title);
console.log('  关键词: ' + articleData.keyword);
console.log('  卖点ID: ' + articleData.sellingPointId);
console.log('  平台: ' + articleData.platform);
console.log('  风格: ' + articleData.style);
console.log('  创建时间: ' + articleData.createdAt);
console.log('');

const articleId = recordArticle(articleData);

console.log('');
console.log('✅ 记录完成！');
console.log('  文章ID: ' + articleId);
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 获取覆盖度报告
const { getCoverageMarkdown } = require('./selling-point-tracker.js');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 卖点覆盖度报告（更新后）');
console.log('');
console.log(getCoverageMarkdown());
