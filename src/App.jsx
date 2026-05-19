import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  GraduationCap, 
  Menu, 
  X,
  Sun,
  Moon,
  User,
  Clock,
  Percent,
  Award,
  Smartphone,
  Laptop,
  Users,
  Brain,
  RefreshCw,
  ArrowRight,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Plus
} from 'lucide-react';

/* ==========================================
   1. ML REGRESSION ENGINE & RECS LOGIC
   ========================================== */

const CATEGORICAL_MAPPINGS = {
  Level: { 'Low': 1, 'Medium': 2, 'High': 3 }
};

const BENCHMARKS = {
  studyHours: 4,
  attendance: 80,
  previousScore: 70,
  assignmentRate: 80,
  sleepHours: 7.5,
  internetAccess: 0.8,
  socialMediaUsage: 3,
  participation: 2,
  extracurriculars: 0.5,
  parentEducation: 2,
  familySupport: 2
};

function predictGrade(data) {
  const studyHours = Math.min(Math.max(parseFloat(data.studyHours) || 0, 0), 16);
  const attendance = Math.min(Math.max(parseFloat(data.attendance) || 0, 0), 100);
  const previousScore = Math.min(Math.max(parseFloat(data.previousScore) || 0, 0), 100);
  const assignmentRate = Math.min(Math.max(parseFloat(data.assignmentRate) || 0, 0), 100);
  const sleepHours = Math.min(Math.max(parseFloat(data.sleepHours) || 0, 0), 16);
  const internetAccess = data.internetAccess === 'Yes' ? 1 : 0;
  const socialMediaUsage = Math.min(Math.max(parseFloat(data.socialMediaUsage) || 0, 0), 16);
  const extracurriculars = data.extracurriculars === 'Yes' ? 1 : 0;

  const participation = CATEGORICAL_MAPPINGS.Level[data.participation] || 2;
  const parentEducation = CATEGORICAL_MAPPINGS.Level[data.parentEducation] || 2;
  const familySupport = CATEGORICAL_MAPPINGS.Level[data.familySupport] || 2;

  const rawScore = 
    (studyHours * 8) + 
    (attendance * 0.3) + 
    (previousScore * 0.4) + 
    (assignmentRate * 0.2) + 
    (sleepHours * 2) + 
    (internetAccess * 5) - 
    (socialMediaUsage * 1.5) +
    (participation * 3) +
    (extracurriculars * 2) +
    (parentEducation * 2.5) + 
    (familySupport * 2.5);

  const rawMin = 15;
  const rawMax = 205;

  const normalized = ((rawScore - rawMin) / (rawMax - rawMin)) * 100;
  const finalPercentage = Math.min(100, Math.max(0, Math.round(normalized)));

  const contributions = [
    { name: 'Study Hours', value: (studyHours - BENCHMARKS.studyHours) * 8 },
    { name: 'Attendance', value: (attendance - BENCHMARKS.attendance) * 0.3 },
    { name: 'Previous Score', value: (previousScore - BENCHMARKS.previousScore) * 0.4 },
    { name: 'Assignments', value: (assignmentRate - BENCHMARKS.assignmentRate) * 0.2 },
    { name: 'Sleep', value: (sleepHours - BENCHMARKS.sleepHours) * 2 },
    { name: 'Internet Access', value: (internetAccess - BENCHMARKS.internetAccess) * 5 },
    { name: 'Social Media', value: -(socialMediaUsage - BENCHMARKS.socialMediaUsage) * 1.5 },
    { name: 'Participation', value: (participation - BENCHMARKS.participation) * 3 },
    { name: 'Extracurriculars', value: (extracurriculars - BENCHMARKS.extracurriculars) * 2 },
    { name: 'Parental Education', value: (parentEducation - BENCHMARKS.parentEducation) * 2.5 },
    { name: 'Family Support', value: (familySupport - BENCHMARKS.familySupport) * 2.5 }
  ];

  let grade = 'D';
  let status = 'At Risk';
  let color = 'rose';

  if (finalPercentage >= 90) {
    grade = 'A+';
    status = 'Excellent';
    color = 'indigo';
  } else if (finalPercentage >= 80) {
    grade = 'A';
    status = 'Very Good';
    color = 'emerald';
  } else if (finalPercentage >= 70) {
    grade = 'B';
    status = 'Good';
    color = 'amber';
  } else if (finalPercentage >= 60) {
    grade = 'C';
    status = 'Satisfactory';
    color = 'sky';
  }

  const recommendations = [];
  if (studyHours < 4) {
    recommendations.push({
      type: 'study',
      text: 'Increase study hours to at least 4-5 hours daily to reinforce classroom learning.',
      priority: 'High'
    });
  }
  if (attendance < 85) {
    recommendations.push({
      type: 'attendance',
      text: 'Prioritize attending all classes (aim >90%). Regular attendance prevents learning gaps.',
      priority: 'Critical'
    });
  }
  if (previousScore < 70) {
    recommendations.push({
      type: 'academic',
      text: 'Review core concepts from past exams and focus on foundational topic revision.',
      priority: 'Medium'
    });
  }
  if (assignmentRate < 80) {
    recommendations.push({
      type: 'assignments',
      text: 'Complete all assignments on time. Missing assignments are causing major score leaks.',
      priority: 'High'
    });
  }
  if (sleepHours < 7) {
    recommendations.push({
      type: 'lifestyle',
      text: 'Aim for 7-8 hours of sleep. Sleeping enough helps with recall, focus, and reducing test anxiety.',
      priority: 'Medium'
    });
  }
  if (socialMediaUsage > 4) {
    recommendations.push({
      type: 'lifestyle',
      text: 'Reduce social media usage (limit to under 2 hours daily) to improve your cognitive concentration.',
      priority: 'High'
    });
  }
  if (participation === 1) {
    recommendations.push({
      type: 'participation',
      text: 'Actively speak up or ask questions in class to boost participation marks.',
      priority: 'Low'
    });
  }
  if (familySupport === 1) {
    recommendations.push({
      type: 'support',
      text: 'Discuss your study needs with your parents or seek school peer counseling groups.',
      priority: 'Low'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'maintenance',
      text: 'Excellent habits. Continue your current study schedule and help peers in study groups!',
      priority: 'Low'
    });
  }

  let insightText = '';
  if (finalPercentage >= 90) {
    insightText = 'Strong academic habits and excellent consistency. Poised to be a top performer.';
  } else if (finalPercentage >= 80) {
    insightText = 'Solid foundation. A slight boost in study focus or class participation will secure an A+.';
  } else if (finalPercentage >= 70) {
    insightText = 'Satisfactory output. Focus on submitting assignments on time and reducing social media distractions.';
  } else if (finalPercentage >= 60) {
    insightText = 'Moderate academic risk. Attendance and study hour increments are highly recommended.';
  } else {
    insightText = 'High academic risk. Immediate intervention is required to avoid course failure.';
  }

  return {
    score: finalPercentage,
    grade,
    status,
    color,
    contributions: contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value)),
    recommendations,
    insight: insightText
  };
}

