import { experimental_getFontFileURL, fontData } from 'astro:assets';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import { SITE } from '../config';

const WIDTH = 1200;
const HEIGHT = 630;

type FontVariable = '--font-newsreader' | '--font-inter';

interface OgImageOptions {
  title: string;
  description: string;
  date?: Date;
  url: URL;
}

interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500;
  style: 'normal';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatOgDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .toUpperCase();
}

async function loadFont(
  cssVariable: FontVariable,
  weight: 400 | 500,
  style: 'normal',
  requestUrl: URL,
): Promise<ArrayBuffer | null> {
  const fonts = fontData[cssVariable];
  if (!fonts?.length) return null;

  const matchingStyle = fonts.filter((font) => (font.style ?? 'normal') === style);
  const exactWeight = matchingStyle.filter((font) => font.weight === String(weight));
  const candidates = [
    ...exactWeight,
    ...matchingStyle.filter((font) => !exactWeight.includes(font)),
    ...fonts,
  ];

  for (const font of candidates) {
    const source = font.src.find((src) => src.format === 'woff');
    if (!source) continue;

    const fontUrl = experimental_getFontFileURL(source.url, requestUrl);
    const response = await fetch(fontUrl);
    if (response.ok) return response.arrayBuffer();
  }

  return null;
}

export async function renderOgImage({
  title,
  description,
  date,
  url,
}: OgImageOptions): Promise<Buffer> {
  const [newsreader, interRegular, interMedium] = await Promise.all([
    loadFont('--font-newsreader', 400, 'normal', url),
    loadFont('--font-inter', 400, 'normal', url),
    loadFont('--font-inter', 500, 'normal', url),
  ]);

  const fonts: SatoriFont[] = [];
  if (newsreader) {
    fonts.push({ name: 'Newsreader', data: newsreader, weight: 400, style: 'normal' });
  }
  if (interRegular) {
    fonts.push({ name: 'Inter', data: interRegular, weight: 400, style: 'normal' });
  }
  if (interMedium) {
    fonts.push({ name: 'Inter', data: interMedium, weight: 500, style: 'normal' });
  }

  if (fonts.length === 0) {
    throw new Error('No fonts were available to generate the Open Graph image.');
  }

  const titleSize =
    title.length > 80 ? 50 : title.length > 60 ? 58 : title.length > 40 ? 66 : 74;
  const dateLabel = date ? formatOgDate(date) : SITE.location.toUpperCase();
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  const markup = html`
    <div
      style="display:flex;width:1200px;height:630px;flex-direction:column;justify-content:space-between;padding:64px 72px;background:#141414;color:#eae5da;font-family:Inter,sans-serif;box-sizing:border-box;"
    >
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span
            style="font-family:Newsreader,serif;font-size:40px;line-height:1;letter-spacing:-0.02em;color:#f5f1e8;"
            >${SITE.name}</span
          >
          <span
            style="display:block;width:8px;height:8px;margin-top:6px;border-radius:50%;background:#6e6961;"
          ></span>
        </div>
        <span
          style="font-family:Inter,sans-serif;font-size:17px;letter-spacing:0.14em;color:#989287;"
          >${dateLabel}</span
        >
      </div>

      <div style="display:flex;flex-direction:column;gap:26px;max-width:1010px;">
        <div
          style="font-family:Newsreader,serif;font-size:${titleSize}px;line-height:1.06;letter-spacing:-0.025em;color:#f5f1e8;"
        >
          ${safeTitle}
        </div>
        <div style="font-family:Inter,sans-serif;font-size:25px;line-height:1.45;color:#a9a397;">
          ${safeDescription}
        </div>
      </div>

      <div
        style="display:flex;align-items:center;justify-content:space-between;padding-top:22px;border-top:1px solid #2a2a28;font-family:Inter,sans-serif;font-size:19px;color:#989287;"
      >
        <span>daniyal-sh.github.io</span>
        <span>${SITE.description}</span>
      </div>
    </div>
  `;

  const svg = await satori(markup, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  return sharp(Buffer.from(svg)).png().toBuffer();
}
