---
version: 1
# ============================================
# Kingsway-Promotion 文章配图功能配置
# ============================================
# 集成 GeekAI API 用于生成文章插图
# ============================================

# ============================================
# GeekAI API 配置
# ============================================

image_api:
  provider: "GeekAI"
  api_key: "sk-N7KWrboFuff7F8KHTEPamqo0kyXdlnjdWt15N3Jyby5fWgjo"
  endpoint: "https://geekai.co/api/v1/images/generations"  # ✅ 已验证可用
  model: "nano-banana-2"

  # 支持的尺寸（nano-banana-2 仅支持 1K, 2K, 4K）
  supported_sizes:
    - "1K"   # 约 1024x1024
    - "2K"   # 约 2048x2048
    - "4K"   # 约 4096x4096

  # 默认配置
  default_size: "2K"
  quality: "medium"           # auto/low/medium/high
  output_format: "jpg"        # jpg/png/webp（强制使用 jpg 格式）
  response_format: "url"      # url/b64_json
  watermark: false

  # 并发控制
  max_concurrent: 3
  retry_times: 2
  timeout: 60

# ============================================
# 输出目录配置
# ============================================

output:
  # 输出目录选项
  preference: "illustrations-subdir"  # same-dir/imgs-subdir/illustrations-subdir/independent

  # 当 preference 为 independent 时的根目录
  root_dir: "illustrations"

  # 文件命名规则
  naming_pattern: "{number:02d}-{type}-{slug}.jpg"  # 例: 01-infographic-kingsway-seo.jpg

# ============================================
# 配图风格预设
# ============================================
# 基于 Kingsway 文章风格的自动配图配置
# ============================================

style_presets:
  # A - 评测/对比类文章
  comparison:
    type: "comparison"
    style: "blueprint"
    density: "balanced"
    description: "专业对比风格，适合产品评测、竞品分析"
    colors: ["#1E88E5", "#FF6B6B", "#4ECDC4"]
    elements: ["对比表", "星级评分", "数据图表"]

  # B - 教程/指南类文章
  tutorial:
    type: "flowchart"
    style: "notion"
    density: "rich"
    description: "清晰教程风格，适合操作指南、步骤说明"
    colors: ["#43A047", "#66BB6A", "#E8F5E9"]
    elements: ["编号步骤", "图标", "清单"]

  # C - 案例/故事类文章
  story:
    type: "timeline"
    style: "warm"
    density: "balanced"
    description: "温暖叙事风格，适合成功案例、客户故事"
    colors: ["#9C27B0", "#7B1FA2", "#F3E5F5"]
    elements: ["时间轴", "引用气泡", "前后对比"]

  # D - 权威指南类文章
  guide:
    type: "infographic"
    style: "elegant"
    density: "minimal"
    description: "简洁权威风格，适合完整手册、权威指南"
    colors: ["#424242", "#757575", "#FAFAFA"]
    elements: ["层级结构", "分节图标", "核心概念"]

  # E/F - 专家/新闻类文章
  expert:
    type: "infographic"
    style: "blueprint"
    density: "balanced"
    description: "专业商务风格，适合专家分析、行业新闻"
    colors: ["#1E88E5", "#1565C0", "#E3F2FD"]
    elements: ["数据图表", "KPI 卡片", "趋势线"]

  # G - 商业/转化类文章
  commercial:
    type: "comparison"
    style: "notion"
    density: "balanced"
    description: "转化导向风格，适合商业推广、产品介绍"
    colors: ["#1E88E5", "#43A047", "#FF9800"]
    elements: ["CTA 徽章", "利益图标", "信任信号"]

# ============================================
# Type × Style 兼容性矩阵
# ============================================
# 标记兼容性等级：✓✓ (最佳) / ✓ (兼容) / - (不推荐)
# ============================================

compatibility_matrix:
  infographic:
    - style: "notion"      level: "✓✓"
    - style: "blueprint"   level: "✓✓"
    - style: "elegant"     level: "✓✓"
    - style: "scientific"  level: "✓"
    - style: "minimal"     level: "✓"

  scene:
    - style: "warm"        level: "✓✓"
    - style: "watercolor"  level: "✓✓"
    - style: "elegant"     level: "✓"

  flowchart:
    - style: "notion"      level: "✓✓"
    - style: "minimal"     level: "✓✓"
    - style: "blueprint"   level: "✓"

  comparison:
    - style: "notion"      level: "✓✓"
    - style: "elegant"     level: "✓✓"
    - style: "blueprint"   level: "✓"

  framework:
    - style: "blueprint"   level: "✓✓"
    - style: "notion"      level: "✓✓"
    - style: "scientific"  level: "✓"

  timeline:
    - style: "elegant"     level: "✓✓"
    - style: "warm"        level: "✓✓"
    - style: "notion"      level: "✓"

# ============================================
# 提示词模板
# ============================================

prompt_templates:
  # 基础模板（强制中文）
  base: "{style_description}, {type_description}, professional business style, high quality, detailed, ALL TEXT AND LABELS MUST BE IN CHINESE"

  # Type 专用模板（强制中文）
  infographic: "Data visualization infographic, information design, charts and metrics, clean layout, {style}, all text labels in Chinese"
  scene: "Illustrative scene showing {content}, narrative storytelling, {style} artistic style, any text must be Chinese"
  flowchart: "Step-by-step flowchart diagram, process visualization, clear arrows and connections, {style}, all step labels in Chinese"
  comparison: "Side-by-side comparison layout, before/after or A/B comparison, {style} style, comparison labels in Chinese"
  framework: "Framework or model diagram, structured layout, architectural visualization, {style}, concept labels in Chinese"
  timeline: "Timeline or progression diagram, showing evolution or history, {style} style, event labels in Chinese"

  # Style 专用修饰词
  notion: "clean modern Notion-style, flat design, soft colors, simple icons, Chinese text"
  elegant: "professional elegant style, refined colors, minimalist sophistication, Chinese labels"
  warm: "warm friendly style, soft gradients, approachable aesthetic, Chinese text"
  minimal: "minimalist design, lots of white space, monochromatic with accent, Chinese typography"
  blueprint: "technical blueprint style, grid lines, architectural precision, Chinese annotations"
  watercolor: "watercolor illustration style, artistic brushstrokes, hand-painted feel, Chinese text"
  scientific: "scientific diagram style, precise measurements, academic aesthetic, Chinese labels"
  editorial: "editorial illustration style, publication quality, professional journalism, Chinese text"

# ============================================
# 图片下载与格式转换标准流程
# ============================================
# 所有生成的图片必须下载并转换为 .jpg 格式
# ============================================

image_download_workflow:
  # 强制使用 .jpg 格式
  force_jpg: true
  # 下载到文章同级目录
  download_location: "same_dir_as_article"
  # 命名规则
  filename_pattern: "{number:02d}-{slug}.jpg"

  # 标准下载命令（Windows）
  download_command: "curl -s -o \"{output_path}\" \"{url}\""

  # 更新文章中的图片链接
  update_article_links: true
  # 使用相对路径
  use_relative_path: true
  # 相对路径前缀
  relative_path_prefix: "./"

# ============================================
# 水印配置
# ============================================

watermark:
  enabled: false
  content: "Kingsway.com"
  position: "bottom-right"
  opacity: 0.3
  font_size: 14

# ============================================
# 自定义样式扩展
# ============================================

custom_styles: []
