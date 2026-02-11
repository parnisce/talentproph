import {
    ArrowLeft,
    MoreHorizontal,
    Star,
    Paperclip,
    Archive,
    Pin,
    Tag,
    Bold,
    Italic,
    Underline,
    List,
    AlignLeft,
    Image,
    Send,
    CheckCircle,
    User,
    Mail,
    Phone,
    Globe,
    MapPin,
    AlertCircle,
    Trash2,
    Briefcase,
    Calendar
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';

interface ConversationProps {
    message: any; // The selected conversation object
    onBack: () => void;
}

const EmployerConversation = ({ message, onBack }: ConversationProps) => {
    const navigate = useNavigate();
    const { id: employerId, photo: employerPhoto, name: employerName } = useUser();
    const [rating, setRating] = useState(0);
    const [isPinned, setIsPinned] = useState(message?.pinned || false);
    const [isArchived, setIsArchived] = useState(message?.archived || false);
    const [isSpam, setIsSpam] = useState(message?.spam || false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showLabelMenu, setShowLabelMenu] = useState(false);

    const [messages, setMessages] = useState<any[]>([]);
    const [allLabels, setAllLabels] = useState<any[]>([]);
    const [convLabels, setConvLabels] = useState<any[]>(message?.labels || []);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [interview, setInterview] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch All User Labels
    useEffect(() => {
        const fetchAllLabels = async () => {
            if (!employerId) return;
            const { data } = await supabase.from('labels').select('*').eq('user_id', employerId).order('name');
            if (data) setAllLabels(data);
        };
        fetchAllLabels();
    }, [employerId]);

    // Fetch Conversation Labels
    const fetchConvLabels = async () => {
        const { data } = await supabase
            .from('conversation_labels')
            .select('label:label_id (id, name, color)')
            .eq('conversation_id', message.id);
        if (data) setConvLabels(data.map((cl: any) => cl.label));
    };

    const toggleLabel = async (labelId: string) => {
        const isSelected = convLabels.some(l => l.id === labelId);
        try {
            if (isSelected) {
                await supabase.from('conversation_labels').delete().eq('conversation_id', message.id).eq('label_id', labelId);
            } else {
                await supabase.from('conversation_labels').insert({ conversation_id: message.id, label_id: labelId });
            }
            fetchConvLabels();
        } catch (err) {
            console.error("Error toggling label:", err);
        }
    };

    const handleHire = async () => {
        if (!message.job_id || !message.seeker_id) return;
        if (!confirm(`Are you sure you want to HIRE this candidate?`)) return;

        setStatusUpdating(true);
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: 'Hired' })
                .eq('job_id', message.job_id)
                .eq('seeker_id', message.seeker_id);

            if (error) throw error;
            alert("Candidate marked as HIRED!");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleMarkSpam = async () => {
        const newVal = !isSpam;
        setIsSpam(newVal);
        try {
            await supabase.from('conversations').update({ is_spam_employer: newVal }).eq('id', message.id);
            if (newVal) onBack();
        } catch (err) {
            console.error("Error marking spam:", err);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this conversation? It will be hidden from your inbox.")) return;
        try {
            await supabase.from('conversations').update({ is_deleted_employer: true }).eq('id', message.id);
            onBack();
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };



    // Real-time messages sync
    useEffect(() => {
        fetchMessages();
        markAsRead();
        fetchInterviewStatus();

        const channel = supabase.channel(`conv_${message.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${message.id}` }, (p) => {
            setMessages(prev => {
                if (prev.find(m => m.id === p.new.id)) return prev;
                if (p.new.sender_id !== employerId) markAsRead();
                return [...prev, p.new];
            });
            setTimeout(scrollToBottom, 100);
        }).subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [message.id]);

    const markAsRead = async () => {
        if (!employerId) return;
        try {
            await supabase.from('messages').update({ is_read: true }).eq('conversation_id', message.id).neq('sender_id', employerId).eq('is_read', false);
        } catch (err) { console.error("Error marking read:", err); }
    };

    const fetchInterviewStatus = async () => {
        if (!employerId || !message.seeker_id || !message.job_id) return;
        try {
            const { data } = await supabase
                .from('interviews')
                .select('*')
                .eq('employer_id', employerId)
                .eq('seeker_id', message.seeker_id)
                .eq('job_id', message.job_id)
                .order('scheduled_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            if (data) setInterview(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data } = await supabase.from('messages').select('*').eq('conversation_id', message.id).order('created_at', { ascending: true });
            if (data) setMessages(data);
        } catch (err) { console.error("Error fetching messages:", err); } finally { setLoading(false); }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !employerId || sending) return;
        setSending(true);
        const content = newMessage.trim();
        setNewMessage('');
        try {
            const { data } = await supabase.from('messages').insert({ conversation_id: message.id, sender_id: employerId, content, type: 'text' }).select().single();
            if (data) setMessages(prev => [...prev.filter(m => m.id !== data.id), data]);
            await supabase.from('conversations').update({ last_message: content, last_message_at: new Date().toISOString() }).eq('id', message.id);
        } catch (err: any) { alert(err.message); } finally { setSending(false); scrollToBottom(); }
    };








    const handleViewProfile = async () => {
        if (!message.seeker_id || !message.job_id) return;
        try {
            const { data } = await supabase.from('job_applications').select('id').eq('seeker_id', message.seeker_id).eq('job_id', message.job_id).single();
            if (data) navigate(`/employer/applicants/review/${data.id}`);
        } catch (err) { console.error(err); }
    };

    const togglePin = async () => {
        const newVal = !isPinned;
        setIsPinned(newVal);
        try { await supabase.from('conversations').update({ is_pinned_employer: newVal }).eq('id', message.id); } catch (err) { console.error(err); }
    };

    const handleArchive = async () => {
        const newVal = !isArchived;
        setIsArchived(newVal);
        try { await supabase.from('conversations').update({ is_archived_employer: newVal }).eq('id', message.id); if (newVal) onBack(); } catch (err) { console.error(err); }
    };

    return (
        <div className="flex h-full flex-col lg:flex-row">
            {/* Left/Main Chat Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{message.subject}</h2>
                                <div className="flex gap-1">
                                    {convLabels.map(l => (
                                        <span key={l.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} title={l.name} />
                                    ))}
                                </div>
                            </div>
                            {message.role && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                        {message.role}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.sender_id === employerId;
                            return (
                                <div key={msg.id || idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse text-right' : ''}`}>
                                    <img
                                        src={isMe ? employerPhoto : message.avatar}
                                        alt={isMe ? 'Me' : message.sender}
                                        className="w-10 h-10 rounded-full bg-slate-100 object-cover ring-2 ring-white shadow-sm shrink-0"
                                    />
                                    <div className={`flex-1 space-y-2`}>
                                        <div className={`flex items-baseline gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <h4 className="font-black text-slate-900 text-sm">{isMe ? employerName : message.sender}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className={`text-sm font-medium leading-relaxed p-4 rounded-2xl shadow-sm inline-block max-w-[80%] text-left ${isMe
                                            ? 'bg-slate-900 text-white rounded-tr-none'
                                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Editor Area */}
                <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 shrink-0">
                    <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/50 transition-all shadow-sm">
                        {/* Toolbar */}
                        <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
                            {[
                                { icon: Bold, label: 'Bold' },
                                { icon: Italic, label: 'Italic' },
                                { icon: Underline, label: 'Underline' },
                                { icon: List, label: 'List' },
                                { icon: AlignLeft, label: 'Align' },
                                { icon: Image, label: 'Image' }
                            ].map((tool, idx) => (
                                <button key={idx} type="button" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                    <tool.icon size={16} />
                                </button>
                            ))}
                            <div className="h-4 w-px bg-slate-200 mx-1" />
                            <button type="button" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                <Paperclip size={16} />
                            </button>
                        </div>

                        {/* Textarea */}
                        <textarea
                            rows={3}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type your reply here..."
                            className="w-full p-4 text-sm font-medium text-slate-700 outline-none resize-none bg-white placeholder:text-slate-300"
                        />

                        {/* Footer */}
                        <div className="flex items-center justify-end p-3 bg-white">
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : <><Send size={14} /> Send Message</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Right Sidebar - Applicant Details */}
            <div className="w-96 bg-white shrink-0 h-full overflow-y-auto border-l border-slate-100 relative">
                <div className="p-8 text-center border-b border-slate-100">
                    <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto mb-4 overflow-hidden ring-4 ring-slate-50 shadow-xl">
                        <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">{message.sender}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">{message.role}</p>

                    <div className="flex items-center justify-center gap-1 mt-6 text-amber-400">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mr-2">Applicant Rating</span>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={14}
                                className={`cursor-pointer transition-colors ${rating >= star ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200 hover:text-amber-200'}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-4 grid grid-cols-5 gap-2 border-b border-slate-100 relative">
                    <button
                        onClick={togglePin}
                        className={`flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-all group ${isPinned ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                    >
                        <Pin size={18} className={`group-hover:scale-110 transition-transform ${isPinned ? 'fill-primary' : ''}`} />
                        <span className="text-[9px] font-bold">Pin</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowLabelMenu(!showLabelMenu)}
                            className={`flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-all group w-full ${showLabelMenu || convLabels.length > 0 ? 'text-secondary font-bold' : 'text-slate-400 hover:text-secondary'}`}
                        >
                            <Tag size={18} className={`group-hover:scale-110 transition-transform ${convLabels.length > 0 ? 'fill-secondary text-secondary' : ''}`} />
                            <span className="text-[9px] font-bold">Label</span>
                        </button>
                        {showLabelMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[60] p-1.5 animate-in fade-in zoom-in-95 duration-200">
                                <p className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 mb-1">Select Labels</p>
                                {allLabels.length === 0 ? (
                                    <p className="px-3 py-4 text-xs font-bold text-slate-400 text-center">No labels created yet</p>
                                ) : (
                                    allLabels.map(l => {
                                        const isSelected = convLabels.some(cl => cl.id === l.id);
                                        return (
                                            <button
                                                key={l.id}
                                                onClick={() => toggleLabel(l.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                                                    {l.name}
                                                </div>
                                                {isSelected && <CheckCircle size={14} className="text-secondary" />}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleHire}
                        disabled={statusUpdating}
                        className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-emerald-500 transition-all group disabled:opacity-50"
                    >
                        <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold whitespace-nowrap">Hire</span>
                    </button>

                    <button
                        onClick={handleArchive}
                        className={`flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-all group ${isArchived ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                    >
                        <Archive size={18} className={`group-hover:scale-110 transition-transform ${isArchived ? 'fill-primary' : ''}`} />
                        <span className="text-[9px] font-bold">Archive</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            className={`flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-primary transition-all group w-full ${showMoreMenu ? 'bg-slate-50 text-primary' : ''}`}
                        >
                            <MoreHorizontal size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-bold">More</span>
                        </button>

                        {showMoreMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-1.5 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={handleMarkSpam}
                                    type="button"
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${isSpam ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <AlertCircle size={16} /> {isSpam ? 'Unmark as Spam' : 'Mark as Spam'}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    type="button"
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left"
                                >
                                    <Trash2 size={16} /> Delete Conversation
                                </button>
                                <button
                                    onClick={handleViewProfile}
                                    type="button"
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors text-left lg:hidden"
                                >
                                    <User size={16} /> View Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Contact Information</h4>
                        <div className="space-y-3">
                            {message.seeker?.email && (
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={12} /></div>
                                    {message.seeker.email}
                                </div>
                            )}
                            {message.seeker?.phone && (
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={12} /></div>
                                    {message.seeker.phone}
                                </div>
                            )}
                            {message.seeker?.website && (
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400"><Globe size={12} /></div>
                                    <a href={message.seeker.website} target="_blank" rel="noopener noreferrer" className="underline">{message.seeker.website}</a>
                                </div>
                            )}
                            {message.seeker?.location && (
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={12} /></div>
                                    {message.seeker.location}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex gap-3">
                            <Briefcase size={16} className="text-slate-400 shrink-0" />
                            <div className="text-xs space-y-2">
                                <p className="font-bold text-slate-900">Bio:</p>
                                <p className="font-medium text-slate-500 leading-relaxed">
                                    {message.seeker?.bio || 'No bio provided.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <button
                            onClick={handleViewProfile}
                            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2 font-outfit"
                        >
                            <User size={14} /> View Applicant Review
                        </button>
                        {interview && (
                            <button
                                onClick={() => navigate('/employer/calendar')}
                                className="w-full py-3.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                <Calendar size={14} /> View Scheduled Interview
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerConversation;
