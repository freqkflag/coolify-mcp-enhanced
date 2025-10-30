import {
  CoolifyConfig,
  ErrorResponse,
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

export class CoolifyClient {
  private baseUrl: string;
  private accessToken: string;

  constructor(config: CoolifyConfig) {
    if (!config.baseUrl) {
      throw new Error('Coolify base URL is required');
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.accessToken = config.accessToken;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}/api/v1${path}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        const error = data as ErrorResponse;
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Failed to connect to Coolify server at ${this.baseUrl}. Please check if the server is running and the URL is correct.`,
        );
      }
      throw error;
    }
  }

  // === SERVER MANAGEMENT METHODS ===
  async listServers(): Promise<ServerInfo[]> {
    return this.request<ServerInfo[]>('/servers');
  }

  async getServer(uuid: string): Promise<ServerInfo> {
    return this.request<ServerInfo>(`/servers/${uuid}`);
  }

  async getServerResources(uuid: string): Promise<ServerResources> {
    return this.request<ServerResources>(`/servers/${uuid}/resources`);
  }

  async getServerDomains(uuid: string): Promise<ServerDomain[]> {
    return this.request<ServerDomain[]>(`/servers/${uuid}/domains`);
  }

  async validateServer(uuid: string): Promise<ValidationResponse> {
    return this.request<ValidationResponse>(`/servers/${uuid}/validate`);
  }

  async validateConnection(): Promise<void> {
    try {
      await this.listServers();
    } catch (error) {
      throw new Error(
        `Failed to connect to Coolify server: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // === PROJECT MANAGEMENT METHODS ===
  async listProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProject(uuid: string): Promise<Project> {
    return this.request<Project>(`/projects/${uuid}`);
  }

  async createProject(project: CreateProjectRequest): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(uuid: string, project: UpdateProjectRequest): Promise<Project> {
    return this.request<Project>(`/projects/${uuid}`, {
      method: 'PATCH',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(uuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/projects/${uuid}`, {
      method: 'DELETE',
    });
  }

  async getProjectEnvironment(projectUuid: string, environmentNameOrUuid: string): Promise<Environment> {
    return this.request<Environment>(`/projects/${projectUuid}/environments/${environmentNameOrUuid}`);
  }

  // === APPLICATION MANAGEMENT METHODS ===
  async listApplications(): Promise<any[]> {
    return this.request<any[]>('/applications');
  }

  async getApplication(uuid: string): Promise<any> {
    return this.request<any>(`/applications/${uuid}`);
  }

  async createApplicationDockerCompose(data: {
    project_uuid: string;
    server_uuid: string;
    name: string;
    docker_compose_raw: string;
    environment_name?: string;
    environment_uuid?: string;
    destination_uuid?: string;
    instant_deploy?: boolean;
  }): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>('/applications/dockercompose', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createApplicationDockerfile(data: {
    project_uuid: string;
    server_uuid: string;
    name: string;
    dockerfile_raw: string;
    environment_name?: string;
    environment_uuid?: string;
    destination_uuid?: string;
    instant_deploy?: boolean;
  }): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>('/applications/dockerfile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createApplicationDockerImage(data: {
    project_uuid: string;
    server_uuid: string;
    name: string;
    docker_image: string;
    environment_name?: string;
    environment_uuid?: string;
    destination_uuid?: string;
    instant_deploy?: boolean;
  }): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>('/applications/dockerimage', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createApplicationPublic(data: {
    project_uuid: string;
    server_uuid: string;
    name: string;
    git_repository: string;
    git_branch?: string;
    environment_name?: string;
    environment_uuid?: string;
    destination_uuid?: string;
    instant_deploy?: boolean;
  }): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>('/applications/public', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApplication(uuid: string, data: Record<string, unknown>): Promise<any> {
    return this.request<any>(`/applications/${uuid}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteApplication(uuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${uuid}`, {
      method: 'DELETE',
    });
  }

  // === APPLICATION DEPLOYMENT METHODS ===
  async deployApplication(uuid: string): Promise<Deployment> {
    return this.request<Deployment>(`/applications/${uuid}/deploy`, {
      method: 'POST',
    });
  }

  async restartApplication(uuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${uuid}/restart`, {
      method: 'POST',
    });
  }

  async startApplication(uuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${uuid}/start`, {
      method: 'POST',
    });
  }

  async stopApplication(uuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${uuid}/stop`, {
      method: 'POST',
    });
  }

  // === APPLICATION ENVIRONMENT VARIABLES METHODS ===
  async getApplicationEnvs(uuid: string): Promise<any[]> {
    return this.request<any[]>(`/applications/${uuid}/envs`);
  }

  async createApplicationEnv(uuid: string, env: {
    key: string;
    value: string;
    is_secret?: boolean;
  }): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>(`/applications/${uuid}/envs`, {
      method: 'POST',
      body: JSON.stringify(env),
    });
  }

  async updateApplicationEnv(uuid: string, envUuid: string, env: {
    key: string;
    value: string;
    is_secret?: boolean;
  }): Promise<any> {
    return this.request<any>(`/applications/${uuid}/envs/${envUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(env),
    });
  }

  async updateApplicationEnvsBulk(uuid: string, envs: Array<{
    key: string;
    value: string;
    is_secret?: boolean;
  }>): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${uuid}/envs/bulk`, {
      method: 'PATCH',
      body: JSON.stringify({ envs }),
    });
  }

  async deleteApplicationEnv(uuid: string, envUuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${uuid}/envs/${envUuid}`, {
      method: 'DELETE',
    });
  }

  // === APPLICATION LOGS METHODS ===
  async getApplicationLogs(uuid: string, lines: number = 100): Promise<any> {
    return this.request<any>(`/applications/${uuid}/logs?lines=${lines}`);
  }

  // === DATABASE MANAGEMENT METHODS ===
  async listDatabases(): Promise<Database[]> {
    return this.request<Database[]>('/databases');
  }

  async getDatabase(uuid: string): Promise<Database> {
    return this.request<Database>(`/databases/${uuid}`);
  }

  async updateDatabase(uuid: string, data: DatabaseUpdateRequest): Promise<Database> {
    return this.request<Database>(`/databases/${uuid}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteDatabase(
    uuid: string,
    options?: {
      deleteConfigurations?: boolean;
      deleteVolumes?: boolean;
      dockerCleanup?: boolean;
      deleteConnectedNetworks?: boolean;
    },
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/databases/${uuid}`, {
      method: 'DELETE',
      body: JSON.stringify(options || {}),
    });
  }

  async getDatabaseBackups(uuid: string): Promise<any[]> {
    return this.request<any[]>(`/databases/${uuid}/backups`);
  }

  // === SERVICE MANAGEMENT METHODS ===
  async listServices(): Promise<Service[]> {
    return this.request<Service[]>('/services');
  }

  async getService(uuid: string): Promise<Service> {
    return this.request<Service>(`/services/${uuid}`);
  }

  async createService(data: CreateServiceRequest): Promise<{ uuid: string; domains: string[] }> {
    return this.request<{ uuid: string; domains: string[] }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteService(uuid: string, options?: DeleteServiceOptions): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/services/${uuid}`, {
      method: 'DELETE',
      body: JSON.stringify(options || {}),
    });
  }

  // === DOMAIN MANAGEMENT METHODS ===
  async listDomains(): Promise<any[]> {
    return this.request<any[]>('/domains');
  }

  async getDomain(uuid: string): Promise<any> {
    return this.request<any>(`/domains/${uuid}`);
  }

  async createDomain(data: {
    name: string;
    server_uuid: string;
    application_uuid?: string;
    database_uuid?: string;
    service_uuid?: string;
  }): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>('/domains', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDomain(uuid: string, data: Record<string, unknown>): Promise<any> {
    return this.request<any>(`/domains/${uuid}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteDomain(uuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/domains/${uuid}`, {
      method: 'DELETE',
    });
  }

  // === SSL CERTIFICATE METHODS ===
  async listSslCertificates(): Promise<any[]> {
    return this.request<any[]>('/ssl-certificates');
  }

  async getSslCertificate(uuid: string): Promise<any> {
    return this.request<any>(`/ssl-certificates/${uuid}`);
  }

  async createSslCertificate(data: {
    domain_uuid: string;
    email?: string;
    is_staging?: boolean;
  }): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>('/ssl-certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSslCertificate(uuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/ssl-certificates/${uuid}`, {
      method: 'DELETE',
    });
  }

  // === MONITORING AND HEALTH METHODS ===
  async getSystemHealth(): Promise<any> {
    return this.request<any>('/health');
  }

  async getSystemStats(): Promise<any> {
    return this.request<any>('/stats');
  }

  // === BACKUP MANAGEMENT METHODS ===
  async listBackups(): Promise<any[]> {
    return this.request<any[]>('/backups');
  }

  async createBackup(data: {
    resource_type: 'application' | 'database';
    resource_uuid: string;
  }): Promise<{ uuid: string }> {
    return this.request<{ uuid: string }>('/backups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async restoreBackup(backupUuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/backups/${backupUuid}/restore`, {
      method: 'POST',
    });
  }

  async deleteBackup(backupUuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/backups/${backupUuid}`, {
      method: 'DELETE',
    });
  }
}