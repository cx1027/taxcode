import type { MockFiling, MockDocument, TaxSummary } from "./schemas/filing";
import { FilingInputSchema } from "./schemas/filing";

// ─── Simulated delay ──────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Mock stores (in-memory) ──────────────────────────────────────────────────

const filingStore = new Map<string, MockFiling>();
const documentStore = new Map<string, MockDocument>();
const draftStore = new Map<string, Record<string, unknown>>();

// Initialize from mock data
import { MOCK_FILINGS, MOCK_DOCUMENTS } from "./mock-data";
MOCK_FILINGS.forEach((f) => filingStore.set(f.id, { ...f }));
MOCK_DOCUMENTS.forEach((d) => documentStore.set(d.id, { ...d }));

// ─── API Client ───────────────────────────────────────────────────────────────

export const api = {
  filings: {
    /** Get a single filing by ID */
    async getById(id: string): Promise<MockFiling | null> {
      await delay(100);
      return filingStore.get(id) ?? null;
    },

    /** Get all filings */
    async list(): Promise<MockFiling[]> {
      await delay(100);
      return Array.from(filingStore.values());
    },

    /** Update filing draft data */
    async updateDraft(id: string, data: Record<string, unknown>): Promise<MockFiling> {
      await delay(200);
      const filing = filingStore.get(id);
      if (!filing) throw new Error("Filing not found");

      // Merge draft data
      const existing = draftStore.get(id) ?? {};
      draftStore.set(id, { ...existing, ...data });

      // Update progress based on completed fields
      const updated = { ...filing, updatedAt: "Just now" };
      filingStore.set(id, updated);
      return updated;
    },

    /** Get saved draft data */
    async getDraft(id: string): Promise<Record<string, unknown> | null> {
      await delay(50);
      return draftStore.get(id) ?? null;
    },
  },

  tax: {
    /** Calculate tax (mock Rust engine) */
    async calculate(
      filingId: string,
      data: Record<string, unknown>
    ): Promise<TaxSummary> {
      await delay(1500); // Simulate engine processing time

      const income =
        Number(data.w2Income || 0) +
        Number(data.income1099 || 0) +
        Number(data.otherIncome || 0) +
        Number(data.interestIncome || 0) +
        Number(data.dividendIncome || 0);

      const isItemized = data.deductionType === "itemized";
      const deductions = isItemized
        ? Number(data.healthcareExpenses || 0) +
          Number(data.stateLocalTax || 0) +
          Number(data.charitableContributions || 0) +
          Number(data.mortgageInterest || 0) +
          Number(data.studentLoanInterest || 0)
        : 14600;

      const taxableIncome = Math.max(0, income - deductions);

      // Simplified progressive tax calculation (NZ-like)
      let taxLiability = 0;
      if (taxableIncome <= 14000) {
        taxLiability = taxableIncome * 0.105;
      } else if (taxableIncome <= 48000) {
        taxLiability = 14000 * 0.105 + (taxableIncome - 14000) * 0.175;
      } else if (taxableIncome <= 70000) {
        taxLiability =
          14000 * 0.105 + 34000 * 0.175 + (taxableIncome - 48000) * 0.30;
      } else if (taxableIncome <= 180000) {
        taxLiability =
          14000 * 0.105 +
          34000 * 0.175 +
          22000 * 0.30 +
          (taxableIncome - 70000) * 0.33;
      } else {
        taxLiability =
          14000 * 0.105 +
          34000 * 0.175 +
          22000 * 0.30 +
          110000 * 0.33 +
          (taxableIncome - 180000) * 0.39;
      }

      taxLiability = Math.round(taxLiability * 100) / 100;
      const effectiveRate = income > 0 ? (taxLiability / income) * 100 : 0;

      // Generate warnings
      const warnings: string[] = [];
      if (income > 0 && data.deductionType === "standard" && deductions < 5000) {
        warnings.push(
          "You may benefit from itemizing deductions if you have significant medical or charitable expenses."
        );
      }
      if (effectiveRate > 20) {
        warnings.push(
          "Your effective tax rate is above 20%. Consider consulting a tax professional."
        );
      }

      return {
        filingId,
        taxableIncome,
        taxLiability,
        effectiveRate: Math.round(effectiveRate * 100) / 100,
        warnings,
        breakdowns: [
          { label: "Total Income", amount: income },
          { label: "Deductions", amount: -deductions },
          { label: "Taxable Income", amount: taxableIncome },
          { label: "Tax Liability", amount: taxLiability },
        ],
      };
    },
  },

  documents: {
    /** Get all documents */
    async list(): Promise<MockDocument[]> {
      await delay(100);
      return Array.from(documentStore.values());
    },

    /** Get documents for a specific filing */
    async getByFilingId(filingId: string): Promise<MockDocument[]> {
      await delay(100);
      return Array.from(documentStore.values()).filter(
        (d) => d.filingId === filingId
      );
    },

    /** Get a single document by ID */
    async getById(id: string): Promise<MockDocument | null> {
      await delay(100);
      return documentStore.get(id) ?? null;
    },

    /** Upload (create) a document */
    async create(doc: Omit<MockDocument, "id" | "uploadedAt" | "status">): Promise<MockDocument> {
      await delay(300);
      const id = `doc-${Date.now().toString(36)}`;
      const newDoc: MockDocument = {
        ...doc,
        id,
        uploadedAt: new Date().toISOString(),
        status: "processing",
      };
      documentStore.set(id, newDoc);

      // Simulate processing → uploaded after a delay
      setTimeout(() => {
        const stored = documentStore.get(id);
        if (stored) {
          documentStore.set(id, { ...stored, status: "uploaded" });
        }
      }, 2000);

      return newDoc;
    },

    /** Delete a document */
    async delete(id: string): Promise<void> {
      await delay(200);
      documentStore.delete(id);
    },

    /** Update document status */
    async updateStatus(id: string, status: MockDocument["status"]): Promise<MockDocument | null> {
      await delay(100);
      const doc = documentStore.get(id);
      if (!doc) return null;
      const updated = { ...doc, status };
      documentStore.set(id, updated);
      return updated;
    },
  },

  /** Submit filing (mock) */
  async submitFiling(id: string): Promise<{ success: boolean; submissionId: string }> {
    await delay(2000);
    const filing = filingStore.get(id);
    if (!filing) throw new Error("Filing not found");

    filingStore.set(id, {
      ...filing,
      status: "submitted",
      updatedAt: "Just now",
    });

    return {
      success: true,
      submissionId: `SUB-${Date.now().toString(36).toUpperCase()}`,
    };
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type { MockFiling, MockDocument, TaxSummary };
