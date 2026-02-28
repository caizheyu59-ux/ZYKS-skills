# SEO外链助手数据库集成指南

## 概述

这个文档将指导你如何将SEO外链助手的历史记忆存储到数据库中，实现数据的持久化和多会话共享。

## 快速开始

### 1. 选择数据库类型

#### 选项A：SQLite（推荐新手使用）
- 无需安装额外数据库服务器
- 数据库文件存储在本地
- 适合个人使用和测试

#### 选项B：MySQL/PostgreSQL（推荐生产环境）
- 需要数据库服务器
- 支持多用户并发访问
- 更适合团队协作

### 2. 配置数据库连接

#### SQLite 配置（已完成）
SQLite 已经默认配置好，无需额外设置。数据库文件将保存在：
```
C:\Users\caizheyu\.claude\skills\seo-backlink-assistant\seo_backlink_memory.db
```

#### MySQL 配置
1. 安装 MySQL 服务器
2. 创建数据库：
   ```sql
   CREATE DATABASE seo_backlink_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. 创建用户（可选）：
   ```sql
   CREATE USER 'seo_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON seo_backlink_db.* TO 'seo_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
4. 修改 `db_config.json`：
   ```json
   {
     "connections": {
       "mysql": {
         "enabled": true,
         "host": "localhost",
         "port": 3306,
         "username": "your_username",
         "password": "your_password",
         "database": "seo_backlink_db"
       }
     }
   }
   ```

#### PostgreSQL 配置
1. 安装 PostgreSQL 服务器
2. 创建数据库：
   ```sql
   CREATE DATABASE seo_backlink_db;
   CREATE USER seo_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE seo_backlink_db TO seo_user;
   ```
3. 修改 `db_config.json`：
   ```json
   {
     "connections": {
       "postgresql": {
         "enabled": true,
         "host": "localhost",
         "port": 5432,
         "username": "your_username",
         "password": "your_password",
         "database": "seo_backlink_db"
       }
     }
   }
   ```

### 3. 初始化数据库

运行 Python 脚本初始化数据库结构：

```bash
python database_integration.py
```

这将创建所有必要的表并生成示例数据。

## 使用方法

### 基本使用

```python
from database_integration import DatabaseSEOAssistant

# 加载配置
import json
with open('db_config.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

# 创建SEO助手实例
seo_assistant = DatabaseSEOAssistant(config)

# 处理查询（带项目名称）
query = "我是做外贸视频营销Saas平台独立站的，请给我5个外链机会"
response = seo_assistant.process_query(query, project_name="外贸视频营销项目")

print(response)
```

### 项目管理

你可以创建不同的项目来隔离不同业务的外链数据：

```python
# 不同项目的查询
response1 = seo_assistant.process_query("宠物用品独立站外链", project_name="宠物用品项目")
response2 = seo_assistant.process_query("跨境电商独立站推广", project_name="跨境电商项目")
```

### 查询历史数据

```python
# 查看某个项目的所有历史域名
history = seo_assistant.db_manager.get_memory_pool("外贸视频营销项目")
print(f"历史域名: {history}")

# 检查特定域名是否已推荐
is_recommended = seo_assistant.db_manager.check_domain_in_memory("hubspot.com", "外贸视频营销项目")
```

## 数据库结构说明

### 主要表结构

1. **user_projects** - 项目表
   - project_id (主键)
   - project_name
   - description
   - created_at
   - updated_at

2. **domains** - 域名表
   - domain_id (主键)
   - domain_name
   - added_to_memory_at
   - status
   - last_checked_at

3. **backlink_history** - 历史记录表
   - history_id (主键)
   - domain_id
   - project_id
   - user_id
   - action_type (added_to_memory, updated, removed)
   - action_description
   - created_at

4. **backlink_sessions** - 会话表
   - session_hash (主键)
   - source_query
   - recommendations_count
   - created_at
   - project_name

5. **backlink_recommendations** - 推荐详情表
   - rec_id (主键)
   - session_id
   - project_id
   - domain_name
   - domain_type
   - estimated_da_dr
   - link_type
   - relevance_score
   - acquisition_strategy
   - created_at

## 高级功能

### 1. 数据导出

```python
def export_project_data(project_name: str, format: str = 'json'):
    """导出项目数据"""
    # 从数据库查询数据
    query = f"""
    SELECT * FROM backlink_recommendations br
    JOIN backlink_sessions bs ON br.session_id = bs.session_hash
    WHERE bs.project_name = '{project_name}'
    ORDER BY br.created_at DESC
    """
    # 导出为 JSON 或 CSV
    pass
```

### 2. 定时备份

启用自动备份功能：
```json
{
  "database": {
    "backup_enabled": true,
    "backup_interval_hours": 24
  }
}
```

### 3. API 集成

将 API 密钥添加到配置文件中：
```json
{
  "api_keys": {
    "ahrefs": "your_ahrefs_api_key",
    "moz": "your_moz_api_key",
    "semrush": "your_semrush_api_key"
  }
}
```

## 故障排除

### 1. 数据库连接失败

- 检查数据库服务是否运行
- 验证连接参数是否正确
- 查看错误日志
- 系统会自动回退到内存模式

### 2. 权限错误

- MySQL: 确保用户有 CREATE, INSERT, SELECT 权限
- PostgreSQL: 确保用户有 CONNECT 和创建表权限

### 3. 字符编码问题

- 确保 UTF-8 编码
- MySQL 使用 utf8mb4 字符集

## 性能优化

1. **索引优化**
   - 在经常查询的列上添加索引
   - 复合索引优化常见查询

2. **数据清理**
   - 定期清理旧的推荐记录
   - 归档历史数据

3. **缓存策略**
   - 热点数据缓存
   - 内存缓存机制

## 示例：完整工作流

```python
# 1. 初始化
seo_assistant = DatabaseSEOAssistant(config)

# 2. 处理多个查询
queries = [
    "我是做外贸视频营销Saas平台独立站的，请给我5个外链机会",
    "给跨境电商独立站推荐一些外链",
    "宠物用品独立站需要高质量的外链建设"
]

for query in queries:
    response = seo_assistant.process_query(query, project_name="外贸项目")
    # 保存响应或发送给用户
    print(response)

# 3. 查看历史
history = seo_assistant.db_manager.get_memory_pool("外贸项目")
print(f"已推荐 {len(history)} 个不重复的域名")

# 4. 生成报告
generate_performance_report()
```

## 升级和维护

1. **数据库版本升级**
   - 使用迁移脚本
   - 备份现有数据

2. **定期维护**
   - 定期备份数据
   - 更新统计数据
   - 清理无效记录

这个数据库集成方案让你的SEO外链助手具备了数据持久化能力，可以长期跟踪和管理你的外链建设历史。