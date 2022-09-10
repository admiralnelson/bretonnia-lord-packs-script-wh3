call npx tstl
robocopy script *.lua /s /V /XD .git script node_modules .vscode /XF *.ts
copy runtime\*.* script\campaign\mod
mkdir script\_lib
move script\lualib_bundle.lua script\_lib\lualib_bundle.lua