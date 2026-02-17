import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search,
    ChevronRight,
    X,
    Pin,
    Eye,
    HelpCircle,
    Plus
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
    const [activeSkills, setActiveSkills] = useState<string[]>([]);
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
                const searchTerms = trimmedQuery.split(/\s+/).filter(t => t.length >= 2);
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
                    });
                }

                query = query.or(searchClauses.join(','));
            }

            // 2. Active Skill Filters
            if (activeSkills.length > 0) {
                query = query.contains('skills_list', activeSkills);
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
    }, [initialQuery]);

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

            <div className="pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-[1240px]">
                    {/* Search Bar Section - onlinejobs.ph style */}
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 mb-8">
                        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative flex-1 w-full group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by skill, job title, or keyword..."
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all font-medium"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-10 py-4 bg-[#0047AB] text-white rounded-lg font-bold uppercase tracking-widest hover:bg-[#003580] transition-colors shadow-lg shadow-blue-900/10"
                            >
                                Search
                            </button>
                            <a href="#" className="hidden lg:block text-[#0047AB] text-[13px] font-bold hover:underline whitespace-nowrap">
                                Better Search Results?
                            </a>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                                <div>
                                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Skill Filters</h5>
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
                                        <button
                                            onClick={() => setIsAddingSkill(true)}
                                            className="mt-3 text-[#0047AB] text-[12px] font-bold hover:underline flex items-center gap-1"
                                        >
                                            +/- Add skill filters
                                        </button>
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
                                            <option>Any</option>
                                            <option>Full-Time</option>
                                            <option>Part-Time</option>
                                            <option>Freelance</option>
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
                                            <option>Any</option>
                                            <option>Advanced</option>
                                            <option>Fluent</option>
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
                                        onClick={fetchTalents}
                                        className="w-full mt-4 py-3 border border-slate-200 rounded-md text-[11px] font-black uppercase tracking-widest text-[#0047AB] hover:bg-slate-50 transition-colors"
                                    >
                                        Refine Search Results
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
                                            <div key={i} className="bg-white h-64 rounded-lg border border-slate-200 animate-pulse" />
                                        ))}
                                    </div>
                                ) : talents.map((talent) => (
                                    <div key={talent.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                                            {/* Avatar Column */}
                                            <div className="flex flex-col items-center gap-4 shrink-0">
                                                <div className="relative">
                                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner">
                                                        <img src={talent.photo} alt={talent.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    {talent.verified && (
                                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#5ABC49] text-white px-3 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 shadow-sm whitespace-nowrap">
                                                            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-[8px] font-black">{talent.talentScore}</div>
                                                            ID Proof
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                                    <div>
                                                        <h3 className="text-[#0047AB] text-xl font-bold hover:underline cursor-pointer" onClick={() => handleViewProfile(talent.id)}>
                                                            {employerId ? talent.name : talent.name.split(' ')[0]}
                                                        </h3>
                                                        <p className="text-slate-900 font-bold text-[15px] mt-1">{talent.title}</p>
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        <button
                                                            onClick={() => toggleSaveTalent(talent.id)}
                                                            className={`flex items-center gap-1.5 px-4 py-2 border rounded-full text-[12px] font-bold transition-all ${savedTalentIds.includes(talent.id) ? 'bg-primary border-primary text-white' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                                                        >
                                                            <Pin size={14} className={savedTalentIds.includes(talent.id) ? 'fill-white' : ''} />
                                                            Pin
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewProfile(talent.id)}
                                                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#0047AB] text-[#0047AB] rounded-full text-[12px] font-bold hover:bg-[#0047AB] hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Eye size={14} /> View Profile
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Looking For</p>
                                                        <p className="text-[13px] font-bold text-slate-800 leading-snug">
                                                            {talent.availability} work (8 hours/day)<br />
                                                            <span className="text-[#0047AB]">at {talent.rate} ($1,280.00/month)</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Education</p>
                                                        <p className="text-[13px] font-medium text-slate-600 line-clamp-2">{talent.education}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Active</p>
                                                        <p className="text-[13px] font-medium text-slate-600">{talent.lastActive}</p>
                                                    </div>
                                                </div>

                                                <div className="mb-8">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Profile Description</p>
                                                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                                                        {talent.bio}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Top Skills</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {talent.skills.map((skill: string) => (
                                                            <span
                                                                key={skill}
                                                                onClick={() => toggleSkillFilter(skill)}
                                                                className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${activeSkills.includes(skill) ? 'bg-[#0047AB] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                            >
                                                                {skill}: 1-2 years
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

export default SkillSearch;
