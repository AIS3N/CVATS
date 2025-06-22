'use client';

import { useState, useEffect } from 'react';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { ResumeData, initialResumeData } from '@/types/resume';
 import { GB, FR } from 'country-flag-icons/react/3x2';

// Translation objects
const translations = {
  en: {
    title: "ATS-Friendly Resume Generator",
    colorTheme: "Color Theme",
    personal: "Personal",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    references: "References",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    jobTitle: "Job Title",
    email: "Email",
    phone: "Phone",
    address: "Address",
    summary: "Professional Summary",
    photo: "Photo",
    lightMode: "Light Mode",
    darkMode: "Dark Mode"
  },
  fr: {
    title: "Générateur de CV Compatible ATS",
    colorTheme: "Thème de Couleur",
    personal: "Personnel",
    experience: "Expérience",
    education: "Éducation",
    skills: "Compétences",
    references: "Références",
    personalInfo: "Informations Personnelles",
    fullName: "Nom Complet",
    jobTitle: "Titre du Poste",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    summary: "Résumé Professionnel",
    photo: "Photo",
    lightMode: "Mode Clair",
    darkMode: "Mode Sombre"
  }
};

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeColor, setActiveColor] = useState('blue');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  // Switch between Dark and Light Mode
  useEffect(() => {
    document.documentElement.classList.remove('dark-mode', 'light-mode');
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [darkMode]);

  const t = translations[language];

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          
          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="w-12 h-12 rounded-full overflow-hidden border-2 transition-colors shadow-md flex items-center justify-center"
            style={{borderColor: '#d1d5db'}}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            aria-label={`Current language: ${language === 'en' ? 'English' : 'French'}`}
          >
            {language === 'en' ? (
              <GB title="Switch to French" className="w-full h-full rounded-full object-cover" />
            ) : (
              <FR title="Switch to English" className="w-full h-full rounded-full object-cover" />
            )}
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <ResumeForm 
              resumeData={resumeData} 
              setResumeData={setResumeData} 
              activeColor={activeColor}
              setActiveColor={setActiveColor}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              language={language}
              translations={t}
            />
          </div>
          
          <div className="w-full lg:w-1/2 sticky top-8">
            <ResumePreview 
              resumeData={resumeData} 
              activeColor={activeColor}
              language={language}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
