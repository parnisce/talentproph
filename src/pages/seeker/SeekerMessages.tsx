import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    Star,
    ChevronDown,
    Mail,
    Inbox,
    Pin,
    Send,
    Archive,
    Tag
} from 'lucide-react';
import SeekerConversation from './SeekerConversation';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';

const SeekerMessages = () => {
    const { id: userId } = useUser();
    const [searchParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Conversations
    useEffect(() => {
        const fetchConversations = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                // Fetch conversations where I (seeker) am a participant
                const { data, error } = await supabase
                    .from('conversations')
                    .select(`
                        id,
                        last_message,
                        last_message_at,
                        created_at,
                        employer_id,
                        job_id,
                        employer:employer_id (
                            full_name,
                            avatar_url,
                            company_name
                        ),
                        job:job_id (
                            title
                        )
                    `)
                    .eq('seeker_id', userId)
                    .order('last_message_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mapped = data.map((conv: any) => ({
                        id: conv.id,
                        sender: conv.employer?.company_name || conv.employer?.full_name || 'Unknown Employer',
                        avatar: conv.employer?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${conv.employer?.company_name || 'Employer'}`,
                        role: conv.job?.title || 'General Inquiry',
                        subject: conv.job?.title ? `Regarding: ${conv.job.title}` : 'General Inquiry',
                        date: new Date(conv.last_message_at).toLocaleDateString(),
                        timestamp: conv.last_message_at,
                        preview: conv.last_message,
                        count: 0, // Unread count logic TODO
                        pinned: false,
                        read: true, // Read status logic TODO
                        type: 'received',
                        archived: false,
                        employer: conv.employer,
                        job: conv.job
                    }));
                    setMessages(mapped);

                    // Auto-select conversation from URL
                    const linkedConvId = searchParams.get('conversationId');
                    if (linkedConvId) {
                        const target = mapped.find(m => m.id === linkedConvId);
                        if (target) setSelectedMessage(target);
                    }
                }
            } catch (err) {
                console.error("Error fetching conversations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();

        // Real-time subscription for conversation updates
        const channel = supabase
            .channel('seeker_conversation_updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `seeker_id=eq.${userId}`
                },
                () => {
                    fetchConversations();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, searchParams]);

    const filteredMessages = messages.filter(msg => {
        if (selectedTab === 'inbox') return !msg.archived;
        if (selectedTab === 'unread') return !msg.read && !msg.archived;
        if (selectedTab === 'pinned') return msg.pinned && !msg.archived;
        if (selectedTab === 'sent') return msg.type === 'sent' && !msg.archived;
        if (selectedTab === 'archive') return msg.archived;
        return true;
    });

    const sidebarItems = [
        { id: 'messages', icon: Inbox, label: 'Messages' },
        { id: 'unread', icon: Mail, label: 'Unread', badge: 0 },
        { id: 'pinned', icon: Pin, label: 'Pinned' },
        { id: 'sent', icon: Send, label: 'Sent' },
        { id: 'archive', icon: Archive, label: 'Archive' },
    ];

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 -mt-4 font-outfit">
            {/* Sidebar */}
            <div className="w-64 flex flex-col gap-8 shrink-0">
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setSelectedTab(item.id === 'messages' ? 'inbox' : item.id);
                                setSelectedMessage(null);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${((selectedTab === 'inbox' && item.id === 'messages') || selectedTab === item.id)
                                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-100'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={((selectedTab === 'inbox' && item.id === 'messages') || selectedTab === item.id) ? 'text-primary' : 'text-slate-400'} />
                                <span>{item.label}</span>
                            </div>
                            {(item.badge ?? 0) > 0 && (
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
                            {loading ? (
                                <div className="flex items-center justify-center p-20">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                                    <Inbox size={48} className="opacity-20" />
                                    <p className="font-bold text-sm">No messages found</p>
                                </div>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`group flex items-center gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer ${!msg.read ? 'bg-slate-50/50' : ''}`}
                                    >
                                        <div className="flex flex-col items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer" />
                                            <Star
                                                size={16}
                                                className={`cursor-pointer transition-colors ${msg.pinned ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-400'}`}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 grid grid-cols-[auto_1fr] gap-x-4 items-center">
                                            <div className="relative">
                                                <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-full bg-slate-100 object-cover ring-2 ring-white shadow-sm" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <h4 className={`text-sm truncate ${!msg.read ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                                        {msg.sender}
                                                    </h4>
                                                </div>
                                                <p className={`text-xs truncate mb-1.5 ${!msg.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                                    {msg.preview || 'New Conversation'}
                                                </p>

                                                {msg.role && (
                                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                                        {msg.role}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0 flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{msg.date}</span>
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
