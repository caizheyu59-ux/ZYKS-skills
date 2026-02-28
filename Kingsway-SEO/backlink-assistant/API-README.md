# SEO Backlink Assistant API

## Overview
The SEO Backlink Assistant skill provides intelligent backlink recommendations for independent websites based on strict quality standards and Google guidelines.

## Usage

### Command Line Interface
```bash
/seo-backlink-assistant "我是做宠物用品独立站的，请给我5个外链机会"
```

### API Usage
```json
{
  "skill": "seo-backlink-assistant",
  "query": "我是做宠物用品独立站的，请给我5个外链机会"
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | User request including industry and number of backlinks needed |

## Output Format

The skill returns a structured Markdown response with:

1. **Strategy Overview**: Brief explanation of the recommendation strategy
2. **Individual Recommendations**: For each website:
   - Website name and URL
   - Website type (guest blog, industry forum, web 2.0, resource page)
   - SEO metrics (estimated DA/DR, link type)
   - Relevance explanation
   - Acquisition strategy
3. **Memory Update**: Code block with new domains to add to history

## Example Output

```
### 🔍 你的定制外链机会 (排除历史重复)
*(针对宠物用品行业的优质外链策略，重点关注宠物护理、用品评测和行业资讯类平台)*

**1. PetMD.com (https://www.petmd.com)**
* **网站类型**：行业权威网站 / 资源页
* **SEO指标**：预估 DA/DR：85 | 链接属性：Dofollow
* **推荐理由与相关性**：全球领先的宠物健康信息网站，DA>30，真实流量稳定，支持上下文链接，符合强相关性和权威度标准
* **获取策略**：提供专业的宠物护理内容，如"狗狗冬季护理指南"，以客座博主身份投稿

**1. Rover.com (https://www.rover.com)**
* **网站类型**：宠物服务平台 / Web 2.0
* **SEO指标**：预估 DA/DR：70 | 链接属性：Nofollow
* **推荐理由与相关性**：美国最大的宠物寄养平台，虽然Nofollow但引流价值极高，符合相关性标准
* **获取策略**：在宠物寄养指南中提及您的产品，通过自然内容获得品牌曝光

---
### 💾[记忆更新模块] (Update Memory)
```text
<历史记忆池_新增>
- petmd.com
- rover.com
</历史记忆池_新增>
```
```

## Memory Management

The skill maintains a memory pool of previously recommended domains to avoid duplication. Users should:

1. Provide history in their query using the format:
   ```
   <历史记忆池>
   - previous-domain1.com
   - previous-domain2.com
   </历史记忆池>
   ```

2. Copy the output memory update section to their history for future queries

## Quality Standards

All recommendations must meet 8 strict criteria:
1. **Relevance**: Industry-related or logical upstream/downstream
2. **Authority**: DA/DR ≥ 30, low spam score
3. **Organic Traffic**: Real, stable or growing traffic
4. **Contextual Links**: Body content placement preferred
5. **Anchor Text**: Flexible anchor text policies
6. **Link Equity**: Dofollow preferred, Nofollow requires explanation
7. **Low OBL**: < 15 outbound links
8. **Indexability**: Easy to crawl and index

## Error Handling

- If no suitable websites are found, the skill will explain why and suggest alternatives
- Memory errors are reported with clear guidance
- Industry mismatches result in clarification requests

## Integration

This skill can be integrated with:
- SEO tools (Ahrefs, Moz, SEMrush)
- Content management systems
- Link tracking platforms
- Project management tools