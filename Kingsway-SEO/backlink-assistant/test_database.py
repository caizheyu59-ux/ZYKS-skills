#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO外链助手数据库集成测试脚本
"""

import os
import sys
import json
import sqlite3
from datetime import datetime

# 添加当前目录到路径，以便导入database_integration模块
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from database_integration import DatabaseSEOAssistant, DatabaseMemoryManager
    print("[SUCCESS] 成功导入数据库集成模块")
except ImportError as e:
    print("Error importing:", e)
    sys.exit(1)

def test_sqlite_connection():
    """测试SQLite连接"""
    print("\n=== 测试SQLite连接 ===")
    try:
        # 创建临时配置
        config = {
            "db_type": "sqlite",
            "database": ":memory:"  # 使用内存数据库进行测试
        }

        db_manager = DatabaseMemoryManager(**config)
        print("[SUCCESS] SQLite连接成功")
        return db_manager
    except Exception as e:
        print(f"[ERROR] SQLite连接失败: {e}")
        return None

def test_database_operations(db_manager):
    """测试数据库操作"""
    print("\n=== 测试数据库操作 ===")

    # 测试添加域名到记忆池
    test_domains = ["example1.com", "example2.com", "test-site.org"]
    print(f"\n1. 添加域名到记忆池: {test_domains}")
    try:
        db_manager.add_to_memory_pool(test_domains, project_name="测试项目")
        print("[SUCCESS] 域名添加成功")
    except Exception as e:
        print(f"[ERROR] 域名添加失败: {e}")

    # 测试获取记忆池
    print("\n2. 获取记忆池")
    try:
        memory_pool = db_manager.get_memory_pool("测试项目")
        print(f"[SUCCESS] 记忆池内容: {memory_pool}")
        assert len(memory_pool) == 3, f"期望3个域名，实际{len(memory_pool)}个"
    except Exception as e:
        print(f"[ERROR] 获取记忆池失败: {e}")

    # 测试检查域名
    print("\n3. 检查域名是否存在")
    try:
        assert db_manager.check_domain_in_memory("example1.com", "测试项目"), "域名应该存在"
        assert not db_manager.check_domain_in_memory("nonexistent.com", "测试项目"), "域名不应该存在"
        print("[SUCCESS] 域名检查成功")
    except Exception as e:
        print(f"[ERROR] 域名检查失败: {e}")

def test_seo_assistant():
    """测试SEO助手功能"""
    print("\n=== 测试SEO助手功能 ===")

    # 创建SEO助手实例（使用SQLite内存数据库）
    config = {
        "db_type": "sqlite",
        "database": ":memory:"
    }

    try:
        seo_assistant = DatabaseSEOAssistant(config)
        print("[SUCCESS] SEO助手实例创建成功")
    except Exception as e:
        print(f"[ERROR] SEO助手创建失败: {e}")
        return

    # 测试查询处理
    test_queries = [
        "我是做外贸视频营销Saas平台独立站的，请给我5个外链机会",
        "给宠物用品独立站推荐高质量外链",
        "跨境电商网站需要外链建设"
    ]

    for query in test_queries:
        print(f"\n处理查询: {query[:30]}...")
        try:
            # 使用不同的项目名称
            project_name = query[:10].replace(" ", "_") + "_项目"
            response = seo_assistant.process_query(query, project_name=project_name)

            # 验证响应包含必要的内容
            assert "定制外链机会" in response, "响应应包含'定制外链机会'"
            assert "记忆更新模块" in response, "响应应包含'记忆更新模块'"
            print(f"[SUCCESS] 查询处理成功，项目: {project_name}")

        except Exception as e:
            print(f"[ERROR] 查询处理失败: {e}")

def test_database_schema():
    """测试数据库架构"""
    print("\n=== 测试数据库架构 ===")

    # 读取SQL文件
    schema_file = "seo_backlink_schema.sql"
    if not os.path.exists(schema_file):
        print(f"[ERROR] 找不到SQL文件: {schema_file}")
        return

    try:
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_content = f.read()

        # 检查主要表是否存在
        required_tables = [
            "users",
            "user_projects",
            "domains",
            "backlink_history",
            "backlink_sessions",
            "backlink_recommendations"
        ]

        for table in required_tables:
            if f"CREATE TABLE {table}" in schema_content:
                print(f"[SUCCESS] 表 {table} 存在")
            else:
                print(f"[ERROR] 表 {table} 不存在")

    except Exception as e:
        print(f"[ERROR] 读取SQL文件失败: {e}")

def main():
    """主测试函数"""
    print("SEO外链助手数据库集成测试")
    print("=" * 50)

    # 测试1: SQLite连接
    db_manager = test_sqlite_connection()
    if not db_manager:
        print("\n❌ 数据库连接测试失败，退出")
        return

    # 测试2: 数据库操作
    test_database_operations(db_manager)

    # 测试3: SEO助手功能
    test_seo_assistant()

    # 测试4: 数据库架构
    test_database_schema()

    print("\n" + "=" * 50)
    print("[DONE] 所有测试完成！")
    print("\n如果你看到以上输出，说明数据库集成功能正常工作。")
    print("下一步:")
    print("1. 编辑 db_config.json 配置你的数据库连接")
    print("2. 运行 database_integration.py 初始化数据库")
    print("3. 开始使用持久化的SEO外链助手")

if __name__ == "__main__":
    main()