import React from "react";
import { normalizeSignatureConfig } from "./static.js";

export function NayaGrowthSignature({
  config = undefined,
  className = "",
  variant = undefined,
  href = undefined,
  iconUrl = undefined,
} = {}) {
  const normalized = normalizeSignatureConfig({
    ...(config ?? {}),
    brandCredit: {
      ...(config?.brandCredit ?? config ?? {}),
      ...(variant ? { variant } : {}),
      ...(href ? { href } : {}),
      ...(iconUrl ? { iconUrl } : {}),
    },
  });
  const { brandCredit } = normalized;

  if (!brandCredit.visible) {
    return null;
  }

  const classes = [
    "naya-signature",
    `naya-signature--${brandCredit.variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(
    "span",
    {
      className: classes,
      "data-naya-signature": true,
      "data-naya-signature-variant": brandCredit.variant,
    },
    React.createElement(
      "a",
      {
        className: "naya-signature__main",
        href: brandCredit.href,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `${brandCredit.label} ${brandCredit.brandName}`,
      },
      React.createElement(
        "span",
        { className: "naya-signature__icon-shell", "aria-hidden": "true" },
        React.createElement("img", {
          className: "naya-signature__icon",
          src: brandCredit.iconUrl,
          alt: "",
          loading: "lazy",
          decoding: "async",
        }),
      ),
      React.createElement(
        "span",
        { className: "naya-signature__copy" },
        React.createElement(
          "span",
          { className: "naya-signature__label" },
          brandCredit.label,
        ),
        React.createElement(
          "span",
          { className: "naya-signature__brand" },
          brandCredit.brandName,
        ),
      ),
    ),
    brandCredit.actions.length
      ? React.createElement(
          "span",
          {
            className: "naya-signature__actions",
            "data-naya-signature-actions": true,
          },
          brandCredit.actions.map((action) =>
            React.createElement(
              "a",
              {
                key: `${action.label}-${action.href}`,
                className: "naya-signature__action",
                href: action.href,
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label": action.label,
                title: action.label,
              },
              React.createElement("span", {
                className: "naya-signature__action-mark",
                "data-naya-signature-action-icon": action.icon,
                "aria-hidden": "true",
              }),
            ),
          ),
        )
      : null,
  );
}

export { normalizeSignatureConfig };
