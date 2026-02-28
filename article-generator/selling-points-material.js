/**
 * Kingsway 卖点素材库
 *
 * 每个卖点包含：
 * - id: 卖点唯一标识
 * - name: 卖点名称
 * - tagline: 卖点标语
 * - painPoints: 痛点话术
 * - benefits: 利益点话术
 * - proofPoints: 证明数据/案例
 * - templates: 标题模板
 * - keywords: 相关关键词（用于识别）
 * - style: 推荐的文章风格
 */

const sellingPoints = {
  // 卖点 1: 视频托管
  video_hosting: {
    id: "video_hosting",
    name: "视频托管",
    tagline: "全球安全、高效、流畅、稳定播放，无广告、无平台限制",
    englishTagline: "Video Hosting - Global, Secure, High-Performance",

    painPoints: [
      "视频在 YouTube 播放有限制，经常被误判",
      "第三方平台有广告，影响品牌形象",
      "视频加载不稳定，客户体验差",
      "平台会删除或限制内容，业务风险大",
      "无法保证视频长期稳定播放"
    ],

    benefits: [
      "全球 CDN 覆盖，海外访问速度提升 300%",
      "99.9% 可用性保证，视频稳定播放",
      "无广告干扰，专业品牌形象",
      "完全自主控制，不依赖第三方平台",
      "支持 4K 高清视频，展示效果更佳"
    ],

    proofPoints: [
      {
        type: "case",
        industry: "机电企业",
        result: "月均播放量从 0 到 50 万+",
        detail: "某机电企业使用 Kingsway 视频托管后，海外客户访问速度提升 300%，月均播放量突破 50 万，品牌展示效果显著提升"
      },
      {
        type: "case",
        industry: "建材公司",
        result: "视频播放成功率 99.9%",
        detail: "全球 50+ 国家客户均可流畅访问，展会现场演示不再卡顿，客户满意度提升 90%"
      },
      {
        type: "spec",
        metric: "访问速度",
        data: "全球 CDN 覆盖，海外访问速度提升 300%"
      },
      {
        type: "pricing",
        data: "$49/月起，比自建服务器便宜 90%"
      }
    ],

    // 关键词映射规则（用于识别）
    keywords: {
      primary: ["视频托管", "视频存储", "视频播放", "CDN", "无广告"],
      secondary: ["视频加速", "视频分发", "视频平台", "企业视频", "专业视频"],
      intent: ["托管", "播放", "存储", "分发"]
    },

    // 标题模板
    templates: {
      google: [
        "Video Hosting Solutions for B2B Companies 2026",
        "Why Choose Kingsway Over YouTube for Business Videos",
        "Global Video Hosting: Fast, Secure, Ad-Free"
      ],
      baidu: [
        "外贸视频托管：为什么选择独立平台而不是YouTube？",
        "企业级视频托管：无广告、无限制、更稳定",
        "全球CDN视频托管：让海外客户更快访问"
      ],
      zhihu: [
        "外贸视频托管应该选什么平台？Kingsway深度测评",
        "为什么说YouTube不适合B2B企业视频托管？",
        "企业视频托管：如何避免平台限制风险？"
      ],
      csdn: [
        "[技术方案] 企业视频托管架构设计与实现",
        "全球CDN视频分发系统技术对比",
        "视频托管平台选型：自建 vs SaaS"
      ]
    },

    // 文章风格推荐
    style: "D", // 权威指南/完整手册类

    // 竞品对比素材
    competitors: {
      youtube: {
        strengths: ["免费", "流量大", "知名度高"],
        weaknesses: ["有限制", "有广告", "不稳定", "SEO权重归平台"],
        positioning: "适合内容分享，不适合专业B2B业务"
      },
      vimeo: {
        strengths: ["专业形象", "无广告", "质量高"],
        weaknesses: ["价格高", "速度慢", "国内访问差"],
        positioning: "适合创意展示，不适合国际业务"
      },
      selfhosted: {
        strengths: ["完全自主", "无月费"],
        weaknesses: ["成本高", "需要技术", "维护复杂"],
        positioning: "适合大企业，性价比低"
      }
    }
  },

  // 卖点 2: 视频SEO
  video_seo: {
    id: "video_seo",
    name: "视频SEO",
    tagline: "视频结构化数据，Google索引标准，视频站点地图",
    englishTagline: "Video SEO - Structured Data, Google Index Standards",

    painPoints: [
      "视频放在 YouTube，SEO 权重是平台的，不是你的",
      "视频内容很难进入官网搜索结果",
      "视频流量无法转化为官网流量",
      "视频缺少结构化数据，搜索引擎无法理解",
      "没有视频站点地图，收录效率低"
    ],

    benefits: [
      "视频结构化数据，符合 Google 索引标准",
      "专属视频站点地图，提升收录效率",
      "视频 SEO 权重 100% 归属你的域名",
      "视频内容进入官网搜索结果",
      "视频流量带动整体 SEO 提升"
    ],

    proofPoints: [
      {
        type: "case",
        industry: "机电企业",
        result: "6 个月，视频流量从 0 到 10 万/月",
        detail: "某机电企业使用 Kingsway 视频 SEO 后，6 个月内视频独立站月流量达到 10 万，带动主官网排名提升 300%"
      },
      {
        type: "case",
        industry: "建材公司",
        result: "搜索'工业传感器选型'排名从第 18 名提升到第 8 名",
        detail: "通过视频 SEO 优化，视频内容进入搜索结果，品牌关键词排名显著提升，询盘量增加 150%"
      },
      {
        type: "spec",
        metric: "收录效率",
        data: "视频站点地图，收录速度提升 5 倍"
      },
      {
        type: "comparison",
        metric: "SEO效果",
        data: "Kingsway 独立站的 SEO 效果是 YouTube 嵌入的 5-10 倍"
      }
    ],

    keywords: {
      primary: ["视频SEO", "视频排名", "结构化数据", "视频收录"],
      secondary: ["Google索引", "视频站点地图", "搜索排名", "权重"],
      intent: ["SEO", "优化", "排名", "收录"]
    },

    templates: {
      google: [
        "Video SEO for B2B Companies: Complete Guide 2026",
        "How to Rank Your Videos on Google Search",
        "Video SEO: Structured Data Standards for Business"
      ],
      baidu: [
        "视频SEO怎么做？结构化数据助力搜索排名",
        "视频站点地图：让Google更快收录你的视频",
        "B2B企业视频SEO：从权重到流量的转化"
      ],
      zhihu: [
        "视频SEO优化：为什么独立站视频比YouTube更容易排名？",
        "Google视频搜索排名：结构化数据的重要性",
        "B2B企业的视频SEO策略与实践"
      ],
      csdn: [
        "[SEO] 视频搜索引擎优化技术详解",
        "视频结构化数据：Schema.org标准实现",
        "视频站点地图生成与优化策略"
      ]
    },

    style: "A", // 深度评测/对比类

    competitors: {
      youtube: {
        strengths: ["流量大", "生态完善"],
        weaknesses: ["SEO权重归平台", "竞争激烈"],
        positioning: "适合品牌曝光，不适合SEO"
      },
      vimeo: {
        strengths: ["专业", "用户质量高"],
        weaknesses: ["流量小", "SEO效果差"],
        positioning: "适合展示，不适合获客"
      }
    }
  },

  // 卖点 3: 视频线索生成
  video_lead_generation: {
    id: "video_lead_generation",
    name: "视频获客",
    tagline: "视频内嵌询盘表单，WhatsApp/微信/邮箱集成",
    englishTagline: "Video Lead Generation - Embedded Forms Integration",

    painPoints: [
      "客户看完视频后找不到联系方式",
      "询盘流程长，客户容易流失",
      "传统网站转化率只有 1-2%",
      "展会现场无法及时获取客户信息",
      "缺少多渠道联系方式，影响转化"
    ],

    benefits: [
      "视频播放时直接弹出询盘表单",
      "支持 WhatsApp、微信、邮箱等多种联系方式",
      "客户无需离开视频页面，一步完成转化",
      "24 小时自动获客，不受时差限制",
      "转化率提升 300%，远高于行业平均水平"
    ],

    proofPoints: [
      {
        type: "case",
        industry: "机械制造",
        result: "转化率从 2% 提升到 8%",
        detail: "某机械公司将产品介绍视频加入询盘按钮后，转化率从传统的 2% 提升到 8%，单月询盘量增加 300%"
      },
      {
        type: "case",
        industry: "电子厂",
        result: "单月询盘从 12 条增加到 48 条",
        detail: "使用内嵌询盘按钮后，客户无需离开视频页面即可询盘，单月有效询盘量从 12 条增加到 48 条"
      },
      {
        type: "case",
        industry: "展会营销",
        result: "展会期间收获 1,487 个有效询盘",
        detail: "在展会现场展示的产品视频中加入询盘功能，展商通过扫码观看视频即可询盘，3天展会收获 1,487 个有效询盘"
      },
      {
        type: "comparison",
        metric: "转化率",
        data: "Kingsway转化率提升300%，高于行业平均"
      }
    ],

    keywords: {
      primary: ["询盘", "线索", "转化", "获客", "表单"],
      secondary: ["内嵌询盘", "视频获客", "自动询盘", "多渠道", "WhatsApp"],
      intent: ["获客", "转化", "线索", "询盘"]
    },

    templates: {
      google: [
        "Video Lead Generation: Complete Guide 2026",
        "How to Get Leads from Product Videos",
        "In-Video Inquiry Forms for B2B Conversion"
      ],
      baidu: [
        "视频内嵌询盘：转化率提升300%的秘诀",
        "外贸视频获客：多渠道联系方式，效果翻倍",
        "展会视频营销：让客户主动联系你"
      ],
      zhihu: [
        "视频如何获取线索？内嵌询盘表的奥秘",
        "视频转化率这么低？试试这个方法",
        "B2B企业视频获客：从看到联系一步到位"
      ],
      csdn: [
        "[前端] 视频播放器嵌入询盘表单实现",
        "视频线索生成系统技术架构",
        "多渠道联系方式集成方案"
      ]
    },

    style: "G", // 商业文章/转化类

    competitors: {
      traditional: {
        strengths: ["通用", "稳定"],
        weaknesses: ["转化率低", "流程复杂"],
        positioning: "传统方式，效果差"
      },
      youtube: {
        strengths: ["流量大", "免费"],
        weaknesses: ["无法直接转化", "限制多"],
        positioning: "适合曝光，不适合获客"
      }
    }
  },

  // 卖点 4: 视频翻译
  video_translation: {
    id: "video_translation",
    name: "视频翻译",
    tagline: "一键生成多国语言配音，智能匹配同步字幕",
    englishTagline: "Video Translation - One-Click Multi-Language Dubbing",

    painPoints: [
      "传统翻译周期长，成本高",
      "翻译不准确，影响专业性",
      "语言障碍限制市场拓展",
      "需要多语言版本展示给不同客户",
      "人工翻译无法快速响应需求"
    ],

    benefits: [
      "一键生成多国语言配音",
      "智能匹配同步字幕，唇形同步",
      "支持多种语言，覆盖全球市场",
      "比人工翻译成本低 90%",
      "翻译速度快，48 小时内完成"
    ],

    proofPoints: [
      {
        type: "case",
        industry: "跨境电商",
        result: "48 小时完成 20+ 产品视频翻译",
        detail: "某跨境电商企业使用 Kingsway 视频翻译功能，48 小时内完成了 20+ 产品视频的多语言翻译，覆盖 10+ 国家市场"
      },
      {
        type: "case",
        industry: "B2B外贸",
        result: "询盘量增长 150%",
        detail: "通过视频翻译功能，企业向不同语言客户展示产品，询盘量增长 150%，业务拓展到 8 个新国家"
      },
      {
        type: "spec",
        metric: "语言支持",
        data: "支持 100+ 种语言字幕，30+ 种语言配音"
      },
      {
        type: "pricing",
        data: "比人工翻译便宜 90%，翻译速度快 10 倍"
      }
    ],

    keywords: {
      primary: ["翻译", "配音", "多语言", "字幕", "国际化"],
      secondary: ["视频翻译", "语言切换", "多语言版本", "字幕同步", "全球市场"],
      intent: ["翻译", "多语言", "国际化", "配音"]
    },

    templates: {
      google: [
        "Video Translation: Complete Guide 2026",
        "How to Translate Videos for Global Markets",
        "AI vs Human Video Translation: Cost Comparison"
      ],
      baidu: [
        "视频翻译：一键生成多国语言，业务不再受语言限制",
        "外贸企业必看：视频翻译如何拓展全球市场",
        "低成本多语言视频：翻译价格只有人工的1/10"
      ],
      zhihu: [
        "视频翻译：AI配音是否靠谱？实测效果分享",
        "跨境电商如何突破语言障碍？视频翻译解决方案",
        "多语言视频营销：让你的产品走向世界"
      ],
      csdn: [
        "[AI技术] 视频翻译技术实现方案",
        "多语言视频处理：配音与字幕同步算法",
        "视频国际化：多语言支持架构设计"
      ]
    },

    style: "B", // 解决方案/教程类

    competitors: {
      human: {
        strengths: ["准确率高", "质量好"],
        weaknesses: ["价格高", "周期长", "效率低"],
        positioning: "适合高质量要求的场景"
      },
      other_ai: {
        strengths: ["便宜"],
        weaknesses: ["翻译质量差", "不专业"],
        positioning: "简单翻译需求，不专业场景"
      }
    }
  },

  // 卖点 5: 视频独立站
  video_standalone_site: {
    id: "video_standalone_site",
    name: "视频独立站",
    tagline: "支持自有域名搭建视频独立站",
    englishTagline: "Video Standalone Site - Custom Domain Support",

    painPoints: [
      "视频放在第三方平台，SEO权重归平台",
      "无法使用自有域名，品牌形象不统一",
      "平台会推荐竞品，抢走客户",
      "视频资产无法私有化",
      "难以建立完整的品牌生态系统"
    ],

    benefits: [
      "支持自有域名搭建，品牌形象统一",
      "视频 SEO 权重 100% 归属你的域名",
      "视频资产私有化，长期积累价值",
      "不推荐竞品，客户只记住你",
      "完整的企业级视频解决方案"
    ],

    proofPoints: [
      {
        type: "case",
        industry: "机电企业",
        result: "6 个月，视频流量从 0 到 10 万/月",
        detail: "某机电企业使用 Kingsway 视频独立站后，6 个月内视频独立站月流量达到 10 万，带动主官网排名提升 300%"
      },
      {
        type: "case",
        industry: "建材公司",
        result: "搜索'工业传感器选型'排名提升 10 位",
        detail: "通过视频独立站优化，品牌关键词搜索排名显著提升，询盘量增加 150%"
      },
      {
        type: "spec",
        metric: "域名支持",
        data: "支持所有自定义域名，品牌统一"
      },
      {
        type: "comparison",
        metric: "SEO效果",
        data: "独立站视频SEO效果是 YouTube 嵌入的 5-10 倍"
      }
    ],

    keywords: {
      primary: ["独立站", "域名", "品牌", "SEO", "私有化"],
      secondary: ["自有域名", "品牌统一", "视频网站", "企业站点"],
      intent: ["搭建", "建站", "域名", "品牌"]
    },

    templates: {
      google: [
        "Video Standalone Site: Complete Guide for B2B 2026",
        "Why Your Video Hosting Strategy is Hurting SEO",
        "Kingsway Video Hosting: Better Than YouTube for Business"
      ],
      baidu: [
        "外贸视频独立站：为什么比YouTube更适合B2B企业？",
        "自有域名视频站点：品牌形象统一",
        "视频独立站SEO：权重100%归你的"
      ],
      zhihu: [
        "外贸视频托管：独立站 vs YouTube，怎么选？",
        "为什么企业应该选择视频独立站？",
        "视频独立站：让视频成为你的资产"
      ],
      csdn: [
        "[技术方案] 视频独立站架构设计",
        "自有域名视频站点搭建技术方案",
        "视频网站SEO优化实践"
      ]
    },

    style: "D", // 权威指南/完整手册类

    competitors: {
      youtube: {
        strengths: ["免费", "流量大", "知名度高"],
        weaknesses: ["SEO权重归平台", "推荐竞品", "有广告"],
        positioning: "适合流量曝光，不适合品牌建设"
      },
      vimeo: {
        strengths: ["专业形象", "无广告"],
        weaknesses: ["价格高", "不支持自有域名", "流量小"],
        positioning: "适合创意展示，不适合商业用途"
      },
      selfhosted: {
        strengths: ["完全自主", "无月费"],
        weaknesses: ["成本高", "需要技术团队", "维护复杂"],
        positioning: "适合大企业，性价比低"
      }
    }
  }
};

