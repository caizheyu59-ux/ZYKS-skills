#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
查询数据库中的所有外链推荐记录
"""

import sqlite3

def query_backlinks():
    conn = sqlite3.connect('seo_backlink_memory.db')
    cursor = conn.cursor()

    print('=' * 60)
    print('数据库中的外链推荐记录')
    print('=' * 60)

    # 1. 查询所有推荐会话
    print('\n📋 推荐会话记录:')
    cursor.execute('''
        SELECT session_hash, source_query, recommendations_count, created_at, project_name
        FROM backlink_sessions
        ORDER BY created_at DESC
    ''')
    sessions = cursor.fetchall()

    for session in sessions:
        print(f'\n会话ID: {session[0]}')
        print(f'查询内容: {session[1]}')
        print(f'推荐数量: {session[2]}')
        print(f'创建时间: {session[3]}')
        print(f'项目名称: {session[4]}')

    # 2. 查询所有推荐详情
    print('\n' + '-' * 40)
    print('🔗 推荐详情列表:')
    cursor.execute('''
        SELECT
            r.rec_id,
            r.session_hash,
            r.domain_name,
            r.domain_type,
            r.estimated_da_dr,
            r.link_type,
            r.relevance_score,
            r.acquisition_strategy,
            r.created_at,
            s.project_name
        FROM backlink_recommendations r
        JOIN backlink_sessions s ON r.session_hash = s.session_hash
        ORDER BY r.created_at DESC
    ''')
    recommendations = cursor.fetchall()

    if recommendations:
        print(f'\n共找到 {len(recommendations)} 条推荐记录:\n')

        current_session = None
        for i, rec in enumerate(recommendations, 1):
            # 如果是新会话，打印会话信息
            if rec[1] != current_session:
                print(f'\n📁 会话: {rec[1]} (项目: {rec[9]})')
                current_session = rec[1]
                print('-' * 80)

            print(f'\n{i}. 【{rec[2]}】')
            print(f'   类型: {rec[3]}')
            print(f'   权重: DA/DR {rec[4]} | 链接: {rec[5]}')
            print(f'   相关度: {rec[6]}')
            print(f'   策略: {rec[7]}')
            print(f'   时间: {rec[8]}')
    else:
        print('\n暂无推荐记录')

    # 3. 查询域名记忆池
    print('\n' + '-' * 40)
    print('🧠 域名记忆池:')
    cursor.execute('''
        SELECT
            d.domain_name,
            d.added_to_memory_at,
            d.status,
            h.action_type,
            p.project_name
        FROM domains d
        JOIN backlink_history h ON d.domain_id = h.domain_id
        JOIN user_projects p ON h.project_id = p.project_id
        ORDER BY d.added_to_memory_at DESC
    ''')
    domains = cursor.fetchall()

    if domains:
        print(f'\n共 {len(domains)} 个已推荐域名:\n')
        for domain in domains:
            print(f'• {domain[0]} ({domain[4]}) - {domain[3]} - {domain[1]}')
    else:
        print('\n暂无域名记录')

    # 4. 统计信息
    print('\n' + '=' * 60)
    print('📊 统计信息:')
    print('=' * 60)

    cursor.execute('SELECT COUNT(*) FROM backlink_sessions')
    total_sessions = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM backlink_recommendations')
    total_recommendations = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM domains')
    total_domains = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(DISTINCT project_name) FROM user_projects')
    total_projects = cursor.fetchone()[0]

    print(f'推荐会话数: {total_sessions}')
    print(f'推荐记录数: {total_recommendations}')
    print(f'推荐域名数: {total_domains}')
    print(f'项目数: {total_projects}')

    conn.close()

if __name__ == "__main__":
    query_backlinks()