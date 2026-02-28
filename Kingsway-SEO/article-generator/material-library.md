# Kingsway SEO 文章素材库

> 存储已生成的 SEO 文章内容，支持复用和历史检索

---

## 文章记录格式

每条记录包含以下字段：

```json
{
  "id": "唯一ID",
  "keyword": "核心关键词",
  "platform": "目标平台（baidu/google/xiaohongshu/toutiao）",
  "title": "文章标题",
  "style": "文章风格（A/B/C/D/E/F/G）",
  "sellingPoint": "卖点ID",
  "generatedAt": "生成时间（ISO格式）",
  "content": "文章内容摘要",
  "status": "available/reused/deprecated"
}
```

---

## 历史记录

### 视频翻译相关

```json
[
  {
    "id": "ART-20260226-001",
    "keyword": "视频翻译软件",
    "platform": "baidu",
    "title": "视频也能直接询盘？转化率提升300%的秘密武器",
    "style": "G",
    "sellingPoint": "inquiry_button",
    "generatedAt": "2026-02-26T10:30:00Z",
    "content": "介绍视频内嵌询盘表单功能，解决传统视频播放后客户流失的问题",
    "status": "available"
  },
  {
    "id": "ART-20260226-002",
    "keyword": "视频翻译",
    "platform": "google",
    "title": "外贸视频一键翻译多语言：48小时搞定100条视频",
    "style": "C",
    "sellingPoint": "ai_translation",
    "generatedAt": "2026-02-26T14:20:00Z",
    "content": "介绍AI视频翻译功能，支持20+语言，展会前紧急翻译服务",
    "status": "available"
  }
]
```

### 视频托管相关

```json
[
  {
    "id": "ART-20260225-001",
    "keyword": "外贸视频托管",
    "platform": "google",
    "title": "外贸视频托管 vs YouTube：B2B获客效果差太远",
    "style": "A",
    "sellingPoint": "video_hosting",
    "generatedAt": "2026-02-25T09:15:00Z",
    "content": "对比分析第三方平台与私域托管在SEO权重、品牌曝光、转化率方面的差异",
    "status": "reused"
  }
]
```

### 视频获客相关

```json
[
  {
    "id": "ART-20260224-001",
    "keyword": "外贸获客",
    "platform": "baidu",
    "title": "广交会视频营销24小时获客方案",
    "style": "G",
    "sellingPoint": "trade_show_marketing",
    "generatedAt": "2026-02-24T16:45:00Z",
    "content": "介绍展会场景下如何使用视频获客，含1,487个询盘真实案例",
    "status": "available"
  },
  {
    "id": "ART-20260224-002",
    "keyword": "视频获客",
    "platform": "google",
    "title": "外贸视频获客5大方法，让你的产品视频带来更多询盘",
    "style": "B",
    "generatedAt": "2026-02-24T18:30:00Z",
    "content": "综合介绍视频获客的多种方法和策略",
    "status": "available"
  }
]
```

### 视频SEO相关

```json
[
  {
    "id": "ART-20260223-001",
    "keyword": "视频SEO",
    "platform": "google",
    "title": "视频SEO权重100%归你所有：别把视频资产送给第三方",
    "style": "D",
    "generatedAt": "2026-02-23T11:20:00Z",
    "content": "解释私域托管与第三方平台在SEO权重上的差异，强调100%归自己的重要性",
    "status": "available"
  }
]
```

---

## 素材库使用方法

### 检索条件

当用户输入关键词时，优先检索以下匹配：

1. **完全匹配**：关键词完全相同
2. **包含匹配**：关键词被其他词包含
3. **相似匹配**：关键词语义相近

### 复用建议

如果检索到相关内容，按以下优先级建议复用：

| 优先级 | 条件 | 建议 |
|:-------|:-----|:-----|
| 高 | 关键词完全相同 + 平台相同 + 最近30天生成 | 直接复用，输出完整文章内容 |
| 中 | 关键词包含/相似 + 平台相同 | 参考复用，建议可适度修改标题和内容 |
| 低 | 关键词相关但平台不同 | 仅作参考，生成新内容 |

### 检索输出格式

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 素材库检索结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【输入关键词】{用户输入的关键词}

【目标平台】{baidu/google/xiaohongshu/toutiao}

【匹配结果】{找到 X 条相关记录 / 未找到相关内容}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 推荐复用文章：

【优先级】{高优先级 / 中优先级 / 低优先级}

【文章1】
- 标题：{title}
- 生成时间：{generatedAt}
- 平台：{platform}
- 状态：{status}

【文章2】
- 标题：{title}
- 生成时间：{generatedAt}
- 平台：{platform}
- 状态：{status}

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 复用建议：

{具体的复用建议和理由}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 状态说明

| 状态 | 说明 | 使用场景 |
|:-----|:-----|:---------|
| available | 可用，未被复用 | 默认状态，可以直接复用 |
| reused | 已复用，内容被重新使用 | 标记为复用后避免重复推荐 |
| deprecated | 已废弃，内容过时 | 不再推荐 |

---

## 维护建议

1. 每次生成新文章后，将记录添加到此文件末尾
2. 每次复用文章后，将对应记录状态更新为 `reused`
3. 定期清理 `deprecated` 状态的旧记录（保留最近 90 天）
4. 按关键词分组记录，便于快速检索
5. 每条记录保持 JSON 格式，便于解析和管理

---

## 快速参考： Kingsway 核心卖点 ID

| ID | 卖点名称 | 核心功能 |
|:--|:---------|:---------|
| inquiry_button | 视频内询盘按钮 | 视频获客 |
| ai_translation | AI 视频翻译 | 视频翻译 |
| video_hosting | 视频托管 | 视频托管 |
| video_seo | 视频 SEO | 视频 SEO |
| private_domain | 私有域名 | 视频独立站 |
| cdn_acceleration | CDN 加速 | 视频托管 |
| whatsapp_integration | WhatsApp 集成 | 视频获客 |
| trade_show_marketing | 展会营销 | 视频获客 |

---

**最后更新**：2026-02-27
