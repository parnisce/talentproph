import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Search,
    MessageSquare,
    ShieldCheck,
    CheckCircle2,
    User,
    ExternalLink,
    Briefcase,
    Star,
    X,
    Download,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../services/supabase';

const ReviewModal = ({ isOpen, onClose, applicantName, onSubmit, isSubmitting }: any) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hover, setHover] = useState(0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
            >
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">Review {applicantName}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate Performance</p>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    <Star
                                        size={32}
                                        className={`${star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Review Message</label>
                        <textarea
                            rows={4}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder={`Share your experience working with ${applicantName}...`}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                        />
                    </div>

                    <button
                        onClick={() => onSubmit(rating, review)}
                        disabled={isSubmitting || rating === 0 || !review.trim()}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const HiredCandidates = () => {
    const { id: employerId } = useUser();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchHired = async () => {
            if (!employerId) return;
            setLoading(true);
            try {
                // Fetch applications where status is 'Hired' and belongs to this employer
                const { data, error } = await supabase
                    .from('job_applications')
                    .select(`
                        *,
                        profiles:seeker_id (
                            full_name,
                            avatar_url,
                            title,
                            experience_years,
                            skills_list,
                            iq,
                            talent_score
                        ),

                        job_posts!inner (
                            title,
                            employer_id
                        )
                    `)
                    .eq('job_posts.employer_id', employerId)
                    .eq('status', 'Hired');

                if (error) throw error;

                if (data) {
                    const mapped = data.map(app => ({
                        id: app.id,
                        seekerId: app.seeker_id,
                        jobId: app.job_id,
                        name: app.profiles?.full_name || 'Anonymous',
                        photo: app.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.seeker_id}`,
                        role: app.profiles?.title || 'Team Member',
                        jobTitle: app.job_posts?.title,
                        experience: app.profiles?.experience_years || 'N/A',
                        hiredDate: new Date(app.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                        status: 'Hired',
                        topSkills: app.profiles?.skills_list?.slice(0, 3) || [],
                        score: app.profiles?.talent_score || (app.profiles?.iq ? Math.min(Math.round((app.profiles.iq / 160) * 100), 100) : 85),
                    }));

                    setApplicants(mapped);
                }
            } catch (err) {
                console.error("Error fetching hired candidates:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHired();
    }, [employerId]);

    const handleOpenReview = (applicant: any) => {
        setSelectedApplicant(applicant);
        setIsModalOpen(true);
    };

    const handleSubmitReview = async (rating: number, review: string) => {
        if (!selectedApplicant || !employerId) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .insert({
                    seeker_id: selectedApplicant.seekerId,
                    employer_id: employerId,
                    job_id: selectedApplicant.jobId,
                    rating,
                    review_text: review
                });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    alert("You have already reviewed this candidate for this job.");
                } else {
                    throw error;
                }
            } else {
                alert("Review submitted successfully!");
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredApplicants = applicants.filter(app => {
        return app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
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
            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                applicantName={selectedApplicant?.name}
                onSubmit={handleSubmitReview}
                isSubmitting={isSubmitting}
            />
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate('/employer')}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest mb-4 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Hired Team</h1>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest mt-1">
                            {applicants.length} Members
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium mt-1">Manage your successfully hired candidates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all shadow-sm flex items-center gap-2">
                        <Download size={18} /> Export List
                    </button>
                    <button className="px-8 py-3.5 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                        <ShieldCheck size={18} /> Team Settings
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border-2 border-slate-50 p-6 rounded-[32px] shadow-sm flex items-center gap-6">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or job title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Hired List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredApplicants.map((applicant, idx) => (
                        <motion.div
                            key={applicant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white border-2 border-slate-50 p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group overflow-hidden relative"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-10">
                                {/* Profile & Basic Info */}
                                <div className="flex items-center gap-8 flex-1">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-[32px] bg-slate-100 overflow-hidden ring-[6px] ring-white shadow-xl group-hover:scale-105 transition-transform">
                                            <img src={applicant.photo} alt={applicant.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                            <ShieldCheck size={14} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{applicant.name}</h3>
                                            <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600">
                                                HIRED
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 font-medium text-sm">
                                            <span className="flex items-center gap-2 font-bold text-slate-900"><Briefcase size={14} /> {applicant.jobTitle}</span>
                                            <span className="flex items-center gap-2"><Zap size={14} /> Hired {applicant.hiredDate}</span>
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

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <button
                                        className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100 group/btn shadow-sm"
                                        title="Send Message"
                                    >
                                        <MessageSquare size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenReview(applicant)}
                                        className="px-6 py-4 bg-white border-2 border-slate-100 text-slate-500 hover:border-yellow-400 hover:text-yellow-500 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <Star size={16} /> Write Review
                                    </button>
                                    <button
                                        onClick={() => navigate(`/employer/applicants/review/${applicant.id}`)}
                                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2"
                                    >
                                        View Profile <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] grayscale -translate-y-1/4 translate-x-1/4 pointer-events-none">
                                <CheckCircle2 size={180} />
                            </div>
                        </motion.div>
                    ))}
                    {filteredApplicants.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto border-2 border-dashed border-slate-200">
                                <User size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">No hired candidates yet</h3>
                            <p className="text-slate-500 font-medium">Once you hire applicants, they will appear here.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HiredCandidates;
