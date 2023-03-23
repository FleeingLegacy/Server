@ECHO OFF
@TITLE mitmproxy runner for FleeingLegacy
@COLOR F

PUSHD %~dp0
SET MITMPROXY_DIR=K:\GSCBT1workspace\mitmproxy
SET COMMANDLINE=%MITMPROXY_DIR%\mitmproxy.exe -s .\proxy.py -k --allow-hosts ".*\.mihoyo\.com|.*\.yuanshen\.com|41\.103\.71\.252" --set console_focus_follow=true --set console_mouse=false --set rawtcp=true

ECHO Setting internet proxy to mitmproxy
REG ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f
REG ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /t REG_SZ /d "http://localhost:8080" /f

ECHO.
ECHO *** You can minimize this runner cmd window
ECHO *** If mitmproxy window has shown
START /WAIT CMD.exe /C %COMMANDLINE%
ECHO.

ECHO Clearing internet proxy
REG ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f
REG ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /t REG_SZ /d "" /f

PING -n 3 localhost >nul
POPD