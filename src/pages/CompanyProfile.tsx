import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
    Building2,
    MapPin,
    Globe,
    Linkedin,
    Twitter,
    Facebook,
    Users,
    Calendar,
    Briefcase,
    ChevronRight,
    Zap,
    Loader2,
    ExternalLink
} from 'lucide-react';

const CompanyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyAndJobs = async () => {
            if (!id) {
                navigate('/');
                return;
            }

            try {
                // Fetch company profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (profileError || !profileData) {
                    throw profileError || new Error('Company not found');
                }

                setCompany(profileData);

                // Fetch open jobs for this company
                const { data: jobsData, error: jobsError } = await supabase
                    .from('job_posts')
                    .select('*')
                    .eq('employer_id', id)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (!jobsError) {
                    setJobs(jobsData || []);
                }

            } catch (error) {
                console.error('Error fetching company:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyAndJobs();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!company) return null;

    return (
        <div className="w-full max-w-[1400px] mx-auto pb-32">
            {/* Banner Section */}
            <div className="relative h-[300px] md:h-[450px] rounded-[64px] overflow-hidden shadow-2xl group">
                <img
                    src={company.banner_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
                    alt="Banner"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                {/* Company Logo Overlap */}
                <div className="absolute -bottom-1 left-12 md:left-20 translate-y-1/2">
                    <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[40px] p-4 shadow-2xl border-[8px] border-white overflow-hidden flex items-center justify-center">
                        {company.company_logo ? (
                            <img src={company.company_logo} alt={company.company_name} className="w-full h-full object-contain" />
                        ) : (
                            <Building2 size={64} className="text-slate-200" />
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="mt-24 md:mt-32 px-12 md:px-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter font-outfit">
                                {company.company_name || 'Anonymous Company'}
                            </h1>
                            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Zap size={14} /> Premium Partner
                            </span>
                        </div>
                        <p className="text-xl font-bold text-primary flex items-center gap-3">
                            {company.industry || 'Software & Technology'}
                        </p>
                    </div>

                    <div className="bg-white border-2 border-slate-50 p-10 md:p-12 rounded-[56px] shadow-sm space-y-8">
                        <section>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">About the Company</h3>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                                {company.about_company || "This company hasn't added a detailed description yet. They are a valued partner of TalentPro PH."}
                            </p>
                        </section>

                        {company.perks && company.perks.length > 0 && (
                            <section className="pt-10 border-t border-slate-50">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Perks & Benefits</h3>
                                <div className="flex flex-wrap gap-3">
                                    {company.perks.map((perk: string, i: number) => (
                                        <div key={i} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-900 uppercase tracking-widest hover:border-primary transition-all cursor-default">
                                            {perk}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Open Positions */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Open Positions</h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{jobs.length} Active Posts</span>
                        </div>

                        <div className="space-y-4">
                            {jobs.length > 0 ? (
                                jobs.map(job => (
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        key={job.id}
                                        className="block bg-white border-2 border-slate-50 p-8 rounded-[32px] hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                                    >
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <Briefcase size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-slate-900 tracking-tighter mb-1">{job.title}</h4>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.engagement}</span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{job.salary} / {job.period === 'Per Month' ? 'mo' : job.period === 'Per Week' ? 'wk' : 'hr'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-slate-200 group-hover:text-primary transition-colors group-hover:translate-x-1" size={24} />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
                                    <Briefcase size={48} className="text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold">No open positions at the moment.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Key Details */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white border-2 border-slate-50 p-10 rounded-[48px] shadow-sm space-y-8">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Key Information</h4>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Company Size</p>
                                        <p className="text-sm font-black text-slate-900">{company.company_size || '11-50 Employees'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Founded Year</p>
                                        <p className="text-sm font-black text-slate-900">{company.founded_year || '2020'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Headquarters</p>
                                        <p className="text-sm font-black text-slate-900">{company.location || 'Remote'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50 space-y-4">
                                {company.website && (
                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Globe size={18} />
                                            <span className="text-xs font-black uppercase tracking-widest">Website</span>
                                        </div>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}
                                <div className="flex gap-2">
                                    {company.linkedin_url && (
                                        <a href={company.linkedin_url} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-[#0077b5] hover:text-white transition-all">
                                            <Linkedin size={20} />
                                        </a>
                                    )}
                                    {company.twitter_url && (
                                        <a href={company.twitter_url} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                                            <Twitter size={20} />
                                        </a>
                                    )}
                                    {company.facebook_url && (
                                        <a href={company.facebook_url} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-[#1877f2] hover:text-white transition-all">
                                            <Facebook size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Share Card */}
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Share This Company</h4>
                            <p className="text-xs text-white/50 font-medium leading-relaxed mb-6">Know someone who would be a great fit for this team? Share this profile with them.</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }}
                                className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                            >
                                Copy Profile Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
