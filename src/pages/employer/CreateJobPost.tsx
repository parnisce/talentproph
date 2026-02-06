import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';
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
    Calendar,
    Target,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const CreateJobPost = () => {
    const navigate = useNavigate();
    const { id, company, company_logo, location, name } = useUser();
    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Creative & Design',
        engagement: 'Full-Time (40h/week)',
        preview: '',
        description: '',
        salary: '',
        period: 'Per Month'
    });

    const handleAddSkill = () => {
        if (currentSkill && !skills.includes(currentSkill)) {
            setSkills([...skills, currentSkill]);
            setCurrentSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleLaunch = async () => {
        if (!formData.title || !formData.description || !formData.salary) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('job_posts')
                .insert([
                    {
                        employer_id: id,
                        title: formData.title,
                        category: formData.category,
                        engagement: formData.engagement,
                        preview: formData.preview,
                        description: formData.description,
                        salary: formData.salary,
                        period: formData.period,
                        skills: skills,
                        company_name: company || name,
                        company_logo: company_logo,
                        location: location || 'Remote',
                        status: 'active'
                    }
                ]);

            if (error) throw error;

            alert('Job post launched successfully!');
            navigate('/employer/posts');
        } catch (error: any) {
            console.error('Error launching job:', error);
            alert('Failed to launch job: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Create New Position</h1>
                    <p className="text-slate-500 font-medium mt-1">Fill in the details to find your next remote rockstar.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/employer/posts')}
                        className="px-8 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleLaunch}
                        disabled={loading}
                        className="px-10 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        <Zap size={18} /> {loading ? 'Launching...' : 'Launch Post'}
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
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Senior YouTube Video Editor"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category*</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                                    value={formData.engagement}
                                    onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
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
                                value={formData.preview}
                                onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
                                placeholder="A 1-sentence hook to grab attention..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Requirements & Responsibilities*</label>
                            <textarea
                                rows={8}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                            value={formData.salary}
                                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                            placeholder="e.g. $800 - $1,200"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period</label>
                                    <select
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
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

                {/* Sidebar Preview / Info */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-8">
                        {/* Posting Preview Card */}
                        <div className="bg-slate-900 p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <ShieldCheck size={180} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">TalentPro Standard</h4>
                                <div className="space-y-10">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                                            <Target className="text-primary" size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg tracking-tight mb-1">Precision Match</p>
                                            <p className="text-white/40 text-xs font-medium leading-relaxed">Your post will be analyzed by our AI to match with the most relevant candidates first.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                                            <Calendar className="text-secondary" size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg tracking-tight mb-1">Boost Period</p>
                                            <p className="text-white/40 text-xs font-medium leading-relaxed">New posts receive 48h of "Hot Position" status on the main seeker job board.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl">
                                    <p className="text-[11px] font-bold text-white/60 leading-relaxed italic">
                                        "Posts with clear salary ranges and detailed skill tags get <span className="text-white font-black">2.5x more</span> qualified applications."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Post Checklist */}
                        <div className="bg-primary/5 border border-primary/10 p-10 rounded-[48px]">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Pro Checklist</h4>
                            <div className="space-y-4">
                                {[
                                    'Clear Job Title',
                                    'Budget Indicated',
                                    'Skills Specified',
                                    'Detailed Responsibilities',
                                    'Company Description'
                                ].map(task => (
                                    <div key={task} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-md border-2 border-primary/20 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-primary/20" />
                                        </div>
                                        <span className="text-[11px] font-extrabold text-slate-500">{task}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateJobPost;
