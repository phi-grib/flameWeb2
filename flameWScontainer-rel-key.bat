x:
cd \soft\flameWeb2
xcopy \soft\flame_API\flame_api \soft\upf\flame_api /e /y
@CALL ng build --prod --configuration=rel-key --base-href /flame.kh.svc/ --deploy-url /flame.kh.svc/static/ --output-path=../upf/flame_api/static/
timeout /t 20 /nobreak > NUL
