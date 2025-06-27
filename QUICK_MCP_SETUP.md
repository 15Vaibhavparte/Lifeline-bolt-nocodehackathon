# Supabase MCP Server Quick Setup Guide

## Step 1: Install the Supabase MCP Server

```powershell
# Install globally (recommended)
npm run mcp:install

# Or install locally
npm install @supabase/mcp-server
```

## Step 2: Configure Environment Variables

1. Copy the template file:
```powershell
copy .env.mcp.template .env.mcp
```

2. Edit `.env.mcp` with your actual Supabase credentials:
   - Get your Supabase URL from: Dashboard > Settings > API
   - Get your Service Role Key from: Dashboard > Settings > API > service_role

## Step 3: Test Local MCP Server

```powershell
# Test the configuration
npm run mcp:test

# Start the MCP server locally
npm run mcp:start
```

## Step 4: Configure Claude Desktop

1. Open the Claude Desktop config file location:
```powershell
# Open the config directory
explorer "%APPDATA%\Claude"
```

2. If `claude_desktop_config.json` doesn't exist, create it

3. Copy the content from `claude_desktop_config_template.json` and update with your credentials

4. Restart Claude Desktop

## Step 5: Test the Integration

Once configured, you can test in Claude Desktop by asking:

- "Show me my database tables"
- "What's the structure of my blood_donors table?"
- "Find all blood donors with O+ blood type"

## Configuration File Locations

- **Environment Variables**: `.env.mcp` (in your project root)
- **Claude Desktop Config**: `%APPDATA%\Claude\claude_desktop_config.json`
- **MCP Startup Script**: `start-mcp.js` (in your project root)

## Troubleshooting

### Common Issues:

1. **"Command not found" error**:
   ```powershell
   npm run mcp:install
   ```

2. **"Connection failed" error**:
   - Check your Supabase URL and Service Role Key
   - Ensure your Supabase project is active

3. **"Permission denied" error**:
   - Make sure you're using the Service Role Key (not Anon Key)
   - Check your database RLS policies

### Debug Mode:

Start the MCP server with debug output:
```powershell
npx @supabase/mcp-server-supabase --url YOUR_URL --service-role-key YOUR_KEY --debug
```

## Security Notes

⚠️ **Important**: 
- Never commit `.env.mcp` to version control
- Use Service Role Key for MCP server (full database access)
- Use Anon Key for client-side operations (limited access)
- The Service Role Key bypasses Row Level Security (RLS)

## Next Steps

Once everything is working:

1. Explore your database schema through Claude
2. Ask Claude to help with complex queries
3. Use Claude for data analysis and insights
4. Create automated reports and summaries

For more detailed information, see `README_SUPABASE_MCP_SETUP.md`
