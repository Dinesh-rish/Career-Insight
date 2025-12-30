import React, { useState } from 'react';
import { Stage, QuizAnswer, UserContext, CareerAnalysis } from './types';
import StageSelector from './components/StageSelector';
import Quiz from './components/Quiz';
import StageSpecificQuiz from './components/StageSpecificQuiz';
import AnalysisResult from './components/AnalysisResult';
import Card from './components/Card';
import { generateCareerAnalysis } from './services/geminiService';
import { BrainCircuit } from 'lucide-react';

enum AppStep {
  INTRO = 'INTRO',
  STAGE_SELECT = 'STAGE_SELECT',
  QUIZ_PHASE_1 = 'QUIZ_PHASE_1',
  QUIZ_PHASE_2 = 'QUIZ_PHASE_2',
  RESULT = 'RESULT'
}

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INTRO);
  const [userContext, setUserContext] = useState<UserContext>({
    stage: null,
    answers: [],
    stageSpecificAnswers: {}
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CareerAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStageSelect = (stage: Stage) => {
    setUserContext(prev => ({ ...prev, stage }));
    setStep(AppStep.QUIZ_PHASE_1);
  };

  const handlePhase1Complete = (answers: QuizAnswer[]) => {
    setUserContext(prev => ({ ...prev, answers }));
    setStep(AppStep.QUIZ_PHASE_2);
  };

  const handlePhase2Complete = async (answers: Record<string, string>) => {
    const finalContext = { ...userContext, stageSpecificAnswers: answers };
    setUserContext(finalContext);

    // Trigger Analysis Immediately
    setIsAnalyzing(true);
    setStep(AppStep.RESULT); // Move to result view (which handles loading state)
    setError(null);

    try {
      const result = await generateCareerAnalysis(finalContext);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong with the analysis. Please check your API key.");
      setStep(AppStep.QUIZ_PHASE_2); // Go back if error so they can try again
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setStep(AppStep.INTRO);
    setUserContext({ stage: null, answers: [], stageSpecificAnswers: {} });
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-700">
            <BrainCircuit size={32} strokeWidth={2.5} />
            <div className="leading-tight">
              <h1 className="font-bold text-xl tracking-tight text-slate-900">Dr. Career Insight</h1>
              <span className="text-xs font-medium text-slate-500">AI-Powered Psychometrics</span>
            </div>
          </div>
          {step !== AppStep.INTRO && (
            <div className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-500">
              {step === AppStep.RESULT ? "Report Ready" : `Phase ${step === AppStep.QUIZ_PHASE_1 ? '1' : '2'}`}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-5xl mx-auto">

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {step === AppStep.INTRO && (
            <div className="max-w-3xl mx-auto text-center mt-12">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Stop Guessing Your Future. <br />
                <span className="text-blue-600">Start Engineering It.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Most career advice is vague. Dr. Career Insight uses a rigorous
                <strong> Two-Phase Diagnosis</strong> system: <br />
                1. <strong>Talent Digger:</strong> Measures your natural cognitive wiring.<br />
                2. <strong>Context Audit:</strong> Analyzes your specific reality and constraints.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                {[
                  { title: "Objective Diagnosis", desc: "No sugar-coating. We tell you what you're good at and what you're not." },
                  { title: "Evidence Based", desc: "Every recommendation is backed by your quiz data and academic history." },
                  { title: "Actionable Roadmap", desc: "Get a specific 12-month plan, not just a job title." }
                ].map((f, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(AppStep.STAGE_SELECT)}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                Start Assessment
              </button>
            </div>
          )}

          {step === AppStep.STAGE_SELECT && (
            <Card className="p-8 max-w-3xl mx-auto animate-fade-in-up">
              <StageSelector onSelect={handleStageSelect} />
            </Card>
          )}

          {step === AppStep.QUIZ_PHASE_1 && (
            <Card className="p-8 max-w-3xl mx-auto">
              <Quiz onComplete={handlePhase1Complete} />
            </Card>
          )}

          {step === AppStep.QUIZ_PHASE_2 && userContext.stage && (
            <Card className="p-8 max-w-3xl mx-auto">
              <StageSpecificQuiz
                stage={userContext.stage}
                onComplete={handlePhase2Complete}
              />
            </Card>
          )}

          {step === AppStep.RESULT && (
            isAnalyzing ? (
              <div className="max-w-2xl mx-auto text-center py-20">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold text-slate-900">Dr. Career Insight is thinking...</h3>
                <p className="text-slate-500 mt-2">Correlating your Talent Digger scores with your Context Audit...</p>
              </div>
            ) : (
              analysisResult && <AnalysisResult result={analysisResult} onReset={resetApp} />
            )
          )}

        </div>
      </main>
    </div>
  );
};

export default App;