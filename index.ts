import { execSync } from 'node:child_process';

class EnvFile {
  constructor() {}

  diff() {}

  sync() {}

  upload() {}

  download() {}

  describe() {}
}

type EnvironmentsList = Record<'environments', Record<string, string>[]>;

class Environments {
  static list(target = 'name') {
    try {
      const command =
        'gh api --method GET -H "Accept: application/vnd.github+json" repos/yuyakinjo/env-env-env/environments';
      const list = execSync(command).toString();
      const json = JSON.parse(list) as EnvironmentsList;
      const names = json.environments.map((item) => item.name);
      console.info(...json.environments.map((item) => item.name));
      return names;
    } catch (error) {
      console.log('list ~ error:', error);
    }
  }

  constructor(envName: string) {}

  diff() {}

  create() {
    const command =
      'gh api --method GET -H "Accept: application/vnd.github+json" repos/yuyakinjo/env-env-env/environments';
    const list = execSync(command).toString();
    const json = JSON.parse(list) as EnvironmentsList;
    console.info(...json.environments.map((item) => item.name));
  }

  delete() {}
}

Environments.list();
