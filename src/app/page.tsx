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
    darkMode: "Dark Mode",
    infoTitle: "Why Choose Our Resume Generator?",
    freeInfo: "💯 100% Free - No hidden costs or subscriptions",
    privacyInfo: "🔒 Your data stays private - nothing is stored in our database",
    atsInfo: "📄 Single-column layout optimized for ATS and recruitment bots",
    formatInfo: "📏 Professional A4 format - the industry standard"
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
    darkMode: "Mode Sombre",
    infoTitle: "Pourquoi Choisir Notre Générateur de CV ?",
    freeInfo: "💯 100% Gratuit - Aucun coût caché ou abonnement",
    privacyInfo: "🔒 Vos données restent privées - rien n'est stocké dans notre base de données",
    atsInfo: "📄 Mise en page à colonne unique optimisée pour les ATS et robots de recrutement",
    formatInfo: "📏 Format A4 professionnel - la norme de l'industrie"
  }
};

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeColor, setActiveColor] = useState('blue');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  // Switch between Dark and Light Mode
  useEffect(() => {
    document.documentElement.classList.remove('dark-mode', 'light-mode', 'dark');
    if (darkMode) {
      document.documentElement.classList.add('dark-mode', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [darkMode]);

  const t = translations[language];

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center px-3 py-2 rounded-md transition-colors border-2 shadow-md"
              style={{
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                color: darkMode ? '#f9fafb' : '#111827',
                borderColor: '#d1d5db'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#4b5563' : '#e5e7eb'
                e.currentTarget.style.borderColor = '#9ca3af'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6'
                e.currentTarget.style.borderColor = '#d1d5db'
              }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{t.lightMode}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>{t.darkMode}</span>
                </>
              )}
            </button>
            
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
        </div>
        
        {/* Information Section */}
        <div className="mb-8 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">{t.infoTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
             <div className="flex items-start p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600">
               <span className="text-gray-900 dark:text-gray-200 leading-relaxed">{t.freeInfo}</span>
             </div>
             <div className="flex items-start p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600">
               <span className="text-gray-900 dark:text-gray-200 leading-relaxed">{t.privacyInfo}</span>
             </div>
             <div className="flex items-start p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600">
               <span className="text-gray-900 dark:text-gray-200 leading-relaxed">{t.atsInfo}</span>
             </div>
             <div className="flex items-start p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600">
               <span className="text-gray-900 dark:text-gray-200 leading-relaxed">{t.formatInfo}</span>
             </div>
           </div>
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
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-600">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-200">
                {language === 'en' ? 'What makes a great resume?' : 'Qu\'est-ce qui fait un excellent CV ?'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {language === 'en' ? '✨ Clear Structure' : '✨ Structure Claire'}
                  </span>
                  <p className="mt-1">
                    {language === 'en' ? 'Organized sections with consistent formatting' : 'Sections organisées avec un formatage cohérent'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {language === 'en' ? '🎯 Relevant Keywords' : '🎯 Mots-clés Pertinents'}
                  </span>
                  <p className="mt-1">
                    {language === 'en' ? 'Industry-specific terms that match job descriptions' : 'Termes spécifiques à l\'industrie qui correspondent aux descriptions de poste'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {language === 'en' ? '📊 Quantified Achievements' : '📊 Réalisations Quantifiées'}
                  </span>
                  <p className="mt-1">
                    {language === 'en' ? 'Numbers and metrics that demonstrate impact' : 'Chiffres et métriques qui démontrent l\'impact'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {language === 'en' ? 'Built with ❤️ for job seekers worldwide' : 'Conçu avec ❤️ pour les chercheurs d\'emploi du monde entier'}
              </p>
              <div className="flex justify-center items-center space-x-4">
                <a 
                  href="https://x.com/demirel_sc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @demirel_sc
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
