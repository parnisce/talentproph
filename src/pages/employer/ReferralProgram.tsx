import { motion } from 'framer-motion';
import { Heart, Hammer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReferralProgram = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-white rounded-[56px] border-2 border-slate-100 p-16 text-center shadow-xl shadow-slate-200/20 relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
                    <Heart size={200} fill="currentColor" />
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mx-auto mb-10 shadow-lg shadow-primary/10">
                        <Hammer size={40} />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter font-outfit">
                            Referral Program
                        </h1>
                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 py-2 px-6 rounded-full inline-block">
                            Coming Soon
                        </p>
                    </div>

                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
                        We are currently building an elite referral ecosystem to reward our partners. Stay tuned for exclusive benefits and earning opportunities.
                    </p>

                    <div className="pt-8">
                        <button
                            onClick={() => navigate('/employer')}
                            className="px-10 py-4 bg-slate-900 text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-primary hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-3 mx-auto"
                        >
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Construction Progress Bar Mockup */}
                <div className="mt-16 max-w-xs mx-auto space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Development Flow</span>
                        <span>85%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-primary"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ReferralProgram;
