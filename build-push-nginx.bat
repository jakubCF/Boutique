@echo off
setlocal

REM Set image name
set IMAGE_NAME=jakubvlcek/boutique-nginx:latest
set COMPOSE_FILE=dev-compose.yaml

echo Building nginx service with Docker Compose...
docker compose -f %COMPOSE_FILE% build nginx
IF ERRORLEVEL 1 (
    echo Build failed.
    exit /b 1
)

echo Tagging image as %IMAGE_NAME%...
docker tag boutique-nginx %IMAGE_NAME%

echo Logging in to Docker Hub...
docker login
IF ERRORLEVEL 1 (
    echo Docker login failed.
    exit /b 1
)

echo Pushing image to Docker Hub...
docker push %IMAGE_NAME%
IF ERRORLEVEL 1 (
    echo Push failed.
    exit /b 1
)

echo Cleaning up unused images...
docker image prune -f

echo ✅ Successfully pushed %IMAGE_NAME%
endlocal
pause
