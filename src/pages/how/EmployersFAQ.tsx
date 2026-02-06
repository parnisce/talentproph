import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, DollarSign, ShieldCheck, Globe, Scale, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const faqData = [
    {
        category: "Account and Pricing",
        icon: <HelpCircle className="text-primary" size={24} />,
        questions: [
            {
                q: "What does the free account get me?",
                a: "A free account allows you to post a job and see job applications. This gives you a clear idea of the quality and quantity of candidates you'll attract. However, to see applicant contact information, interview, or communicate with them, you'll need to upgrade. We don't offer a free trial to maintain a high-quality, scam-free environment for both employers and workers."
            },
            {
                q: "Why can't I contact workers with the free account?",
                a: "Opening communication without a paid subscription often attracts low-quality or scam-prone interactions, which degrades the experience for our professional talent pool. Your subscription helps us maintain the platform, verify talent, and ensure only serious employers are connecting with our community. You can view full profiles and post jobs for free to validate the market before paying."
            },
            {
                q: "Why do I have to pay up front?",
                a: "By charging a subscription upfront, we eliminate the need for 'middleman' markups on salaries. You pay the talent directly, which is significantly more cost-effective for you long-term. We offer a money-back guarantee because we're confident in our matching process—if you don't find the right person, we honor our commitment to your satisfaction."
            },
            {
                q: "Can I upgrade my Pro account to Premium status?",
                a: "Yes! If you start with a monthly Pro subscription, you can upgrade to Premium at any time. You'll only pay the prorated difference for your remaining time. Similarly, monthly plans can be converted to Annual plans, with your last monthly payment credited toward the annual price."
            }
        ]
    },
    {
        category: "Paying Your Workers",
        icon: <DollarSign className="text-primary" size={24} />,
        questions: [
            {
                q: "How do I pay workers?",
                a: "TalentPro features 'EasyPay' built directly into the platform, allowing you to pay your team with no hidden fees and fast transfers. You can also use third-party services like Wise, PayPal, or WorldRemit. We don't force you to pay through us; we just provide a tool to make it simple and fair for your Filipino team."
            },
            {
                q: "Tell me more about EasyPay",
                a: "EasyPay was designed to fix common international payment issues like high fees and slow transfers. Transfers are fast (under 48 hours for recurring payments) and use fair exchange rates. It's built for long-term relationships, ensuring your talent gets the full amount they expect without getting 'screwed' by banking markups."
            },
            {
                q: "What are the typical salary ranges (Full-time vs Part-time)?",
                a: "Salaries for full-time work typically range from $400 to $2,000/month. Around $700/month is where you find highly competent professionals with years of experience. Part-time salaries are usually around 65% of full-time rates. Hourly rates generally fall between $3 and $15/hour depending on expertise levels."
            },
            {
                q: "Should I pay hourly or salaried?",
                a: "We highly recommend a salary-based model. In the Philippines, a stable salary is a sign of a professional career, whereas hourly work is often perceived as temporary. Salaried team members tend to be more loyal and integrated into your business operations. However, the platform supports whatever model you and your candidate agree upon."
            }
        ]
    },
    {
        category: "Trust and Security",
        icon: <ShieldCheck className="text-primary" size={24} />,
        questions: [
            {
                q: "How do I find someone I can trust?",
                a: "Filipino culture places a high value on loyalty and honesty, especially with foreign employers. We recommend thorough interviewing via email and video, asking about their experience, problem-solving skills, and family. Trust is earned over time, but starting with a small test task and clear communication sets the foundation for a life-long partnership."
            },
            {
                q: "How do I protect my sensitive business information?",
                a: "1. Use a password manager like LastPass or Dashlane to share access without revealing passwords. 2. Implement a 'gradual access' policy. 3. Be aware that the Philippines has strict data protection laws. Most security issues arise from employers who try to skip the vetting process or treat workers unfairly. Professional VAs value their reputation and your business security."
            },
            {
                q: "Should I use time tracking?",
                a: "While some employers use our 'TimeProof' tool, others prefer to manage by output. We find that for high-level creative or technical roles, output-based management fosters more trust and better results. If you do use tracking, ensure it's framed as a productivity tool rather than a surveillance measure."
            }
        ]
    },
    {
        category: "Culture and 13th Month",
        icon: <Globe className="text-primary" size={24} />,
        questions: [
            {
                q: "What is the '13th Month' pay?",
                a: "In the Philippines, it's a standard cultural practice to provide a bonus equivalent to one month's salary, usually paid in December. While not strictly legally required for overseas independent contractors, it is highly expected and forms the basis of many families' holiday budgeting. Paying it is a major factor in retention and team morale."
            },
            {
                q: "Do Filipino VAs tend to 'disappear'?",
                a: "The 'reputation' of disappearing is rare and usually stems from a lack of training or fear of admitting a mistake. If a worker feels overwhelmed or that they've disappointed you, they might go quiet. You can prevent this by fostering an environment where mistakes are learning opportunities and providing clear, documented SOPs."
            }
        ]
    },
    {
        category: "Legal Requirements",
        icon: <Scale className="text-primary" size={24} />,
        questions: [
            {
                q: "Are there legal requirements to hire in the PH?",
                a: "For most countries (USA, UK, Canada, Australia), there are NO formal legal requirements. You are hiring an Independent Contractor. There's no need for an 'Employer of Record' because you don't have a legal business presence in the Philippines. They are responsible for their own local taxes."
            },
            {
                q: "What about tax implications?",
                a: "Generally, the wages you pay are a standard business deduction. If you are in the US, we recommend having your talent fill out a W-8BEN form to keep in your records, which certifies their status as a foreign independent contractor. They do not pay US taxes, and you do not withhold any."
            }
        ]
    }
];

const EmployersFAQ = () => {
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
                            <span>Employer Resource Center</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
                        >
                            Employer <br /><span className="text-gradient italic">FAQs</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-blue-100/50 font-medium max-w-2xl leading-relaxed"
                        >
                            Everything you need to know about hiring, managing, and paying elite remote talent from the Philippines.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <div className="container mx-auto px-6 mt-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Navigation */}
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

                            <div className="mt-10 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                <p className="text-sm font-bold text-slate-700 mb-4">Still have questions?</p>
                                <Link to="/contact" className="btn-primary w-full text-sm py-3">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main FAQ List */}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployersFAQ;
