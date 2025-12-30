import React from 'react';
import { Stage } from '../types';
import Button from './Button';
import { GraduationCap, Briefcase, School, BookOpen, Sparkles } from 'lucide-react';

interface StageSelectorProps {
  onSelect: (stage: Stage) => void;
}

const StageSelector: React.FC<StageSelectorProps> = ({ onSelect }) => {
  const stages = [
    { id: Stage.CLASS_10, label: "Class 10 Student", icon: School, desc: "Stream Selection (Science/Commerce/Arts)" },
    { id: Stage.CLASS_12, label: "Class 12 Student", icon: BookOpen, desc: "Degree & College Selection" },
    { id: Stage.COLLEGE, label: "College Student", icon: GraduationCap, desc: "Career Planning & Internships" },
    { id: Stage.PROFESSIONAL, label: "Working Professional", icon: Briefcase, desc: "Career Switch & Growth" },
    { id: Stage.HIDDEN_TALENT, label: "Hidden Talent Discovery", icon: Sparkles, desc: "Find your dormant potential & passions" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Select Your Current Stage</h2>
        <p className="text-slate-500 mt-2">Dr. Career Insight needs to know where you are starting from.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex flex-col items-start p-6 bg-white border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">{item.label}</h3>
              <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StageSelector;