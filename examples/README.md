# Coolify MCP Enhanced Server Examples

This directory contains practical examples of using the Coolify MCP Enhanced Server for various deployment scenarios.

## 📁 Examples Overview

- **[Basic Setup](basic-setup.md)** - Getting started with the MCP server
- **[Application Deployment](application-deployment.md)** - Deploying applications from various sources
- **[Database Management](database-management.md)** - Managing databases and backups
- **[Service Management](service-management.md)** - Deploying and managing services
- **[Domain & SSL](domain-ssl.md)** - Setting up domains and SSL certificates
- **[Monitoring](monitoring.md)** - System monitoring and health checks
- **[Backup Management](backup-management.md)** - Backup and restore operations

## 🚀 Quick Start Examples

### Deploy a Simple Web Application

```bash
# Using Docker Compose
"Create application from Docker Compose with project {project_uuid} and server {server_uuid}, name 'my-webapp', docker_compose_raw '{version: \"3.8\", services: {web: {image: \"nginx:alpine\", ports: [\"80:80\"]}}}'"

# Using Docker Image
"Create application from Docker image with project {project_uuid} and server {server_uuid}, name 'my-app', docker_image 'nginx:alpine'"

# Using Public Repository
"Create public application with project {project_uuid} and server {server_uuid}, name 'my-app', git_repository 'https://github.com/user/repo.git'"
```

### Manage Environment Variables

```bash
# Add environment variable
"Add environment variable DATABASE_URL=postgresql://user:pass@host:5432/db to application {uuid}"

# Bulk update environment variables
"Update environment variables for application {uuid} with envs [{'key': 'NODE_ENV', 'value': 'production'}, {'key': 'PORT', 'value': '3000'}]"
```

### Database Operations

```bash
# Create database
"Create database postgresql with name 'my-db'"

# Create backup
"Create backup for database {uuid}"

# Restore from backup
"Restore database from backup {backup_uuid}"
```

## 📖 Detailed Examples

Each example file contains:
- **Prerequisites** - What you need before starting
- **Step-by-step instructions** - Detailed walkthrough
- **Expected results** - What you should see
- **Troubleshooting** - Common issues and solutions
- **Next steps** - What to do after completion

## 🔧 Configuration Examples

### MCP Client Configuration

#### Cursor IDE
```json
{
  "mcpServers": {
    "coolify": {
      "command": "npx",
      "args": ["-y", "@freqkflag/coolify-mcp-enhanced"],
      "env": {
        "COOLIFY_BASE_URL": "https://your-coolify-instance.com",
        "COOLIFY_ACCESS_TOKEN": "your-api-token"
      },
      "type": "stdio"
    }
  }
}
```

#### Claude Desktop
```json
{
  "mcpServers": {
    "coolify": {
      "command": "npx",
      "args": ["-y", "@freqkflag/coolify-mcp-enhanced"],
      "env": {
        "COOLIFY_BASE_URL": "https://your-coolify-instance.com",
        "COOLIFY_ACCESS_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Docker Configuration

```yaml
version: '3.8'
services:
  coolify-mcp:
    image: freqkflag/coolify-mcp-enhanced:latest
    environment:
      - COOLIFY_BASE_URL=https://your-coolify-instance.com
      - COOLIFY_ACCESS_TOKEN=your-api-token
    restart: unless-stopped
```

## 🎯 Use Cases

### Development Workflow
1. **Create Project** - Set up a new project
2. **Deploy Application** - Deploy your development app
3. **Configure Environment** - Set up environment variables
4. **Monitor Logs** - Check application logs
5. **Update Application** - Deploy new versions

### Production Deployment
1. **Create Production Environment** - Set up production project
2. **Deploy Application** - Deploy production app
3. **Configure Domain** - Set up custom domain
4. **Enable SSL** - Configure SSL certificate
5. **Set up Monitoring** - Monitor system health
6. **Create Backups** - Set up backup strategy

### Database Management
1. **Create Database** - Set up database instance
2. **Configure Access** - Set up database access
3. **Create Backups** - Schedule regular backups
4. **Monitor Performance** - Track database metrics
5. **Restore if Needed** - Restore from backups

## 🤝 Contributing Examples

We welcome contributions of new examples! Please:

1. Create a new markdown file in this directory
2. Follow the existing format and structure
3. Include prerequisites, steps, and expected results
4. Test your example thoroughly
5. Submit a pull request

## 📞 Support

If you need help with any examples:
- Check the [troubleshooting section](troubleshooting.md)
- Open an [issue](https://github.com/freqkflag/coolify-mcp-enhanced/issues)
- Join our [discussions](https://github.com/freqkflag/coolify-mcp-enhanced/discussions)
