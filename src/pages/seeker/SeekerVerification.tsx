import { useState } from 'react';
import {
    ShieldCheck,
    Upload,
    CheckCircle2,
    Smartphone,
    MapPin,
    AlertCircle,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const SeekerVerification = () => {
    const {
        updateUserProfile,
        government_id_url,
        billing_address,
        mobile_number
    } = useUser();

    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [idFile, setIdFile] = useState<string | null>(government_id_url || null);
    const [address, setAddress] = useState(billing_address || '');
    const [phone, setPhone] = useState(mobile_number || '');

    const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setIdFile(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await updateUserProfile({
                government_id_url: idFile || '',
                billing_address: address,
                mobile_number: phone,
                verification_status: 'pending'
            });
            alert("Verification submitted successfully! Our team will review it shortly.");
            navigate('/seeker');
        } catch (err) {
            console.error("Verification failed:", err);
            alert("Failed to submit verification. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/30 pb-20">
            {/* Header Section */}
            <div className="bg-slate-900 pt-20 pb-40 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,71,255,0.1),transparent_70%)]" />
                <div className="max-w-[1000px] mx-auto text-center relative z-10 space-y-6">
                    <button
                        onClick={() => navigate('/seeker')}
                        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-10 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        Verify your Identity in <span className="text-primary italic text-gradient">3 Easy Steps</span>
                    </h1>
                    <p className="text-blue-100/50 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                        Verifying who you say you are is very important for employers. It establishes trust and gives more employers confidence in hiring Filipino workers.
                    </p>
                </div>
            </div>

            {/* Verification Content */}
            <div className="max-w-[1200px] mx-auto px-6 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1: ID */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[48px] p-10 shadow-xl border-2 border-slate-100 flex flex-col items-center text-center space-y-8 relative overflow-hidden group"
                    >
                        <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <ShieldCheck size={48} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Government ID Verification</h3>
                            <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">(Required)</p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                Upload a photo of your valid Government ID and a selfie holding it
                            </p>
                        </div>

                        <div className="flex-grow w-full">
                            {idFile ? (
                                <div className="space-y-4">
                                    <div className="w-full h-40 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                        <img src={idFile} alt="ID Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        onClick={() => setIdFile(null)}
                                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                                    >
                                        Remove Photo
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] cursor-pointer hover:border-primary/50 hover:bg-slate-100 transition-all group/upload">
                                    <Upload className="text-slate-300 group-hover/upload:text-primary mb-3" size={24} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select ID Photo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleIdUpload} />
                                </label>
                            )}
                        </div>

                        {government_id_url && (
                            <div className="px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} /> Approved
                            </div>
                        )}
                    </motion.div>

                    {/* Step 2: Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[48px] p-10 shadow-xl border-2 border-slate-100 flex flex-col items-center text-center space-y-8 relative overflow-hidden group"
                    >
                        <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <MapPin size={48} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Address Verification</h3>
                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">(Optional)</p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                Upload a photo of the document showing your billing address
                            </p>
                        </div>

                        <div className="flex-grow w-full">
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full residential address..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none h-40"
                            />
                        </div>

                        {billing_address && (
                            <div className="px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} /> Approved
                            </div>
                        )}
                    </motion.div>

                    {/* Step 3: Mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-[48px] p-10 shadow-xl border-2 border-slate-100 flex flex-col items-center text-center space-y-8 relative overflow-hidden group"
                    >
                        <div className="w-24 h-24 bg-amber-50 rounded-[32px] flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Smartphone size={48} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Mobile Number Verification</h3>
                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">(Optional)</p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                Enter your mobile number and we'll send you a verification code
                            </p>
                        </div>

                        <div className="flex-grow w-full flex items-center">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+63 9XX XXX XXXX"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-full text-center text-lg font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>

                        {mobile_number && (
                            <div className="px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} /> Approved
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Submission Bar */}
                <div className="mt-16 bg-white border-2 border-slate-100 p-8 rounded-[40px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <AlertCircle size={24} />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-sm font-black text-slate-900">Final Verification Review</p>
                            <p className="text-[11px] font-bold text-slate-400">Once submitted, our team will review your account status within 24-48 hours.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !idFile}
                        className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {submitting ? (
                            <><Loader2 className="animate-spin" size={20} /> Processing...</>
                        ) : (
                            <><ShieldCheck size={20} /> Submit Verification</>
                        )}
                    </button>
                </div>

                <div className="text-center mt-12 space-y-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">TalentPro PH Verified PRO Trust Guarantee</p>
                    <p className="text-[9px] font-medium text-slate-300 italic max-w-xl mx-auto">Your identity documents are handled with the highest level of encryption and are only used for account verification purposes. We never share your ID with third parties.</p>
                </div>
            </div>
        </div>
    );
};

export default SeekerVerification;
