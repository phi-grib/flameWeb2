x:
cd \soft\flameWeb2
xcopy \soft\flame_API\flame_api \soft\upf\flame_api /e /y
@CALL ng build --prod --configuration=exp-key --base-href /flameexp.kh.svc/ --deploy-url /flameexp.kh.svc/static/ --output-path=../upf/flame_api/static/
timeout /t 20 /nobreak > NUL
