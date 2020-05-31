x:
cd \soft\flameWeb2
copy \soft\flameWeb2\src\environments\th-environment.ts \soft\flameWeb2\src\environments\environment.ts
copy \soft\flameWeb2\src\environments\th-environment.prod.ts \soft\flameWeb2\src\environments\environment.prod.ts
@CALL ng build --base-href /flame.kh.svc/ --deploy-url /flame.kh.svc/static/ --output-path=../flame_API/flame_api/static/
xcopy \soft\flame_API\flame_api \soft\FlameDocker\flame_api /e /y
timeout /t 10 /nobreak > NUL
