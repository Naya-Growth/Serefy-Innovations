export const SERE_NAYA_CONNECTOR_KEY = "src_serefy_live_20260605";
export const SERE_NAYA_API_BASE = "https://api.nayagrowth.com";
export const SERE_NAYA_INTAKE_URL = `${SERE_NAYA_API_BASE}/api/landing/intake/${SERE_NAYA_CONNECTOR_KEY}`;

export type SERELeadInput = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  city?: string;
  role?: string;
  capacity?: string;
  partnershipType?: string;
  goal?: string;
  timeline?: string;
  message?: string;
  sourceCta: string;
};

export type NayaLeadPayload = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  message: string;
  consent: true;
  sourceKind: "WEB_FORM";
  source: {
    pageUrl: string;
    referrer: string;
    formName: string;
    sourceCta: string;
  };
  runtime: {
    originHost: string;
    userAgent: string;
    connectorKey: string;
  };
};

const labels: Record<string, string> = {
  farmer: "Farmer",
  hobbyist: "Hobbyist",
  investor: "Investor / Institution",
  strategic: "Strategic Investment",
  reseller: "Distribution / Reseller",
  institutional: "Institutional Buyer",
  "hatch-rate": "Improve hatch rate",
  scale: "Scale up operations",
  research: "Research / Specialty birds",
  "first-time": "First time hatching",
  immediate: "Immediate (0-3 months)",
  short: "Short-term (3-6 months)",
  exploring: "Just exploring options for now",
};

function clean(value: string | undefined | null) {
  return (value ?? "").trim();
}

function label(value: string | undefined | null) {
  const normalized = clean(value);
  return labels[normalized] ?? normalized;
}

function buildFullName(input: Pick<SERELeadInput, "firstName" | "lastName" | "email">) {
  const name = `${clean(input.firstName)} ${clean(input.lastName)}`.replace(/\s+/g, " ").trim();
  if (name) {
    return name;
  }

  return clean(input.email).split("@")[0] || "SERE Enquiry";
}

export function buildNayaLeadPayload(input: SERELeadInput): NayaLeadPayload {
  const messageParts = [
    `Source CTA: ${input.sourceCta}`,
    input.role ? `Role: ${label(input.role)}` : null,
    input.capacity ? `Capacity: ${input.capacity}` : null,
    input.partnershipType ? `Partnership: ${label(input.partnershipType)}` : null,
    input.goal ? `Goal: ${label(input.goal)}` : null,
    input.timeline ? `Timeline: ${label(input.timeline)}` : null,
    input.city ? `City / location: ${clean(input.city)}` : null,
    input.message ? `Message: ${clean(input.message)}` : null,
  ].filter(Boolean);

  const pageUrl = typeof window === "undefined" ? "" : window.location.href;
  const originHost = typeof window === "undefined" ? "" : window.location.host;
  const referrer = typeof document === "undefined" ? "" : document.referrer;
  const userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent;

  return {
    fullName: buildFullName(input),
    email: clean(input.email),
    phone: clean(input.phone),
    companyName: "SERE Enquiry",
    message: messageParts.join("\n"),
    consent: true,
    sourceKind: "WEB_FORM",
    source: {
      pageUrl,
      referrer,
      formName: "Serefy Innovations website enquiry",
      sourceCta: input.sourceCta,
    },
    runtime: {
      originHost,
      userAgent,
      connectorKey: SERE_NAYA_CONNECTOR_KEY,
    },
  };
}

export async function submitSERELead(input: SERELeadInput) {
  const response = await fetch(SERE_NAYA_INTAKE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "omit",
    body: JSON.stringify(buildNayaLeadPayload(input)),
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseBody && typeof responseBody.error === "string"
        ? responseBody.error
        : "Lead capture is temporarily unavailable. Please try again or email SERE.connect@gmail.com.",
    );
  }

  return responseBody as { success: true; leadId?: string; syncStatus?: string };
}
