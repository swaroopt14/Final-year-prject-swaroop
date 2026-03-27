import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.config.js";
import { connectToDatabase } from "./config/db.config.js";
import { bootstrapAgents } from "./modules/agents/bootstrap.js";

async function main() {
  await connectToDatabase();
  bootstrapAgents();

  const server = createServer(app);
  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://127.0.0.1:${env.PORT}`);
  });
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
