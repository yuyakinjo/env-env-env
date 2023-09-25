import { execSync } from "child_process";

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

  static list(envName?: string) {
    return this.runCommandAndToString(RepositorySecrets.command.list(envName));
  }

  static delete(secretName: string, envName?: string) {
    return RepositorySecrets.runCommandAndToString(RepositorySecrets.command.delete(secretName, envName));
  }

  constructor(filename: string, envName?: string) {
    this.create(filename, envName);
  }

  create(filename: string, envName?: string) {
    return RepositorySecrets.runCommandAndToString(RepositorySecrets.command.create(filename, envName));
  }
}
