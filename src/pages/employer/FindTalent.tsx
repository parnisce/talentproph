import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Users,
    Star,
    Zap,
    DollarSign,
    ChevronRight,
    ShieldCheck,
    Clock
} from 'lucide-react';
import { supabase } from '../../services/supabase';

const FindTalent = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [talents, setTalents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchTalents = async () => {
            setLoading(true);
            try {
                let query = supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'seeker');

                if (initialQuery) {
                    // Search in full_name, professional headline (title), bio, and core competencies (skills)
                    // We use or with ILIKE for text and contains for skills array
                    query = query.or(`full_name.ilike.%${initialQuery}%,title.ilike.%${initialQuery}%,bio.ilike.%${initialQuery}%,skills.cs.{${initialQuery}}`);
                }

                // Apply active filters on top of search
                if (activeFilter === 'Top Rated') {
                    query = query.gt('talent_score', 90);
                } else if (activeFilter === 'Verified PRO') {
                    query = query.eq('is_verified_pro', true);
                } else if (activeFilter === 'Highly Available') {
                    query = query.eq('availability', 'Immediate');
                } else if (activeFilter === 'Technical') {
                    query = query.or('title.ilike.%Developer%,title.ilike.%Engineer%,title.ilike.%IT%,title.ilike.%React%,skills.cs.{React,Node,Python}');
                } else if (activeFilter === 'Creative') {
                    query = query.or('title.ilike.%Designer%,title.ilike.%Creative%,title.ilike.%Video%,title.ilike.%Editor%,skills.cs.{Figma,Photoshop,Design}');
                }

                const { data, error } = await query;

                if (error) throw error;

                if (data) {
                    const mappedData = data.map(profile => ({
                        id: profile.id,
                        name: profile.full_name || 'Anonymous Seeker',
                        photo: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
                        title: profile.title || 'Job Seeker',
                        location: profile.location || 'Remote',
                        rate: profile.expected_salary || 'TBD',
                        skills: profile.skills || [],
                        talentScore: profile.talent_score || 85,
                        iq: profile.iq || 120,
                        availability: profile.availability || 'Full-time',
                        verified: profile.is_verified_pro
                    }));
                    setTalents(mappedData);
                }
            } catch (err) {
                console.error("Error fetching talent:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTalents();
    }, [initialQuery, activeFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/employer/talent?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Find Elite Talent</h1>
                    <p className="text-slate-500 font-medium mt-1">Discover vetted professionals by skill, score, or performance.</p>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Lead Gen, React, FB Ads..."
                        className="pl-14 pr-32 py-4 bg-white border-2 border-slate-100 rounded-[24px] focus:ring-[8px] focus:ring-primary/5 focus:border-primary outline-none w-full md:w-[400px] text-[14px] font-bold transition-all shadow-xl shadow-slate-200/50"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-[18px] text-[11px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {['All', 'Top Rated', 'Highly Available', 'Verified PRO', 'Technical', 'Creative'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeFilter === f
                            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
                            : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-primary hover:text-primary'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white border-2 border-slate-50 rounded-[48px] p-8 animate-pulse space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-slate-100 rounded-[28px]" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 bg-slate-100 rounded-full w-3/4" />
                                    <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                                </div>
                            </div>
                            <div className="h-20 bg-slate-50 rounded-[32px]" />
                            <div className="h-12 bg-slate-100 rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : talents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {talents.map((talent, idx) => (
                            <motion.div
                                key={talent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -6 }}
                                className="bg-white border-2 border-slate-50 rounded-[48px] p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                            >
                                {/* Talent Score Badge */}
                                <div className="absolute top-8 right-8 text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-primary mb-1">
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-xl font-black tracking-tighter">{talent.talentScore}%</span>
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Talent Score</p>
                                </div>

                                <div className="flex items-center gap-6 mb-8 mt-2">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[28px] bg-slate-100 overflow-hidden ring-[6px] ring-white shadow-xl transition-transform group-hover:scale-105">
                                            <img src={talent.photo} alt={talent.name} className="w-full h-full object-cover" />
                                        </div>
                                        {talent.verified && (
                                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                                <ShieldCheck size={14} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tighter truncate leading-tight group-hover:text-primary transition-colors">{talent.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <p className="text-[11px] font-bold text-slate-400 truncate">{talent.title}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Zap size={14} className="text-amber-500" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IQ/DISC</span>
                                        </div>
                                        <p className="text-[13px] font-black text-slate-900">{talent.iq} • High D</p>
                                    </div>
                                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock size={14} className="text-primary" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                        </div>
                                        <p className="text-[13px] font-black text-slate-900">{talent.availability}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {talent.skills.slice(0, 3).map((skill: string) => (
                                            <span key={skill} className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                        {talent.skills.length > 3 && (
                                            <span className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-xl">
                                                +{talent.skills.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                                            <DollarSign size={16} />
                                            <span className="text-lg tracking-tight font-black">{talent.rate}</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/employer/applicants/review/${talent.id}`)}
                                            className="px-6 py-3 bg-slate-900 text-white rounded-2x rounded-[18px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            View Profile <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-24 bg-white border-2 border-dashed border-slate-100 rounded-[56px]">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mx-auto mb-6">
                        <Users size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">No candidates found</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">
                        Try searching for broad skills like "Lead Generation", "React", or "Facebook Ads".
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            navigate('/employer/talent');
                        }}
                        className="mt-10 px-10 py-4 bg-primary text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                        View All Sseekers
                    </button>
                </div>
            )}
        </div>
    );
};

export default FindTalent;
