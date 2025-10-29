import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { CoolifyClient } from './coolify-client.js';
import debug from 'debug';
import { z } from 'zod';
import type {
  ServerInfo,
  ServerResources,
  ServerDomain,
  ValidationResponse,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  Environment,
  Deployment,
  Database,
  DatabaseUpdateRequest,
  Service,
  CreateServiceRequest,
  DeleteServiceOptions,
} from '../types/coolify.js';

const log = debug('coolify:mcp');

// Define valid service types
const serviceTypes = [
  'activepieces',
  'appsmith',
  'appwrite',
  'authentik',
  'babybuddy',
  'budge',
  'changedetection',
  'chatwoot',
  'classicpress-with-mariadb',
  'classicpress-with-mysql',
  'classicpress-without-database',
  'cloudflared',
  'code-server',
  'dashboard',
  'directus',
  'directus-with-postgresql',
  'docker-registry',
  'docuseal',
  'docuseal-with-postgres',
  'dokuwiki',
  'duplicati',
  'emby',
  'embystat',
  'fider',
  'filebrowser',
  'firefly',
  'formbricks',
  'ghost',
  'gitea',
  'gitea-with-mariadb',
  'gitea-with-mysql',
  'gitea-with-postgresql',
  'glance',
  'glances',
  'glitchtip',
  'grafana',
  'grafana-with-postgresql',
  'grocy',
  'heimdall',
  'homepage',
  'jellyfin',
  'kuzzle',
  'listmonk',
  'logto',
  'mediawiki',
  'meilisearch',
  'metabase',
  'metube',
  'minio',
  'moodle',
  'n8n',
  'n8n-with-postgresql',
  'next-image-transformation',
  'nextcloud',
  'nocodb',
  'odoo',
  'openblocks',
  'pairdrop',
  'penpot',
  'phpmyadmin',
  'pocketbase',
  'posthog',
  'reactive-resume',
  'rocketchat',
  'shlink',
  'slash',
  'snapdrop',
  'statusnook',
  'stirling-pdf',
  'supabase',
  'syncthing',
  'tolgee',
  'trigger',
  'trigger-with-external-database',
  'twenty',
  'umami',
  'unleash-with-postgresql',
  'unleash-without-database',
  'uptime-kuma',
  'vaultwarden',
  'vikunja',
  'weblate',
  'whoogle',
  'wordpress-with-mariadb',
  'wordpress-with-mysql',
  'wordpress-without-database'
] as const;

export class CoolifyMcpServer extends McpServer {
  private client: CoolifyClient;

  constructor(config: { baseUrl: string; accessToken: string }) {
    super({
      name: 'coolify',
      version: '0.2.0'
    });
    
    log('Initializing server with config: %o', config);
    this.client = new CoolifyClient(config);
  }

