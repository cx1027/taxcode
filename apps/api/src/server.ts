import { buildApp } from "./index";

async function main() {
  const app = await buildApp();

  try {
    const address = await app.listen({
      port: Number(process.env.PORT ?? 3001),
      host: "0.0.0.0",
    });
    app.log.info(`TaxCode API running at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
