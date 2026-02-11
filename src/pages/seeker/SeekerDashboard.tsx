import { useRef, useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import {
    Zap,
    ShieldCheck,
    Globe,
    MessageSquare,
    Bookmark,
    Clock,
    Users,
    BookOpen,
    ChevronRight,
    AlertTriangle,
    Camera,
    FileText,
    Upload,
    GraduationCap,
    ExternalLink,
    Eye,
    Calendar,
    Building2,
    MapPin
} from 'lucide-react';
import CalendarView from '../../components/CalendarView';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../services/supabase';
import SeekerMessages from './SeekerMessages';
import CompanyProfile from './CompanyProfile';
import SeekerProfile from './SeekerProfile';
import SeekerEditProfile from './SeekerEditProfile';
import SeekerFindJobs from './SeekerFindJobs';
import JobDetails from './JobDetails';
import SavedJobs from './SavedJobs';

const SeekerOverview = ({ interviews = [], employers = [], savedJobs = [] }: { interviews?: any[], employers?: any[], savedJobs?: any[] }) => {
    const { userPhoto, updateUserProfile, userName, title, website, salary, education, skills, resume_url } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target?.result) {
                    try {
                        await updateUserProfile({ photo: event.target.result as string });
                    } catch (err) {
                        console.error("Failed to update photo:", err);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Safety Alerts Section */}
            <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <AlertTriangle size={120} />
                    </div>
                    <div className="flex gap-6 items-start relative z-10">
                        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-amber-900 font-black text-xs uppercase tracking-widest">Safety Warning: Direct Payments</h3>
                            <p className="text-amber-800/70 text-[13px] font-medium leading-relaxed max-w-4xl">
                                Any job that wants you to use your own money, or handle funds from someone else, purchase items, or create accounts using your name, is a most likely a scam. Notify us immediately if this is requested.
                                <br /><br />
                                DO NOT allow anybody else to use your TalentPro account, create secondary accounts, or use fake links. You will be banned from using our site.
                            </p>
                        </div>
                    </div>
                </div>

                {!resume_url && (
                    <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                                <Zap size={20} />
                            </div>
                            <p className="text-[13px] font-bold text-slate-600">
                                We've added a feature that lets you display your resume. Make sure to <span className="text-primary font-black uppercase text-[11px] tracking-wider cursor-pointer hover:underline">upload yours</span> to help employers find you faster.
                            </p>
                        </div>
                        <Link to="/seeker/profile/edit" className="px-6 py-2.5 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0 decoration-transparent">
                            Upload Resume
                        </Link>
                    </div>
                )}
            </div>

            {/* Main Profile Identity Header */}
            <div className="bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,71,255,0.15),transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row gap-12 items-start lg:items-center">
                    {/* User Photo & Basic Actions */}
                    <div className="flex flex-col items-center gap-6 shrink-0">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[48px] bg-slate-800 p-1 ring-4 ring-white/5 overflow-hidden">
                                <img
                                    src={userPhoto}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-[44px]"
                                />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"
                            >
                                <Camera size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Link to="/seeker/profile/edit" className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5 group decoration-transparent">
                                <FileText size={14} className="text-primary group-hover:scale-110 transition-transform" /> Edit Profile
                            </Link>
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
                                            window.open(resume_url, '_blank');
                                        }
                                    }}
                                    className="w-full py-3 px-6 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-primary/5 group"
                                >
                                    <Eye size={14} className="group-hover:scale-110 transition-transform" /> View CV
                                </button>
                            ) : (
                                <Link to="/seeker/profile/edit" className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5 group decoration-transparent">
                                    <Upload size={14} className="text-secondary group-hover:scale-110 transition-transform" /> Upload CV
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="flex-grow space-y-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{userName}</h1>
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                                    <ShieldCheck size={14} className="text-green-400" />
                                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Verified Pro</span>
                                </div>
                            </div>
                            <p className="text-blue-200/50 font-black text-xs uppercase tracking-[0.3em]">{title || 'Professional Headline Not Set'}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Expected Salary</p>
                                <p className="text-lg font-black text-white">{salary ? `$${salary}` : 'TBD'} <span className="text-sm font-medium text-white/40">/ mo</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Education</p>
                                <p className="text-lg font-black text-white flex items-center gap-2">
                                    <GraduationCap size={18} className="text-primary" /> {education || 'Not Specified'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Portfolio</p>
                                <a href={website || '#'} className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
                                    <Globe size={16} /> {website ? website.replace('https://', '').replace('http://', '') : 'No Portfolio Website'} <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>

                        <div className="pt-8">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Core Skillset Matrix</p>
                            <div className="flex flex-wrap gap-2">
                                {skills && skills.length > 0 ? skills.map(skill => (
                                    <span key={skill} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/70 uppercase tracking-widest hover:border-primary/50 hover:bg-primary/10 transition-all cursor-default">
                                        {skill}
                                    </span>
                                )) : (
                                    <span className="text-[10px] font-bold text-white/30 italic">No skills listed yet</span>
                                )}
                                <button className="px-5 py-2.5 border border-white/5 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest hover:bg-white/5 transition-all">
                                    + Add Skill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Messages Widget */}
                <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                <MessageSquare size={22} />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Unread Messages</h3>
                        </div>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-slate-400 font-bold text-sm tracking-tight italic">You have no unread messages yet.</p>
                    </div>
                </div>

                {/* Bookmarked Jobs Widget */}
                <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary/10 rounded-2xl text-secondary group-hover:scale-110 transition-transform">
                                <Bookmark size={22} />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Bookmark Jobs</h3>
                        </div>
                        <Link to="/seeker/saved-jobs" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-transparent">View All</Link>
                    </div>
                    <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                        {savedJobs.length > 0 ? (
                            savedJobs.slice(0, 3).map((job) => (
                                <Link to={`/seeker/jobs/${job.id}`} key={job.savedId} className="block p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white transition-all group/item decoration-transparent">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-black text-slate-900 truncate pr-4 group-hover/item:text-primary transition-colors">{job.title}</h4>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0">{job.type}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1"><Building2 size={12} /> {job.company}</span>
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-8 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                                    <Bookmark size={28} />
                                </div>
                                <p className="text-slate-400 font-bold text-sm tracking-tight italic">No jobs bookmarked yet.</p>
                                <Link to="/seeker/jobs" className="text-primary font-black uppercase text-[10px] mt-2 block tracking-widest hover:underline decoration-transparent">Start Exploring</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Interviews Widget */}
                <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-50 rounded-2xl text-violet-500 group-hover:scale-110 transition-transform">
                                <Calendar size={22} />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Job Interviews</h3>
                        </div>
                        <Link to="/seeker/calendar" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-transparent">View Calendar</Link>
                    </div>
                    <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                        {interviews.length > 0 ? (
                            interviews.slice(0, 3).map((interview) => (
                                <div key={interview.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-black text-slate-900 truncate pr-4">{interview.title}</h4>
                                        <span className="text-[9px] font-black text-white px-2 py-0.5 bg-primary rounded-full uppercase tracking-tighter shrink-0">{interview.type}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px]">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {interview.time}</span>
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(interview.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                                    <Calendar size={28} />
                                </div>
                                <p className="text-slate-400 font-bold text-sm tracking-tight italic">No interviews scheduled yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Employers Listing Widget */}
                <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                                <Users size={22} />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">My Employers</h3>
                        </div>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View History</button>
                    </div>
                    <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                        {employers.length > 0 ? (
                            employers.map((emp) => (
                                <div key={emp.id} className="p-5 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all flex items-center justify-between group/item">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center font-black text-emerald-500">
                                            {emp.company.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{emp.company}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{emp.role}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-200 group-hover/item:text-primary transition-colors" />
                                </div>
                            ))
                        ) : (
                            <div className="py-8 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                                    <Users size={28} />
                                </div>
                                <p className="text-slate-400 font-bold text-sm tracking-tight italic">No active employers yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tests Taken Widget */}
                <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group md:col-span-2">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={22} />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Assessment Results</h3>
                        </div>
                        <Link to="/seeker/profile/edit" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-transparent">Update Scores</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* IQ Section */}
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group/iq">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">IQ Assessment</p>
                            <div className="text-5xl font-black text-slate-900 tracking-tighter group-hover/iq:scale-110 transition-transform">{useUser().testScores.iq}</div>
                            <div className="mt-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">Exceptional</div>
                        </div>

                        {/* DISC Section */}
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">DISC Personality Profile</p>
                            <div className="space-y-4">
                                {[
                                    { label: 'Dominance', value: useUser().testScores.disc.dominance, color: 'bg-rose-500' },
                                    { label: 'Influence', value: useUser().testScores.disc.influence, color: 'bg-amber-500' },
                                    { label: 'Steadiness', value: useUser().testScores.disc.steadiness, color: 'bg-emerald-500' },
                                    { label: 'Compliance', value: useUser().testScores.disc.compliance, color: 'bg-blue-500' }
                                ].map((item) => (
                                    <div key={item.label} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                            <span className="text-slate-500">{item.label}</span>
                                            <span className="text-slate-900">{item.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.color} rounded-full`}
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* English Section */}
                        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col items-center justify-center text-center relative overflow-hidden group/en">
                            <div className="absolute inset-0 bg-primary/10 opacity-50" />
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 relative z-10">English Proficiency</p>
                            <div className="text-4xl font-black text-primary tracking-tighter relative z-10 group-hover/en:scale-110 transition-transform">
                                {useUser().testScores.english?.split('(')[0] || 'N/A'}
                            </div>
                            <div className="text-[10px] font-bold text-white/60 relative z-10 mt-1">
                                {useUser().testScores.english?.includes('(')
                                    ? useUser().testScores.english.split('(')[1].replace(')', '')
                                    : 'Level Not Set'}
                            </div>
                            <Globe size={48} className="absolute -bottom-4 -right-4 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Educational Section */}
            <div className="bg-slate-900 rounded-[48px] p-12 md:p-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-[2s]">
                    <BookOpen size={200} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-grow space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Premium Education</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter leading-tight max-w-xl">
                            Master the Art of <br /><span className="text-gradient italic">Remote Professionalism</span>
                        </h2>
                        <p className="text-blue-100/40 font-medium text-lg leading-relaxed max-w-xl">
                            Unlock exclusive guides on how to work for foreign clients, secure better rates, and scale your career as a Filipino pro.
                        </p>
                        <button className="px-10 py-4 bg-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                            Access Library
                        </button>
                    </div>
                    <div className="shrink-0">
                        <div className="w-56 h-72 rounded-[40px] bg-white/5 border border-white/10 p-2 transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                            <div className="w-full h-full rounded-[34px] bg-slate-800 overflow-hidden relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60"
                                    alt="Remote course"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 to-transparent">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Featured Guide</p>
                                    <p className="text-white font-bold text-sm leading-tight mt-1">10 Things You Need To Know</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Global Footer CTA */}
            <div className="pt-20 text-center">
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
                    Looking for a <span className="text-primary italic">new challenge?</span>
                </h3>
                <p className="text-slate-400 font-medium text-xl mb-12 max-w-2xl mx-auto">
                    Thousands of high-paying premium employers are looking to hire Filipino talent right now.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="px-12 py-5 bg-primary text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all">
                        Browse Premium Jobs
                    </button>
                    <button className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-[24px] font-black text-sm uppercase tracking-widest hover:border-primary transition-all">
                        Update Resume
                    </button>
                </div>
            </div>
        </div>
    );
};

const SeekerDashboard = () => {
    const { id: seekerId } = useUser();
    const [interviews, setInterviews] = useState<any[]>([]);
    const [employers, setEmployers] = useState<any[]>([]);
    const [savedJobs, setSavedJobs] = useState<any[]>([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!seekerId) return;
            try {
                const { data, error } = await supabase
                    .from('interviews')
                    .select(`
                        id,
                        scheduled_at,
                        location_type,
                        location_details,
                        job_posts (
                            title,
                            company_name
                        )
                    `)
                    .eq('seeker_id', seekerId);

                if (error) throw error;

                if (data) {
                    const formatted = data.map((i: any) => ({
                        id: i.id,
                        title: `${i.job_posts?.title} Interview`,
                        time: new Date(i.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: new Date(i.scheduled_at),
                        location: i.location_details || i.location_type,
                        type: i.location_type.toLowerCase() === 'virtual' ? 'video' :
                            i.location_type.toLowerCase() === 'phone' ? 'phone' : 'onsite'
                    }));
                    setInterviews(formatted);
                }
            } catch (err) {
                console.error("Error fetching interviews:", err);
            }
        };

        const fetchEmployers = async () => {
            if (!seekerId) return;
            try {
                const { data, error } = await supabase
                    .from('job_applications')
                    .select(`
                        id,
                        job_posts (
                            title,
                            company_name
                        )
                    `)
                    .eq('seeker_id', seekerId)
                    .eq('status', 'Hired');

                if (error) throw error;

                if (data) {
                    const mapped = data.map((app: any) => ({
                        id: app.id,
                        company: app.job_posts?.company_name || 'Unknown Company',
                        role: app.job_posts?.title || 'Team Member'
                    }));
                    setEmployers(mapped);
                }
            } catch (err) {
                console.error("Error fetching employers:", err);
            }
        };

        const fetchSavedJobs = async () => {
            if (!seekerId) return;
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
                            engagement
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
                        type: item.job_posts.engagement?.split(' ')[0] || 'Full-Time'
                    }));
                    setSavedJobs(formatted);
                }
            } catch (err) {
                console.error("Error fetching saved jobs:", err);
            }
        };

        fetchInterviews();
        fetchEmployers();
        fetchSavedJobs();
    }, [seekerId]);

    return (
        <DashboardLayout role="seeker">
            <Routes>
                <Route path="/" element={<SeekerOverview interviews={interviews} employers={employers} savedJobs={savedJobs} />} />
                <Route path="/jobs" element={<SeekerFindJobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/profile" element={<SeekerProfile />} />
                <Route path="/profile/edit" element={<SeekerEditProfile />} />
                <Route path="/calendar" element={
                    <CalendarView interviews={interviews} />
                } />
                <Route path="/messages" element={<SeekerMessages />} />
                <Route path="/company/:id" element={<CompanyProfile />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
            </Routes>
        </DashboardLayout>
    );
};

export default SeekerDashboard;
