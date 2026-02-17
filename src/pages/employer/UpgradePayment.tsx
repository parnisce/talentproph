import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CreditCard,
    ShieldCheck,
    Lock,
    CheckCircle2,
    ChevronLeft,
    Building,
    Globe,
    User,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const UpgradePayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userContext = useUser();

    // Default values if navigated directly without state
    const { plan = 'Pro', price = '69', cycle = 'monthly' } = location.state || {};

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | 'new'>(
        userContext.paymentMethods.length > 0 ? userContext.paymentMethods[0].id : 'new'
    );
    const [saveCard, setSaveCard] = useState(true);

    // New card form state
    const [newCard, setNewCard] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Update the plan in user profile
            await userContext.updateUserProfile({
                subscription_plan: plan
            });

            // Record in billing history
            await userContext.addBillingRecord({
                amount: parseFloat(price),
                currency: 'USD',
                status: 'Paid',
                invoice_number: `INV-${Date.now().toString().slice(-6)}`,
                description: `${plan} Plan Monthly Subscription`,
                receipt_url: '#' // Placeholder link
            });

            if (selectedCardId === 'new' && saveCard) {
                // Save the new card
                await userContext.addPaymentMethod({
                    brand: 'visa', // Mock brand detection
                    last4: newCard.number.slice(-4),
                    expiry: newCard.expiry,
                    name: newCard.name,
                    isDefault: userContext.paymentMethods.length === 0
                });
            }

            // Simulate small delay for UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            alert(`Successfully upgraded to ${plan} ${cycle} plan!`);
            navigate('/employer');
        } catch (error: any) {
            console.error("Payment failed:", error);
            alert("Payment failed: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const total = parseFloat(price);
    const tax = total * 0.12; // Example tax
    const grandTotal = (total + tax).toFixed(2);

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest mb-6 group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Plans
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">Secure Checkout</h1>
                        <p className="text-slate-500 font-medium mt-1">Complete your upgrade to unlock premium features.</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                        <Lock size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">256-bit SSL Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Payment Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handlePayment} className="space-y-8">
                        {/* Payment Method Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border-2 border-slate-50 p-8 rounded-[40px] shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] -translate-y-1/2 translate-x-1/4 pointer-events-none">
                                <CreditCard size={240} />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                                    Payment Method
                                </h3>

                                {/* Saved Cards Selection */}
                                <div className="space-y-3">
                                    {userContext.paymentMethods.map((method: any) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedCardId === method.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-100 hover:border-slate-200'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={selectedCardId === method.id}
                                                onChange={() => setSelectedCardId(method.id)}
                                                className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                                            />
                                            <div className="flex items-center gap-3 flex-grow">
                                                <div className="h-8 w-12 bg-white rounded border border-slate-200 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold uppercase">{method.brand}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">•••• •••• •••• {method.last4}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Expires {method.expiry}</p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}

                                    {/* Add New Card Option */}
                                    <label
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedCardId === 'new'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="new"
                                            checked={selectedCardId === 'new'}
                                            onChange={() => setSelectedCardId('new')}
                                            className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-400">
                                                <Plus size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">Add New Card</span>
                                        </div>
                                    </label>
                                </div>

                                {/* New Card Form */}
                                <AnimatePresence>
                                    {selectedCardId === 'new' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pt-4"
                                        >
                                            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <div className="flex gap-2 mb-2 opacity-50">
                                                    {['visa', 'mastercard', 'amex'].map(card => (
                                                        <div key={card} className="h-6 w-10 bg-white rounded border border-slate-200 flex items-center justify-center grayscale">
                                                            <span className="text-[8px] font-bold uppercase">{card}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Card Number</label>
                                                    <div className="relative group">
                                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                                        <input
                                                            type="text"
                                                            placeholder="0000 0000 0000 0000"
                                                            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all placeholder:text-slate-300"
                                                            value={newCard.number}
                                                            onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                                                            required={selectedCardId === 'new'}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Expiry Date</label>
                                                        <input
                                                            type="text"
                                                            placeholder="MM / YY"
                                                            className="w-full px-6 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all placeholder:text-slate-300"
                                                            value={newCard.expiry}
                                                            onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                                            required={selectedCardId === 'new'}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">CVC</label>
                                                        <div className="relative group">
                                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} />
                                                            <input
                                                                type="text"
                                                                placeholder="123"
                                                                className="w-full px-6 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all placeholder:text-slate-300"
                                                                value={newCard.cvc}
                                                                onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                                                                required={selectedCardId === 'new'}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Name on Card</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                                        <input
                                                            type="text"
                                                            placeholder="Enter full name"
                                                            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all placeholder:text-slate-300"
                                                            value={newCard.name}
                                                            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                                                            required={selectedCardId === 'new'}
                                                        />
                                                    </div>
                                                </div>

                                                <label className="flex items-center gap-3 pt-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={saveCard}
                                                        onChange={(e) => setSaveCard(e.target.checked)}
                                                        className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                                                    />
                                                    <span className="text-xs font-bold text-slate-600">Save this card for future payments</span>
                                                </label>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Billing Address Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white border-2 border-slate-50 p-8 rounded-[40px] shadow-sm relative overflow-hidden"
                        >
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                                    Billing Address
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Street Address</label>
                                        <div className="relative group">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                placeholder="123 Business Rd"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City</label>
                                            <input
                                                type="text"
                                                placeholder="New York"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Postal Code</label>
                                            <input
                                                type="text"
                                                placeholder="10001"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Country</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <select className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all appearance-none cursor-pointer">
                                                <option>United States</option>
                                                <option>Philippines</option>
                                                <option>Australia</option>
                                                <option>United Kingdom</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-5 bg-gradient-to-r from-primary to-primary-deep text-white rounded-[24px] text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>Pay ${grandTotal}</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 text-white p-8 rounded-[40px] sticky top-6 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <ShieldCheck size={180} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-black tracking-tighter mb-6">Order Summary</h3>

                            <div className="pb-6 border-b border-white/10 mb-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-black text-lg">{plan} Plan</p>
                                        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Billed {cycle}</p>
                                    </div>
                                    <p className="font-bold">${price}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm font-medium text-white/60">
                                    <span>Subtotal</span>
                                    <span>${price}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-white/60">
                                    <span>Tax (12%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between text-xl font-black text-white">
                                    <span>Total</span>
                                    <span>${grandTotal}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-white/80 font-medium">Instant activation upon payment.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-white/80 font-medium">100% money-back guarantee if not satisfied.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-white/80 font-medium">Secure SSL encrypted payment.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UpgradePayment;
