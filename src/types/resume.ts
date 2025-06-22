export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
    photo: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  references: Reference[];
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
    photo: '',
  },
  experiences: [
    {
      id: '1',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [''],
    },
  ],
  education: [
    {
      id: '1',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ],
  skills: [
    {
      id: '1',
      name: '',
      level: 3,
    },
  ],
  references: [
    {
      id: '1',
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
    },
  ],
};

export const colorThemes = {
  blue: {
    primary: 'bg-[#2563eb]',
    secondary: 'bg-[#dbeafe]',
    text: 'text-[#2563eb]',
    border: 'border-[#2563eb]',
  },
  green: {
    primary: 'bg-[#16a34a]',
    secondary: 'bg-[#dcfce7]',
    text: 'text-[#16a34a]',
    border: 'border-[#16a34a]',
  },
  purple: {
    primary: 'bg-[#9333ea]',
    secondary: 'bg-[#f3e8ff]',
    text: 'text-[#9333ea]',
    border: 'border-[#9333ea]',
  },
  red: {
    primary: 'bg-[#dc2626]',
    secondary: 'bg-[#fee2e2]',
    text: 'text-[#dc2626]',
    border: 'border-[#dc2626]',
  },
  gray: {
    primary: 'bg-[#374151]',
    secondary: 'bg-[#e5e7eb]',
    text: 'text-[#374151]',
    border: 'border-[#374151]',
  },
  indigo: {
    primary: 'bg-[#4f46e5]',
    secondary: 'bg-[#e0e7ff]',
    text: 'text-[#4f46e5]',
    border: 'border-[#4f46e5]',
  },
  teal: {
    primary: 'bg-[#0d9488]',
    secondary: 'bg-[#ccfbf1]',
    text: 'text-[#0d9488]',
    border: 'border-[#0d9488]',
  },
  orange: {
    primary: 'bg-[#ea580c]',
    secondary: 'bg-[#fed7aa]',
    text: 'text-[#ea580c]',
    border: 'border-[#ea580c]',
  },
  pink: {
    primary: 'bg-[#db2777]',
    secondary: 'bg-[#fce7f3]',
    text: 'text-[#db2777]',
    border: 'border-[#db2777]',
  },
  cyan: {
    primary: 'bg-[#0891b2]',
    secondary: 'bg-[#cffafe]',
    text: 'text-[#0891b2]',
    border: 'border-[#0891b2]',
  },
  emerald: {
    primary: 'bg-[#059669]',
    secondary: 'bg-[#d1fae5]',
    text: 'text-[#059669]',
    border: 'border-[#059669]',
  },
  slate: {
    primary: 'bg-[#334155]',
    secondary: 'bg-[#e2e8f0]',
    text: 'text-[#334155]',
    border: 'border-[#334155]',
  },
  amber: {
    primary: 'bg-[#d97706]',
    secondary: 'bg-[#fef3c7]',
    text: 'text-[#d97706]',
    border: 'border-[#d97706]',
  },
  lime: {
    primary: 'bg-[#65a30d]',
    secondary: 'bg-[#ecfccb]',
    text: 'text-[#65a30d]',
    border: 'border-[#65a30d]',
  },
  rose: {
    primary: 'bg-[#e11d48]',
    secondary: 'bg-[#ffe4e6]',
    text: 'text-[#e11d48]',
    border: 'border-[#e11d48]',
  },
};