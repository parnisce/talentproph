import { useState } from 'react';
import { supabase } from '../../services/supabase';
import {
    Lock,
    Shield,
    Key,
    Save,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const SeekerAccountSettings = () => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (passwords.new !== passwords.confirm) {
            setError("New passwords do not match.");
            return;
        }

        if (passwords.new.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setSubmitting(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err: any) {
            console.error("Error updating password:", err);
            setError(err.message || "Failed to update password.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto space-y-12 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-4xl font-black font-outfit tracking-tighter text-slate-900">Account Settings</h2>
                <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={14} className="text-primary" /> Security & Privacy Management
                </p>
            </div>

            {/* Password Change Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[48px] border-2 border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden"
            >
                <div className="p-10 border-b border-slate-50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter">Password Management</h3>
                        <p className="text-xs font-bold text-slate-400">Update your account password regularly to stay secure.</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="p-10 space-y-8">
                    {error && (
                        <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-4 text-rose-600">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-start gap-4 text-emerald-600">
                            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-bold">Your password has been updated successfully!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Dummy field for accessibility/UX patterns, though usually supabase only needs the new password if already logged in */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Key size={12} /> New Password
                            </label>
                            <input
                                type="password"
                                value={passwords.new}
                                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                placeholder="Enter strong password"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={12} /> Confirm Password
                            </label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                                placeholder="Repeat new password"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-10 py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                        >
                            {submitting ? (
                                <><Loader2 className="animate-spin" size={18} /> Processing...</>
                            ) : (
                                <><Save size={18} /> Update Password</>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Info Section */}
            <div className="p-10 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-blue-100 shrink-0">
                    <Shield size={24} />
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-900 uppercase">Privacy & Safety Tip</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                        "Your account security is our priority. Avoid using the same password across multiple sites and enable two-factor authentication where possible to protect your professional data."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SeekerAccountSettings;
