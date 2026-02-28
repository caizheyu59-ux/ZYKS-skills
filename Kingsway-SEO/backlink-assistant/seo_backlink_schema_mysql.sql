-- SEO Backlink Assistant Database Schema - MySQL Version
-- 创建用户项目表
CREATE TABLE IF NOT EXISTS user_projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建域名表
CREATE TABLE IF NOT EXISTS domains (
    domain_id INT AUTO_INCREMENT PRIMARY KEY,
    domain_name VARCHAR(255) NOT NULL UNIQUE,
    added_to_memory_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'recommended',
    last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建外链历史记录表
CREATE TABLE IF NOT EXISTS backlink_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    domain_id INT NOT NULL,
    project_id INT NOT NULL,
    user_id VARCHAR(100),
    action_type VARCHAR(50) NOT NULL,
    action_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(domain_id),
    FOREIGN KEY (project_id) REFERENCES user_projects(project_id)
);

-- 创建会话表
CREATE TABLE IF NOT EXISTS backlink_sessions (
    session_hash VARCHAR(255) PRIMARY KEY,
    source_query TEXT NOT NULL,
    recommendations_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project_name VARCHAR(255)
);

-- 创建推荐详情表
CREATE TABLE IF NOT EXISTS backlink_recommendations (
    rec_id INT AUTO_INCREMENT PRIMARY KEY,
    session_hash VARCHAR(255) NOT NULL,
    project_id INT,
    domain_name VARCHAR(255) NOT NULL,
    domain_type VARCHAR(100),
    estimated_da_dr INT,
    link_type VARCHAR(50),
    relevance_score DECIMAL(3,2),
    acquisition_strategy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_hash) REFERENCES backlink_sessions(session_hash),
    FOREIGN KEY (project_id) REFERENCES user_projects(project_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_domains_domain_name ON domains(domain_name);
CREATE INDEX IF NOT EXISTS idx_history_domain_id ON backlink_history(domain_id);
CREATE INDEX IF NOT EXISTS idx_history_project_id ON backlink_history(project_id);
CREATE INDEX IF NOT EXISTS idx_session_hash ON backlink_sessions(session_hash);
CREATE INDEX IF NOT EXISTS idx_recommendations_domain ON backlink_recommendations(domain_name);
CREATE INDEX IF NOT EXISTS idx_recommendations_project ON backlink_recommendations(project_id);