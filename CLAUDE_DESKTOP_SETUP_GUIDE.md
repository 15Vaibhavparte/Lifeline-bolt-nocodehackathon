# Claude Desktop Configuration - Step by Step Guide

## Step 1: Open the Claude Configuration Directory

1. **Press `Windows + R`** to open the Run dialog
2. **Type**: `%APPDATA%\Claude` and press Enter
3. **Alternative**: Open PowerShell and run:
   ```powershell
   explorer "%APPDATA%\Claude"
   ```

This will open the Claude configuration folder in Windows Explorer.

## Step 2: Create or Edit the Configuration File

### If the folder doesn't exist:
1. **Create the folder**: Right-click in Windows Explorer > New > Folder > Name it "Claude"
2. **Navigate into** the Claude folder

### If claude_desktop_config.json doesn't exist:
1. **Right-click** in the Claude folder
2. **Select** "New" > "Text Document"
3. **Rename** it from "New Text Document.txt" to `claude_desktop_config.json`
4. **Important**: Make sure to remove the .txt extension completely
5. **Click "Yes"** when Windows asks if you want to change the file extension

### If claude_desktop_config.json already exists:
1. **Right-click** on the file
2. **Select** "Open with" > "Notepad" (or your preferred text editor)

## Step 3: Add the Configuration

**Copy and paste this exact configuration** into the file:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "supabase-mcp",
      "env": {
        "SUPABASE_URL": "https://your-project-ref.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your_service_role_key_here"
      }
    }
  }
}
```

**Replace the placeholder values:**
- `https://your-project-ref.supabase.co` → Your actual Supabase project URL
- `your_service_role_key_here` → Your actual Service Role Key

## Step 4: Get Your Supabase Credentials

### Getting Your Supabase URL:
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project
4. Go to **Settings** (gear icon in sidebar)
5. Click **API**
6. Copy the **Project URL** (it looks like: `https://abcdefgh.supabase.co`)

### Getting Your Service Role Key:
1. In the same **Settings > API** page
2. Look for **Project API keys**
3. Find the **service_role** key (NOT the anon/public key!)
4. Click the **"Copy"** button or **eye icon** to reveal and copy it
5. ⚠️ **Warning**: This key has full database access - keep it secure!

## Step 5: Update the Configuration File

Your final configuration should look like this (with your actual values):

```json
{
  "mcpServers": {
    "supabase": {
      "command": "supabase-mcp",
      "env": {
        "SUPABASE_URL": "https://abcdefgh.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

## Step 6: Save and Restart Claude Desktop

1. **Save** the file (Ctrl+S in Notepad)
2. **Close** the text editor
3. **Close Claude Desktop** completely:
   - Right-click the Claude icon in the system tray (bottom-right corner)
   - Select "Quit" or "Exit"
   - Or use Task Manager to end the Claude process if needed
4. **Restart Claude Desktop** from your Start menu or desktop shortcut

## Step 7: Verify the Setup

Once Claude Desktop restarts:

1. **Look for confirmation** that the MCP server is connected (usually shown in the interface)
2. **Test by asking**: "Can you see my Supabase database?"
3. **Try a simple query**: "Show me all tables in my database"

## Troubleshooting

### File Extension Issues:
- Make sure the file is named `claude_desktop_config.json` (not .txt)
- In Windows Explorer: View > File name extensions (check this box to see extensions)

### JSON Format Issues:
- Use a JSON validator if you get errors: [jsonlint.com](https://jsonlint.com)
- Make sure all quotes are straight quotes (not curly quotes)
- Ensure all brackets and braces are properly matched

### Permission Issues:
- Make sure you have write permissions to the %APPDATA% folder
- Try running as administrator if needed

### Configuration Not Loading:
- Double-check the file path: `%APPDATA%\Claude\claude_desktop_config.json`
- Restart Claude Desktop completely
- Check Windows Event Viewer for any error messages

## Alternative: Using PowerShell Commands

If you prefer command line, you can set this up with PowerShell:

```powershell
# Create the Claude directory if it doesn't exist
$claudeDir = "$env:APPDATA\Claude"
if (!(Test-Path $claudeDir)) {
    New-Item -ItemType Directory -Path $claudeDir
}

# Create the config file
$configPath = "$claudeDir\claude_desktop_config.json"
$config = @{
    mcpServers = @{
        supabase = @{
            command = "supabase-mcp"
            env = @{
                SUPABASE_URL = "https://your-project-ref.supabase.co"
                SUPABASE_SERVICE_ROLE_KEY = "your_service_role_key_here"
            }
        }
    }
} | ConvertTo-Json -Depth 3

$config | Out-File -FilePath $configPath -Encoding UTF8

Write-Host "Configuration file created at: $configPath"
Write-Host "Remember to update the placeholder values with your actual Supabase credentials!"
```

## Security Reminder

🔒 **Important Security Notes:**
- The Service Role Key has full access to your database
- Never share this configuration file
- Never commit it to version control
- Consider using environment variables for additional security
- Regularly rotate your Service Role Key

---

After completing these steps, Claude Desktop will be able to interact with your Supabase database through the MCP server!
