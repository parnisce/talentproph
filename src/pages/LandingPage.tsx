import { motion } from 'framer-motion';
import { Zap, Users, Search, ArrowRight, Star, Globe, Shield, Rocket, Quote, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    const talentSearches = [
        ["Virtual Assistant", "Amazon expert", "Facebook Ads Manager", "Copywriter"],
        ["Wordpress Developer", "Sales Representative", "Lead Generation", "QuickBooks"],
        ["SEO", "Marketing Specialist", "Email Marketer", "PPC"],
        ["Graphic Designer", "Shopify Developer", "eBay Virtual Assistant", "Ecommerce"],
        ["Social Media Marketer", "Video Editor", "Customer Service", "Researcher"],
        ["PHP Developer", "Data Entry", "Google Ads Manager", "Accountant"],
        ["Real Estate Virtual Assistant", "Web Developer", "Magento Developer", "iOS Developer"],
        ["Content Writer", "Project Manager", "Web Designer", "Photoshop"],
        ["GoHighLevel"]
    ].flat();

    const testimonials = [
        {
            name: "David Miller",
            role: "CEO, Miller Tech Corp",
            text: "TalentPro transformed our operations. We found a Senior VA who handles everything from scheduling to initial client intake. The quality of talent in the PH is unmatched.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
        },
        {
            name: "Sarah Jenkins",
            role: "E-commerce Founder",
            text: "The AI matching is scary good. I was looking for a very specific Shopify expert and found them in 48 hours. Best hiring investment I've made this year.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        {
            name: "Marc Thompson",
            role: "Marketing Director",
            text: "Building a remote team used to be a nightmare of vetting. TalentPro does the heavy lifting. Our PH team now handles all our social media and lead gen.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-44 pb-20 overflow-hidden bg-deep min-h-[90vh] flex flex-col justify-center">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(0,71,255,0.15),transparent_70%)]" />
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-50" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] opacity-30" />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-blue-200 text-xs font-bold mb-12 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                            Fly Smarter With <span className="text-white ml-1">TalentPro.PH</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-white mb-10 leading-[0.9] tracking-tighter">
                            Save Time & Money <br />
                            On <span className="text-gradient drop-shadow-2xl">Every Hire</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-blue-100/50 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                            Discover the top remote professionals, get AI-powered recommendations, and build your dream team effortlessly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center mb-24">
                            <Link to="/register?role=employer" className="bg-gradient-primary text-white pl-10 pr-6 py-5 rounded-full text-lg font-bold font-outfit shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center gap-6 group">
                                Hiring Now <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform"><ArrowRight size={20} /></div>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Floating Glass Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-7xl mx-auto mt-10 px-4">
                        {/* Left Card: Inventory */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card text-left glow-blue"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h4 className="text-white font-bold text-[13px] uppercase tracking-widest opacity-60 mb-2">Talent Inventory</h4>
                                    <p className="text-white text-[11px] font-bold opacity-40">Last Update: Feb 2026</p>
                                </div>
                                <div className="px-4 py-1.5 bg-primary/20 border border-primary/30 text-primary text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(0,71,255,0.3)]">ACTIVE</div>
                            </div>

                            <div className="flex items-baseline gap-4 mb-10">
                                <span className="text-6xl font-black text-white tracking-tighter">13,200</span>
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-[28px] bg-white/[0.04] border border-white/10 group cursor-pointer hover:bg-white/[0.08] transition-all">
                                <div className="w-12 h-12 rounded-[18px] bg-primary flex items-center justify-center text-white shadow-xl">
                                    <span className="font-black text-xl">+</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Growth Forecast</p>
                                    <p className="text-sm font-bold text-white">+2.4k Monthly</p>
                                </div>
                                <div className="ml-auto bg-white/10 p-2.5 rounded-full group-hover:bg-primary transition-all">
                                    <ArrowRight size={16} className="text-white" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card bg-white/5 rounded-[60px] p-12 text-center shadow-[0_80px_160px_-40px_rgba(0,0,0,0.7)] z-20 xl:scale-110 relative border border-white/10"
                        >
                            <div className="flex flex-col items-center">
                                <h3 className="text-[40px] font-black text-white leading-[0.9] tracking-tighter mb-10">
                                    Scanning <span className="text-primary italic">2,000+</span><br />
                                    <span className="text-white/40">Profiles Live</span>
                                </h3>

                                <div className="flex items-center gap-10 mb-12 text-left">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(0,71,255,0.4)]">
                                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset="36.4" className="text-primary" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-white tracking-tighter">94%</span>
                                        </div>
                                    </div>
                                    <div className="max-w-[150px]">
                                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-1">
                                            <Zap size={14} fill="currentColor" /> Match Score
                                        </div>
                                        <p className="text-sm font-bold text-white/40 leading-none tracking-tight">Accuracy for <br /><span className="text-white text-lg tracking-tighter uppercase font-black">VA EXPERTS</span> 🔥</p>
                                    </div>
                                </div>

                                <div className="w-full relative rounded-[40px] overflow-hidden aspect-video group shadow-inner bg-slate-100">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10">Real-Time Feed</div>
                                    </div>
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                                            <Rocket size={32} className="text-primary fill-primary" />
                                        </div>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Professional Filipino Talent" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                    {/* Scanning Animation Line */}
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(0,71,255,1)] z-20 animate-[scan_3s_linear_infinite]" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card text-left glow-purple"
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-[20px] bg-white/10 flex items-center justify-center shadow-inner">
                                    <Star className="text-white fill-amber-400" size={24} />
                                </div>
                                <div>
                                    <span className="text-white text-[14px] font-black uppercase tracking-[0.2em]">Best Deal Found</span>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Global Market Arbitrage</p>
                                </div>
                            </div>

                            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.2em] mb-4 ml-1">Current Trend: MNL</p>
                            <div className="flex flex-col mb-10">
                                <p className="text-white text-4xl font-black leading-none tracking-tighter mb-2">VA → SCALE</p>
                                <span className="text-[54px] font-black text-primary leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(0,71,255,0.5)]">$5.00<span className="text-xl opacity-40 ml-1">/hr</span></span>
                            </div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-bold italic text-white/60 mb-8">
                                <Shield size={14} className="text-green-400" /> AI-Verified Predicted Savings: 32%
                            </div>

                            <div className="relative pt-8 border-t border-white/10">
                                <div className="flex -space-x-3 items-center">
                                    {[
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
                                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100",
                                        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100",
                                        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100"
                                    ].map((avatar, i) => (
                                        <div key={i} className="w-12 h-12 rounded-2xl border-[3px] border-deep overflow-hidden ring-4 ring-white/5 shadow-2xl">
                                            <img src={avatar} alt="talent" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-xs font-black text-white ring-4 ring-white/5 border-[3px] border-deep shadow-xl">+2k</div>
                                </div>
                                <div className="mt-8 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Verified Elite Pool</p>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="p-3 bg-white/10 rounded-[18px] hover:bg-primary transition-all cursor-pointer shadow-xl border border-white/5"
                                    >
                                        <ArrowRight size={20} className="text-white" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-20">
                        <Rocket size={40} className="text-white/10 mx-auto animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Centered Icon Features Section */}
            <section id="how-it-works" className="py-20 bg-white relative">
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-block px-5 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mb-12">
                        AI Evolution Section
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-20 leading-none tracking-tighter">
                        AI-Powered Features, Hiring <br />
                        Effortless With TalentPro
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureItem icon={<Globe size={32} />} title="Global Sourcing" desc="Find experts from across the Philippines specialized in remote ops." />
                        <FeatureItem icon={<Search size={32} />} title="Deep Matching" desc="AI scans 200+ skill markers to find your perfect professional match." />
                        <FeatureItem icon={<Shield size={32} />} title="Total Safety" desc="Verified profiles and secure billing ensure peace of mind always." />
                        <FeatureItem icon={<Users size={32} />} title="Team Pulse" desc="Collaborate and manage your team with real-time tracking tools." />
                    </div>
                </div>
            </section>

            {/* Common Talent Searches Section */}
            <section id="searches" className="py-20 bg-white border-t border-slate-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">Common Talent Searches</h2>
                    <div className="w-24 h-2 bg-primary mx-auto mb-16 rounded-full shadow-[0_10px_20px_rgba(0,71,255,0.2)]" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 text-left max-w-6xl mx-auto">
                        {talentSearches.map((talent, idx) => (
                            <a key={idx} href="#" className="flex items-center gap-3 text-primary hover:text-primary-deep transition-all font-bold text-lg group">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors" />
                                <span className="group-hover:translate-x-1 transition-transform">{talent}</span>
                            </a>
                        ))}
                    </div>

                    <button className="mt-16 btn-primary py-4 px-12 text-lg inline-flex items-center gap-2">
                        Browse All Categories <LayoutGrid size={20} />
                    </button>
                </div>
            </section>

            {/* What our Employers say Section */}
            <section id="results" className="py-20 bg-bg-main relative">
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-block px-5 py-2.5 rounded-full bg-white border border-slate-100 text-primary text-[11px] font-black uppercase tracking-[0.3em] mb-12 shadow-sm">
                        Client Testimonials
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-20 leading-none tracking-tighter">
                        What our Employers say
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {testimonials.map((t, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="white-card p-12 text-left relative overflow-hidden group"
                            >
                                <Quote className="absolute -top-4 -right-4 text-primary/5 group-hover:text-primary/10 transition-colors" size={120} />
                                <div className="flex items-center gap-5 mb-10 relative z-10">
                                    <div className="relative">
                                        <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-[24px] object-cover shadow-2xl ring-4 ring-white" />
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-4 border-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">{t.name}</h4>
                                        <p className="text-[11px] font-black text-primary uppercase tracking-widest mt-2">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 font-bold text-[15px] leading-relaxed italic relative z-10 block indent-4 before:content-['“'] before:text-4xl before:text-primary/20 before:absolute before:-left-1 before:-top-4">
                                    {t.text}
                                </p>
                                <div className="flex gap-1.5 mt-10 p-4 bg-slate-50 rounded-2xl w-fit">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-deep text-white/20 border-t border-white/5">
                <div className="container mx-auto px-6 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-10 group">
                        <div className="bg-gradient-primary p-2.5 rounded-xl shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                            <Zap className="text-white fill-white" size={32} />
                        </div>
                        <span className="text-4xl font-black font-outfit tracking-tighter text-white">TalentPro <span className="text-gradient">PH</span></span>
                    </div>
                    <p className="max-w-md text-sm font-bold mb-12 leading-relaxed text-white opacity-80">
                        Empowering businesses worldwide by connecting them with the top-tier 5% elite remote talent from the Philippines.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 font-black text-[11px] uppercase tracking-[0.4em] text-white/50 mb-12">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Safety</a>
                        <a href="#" className="hover:text-primary transition-colors">Legal</a>
                        <a href="#" className="hover:text-primary transition-colors">Cookies</a>
                    </div>
                    <p className="text-[10px] font-black tracking-widest uppercase text-white opacity-40">© 2026 TalentPro Global. Made with excellence.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureItem = ({ icon, title, desc }: any) => (
    <div className="white-card group hover:shadow-primary/20 flex flex-col items-center text-center p-12 hover:ring-2 hover:ring-primary/5">
        <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-400 mb-10 border border-slate-100 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_20px_40px_rgba(84,96,244,0.4)] transition-all duration-700 hover:rotate-6 scale-110 relative overflow-hidden">
            {/* Inner Decor */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            {icon}
        </div>
        <h3 className="text-2xl font-black mb-5 tracking-tighter text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-slate-500 text-[14px] font-bold leading-relaxed opacity-80">{desc}</p>
    </div>
);

export default LandingPage;
