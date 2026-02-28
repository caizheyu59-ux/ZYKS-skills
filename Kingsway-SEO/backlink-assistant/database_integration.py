"""
SEO Backlink Assistant Database Integration
将历史记忆存储到数据库的集成组件
"""

import json
import sqlite3
try:
    import psycopg2  # PostgreSQL
except ImportError:
    psycopg2 = None
try:
    import pymysql  # MySQL
except ImportError:
    pymysql = None
from datetime import datetime
from typing import List, Dict, Optional
import hashlib

class DatabaseMemoryManager:
    """数据库记忆管理器 - 替代内存中的历史池"""

    def __init__(self, db_type: str = 'sqlite', **connection_params):
        """
        初始化数据库连接

        Args:
            db_type: 数据库类型 ('sqlite', 'mysql', 'postgresql')
            connection_params: 数据库连接参数
        """
        self.db_type = db_type
        self.connection_params = connection_params
        self.connection = None
        self._connect()

    def _connect(self):
        """建立数据库连接"""
        try:
            if self.db_type == 'sqlite':
                # 支持多种数据库参数命名
                db_name = (self.connection_params.get('database') or
                          self.connection_params.get('db_name') or
                          self.connection_params.get('dbname') or
                          'seo_backlink_memory.db')
                self.connection = sqlite3.connect(db_name)
                self.connection.row_factory = sqlite3.Row
            elif self.db_type == 'mysql':
                import pymysql
                self.connection = pymysql.connect(**self.connection_params)
            elif self.db_type == 'postgresql':
                self.connection = psycopg2.connect(**self.connection_params)
            else:
                raise ValueError(f"Unsupported database type: {self.db_type}")

            print(f"成功连接到 {self.db_type} 数据库")

        except Exception as e:
            print(f"数据库连接失败: {e}")
            # 回退到内存存储
            self._fallback_to_memory()

    def _fallback_to_memory(self):
        """回退到内存存储"""
        self.memory_cache = {}
        print("回退到内存存储模式")

    def init_database(self):
        """初始化数据库表结构"""
        if not self.connection:
            return

        sql_file_path = f"seo_backlink_schema_{self.db_type}.sql" if self.db_type == 'mysql' else "seo_backlink_schema.sql"

        try:
            with open(sql_file_path, 'r', encoding='utf-8') as f:
                schema_sql = f.read()

            cursor = self.connection.cursor()

            # 分割SQL语句
            statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]

            for statement in statements:
                try:
                    cursor.execute(statement)
                except Exception as e:
                    # 忽略已存在的表错误 - 处理多种数据库的错误消息
                    error_msg = str(e).lower()
                    if ("already exists" not in error_msg and
                        "table" not in error_msg or
                        "duplicate" not in error_msg):
                        print(f"执行SQL语句时出错: {e}")
                        continue

            self.connection.commit()
            print("数据库表结构初始化完成")

        except Exception as e:
            print(f"初始化数据库失败: {e}")

    def add_to_memory_pool(self, domains: List[str], project_name: str = "default", user_id: Optional[str] = None):
        """
        将域名添加到历史记忆池

        Args:
            domains: 域名列表
            project_name: 项目名称
            user_id: 用户ID
        """
        if not self.connection:
            return

        try:
            cursor = self.connection.cursor()
            timestamp = datetime.now()

            # 获取或创建项目
            cursor.execute("SELECT project_id FROM user_projects WHERE project_name = ?", (project_name,))
            project_result = cursor.fetchone()

            if not project_result:
                cursor.execute(
                    "INSERT INTO user_projects (project_name, created_at, updated_at) VALUES (?, ?, ?)",
                    (project_name, timestamp, timestamp)
                )
                project_id = cursor.lastrowid
            else:
                project_id = project_result[0]

            # 添加域名
            for domain in domains:
                # 检查域名是否已存在
                cursor.execute("SELECT domain_id FROM domains WHERE domain_name = ?", (domain,))
                domain_result = cursor.fetchone()

                if not domain_result:
                    # 插入新域名
                    cursor.execute(
                        "INSERT INTO domains (domain_name, added_to_memory_at, status) VALUES (?, ?, 'recommended')",
                        (domain, timestamp)
                    )
                    domain_id = cursor.lastrowid
                else:
                    domain_id = domain_result[0]

                # 记录推荐历史
                cursor.execute(
                    """
                    INSERT INTO backlink_history
                    (domain_id, project_id, user_id, action_type, action_description, created_at)
                    VALUES (?, ?, ?, 'added_to_memory', 'Domain added to memory pool by SEO assistant', ?)
                    """,
                    (domain_id, project_id, user_id, timestamp)
                )

            self.connection.commit()
            print(f"成功添加 {len(domains)} 个域名到历史记忆池")

        except Exception as e:
            print(f"添加到记忆池失败: {e}")
            # 回退到内存存储
            if not hasattr(self, 'memory_cache'):
                self.memory_cache = {}

            if project_name not in self.memory_cache:
                self.memory_cache[project_name] = []

            # 避免重复添加
            existing_domains = set(self.memory_cache[project_name])
            new_domains = [d for d in domains if d not in existing_domains]
            self.memory_cache[project_name].extend(new_domains)

            print(f"已将 {len(new_domains)} 个域名添加到内存缓存")

    def get_memory_pool(self, project_name: str = "default") -> List[str]:
        """
        获取历史记忆池中的域名

        Args:
            project_name: 项目名称

        Returns:
            域名列表
        """
        if not self.connection:
            # 回退到内存存储
            if hasattr(self, 'memory_cache') and project_name in self.memory_cache:
                return self.memory_cache[project_name]
            return []

        try:
            cursor = self.connection.cursor()

            cursor.execute("""
                SELECT domains.domain_name
                FROM domains
                JOIN backlink_history ON domains.domain_id = backlink_history.domain_id
                JOIN user_projects ON backlink_history.project_id = user_projects.project_id
                WHERE user_projects.project_name = ? AND backlink_history.action_type = 'added_to_memory'
                ORDER BY backlink_history.created_at DESC
            """, (project_name,))

            result = [row[0] for row in cursor.fetchall()]
            return result

        except Exception as e:
            print(f"获取记忆池失败: {e}")
            # 回退到内存存储
            if hasattr(self, 'memory_cache') and project_name in self.memory_cache:
                return self.memory_cache[project_name]
            return []

    def check_domain_in_memory(self, domain: str, project_name: str = "default") -> bool:
        """
        检查域名是否已在记忆池中

        Args:
            domain: 要检查的域名
            project_name: 项目名称

        Returns:
            是否已在记忆池中
        """
        memory_pool = self.get_memory_pool(project_name)
        return domain in memory_pool

    def save_recommendation_session(self, query: str, recommendations: List[Dict], project_name: str = "default"):
        """
        保存推荐会话信息

        Args:
            query: 用户查询
            recommendations: 推荐列表
            project_name: 项目名称
        """
        if not self.connection:
            print("警告: 数据库连接未建立")
            return

        try:
            cursor = self.connection.cursor()
            timestamp = datetime.now()

            # 创建推荐会话记录
            session_hash = hashlib.md5(f"{query}{timestamp}".encode()).hexdigest()

            cursor.execute(
                """
                INSERT INTO backlink_sessions
                (session_hash, source_query, recommendations_count, created_at, project_name)
                VALUES (?, ?, ?, ?, ?)
                """,
                (session_hash, query, len(recommendations), timestamp, project_name)
            )

            # 获取项目ID
            cursor.execute("SELECT project_id FROM user_projects WHERE project_name = ?", (project_name,))
            project_result = cursor.fetchone()
            if not project_result:
                # 如果项目不存在，创建它
                cursor.execute(
                    "INSERT INTO user_projects (project_name, created_at, updated_at) VALUES (?, ?, ?)",
                    (project_name, timestamp, timestamp)
                )
                project_id = cursor.lastrowid
                print(f"创建了新项目: {project_name}")
            else:
                project_id = project_result[0]

            # 保存每个推荐的详细信息
            saved_count = 0
            for rec in recommendations:
                try:
                    cursor.execute(
                        """
                        INSERT INTO backlink_recommendations
                        (session_hash, project_id, domain_name, domain_type, estimated_da_dr, link_type,
                         relevance_score, acquisition_strategy, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            session_hash, project_id, rec.get('domain'), rec.get('type'),
                            rec.get('da_dr'), rec.get('link_type'), rec.get('relevance_score'),
                            rec.get('acquisition_strategy'), timestamp
                        )
                    )
                    saved_count += 1
                except Exception as e:
                    print(f"保存推荐失败: {rec.get('domain')} - {e}")
                    continue

            self.connection.commit()
            print(f"成功保存推荐会话，包含 {saved_count} 个推荐")

        except Exception as e:
            print(f"保存推荐会话失败: {e}")
            import traceback
            traceback.print_exc()


class DatabaseSEOAssistant:
    """集成数据库的SEO外链助手"""

    def __init__(self, db_config: Dict):
        """
        初始化

        Args:
            db_config: 数据库配置
        """
        self.db_manager = DatabaseMemoryManager(**db_config)

        # 初始化数据库
        try:
            self.db_manager.init_database()
        except:
            pass  # 忽略初始化错误，继续使用内存模式

    def process_query(self, query: str, project_name: str = "default") -> str:
        """
        处理SEO外链查询

        Args:
            query: 用户查询
            project_name: 项目名称

        Returns:
            格式化的回复
        """
        # 获取历史记忆池
        memory_pool = self.db_manager.get_memory_pool(project_name)

        # 解析查询（这里应该是实际的外链搜索逻辑）
        # 为了示例，我们使用模拟数据
        recommendations = self._search_backlinks(query, memory_pool)

        # 保存会话到数据库
        self.db_manager.save_recommendation_session(query, recommendations, project_name)

        # 生成回复
        response = self._generate_response(query, recommendations, memory_pool)

        # 更新记忆池
        new_domains = [rec['domain'] for rec in recommendations]
        self.db_manager.add_to_memory_pool(new_domains, project_name)

        return response

    def _search_backlinks(self, query: str, memory_pool: List[str]) -> List[Dict]:
        """
        搜索外链（模拟实现）
        实际实现中这里会连接到实际的搜索引擎和API
        """
        # 模拟搜索逻辑
        # 实际应用中，这里应该调用Ahrefs、Moz等API

        # 根据查询词识别行业
        if "外贸" in query or "跨境电商" in query:
            industry = "外贸跨境电商"
        elif "视频营销" in query:
            industry = "视频营销"
        elif "SaaS" in query:
            industry = "SaaS"
        else:
            industry = "通用"

        # 模拟推荐结果
        mock_recommendations = {
            "外贸SaaS视频营销": [
                {
                    "domain": "hubspot.com",
                    "type": "行业权威博客 / SaaS资源页",
                    "da_dr": "96",
                    "link_type": "Dofollow",
                    "relevance_score": 95,
                    "acquisition_strategy": "撰写高质量的'如何利用视频营销提升外贸转化率'等深度文章，通过投稿获得自然外链"
                },
                {
                    "domain": "smartinsights.com",
                    "type": "数字营销专业资源页 / 行业白皮书",
                    "da_dr": "70",
                    "link_type": "Dofollow",
                    "relevance_score": 90,
                    "acquisition_strategy": "提供视频营销ROI分析或跨平台视频策略研究，以行业专家身份参与撰写营销技术白皮书或案例研究"
                },
                {
                    "domain": "wistia.com",
                    "type": "视频营销专业博客 / SaaS平台",
                    "da_dr": "63",
                    "link_type": "Dofollow",
                    "relevance_score": 95,
                    "acquisition_strategy": "撰写视频营销技术类文章，如'视频营销API集成最佳实践'，展示技术专业性"
                },
                {
                    "domain": "emarketer.com",
                    "type": "市场研究平台 / 行业报告",
                    "da_dr": "82",
                    "link_type": "Nofollow",
                    "relevance_score": 85,
                    "acquisition_strategy": "在视频营销趋势分析或案例研究中引用平台观点，通过专业内容获得品牌曝光"
                },
                {
                    "domain": "marketingprofs.com",
                    "type": "营销专业社区 / 教育平台",
                    "da_dr": "68",
                    "link_type": "Dofollow",
                    "relevance_score": 88,
                    "acquisition_strategy": "注册成为营销专家，参与问答社区的同时发布'外贸视频营销策略执行指南'"
                }
            ]
        }

        # 根据行业返回不同的推荐
        return mock_recommendations.get(industry, mock_recommendations["外贸SaaS视频营销"])

    def _generate_response(self, query: str, recommendations: List[Dict], memory_pool: List[str]) -> str:
        """
        生成格式化的回复
        """
        # 构建回复
        response = "### [SEARCH] 你的定制外链机会 (排除历史重复)\n"
        response += f"*{self._get_strategy_summary(query)}*\n\n"

        for i, rec in enumerate(recommendations, 1):
            response += f"**{i}. [{rec['domain']}]**\n"
            response += f"* **网站类型**：{rec['type']}\n"
            response += f"* **SEO指标**：预估 DA/DR：{rec['da_dr']} | 链接属性：({rec['link_type']})\n"
            response += f"* **推荐理由与相关性**：权威平台，与外贸视频营销SaaS高度相关，符合核心筛选标准\n"
            response += f"* **获取策略**：{rec['acquisition_strategy']}\n\n"

        response += "---\n"
        response += "### [SAVE][记忆更新模块] (Update Memory)\n"
        response += "*请用户将以下内容复制并补充到您的指令提示词或项目文件中，作为下一次提问的约束*\n\n"
        response += "```text\n"
        response += "<历史记忆池_新增>\n"
        for rec in recommendations:
            response += f"- {rec['domain']}\n"
        response += "\n</历史记忆池_新增>\n"
        response += "```"

        return response

    def _get_strategy_summary(self, query: str) -> str:
        """获取策略摘要"""
        if "外贸" in query and "视频营销" in query:
            return "针对外贸视频营销SaaS平台的专业外链策略，重点关注营销技术、视频制作、跨境电商和数字营销领域的权威平台"
        return "根据您的需求定制的外链建设策略"


# 数据库配置示例
DB_CONFIG_EXAMPLES = {
    "sqlite": {
        "db_type": "sqlite",
        "database": "seo_backlink_memory.db"
    },
    "mysql": {
        "db_type": "mysql",
        "host": "localhost",
        "user": "your_username",
        "password": "your_password",
        "database": "seo_backlink_db",
        "charset": "utf8mb4"
    },
    "postgresql": {
        "db_type": "postgresql",
        "host": "localhost",
        "user": "your_username",
        "password": "your_password",
        "database": "seo_backlink_db"
    }
}

# 使用示例
if __name__ == "__main__":
    # SQLite 配置（无需服务器）
    db_config = DB_CONFIG_EXAMPLES["sqlite"]

    # 创建SEO助手实例
    seo_assistant = DatabaseSEOAssistant(db_config)

    # 处理查询
    query = "我是做外贸视频营销Saas平台独立站的，请给我5个外链机会"
    response = seo_assistant.process_query(query, project_name="外贸视频营销项目")

    print(response)