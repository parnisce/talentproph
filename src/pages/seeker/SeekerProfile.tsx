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
    Eye
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
        instagram
    } = useUser();

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
                <div className="h-48 bg-slate-900 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,71,255,0.15),transparent_70%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="px-12 pb-16 relative">
                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col lg:flex-row gap-10 -mt-24 items-start">
                        <div className="relative group shrink-0">
                            <div className="w-48 h-48 rounded-[48px] bg-white p-2 shadow-2xl overflow-hidden ring-4 ring-white">
                                <img
                                    src={userPhoto}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-[40px] bg-slate-50"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center text-white">
                                <ShieldCheck size={18} strokeWidth={3} />
                            </div>
                        </div>

                        <div className="pt-24 lg:pt-28 flex-grow">
                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{userName}</h1>
                                <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10">{experience ? `${experience} Years` : 'Associate'}</span>
                            </div>
                            <p className="text-lg font-bold text-slate-500 mb-8 max-w-2xl">{title || 'Professional Headline Not Set'}</p>

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
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-slate-50">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Salary</p>
                            <p className="text-xl font-black text-slate-900">{salary ? `$${salary}` : 'TBD'} <span className="text-xs text-slate-400 font-bold">/ mo</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                            <p className="text-xl font-black text-slate-900">{experience || '0'} Years <span className="text-xs text-slate-400 font-bold">Total</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</p>
                            <div className="text-xl font-black text-green-500 flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Verified Pro
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                            <div className="text-xl font-black text-primary flex items-center gap-2 text-sm">
                                Full-Time
                            </div>
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
                </div>

                {/* Right Column: Socials & Sidebar */}
                <div className="space-y-12">
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
