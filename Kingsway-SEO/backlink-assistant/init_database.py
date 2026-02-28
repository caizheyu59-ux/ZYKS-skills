#!/usr/bin/env python3
"""
初始化SEO外链助手数据库
"""

import sqlite3
import sys
import os

def main():
    print("开始初始化SEO外链助手数据库...")

    # 数据库文件路径
    db_path = 'seo_backlink_memory.db'

    # 如果数据库文件已存在，先删除
    if os.path.exists(db_path):
        print(f"删除现有数据库文件: {db_path}")
        os.remove(db_path)

    # 创建新数据库
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 读取并执行schema
    with open('seo_backlink_schema.sql', 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    # 分割SQL语句并执行
    statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]

    for statement in statements:
        try:
            cursor.execute(statement)
        except Exception as e:
            print(f"执行SQL语句时出错: {e}")
            continue

    conn.commit()

    # 插入默认项目
    default_projects = [
        ('default', '默认项目'),
        ('外贸视频营销', '外贸视频营销SaaS平台相关项目'),
        ('跨境电商', '跨境电商相关项目'),
        ('独立站推广', '各类独立站推广项目')
    ]

    for project_name, description in default_projects:
        cursor.execute(
            "INSERT OR IGNORE INTO user_projects (project_name, description) VALUES (?, ?)",
            (project_name, description)
        )

    conn.commit()
    conn.close()

    print("数据库初始化完成！")

if __name__ == "__main__":
    main()