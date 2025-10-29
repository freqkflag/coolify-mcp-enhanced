# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-10-29

### Added
- **50+ comprehensive MCP tools** for complete Coolify management
- **Application Management**: Full CRUD operations for applications
  - Deploy from Docker Compose files
  - Deploy from Dockerfile configurations
  - Deploy from Docker images
  - Deploy from public Git repositories
- **Application Deployment Controls**:
  - Deploy applications
  - Start/stop/restart applications
  - Application logs retrieval with configurable line count
- **Environment Variable Management**:
  - Get application environment variables
  - Create/update/delete environment variables
  - Bulk update environment variables
- **Enhanced Database Management**:
  - Database backup support
  - Database restore operations
  - Complete database lifecycle management
- **Domain & SSL Management**:
  - Domain configuration and management
  - SSL certificate creation and management
  - Domain-application associations
- **Service Management**:
  - Support for 100+ pre-configured service types
  - Service deployment and management
  - Service cleanup options
- **Monitoring & Health**:
  - System health status monitoring
  - System statistics retrieval
- **Backup Management**:
  - Create backups for applications and databases
  - Restore from backups
  - Backup listing and management
- **Comprehensive API Coverage**: Complete coverage of Coolify's 94 API endpoints
- **Docker Support**: Containerized deployment with Dockerfile
- **CI/CD Pipeline**: GitHub Actions workflow for testing, building, and publishing
- **Enhanced Documentation**: Comprehensive README with examples and usage guides
- **TypeScript Support**: Full TypeScript implementation with proper type definitions

### Changed
- **Version bumped** from 0.1.18 to 0.2.0
- **Package name** changed to `@freqkflag/coolify-mcp-enhanced`
- **Enhanced error handling** with better error messages and validation
- **Improved client architecture** with 50+ new API methods
- **Updated dependencies** to latest stable versions

### Fixed
- **Environment variable naming**: Fixed `COOLIFY_ACCESS_TOKEN` vs `COOLIFY_API_TOKEN` inconsistency
- **Build process**: Improved build configuration and output
- **Type definitions**: Enhanced TypeScript types for better development experience

### Security
- **Dependency updates**: Updated all dependencies to latest secure versions
- **Security scanning**: Added Trivy vulnerability scanning in CI/CD pipeline
- **Docker security**: Implemented non-root user in Docker container

## [0.1.18] - 2024-10-28

### Added
- Initial MCP server implementation
- Basic server management tools
- Project management capabilities
- Database management tools
- Service management with limited service types
- Basic application deployment

### Changed
- Initial release with core functionality

## [Unreleased]

### Planned
- **Webhook Support**: Real-time notifications for deployment events
- **Advanced Monitoring**: Detailed metrics and alerting
- **Multi-environment Support**: Enhanced environment management
- **Template System**: Pre-configured application templates
- **API Rate Limiting**: Built-in rate limiting and throttling
- **Plugin System**: Extensible architecture for custom tools
- **GraphQL Support**: Alternative API interface
- **Kubernetes Integration**: Native Kubernetes deployment support

---

## Version History

- **0.2.0**: Enhanced version with 50+ tools and comprehensive Coolify management
- **0.1.18**: Initial release with basic MCP server functionality

## Migration Guide

### From 0.1.x to 0.2.0

1. **Update package name**: Change from `@masonator/coolify-mcp` to `@freqkflag/coolify-mcp-enhanced`
2. **Environment variables**: Ensure you're using `COOLIFY_ACCESS_TOKEN` (not `COOLIFY_API_TOKEN`)
3. **New tools**: Many new tools are available - check the documentation for the full list
4. **Enhanced error handling**: Error messages are now more descriptive and helpful

### Breaking Changes

- **Package name change**: The package is now published under `@freqkflag/coolify-mcp-enhanced`
- **Environment variable**: `COOLIFY_API_TOKEN` is now `COOLIFY_ACCESS_TOKEN`
- **Tool naming**: Some tool names have been updated for consistency

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Support

- **Issues**: [GitHub Issues](https://github.com/freqkflag/coolify-mcp-enhanced/issues)
- **Discussions**: [GitHub Discussions](https://github.com/freqkflag/coolify-mcp-enhanced/discussions)
- **Documentation**: [Wiki](https://github.com/freqkflag/coolify-mcp-enhanced/wiki)
