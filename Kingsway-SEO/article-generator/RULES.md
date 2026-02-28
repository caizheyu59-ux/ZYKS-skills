# Kingsway-Promotion 使用规则与注意事项

> 最后更新：2026-02-03

---

## ⚙️ API 配置规则

### 1. Serper.dev API（Google 搜索）

| 配置项 | 值 |
|--------|-----|
| 端点 | `https://google.serper.dev/search` |
| 认证 | `X-API-KEY: {API_KEY}` |
| 请求频率 | 间隔 1 秒以上 |

### 2. 5118 API（中文关键词数据 - 海量长尾词挖掘 API v2）

| 配置项 | 值 |
|--------|-----|
| 端点 | `http://apis.5118.com/keyword/word/v2` |
| 认证 | `Authorization: {API_KEY}` ⚠️ **不带 "Bearer" 前缀** |
| 中文编码 | 必须使用 URL 编码（如 `%E8%A7%86%E9%A2%91`） |
| 等待时间 | 同步请求，返回即时结果 |

**5118 API 数据字段**：

| 字段 | 说明 | 用于评估 |
|------|------|----------|
| `keyword` | 长尾关键词 | 展示 |
| `index` | 流量指数（百度） | 搜索量评估 |
| `mobile_index` | 移动指数 | 移动端热度 |
| `douyin_index` | 抖音指数 | 抖音选题 |
| `long_keyword_count` | 长尾词数量 | 扩展潜力 |
| `bidword_company_count` | 竞价公司数量 | 竞争度 |
| `bidword_kwc` | 竞价竞争度（1高/2中/3低） | 难度评估 |
| `bidword_pcpv` | PC 日检索量 | 搜索量 |
| `bidword_wisepv` | 移动日检索量 | 搜索量 |
| `sem_price` | SEM 点击价格 | 商业价值 |

### 3. GeekAI API（图片生成）

| 配置项 | 值 |
|--------|-----|
| 端点 | `https://geekai.co/api/v1/images/generations` |
| 认证 | `Authorization: Bearer {API_KEY}` |
| 模型 | `nano-banana-2` |
| 支持尺寸 | 1K, 2K, 4K（仅限这三种） |
| 建议尺寸 | 1K（速度快，成功率高） |

---

## 📋 KGR 计算规则

```
KGR = Allintitle 数 ÷ (bidword_pcpv × 30)
```

| KGR 值 | 评级 | 说明 |
|--------|------|------|
| **0** | ⭐⭐⭐⭐⭐ 蓝海冠军 | Allintitle = 0，零竞争 |
| **< 0.01** | ⭐⭐⭐⭐⭐ 蓝海冠军 | 极低竞争 |
| **0.01 - 0.05** | ⭐⭐⭐⭐ 可尝试 | 低竞争 |
| **> 0.05** | ⭐⭐⭐ 竞争较大 | 需要评估 |

---

## 🎯 工作流规则

### SEO 推广完整流程

```
① keyword-research (SEO关键词研究) → ② competition-analyzer (竞争分析) → ③ title-generator (标题生成) → ④ article-writer (文章生成) → ⑤ article-illustrator (智能配图)
```

### 阶段①：keyword-research（SEO 关键词研究）

**输入**：核心关键词 + 目标平台/业务场景

**核心功能**：调用 5118 海量长尾词挖掘 API v2，获取真实的搜索数据并进行智能分析

**综合评分公式（满分 100）**：

```
搜索量得分（40分）：
  - 流量指数：min(index / 500 × 20, 20)
  - 移动指数：min(mobile_index / 500 × 10, 10)
  - 抖音指数：min(douyin_index / 100 × 10, 10)

竞争度得分（30分）：
  - bidword_kwc：1=0分, 2=15分, 3=30分

竞价公司惩罚（-10 ~ 0分）：
  - >100家公司：-10分
  - >50家公司：-5分
  - 其他：0分

商业价值加分（0 ~ 15分）：
  - SEM价格上限 × 3，最高15分

扩展潜力加分（0 ~ 5分）：
  - long_keyword_count / 100000 × 5，最高5分

总分 = 搜索量得分 + 竞争度得分 + 公司惩罚 + 商业价值 + 扩展潜力
```

**智能标签系统**：

