@echo off
echo ========================================
echo    ANGULAR PROJECT - QUICK TEST
echo ========================================
echo.
echo Testing TypeScript compilation...
call npx tsc -p tsconfig.app.json --noEmit
if %ERRORLEVEL% EQU 0 (
    echo [32m? TypeScript: PASSED[0m
) else (
    echo [31m? TypeScript: FAILED[0m
    exit /b 1
)
echo.
echo ========================================
echo All checks passed! Your code is working.
echo ========================================
echo.
echo To run the app:
echo   ng serve
echo.
echo Then open: http://localhost:4200
echo ========================================
