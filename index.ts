import { extname, join } from "path";
import { parse } from "dotenv";
import { RepositorySecrets } from "./src/RepositorySecrets";
import { readFileSync } from "fs";

import { writeFile, readFile } from "fs/promises";
import { Secrets } from "./src/Secrets";

const commitedButNotPushedFiles = [".env", ".env.prod"];

const envFiles = commitedButNotPushedFiles.filter((file) => file.includes(".env"));
const existEnvFiles = !!envFiles.length;

const uploadedPrefix = "uploaded";
const getBody = (filename: string) => parse(readFileSync(join(__dirname, filename)).toString());
const toObject = Object.fromEntries;
const toArray = Object.entries;

if (existEnvFiles) {
  const mappings = envFiles
    .map((file) => ({
      filename: file,
      ext: extname(file),
      body: getBody(file),
      get environment() {
        return this.ext ? this.ext.replace(".", "") : ""; // ".env" -> "", ".env.local" -> "local"
      },
      get uploadClient() {
        return this.ext ? Secrets : RepositorySecrets;
      },
      get uploaded() {
        return toObject(toArray(this.body).filter(([key, value]) => value.startsWith(uploadedPrefix)));
      },
      get notUploaded() {
        return toObject(toArray(this.body).filter(([key, value]) => !value.startsWith(uploadedPrefix)));
      },
      get isUploadPending() {
        return !!Object.keys(this.notUploaded).length;
      },
      get isFirstUpload() {
        return !Object.keys(this.uploaded).length;
      },
      updateFile: async (obj: Record<string, string>, fileName: string) => {
        const fileData = (await readFile(join(__dirname, fileName))).toString();
        let written = fileData;
        for (const [key, value] of Object.entries(obj)) {
          if (!value.startsWith(uploadedPrefix)) {
            written = written.replace(
              new RegExp(`^(?!#).*${key}=${value}.*$`, "gm"),
              `${key}=${uploadedPrefix}_${new Date().toLocaleString()}`
            );
          }
        }
        return writeFile(join(__dirname, fileName), written);
      },
    }))
    .map((env) => ({
      ...env,
      createAction: async () => {
        new env.uploadClient(env.filename, env.environment);
        await env.updateFile(env.notUploaded, env.filename);
      },
      updateAction: async () => {
        const notUploaded = Object.entries(env.notUploaded);
        for (const [key, value] of notUploaded) {
          await env.uploadClient.update(key, value, env.environment);
        }
        await env.updateFile(env.notUploaded, env.filename);
      },
    }));

  mappings.forEach(async (envFile) => {
    if (!envFile.isUploadPending) return;

    if (envFile.isUploadPending && envFile.isFirstUpload) {
      await envFile.createAction();
    }

    if (envFile.isUploadPending && !envFile.isFirstUpload) {
      await envFile.updateAction();
    }
  });
}
