---
name: kingsway-article-illustrator
description: Kingsway 文章配图功能 - 基于 GeekAI API 分析文章结构并生成专业插图。支持 Type × Style 二维体系，自动适配 Kingsway 7 种文章风格（A-G）。当用户要求"为文章配图"、"添加插图"、"生成配图"时使用。
---

# Kingsway Article Illustrator

Kingsway SEO 推广文章的智能配图功能。分析文章结构，识别需要插图的位置，使用 GeekAI API 生成专业插图。

## 🎯 功能特点

- ✅ **智能分析**：自动识别文章类型和核心论点
- ✅ **Type × Style**：6 种类型 × 8 种风格的自由组合
- ✅ **GeekAI 集成**：使用 nano-banana-2 模型生成高质量图片
- ✅ **Kingsway 适配**：针对 Kingsway 7 种文章风格（A-G）预设配置
- ✅ **自动化流程**：从分析到生成的一站式服务
- ✅ **中文配图**：所有图片文字、标签、注释均为中文

## 📊 Kingsway 文章风格自动映射

| Kingsway 文章风格 | 配图 Type | 配图 Style | 密度 |
|:-----------------:|-----------|------------|------|
| **A** 评测/对比类 | comparison | blueprint | balanced |
| **B** 教程/指南类 | flowchart | notion | rich |
| **C** 案例/故事类 | timeline | warm | balanced |
| **D** 权威指南类 | infographic | elegant | minimal |
| **E/F** 专家/新闻类 | infographic | blueprint | balanced |
| **G** 商业/转化类 | comparison | notion | balanced |

---

## Two Dimensions

## Two Dimensions

| Dimension | Controls | Examples |
|-----------|----------|----------|
| **Type** | Information structure, layout | infographic, scene, flowchart, comparison, framework, timeline |
| **Style** | Visual aesthetics, mood | notion, warm, minimal, blueprint, watercolor, elegant |

Type × Style can be freely combined. Example: `--type infographic --style blueprint`

## Type Gallery

| Type | Best For |
|------|----------|
| `infographic` | Data, metrics, technical articles |
| `scene` | Narratives, personal stories, emotional content |
| `flowchart` | Tutorials, workflows, processes |
| `comparison` | Side-by-side, before/after, options |
| `framework` | Methodologies, models, architecture |
| `timeline` | History, progress, evolution |

## Style Gallery

| Style | Best For |
|-------|----------|
| `notion` (Default) | Knowledge sharing, SaaS, productivity |
| `elegant` | Business, thought leadership |
| `warm` | Personal growth, lifestyle, education |
| `minimal` | Philosophy, core concepts |
| `blueprint` | Architecture, system design |
| `watercolor` | Lifestyle, travel, creative |
| `editorial` | Tech explainers, journalism |
| `scientific` | Academic, technical research |

Full styles: [references/styles.md](references/styles.md)

## Auto Selection

| Content Signals | Type | Style |
|-----------------|------|-------|
| API, metrics, data, numbers | infographic | blueprint, notion |
| Story, emotion, journey | scene | warm, watercolor |
| How-to, steps, workflow | flowchart | notion, minimal |
| vs, pros/cons, before/after | comparison | notion, elegant |
| Framework, model, architecture | framework | blueprint, notion |
| History, timeline, progress | timeline | elegant, warm |

## Workflow

Copy this checklist and track progress:

```
Progress:
- [ ] Step 1: Pre-check
- [ ] Step 2: Setup & Analyze
- [ ] Step 3: Confirm Settings ⚠️ REQUIRED
- [ ] Step 4: Generate Outline
- [ ] Step 5: Generate Images
- [ ] Step 6: Finalize
```

---

### Step 1: Pre-check

**1.1 Determine Input Type**

| Input | Output Directory | Next |
|-------|------------------|------|
| File path | Ask user (1.2) | → 1.2 |
| Pasted content | `illustrations/{topic-slug}/` | → 1.4 |

**1.2 Determine Output Directory** (file path input only)

Check `default_output_dir` in preferences:

| Preference Value | Action |
|------------------|--------|
| `same-dir` | Use `{article-dir}/`, display "Output: {path}" |
| `imgs-subdir` | Use `{article-dir}/imgs/`, display "Output: {path}" |
| `illustrations-subdir` | Use `{article-dir}/illustrations/`, display "Output: {path}" |
| `independent` | Use `illustrations/{topic-slug}/`, display "Output: {path}" |
| Not configured | **MUST** ask with AskUserQuestion ↓ |

**AskUserQuestion** (when no preference):
- `{article-dir}/` - Same directory as article
- `{article-dir}/imgs/` - Images subdirectory
- `{article-dir}/illustrations/` - Illustrations subdirectory (Recommended)
- `illustrations/{topic-slug}/` - Independent directory
- Save as default - Remember this choice for future runs

**1.3 Check Existing Images**

Scan target directory for `.png/.jpg/.webp` files.

If images exist → AskUserQuestion: How to handle?
- `supplement` - Keep existing, generate only new positions
- `overwrite` - Overwrite same-name files
- `regenerate` - Clear all and regenerate

**1.4 Confirm Article Update Method** (file path input only)

AskUserQuestion: How to update article?
- `update` - Modify original file directly
- `copy` - Create `{name}-illustrated.md` copy

**1.5 Load Preferences (EXTEND.md)**

```bash
test -f .baoyu-skills/baoyu-article-illustrator/EXTEND.md && echo "project"
test -f "$HOME/.baoyu-skills/baoyu-article-illustrator/EXTEND.md" && echo "user"
```

