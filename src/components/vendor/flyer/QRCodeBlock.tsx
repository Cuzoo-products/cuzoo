import { QRCodeCanvas } from "qrcode.react";

interface QRCodeBlockProps {
  value: string;
  size?: number;
}

export function QRCodeBlock({ value, size = 200 }: QRCodeBlockProps) {
  return (
    <div className="store-flyer-qr">
      <div className="store-flyer-qr__box">
        <QRCodeCanvas
          value={value}
          size={size}
          level="H"
          includeMargin
          fgColor="#000000"
          bgColor="#FFFFFF"
        />
      </div>
    </div>
  );
}
