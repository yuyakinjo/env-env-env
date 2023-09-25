import { execSync } from "child_process";

// const command = "git ls-files --cached";
const command = "git diff --name-only";
const diffFiles = execSync(command).toString();
const toArray = diffFiles.split("\n").filter((file) => file !== "");

console.log("🚀 ~ diffFiles:", diffFiles);
console.log(toArray);
