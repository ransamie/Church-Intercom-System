@echo off
title Church Intercom Server
color 0A
cls

echo ---------------------------------------------------
echo    CHURCH INTERCOM SYSTEM - PORTABLE (REALTIME)
echo ---------------------------------------------------
echo.
echo Searching for Wi-Fi IP Address...

:: 1. RUN POWERSHELL TO GET THE IP AND STORE IT IN A VARIABLE
FOR /F "tokens=*" %%g IN ('powershell -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -match 'Wi-Fi' -or $_.InterfaceAlias -match 'Wireless'} | Select-Object -ExpandProperty IPAddress -First 1"') do (SET SERVER_IP=%%g)

:: 2. CHECK IF WE FOUND AN IP
IF "%SERVER_IP%"=="" (
    echo.
    echo [ERROR] Could not auto-detect Wi-Fi IP.
    echo Please check your connection or use 'ipconfig'.
    echo.
) ELSE (
    echo.
    echo SUCCESS! Server is launching on:
    echo.
    echo ===================================================
    echo      https://%SERVER_IP%:3000
    echo ===================================================
    echo.
    echo Enter the link above in your browser.
    echo.
)

:: 3. LAUNCH THE SERVER
echo Starting server via Node.js...
node index.js

pause