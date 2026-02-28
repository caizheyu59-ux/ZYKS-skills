#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试数据库连接和配置
"""

import json
import sqlite3
import os

def test_config():
    """测试配置文件"""
    print("1. 测试配置文件...")
    try:
        with open('db_config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)

        # 检查SQLite配置
        sqlite_config = config['connections']['sqlite']
        if sqlite_config['enabled']:
            print("   SQLite配置已启用")
            print(f"   数据库路径: {sqlite_config['database_path']}")

        # 检查MySQL配置
        mysql_config = config['connections']['mysql']
        if mysql_config['enabled']:
            print("   MySQL配置已启用")
            print(f"   主机: {mysql_config['host']}")
            print(f"   数据库: {mysql_config['database']}")

        return True
    except Exception as e:
        print(f"   错误: {e}")
        return False

def test_sqlite_connection():
    """测试SQLite连接"""
    print("\n2. 测试SQLite连接...")
    try:
        # 尝试连接数据库文件
        db_path = "seo_backlink_memory.db"
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()

            # 检查是否有表
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()

            print(f"   数据库文件存在: {db_path}")
            print(f"   已创建的表数量: {len(tables)}")
            if tables:
                print("   表名:", [t[0] for t in tables])

            conn.close()
            return True
        else:
            print("   数据库文件不存在")
            return False
    except Exception as e:
        print(f"   错误: {e}")
        return False

def test_memory_pool():
    """测试记忆池功能"""
    print("\n3. 测试记忆池功能...")
    try:
        from database_integration import DatabaseMemoryManager

        # 创建记忆管理器
        db_manager = DatabaseMemoryManager(
            db_type="sqlite",
            database="seo_backlink_memory.db"
        )

        # 测试添加域名
        test_domains = ["test1.com", "test2.com"]
        db_manager.add_to_memory_pool(test_domains, project_name="测试项目")

        # 测试获取记忆池
        memory_pool = db_manager.get_memory_pool("测试项目")
        print(f"   记忆池中的域名数量: {len(memory_pool)}")
        print(f"   域名列表: {memory_pool}")

        # 测试检查域名
        is_in_memory = db_manager.check_domain_in_memory("test1.com", "测试项目")
        print(f"   test1.com 是否在记忆池中: {is_in_memory}")

        return True
    except Exception as e:
        print(f"   错误: {e}")
        return False

def main():
    print("=" * 50)
    print("SEO外链助手数据库连接测试")
    print("=" * 50)

    results = []

    # 运行所有测试
    tests = [
        ("配置文件", test_config),
        ("SQLite连接", test_sqlite_connection),
        ("记忆池功能", test_memory_pool)
    ]

    for test_name, test_func in tests:
        result = test_func()
        results.append((test_name, result))

    # 输出结果
    print("\n" + "=" * 50)
    print("测试结果:")
    print("-" * 30)

    all_passed = True
    for test_name, result in results:
        status = "通过" if result else "失败"
        print(f"{test_name}: {status}")
        if not result:
            all_passed = False

    print("\n" + "=" * 50)
    if all_passed:
        print("✅ 所有测试通过！数据库连接成功！")
        print("\n你现在可以使用:")
        print("1. SQLite数据库（已默认配置）")
        print("2. MySQL数据库（需在db_config.json中启用）")
        print("3. PostgreSQL数据库（需在db_config.json中启用）")
    else:
        print("❌ 部分测试失败，请检查配置")

if __name__ == "__main__":
    main()