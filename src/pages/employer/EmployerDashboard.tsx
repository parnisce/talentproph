import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Users,
    Briefcase,
    TrendingUp,
    Plus,
    ChevronRight,
    MessageSquare,
    ShieldCheck,
    Star,
    Zap,
    Crown,
    CheckCircle2,
    Clock,
    DollarSign,
    Target
} from 'lucide-react';
import CalendarView from '../../components/CalendarView';
import { useUser } from '../../context/UserContext';
import CreateJobPost from './CreateJobPost';
import EmployerMessages from './EmployerMessages';
import UpgradePlan from './UpgradePlan';
import UpgradePayment from './UpgradePayment';
import EditJobPost from './EditJobPost';
import ViewApplicants from './ViewApplicants';
import ReviewProfile from './ReviewProfile';
import EmployerAccount from './EmployerAccount';
import JobDetails from '../seeker/JobDetails';

const EmployerOverview = () => {
    const navigate = useNavigate();
    const { id, subscription_plan } = useUser();
    const [jobCount, setJobCount] = useState(0);
    const [applicantCount] = useState(0);

    const planLimits: Record<string, number> = {
        'Free': 1,
        'Starter': 1,
        'Pro': 3,
        'Premium': 10
    };

    const maxSlots = planLimits[subscription_plan as keyof typeof planLimits] || 1;

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            // Fetch Job Postings count
            const { count: jCount, error: jError } = await supabase
                .from('job_posts')
                .select('*', { count: 'exact', head: true })
                .eq('employer_id', id)
                .eq('status', 'active');

            if (!jError) setJobCount(jCount || 0);

            // Fetch Applicants count (mocked for now until applications table ready, or placeholder)
            // setApplicantCount(0); 
        };

        fetchData();
    }, [id]);

    const stats = [
        { label: 'Active Jobs', value: jobCount.toString(), secondary: `/ ${maxSlots} slots`, icon: Briefcase, color: 'text-blue-600 bg-blue-50', trend: `${jobCount} live now` },
        { label: 'Total Applicants', value: applicantCount.toString(), secondary: 'Across all posts', icon: Users, color: 'text-emerald-600 bg-emerald-50', trend: 'Updating...' },
        { label: 'Interviewed', value: '0', secondary: 'Candidates', icon: TrendingUp, color: 'text-violet-600 bg-violet-50', trend: 'Check messages' },
    ];

    const recentApplicants: any[] = [];

    return (
        <div className="space-y-10 pb-20">
            {/* Premium Header / Identity */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Employer Hub</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your remote dream team and active job postings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/employer/upgrade')}
                        className="px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                        Manage Plan
                    </button>
                    <button
                        onClick={() => navigate('/employer/new-post')}
                        className="px-8 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Plus size={18} /> Post New Job
                    </button>
                </div>
            </div>

            {/* Subscription Card - Ultra Premium */}
            <div className="relative group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-violet-500 to-secondary rounded-[40px] blur opacity-15 group-hover:opacity-25 transition duration-1000" />
                <div className="relative bg-white border border-slate-100 rounded-[40px] p-8 md:p-10 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                        <Crown size={240} />
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-deep rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 group-hover:rotate-0 transition-transform">
                                <Zap className="text-white" size={40} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-widest">Active Plan</span>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{subscription_plan === 'Free' ? 'Starter' : subscription_plan} Tier</h2>
                                </div>
                                <p className="text-slate-500 font-medium">Enjoying {subscription_plan} features • Upgrade to scale faster</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-10">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Postings Used</p>
                                <div className="flex items-center gap-4">
                                    <div className="h-2.5 w-40 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${(jobCount / maxSlots) >= 1 ? 'bg-gradient-to-r from-violet-500 to-primary' : 'bg-primary'
                                                }`}
                                            style={{ width: `${Math.min((jobCount / maxSlots) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-black text-slate-900 tracking-tighter">{jobCount} / {maxSlots}</span>
                                </div>
                            </div>
                            <div className="h-12 w-px bg-slate-100 hidden md:block" />
                            <button
                                onClick={() => navigate('/employer/upgrade')}
                                className="px-10 py-5 bg-slate-900 text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Upgrade Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -6, scale: 1.01 }}
                        className="bg-white border-2 border-slate-50 p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={26} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                                <span className="text-sm font-bold text-slate-400">{stat.secondary}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Recent Applicants Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Promising Talent</h3>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">7 New</div>
                        </div>
                        <button
                            onClick={() => navigate('/employer/applicants/all')}
                            className="flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-widest hover:translate-x-1 transition-transform">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentApplicants.map((applicant) => (
                            <motion.div
                                key={applicant.id}
                                whileHover={{ x: 8 }}
                                onClick={() => navigate(`/employer/applicants/review/${applicant.id}`)}
                                className="bg-white border-2 border-slate-50 p-6 md:p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[28px] bg-slate-100 overflow-hidden ring-[6px] ring-white shadow-xl transition-transform group-hover:scale-110">
                                            <img src={applicant.photo} alt={applicant.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                            <ShieldCheck size={14} />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2 justify-center md:justify-start">
                                            <h4 className="text-xl font-black text-slate-900 tracking-tighter">{applicant.name}</h4>
                                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${applicant.status === 'Shortlisted' ? 'bg-amber-100 text-amber-600' :
                                                applicant.status === 'New' ? 'bg-primary/10 text-primary' :
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                {applicant.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-medium text-sm justify-center md:justify-start">
                                            <span className="flex items-center gap-2">
                                                <Target size={14} className="text-primary" /> {applicant.role}
                                            </span>
                                            <span className="flex items-center gap-2 font-black text-slate-900">
                                                <DollarSign size={14} className="text-emerald-500" /> {applicant.rate}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock size={14} /> {applicant.time}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1.5 text-primary mb-1">
                                                <Star size={16} fill="currentColor" />
                                                <span className="text-lg font-black tracking-tighter">{applicant.score}%</span>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Talent Score</p>
                                        </div>
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                                            <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-10">
                    {/* Recruitment Health */}
                    <div className="bg-slate-900 p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-1000">
                            <TrendingUp size={240} />
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">Recruitment Health</h4>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-lg font-black tracking-tight">Hiring Velocity</p>
                                        <span className="text-primary font-black text-xl uppercase tracking-tighter">+4.2d</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-primary w-[72%] rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                                    </div>
                                    <p className="text-[10px] text-white/40 font-bold italic tracking-wide">Faster than 85% of employers in your niche.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-lg font-black tracking-tight">Profile Reach</p>
                                        <span className="text-secondary font-black text-xl uppercase tracking-tighter">8.4k</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-secondary w-[58%] rounded-full shadow-[0_0_15px_rgba(var(--secondary-rgb),0.5)]" />
                                    </div>
                                    <p className="text-[10px] text-white/40 font-bold italic tracking-wide">Views on your active job listings this week.</p>
                                </div>
                            </div>

                            <button className="w-full mt-12 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                                Full Analytics Report
                            </button>
                        </div>
                    </div>

                    {/* Quick Support */}
                    <div className="bg-primary/5 border border-primary/10 p-10 rounded-[48px] relative overflow-hidden group">
                        <div className="bg-primary p-4 rounded-2xl text-white w-fit mb-8 shadow-2xl shadow-primary/20 group-hover:rotate-12 transition-transform">
                            <MessageSquare size={24} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Hiring Success?</h4>
                        <p className="text-slate-500 font-medium leading-relaxed mb-10">Our talent concierges can help you filter applicants or conduct background checks for a small fee.</p>
                        <button className="w-full py-5 bg-white border border-slate-200 rounded-3xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm hover:shadow-xl hover:shadow-primary/20 active:scale-95 flex items-center justify-center gap-3">
                            Talk to Admin <Zap size={16} />
                        </button>
                    </div>

                    {/* Success Metrics / Tips */}
                    <div className="bg-emerald-50/50 border border-emerald-100/50 p-10 rounded-[48px] text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h5 className="font-black text-slate-900 mb-2">Verified Hiring</h5>
                        <p className="text-[11px] text-emerald-800/60 font-bold leading-relaxed">
                            You have successfully hired 4 remote professionals via TalentPro PH. Keep it up!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmployerJobPosts = () => {
    const navigate = useNavigate();
    const { id } = useUser();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchJobs = async () => {
            const { data, error } = await supabase
                .from('job_posts')
                .select('*')
                .eq('employer_id', id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                // Map DB fields to UI fields if necessary
                const mappedJobs = data.map(job => ({
                    id: job.id,
                    title: job.title,
                    status: job.status === 'active' ? 'Live' : 'Paused',
                    applicants: 0, // Placeholder
                    newApplicants: 0, // Placeholder
                    views: '0', // Placeholder
                    postedDate: new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    category: job.category
                }));
                setJobs(mappedJobs);
            }
            setLoading(false);
        };

        fetchJobs();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">My Job Posts</h2>
                    <p className="text-slate-500 font-medium">Monitor and manage your active remote positions.</p>
                </div>
                <button
                    onClick={() => navigate('/employer/new-post')}
                    className="px-8 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                    <Plus size={18} /> New Posting
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {jobs.length > 0 ? jobs.map((job) => (
                    <div key={job.id} className="bg-white border-2 border-slate-50 rounded-[40px] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
                        {/* Status Accents */}
                        <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] -translate-y-1/2 translate-x-1/2 rounded-full ${job.status === 'Live' ? 'bg-emerald-500' :
                            job.status === 'Under Review' ? 'bg-amber-500' : 'bg-slate-500'
                            }`} />

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${job.status === 'Live' ? 'bg-emerald-50 text-emerald-500' :
                                    job.status === 'Under Review' ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    <Briefcase size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3
                                            onClick={() => navigate(`/employer/jobs/${job.id}`)}
                                            className="text-xl font-black text-slate-900 tracking-tighter hover:text-primary cursor-pointer transition-colors"
                                        >
                                            {job.title}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${job.status === 'Live' ? 'bg-emerald-100 text-emerald-600' :
                                            job.status === 'Under Review' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> Posted {job.postedDate}</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span>{job.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-10 lg:pr-8">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                        <Users size={16} className="text-slate-300" />
                                        <span className="text-xl font-black text-slate-900 tracking-tighter">{job.applicants}</span>
                                        {job.newApplicants > 0 && (
                                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">+{job.newApplicants} NEW</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Applicants</p>
                                </div>

                                <div className="text-center md:text-left">
                                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                        <TrendingUp size={16} className="text-slate-300" />
                                        <span className="text-xl font-black text-slate-900 tracking-tighter">{job.views}</span>
                                    </div>
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Views</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate(`/employer/edit-post/${job.id}`)}
                                        className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                                    >
                                        Edit Post
                                    </button>
                                    <button
                                        onClick={() => navigate(`/employer/applicants/${job.id}`)}
                                        className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:scale-[1.02] transition-all"
                                    >
                                        View Applicants
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white border-2 border-dashed border-slate-100 rounded-[40px]">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tighter">No job posts yet</h3>
                        <p className="text-slate-500 text-sm font-medium mb-8">Start growing your team by creating your first listing.</p>
                        <button
                            onClick={() => navigate('/employer/new-post')}
                            className="px-8 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-3"
                        >
                            <Plus size={18} /> Create Listing
                        </button>
                    </div>
                )}
            </div>

            {/* Vacancy Strategy Tip */}
            <div className="bg-slate-900 p-10 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-8 mt-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] grayscale group-hover:scale-110 transition-all">
                    <Zap size={180} />
                </div>
                <div className="relative z-10 flex items-center gap-8">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary shadow-inner rotate-3">
                        <Star size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black tracking-tighter mb-1">Boost Your Visibility</h4>
                        <p className="text-white/40 text-sm font-medium">Hiring urgently? Boost your listings to appear at the top of the "Find Jobs" page.</p>
                    </div>
                </div>
                <button className="relative z-10 px-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all whitespace-nowrap">
                    Boost All Posts
                </button>
            </div>
        </div>
    );
};

const EmployerDashboard = () => {
    return (
        <DashboardLayout role="employer">
            <Routes>
                <Route path="/" element={<EmployerOverview />} />
                <Route path="/calendar" element={
                    <CalendarView
                        interviews={[
                            { id: '1', title: 'John Doe - 1st Interview', time: '11:00 AM', date: new Date(), location: 'Zoom', type: 'video' },
                            { id: '2', title: 'Jane Smith - Screening', time: '4:00 PM', date: new Date(), location: 'Direct Call', type: 'phone' }
                        ]}
                    />
                } />
                <Route path="/messages" element={<EmployerMessages />} />
                <Route path="/posts" element={<EmployerJobPosts />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/new-post" element={<CreateJobPost />} />
                <Route path="/edit-post/:id" element={<EditJobPost />} />
                <Route path="/applicants/:id" element={<ViewApplicants />} />
                <Route path="/applicants/:id" element={<ViewApplicants />} />
                <Route path="/applicants/review/:applicantId" element={<ReviewProfile />} />
                <Route path="/account" element={<EmployerAccount />} />
                <Route path="/upgrade" element={<UpgradePlan />} />
                <Route path="/upgrade/payment" element={<UpgradePayment />} />
                <Route path="/settings" element={<EmployerAccount />} />
            </Routes>
        </DashboardLayout>
    );
};

export default EmployerDashboard;
