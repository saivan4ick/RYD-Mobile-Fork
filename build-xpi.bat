@echo off
setlocal
cd /d "%~dp0"
if exist return-youtube-dislike.zip del /f /q return-youtube-dislike.zip
if exist return-youtube-dislike.xpi del /f /q return-youtube-dislike.xpi
powershell -NoProfile -Command "Compress-Archive -Path 'content-style.css', 'manifest.json', 'menu-fixer.js', 'popup.css', 'popup.html', 'popup.js', 'ryd.background.js', 'ryd.changelog.js', 'ryd.content-script.js', 'icons', 'images', '_locales' -DestinationPath 'return-youtube-dislike.zip' -Force; Move-Item -Path 'return-youtube-dislike.zip' -Destination 'return-youtube-dislike.xpi' -Force"
if exist return-youtube-dislike.xpi (
    echo [SUCCESS] File return-youtube-dislike.xpi created successfully!
) else (
    echo [ERROR] Failed to create package.
)
pause
