import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, ChevronDown, Search, X, Briefcase } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Navbar = ({ forceSolid = false }: { forceSolid?: boolean }) => {
    const navigate = useNavigate();
    const { id, role } = useUser();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isSolid = forceSolid || scrolled;

    const handleTalentSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('search') as string;
        if (query) {
            navigate(`/employer/talent?q=${encodeURIComponent(query)}`);
            setIsMobileSearchOpen(false);
        }
    };

    const handleWorkSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('search') as string;
        if (query) {
            const searchPath = (id && role === 'seeker') ? '/seeker/jobs' : '/jobs';
            navigate(`${searchPath}?q=${encodeURIComponent(query)}`);
            setIsMobileSearchOpen(false);
        }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${isSolid ? 'bg-white/90 backdrop-blur-xl py-4 border-b border-blue-50' : 'bg-transparent py-8'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div className="bg-slate-900 p-3 rounded-[18px] shadow-2xl shadow-slate-900/10 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center border border-white/5">
                            <Zap className="text-white fill-white" size={24} />
                        </div>
                        <span className={`text-2xl font-black font-outfit tracking-tighter transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}>
                            TalentPro <span className="text-gradient font-black uppercase">PH</span>
                        </span>
                    </Link>

                    {/* Desktop Search Bars */}
                    <div className="flex-grow max-w-2xl mx-12 hidden xl:flex gap-4">
                        {/* Talent Search */}
                        <form onSubmit={handleTalentSearch} className="relative group flex-1">
                            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isSolid ? 'text-slate-400 group-focus-within:text-primary' : 'text-white/40 group-focus-within:text-white'}`} size={16} />
                            <input
                                name="search"
                                type="text"
                                placeholder="Look for talent..."
                                className={`w-full py-3 pl-12 pr-4 rounded-xl text-[12px] font-bold transition-all focus:outline-none focus:ring-4 ${isSolid
                                    ? 'bg-slate-50 border border-slate-100 text-slate-900 focus:bg-white focus:border-primary/20 focus:ring-primary/5'
                                    : 'bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/20 focus:ring-white/5'
                                    }`}
                            />
                        </form>

                        {/* Work Search */}
                        <form onSubmit={handleWorkSearch} className="relative group flex-1">
                            <Briefcase className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isSolid ? 'text-slate-400 group-focus-within:text-primary' : 'text-white/40 group-focus-within:text-white'}`} size={16} />
                            <input
                                name="search"
                                type="text"
                                placeholder="Look for work..."
                                className={`w-full py-3 pl-12 pr-4 rounded-xl text-[12px] font-bold transition-all focus:outline-none focus:ring-4 ${isSolid
                                    ? 'bg-slate-50 border border-slate-100 text-slate-900 focus:bg-white focus:border-primary/20 focus:ring-primary/5'
                                    : 'bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/20 focus:ring-white/5'
                                    }`}
                            />
                        </form>
                    </div>

                    {/* Navigation Links */}
                    <div className={`hidden lg:flex items-center gap-10 font-bold text-[13px] tracking-widest uppercase transition-colors ${isSolid ? 'text-slate-600' : 'text-white/80'}`}>
                        {/* Dropdown Menu */}
                        <div className="relative group py-2">
                            <a href="#how-it-works" className="hover:text-primary transition-colors flex items-center gap-1.5">
                                How It Works <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </a>

                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 overflow-hidden">
                                <div className="py-2">
                                    <Link to="/faq/employers" className="block px-6 py-4 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all normal-case tracking-normal font-bold">
                                        Employers FAQ
                                    </Link>
                                    <Link to="/faq/seekers" className="block px-6 py-4 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all normal-case tracking-normal font-bold">
                                        Job Seeker FAQ
                                    </Link>
                                    <Link to="/learn" className="block px-6 py-4 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all normal-case tracking-normal font-bold">
                                        Learn To Outsource
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                        <Link to={(id && role === 'seeker') ? "/seeker/jobs" : "/jobs"} className="hover:text-primary transition-colors hover:scale-105 active:scale-95 transition-all">FIND Jobs</Link>

                        <div className="h-6 w-px bg-current opacity-20 mx-2" />

                        <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
                        <Link to="/register" className="btn-primary px-8 py-3.5 rounded-full !shadow-2xl !shadow-primary/40">
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <button
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            className={`p-3 rounded-xl transition-colors ${isSolid ? 'text-slate-900 bg-slate-50' : 'text-white bg-white/10'}`}
                        >
                            <Search size={20} />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-3 rounded-xl transition-colors ${isSolid ? 'text-slate-900 bg-slate-50' : 'text-white bg-white/10'}`}
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between">
                                <span className={`w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <span className={`w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`w-full h-0.5 bg-current transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                <div className={`absolute top-full left-0 right-0 p-6 bg-white border-b border-slate-100 transition-all duration-300 lg:hidden space-y-4 ${isMobileSearchOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible'}`}>
                    <form onSubmit={handleTalentSearch} className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            name="search"
                            type="text"
                            placeholder="Look for talent..."
                            className="w-full py-4 pl-14 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-bold focus:outline-none focus:bg-white focus:border-primary/20"
                            autoFocus={isMobileSearchOpen}
                        />
                    </form>
                    <form onSubmit={handleWorkSearch} className="relative">
                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            name="search"
                            type="text"
                            placeholder="Look for work..."
                            className="w-full py-4 pl-14 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-bold focus:outline-none focus:bg-white focus:border-primary/20"
                        />
                    </form>
                </div>
            </nav>

            {/* Mobile Menu Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 bottom-0 right-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-500 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                            <div className="bg-slate-900 p-2.5 rounded-xl">
                                <Zap className="text-white fill-white" size={20} />
                            </div>
                            <span className="text-xl font-black font-outfit tracking-tighter text-slate-900">
                                TalentPro <span className="text-gradient uppercase">PH</span>
                            </span>
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 text-sm font-black uppercase tracking-widest text-slate-900">
                        <Link to="/faq/employers" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Employers FAQ</Link>
                        <Link to="/faq/seekers" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Job Seeker FAQ</Link>
                        <Link to="/learn" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Learn To Outsource</Link>
                        <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Pricing</Link>
                        <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors text-primary">FIND Jobs</Link>
                    </div>

                    <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-4">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-sm font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-colors">Login</Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full py-4 rounded-2xl text-center text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