/* ==========================================
   2. REUSABLE UI COMPONENT HELPERS
   ========================================== */

function InputField({ label, id, type = 'text', value, onChange, placeholder, min, max, step, required = false, icon: Icon, suffix, helperText }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none glass-input focus:ring-2 focus:ring-indigo-500/20 ${Icon ? 'pl-11' : 'pl-4'} ${suffix ? 'pr-12' : 'pr-4'}`}
        />
        {suffix && (
          <div className="absolute right-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 pointer-events-none select-none">
            {suffix}
          </div>
        )}
      </div>
      {helperText && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 pl-1 leading-normal">
          {helperText}
        </span>
      )}
    </div>
  );
}

function SelectField({ label, id, value, onChange, options = [], required = false, icon: Icon, helperText }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none glass-input focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer ${Icon ? 'pl-11' : 'pl-4'} pr-10`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
          <svg className="h-4 w-4 stroke-current fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helperText && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 pl-1 leading-normal">
          {helperText}
        </span>
      )}
    </div>
  );
}

/* ==========================================
   3. SECTIONS & LAYOUT PAGE COMPONENTS
   ========================================== */

function Sidebar({ activePage, setActivePage, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predictor', label: 'Predictor', icon: Sparkles },
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 glass-sidebar border-r border-slate-200/50 dark:border-slate-800/40 p-5 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-5.5 w-5.5" />
              </div>
              <div className="text-left leading-none">
                <span className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">EduPredict</span>
                <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">AI Academics</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1.5 text-left">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/15' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/55 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-800/40 pt-4">
          <p>© 2026 EduPredict App</p>
        </div>
      </aside>
    </>
  );
}

