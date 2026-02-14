import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    Star,
    ChevronDown,
    Mail,
    Inbox,
    Pin,
    AlertCircle,
    Tag,
    Archive,
    Plus,
    MoreVertical,
    Edit2,
    Trash
} from 'lucide-react';
import EmployerConversation from './EmployerConversation';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';

const EmployerMessages = () => {
    const { id: userId } = useUser();
    const [searchParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [labels, setLabels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewLabelModal, setShowNewLabelModal] = useState(false);

    const [newLabelName, setNewLabelName] = useState('');
    const [editingLabel, setEditingLabel] = useState<any>(null);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [renameLabelName, setRenameLabelName] = useState('');
    const [activeLabelMenu, setActiveLabelMenu] = useState<string | null>(null);

    // Fetch Labels
    const fetchLabels = async () => {
        if (!userId) return;
        try {
            const { data } = await supabase
                .from('labels')
                .select('*')
                .eq('user_id', userId)
                .order('name');
            if (data) setLabels(data);
        } catch (err) {
            console.error("Error fetching labels:", err);
        }
    };

    // Create Label
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
            fetchLabels();
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Delete Label
    const handleDeleteLabel = async (labelId: string) => {
        if (!confirm('Are you sure you want to delete this label?')) return;
        try {
            const { error } = await supabase.from('labels').delete().eq('id', labelId);
            if (error) throw error;
            fetchLabels();
            if (selectedTab === `label:${labelId}`) setSelectedTab('inbox');
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Rename Label
    const handleRenameLabel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renameLabelName.trim() || !editingLabel) return;
        try {
            const { error } = await supabase
                .from('labels')
                .update({ name: renameLabelName.trim() })
                .eq('id', editingLabel.id);
            if (error) throw error;
            setEditingLabel(null);
            setIsRenameModalOpen(false);
            fetchLabels();
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Fetch Conversations
    const fetchConversations = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            // 1. Fetch conversations with labels
            const { data: convData, error: convError } = await supabase
                .from('conversations')
                .select(`
                    id,
                    last_message,
                    last_message_at,
                    created_at,
                    seeker_id,
                    job_id,
                    is_pinned_employer,
                    is_archived_employer,
                    is_spam_employer,
                    is_deleted_employer,
                    seeker:profiles!seeker_id (
                        full_name,
                        avatar_url,
                        title,
                        location,
                        email,
                        phone,
                        website,
                        experience_years,
                        bio
                    ),
                    job:job_posts!job_id (
                        id,
                        title
                    ),
                    conversation_labels (
                        label:labels!label_id (id, name, color)
                    )
                `)
                .eq('employer_id', userId)
                .order('last_message_at', { ascending: false });

            if (convError) throw convError;

            // 2. Fetch unread counts
            const { data: unreadData } = await supabase
                .from('messages')
                .select('conversation_id')
                .eq('is_read', false)
                .neq('sender_id', userId);

            const unreadCounts = (unreadData || []).reduce((acc: any, msg: any) => {
                acc[msg.conversation_id] = (acc[msg.conversation_id] || 0) + 1;
                return acc;
            }, {});

            if (convData) {
                const mapped = convData.map((conv: any) => ({
                    id: conv.id,
                    seeker_id: conv.seeker_id,
                    job_id: conv.job_id,
                    sender: conv.seeker?.full_name || 'Unknown User',
                    avatar: conv.seeker?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.seeker?.full_name}`,
                    role: conv.seeker?.title || 'Job Seeker',
                    subject: conv.job?.title || 'General Inquiry',
                    date: new Date(conv.last_message_at).toLocaleDateString(),
                    timestamp: conv.last_message_at,
                    preview: conv.last_message,
                    count: unreadCounts[conv.id] || 0,
                    pinned: conv.is_pinned_employer || false,
                    read: (unreadCounts[conv.id] || 0) === 0,
                    type: 'received',
                    archived: conv.is_archived_employer || false,
                    spam: conv.is_spam_employer || false,
                    deleted: conv.is_deleted_employer || false,
                    seeker: conv.seeker,
                    labels: conv.conversation_labels?.map((cl: any) => cl.label).filter((l: any) => l) || []
                }));
                setMessages(mapped);

                // Check for auto-select
                const linkedConvId = searchParams.get('conversationId');
                if (linkedConvId) {
                    const target = mapped.find((m: any) => m.id === linkedConvId);
                    if (target) setSelectedMessage(target);
                }
            }
        } catch (err) {
            console.error("Error fetching conversations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchConversations();
        fetchLabels();

        const convChannel = supabase.channel('conv_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `employer_id=eq.${userId}` }, () => fetchConversations()).subscribe();
        const msgChannel = supabase.channel('msg_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchConversations()).subscribe();
        const labelChannel = supabase.channel('label_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_labels' }, () => fetchConversations()).subscribe();

        return () => {
            supabase.removeChannel(convChannel);
            supabase.removeChannel(msgChannel);
            supabase.removeChannel(labelChannel);
        };
    }, [userId, searchParams]);

    // Filter Logic
    const filteredMessages = messages.filter(msg => {
        if (selectedTab === 'inbox') return !msg.archived && !msg.spam && !msg.deleted;
        if (selectedTab === 'unread') return !msg.read && !msg.archived && !msg.spam && !msg.deleted;
        if (selectedTab === 'pinned') return msg.pinned && !msg.archived && !msg.spam && !msg.deleted;
        if (selectedTab === 'archive') return msg.archived && !msg.deleted;
        if (selectedTab === 'spam') return msg.spam && !msg.deleted;
        if (selectedTab.startsWith('label:')) {
            const labelId = selectedTab.split(':')[1];
            return msg.labels?.some((l: any) => l?.id === labelId) && !msg.deleted;
        }
        return true;
    });

    const sidebarItems = [
        { id: 'messages', icon: Inbox, label: 'All Messages' },
        { id: 'unread', icon: Mail, label: 'Unread', badge: messages.filter(m => !m.read && !m.archived && !m.spam && !m.deleted).length },
        { id: 'pinned', icon: Pin, label: 'Pinned' },
        { id: 'archive', icon: Archive, label: 'Archive' },
        { id: 'spam', icon: AlertCircle, label: 'Spam' },
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
                        <button onClick={() => setShowNewLabelModal(true)} className="hover:text-primary"><Plus size={14} /></button>
                    </div>
                    <div className="space-y-1">
                        <div className="space-y-1">
                            {labels.map(label => (
                                <div key={label.id} className="group relative flex items-center">
                                    <button
                                        onClick={() => {
                                            setSelectedTab(`label:${label.id}`);
                                            setSelectedMessage(null);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all pr-8 ${selectedTab === `label:${label.id}`
                                            ? 'bg-slate-100 text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Tag size={14} style={{ color: label.color }} />
                                        <span className="truncate">{label.name}</span>
                                    </button>
                                    <div className="absolute right-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveLabelMenu(activeLabelMenu === label.id ? null : label.id);
                                            }}
                                            className={`p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all ${activeLabelMenu === label.id ? 'opacity-100 bg-slate-200' : ''}`}
                                        >
                                            <MoreVertical size={14} />
                                        </button>
                                        {activeLabelMenu === label.id && (
                                            <div className="absolute left-full top-0 ml-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[60] p-1 flex flex-col gap-0.5">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingLabel(label);
                                                        setRenameLabelName(label.name);
                                                        setIsRenameModalOpen(true);
                                                        setActiveLabelMenu(null);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg w-full text-left"
                                                >
                                                    <Edit2 size={12} /> Rename
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteLabel(label.id);
                                                        setActiveLabelMenu(null);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-rose-500 hover:bg-rose-50 rounded-lg w-full text-left"
                                                >
                                                    <Trash size={12} /> Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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

                {isRenameModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                            <h3 className="text-lg font-black text-slate-900 mb-4">Rename Label</h3>
                            <form onSubmit={handleRenameLabel}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Label Name"
                                    value={renameLabelName}
                                    onChange={(e) => setRenameLabelName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 mb-4"
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsRenameModalOpen(false)}
                                        className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white border-2 border-slate-50 rounded-[32px] shadow-sm flex flex-col overflow-hidden">
                {selectedMessage ? (
                    <EmployerConversation message={selectedMessage} onBack={() => setSelectedMessage(null)} onDataUpdate={fetchConversations} />
                ) : (
                    <>
                        {/* Message Header */}
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                            <button className="flex items-center gap-2 text-slate-900 font-extrabold text-lg hover:text-primary transition-colors">
                                {selectedTab === 'inbox'
                                    ? 'All Messages'
                                    : selectedTab.startsWith('label:')
                                        ? labels.find((l: any) => l.id === selectedTab.split(':')[1])?.name || 'Label'
                                        : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
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
                                    placeholder="Search Inbox"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                            </div>
                        </div>

                        {/* Message List */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-40">
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
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0">
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <h4 className={`text-sm truncate ${!msg.read ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                                        {msg.sender}
                                                    </h4>
                                                </div>
                                                <p className={`text-xs truncate mb-1.5 ${!msg.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                                    {msg.preview || 'No messages yet'}
                                                </p>

                                                {msg.role && (
                                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                                        {msg.role}
                                                    </span>
                                                )}
                                                <span className="inline-block ml-2 text-[10px] font-bold text-primary">
                                                    {msg.subject}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Meta */}
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

export default EmployerMessages;
