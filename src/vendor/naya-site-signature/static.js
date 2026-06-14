const DEFAULT_ACTIONS = Object.freeze([
  Object.freeze({
    label: "WhatsApp",
    href: "https://wa.me/919284620279?text=Hello%20Naya%20Growth%2C%20I%20saw%20your%20work%20on%20a%20client%20website%20and%20want%20to%20discuss%20a%20website%2Flead%20system.",
    icon: "whatsapp",
  }),
  Object.freeze({
    label: "Contact",
    href: "https://nayagrowth.com/contact?utm_source=brand_credit&utm_medium=client_site",
    icon: "mail",
  }),
  Object.freeze({
    label: "LinkedIn",
    href: "https://linkedin.com/company/naya-growth",
    icon: "linkedin",
  }),
  Object.freeze({
    label: "Instagram",
    href: "https://instagram.com/nayagrowth",
    icon: "instagram",
  }),
]);

const DEFAULT_BRAND_CREDIT = Object.freeze({
  status: "UNKNOWN",
  visible: true,
  variant: "auto",
  label: "Developed by",
  brandName: "Naya Growth",
  href: "https://nayagrowth.com/?utm_source=brand_credit&utm_medium=client_site",
  iconUrl: "https://nayagrowth.com/logo-icon.png",
  actions: DEFAULT_ACTIONS,
});

const VALID_VARIANTS = new Set([
  "auto",
  "dark-glass",
  "light-outline",
  "minimal",
]);

const VALID_ACTION_ICONS = new Set([
  "external",
  "instagram",
  "linkedin",
  "mail",
  "whatsapp",
  "x",
]);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeVariant(value) {
  return VALID_VARIANTS.has(value) ? value : DEFAULT_BRAND_CREDIT.variant;
}

function normalizeAction(action) {
  if (!action || typeof action !== "object") {
    return null;
  }
  const label = typeof action.label === "string" ? action.label.trim() : "";
  const href = typeof action.href === "string" ? action.href.trim() : "";
  if (!label || !href) {
    return null;
  }
  const icon = VALID_ACTION_ICONS.has(action.icon) ? action.icon : "external";
  return { label, href, icon };
}

function normalizeActions(value) {
  if (!Array.isArray(value)) {
    return [...DEFAULT_BRAND_CREDIT.actions];
  }
  return value.map(normalizeAction).filter(Boolean).slice(0, 4);
}

export function normalizeSignatureConfig(config = {}) {
  const input =
    config && typeof config === "object" && "brandCredit" in config
      ? config.brandCredit
      : config;
  const status =
    typeof input?.status === "string" ? input.status : DEFAULT_BRAND_CREDIT.status;
  const visible =
    status === "REMOVED_PAID" || status === "EXEMPT"
      ? false
      : typeof input?.visible === "boolean"
        ? input.visible
        : DEFAULT_BRAND_CREDIT.visible;

  return {
    brandCredit: {
      status,
      visible,
      variant: normalizeVariant(input?.variant),
      label:
        typeof input?.label === "string" && input.label.trim()
          ? input.label.trim()
          : DEFAULT_BRAND_CREDIT.label,
      brandName:
        typeof input?.brandName === "string" && input.brandName.trim()
          ? input.brandName.trim()
          : DEFAULT_BRAND_CREDIT.brandName,
      href:
        typeof input?.href === "string" && input.href.trim()
          ? input.href.trim()
          : DEFAULT_BRAND_CREDIT.href,
      iconUrl:
        typeof input?.iconUrl === "string" && input.iconUrl.trim()
          ? input.iconUrl.trim()
          : DEFAULT_BRAND_CREDIT.iconUrl,
      actions: normalizeActions(input?.actions),
    },
  };
}

export function createSignatureHtml(config = {}) {
  const { brandCredit } = normalizeSignatureConfig(config);
  if (!brandCredit.visible) {
    return "";
  }

  const variant = escapeHtml(brandCredit.variant);
  const href = escapeHtml(brandCredit.href);
  const label = escapeHtml(brandCredit.label);
  const brandName = escapeHtml(brandCredit.brandName);
  const iconUrl = escapeHtml(brandCredit.iconUrl);
  const actionsHtml = brandCredit.actions
    .map((action) => {
      const actionLabel = escapeHtml(action.label);
      const actionHref = escapeHtml(action.href);
      const actionIcon = escapeHtml(action.icon);
      return [
        `<a class="naya-signature__action" href="${actionHref}" target="_blank" rel="noopener noreferrer" aria-label="${actionLabel}" title="${actionLabel}">`,
        `  <span class="naya-signature__action-mark" data-naya-signature-action-icon="${actionIcon}" aria-hidden="true"></span>`,
        "</a>",
      ].join("");
    })
    .join("");

  return [
    `<span class="naya-signature naya-signature--${variant}" data-naya-signature data-naya-signature-variant="${variant}">`,
    `  <a class="naya-signature__main" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label} ${brandName}">`,
    '  <span class="naya-signature__icon-shell" aria-hidden="true">',
    `    <img class="naya-signature__icon" src="${iconUrl}" alt="" loading="lazy" decoding="async" />`,
    "  </span>",
    '  <span class="naya-signature__copy">',
    `    <span class="naya-signature__label">${label}</span>`,
    `    <span class="naya-signature__brand">${brandName}</span>`,
    "  </span>",
    "  </a>",
    actionsHtml
      ? `  <span class="naya-signature__actions" data-naya-signature-actions>${actionsHtml}</span>`
      : "",
    "</span>",
  ].join("");
}

export { DEFAULT_BRAND_CREDIT };
