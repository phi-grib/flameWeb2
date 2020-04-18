@echo off
@CALL "%userprofile%\Anaconda3\Library\bin\conda.bat" activate flame
x:
cd \soft\flameWeb2
@CALL ng serve
