#!/bin/bash
# ==============================================================================
# Kingsway-Promotion API 调用脚本 (Bash版本)
# ==============================================================================
# 用途：调用 Serper.dev 和 5118 API 获取关键词数据
#
# ⚠️ 重要注意事项：
#   1. 5118 API 认证头不带 "Bearer" 前缀
#   2. 中文关键词必须正确 URL 编码
#   3. 多个关键词使用 "|" 分隔
#   4. 提交后需等待 3-5 秒再获取结果
#
# ==============================================================================

# ==================== 配置 ====================

# Serper.dev API 配置
SERPER_API_KEY="3a46730d6df9fc9efc44a2fbced6ceff7e695f37"
SERPER_ENDPOINT="https://google.serper.dev/search"

# 5118 API 配置
API_5118_KEY="EEF2A9EC12CF4EBDBF0059278ADCD8D0"
API_5118_ENDPOINT="http://apis.5118.com/keywordparam/v2"

# ==================== 辅助函数 ====================

# URL 编码函数（支持中文）
# 优先调用辅助脚本，回退到内置词表
url_encode() {
    local string="$1"
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    # 尝试使用辅助脚本
    if [ -f "$script_dir/url-encode-helper.sh" ]; then
        local encoded=$("$script_dir/url-encode-helper.sh" "$string" 2>/dev/null)
        if [ -n "$encoded" ] && [[ ! "$encoded" =~ "⚠️" ]]; then
            echo "$encoded"
            return 0
        fi
    fi

    # 回退方案：使用内置词表
    case "$string" in
        "视频翻译") echo "%E8%A7%86%E9%A2%91%E7%BF%BB%E8%AF%91" ;;
        "视频托管") echo "%E8%A7%86%E9%A2%91%E8%8E%B7%E5%AE%A2" ;;
        "视频翻译软件") echo "%E8%A7%86%E9%A2%91%E7%BF%BB%E8%AF%91%E8%BD%AF%E4%BB%B6" ;;
        "视频翻译教程") echo "%E8%A7%86%E9%A2%91%E7%BF%BB%E8%AF%91%E6%95%99%E7%A8%8B" ;;
        "免费视频翻译") echo "%E5%85%8D%E8%B4%B9%E8%A7%86%E9%A2%91%E7%BF%BB%E8%AF%91" ;;
        "在线视频翻译") echo "%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E7%BF%BB%E8%AF%91" ;;
        "视频翻译哪家好") echo "%E8%A7%86%E9%A2%91%E7%BF%BB%E8%AF%91%E5%93%AA%E5%AE%B6%E5%A5%BD" ;;
        "视频托管平台") echo "%E8%A7%86%E9%A2%91%E8%8E%B7%E5%AE%A2%E5%B9%B3%E5%8F%B0" ;;
        "视频托管教程") echo "%E8%A7%86%E9%A2%91%E8%8E%B7%E5%AE%A2%E6%95%99%E7%A8%8B" ;;
        "免费视频托管") echo "%E5%85%8D%E8%B4%B9%E8%A7%86%E9%A2%91%E8%8E%B7%E5%AE%A2" ;;
        "在线视频托管") echo "%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%8E%B7%E5%AE%A2" ;;
        "视频托管哪家好") echo "%E8%A7%86%E9%A2%91%E8%8E%B7%E5%AE%A2%E5%93%AA%E5%AE%B6%E5%A5%BD" ;;
        "视频独立站") echo "%E8%A7%86%E9%A2%91%E7%8B%AC%E7%AB%8B%E7%AB%99" ;;
        "视频营销") echo "%E8%A7%86%E9%A2%91%E8%90%A5%E9%94%80" ;;
        "视频获客") echo "%E8%A7%86%E9%A2%91%E8%8E%B7%E5%AE%A2" ;;
        "展会视频") echo "%E5%B1%95%E4%BC%9A%E8%A7%86%E9%A2%91" ;;
        "产品视频") echo "%E4%BA%A7%E5%93%81%E8%A7%86%E9%A2%91" ;;
        *)
            # 如果没有预编码，返回原词（可能导致5118错误）
            echo "$string"
            ;;
    esac
}

