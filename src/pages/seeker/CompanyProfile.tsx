import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Globe,
    Users,
    Briefcase,
    CheckCircle2,
    ArrowUpRight,
    Star,
    Mail,
    ArrowLeft,
    Twitter,
    Linkedin,
    Facebook,
    Instagram
} from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyProfile = () => {
    const navigate = useNavigate();
    // const { id } = useParams(); // For future API integration

    // Mock Company Data
    const company = {
        name: "TechFlow Solutions",
        industry: "Software & Technology",
        location: "New York, USA",
        website: "techflow.io",
        size: "50-200 Employees",
        founded: "2018",
        description: "TechFlow Solutions is a leading provider of enterprise software solutions, specializing in AI-driven workflow automation. We believe in empowering businesses with tools that simplify complex processes. Our culture is built on innovation, transparency, and a remote-first mindset.",
        logo: "https://ui-avatars.com/api/?name=Tech+Flow&background=0D8ABC&color=fff&size=128",
        banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
        stats: {
            jobsPosted: 12,
            hired: 45,
            rating: 4.8
        },
        perks: [
            "Remote-First Culture",
            "Competitive Salary in USD",
            "Annual Tech Allowance",
            "Health & Wellness Benefits",
            "Flexible Hours"
        ],
        activeJobs: [
            {
                id: 1,
                title: "Senior React Developer",
                type: "Full-Time",
                salary: "$2,500 - $4,000 / mo",
                posted: "2 days ago"
            },
            {
                id: 2,
                title: "UI/UX Designer",
                type: "Contract",
                salary: "$1,800 - $2,500 / mo",
                posted: "5 days ago"
            },
            {
                id: 3,
                title: "Backend Engineer (Node.js)",
                type: "Full-Time",
                salary: "$3,000 - $4,500 / mo",
                posted: "1 week ago"
            }
        ]
    };

    return (
        <div className="pb-20 space-y-8">
            {/* Header / Banner */}
            <div className="relative h-64 md:h-80 rounded-[48px] overflow-hidden group">
                <img
                    src={company.banner}
                    alt="Office"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl hover:bg-white hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            <div className="relative px-6 md:px-12 -mt-24">
                <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/20 flex flex-col lg:flex-row gap-12 items-start">
                    {/* Logo & Basic Info */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 shrink-0">
                        <div className="w-32 h-32 rounded-[32px] bg-slate-50 p-2 border-4 border-white shadow-xl -mt-24 lg:-mt-28 relative z-10">
                            <img src={company.logo} alt={company.name} className="w-full h-full rounded-[24px]" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{company.name}</h1>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-2 text-sm font-bold text-slate-500">
                                    <span className="flex items-center gap-1.5"><Building2 size={16} className="text-primary" /> {company.industry}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-secondary" /> {company.location}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-center lg:justify-start">
                                <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                    <Globe size={14} /> Website
                                </a>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
                                    <Mail size={14} /> Contact
                                </button>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 text-slate-300">
                            {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 hover:bg-slate-50 hover:text-primary rounded-xl transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Stats & Description */}
                    <div className="flex-1 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Size</p>
                                <p className="font-black text-slate-900">{company.size}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Founded</p>
                                <p className="font-black text-slate-900">{company.founded}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hires Made</p>
                                <p className="font-black text-slate-900">{company.stats.hired}</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Rating</p>
                                <div className="flex items-center justify-center gap-1 font-black text-amber-600">
                                    {company.stats.rating} <Star size={14} fill="currentColor" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">About Us</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                {company.description}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Why Join Us?</h3>
                            <div className="flex flex-wrap gap-3">
                                {company.perks.map((perk, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-full bg-white text-xs font-bold text-slate-600">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        {perk}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Job Openings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Open Positions</h2>
                        <a href="#" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All Jobs</a>
                    </div>

                    <div className="grid gap-4">
                        {company.activeJobs.map(job => (
                            <motion.div
                                key={job.id}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white border-2 border-slate-50 p-6 rounded-[24px] flex items-center justify-between group hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-500">{job.type}</span>
                                            <span>{job.salary}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span>{job.posted}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary transition-all">
                                    <ArrowUpRight size={20} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[32px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Users size={120} />
                        </div>
                        <h3 className="text-xl font-black mb-1 relative z-10">We are growing!</h3>
                        <p className="text-white/60 text-sm font-medium mb-6 relative z-10">Check out our latest openings and join the team.</p>
                        <button className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all relative z-10">
                            Follow Company
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
