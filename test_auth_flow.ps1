$loginBody = @{ identifier = 'AGRO'; password = 'Owner@123' } | ConvertTo-Json
$webSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession

$login = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json' -WebSession $webSession
Write-Host "Login Status:" $login.StatusCode
Write-Host "Cookies:" ($webSession.Cookies.GetCookies('http://localhost:3000') | Select-Object Name, Value | Format-Table -HideTableHeaders | Out-String).Trim()

$adminReq = Invoke-WebRequest -Uri 'http://localhost:3000/admin' -Method Get -WebSession $webSession -MaximumRedirection 0 -ErrorAction SilentlyContinue
Write-Host "Admin Page Access with Auth Cookie:" $adminReq.StatusCode
