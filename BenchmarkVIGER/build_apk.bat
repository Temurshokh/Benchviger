@echo off
setlocal EnableDelayedExpansion

echo ============================================================
echo  BenchVIGER - One-Command Android APK Builder
echo ============================================================
echo.

REM ?? Step 1: Check for JDK 17+ ????????????????????????????????
echo [1/4] Checking Java version...
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VER=%%g
)
echo Found Java: %JAVA_VER%

REM Check if version is 8 or earlier (jre-1.8 style)
echo %JAVA_VER% | findstr /c:"1.8" /c:"1.7" /c:"1.6" >nul
if not errorlevel 1 (
    echo [WARN] Java 8 detected. Android Gradle Plugin 8.x requires Java 11+.
    echo [INFO] Installing JDK 17 via winget...
    winget install --id EclipseAdoptium.Temurin.17.JDK -e --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo [ERROR] winget install failed. Please install JDK 17 manually:
        echo         https://adoptium.net/temurin/releases/?version=17
        echo         Then re-run this script.
        pause
        exit /b 1
    )
    REM Refresh PATH to pick up new JDK
    for /f "delims=" %%i in ('where java') do set JAVA_EXE=%%i
    echo [OK] JDK 17 installed.
)

REM ?? Step 2: Check for Android SDK ???????????????????????????
echo.
echo [2/4] Checking Android SDK...
if not defined ANDROID_HOME (
    if exist "%LOCALAPPDATA%\Android\Sdk" (
        set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
        echo [OK] Found SDK at %ANDROID_HOME%
    ) else (
        echo [WARN] ANDROID_HOME is not set and SDK not found at default path.
        echo        Please install Android Studio or set ANDROID_HOME manually.
        echo        Download: https://developer.android.com/studio
        echo.
        echo        Alternatively, install the command-line tools only:
        echo        https://developer.android.com/studio#command-line-tools-only
        pause
        exit /b 1
    )
)

REM ?? Step 3: Vite build + Capacitor sync ?????????????????????
echo.
echo [3/4] Building web assets ^& syncing to Android...
call npm run build
if errorlevel 1 (
    echo [ERROR] Vite build failed.
    pause
    exit /b 1
)
call npx cap sync android
if errorlevel 1 (
    echo [ERROR] Capacitor sync failed.
    pause
    exit /b 1
)

REM ?? Step 4: Gradle assembleDebug ????????????????????????????
echo.
echo [4/4] Compiling Android APK (this may take a few minutes)...
cd android
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo.
    echo [ERROR] Gradle build failed. Check output above for details.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ============================================================
echo  SUCCESS! APK built at:
echo  android\app\build\outputs\apk\debug\app-debug.apk
echo ============================================================
echo.
echo  To install on a connected device:
echo    adb install android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
