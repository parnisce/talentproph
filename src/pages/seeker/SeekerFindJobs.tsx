import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    ChevronRight,
    Clock,
    Building2,
    Globe,
    Bookmark,
    Navigation,
    DollarSign,
    Briefcase,
    Loader2
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';

interface Job {
    id: string;
    title: string;
    company: string;
    postedDate: string;
    salary: string;
    type: 'Full-Time' | 'Part-Time' | 'Gig';
    location: string;
    description: string;
    skills: string[];
    verified: boolean;
    category: string;
}

const SeekerFindJobs = () => {
    const navigate = useNavigate();
    const { id: seekerId } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [employmentTypes, setEmploymentTypes] = useState<string[]>(['Full-Time', 'Part-Time', 'Gig']);
    const [activeCategory, setActiveCategory] = useState('All Jobs');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const categories = ['All Jobs', 'Design', 'Development', 'Marketing', 'Admin', 'Writing'];

    useEffect(() => {
        const fetchJobsAndSavedWrapper = async () => {
            setLoading(true);
            await Promise.all([fetchJobs(), fetchSavedJobs()]);
            setLoading(false);
        };

        const fetchJobs = async () => {
            const { data, error } = await supabase
                .from('job_posts')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (!error && data) {
                const mappedJobs: Job[] = data.map(job => ({
                    id: job.id,
                    title: job.title,
                    company: job.company_name,
                    postedDate: new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    salary: `${job.salary} / ${job.period === 'Per Month' ? 'mo' : job.period === 'Per Week' ? 'wk' : 'hr'}`,
                    type: (job.engagement?.includes('Full-Time') ? 'Full-Time' : job.engagement?.includes('Part-Time') ? 'Part-Time' : 'Gig') as any,
                    location: job.location,
                    description: job.preview,
                    skills: job.skills || [],
                    verified: true,
                    category: job.category || 'Other'
                }));
                setJobs(mappedJobs);
            }
        };

        const fetchSavedJobs = async () => {
            if (!seekerId) return;
            const { data } = await supabase
                .from('saved_jobs')
                .select('job_id')
                .eq('seeker_id', seekerId);

            if (data) {
                setSavedJobIds(new Set(data.map(item => item.job_id)));
            }
        };

        fetchJobsAndSavedWrapper();
    }, [seekerId]);

    const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation();
        if (!seekerId) {
            alert("Please log in to bookmark jobs.");
            return;
        }

        const isSaved = savedJobIds.has(jobId);

        // Optimistic update
        setSavedJobIds(prev => {
            const newSet = new Set(prev);
            if (isSaved) newSet.delete(jobId);
            else newSet.add(jobId);
            return newSet;
        });

        try {
            if (isSaved) {
                const { error } = await supabase
                    .from('saved_jobs')
                    .delete()
                    .eq('seeker_id', seekerId)
                    .eq('job_id', jobId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('saved_jobs')
                    .insert({ seeker_id: seekerId, job_id: jobId });
                if (error) throw error;
            }
        } catch (err) {
            console.error("Error toggling bookmark:", err);
            // Revert on error
            setSavedJobIds(prev => {
                const newSet = new Set(prev);
                if (isSaved) newSet.add(jobId);
                else newSet.delete(jobId);
                return newSet;
            });
            alert("Failed to update bookmark.");
        }
    };

    const filteredJobs = jobs.filter(job => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.skills.some(skill => skill.toLowerCase().includes(query));
        const matchesType = employmentTypes.includes(job.type);
        const matchesCategory = activeCategory === 'All Jobs' ||
            (job as any).category === activeCategory;
        return matchesSearch && matchesType && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }
    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div>
                    <h2 className="text-3xl font-black font-outfit tracking-tighter text-slate-900">Premium Opportunities</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Direct hiring from global executive teams</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/seeker/saved-jobs')}
                        className="px-6 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all flex items-center gap-2"
                    >
                        <Bookmark size={14} /> Saved Jobs
                    </button>
                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10">
                        <Navigation size={14} className="text-primary" /> Application History
                    </button>
                </div>
            </div>

            {/* Premium Search & Category Bar */}
            <div className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm space-y-8">
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by job title, specific company, or expertise..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-44 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold tracking-tight placeholder:text-slate-300"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        Search Now
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="p-1 px-4 bg-slate-100/50 rounded-2xl flex items-center gap-3 border border-slate-100">
                        <Filter size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 pr-3 mr-1">Filter By Type</span>
                        <div className="flex items-center gap-4">
                            {['Full-Time', 'Part-Time', 'Gig'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={employmentTypes.includes(type)}
                                        onChange={(e) => {
                                            if (e.target.checked) setEmploymentTypes([...employmentTypes, type]);
                                            else setEmploymentTypes(employmentTypes.filter(t => t !== type));
                                        }}
                                        className="h-4 w-4 rounded border-slate-200 text-primary focus:ring-primary transition-all"
                                    />
                                    <span className="text-[10px] font-black text-slate-500 group-hover:text-primary uppercase tracking-widest">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-4 w-px bg-slate-100 hidden lg:block mx-2" />

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-6">
                <div className="flex justify-between items-center px-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Showing <span className="text-slate-900">{filteredJobs.length}</span> Premium Results
                    </p>
                    <select className="bg-transparent text-[10px] font-black text-slate-400 uppercase tracking-widest border-none focus:ring-0 cursor-pointer">
                        <option>Newest First</option>
                        <option>Salary: High to Low</option>
                        <option>Recommended</option>
                    </select>
                </div>

                <div className="space-y-6">
                    {filteredJobs.map((job, idx) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => navigate(`/seeker/jobs/${job.id}`)}
                            className="group bg-white p-8 rounded-[40px] border border-slate-100 hover:border-primary/50 transition-all flex flex-col md:flex-row gap-8 items-start hover:shadow-2xl hover:shadow-slate-200/40 relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none">
                                <Briefcase size={120} />
                            </div>

                            {/* Job Logo Placeholder */}
                            <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-[22px] flex items-center justify-center p-4 group-hover:bg-primary/5 transition-colors shrink-0">
                                <Building2 className="text-slate-300 group-hover:text-primary transition-colors" size={24} />
                            </div>

                            <div className="flex-grow">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-lg uppercase tracking-widest">Verified Premium</span>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{job.type}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors mb-1">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                                            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 line-none">
                                                <Globe size={14} className="text-slate-400" /> {job.company}
                                            </p>
                                            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                                <Clock size={14} className="text-slate-300" /> Posted {job.postedDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1">
                                            <DollarSign size={16} className="text-primary" /> {job.salary}
                                        </div>
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Expected Budget</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                                    {job.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:border-primary/20 transition-all">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="shrink-0 self-center flex md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                                <button
                                    onClick={(e) => handleToggleSave(e, job.id)}
                                    className={`flex-1 md:flex-none p-2.5 rounded-full border-2 transition-all flex items-center justify-center ${savedJobIds.has(job.id)
                                            ? 'bg-secondary/10 border-secondary text-secondary hover:bg-secondary/20'
                                            : 'border-slate-100 text-slate-300 hover:text-secondary hover:border-secondary/30'
                                        }`}
                                    title={savedJobIds.has(job.id) ? "Remove Bookmark" : "Bookmark Job"}
                                >
                                    <Bookmark size={16} fill={savedJobIds.has(job.id) ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/seeker/jobs/${job.id}`); }}
                                    className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                                >
                                    Apply Now <ChevronRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {filteredJobs.length === 0 && (
                        <div className="py-20 text-center space-y-4 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">No positions found</h3>
                            <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto">Try adjusting your filters or searching for different keywords.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setEmploymentTypes(['Full-Time', 'Part-Time', 'Gig']); }}
                                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination Placeholder */}
                <div className="flex justify-center pt-10">
                    <div className="flex gap-2">
                        {[1, 2, 3, '...', 12].map((p, i) => (
                            <button key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeekerFindJobs;
