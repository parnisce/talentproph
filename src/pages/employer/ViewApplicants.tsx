import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Search,
    MessageSquare,
    Star,
    XCircle,
    User,
    ExternalLink,
    Briefcase,
    Zap,
    Download,
    Target,
    X,
    Send,
    Pin,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';

const ViewApplicants = () => {
    const { id } = useParams();
    const { id: employerId } = useUser();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [savedTalents, setSavedTalents] = useState<any[]>([]);
    const [jobTitle, setJobTitle] = useState('Position');
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Bulk Message State
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [bulkMessage, setBulkMessage] = useState('');
    const [sendingBulk, setSendingBulk] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!employerId) return;
            setLoading(true);
            try {
                // Fetch Job Title if specific ID
                if (id && id !== 'all') {
                    const { data: jobData } = await supabase
                        .from('job_posts')
                        .select('title')
                        .eq('id', id)
                        .single();
                    if (jobData) setJobTitle(jobData.title);
                } else if (id === 'all') {
                    setJobTitle('All Active Candidates');
                }

                // Fetch Applicants
                let query = supabase
                    .from('job_applications')
                    .select(`
                        *,
                        profiles:seeker_id (*),
                        job_posts!inner (
                            title,
                            employer_id
                        )
                    `)
                    .eq('job_posts.employer_id', employerId);

                if (id && id !== 'all') {
                    query = query.eq('job_id', id);
                }

                const { data, error } = await query;

                if (error) throw error;

                if (data) {
                    const mappedApplicants = data.map(app => {
                        const appliedDate = new Date(app.created_at);
                        const isRecent = (new Date().getTime() - appliedDate.getTime()) < 24 * 60 * 60 * 1000;

                        let displayStatus = app.status || 'New';

                        // Logic: "New" tag only for first 24 hours. After that, it becomes "Applied" (hidden from New tab)
                        if (displayStatus === 'New' && !isRecent) {
                            displayStatus = 'Applied';
                        }

                        // Map DB 'Interviewed' to UI 'Reviewed'
                        if (displayStatus === 'Interviewed') {
                            displayStatus = 'Reviewed';
                        }

                        return {
                            id: app.id,
                            seekerId: app.seeker_id,
                            name: app.profiles?.full_name || 'Anonymous Seeker',
                            photo: app.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.seeker_id}`,
                            role: app.profiles?.title || 'Job Seeker',
                            experience: app.profiles?.experience_years || 'No',
                            appliedDate: appliedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                            status: displayStatus,
                            originalStatus: app.status, // Keep track of DB status
                            topSkills: app.profiles?.skills_list?.slice(0, 3) || [],
                            score: app.profiles?.talent_score || (app.profiles?.iq ? Math.min(Math.round((app.profiles.iq / 160) * 100), 100) : 85),
                            verified: app.profiles?.is_verified_pro,
                        };
                    });
                    setApplicants(mappedApplicants);
                }

                // Fetch Saved Talents (Bookmarked)
                const { data: savedData, error: savedError } = await supabase
                    .from('saved_talents')
                    .select(`
                        *,
                        profiles:seeker_id (*)
                    `)
                    .eq('employer_id', employerId);

                if (!savedError && savedData) {
                    const mappedSaved = savedData.map(s => ({
                        id: `saved_${s.id}`,
                        seekerId: s.seeker_id,
                        name: s.profiles?.full_name || 'Anonymous Seeker',
                        photo: s.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.seeker_id}`,
                        role: s.profiles?.title || 'Job Seeker',
                        experience: s.profiles?.experience_years || 'No',
                        appliedDate: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                        status: 'Bookmarked',
                        topSkills: s.profiles?.skills_list?.slice(0, 3) || [],
                        score: s.profiles?.talent_score || 85,
                        verified: s.profiles?.is_verified_pro,
                        isBookmarked: true
                    }));
                    setSavedTalents(mappedSaved);
                }
            } catch (err) {
                console.error("Error fetching applicants:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, employerId]);


    const handleMessageAll = async () => {
        if (!bulkMessage.trim() || !employerId) return;
        setSendingBulk(true);

        try {
            // Send to all CURRENTLY FILTERED applicants
            const targets = filteredApplicants;

            for (const app of targets) {
                // Find or Create Conversation
                const { data: conv } = await supabase
                    .from('conversations')
                    .select('id')
                    .eq('employer_id', employerId)
                    .eq('seeker_id', app.seekerId)
                    .eq('job_id', id === 'all' ? null : id)
                    .maybeSingle();

                let conversationId = conv?.id;

                if (!conversationId) {
                    const { data: newConv, error: createError } = await supabase
                        .from('conversations')
                        .insert({
                            employer_id: employerId,
                            seeker_id: app.seekerId,
                            job_id: id === 'all' ? null : id,
                            last_message: bulkMessage,
                            last_message_at: new Date().toISOString()
                        })
                        .select()
                        .single();

                    if (createError) continue;
                    conversationId = newConv.id;
                }

                // Send Message
                await supabase.from('messages').insert({
                    conversation_id: conversationId,
                    sender_id: employerId,
                    content: bulkMessage,
                    type: 'text'
                });

                // Update Conversation
                await supabase.from('conversations')
                    .update({ last_message: bulkMessage, last_message_at: new Date().toISOString() })
                    .eq('id', conversationId);
            }

            alert(`Successfully sent message to ${targets.length} candidates!`);
            setIsBulkModalOpen(false);
            setBulkMessage('');
        } catch (err) {
            console.error("Error sending bulk messages:", err);
            alert("An error occurred while sending messages.");
        } finally {
            setSendingBulk(false);
        }
    };

    const handleSingleMessage = async (applicant: any) => {
        if (!employerId) return;
        try {
            const { data: conv } = await supabase
                .from('conversations')
                .select('id')
                .eq('employer_id', employerId)
                .eq('seeker_id', applicant.seekerId)
                .eq('job_id', id === 'all' ? null : id)
                .maybeSingle();

            let conversationId = conv?.id;

            if (!conversationId) {
                const { data: newConv } = await supabase
                    .from('conversations')
                    .insert({
                        employer_id: employerId,
                        seeker_id: applicant.seekerId,
                        job_id: id === 'all' ? null : id,
                        last_message: 'Conversation Started',
                        last_message_at: new Date().toISOString()
                    })
                    .select()
                    .single();
                conversationId = newConv.id;
            }

            navigate(`/employer/messages?conversationId=${conversationId}`);
        } catch (err) {
            console.error("Error starting conversation:", err);
        }
    };

    const filteredApplicants = (filter === 'Bookmarked' ? savedTalents : applicants).filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || filter === 'Bookmarked' || app.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate('/employer/posts')}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest mb-4 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Posts
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Applicants</h1>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mt-1">
                            {applicants.length} Total
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium mt-1">Reviewing candidates for <span className="text-slate-900 font-bold">"{jobTitle}"</span>.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-3"
                    >
                        <MessageSquare size={18} /> Message All
                    </button>
                    <button className="px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all shadow-sm flex items-center gap-2">
                        <Download size={18} /> Export List
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white border-2 border-slate-50 p-6 rounded-[32px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-3">
                    {['All', 'Bookmarked', 'New', 'Shortlisted', 'Reviewed', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === status
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Applicants List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredApplicants.map((applicant, idx) => (
                        <motion.div
                            key={applicant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white border-2 border-slate-50 p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-10">
                                {/* Profile & Basic Info */}
                                <div className="flex items-center gap-8 flex-1">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-[32px] bg-slate-100 overflow-hidden ring-[6px] ring-white shadow-xl group-hover:scale-105 transition-transform">
                                            <img src={applicant.photo} alt={applicant.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg ${applicant.verified ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                            <ShieldCheck size={14} />
                                        </div>
                                        {applicant.isBookmarked && (
                                            <div className="absolute -top-2 -left-2 bg-primary text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg rotate-12">
                                                <Pin size={12} fill="white" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{applicant.name}</h3>
                                            {applicant.verified ? (
                                                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 self-center">
                                                    <ShieldCheck size={12} className="text-emerald-500" /> PRO
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 flex items-center gap-1.5 self-center">
                                                    <ShieldCheck size={12} className="text-slate-300" /> BASIC
                                                </div>
                                            )}
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${applicant.status === 'Shortlisted' ? 'bg-amber-100 text-amber-600' :
                                                applicant.status === 'New' ? 'bg-primary/10 text-primary' :
                                                    applicant.status === 'Bookmarked' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>
                                                {applicant.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 font-medium text-sm">
                                            <span className="flex items-center gap-2"><Target size={14} className="text-primary" /> {applicant.role}</span>
                                            <span className="flex items-center gap-2 font-bold text-slate-900"><Briefcase size={14} /> {applicant.experience} Exp</span>
                                            <span className="flex items-center gap-2"><Zap size={14} /> {applicant.status === 'Bookmarked' ? 'Pinned' : 'Applied'} {applicant.appliedDate}</span>
                                        </div>
                                        <div className="flex flex-wrap grow gap-2 mt-4">
                                            {applicant.topSkills.map((skill: string) => (
                                                <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Score & Actions */}
                                <div className="flex flex-col md:flex-row items-center gap-10 lg:pr-4">
                                    <div className="text-center md:text-right">
                                        <div className="flex items-center justify-center md:justify-end gap-2 text-primary mb-1">
                                            <Star size={20} fill="currentColor" />
                                            <span className="text-3xl font-black tracking-tighter leading-none">{applicant.score}%</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Talent Score</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleSingleMessage(applicant)}
                                            className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all border border-slate-100 group/btn shadow-sm"
                                        >
                                            <MessageSquare size={20} />
                                        </button>
                                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100 group/btn shadow-sm">
                                            <XCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/profile/${applicant.seekerId}`)}
                                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2"
                                        >
                                            {applicant.status === 'Bookmarked' ? 'View Profile' : 'Review Profile'} <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] grayscale -translate-y-1/4 translate-x-1/4 pointer-events-none">
                                <User size={180} />
                            </div>
                        </motion.div>
                    ))}
                    {filteredApplicants.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto border-2 border-dashed border-slate-200">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">No candidates found</h3>
                            <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bulk Message Modal */}
            <AnimatePresence>
                {isBulkModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border-2 border-slate-50"
                        >
                            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Message Candidates</h2>
                                    <p className="text-slate-500 text-sm font-medium">Sending to {filteredApplicants.length} filtered candidates</p>
                                </div>
                                <button
                                    onClick={() => setIsBulkModalOpen(false)}
                                    className="p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all shadow-sm border border-slate-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-10 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                                    <textarea
                                        value={bulkMessage}
                                        onChange={(e) => setBulkMessage(e.target.value)}
                                        placeholder="Type your message to all candidates..."
                                        className="w-full h-48 px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[32px] text-sm font-bold focus:outline-none focus:border-primary/20 focus:bg-white transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setIsBulkModalOpen(false)}
                                        className="px-8 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-600 transition-all font-outfit"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleMessageAll}
                                        disabled={sendingBulk || !bulkMessage.trim()}
                                        className="px-10 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:scale-100 font-outfit"
                                    >
                                        {sendingBulk ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ViewApplicants;
