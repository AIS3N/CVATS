import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { colorThemes, Experience, Education, Skill, Reference } from '@/types/resume';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Finds the Chrome executable installed via `npx puppeteer browsers install chrome` under the cache dir
function findChromeExecutable(cacheDir: string): string | undefined {
  try {
    const base = path.join(cacheDir, 'chrome');
    if (!fs.existsSync(base)) return undefined;
    const entries = fs.readdirSync(base, { withFileTypes: true }).filter((d) => d.isDirectory());
    // Look for latest version first
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = entries.length - 1; i >= 0; i--) {
      const dir = entries[i].name;
      const p1 = path.join(base, dir, 'chrome-linux64', 'chrome');
      const p2 = path.join(base, dir, 'chrome-linux', 'chrome');
      if (fs.existsSync(p1)) return p1;
      if (fs.existsSync(p2)) return p2;
    }
  } catch {
    // ignore
  }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const { resumeData, activeColor, language, filename, html, css, themePrimary, themeSecondary, themeText, themeBorder } = await request.json();

    if (!resumeData && !html) {
      return NextResponse.json({ error: 'Provide either resumeData or html' }, { status: 400 });
    }

    const safe = (s: string) => (s || '').replace(/[<>]/g, '');

    let fullHtml = '';

    if (html) {
      fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume</title>
          <style>
            * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; }
            ${css || ''}
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;
    } else {
      const theme = colorThemes[(activeColor as keyof typeof colorThemes) || 'blue'] || colorThemes.blue;
      const primaryComputed = theme.primary.replace('bg-[', '').replace(']', '');
      const secondaryComputed = theme.secondary.replace('bg-[', '').replace(']', '');
      const textColorComputed = theme.text.replace('text-[', '').replace(']', '');
      const borderColorComputed = theme.border.replace('border-[', '').replace(']', '');
      const primary = themePrimary || primaryComputed;
      const secondary = themeSecondary || secondaryComputed;
      const textColor = themeText || textColorComputed;
      const borderColor = themeBorder || borderColorComputed;

      const t = language === 'fr' ? {
        professionalSummary: 'RÉSUMÉ PROFESSIONNEL',
        experience: 'EXPÉRIENCE',
        education: 'FORMATION',
        skills: 'COMPÉTENCES',
        references: 'RÉFÉRENCES',
        keyAchievements: 'Réalisations clés :',
        yourName: 'Votre nom',
        yourJobTitle: 'Votre titre de poste'
      } : {
        professionalSummary: 'PROFESSIONAL SUMMARY',
        experience: 'EXPERIENCE',
        education: 'EDUCATION',
        skills: 'SKILLS',
        references: 'REFERENCES',
        keyAchievements: 'Key Achievements:',
        yourName: 'Your Name',
        yourJobTitle: 'Your Job Title'
      };

      const contactHtml = [
        resumeData.personalInfo.email && `<span>✉️ ${safe(resumeData.personalInfo.email)}</span>`,
        resumeData.personalInfo.phone && `<span>📱 ${safe(resumeData.personalInfo.phone)}</span>`,
        resumeData.personalInfo.location && `<span>📍 ${safe(resumeData.personalInfo.location)}</span>`,
        resumeData.personalInfo.website && `<span>🔗 ${safe(resumeData.personalInfo.website)}</span>`
      ].filter(Boolean).join(' • ');

      const experiencesHtml = (resumeData.experiences || []).map((exp: Experience) => {
        const achievementsHtml = (exp.achievements || [])
          .filter((a: string) => a && a.trim())
          .map((a: string) => `<li style="line-height:1.35;margin-bottom:1px;">${safe(a)}</li>`)
          .join('');
        const dates = exp.endDate
          ? `${safe(exp.startDate)} - ${safe(exp.endDate)}`
          : safe(exp.startDate);
        return `
          <div style="margin-bottom: 12px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
              <div>
                ${exp.position ? `<h3 style="font-weight:500;font-size:13px;margin:0;">${safe(exp.position)}</h3>` : ''}
                ${exp.company ? `<p style="font-size:12px;margin:2px 0 0 0;">${safe(exp.company)}</p>` : ''}
              </div>
              ${dates ? `<p style="font-size:12px;color:#4b5563;margin:0;white-space:nowrap;">${dates}</p>` : ''}
            </div>
            ${exp.description ? `<p style="font-size:12px;line-height:1.625;margin:2px 0 0 0;">${safe(exp.description)}</p>` : ''}
            ${achievementsHtml ? `<ul style="padding-left:16px;margin-top:0;margin-bottom:0;list-style-type:disc;list-style-position:outside;margin-left:8px;">${achievementsHtml}</ul>` : ''}
          </div>
        `;
      }).join('');

      const educationHtml = (resumeData.education || []).map((ed: Education) => `
        <div style="margin-bottom: 10px;">
          <div style="font-weight: 600;">${safe(ed.degree)}${ed.field ? `, ${safe(ed.field)}` : ''}</div>
          <div style="font-size: 12px; color: #555;">${safe(ed.institution)}</div>
          <div style="font-size: 12px; color: #555;">${safe(ed.startDate)}${ed.endDate ? ` - ${safe(ed.endDate)}` : ''}</div>
          ${ed.description ? `<div style="margin-top: 4px;">${safe(ed.description)}</div>` : ''}
        </div>
      `).join('');

      const skillsHtml = (resumeData.skills || []).map((sk: Skill) => {
        const bg = (Number(sk.level) >= 4) ? primary : secondary;
        const fg = (Number(sk.level) >= 4) ? '#ffffff' : textColor;
        return `
          <div style="display:inline-flex;align-items:center;justify-content:center;padding:4px 8px;border-radius:9999px;background:${bg};color:${fg};">
            ${safe(sk.name)}
          </div>
        `;
      }).join('');

      const referencesHtml = (resumeData.references || []).map((ref: Reference) => `
        <div style="margin-bottom: 10px;">
          <div style="font-weight: 600;">${safe(ref.name)}${ref.position ? `, ${safe(ref.position)}` : ''}</div>
          ${ref.company ? `<div style="font-size: 12px; color: #555;">${safe(ref.company)}</div>` : ''}
          ${ref.email ? `<div style="font-size: 12px; color: #555;">${safe(ref.email)}</div>` : ''}
          ${ref.phone ? `<div style="font-size: 12px; color: #555;">${safe(ref.phone)}</div>` : ''}
        </div>
      `).join('');

      const photoHtml = resumeData.personalInfo.photo ? `
        <img src="${resumeData.personalInfo.photo}" alt="Photo" style="width:64px;height:64px;border-radius:9999px;border:2px solid #fff;object-fit:cover;background:#eee;" />
      ` : '';

      fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; color: #111; }
            .page { width: 794px; min-height: 1123px; box-sizing: border-box; padding: 0px; }
            .main { padding-left: 16px; }
            .header { background: ${secondary}; padding: 16px; display: flex; gap: 16px; align-items: center; }
            .name { font-size: 22px; font-weight: 700; margin: 0; }
            .title { font-size: 16px; margin: 2px 0 0 0; color: ${textColor}; }
            .contact { margin-top: 8px; font-size: 12px; color: #333; }
            .section { margin-top: 12px; }
            .section-title { font-size: 14px; font-weight: 600; padding-bottom: 4px; border-bottom: 1px solid ${borderColor}; }
            .content { margin-top: 6px; font-size: 13px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              ${photoHtml}
              <div>
                <h1 class="name">${safe(resumeData.personalInfo.name) || t.yourName}</h1>
                <div class="title">${safe(resumeData.personalInfo.title) || t.yourJobTitle}</div>
                ${contactHtml ? `<div class="contact">${contactHtml}</div>` : ''}
              </div>
            </div>
            <div class="main">
              <div class="section">
                ${resumeData.personalInfo.summary ? `<div class="section-title">${t.professionalSummary}</div>` : ''}
                ${resumeData.personalInfo.summary ? `<div class="content">${safe(resumeData.personalInfo.summary)}</div>` : ''}
              </div>
              ${experiencesHtml ? `<div class="section"><div class="section-title">${t.experience}</div><div class="content">${experiencesHtml}</div></div>` : ''}
              ${educationHtml ? `<div class="section"><div class="section-title">${t.education}</div><div class="content">${educationHtml}</div></div>` : ''}
              ${skillsHtml ? `<div class="section"><div class="section-title">${t.skills}</div><div class="content" style="display: flex; flex-wrap: wrap; gap: 6px;">${skillsHtml}</div></div>` : ''}
              ${referencesHtml ? `<div class="section"><div class="section-title">${t.references}</div><div class="content">${referencesHtml}</div></div>` : ''}
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const cacheDir = process.env.PUPPETEER_CACHE_DIR || '/opt/render/.cache/puppeteer';
    const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || findChromeExecutable(cacheDir) || puppeteer.executablePath();
    console.log('[generate-pdf] PUPPETEER_CACHE_DIR:', cacheDir);
    console.log('[generate-pdf] Using Chrome executable:', execPath);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      executablePath: execPath
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(fullHtml, { waitUntil: ['networkidle0', 'domcontentloaded'] });

    const pdfData = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });

    await browser.close();

    const pdfBuffer = Buffer.from(pdfData);
    const finalName = filename || (resumeData?.personalInfo?.name ? `${String(resumeData.personalInfo.name).replace(/\s+/g, '_')}_Resume.pdf` : 'resume.pdf');
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${finalName}"`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error generating PDF:', message);
    return NextResponse.json({ error: 'Failed to generate PDF', message }, { status: 500 });
  }
}