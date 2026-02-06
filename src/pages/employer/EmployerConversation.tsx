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
    Clock,
    GraduationCap,
    MapPin,
    AlertCircle,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ConversationProps {
    message: any;
    onBack: () => void;
}

const EmployerConversation = ({ message, onBack }: ConversationProps) => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [isPinned, setIsPinned] = useState(message?.pinned || false);
    const [isArchived, setIsArchived] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const handleViewProfile = () => {
        // Redirect to seeker profile page
        // Assuming the route is /seeker/profile/:id or similar
        // For now, redirecting to a generic seeker profile view or the review page
        navigate(`/employer/applicants/review/${message.id}`);
    };

    const togglePin = () => setIsPinned(!isPinned);

    const handleArchive = () => {
        setIsArchived(!isArchived);
        // In a real app, this would update the backend/message list state
        // onBack(); // Optional: go back to list after archiving
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
                            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{message.subject}</h2>
                            {message.role && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                        {message.role} <button className="hover:text-rose-500">×</button>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                    {/* Employer Message Example */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10">
                            <BriefcaseIcon className="text-white" size={20} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-baseline justify-between">
                                <h4 className="font-black text-slate-900 text-sm">Digital Legends Agency</h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Feb 3, 2026, 10:23 PM</span>
                            </div>
                            <div className="text-sm font-medium text-slate-600 space-y-2">
                                <p>Hi Good Evening <a href="#" className="text-primary hover:underline font-bold">https://meet.google.com/uah-ryke-mgw</a></p>
                            </div>
                        </div>
                    </div>

                    {/* Applicant Message Example */}
                    <div className="flex gap-4">
                        <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full bg-slate-100 object-cover ring-2 ring-white shadow-sm shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-baseline justify-between">
                                <div className="space-y-0.5">
                                    <h4 className="font-black text-slate-900 text-sm">{message.sender}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold">&lt;jfrancisramos028@gmail.com&gt;</p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Feb 4, 2026, 09:20 AM</span>
                            </div>

                            <div className="text-sm font-medium text-slate-700 leading-relaxed bg-white p-6 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm space-y-4">
                                <p>Hi Good Morning!</p>
                                <p>I just saw your message this morning, could we reschedule the interview? Maybe we should agree on a specific date and time or better if you are using something like google calendar for scheduling appointments.</p>
                            </div>

                            <div className="bg-slate-100 px-4 py-2 rounded-lg inline-block">
                                <span className="text-[10px] font-bold text-slate-500">First contacted for Job: <a href="#" className="text-primary hover:underline">Frontend Developer with UI/UX & API Integration Expertise</a></span>
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
                    <div className="flex gap-4 mt-3 text-[10px] font-bold text-slate-400">
                        <button className="hover:text-primary transition-colors">What do you think about this application?</button>
                        <span className="flex gap-2">
                            <a href="#" className="text-primary hover:underline">Love it!</a> |
                            <a href="#" className="text-primary hover:underline">Didn't follow directions</a> |
                            <a href="#" className="text-primary hover:underline">Unqualified</a>
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Applicant Details */}
            <div className="w-96 bg-white shrink-0 h-full overflow-y-auto border-l border-slate-100 relative">
                <div className="p-8 text-center border-b border-slate-100">
                    <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto mb-4 overflow-hidden ring-4 ring-slate-50 shadow-xl">
                        <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">{message.sender}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">Full-stack Web Developer | React • Laravel</p>

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

                    <button className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-primary transition-all group">
                        <Tag size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Label</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-emerald-500 transition-all group">
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
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left">
                                    <AlertCircle size={16} /> Mark as Spam
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Contact Me</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={12} /></div>
                                jfrancisramos028@gmail.com
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={12} /></div>
                                +639173694774
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400"><Globe size={12} /></div>
                                <a href="#" className="underline">https://jayme.is-a.dev/</a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex gap-3">
                            <Clock size={16} className="text-primary shrink-0" />
                            <div className="text-xs">
                                <p className="font-bold text-slate-900">Looking for <span className="text-primary">full-time</span> work (8 hours/day)</p>
                                <p className="font-medium text-slate-500 mt-1">at $8.66/hour ($1,523.28/month)</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-4" /> {/* Spacer */}
                            <p className="text-xs font-bold text-slate-400">Last Active: <span className="text-slate-600">2 days ago</span></p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex gap-3">
                            <GraduationCap size={16} className="text-slate-400 shrink-0" />
                            <div className="text-xs">
                                <p className="font-bold text-slate-900">Educational Attainment: <span className="font-medium text-slate-500">Bachelor's Degree</span></p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <BriefcaseIcon size={16} className="text-slate-400 shrink-0" />
                            <div className="text-xs space-y-2">
                                <p className="font-bold text-slate-900">Experience Overview:</p>
                                <p className="font-medium text-slate-500 leading-relaxed">
                                    I'm a passionate Full-Stack Web Developer with over a year of hands-on experience building and maintaining scalable web applications. My primary focus is on React (JS/TS) and Laravel...
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <button
                            onClick={handleViewProfile}
                            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <User size={14} /> View Full Profile
                        </button>
                        <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2">
                            <MapPin size={14} /> Background Data Check
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BriefcaseIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

export default EmployerConversation;
