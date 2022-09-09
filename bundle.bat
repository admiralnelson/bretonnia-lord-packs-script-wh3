call npx tstl
robocopy . script *.lua /s /V /XD .git script node_modules .vscode /XF *.ts
mkdir script\_lib
move script\lualib_bundle.lua script\_lib\lualib_bundle.lua
del /s campaign\mod\*.lua
del /s battle\mod\*.lua
del *.lua