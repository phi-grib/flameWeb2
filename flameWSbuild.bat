x:
cd \soft\flameWeb2
@CALL ng build --deploy-url /static/ --base-Href /static/ --output-path=../flame_API/flame_api/static/
timeout /t 10 /nobreak > NUL