# JSON 提取函数
extract_json_value() {
    local json="$1"
    local key="$2"
    echo "$json" | grep -o "\"$key\"[[:space:]]*:[[:space:]]*[^,}]*" | head -1 | sed 's/.*:[[:space:]]*//' | tr -d '"'
}

# ==================== API 函数 ====================

# Serper.dev 常规搜索
serper_search() {
    local query="$1"
    curl -s -X POST "$SERPER_ENDPOINT" \
        -H "X-API-KEY: $SERPER_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"q\": \"$query\"}"
}

# Serper.dev Allintitle 搜索
serper_allintitle() {
    local query="$1"
    curl -s -X POST "$SERPER_ENDPOINT" \
        -H "X-API-KEY: $SERPER_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"q\": \"allintitle:\\\"$query\\\"\"}"
}

# 5118 API 提交关键词（获取 taskid）
submit_5118_keywords() {
    local keywords="$1"
    curl -s -X POST "$API_5118_ENDPOINT" \
        -H "Authorization: $API_5118_KEY" \
        -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" \
        -d "keywords=$keywords"
}

# 5118 API 获取结果（使用 taskid）
get_5118_results() {
    local taskid="$1"
    curl -s -X POST "$API_5118_ENDPOINT" \
        -H "Authorization: $API_5118_KEY" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "taskid=$taskid"
}

# ==================== 完整分析流程 ====================