/**
 * 根据关键词识别卖点
 * @param {string} keyword - 输入的长尾词
 * @returns {Object|null} - 匹配的卖点对象，如果无匹配返回 null
 */
function identifySellingPoint(keyword) {
  const keywordLower = keyword.toLowerCase();

  // 计算每个卖点的匹配分数
  const scores = {};

  for (const [pointId, point] of Object.entries(sellingPoints)) {
    let score = 0;

    // 主关键词匹配（权重最高）
    for (const primary of point.keywords.primary) {
      if (keywordLower.includes(primary)) {
        score += 10;
      }
    }

    // 次要关键词匹配
    for (const secondary of point.keywords.secondary) {
      if (keywordLower.includes(secondary)) {
        score += 5;
      }
    }

    // 意图词匹配
    for (const intent of point.keywords.intent) {
      if (keywordLower.includes(intent)) {
        score += 3;
      }
    }

    // 采购意图词加分（软件/工具/平台）
    if (keywordLower.includes("软件") || keywordLower.includes("工具") ||
        keywordLower.includes("平台") || keywordLower.includes("solution")) {
      score += 2;
    }

    if (score > 0) {
      scores[pointId] = score;
    }
  }

  // 返回分数最高的卖点
  if (Object.keys(scores).length === 0) {
    return null;
  }

  const bestMatchId = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  return {
    id: bestMatchId,
    point: sellingPoints[bestMatchId],
    score: scores[bestMatchId],
    confidence: Math.min(scores[bestMatchId] / 15 * 100, 100).toFixed(0)
  };
}

