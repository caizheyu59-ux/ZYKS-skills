#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试自动保存功能
"""

import os
import sys

# 添加当前目录到路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_auto_save():
    """测试自动保存功能"""
    print("Testing auto-save functionality...")

    try:
        from database_integration import DatabaseSEOAssistant

        # 使用SQLite数据库
        config = {
            "db_type": "sqlite",
            "database": "seo_backlink_memory.db"
        }

        # 创建SEO助手
        seo_assistant = DatabaseSEOAssistant(config)

        # 测试查询
        query = "我是做跨境电商独立站的，请给我3个外链机会"
        response = seo_assistant.process_query(query, project_name="跨境电商")

        print("\nGenerated response:")
        print("=" * 50)
        print(response[:500] + "..." if len(response) > 500 else response)

        # 验证数据是否保存
        memory_pool = seo_assistant.db_manager.get_memory_pool("跨境电商")
        print(f"\nSaved domains in database: {memory_pool}")

        return True

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_auto_save()
    if success:
        print("\nTest completed successfully!")
    else:
        print("\nTest failed!")