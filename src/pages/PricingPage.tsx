import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, Zap, ShieldCheck, ChevronDown, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Feature {
    text: string;
    included: boolean;
    hasInfo?: boolean;
    highlight?: boolean;
    tag?: string;
}

interface Plan {
    id: string;
    name: string;
    price: string;
    subtitle: string;
    savings?: string;
    buttonText: string;
    buttonDesc?: string;
    color: string;
    headerBg: string;
    popular?: boolean;
    badge?: { text: string; subtext: string; tag: string };
    cancelText?: string;
    features: Feature[];
}

const faqs = [
    {
        category: "ACCOUNT AND PRICING",
        questions: [
            {
                q: "What does the free account get me?",
                a: "Free allows you to post a job and see job applications. It gives you a good idea of if you're going to find someone good. You can't see applicants contact info or communicate with them until you upgrade. There's a good reason we don't offer a free trial. You can only interview workers once you've paid for an account."
            },
            {
                q: "Why can't I contact workers with the free account?",
                a: "If we let employers contact workers without paying, they start to get scammy then workers respond the same way, and it turns into a cess pool of scams. Plus, it's how we make money and how we stay in business. You can look at full profiles and post a job before paying. With the job post you'll get to see all job applications so you can see if people are interested in your position and if they have good skills. You just won't be able to talk with them until you pay."
            },
            {
                q: "Why do I have to pay up front?",
                a: "If you consider our money back guarantee, there's not much risk. If you don't find someone, ask for your money back. We're a US based company. We honor our guarantee. We charge up front so we don't have to mark up salaries. Nobody likes middlemen and unnecessary markups."
            },
            {
                q: "Can I upgrade to Premium later?",
                a: "If you select a Pro subscription now, you can upgrade later to a Premium subscription and just pay the prorated difference. You are also able to go from monthly to annual subscriptions and have your last monthly payment counted towards the cost of the annual option."
            }
        ]
    },
    {
        category: "CANCELLING YOUR SUBSCRIPTION",
        questions: [
            {
                q: "Do I have to keep my subscription after I hire someone?",
                a: "No, you don't have to keep it. There is no time requirement. No contracts. When you're done recruiting, you don't have to keep your subscription. You can cancel and still use TimeProof and EasyPay. Of course...if you're Premium the worker coaching service might be worth it!"
            },
            {
                q: "How do I cancel?",
                a: "Cancelling your subscription is super easy. From your Account Dashboard, simply hover over to the 'Account' dropdown. Select 'Billing', then click 'Cancel Subscription'. It takes less than 30 seconds."
            }
        ]
    }
];

