import { useState, useRef, useEffect } from 'react';
import {
    Save,
    ArrowLeft,
    User,
    Briefcase,
    Globe,
    Camera,
    Trash2,
    Plus,
    MapPin,
    DollarSign,
    Share2,
    Shield,
    Upload,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    FileText,
    Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { calculateTalentScore } from '../../utils/talentScore';



const SeekerEditProfile = () => {
    const navigate = useNavigate();
    const { userPhoto, userName, title, website, location, bio, salary, education, experience, skills, linkedin, twitter, facebook, instagram, availability, banner_photo, resume_url, verification_proof_url, talent_score, updateUserProfile, testScores, updateTestScores } = useUser();

    const [activeSection, setActiveSection] = useState('general');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const proofInputRef = useRef<HTMLInputElement>(null);
    const [proofImage, setProofImage] = useState<string | null>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    // Local state for all form fields to ensure snappy typing without cursor jumps
    const [localProfile, setLocalProfile] = useState({
        name: userName || "",
        title: title || "",
        website: website || "",
        location: location || "",
        bio: bio || "",
        salary: salary || "",
        experience: experience || "",
        linkedin: linkedin || "",
        twitter: twitter || "",
        facebook: facebook || "",
        instagram: instagram || "",
        availability: availability || "Full-Time",
        education: education || "",
        banner_photo: banner_photo || "",
        resume_url: resume_url || ""
    });

    // Handle local change and sync to context/database
    const handleLocalChange = (field: string, value: string) => {
        setLocalProfile(prev => ({ ...prev, [field]: value }));
        updateUserProfile({ [field]: value });
    };

    // Assessment local state for stability
    const [localTestScores, setLocalTestScores] = useState(testScores);

    const handleAssessmentChange = (updates: any) => {
        const newScores = { ...localTestScores, ...updates };
        setLocalTestScores(newScores);
        updateTestScores(newScores);
        updateTalentScore();
    };

    const updateTalentScore = () => {
        // We call this after state updates to ensure we have the latest data
        // For simplicity, we calculate using current context data + whatever was just updated
        // In a real app, you might want to debounce this or do it in the context itself
    };


    // Sync local state when context data arrives (only once or when empty)
    useEffect(() => {
        // Only sync if local state is default/empty to avoid overwriting user typing
        if (userName && localProfile.name === "") {
            setLocalProfile(prev => ({ ...prev, name: userName }));
        }
        if (title && localProfile.title === "") {
            setLocalProfile(prev => ({ ...prev, title: title }));
        }
        if (bio && localProfile.bio === "") {
            setLocalProfile(prev => ({ ...prev, bio: bio }));
        }
        if (linkedin && localProfile.linkedin === "") {
            setLocalProfile(prev => ({ ...prev, linkedin: linkedin }));
        }
        if (twitter && localProfile.twitter === "") {
            setLocalProfile(prev => ({ ...prev, twitter: twitter }));
        }
        if (facebook && localProfile.facebook === "") {
            setLocalProfile(prev => ({ ...prev, facebook: facebook }));
        }
        if (instagram && localProfile.instagram === "") {
            setLocalProfile(prev => ({ ...prev, instagram: instagram }));
        }
        if (location && localProfile.location === "") {
            setLocalProfile(prev => ({ ...prev, location: location }));
        }
        if (website && localProfile.website === "") {
            setLocalProfile(prev => ({ ...prev, website: website }));
        }
        if (salary && localProfile.salary === "") {
            setLocalProfile(prev => ({ ...prev, salary: salary }));
        }
        if (experience && localProfile.experience === "") {
            setLocalProfile(prev => ({ ...prev, experience: experience }));
        }

        if (education && localProfile.education === "") {
            setLocalProfile(prev => ({ ...prev, education: education }));
        }
        if (availability && localProfile.availability === "Full-Time" && availability !== "Full-Time") {
            setLocalProfile(prev => ({ ...prev, availability: availability }));
        }
        if (banner_photo && localProfile.banner_photo === "") {
            setLocalProfile(prev => ({ ...prev, banner_photo: banner_photo }));
        }
        if (resume_url && localProfile.resume_url === "") {
            setLocalProfile(prev => ({ ...prev, resume_url: resume_url }));
        }

        // Sync test scores if they are currently 0/default
        if (testScores.iq !== 0 && localTestScores.iq === 0) {
            setLocalTestScores(testScores);
        }

        // Set initial proof image if it exists in context
        if (verification_proof_url && !proofImage) {
            setProofImage(verification_proof_url);
        }
    }, [userName, title, bio, linkedin, twitter, facebook, instagram, location, website, salary, experience, testScores, education, availability, banner_photo, resume_url, verification_proof_url]);

    // Update Talent Score whenever key data changes
    useEffect(() => {
        const profileData = {
            name: userName,
            photo: userPhoto,
            resume_url,
            education,
            iq: testScores.iq,
            verification_proof_url,
            skills,
            linkedin,
            twitter,
            facebook,
            instagram
        };
        const breakdown = calculateTalentScore(profileData);
        if (breakdown.total !== talent_score) {
            updateUserProfile({ talent_score: breakdown.total });
        }
    }, [userName, userPhoto, resume_url, education, testScores.iq, verification_proof_url, skills, linkedin, twitter, facebook, instagram]);


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target?.result) {
                    try {
                        await updateUserProfile({ photo: event.target.result as string });
                    } catch (err) {
                        console.error("Failed to update photo:", err);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target?.result) {
                    try {
                        const bannerSrc = event.target.result as string;
                        setLocalProfile(prev => ({ ...prev, banner_photo: bannerSrc }));
                        await updateUserProfile({ banner_photo: bannerSrc });
                    } catch (err) {
                        console.error("Failed to update banner:", err);
                        alert("Failed to save banner. Please ensure you have added the 'banner_url' column to your Supabase 'profiles' table.");
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target?.result) {
                    try {
                        const resumeData = event.target.result as string;
                        setLocalProfile(prev => ({ ...prev, resume_url: resumeData }));
                        await updateUserProfile({ resume_url: resumeData });
                    } catch (err) {
                        console.error("Failed to update resume:", err);
                        alert("Failed to save resume. Please ensure you have added the 'resume_url' column to your Supabase 'profiles' table.");
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target?.result) {
                    const proofData = event.target.result as string;
                    setProofImage(proofData);
                    await updateUserProfile({ verification_proof_url: proofData });
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const sections = [
        { id: 'general', label: 'General Identity', icon: User },
        { id: 'assessments', label: 'Assessment Center', icon: Shield },
        { id: 'expertise', label: 'Domain Expertise', icon: Briefcase },
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
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">Update your professional portrait. We recommend a high-resolution headshot. PNG or JPG, max 5MB.</p>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                        >
                                            Change Portrait
                                        </button>
                                        <button
                                            onClick={() => bannerInputRef.current?.click()}
                                            className="px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                        >
                                            Upload Banner
                                        </button>
                                        <input
                                            type="file"
                                            ref={bannerInputRef}
                                            onChange={handleBannerChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            onClick={() => updateUserProfile({ photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" })}
                                            className="px-6 py-2 bg-white border border-slate-100 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all font-outfit"
                                        >
                                            Reset Identity
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Legal Full Name</label>
                                    <input
                                        className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                        value={localProfile.name}
                                        onChange={(e) => handleLocalChange('name', e.target.value)}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Professional Headline</label>
                                    <input
                                        className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                        value={localProfile.title}
                                        onChange={(e) => handleLocalChange('title', e.target.value)}
                                        placeholder="e.g. Website Developer"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Highest Education Level</label>
                                    <select
                                        className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all appearance-none"
                                        value={localProfile.education}
                                        onChange={(e) => handleLocalChange('education', e.target.value)}
                                    >
                                        <option value="">Select Education</option>
                                        <option value="I did not graduate from high school">I did not graduate from high school</option>
                                        <option value="High school diploma">High school diploma</option>
                                        <option value="Associates degree">Associates degree</option>
                                        <option value="Bachelor's degree">Bachelor's degree</option>
                                        <option value="Post-graduate degree (Masters, Doctorate, etc.)">Post-graduate degree (Masters, Doctorate, etc.)</option>
                                    </select>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Availability Type</label>
                                    <select
                                        className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all appearance-none"
                                        value={localProfile.availability}
                                        onChange={(e) => handleLocalChange('availability', e.target.value)}
                                    >
                                        <option value="Full-Time">Full-Time (8+ hours/day)</option>
                                        <option value="Part-Time">Part-Time (4 hours/day)</option>
                                        <option value="Gig / Project-Based">Gig / Project-Based</option>
                                    </select>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Personal Portfolio</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                            value={localProfile.website}
                                            onChange={(e) => handleLocalChange('website', e.target.value)}
                                            placeholder="https://yourportfolio.com"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Primary Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                            value={localProfile.location}
                                            onChange={(e) => handleLocalChange('location', e.target.value)}
                                            placeholder="e.g. Manila, Philippines"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2.5 pt-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Professional Summary & Bio</label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-7 py-6 rounded-[32px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-medium text-sm leading-relaxed transition-all resize-none"
                                        value={localProfile.bio}
                                        onChange={(e) => handleLocalChange('bio', e.target.value)}
                                        placeholder="Tell employers about your professional journey..."
                                        autoComplete="off"
                                    />
                                    <p className="text-[10px] text-slate-300 font-bold text-right mr-4 italic">Character Count: {bio?.length || 0} / 2000</p>
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
                                                value={localTestScores.iq}
                                                onChange={(e) => handleAssessmentChange({ iq: parseInt(e.target.value) || 0 })}
                                                autoComplete="off"
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
                                                            value={localTestScores.disc[disc.id as keyof typeof localTestScores.disc]}
                                                            onChange={(e) => handleAssessmentChange({
                                                                disc: { ...localTestScores.disc, [disc.id]: parseInt(e.target.value) || 0 }
                                                            })}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 pt-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">English Proficiency Level</label>
                                            <select
                                                className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-black text-[13px] uppercase tracking-widest transition-all appearance-none"
                                                value={localTestScores.english}
                                                onChange={(e) => handleAssessmentChange({ english: e.target.value })}
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
                                    {skills && skills.length > 0 ? skills.map(skill => (
                                        <div key={skill} className="flex items-center gap-2 pl-5 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                                            {skill}
                                            <button
                                                onClick={() => updateUserProfile({ skills: skills.filter(s => s !== skill) })}
                                                className="p-1 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )) : (
                                        <p className="text-[10px] font-bold text-slate-300 italic">No skills added yet.</p>
                                    )}
                                    <div className="flex gap-2 w-full mt-4">
                                        <input
                                            type="text"
                                            placeholder="Add a skill (e.g. React)"
                                            className="flex-1 px-6 py-3 rounded-xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = (e.currentTarget as HTMLInputElement).value.trim();
                                                    if (val && !skills.includes(val)) {
                                                        updateUserProfile({ skills: [...skills, val] });
                                                        (e.currentTarget as HTMLInputElement).value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Expected Monthly Income (PHP)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                            value={localProfile.salary}
                                            onChange={(e) => handleLocalChange('salary', e.target.value)}
                                            placeholder="e.g. 50,000"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Years of Experience</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="number"
                                            className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                            value={localProfile.experience}
                                            onChange={(e) => handleLocalChange('experience', e.target.value)}
                                            placeholder="e.g. 5"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-4 pt-6 border-t border-slate-50 mt-4">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Professional Resume</h3>
                                    <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[32px] hover:border-primary transition-all group">
                                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                            <FileText size={32} />
                                        </div>
                                        <div className="flex-grow space-y-2 text-center md:text-left">
                                            <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">Upload your latest Resume</h4>
                                            <p className="text-xs font-bold text-slate-400 leading-relaxed">PDF, DOCX are supported. Max size 10MB. This will be visible to potential employers.</p>
                                        </div>
                                        <div className="shrink-0 flex gap-3">
                                            {localProfile.resume_url && (
                                                <a
                                                    href={localProfile.resume_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                                                >
                                                    <Eye size={14} /> View Current
                                                </a>
                                            )}
                                            <button
                                                onClick={() => resumeInputRef.current?.click()}
                                                className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                <Upload size={14} /> {localProfile.resume_url ? 'Replace' : 'Upload Resume'}
                                            </button>
                                            <input
                                                type="file"
                                                ref={resumeInputRef}
                                                onChange={handleResumeChange}
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* section: Socials */}
                    {activeSection === 'socials' && (
                        <div className="bg-white rounded-[40px] border border-slate-100 p-10 md:p-14 shadow-sm space-y-12">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Social Presence</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { id: 'linkedin', label: 'LinkedIn URL', icon: Linkedin, value: localProfile.linkedin },
                                    { id: 'twitter', label: 'Twitter / X URL', icon: Twitter, value: localProfile.twitter },
                                    { id: 'facebook', label: 'Facebook URL', icon: Facebook, value: localProfile.facebook },
                                    { id: 'instagram', label: 'Instagram URL', icon: Instagram, value: localProfile.instagram }
                                ].map((social) => (
                                    <div key={social.id} className="space-y-2.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">{social.label}</label>
                                        <div className="relative group">
                                            <social.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                                value={social.value}
                                                onChange={(e) => handleLocalChange(social.id, e.target.value)}
                                                placeholder={`https://${social.id}.com/your-profile`}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
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
