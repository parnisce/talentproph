import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Zap,
    Briefcase,
    Download,
    ExternalLink,
    ShieldCheck,
    FileText,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for profiles
const mockApplicantsData: Record<string, any> = {
    'a1': {
        id: 'a1',
        name: 'Cyryl Bitangcol',
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
        role: 'Senior Video Editor & Storyteller',
        location: 'Manila, Philippines',
        email: 'cyryl.b@example.com',
        phone: '+63 912 345 6789',
        experience: '5+ Years',
        appliedPoints: 50,
        status: 'Shortlisted',
        bio: "Passionate storyteller with a focus on high-retention long-form YouTube content. I've worked with channels totaling over 5M subscribers, specializing in technical editing and dynamic motion graphics. My goal is to transform complex ideas into engaging visual journeys.",
        testScores: {
            iq: 138,
            english: 'C2 (Expert)',
            disc: { D: 36, I: 24, S: 22, C: 17 }
        },
        skills: ['Adobe Premiere Pro', 'After Effects', 'Davinci Resolve', 'Color Grading', 'Sound Design', 'Motion Graphics', 'Storyboarding'],
        history: [
            { company: 'TechVibe YouTube Channel', role: 'Lead Video Editor', period: '2021 - Present', description: 'Managed a team of 3 editors. Responsible for final cut of weekly 20min technical deep-dives. Grew retention by 15% through improved pacing.' },
            { company: 'CreativeFlow Media', role: 'Senior Editor', period: '2019 - 2021', description: 'Handled high-end commercial edits for international brands. Specialized in motion-heavy social media ads.' }
        ],
        portfolio: [
            { title: 'Project: Mastering AI (1M+ Views)', link: '#' },
            { title: 'Commercial: CyberSable 2024', link: '#' }
        ],
        application: {
            subject: "Application for YouTube Video Editor",
            message: "Hello! I saw your post for the YouTube Video Editor role and immediately felt my style matches your brand. I've been following your channel for 2 years and understand the pacing you're looking for. Attached is my latest showreel. I'm ready to bring my expertise to your team!"
        }
    }
};

