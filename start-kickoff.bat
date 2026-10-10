@echo off
setlocal
cd /d "%~dp0"

:menu
echo.
echo  Kickoff
echo  1. Pokreni aplikaciju u pregledniku
echo  2. Pronađi APK datoteku
echo  3. Pronađi ZIP projekta
echo  4. Izlaz
choice /c 1234 /n /m "Odaberi opciju: "
if errorlevel 4 exit /b
if errorlevel 3 goto zip
if errorlevel 2 goto apk
if errorlevel 1 goto browser

:browser
start "Kickoff web server" /D "%~dp0" cmd /K "npm run dev -- --host 127.0.0.1"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"
goto menu

:apk
set "APK=%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
if not exist "%APK%" (
  echo APK nije pronađen. Prvo pokreni: npm run android:apk
  pause
  goto menu
)
explorer /select,"%APK%"
goto menu

:zip
set "ZIP=%~dp0matchday-project.zip"
if not exist "%ZIP%" (
  echo ZIP nije pronađen. Prvo pokreni: npm run zip
  pause
  goto menu
)
explorer /select,"%ZIP%"
goto menu
