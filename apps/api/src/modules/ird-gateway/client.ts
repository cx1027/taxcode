import { irdEnv, type IRDAuthResponse } from "./config";

// ─── Token Management ─────────────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  // In production: OAuth 2.0 client credentials flow
  // For demo/sandbox: return API key
  if (irdEnv.IRD_API_KEY) {
    return irdEnv.IRD_API_KEY;
  }

  // Simulated OAuth flow
  try {
    const response = await fetch(`${irdEnv.IRD_API_URL}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: irdEnv.IRD_CLIENT_ID,
        client_secret: irdEnv.IRD_CLIENT_SECRET,
        scope: "filing:submit filing:read document:upload",
        signal: AbortSignal.timeout(10000),
      }),
    });

    if (!response.ok) {
      throw new Error(`IRD auth failed: ${response.status}`);
    }

    const data: IRDAuthResponse = await response.json();
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return data.access_token;
  } catch (error) {
    console.error("[IRD] Auth error:", error);
    // Fallback to API key for sandbox
    return irdEnv.IRD_API_KEY || "sandbox-token";
  }
}

// ─── IRD Client ────────────────────────────────────────────────────────────────

export const irdClient = {
  /**
   * Submit a filing to IRD
   */
  async submitFiling(payload: {
    filingId: string;
    taxpayerId: string;
    taxYear: number;
    income: number;
    deductions: number;
    taxLiability: number;
    documentIds: string[];
  }) {
    const token = await getAccessToken();

    // In production: make actual HTTP call to IRD
    // For sandbox: simulate response
    if (irdEnv.IRD_ENV === "sandbox") {
      return this.simulateSubmit(payload);
    }

    const response = await fetch(`${irdEnv.IRD_API_URL}/filing/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-Key": irdEnv.IRD_API_KEY,
      },
      body: JSON.stringify({
        filing_id: payload.filingId,
        taxpayer_id: payload.taxpayerId,
        tax_year: payload.taxYear,
        income: payload.income,
        deductions: payload.deductions,
        tax_liability: payload.taxLiability,
        documents: payload.documentIds,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`IRD submit failed (${response.status}): ${errorBody}`);
    }

    return response.json();
  },

  /**
   * Check filing submission status
   */
  async getStatus(submissionId: string) {
    const token = await getAccessToken();

    if (irdEnv.IRD_ENV === "sandbox") {
      return this.simulateStatus(submissionId);
    }

    const response = await fetch(
      `${irdEnv.IRD_API_URL}/filing/${submissionId}/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-Key": irdEnv.IRD_API_KEY,
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`IRD status check failed: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Upload document to IRD
   */
  async uploadDocument(payload: {
    fileName: string;
    documentType: string;
    content: Buffer;
    filingId?: string;
  }) {
    const token = await getAccessToken();

    if (irdEnv.IRD_ENV === "sandbox") {
      return this.simulateDocumentUpload(payload);
    }

    const formData = new FormData();
    formData.append("file", new Blob([payload.content]), payload.fileName);
    formData.append("document_type", payload.documentType);
    if (payload.filingId) {
      formData.append("filing_id", payload.filingId);
    }

    const response = await fetch(`${irdEnv.IRD_API_URL}/document/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-Key": irdEnv.IRD_API_KEY,
      },
      body: formData,
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      throw new Error(`IRD document upload failed: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Fetch notices from IRD
   */
  async getNotices(taxpayerId: string) {
    const token = await getAccessToken();

    if (irdEnv.IRD_ENV === "sandbox") {
      return this.simulateNotices(taxpayerId);
    }

    const response = await fetch(
      `${irdEnv.IRD_API_URL}/notices/${taxpayerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-Key": irdEnv.IRD_API_KEY,
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`IRD notices fetch failed: ${response.status}`);
    }

    return response.json();
  },

  // ─── Sandbox Simulators ───────────────────────────────────────────────────

  simulateSubmit(payload: { filingId: string }) {
    console.log(`[IRD Sandbox] Submitting filing ${payload.filingId}`);
    return {
      submission_id: `IRD-${Date.now().toString(36).toUpperCase()}`,
      status: "processing",
      message: "Filing accepted for processing",
    };
  },

  simulateStatus(submissionId: string) {
    console.log(`[IRD Sandbox] Checking status for ${submissionId}`);
    return {
      submission_id: submissionId,
      status: "processing",
      status_date: new Date().toISOString(),
    };
  },

  simulateDocumentUpload(payload: { fileName: string; filingId?: string }) {
    console.log(`[IRD Sandbox] Uploading document ${payload.fileName}`);
    return {
      document_id: `IRD-DOC-${Date.now().toString(36).toUpperCase()}`,
      status: "uploaded",
      message: "Document uploaded successfully",
    };
  },

  simulateNotices(taxpayerId: string) {
    console.log(`[IRD Sandbox] Fetching notices for ${taxpayerId}`);
    return [];
  },
};
