import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {


  try {
    const { html, css, filename } = await request.json();
    
    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }


    
    console.log('Launching browser with puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    console.log('Browser launched successfully');

    const page = await browser.newPage();
    
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2
    });

    // HTML document with embedded CSS
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        
        <style>
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-feature-settings: "liga", "kern";
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: #000;
            font-size: 14px;
            line-height: 1.5;
          }
          
          .border.rounded-lg {
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            width: 100% !important;
            padding: 0 !important;
          }
          
          #resume-preview {
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
            max-width: none !important;
            box-sizing: border-box !important;
          }
          
          .max-w-4xl {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .mx-auto {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          ul.list-disc {
            list-style-type: disc !important;
            list-style-position: outside !important;
            padding-left: 1.2rem !important;
            margin-left: 0.5rem !important;
            margin-top: 0.25rem !important;
            margin-bottom: 0.25rem !important;
          }
          
          ul.list-disc li {
            line-height: 1.4 !important;
            margin-bottom: 0.125rem !important;
            display: list-item !important;
            padding-left: 0 !important;
            list-style-type: disc !important;
          }
          
          .mt-1 { margin-top: 0.25rem !important; }
          .pl-4 { padding-left: 1rem !important; }
          .ml-2 { margin-left: 0.5rem !important; }
          .leading-relaxed { line-height: 1.625 !important; }
          .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .font-medium { font-weight: 500 !important; }
          .flex { display: flex !important; }
          .grid { display: grid !important; }
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .items-center { align-items: center !important; }
          .justify-between { justify-content: space-between !important; }
          .flex-wrap { flex-wrap: wrap !important; }
          .gap-4 { gap: 1rem !important; }
          .gap-2 { gap: 0.5rem !important; }
          
          * {
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          ${css || ''}
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    await page.setContent(fullHtml, {
      waitUntil: ['networkidle0', 'domcontentloaded']
    });
    
    await page.evaluateHandle('document.fonts.ready');
    
    // PDF Settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0in',
        right: '0in',
        bottom: '0in',
        left: '0in'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename || 'resume.pdf'}"`
      }
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}