import { motion } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Globe,
    MapPin,
    Mail,
    Briefcase,
    GraduationCap,
    Instagram,
    Twitter,
    Linkedin,
    Facebook,
    FileText,
    Download,
    Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const SeekerProfile = () => {
    const { userPhoto, userName, title, location, website, email, bio } = useUser();

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
                                <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10">Senior Associate</span>
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
                            <p className="text-xl font-black text-slate-900">$1,800 <span className="text-xs text-slate-400 font-bold">/ mo</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                            <p className="text-xl font-black text-slate-900">8 Years <span className="text-xs text-slate-400 font-bold">Total</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</p>
                            <p className="text-xl font-black text-slate-900">Bachelor's <span className="text-xs text-slate-400 font-bold">Degree</span></p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                            <div className="text-xl font-black text-green-500 flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Immediate
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

                    {/* Experience Timeline */}
                    <section className="bg-white p-12 rounded-[48px] border-2 border-slate-100 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                            <Briefcase size={16} className="text-primary" /> Work History
                        </h3>
                        <div className="space-y-12 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-50" />

                            {[
                                {
                                    role: 'Senior Web Developer & UI Generalist',
                                    company: 'Woken Jobs',
                                    period: '2022 - Present',
                                    description: 'Leading the technical development and design strategy for high-traffic recruitment platforms. Implemented advanced WordPress workflows and custom React components.'
                                },
                                {
                                    role: 'Strategic Virtual Assistant',
                                    company: 'Stellar Outsourcing',
                                    period: '2019 - 2022',
                                    description: 'Managed executive-level calendars and business processes for US-based startups. Streamlined communication and project management using Notion and Google Workspace.'
                                },
                                {
                                    role: 'Junior UI Designer',
                                    company: 'Bright Horizon Marketing',
                                    period: '2016 - 2019',
                                    description: 'Collaborated with marketing teams to create brand-focused visual identities and social media content for over 50+ global clients.'
                                }
                            ].map((job, idx) => (
                                <div key={idx} className="relative pl-16 group">
                                    <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-100 group-hover:border-primary group-hover:scale-125 transition-all z-10" />
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight">{job.role}</h4>
                                            <span className="px-4 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.period}</span>
                                        </div>
                                        <p className="text-sm font-black text-primary uppercase tracking-widest">{job.company}</p>
                                        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{job.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Skills & Sidebar */}
                <div className="space-y-12">
                    {/* Skills Palette */}
                    <section className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-50" />
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8 relative z-10">Skill Proficiency</h3>
                        <div className="space-y-8 relative z-10">
                            {[
                                { name: 'WordPress Ecosystem', level: '95%' },
                                { name: 'UI Design (Figma)', level: '90%' },
                                { name: 'After Effects & Motion', level: '85%' },
                                { name: 'Backend Integration', level: '75%' },
                                { name: 'Virtual Assistance', level: '98%' }
                            ].map(skill => (
                                <div key={skill.name} className="space-y-3">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                        <span>{skill.name}</span>
                                        <span className="text-primary">{skill.level}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: skill.level }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-primary rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education Card */}
                    <section className="bg-white p-10 rounded-[48px] border-2 border-slate-100 shadow-sm group">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <GraduationCap size={16} className="text-primary" /> Education
                        </h3>
                        <div className="space-y-8">
                            <div className="relative pl-4 border-l-2 border-slate-50 group-hover:border-primary transition-colors">
                                <h4 className="text-sm font-black text-slate-900 tracking-tight mb-1">Bachelor of Science in Information Technology</h4>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Systems Management University</p>
                                <p className="text-[10px] font-bold text-slate-400">Class of 2016 • Magna Cum Laude</p>
                            </div>
                        </div>
                    </section>

                    {/* Resume / Documents */}
                    <section className="bg-white p-10 rounded-[48px] border-2 border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Attachments</h3>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2.5 rounded-xl text-primary shadow-sm">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900">Professional_CV_2026.pdf</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Updated Feb 2026 • 2.4 MB</p>
                                    </div>
                                </div>
                                <Download size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </section>

                    {/* Social Footprint */}
                    <section className="flex justify-center gap-6">
                        {[
                            { Icon: Linkedin, href: '#' },
                            { Icon: Twitter, href: '#' },
                            { Icon: Facebook, href: '#' },
                            { Icon: Instagram, href: '#' }
                        ].map((social, idx) => (
                            <a key={idx} href={social.href} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:scale-110 shadow-sm transition-all">
                                <social.Icon size={20} />
                            </a>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SeekerProfile;
