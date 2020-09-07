x:
cd \soft\flameWeb2
xcopy \soft\flame_API\flame_api \soft\FlameDocker\flame_api /e /y
@CALL ng build --configuration=test --base-href /flame.kh.svc/ --deploy-url /flame.kh.svc/static/ --output-path=../FlameDocker/flame_api/static/
timeout /t 20 /nobreak > NUL
