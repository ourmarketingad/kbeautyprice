# 빌드 → 로컬 서버 → 전수 검사를 한 번에. 창(세션)이 쉬어도 터미널 탭에서 계속 돈다.
# 결과는 qa/last-run.txt 맨 끝 줄에 BUILD/QA 결과로 남는다.
$ErrorActionPreference = 'Continue'
Set-Location 'D:\아워마케팅\kbeautyprice'
$out = 'qa\last-run.txt'
"=== START $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Out-File $out -Encoding utf8

# 0) .next 를 붙잡고 있는 이전 프로세스 정리
Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -match 'kbeautyprice' -and $_.ProcessId -ne $PID } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 3
if (Test-Path '.next') { Remove-Item '.next' -Recurse -Force -ErrorAction SilentlyContinue }

# 1) 빌드
"--- BUILD ---" | Out-File $out -Append -Encoding utf8
& npx next build *>&1 | Tee-Object -FilePath 'qa\build.log' | Select-Object -Last 0
$buildExit = $LASTEXITCODE
"BUILD EXIT=$buildExit" | Out-File $out -Append -Encoding utf8
if ($buildExit -ne 0) {
  Get-Content 'qa\build.log' -Tail 30 | Out-File $out -Append -Encoding utf8
  "RESULT=BUILD_FAILED" | Out-File $out -Append -Encoding utf8
  exit 1
}

# 2) 로컬 서버 (4471 포트, 이 검사 전용)
$port = 4471
Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
$server = Start-Process -FilePath 'npx' -ArgumentList 'next','start','-p',"$port" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 15

# 3) 전수 검사
"--- QA ---" | Out-File $out -Append -Encoding utf8
& python -X utf8 qa\smoke.py "http://127.0.0.1:$port" *>&1 | Tee-Object -FilePath 'qa\smoke.log' | Select-Object -Last 0
$qaExit = $LASTEXITCODE
Get-Content 'qa\smoke.log' | Where-Object { $_ -match '^FAIL|^PASS ' } | Out-File $out -Append -Encoding utf8
"QA EXIT=$qaExit" | Out-File $out -Append -Encoding utf8

Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
if ($qaExit -eq 0) { "RESULT=OK" | Out-File $out -Append -Encoding utf8 } else { "RESULT=QA_FAILED" | Out-File $out -Append -Encoding utf8 }
"=== END $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Out-File $out -Append -Encoding utf8
