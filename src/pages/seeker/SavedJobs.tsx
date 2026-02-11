import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';
import {
    Bookmark,
    Briefcase,
    Building,
    MapPin,
    DollarSign,
    Clock,
    ChevronRight,
    Trash2,
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const SavedJobs = () => {
    const navigate = useNavigate();
    const { id: seekerId } = useUser();
    const [savedJobs, setSavedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!seekerId) return;

        const fetchSavedJobs = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('saved_jobs')
                    .select(`
                        id,
                        created_at,
                        job_posts (
                            id,
                            title,
                            company_name,
                            location,
                            salary,
                            period,
                            engagement,
                            created_at,
                            company_logo
                        )
                    `)
                    .eq('seeker_id', seekerId)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const formatted = data.map((item: any) => ({
                        savedId: item.id,
                        id: item.job_posts.id,
                        title: item.job_posts.title,
                        company: item.job_posts.company_name,
                        location: item.job_posts.location,
                        salary: `${item.job_posts.salary} / ${item.job_posts.period === 'Per Month' ? 'mo' : item.job_posts.period === 'Per Week' ? 'wk' : 'hr'}`,
                        type: item.job_posts.engagement?.split(' ')[0] || 'Full-Time',
                        posted: new Date(item.job_posts.created_at).toLocaleDateString(),
                        logo: item.job_posts.company_logo
                    }));
                    setSavedJobs(formatted);
                }
            } catch (err) {
                console.error("Error fetching saved jobs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, [seekerId]);

    const handleRemoveSaved = async (e: React.MouseEvent, savedId: string) => {
        e.stopPropagation();
        if (!confirm("Remove this job from your bookmarks?")) return;

        try {
            const { error } = await supabase
                .from('saved_jobs')
                .delete()
                .eq('id', savedId);

            if (error) throw error;

            setSavedJobs(prev => prev.filter(job => job.savedId !== savedId));
        } catch (err) {
            console.error("Error removing saved job:", err);
            alert("Failed to remove bookmark");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Saved Positions</h1>
                    <p className="text-slate-500 font-medium mt-1">Review and apply to your bookmarked opportunities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest">
                        {savedJobs.length} Bookmarks
                    </div>
                </div>
            </div>

            {savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {savedJobs.map((job) => (
                        <motion.div
                            key={job.savedId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                            onClick={() => navigate(`/seeker/jobs/${job.id}`)}
                            className="bg-white border-2 border-slate-50 p-6 md:p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group cursor-pointer relative"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-primary/20 transition-colors">
                                    {job.logo ? (
                                        <img src={job.logo} alt={job.company} className="w-12 h-12 object-contain" />
                                    ) : (
                                        <Briefcase size={32} className="text-slate-300 group-hover:text-primary transition-colors" />
                                    )}
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center gap-2 font-bold text-slate-500 text-sm mt-1">
                                            <Building size={14} className="text-slate-400" /> {job.company}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                            <MapPin size={12} className="text-primary" /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                            <DollarSign size={12} className="text-emerald-500" /> {job.salary}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                            <Clock size={12} className="text-slate-400" /> Posted {job.posted}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end md:self-center">
                                    <button
                                        onClick={(e) => handleRemoveSaved(e, job.savedId)}
                                        className="p-4 rounded-2xl border-2 border-slate-100 text-slate-400 hover:border-rose-100 hover:bg-rose-50 hover:text-rose-500 transition-all"
                                        title="Remove Bookmark"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-primary hover:shadow-primary/20 transition-all flex items-center gap-2 group/btn">
                                        Apply Now <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-100 rounded-[48px]">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <Bookmark size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">No Saved Jobs Yet</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                        Bookmarks help you keep track of jobs you're interested in. Start browsing and save your favorites!
                    </p>
                    <button
                        onClick={() => navigate('/seeker/jobs')}
                        className="px-10 py-5 bg-primary text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3"
                    >
                        Browse Jobs <ExternalLink size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
