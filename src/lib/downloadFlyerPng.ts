import { toPng } from "html-to-image";

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Capture flyer DOM via SVG foreignObject (avoids html2canvas oklch parse errors). */
export async function downloadFlyerPng(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const styles = getComputedStyle(element);
  const bg =
    styles.getPropertyValue("--sf-bg").trim() ||
    styles.backgroundColor ||
    "#ffffff";

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: bg,
    style: {
      margin: "0",
      transform: "none",
    },
  });

  triggerDownload(dataUrl, filename);
}
