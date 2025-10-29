# Coolify MCP Enhanced Server

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/freqkflag/coolify-mcp-enhanced)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![Coolify](https://img.shields.io/badge/coolify-4.0%2B-orange.svg)](https://coolify.io/)

A comprehensive **Model Context Protocol (MCP) server** for complete Coolify infrastructure management. This enhanced server provides **50+ tools** for managing applications, databases, services, domains, SSL certificates, backups, and more through AI-assisted natural language commands.

## 🚀 Features

### **Complete Coolify Management**
- **50+ MCP Tools** for comprehensive infrastructure management
- **Application Management**: Deploy from Docker Compose, Dockerfile, Docker images, or public repositories
- **Database Management**: Full CRUD operations with backup support
- **Service Management**: 100+ pre-configured service types
- **Domain & SSL**: Complete domain and SSL certificate management
- **Monitoring**: System health and statistics
- **Backup Management**: Create, restore, and manage backups

### **Application Deployment**
- Deploy applications from Docker Compose files
- Deploy from Dockerfile configurations
- Deploy from Docker images
- Deploy from public Git repositories
- Environment variable management (CRUD + bulk operations)
- Application logs retrieval
- Start/stop/restart applications

### **Infrastructure Management**
- Server resource monitoring
- Project and environment management
- Database operations with backup support
- Domain configuration and SSL certificates
- Service deployment and management
- System health monitoring

## 📋 Prerequisites

- **Node.js** 18+ 
- **Coolify** instance running (4.0+)
- **Coolify API Token** with appropriate permissions

## 🛠️ Installation

### Option 1: NPM Package (Recommended)

```bash
npm install -g @freqkflag/coolify-mcp-enhanced
```

### Option 2: Clone Repository

```bash
git clone https://github.com/freqkflag/coolify-mcp-enhanced.git
cd coolify-mcp-enhanced
npm install
npm run build
```

### Option 3: Docker

```bash
docker run -d \
  --name coolify-mcp \
  -e COOLIFY_BASE_URL="https://your-coolify-instance.com" \
  -e COOLIFY_ACCESS_TOKEN="your-api-token" \
  freqkflag/coolify-mcp-enhanced:latest
```

## ⚙️ Configuration

### Environment Variables

```bash
export COOLIFY_BASE_URL="https://your-coolify-instance.com"
export COOLIFY_ACCESS_TOKEN="your-api-token"
```

### MCP Client Configuration

Add to your MCP configuration file (e.g., `mcp.json`):

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

### Local Installation Configuration

```json
{
  "mcpServers": {
    "coolify": {
      "command": "/usr/bin/node",
      "args": ["-u", "/path/to/coolify-mcp-enhanced/dist/index.js"],
      "env": {
        "COOLIFY_BASE_URL": "https://your-coolify-instance.com",
        "COOLIFY_ACCESS_TOKEN": "your-api-token"
      },
      "type": "stdio"
    }
  }
}
```

## 🎯 Usage Examples

### Server Management
```
"Show me all Coolify servers"
"Get details for server {uuid}"
"Validate server {uuid}"
"Show server resources for {uuid}"
```

### Project Management
```
"List all projects"
"Create a new project called 'my-webapp' with description 'My web application'"
"Update project {uuid} with new name 'updated-name'"
"Delete project {uuid}"
```

### Application Deployment
```
"Deploy application {uuid}"
"Create application from Docker Compose with project {project_uuid} and server {server_uuid}"
"Start application {uuid}"
"Stop application {uuid}"
"Restart application {uuid}"
"Show logs for application {uuid}"
```

### Environment Variables
```
"Get environment variables for application {uuid}"
"Add environment variable KEY=VALUE to application {uuid}"
"Update environment variable {env_uuid} for application {uuid}"
"Delete environment variable {env_uuid} from application {uuid}"
```

### Database Management
```
"List all databases"
"Create database {type} with name {name}"
"Update database {uuid} configuration"
"Create backup for database {uuid}"
"Restore database from backup {backup_uuid}"
```

### Domain & SSL Management
```
"List all domains"
"Create domain {name} for application {uuid}"
"Create SSL certificate for domain {uuid}"
"Update domain {uuid} configuration"
```

### Service Management
```
"List all services"
"Create {service_type} service for project {project_uuid}"
"Deploy service {uuid}"
"Delete service {uuid}"
```

## 📚 Available Tools

### Server Management (5 tools)
- `list_servers` - List all Coolify servers
- `get_server` - Get server details
- `get_server_resources` - Get server resource usage
- `get_server_domains` - Get server domains
- `validate_server` - Validate server configuration

### Project Management (6 tools)
- `list_projects` - List all projects
- `get_project` - Get project details
- `create_project` - Create new project
- `update_project` - Update existing project
- `delete_project` - Delete project
- `get_project_environment` - Get project environment details

### Application Management (8 tools)
- `list_applications` - List all applications
- `get_application` - Get application details
- `create_application_dockercompose` - Create from Docker Compose
- `create_application_dockerfile` - Create from Dockerfile
- `create_application_dockerimage` - Create from Docker image
- `create_application_public` - Create public application
- `update_application` - Update application
- `delete_application` - Delete application

### Application Deployment (4 tools)
- `deploy_application` - Deploy application
- `restart_application` - Restart application
- `start_application` - Start application
- `stop_application` - Stop application

### Environment Variables (5 tools)
- `get_application_envs` - Get environment variables
- `create_application_env` - Create environment variable
- `update_application_env` - Update environment variable
- `update_application_envs_bulk` - Bulk update environment variables
- `delete_application_env` - Delete environment variable

### Application Logs (1 tool)
- `get_application_logs` - Get application logs with configurable line count

### Database Management (5 tools)
- `list_databases` - List all databases
- `get_database` - Get database details
- `update_database` - Update database configuration
- `delete_database` - Delete database with cleanup options
- `get_database_backups` - Get database backups

### Service Management (4 tools)
- `list_services` - List all services
- `get_service` - Get service details
- `create_service` - Create new service (100+ service types supported)
- `delete_service` - Delete service with cleanup options

### Domain Management (5 tools)
- `list_domains` - List all domains
- `get_domain` - Get domain details
- `create_domain` - Create new domain
- `update_domain` - Update domain configuration
- `delete_domain` - Delete domain

### SSL Certificate Management (4 tools)
- `list_ssl_certificates` - List SSL certificates
- `get_ssl_certificate` - Get certificate details
- `create_ssl_certificate` - Create SSL certificate
- `delete_ssl_certificate` - Delete SSL certificate

### Monitoring & Health (2 tools)
- `get_system_health` - Get system health status
- `get_system_stats` - Get system statistics

### Backup Management (4 tools)
- `list_backups` - List all backups
- `create_backup` - Create backup
- `restore_backup` - Restore from backup
- `delete_backup` - Delete backup

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- TypeScript

### Setup
```bash
git clone https://github.com/freqkflag/coolify-mcp-enhanced.git
cd coolify-mcp-enhanced
npm install
```

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Development Mode
```bash
npm run dev
```

## 📖 API Documentation

The MCP server provides comprehensive access to Coolify's API endpoints:

- **Applications API**: Complete application lifecycle management
- **Databases API**: Database operations and backup management
- **Services API**: Service deployment and management
- **Domains API**: Domain and SSL certificate management
- **Projects API**: Project and environment management
- **Servers API**: Server monitoring and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Coolify](https://coolify.io/) - The amazing self-hosted deployment platform
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol that makes this possible
- [StuMason](https://github.com/StuMason) - Original Coolify MCP server inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/freqkflag/coolify-mcp-enhanced/issues)
- **Discussions**: [GitHub Discussions](https://github.com/freqkflag/coolify-mcp-enhanced/discussions)
- **Documentation**: [Wiki](https://github.com/freqkflag/coolify-mcp-enhanced/wiki)

## 🔗 Links

- [Coolify Documentation](https://coolify.io/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)

---

**Made with ❤️ for the Coolify community**