const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
    const [activeFaq, setActiveFaq] = useState<string | null>(null);

    const plans: Plan[] = [
        {
            id: 'free',
            name: "FREE",
            price: "0",
            subtitle: "WHY NO FREE TRIAL?",
            buttonText: "REGISTER",
            buttonDesc: "No credit card required.",
            color: "border-emerald-500",
            headerBg: "bg-emerald-500",
            features: [
                { text: "Hire & Communicate with Workers", included: false },
                { text: "1 Job Post", included: true },
                { text: "Max 15 applications per Job", included: true },
                { text: "2 days Job Post approval", included: true },
                { text: "View Job Applications", included: true },
                { text: "Use Timeproof", included: true },
                { text: "Bookmark Workers", included: true },
                { text: "Easypay", included: true },
            ]
        },
        {
            id: 'pro',
            name: "PRO",
            price: billingCycle === 'monthly' ? "69" : "299",
            subtitle: "Monthly / Annually",
            savings: "63% Savings!",
            buttonText: "UPGRADE",
            color: "border-sky-500",
            headerBg: "bg-sky-500",
            cancelText: "Cancel Anytime Easily",
            features: [
                { text: "Hire & Communicate with Workers", included: true },
                { text: "Up to 3 Job Posts", included: true },
                { text: "Max 200 applications per Job", included: true },
                { text: "Instant Job Post approval", included: true },
                { text: "View Job Applications", included: true },
                { text: "Use Timeproof", included: true },
                { text: "Bookmark Workers", included: true },
                { text: "Easypay", included: true },
                { text: "Contact 75 workers / month", included: true, hasInfo: true },
                { text: "Read Worker Reviews", included: true },
            ]
        },
        {
            id: 'premium',
            name: "PREMIUM",
            price: billingCycle === 'monthly' ? "99" : "349",
            popular: true,
            subtitle: "Monthly / Annually",
            savings: "70% Savings!",
            buttonText: "UPGRADE",
            color: "border-rose-500",
            headerBg: "bg-rose-500",
            cancelText: "Cancel Anytime Easily",
            badge: { text: "AI Matching", subtext: "(Tell me who to hire!)", tag: "NEW!" },
            features: [
                { text: "Hire & Communicate with Workers", included: true },
                { text: "Up to 10 Job Posts", included: true },
                { text: "Max 200 applications per Job", included: true },
                { text: "Instant Job Post approval", included: true },
                { text: "View Job Applications", included: true },
                { text: "Use Timeproof", included: true },
                { text: "Bookmark Workers", included: true },
                { text: "Easypay", included: true },
                { text: "Contact 500 workers / month", included: true, hasInfo: true },
                { text: "Read Worker Reviews", included: true },
                { text: "Unlimited Background Data Checks", included: true, highlight: true },
                { text: "Worker Mentoring Service", included: true, highlight: true },
                { text: "AI Matching (Tell me who to hire!)", included: true, highlight: true, tag: "NEW!", hasInfo: true },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            <Navbar forceSolid />

            {/* Banner Section */}
            <div className="bg-white pt-44 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                        <span className="text-emerald-600">19,019</span> employers upgraded this month.
                    </h1>
                    <p className="text-xl text-slate-600 font-bold mb-2">Hire direct. No salary markups or ongoing fees.</p>
                    <div className="flex flex-wrap justify-center gap-x-4 text-sm font-bold text-slate-400">
                        <Link to="/blog/cancel" className="underline">Cancel when done recruiting.</Link>
                        <span>|</span>
                        <span>Hire great talent or we'll give your money back.</span>
                        <span>|</span>
                        <Link to="/how/employer" className="underline">It's better than a "free trial."</Link>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative bg-white rounded-3xl border-t-8 ${plan.color} shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col h-full`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                        <div className="bg-rose-500 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap">
                                            Most Popular!
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 text-center border-b border-slate-50">
                                    <h3 className={`text-xl font-black tracking-widest mb-2 ${plan.color.replace('border-', 'text-')}`}>
                                        {plan.name}
                                    </h3>

                                    {plan.name === "FREE" ? (
                                        <Link to="/faq/employers" className="text-[10px] font-black text-sky-500 hover:underline uppercase tracking-widest mb-6 block">
                                            {plan.subtitle}
                                        </Link>
                                    ) : (
                                        <div className="flex gap-2 justify-center mb-6">
                                            <button
                                                onClick={() => setBillingCycle('monthly')}
                                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-sky-50 text-sky-600 ring-1 ring-sky-200' : 'text-slate-400'}`}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                onClick={() => setBillingCycle('annually')}
                                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-left ${billingCycle === 'annually' ? 'bg-sky-50 text-sky-600 ring-1 ring-sky-200' : 'text-slate-400'}`}
                                            >
                                                Annually
                                                <div className="text-[8px] opacity-70 leading-none mt-1">{plan.savings}</div>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <span className="text-6xl font-black text-slate-900 tracking-tighter">
                                            {plan.name === "FREE" ? "FREE" : `$${plan.price}`}
                                        </span>
                                        {plan.name !== "FREE" && (
                                            <div className="text-left">
                                                <span className="text-xs font-black text-slate-400 block tracking-widest">USD</span>
                                            </div>
                                        )}
                                        {plan.name === "FREE" && (
                                            <Info size={18} className="text-sky-400" />
                                        )}
                                    </div>
                                </div>

                                {plan.badge && (
                                    <div className="px-8 py-4 bg-emerald-50/50 border-b border-slate-50 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-black text-emerald-700 tracking-tight">{plan.badge.text}</span>
                                            <span className="text-[10px] text-slate-400 block leading-none">{plan.badge.subtext}</span>
                                        </div>
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md uppercase tracking-tighter">{plan.badge.tag}</span>
                                    </div>
                                )}

                                <div className="p-8 flex-grow">
                                    <ul className="package-list space-y-4">
                                        {plan.features.map((feature, fidx) => (
                                            <li key={fidx} className="flex items-start gap-3">
                                                {feature.included ? (
                                                    <Check size={18} className="text-sky-500 shrink-0 mt-0.5" strokeWidth={3} />
                                                ) : (
                                                    <X size={18} className="text-rose-500 shrink-0 mt-0.5" strokeWidth={3} />
                                                )}
                                                <div className="flex-grow flex items-center gap-1.5 flex-wrap">
                                                    <span className={`text-sm font-bold ${feature.included ? 'text-slate-600' : 'text-slate-400'} ${feature.highlight ? 'text-blue-600 font-black' : ''}`}>
                                                        {feature.text}
                                                    </span>
                                                    {feature.tag && (
                                                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-md shrink-0 uppercase">{feature.tag}</span>
                                                    )}
                                                    {feature.hasInfo && (
                                                        <Info size={14} className="text-sky-400 shrink-0" />
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-8 pt-0 mt-auto">
                                    {plan.cancelText && (
                                        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-600 text-[11px] font-black uppercase tracking-widest mb-6">
                                            <Info size={14} /> {plan.cancelText}
                                        </div>
                                    )}

                                    <Link
                                        to="/register?role=employer"
                                        className={`w-full py-5 rounded-2xl text-lg font-black font-outfit shadow-xl transition-all block text-center bg-gradient-primary text-white shadow-primary/20 hover:shadow-primary/40 hover:translate-y-[-2px]`}
                                    >
                                        {plan.name === 'FREE' ? 'REGISTER' : 'UPGRADE'}
                                        {plan.buttonDesc && (
                                            <span className="block text-[10px] opacity-70 italic font-medium -mt-1">{plan.buttonDesc}</span>
                                        )}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guarantee Section */}
            <section className="bg-white py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto bg-slate-900 rounded-[56px] p-12 md:p-20 text-white shadow-2xl shadow-emerald-900/10 overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck size={300} strokeWidth={1} />
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                            <div className="relative shrink-0">
                                <div className="w-48 h-48 rounded-full border-[10px] border-emerald-500/20 flex items-center justify-center">
                                    <div className="w-36 h-36 bg-emerald-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                                        <span className="text-4xl font-black text-white italic">100%</span>
                                    </div>
                                </div>
                                <Zap className="absolute -top-2 -right-2 text-primary fill-primary animate-bounce" size={32} />
                            </div>

                            <div className="flex-grow text-center lg:text-left">
                                <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-none">
                                    Our Rock-Solid <br />
                                    <span className="text-emerald-400 italic">Money Back</span> Guarantee.
                                </h2>
                                <p className="text-xl text-white/60 font-medium mb-10 max-w-2xl leading-relaxed">
                                    We're so confident you'll find an elite professional that we'll refund your entire subscription if you don't. No questions asked.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                                    {['Zero Salary Markups', 'Cancel Anytime', 'No Hidden Fees', 'Direct Hiring'].map((item) => (
                                        <div key={item} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Check className="text-emerald-400" size={12} strokeWidth={4} />
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-widest text-white/80">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link to="/money-back-guarantee" className="inline-flex items-center gap-4 py-5 px-10 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gradient-primary hover:text-white transition-all shadow-xl shadow-white/5 group border border-slate-100 hover:border-white/10">
                                    Learn More About Trust <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Our Employers Love TalentPro PH</h2>
                        <p className="text-xl text-slate-500 font-medium">Join thousands of successful entrepreneurs who found their dream team.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                text: "It’s a great service and I’ve found 6 great team members for our business using it. Love working with talented people who care about what they do.",
                                author: "Paul Helmick",
                                role: "CEO, Health Ventures International"
                            },
                            {
                                text: "I've used this site to find several good VAs in the past. Best decision I have made. It's the most reliable platform for Filipino talent.",
                                author: "Mark C. Moran",
                                role: "CEO, markcmoran.com"
                            },
                            {
                                text: "@TalentProPH Loved working with your service for our company. Have 2 rockstars from you that have changed the way we work.",
                                author: "Mike Kawula",
                                role: "CEO, The Social Quant"
                            },
                            {
                                text: "I've employed a number of people from here over the years, my last was a husband and wife team for 3.5 years. Well worth it.",
                                author: "Carl Vanderpal",
                                role: "CEO, Organic Health Foods"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between"
                            >
                                <div>
                                    <Quote className="text-primary mb-6 opacity-20" size={40} />
                                    <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">"{item.text}"</p>
                                </div>
                                <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full shrink-0 flex items-center justify-center font-black text-slate-400">
                                        {item.author[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 leading-none mb-1">{item.author}</h4>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Link to="/real-results" className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-full uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-100">
                            See More Real Results <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Companies Section */}
            <section className="py-24 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h4 className="text-center text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mb-12">Companies using TalentPro PH</h4>
                    <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                        {['Unilever', 'Speedo', 'Newsweek', 'Google', 'Uber', 'Canva', 'ABS-CBN'].map(brand => (
                            <span key={brand} className="text-3xl font-black text-slate-900 tracking-tighter hover:text-primary transition-colors cursor-default">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-4xl font-black text-slate-900 text-center mb-16 tracking-tighter">Frequently Asked Questions</h2>

                    <div className="space-y-12">
                        {faqs.map((group, gIdx) => (
                            <div key={gIdx}>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-4">{group.category}</h4>
                                <div className="space-y-3">
                                    {group.questions.map((faq, qIdx) => {
                                        const id = `faq-${gIdx}-${qIdx}`;
                                        const isOpen = activeFaq === id;
                                        return (
                                            <div key={id} className={`rounded-2xl border transition-all ${isOpen ? 'bg-white border-slate-200 shadow-xl' : 'border-slate-100 hover:border-slate-200'}`}>
                                                <button
                                                    onClick={() => setActiveFaq(isOpen ? null : id)}
                                                    className="w-full text-left p-6 flex justify-between items-center gap-4"
                                                >
                                                    <span className="font-bold text-slate-800">{faq.q}</span>
                                                    <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-6 pb-6 pt-0 text-slate-500 font-medium leading-relaxed">
                                                                <div className="h-px bg-slate-200 w-full mb-4 opacity-50" />
                                                                {faq.a}
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
            </section>
        </div>
    );
};

export default PricingPage;
