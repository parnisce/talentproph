import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Building2,
    DollarSign,
    ShieldCheck,
    Share2,
    Bookmark,
    CheckCircle2,
    Zap,
    Briefcase,
    Calendar,
    MapPin,
    Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data shared across components or retrieved by ID
// ... rest of mockJobs
const mockJobs = [
    {
        id: '1',
        title: 'YouTube Video Editor (Long-form)',
        company: 'Woken Jobs',
        postedDate: 'Feb 05, 2026',
        salary: '$1300 / project',
        type: 'Gig',
        location: 'Remote',
        description: 'Creating high-energy long-form content for top-tier creators. Expert knowledge of After Effects motion graphics is required. Join a team that values creativity and speed.',
        fullDescription: 'We are looking for a highly creative and technically proficient Video Editor to join our content factory. You will be responsible for editing high-energy, long-form YouTube content that keeps viewers engaged from start to finish. \n\nKey Responsibilities:\n- Process raw footage into polished, high-production value videos.\n- Implement advanced motion graphics using Adobe After Effects.\n- Collaborate with content strategists to refine storytelling beats.\n- Ensure all content adheres to brand voice and quality standards.\n\nRequirements:\n- 3+ years of professional video editing experience.\n- Mastery of Adobe Premiere Pro and After Effects.\n- Strong understanding of YouTube pacing and retention mechanics.\n- Portfolio demonstrating long-form storytelling expertise.',
        skills: ['Video Content Creation', 'Animation', 'Adobe Premiere Pro', 'After Effects'],
        verified: true,
        companyInfo: "Woken Jobs is a premier digital content agency specializing in high-impact video production for global creators."
    },
    {
        id: '2',
        title: 'Patient Access Representative',
        company: 'Healthcare Plus',
        postedDate: 'Feb 05, 2026',
        salary: '$800 - $1200 / mo',
        type: 'Full-Time',
        location: 'Remote',
        description: 'First point of contact for patient care. Manage scheduling, insurance verification, and high-volume patient communication. Requires empathetic and organized professionals.',
        fullDescription: 'As a Patient Access Representative, you will be the critical link between patients and their healthcare providers. This role requires exceptional communication skills and a meticulous attention to detail.\n\nKey Responsibilities:\n- Manage patient registration and appointment scheduling.\n- Perform insurance verification and authorization checks.\n- Facilitate communication between patients, physicians, and billing departments.\n- Maintain accurate electronic health records (EHR).\n\nRequirements:\n- Experience in healthcare administration or customer service.\n- Proficiency with medical billing software and EHR systems.\n- High degree of empathy and professional ethics.\n- Ability to handle high-volume call environments.',
        skills: ['Medical Services', 'Medical Insurance', 'Onboarding', 'Customer Service'],
        verified: true,
        companyInfo: "Healthcare Plus provides comprehensive medical support services to clinics and hospitals across North America."
    },
    {
        id: '3',
        title: 'Social Media Manager',
        company: 'Bright Horizon Marketing',
        postedDate: 'Feb 04, 2026',
        salary: '$1200 - $1800 / mo',
        type: 'Full-Time',
        location: 'Remote',
        description: 'Full-service social media management for brand growth. From content planning to community engagement. Must have experience with Meta Ads and short-form video.',
        fullDescription: 'We are seeking a strategic Social Media Manager to drive organic and paid growth for our diverse client portfolio. You should be a master of trends and a data-driven content creator.\n\nKey Responsibilities:\n- Develop and execute cross-platform social media strategies.\n- Create engaging short-form video content (Reels, TikToks).\n- Manage Meta Ad campaigns and optimize for conversion.\n- Monitor community engagement and provide monthly performance reports.\n\nRequirements:\n- Proven track record of growing social media accounts.\n- Expertise in Meta Business Suite and Ads Manager.\n- Creative copywriting and visual design skills (Canva/Figma).\n- Knowledge of the latest social media algorithms.',
        skills: ['Social Media Strategy', 'Canva', 'Analytics', 'Content Planning'],
        verified: true,
        companyInfo: "Bright Horizon is a boutique marketing firm focused on scaling D2C brands via social-first strategies."
    },
    {
        id: '4',
        title: 'Virtual Administrative Assistant',
        company: 'Stellar Outsourcing',
        postedDate: 'Feb 04, 2026',
        salary: '$700 - $1100 / mo',
        type: 'Part-Time',
        location: 'Remote',
        description: 'Direct support for global executive teams. Manage complex calendars, travel arrangements, and strategic email communication. Native-level English required.',
        fullDescription: 'Direct support for global executive teams. Manage complex calendars, travel arrangements, and strategic email communication. Native-level English required. \n\nKey Responsibilities:\n- Calendar management and appointment scheduling across multiple time zones.\n- Travel coordination and itinerary planning.\n- Executive email management and correspondence.\n- Preparation of reports and presentation materials.\n\nRequirements:\n- Native-level English proficiency (written and verbal).\n- 2+ years of experience in administrative or executive support.\n- Proficiency in Google Workspace and Slack.\n- Exceptional organizational and time-management skills.',
        skills: ['Administrative Support', 'Email Management', 'Google Workspace'],
        verified: true,
        companyInfo: "Stellar Outsourcing connects top-tier Filipino talent with US and UK-based startups and executives."
    }
];

