import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    DollarSign,
    Type,
    AlignLeft,
    ListChecks,
    Plus,
    X,
    Zap,
    MapPin,
    Save
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for pre-filling
const mockJobs = [
    {
        id: '1',
        title: 'YouTube Video Editor (Long-form)',
        category: 'Creative & Design',
        engagement: 'Full-Time (40h/week)',
        preview: 'Looking for a master storyteller to edit 2 long-form videos per week.',
        description: 'We are a fast-growing tech channel looking for a Senior Video Editor who understands retention, pacing, and visual storytelling.\n\nResponsibilities:\n- Edit 15-20 minute long-form videos\n- Create engaging motion graphics\n- Collaborative script-to-screen process\n\nRequirements:\n- 3+ years experience with Premiere & After Effects\n- Portfolio of successful YT content',
        skills: ['Adobe Premiere Pro', 'After Effects', 'Color Grading', 'Sound Design'],
        salary: '$1,200 - $1,800',
        period: 'Per Month'
    },
    {
        id: '2',
        title: 'Social Media Manager',
        category: 'Marketing & Sales',
        engagement: 'Part-Time (20h/week)',
        preview: 'Manage and grow our community across Meta and TikTok.',
        description: 'Seeking a creative mind to handle our social presence.\n\nTasks:\n- Content scheduling\n- Community engagement\n- Ad campaign management',
        skills: ['Meta Ads', 'Copywriting', 'Canva', 'Analytics'],
        salary: '$600 - $900',
        period: 'Per Month'
    }
];

const EditJobPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState<any>(null);
    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState('');

    useEffect(() => {
        // Simulate fetching job data
        const job = mockJobs.find(j => j.id === id);
        if (job) {
            setJobData(job);
            setSkills(job.skills);
        } else {
            // Handle not found
            navigate('/employer/posts');
        }
    }, [id, navigate]);

    const handleAddSkill = () => {
        if (currentSkill && !skills.includes(currentSkill)) {
            setSkills([...skills, currentSkill]);
            setCurrentSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    if (!jobData) return null;

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
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Edit Position</h1>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest mt-1">ID: #{id}</span>
                    </div>
                    <p className="text-slate-500 font-medium mt-1">Update the details for "{jobData.title}".</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/employer/posts')}
                        className="px-8 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all"
                    >
                        Cancel Changes
                    </button>
                    <button className="px-10 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                        <Save size={18} /> Update Posting
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-2 border-slate-50 p-10 rounded-[48px] shadow-sm space-y-8"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Type size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Essential Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title*</label>
                                <input
                                    type="text"
                                    defaultValue={jobData.title}
                                    placeholder="e.g. Senior YouTube Video Editor"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category*</label>
                                <select
                                    defaultValue={jobData.category}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    <option>Creative & Design</option>
                                    <option>Development</option>
                                    <option>Marketing & Sales</option>
                                    <option>Administrative</option>
                                    <option>Writing & Core</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engagement Type</label>
                                <select
                                    defaultValue={jobData.engagement}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    <option>Full-Time (40h/week)</option>
                                    <option>Part-Time (20h/week)</option>
                                    <option>Gig / Project Based</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Location</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text"
                                        value="Remote (Worldwide)"
                                        disabled
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border-2 border-slate-50 p-10 rounded-[48px] shadow-sm space-y-8"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600">
                                <AlignLeft size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Job Description</h3>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Preview*</label>
                            <input
                                type="text"
                                defaultValue={jobData.preview}
                                placeholder="A 1-sentence hook to grab attention..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Requirements & Responsibilities*</label>
                            <textarea
                                rows={8}
                                defaultValue={jobData.description}
                                placeholder="List responsibilities, expectations, and why someone should join your team..."
                                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-medium leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                            />
                        </div>
                    </motion.div>

                    {/* Skills & compensation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border-2 border-slate-50 p-10 rounded-[48px] shadow-sm space-y-8"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                <ListChecks size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Expertise & Budget</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Required Skills</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={currentSkill}
                                        onChange={(e) => setCurrentSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                        placeholder="Add a skill (e.g. Adobe After Effects)"
                                        className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                                    />
                                    <button
                                        onClick={handleAddSkill}
                                        className="px-6 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary-deep transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {skills.map(skill => (
                                        <div key={skill} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                                            {skill}
                                            <button onClick={() => removeSkill(skill)} className="hover:text-rose-400 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {skills.length === 0 && <p className="text-[11px] font-bold text-slate-300 italic px-1">No skills added yet.</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salary Range / Rate*</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input
                                            type="text"
                                            defaultValue={jobData.salary}
                                            placeholder="e.g. $800 - $1,200"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period</label>
                                    <select
                                        defaultValue={jobData.period}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
                                    >
                                        <option>Per Month</option>
                                        <option>Per Week</option>
                                        <option>Per Hour</option>
                                        <option>Fixed Project Price</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-8">
                        {/* Status Widget */}
                        <div className="bg-white border-2 border-slate-50 p-10 rounded-[48px] shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Posting Status</h4>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-600">Live on Board</span>
                                    <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-600">Allow AI Matching</span>
                                    <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-50">
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                        Changes will be reflected immediately across all seeker dashboards.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pro Tips */}
                        <div className="bg-slate-900 p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <Zap size={180} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">Quick Advice</h4>
                                <div className="space-y-6 text-white/60 text-[11px] font-medium leading-relaxed">
                                    <p>• Avoid core changes to avoid confusing current applicants.</p>
                                    <p>• Adding "Urgent" to the preview can increase reach by 40%.</p>
                                    <p>• Keep skill tags focused—between 4 and 8 is the "sweet spot".</p>
                                </div>
                                <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-white/10 transition-all">
                                    Boost Performance
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditJobPost;