  async initialize(): Promise<void> {
    // Register capabilities first
    await this.server.registerCapabilities({
      tools: {}
    });

    // === SERVER MANAGEMENT TOOLS ===
    this.tool('list_servers', 'List all Coolify servers', {}, async () => {
      const servers = await this.client.listServers();
      return {
        content: [{ type: 'text', text: JSON.stringify(servers, null, 2) }]
      };
    });

    this.tool('get_server', 'Get details about a specific Coolify server', {
      uuid: z.string().describe('UUID of the server to get details for')
    }, async (args) => {
      const server = await this.client.getServer(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(server, null, 2) }]
      };
    });

    this.tool('get_server_resources', 'Get the current resources running on a specific Coolify server', {
      uuid: z.string()
    }, async (args, _extra) => {
      const resources = await this.client.getServerResources(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(resources, null, 2) }]
      };
    });

    this.tool('get_server_domains', 'Get domains for a specific Coolify server', {
      uuid: z.string()
    }, async (args, _extra) => {
      const domains = await this.client.getServerDomains(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(domains, null, 2) }]
      };
    });

    this.tool('validate_server', 'Validate a specific Coolify server', {
      uuid: z.string()
    }, async (args, _extra) => {
      const validation = await this.client.validateServer(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(validation, null, 2) }]
      };
    });

    // === PROJECT MANAGEMENT TOOLS ===
    this.tool('list_projects', 'List all Coolify projects', {}, async (_args, _extra) => {
      const projects = await this.client.listProjects();
      return {
        content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }]
      };
    });

    this.tool('get_project', 'Get details about a specific Coolify project', {
      uuid: z.string()
    }, async (args, _extra) => {
      const project = await this.client.getProject(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(project, null, 2) }]
      };
    });

    this.tool('create_project', 'Create a new Coolify project', {
      name: z.string(),
      description: z.string().optional()
    }, async (args, _extra) => {
      const result = await this.client.createProject({
        name: args.name,
        description: args.description
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('update_project', 'Update an existing Coolify project', {
      uuid: z.string(),
      name: z.string(),
      description: z.string().optional()
    }, async (args, _extra) => {
      const { uuid, ...updateData } = args;
      const result = await this.client.updateProject(uuid, updateData);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('delete_project', 'Delete a Coolify project', {
      uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.deleteProject(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('get_project_environment', 'Get environment details for a Coolify project', {
      project_uuid: z.string(),
      environment_name_or_uuid: z.string()
    }, async (args, _extra) => {
      const environment = await this.client.getProjectEnvironment(args.project_uuid, args.environment_name_or_uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(environment, null, 2) }]
      };
    });

    // === APPLICATION MANAGEMENT TOOLS ===
    this.tool('list_applications', 'List all Coolify applications', {}, async (_args, _extra) => {
      const applications = await this.client.listApplications();
      return {
        content: [{ type: 'text', text: JSON.stringify(applications, null, 2) }]
      };
    });

    this.tool('get_application', 'Get details about a specific Coolify application', {
      uuid: z.string()
    }, async (args, _extra) => {
      const application = await this.client.getApplication(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(application, null, 2) }]
      };
    });

    this.tool('create_application_dockercompose', 'Create a new application from Docker Compose', {
      project_uuid: z.string(),
      server_uuid: z.string(),
      name: z.string(),
      docker_compose_raw: z.string(),
      environment_name: z.string().optional(),
      environment_uuid: z.string().optional(),
      destination_uuid: z.string().optional(),
      instant_deploy: z.boolean().optional()
    }, async (args, _extra) => {
      const result = await this.client.createApplicationDockerCompose(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('create_application_dockerfile', 'Create a new application from Dockerfile', {
      project_uuid: z.string(),
      server_uuid: z.string(),
      name: z.string(),
      dockerfile_raw: z.string(),
      environment_name: z.string().optional(),
      environment_uuid: z.string().optional(),
      destination_uuid: z.string().optional(),
      instant_deploy: z.boolean().optional()
    }, async (args, _extra) => {
      const result = await this.client.createApplicationDockerfile(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('create_application_dockerimage', 'Create a new application from Docker image', {
      project_uuid: z.string(),
      server_uuid: z.string(),
      name: z.string(),
      docker_image: z.string(),
      environment_name: z.string().optional(),
      environment_uuid: z.string().optional(),
      destination_uuid: z.string().optional(),
      instant_deploy: z.boolean().optional()
    }, async (args, _extra) => {
      const result = await this.client.createApplicationDockerImage(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('create_application_public', 'Create a new public application', {
      project_uuid: z.string(),
      server_uuid: z.string(),
      name: z.string(),
      git_repository: z.string(),
      git_branch: z.string().optional(),
      environment_name: z.string().optional(),
      environment_uuid: z.string().optional(),
      destination_uuid: z.string().optional(),
      instant_deploy: z.boolean().optional()
    }, async (args, _extra) => {
      const result = await this.client.createApplicationPublic(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('update_application', 'Update an existing Coolify application', {
      uuid: z.string(),
      data: z.record(z.unknown())
    }, async (args, _extra) => {
      const result = await this.client.updateApplication(args.uuid, args.data);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('delete_application', 'Delete a Coolify application', {
      uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.deleteApplication(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    // === APPLICATION DEPLOYMENT TOOLS ===
    this.tool('deploy_application', 'Deploy a Coolify application', {
      uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.deployApplication(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('restart_application', 'Restart a Coolify application', {
      uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.restartApplication(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('start_application', 'Start a Coolify application', {
      uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.startApplication(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('stop_application', 'Stop a Coolify application', {
      uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.stopApplication(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    // === APPLICATION ENVIRONMENT VARIABLES TOOLS ===
    this.tool('get_application_envs', 'Get environment variables for a Coolify application', {
      uuid: z.string()
    }, async (args, _extra) => {
      const envs = await this.client.getApplicationEnvs(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(envs, null, 2) }]
      };
    });

    this.tool('create_application_env', 'Create a new environment variable for a Coolify application', {
      uuid: z.string(),
      key: z.string(),
      value: z.string(),
      is_secret: z.boolean().optional()
    }, async (args, _extra) => {
      const result = await this.client.createApplicationEnv(args.uuid, {
        key: args.key,
        value: args.value,
        is_secret: args.is_secret || false
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('update_application_env', 'Update an environment variable for a Coolify application', {
      uuid: z.string(),
      env_uuid: z.string(),
      key: z.string(),
      value: z.string(),
      is_secret: z.boolean().optional()
    }, async (args, _extra) => {
      const result = await this.client.updateApplicationEnv(args.uuid, args.env_uuid, {
        key: args.key,
        value: args.value,
        is_secret: args.is_secret || false
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('update_application_envs_bulk', 'Update multiple environment variables for a Coolify application', {
      uuid: z.string(),
      envs: z.array(z.object({
        key: z.string(),
        value: z.string(),
        is_secret: z.boolean().optional()
      }))
    }, async (args, _extra) => {
      const result = await this.client.updateApplicationEnvsBulk(args.uuid, args.envs);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('delete_application_env', 'Delete an environment variable from a Coolify application', {
      uuid: z.string(),
      env_uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.deleteApplicationEnv(args.uuid, args.env_uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    // === APPLICATION LOGS TOOLS ===
    this.tool('get_application_logs', 'Get logs for a Coolify application', {
      uuid: z.string(),
      lines: z.number().optional().describe('Number of log lines to retrieve (default: 100)')
    }, async (args, _extra) => {
      const logs = await this.client.getApplicationLogs(args.uuid, args.lines || 100);
      return {
        content: [{ type: 'text', text: JSON.stringify(logs, null, 2) }]
      };
    });

    // === DATABASE MANAGEMENT TOOLS ===
    this.tool('list_databases', 'List all Coolify databases', {}, async (_args, _extra) => {
      const databases = await this.client.listDatabases();
      return {
        content: [{ type: 'text', text: JSON.stringify(databases, null, 2) }]
      };
    });

    this.tool('get_database', 'Get details about a specific Coolify database', {
      uuid: z.string()
    }, async (args, _extra) => {
      const database = await this.client.getDatabase(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(database, null, 2) }]
      };
    });

    this.tool('update_database', 'Update a Coolify database', {
      uuid: z.string(),
      data: z.record(z.unknown())
    }, async (args, _extra) => {
      const result = await this.client.updateDatabase(args.uuid, args.data);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    const deleteOptionsSchema = {
      deleteConfigurations: z.boolean().optional(),
      deleteVolumes: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      deleteConnectedNetworks: z.boolean().optional()
    };

    this.tool('delete_database', 'Delete a Coolify database', {
      uuid: z.string(),
      options: z.object(deleteOptionsSchema).optional()
    }, async (args, _extra) => {
      const result = await this.client.deleteDatabase(args.uuid, args.options);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('get_database_backups', 'Get backups for a Coolify database', {
      uuid: z.string()
    }, async (args, _extra) => {
      const backups = await this.client.getDatabaseBackups(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(backups, null, 2) }]
      };
    });

    // === SERVICE MANAGEMENT TOOLS ===
    this.tool('list_services', 'List all Coolify services', {}, async (_args, _extra) => {
      const services = await this.client.listServices();
      return {
        content: [{ type: 'text', text: JSON.stringify(services, null, 2) }]
      };
    });

    this.tool('get_service', 'Get details about a specific Coolify service', {
      uuid: z.string()
    }, async (args, _extra) => {
      const service = await this.client.getService(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(service, null, 2) }]
      };
    });

    this.tool('create_service', 'Create a new Coolify service', {
      type: z.enum(serviceTypes),
      project_uuid: z.string(),
      server_uuid: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      environment_name: z.string().optional(),
      environment_uuid: z.string().optional(),
      destination_uuid: z.string().optional(),
      instant_deploy: z.boolean().optional()
    }, async (args, _extra) => {
      const result = await this.client.createService(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('delete_service', 'Delete a Coolify service', {
      uuid: z.string(),
      options: z.object(deleteOptionsSchema).optional()
    }, async (args, _extra) => {
      const result = await this.client.deleteService(args.uuid, args.options);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    // === DOMAIN MANAGEMENT TOOLS ===
    this.tool('list_domains', 'List all domains', {}, async (_args, _extra) => {
      const domains = await this.client.listDomains();
      return {
        content: [{ type: 'text', text: JSON.stringify(domains, null, 2) }]
      };
    });

    this.tool('get_domain', 'Get details about a specific domain', {
      uuid: z.string()
    }, async (args, _extra) => {
      const domain = await this.client.getDomain(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(domain, null, 2) }]
      };
    });

    this.tool('create_domain', 'Create a new domain', {
      name: z.string(),
      server_uuid: z.string(),
      application_uuid: z.string().optional(),
      database_uuid: z.string().optional(),
      service_uuid: z.string().optional()
    }, async (args, _extra) => {
      const result = await this.client.createDomain(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('update_domain', 'Update a domain', {
      uuid: z.string(),
      data: z.record(z.unknown())
    }, async (args, _extra) => {
      const result = await this.client.updateDomain(args.uuid, args.data);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('delete_domain', 'Delete a domain', {
      uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.deleteDomain(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    // === SSL CERTIFICATE TOOLS ===
    this.tool('list_ssl_certificates', 'List all SSL certificates', {}, async (_args, _extra) => {
      const certificates = await this.client.listSslCertificates();
      return {
        content: [{ type: 'text', text: JSON.stringify(certificates, null, 2) }]
      };
    });

    this.tool('get_ssl_certificate', 'Get details about a specific SSL certificate', {
      uuid: z.string()
    }, async (args, _extra) => {
      const certificate = await this.client.getSslCertificate(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(certificate, null, 2) }]
      };
    });

    this.tool('create_ssl_certificate', 'Create a new SSL certificate', {
      domain_uuid: z.string(),
      email: z.string().optional(),
      is_staging: z.boolean().optional()
    }, async (args, _extra) => {
      const result = await this.client.createSslCertificate(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('delete_ssl_certificate', 'Delete an SSL certificate', {
      uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.deleteSslCertificate(args.uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    // === MONITORING AND HEALTH TOOLS ===
    this.tool('get_system_health', 'Get system health status', {}, async (_args, _extra) => {
      const health = await this.client.getSystemHealth();
      return {
        content: [{ type: 'text', text: JSON.stringify(health, null, 2) }]
      };
    });

    this.tool('get_system_stats', 'Get system statistics', {}, async (_args, _extra) => {
      const stats = await this.client.getSystemStats();
      return {
        content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }]
      };
    });

    // === BACKUP MANAGEMENT TOOLS ===
    this.tool('list_backups', 'List all backups', {}, async (_args, _extra) => {
      const backups = await this.client.listBackups();
      return {
        content: [{ type: 'text', text: JSON.stringify(backups, null, 2) }]
      };
    });

    this.tool('create_backup', 'Create a backup', {
      resource_type: z.enum(['application', 'database']),
      resource_uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.createBackup(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('restore_backup', 'Restore from a backup', {
      backup_uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.restoreBackup(args.backup_uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });

    this.tool('delete_backup', 'Delete a backup', {
      backup_uuid: z.string()
    }, async (args, _extra) => {
      const result = await this.client.deleteBackup(args.backup_uuid);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    });
  }

  async connect(transport: Transport): Promise<void> {
    log('Starting server...');
    log('Validating connection...');
    await this.client.validateConnection();
    await this.initialize();
    await super.connect(transport);
    log('Server started successfully');
  }

  // Legacy methods for backward compatibility
  async list_servers(): Promise<ServerInfo[]> {
    return this.client.listServers();
  }

  async get_server(uuid: string): Promise<ServerInfo> {
    return this.client.getServer(uuid);
  }

  async get_server_resources(uuid: string): Promise<ServerResources> {
    return this.client.getServerResources(uuid);
  }

  async get_server_domains(uuid: string): Promise<ServerDomain[]> {
    return this.client.getServerDomains(uuid);
  }

  async validate_server(uuid: string): Promise<ValidationResponse> {
    return this.client.validateServer(uuid);
  }

  async list_projects(): Promise<Project[]> {
    return this.client.listProjects();
  }

  async get_project(uuid: string): Promise<Project> {
    return this.client.getProject(uuid);
  }

  async create_project(project: CreateProjectRequest): Promise<{ uuid: string }> {
    return this.client.createProject(project);
  }

  async update_project(uuid: string, project: UpdateProjectRequest): Promise<Project> {
    return this.client.updateProject(uuid, project);
  }

  async delete_project(uuid: string): Promise<{ message: string }> {
    return this.client.deleteProject(uuid);
  }

  async get_project_environment(
    projectUuid: string,
    environmentNameOrUuid: string,
  ): Promise<Environment> {
    return this.client.getProjectEnvironment(projectUuid, environmentNameOrUuid);
  }

  async deploy_application(params: { uuid: string }): Promise<Deployment> {
    return this.client.deployApplication(params.uuid);
  }

  async list_databases(): Promise<Database[]> {
    return this.client.listDatabases();
  }

  async get_database(uuid: string): Promise<Database> {
    return this.client.getDatabase(uuid);
  }

  async update_database(uuid: string, data: DatabaseUpdateRequest): Promise<Database> {
    return this.client.updateDatabase(uuid, data);
  }

  async delete_database(
    uuid: string,
    options?: {
      deleteConfigurations?: boolean;
      deleteVolumes?: boolean;
      dockerCleanup?: boolean;
      deleteConnectedNetworks?: boolean;
    },
  ): Promise<{ message: string }> {
    return this.client.deleteDatabase(uuid, options);
  }

  async list_services(): Promise<Service[]> {
    return this.client.listServices();
  }

  async get_service(uuid: string): Promise<Service> {
    return this.client.getService(uuid);
  }

  async create_service(data: CreateServiceRequest): Promise<{ uuid: string; domains: string[] }> {
    return this.client.createService(data);
  }

  async delete_service(uuid: string, options?: DeleteServiceOptions): Promise<{ message: string }> {
    return this.client.deleteService(uuid, options);
  }
}