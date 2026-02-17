import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw authError;

            if (authData.user) {
                // Fetch user role from profiles table
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', authData.user.id)
                    .single();

                if (profileError) throw profileError;

                // Redirect based on role
                const searchParams = new URLSearchParams(window.location.search);
                const redirectTo = searchParams.get('redirectTo');

                if (redirectTo) {
                    navigate(redirectTo);
                } else if (profileData.role === 'admin') {
                    navigate('/admin');
                } else if (profileData.role === 'employer') {
                    navigate('/employer');
                } else {
                    navigate('/seeker');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[500px] z-10"
            >
                <div className="bg-white p-12 md:p-16 rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100/50 relative">
                    <div className="flex flex-col items-center mb-12">
                        <Link to="/" className="flex items-center gap-3 mb-10 group">
                            <div className="bg-slate-900 p-3 rounded-2xl shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center border border-white/5">
                                <Zap className="text-white fill-white" size={28} />
                            </div>
                            <span className="text-3xl font-black font-outfit tracking-tighter text-slate-900">TalentPro <span className="text-gradient">PH</span></span>
                        </Link>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Welcome Back</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-3">Enter your professional details</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-14 pr-6 py-5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Secure Password</label>
                                <a href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-6 py-5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-5 rounded-[22px] text-lg font-black font-outfit shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all group mt-6 flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>Sign Into Account <ArrowRight className="inline group-hover:translate-x-1 transition-transform" size={22} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 mb-10 flex items-center gap-6">
                        <div className="h-px bg-slate-100 flex-1" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Or Continue With</span>
                        <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <button className="flex items-center justify-center gap-3 py-4 rounded-[20px] bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all font-black text-[11px] uppercase tracking-widest shadow-sm">
                            <Chrome size={20} className="text-rose-500" /> Google
                        </button>
                        <button className="flex items-center justify-center gap-3 py-4 rounded-[20px] bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all font-black text-[11px] uppercase tracking-widest shadow-sm">
                            <Github size={20} className="text-slate-900" /> Github
                        </button>
                    </div>
                </div>

                <p className="mt-12 text-center text-sm font-bold tracking-tight">
                    <span className="text-slate-400">Not part of TalentPro yet?</span>{' '}
                    <Link to="/register" className="text-primary hover:underline ml-1">Create Professional Profile</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;

