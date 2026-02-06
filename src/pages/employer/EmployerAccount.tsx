import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Camera,
    Save,
    User,
    Mail,
    Link as LinkIcon,
    MapPin,
    Building2,
    Shield,
    CreditCard,
    Bell,
    Lock,
    Smartphone,
    History,
    Download,
    AlertCircle
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

const EmployerAccount = () => {
    const navigate = useNavigate();
    const userContext = useUser();
    const [activeTab, setActiveTab] = useState('profile');

    // Initialize state from context
    const [profile, setProfile] = useState({
        name: userContext.name || '',
        title: userContext.title || '',
        company: userContext.company || '',
        email: userContext.email || '',
        phone: userContext.phone || '',
        location: userContext.location || '',
        website: userContext.website || '',
        bio: userContext.bio || '',
        avatar: userContext.photo || ''
    });

    const handleSave = async () => {
        try {
            await userContext.updateUserProfile({
                name: profile.name,
                title: profile.title,
                company: profile.company,
                phone: profile.phone,
                location: profile.location,
                website: profile.website,
                bio: profile.bio,
                photo: profile.avatar
            });
            alert("Profile saved successfully!");
        } catch (error) {
            alert("Failed to save profile. Please try again.");
        }
    };

    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const handleAddCard = () => {
        if (!newCard.number || !newCard.expiry || !newCard.cvc) {
            alert("Please fill in all card details.");
            return;
        }

        userContext.addPaymentMethod({
            brand: 'visa', // Mock
            last4: newCard.number.slice(-4),
            expiry: newCard.expiry,
            name: newCard.name,
            isDefault: userContext.paymentMethods.length === 0
        });

        setNewCard({ number: '', expiry: '', cvc: '', name: '' });
        setShowAddCard(false);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Update local state for preview
                setProfile(prev => ({ ...prev, avatar: result }));
                // Automatically save and update global state
                userContext.updateUserProfile({ photo: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'profile', icon: User, label: 'Profile Settings' },
        { id: 'company', icon: Building2, label: 'Company Profile' },
        { id: 'security', icon: Shield, label: 'Security & Login' },
        { id: 'billing', icon: CreditCard, label: 'Billing & Plan' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
    ];

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-10 pb-20 px-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-outfit">My Account</h1>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest mt-1">
                    Employer Configuration
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white border-2 border-slate-50 p-8 rounded-[40px] shadow-sm text-center relative group overflow-hidden">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-[28px] bg-slate-100 overflow-hidden ring-[6px] ring-white shadow-xl mx-auto mb-6 group-hover:scale-105 transition-transform">
                                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                            </div>
                            <label className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all border-4 border-white cursor-pointer">
                                <Camera size={16} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                />
                            </label>
                        </div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tighter leading-tight">{profile.name}</h2>
                        <p className="text-xs font-bold text-slate-400 mt-1">{profile.company}</p>
                    </div>

                    <div className="bg-white border-2 border-slate-50 p-3 rounded-[32px] shadow-sm space-y-1">
                        {tabs.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-xs font-bold transition-all ${activeTab === item.id
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3">
                    <div className="bg-white border-2 border-slate-50 p-8 md:p-10 rounded-[48px] shadow-sm relative overflow-hidden min-h-[600px]">
                        {/* Decorative bg element */}
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] grayscale -translate-y-1/2 translate-x-1/4 pointer-events-none">
                            {activeTab === 'profile' && <User size={300} />}
                            {activeTab === 'security' && <Shield size={300} />}
                            {activeTab === 'billing' && <CreditCard size={300} />}
                            {activeTab === 'notifications' && <Bell size={300} />}
                        </div>

                        <div className="relative z-10 space-y-8">
                            {activeTab === 'profile' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Personal Information</h3>
                                        <button className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">
                                            Public View
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Job Title</label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={profile.title}
                                                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Location</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={profile.location}
                                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Company Website</label>
                                            <div className="relative group">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={profile.website}
                                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Professional Bio</label>
                                            <textarea
                                                value={profile.bio}
                                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                rows={4}
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all resize-none leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                                        <button className="px-8 py-3.5 bg-slate-100 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-10 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                                        >
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                </>
                            )}

                            {activeTab === 'company' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Company Profile</h3>
                                        <button className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">
                                            Preview Public Page
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Company Logo & Banner */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Brand Assets</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Company Logo</label>
                                                    <div className="relative group">
                                                        <div className="w-32 h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                                                            <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                                                                <Building2 size={32} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Logo</span>
                                                                <input type="file" accept="image/*" className="hidden" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Cover Banner (1200x400)</label>
                                                    <div className="relative group">
                                                        <div className="w-full h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                                                            <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                                                                <Camera size={32} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Banner</span>
                                                                <input type="file" accept="image/*" className="hidden" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Basic Company Information */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Company Information</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Company Name</label>
                                                    <input
                                                        type="text"
                                                        defaultValue={profile.company}
                                                        placeholder="TechFlow Solutions"
                                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Industry</label>
                                                    <select className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all">
                                                        <option>Software & Technology</option>
                                                        <option>Finance & Banking</option>
                                                        <option>E-Commerce</option>
                                                        <option>Healthcare</option>
                                                        <option>Marketing & Advertising</option>
                                                        <option>Education</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Company Size</label>
                                                    <select className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all">
                                                        <option>1-10 Employees</option>
                                                        <option>11-50 Employees</option>
                                                        <option>51-200 Employees</option>
                                                        <option>201-500 Employees</option>
                                                        <option>500+ Employees</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Founded Year</label>
                                                    <input
                                                        type="number"
                                                        placeholder="2018"
                                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Headquarters Location</label>
                                                    <div className="relative group">
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                                        <input
                                                            type="text"
                                                            defaultValue={profile.location}
                                                            placeholder="New York, USA"
                                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">About Company</label>
                                                    <textarea
                                                        rows={5}
                                                        placeholder="Tell candidates about your company, mission, culture, and what makes you unique..."
                                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all resize-none leading-relaxed"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Perks & Benefits */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Perks & Benefits</h4>
                                            <div className="space-y-3">
                                                <p className="text-xs text-slate-500 font-medium">Add benefits that make your company attractive to candidates</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Remote Work', 'Health Insurance', 'Flexible Hours', 'Paid Time Off', 'Learning Budget'].map((perk, i) => (
                                                        <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer">
                                                            {perk} <span className="ml-2 text-slate-300">×</span>
                                                        </span>
                                                    ))}
                                                    <button className="px-4 py-2 border-2 border-dashed border-slate-200 rounded-full text-xs font-black text-primary uppercase tracking-widest hover:bg-primary/5 hover:border-primary transition-all">
                                                        + Add Perk
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Social Media & Links</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Website</label>
                                                    <input
                                                        type="url"
                                                        defaultValue={profile.website}
                                                        placeholder="https://company.com"
                                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">LinkedIn</label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://linkedin.com/company/..."
                                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Twitter</label>
                                                    <input
                                                        type="text"
                                                        placeholder="@company"
                                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Facebook</label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://facebook.com/..."
                                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20 focus:bg-primary/5 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                                        <button className="px-8 py-3.5 bg-slate-100 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                            Cancel
                                        </button>
                                        <button className="px-10 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                                            <Save size={18} /> Save Company Profile
                                        </button>
                                    </div>
                                </>
                            )}

                            {activeTab === 'security' && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Security & Login</h3>
                                        <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                                            <Shield size={12} /> Secure
                                        </span>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Password Reset */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Change Password</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Current Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                        <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                        <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                        <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-primary/20" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                                                Update Password
                                            </button>
                                        </div>

                                        {/* 2FA */}
                                        <div className="space-y-4 pt-4">
                                            <div className="flex items-center justify-between p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-3 rounded-xl shadow-sm">
                                                        <Smartphone className="text-primary" size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                                                        <p className="text-xs text-slate-500 font-medium mt-1">Add an extra layer of security to your account.</p>
                                                    </div>
                                                </div>
                                                <button className="relative w-12 h-7 rounded-full bg-slate-200 transition-colors">
                                                    <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Login History */}
                                        <div className="space-y-4 pt-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Recent Login History</h4>
                                            <div className="space-y-3">
                                                {[
                                                    { device: 'Windows PC · Chrome', loc: 'New York, US', time: 'Active now', status: 'current' },
                                                    { device: 'iPhone 13 · App', loc: 'New York, US', time: '2 hours ago', status: 'known' },
                                                    { device: 'Macbook Pro · Safari', loc: 'New Jersey, US', time: 'Yesterday', status: 'known' },
                                                ].map((login, idx) => (
                                                    <div key={idx} className="flex items-center justify-between py-2">
                                                        <div className="flex items-center gap-3">
                                                            <History size={16} className="text-slate-300" />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700">{login.device}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{login.loc} • {login.time}</p>
                                                            </div>
                                                        </div>
                                                        {login.status === 'current' && (
                                                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wide">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'billing' && (
                                <>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Billing & Plan</h3>

                                    <div className="bg-slate-900 text-white p-8 rounded-[32px] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <CreditCard size={180} />
                                        </div>
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
                                                    Current Subscription
                                                </span>
                                                <h2 className="text-3xl font-black font-outfit tracking-tight">Pro Plan</h2>
                                                <p className="text-white/60 font-medium text-sm mt-2">$69 / month • Renews on March 15, 2026</p>
                                                <p className="text-white/40 text-xs mt-1 font-bold">Includes 3 Job Posts & Unlimited Views</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => navigate('/employer/upgrade')}
                                                    className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                                                >
                                                    Change Plan
                                                </button>
                                                <button className="px-6 py-3 bg-transparent border border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Payment Methods</h4>

                                            {/* List Saved Cards */}
                                            <div className="space-y-3">
                                                {userContext.paymentMethods.map((method: any) => (
                                                    <div key={method.id} className="bg-white border-2 border-slate-100 p-6 rounded-3xl flex items-center justify-between group hover:border-slate-200 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-8 bg-slate-800 rounded-md flex items-center justify-center text-white text-[10px] font-bold uppercase">
                                                                {method.brand}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">•••• •••• •••• {method.last4}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Expires {method.expiry}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {method.isDefault && (
                                                                <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">Default</span>
                                                            )}
                                                            <button
                                                                onClick={() => userContext.removePaymentMethod(method.id)}
                                                                className="text-rose-500 text-[10px] font-black uppercase tracking-widest hover:underline"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add New Card Form */}
                                            {showAddCard ? (
                                                <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h5 className="font-bold text-slate-900 text-xs">New Card Details</h5>
                                                        <button onClick={() => setShowAddCard(false)} className="text-slate-400 hover:text-slate-600"><Smartphone size={16} className="rotate-45" /></button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Card Number"
                                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                                                            value={newCard.number}
                                                            onChange={e => setNewCard({ ...newCard, number: e.target.value })}
                                                        />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input
                                                                type="text"
                                                                placeholder="MM/YY"
                                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                                                                value={newCard.expiry}
                                                                onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="CVC"
                                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                                                                value={newCard.cvc}
                                                                onChange={e => setNewCard({ ...newCard, cvc: e.target.value })}
                                                            />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Cardholder Name"
                                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                                                            value={newCard.name}
                                                            onChange={e => setNewCard({ ...newCard, name: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="flex justify-end gap-2 pt-2">
                                                        <button
                                                            onClick={() => setShowAddCard(false)}
                                                            className="px-4 py-2 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-slate-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleAddCard}
                                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800"
                                                        >
                                                            Save Card
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowAddCard(true)}
                                                    className="flex items-center gap-2 text-slate-400 text-xs font-bold hover:text-primary transition-colors py-2"
                                                >
                                                    <CreditCard size={14} /> Add new payment method
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Billing History</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { date: 'Feb 15, 2026', amount: '$69.00', status: 'Paid', invoice: '#INV-2026-003' },
                                                    { date: 'Jan 15, 2026', amount: '$69.00', status: 'Paid', invoice: '#INV-2026-002' },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900">{item.date}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{item.invoice}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs font-bold text-slate-600">{item.amount}</span>
                                                            <Download size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'notifications' && (
                                <>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Notifications</h3>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Email Alerts</h4>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'New Applicant Alerts', desc: 'Get notified when someone applies to your job posts.', active: true },
                                                    { label: 'Message Digest', desc: 'Daily summary of unread messages from candidates.', active: true },
                                                    { label: 'Product Updates', desc: 'News about TalentPro PH features and improvements.', active: false },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{item.label}</p>
                                                            <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                                                        </div>
                                                        <button className={`w-12 h-7 rounded-full transition-colors relative ${item.active ? 'bg-primary' : 'bg-slate-200'}`}>
                                                            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${item.active ? 'left-6' : 'left-1'}`} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">Push Notifications</h4>
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-[9px] font-black uppercase">Beta</span>
                                            </div>
                                            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
                                                <AlertCircle className="text-amber-500 shrink-0" size={24} />
                                                <div>
                                                    <h5 className="font-bold text-amber-900 mb-1">Browser Notifications</h5>
                                                    <p className="text-xs text-amber-700/80 font-medium mb-4 leading-relaxed">
                                                        Enable push notifications to get real-time updates even when you're not on the platform. Great for instant message replies.
                                                    </p>
                                                    <button className="px-5 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-amber-100 transition-all">
                                                        Enable Permissions
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerAccount;
