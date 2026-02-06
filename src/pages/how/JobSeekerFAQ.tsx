import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, DollarSign, ShieldCheck, UserCheck, Briefcase, Layout, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const faqData = [
    {
        category: "Payments & Earnings",
        icon: <DollarSign className="text-primary" size={24} />,
        questions: [
            {
                q: "How do I get paid?",
                a: "Employers pay you directly, not through TalentPro. We don't take any percentage of your salary. You and your employer decide on the best method. Common options include TalentPro EasyPay (fastest), Payoneer, PayPal, and Western Union."
            },
            {
                q: "When do I get paid?",
                a: "This depends on your agreement with your employer. Most workers are paid every two weeks or once a month. For new relationships, we recommend asking to be paid weekly for the first month to build trust."
            },
            {
                q: "What if an employer doesn't pay me?",
                a: "We act as mediators in salary disputes. If you've done the work as agreed and an employer refuses to pay, we will remove them from the platform. In extreme cases, we may even forward the employer's subscription fees to the worker. Our 'Verify Employer' tool also helps you check if an employer is in good standing."
            },
            {
                q: "Are the salaries commission-based?",
                a: "Absolutely not. All jobs on TalentPro are salaried (full-time or part-time). You will never be asked to work for commission only or pay any 'joining fees' to get a job."
            }
        ]
    },
    {
        category: "Legitimacy & Trust",
        icon: <ShieldCheck className="text-primary" size={24} />,
        questions: [
            {
                q: "How do I know this is legit?",
                a: "TalentPro is dedicated to the Filipino workforce. We have helped thousands of Filipinos transition to stable, high-paying remote careers with foreign companies. Our reputation depends on the success of our workers."
            },
            {
                q: "Is this a 'business opportunity' or a scam?",
                a: "No. This is not a 'get rich quick' scheme, multi-level marketing, or a 'typing for dollars' scam. These are professional, long-term employment opportunities with real companies."
            },
            {
                q: "What is ID Proof and why does it matter?",
                a: "ID Proof is a trust score based on the verification of your identity. By providing government ID, a clear photo, and honest skill descriptions, you increase your ID Proof score. A higher score makes employers much more likely to trust and hire you."
            }
        ]
    },
    {
        category: "Eligibility & Skills",
        icon: <UserCheck className="text-primary" size={24} />,
        questions: [
            {
                q: "Are you sure I qualify?",
                a: "Yes! There are thousands of employers looking for all skill levels. As long as you are 18+ and legally allowed to work in the Philippines, there is a place for you here. Age is not a factor—talent and reliability are what matter."
            },
            {
                q: "Do I need perfect English?",
                a: "You don't need to be Shakespeare, but clear communication is essential. Most employers are from the US, UK, or Australia. If you can understand instructions and express your ideas clearly in English, you'll do great."
            },
            {
                q: "Do I need to be a college graduate?",
                a: "No. While some roles require specific degrees, many employers value skills, experience, and your portfolio over a diploma. High school graduates with strong technical or creative skills are frequently hired."
            },
            {
                q: "Can I apply if I'm a Filipino working abroad?",
                a: "Yes, but please note that you must agree to be paid in Philippine Peso (PHP) based on local market rates. This is a common path for OFWs looking to return home while keeping a global salary."
            },
            {
                q: "Do you allow workers from other countries?",
                a: "No. TalentPro specializes exclusively in Filipino talent. We only allow Philippine nationals/citizens to register as workers to maintain the highest quality pool for our employers."
            }
        ]
    },
    {
        category: "The Hiring Process",
        icon: <Briefcase className="text-primary" size={24} />,
        questions: [
            {
                q: "How do I get an employer?",
                a: "Step 1: Create a profile. Step 2: Fill it out completely (the more info, the better). Step 3: Proactively apply for jobs that match your skills. Don't just wait—be active!"
            },
            {
                q: "Will there be a job interview?",
                a: "Yes. Most employers will conduct interviews via email, Skype, or video call (like Zoom) to get to know you and your work style."
            },
            {
                q: "How long do I have to wait to get hired?",
                a: "This depends on your proactivity. Applicants who apply to 5-10 targeted jobs per day usually get hired much faster than those who wait for employers to find them."
            },
            {
                q: "What happens if I lie on my profile?",
                a: "Our team manually audits profiles. If you are caught lying about skills or identity, you will be banned. Even if you get hired, an employer will eventually notice a lack of skill and will likely terminate the contract without pay."
            }
        ]
    },
    {
        category: "Work Setup & Tools",
        icon: <Layout className="text-primary" size={24} />,
        questions: [
            {
                q: "Can I really work entirely online?",
                a: "Yes. You will be working from your home in the Philippines for foreign companies. You do not need to travel abroad. You'll need a reliable internet connection and a quiet workspace."
            },
            {
                q: "What is TimeProof?",
                a: "TimeProof is our optional software that tracks your working hours and takes occasional screenshots. It helps prove to your employer that you are working honestly, which builds trust and ensures you get paid for every minute."
            },
            {
                q: "Can I work an online job if I already have an office job?",
                a: "It's possible, but risky. We recommend starting part-time to ensure you can handle the workload without burnout. Always be honest with your online employer about your availability."
            }
        ]
    }
];

