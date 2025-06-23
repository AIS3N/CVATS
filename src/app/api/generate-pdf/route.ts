import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  // Dynamic imports for Vercel environment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chromium: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let puppeteerCore: any = null;

  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL === '1' || 
                   process.env.VERCEL_ENV || 
                   process.env.VERCEL_URL || 
                   process.env.NODE_ENV === 'production';
  
  console.log('Environment check:', {
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    NODE_ENV: process.env.NODE_ENV,
    isVercel
  });

  if (isVercel) {
    try {
      const chromiumModule = await import('@sparticuz/chromium');
      const puppeteerCoreModule = await import('puppeteer-core');
      chromium = chromiumModule.default || chromiumModule;
      puppeteerCore = puppeteerCoreModule.default || puppeteerCoreModule;
      
      // Force chromium to initialize fonts if available
      if (chromium.font) {
        await chromium.font('https://fonts.gstatic.com/s/noto/v20/NotoSans-Regular.ttf');
      }
      
      console.log('Successfully loaded Vercel dependencies');
      console.log('Chromium version:', chromium.version || 'unknown');
    } catch (error) {
      console.error('Failed to load Vercel dependencies:', error);
      throw new Error('Vercel dependencies required but not available');
    }
  }
  try {
    const { html, css, filename } = await request.json();
    
    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    let browser;
    
    if (isVercel) {
      // Vercel environment with chromium
      if (!chromium || !puppeteerCore) {
        throw new Error('Chromium dependencies not loaded for Vercel environment');
      }
      
      try {
        console.log('Attempting to get chromium executable path...');
        const executablePath = await chromium.executablePath();
        console.log('Chromium executable path:', executablePath);
        
        browser = await puppeteerCore.launch({
          args: [
            ...chromium.args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ],
          executablePath,
          headless: true,
          defaultViewport: null
        });
        console.log('Successfully launched browser with Chromium on Vercel');
      } catch (chromiumError) {
        console.error('Failed to launch with Chromium, trying fallback:', chromiumError);
        // Fallback to regular puppeteer
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
          ]
        });
        console.log('Launched browser with fallback puppeteer');
      }
    } else {
      // Local development environment
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
    }

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
        <script src="https://cdn.tailwindcss.com"></script>
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