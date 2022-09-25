@ECHO OFF

setlocal enabledelayedexpansion

if not exist runtime\JSON.lua (
    call powershell "[Reflection.Assembly]::LoadWithPartialName("""System.Windows.Forms""");[Windows.Forms.MessageBox]::show("""Cannot find hardcoded reference to runtime\JSON.lua, it doesn't exist""", """Compilation Error""", 0, 16)" > NUL
    goto :pause
)

call npx tstl
if %ERRORLEVEL% NEQ 0 (
    call powershell "[Reflection.Assembly]::LoadWithPartialName("""System.Windows.Forms""");[Windows.Forms.MessageBox]::show("""Please check the console log""", """Compilation Error""", 0, 16)" > NUL
    goto :pause
)



robocopy script *.lua /s /V /XD .git script node_modules .vscode /XF *.ts > NUL
copy runtime\*.* script\campaign\mod > NUL
mkdir script\_lib 2> NUL
rem move script\lualib_bundle.lua script\_lib\lualib_bundle.lua > NUL
echo checking for unsupported Typescript construct such as new Array
findstr /s /n /r "__TS__New\(Array." script\*.*
if %ERRORLEVEL% NEQ 1 (
    call powershell "[Reflection.Assembly]::LoadWithPartialName("""System.Windows.Forms""");[Windows.Forms.MessageBox]::show("""new Array is not supported""", """Please check the console log""", 0, 16)" > NUL
    goto :pause
) else (
    echo Didn't find any.
)

echo checking for unsupported Typescript construct such as RegExp
findstr /s /n /r "RegExp" script\*.*
if %ERRORLEVEL% NEQ 1 (
    call powershell "[Reflection.Assembly]::LoadWithPartialName("""System.Windows.Forms""");[Windows.Forms.MessageBox]::show("""RegExp is not supported yet""", """Please check the console log""", 0, 16)" > NUL
    goto :pause
) else (
    echo Didn't find any.
)


:pause
pause

