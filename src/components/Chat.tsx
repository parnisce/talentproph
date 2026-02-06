import { useState } from 'react';
import { Send, Search, Paperclip, MoreVertical, CheckCheck } from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
}

interface ChatProps {
    currentUser: { id: string; name: string; avatar?: string };
    recipient: { id: string; name: string; status: string; avatar?: string };
}

const Chat = ({ currentUser, recipient }: ChatProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', senderId: recipient.id, text: 'Hello! I saw your application for the VA role.', timestamp: '10:00 AM' },
        { id: '2', senderId: currentUser.id, text: 'Hi! Yes, I am very excited about the opportunity.', timestamp: '10:05 AM' },
        { id: '3', senderId: recipient.id, text: 'Great. Are you available for a quick sync tomorrow?', timestamp: '10:10 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg: Message = {
            id: Date.now().toString(),
            senderId: currentUser.id,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, msg]);
        setNewMessage('');
    };

    return (
        <div className="card p-0 flex flex-col h-[750px] overflow-hidden bg-white border-blue-50/50 shadow-2xl shadow-blue-500/5 rounded-[40px]">
            {/* Chat Header */}
            <div className="p-6 px-10 border-b border-blue-50 flex justify-between items-center bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center font-black text-xl text-primary shadow-inner">
                            {recipient.name[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary border-4 border-white rounded-full" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black font-outfit tracking-tight text-foreground">{recipient.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{recipient.status}</span>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Now</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-bg-main hover:bg-white hover:shadow-lg transition-all rounded-2xl text-muted-foreground hover:text-primary active:scale-95">
                        <Search size={20} />
                    </button>
                    <button className="p-3 bg-bg-main hover:bg-white hover:shadow-lg transition-all rounded-2xl text-muted-foreground hover:text-primary active:scale-95">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-[#f8fafc]/30">
                <div className="text-center mb-8">
                    <span className="px-4 py-1.5 bg-blue-50/50 rounded-full text-[10px] font-black text-primary/40 uppercase tracking-widest">Today, Feb 5</span>
                </div>

                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] group flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`p-5 px-7 rounded-[28px] shadow-sm relative transition-all duration-300 ${isMe ? 'bg-primary text-white rounded-tr-none shadow-primary/20 scale-[1.02]' : 'bg-white border border-blue-50 rounded-tl-none hover:shadow-lg hover:shadow-blue-500/5'}`}>
                                    <p className="text-[15px] font-medium leading-relaxed tracking-[0.01em]">{msg.text}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 px-1">
                                    {isMe && <CheckCheck size={14} className="text-primary" />}
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="p-8 px-10 border-t border-blue-50 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-4 items-center">
                    <div className="flex-1 relative flex items-center">
                        <button type="button" className="absolute left-4 p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Write your message here..."
                            className="w-full pl-14 pr-6 py-4 bg-[#f8fafc] border border-blue-50 rounded-[28px] focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none font-semibold text-sm transition-all shadow-inner"
                        />
                    </div>
                    <button type="submit" className="shrink-0 p-4 bg-primary text-white rounded-[24px] shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-primary-deep">
                        <Send size={24} />
                    </button>
                </form>
                <p className="text-center mt-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">End-to-end encrypted messaging</p>
            </div>
        </div>
    );
};

export default Chat;