const ReviewProfile = () => {
    const { applicantId } = useParams();
    const navigate = useNavigate();
    const [applicant, setApplicant] = useState<any>(null);

    useEffect(() => {
        // Fallback to first mock if ID not found for demo
        const data = mockApplicantsData[applicantId || ''] || mockApplicantsData['a1'];
        setApplicant(data);
    }, [applicantId]);

    if (!applicant) return null;

    return (
        <div className="space-y-10 pb-32">
            {/* Header / Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest mb-4 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to List
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Review Profile</h1>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${applicant.status === 'Shortlisted' ? 'bg-amber-100 text-amber-600' :
                            applicant.status === 'New' ? 'bg-primary/10 text-primary' :
                                'bg-slate-100 text-slate-500'
                            }`}>
                            {applicant.status}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-4 bg-white border-2 border-slate-100 text-rose-500 rounded-2xl hover:bg-rose-50 transition-all shadow-sm">
                        <XCircle size={22} />
                    </button>
                    <button className="px-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                        <CheckCircle2 size={18} /> Shortlist Candidate
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Identity & Contact */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Identity Card */}
                    <div className="bg-white border-2 border-slate-50 p-10 rounded-[56px] shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] grayscale -translate-y-1/4 translate-x-1/4 pointer-events-none">
                            <User size={200} />
                        </div>

                        <div className="relative z-10">
                            <div className="relative inline-block mb-8">
                                <div className="w-40 h-40 rounded-[48px] bg-slate-100 overflow-hidden ring-[12px] ring-white shadow-2xl mx-auto transition-transform group-hover:rotate-3">
                                    <img src={applicant.photo} alt={applicant.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-full border-[6px] border-white flex items-center justify-center shadow-lg">
                                    <ShieldCheck size={18} />
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{applicant.name}</h2>
                            <p className="text-primary font-bold text-lg tracking-tight mb-8">{applicant.role}</p>

                            <div className="space-y-4 text-left border-t border-slate-50 pt-8 mt-8">
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <MapPin size={18} />
                                    </div>
                                    {applicant.location}
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    {applicant.email}
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Phone size={18} />
                                    </div>
                                    {applicant.phone}
                                </div>
                            </div>

                            <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                                <MessageSquare size={16} /> Send Message
                            </button>
                        </div>
                    </div>

                    {/* Talent Scores Card */}
                    <div className="bg-slate-900 p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden">
                        {/* Background glowing effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 text-center underline decoration-blue-500 underline-offset-8 relative z-10">Intelligence & Language</h4>

                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-[32px] text-center backdrop-blur-sm">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">IQ Score</p>
                                <p className="text-4xl font-black text-cyan-400 tracking-tighter drop-shadow-lg">{applicant.testScores.iq}</p>
                            </div>
                            <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-[32px] text-center backdrop-blur-sm">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">English</p>
                                <p className="text-2xl font-black text-purple-400 tracking-tighter leading-9 drop-shadow-lg">{applicant.testScores.english.split(' ')[0]}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6 relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-10 mb-6">DISC Personality Profile</p>
                            <div className="space-y-5">
                                {Object.entries(applicant.testScores.disc).map(([key, value]: [string, any]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[11px] font-black tracking-widest text-white">{key}</span>
                                            <span className="text-xs font-black text-blue-400">{value}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Cover Letter Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border-2 border-slate-50 p-12 rounded-[56px] shadow-sm relative overflow-hidden"
                    >
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary absolute top-12 right-12 flex items-center gap-2">
                            <Zap size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{applicant.appliedPoints} Points Charged</span>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 underline decoration-slate-100 underline-offset-8">Cover Letter</h4>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">"{applicant.application.subject}"</h3>
                            <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 italic">
                                "{applicant.application.message}"
                            </p>
                        </div>
                    </motion.div>

                    {/* Bio & Skills */}
                    <div className="bg-white border-2 border-slate-50 p-12 rounded-[56px] shadow-sm space-y-12">
                        <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Professional Bio</h4>
                            <p className="text-slate-600 font-medium leading-[1.8] text-lg">{applicant.bio}</p>
                        </section>

                        <section className="pt-10 border-t border-slate-50">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Expertise & Stack</h4>
                            <div className="flex flex-wrap gap-3">
                                {applicant.skills.map((skill: string) => (
                                    <span key={skill} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 hover:bg-primary transition-all cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Work Experience */}
                    <div className="bg-white border-2 border-slate-50 p-12 rounded-[56px] shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">Relevant Experience</h4>
                        <div className="space-y-12">
                            {applicant.history.map((job: any, idx: number) => (
                                <div key={idx} className="relative pl-12 border-l-2 border-slate-100 group">
                                    <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-100 border-4 border-white group-hover:bg-primary group-hover:scale-125 transition-all" />
                                    <div className="space-y-3">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <h5 className="text-xl font-black text-slate-900 tracking-tighter">{job.role}</h5>
                                            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{job.period}</span>
                                        </div>
                                        <p className="font-bold text-primary flex items-center gap-2">
                                            <Briefcase size={16} /> {job.company}
                                        </p>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">{job.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio & Documents */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border-2 border-slate-50 p-10 rounded-[56px] shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Portfolio Highlights</h4>
                            <div className="space-y-4">
                                {applicant.portfolio.map((item: any, idx: number) => (
                                    <a key={idx} href={item.link} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary group transition-all">
                                        <span className="font-bold text-sm text-slate-900">{item.title}</span>
                                        <ExternalLink size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="bg-primary/5 border-2 border-primary/10 p-10 rounded-[56px] shadow-sm group cursor-pointer hover:bg-primary transition-all">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:text-white/40 mb-8">Documents</h4>
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                    <FileText size={32} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-900 group-hover:text-white tracking-tighter leading-none mb-1">resume_cyryl_2024.pdf</p>
                                    <p className="text-[10px] font-black text-primary/60 group-hover:text-white/50 uppercase tracking-widest">PDF • 2.4 MB</p>
                                </div>
                                <Download size={22} className="text-primary group-hover:text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewProfile;
