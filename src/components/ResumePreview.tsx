'use client';

import { useRef, useState } from 'react';
import { ResumeData, colorThemes } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  activeColor: string;
  language: 'en' | 'fr';
}

export default function ResumePreview({ resumeData, activeColor, language }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const translations = {
    en: {
      resumePreview: 'Resume Preview',
      exportPDF: 'Export PDF',
      generating: 'Generating...',
      professionalSummary: 'PROFESSIONAL SUMMARY',
      experience: 'EXPERIENCE',
      education: 'EDUCATION',
      skills: 'SKILLS',
      references: 'REFERENCES',
      keyAchievements: 'Key Achievements:',
      position: 'Position',
      company: 'Company',
      startDate: 'Start Date',
      endDate: 'End Date',
      institution: 'Institution',
      yourName: 'Your Name',
      yourJobTitle: 'Your Job Title',
      at: 'at',
      in: 'in'
    },
    fr: {
      resumePreview: 'Aperçu du CV',
      exportPDF: 'Exporter PDF',
      generating: 'Génération...',
      professionalSummary: 'RÉSUMÉ PROFESSIONNEL',
      experience: 'EXPÉRIENCE',
      education: 'FORMATION',
      skills: 'COMPÉTENCES',
      references: 'RÉFÉRENCES',
      keyAchievements: 'Réalisations clés :',
      position: 'Poste',
      company: 'Entreprise',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      institution: 'Institution',
      yourName: 'Votre nom',
      yourJobTitle: 'Votre titre de poste',
      at: 'chez',
      in: 'en'
    }
  };

  const t = translations[language];

  const generatePDF = async () => {
    if (!resumeRef.current || isGeneratingPDF) return;

    setIsGeneratingPDF(true);
    try {
      const element = resumeRef.current;
      
      const css = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (_e) {
            return '';
          }
        })
        .join('\n');
      
      const filename = resumeData.personalInfo.name 
        ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: element.outerHTML,
          css: css,
          filename: filename
        })
      });
      
      if (!response.ok) {
        throw new Error('Puppeteer PDF generation failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Puppeteer PDF generation failed, falling back to client-side:', error);
      await generatePDFClientSide();
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const generatePDFClientSide = async () => {
    if (!resumeRef.current) return;

    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      const element = resumeRef.current;
      
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          font-feature-settings: "liga", "kern";
        }
        
        /* Remove border, rounded corners, margins and width constraints for PDF export */
        .border.rounded-lg {
          border: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          max-width: none !important;
          width: 100% !important;
        }
        
        /* Ensure proper font rendering */
        body, * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        }
        
        /* Fix list alignment for PDF export with exact CSS preservation */
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
         
         /* Ensure achievements section is visible */
         .mt-1 {
           margin-top: 0.25rem !important;
         }
         
         .pl-4 {
           padding-left: 1rem !important;
         }
         
         .ml-2 {
           margin-left: 0.5rem !important;
         }
         
         .leading-relaxed {
            line-height: 1.625 !important;
          }
          
          /* Ensure text visibility and proper font sizing */
          .text-xs {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
          }
          
          .font-medium {
            font-weight: 500 !important;
          }
          
          /* Force visibility of all content */
          * {
            visibility: visible !important;
            opacity: 1 !important;
          }
        
        /* Preserve layouts */
        .flex {
          display: flex !important;
        }
        
        .grid {
          display: grid !important;
        }
        
        .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        
        .items-center {
          align-items: center !important;
        }
        
        .justify-between {
          justify-content: space-between !important;
        }
        
        .flex-wrap {
          flex-wrap: wrap !important;
        }
        
        .gap-4 {
          gap: 1rem !important;
        }
        
        .gap-2 {
          gap: 0.5rem !important;
        }
      `;
      
       const tempContainer = document.createElement('div');
       tempContainer.style.position = 'absolute';
       tempContainer.style.left = '-9999px';
       tempContainer.style.top = '0';
       tempContainer.style.width = '210mm';
       tempContainer.style.height = 'auto';
       tempContainer.style.backgroundColor = '#ffffff';
       tempContainer.style.overflow = 'visible';
       tempContainer.style.zIndex = '-1';
       
       clonedElement.style.width = '100%';
       clonedElement.style.height = 'auto';
       clonedElement.style.overflow = 'visible';
       clonedElement.style.position = 'static';
       
       tempContainer.appendChild(style);
       tempContainer.appendChild(clonedElement);
       
       document.body.appendChild(tempContainer);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
        const canvas = await html2canvas(clonedElement, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
          width: clonedElement.scrollWidth,
          height: clonedElement.scrollHeight,
          windowWidth: 794,
          windowHeight: 1123
        });
      
      document.body.removeChild(tempContainer);
      
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
      const scaledWidth = imgWidth * 0.264583 * ratio;
      const scaledHeight = imgHeight * 0.264583 * ratio;
      
      const x = (pdfWidth - scaledWidth) / 2;
      const y = 0;
       
      pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
      
      const filename = resumeData.personalInfo.name 
        ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t.resumePreview}</h2>
        <div className="flex gap-2">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className={`px-3 py-1 rounded text-white flex items-center gap-2 transition-opacity ${
              isGeneratingPDF ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            style={{backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', '')}}
          >
            {isGeneratingPDF && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isGeneratingPDF ? t.generating : t.exportPDF}
          </button>

        </div>
      </div>
      
      <div 
        ref={resumeRef}
        className="border rounded-lg overflow-hidden bg-white" 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          minHeight: 'auto',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: '1.4',
          letterSpacing: '0.01em'
        }}
      >
        {/* Header */}
        <div className="p-4" style={{backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].secondary.replace('bg-[', '').replace(']', '')}}>
          <div className="flex items-start gap-4">
            {resumeData.personalInfo.photo && (
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md bg-gray-200 flex items-center justify-center"
                  style={{
                    backgroundImage: resumeData.personalInfo.photo ? `url(${resumeData.personalInfo.photo})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!resumeData.personalInfo.photo && <span className="text-gray-400 text-xs">Photo</span>}
                </div>
              </div>
            )}
            <div className="flex-grow">
              <h1 className="text-xl font-bold">{resumeData.personalInfo.name || t.yourName}</h1>
              <p className="text-base" style={{color: colorThemes[activeColor as keyof typeof colorThemes].text.replace('text-[', '').replace(']', '')}}>
                {resumeData.personalInfo.title || t.yourJobTitle}
              </p>
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {resumeData.personalInfo.email && (
              <div className="flex items-center">
                <span className="mr-1">✉️</span>
                <span>{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-center">
                <span className="mr-1">📱</span>
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.location && (
              <div className="flex items-center">
                <span className="mr-1">📍</span>
                <span>{resumeData.personalInfo.location}</span>
              </div>
            )}
            {resumeData.personalInfo.website && (
              <div className="flex items-center">
                <span className="mr-1">🔗</span>
                <span>{resumeData.personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Summary */}
          {resumeData.personalInfo.summary && (
            <div className="mb-4">
              <h2 className="text-base font-semibold mb-1 pb-2" style={{borderBottom: `1px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`}}>
                {t.professionalSummary}
              </h2>
              <p className="text-xs leading-relaxed">{resumeData.personalInfo.summary}</p>
            </div>
          )}
          
          {/* Experience */}
          {resumeData.experiences.some(exp => exp.company || exp.position) && (
            <div className="mb-4">
              <h2 className="text-base font-semibold mb-1 pb-2" style={{borderBottom: `1px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`}}>
                {t.experience}
              </h2>
              
              {resumeData.experiences.map((exp) => (
                (exp.company || exp.position) && (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{exp.position || t.position}</h3>
                        <p className="text-xs">{exp.company || t.company}</p>
                      </div>
                      <p className="text-xs" style={{color: '#4b5563'}}>
                        {exp.startDate || t.startDate} - {exp.endDate || t.endDate}
                      </p>
                    </div>
                    
                    {exp.description && <p className="text-xs mt-1 leading-relaxed">{exp.description}</p>}
                    
                    {exp.achievements.some(a => a.trim()) && (
                      <div className="mt-1">
                        <p className="text-xs font-medium">{t.keyAchievements}</p>
                        <ul className="list-disc list-outside text-xs pl-4 ml-2 leading-relaxed">
                          {exp.achievements.map((achievement, i) => (
                            achievement.trim() && (
                              <li key={i}>{achievement}</li>
                            )
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* Education */}
          {resumeData.education.some(edu => edu.institution || edu.degree) && (
            <div className="mb-4">
              <h2 className="text-base font-semibold mb-1 pb-2" style={{borderBottom: `1px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`}}>
                {t.education}
              </h2>
              
              {resumeData.education.map((edu) => (
                (edu.institution || edu.degree) && (
                  <div key={edu.id} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{edu.degree} {edu.field ? `${t.in} ${edu.field}` : ''}</h3>
                        <p className="text-xs">{edu.institution || t.institution}</p>
                      </div>
                      <p className="text-xs" style={{color: '#4b5563'}}>
                        {edu.startDate || t.startDate} - {edu.endDate || t.endDate}
                      </p>
                    </div>
                    
                    {edu.description && <p className="text-xs mt-1 leading-relaxed">{edu.description}</p>}
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* Skills */}
          {resumeData.skills.some(skill => skill.name) && (
            <div className="mb-4">
              <h2 className="text-base font-semibold mb-1 pb-2" style={{borderBottom: `1px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`}}>
                {t.skills}
              </h2>
              
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.map((skill) => (
                  skill.name && (
                    <div 
                      key={skill.id} 
                      className="px-2 py-1 rounded-full text-xs"
                      style={skill.level >= 4 ? {
                        backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', ''),
                        color: 'white'
                      } : {
                        backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].secondary.replace('bg-[', '').replace(']', ''),
                        color: colorThemes[activeColor as keyof typeof colorThemes].text.replace('text-[', '').replace(']', '')
                      }}
                    >
                      {skill.name}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {/* References */}
          {resumeData.references.some(ref => ref.name) && (
            <div>
              <h2 className="text-base font-semibold mb-1 pb-2" style={{borderBottom: `1px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`}}>
                {t.references}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resumeData.references.map((ref) => (
                  ref.name && (
                    <div key={ref.id} className="text-xs">
                      <p className="font-medium">{ref.name}</p>
                      {ref.position && ref.company && (
                        <p>{ref.position} {t.at} {ref.company}</p>
                      )}
                      {(ref.email || ref.phone) && (
                        <p style={{color: '#4b5563'}}>
                          {ref.email && <span>{ref.email}</span>}
                          {ref.email && ref.phone && <span> | </span>}
                          {ref.phone && <span>{ref.phone}</span>}
                        </p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}