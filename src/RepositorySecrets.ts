import { execSync } from "child_process";
type Command<P extends keyof typeof RepositorySecrets.command> = Parameters<(typeof RepositorySecrets.command)[P]>;
export class RepositorySecrets {
  static command = {
    list: (envName?: string) => `gh secret list`,
    delete: (secretName: string, envName?: string) => `gh secret delete ${secretName}`,
    create: (filename: string, envName?: string) => `gh secret set -f ${filename}`,
  };

  static runCommandAndToString(command: string) {
    try {
      const executed = execSync(command);
      console.info(`✅ repository secrets uploaded successfully`);
      return executed.toString();
    } catch (error) {
      console.error(`❌ repository secrets upload failed ${error}`);
      return error;
    }
  }

  static list(...args: Command<"list">) {
    return this.runCommandAndToString(RepositorySecrets.command.list(...args));
  }

  static delete(...args: Command<"delete">) {
    return this.runCommandAndToString(RepositorySecrets.command.delete(...args));
  }

  static update(...args: Command<"update">) {
    return this.runCommandAndToString(RepositorySecrets.command.update(...args));
  }

  constructor(...args: Command<"create">) {
    this.create(...args);
  }

  create(...args: Command<"create">) {
    return RepositorySecrets.runCommandAndToString(RepositorySecrets.command.create(...args));
  }
}
