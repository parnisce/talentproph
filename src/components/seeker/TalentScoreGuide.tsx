import React from 'react';
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
    ArrowRight
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { calculateTalentScore } from '../../utils/talentScore';
import { useNavigate } from 'react-router-dom';

const TalentScoreGuide: React.FC = () => {
    const navigate = useNavigate();
    const user = useUser();
    const breakdown = calculateTalentScore(user);

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
        <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <h2 className="text-3xl font-black font-outfit tracking-tighter text-slate-900 mb-2">Talent Excellence Score</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Profile Optimization Pathway</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-4xl font-black text-primary font-outfit">{breakdown.total}%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Profile Ready</div>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center relative">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-slate-100"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={125.6}
                                    strokeDashoffset={125.6 - (125.6 * breakdown.total) / 100}
                                    className="text-primary transition-all duration-1000 ease-out"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((step, index) => {
                        const isCompleted = step.score > 0;
                        return (
                            <div
                                key={step.id}
                                onClick={() => navigate(step.link)}
                                className={`group p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${isCompleted
                                    ? 'bg-slate-50/50 border-slate-100 grayscale-[0.8] hover:grayscale-0'
                                    : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 active:scale-95'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                        }`}>
                                        <step.icon size={20} />
                                    </div>
                                    {isCompleted ? (
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                    ) : (
                                        <div className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full">
                                            +{step.max}%
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">{step.label}</h3>
                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{step.description}</p>

                                {!isCompleted && (
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Setup Now <ArrowRight size={12} />
                                    </div>
                                )}

                                {/* Vertical Timeline Line Connector (Desktop Grid Layout) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] bg-slate-100 z-0"></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {breakdown.total < 100 && (
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
                            onClick={() => navigate('/seeker/edit-profile')}
                            className="px-8 py-3 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all whitespace-nowrap"
                        >
                            Complete Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TalentScoreGuide;
