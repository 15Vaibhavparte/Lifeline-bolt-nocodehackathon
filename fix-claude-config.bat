@echo off
echo 🔧 Fixing Claude Desktop MCP Configuration...
echo.

REM Navigate to Claude directory
cd /d "%APPDATA%\Claude"

REM Backup existing config if it exists
if exist "claude_desktop_config.json" (
    echo 📋 Backing up existing config...
    copy "claude_desktop_config.json" "claude_desktop_config.json.backup"
)

REM Create clean configuration
echo 📝 Creating clean configuration...
(
echo {
echo   "mcpServers": {
echo     "supabase": {
echo       "command": "npx",
echo       "args": ["supabase-mcp"],
echo       "env": {
echo         "SUPABASE_URL": "REPLACE_WITH_YOUR_SUPABASE_URL",
echo         "SUPABASE_SERVICE_ROLE_KEY": "REPLACE_WITH_YOUR_SERVICE_ROLE_KEY"
echo       }
echo     }
echo   }
echo }
) > "claude_desktop_config.json"

echo ✅ Configuration created successfully!
echo 📍 Location: %APPDATA%\Claude\claude_desktop_config.json
echo.
echo 🔧 Next steps:
echo 1. Edit the configuration file with your actual Supabase credentials
echo 2. Replace REPLACE_WITH_YOUR_SUPABASE_URL with your project URL
echo 3. Replace REPLACE_WITH_YOUR_SERVICE_ROLE_KEY with your service role key
echo 4. Close Claude Desktop completely (check system tray)
echo 5. Restart Claude Desktop
echo.
echo 🔑 Get credentials from: https://supabase.com/dashboard
echo    Settings → API → Project URL and service_role key
echo.

REM Open the file for editing
echo 📝 Opening configuration file for editing...
notepad "claude_desktop_config.json"

echo.
echo 🚀 After editing, restart Claude Desktop completely!
pause