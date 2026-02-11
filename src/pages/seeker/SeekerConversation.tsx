import {
    ArrowLeft,
    MoreHorizontal,
    Archive,
    Pin,
    Send,
    Tag,
    CheckCircle,
    Trash2,
    Building2,
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

const SeekerConversation = ({ message, onBack }: ConversationProps) => {
    const navigate = useNavigate();
    const { id: seekerId, photo: seekerPhoto, name: seekerName } = useUser();
    const [isPinned, setIsPinned] = useState(message?.pinned || false);
    const [isArchived, setIsArchived] = useState(message?.archived || false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showLabelMenu, setShowLabelMenu] = useState(false);

    const [messages, setMessages] = useState<any[]>([]);
    const [allLabels, setAllLabels] = useState<any[]>([]);
    const [convLabels, setConvLabels] = useState<any[]>(message?.labels || []);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [interview, setInterview] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

    useEffect(() => {
        const fetchData = async () => {
            if (!seekerId) return;
            // Fetch Labels
            const { data: labels } = await supabase.from('labels').select('*').eq('user_id', seekerId).order('name');
            if (labels) setAllLabels(labels);
            fetchConvLabels();
            fetchInterviewStatus();
        };

        const fetchInterviewStatus = async () => {
            if (!seekerId || !message.employer_id || !message.job_id) return;
            const { data } = await supabase.from('interviews').select('*').eq('seeker_id', seekerId).eq('employer_id', message.employer_id).eq('job_id', message.job_id).order('scheduled_at', { ascending: false }).limit(1).maybeSingle();
            if (data) setInterview(data);
        };

        fetchData();
        fetchMessages();
        markAsRead();

        const channel = supabase.channel(`seeker_conv_${message.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${message.id}` }, (p) => {
            setMessages(prev => {
                if (prev.find(m => m.id === p.new.id)) return prev;
                if (p.new.sender_id !== seekerId) markAsRead();
                return [...prev, p.new];
            });
            setTimeout(scrollToBottom, 100);
        }).subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [message.id]);

    const fetchConvLabels = async () => {
        const { data } = await supabase.from('conversation_labels').select('label:label_id (id, name, color)').eq('conversation_id', message.id);
        if (data) setConvLabels(data.map((cl: any) => cl.label));
    };

    const toggleLabel = async (labelId: string) => {
        const isSelected = convLabels.some(l => l.id === labelId);
        try {
            if (isSelected) await supabase.from('conversation_labels').delete().eq('conversation_id', message.id).eq('label_id', labelId);
            else await supabase.from('conversation_labels').insert({ conversation_id: message.id, label_id: labelId });
            fetchConvLabels();
        } catch (err) { console.error(err); }
    };

    const markAsRead = async () => {
        if (!seekerId) return;
        try { await supabase.from('messages').update({ is_read: true }).eq('conversation_id', message.id).neq('sender_id', seekerId).eq('is_read', false); }
        catch (err) { console.error(err); }
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    const fetchMessages = async () => {
        setLoading(true);
        const { data } = await supabase.from('messages').select('*').eq('conversation_id', message.id).order('created_at', { ascending: true });
        if (data) setMessages(data);
        setLoading(false);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !seekerId || sending) return;
        setSending(true);
        const content = newMessage.trim();
        setNewMessage('');
        try {
            const { data } = await supabase.from('messages').insert({ conversation_id: message.id, sender_id: seekerId, content, type: 'text' }).select().single();
            if (data) setMessages(prev => [...prev, data]);
            await supabase.from('conversations').update({ last_message: content, last_message_at: new Date().toISOString() }).eq('id', message.id);
        } catch (err: any) { alert(err.message); } finally { setSending(false); scrollToBottom(); }
    };

    const togglePin = async () => {
        const newVal = !isPinned;
        setIsPinned(newVal);
        try { await supabase.from('conversations').update({ is_pinned_seeker: newVal }).eq('id', message.id); } catch (err) { console.error(err); }
    };

    const handleArchive = async () => {
        const newVal = !isArchived;
        setIsArchived(newVal);
        try { await supabase.from('conversations').update({ is_archived_seeker: newVal }).eq('id', message.id); if (newVal) onBack(); } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this conversation?")) return;
        try { await supabase.from('conversations').delete().eq('id', message.id); onBack(); }
        catch (err) { console.error(err); }
    };

    return (
        <div className="flex h-full flex-col lg:flex-row font-outfit">
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-100">
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
                                        <Briefcase size={10} /> {message.role}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                    {loading ? (
                        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.sender_id === seekerId;
                            return (
                                <div key={msg.id || idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse text-right' : ''}`}>
                                    <img src={isMe ? seekerPhoto : message.avatar} alt={isMe ? 'Me' : message.sender} className="w-10 h-10 rounded-full bg-white object-cover ring-2 ring-white shadow-sm shrink-0" />
                                    <div className={`flex-1 space-y-2`}>
                                        <div className={`flex items-baseline gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <h4 className="font-black text-slate-900 text-sm">{isMe ? seekerName : message.sender}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={`text-sm font-medium leading-relaxed p-4 rounded-2xl shadow-sm inline-block max-w-[80%] text-left ${isMe ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 shrink-0">
                    <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/50 transition-all shadow-sm">
                        <textarea rows={3} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type your message here..." className="w-full p-4 text-sm font-medium text-slate-700 outline-none resize-none bg-white placeholder:text-slate-300" />
                        <div className="flex items-center justify-end p-3 bg-white">
                            <button type="submit" disabled={!newMessage.trim() || sending} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50">
                                {sending ? 'Sending...' : <><Send size={14} /> Send Message</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="w-80 bg-white shrink-0 h-full overflow-y-auto border-l border-slate-100 hidden xl:block">
                <div className="p-8 text-center border-b border-slate-100">
                    <div className="w-24 h-24 rounded-full bg-slate-50 mx-auto mb-4 overflow-hidden border-2 border-slate-100 p-4">
                        <img src={message.avatar} alt={message.sender} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tighter">{message.sender}</h3>
                    <div className="grid grid-cols-4 gap-2 mt-6">
                        <button onClick={togglePin} className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${isPinned ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
                            <Pin size={18} className={isPinned ? 'fill-primary' : ''} />
                            <span className="text-[9px] font-bold">Pin</span>
                        </button>
                        <div className="relative">
                            <button onClick={() => setShowLabelMenu(!showLabelMenu)} className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all w-full ${showLabelMenu || convLabels.length > 0 ? 'text-secondary font-bold' : 'text-slate-400 hover:text-secondary'}`}>
                                <Tag size={18} className={convLabels.length > 0 ? 'fill-secondary text-secondary' : ''} />
                                <span className="text-[9px] font-bold">Label</span>
                            </button>
                            {showLabelMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[60] p-1.5">
                                    <p className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 mb-1">Select Labels</p>
                                    {allLabels.length === 0 ? <p className="px-3 py-4 text-xs font-bold text-slate-400 text-center">No labels yet</p> :
                                        allLabels.map(l => {
                                            const isSelected = convLabels.some(cl => cl.id === l.id);
                                            return (
                                                <button key={l.id} onClick={() => toggleLabel(l.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />{l.name}</div>
                                                    {isSelected && <CheckCircle size={14} className="text-secondary" />}
                                                </button>
                                            );
                                        })
                                    }
                                </div>
                            )}
                        </div>
                        <button onClick={handleArchive} className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${isArchived ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
                            <Archive size={18} className={isArchived ? 'fill-primary' : ''} />
                            <span className="text-[10px] font-bold">Archive</span>
                        </button>
                        <div className="relative">
                            <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="flex flex-col items-center gap-2 p-2 rounded-xl text-slate-400 hover:text-primary transition-all w-full">
                                <MoreHorizontal size={18} />
                                <span className="text-[9px] font-bold">More</span>
                            </button>
                            {showMoreMenu && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 p-1">
                                    <button onClick={handleDelete} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left cursor-pointer"><Trash2 size={12} /> Delete Thread</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">About Company</h4>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Building2 size={14} /></div>
                            <span className="truncate">{message.employer?.company_name || 'Hiring Manager'}</span>
                        </div>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                        <button onClick={() => navigate(`/company/${message.employer_id}`)} className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2 font-outfit font-bold"><Building2 size={14} /> View Company</button>
                        {interview && <button onClick={() => navigate('/seeker/calendar')} className="w-full py-3.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 font-outfit font-bold"><Calendar size={14} /> View Scheduled Interview</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeekerConversation;
