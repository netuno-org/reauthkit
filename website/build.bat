copy /y "src\config\_production_config.json" "src\config\config.json"

call npm install

call npm run build

copy /y "src\config\_development_config.json" "src\config\config.json"

pause
exit