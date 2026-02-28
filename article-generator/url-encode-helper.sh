#!/bin/bash
# ==============================================================================
# URL 编码辅助工具
# ==============================================================================
# 用途：将中文关键词编码为 URL 格式
# 使用：./url-encode-helper.sh "关键词"
# ==============================================================================

main() {
    local input="$1"

    if [ -z "$input" ]; then
        echo "用法: $0 \"关键词\""
        echo ""
        echo "示例:"
        echo "  $0 \"视频翻译\""
        echo "  输出: %E8%A7%86%E9%A2%91%E7%BF%BB%E8%AF%91"
        exit 1
    fi

    # 常见Kingsway关键词编码表
    case "$input" in
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
            # 尝试使用 PowerShell（Windows 环境）
            if command -v powershell &> /dev/null; then
                encoded=$(powershell -NoProfile -Command "[System.Uri]::EscapeDataString('$input')" 2>/dev/null)
                if [ -n "$encoded" ]; then
                    echo "$encoded"
                else
                    echo "⚠️  未找到预编码: $input" >&2
                    echo "$input"
                fi
            else
                echo "⚠️  未找到预编码: $input" >&2
                echo "$input"
            fi
            ;;
    esac
}

main "$@"
