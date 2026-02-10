import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Search,
    MessageSquare,
    Star,
    CheckCircle2,
    XCircle,
    User,
    ExternalLink,
    Briefcase,
    Zap,
    Download,
    Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '../../services/supabase';

const ViewApplicants = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [jobTitle, setJobTitle] = useState('Position');
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Job Title if specific ID
                if (id && id !== 'all') {
                    const { data: jobData } = await supabase
                        .from('job_posts')
                        .select('title')
                        .eq('id', id)
                        .single();
                    if (jobData) setJobTitle(jobData.title);
                } else if (id === 'all') {
                    setJobTitle('All Active Candidates');
                }

                // Fetch Applicants
                let query = supabase
                    .from('job_applications')
                    .select(`
                        *,
                        profiles:seeker_id (
                            full_name,
                            avatar_url,
                            title,
                            experience_years,
                            skills_list,
                            iq,
                            disc_scores
                        )
                    `);

                if (id && id !== 'all') {
                    query = query.eq('job_id', id);
                }

                const { data, error } = await query;

                if (error) throw error;

                if (data) {
                    const mappedApplicants = data.map(app => ({
                        id: app.id,
                        name: app.profiles?.full_name || 'Anonymous Seeker',
                        photo: app.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.seeker_id}`,
                        role: app.profiles?.title || 'Job Seeker',
                        experience: app.profiles?.experience_years || 'No',
                        appliedDate: new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                        status: app.status || 'New',
                        topSkills: app.profiles?.skills_list?.slice(0, 3) || [],
                        score: app.profiles?.iq ? Math.min(Math.round((app.profiles.iq / 160) * 100), 100) : 85, // Mock score logic based on IQ
                    }));
                    setApplicants(mappedApplicants);
                }
            } catch (err) {
                console.error("Error fetching applicants:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredApplicants = applicants.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || app.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate('/employer/posts')}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest mb-4 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Posts
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Applicants</h1>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mt-1">
                            {applicants.length} Total
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium mt-1">Reviewing candidates for <span className="text-slate-900 font-bold">"{jobTitle}"</span>.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all shadow-sm flex items-center gap-2">
                        <Download size={18} /> Export List
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white border-2 border-slate-50 p-6 rounded-[32px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-3">
                    {['All', 'New', 'Shortlisted', 'Reviewed', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === status
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Applicants List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredApplicants.map((applicant, idx) => (
                        <motion.div
                            key={applicant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white border-2 border-slate-50 p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-10">
                                {/* Profile & Basic Info */}
                                <div className="flex items-center gap-8 flex-1">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-[32px] bg-slate-100 overflow-hidden ring-[6px] ring-white shadow-xl group-hover:scale-105 transition-transform">
                                            <img src={applicant.photo} alt={applicant.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                            <CheckCircle2 size={14} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{applicant.name}</h3>
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${applicant.status === 'Shortlisted' ? 'bg-amber-100 text-amber-600' :
                                                applicant.status === 'New' ? 'bg-primary/10 text-primary' :
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                {applicant.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 font-medium text-sm">
                                            <span className="flex items-center gap-2"><Target size={14} className="text-primary" /> {applicant.role}</span>
                                            <span className="flex items-center gap-2 font-bold text-slate-900"><Briefcase size={14} /> {applicant.experience} Exp</span>
                                            <span className="flex items-center gap-2"><Zap size={14} /> Applied {applicant.appliedDate}</span>
                                        </div>
                                        <div className="flex flex-wrap grow gap-2 mt-4">
                                            {applicant.topSkills.map((skill: string) => (
                                                <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Score & Actions */}
                                <div className="flex flex-col md:flex-row items-center gap-10 lg:pr-4">
                                    <div className="text-center md:text-right">
                                        <div className="flex items-center justify-center md:justify-end gap-2 text-primary mb-1">
                                            <Star size={20} fill="currentColor" />
                                            <span className="text-3xl font-black tracking-tighter leading-none">{applicant.score}%</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Talent Score</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all border border-slate-100 group/btn shadow-sm">
                                            <MessageSquare size={20} />
                                        </button>
                                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100 group/btn shadow-sm">
                                            <XCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/employer/applicants/review/${applicant.id}`)}
                                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2"
                                        >
                                            Review Profile <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] grayscale -translate-y-1/4 translate-x-1/4 pointer-events-none">
                                <User size={180} />
                            </div>
                        </motion.div>
                    ))}
                    {filteredApplicants.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto border-2 border-dashed border-slate-200">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">No candidates found</h3>
                            <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ViewApplicants;
