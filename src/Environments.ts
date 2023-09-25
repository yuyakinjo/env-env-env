import { execSync } from "child_process";
import { RepoEnvironments } from "./types/RepoEnvironments";
import { BranchPolicies } from "./BranchPolicies";
import { repos } from "./repos";

// gh cli command api
// https://cli.github.com/manual

export class Environments {
  envName = "";

  static command = {
    list: `gh api --method GET -H "Accept: application/vnd.github+json" ${repos}/environments`,
    delete: (envName: string) =>
      `gh api --method DELETE -H "Accept: application/vnd.github+json" ${repos}/environments/${envName}`,
    create: (envName: string) =>
      `gh api --method PUT -H "Accept: application/vnd.github+json" ${repos}/environments/${envName}`,
  };

  static runCommandAndToJson<T>(command: string): T {
    const executed = execSync(command);
    return JSON.parse(executed.toString()) as T;
  }

  static list() {
    return this.runCommandAndToJson<RepoEnvironments>(Environments.command.list);
  }

  static delete(envName: string) {
    return Environments.runCommandAndToJson<void>(Environments.command.delete(envName));
  }

  constructor(envName: string) {
    this.envName = envName;
    this.create(this.envName);
  }

  create(envName: string) {
    return Environments.runCommandAndToJson(Environments.command.create(envName));
  }

  update() {}

  sync() {}

  branchPolicies() {
    return BranchPolicies.list(this.envName);
  }

  createBranchPolicy(branchName: string) {
    if (!branchName) throw new Error("branchName is required");
    return new BranchPolicies(this.envName, branchName);
  }

  deleteBranchPolicy(branchPolicyId: string) {
    if (!branchPolicyId) throw new Error("branchPolicyId is required");
    return BranchPolicies.delete(this.envName, branchPolicyId);
  }
}
