import { NayaGrowthSignature as SharedNayaGrowthSignature } from '../vendor/naya-site-signature/react';
import '../vendor/naya-site-signature/styles.css';
import { useEffect, useMemo, useState } from 'react';

type NayaGrowthSignatureProps = {
  eyebrow?: string;
};

const nayaCampaign = 'serefyinnovations.com';
const nayaLeadMessage = encodeURIComponent(
  'Hello Naya Growth, I saw your work on Serefy Innovations and want to discuss a website/lead system.'
);
const brandCreditApiBase = 'https://api.nayagrowth.com';

type BrandCreditRuntimeConfig = {
  brandCredit?: Record<string, unknown>;
};

export default function NayaGrowthSignature({
  eyebrow = 'Developed by',
}: NayaGrowthSignatureProps) {
  const fallbackConfig = useMemo(
    () => ({
      brandCredit: {
        variant: 'dark-glass',
        label: eyebrow,
        iconUrl: '/naya-growth-icon.png',
        href: `https://nayagrowth.com/?utm_source=brand_credit&utm_medium=client_site&utm_campaign=${nayaCampaign}`,
        actions: [
          {
            label: 'WhatsApp',
            href: `https://wa.me/919284620279?text=${nayaLeadMessage}`,
            icon: 'whatsapp',
          },
          {
            label: 'Contact',
            href: `https://nayagrowth.com/contact?utm_source=brand_credit&utm_medium=client_site&utm_campaign=${nayaCampaign}`,
            icon: 'mail',
          },
          {
            label: 'LinkedIn',
            href: 'https://linkedin.com/company/naya-growth',
            icon: 'linkedin',
          },
          {
            label: 'Instagram',
            href: 'https://instagram.com/nayagrowth',
            icon: 'instagram',
          },
        ],
      },
    }),
    [eyebrow],
  );
  const [config, setConfig] = useState(fallbackConfig);

  useEffect(() => {
    setConfig(fallbackConfig);
  }, [fallbackConfig]);

  useEffect(() => {
    const controller = new AbortController();
    const host =
      typeof window !== 'undefined' && window.location.hostname
        ? window.location.hostname
        : nayaCampaign;
    const endpoint = `${brandCreditApiBase}/api/landing/runtime/brand-credit-config?host=${encodeURIComponent(host)}`;

    fetch(endpoint, {
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : fallbackConfig))
      .then((runtimeConfig: BrandCreditRuntimeConfig) => {
        setConfig({
          brandCredit: {
            ...fallbackConfig.brandCredit,
            ...(runtimeConfig.brandCredit ?? {}),
            label: eyebrow,
          },
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setConfig(fallbackConfig);
        }
      });

    return () => controller.abort();
  }, [eyebrow, fallbackConfig]);

  return (
    <SharedNayaGrowthSignature
      config={config}
    />
  );
}
