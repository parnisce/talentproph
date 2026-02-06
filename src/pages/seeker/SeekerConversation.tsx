import {
    ArrowLeft,
    MoreHorizontal,
    Paperclip,
    Archive,
    Pin,
    Bold,
    Italic,
    Underline,
    List,
    AlignLeft,
    Image,
    Send,
    Globe,
    MapPin,
    AlertCircle,
    Trash2,
    Building2,
    Briefcase
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ConversationProps {
    message: any;
    onBack: () => void;
}

const SeekerConversation = ({ message, onBack }: ConversationProps) => {
    const navigate = useNavigate();
    const [isPinned, setIsPinned] = useState(message?.pinned || false);
    const [isArchived, setIsArchived] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const togglePin = () => setIsPinned(!isPinned);
    const handleArchive = () => setIsArchived(!isArchived);

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
                            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{message.subject}</h2>
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

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                    {/* Company Message (Incoming) */}
                    <div className="flex gap-4">
                        <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-xl bg-slate-100 object-cover ring-2 ring-white shadow-sm shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-baseline justify-between">
                                <div className="space-y-0.5">
                                    <h4 className="font-black text-slate-900 text-sm">{message.sender}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold">Recruiter</p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{message.date}</span>
                            </div>

                            <div className="text-sm font-medium text-slate-700 leading-relaxed bg-white p-6 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm space-y-4">
                                <p>Hi! We've reviewed your profile and we're very interested in your experience with React and Node.js.</p>
                                <p>Are you available for a quick 15-minute introductory call later this week? Let us know your availability.</p>
                            </div>
                        </div>
                    </div>

                    {/* Me (Outgoing) Loop for mock - if we had outgoing messages */}
                    <div className="flex gap-4 flex-row-reverse">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 text-white font-black text-xs">
                            ME
                        </div>
                        <div className="flex-1 space-y-2 text-right">
                            <div className="flex items-baseline justify-between flex-row-reverse">
                                <h4 className="font-black text-slate-900 text-sm">You</h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Feb 6, 2026, 10:15 AM</span>
                            </div>
                            <div className="text-sm font-medium text-white leading-relaxed bg-primary p-6 rounded-2xl rounded-tr-none shadow-lg shadow-primary/20 text-left">
                                <p>Hi! Thank you for reaching out. Yes, I am available this Thursday or Friday afternoon (EST). Looking forward to it!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="p-6 bg-white border-t border-slate-100 shrink-0">
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
                                <button key={idx} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                    <tool.icon size={16} />
                                </button>
                            ))}
                            <div className="h-4 w-px bg-slate-200 mx-1" />
                            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                <Paperclip size={16} />
                            </button>
                        </div>

                        {/* Textarea */}
                        <textarea
                            rows={4}
                            placeholder="Type your reply here..."
                            className="w-full p-4 text-sm font-medium text-slate-700 outline-none resize-none bg-white placeholder:text-slate-300"
                        />

                        {/* Footer */}
                        <div className="flex items-center justify-end p-3 bg-white">
                            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2">
                                <Send size={14} /> Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Company Details */}
            <div className="w-80 bg-white shrink-0 h-full overflow-y-auto border-l border-slate-100 hidden xl:block">
                <div className="p-8 text-center border-b border-slate-100">
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 mx-auto mb-4 overflow-hidden border-2 border-slate-100 p-4">
                        <img src={message.avatar} alt={message.sender} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tighter">{message.sender}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 flex items-center justify-center gap-1">
                        <MapPin size={12} /> New York, USA
                    </p>

                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={togglePin}
                            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-all border border-slate-100 group ${isPinned ? 'text-primary border-primary/20 bg-primary/5' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            <Pin size={16} className={`group-hover:scale-110 transition-transform ${isPinned ? 'fill-primary' : ''}`} />
                            <span className="text-[10px] font-bold">Pin</span>
                        </button>
                        <button
                            onClick={handleArchive}
                            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-all border border-slate-100 group ${isArchived ? 'text-primary border-primary/20 bg-primary/5' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            <Archive size={16} className={`group-hover:scale-110 transition-transform ${isArchived ? 'fill-primary' : ''}`} />
                            <span className="text-[10px] font-bold">Archive</span>
                        </button>
                        <button
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-all border border-slate-100 group text-slate-400 hover:text-slate-900 relative`}
                        >
                            <MoreHorizontal size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold">More</span>
                            {showMoreMenu && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left cursor-pointer">
                                        <Trash2 size={12} /> Delete Thread
                                    </div>
                                    <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors text-left cursor-pointer">
                                        <AlertCircle size={12} /> Report
                                    </div>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">About Company</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Globe size={14} /></div>
                                <span className="truncate">https://company.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Building2 size={14} /></div>
                                <span className="truncate">Tech & Software</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50">
                        <button
                            onClick={() => navigate(`/seeker/company/${message.id}`)}
                            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <Building2 size={14} /> View Company
                        </button>
                        <button
                            className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                        >
                            <CalendarIcon size={14} /> Schedule Meeting
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simplified icon component for missing Lucide icon if needed, or use existing Lucide icons
const CalendarIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);

export default SeekerConversation;
