x:
cd \soft\flameWeb2
xcopy \soft\flame_API\flame_api \soft\FlameDockerAWS\flame_api /e /y
@CALL ng build --prod --configuration=rel-key --base-href /flame.kh.svc/ --deploy-url /flame.kh.svc/static/ --output-path=../FlameDockerAWS/flame_api/static/
cd \soft\FlameDockerAWS\flame_api\static
move assets ..
xcopy \soft\FlameDockerAWS\secrets\keycloak.json \soft\FlameDockerAWS\flame_api\secrets /e /y
timeout /t 20 /nobreak > NUL