const JobSeekerFAQ = () => {
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 font-inter pb-20">
            <Navbar />

            {/* Premium Header - Realigned with Landing Page Style */}
            <section className="bg-deep pt-48 pb-24 relative overflow-hidden">
                {/* Background Effects matching Landing Page */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(0,71,255,0.15),transparent_70%)]" />
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] opacity-50" />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md"
                        >
                            <Sparkles size={14} className="text-primary" />
                            <span>Job Seeker Resource Center</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
                        >
                            Job Seeker <br /><span className="text-gradient italic">FAQs</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-blue-100/50 font-medium max-w-2xl leading-relaxed"
                        >
                            Everything you need to know about finding, landing, and succeeding in a remote career from the Philippines.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="glass-card bg-white p-8 border border-slate-200 shadow-xl sticky top-24">
                            <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Categories</h3>
                            <nav className="space-y-2">
                                {faqData.map((cat, i) => (
                                    <a
                                        key={i}
                                        href={`#cat-${i}`}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-all font-bold group"
                                    >
                                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary/10 transition-colors">
                                            {cat.icon}
                                        </div>
                                        {cat.category}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-10 p-6 bg-primary/5 rounded-3xl border border-primary/10 text-center">
                                <p className="text-sm font-bold text-slate-700 mb-4">Ready to start earning?</p>
                                <Link to="/register?role=seeker" className="btn-primary w-full text-sm py-4">
                                    Create Worker Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* FAQ List */}
                    <div className="lg:col-span-8 space-y-16">
                        {faqData.map((cat, i) => (
                            <div key={i} id={`cat-${i}`} className="scroll-mt-24">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100">
                                        {cat.icon}
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                        {cat.category}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {cat.questions.map((item, idx) => {
                                        const id = `q-${i}-${idx}`;
                                        const isOpen = activeQuestion === id;

                                        return (
                                            <div
                                                key={idx}
                                                className={`bg-white rounded-[28px] border transition-all duration-300 overflow-hidden ${isOpen ? 'border-primary shadow-2xl' : 'border-slate-200 hover:border-slate-300'}`}
                                            >
                                                <button
                                                    onClick={() => setActiveQuestion(isOpen ? null : id)}
                                                    className="w-full text-left p-8 flex justify-between items-center gap-6"
                                                >
                                                    <span className={`text-lg font-black tracking-tight ${isOpen ? 'text-primary' : 'text-slate-800'}`}>
                                                        {item.q}
                                                    </span>
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-primary text-white border-primary rotate-180' : 'text-slate-400 border-slate-200'}`}>
                                                        <ChevronDown size={20} />
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        >
                                                            <div className="px-8 pb-8 pt-0">
                                                                <div className="h-px bg-slate-100 mb-6" />
                                                                <p className="text-slate-600 leading-relaxed font-medium">
                                                                    {item.a}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Call to Action */}
                        <div className="p-12 bg-slate-900 rounded-[48px] text-center relative overflow-hidden mt-20">
                            <div className="absolute inset-0 bg-primary/10 opacity-30" />
                            <Globe className="absolute -top-10 -right-10 text-white/5" size={200} />
                            <h3 className="text-4xl font-black text-white mb-6 tracking-tighter relative z-10">Start Your Global Career Today</h3>
                            <p className="text-white/60 mb-10 max-w-xl mx-auto font-medium relative z-10">
                                Join thousands of elite Filipino professionals earning top-tier salaries from the world's best companies.
                            </p>
                            <Link to="/register?role=seeker" className="btn-primary px-12 py-5 text-lg relative z-10 inline-block shadow-2xl shadow-primary/40">
                                Apply for Jobs Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerFAQ;