/**
 * 获取卖点的标题模板
 * @param {string} pointId - 卖点ID
 * @param {string} platform - 平台 (google/baidu/zhihu/csdn)
 * @returns {Array<string>} - 标题模板列表
 */
function getTitleTemplates(pointId, platform = "baidu") {
  const point = sellingPoints[pointId];
  if (!point) {
    return [];
  }
  return point.templates[platform] || point.templates.baidu || [];
}

/**
 * 根据平台获取推荐的文章风格
 * @param {string} pointId - 卖点ID
 * @param {string} platform - 平台
 * @returns {string} - 风格代码 (A-G)
 */
function getRecommendedStyle(pointId, platform) {
  const point = sellingPoints[pointId];
  if (!point) {
    return "G"; // 默认商业转化类
  }

  // 某些平台可能需要不同风格
  if (platform === "zhihu" && point.style === "G") {
    return "E"; // 知乎更适合案例故事类
  }
  if (platform === "csdn") {
    return "A"; // CSDN 适合评测对比类
  }

  return point.style;
}

/**
 * 获取所有卖点列表（用于覆盖度分析）
 * @returns {Array} - 卖点列表
 */
function getAllSellingPoints() {
  return Object.entries(sellingPoints).map(([id, point]) => ({
    id,
    name: point.name,
    tagline: point.tagline
  }));
}

/**
 * 获取卖点素材（用于文章生成）
 * @param {string} pointId - 卖点ID
 * @returns {Object} - 卖点素材
 */
function getSellingPointMaterial(pointId) {
  return sellingPoints[pointId] || null;
}

// 导出供外部使用
module.exports = {
  sellingPoints,
  identifySellingPoint,
  getTitleTemplates,
  getRecommendedStyle,
  getAllSellingPoints,
  getSellingPointMaterial
};

// 如果是直接运行，输出示例
if (require.main === module) {
  console.log("=== Kingsway 卖点识别测试 ===\n");

  const testKeywords = [
    "视频翻译软件",
    "视频托管在哪里",
    "询盘功能",
    "视频CDN加速",
    "外贸获客",
    "视频独立站SEO"
  ];

  for (const keyword of testKeywords) {
    const result = identifySellingPoint(keyword);
    if (result) {
      console.log(`"${keyword}"`);
      console.log(`  → 匹配卖点: ${result.point.name}`);
      console.log(`  → 置信度: ${result.confidence}%`);
      console.log(`  → 推荐风格: ${getRecommendedStyle(result.id, 'baidu')}`);
      console.log();
    } else {
      console.log(`"${keyword}" → 未匹配到卖点\n`);
    }
  }
}