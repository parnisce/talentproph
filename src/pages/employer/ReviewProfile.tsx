import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Zap,
    Briefcase,
    Download,
    ExternalLink,
    ShieldCheck,
    FileText,
    User,
    Calendar,
    Trash2,
    UserCheck,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for profiles
const mockApplicantsData: Record<string, any> = {
    'a1': {
        id: 'a1',
        name: 'Cyryl Bitangcol',
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
        role: 'Senior Video Editor & Storyteller',
        location: 'Manila, Philippines',
        email: 'cyryl.b@example.com',
        phone: '+63 912 345 6789',
        experience: '5+ Years',
        appliedPoints: 50,
        status: 'Shortlisted',
        bio: "Passionate storyteller with a focus on high-retention long-form YouTube content. I've worked with channels totaling over 5M subscribers, specializing in technical editing and dynamic motion graphics. My goal is to transform complex ideas into engaging visual journeys.",
        testScores: {
            iq: 138,
            english: 'C2 (Expert)',
            disc: { D: 36, I: 24, S: 22, C: 17 }
        },
        skills: ['Adobe Premiere Pro', 'After Effects', 'Davinci Resolve', 'Color Grading', 'Sound Design', 'Motion Graphics', 'Storyboarding'],
        history: [
            { company: 'TechVibe YouTube Channel', role: 'Lead Video Editor', period: '2021 - Present', description: 'Managed a team of 3 editors. Responsible for final cut of weekly 20min technical deep-dives. Grew retention by 15% through improved pacing.' },
            { company: 'CreativeFlow Media', role: 'Senior Editor', period: '2019 - 2021', description: 'Handled high-end commercial edits for international brands. Specialized in motion-heavy social media ads.' }
        ],
        portfolio: [
            { title: 'Project: Mastering AI (1M+ Views)', link: '#' },
            { title: 'Commercial: CyberSable 2024', link: '#' }
        ],
        resume_url: "#",
        application: {
            subject: "Application for YouTube Video Editor",
            message: "Hello! I saw your post for the YouTube Video Editor role and immediately felt my style matches your brand. I've been following your channel for 2 years and understand the pacing you're looking for. Attached is my latest showreel. I'm ready to bring my expertise to your team!"
        }
    }
};

