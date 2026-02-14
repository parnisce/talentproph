import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    Calendar,
    Settings,
    LogOut,
    Bell,
    Search,
    User,
    Users,
    HelpCircle,
    UserCheck,
    ChevronDown,
    FileText,
    Heart,
    Wallet,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
    <Link
        to={href}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight ${active ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'}`}
    >
        <div className={`p-1.5 rounded-lg ${active ? 'bg-white/20' : 'bg-transparent'}`}>
            <Icon size={18} />
        </div>
        <span>{label}</span>
    </Link>
);

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'seeker' | 'employer' | 'admin';
    userName?: string;
    userPhoto?: string;
}

const DashboardLayout = ({ children, role, userName: propUserName, userPhoto: propUserPhoto }: DashboardLayoutProps) => {
    const { userName: contextUserName, userPhoto: contextUserPhoto, logout } = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    const userName = propUserName || contextUserName;
    const userPhoto = propUserPhoto || contextUserPhoto;

    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = {
        seeker: [
            { icon: LayoutDashboard, label: 'Overview', href: '/seeker' },
            { icon: Briefcase, label: 'Find Jobs', href: '/seeker/jobs' },
            { icon: MessageSquare, label: 'Messages', href: '/seeker/messages' },
            { icon: Calendar, label: 'Interviews', href: '/seeker/calendar' },
            { icon: User, label: 'My Profile', href: '/seeker/profile' },
        ],
        employer: [
            { icon: LayoutDashboard, label: 'Overview', href: '/employer' },
            { icon: Briefcase, label: 'My Job Posts', href: '/employer/posts' },
            { icon: Users, label: 'All Applicants', href: '/employer/applicants/all' },
            { icon: MessageSquare, label: 'Messages', href: '/employer/messages' },
            { icon: Calendar, label: 'Schedule', href: '/employer/calendar' },
            { icon: UserCheck, label: 'Hired Team', href: '/employer/hired' },
            { icon: Settings, label: 'Settings', href: '/employer/settings' },
        ],
        admin: [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
            { icon: MessageSquare, label: 'Support Tickets', href: '/admin/support' },
            { icon: Bell, label: 'Payments', href: '/admin/payments' },
            { icon: Settings, label: 'Admin Settings', href: '/admin/settings' },
        ]
    };

    const navItems = menuItems[role] || [];

    return (
        <div className="min-h-screen bg-bg-main flex font-inter">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-100 p-8 flex flex-col fixed h-full z-40">
                <div className="flex items-center gap-3 mb-14 px-2">
                    <div className="bg-slate-900 p-2.5 rounded-xl shadow-xl shadow-slate-900/10 border border-white/5 flex items-center justify-center">
                        <Briefcase className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black font-outfit tracking-tighter text-slate-900">TalentPro <span className="text-primary font-black uppercase">PH</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 ml-5">Main Dashboard</p>
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            active={location.pathname === item.href}
                        />
                    ))}
                </nav>

                <div className="pt-8 border-t border-slate-50 flex flex-col gap-2">
                    <Link to="/help" className="flex items-center gap-3 px-5 py-3 rounded-2xl text-slate-500 hover:bg-primary/5 hover:text-primary transition-all text-[13px] font-bold tracking-tight">
                        <HelpCircle size={18} /> Help Center
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-5 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all text-[13px] font-bold tracking-tight"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-80">
                {/* Header */}
                <header className="sticky top-0 z-30 px-12 py-8 bg-bg-main/80 backdrop-blur-xl flex justify-between items-center border-b border-slate-100/50">
                    <div>
                        <h2 className="text-3xl font-black font-outfit tracking-tighter text-slate-900">Dashboard</h2>
                        <div className="flex items-center gap-2.5 mt-1.5">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-100 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">TalentPro</span>
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{role}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-[20px] focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none w-96 text-[13px] font-bold transition-all shadow-inner"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/${role}/messages`)}
                                className="p-2 text-slate-400 hover:text-primary transition-colors relative"
                            >
                                <MessageSquare size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                            </button>

                            <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>

                            <div
                                className="relative py-2"
                                onMouseEnter={() => setShowAccountMenu(true)}
                                onMouseLeave={() => setShowAccountMenu(false)}
                            >
                                <div
                                    onClick={() => navigate(role === 'seeker' ? '/seeker/profile' : `/${role}/account`)}
                                    className="flex items-center gap-3 pl-4 border-l border-slate-100 cursor-pointer group"
                                >
                                    <div className="text-right hidden md:block">
                                        <div className="flex items-center gap-1">
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{userName}</p>
                                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showAccountMenu ? 'rotate-180 text-primary' : ''}`} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{role}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden ring-2 ring-white shadow-lg group-hover:scale-105 transition-transform">
                                        <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                {/* Hover Sub-menu */}
                                <AnimatePresence>
                                    {showAccountMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 p-2"
                                        >
                                            <div className="p-4 mb-2 border-b border-slate-50">
                                                <p className="text-[15px] font-black text-slate-900 truncate leading-tight">{userName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{role === 'seeker' ? 'Job Seeker' : 'Employer'}</p>
                                            </div>

                                            <div className="space-y-1">
                                                {role === 'seeker' ? (
                                                    <>
                                                        <Link to="/seeker/profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <User size={18} className="text-slate-400" /> My Profile
                                                        </Link>
                                                        <Link to="/seeker/messages" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <FileText size={18} className="text-slate-400" /> Job Applications
                                                        </Link>
                                                        <Link to="/seeker/saved-jobs" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <Heart size={18} className="text-slate-400" /> Saved Jobs
                                                        </Link>
                                                        <Link to="/seeker/account" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <Settings size={18} className="text-slate-400" /> Account Settings
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="p-4 mb-2 border-b border-slate-50 flex items-center justify-between">
                                                            <p className="text-[14px] font-black text-slate-900">Employer</p>
                                                            <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded-lg uppercase tracking-widest">Pro</span>
                                                        </div>
                                                        <Link to="/help" className="flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <HelpCircle size={18} className="text-blue-500" /> Need Help Hiring?
                                                        </Link>
                                                        <Link to="/employer/posts" className="flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <FileText size={18} className="text-slate-400" /> Job Posts
                                                        </Link>
                                                        <Link to="/employer/referral" className="flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <Heart size={18} className="text-slate-400" /> Referral Program
                                                        </Link>
                                                        <Link to="/employer/account?tab=billing" className="flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <Wallet size={18} className="text-slate-400" /> Billing
                                                        </Link>
                                                        <Link to="/employer/upgrade" className="flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <RefreshCw size={18} className="text-slate-400" /> Update Plan/Features
                                                        </Link>
                                                        <Link to="/employer/account" className="flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all decoration-transparent">
                                                            <Settings size={18} className="text-slate-400" /> Account Settings
                                                        </Link>
                                                    </>
                                                )}

                                                <div className="pt-1 mt-1 border-t border-slate-50">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-rose-500 hover:bg-rose-50 transition-all"
                                                    >
                                                        <LogOut size={18} /> Log out
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-12 max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
