import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
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
    Mail,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';
import Navbar from '../../components/Navbar';
import { useUser } from '../../context/UserContext';

const JobApplicationModal = ({ isOpen, onClose, jobTitle, jobId, onApply }: { isOpen: boolean; onClose: () => void; jobTitle: string; jobId: string; onApply: () => void }) => {
    const { id: seekerId } = useUser();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [points, setPoints] = useState('3');
    const [contactInfo, setContactInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSubject(`Application for ${jobTitle}`);
        }
    }, [isOpen, jobTitle]);

    const handleApply = async () => {
        if (!seekerId) {
            alert("Please login as a job seeker to apply.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('job_applications')
                .insert([
                    {
                        job_id: jobId,
                        seeker_id: seekerId,
                        subject: subject,
                        message: message,
                        contact_info: contactInfo,
                        points_used: parseInt(points) || 0,
                        status: 'New'
                    }
                ]);

            if (error) throw error;

            onApply();
            onClose();
        } catch (err: any) {
            console.error("Error applying for job:", err);
            alert("Failed to submit application: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your message here..."
                                        className="w-full px-6 py-6 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-medium leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                                    />
                                </div>

                                {/* Contact Info Input */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 ml-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CONTACT INFO</label>
                                        <div className="w-3 h-3 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[8px] font-black cursor-help" title="Enter your contact details (Links, Email, Skype, etc.)">?</div>
                                    </div>
                                    <textarea
                                        rows={4}
                                        value={contactInfo}
                                        onChange={(e) => setContactInfo(e.target.value)}
                                        placeholder="Enter your contact details (Onlinejobs link, Facebook, Email, etc.)"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-medium leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                                    />
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
                                onClick={handleApply}
                                disabled={isSubmitting}
                                className="px-10 py-5 bg-[#78B943] hover:bg-[#6AA43A] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                <Mail size={18} /> {isSubmitting ? 'SENDING...' : 'SEND EMAIL'}
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
    const location = useLocation();
    const [job, setJob] = useState<any>(null);
    const [isApplied, setIsApplied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    const isDashboard = location.pathname.startsWith('/seeker') || location.pathname.startsWith('/employer');

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) {
                setLoading(false); // No ID, stop loading
                navigate('/jobs');
                return;
            }

            setLoading(true); // Start loading

            const { data, error } = await supabase
                .from('job_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                console.error("Error fetching job:", error);
                navigate('/jobs');
                setLoading(false); // Stop loading on error
                return;
            }

            setJob({
                id: data.id,
                title: data.title,
                company: data.company_name,
                postedDate: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                salary: `${data.salary} / ${data.period === 'Per Month' ? 'mo' : data.period === 'Per Week' ? 'wk' : 'hr'}`,
                type: data.engagement?.split(' ')[0] || 'Remote',
                location: data.location || 'Remote',
                description: data.preview,
                fullDescription: data.description,
                skills: data.skills || [],
                verified: true,
                companyInfo: "Verified premium employer on TalentPro PH.",
                employerId: data.employer_id,
                companyLogo: data.company_logo
            });
            setLoading(false); // Stop loading after successful fetch

            // Increment views
            try {
                const currentViews = data.views || 0;
                await supabase
                    .from('job_posts')
                    .update({ views: currentViews + 1 })
                    .eq('id', id);
            } catch (vErr) {
                console.error("Error updating views:", vErr);
            }
        };

        fetchJob();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!job) {
        // This case should ideally be handled by the loading state and navigation,
        // but as a fallback, if job is null after loading, we can return null or a message.
        return null;
    }

    return (
        <div className={isDashboard ? "" : "min-h-screen bg-slate-50/30"}>
            {!isDashboard && <Navbar forceSolid={true} />}

            <div className={`container mx-auto max-w-[1400px] px-6 pb-32 space-y-10 ${isDashboard ? "pt-4" : "pt-32"}`}>
                <JobApplicationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    jobTitle={job.title}
                    jobId={id || ''}
                    onApply={() => setIsApplied(true)}
                />
                {/* Navigation Header */}
                <div className="flex items-center justify-between px-4">
                    <button
                        onClick={() => {
                            if (location.pathname.startsWith('/employer')) {
                                navigate('/employer/posts');
                            } else if (location.pathname.startsWith('/seeker')) {
                                navigate('/seeker/jobs');
                            } else {
                                navigate('/jobs');
                            }
                        }}
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
                                        <div className="w-12 h-12 bg-slate-50 border-2 border-white rounded-2xl flex items-center justify-center text-primary shadow-sm overflow-hidden">
                                            {job.companyLogo ? (
                                                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                                            ) : (
                                                <Building2 size={24} />
                                            )}
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
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center overflow-hidden">
                                            {job.companyLogo ? (
                                                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                                            ) : (
                                                <Building2 size={32} className="text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tighter mb-1">About {job.company}</h2>
                                            <p className="text-primary text-[10px] font-black uppercase tracking-widest">Verified Employer Account</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/company/${job.employerId}`}
                                        className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl"
                                    >
                                        Full Profile <ChevronRight size={14} />
                                    </Link>
                                </div>
                                <p className="text-lg text-white/50 font-medium leading-relaxed max-w-2xl">
                                    {job.companyInfo} Visit the full company profile to learn more about their culture, perks, and open positions.
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
        </div>
    );
};

export default JobDetails;
