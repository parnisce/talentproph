import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, ArrowRight, Clock, User, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar';

const categories = [
    "All Topics",
    "Getting Started",
    "General",
    "Recruiting",
    "Hiring",
    "Managing",
    "Ebooks",
    "Case Studies",
    "Tips and Tricks"
];

const blogPosts = [
    {
        id: 1,
        title: "The Ultimate Guide to Hiring Your First Filipino Virtual Assistant",
        excerpt: "Learn the step-by-step process of finding, vetting, and onboarding elite talent from the Philippines to scale your business operations.",
        category: "Getting Started",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
        author: "James Wilson",
        date: "Feb 10, 2026",
        readTime: "12 min read",
        featured: true
    },
    {
        id: 2,
        title: "How to Build a High-Performance Remote Engineering Team",
        excerpt: "Common pitfalls and best practices for managing developers across different time zones without losing productivity.",
        category: "Managing",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
        author: "Sarah Chen",
        date: "Feb 08, 2026",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "Top 10 Recruiting Hacks for 2026",
        excerpt: "Discover the latest AI tools and social sourcing strategies that the top 1% of recruiters are using to find hidden gems.",
        category: "Recruiting",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800",
        author: "Marcus Thorne",
        date: "Feb 05, 2026",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Mastering the Interview: Questions That Reveal True Potential",
        excerpt: "Stop asking generic questions. Use these behavioral-based prompts to identify candidates who actually deliver results.",
        category: "Hiring",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
        author: "Elena Rodriguez",
        date: "Jan 28, 2026",
        readTime: "10 min read"
    },
    {
        id: 5,
        title: "Case Study: Scaling to $10M ARR with a 100% PH Team",
        excerpt: "An inside look at how TechFlow optimized their operations by leveraging the unique strengths of the Filipino workforce.",
        category: "Case Studies",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        author: "David Miller",
        date: "Jan 25, 2026",
        readTime: "15 min read"
    },
    {
        id: 6,
        title: "2026 Remote Work Salary Report: PH Edition",
        excerpt: "Download our comprehensive guide to current market rates for VAs, Developers, and Creative professionals in the Philippines.",
        category: "Ebooks",
        image: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800",
        author: "TalentPro Insights",
        date: "Jan 20, 2026",
        readTime: "Download PDF"
    },
    {
        id: 7,
        title: "Culture Shock: Navigating the '13th Month' and PH Holidays",
        excerpt: "Understand the cultural nuances of working with Filipino teams to build stronger, more loyal long-term relationships.",
        category: "General",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800",
        author: "Maria Santos",
        date: "Jan 18, 2026",
        readTime: "7 min read"
    },
    {
        id: 8,
        title: "5 Tips for Effective Async Communication",
        excerpt: "How to keep your projects moving while you sleep through clear documentation and structured feedback loops.",
        category: "Tips and Tricks",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
        author: "Kevin Park",
        date: "Jan 15, 2026",
        readTime: "5 min read"
    }
];

const LearnToOutsource = () => {
    const [activeTab, setActiveTab] = useState("All Topics");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = blogPosts.filter(post => {
        const matchesTab = activeTab === "All Topics" || post.category === activeTab;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const featuredPost = blogPosts.find(p => p.featured);

    return (
        <div className="min-h-screen bg-bg-main font-inter pb-20">
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
                    <div className="max-w-4xl text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md"
                        >
                            <Sparkles size={14} className="text-primary" />
                            <span>Knowledge Hub</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
                        >
                            Master the Art of <br /><span className="text-gradient italic">Outsourcing</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-blue-100/50 font-medium max-w-2xl leading-relaxed mb-16"
                        >
                            Expert guides, case studies, and practical tips to help you build, manage, and scale your dream remote team in the Philippines.
                        </motion.p>

                        <div className="relative max-w-2xl group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder="Search for guides, case studies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-7 pl-20 pr-48 text-white focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-xl font-bold tracking-tight placeholder:text-white/20 backdrop-blur-sm"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 px-10 py-5 bg-gradient-primary text-white font-black rounded-full uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-primary/20 transition-all">
                                Search Hub
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Post (Only show on 'All Topics' or 'Getting Started') */}
            {(activeTab === "All Topics" && !searchQuery) && featuredPost && (
                <section className="container mx-auto px-6 -mt-16 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col lg:flex-row bg-white rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100"
                    >
                        <div className="lg:w-1/2 relative h-96 lg:h-auto">
                            <img src={featuredPost.image} alt={featuredPost.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute top-8 left-8">
                                <div className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                    Featured Guide
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                                <span>{featuredPost.category}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span>{featuredPost.readTime}</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                                {featuredPost.title}
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium opacity-80">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-6 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <User size={18} className="text-slate-400" />
                                    </div>
                                    <span className="text-slate-900 font-bold text-sm tracking-tight">{featuredPost.author}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold tracking-tight">
                                    <Clock size={16} /> {featuredPost.date}
                                </div>
                            </div>
                            <button className="btn-primary py-4 px-10 self-start group">
                                Read Full Guide <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Filter Tabs */}
            <section className="container mx-auto px-6 py-12">
                <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-8 overflow-x-auto scroller-hidden">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 py-3 rounded-full font-black text-[13px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${activeTab === cat ? 'bg-primary text-white shadow-xl shadow-primary/30 translate-y-[-2px]' : 'bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-slate-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Blog Grid */}
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode='popLayout'>
                        {filteredPosts.map((post) => (
                            <motion.div
                                layout
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="white-card group flex flex-col h-full bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 overflow-hidden"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                                        <span>{post.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-snug hover:text-primary transition-colors cursor-pointer">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <User size={14} className="text-slate-400" />
                                            </div>
                                            <span className="text-slate-600 font-bold text-xs tracking-tight">{post.author}</span>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No guides found</h3>
                        <p className="text-slate-400 font-medium">Try adjusting your search or category filters.</p>
                    </div>
                )}
            </section>

            {/* Newsletter / CTA */}
            <section className="container mx-auto px-6 mt-20">
                <div className="bg-slate-900 rounded-[56px] p-12 md:p-20 relative overflow-hidden text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="absolute inset-0 bg-primary/5 opacity-50" />
                    <div className="relative z-10 max-w-xl">
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">Become an Outsourcing <span className="text-primary italic">Expert</span></h3>
                        <p className="text-white/40 text-lg font-medium leading-relaxed">
                            Join 5,000+ founders and hiring managers receiving weekly deep dives into operational scaling and global talent management.
                        </p>
                    </div>
                    <div className="relative z-10 w-full max-w-md">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your work email"
                                className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium"
                            />
                            <button className="btn-primary py-5 px-10 whitespace-nowrap">
                                Subscribe <ArrowRight size={20} />
                            </button>
                        </div>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-4 text-center sm:text-left">
                            No spam. Only high-impact growth strategy.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LearnToOutsource;