function Navbar({ activePage, sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) {
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'predictor':
        return 'Grade Predictor';
      default:
        return 'EduPredict';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/40 px-4 md:px-6 flex items-center justify-between sticky top-0 bg-slate-50/80 dark:bg-slate-950/85 backdrop-blur-md z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight font-sans text-left">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all duration-200 cursor-pointer"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-amber-500 animate-spin-slow" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600" />
          )}
        </button>
      </div>
    </header>
  );
}

function Dashboard({ setActivePage }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/10 dark:shadow-indigo-900/10">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-white/5 blur-xl" />

        <div className="max-w-xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            AI Prediction Engine Live
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Predict & Improve Student Success Rates
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Enter lifestyle data and study history parameters to predict examination outcomes, isolate regression factors, and implement targeted academic suggestions.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('predictor')}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-600 hover:bg-slate-50 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" />
              New Prediction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictionResult({ result, studentData, onReset }) {
  const { score, grade, status, color, contributions, insight, recommendations } = result;

  const colorThemes = {
    indigo: { text: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30', ring: 'stroke-indigo-500' },
    emerald: { text: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30', ring: 'stroke-emerald-500' },
    amber: { text: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30', ring: 'stroke-amber-500' },
    sky: { text: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30', ring: 'stroke-sky-500' },
    rose: { text: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30', ring: 'stroke-rose-500' }
  };

  const activeColor = colorThemes[color] || colorThemes.rose;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (score / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card shadow-glass">
        <div className="text-left">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Academic Prediction Output
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Student analytical report generated based on local regression weights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 p-6 rounded-3xl glass-card shadow-glass flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Analysis Summary
          </span>

          <div className="relative flex items-center justify-center my-2">
            <svg className="w-36 h-36 transform -rotate-90 select-none">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800/80 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className={`fill-none ${activeColor.ring} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
              />
            </svg>

            <div className="flex flex-col items-center justify-center absolute">
              <span className="text-5xl font-black tracking-tighter text-slate-800 dark:text-slate-100 font-sans">
                {score}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5 tracking-wider">
                Predicted Score
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2 font-sans truncate max-w-full px-2">
            {studentData.name}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {studentData.age} Years Old • {studentData.gender}
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`text-sm font-bold px-3 py-1.5 rounded-xl border ${activeColor.bg}`}>
              Grade: {grade}
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border border-slate-200/20 dark:border-slate-700/20">
              Status: {status}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-between p-6 rounded-3xl glass-card shadow-glass">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4.5 w-4.5 text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-left">
                Explainable AI Insights
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-left">
              {insight}
            </p>
          </div>

          <div className="my-6 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
              <span>Impact on Predicted Score</span>
              <span className="flex gap-3">
                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald-500" /> Positive</span>
                <span className="flex items-center gap-1"><TrendingDown className="h-3 w-3 text-rose-500" /> Negative</span>
              </span>
            </p>

            <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
              {contributions.map((item, idx) => {
                const val = item.value;
                if (Math.abs(val) < 0.2) return null;
                
                const isPositive = val >= 0;
                const widthPercent = Math.min(100, (Math.abs(val) / 35) * 100);

                return (
                  <div key={idx} className="flex items-center text-xs font-semibold">
                    <span className="w-1/3 text-slate-500 dark:text-slate-400 truncate text-left">
                      {item.name}
                    </span>
                    
                    <div className="flex-1 h-3.5 relative flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/20 rounded-full border border-slate-200/20 dark:border-slate-800/10">
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 dark:bg-slate-700 z-10" />

                      <div 
                        style={{ 
                          width: `${widthPercent / 2}%`,
                          left: isPositive ? '50%' : 'auto',
                          right: !isPositive ? '50%' : 'auto',
                        }}
                        className={`absolute h-full rounded-full transition-all duration-1000 ease-out ${
                          isPositive 
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-400/20' 
                            : 'bg-gradient-to-l from-rose-400 to-rose-500 shadow-sm shadow-rose-400/20'
                        }`}
                      />
                    </div>

                    <span className={`w-12 text-right font-bold font-sans ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isPositive ? '+' : ''}{val.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-100 dark:border-slate-800/40 pt-4">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Calculated: {new Date().toLocaleDateString()}</span>
            <span>Regression Model: EduV1</span>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-card shadow-glass space-y-4">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500" />
          Personalized Academic Action Plan
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div 
              key={idx} 
              className="flex gap-3 p-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/30 hover:border-slate-200 transition-all duration-300"
            >
              <div className="flex-shrink-0 mt-0.5">
                {rec.priority === 'Critical' || rec.priority === 'High' ? (
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {rec.type}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    rec.priority === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' :
                    rec.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300' :
                    rec.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {rec.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 pt-2">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl font-semibold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/15 hover:shadow-indigo-500/25 dark:shadow-indigo-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          Predict New Student
        </button>
      </div>
    </div>
  );
}

const INITIAL_FORM_STATE = {
  name: '',
  age: 17,
  gender: 'Female',
  studyHours: 4.5,
  attendance: 85,
  previousScore: 75,
  assignmentRate: 90,
  participation: 'Medium',
  sleepHours: 7.5,
  internetAccess: 'Yes',
  extracurriculars: 'Yes',
  socialMediaUsage: 2,
  parentEducation: 'Medium',
  familySupport: 'Medium'
};

function Predictor({ onSavePrediction, activeRecord, setActiveRecord }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setActiveRecord(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    setLoadingProgress(10);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      const prediction = predictGrade(formData);
      const record = onSavePrediction(formData, prediction);
      setLoading(false);
      setActiveRecord(record);
    }, 1200);
  };

  if (activeRecord) {
    return (
      <PredictionResult
        result={activeRecord.prediction}
        studentData={activeRecord}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="p-6 rounded-3xl glass-card shadow-glass flex flex-col sm:flex-row items-center gap-5">
        <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
          <Brain className="h-6 w-6 animate-pulse-soft" />
        </div>
        <div className="text-left">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            ML Grade Calculator
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
            Fill out the sections below. The algorithm applies a multiple regression equation based on coefficients from academic research to predict final percentages and suggest adjustments.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-card shadow-glass space-y-6 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 transition-all duration-300">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
              <Brain className="absolute h-6 w-6 text-indigo-500 animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Fitting Regression Model...
              </p>
              <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest">
                Computing weights ({loadingProgress}%)
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-4 md:border-r md:border-slate-200/40 md:dark:border-slate-800/20 md:pr-6">
            <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/40 pb-2">
              <User className="h-4 w-4" />
              1. Basic Information
            </h4>
            
            <InputField
              label="Student Name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Liam Wilson"
              required
              icon={User}
              helperText="Full legal name of the student"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Age"
                id="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                min={12}
                max={25}
                required
                helperText="Ages 12-25"
              />
              <SelectField
                label="Gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                options={[
                  { value: 'Female', label: 'Female' },
                  { value: 'Male', label: 'Male' }
                ]}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/40 pb-2">
              <GraduationCap className="h-4 w-4" />
              2. Academic Features
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Study Hours / Day"
                id="studyHours"
                type="number"
                step="0.5"
                value={formData.studyHours}
                onChange={handleInputChange}
                min={0}
                max={16}
                required
                icon={Clock}
                suffix="hrs"
                helperText="Daily average (Max 16)"
              />
              <InputField
                label="Attendance"
                id="attendance"
                type="number"
                value={formData.attendance}
                onChange={handleInputChange}
                min={0}
                max={100}
                required
                icon={Percent}
                suffix="%"
                helperText="Class attendance rate"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Prev Exam Score"
                id="previousScore"
                type="number"
                value={formData.previousScore}
                onChange={handleInputChange}
                min={0}
                max={100}
                required
                icon={Award}
                suffix="%"
                helperText="Latest term percentage"
              />
              <InputField
                label="Assignment rate"
                id="assignmentRate"
                type="number"
                value={formData.assignmentRate}
                onChange={handleInputChange}
                min={0}
                max={100}
                required
                icon={Percent}
                suffix="%"
                helperText="Completion rate"
              />
            </div>

            <SelectField
              label="Class Participation"
              id="participation"
              value={formData.participation}
              onChange={handleInputChange}
              required
              options={[
                { value: 'Low', label: 'Low - Rarely speaks' },
                { value: 'Medium', label: 'Medium - Normal response' },
                { value: 'High', label: 'High - Actively participates' }
              ]}
            />
          </div>

          <div className="space-y-4 md:border-r md:border-slate-200/40 md:dark:border-slate-800/20 md:pr-6 md:pt-4">
            <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/40 pb-2">
              <Smartphone className="h-4 w-4" />
              3. Lifestyle Features
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Sleep Hours"
                id="sleepHours"
                type="number"
                step="0.5"
                value={formData.sleepHours}
                onChange={handleInputChange}
                min={0}
                max={16}
                required
                icon={Clock}
                suffix="hrs"
                helperText="Average sleep per night"
              />
              <InputField
                label="Social Media"
                id="socialMediaUsage"
                type="number"
                step="0.5"
                value={formData.socialMediaUsage}
                onChange={handleInputChange}
                min={0}
                max={16}
                required
                icon={Smartphone}
                suffix="hrs"
                helperText="Daily usage (Max 16)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Internet Access"
                id="internetAccess"
                value={formData.internetAccess}
                onChange={handleInputChange}
                required
                icon={Laptop}
                options={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' }
                ]}
              />
              <SelectField
                label="Extracurriculars"
                id="extracurriculars"
                value={formData.extracurriculars}
                onChange={handleInputChange}
                required
                options={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' }
                ]}
              />
            </div>
          </div>

          <div className="space-y-4 md:pt-4">
            <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/40 pb-2">
              <Users className="h-4 w-4" />
              4. Family Background
            </h4>

            <SelectField
              label="Parent Education Level"
              id="parentEducation"
              value={formData.parentEducation}
              onChange={handleInputChange}
              required
              options={[
                { value: 'Low', label: 'Primary/Lower secondary' },
                { value: 'Medium', label: 'High School/Diploma' },
                { value: 'High', label: 'University Graduate+' }
              ]}
            />

            <SelectField
              label="Family Support Level"
              id="familySupport"
              value={formData.familySupport}
              onChange={handleInputChange}
              required
              options={[
                { value: 'Low', label: 'Minimal support / busy parent' },
                { value: 'Medium', label: 'Moderate encouragement' },
                { value: 'High', label: 'Strong/Active encouragement' }
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 dark:border-slate-800/40 pt-6 justify-end items-center">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs text-slate-500 border border-slate-200/50 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Inputs
          </button>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-2xl font-semibold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 dark:shadow-indigo-600/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="h-4.5 w-4.5" />
            Predict Grade
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==========================================
   4. MAIN REACT APP CONTAINER
   ========================================== */

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('edu_predict_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeRecord, setActiveRecord] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edu_predict_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edu_predict_theme', 'light');
    }
  }, [darkMode]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSavePrediction = (studentData, prediction) => {
    const record = {
      ...studentData,
      id: 'student-' + Date.now(),
      date: new Date().toISOString(),
      prediction
    };
    try {
      const data = localStorage.getItem('edu_predict_students_history');
      const history = data ? JSON.parse(data) : [];
      const updated = [record, ...history];
      localStorage.setItem('edu_predict_students_history', JSON.stringify(updated));
      showToast(`Prediction generated for ${record.name}!`, 'success');
      return record;
    } catch (e) {
      console.error(e);
      showToast('Failed to save prediction record.', 'error');
      return record;
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            setActivePage={setActivePage} 
          />
        );
      case 'predictor':
        return (
          <Predictor 
            onSavePrediction={handleSavePrediction}
            activeRecord={activeRecord}
            setActiveRecord={setActiveRecord}
          />
        );
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50/70 via-slate-50 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/60 transition-colors duration-300">
      
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar 
          activePage={activePage} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20">
          {renderPage()}
        </main>
      </div>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl shadow-xl border text-xs font-semibold flex items-center justify-between pointer-events-auto animate-fade-in-up border-slate-200/50 dark:border-slate-800/40 ${
              toast.type === 'success' 
                ? 'bg-white/90 dark:bg-slate-900/90 text-emerald-600 dark:text-emerald-400' 
                : toast.type === 'info' 
                ? 'bg-white/90 dark:bg-slate-900/90 text-indigo-500 dark:text-indigo-400'
                : 'bg-white/90 dark:bg-slate-900/90 text-rose-600 dark:text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${
                toast.type === 'success' ? 'bg-emerald-500' :
                toast.type === 'info' ? 'bg-indigo-500' : 'bg-rose-500'
              }`} />
              <span>{toast.message}</span>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold leading-none select-none transition-colors pointer-events-auto"
            >
              ×
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
