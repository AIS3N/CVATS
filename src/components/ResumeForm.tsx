'use client';

import { useState } from 'react';
import { ResumeData, colorThemes } from '@/types/resume';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  darkMode: boolean;
  language: 'en' | 'fr';
  translations: Record<string, string>;
}

export default function ResumeForm({ 
  resumeData, 
  setResumeData, 
  activeColor, 
  setActiveColor,
  darkMode,
  language,
  translations: t
}: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState('personal');

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [
        ...resumeData.experiences,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          achievements: [''],
        },
      ],
    });
  };

  const updateExperience = (index: number, field: string, value: string | string[]) => {
    const updatedExperiences = [...resumeData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      experiences: updatedExperiences,
    });
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = [...resumeData.experiences];
    updatedExperiences.splice(index, 1);
    setResumeData({
      ...resumeData,
      experiences: updatedExperiences,
    });
  };

  const moveExperienceUp = (index: number) => {
    if (index === 0) return;
    const updatedExperiences = [...resumeData.experiences];
    [updatedExperiences[index], updatedExperiences[index - 1]] = [updatedExperiences[index - 1], updatedExperiences[index]];
    setResumeData({
      ...resumeData,
      experiences: updatedExperiences,
    });
  };

  const moveExperienceDown = (index: number) => {
    if (index === resumeData.experiences.length - 1) return;
    const updatedExperiences = [...resumeData.experiences];
    [updatedExperiences[index], updatedExperiences[index + 1]] = [updatedExperiences[index + 1], updatedExperiences[index]];
    setResumeData({
      ...resumeData,
      experiences: updatedExperiences,
    });
  };

  const addAchievement = (expIndex: number) => {
    const updatedExperiences = [...resumeData.experiences];
    updatedExperiences[expIndex].achievements.push('');
    setResumeData({
      ...resumeData,
      experiences: updatedExperiences,
    });
  };

  const updateAchievement = (expIndex: number, achievementIndex: number, value: string) => {
    const updatedExperiences = [...resumeData.experiences];
    updatedExperiences[expIndex].achievements[achievementIndex] = value;
    setResumeData({
      ...resumeData,
      experiences: updatedExperiences,
    });
  };

  const removeAchievement = (expIndex: number, achievementIndex: number) => {
    const updatedExperiences = [...resumeData.experiences];
    updatedExperiences[expIndex].achievements.splice(achievementIndex, 1);
    setResumeData({
      ...resumeData,
      experiences: updatedExperiences,
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    });
  };

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        {
          id: Date.now().toString(),
          name: '',
          level: 3,
        },
      ],
    });
  };

  const updateSkill = (index: number, field: string, value: string | number) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills.splice(index, 1);
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    });
  };

  const addReference = () => {
    setResumeData({
      ...resumeData,
      references: [
        ...resumeData.references,
        {
          id: Date.now().toString(),
          name: '',
          position: '',
          company: '',
          email: '',
          phone: '',
        },
      ],
    });
  };

  const updateReference = (index: number, field: string, value: string) => {
    const updatedReferences = [...resumeData.references];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      references: updatedReferences,
    });
  };

  const removeReference = (index: number) => {
    const updatedReferences = [...resumeData.references];
    updatedReferences.splice(index, 1);
    setResumeData({
      ...resumeData,
      references: updatedReferences,
    });
  };

  const exportToJson = () => {
    const dataToExport = {
      resumeData,
      activeColor,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(t.exportSuccess);
  };

  const importFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (importedData.resumeData) {
          setResumeData(importedData.resumeData);
          if (importedData.activeColor) {
            setActiveColor(importedData.activeColor);
          }
          alert(t.importSuccess);
        } else {
          alert(t.importError);
        }
      } catch {
        alert(t.importError);
      }
    };
    reader.readAsText(file);
    
    // Reset the input value so the same file can be imported again
    event.target.value = '';
  };

  return (
    <div className="p-6 rounded-lg shadow-md bg-[var(--background)] text-[var(--foreground)]">
      <div className="mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{t.colorTheme}</h2>
        </div>
        <div className="flex gap-3">
          {Object.entries(colorThemes).map(([color]) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full"
              style={{
                backgroundColor: colorThemes[color as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', ''),
                boxShadow: activeColor === color ? '0 0 0 2px white, 0 0 0 4px #9ca3af' : 'none'
              }}

              onClick={() => setActiveColor(color)}
              aria-label={`${color} theme`}
            />
          ))}
        </div>
      </div>

      {/* Export/Import Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{t.exportJson} / {t.importJson}</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={exportToJson}
            className="px-4 py-2 rounded font-medium transition-colors"
            style={{
              backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', ''),
              color: 'white'
            }}
          >
            📥 {t.exportJson}
          </button>
          <label className="px-4 py-2 rounded font-medium transition-colors cursor-pointer inline-block"
            style={{
              backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].secondary.replace('bg-[', '').replace(']', ''),
              color: colorThemes[activeColor as keyof typeof colorThemes].text.replace('text-[', '').replace(']', '')
            }}
          >
            📤 {t.importJson}
            <input
              type="file"
              accept=".json"
              onChange={importFromJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'personal' ? 'font-medium' : ''}`}
            style={activeTab === 'personal' ? {
              color: colorThemes[activeColor as keyof typeof colorThemes].text.replace('text-[', '').replace(']', ''),
              borderBottom: `2px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`
            } : {
              color: '#6b7280'
            }}
            onClick={() => setActiveTab('personal')}
          >
            {t.personal}
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'experience' ? 'font-medium' : ''}`}
            style={activeTab === 'experience' ? {
              color: colorThemes[activeColor as keyof typeof colorThemes].text.replace('text-[', '').replace(']', ''),
              borderBottom: `2px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`
            } : {
              color: '#6b7280'
            }}
            onClick={() => setActiveTab('experience')}
          >
            {t.experience}
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'education' ? 'font-medium' : ''}`}
            style={activeTab === 'education' ? {
              color: colorThemes[activeColor as keyof typeof colorThemes].text.replace('text-[', '').replace(']', ''),
              borderBottom: `2px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`
            } : {
              color: '#6b7280'
            }}
            onClick={() => setActiveTab('education')}
          >
            {t.education}
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'skills' ? 'font-medium' : ''}`}
            style={activeTab === 'skills' ? {
              color: colorThemes[activeColor as keyof typeof colorThemes].text.replace('text-[', '').replace(']', ''),
              borderBottom: `2px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`
            } : {
              color: '#6b7280'
            }}
            onClick={() => setActiveTab('skills')}
          >
            {t.skills}
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'references' ? 'font-medium' : ''}`}
            style={activeTab === 'references' ? {
              color: colorThemes[activeColor as keyof typeof colorThemes].text.replace('text-[', '').replace(']', ''),
              borderBottom: `2px solid ${colorThemes[activeColor as keyof typeof colorThemes].border.replace('border-[', '').replace(']', '')}`
            } : {
              color: '#6b7280'
            }}
            onClick={() => setActiveTab('references')}
          >
            {t.references}
          </button>
        </div>
      </div>

      {activeTab === 'personal' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{t.personalInfo}</h2>
          <div className="mb-6 p-4 border rounded" style={{backgroundColor: darkMode ? '#374151' : '#f9fafb'}}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: darkMode ? '#f9fafb' : '#374151'}}>{t.fullName}</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = ''}
                value={resumeData.personalInfo.name}
                onChange={(e) => updatePersonalInfo('name', e.target.value)}
                placeholder={language === 'en' ? 'John Doe' : 'Jean Dupont'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: darkMode ? '#f9fafb' : '#374151'}}>{t.jobTitle}</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = ''}
                value={resumeData.personalInfo.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                placeholder={language === 'en' ? 'Software Engineer' : 'Ingénieur Logiciel'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: darkMode ? '#f9fafb' : '#374151'}}>Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = ''}
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: darkMode ? '#f9fafb' : '#374151'}}>{t.phone}</label>
              <input
                type="tel"
                className="w-full p-2 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = ''}
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: darkMode ? '#f9fafb' : '#374151'}}>{t.address}</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = ''}
                value={resumeData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="New York, NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: darkMode ? '#f9fafb' : '#374151'}}>Website/LinkedIn</label>
              <input
                type="url"
                className="w-full p-2 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = ''}
                value={resumeData.personalInfo.website}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: darkMode ? '#f9fafb' : '#374151'}}>{language === 'en' ? 'Photo' : 'Photo'}</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = ''}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const result = event.target?.result as string;
                      updatePersonalInfo('photo', result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {resumeData.personalInfo.photo && (
                <div className="mt-2">
                  <div
                    className="w-16 h-16 rounded-full object-cover border-2 bg-gray-200 flex items-center justify-center"
                    style={{borderColor: '#d1d5db', backgroundImage: `url(${resumeData.personalInfo.photo})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
                  >
                    {!resumeData.personalInfo.photo && <span className="text-gray-400 text-xs">Photo</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => updatePersonalInfo('photo', '')}
                    className="ml-2 text-sm hover:opacity-80"
              style={{color: '#dc2626'}}
                  >
                    {language === 'en' ? 'Remove' : 'Supprimer'}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{color: darkMode ? '#f9fafb' : '#374151'}}>{t.summary}</label>
            <textarea
                    className="w-full p-2 border rounded focus:outline-none"
                     onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                     onBlur={(e) => e.target.style.borderColor = ''}
              rows={4}
              value={resumeData.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              placeholder={language === 'en' ? 'Experienced software engineer with a passion for developing innovative solutions...' : 'Ingenieur logiciel expérimenté passionné par la création de solutions innovantes...'}
            />
          </div>
          </div>
        </div>
      )}

      {activeTab === 'experience' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <button
              className="px-3 py-1 rounded text-white"
                style={{backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', '')}}
              onClick={addExperience}
            >
              Add Experience
            </button>
          </div>
          
          {resumeData.experiences.map((exp, index) => (
            <div key={exp.id} className="mb-6 p-4 border rounded" style={{backgroundColor: darkMode ? '#374151' : '#f9fafb'}}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Experience {index + 1}</h3>
                <div className="flex items-center gap-2">
                  {resumeData.experiences.length > 1 && (
                    <>
                      <button
                        className="px-2 py-1 text-sm rounded hover:opacity-80 disabled:opacity-50"
                        style={{backgroundColor: '#6b7280', color: 'white'}}
                        onClick={() => moveExperienceUp(index)}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="px-2 py-1 text-sm rounded hover:opacity-80 disabled:opacity-50"
                        style={{backgroundColor: '#6b7280', color: 'white'}}
                        onClick={() => moveExperienceDown(index)}
                        disabled={index === resumeData.experiences.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        className="hover:opacity-80"
                        style={{color: '#ef4444'}}
                        onClick={() => removeExperience(index)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Company</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                     onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                     onBlur={(e) => e.target.style.borderColor = ''}
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Position</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                     onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                     onBlur={(e) => e.target.style.borderColor = ''}
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Start Date</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                     onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                     onBlur={(e) => e.target.style.borderColor = ''}
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    placeholder="Jan 2020"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>End Date</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                     onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                     onBlur={(e) => e.target.style.borderColor = ''}
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    placeholder="Present"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Description</label>
                <textarea
                    className="w-full p-2 border rounded focus:outline-none"
                     onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                     onBlur={(e) => e.target.style.borderColor = ''}
                  rows={3}
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Brief description of your role and responsibilities"
                />
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium" style={{color: '#374151'}}>Key Achievements</label>
                  <button
                    className="text-sm px-2 py-1 rounded text-white"
                  style={{backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', '')}}
                    onClick={() => addAchievement(index)}
                  >
                    Add Achievement
                  </button>
                </div>
                
                {exp.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      className="flex-grow p-2 border rounded focus:outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = ''}
                      value={achievement}
                      onChange={(e) => updateAchievement(index, achievementIndex, e.target.value)}
                      placeholder="Increased revenue by 20% through..."
                    />
                    {exp.achievements.length > 1 && (
                      <button
                        className="ml-2 hover:opacity-80"
                    style={{color: '#ef4444'}}
                        onClick={() => removeAchievement(index, achievementIndex)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'education' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Education</h2>
            <button
              className="px-3 py-1 rounded text-white"
              style={{backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', '')}}
              onClick={addEducation}
            >
              Add Education
            </button>
          </div>
          
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="mb-6 p-4 border rounded" style={{backgroundColor: darkMode ? '#374151' : '#f9fafb'}}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Education {index + 1}</h3>
                {resumeData.education.length > 1 && (
                  <button
                    className="hover:opacity-80"
                    style={{color: '#ef4444'}}
                    onClick={() => removeEducation(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Institution</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = ''}
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Degree</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = ''}
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Field of Study</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = ''}
                    value={edu.field}
                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Start Date</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = ''}
                    value={edu.startDate}
                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    placeholder="Sep 2016"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>End Date</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = ''}
                    value={edu.endDate}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                    placeholder="Jun 2020"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Description</label>
                <textarea
                  className="w-full p-2 border rounded focus:outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = ''}
                  rows={3}
                  value={edu.description}
                  onChange={(e) => updateEducation(index, 'description', e.target.value)}
                  placeholder="Relevant coursework, honors, or activities"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <button
              className="px-3 py-1 rounded text-white"
                style={{backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', '')}}
              onClick={addSkill}
            >
              Add Skill
            </button>
          </div>
          
          {resumeData.skills.map((skill, index) => (
            <div key={skill.id} className="mb-4 p-4 border rounded" style={{backgroundColor: darkMode ? '#374151' : '#f9fafb'}}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex-grow">
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = ''}
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="Skill name (e.g., JavaScript, Project Management)"
                  />
                </div>
                {resumeData.skills.length > 1 && (
                  <button
                    className="ml-2 hover:opacity-80"
                style={{color: '#ef4444'}}
                    onClick={() => removeSkill(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Proficiency Level</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  className="w-full"
                  value={skill.level}
                  onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs" style={{color: '#6b7280'}}>
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'references' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">References</h2>
            <button
              className="px-3 py-1 rounded text-white"
                style={{backgroundColor: colorThemes[activeColor as keyof typeof colorThemes].primary.replace('bg-[', '').replace(']', '')}}
              onClick={addReference}
            >
              Add Reference
            </button>
          </div>
          
          {resumeData.references.map((reference, index) => (
            <div key={reference.id} className="mb-6 p-4 border rounded" style={{backgroundColor: darkMode ? '#374151' : '#f9fafb'}}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Reference {index + 1}</h3>
                {resumeData.references.length > 1 && (
                  <button
                    className="hover:opacity-80"
                    style={{color: '#ef4444'}}
                    onClick={() => removeReference(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = ''}
                    value={reference.name}
                    onChange={(e) => updateReference(index, 'name', e.target.value)}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Position</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = ''}
                    value={reference.position}
                    onChange={(e) => updateReference(index, 'position', e.target.value)}
                    placeholder="Senior Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Company</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = ''}
                    value={reference.company}
                    onChange={(e) => updateReference(index, 'company', e.target.value)}
                    placeholder="ABC Corporation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = ''}
                    value={reference.email}
                    onChange={(e) => updateReference(index, 'email', e.target.value)}
                    placeholder="jane.smith@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#374151'}}>Phone</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = ''}
                    value={reference.phone}
                    onChange={(e) => updateReference(index, 'phone', e.target.value)}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