const JobApplicationModal = ({ isOpen, onClose, jobTitle, onApply }: { isOpen: boolean; onClose: () => void; jobTitle: string; onApply: () => void }) => {
    const [subject, setSubject] = useState('');
    const [points, setPoints] = useState('3');

    useEffect(() => {
        if (isOpen) {
            setSubject(`Application for ${jobTitle}`);
        }
    }, [isOpen, jobTitle]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl relative z-10 overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Job Application</h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <Share2 className="rotate-45 text-slate-400" size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh] scrollbar-hide">
                            {/* Warning Box */}
                            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 items-start">
                                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                    <Zap size={14} />
                                </div>
                                <p className="text-[11px] font-bold text-amber-800 leading-relaxed italic">
                                    Mass applying for jobs (copying/pasting the same application) is not effective and could get you banned. Read the job post and follow its instructions.
                                </p>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SUBJECT*</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">MESSAGE</label>
                                    <textarea
                                        rows={6}
                                        placeholder="Write your message here..."
                                        className="w-full px-6 py-6 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-medium leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                                    />
                                </div>

                                {/* Contact Info Preview */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 ml-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CONTACT INFO</label>
                                        <div className="w-3 h-3 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[8px] font-black cursor-help">?</div>
                                    </div>
                                    <div className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] text-[11px] font-bold text-slate-500 space-y-2 overflow-y-auto max-h-32 scrollbar-hide">
                                        <p>Onlinejobs Link: <span className="text-primary hover:underline cursor-pointer">https://www.onlinejobs.ph/jobseekers/info/365555</span></p>
                                        <p>Facebook Account: <span className="text-primary hover:underline cursor-pointer">https://www.facebook.com/cyrylbitangcolofficial</span></p>
                                        <p>Here is my Email Address: <span className="text-primary">cyryl.bitangcol@gmail.com</span></p>
                                        <p>Here is my Online CV: <span className="text-primary hover:underline cursor-pointer">https://cyrylbitangcolproject.com/</span></p>
                                        <p>Here is my Skype Name: <span className="text-primary">parnisce</span></p>
                                    </div>
                                </div>

                                {/* Apply Points */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 ml-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">APPLY POINTS</label>
                                        <div className="w-3 h-3 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[8px] font-black cursor-help">?</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={points}
                                            onChange={(e) => setPoints(e.target.value)}
                                            placeholder="ex. 3"
                                            className="w-32 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-sm font-black focus:outline-none focus:border-primary transition-all"
                                        />
                                        <div className="bg-slate-900 text-white rounded-2xl py-3 px-6 flex items-center gap-4 min-w-[140px] justify-center">
                                            <span className="text-2xl font-black">30</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-tight">Apply Points<br />Left</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-10 pt-4 bg-white">
                            <button
                                onClick={() => { onApply(); onClose(); }}
                                className="px-10 py-5 bg-[#78B943] hover:bg-[#6AA43A] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Mail size={18} /> SEND EMAIL
                            </button>
                            <p className="mt-8 text-[11px] text-slate-500 font-medium">
                                If you want to send a file, <span className="text-primary hover:underline cursor-pointer">learn how here.</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [isApplied, setIsApplied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const foundJob = mockJobs.find(j => j.id === id);
        if (foundJob) {
            setJob(foundJob);
        } else {
            // Handle job not found
            navigate('/seeker/jobs');
        }
    }, [id, navigate]);

    if (!job) return null;

    return (
        <div className="space-y-10 pb-32">
            <JobApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jobTitle={job.title}
                onApply={() => setIsApplied(true)}
            />
            {/* Navigation Header */}
            <div className="flex items-center justify-between px-4">
                <button
                    onClick={() => navigate('/seeker/jobs')}
                    className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest pr-2">Back to Listings</span>
                </button>
                <div className="flex gap-3">
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-primary transition-all shadow-sm">
                        <Share2 size={20} />
                    </button>
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-rose-500 transition-all shadow-sm">
                        <Bookmark size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Primary Job Card */}
                    <div className="bg-white rounded-[56px] border-2 border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                            <Briefcase size={200} />
                        </div>

                        <div className="p-12 md:p-16 relative z-10">
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={14} /> Verified Premium
                                </span>
                                <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {job.type}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 pb-10 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Company</p>
                                        <p className="text-sm font-black text-slate-900">{job.company}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location</p>
                                        <p className="text-sm font-black text-slate-900">{job.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Posted</p>
                                        <p className="text-sm font-black text-slate-900">{job.postedDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <section>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <Zap size={16} className="text-primary" /> Role Overview
                                    </h3>
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                                        {job.fullDescription}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-6">Required Expertise</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {job.skills.map((skill: string) => (
                                            <div key={skill} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* Company Card */}
                    <div className="bg-slate-900 p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-50" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center">
                                    <Building2 size={32} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter mb-1">About {job.company}</h2>
                                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">Verified Employer Since 2022</p>
                                </div>
                            </div>
                            <p className="text-lg text-white/50 font-medium leading-relaxed max-w-2xl">
                                {job.companyInfo}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Sticky Actions */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-8">
                        {/* Compensation Card */}
                        <div className="bg-white p-10 rounded-[48px] border-2 border-slate-100 shadow-sm text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Budgeted Compensation</p>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <DollarSign size={24} className="text-primary" />
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">{job.salary?.split(' / ')[0] || 'TBD'}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-400">/{job.salary?.split(' / ')[1] || 'month'}</p>

                            <div className="mt-10 space-y-4">
                                <button
                                    onClick={() => !isApplied && setIsModalOpen(true)}
                                    className={`w-full py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${isApplied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95'}`}
                                >
                                    {isApplied ? (
                                        <>
                                            <CheckCircle2 size={20} /> Application Sent
                                        </>
                                    ) : (
                                        <>
                                            Apply To This Post <Zap size={18} className="group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <button className="w-full py-5 border-2 border-slate-100 rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2">
                                    <Bookmark size={16} /> Save for Later
                                </button>
                            </div>

                            <p className="mt-8 text-[10px] font-bold text-slate-300 italic leading-relaxed">
                                Your full profile and assessment data will be included in the application.
                            </p>
                        </div>

                        {/* Direct Support */}
                        <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary font-black">?</div>
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Need Assistance?</h4>
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed mb-6">
                                Have questions about this specific role? Our talent concierges are available to help.
                            </p>
                            <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-primary hover:bg-white/50 transition-all">
                                Chat With Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
