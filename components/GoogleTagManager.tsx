import Script from "next/script";

type GoogleTagManagerProps = {
    gtmId: string;
};

export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
    if (!gtmId) {
        return null;
    }

    const encodedGtmId = encodeURIComponent(gtmId);

    return (
        <>
            <Script id="google-tag-manager" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        "gtm.start": new Date().getTime(),
                        event: "gtm.js"
                    });
                `}
            </Script>
            <Script
                id="google-tag-manager-src"
                src={`https://www.googletagmanager.com/gtm.js?id=${encodedGtmId}`}
                strategy="afterInteractive"
            />
            <noscript>
                <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${encodedGtmId}`}
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                />
            </noscript>
        </>
    );
}
