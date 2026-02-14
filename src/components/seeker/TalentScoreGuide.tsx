import React, { useState } from 'react';
import {
    CheckCircle2,
    User,
    Camera,
    FileText,
    GraduationCap,
    Shield,
    Award,
    Brain,
    Share2,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Zap
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { calculateTalentScore } from '../../utils/talentScore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TalentScoreGuide: React.FC = () => {
    const navigate = useNavigate();
    const user = useUser();
    const [isMaximized, setIsMaximized] = useState(true);

    // Safety check for user data
    if (!user) return null;

    const breakdown = calculateTalentScore(user);
    const totalScore = breakdown.total || 0;
    const isCompleted = totalScore >= 100;

    // Follow user request to hide if 100%
    if (isCompleted) return null;

    const steps = [
        {
            id: 'name',
            label: 'Complete Identity',
            description: 'Provide your full legal name',
            icon: User,
            score: breakdown.name,
            max: 10,
            link: '/seeker/edit-profile?section=general'
        },
        {
            id: 'picture',
            label: 'Profile Picture',
            description: 'Add a professional portrait',
            icon: Camera,
            score: breakdown.picture,
            max: 10,
            link: '/seeker/edit-profile?section=general'
        },
        {
            id: 'resume',
            label: 'Professional Resume',
            description: 'Upload your latest CV/Resume',
            icon: FileText,
            score: breakdown.resume,
            max: 20,
            link: '/seeker/edit-profile?section=expertise'
        },
        {
            id: 'education',
            label: 'Education History',
            description: 'Add your highest education level',
            icon: GraduationCap,
            score: breakdown.education,
            max: 10,
            link: '/seeker/edit-profile?section=general'
        },
        {
            id: 'psychometric',
            label: 'Psychometric Data',
            description: 'Take the IQ and DISC assessments',
            icon: Brain,
            score: breakdown.psychometric,
            max: 20,
            link: '/seeker/edit-profile?section=assessments'
        },
        {
            id: 'verification',
            label: 'Verification Proof',
            description: 'Verify your test results',
            icon: Shield,
            score: breakdown.verification,
            max: 10,
            link: '/seeker/edit-profile?section=assessments'
        },
        {
            id: 'skills',
            label: 'Core Competencies',
            description: 'List your top skills and expertise',
            icon: Award,
            score: breakdown.skills,
            max: 10,
            link: '/seeker/edit-profile?section=expertise'
        },
        {
            id: 'social',
            label: 'Social Footprint',
            description: 'Connect your social professional links',
            icon: Share2,
            score: breakdown.social,
            max: 10,
            link: '/seeker/edit-profile?section=socials'
        },
    ];

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <div
                    className={`p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer hover:bg-slate-50/50 transition-colors ${!isMaximized ? '' : 'mb-2'}`}
                    onClick={() => setIsMaximized(!isMaximized)}
                >
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                            <Zap size={28} fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black font-outfit tracking-tighter text-slate-900">Talent Excellence Score</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Profile Optimization Pathway</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-3xl font-black text-primary font-outfit leading-none">{totalScore}%</div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Ready</div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center relative border border-slate-100">
                                <svg className="w-8 h-8 transform -rotate-90">
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        strokeDasharray={88}
                                        strokeDashoffset={88 - (88 * totalScore) / 100}
                                        className="text-primary transition-all duration-1000 ease-out"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            {isMaximized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isMaximized && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden"
                        >
                            <div className="px-10 pb-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                    {steps.map((step, index) => {
                                        const stepCompleted = step.score > 0;
                                        return (
                                            <div
                                                key={step.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(step.link);
                                                }}
                                                className={`group p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${stepCompleted
                                                    ? 'bg-slate-50/50 border-slate-100 opacity-60 hover:opacity-100'
                                                    : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 active:scale-95'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-8">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${stepCompleted ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                                        }`}>
                                                        <step.icon size={20} />
                                                    </div>
                                                    {stepCompleted ? (
                                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                                    ) : (
                                                        <div className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full">
                                                            +{step.max}%
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">{step.label}</h3>
                                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{step.description}</p>

                                                {!stepCompleted && (
                                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Setup Now <ArrowRight size={12} />
                                                    </div>
                                                )}

                                                {index < steps.length - 1 && (
                                                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] bg-slate-100 z-0"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {totalScore < 100 && (
                                    <div className="mt-12 p-8 bg-slate-900 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                                                <Shield size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-sm mb-1 uppercase tracking-wider">Boost Your Hireability</h4>
                                                <p className="text-white/40 text-[10px] font-bold leading-relaxed">Profiles with 100% Talent Score are 5x more likely to be contacted by top employers.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/seeker/edit-profile');
                                            }}
                                            className="px-8 py-3 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all whitespace-nowrap"
                                        >
                                            Complete Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TalentScoreGuide;
