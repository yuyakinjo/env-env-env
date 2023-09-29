import { exec } from "./lib/execPromise";
type Command<P extends keyof typeof RepositorySecrets.command> = Parameters<(typeof RepositorySecrets.command)[P]>;
export class RepositorySecrets {
  static command = {
    list: (envName?: string) => `gh secret list`,
    delete: (secretKey: string, envName?: string) => `gh secret delete ${secretKey}`,
    create: (filename: string, envName?: string) => `gh secret set -f ${filename}`,
    update: (secretKey: string, secretValue: string, envName?: string) =>
      `gh secret set ${secretKey} --body ${secretValue}`,
  };

  static async runCommandAndToString(command: string) {
    try {
      const executed = await exec(command);
      console.info(`✅ repository secrets uploaded successfully`);
      return executed.stdout;
    } catch (error) {
      console.error(`❌ repository secrets upload failed ${error}`);
      return String(error);
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
