x:
cd \soft\flameWeb2
@CALL ng build --prod --deploy-url /static/ --base-Href /static/ --output-path=../flame_API/flame_api/static/
REM @CALL ng build --prod --configuration=aws --deploy-url /static/ --base-Href /static/ --output-path=../flame_API/flame_api/static/
timeout /t 20 /nobreak > NUL
