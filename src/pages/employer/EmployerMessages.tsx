import { useState } from 'react';
import {
    Search,
    Star,
    Paperclip,
    ChevronDown,
    Mail,
    Inbox,
    Pin,
    Send,
    Archive,
    Briefcase,
    Plus,
    Tag
} from 'lucide-react';
import EmployerConversation from './EmployerConversation';

const EmployerMessages = () => {
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState<any>(null); // State for selected message conversation

    // Mock data based on the screenshot provided by user
    const messages = [
        {
            id: '1',
            sender: 'Jayme Francis Ramos',
            count: 5,
            subject: 'Interview Invitation - Frontend Developer',
            preview: 'active now',
            role: 'Best Frontend Dev Candidate',
            date: 'Feb 4, 2026, 09:20 AM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jayme&backgroundColor=ffd5dc',
            pinned: true,
            selected: false,
            read: false,
            type: 'received',
            archived: false
        },
        {
            id: '2',
            sender: 'Eunil Carl Laxina Dela Cruz',
            count: 2,
            subject: 'Interview Invitation - Frontend Developer & AI Integrator',
            preview: 'Are you available for a quick call?',
            role: '',
            date: 'Feb 4, 2026, 12:32 AM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eunil&backgroundColor=b6e3f4',
            pinned: true,
            selected: false,
            read: false,
            type: 'received',
            archived: false
        },
        {
            id: '3',
            sender: 'Raymart Navarro Leyson',
            count: 5,
            subject: 'Application: Frontend Developer (UI/UX & API Integration)',
            preview: 'Here is my portfolio link...',
            role: 'Best Frontend Dev Candidate',
            ap: '15 AP',
            date: 'Feb 3, 2026, 09:03 PM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raymart',
            pinned: false,
            selected: false,
            read: true,
            attachment: true,
            type: 'received',
            archived: false
        },
        {
            id: '4',
            sender: 'Victor Valdez Higoy Jr',
            count: 5,
            subject: 'Interview Invitation - Frontend Developer & AI Integrator',
            preview: 'Thank you for the opportunity.',
            role: '',
            date: 'Feb 3, 2026, 08:00 PM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victor&backgroundColor=c0aede',
            pinned: false,
            selected: false,
            read: true,
            attachment: true,
            type: 'received',
            archived: true // Example archived
        },
        // ... (preserving other existing items with defaults)
        {
            id: '5',
            sender: 'Angel Sheinen Onde Cambarijan',
            count: 4,
            subject: 'Frontend Developer Application',
            preview: 'I have experience with React and Tailwind.',
            role: 'Best Frontend Dev Candidate',
            ap: '5 AP',
            date: 'Feb 3, 2026, 10:24 PM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Angel&backgroundColor=ffdfbf',
            pinned: false,
            selected: false,
            read: true,
            attachment: true,
            type: 'received',
            archived: false
        },
        {
            id: '6',
            sender: 'Eubie Acallar Aluad',
            count: 0,
            subject: 'Application for Software/Web Developer Position',
            preview: 'Please find my resume attached.',
            role: '',
            ap: '10 AP',
            date: 'Feb 3, 2026, 12:02 AM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eubie',
            pinned: false,
            selected: false,
            read: true,
            attachment: true,
            type: 'received',
            archived: false
        },
        {
            id: '7',
            sender: 'Shain Earl Esmajer',
            count: 0,
            subject: 'Front-end developer',
            preview: 'Hi, I am interested in the position.',
            role: '',
            ap: '10 AP',
            date: 'Feb 2, 2026, 12:41 AM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shain&backgroundColor=d1d4f9',
            pinned: false,
            selected: false,
            read: true,
            attachment: true,
            type: 'received',
            archived: false
        },
        {
            id: '8',
            sender: 'Ervin Vince Dimailig Piol',
            count: 0,
            subject: 'Frontend Developer with UI/UX & API Integration Expertise',
            preview: 'Checking on the status of my application.',
            role: '',
            ap: '4 AP',
            date: 'Jan 30, 2026, 10:57 AM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ervin',
            pinned: false,
            selected: false,
            read: true,
            attachment: true,
            type: 'received',
            archived: false
        },
        {
            id: '9',
            sender: 'Mariane Rosario Dela Peña Historia',
            count: 0,
            subject: 'Hello there! YOUR SEARCH IS OVER!',
            preview: 'I can start immediately.',
            role: '',
            ap: '3 AP',
            date: 'Jan 29, 2026, 04:58 PM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariane&backgroundColor=ffdfbf',
            pinned: false,
            selected: false,
            read: true,
            attachment: true,
            type: 'received',
            archived: false
        },
        {
            id: '10',
            sender: 'Bryner S. Bodollo',
            count: 0,
            subject: 'Applying for Frontend Developer position',
            preview: 'Highly skilled in ReactJS.',
            role: '',
            ap: '5 AP',
            date: 'Jan 29, 2026, 04:30 PM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bryner',
            pinned: false,
            selected: false,
            read: true,
            attachment: true,
            type: 'received',
            archived: false
        },
        // Mock Sent Message
        {
            id: '11',
            sender: 'You',
            count: 0,
            subject: 'Invitation to Apply: Senior React Dev',
            preview: 'Hi, we saw your profile and...',
            role: '',
            date: 'Feb 5, 2026, 11:00 AM',
            avatar: 'https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff',
            pinned: false,
            selected: false,
            read: true,
            attachment: false,
            type: 'sent',
            archived: false
        }
    ];

    // Filter Logic
    const filteredMessages = messages.filter(msg => {
        if (selectedTab === 'inbox') return msg.type === 'received' && !msg.archived;
        if (selectedTab === 'unread') return !msg.read && !msg.archived;
        if (selectedTab === 'pinned') return msg.pinned && !msg.archived;
        if (selectedTab === 'sent') return msg.type === 'sent' && !msg.archived;
        if (selectedTab === 'archive') return msg.archived;
        if (selectedTab === 'job_posts') return false; // Placeholder
        return true;
    });

    const sidebarItems = [
        { id: 'messages', icon: Inbox, label: 'Messages' },
        { id: 'unread', icon: Mail, label: 'Unread', badge: 2 },
        { id: 'pinned', icon: Pin, label: 'Pinned' },
        { id: 'sent', icon: Send, label: 'Sent' },
        { id: 'job_posts', icon: Briefcase, label: 'Job Posts' },
        { id: 'archive', icon: Archive, label: 'Archive' },
        { id: 'search', icon: Search, label: 'Search' },
    ];

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 -mt-4">
            {/* Sidebar */}
            <div className="w-64 flex flex-col gap-8 shrink-0">
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setSelectedTab(item.id);
                                setSelectedMessage(null); // Clear selection when changing tabs
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedTab === item.id
                                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-100'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={selectedTab === item.id ? 'text-primary' : 'text-slate-400'} />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        <span>Labels</span>
                        <button className="hover:text-primary"><Plus size={14} /></button>
                    </div>
                    {[
                        { label: 'Best Backend Dev Candidate', color: 'bg-indigo-500' },
                        { label: 'Best Frontend Dev Candidate', color: 'bg-emerald-500' }
                    ].map((tag, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors">
                            <Tag size={14} className={tag.color.replace('bg-', 'text-')} fill="currentColor" />
                            <span className="truncate">{tag.label}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 px-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Filter Applicant Ratings</p>
                    <div className="flex gap-1 text-slate-300">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={20} className="hover:text-amber-400 cursor-pointer transition-colors" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm flex flex-col overflow-hidden">
                {selectedMessage ? (
                    <EmployerConversation message={selectedMessage} onBack={() => setSelectedMessage(null)} />
                ) : (
                    <>
                        {/* Message Header */}
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                            <button className="flex items-center gap-2 text-slate-900 font-extrabold text-lg hover:text-primary transition-colors">
                                {selectedTab === 'inbox' ? 'Frontend Developer with UI/UX & API Integration Expertise' : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
                                <ChevronDown size={20} className="text-slate-400" />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400">Message</span>
                                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 rounded-md">{filteredMessages.length}</span>
                                <button className="ml-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">
                                    Post a Job
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/30">
                            <div className="relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search Inbox"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                            </div>
                        </div>

                        {/* Message List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                                    <Inbox size={48} className="opacity-20" />
                                    <p className="font-bold text-sm">No messages found in {selectedTab}</p>
                                </div>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`group flex items-center gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer ${!msg.read ? 'bg-slate-50/50' : ''}`}
                                    >
                                        {/* Checkbox & Pin */}
                                        <div className="flex flex-col items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer" />
                                            <Star
                                                size={16}
                                                className={`cursor-pointer transition-colors ${msg.pinned ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-400'}`}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 grid grid-cols-[auto_1fr] gap-x-4 items-center">
                                            {/* Avatar */}
                                            <div className="relative">
                                                <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-full bg-slate-100 object-cover ring-2 ring-white shadow-sm" />
                                                {msg.count > 0 && (
                                                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                                                        {msg.count}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0">
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <h4 className={`text-sm truncate ${!msg.read ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                                        {msg.sender}
                                                        {msg.count > 0 && <span className="text-slate-400 ml-1 font-medium">({msg.count})</span>}
                                                    </h4>
                                                    {msg.ap && (
                                                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">{msg.ap}</span>
                                                    )}
                                                </div>
                                                <p className={`text-xs truncate mb-1.5 ${!msg.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                                    {msg.subject}
                                                </p>

                                                {msg.role && (
                                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                                        {msg.role}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Meta */}
                                        <div className="text-right shrink-0 flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{msg.date}</span>
                                            {msg.attachment && (
                                                <Paperclip size={14} className="text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmployerMessages;
