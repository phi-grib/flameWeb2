x:
cd \soft\flameWeb2
copy \soft\flameWeb2\src\environments\loc-environment.ts \soft\flameWeb2\src\environments\environment.ts
copy \soft\flameWeb2\src\environments\loc-environment.prod.ts \soft\flameWeb2\src\environments\environment.prod.ts
@CALL ng build --prod --optimization=false --deploy-url /static/ --base-Href /static/ --output-path=../flame_API/flame_api/static/
timeout /t 10 /nobreak > NUL
