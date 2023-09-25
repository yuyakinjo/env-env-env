import { execSync } from "child_process";
import { extname, join } from "path";
import { parse } from "dotenv";
import { Environments } from "./src/Environments";
import { RepositorySecrets } from "./src/RepositorySecrets";

const toArray = (str: string) => str.split("\n").filter((file) => file !== "");

// const commitedButNotPushedFiles = execSync("git diff @{u}.. --name-only").toString();
// console.log("🚀 ~ u:", toArray(commitedButNotPushedFiles));

const commitedButNotPushedFiles = [
  ".env",
  // ".env.local",
  // ".env.development.local",
  // ".env.test",
  // ".env.production",
  // ".env.prod",
  "index.ts",
];

const envFiles = commitedButNotPushedFiles.filter((file) => file.includes(".env"));
const existEnvFiles = !!envFiles.length;

if (existEnvFiles) {
  const mapping = envFiles.map((file) => ({
    filename: file,
    ext: extname(file),
    environment: extname(file) ? extname(file).replace(".", "") : "", // ".env" -> "", ".env.local" -> "local"
    body: parse(execSync(`cat ${file}`).toString()),
  }));
  console.log("🚀 ~ mapping", mapping);
  mapping.map((env) => {
    env.environment ? new Environments(env.environment) : new RepositorySecrets(join(__dirname, env.filename));
  });
}
