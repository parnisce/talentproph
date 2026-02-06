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
    Eye,
    Star,
    Award,
    Activity,
    Target,
    MessageSquare,
    Calendar,
    GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const SeekerProfile = () => {
    const {
        userPhoto,
        userName,
        title,
        location,
        website,
        email,
        bio,
        salary,
        experience,
        linkedin,
        twitter,
        facebook,
        instagram,
        skills,
        testScores,
        availability,
        banner_photo,
        resume_url,
        education,
        created_at
    } = useUser();

    // Format member since date
    const memberSince = created_at ? new Date(created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : 'Join Date Untracked';

    return (
        <div className="space-y-12 pb-24">
            {/* Profile Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black font-outfit tracking-tighter text-slate-900">Professional Identity</h2>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-500/20">Active Profile</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 bg-white border-2 border-slate-100 rounded-xl font-black text-[11px] uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                        <Eye size={14} /> Preview as Employer
                    </button>
                    <Link to="/seeker/profile/edit" className="px-8 py-3 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-center decoration-transparent">
                        Edit Professional Details
                    </Link>
                </div>
            </div>

            {/* Main Premium Card */}
            <div className="bg-white rounded-[56px] border-2 border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                {/* Visual Header Banner */}
                <div className="h-64 md:h-72 bg-slate-900 relative">
                    {banner_photo ? (
                        <img src={banner_photo} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,71,255,0.15),transparent_70%)]" />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                        </>
                    )}
                </div>

                <div className="px-12 pb-16 relative">
                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="-mt-32 relative group shrink-0">
                            <div className="w-56 h-56 rounded-[56px] bg-white p-2 shadow-2xl overflow-hidden ring-8 ring-white">
                                <img
                                    src={userPhoto}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-[48px] bg-slate-50"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-3xl border-4 border-white flex items-center justify-center text-white shadow-xl">
                                <ShieldCheck size={24} strokeWidth={3} />
                            </div>
                        </div>

                        <div className="lg:pt-8 flex-grow">
                            <div className="flex flex-wrap items-center justify-between gap-6 mb-4">
                                <div className="flex flex-wrap items-center gap-6">
                                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">{userName}</h1>
                                    <span className="text-[12px] font-black text-primary uppercase tracking-[0.25em] px-5 py-2 bg-primary/5 rounded-full border border-primary/10 shadow-sm">{experience ? `${experience} Years` : 'Associate'}</span>
                                </div>
                                <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                    <Calendar size={14} className="text-slate-300" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Since {memberSince}</span>
                                </div>
                            </div>
                            <p className="text-xl font-bold text-slate-500 max-w-2xl leading-relaxed">{title || 'Professional Headline Not Set'}</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                            <span className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                <MapPin size={16} className="text-primary" /> {location || 'Location Not Set'}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                <Mail size={16} className="text-primary" /> {email || 'Email Not Set'}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                <Globe size={16} className="text-primary" /> {website || 'No Portfolio Website'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-8 pt-6 border-t border-slate-50">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Salary</p>
                            <p className="text-xl font-black text-slate-900">{salary ? `$${salary}` : 'TBD'} <span className="text-xs text-slate-400 font-bold">/ mo</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                            <p className="text-xl font-black text-slate-900">{experience || '0'} Years <span className="text-xs text-slate-400 font-bold">Total</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                            <div className="text-xl font-black text-primary flex items-center gap-2 text-sm">
                                {availability || 'Full-Time'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</p>
                            <div className="flex items-center gap-2">
                                <GraduationCap size={14} className="text-primary" />
                                <p className="text-[13px] font-black text-slate-900 uppercase">
                                    {education || 'Incomplete'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume / CV</p>
                            {resume_url ? (
                                <button
                                    onClick={() => {
                                        try {
                                            if (resume_url.startsWith('data:')) {
                                                const parts = resume_url.split(',');
                                                const byteString = atob(parts[1]);
                                                const mimeString = parts[0].split(':')[1].split(';')[0];
                                                const ab = new ArrayBuffer(byteString.length);
                                                const ia = new Uint8Array(ab);
                                                for (let i = 0; i < byteString.length; i++) {
                                                    ia[i] = byteString.charCodeAt(i);
                                                }
                                                const blob = new Blob([ab], { type: mimeString });
                                                const url = URL.createObjectURL(blob);
                                                window.open(url, '_blank');
                                            } else {
                                                window.open(resume_url, '_blank');
                                            }
                                        } catch (e) {
                                            console.error("Failed to open resume:", e);
                                            // Fallback: try opening directly
                                            window.open(resume_url, '_blank');
                                        }
                                    }}
                                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all font-black"
                                >
                                    <FileText size={16} />
                                    <span className="text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4">View CV</span>
                                </button>
                            ) : (
                                <p className="text-sm font-bold text-slate-300 italic">Not Uploaded</p>
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
                        <p className="text-lg text-slate-600 font-medium leading-[1.8] relative z-10">
                            {bio || 'No professional summary provided yet.'}
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
                            {skills && skills.length > 0 ? skills.map((skill, idx) => (
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
                            <div className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 relative">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                                    <div>
                                        <p className="text-sm font-black text-slate-900">TechFlow Systems</p>
                                        <div className="flex gap-1 text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <span className="ml-auto text-[10px] font-black text-slate-300 uppercase tracking-widest">Dec 2025</span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                                    "Exceptional attention to detail and a proactive approach to solving complex problems. Highly recommended for any senior role."
                                </p>
                            </div>

                            <div className="p-12 rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">More Reviews Pending Verification</p>
                            </div>
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
                                    <span className="text-xl font-black text-slate-900">{testScores.iq || '--'}</span>
                                </div>
                                <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${(testScores.iq / 160) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* English */}
                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 font-black">English Level</p>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{testScores.english || 'Not Evaluated'}</p>
                            </div>

                            {/* DISC Profile */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">DISC Profile Breakdown</p>
                                {[
                                    { k: 'Dominance', v: testScores.disc.dominance, c: 'bg-red-500' },
                                    { k: 'Influence', v: testScores.disc.influence, c: 'bg-yellow-500' },
                                    { k: 'Steadiness', v: testScores.disc.steadiness, c: 'bg-green-500' },
                                    { k: 'Compliance', v: testScores.disc.compliance, c: 'bg-blue-500' }
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
                                { name: 'LinkedIn', icon: Linkedin, url: linkedin, color: 'text-[#0077b5]' },
                                { name: 'Twitter / X', icon: Twitter, url: twitter, color: 'text-[#1da1f2]' },
                                { name: 'Facebook', icon: Facebook, url: facebook, color: 'text-[#1877f2]' },
                                { name: 'Instagram', icon: Instagram, url: instagram, color: 'text-[#e4405f]' }
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
                </div>
            </div>
        </div>
    );
};

export default SeekerProfile;
