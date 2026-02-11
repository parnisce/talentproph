import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    Star,
    Mail,
    Inbox,
    Pin,
    Archive,
    Tag,
    Plus
} from 'lucide-react';
import SeekerConversation from './SeekerConversation';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';

const SeekerMessages = () => {
    const { id: userId } = useUser();
    const [searchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [allLabels, setAllLabels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [showNewLabelModal, setShowNewLabelModal] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');

    const fetchData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            // 1. Fetch user's custom labels
            const { data: labelsData } = await supabase.from('labels').select('*').eq('user_id', userId).order('name');
            if (labelsData) setAllLabels(labelsData);

            // 2. Fetch conversations
            const { data: convData, error: convError } = await supabase
                .from('conversations')
                .select(`
                    id,
                    last_message,
                    last_message_at,
                    created_at,
                    employer_id,
                    job_id,
                    is_pinned_seeker,
                    is_archived_seeker,
                    employer:employer_id (full_name, avatar_url, company_name),
                    job:job_id (title),
                    conversation_labels (label:label_id (id, name, color))
                `)
                .eq('seeker_id', userId)
                .order('last_message_at', { ascending: false });

            if (convError) throw convError;

            // 3. Fetch unread counts
            const { data: unreadData } = await supabase.from('messages').select('conversation_id').eq('is_read', false).neq('sender_id', userId);

            const unreadCounts = (unreadData || []).reduce((acc: any, msg: any) => {
                acc[msg.conversation_id] = (acc[msg.conversation_id] || 0) + 1;
                return acc;
            }, {});
            setUnreadTotal(Object.keys(unreadCounts).length);

            if (convData) {
                const mapped = convData.map((conv: any) => ({
                    id: conv.id,
                    sender: conv.employer?.company_name || conv.employer?.full_name || 'Unknown Employer',
                    avatar: conv.employer?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${conv.employer?.company_name || 'Employer'}`,
                    role: conv.job?.title || 'General Inquiry',
                    subject: conv.job?.title ? `Regarding: ${conv.job.title}` : 'General Inquiry',
                    date: new Date(conv.last_message_at).toLocaleDateString(),
                    timestamp: conv.last_message_at,
                    preview: conv.last_message,
                    count: unreadCounts[conv.id] || 0,
                    pinned: conv.is_pinned_seeker || false,
                    read: (unreadCounts[conv.id] || 0) === 0,
                    archived: conv.is_archived_seeker || false,
                    labels: conv.conversation_labels?.map((cl: any) => cl.label) || [],
                    employer_id: conv.employer_id,
                    job_id: conv.job_id
                }));
                setMessages(mapped);

                const linkedConvId = searchParams.get('conversationId');
                if (linkedConvId) {
                    const target = mapped.find(m => m.id === linkedConvId);
                    if (target) setSelectedMessage(target);
                }
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    // Fetch Conversations and Labels
    useEffect(() => {
        fetchData();

        const convSub = supabase.channel('seeker_convs').on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `seeker_id=eq.${userId}` }, fetchData).subscribe();
        const msgSub = supabase.channel('seeker_msgs').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchData).subscribe();
        const labelSub = supabase.channel('seeker_labels').on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_labels' }, fetchData).subscribe();

        return () => { supabase.removeChannel(convSub); supabase.removeChannel(msgSub); supabase.removeChannel(labelSub); };
    }, [userId]);

    const handleCreateLabel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabelName.trim() || !userId) return;
        try {
            const { error } = await supabase
                .from('labels')
                .insert({ name: newLabelName.trim(), user_id: userId });
            if (error) throw error;
            setNewLabelName('');
            setShowNewLabelModal(false);
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const filteredMessages = messages.filter(msg => {
        if (currentTab === 'inbox') return !msg.archived;
        if (currentTab === 'unread') return !msg.read && !msg.archived;
        if (currentTab === 'pinned') return msg.pinned && !msg.archived;
        if (currentTab === 'archive') return msg.archived;
        if (currentTab.startsWith('label:')) {
            const labelId = currentTab.split(':')[1];
            return msg.labels.some((l: any) => l.id === labelId);
        }
        return true;
    });

    const sidebarItems = [
        { id: 'inbox', icon: Inbox, label: 'Inbox' },
        { id: 'unread', icon: Mail, label: 'Unread', badge: unreadTotal },
        { id: 'pinned', icon: Pin, label: 'Pinned' },
        { id: 'archive', icon: Archive, label: 'Archive' },
    ];

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 -mt-4 font-outfit">
            <div className="w-64 flex flex-col gap-8 shrink-0">
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setCurrentTab(item.id); setSelectedMessage(null); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentTab === item.id ? 'bg-white text-primary shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={currentTab === item.id ? 'text-primary' : 'text-slate-400'} />
                                <span>{item.label}</span>
                            </div>
                            {(item.badge ?? 0) > 0 && <span className="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-md min-w-[20px] text-center">{item.badge}</span>}
                        </button>
                    ))}
                </div>

                <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        <span>Labels</span>
                        <button onClick={() => setShowNewLabelModal(true)} className="hover:text-primary"><Plus size={14} /></button>
                    </div>
                    {allLabels.map((l) => (
                        <div
                            key={l.id}
                            onClick={() => { setCurrentTab(`label:${l.id}`); setSelectedMessage(null); }}
                            className={`flex items-center gap-3 text-[13px] font-bold p-2 rounded-lg cursor-pointer transition-colors ${currentTab === `label:${l.id}` ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Tag size={14} style={{ color: l.color }} fill="currentColor" />
                            <span className="truncate">{l.name}</span>
                        </div>
                    ))}
                </div>

                {showNewLabelModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                            <h3 className="text-lg font-black text-slate-900 mb-4">Create New Label</h3>
                            <form onSubmit={handleCreateLabel}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Label Name"
                                    value={newLabelName}
                                    onChange={(e) => setNewLabelName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 mb-4"
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewLabelModal(false)}
                                        className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm flex flex-col overflow-hidden">
                {selectedMessage ? (
                    <SeekerConversation message={selectedMessage} onBack={() => setSelectedMessage(null)} onDataUpdate={fetchData} />
                ) : (
                    <>
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10 transition-all">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                                {currentTab.startsWith('label:') ? allLabels.find(l => l.id === currentTab.split(':')[1])?.name : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 rounded-md">{filteredMessages.length}</span>
                            </div>
                        </div>

                        <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/30">
                            <div className="relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="text" placeholder="Search messages..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-slate-50/10">
                            {loading ? (
                                <div className="flex items-center justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
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
                                        className={`group flex items-center gap-4 px-6 py-4 border-b border-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer relative ${!msg.read ? 'bg-white shadow-sm ring-1 ring-slate-100 z-10' : ''}`}
                                    >
                                        <div className="flex flex-col items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <Star size={16} className={`transition-colors ${msg.pinned ? 'text-amber-400 fill-amber-400' : 'text-slate-200 group-hover:text-slate-300'}`} />
                                        </div>

                                        <div className="flex-1 min-w-0 grid grid-cols-[auto_1fr] gap-x-4 items-center">
                                            <img src={msg.avatar} alt={msg.sender} className="w-12 h-12 rounded-full bg-slate-100 object-cover ring-2 ring-white shadow-sm shrink-0" />
                                            <div className="min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h4 className={`text-sm truncate ${!msg.read ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>{msg.sender}</h4>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.date}</span>
                                                </div>
                                                <p className={`text-xs truncate mb-2 ${!msg.read ? 'font-bold text-slate-600' : 'font-medium text-slate-500'}`}>{msg.preview || 'New Conversation'}</p>
                                                <div className="flex items-center gap-2">
                                                    {msg.role && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-tighter">{msg.role}</span>}
                                                    <div className="flex gap-1">
                                                        {msg.labels.map((l: any) => (
                                                            <div key={l.id} className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: l.color }} title={l.name} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
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