const ScheduleInterviewModal = ({ isOpen, onClose, applicant, onSchedule }: { isOpen: boolean; onClose: () => void; applicant: any; onSchedule: (details: any) => void }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('Virtual');
    const [details, setDetails] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const scheduledAt = new Date(`${date}T${time}`).toISOString();
            onSchedule({ date, time, location, details, notes, scheduledAt });
        } catch (err) {
            console.error("Error formatting date:", err);
            alert("Please provide a valid date and time.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden"
            >
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Schedule Interview</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">For {applicant?.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Method</label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                        >
                            <option value="Virtual">Virtual (Zoom/Google Meet)</option>
                            <option value="In-Person">In-Person Office</option>
                            <option value="Phone">Phone Call</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Details (Link/Address)</label>
                        <input
                            type="text"
                            placeholder="e.g. meet.google.com/xyz or Office address"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Notes</label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-6 py-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary transition-all resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 px-10 py-5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const ReviewProfile = () => {
    const { applicantId } = useParams();
    const navigate = useNavigate();
    const [applicant, setApplicant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isAlreadyScheduled, setIsAlreadyScheduled] = useState(false);
    const [activeInterview, setActiveInterview] = useState<any>(null);

    useEffect(() => {
        const fetchApplicantData = async () => {
            if (!applicantId) return;
            setLoading(true);
            try {
                // Fetch application with seeker profile and job details
                const { data, error } = await supabase
                    .from('job_applications')
                    .select(`
                        *,
                        profiles:seeker_id (
                            full_name,
                            avatar_url,
                            title,
                            location,
                            email,
                            phone,
                            experience_years,
                            iq,
                            english_proficiency,
                            disc_scores,
                            skills_list,
                            bio,
                            resume_url,
                            expected_salary
                        ),
                        job_posts!inner (
                            id,
                            title,
                            employer_id
                        )
                    `)
                    .eq('id', applicantId)
                    .single();

                if (error) throw error;

                if (data) {
                    const mapped = {
                        id: data.id,
                        job_id: data.job_id,
                        seeker_id: data.seeker_id,
                        employer_id: data.job_posts?.employer_id,
                        name: data.profiles?.full_name || 'Anonymous',
                        photo: data.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.seeker_id}`,
                        role: data.profiles?.title || 'Job Seeker',
                        location: data.profiles?.location || 'Remote',
                        email: data.profiles?.email || 'N/A',
                        phone: data.profiles?.phone || 'N/A',
                        experience: data.profiles?.experience_years || 'N/A',
                        status: data.status || 'New',
                        appliedPoints: data.points_used || 0,
                        bio: data.profiles?.bio || data.message || "No bio provided.",
                        testScores: {
                            iq: data.profiles?.iq || 0,
                            english: data.profiles?.english_proficiency || 'N/A',
                            disc: data.profiles?.disc_scores || { D: 0, I: 0, S: 0, C: 0 }
                        },
                        skills: data.profiles?.skills_list || [],
                        resume_url: data.profiles?.resume_url || "#",
                        history: [],
                        portfolio: [],
                        application: {
                            subject: data.subject || `Application for ${data.job_posts?.title}`,
                            message: data.message || "No message provided."
                        }
                    };
                    setApplicant(mapped);

                    // 2. Fetch Interview Status
                    const { data: interviewData } = await supabase
                        .from('interviews')
                        .select('*')
                        .eq('application_id', applicantId)
                        .order('scheduled_at', { ascending: false })
                        .limit(1);

                    if (interviewData && interviewData.length > 0) {
                        const latest = interviewData[0];
                        const isFuture = new Date(latest.scheduled_at) > new Date();
                        if (isFuture) {
                            setIsAlreadyScheduled(true);
                            setActiveInterview(latest);
                        } else {
                            setIsAlreadyScheduled(false);
                            setActiveInterview(null);
                        }
                    }
                } else {
                    const mockData = mockApplicantsData['a1'];
                    setApplicant(mockData);
                }
            } catch (err) {
                console.error("Error fetching applicant:", err);
                setApplicant(mockApplicantsData['a1']);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicantData();
    }, [applicantId]);

    const handleScheduleInterview = async (details: any) => {
        try {
            // 1. Create Interview Record
            const { error: interviewError } = await supabase
                .from('interviews')
                .insert([{
                    application_id: applicant.id,
                    employer_id: applicant.employer_id,
                    seeker_id: applicant.seeker_id,
                    job_id: applicant.job_id,
                    scheduled_at: details.scheduledAt,
                    location_type: details.location,
                    location_details: details.details,
                    notes: details.notes
                }]);

            if (interviewError) throw interviewError;

            // 2. Update Application Status
            const { error: appError } = await supabase
                .from('job_applications')
                .update({ status: 'Interviewed' })
                .eq('id', applicant.id);

            if (appError) throw appError;

            // 3. Update Local State
            setApplicant((prev: any) => ({ ...prev, status: 'Interviewed' }));
            setIsAlreadyScheduled(true);
            setActiveInterview(details);
            setIsScheduleModalOpen(false);
            alert("Interview successfully scheduled!");
        } catch (err: any) {
            console.error("Error scheduling interview:", err);
            alert("Failed to schedule interview: " + (err.message || "Please ensure the 'interviews' table exists in your database."));
        }
    };

    const handleCancelInterview = async () => {
        if (!activeInterview?.id) return;
        if (!confirm("Are you sure you want to cancel this interview? This will remove it from the schedule.")) return;

        try {
            // 1. Delete Interview
            const { error: deleteError } = await supabase
                .from('interviews')
                .delete()
                .eq('id', activeInterview.id);

            if (deleteError) throw deleteError;

            // 2. Optional: Restore status to 'Shortlisted' if it was 'Interviewed'
            if (applicant.status === 'Interviewed') {
                const { error: appError } = await supabase
                    .from('job_applications')
                    .update({ status: 'Shortlisted' })
                    .eq('id', applicant.id);
                if (appError) throw appError;
                setApplicant((prev: any) => ({ ...prev, status: 'Shortlisted' }));
            }

            // 3. Reset local state
            setIsAlreadyScheduled(false);
            setActiveInterview(null);
            alert("Interview cancelled successfully.");
        } catch (err: any) {
            console.error("Error cancelling interview:", err);
            alert("Failed to cancel: " + err.message);
        }
    };

    const handleHireApplicant = async () => {
        if (!confirm(`Are you sure you want to HIRE ${applicant.name}? This will update their application status.`)) return;

        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: 'Hired' })
                .eq('id', applicant.id);

            if (error) throw error;

            setApplicant((prev: any) => ({ ...prev, status: 'Hired' }));
            alert("Congratulations! Candidate has been marked as HIRED.");
        } catch (err: any) {
            console.error("Error hiring applicant:", err);
            alert("Failed to hire: " + err.message);
        }
    };

    const handleRejectApplicant = async () => {
        if (!confirm(`Are you sure you want to REJECT ${applicant.name}?`)) return;

        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: 'Rejected' })
                .eq('id', applicant.id);

            if (error) throw error;

            setApplicant((prev: any) => ({ ...prev, status: 'Rejected' }));
            alert("Candidate has been rejected.");
        } catch (err: any) {
            console.error("Error rejecting applicant:", err);
            alert("Failed to reject: " + err.message);
        }
    };

    const handleShortlistApplicant = async () => {
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: 'Shortlisted' })
                .eq('id', applicant.id);

            if (error) throw error;

            setApplicant((prev: any) => ({ ...prev, status: 'Shortlisted' }));
            alert("Candidate has been shortlisted!");
        } catch (err: any) {
            console.error("Error shortlisting applicant:", err);
            alert("Failed to shortlist: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!applicant) return (
        <div className="text-center py-20">
            <p className="text-slate-500 italic">Applicant profile not found.</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold">Go Back</button>
        </div>
    );

    return (
        <div className="space-y-10 pb-32">
            <ScheduleInterviewModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                applicant={applicant}
                onSchedule={handleScheduleInterview}
            />

            {/* Header / Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest mb-4 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to List
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Review Profile</h1>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${applicant.status === 'Shortlisted' ? 'bg-amber-100 text-amber-600' :
                            applicant.status === 'New' || applicant.status === 'Interviewed' ? 'bg-blue-100 text-blue-600' :
                                applicant.status === 'Hired' ? 'bg-emerald-100 text-emerald-600' :
                                    applicant.status === 'Rejected' ? 'bg-rose-100 text-rose-600' :
                                        'bg-slate-100 text-slate-500'
                            }`}>
                            {applicant.status === 'Interviewed' ? 'Reviewed' : applicant.status}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 max-w-full">
                    {/* Rejected Button */}
                    {applicant.status !== 'Hired' && applicant.status !== 'Rejected' && (
                        <button
                            onClick={handleRejectApplicant}
                            className="p-4 bg-white border-2 border-slate-100 text-rose-500 rounded-2xl hover:bg-rose-50 transition-all shadow-sm"
                            title="Reject Candidate"
                        >
                            <XCircle size={22} />
                        </button>
                    )}

                    {/* Shortlist Button */}
                    {applicant.status !== 'Shortlisted' && applicant.status !== 'Hired' && applicant.status !== 'Rejected' && (
                        <button
                            onClick={handleShortlistApplicant}
                            className="p-4 bg-white border-2 border-slate-100 text-amber-500 rounded-2xl hover:bg-amber-50 transition-all shadow-sm"
                            title="Shortlist Candidate"
                        >
                            <Star size={22} />
                        </button>
                    )}

                    {/* Schedule / Cancel Button */}
                    <div className="relative group/cancel flex items-center gap-2">
                        <button
                            onClick={() => !isAlreadyScheduled && setIsScheduleModalOpen(true)}
                            title={isAlreadyScheduled && activeInterview ? `Next interview: ${new Date(activeInterview.scheduled_at).toLocaleString()}` : ''}
                            className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-3 ${isAlreadyScheduled
                                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100 shadow-none'
                                : 'bg-slate-900 text-white shadow-slate-900/10 hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            {isAlreadyScheduled ? (
                                <><CheckCircle2 size={18} /> Already Scheduled</>
                            ) : (
                                <><Calendar size={18} /> Schedule Interview</>
                            )}
                        </button>

                        {isAlreadyScheduled && (
                            <button
                                onClick={handleCancelInterview}
                                className="p-4 bg-white border-2 border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-50 transition-all shadow-sm"
                                title="Cancel Scheduled Interview"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>

                    {/* Hire Button */}
                    {applicant.status !== 'Hired' ? (
                        <button
                            onClick={handleHireApplicant}
                            className="px-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                        >
                            <UserCheck size={18} /> Hire Candidate
                        </button>
                    ) : (
                        <div className="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center gap-3">
                            <ShieldCheck size={18} /> Officially Hired
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Identity & Contact */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Identity Card */}
                    <div className="bg-white border-2 border-slate-50 p-10 rounded-[56px] shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] grayscale -translate-y-1/4 translate-x-1/4 pointer-events-none">
                            <User size={200} />
                        </div>

                        <div className="relative z-10">
                            <div className="relative inline-block mb-8">
                                <div className="w-40 h-40 rounded-[48px] bg-slate-100 overflow-hidden ring-[12px] ring-white shadow-2xl mx-auto transition-transform group-hover:rotate-3">
                                    <img src={applicant.photo} alt={applicant.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-full border-[6px] border-white flex items-center justify-center shadow-lg">
                                    <ShieldCheck size={18} />
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{applicant.name}</h2>
                            <p className="text-primary font-bold text-lg tracking-tight mb-8">{applicant.role}</p>

                            <div className="space-y-4 text-left border-t border-slate-50 pt-8 mt-8">
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <MapPin size={18} />
                                    </div>
                                    {applicant.location}
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    {applicant.email}
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Phone size={18} />
                                    </div>
                                    {applicant.phone}
                                </div>
                            </div>

                            <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                                <MessageSquare size={16} /> Send Message
                            </button>
                        </div>
                    </div>

                    {/* Talent Scores Card */}
                    <div className="bg-slate-900 p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden">
                        {/* Background glowing effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 text-center underline decoration-blue-500 underline-offset-8 relative z-10">Intelligence & Language</h4>

                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-[32px] text-center backdrop-blur-sm">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">IQ Score</p>
                                <p className="text-4xl font-black text-cyan-400 tracking-tighter drop-shadow-lg">{applicant.testScores.iq}</p>
                            </div>
                            <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-[32px] text-center backdrop-blur-sm">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">English</p>
                                <p className="text-2xl font-black text-purple-400 tracking-tighter leading-9 drop-shadow-lg">
                                    {applicant.testScores?.english?.split(' ')[0] || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6 relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-10 mb-6">DISC Personality Profile</p>
                            <div className="space-y-5">
                                {Object.entries(applicant.testScores.disc).map(([key, value]: [string, any]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[11px] font-black tracking-widest text-white">{key}</span>
                                            <span className="text-xs font-black text-blue-400">{value}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Cover Letter Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border-2 border-slate-50 p-12 rounded-[56px] shadow-sm relative overflow-hidden"
                    >
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary absolute top-12 right-12 flex items-center gap-2">
                            <Zap size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{applicant.appliedPoints} Points Charged</span>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 underline decoration-slate-100 underline-offset-8">Cover Letter</h4>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">"{applicant.application.subject}"</h3>
                            <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 italic">
                                "{applicant.application.message}"
                            </p>
                        </div>
                    </motion.div>

                    {/* Bio & Skills */}
                    <div className="bg-white border-2 border-slate-50 p-12 rounded-[56px] shadow-sm space-y-12">
                        <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Professional Bio</h4>
                            <p className="text-slate-600 font-medium leading-[1.8] text-lg">{applicant.bio}</p>
                        </section>

                        <section className="pt-10 border-t border-slate-50">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Expertise & Stack</h4>
                            <div className="flex flex-wrap gap-3">
                                {applicant.skills.map((skill: string) => (
                                    <span key={skill} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 hover:bg-primary transition-all cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Work Experience */}
                    <div className="bg-white border-2 border-slate-50 p-12 rounded-[56px] shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">Relevant Experience</h4>
                        <div className="space-y-12">
                            {applicant.history.map((job: any, idx: number) => (
                                <div key={idx} className="relative pl-12 border-l-2 border-slate-100 group">
                                    <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-100 border-4 border-white group-hover:bg-primary group-hover:scale-125 transition-all" />
                                    <div className="space-y-3">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <h5 className="text-xl font-black text-slate-900 tracking-tighter">{job.role}</h5>
                                            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{job.period}</span>
                                        </div>
                                        <p className="font-bold text-primary flex items-center gap-2">
                                            <Briefcase size={16} /> {job.company}
                                        </p>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">{job.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio & Documents */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border-2 border-slate-50 p-10 rounded-[56px] shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Portfolio Highlights</h4>
                            <div className="space-y-4">
                                {applicant.portfolio.map((item: any, idx: number) => (
                                    <a key={idx} href={item.link} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary group transition-all">
                                        <span className="font-bold text-sm text-slate-900">{item.title}</span>
                                        <ExternalLink size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="bg-primary/5 border-2 border-primary/10 p-10 rounded-[56px] shadow-sm group cursor-pointer hover:bg-primary transition-all">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:text-white/40 mb-8">Documents</h4>
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                    <FileText size={32} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-900 group-hover:text-white tracking-tighter leading-none mb-1">resume_cyryl_2024.pdf</p>
                                    <p className="text-[10px] font-black text-primary/60 group-hover:text-white/50 uppercase tracking-widest">PDF • 2.4 MB</p>
                                </div>
                                <Download size={22} className="text-primary group-hover:text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Resume / CV Section */}
                    {applicant.resume_url && (
                        <div className="bg-slate-900 border-2 border-slate-800 p-12 rounded-[56px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] grayscale -translate-y-1/2 translate-x-1/4 pointer-events-none text-white">
                                <FileText size={300} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-4 text-center md:text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Verified Document</h4>
                                    <h3 className="text-3xl font-black text-white tracking-tighter">Candidate Resume / CV</h3>
                                    <p className="text-slate-400 font-medium max-w-md">Review the candidate's full professional history, certifications, and academic background in detail.</p>
                                </div>
                                <a
                                    href={applicant.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-12 py-5 bg-white text-slate-900 rounded-[28px] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-500 hover:text-white transition-all flex items-center gap-3 active:scale-95 group-hover:scale-105"
                                >
                                    <Download size={20} /> Download Resume
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewProfile;
