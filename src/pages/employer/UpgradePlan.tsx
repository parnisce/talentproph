import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, Crown, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const UpgradePlan = () => {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleUpgrade = (plan: any) => {
        if (plan.price === 'Free') return; // Current plan
        if (plan.price === 'Custom') {
            window.location.href = 'mailto:sales@talentpro.ph';
            return;
        }

        // Navigate to payment page with plan details
        // Remove '$' from price for calculation
        const numericPrice = plan.price.replace('$', '');

        navigate('/employer/upgrade/payment', {
            state: {
                plan: plan.name,
                price: numericPrice,
                cycle: billingCycle
            }
        });
    };

    const plans = [
        {
            name: 'Starter',
            price: 'Free',
            period: 'forever',
            description: 'Perfect for small businesses hiring their first remote pro.',
            features: [
                '1 Active Job Post',
                'View 10 Applicants per day',
                'Basic Chat Functionality',
                'Standard Support'
            ],
            cta: 'Current Plan',
            popular: false,
            color: 'slate'
        },
        {
            name: 'Pro',
            price: billingCycle === 'monthly' ? '$69' : '$49',
            period: 'per month',
            description: 'Supercharge your hiring with advanced tools and reach.',
            features: [
                '3 Active Job Posts',
                'Unlimited Applicant Views',
                'Priority Listing (Boost x2)',
                'Advanced Filtering & AI Scoring',
                '1 Background Check / mo',
                'Premium Support'
            ],
            cta: 'Upgrade to Pro',
            popular: false,
            color: 'primary'
        },
        {
            name: 'Premium',
            price: billingCycle === 'monthly' ? '$99' : '$79',
            period: 'per month',
            description: 'Tailored solutions for agencies and high-volume hiring.',
            features: [
                '10 Active Job Posts',
                'Dedicated Account Manager',
                'API Access',
                'Custom AI Screening Models',
                'Bulk Background Checks',
                'White-label Options'
            ],
            cta: 'Upgrade to Premium',
            popular: true,
            color: 'violet'
        }
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    Unlock Potential
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter font-outfit">
                    Choose the Perfect Plan
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                    Scale your team with tools designed for modern recruitment.
                    <br className="hidden md:block" />Upgrade anytime as you grow.
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center relative">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all z-10 ${billingCycle === 'monthly' ? 'text-slate-900 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all z-10 flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-slate-900 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Yearly <span className="text-[9px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md">-20%</span>
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-6">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative p-8 rounded-[48px] border-2 transition-all ${plan.popular
                            ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-105 z-10'
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                                <Crown size={14} className="fill-white" /> Most Popular
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <h3 className={`text-xl font-black tracking-tighter mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-4xl font-black tracking-tighter ${plan.popular ? 'text-primary' : 'text-slate-900'}`}>
                                        {plan.price}
                                    </span>
                                    <span className={`text-sm font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                                        /{plan.period}
                                    </span>
                                </div>
                                <p className={`mt-4 text-sm font-medium leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <hr className={`border-t-2 ${plan.popular ? 'border-white/10' : 'border-slate-50'}`} />

                            <ul className="space-y-4">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3">
                                        <CheckCircle2
                                            size={18}
                                            className={`shrink-0 mt-0.5 ${plan.popular ? 'text-emerald-400' : 'text-emerald-500'
                                                }`}
                                        />
                                        <span className={`text-sm font-bold ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4">
                                <button
                                    onClick={() => handleUpgrade(plan)}
                                    className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 ${plan.popular
                                        ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-white hover:text-primary'
                                        : 'bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                                        }`}>
                                    {plan.cta}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                <div className="bg-slate-50 rounded-3xl p-6 flex flex-col items-center text-center gap-3">
                    <ShieldCheck size={32} className="text-secondary" />
                    <div>
                        <h4 className="font-black text-slate-900">Secure Payments</h4>
                        <p className="text-xs font-medium text-slate-500 mt-1">Encrypted transactions via Stripe</p>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-3xl p-6 flex flex-col items-center text-center gap-3">
                    <Zap size={32} className="text-amber-500" />
                    <div>
                        <h4 className="font-black text-slate-900">Instant Activation</h4>
                        <p className="text-xs font-medium text-slate-500 mt-1">Access pro features immediately</p>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-3xl p-6 flex flex-col items-center text-center gap-3">
                    <Star size={32} className="text-primary" />
                    <div>
                        <h4 className="font-black text-slate-900">Satisfaction Guarantee</h4>
                        <p className="text-xs font-medium text-slate-500 mt-1">Cancel anytime, no questions asked</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradePlan;
