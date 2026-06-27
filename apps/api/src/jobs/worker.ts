import { Worker } from "bullmq";
import { createClient } from "ioredis";

const connection = new createClient({
  host: process.env.REDIS_HOST ?? "localhost",
  port: Number(process.env.REDIS_PORT ?? 6379),
});

const worker = new Worker(
  "tax-engine",
  async (job) => {
    const { filingId, payload } = job.data;
    // TODO: call Rust tax engine
    console.log(`Processing job ${job.id} for filing ${filingId}`);
    return { filingId, status: "calculated" };
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log("TaxCode job worker running");
