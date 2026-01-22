# n8n Webhook 테스트 스크립트
# 사용법: .\test-webhook.ps1

$webhookUrl = "http://localhost:5678/webhook-test/article-ai"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "n8n Webhook 테스트" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 테스트 1: 번역
Write-Host "[테스트 1] 번역 기능 테스트..." -ForegroundColor Yellow

$translateBody = @{
    action = "translate"
    data = @{
        text = "Title: Contemporary Art Exhibition`n`nSummary: A groundbreaking exhibition featuring emerging artists."
        targetLang = "ko"
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method POST -ContentType "application/json; charset=utf-8" -Body $translateBody
    Write-Host "✓ 번역 테스트 성공!" -ForegroundColor Green
    Write-Host "응답:" -ForegroundColor Gray
    $response | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "✗ 번역 테스트 실패!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 테스트 2: 검색
Write-Host "[테스트 2] 검색 기능 테스트..." -ForegroundColor Yellow

$searchBody = @{
    action = "search_articles"
    data = @{
        query = "modern art exhibition"
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method POST -ContentType "application/json; charset=utf-8" -Body $searchBody
    Write-Host "✓ 검색 테스트 성공!" -ForegroundColor Green
    Write-Host "응답:" -ForegroundColor Gray
    $response | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "✗ 검색 테스트 실패!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "테스트 완료!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
