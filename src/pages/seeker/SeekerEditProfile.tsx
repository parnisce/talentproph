import { useState, useRef } from 'react';
import {
    Save,
    ArrowLeft,
    User,
    Briefcase,
    GraduationCap,
    Globe,
    Camera,
    Trash2,
    Plus,
    MapPin,
    DollarSign,
    Share2,
    Shield,
    Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const SeekerEditProfile = () => {
    const navigate = useNavigate();
    const { userPhoto, updateUserPhoto, testScores, updateTestScores } = useUser();
    const [activeSection, setActiveSection] = useState('general');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const proofInputRef = useRef<HTMLInputElement>(null);
    const [proofImage, setProofImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    updateUserPhoto(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProofImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const sections = [
        { id: 'general', label: 'General Identity', icon: User },
        { id: 'assessments', label: 'Assessment Center', icon: Shield },
        { id: 'expertise', label: 'Domain Expertise', icon: Briefcase },
        { id: 'education', label: 'Background', icon: GraduationCap },
        { id: 'socials', label: 'Social Footprint', icon: Share2 },
    ];

    return (
        <div className="pb-32 relative">
            {/* Navigation & Header */}
            <div className="flex items-center justify-between mb-12 px-2">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/seeker/profile')}
                        className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black font-outfit tracking-tighter text-slate-900">Refine Your Profile</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">High-fidelity profile management</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <button className="px-6 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                        Discard Changes
                    </button>
                    <button
                        onClick={() => navigate('/seeker/profile')}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Save size={14} /> Commit Updates
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Section Navigation */}
                <div className="lg:col-span-1 space-y-3">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeSection === section.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                        >
                            <section.icon size={18} className={activeSection === section.id ? 'text-primary' : ''} />
                            {section.label}
                        </button>
                    ))}
                    <div className="mt-12 p-8 bg-primary/5 rounded-[32px] border border-primary/10">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl text-primary flex items-center justify-center mb-6">
                            <Shield size={20} />
                        </div>
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 leading-relaxed">Profile Visibility</h4>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed mb-6 italic">Your profile is currently <span className="text-primary uppercase">Public</span> and visible to premium employers.</p>
                        <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all">Make Private</button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* section: General */}
                    {activeSection === 'general' && (
                        <div className="bg-white rounded-[40px] border border-slate-100 p-10 md:p-14 shadow-sm space-y-12">
                            <div className="flex flex-col md:flex-row gap-12 items-center border-b border-slate-50 pb-12">
                                <div className="relative group">
                                    <div className="w-40 h-40 rounded-[48px] bg-slate-50 p-1 ring-1 ring-slate-100 overflow-hidden relative">
                                        <img
                                            src={userPhoto}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-[44px]"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer"
                                        >
                                            <Camera className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="space-y-4 flex-grow">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Identity Banner</h3>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">Update your professional portrait. We recommend a high-resolution headshot with a clean background. PNG or JPG, max 5MB.</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                        >
                                            Change Photo
                                        </button>
                                        <button
                                            onClick={() => updateUserPhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4")}
                                            className="px-6 py-2 bg-white border border-slate-100 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Legal Full Name</label>
                                    <input
                                        className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                        defaultValue="Cyryl Diamante Bitangcol"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Professional Headline</label>
                                    <input
                                        className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                        defaultValue="WordPress Expert | Web Developer | UI Generalist"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Personal Portfolio</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                            defaultValue="https://cyryldbitangcol.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Primary Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                            defaultValue="Manila, Philippines"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2.5 pt-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Professional Summary & Bio</label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-7 py-6 rounded-[32px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-medium text-sm leading-relaxed transition-all resize-none"
                                        defaultValue="Dynamic and results-oriented professional with over 8 years of experience in high-fidelity WordPress development and UI/UX design. Specialist in building responsive, conversion-focused websites for international clients."
                                    />
                                    <p className="text-[10px] text-slate-300 font-bold text-right mr-4 italic">Character Count: 214 / 2000</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* section: Assessments */}
                    {activeSection === 'assessments' && (
                        <div className="bg-white rounded-[40px] border border-slate-100 p-10 md:p-14 shadow-sm space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Psychometric Data</h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">IQ Assessment Score</label>
                                            <input
                                                type="number"
                                                className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                                value={testScores.iq}
                                                onChange={(e) => updateTestScores({ ...testScores, iq: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>

                                        <div className="space-y-6 pt-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">DISC Breakdown (%)</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { id: 'dominance', label: 'Dominance' },
                                                    { id: 'influence', label: 'Influence' },
                                                    { id: 'steadiness', label: 'Steadiness' },
                                                    { id: 'compliance', label: 'Compliance' }
                                                ].map((disc) => (
                                                    <div key={disc.id} className="relative">
                                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">{disc.label.charAt(0)}</span>
                                                        <input
                                                            type="number"
                                                            className="w-full pl-12 pr-6 py-4 rounded-[18px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                                            placeholder={disc.label}
                                                            value={testScores.disc[disc.id as keyof typeof testScores.disc]}
                                                            onChange={(e) => updateTestScores({
                                                                ...testScores,
                                                                disc: { ...testScores.disc, [disc.id]: parseInt(e.target.value) || 0 }
                                                            })}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 pt-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">English Proficiency Level</label>
                                            <select
                                                className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-black text-[13px] uppercase tracking-widest transition-all appearance-none"
                                                value={testScores.english}
                                                onChange={(e) => updateTestScores({ ...testScores, english: e.target.value })}
                                            >
                                                <option>A1 (Beginner)</option>
                                                <option>A2 (Elementary)</option>
                                                <option>B1 (Intermediate)</option>
                                                <option>B2 (Upper Intermediate)</option>
                                                <option>C1 (Advanced)</option>
                                                <option>C2 (Proficient / Native)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Verification Proof</h3>
                                    <div
                                        onClick={() => proofInputRef.current?.click()}
                                        className="aspect-video w-full rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all overflow-hidden relative"
                                    >
                                        {proofImage ? (
                                            <>
                                                <img src={proofImage} alt="Test Proof" className="absolute inset-0 w-full h-full object-cover p-2 rounded-[32px]" />
                                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <p className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                        <Upload size={14} /> Replace Proof
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 group-hover:text-primary transition-all">
                                                    <Camera size={28} />
                                                </div>
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Upload Test Results</p>
                                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-6">Upload a screenshot of your official test certificates or result pages.</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={proofInputRef}
                                        onChange={handleProofUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <p className="text-[10px] font-bold text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100 italic leading-relaxed">
                                        * Note: Our verification team will review uploaded screenshots. Fake results will lead to permanent account suspension.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* section: Expertise */}
                    {activeSection === 'expertise' && (
                        <div className="bg-white rounded-[40px] border border-slate-100 p-10 md:p-14 shadow-sm space-y-12">
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Core Competencies</h3>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                                        <Plus size={14} /> Add New Skill
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['WordPress Specialist', 'Figma UX/UI', 'After Effects', 'Process Analysis', 'Virtual Assistant', 'React.js', 'System Architecture'].map(skill => (
                                        <div key={skill} className="flex items-center gap-2 pl-5 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                                            {skill}
                                            <button className="p-1 hover:text-rose-500 transition-colors">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-12 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Expected Monthly Income (PHP)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="number"
                                            className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                            defaultValue="90000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Job Type Preference</label>
                                    <select className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-black text-[13px] uppercase tracking-widest transition-all appearance-none">
                                        <option>Full-Time (Remote)</option>
                                        <option>Part-Time (Remote)</option>
                                        <option>Project-Based</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other sections */}
                    {(activeSection === 'education' || activeSection === 'socials') && (
                        <div className="bg-white rounded-[40px] border border-slate-100 p-20 shadow-sm flex flex-col items-center justify-center text-center opacity-60">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                                <Plus size={32} className="text-slate-200" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">Configure {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
                            <p className="text-sm font-bold text-slate-400">Expand your profile by adding your {activeSection} history.</p>
                            <button className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Start Customizing</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-12 left-1/2 lg:left-[calc(50%+160px)] -translate-x-1/2 w-[90%] max-w-4xl z-50">
                <div className="bg-slate-900/90 backdrop-blur-xl p-4 md:p-6 rounded-[32px] border border-white/10 shadow-2xl flex items-center justify-between gap-6">
                    <div className="hidden md:flex flex-col ml-4">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Draft System Active</span>
                        <span className="text-white text-xs font-bold mt-1">Last synced 2 minutes ago</span>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-8 py-4 bg-white/5 text-white/70 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">Preview</button>
                        <button
                            onClick={() => navigate('/seeker/profile')}
                            className="flex-1 md:flex-none px-12 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                        >
                            <Save size={18} className="group-hover:scale-110 transition-transform" /> Save Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeekerEditProfile;
