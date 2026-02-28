# Kingsway-Promotion API 调用说明

> 快速参考指南 - Serper.dev + 5118 (双API) + GeekAI

---

## 📋 API 汇总

| API | 用途 | 端点 | 认证 |
|-----|------|------|------|
| **Serper.dev** | Google Allintitle搜索 | `https://google.serper.dev/search` | `X-API-KEY: {KEY}` |
| **5118 长尾词挖掘** | 挖掘相关长尾词列表 | `http://apis.5118.com/keyword/word/v2` | `Authorization: {KEY}` |
| **5118 搜索量信息** | 获取关键词详细参数 | `http://apis.5118.com/keywordparam/v2` | `Authorization: {KEY}` |
| **GeekAI** | 图片生成 | `https://geekai.co/api/v1/images/generations` | `Bearer {KEY}` |

---

## 🔑 API Key 配置

```yaml
# Google Allintitle搜索（用于KGR计算）
Serper.dev:  3a46730d6df9fc9efc44a2fbced6ceff7e695f37

# 5118 海量长尾词挖掘 API v2（直接返回长尾词列表）
5118_WORD:   10286899240B4E299F9560E8C48E2569
端点:        http://apis.5118.com/keyword/word/v2
参数名:      keyword（单数）

# 5118 关键词搜索量信息 API v2（两步调用：提交→获取）
5118_PARAM:  EEF2A9EC12CF4EBDBF0059278ADCD8D0
端点:        http://apis.5118.com/keywordparam/v2
参数名:      keywords（复数）

# GeekAI 图片生成
GeekAI:      sk-N7KWrboFuff7F8KHTEPamqo0kyXdlnjdWt15N3Jyby5fWgjo
```

---

## 📖 快速使用

### 步骤1：挖掘长尾词列表

```bash
# 5118 长尾词挖掘 API（直接返回）
curl -X POST "http://apis.5118.com/keyword/word/v2" \
  -H "Authorization: 10286899240B4E299F9560E8C48E2569" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "keyword=视频翻译&page_size=5&sort_fields=4&sort_type=desc&filter=2"
```

### 步骤2：获取搜索量信息

```bash
# 5118 搜索量信息 API（两步调用）

# 第一步：提交关键词
SUBMIT_RESULT=$(curl -X POST "http://apis.5118.com/keywordparam/v2" \
  -H "Authorization: EEF2A9EC12CF4EBDBF0059278ADCD8D0" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "keywords=视频翻译软件|AI视频翻译|产品视频翻译")

# 提取 taskid
TASKID=$(echo "$SUBMIT_RESULT" | sed -n 's/.*"taskid":\([0-9]*\).*/\1/p')

# 第二步：等待3秒后获取结果
sleep 3
curl -X POST "http://apis.5118.com/keywordparam/v2" \
  -H "Authorization: EEF2A9EC12CF4EBDBF0059278ADCD8D0" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "taskid=$TASKID"
```

### 步骤3：获取 Allintitle（计算KGR）

```bash
# Serper.dev API
curl -X POST "https://google.serper.dev/search" \
  -H "X-API-KEY: 3a46730d6df9fc9efc44a2fbced6ceff7e695f37" \
  -H "Content-Type: application/json" \
  -d '{"q": "allintitle:\"视频翻译软件\""}'
```

### PowerShell

```powershell
cd "C:\Users\caizheyu\.claude\skills\Kingsway-Promotion"
. .\api-caller.ps1
Test-SingleKeyword -Keyword "视频翻译软件"
```

### Bash

```bash
cd ~/.claude/skills/Kingsway-Promotion
chmod +x api-caller.sh url-encode-helper.sh
./api-caller.sh single "视频翻译软件"
```

---

## 📊 KGR 计算公式

```
KGR = Allintitle 数 ÷ (bidword_pcpv × 30)
```

| KGR 值 | 评级 | 说明 |
|--------|------|------|
| 0 | ⭐⭐⭐⭐⭐ 蓝海冠军 | Allintitle = 0 |
| < 0.01 | ⭐⭐⭐⭐⭐ 蓝海冠军 | 极低竞争 |
| 0.01 - 0.05 | ⭐⭐⭐⭐ 可尝试 | 低竞争 |
| > 0.05 | ⭐⭐⭐ 竞争较大 | 需评估 |

---

## 🖼️ GeekAI 图片生成

### 基本信息

| 配置项 | 值 |
|--------|-----|
| **模型** | nano-banana-2 |
| **端点** | https://geekai.co/api/v1/images/generations |
| **支持尺寸** | 1K, 2K, 4K |
| **默认尺寸** | 2K |
| **输出格式** | JPEG/PNG |

### 请求示例

```bash
curl -X POST "https://geekai.co/api/v1/images/generations" \
  -H "Authorization: Bearer sk-N7KWrboFuff7F8KHTEPamqo0kyXdlnjdWt15N3Jyby5fWgjo" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nano-banana-2",
    "prompt": "Your prompt here",
    "size": "2K",
    "n": 1
  }'
```

### 响应格式

```json
{
  "model": "nano-banana-2",
  "created": 1769587441,
  "task_id": "...",
  "task_status": "succeed",
  "data": [{
    "url": "https://static.geekai.co/image/2026/01/28/..."
  }]
}
```

---

## ⚠️ 注意事项

### Serper.dev API
- 请求间隔 1 秒以上
- 免费额度有限

### 5118 API
- **必须使用 URL 编码**（中文）
- **不带 "Bearer" 前缀**，直接用 `Authorization: {KEY}`
- 多个关键词用 `|` 分隔
- 提交后等待 3-5 秒再获取结果

### GeekAI API
- nano-banana-2 仅支持 1K/2K/4K 尺寸
- 2K 图片生成需 20-30 秒
- 建议使用 1K 尺寸提高成功率

---

## 📚 参考文档

- [EXTEND.md](./EXTEND.md) - 主配置文件
- [RULES.md](./RULES.md) - 使用规则
- [references.md](./references.md) - Kingsway 产品参考
- [article-illustrator/](./article-illustrator/) - 文章配图功能
- [商业文章写作风格提取器.md](./商业文章写作风格提取器.md) - 风格参考

---

**更新日期**: 2026-01-28
