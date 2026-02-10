import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronRight, X, Clock, Building2, ShieldCheck, Globe, Sparkles, Check, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useEffect } from 'react';

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
    logo?: string;
    employerId?: string;
}

// Mock data removed in favor of Supabase

const FindJobs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkills] = useState<string[]>([]);
    const [employmentTypes, setEmploymentTypes] = useState<string[]>(['Full-Time', 'Part-Time', 'Gig']);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                    employerId: job.employer_id,
                    logo: job.company_logo
                }));
                setJobs(mappedJobs);
            }
            setLoading(false);
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.skills.some(skill => skill.toLowerCase().includes(query));
        const matchesType = employmentTypes.includes(job.type);
        const matchesSkills = selectedSkills.length === 0 ||
            selectedSkills.every(skill => job.skills.includes(skill));
        return matchesSearch && matchesType && matchesSkills;
    });

    const handleJobClick = (jobId: string) => {
        navigate('/login', { state: { redirectTo: `/jobs/${jobId}`, message: 'Please log in to view full job details and apply.' } });
    };

    const handleCompanyClick = (e: React.MouseEvent, employerId: string) => {
        e.stopPropagation();
        if (employerId) {
            navigate(`/company/${employerId}`);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main font-inter selection:bg-primary/20">
            {loading && (
                <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            )}
            <Navbar />

            {/* Premium Header - Realigned with Landing Page Style */}
            <section className="bg-deep pt-48 pb-24 relative overflow-hidden">
                {/* Background Effects matching Landing Page */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(0,71,255,0.15),transparent_70%)]" />
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] opacity-50" />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md"
                        >
                            <Sparkles size={14} className="text-primary" />
                            <span>12,402 new positions available today</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
                        >
                            Find your next <br /><span className="text-gradient italic">Global Career.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/40 font-medium max-w-2xl leading-relaxed mb-16"
                        >
                            Connect with top-tier premium employers from around the world. No middlemen, just direct hiring.
                        </motion.p>


                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Filter Sidebar */}
                    <aside className={`lg:w-80 space-y-10 transition-all ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white p-10 rounded-[48px] border-2 border-slate-100 shadow-xl shadow-slate-200/20 sticky top-48">
                            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Filter size={16} className="text-primary" /> Filters
                                </h3>
                                <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">Skill Set</p>
                                    <div className="relative mb-6">
                                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="Search skills"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-primary/30 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 opacity-50">
                                        {['React', 'Admin', 'Writing', 'Design'].map(s => (
                                            <span key={s} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">Job Type</p>
                                    <div className="space-y-4">
                                        {['Full-Time', 'Part-Time', 'Gig'].map(type => (
                                            <label key={type} className="flex items-center gap-4 group cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={employmentTypes.includes(type)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setEmploymentTypes([...employmentTypes, type]);
                                                            else setEmploymentTypes(employmentTypes.filter(t => t !== type));
                                                        }}
                                                        className="peer h-6 w-6 appearance-none rounded-lg border-2 border-slate-100 bg-slate-50 checked:border-primary checked:bg-primary transition-all cursor-pointer"
                                                    />
                                                    <Check size={14} className="absolute left-1 mt-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
                                                </div>
                                                <span className="text-sm font-black text-slate-500 group-hover:text-primary transition-colors tracking-tight uppercase tracking-widest text-[11px]">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-primary text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all shadow-lg">
                                    Refine Results
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow space-y-10">
                        {/* Integrated Premium Search bar - Moved here for better accessibility */}
                        <div className="relative group mb-12">
                            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none z-20" size={24} />
                            <input
                                type="text"
                                placeholder="Search by job title, specific company, or expertise..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border-2 border-slate-100 rounded-[32px] py-8 pl-24 pr-56 text-slate-900 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-xl font-bold tracking-tight placeholder:text-slate-300 shadow-xl shadow-slate-200/20 relative z-10"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 px-12 py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all z-20">
                                Search Jobs
                            </button>
                        </div>

                        <div className="flex justify-between items-center mb-6 px-4">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                Showing <span className="text-slate-900 text-lg mx-1 font-black">{filteredJobs.length}</span> Premium Positions
                            </p>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest"
                            >
                                <Filter size={14} className="text-primary" /> Filter
                            </button>
                        </div>

                        <div className="space-y-6">
                            {filteredJobs.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleJobClick(job.id)}
                                    className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 hover:border-primary hover:bg-slate-50/30 transition-all cursor-pointer group relative overflow-hidden flex flex-col md:flex-row gap-8 items-start shadow-sm hover:shadow-2xl hover:shadow-slate-200/40"
                                >
                                    {/* Company Identity */}
                                    <div
                                        onClick={(e) => handleCompanyClick(e, job.employerId || '')}
                                        className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[28px] shrink-0 flex items-center justify-center p-5 relative group-hover:bg-primary/5 transition-colors duration-500 overflow-hidden"
                                    >
                                        {job.logo ? (
                                            <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                        ) : (
                                            <Building2 className="text-slate-400 group-hover:text-primary transition-colors" size={32} strokeWidth={1.5} />
                                        )}
                                    </div>

                                    <div className="flex-grow pt-1">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">Premium</span>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID Verified</span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors leading-tight mb-2">
                                                    {job.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                    <span
                                                        onClick={(e) => handleCompanyClick(e, job.employerId || '')}
                                                        className="text-[11px] font-bold text-slate-500 flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        <Globe size={14} className="text-primary/60" /> {job.company}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                                                        <Clock size={14} className="text-slate-300" /> {job.postedDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">
                                                    {job.salary}
                                                </div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Per Month</div>
                                            </div>
                                        </div>

                                        <p className="text-base text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2 max-w-2xl">
                                            {job.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.slice(0, 4).map(skill => (
                                                <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-xl border border-slate-100 group-hover:border-primary/10 transition-colors">
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.skills.length > 4 && (
                                                <span className="px-4 py-2 text-slate-400 text-[10px] font-bold">+{job.skills.length - 4} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="shrink-0 self-center">
                                        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-300 group-hover:translate-x-1">
                                            <ChevronRight size={20} strokeWidth={3} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </main>
                </div>

                {/* Global Team CTA */}
                <div className="mt-32 p-16 md:p-24 bg-slate-900 rounded-[80px] relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-primary/10 opacity-30 pointer-events-none" />
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-[2s]" />

                    <div className="relative z-10">
                        <ShieldCheck className="text-white/10 mx-auto mb-10 animate-pulse" size={100} strokeWidth={1} />
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                            Your Global <br /><span className="text-primary italic">Career</span> Awaits.
                        </h2>
                        <p className="text-white/40 text-2xl font-medium mb-16 leading-relaxed max-w-2xl mx-auto">
                            Join over 2 million professionals who have found freedom through remote work in the Philippines.
                        </p>
                        <button onClick={() => navigate('/register')} className="px-16 py-6 bg-primary text-white rounded-[32px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/40 hover:translate-y-[-4px] transition-all active:scale-95">
                            Create Free Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindJobs;
