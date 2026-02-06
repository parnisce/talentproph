import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, User, Building, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const RegisterPage = () => {
    const [role, setRole] = useState<'seeker' | 'employer'>('seeker');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`,
                        role: role
                    },
                    emailRedirectTo: `${window.location.origin}/login`
                }
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                alert('Registration successful! Please check your email for a confirmation link.');
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[580px] z-10"
            >
                <div className="bg-white p-12 md:p-16 rounded-[56px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100/50 relative">
                    <div className="flex flex-col items-center mb-12 text-center">
                        <Link to="/" className="flex items-center gap-3 mb-10 group">
                            <div className="bg-slate-900 p-3 rounded-2xl shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center border border-white/5">
                                <Zap className="text-white fill-white" size={28} />
                            </div>
                            <span className="text-3xl font-black font-outfit tracking-tighter text-slate-900">TalentPro <span className="text-gradient">PH</span></span>
                        </Link>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Your Account</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-3">Select your profile category</p>
                    </div>

                    <div className="flex gap-4 mb-12 p-3 bg-slate-50/50 border border-slate-100 rounded-[30px] shadow-inner">
                        <button
                            type="button"
                            onClick={() => setRole('seeker')}
                            className={`flex-1 py-4.5 px-6 rounded-[22px] font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${role === 'seeker' ? 'bg-white shadow-xl text-primary ring-1 ring-slate-100 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <User size={20} /> Seeker
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('employer')}
                            className={`flex-1 py-4.5 px-6 rounded-[22px] font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${role === 'employer' ? 'bg-white shadow-xl text-primary ring-1 ring-slate-100 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Building size={20} /> Employer
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">First Name</label>
                                <input
                                    required
                                    className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Last Name</label>
                                <input
                                    required
                                    className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Work Email Address</label>
                            <input
                                required
                                type="email"
                                className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                placeholder="name@career.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Secure Password</label>
                            <input
                                required
                                type="password"
                                className="w-full px-7 py-4.5 rounded-[22px] border border-slate-100 bg-slate-50/5 focus:bg-white focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="p-5 rounded-[28px] bg-slate-50/30 border border-slate-100 flex items-start gap-5 mt-4">
                            <div className="mt-1 relative flex items-center shrink-0">
                                <input type="checkbox" id="terms" required className="peer appearance-none w-6 h-6 rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all pointer-events-auto cursor-pointer" />
                                <Check className="absolute w-4 h-4 text-white left-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
                            </div>
                            <label htmlFor="terms" className="text-xs text-slate-400 font-bold leading-relaxed pr-2 cursor-pointer">
                                By joining, I agree to the <a href="#" className="font-black text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-black text-primary hover:underline">Privacy Policy</a> about the processing of my data.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-5 rounded-[22px] text-lg font-black font-outfit shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all group mt-6 flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>Create My Account <ArrowRight className="inline group-hover:translate-x-1 transition-transform" size={22} /></>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-12 text-center text-sm font-bold tracking-tight">
                    <span className="text-slate-400">Already a pro?</span>{' '}
                    <Link to="/login" className="text-primary hover:underline ml-1">Log Into Dashboard</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;

