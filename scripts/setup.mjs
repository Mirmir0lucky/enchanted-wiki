import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const envPath = new URL("../.env", import.meta.url);
const examplePath = new URL("../.env.example", import.meta.url);

const rl = createInterface({ input, output });

if (existsSync(envPath)) {
  const answer = (await rl.question(".env already exists. Overwrite it? (y/N) ")).trim().toLowerCase();
  if (answer !== "y" && answer !== "yes") {
    rl.close();
    console.log("Kept your existing .env.");
    process.exit(0);
  }
}

const username = (await rl.question("Admin name [admin]: ")).trim() || "admin";

let password = "";
while (!password) {
  password = (await rl.question("Admin password: ")).trim();
  if (!password) console.log("The password cannot be empty.");
}

rl.close();

const secret = randomBytes(32).toString("hex");
const example = readFileSync(examplePath, "utf8");

// JSON.stringify produces a valid double-quoted value for .env files.
const env = example
  .replace(/^ADMIN_USERNAME=.*$/m, `ADMIN_USERNAME=${JSON.stringify(username)}`)
  .replace(/^ADMIN_PASSWORD=.*$/m, `ADMIN_PASSWORD=${JSON.stringify(password)}`)
  .replace(/^SESSION_SECRET=.*$/m, `SESSION_SECRET=${secret}`);

writeFileSync(envPath, env);

console.log("\n.env created.");
console.log("Start the site with:  npm run dev");
console.log("Admin panel:          http://localhost:3000/admin");
