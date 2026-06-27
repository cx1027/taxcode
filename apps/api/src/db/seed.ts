import { db } from "./index";
import { users, taxRuleVersions } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Create demo user
  await db
    .insert(users)
    .values({
      email: "demo@taxcode.app",
      passwordHash: "demo1234", // TODO: hash in production
      firstName: "Demo",
      lastName: "User",
      role: "user",
    })
    .onConflictDoNothing();

  // Create tax rule version for 2024
  await db
    .insert(taxRuleVersions)
    .values({
      taxYear: 2024,
      ruleVersion: "2024-v1",
      effectiveDate: "2024-01-01T00:00:00Z",
      rulesData: {
        brackets: [
          { min: 0, max: 14000, rate: 0.105 },
          { min: 14000, max: 48000, rate: 0.175 },
          { min: 48000, max: 70000, rate: 0.30 },
          { min: 70000, max: 180000, rate: 0.33 },
          { min: 180000, max: Infinity, rate: 0.39 },
        ],
        standardDeduction: 14600,
      },
    })
    .onConflictDoNothing();

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
