import { Environments } from "./Environments";
import { RepositorySecrets } from "./RepositorySecrets";

type Command<P extends keyof typeof Secrets.command> = Parameters<(typeof Secrets.command)[P]>;

export class Secrets extends RepositorySecrets {
  static override command = {
    list: (envName?: string) => `gh secret list -e ${envName}`,
    delete: (secretName: string, envName?: string) => `gh secret delete ${secretName} -e ${envName}`,
    create: (filename: string, envName?: string) => `gh secret set -f ${filename} -e ${envName}`,
    update: (secretKey: string, secretValue: string, envName?: string) =>
      `gh secret set ${secretKey} --body ${secretValue} -e ${envName}`,
  };

  static override update(...args: Command<"update">) {
    return Secrets.runCommandAndToString(Secrets.command.update(...args));
  }

  constructor(...args: Command<"create">) {
    super(...args);
    this.create(...args);
  }

  override create(...args: Command<"create">) {
    return Secrets.runCommandAndToString(Secrets.command.create(...args));
  }
}
