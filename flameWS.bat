@echo off
@CALL "%userprofile%\miniconda3\Library\bin\conda.bat" activate flame
x:
cd \soft\flameWeb2
@CALL ng serve