# 完整的关键词分析流程
keyword_analysis() {
    local keywords=("$@")

    echo ""
    echo "========================================"
    echo "   Kingsway-Promotion 关键词分析工具"
    echo "========================================"
    echo ""

    # 步骤 1: URL 编码关键词
    echo "[1/5] URL 编码关键词..."
    local encoded_keywords=""
    for kw in "${keywords[@]}"; do
        local encoded=$(url_encode "$kw")
        if [ -n "$encoded_keywords" ]; then
            encoded_keywords="$encoded_keywords|$encoded"
        else
            encoded_keywords="$encoded"
        fi
        echo "  $kw -> $encoded"
    done
    echo "  ✅ 编码完成"
    echo ""

    # 步骤 2: 提交到 5118
    echo "[2/5] 提交关键词到 5118 API..."
    local submit_result=$(submit_5118_keywords "$encoded_keywords")
    local errcode=$(extract_json_value "$submit_result" "errcode")

    if [ "$errcode" = "0" ]; then
        local taskid=$(extract_json_value "$submit_result" "taskid")
        echo "  ✅ 提交成功，TaskId: $taskid"
        echo ""

        # 步骤 3: 等待并获取 5118 结果
        echo "[3/5] 等待 5118 处理..."
        sleep 3
        echo "  ✅ 处理完成"
        echo ""

        local api5118_result=$(get_5118_results "$taskid")

        # 显示 5118 结果
        echo "========== 5118 搜索量数据 =========="
        echo ""

        # 提取并显示每个关键词的数据
        for keyword in "${keywords[@]}"; do
            local pcpv=$(echo "$api5118_result" | grep -o "\"keyword\":\"$keyword\"[^}]*" | grep -o "\"bidword_pcpv\":[0-9]*" | head -1 | sed 's/.*://')
            local long_count=$(echo "$api5118_result" | grep -o "\"keyword\":\"$keyword\"[^}]*" | grep -o "\"long_keyword_count\":[0-9]*" | head -1 | sed 's/.*://')

            if [ -z "$pcpv" ]; then pcpv=0; fi
            if [ -z "$long_count" ]; then long_count=0; fi

            echo "关键词: $keyword"
            echo "  bidword_pcpv: $pcpv"
            echo "  月检索量: $((pcpv * 30))"
            echo "  长尾词数量: $long_count"
            echo ""
        done

        # 步骤 4: Serper Allintitle 搜索
        echo "[4/5] Serper Allintitle 搜索..."
        echo ""

        echo "========== Allintitle 竞争度数据 =========="
        echo ""

        for keyword in "${keywords[@]}"; do
            local allintitle_result=$(serper_allintitle "$keyword")
            local allintitle_count=$(echo "$allintitle_result" | grep -o '"totalResults"[[:space:]]*:[[:space:]]*[0-9]*' | head -1 | sed 's/.*:[[:space:]]*//')

            if [ -z "$allintitle_count" ] || [ "$allintitle_count" = "0" ]; then
                allintitle_count=$(echo "$allintitle_result" | grep -o '"organic"' | wc -l)
            fi

            # 从 5118 结果中查找对应关键词的数据
            local pcpv=$(echo "$api5118_result" | grep -o "\"keyword\":\"$keyword\"[^}]*" | grep -o "\"bidword_pcpv\":[0-9]*" | head -1 | sed 's/.*://')
            if [ -z "$pcpv" ]; then pcpv=0; fi
            local monthly_volume=$((pcpv * 30))

            # 计算 KGR
            local kgr="N/A"
            if [ "$monthly_volume" -gt 0 ]; then
                kgr=$(awk "BEGIN {printf \"%.4f\", $allintitle_count / $monthly_volume}")
            fi

            echo "关键词: $keyword"
            echo "  Allintitle: $allintitle_count"
            echo "  bidword_pcpv: $pcpv"
            echo "  月检索量: $monthly_volume"
            echo "  KGR: $kgr"

            # 评级
            if [ "$allintitle_count" -eq 0 ]; then
                echo "  结论: ⭐⭐⭐⭐⭐ 蓝海冠军"
            elif [ "$allintitle_count" -le 10 ]; then
                echo "  结论: ⭐⭐⭐⭐ 可尝试"
            else
                echo "  结论: ⭐⭐⭐ 竞争较大"
            fi
            echo ""
        done

        # 步骤 5: 完成
        echo "========================================"
        echo "   分析完成！"
        echo "========================================"
        echo ""
    else
        local errmsg=$(extract_json_value "$submit_result" "errmsg")
        echo "  ❌ 提交失败: $errmsg"
        echo ""
        echo "  常见问题排查："
        echo "  1. 检查 API Key 是否正确"
        echo "  2. 检查网络连接"
        echo "  3. 检查关键词格式（避免特殊字符）"
        echo ""
        return 1
    fi
}

# ==================== 测试函数 ====================

# 测试单个关键词
test_single_keyword() {
    local keyword="${1:-视频翻译软件}"
    keyword_analysis "$keyword"
}

# 测试批量关键词
test_batch_keywords() {
    keyword_analysis \
        "视频翻译软件" \
        "视频翻译教程" \
        "免费视频翻译"
}

# ==================== 主程序 ====================

# 检查依赖
check_dependencies() {
    if ! command -v curl &> /dev/null; then
        echo "❌ 错误: 需要安装 curl"
        exit 1
    fi
}

# 如果直接运行脚本
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    check_dependencies

    # 解析命令行参数
    case "${1:-}" in
        single)
            test_single_keyword "${2:-}"
            ;;
        batch)
            test_batch_keywords
            ;;
        *)
            # 如果有参数，作为关键词分析
            if [ $# -gt 0 ]; then
                keyword_analysis "$@"
            else
                echo "用法: $0 [single|batch|关键词1 关键词2 ...]"
                echo ""
                echo "示例:"
                echo "  $0 single 视频翻译"
                echo "  $0 batch"
                echo "  $0 视频翻译 在线视频翻译"
                exit 1
            fi
            ;;
    esac
fi
