@echo off
chcp 65001
echo Starting build process...

echo Reading version from package.json...

:: Initialize to the default version.
set VERSION=0.0.0

:: Check if the file exists.
if exist package.json (
    for /f "delims=" %%a in ('powershell -Command "try { $json = Get-Content package.json | ConvertFrom-Json; if ($json.version) { $json.version } else { '0.0.0' } } catch { '0.0.0' }"') do (
        set VERSION=%%a
    )
) else (
    echo package.json not found, using default version 0.0.0
)

echo Version: %VERSION%

endlocal & set VERSION=%VERSION%



echo Checking if image files exist and removing them...
if exist tngs-web-dev-%VERSION%.tar (
    echo Removing existing tngs-web-dev-%VERSION%.tar file...
    del /f tngs-web-dev-%VERSION%.tar
)
if exist tngs-web-test-%VERSION%.tar (
    echo Removing existing tngs-web-test-%VERSION%.tar file...
    del /f tngs-web-test-%VERSION%.tar
)
if exist tngs-web-prod-%VERSION%.tar (
    echo Removing existing tngs-web-prod-%VERSION%.tar file...
    del /f tngs-web-prod-%VERSION%.tar
)

:: Clean up old files without version
if exist tngs-web-local.tar (
    echo Removing old tngs-web-local.tar file...
    del /f tngs-web-local.tar
)
if exist tngs-web-dev.tar (
    echo Removing old tngs-web-dev.tar file...
    del /f tngs-web-dev.tar
)
if exist tngs-web-test.tar (
    echo Removing old tngs-web-test.tar file...
    del /f tngs-web-test.tar
)
if exist tngs-web-prod.tar (
    echo Removing old tngs-web-prod.tar file...
    del /f tngs-web-prod.tar
)

:: echo Building local environment image...
:: docker build --build-arg ENV=loc --no-cache -t tngs-web-local:%VERSION% .

echo Building development environment image...
docker build --build-arg ENV=dev --no-cache -t tngs-web-dev:%VERSION% .

echo Building test environment image...
docker build --build-arg ENV=sandbox --no-cache -t tngs-web-test:%VERSION% .

echo Building prod environment image...
docker build --build-arg ENV=production --no-cache -t tngs-web-prod:%VERSION% .

:: echo Saving local environment image...
:: docker save -o tngs-web-local-%VERSION%.tar tngs-web-local:%VERSION%

echo Saving development environment image...
docker save -o tngs-web-dev-%VERSION%.tar tngs-web-dev:%VERSION%

echo Saving test environment image...
docker save -o tngs-web-test-%VERSION%.tar tngs-web-test:%VERSION%

echo Saving prod environment image...
docker save -o tngs-web-prod-%VERSION%.tar tngs-web-prod:%VERSION%

:: echo Removing local environment image...
:: docker rmi -f tngs-web-local:%VERSION%

:: echo Removing development environment image...
:: docker rmi -f tngs-web-dev:%VERSION%

:: echo Removing test environment image...
:: docker rmi -f tngs-web-test:%VERSION%

:: echo Loading local environment image...
:: docker load -i tngs-web-local-%VERSION%.tar

:: echo Loading development environment image...
:: docker load -i tngs-web-dev-%VERSION%.tar

:: echo Loading test environment image...
:: docker load -i tngs-web-test-%VERSION%.tar

:: echo Starting local environment container...
:: docker run -d -p 8086:80 --name tngs-web-local-%VERSION% tngs-web-local:%VERSION%

:: echo Starting development environment container...
:: docker run -d -p 8090:80 --name tngs-web-container-dev-%VERSION% tngs-web-dev:%VERSION%

:: echo Starting test environment container...
:: docker run -d -p 8091:80 --name tngs-web-container-test-%VERSION% tngs-web-test:%VERSION%

echo Build process completed successfully!
echo Generated images:
echo - tngs-web-dev:%VERSION%
echo - tngs-web-test:%VERSION%
echo - tngs-web-prod:%VERSION%
echo Generated files:
echo - tngs-web-dev-%VERSION%.tar
echo - tngs-web-test-%VERSION%.tar
echo - tngs-web-prod-%VERSION%.tar
pause
