import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
    Zap,
    ShieldCheck,
    Globe,
    MapPin,
    Mail,
    FileText,
    ExternalLink,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Star,
    Award,
    Activity,
    Target,
    MessageSquare,
    Calendar,
    GraduationCap,
    Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';

const PublicSeekerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) {
                navigate('/');
                return;
            }

            try {
                // Fetch Profile
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    throw error || new Error('Profile not found');
                }

                if (data.role !== 'seeker' && data.role !== 'admin') {
                    // If it's an employer, maybe redirect to company profile?
                    // But for now let's just show it if it exists.
                }

                setProfile({
                    ...data,
                    name: data.full_name || "Anonymous Professional",
                    photo: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.full_name || data.id}`,
                    title: data.title || "Remote Professional",
                    iq: data.iq || 0,
                    disc: data.disc_scores || { dominance: 0, influence: 0, steadiness: 0, compliance: 0 },
                    english: data.english_proficiency || "N/A",
                    salary: data.expected_salary || "TBD",
                    education: data.education_level || "Not Specified",
                    experience: data.experience_years || "0",
                    skills: data.skills_list || [],
                    banner_photo: data.banner_url || data.banner_photo || ""
                });

                // Fetch Reviews
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('reviews')
                    .select(`
                        id,
                        rating,
                        review_text,
                        created_at,
                        job_posts (
                            title,
                            company_name
                        )
                    `)
                    .eq('seeker_id', id)
                    .order('created_at', { ascending: false });

                if (!reviewsError && reviewsData) {
                    setReviews(reviewsData);
                }

            } catch (error) {
                console.error("Error fetching public profile:", error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!profile) return null;

    const memberSince = profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : 'Join Date Untracked';

    return (
        <div className="min-h-screen bg-slate-50/30">
            <Navbar forceSolid={true} />

            <div className="max-w-[1400px] mx-auto pt-32 px-6 pb-32 space-y-12">
                {/* Main Premium Card */}
                <div className="bg-white rounded-[56px] border-2 border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                    {/* Visual Header Banner */}
                    <div className="h-64 md:h-80 bg-slate-900 relative">
                        {profile.banner_photo ? (
                            <img src={profile.banner_photo} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,71,255,0.2),transparent_70%)]" />
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                            </>
                        )}
                        {/* Status Badge */}
                        <div className="absolute top-8 right-8">
                            <span className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> Available for Hire
                            </span>
                        </div>
                    </div>

                    <div className="px-12 pb-16 relative">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col lg:flex-row gap-16 items-start">
                            <div className="-mt-32 relative group shrink-0">
                                <div className="w-56 h-56 rounded-[56px] bg-white p-2 shadow-2xl overflow-hidden ring-8 ring-white">
                                    <img
                                        src={profile.photo}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-[48px] bg-slate-50"
                                    />
                                </div>
                                <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-3xl border-4 border-white flex items-center justify-center text-white shadow-xl ${profile.is_verified_pro ? 'bg-green-500' : 'bg-slate-300'}`}>
                                    <ShieldCheck size={24} strokeWidth={3} />
                                </div>
                            </div>

                            <div className="lg:pt-8 flex-grow">
                                <div className="flex flex-wrap items-center justify-between gap-6 mb-4">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">{profile.name}</h1>
                                        {profile.is_verified_pro ? (
                                            <div className="flex items-center gap-2 px-5 py-2 bg-green-500/10 border border-green-500/20 rounded-full shadow-sm">
                                                <ShieldCheck size={14} className="text-green-500" />
                                                <span className="text-[11px] font-black text-green-600 uppercase tracking-[0.2em]">Verified Pro</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-5 py-2 bg-slate-500/10 border border-slate-500/20 rounded-full shadow-sm">
                                                <ShieldCheck size={14} className="text-slate-400" />
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Basic Seeker</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                        <Calendar size={14} className="text-slate-300" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Since {memberSince}</span>
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-slate-500 max-w-2xl leading-relaxed">{profile.title}</p>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                                <span className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                    <MapPin size={16} className="text-primary" /> {profile.location || 'Remote'}
                                </span>
                                <span className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                    <Mail size={16} className="text-primary" /> {profile.email}
                                </span>
                                {profile.website && (
                                    <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                                        <Globe size={16} /> {profile.website.replace('https://', '').replace('http://', '')}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-8 pt-6 border-t border-slate-50">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Salary</p>
                                <p className="text-xl font-black text-slate-900">{profile.salary.startsWith('$') ? profile.salary : `$${profile.salary}`} <span className="text-xs text-slate-400 font-bold">/ mo</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                                <p className="text-xl font-black text-slate-900">{profile.experience} Years <span className="text-xs text-slate-400 font-bold">Total</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                                <div className="text-xl font-black text-primary flex items-center gap-2 text-sm">
                                    {profile.availability || 'Full-Time'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</p>
                                <div className="flex items-center gap-2">
                                    <GraduationCap size={14} className="text-primary" />
                                    <p className="text-[13px] font-black text-slate-900 uppercase">
                                        {profile.education}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume / CV</p>
                                {profile.resume_url ? (
                                    <button
                                        onClick={() => window.open(profile.resume_url, '_blank')}
                                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all font-black"
                                    >
                                        <FileText size={16} />
                                        <span className="text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4">View CV</span>
                                    </button>
                                ) : (
                                    <p className="text-sm font-bold text-slate-300 italic">Not Shared</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Professional Summary */}
                        <section className="bg-white p-12 rounded-[48px] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <FileText size={120} />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                <Zap size={16} className="text-primary" /> Executive Summary
                            </h3>
                            <p className="text-lg text-slate-600 font-medium leading-[1.8] relative z-10 whitespace-pre-line">
                                {profile.bio || 'No professional summary provided yet.'}
                            </p>
                        </section>

                        {/* Core Skills Matrix */}
                        <section className="bg-white p-12 rounded-[48px] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <Award size={120} />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                <Target size={16} className="text-primary" /> Core Skillset Matrix
                            </h3>
                            <div className="flex flex-wrap gap-3 relative z-10">
                                {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill: string, idx: number) => (
                                    <div key={idx} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-black text-[11px] uppercase tracking-widest hover:border-primary hover:text-primary hover:bg-white transition-all">
                                        {skill}
                                    </div>
                                )) : (
                                    <p className="text-sm font-bold text-slate-400 italic">No skills added yet.</p>
                                )}
                            </div>
                        </section>

                        {/* Employer Reviews Section */}
                        <section className="bg-white p-12 rounded-[48px] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                <MessageSquare size={16} className="text-primary" /> Verified Employer Reviews
                            </h3>
                            <div className="space-y-6">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 relative">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 text-xl">
                                                    {review.job_posts?.company_name?.[0]?.toUpperCase() || 'C'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{review.job_posts?.company_name || 'Verified Employer'}</p>
                                                    <div className="flex gap-1 text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={12}
                                                                fill={i < review.rating ? "currentColor" : "none"}
                                                                className={i < review.rating ? "text-yellow-400" : "text-slate-300"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="ml-auto text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                                                "{review.review_text}"
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No verified reviews yet</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Socials & Sidebar */}
                    <div className="space-y-12">
                        {/* Assessment Reports */}
                        <section className="bg-white p-10 rounded-[48px] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                <Activity size={16} className="text-primary" /> Assessment Insights
                            </h3>

                            <div className="space-y-8">
                                {/* IQ Score */}
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IQ Proficiency</span>
                                        <span className="text-xl font-black text-slate-900">{profile.iq || '--'}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000"
                                            style={{ width: `${(profile.iq / 160) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* English */}
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 font-black">English Level</p>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{profile.english}</p>
                                </div>

                                {/* DISC Profile */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">DISC Profile Breakdown</p>
                                    {[
                                        { k: 'Dominance', v: profile.disc.dominance, c: 'bg-rose-500' },
                                        { k: 'Influence', v: profile.disc.influence, c: 'bg-amber-500' },
                                        { k: 'Steadiness', v: profile.disc.steadiness, c: 'bg-emerald-500' },
                                        { k: 'Compliance', v: profile.disc.compliance, c: 'bg-blue-500' }
                                    ].map((d) => (
                                        <div key={d.k} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                <span>{d.k}</span>
                                                <span>{d.v}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${d.c} transition-all duration-1000`}
                                                    style={{ width: `${d.v}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Social Footprint */}
                        <section className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 opacity-50" />
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8 relative z-10">Social Footprint</h3>
                            <div className="space-y-6 relative z-10">
                                {[
                                    { name: 'LinkedIn', icon: Linkedin, url: profile.linkedin_url, color: 'text-[#0077b5]' },
                                    { name: 'Twitter / X', icon: Twitter, url: profile.twitter_url, color: 'text-[#1da1f2]' },
                                    { name: 'Facebook', icon: Facebook, url: profile.facebook_url, color: 'text-[#1877f2]' },
                                    { name: 'Instagram', icon: Instagram, url: profile.instagram_url, color: 'text-[#e4405f]' }
                                ].map(social => (
                                    <a
                                        key={social.name}
                                        href={social.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/item ${!social.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-xl bg-white/10 ${social.color}`}>
                                                <social.icon size={18} />
                                            </div>
                                            <span className="text-sm font-black tracking-tight">{social.name}</span>
                                        </div>
                                        <ExternalLink size={14} className="text-white/20 group-hover/item:text-primary transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Contact Card */}
                        <div className="bg-primary p-10 rounded-[48px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform">
                                <Mail size={120} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Direct Contact</h4>
                                <h3 className="text-3xl font-black tracking-tighter mb-6">Interested in working together?</h3>
                                <button className="w-full py-5 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicSeekerProfile;
