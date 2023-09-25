export interface RepoBranchPolicies {
  total_count: number;
  branch_policies: BranchPolicy[];
}

export interface BranchPolicy {
  id: number;
  node_id: string;
  name: string;
}
