# Kingsway-Promotion API 调用脚本
# 用途：调用 Serper.dev 和 5118 API 获取关键词数据

# ==================== 配置 ====================

# Serper.dev API 配置
$SERPER_API_KEY = "3a46730d6df9fc9efc44a2fbced6ceff7e695f37"
$SERPER_ENDPOINT = "https://google.serper.dev/search"

# 5118 API 配置
$API_5118_KEY = "EEF2A9EC12CF4EBDBF0059278ADCD8D0"
$API_5118_ENDPOINT = "http://apis.5118.com/keywordparam/v2"

# ==================== 函数 ====================

# Serper.dev 常规搜索
function Invoke-SerperSearch {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Query
    )

    $headers = @{
        "X-API-KEY" = $SERPER_API_KEY
        "Content-Type" = "application/json"
    }

    $body = @{
        q = $Query
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $SERPER_ENDPOINT -Method POST -Headers $headers -Body $body
        return $response
    }
    catch {
        Write-Host "❌ Serper 搜索失败: $_" -ForegroundColor Red
        return $null
    }
}

# Serper.dev Allintitle 搜索
function Invoke-SerperAllintitle {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Query
    )

    $headers = @{
        "X-API-KEY" = $SERPER_API_KEY
        "Content-Type" = "application/json"
    }

    $allintitleQuery = "allintitle:`"$Query`""
    $body = @{
        q = $allintitleQuery
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $SERPER_ENDPOINT -Method POST -Headers $headers -Body $body
        return $response
    }
    catch {
        Write-Host "❌ Serper Allintitle 搜索失败: $_" -ForegroundColor Red
        return $null
    }
}

# 5118 API 提交关键词（获取 taskid）
function Submit-5118Keywords {
    param(
        [Parameter(Mandatory=$true)]
        [string[]]$Keywords
    )

    $headers = @{
        "Authorization" = $API_5118_KEY
        "Content-Type" = "application/x-www-form-urlencoded; charset=UTF-8"
    }

    # URL 编码关键词（使用 .NET 的 Uri.EscapeDataString）
    $encodedKeywords = $Keywords | ForEach-Object {
        [System.Uri]::EscapeDataString($_)
    }
    $keywordsParam = $encodedKeywords -join "|"

    $body = "keywords=$keywordsParam"

    try {
        $response = Invoke-RestMethod -Uri $API_5118_ENDPOINT -Method POST -Headers $headers -Body $body
        return $response
    }
    catch {
        Write-Host "❌ 5118 提交失败: $_" -ForegroundColor Red
        return $null
    }
}

# 5118 API 获取结果（使用 taskid）
function Get-5118Results {
    param(
        [Parameter(Mandatory=$true)]
        [int]$TaskId
    )

    $headers = @{
        "Authorization" = $API_5118_KEY
        "Content-Type" = "application/x-www-form-urlencoded"
    }

    $body = "taskid=$TaskId"

    try {
        $response = Invoke-RestMethod -Uri $API_5118_ENDPOINT -Method POST -Headers $headers -Body $body
        return $response
    }
    catch {
        Write-Host "❌ 5118 获取结果失败: $_" -ForegroundColor Red
        return $null
    }
}

# 完整的关键词分析流程
function Invoke-KeywordAnalysis {
    param(
        [Parameter(Mandatory=$true)]
        [string[]]$Keywords
    )

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   Kingsway-Promotion 关键词分析工具" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan

    # 步骤 1: 提交到 5118
    Write-Host "[1/4] 提交关键词到 5118 API..." -ForegroundColor Yellow
    $submitResult = Submit-5118Keywords -Keywords $Keywords

    if ($submitResult -and $submitResult.errcode -eq "0") {
        $taskId = $submitResult.data.taskid
        Write-Host "✅ 提交成功，TaskId: $taskId" -ForegroundColor Green

        # 步骤 2: 等待并获取 5118 结果
        Write-Host "`n[2/4] 等待 5118 处理..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3

        $api5118Result = Get-5118Results -TaskId $taskId
        if ($api5118Result -and $api5118Result.errcode -eq "0") {
            Write-Host "✅ 5118 数据获取成功" -ForegroundColor Green

            # 显示 5118 结果
            Write-Host "`n========== 5118 搜索量数据 ==========`n" -ForegroundColor Cyan
            foreach ($keywordParam in $api5118Result.data.keyword_param) {
                Write-Host "关键词: $($keywordParam.keyword)" -ForegroundColor White
                Write-Host "  bidword_pcpv: $($keywordParam.bidword_pcpv)" -ForegroundColor Gray
                Write-Host "  月检索量: $($keywordParam.bidword_pcpv * 30)" -ForegroundColor Gray
                Write-Host "  长尾词数量: $($keywordParam.long_keyword_count)" -ForegroundColor Gray
                Write-Host ""
            }

            # 步骤 3: Serper 常规搜索
            Write-Host "`n[3/4] Serper 常规搜索..." -ForegroundColor Yellow
            foreach ($keyword in $Keywords) {
                $serperResult = Invoke-SerperSearch -Query $keyword
                if ($serperResult) {
                    $resultCount = if ($serperResult.searchInformation.totalResults) {
                        $serperResult.searchInformation.totalResults
                    } else {
                        "~" + ($serperResult.organic.Count * 10)
                    }
                    Write-Host "`n关键词: $keyword" -ForegroundColor White
                    Write-Host "  全网结果: $resultCount" -ForegroundColor Gray
                    Write-Host "  Top 3:" -ForegroundColor Gray
                    for ($i = 0; $i -lt [Math]::Min(3, $serperResult.organic.Count); $i++) {
                        Write-Host "    $($i + 1). $($serperResult.organic[$i].title)" -ForegroundColor Gray
                    }
                }
            }

            # 步骤 4: Serper Allintitle 搜索
            Write-Host "`n[4/4] Serper Allintitle 搜索..." -ForegroundColor Yellow
            Write-Host "`n========== Allintitle 竞争度数据 ==========`n" -ForegroundColor Cyan

            foreach ($keyword in $Keywords) {
                $allintitleResult = Invoke-SerperAllintitle -Query $keyword
                if ($allintitleResult) {
                    $allintitleCount = if ($allintitleResult.searchInformation.totalResults) {
                        [int]$allintitleResult.searchInformation.totalResults
                    } else {
                        $allintitleResult.organic.Count
                    }

                    # 计算对应的 bidword_pcpv
                    $matchedKeyword = $api5118Result.data.keyword_param | Where-Object { $_.keyword -eq $keyword }
                    $bidwordPcpv = if ($matchedKeyword) { $matchedKeyword.bidword_pcpv } else { 0 }
                    $monthlyVolume = $bidwordPcpv * 30

                    # 计算 KGR
                    $kgr = if ($monthlyVolume -gt 0) {
                        [math]::Round($allintitleCount / $monthlyVolume, 4)
                    } else {
                        "N/A"
                    }

                    Write-Host "关键词: $keyword" -ForegroundColor White
                    Write-Host "  Allintitle: $allintitleCount" -ForegroundColor Gray
                    Write-Host "  bidword_pcpv: $bidwordPcpv" -ForegroundColor Gray
                    Write-Host "  月检索量: $monthlyVolume" -ForegroundColor Gray
                    Write-Host "  KGR: $kgr" -ForegroundColor (
                        if ($kgr -ne "N/A" -and $kgr -lt 0.01) { "Green" }
                        elseif ($kgr -ne "N/A" -and $kgr -lt 0.05) { "Yellow" }
                        else { "Red" }
                    )

                    # 评级
                    $rating = switch ($allintitleCount) {
                        0 { "⭐⭐⭐⭐⭐ 蓝海冠军" }
                        { $_ -in 1..10 } { "⭐⭐⭐⭐ 可尝试" }
                        default { "⭐⭐⭐ 竞争较大" }
                    }
                    Write-Host "  结论: $rating" -ForegroundColor Cyan
                    Write-Host ""
                }
            }

            Write-Host "`n========================================" -ForegroundColor Cyan
            Write-Host "   分析完成！" -ForegroundColor Green
            Write-Host "========================================`n" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ 获取 5118 结果失败" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ 提交到 5118 失败" -ForegroundColor Red
    }
}

# ==================== 主程序 ====================

# 示例：分析单个关键词
function Test-SingleKeyword {
    param([string]$Keyword = "视频翻译软件")

    Invoke-KeywordAnalysis -Keywords @($Keyword)
}

# 示例：批量分析关键词
function Test-BatchKeywords {
    $keywords = @(
        "视频翻译软件"
        "视频翻译教程"
        "免费视频翻译"
        "在线视频翻译"
        "视频翻译哪家好"
    )

    Invoke-KeywordAnalysis -Keywords $keywords
}

# ==================== 导出函数 ====================

Export-ModuleMember -Function @(
    "Invoke-SerperSearch",
    "Invoke-SerperAllintitle",
    "Submit-5118Keywords",
    "Get-5118Results",
    "Invoke-KeywordAnalysis",
    "Test-SingleKeyword",
    "Test-BatchKeywords"
)

# ==================== 直接运行示例 ====================

# 取消下面的注释来直接运行测试
# Test-SingleKeyword -Keyword "视频翻译软件"
# Test-BatchKeywords
