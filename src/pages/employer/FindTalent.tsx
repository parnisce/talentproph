import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search,
    Users,
    DollarSign,
    ChevronRight,
    Clock,
    Plus,
    X,
    Pin,
    Eye,
    ChevronDown,
    HelpCircle
} from 'lucide-react';
import { supabase } from '../../services/supabase';

const FindTalent = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [talents, setTalents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // Sidebar Filter States
    const [employmentType, setEmploymentType] = useState('Any');
    const [availabilityRange, setAvailabilityRange] = useState({ min: 2, max: 12 });
    const [salaryRange, setSalaryRange] = useState({ min: 2, max: 40 });
    const [idProofScore, setIdProofScore] = useState('Any');
    const [lastActive, setLastActive] = useState('Any');
    const [iqScore, setIqScore] = useState('Any');
    const [englishScore, setEnglishScore] = useState('Any');

    // Checkbox Filters
    const [searchDescriptions, setSearchDescriptions] = useState(false);
    const [searchNames, setSearchNames] = useState(false);
    const [includeHired, setIncludeHired] = useState(false);

    // Skill Filters
    const [activeSkills, setActiveSkills] = useState<string[]>([]);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    const fetchTalents = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('profiles')
                .select('*', { count: 'exact' })
                .eq('role', 'seeker');

            // 1. Core Search Logic (Search Bar)
            if (searchQuery) {
                const searchTerms = searchQuery.trim().split(/\s+/);
                let searchClauses: string[] = [];

                // Searching for the full phrase first
                searchClauses.push(`title.ilike.%${searchQuery}%`);
                searchClauses.push(`full_name.ilike.%${searchQuery}%`);
                searchClauses.push(`bio.ilike.%${searchQuery}%`);

                // Tokenized search for keywords in title/bio
                searchTerms.forEach(term => {
                    if (term.length > 2) {
                        searchClauses.push(`title.ilike.%${term}%`);
                        searchClauses.push(`bio.ilike.%${term}%`);
                    }
                });

                // Skill matching: using overlap && for array
                // We'll also try to match terms individually against the array
                if (searchTerms.length > 0) {
                    const skillsArray = `{${searchTerms.join(',')}}`;
                    searchClauses.push(`skills.ov.${skillsArray}`);
                }

                query = query.or(searchClauses.join(','));
            }

            // 2. Active Skill Filters (Sidebar Chips)
            if (activeSkills.length > 0) {
                // Seeker must have ALL of these skills
                query = query.contains('skills', activeSkills);
            }

            // 3. Sidebar Numeric/Status Filters
            if (employmentType !== 'Any') {
                query = query.eq('availability', employmentType);
            }

            if (idProofScore !== 'Any') {
                const score = parseInt(idProofScore);
                if (!isNaN(score)) query = query.gte('talent_score', score);
            }

            if (iqScore !== 'Any') {
                const score = parseInt(iqScore);
                if (!isNaN(score)) query = query.gte('iq', score);
            }

            if (englishScore !== 'Any') {
                query = query.eq('english', englishScore);
            }

            // Salary Range Filtering (Simulated if DB schema is text)
            // Ideally should be numeric columns.

            const { data, error, count } = await query;

            if (error) throw error;

            if (data) {
                const mappedData = data.map(profile => ({
                    id: profile.id,
                    name: profile.full_name || 'Anonymous Seeker',
                    photo: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
                    title: profile.title || 'Specialist',
                    location: profile.location || 'Remote',
                    rate: profile.expected_salary || '$5.00/hour',
                    skills: profile.skills || [],
                    talentScore: profile.talent_score || 85,
                    iq: profile.iq || 120,
                    availability: profile.availability || 'Full-time',
                    verified: profile.is_verified_pro,
                    bio: profile.bio || 'I am a dedicated professional with expertise in delivering high-quality results. My goal is to exceed client expectations through innovation and technical excellence.',
                    education: profile.education || 'Bachelors degree',
                    lastActive: 'Today'
                }));
                setTalents(mappedData);
                setTotalCount(count || 0);
            }
        } catch (err) {
            console.error("Error fetching talent:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSearchQuery(initialQuery);
        fetchTalents();
    }, [
        initialQuery,
        employmentType,
        availabilityRange,
        salaryRange,
        idProofScore,
        lastActive,
        iqScore,
        englishScore,
        searchDescriptions,
        searchNames,
        includeHired,
        activeSkills
    ]);

    const addSkillFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (newSkill.trim() && !activeSkills.includes(newSkill.trim())) {
            setActiveSkills([...activeSkills, newSkill.trim()]);
            setNewSkill('');
            setIsAddingSkill(false);
        }
    };

    const removeSkillFilter = (skillToRemove: string) => {
        setActiveSkills(activeSkills.filter(s => s !== skillToRemove));
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/employer/talent?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            {/* Top Search Area */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={24} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Try: graphics designer, facebook ads, lead generation..."
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-bold focus:outline-none focus:border-primary/20 focus:bg-white transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
                    >
                        Search
                    </button>
                    <a href="#" className="text-secondary text-sm font-bold hover:underline hidden lg:block whitespace-nowrap">
                        Better Search Results?
                    </a>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sidebar Filters */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Skill Filters</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {activeSkills.map(skill => (
                                    <span key={skill} className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary border border-primary/10 rounded-xl text-[10px] font-bold">
                                        {skill}
                                        <button onClick={() => removeSkillFilter(skill)} className="hover:text-primary/70 transition-colors">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {!isAddingSkill ? (
                                <button
                                    onClick={() => setIsAddingSkill(true)}
                                    className="text-secondary text-xs font-black hover:underline flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add skill filters
                                </button>
                            ) : (
                                <form onSubmit={addSkillFilter} className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Enter skill..."
                                        className="flex-1 bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs font-bold outline-none focus:border-primary/30"
                                    />
                                    <button type="submit" className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                                        <Plus size={14} />
                                    </button>
                                    <button type="button" onClick={() => setIsAddingSkill(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                        <X size={14} />
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employment Type</label>
                                <div className="relative">
                                    <select
                                        value={employmentType}
                                        onChange={(e) => setEmploymentType(e.target.value)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10"
                                    >
                                        <option>Any</option>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Availability (Hours per day)</label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                        <input
                                            type="number"
                                            value={availabilityRange.min}
                                            onChange={(e) => setAvailabilityRange({ ...availabilityRange, min: parseInt(e.target.value) })}
                                            className="w-full pl-8 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                                        />
                                    </div>
                                    <span className="text-slate-300">—</span>
                                    <div className="relative flex-1">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                        <input
                                            type="number"
                                            value={availabilityRange.max}
                                            onChange={(e) => setAvailabilityRange({ ...availabilityRange, max: parseInt(e.target.value) })}
                                            className="w-full pl-8 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hourly Salary Between (USD)</label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                        <input
                                            type="number"
                                            value={salaryRange.min}
                                            onChange={(e) => setSalaryRange({ ...salaryRange, min: parseInt(e.target.value) })}
                                            className="w-full pl-8 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                                        />
                                    </div>
                                    <span className="text-slate-300">—</span>
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                        <input
                                            type="number"
                                            value={salaryRange.max}
                                            onChange={(e) => setSalaryRange({ ...salaryRange, max: parseInt(e.target.value) })}
                                            className="w-full pl-8 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                    ID Proof Score <HelpCircle size={12} />
                                </label>
                                <div className="relative">
                                    <select
                                        value={idProofScore}
                                        onChange={(e) => setIdProofScore(e.target.value)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10"
                                    >
                                        <option>Any</option>
                                        <option>40+</option>
                                        <option>60+</option>
                                        <option>80+</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IQ Score</label>
                                <div className="relative">
                                    <select
                                        value={iqScore}
                                        onChange={(e) => setIqScore(e.target.value)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10"
                                    >
                                        <option>Any</option>
                                        <option>100+</option>
                                        <option>120+</option>
                                        <option>130+</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">English Score</label>
                                <div className="relative">
                                    <select
                                        value={englishScore}
                                        onChange={(e) => setEnglishScore(e.target.value)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10"
                                    >
                                        <option>Any</option>
                                        <option>Advanced</option>
                                        <option>Intermediate</option>
                                        <option>Fluent</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Active</label>
                                <div className="relative">
                                    <select
                                        value={lastActive}
                                        onChange={(e) => setLastActive(e.target.value)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10"
                                    >
                                        <option>Any</option>
                                        <option>Today</option>
                                        <option>This Week</option>
                                        <option>This Month</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${searchDescriptions ? 'bg-primary border-primary' : 'border-slate-200 group-hover:border-primary/50'}`}>
                                        {searchDescriptions && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={searchDescriptions} onChange={() => setSearchDescriptions(!searchDescriptions)} />
                                    <span className="text-[13px] font-bold text-slate-600">Search Profile Descriptions</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${searchNames ? 'bg-primary border-primary' : 'border-slate-200 group-hover:border-primary/50'}`}>
                                        {searchNames && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={searchNames} onChange={() => setSearchNames(!searchNames)} />
                                    <span className="text-[13px] font-bold text-slate-600">Search Name</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${includeHired ? 'bg-primary border-primary' : 'border-slate-200 group-hover:border-primary/50'}`}>
                                        {includeHired && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={includeHired} onChange={() => setIncludeHired(!includeHired)} />
                                    <span className="text-[13px] font-bold text-slate-600">Include Hired Profiles</span>
                                </label>
                            </div>

                            <button
                                onClick={fetchTalents}
                                className="w-full py-4 mt-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                            >
                                Refine Search Results
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Results Area */}
                <div className="lg:col-span-9 space-y-10">
                    <div className="flex items-center justify-between px-2">
                        <p className="text-[15px] font-bold text-slate-500">
                            Found <span className="text-slate-900 font-black">{totalCount}</span> jobseekers.
                        </p>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(p => (
                                <button key={p} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-100 text-slate-400 hover:border-primary/30'}`}>
                                    {p}
                                </button>
                            ))}
                            <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {loading ? (
                            <div className="space-y-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm animate-pulse h-80" />
                                ))}
                            </div>
                        ) : talents.length > 0 ? (
                            talents.map((talent) => (
                                <motion.div
                                    key={talent.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row gap-12 relative z-10">
                                        {/* Avatar Column */}
                                        <div className="flex flex-col items-center gap-6 shrink-0">
                                            <div className="w-36 h-36 rounded-[48px] bg-slate-100 overflow-hidden ring-[10px] ring-white shadow-2xl transition-transform group-hover:scale-105">
                                                <img src={talent.photo} alt={talent.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                                                <span className="text-sm">{talent.talentScore}</span> ID PROOF
                                            </div>
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1 space-y-8 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                <div>
                                                    <h3 className="text-2xl font-black text-secondary hover:underline cursor-pointer tracking-tighter decoration-primary decoration-4 underline-offset-4">{talent.name}</h3>
                                                    <h4 className="text-xl font-black text-slate-900 mt-1 tracking-tight">{talent.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group/pin">
                                                        <Pin size={20} className="group-hover/pin:rotate-45 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/employer/applicants/review/${talent.id}`)}
                                                        className="px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                    >
                                                        <Eye size={18} /> View Profile
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Looking For</p>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-black text-slate-800">{talent.availability} (8 hours/day)</p>
                                                        <p className="text-sm font-black text-secondary">at {talent.rate} <span className="text-slate-400 font-bold ml-1">($1,200.00/month)</span></p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Education</p>
                                                    <p className="text-sm font-black text-slate-800">{talent.education}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Last Active</p>
                                                    <p className="text-sm font-black text-slate-800">{talent.lastActive}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Profile Description</p>
                                                <p className="text-[15px] font-medium text-slate-500 leading-relaxed line-clamp-3 italic">
                                                    "{talent.bio}"
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Top Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {talent.skills.map((skill: string) => (
                                                        <span key={skill} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 shadow-sm">
                                                            {skill}: <span className="text-slate-400">1 - 2 years</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fancy background accent */}
                                    <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                        <Users size={300} />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white rounded-[56px] border-2 border-dashed border-slate-100 p-24 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mx-auto mb-6">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">No experts found matching these filters</h3>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">
                                    Try expanding your search query or adjusting your sidebar filters for better results.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchNames(false);
                                        setSearchDescriptions(false);
                                        fetchTalents();
                                    }}
                                    className="mt-10 px-10 py-4 bg-primary text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindTalent;
