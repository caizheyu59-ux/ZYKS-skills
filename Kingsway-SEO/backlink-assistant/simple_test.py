#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO外链助手数据库集成简化测试脚本
"""

import os
import sys
import json

# 添加当前目录到路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_import():
    """测试模块导入"""
    print("Testing module import...")
    try:
        from database_integration import DatabaseSEOAssistant, DatabaseMemoryManager
        print("SUCCESS: Module imported successfully")
        return True
    except ImportError as e:
        print(f"ERROR: Import failed - {e}")
        return False

def test_sqlite():
    """测试SQLite功能"""
    print("\nTesting SQLite functionality...")
    try:
        from database_integration import DatabaseSEOAssistant

        # 使用内存数据库进行测试
        config = {
            "db_type": "sqlite",
            "database": ":memory:"
        }

        # 创建SEO助手
        seo_assistant = DatabaseSEOAssistant(config)
        print("SUCCESS: SEO assistant created with SQLite")

        # 测试查询处理
        query = "测试查询"
        response = seo_assistant.process_query(query, project_name="测试项目")

        # 验证响应
        if "定制外链机会" in response and "记忆更新模块" in response:
            print("SUCCESS: Query processing works")
            return True
        else:
            print("ERROR: Invalid response format")
            return False

    except Exception as e:
        print(f"ERROR: SQLite test failed - {e}")
        return False

def test_config():
    """测试配置文件"""
    print("\nTesting configuration file...")
    try:
        with open('db_config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)

        if 'connections' in config and 'sqlite' in config['connections']:
            print("SUCCESS: Configuration file is valid")
            return True
        else:
            print("ERROR: Invalid configuration")
            return False

    except Exception as e:
        print(f"ERROR: Config test failed - {e}")
        return False

def test_schema():
    """测试数据库架构文件"""
    print("\nTesting database schema...")
    try:
        if os.path.exists('seo_backlink_schema.sql'):
            print("SUCCESS: Schema file exists")

            # 读取文件前几行验证内容
            with open('seo_backlink_schema.sql', 'r', encoding='utf-8') as f:
                content = f.read()
                if 'CREATE TABLE' in content and 'users' in content:
                    print("SUCCESS: Schema file contains valid SQL")
                    return True
                else:
                    print("ERROR: Schema file is invalid")
                    return False
        else:
            print("ERROR: Schema file not found")
            return False

    except Exception as e:
        print(f"ERROR: Schema test failed - {e}")
        return False

def main():
    """主测试函数"""
    print("SEO Backlink Assistant Database Integration Test")
    print("=" * 60)

    tests = [
        ("Module Import", test_import),
        ("Configuration File", test_config),
        ("Database Schema", test_schema),
        ("SQLite Functionality", test_sqlite)
    ]

    results = []
    for test_name, test_func in tests:
        print(f"\n[{test_name}]")
        result = test_func()
        results.append(result)

    print("\n" + "=" * 60)
    print("Test Results Summary:")
    print("-" * 30)

    passed = sum(results)
    total = len(results)

    for i, (test_name, _) in enumerate(tests):
        status = "PASS" if results[i] else "FAIL"
        print(f"{test_name}: {status}")

    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n✅ ALL TESTS PASSED!")
        print("\nYour database integration is ready to use.")
        print("\nNext steps:")
        print("1. Edit db_config.json to configure your database")
        print("2. Run database_integration.py to initialize the database")
        print("3. Start using the SEO assistant with persistent storage")
    else:
        print(f"\n❌ {total-passed} test(s) failed.")
        print("Please check the error messages above.")

if __name__ == "__main__":
    main()