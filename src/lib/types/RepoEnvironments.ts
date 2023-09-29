export interface RepoEnvironments {
  environments: RepoEnvironment[];
  total_count: number;
}

export interface RepoEnvironment {
  id: number;
  node_id: string;
  name: string;
  url: string;
  html_url: string;
  created_at: Date;
  updated_at: Date;
  can_admins_bypass: boolean;
  protection_rules: any[];
  deployment_branch_policy: null;
}
