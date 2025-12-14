import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { colorThemes, Experience, Education, Skill, Reference } from '@/types/resume';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { resumeData, activeColor, language, filename, html, css } = await request.json();

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
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; }
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
      const primary = theme.primary.replace('bg-[', '').replace(']', '');
      const secondary = theme.secondary.replace('bg-[', '').replace(']', '');
      const textColor = theme.text.replace('text-[', '').replace(']', '');
      const borderColor = theme.border.replace('border-[', '').replace(']', '');

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
          .map((a: string) => `<li>${safe(a)}</li>`)
          .join('');
        return `
          <div style="margin-bottom: 10px;">
            <div style="font-weight: 600;">${safe(exp.position)}${exp.company ? `, ${safe(exp.company)}` : ''}</div>
            <div style="font-size: 12px; color: #555;">${safe(exp.startDate)}${exp.endDate ? ` - ${safe(exp.endDate)}` : ''}</div>
            ${exp.description ? `<div style="margin-top: 4px;">${safe(exp.description)}</div>` : ''}
            ${achievementsHtml ? `<ul style="padding-left: 16px; margin-top: 4px;">${achievementsHtml}</ul>` : ''}
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

      const skillsHtml = (resumeData.skills || []).map((sk: Skill) => `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>${safe(sk.name)}</span>
          <div style="height: 6px; background: #eee; flex: 1; border-radius: 3px; overflow: hidden;">
            <div style="width: ${(Math.max(0, Math.min(5, sk.level)) / 5) * 100}%; height: 100%; background: ${primary};"></div>
          </div>
        </div>
      `).join('');

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
            .page { width: 794px; min-height: 1123px; box-sizing: border-box; padding: 20px; }
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
            <div class="section">
              ${resumeData.personalInfo.summary ? `<div class="section-title">${t.professionalSummary}</div>` : ''}
              ${resumeData.personalInfo.summary ? `<div class="content">${safe(resumeData.personalInfo.summary)}</div>` : ''}
            </div>
            ${experiencesHtml ? `<div class="section"><div class="section-title">${t.experience}</div><div class="content">${experiencesHtml}</div></div>` : ''}
            ${educationHtml ? `<div class="section"><div class="section-title">${t.education}</div><div class="content">${educationHtml}</div></div>` : ''}
            ${skillsHtml ? `<div class="section"><div class="section-title">${t.skills}</div><div class="content" style="display: grid; gap: 6px;">${skillsHtml}</div></div>` : ''}
            ${referencesHtml ? `<div class="section"><div class="section-title">${t.references}</div><div class="content">${referencesHtml}</div></div>` : ''}
          </div>
        </body>
        </html>
      `;
    }

    console.log('[generate-pdf] PUPPETEER_CACHE_DIR:', process.env.PUPPETEER_CACHE_DIR);
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
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

    function resolveExecutablePath(): string | undefined {
      const candidates: (string | undefined)[] = [];
      const cacheDir = process.env.PUPPETEER_CACHE_DIR || '/opt/render/.cache/puppeteer';
      const cachePath = findChromeInCache(cacheDir);
      if (cachePath) candidates.push(cachePath);
      if (process.env.PUPPETEER_EXECUTABLE_PATH) candidates.push(process.env.PUPPETEER_EXECUTABLE_PATH);
      let pptrPath: string | undefined;
      try {
        pptrPath = puppeteer.executablePath();
        candidates.push(pptrPath);
      } catch (_) {}
      candidates.push(
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome-beta'
      );
      console.log('[generate-pdf] Cache dir:', cacheDir);
      console.log('[generate-pdf] Candidate paths:', candidates.filter(Boolean));
      for (const p of candidates) {
        if (p && fs.existsSync(p)) return p;
      }
      // As a last resort, return puppeteer.executablePath even if fs check failed
      return pptrPath;
    }

// Removed stray helper function that caused lint errors