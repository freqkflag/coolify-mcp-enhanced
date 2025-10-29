# ADR 007: Service Management

## Context

Implementation of one-click service management features through MCP resources, allowing users to deploy and manage various pre-configured services.

## API Endpoints Used

- GET `/services` (List)

  - Lists all services
  - Response: Array of Service objects
  - Auth: Bearer token required

- POST `/services` (Create)

  - Create a one-click service
  - Required fields:
    - server_uuid
    - project_uuid
    - environment_name/uuid
    - type (one of many supported service types)
  - Optional fields:
    - name
    - description
    - destination_uuid
    - instant_deploy
  - Auth: Bearer token required

- GET `/services/{uuid}` (Get)

  - Get service details
  - Response: Service object
  - Auth: Bearer token required

- DELETE `/services/{uuid}` (Delete)
  - Delete service
  - Optional query params:
    - delete_configurations (boolean, default: true)
    - delete_volumes (boolean, default: true)
    - docker_cleanup (boolean, default: true)
    - delete_connected_networks (boolean, default: true)
  - Auth: Bearer token required

## Supported Service Types

- Development Tools:

  - code-server
  - gitea (with various DB options)
  - docker-registry

- CMS & Documentation:

  - wordpress (with various DB options)
  - ghost
  - mediawiki
  - dokuwiki

- Monitoring & Analytics:

  - grafana
  - umami
  - glances
  - uptime-kuma

- Collaboration & Communication:

  - rocketchat
  - chatwoot
  - nextcloud

- Database Management:

  - phpmyadmin
  - nocodb
  - directus

- And many more specialized services

## Implementation Checklist

- [x] Basic Service Management

  - [x] List services resource
  - [x] Get service details
  - [x] Create service
  - [x] Delete service

- [x] Service Type Support

  - [x] Development tools deployment
  - [x] CMS system deployment
  - [x] Monitoring tools deployment
  - [x] Collaboration tools deployment
  - [x] Database tools deployment

- [x] Resource Testing
  - [x] Unit tests for service operations
  - [x] Integration tests with mock data
  - [x] Live test with real Coolify instance

## Dependencies

- ADR 001 (Core Server Setup)
- ADR 002 (Server Information Resources)
- ADR 003 (Project Management)
