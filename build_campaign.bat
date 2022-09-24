@ECHO OFF

setlocal enabledelayedexpansion

if not exist runtime\JSON.lua (
    call powershell "[Reflection.Assembly]::LoadWithPartialName("""System.Windows.Forms""");[Windows.Forms.MessageBox]::show("""Cannot find hardcoded reference to runtime\JSON.lua, it doesn't exist""", """Compilation Error""", 0, 16)" > NUL
    goto :eof
)

call npx tstl
if %ERRORLEVEL% NEQ 0 (
    call powershell "[Reflection.Assembly]::LoadWithPartialName("""System.Windows.Forms""");[Windows.Forms.MessageBox]::show("""Please check the console log""", """Compilation Error""", 0, 16)" > NUL
    goto :eof
)
robocopy script *.lua /s /V /XD .git script node_modules .vscode /XF *.ts > NUL
copy runtime\*.* script\campaign\mod > NUL
mkdir script\_lib 2> NUL
move script\lualib_bundle.lua script\_lib\lualib_bundle.lua > NUL

pause