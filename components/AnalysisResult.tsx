import React, { useState } from 'react';
import { CareerAnalysis, RoadmapLevel } from '../types';
import Button from './Button';
import { RefreshCw, TrendingUp, DollarSign, Award, AlertTriangle, CheckCircle, Map, ChevronDown, ChevronUp, Star, Zap } from 'lucide-react';

interface AnalysisResultProps {
  result: CareerAnalysis;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [activeRoadmapTab, setActiveRoadmapTab] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold">Career Insight Report</h2>
          <div className="flex items-center gap-2 mt-2 text-slate-300">
             <Star size={18} className="text-yellow-400 fill-yellow-400" />
             <span>Core Archetype: <strong className="text-white">{result.talentProfile.workingNature}</strong></span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {result.talentProfile.topStrengths.map((strength, i) => (
              <span key={i} className="px-3 py-1 bg-blue-600/30 border border-blue-500/50 rounded-full text-sm text-blue-100">
                {strength}
              </span>
            ))}
          </div>
        </div>
        <Button variant="secondary" onClick={onReset} className="bg-slate-700 hover:bg-slate-600 border border-slate-600">
          <RefreshCw size={18} className="mr-2 inline" /> New Assessment
        </Button>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.careerCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${
                  card.demand === 'High' ? 'bg-green-100 text-green-700 border-green-200' : 
                  card.demand === 'Emerging' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                  'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                  {card.demand} Demand
                </span>
                <span className="flex items-center font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                  {card.fitScore}% Match
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight min-h-[3.5rem] flex items-center">{card.title}</h3>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-grow space-y-5">
              
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Salary Band</p>
                  <p className="text-sm font-medium text-slate-800">{card.salary}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Growth Path</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{card.growth}</p>
                </div>
              </div>

              <div>
                 <p className="text-xs text-slate-500 font-semibold uppercase mb-2 flex items-center gap-1">
                    <CheckCircle size={14} className="text-blue-500" /> Why it fits
                 </p>
                 <ul className="space-y-1.5">
                    {card.reasons.map((r, i) => (
                        <li key={i} className="text-sm text-slate-700 pl-3 border-l-2 border-blue-200">{r}</li>
                    ))}
                 </ul>
              </div>

              <div>
                 <p className="text-xs text-slate-500 font-semibold uppercase mb-2 flex items-center gap-1">
                    <AlertTriangle size={14} className="text-amber-500" /> Skill Gaps
                 </p>
                 <div className="flex flex-wrap gap-2">
                    {card.gaps.map((g, i) => (
                        <span key={i} className="px-2 py-1 bg-amber-50 text-amber-800 text-xs rounded border border-amber-100">{g}</span>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <button 
          onClick={() => setShowRoadmap(!showRoadmap)}
          className="w-full flex justify-between items-center p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 text-white rounded-lg">
                <Map size={24} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-900">Learning Roadmap</h3>
                <p className="text-sm text-slate-500">Step-by-step plan for your #1 recommended role</p>
             </div>
          </div>
          {showRoadmap ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>

        {showRoadmap && (
          <div className="p-6 border-t border-slate-200">
             {/* Tabs */}
             <div className="flex space-x-2 border-b border-slate-200 mb-6">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <button
                        key={level}
                        onClick={() => setActiveRoadmapTab(level)}
                        className={`pb-3 px-4 text-sm font-semibold capitalize transition-all border-b-2 ${
                            activeRoadmapTab === level 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {level}
                    </button>
                ))}
             </div>

             {/* Content */}
             <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="text-amber-500" size={20} />
                    <h4 className="font-bold text-slate-900">Focus: {result.roadmap[activeRoadmapTab].focus}</h4>
                </div>
                <div className="space-y-4">
                    {result.roadmap[activeRoadmapTab].activities.map((activity, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                            <h5 className="font-semibold text-slate-900 mb-1">{activity.task}</h5>
                            <div className="text-sm text-slate-500 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 text-xs">⏱ {activity.time}</span>
                                <span className="text-blue-600">🛠 {activity.resources}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Final Guidance */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
         <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2 text-blue-200 font-medium uppercase tracking-wider text-sm">
                    <Award size={16} /> Final Verdict
                </div>
                <h2 className="text-3xl font-bold mb-4">{result.guidance.bestRole}</h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-6">
                    {result.guidance.reason}
                </p>
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-400" /> Immediate Actions (This Week)
                    </h4>
                    <ul className="space-y-2">
                        {result.guidance.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                                <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i+1}</span>
                                {action}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AnalysisResult;