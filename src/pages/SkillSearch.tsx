import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search,
    ChevronRight,
    X,
    Pin,
    Eye,
    HelpCircle,
    Plus,
    ShieldCheck,
    Users,
    Star
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useUser } from '../context/UserContext';
import Navbar from '../components/Navbar';

const SkillSearch = () => {
    const { id: employerId, role } = useUser();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [talents, setTalents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

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
    const skillsParam = searchParams.get('skills');
    const initialActiveSkills = skillsParam ? skillsParam.split(',').filter(s => s) : [];
    const [activeSkills, setActiveSkills] = useState<string[]>(initialActiveSkills);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    // Saved Talents State
    const [savedTalentIds, setSavedTalentIds] = useState<string[]>([]);

    const fetchTalents = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('profiles')
                .select('*', { count: 'exact' })
                .eq('role', 'seeker');

            // 1. Core Search Logic (Search Bar)
            if (searchQuery) {
                const trimmedQuery = searchQuery.trim();
                const searchTerms = trimmedQuery.split(/[\s,]+/).filter(t => t.length >= 2);
                let searchClauses: string[] = [];

                searchClauses.push(`title.ilike.%${trimmedQuery}%`);
                if (searchNames) searchClauses.push(`full_name.ilike.%${trimmedQuery}%`);
                if (searchDescriptions) searchClauses.push(`bio.ilike.%${trimmedQuery}%`);

                if (searchTerms.length > 0) {
                    const variations = searchTerms.flatMap(term => [
                        term,
                        term.toLowerCase(),
                        term.charAt(0).toUpperCase() + term.slice(1).toLowerCase(),
                        term.toUpperCase()
                    ]);
                    const uniqueVariations = Array.from(new Set(variations));
                    const skillsArray = `{${uniqueVariations.join(',')}}`;

                    searchClauses.push(`skills_list.ov.${skillsArray}`);

                    searchTerms.forEach(term => {
                        searchClauses.push(`title.ilike.%${term}%`);
                        if (searchDescriptions) searchClauses.push(`bio.ilike.%${term}%`);
                        if (searchNames) searchClauses.push(`full_name.ilike.%${term}%`);
                    });
                }

                query = query.or(searchClauses.join(','));
            }

            // 2. Active Skill Filters (Sidebar Chips)
            if (activeSkills.length > 0) {
                // Use overlaps for OR logic (must have ANY of the selected skills)
                // We also include variations to handle case sensitivity in array matching
                const variations = activeSkills.flatMap(skill => {
                    const s = skill.trim();
                    return [
                        s,
                        s.toLowerCase(),
                        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
                        s.toUpperCase()
                    ];
                });
                const uniqueVariations = Array.from(new Set(variations));
                query = query.overlaps('skills_list', uniqueVariations);
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
                query = query.eq('english_proficiency', englishScore);
            }

            // 4. Numeric Range Filters (Salary & Hours)
            // Note: These assume 'expected_salary' and 'hours_per_day' are numeric columns
            if (salaryRange.min > 0) {
                // If expected_salary is text, this might need casting in Supabase RPC
                query = query.gte('expected_salary', salaryRange.min);
            }
            if (salaryRange.max > 0 && salaryRange.max < 100) { // arbitrary max check
                query = query.lte('expected_salary', salaryRange.max);
            }

            // 5. Last Active Filter
            if (lastActive !== 'Any') {
                const now = new Date();
                let filterDate;
                if (lastActive === 'Today') {
                    filterDate = new Date(now.setDate(now.getDate() - 1)).toISOString();
                } else if (lastActive === 'This week') {
                    filterDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
                } else if (lastActive === 'This month') {
                    filterDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
                }

                if (filterDate) {
                    query = query.gte('updated_at', filterDate);
                }
            }

            // 5. Verification & Search Logic
            if (!includeHired) {
                // Future: Exclude profiles with hired status if a 'status' column is added
            }

            query = query.range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

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
                    skills: profile.skills_list || [],
                    talentScore: profile.talent_score || 85,
                    iq: profile.iq || 120,
                    availability: profile.availability || 'Full-time',
                    verified: profile.is_verified_pro,
                    bio: profile.bio || 'I am a dedicated professional with expertise in delivering high-quality results.',
                    education: profile.education_level || 'Bachelors degree',
                    lastActive: profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Active'
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

    const fetchSavedTalents = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
            .from('saved_talents')
            .select('seeker_id')
            .eq('employer_id', session.user.id);

        if (data && !error) {
            setSavedTalentIds(data.map(item => item.seeker_id));
        }
    };

    const toggleSaveTalent = async (seekerId: string) => {
        if (!employerId || role !== 'employer') {
            const currentPath = window.location.pathname + window.location.search;
            navigate(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
            return;
        }

        const isSaved = savedTalentIds.includes(seekerId);

        if (isSaved) {
            setSavedTalentIds(prev => prev.filter(id => id !== seekerId));
            const { error } = await supabase
                .from('saved_talents')
                .delete()
                .eq('employer_id', employerId)
                .eq('seeker_id', seekerId);

            if (error) {
                setSavedTalentIds(prev => [...prev, seekerId]);
                console.error("Error unpinning talent:", error);
            }
        } else {
            setSavedTalentIds(prev => [...prev, seekerId]);
            const { error } = await supabase
                .from('saved_talents')
                .insert({ employer_id: employerId, seeker_id: seekerId });

            if (error) {
                setSavedTalentIds(prev => prev.filter(id => id !== seekerId));
                console.error("Error pinning talent:", error);
            }
        }
    };

    const handleViewProfile = (seekerId: string) => {
        if (!employerId || role !== 'employer') {
            const currentPath = window.location.pathname + window.location.search;
            navigate(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
        } else {
            navigate(`/profile/${seekerId}`);
        }
    };

    const toggleSkillFilter = (skill: string) => {
        const trimmed = skill.trim();
        if (activeSkills.includes(trimmed)) {
            setActiveSkills(activeSkills.filter(s => s !== trimmed));
        } else {
            setActiveSkills([...activeSkills, trimmed]);
        }
    };

    // Initial sync from URL parameters
    useEffect(() => {
        if (initialQuery !== searchQuery) {
            setSearchQuery(initialQuery);
        }

        const currentSkills = searchParams.get('skills');
        const parsedSkills = currentSkills ? currentSkills.split(',').filter(s => s) : [];
        if (JSON.stringify(parsedSkills) !== JSON.stringify(activeSkills)) {
            setActiveSkills(parsedSkills);
        }
    }, [initialQuery, searchParams]);

    // Sync activeSkills to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (activeSkills.length > 0) {
            params.set('skills', activeSkills.join(','));
        } else {
            params.delete('skills');
        }
        if (searchQuery) {
            params.set('q', searchQuery);
        }
        navigate(`${window.location.pathname}?${params.toString()}`, { replace: true });
    }, [activeSkills]);

    // Main fetch effect
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchTalents();
        }, 300);
        return () => clearTimeout(handler);
    }, [
        searchQuery,
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
        activeSkills,
        currentPage
    ]);

    useEffect(() => {
        fetchSavedTalents();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        if (e) e.preventDefault();
        setCurrentPage(1);
        navigate(`/skillsearch?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            <Navbar forceSolid={true} />

            <div className="pt-24 pb-20">
                {/* Dynamic Hero Section */}
                <div className={`relative overflow-hidden mb-12 transition-all duration-700 ${searchQuery ? 'h-[400px]' : 'h-0 opacity-0 mb-0'}`}>
                    <div className="absolute inset-0 bg-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,71,255,0.3),transparent_70%)]" />
                    </div>

                    <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: searchQuery ? 1 : 0, y: searchQuery ? 0 : 20 }}
                            className="max-w-4xl"
                        >
                            <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.3em] border border-primary/30 mb-6 inline-block">
                                Premium Talent Discovery
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
                                {searchQuery ? `Hire Top-Tier ${searchQuery} Experts` : 'Browse Our Global Talent Pool'}
                            </h1>
                            <p className="text-xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                                Connect with the top 1% of remote professionals from the Philippines. Hand-vetted, high-performing experts ready to scale your business.
                            </p>

                            <div className="flex items-center gap-8 mt-10">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-primary flex items-center justify-center text-white text-xs font-black">
                                        +2k
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-white/10" />
                                <div>
                                    <p className="text-white font-black text-lg tracking-tight">Verified Professionals</p>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Available for immediate hire</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Background Decorative Element */}
                    <div className="absolute bottom-0 right-0 p-20 opacity-10 pointer-events-none">
                        <Search size={400} className="text-white rotate-12" />
                    </div>
                </div>

                <div className="container mx-auto px-6 max-w-[1400px]">
                    {/* Search Bar Section - onlinejobs.ph style */}
                    <div className={`bg-white p-6 md:p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-12 relative z-20 transition-all duration-500 ${searchQuery ? '-mt-16' : ''}`}>
                        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative flex-1 w-full group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all duration-300" size={24} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by skill, job title, or keyword..."
                                    className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 focus:outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-16 py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                            >
                                Find Talent
                            </button>
                            <a href="#" className="hidden lg:block text-secondary text-[11px] font-black uppercase tracking-widest hover:underline whitespace-nowrap">
                                Need Help?
                            </a>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Skill Filters</h5>
                                        {activeSkills.length > 0 && (
                                            <button
                                                onClick={() => setActiveSkills([])}
                                                className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeSkills.map(skill => (
                                            <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0047AB] border border-blue-100 rounded text-[11px] font-bold">
                                                {skill}
                                                <button onClick={() => setActiveSkills(activeSkills.filter(s => s !== skill))} className="hover:text-blue-700">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    {isAddingSkill ? (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (newSkill.trim()) {
                                                    toggleSkillFilter(newSkill);
                                                    setNewSkill('');
                                                    setIsAddingSkill(false);
                                                }
                                            }}
                                            className="mt-3 flex gap-2"
                                        >
                                            <input
                                                autoFocus
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                placeholder="Skill name..."
                                                className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-[12px] outline-none focus:border-primary"
                                            />
                                            <button type="submit" className="bg-[#0047AB] text-white p-2 rounded">
                                                <Plus size={14} />
                                            </button>
                                            <button type="button" onClick={() => setIsAddingSkill(false)} className="text-slate-400 p-2">
                                                <X size={14} />
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="mt-4 space-y-3">
                                            <button
                                                onClick={() => setIsAddingSkill(true)}
                                                className="text-[#0047AB] text-[12px] font-bold hover:underline flex items-center gap-1"
                                            >
                                                +/- Add skill filters
                                            </button>

                                            <div className="pt-2">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Popular Skills</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {['React', 'Node.js', 'UI/UX', 'Python', 'Virtual Assistant', 'SEO', 'Laravel', 'Shopify'].map(skill => (
                                                        <button
                                                            key={skill}
                                                            onClick={() => toggleSkillFilter(skill)}
                                                            className={`px-2 py-0.5 rounded border text-[10px] font-bold transition-all ${activeSkills.includes(skill) ? 'bg-[#0047AB] border-[#0047AB] text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                                        >
                                                            {skill}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employment Type</label>
                                        <select
                                            value={employmentType}
                                            onChange={(e) => setEmploymentType(e.target.value)}
                                            className="w-full bg-white border border-slate-200 p-2.5 rounded-md text-[13px] font-medium text-slate-600 outline-none focus:border-primary/50"
                                        >
                                            <option value="Any">Any</option>
                                            <option value="Full-Time">Full-Time</option>
                                            <option value="Part-Time">Part-Time</option>
                                            <option value="Gig / Project-Based">Gig / Project-Based</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability (Hours per day)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={availabilityRange.min}
                                                onChange={(e) => setAvailabilityRange({ ...availabilityRange, min: parseInt(e.target.value) })}
                                                className="w-full bg-white border border-slate-200 p-2 rounded-md text-[13px] text-center"
                                            />
                                            <span className="text-slate-400">-</span>
                                            <input
                                                type="number"
                                                value={availabilityRange.max}
                                                onChange={(e) => setAvailabilityRange({ ...availabilityRange, max: parseInt(e.target.value) })}
                                                className="w-full bg-white border border-slate-200 p-2 rounded-md text-[13px] text-center"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hourly Salary Between (USD)</label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-full">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                <input
                                                    type="number"
                                                    value={salaryRange.min}
                                                    onChange={(e) => setSalaryRange({ ...salaryRange, min: parseInt(e.target.value) })}
                                                    className="w-full bg-white border border-slate-200 p-2 pl-5 rounded-md text-[13px] text-center"
                                                />
                                            </div>
                                            <span className="text-slate-400">-</span>
                                            <div className="relative w-full">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                <input
                                                    type="number"
                                                    value={salaryRange.max}
                                                    onChange={(e) => setSalaryRange({ ...salaryRange, max: parseInt(e.target.value) })}
                                                    className="w-full bg-white border border-slate-200 p-2 pl-5 rounded-md text-[13px] text-center"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            ID Proof Score <HelpCircle size={12} className="text-slate-300" />
                                        </label>
                                        <select
                                            value={idProofScore}
                                            onChange={(e) => setIdProofScore(e.target.value)}
                                            className="w-full bg-white border border-slate-200 p-2.5 rounded-md text-[13px]"
                                        >
                                            <option>Any</option>
                                            <option>40+</option>
                                            <option>60+</option>
                                            <option>80+</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Active</label>
                                        <select
                                            value={lastActive}
                                            onChange={(e) => setLastActive(e.target.value)}
                                            className="w-full bg-white border border-slate-200 p-2.5 rounded-md text-[13px]"
                                        >
                                            <option>Any</option>
                                            <option>Today</option>
                                            <option>This week</option>
                                            <option>This month</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IQ Score</label>
                                        <select
                                            value={iqScore}
                                            onChange={(e) => setIqScore(e.target.value)}
                                            className="w-full bg-white border border-slate-200 p-2.5 rounded-md text-[13px]"
                                        >
                                            <option>Any</option>
                                            <option>100+</option>
                                            <option>120+</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">English Score</label>
                                        <select
                                            value={englishScore}
                                            onChange={(e) => setEnglishScore(e.target.value)}
                                            className="w-full bg-white border border-slate-200 p-2.5 rounded-md text-[13px]"
                                        >
                                            <option value="Any">Any</option>
                                            <option value="C2 (Proficient / Native)">C2 / Native</option>
                                            <option value="C1 (Advanced)">C1 / Advanced</option>
                                            <option value="B2 (Upper Intermediate)">B2 / Upper-Intermediate</option>
                                            <option value="B1 (Intermediate)">B1 / Intermediate</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={searchDescriptions}
                                                onChange={() => setSearchDescriptions(!searchDescriptions)}
                                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-[12px] font-medium text-slate-600">Search Profile Descriptions</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={searchNames}
                                                onChange={() => setSearchNames(!searchNames)}
                                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-[12px] font-medium text-slate-600">Search Name</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={includeHired}
                                                onChange={() => setIncludeHired(!includeHired)}
                                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-[12px] font-medium text-slate-600">Include Hired Profiles</span>
                                        </label>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(1);
                                            fetchTalents();
                                        }}
                                        disabled={loading}
                                        className="w-full mt-4 py-3 border border-slate-200 rounded-md text-[11px] font-black uppercase tracking-widest text-[#0047AB] hover:bg-[#0047AB] hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Refining...' : 'Refine Search Results'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Results */}
                        <div className="lg:col-span-9 space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-[13px] text-slate-500 font-medium">
                                    Found <span className="text-slate-900 font-bold">{totalCount}</span> jobseekers.
                                </p>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i)}
                                            className={`w-8 h-8 flex items-center justify-center text-[12px] font-bold rounded ${currentPage === i ? 'bg-[#0047AB] text-white' : 'bg-white border border-slate-200 text-[#0047AB] hover:bg-slate-50'}`}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                    <button className="w-8 h-8 flex items-center justify-center text-[12px] font-bold rounded bg-white border border-slate-200 text-[#0047AB] hover:bg-slate-50">
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {loading ? (
                                    <div className="space-y-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-pulse h-80" />
                                        ))}
                                    </div>
                                ) : talents.length > 0 ? (
                                    talents.map((talent) => (
                                        <motion.div
                                            key={talent.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                                        >
                                            <div className="flex flex-col md:flex-row gap-10 relative z-10">
                                                {/* Left Column: Avatar & Quick Stats */}
                                                <div className="flex flex-col items-center gap-6 shrink-0">
                                                    <div
                                                        onClick={() => handleViewProfile(talent.id)}
                                                        className="w-32 h-32 rounded-[32px] bg-slate-100 overflow-hidden ring-[8px] ring-white shadow-xl transition-transform group-hover:scale-105 cursor-pointer relative"
                                                    >
                                                        <img src={talent.photo} alt={talent.name} className="w-full h-full object-cover" />
                                                        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg ${talent.verified ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                                            <ShieldCheck size={20} />
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                                                            <Star size={16} fill="currentColor" />
                                                            <span className="text-xl font-black tracking-tighter">{talent.talentScore}%</span>
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Talent Score</p>
                                                    </div>
                                                </div>

                                                {/* Right Column: Info */}
                                                <div className="flex-1 space-y-8 min-w-0">
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                        <div onClick={() => handleViewProfile(talent.id)} className="cursor-pointer group/name">
                                                            <h3 className="text-2xl font-black text-secondary group-hover/name:underline tracking-tighter decoration-primary decoration-4 underline-offset-4 mb-1">
                                                                {employerId ? talent.name : talent.name.split(' ')[0]}
                                                            </h3>
                                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{talent.title}</h4>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleSaveTalent(talent.id); }}
                                                                className={`p-4 rounded-2xl border transition-all group/pin ${savedTalentIds.includes(talent.id) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900'}`}
                                                            >
                                                                <Pin size={20} className={savedTalentIds.includes(talent.id) ? 'fill-white' : ''} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleViewProfile(talent.id)}
                                                                className="px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                            >
                                                                <Eye size={18} /> View Profile
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Availability</p>
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-black text-slate-800 leading-none">{talent.availability} (8h/day)</p>
                                                                <p className="text-sm font-black text-primary leading-none mt-1">at {talent.rate} <span className="text-slate-300 font-bold ml-1">/ hr</span></p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Education</p>
                                                            <p className="text-sm font-black text-slate-800 line-clamp-2">{talent.education}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Last Active</p>
                                                            <p className="text-sm font-black text-slate-800">{talent.lastActive}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Profile Summary</p>
                                                        <p className="text-[14px] font-medium text-slate-500 leading-relaxed line-clamp-2 italic">
                                                            "{talent.bio}"
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {talent.skills.map((skill: string) => (
                                                            <span
                                                                key={skill}
                                                                onClick={() => toggleSkillFilter(skill)}
                                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 ${activeSkills.includes(skill) ? 'bg-primary text-white border-primary' : 'bg-slate-50 border border-slate-100 text-slate-600 hover:border-primary/30'}`}
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Accent Background */}
                                            <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                                <Users size={200} />
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center">
                                        <p className="text-slate-400 font-medium">No talent found matching your criteria.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillSearch;
