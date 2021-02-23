x:
cd \soft\flameWeb2
@CALL ng build --prod --configuration=build --deploy-url /static/ --base-Href /static/ --output-path=../flame_API/flame_api/static/
timeout /t 20 /nobreak > NUL
