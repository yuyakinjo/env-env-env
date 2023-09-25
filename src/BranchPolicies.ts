import { execSync } from "child_process";
import { Environments } from "./Environments";
import { BranchPolicy } from "./types/RepoBranchPolicies";
import { repos } from "./repos";
import { RepoEnvironments } from "./types/RepoEnvironments";

export class BranchPolicies {
  envName = "";

  static command = {
    list: (envName: string) =>
      `gh api --method GET -H "Accept: application/vnd.github+json" ${repos}/environments/${envName}/deployment-branch-policies`,
    delete: (envName: string, branchPolicyId: string) =>
      `gh api --method DELETE -H "Accept: application/vnd.github+json" ${repos}/environments/${envName}/deployment-branch-policies/${branchPolicyId}`,
    create: (envName: string, branchName: string) =>
      `gh api --method POST -H "Accept: application/vnd.github+json" ${repos}/environments/${envName}/deployment-branch-policies -f name='${branchName}'`,
  };

  static runCommandAndToJson<T>(command: string): T {
    const executed = execSync(command);
    return JSON.parse(executed.toString()) as T;
  }

  static list(envName: string) {
    const exist = !!Environments.list().environments.find((env) => env.name === envName)?.deployment_branch_policy;
    const empty = { total_count: 0, branch_policies: [] };
    return exist ? this.runCommandAndToJson<RepoEnvironments>(this.command.list(envName)) : empty;
  }

  static delete(envName: string, branchPolicyId: string) {
    if (!branchPolicyId) throw new Error("branchPolicyId is required");
    return this.runCommandAndToJson<void>(this.command.delete(envName, branchPolicyId));
  }

  constructor(envName: string, branchName: string) {
    this.envName = envName;
    this.create(branchName);
  }

  create(branchName: string) {
    if (!branchName) throw new Error("branchName is required");
    return BranchPolicies.runCommandAndToJson<BranchPolicy>(BranchPolicies.command.create(this.envName, branchName));
  }
}
