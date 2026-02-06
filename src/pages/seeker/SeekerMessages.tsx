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
    Building2,
    Tag
} from 'lucide-react';
import SeekerConversation from './SeekerConversation';

const SeekerMessages = () => {
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    // Mock Messages for Seeker (Recruiters/Companies contacting them)
    const messages = [
        {
            id: '1',
            sender: 'TechFlow Solutions',
            count: 2,
            subject: 'Interview Invitation: Senior React Developer',
            preview: 'We were impressed by your profile and would like to schedule...',
            role: 'Senior React Developer',
            date: 'Feb 6, 2026, 09:30 AM',
            avatar: 'https://ui-avatars.com/api/?name=Tech+Flow&background=0D8ABC&color=fff',
            pinned: true,
            selected: false,
            read: false,
            type: 'received',
            archived: false,
            isCompany: true
        },
        {
            id: '2',
            sender: 'Sarah Peterson',
            count: 0,
            subject: 'Regarding your application for VA Role',
            preview: 'Hi! Thanks for applying. Are you available for a quick chat?',
            role: 'Virtual Assistant',
            date: 'Feb 5, 2026, 02:15 PM',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
            pinned: true,
            selected: false,
            read: true,
            type: 'received',
            archived: false,
            isCompany: false
        },
        {
            id: '3',
            sender: 'Global Nomads Inc.',
            count: 0,
            subject: 'Application Status Update',
            preview: 'Your application has been moved to the next stage.',
            role: 'Frontend Engineer',
            date: 'Feb 4, 2026, 11:00 AM',
            avatar: 'https://ui-avatars.com/api/?name=Global+Nomads&background=6366f1&color=fff',
            pinned: false,
            selected: false,
            read: true,
            type: 'received',
            archived: false,
            isCompany: true
        },
        // Mock Sent Message
        {
            id: '11',
            sender: 'You',
            count: 0,
            subject: 'Re: Interview Availability',
            preview: 'Yes, I am available tomorrow at 10 AM EST.',
            role: '',
            date: 'Feb 6, 2026, 10:00 AM',
            avatar: 'https://ui-avatars.com/api/?name=You&background=10b981&color=fff',
            pinned: false,
            selected: false,
            read: true,
            attachment: false,
            type: 'sent',
            archived: false
        }
    ];

    const filteredMessages = messages.filter(msg => {
        if (selectedTab === 'inbox') return msg.type === 'received' && !msg.archived;
        if (selectedTab === 'unread') return !msg.read && !msg.archived;
        if (selectedTab === 'pinned') return msg.pinned && !msg.archived;
        if (selectedTab === 'sent') return msg.type === 'sent' && !msg.archived;
        if (selectedTab === 'archive') return msg.archived;
        return true;
    });

    const sidebarItems = [
        { id: 'messages', icon: Inbox, label: 'Messages' },
        { id: 'unread', icon: Mail, label: 'Unread', badge: 1 },
        { id: 'pinned', icon: Pin, label: 'Pinned' },
        { id: 'sent', icon: Send, label: 'Sent' },
        { id: 'archive', icon: Archive, label: 'Archive' },
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
                                setSelectedMessage(null);
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
                    </div>
                    {[
                        { label: 'Interview Requests', color: 'bg-indigo-500' },
                        { label: 'Job Offers', color: 'bg-emerald-500' },
                        { label: 'Follow-ups', color: 'bg-amber-500' }
                    ].map((tag, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors">
                            <Tag size={14} className={tag.color.replace('bg-', 'text-')} fill="currentColor" />
                            <span className="truncate">{tag.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm flex flex-col overflow-hidden">
                {selectedMessage ? (
                    <SeekerConversation message={selectedMessage} onBack={() => setSelectedMessage(null)} />
                ) : (
                    <>
                        {/* Message Header */}
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                            <button className="flex items-center gap-2 text-slate-900 font-extrabold text-lg hover:text-primary transition-colors">
                                {selectedTab === 'inbox' ? 'Inbox' : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
                                <ChevronDown size={20} className="text-slate-400" />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400">Message</span>
                                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 rounded-md">{filteredMessages.length}</span>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/30">
                            <div className="relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
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
                                                {msg.isCompany && (
                                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <Building2 size={10} className="text-slate-400" />
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
                                            {msg.preview.includes('attach') && (
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

export default SeekerMessages;