| Result | Action |
|--------|--------|
| Found | Read, parse, display summary |
| Not found | Ask with AskUserQuestion (see references/config/first-time-setup.md) |

**Supports**: Watermark | Preferred type/style | Custom styles | Language | Output directory

---

### Step 2: Setup & Analyze

**2.1 Analyze Content**

| Analysis | Description |
|----------|-------------|
| Content type | Technical / Tutorial / Methodology / Narrative |
| Core arguments | 2-5 main points to visualize |
| Visual opportunities | Positions where illustrations add value |
| Recommended type | Based on content signals |
| Recommended density | Based on length and complexity |

**2.2 Extract Core Arguments**

- Main thesis
- Key concepts reader needs
- Comparisons/contrasts
- Framework/model proposed

**CRITICAL**: If article uses metaphors (e.g., "电锯切西瓜"), do NOT illustrate literally. Visualize the **underlying concept**.

**2.3 Identify Positions**

**Illustrate**:
- Core arguments (REQUIRED)
- Abstract concepts
- Data comparisons
- Processes, workflows

**Do NOT Illustrate**:
- Metaphors literally
- Decorative scenes
- Generic illustrations

---

### Step 3: Confirm Settings ⚠️

**Do NOT skip.** Use AskUserQuestion with 3-4 questions in ONE call.

**Q1: Illustration Type**
- [Recommended based on analysis] (Recommended)
- infographic / scene / flowchart / comparison / framework / timeline / mixed

**Q2: Density**
- minimal (1-2) - Core concepts only
- balanced (3-5) (Recommended) - Major sections
- rich (6+) - Comprehensive support

**Q3: Style** (ALWAYS ask, even with preferred_style in EXTEND.md)

If EXTEND.md has `preferred_style`:
- [Custom style name + brief description] (Recommended)
- [Top compatible built-in style 1]
- [Top compatible built-in style 2]
- [Top compatible built-in style 3]

If no `preferred_style`:
- [Best compatible from matrix] (Recommended)
- [Other ✓✓ style 1]
- [Other ✓✓ style 2]
- [Other ✓ style]

Style selection based on Type × Style compatibility matrix (references/styles.md).
Full specs: `references/styles/<style>.md`

**Q4** (only if source ≠ user language):
- Language: Source / User language

---

### Step 4: Generate Outline

Save as `outline.md`:

```yaml
---
type: infographic
density: balanced
style: blueprint
image_count: 4
---

## Illustration 1

**Position**: [section] / [paragraph]
**Purpose**: [why this helps]
**Visual Content**: [what to show]
**Type Application**: [how type applies]
**Filename**: 01-infographic-concept-name.png

## Illustration 2
...
```

**Requirements**:
- Each position justified by content needs
- Type applied consistently
- Style reflected in descriptions
- Count matches density

---

### Step 5: Generate Images

**5.1 Create Prompts**

Follow [references/prompt-construction.md](references/prompt-construction.md). Save to `prompts/illustration-{slug}.md`.

**5.2 Select Generation Skill**

Check available skills. If multiple, ask user.

**5.3 Apply Watermark** (if enabled)

Add: `Include a subtle watermark "[content]" at [position].`

**5.4 Generate**

1. Generate sequentially
2. After each: "Generated X/N"
3. On failure: retry once, then log and continue

**5.5 Download and Convert to JPG** ⚠️ **REQUIRED**

All images MUST be downloaded and saved as `.jpg` format:

```bash
# Download each image as .jpg format
curl -s -o "{number:02d}-{slug}.jpg" "{image_url}"
```

**Naming convention**: `{number:02d}-{slug}.jpg` (e.g., `01-exhibition-scene.jpg`)

**Download location**: Same directory as the article file

---

### Step 6: Finalize

**6.1 Download Images and Update Article**

Download all images as `.jpg` format and insert into article:

```bash
# Download images
curl -s -o "01-{slug}.jpg" "{url}"
curl -s -o "02-{slug}.jpg" "{url}"
curl -s -o "03-{slug}.jpg" "{url}"
```

Insert after corresponding paragraph:
```markdown
![description]({number:02d}-{slug}.jpg)
```

Use relative path `./{filename}.jpg` for local images.

**6.2 Output Summary**

```
Article Illustration Complete!

Article: [path]
Type: [type] | Density: [level] | Style: [style]
Location: [directory]
Images: X/N generated

Positions:
- 01-xxx.png → After "[Section]"
- 02-yyy.png → After "[Section]"

[If failures]
Failed:
- NN-zzz.png: [reason]
```

---

## Output Directory

```
illustrations/{topic-slug}/
├── source-{slug}.{ext}
├── outline.md
├── prompts/
│   └── illustration-{slug}.md
└── NN-{type}-{slug}.png
```

**Slug**: 2-4 word topic in kebab-case.
**Conflict**: Append `-YYYYMMDD-HHMMSS` if exists.

## Modification

| Action | Steps |
|--------|-------|
| **Edit** | Update prompt → Regenerate → Update reference |
| **Add** | Identify position → Create prompt → Generate → Update outline → Insert |
| **Delete** | Delete files → Remove reference → Update outline |

## References

| File | Content |
|------|---------|
| [references/usage.md](references/usage.md) | Command syntax and options |
| [references/styles.md](references/styles.md) | Style gallery & compatibility |
| [references/prompt-construction.md](references/prompt-construction.md) | Prompt templates |
| `references/styles/<style>.md` | Full style specifications |
| `references/config/preferences-schema.md` | EXTEND.md schema |
| `references/config/first-time-setup.md` | First-time setup flow |

## Extension Support

Custom configurations via EXTEND.md. See **Step 1.5** for paths and supported options.
