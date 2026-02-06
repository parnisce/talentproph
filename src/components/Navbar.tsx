import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronDown } from 'lucide-react';

const Navbar = ({ forceSolid = false }: { forceSolid?: boolean }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isSolid = forceSolid || scrolled;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isSolid ? 'bg-white/90 backdrop-blur-xl py-4 border-b border-blue-50' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-slate-900 p-3 rounded-[18px] shadow-2xl shadow-slate-900/10 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center border border-white/5">
                        <Zap className="text-white fill-white" size={24} />
                    </div>
                    <span className={`text-2xl font-black font-outfit tracking-tighter transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}>
                        TalentPro <span className="text-gradient font-black uppercase">PH</span>
                    </span>
                </Link>

                <div className={`hidden lg:flex items-center gap-10 font-bold text-[13px] tracking-widest uppercase transition-colors ${isSolid ? 'text-slate-600' : 'text-white/80'}`}>
                    {/* Dropdown Menu */}
                    <div className="relative group py-2">
                        <a href="#how-it-works" className="hover:text-primary transition-colors flex items-center gap-1.5">
                            How It Works <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                        </a>

                        {/* Submenu */}
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
                    <Link to="/register?role=employer" className="hover:text-primary transition-colors">POST A JOB</Link>
                    <Link to="/jobs" className="hover:text-primary transition-colors">FIND Jobs</Link>

                    <div className="h-6 w-px bg-current opacity-20 mx-2" />

                    <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
                    <Link to="/register" className="btn-primary px-8 py-3.5 rounded-full !shadow-2xl !shadow-primary/40">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
