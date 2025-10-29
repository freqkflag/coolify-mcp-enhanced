# Contributing to Coolify MCP Enhanced Server

Thank you for your interest in contributing to the Coolify MCP Enhanced Server! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** to ensure it's not a configuration issue
3. **Provide detailed information** including:
   - Coolify version
   - Node.js version
   - Error messages and logs
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting Enhancements

We welcome suggestions for new features and improvements:

1. **Check existing discussions** for similar ideas
2. **Provide clear use cases** and benefits
3. **Consider implementation complexity**
4. **Think about backward compatibility**

### Code Contributions

#### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Basic understanding of TypeScript and MCP

#### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/coolify-mcp-enhanced.git
   cd coolify-mcp-enhanced
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

5. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

6. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

7. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive names for variables and functions
- **Comments**: Add comments for complex logic

### Testing

- **Unit Tests**: Write tests for all new functionality
- **Integration Tests**: Test MCP tool interactions
- **Coverage**: Maintain high test coverage
- **Test Names**: Use descriptive test names

### Documentation

- **README**: Update README for new features
- **Examples**: Add examples for new tools
- **API Docs**: Document new API methods
- **Changelog**: Update CHANGELOG.md

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/tooling changes

Examples:
```
feat: add SSL certificate management tools
fix: resolve environment variable parsing issue
docs: update installation instructions
test: add tests for database backup functionality
```

## 🏗️ Architecture

### Project Structure

```
src/
├── index.ts              # Main entry point
├── lib/
│   ├── mcp-server.ts     # MCP server implementation
│   └── coolify-client.ts # Coolify API client
├── types/
│   └── coolify.ts        # TypeScript type definitions
└── __tests__/            # Test files
```

### Adding New Tools

1. **Define the tool** in `mcp-server.ts`:
   ```typescript
   this.tool('tool_name', 'Tool description', {
     param1: z.string().describe('Parameter description')
   }, async (args) => {
     const result = await this.client.newMethod(args.param1);
     return {
       content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
     };
   });
   ```

2. **Implement the client method** in `coolify-client.ts`:
   ```typescript
   async newMethod(param: string): Promise<any> {
     return this.request<any>(`/api/endpoint/${param}`);
   }
   ```

3. **Add TypeScript types** in `types/coolify.ts` if needed

4. **Write tests** for the new functionality

5. **Update documentation**

### API Integration

- **Follow RESTful principles**
- **Handle errors gracefully**
- **Use proper HTTP methods**
- **Include proper headers**
- **Validate input parameters**

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/__tests__/coolify-client.test.ts
```

### Writing Tests

```typescript
describe('CoolifyClient', () => {
  it('should list servers', async () => {
    const client = new CoolifyClient({
      baseUrl: 'http://localhost:8000',
      accessToken: 'test-token'
    });
    
    const servers = await client.listServers();
    expect(servers).toBeDefined();
    expect(Array.isArray(servers)).toBe(true);
  });
});
```

## 📦 Release Process

### Version Bumping

- **Major (1.0.0)**: Breaking changes
- **Minor (0.1.0)**: New features, backward compatible
- **Patch (0.0.1)**: Bug fixes, backward compatible

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped in package.json
- [ ] Release notes prepared
- [ ] Docker image built and tested

## 🐛 Debugging

### Common Issues

1. **Environment Variables**: Ensure `COOLIFY_ACCESS_TOKEN` is set correctly
2. **API Endpoints**: Verify Coolify instance is accessible
3. **Permissions**: Check API token has required permissions
4. **Network**: Ensure network connectivity to Coolify instance

### Debug Mode

```bash
DEBUG=coolify:mcp node dist/index.js
```

## 📞 Getting Help

- **GitHub Issues**: [Create an issue](https://github.com/freqkflag/coolify-mcp-enhanced/issues)
- **Discussions**: [Join discussions](https://github.com/freqkflag/coolify-mcp-enhanced/discussions)
- **Documentation**: [Check the wiki](https://github.com/freqkflag/coolify-mcp-enhanced/wiki)

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to the Coolify MCP Enhanced Server! 🚀
