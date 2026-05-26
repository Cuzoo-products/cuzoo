import { forwardRef } from "react";
import { Zap } from "lucide-react";
import { QRCodeBlock } from "./QRCodeBlock";

interface FlyerPreviewCardProps {
  storeName: string;
  storeCode: string;
  showQR: boolean;
  storeUrl: string;
}

export const FlyerPreviewCard = forwardRef<HTMLDivElement, FlyerPreviewCardProps>(
  function FlyerPreviewCard(
    { storeName, storeCode, showQR, storeUrl },
    ref,
  ) {
    return (
      <div ref={ref} className="store-flyer-canvas">
        <div className="store-flyer-canvas__accent" />

        <div className="store-flyer-canvas__body">
          <div className="store-flyer-canvas__stack">
            <div className="store-flyer-canvas__brand-wrap">
              <div className="store-flyer-canvas__brand-icon">
                <Zap className="h-8 w-8" strokeWidth={2.5} aria-hidden />
              </div>
              <h2 className="store-flyer-canvas__title">CUZOO</h2>
              <p className="store-flyer-canvas__store-name">{storeName}</p>
            </div>

            {showQR && storeCode ? (
              <div className="store-flyer-canvas__qr-wrap">
                <div className="store-flyer-canvas__qr-outer">
                  <div className="store-flyer-canvas__qr-inner">
                    <QRCodeBlock value={storeUrl} size={200} />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="store-flyer-canvas__code-block">
              <p className="store-flyer-canvas__code-label">Store Code</p>
              <p className="store-flyer-canvas__code-value">
                {storeCode || "—"}
              </p>
            </div>

            <div className="store-flyer-canvas__cta">
              <span className="store-flyer-canvas__cta-dot" aria-hidden />
              <p className="store-flyer-canvas__cta-text">
                Scan to shop or order
              </p>
              <span className="store-flyer-canvas__cta-dot" aria-hidden />
            </div>

            <div className="store-flyer-canvas__footer">
              <p className="store-flyer-canvas__footer-text">Powered by Cuzoo</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