| 标签 | 判断条件 | 含义 |
|------|----------|------|
| ⭐ **蓝海词** | 竞争度=低(3) 且 公司<30 且 index>50 | 机会大，优先做 |
| 🔥 **高流量** | index > 500 或 mobile_index > 500 | 搜索量大 |
| 💰 **高商业** | sem_price 上限 > 3 | 商业价值高 |
| 📱 **移动热** | mobile_index > index | 移动端更热 |
| 🎵 **抖音机会** | douyin_index > 100 | 抖音有流量 |
| 🌱 **长尾丰富** | long_keyword_count > 10000 | 可继续挖掘 |

### 阶段②：competition-analyzer（竞争分析）

**四层 SERP 诊断**：

1. **Layer 1** - 意图特征：搜索意图识别
2. **Layer 2** - 竞品短板：Top 3 链接痛点分析
3. **Layer 3** - 转化盲区：信任建立失败点
4. **Layer 4** - 降维打击：Kingsway 功能如何解决

### 阶段③：title-generator（标题生成）

**5 种标题类型**：

| 类型 | 模板 |
|------|------|
| 截流词 | `{关键词}不用下载：浏览器也能搞定？` |
| 转化痛点 | `{关键词}带询盘功能：完整指南` |
| 场景词 | `广交会{关键词}怎么做？48小时紧急方案` |
| 竞品缺陷 | `为什么别用第三方平台{关键词}？` |
| 品牌化 | `无水印{关键词}：专业指南 2026` |

### 阶段④：article-writer（文章生成）

**7 种文章风格**：

| 风格 | 名称 | 口吻特点 | 配图 Type | 配图 Style |
|:----:|------|----------|-----------|------------|
| **A** | 评测/对比类 | 客观中立评测口吻 | comparison | blueprint |
| **B** | 教程/指南类 | 口语化教程口吻 | flowchart | notion |
| **C** | 问题解决/避坑指南类 | 紧迫感 + 实用感 | timeline | warm |
| **D** | 权威指南/完整手册类 | 专业严谨 | infographic | elegant |
| **E** | 案例/成功故事类 | 故事化叙事口吻 | infographic | blueprint |
| **F** | 新闻/趋势分析类 | 客观分析口吻 | infographic | blueprint |
| **G** | 商业/转化类 | 转化导向 | comparison | notion |

### 阶段⑤：article-illustrator（文章配图）

**功能**：分析文章结构，生成专业插图

**Type × Style 体系**：

- Type：infographic, scene, flowchart, comparison, framework, timeline
- Style：notion, elegant, warm, minimal, blueprint, watercolor, editorial, scientific

**Kingsway 文章风格自动映射**：

| 文章风格 | 配图 Type | 配图 Style |
|:--------:|-----------|------------|
| **A** | comparison | blueprint |
| **B** | flowchart | notion |
| **C** | timeline | warm |
| **D** | infographic | elegant |
| **E/F** | infographic | blueprint |
| **G** | comparison | notion |

---

## 🚫 禁止事项

### API 使用禁忌
1. ❌ 5118 API 不要加 "Bearer" 前缀
2. ❌ 5118 API 中文必须 URL 编码
3. ❌ 不要频繁请求 Serper.dev（间隔 < 1 秒）
4. ❌ GeekAI 使用 2K/4K 容易超时，建议用 1K

### 内容创作禁忌
1. ❌ 不要生成过于通用、缺乏具体数据的文章
2. ❌ 不要使用"首先、其次、再次、最后"等过渡词
3. ❌ 不要使用四字成语（如"得天独厚"、"无与伦比"）
4. ❌ 不要用抽象描述（"高效"、"便捷"、"优质"）

### 配图创作禁忌
1. ❌ 不要生成与文章主题不符的配图
2. ❌ 不要在配图中添加过多文字
3. ❌ 不要忘记添加水印（商业文章必须）
4. ❌ 不要使用低分辨率图片
5. ❌ **不要在配图中使用英文文字 - 所有文字、标签、注释必须使用中文**

---

## 📚 参考文档

- [EXTEND.md](./EXTEND.md) - 主配置文件
- [references.md](./references.md) - Kingsway 产品参考文档
- [SKILL.md](./SKILL.md) - 技能主文档
- [商业文章写作风格提取器.md](./商业文章写作风格提取器.md) - 商业文案风格参考

---

## 📝 更新日志

- **2026-02-03**: 升级长尾词生成功能为 keyword-research，集成 5118 海量长尾词挖掘 API v2，新增综合评分系统和智能标签系统
