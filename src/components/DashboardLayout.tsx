import React from 'react';
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
    HelpCircle
} from 'lucide-react';
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
            { icon: MessageSquare, label: 'Messages', href: '/employer/messages' },
            { icon: Calendar, label: 'Schedule', href: '/employer/calendar' },
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
                                onClick={() => navigate(`/${role}/account`)}
                                className="flex items-center gap-3 pl-4 border-l border-slate-100 cursor-pointer group"
                            >
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{userName}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden ring-2 ring-white shadow-lg group-hover:scale-105 transition-transform">
                                    <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
                                </div>
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
