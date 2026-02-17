import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { calculateTalentScore } from '../utils/talentScore';

export interface UserProfile {
    id: string;
    name: string;
    photo: string;
    role: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    bio: string;
    // Psychometric results
    iq: number;
    disc: {
        dominance: number;
        influence: number;
        steadiness: number;
        compliance: number;
    };
    english: string;
    salary: string;
    education: string;
    experience: string;
    skills: string[];
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    availability: string;
    banner_photo: string;
    resume_url: string;
    verification_proof_url: string;
    verification_status: string;
    government_id_url: string;
    billing_address: string;
    mobile_number: string;
    is_verified_pro: boolean;
    talent_score: number;
    // Employer specific
    company_logo: string;
    industry: string;
    company_size: string;
    founded_year: number;
    about_company: string;
    perks: string[];
    subscription_plan: string;
    created_at: string;
}

export interface BillingItem {
    id: string;
    created_at: string;
    amount: number;
    currency: string;
    status: string;
    invoice_number: string;
    description: string;
    receipt_url?: string;
}


interface UserContextType extends UserProfile {
    // Aliases for backward compatibility
    userName: string;
    userPhoto: string;
    userRole: string;

    testScores: {
        iq: number;
        disc: {
            dominance: number;
            influence: number;
            steadiness: number;
            compliance: number;
        };
        english: string;
    };
    updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
    updateTestScores: (scores: UserContextType['testScores']) => void;
    paymentMethods: any[];
    billingHistory: BillingItem[];
    addPaymentMethod: (method: any) => void;
    removePaymentMethod: (id: string) => void;
    addBillingRecord: (record: Omit<BillingItem, 'id' | 'created_at'>) => Promise<void>;
    cancelSubscription: () => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile>(() => {
        return {
            id: "",
            name: "",
            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
            role: "seeker",
            title: "",
            company: "",
            email: "",
            phone: "",
            location: "",
            website: "",
            bio: "",
            iq: 0,
            disc: { dominance: 0, influence: 0, steadiness: 0, compliance: 0 },
            english: "N/A",
            salary: "",
            education: "",
            experience: "",
            skills: [],
            linkedin: "",
            twitter: "",
            facebook: "",
            instagram: "",
            availability: "Full-Time",
            banner_photo: "",
            resume_url: "",
            verification_proof_url: "",
            verification_status: "unverified",
            government_id_url: "",
            billing_address: "",
            mobile_number: "",
            is_verified_pro: false,
            talent_score: 0,
            company_logo: "",
            industry: "",
            company_size: "",
            founded_year: new Date().getFullYear(),
            about_company: "",
            perks: [],
            subscription_plan: "Free",
            created_at: ""
        };
    });




    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [billingHistory, setBillingHistory] = useState<BillingItem[]>([]);

    const fetchProfile = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                setUserProfile({
                    ...data, // Map all database fields
                    subscription_plan: data.subscription_plan || "Free",
                    id: data.id,
                    name: data.full_name || "",
                    photo: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.full_name || data.id}`,
                    role: data.role || "seeker",
                    title: data.title || "",
                    company: data.company_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    website: data.website || "",
                    bio: data.bio || "",
                    iq: data.iq || 0,
                    disc: data.disc_scores || { dominance: 0, influence: 0, steadiness: 0, compliance: 0 },
                    english: data.english_proficiency || "N/A",
                    salary: data.expected_salary || "",
                    education: data.education_level || "",
                    experience: data.experience_years || "",
                    skills: data.skills_list || [],
                    linkedin: data.linkedin_url || "",
                    twitter: data.twitter_url || "",
                    facebook: data.facebook_url || "",
                    instagram: data.instagram_url || "",
                    availability: data.availability || "Full-Time",
                    banner_photo: data.banner_url || data.banner_photo || "",
                    resume_url: data.resume_url || "",
                    verification_proof_url: data.verification_proof_url || "",
                    verification_status: data.verification_status || "unverified",
                    government_id_url: data.government_id_url || "",
                    billing_address: data.billing_address || "",
                    mobile_number: data.mobile_number || "",
                    is_verified_pro: data.is_verified_pro || false,
                    talent_score: data.talent_score || 0,
                    company_logo: data.company_logo || "",
                    industry: data.industry || "",
                    company_size: data.company_size || "",
                    founded_year: data.founded_year || new Date().getFullYear(),
                    about_company: data.about_company || "",
                    perks: data.perks || [],
                    created_at: data.created_at || ""
                });

                // Fetch Payment Methods
                const { data: methods } = await supabase
                    .from('payment_methods')
                    .select('*')
                    .eq('user_id', userId);
                if (methods) setPaymentMethods(methods);

                // Fetch Billing History
                const { data: history } = await supabase
                    .from('billing_history')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (history && history.length > 0) {
                    setBillingHistory(history);
                } else if (history && history.length === 0 && (data.subscription_plan === 'Pro' || data.subscription_plan === 'Premium')) {
                    // Self-healing: If user is on a paid plan but has no history (e.g. legacy user), 
                    // create an initial record so their billing history isn't empty.
                    console.log("Self-healing: Creating initial billing record for", data.subscription_plan);
                    const initialAmount = data.subscription_plan === 'Pro' ? 69 : 99;
                    const { data: newRecord, error: insertError } = await supabase
                        .from('billing_history')
                        .insert([{
                            user_id: userId,
                            amount: initialAmount,
                            currency: 'USD',
                            status: 'Paid',
                            invoice_number: `INV-INIT-${userId.slice(0, 5).toUpperCase()}`,
                            description: `${data.subscription_plan} Plan Monthly Subscription`
                        }])
                        .select();

                    if (insertError) {
                        console.error("Self-healing failed to insert record:", insertError);
                        setBillingHistory([]); // Ensure it's at least an empty array
                    } else if (newRecord) {
                        setBillingHistory(newRecord);
                    }
                } else if (history) {
                    setBillingHistory(history);
                }

            }
        } catch (fetchError) {
            console.error("Error fetching profile:", fetchError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setUserProfile({
                    id: "",
                    name: "",
                    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
                    role: "seeker",
                    title: "",
                    company: "",
                    email: "",
                    phone: "",
                    location: "",
                    website: "",
                    bio: "",
                    iq: 0,
                    disc: { dominance: 0, influence: 0, steadiness: 0, compliance: 0 },
                    english: "N/A",
                    salary: "",
                    education: "",
                    experience: "",
                    skills: [],
                    linkedin: "",
                    twitter: "",
                    facebook: "",
                    instagram: "",
                    availability: "Full-Time",
                    banner_photo: "",
                    resume_url: "",
                    verification_proof_url: "",
                    verification_status: "unverified",
                    government_id_url: "",
                    billing_address: "",
                    mobile_number: "",
                    is_verified_pro: false,
                    talent_score: 0,
                    company_logo: "",
                    industry: "",
                    company_size: "",
                    founded_year: new Date().getFullYear(),
                    about_company: "",
                    perks: [],
                    subscription_plan: "Free",
                    created_at: ""
                });

                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Auto-calculate and sync Talent Score
    useEffect(() => {
        if (!userProfile.id || loading) return;

        const breakdown = calculateTalentScore(userProfile);
        const total = breakdown.total || 0;

        if (total !== userProfile.talent_score) {
            // Update both local and database
            const syncScore = async () => {
                try {
                    const { error } = await supabase
                        .from('profiles')
                        .update({ talent_score: total })
                        .eq('id', userProfile.id);

                    if (error) throw error;
                    setUserProfile(prev => ({ ...prev, talent_score: total }));
                } catch (err) {
                    console.error("Failed to sync talent score:", err);
                }
            };
            syncScore();
        }
    }, [userProfile.name, userProfile.photo, userProfile.resume_url, userProfile.education, userProfile.iq, userProfile.verification_proof_url, userProfile.verification_status, userProfile.is_verified_pro, userProfile.skills, userProfile.linkedin, userProfile.twitter, userProfile.facebook, userProfile.instagram, loading, userProfile.id]);

    // Auto-verify based on requirements
    useEffect(() => {
        if (!userProfile.id || loading || userProfile.role !== 'seeker') return;

        const hasGovId = !!userProfile.government_id_url;
        const hasAddress = !!userProfile.billing_address;
        const hasMobile = !!userProfile.mobile_number;

        const shouldBeVerified = hasGovId && hasAddress && hasMobile;

        if (shouldBeVerified !== userProfile.is_verified_pro) {
            const syncVerification = async () => {
                try {
                    const { error } = await supabase
                        .from('profiles')
                        .update({
                            is_verified_pro: shouldBeVerified,
                            verification_status: shouldBeVerified ? 'verified' : 'unverified'
                        })
                        .eq('id', userProfile.id);

                    if (error) throw error;
                    setUserProfile(prev => ({
                        ...prev,
                        is_verified_pro: shouldBeVerified,
                        verification_status: shouldBeVerified ? 'verified' : 'unverified'
                    }));
                } catch (err) {
                    console.error("Failed to sync verification status:", err);
                }
            };
            syncVerification();
        }
    }, [userProfile.government_id_url, userProfile.billing_address, userProfile.mobile_number, userProfile.is_verified_pro, userProfile.role, loading, userProfile.id]);

    const updateUserProfile = async (data: Partial<UserProfile>) => {
        if (!userProfile.id) return;

        try {
            // Map our profile keys to database keys if necessary
            const dbData: any = {};
            if (data.name !== undefined) dbData.full_name = data.name;
            if (data.photo !== undefined) dbData.avatar_url = data.photo;
            if (data.title !== undefined) dbData.title = data.title;
            if (data.company !== undefined) dbData.company_name = data.company;
            if (data.phone !== undefined) dbData.phone = data.phone;
            if (data.location !== undefined) dbData.location = data.location;
            if (data.website !== undefined) dbData.website = data.website;
            if (data.bio !== undefined) dbData.bio = data.bio;
            if (data.iq !== undefined) dbData.iq = data.iq;
            if (data.disc !== undefined) dbData.disc_scores = data.disc;
            if (data.english !== undefined) dbData.english_proficiency = data.english;
            if (data.salary !== undefined) dbData.expected_salary = data.salary;
            if (data.education !== undefined) dbData.education_level = data.education;
            if (data.experience !== undefined) dbData.experience_years = data.experience;
            if (data.skills !== undefined) dbData.skills_list = data.skills;
            if (data.linkedin !== undefined) dbData.linkedin_url = data.linkedin;
            if (data.twitter !== undefined) dbData.twitter_url = data.twitter;
            if (data.facebook !== undefined) dbData.facebook_url = data.facebook;
            if (data.instagram !== undefined) dbData.instagram_url = data.instagram;
            if (data.availability !== undefined) dbData.availability = data.availability;
            if (data.banner_photo !== undefined) {
                dbData.banner_url = data.banner_photo;
            }
            if (data.resume_url !== undefined) dbData.resume_url = data.resume_url;
            if (data.verification_proof_url !== undefined) dbData.verification_proof_url = data.verification_proof_url;
            if (data.verification_status !== undefined) dbData.verification_status = data.verification_status;
            if (data.government_id_url !== undefined) dbData.government_id_url = data.government_id_url;
            if (data.billing_address !== undefined) dbData.billing_address = data.billing_address;
            if (data.mobile_number !== undefined) dbData.mobile_number = data.mobile_number;
            if (data.is_verified_pro !== undefined) dbData.is_verified_pro = data.is_verified_pro;
            if (data.talent_score !== undefined) dbData.talent_score = data.talent_score;
            if (data.company_logo !== undefined) dbData.company_logo = data.company_logo;
            if (data.industry !== undefined) dbData.industry = data.industry;
            if (data.company_size !== undefined) dbData.company_size = data.company_size;
            if (data.founded_year !== undefined) dbData.founded_year = data.founded_year;
            if (data.about_company !== undefined) dbData.about_company = data.about_company;
            if (data.perks !== undefined) dbData.perks = data.perks;
            if (data.subscription_plan !== undefined) dbData.subscription_plan = data.subscription_plan;


            // Update local state immediately for snappy UI responsiveness
            setUserProfile(prev => ({ ...prev, ...data }));

            const { error } = await supabase
                .from('profiles')
                .update(dbData)
                .eq('id', userProfile.id);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating profile:", error);
            // Optionally: roll back local state on error? 
            // For now, logging is enough as the user might try again.
            throw error;
        }
    };

    const updateTestScores = (scores: UserContextType['testScores']) => {
        updateUserProfile({
            iq: scores.iq,
            disc: scores.disc,
            english: scores.english
        });
    };

    const addPaymentMethod = async (method: any) => {
        try {
            const { data, error } = await supabase
                .from('payment_methods')
                .insert([{
                    user_id: userProfile.id,
                    brand: method.brand,
                    last4: method.last4,
                    expiry: method.expiry,
                    name: method.name,
                    is_default: method.isDefault
                }])
                .select();

            if (error) throw error;
            if (data) {
                setPaymentMethods(prev => [...prev, data[0]]);
            }
        } catch (error) {
            console.error("Error adding payment method:", error);
            // Fallback to local if table doesn't work well
            setPaymentMethods(prev => [...prev, { ...method, id: Date.now().toString() }]);
        }
    };

    const removePaymentMethod = async (id: string) => {
        try {
            const { error } = await supabase
                .from('payment_methods')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setPaymentMethods(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error removing payment method:", error);
            // Fallback: still remove locally to keep UI responsive
            setPaymentMethods(prev => prev.filter(p => p.id !== id));
        }
    };
    const addBillingRecord = async (record: Omit<BillingItem, 'id' | 'created_at'>) => {
        if (!userProfile.id) return;
        try {
            const { data, error } = await supabase
                .from('billing_history')
                .insert([{
                    user_id: userProfile.id,
                    amount: record.amount,
                    currency: record.currency || 'USD',
                    status: record.status || 'Paid',
                    invoice_number: record.invoice_number,
                    description: record.description,
                    receipt_url: record.receipt_url
                }])
                .select();

            if (error) throw error;
            if (data) {
                setBillingHistory(prev => [data[0], ...prev]);
            }
        } catch (error) {
            console.error("Error adding billing record:", error);
        }
    };

    const cancelSubscription = async () => {
        try {
            await updateUserProfile({ subscription_plan: 'Free' });
            alert("Your subscription has been cancelled successfully. Your plan is now set to Starter.");
        } catch (error) {
            console.error("Error cancelling subscription:", error);
            alert("Failed to cancel subscription. Please contact support.");
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            // Reset user profile to default state
            setUserProfile({
                id: "",
                name: "",
                photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
                role: "seeker",
                title: "",
                company: "",
                email: "",
                phone: "",
                location: "",
                website: "",
                bio: "",
                iq: 0,
                disc: { dominance: 0, influence: 0, steadiness: 0, compliance: 0 },
                english: "N/A",
                salary: "",
                education: "",
                experience: "",
                skills: [],
                linkedin: "",
                twitter: "",
                facebook: "",
                instagram: "",
                availability: "Full-Time",
                banner_photo: "",
                resume_url: "",
                verification_proof_url: "",
                verification_status: "unverified",
                government_id_url: "",
                billing_address: "",
                mobile_number: "",
                is_verified_pro: false,
                talent_score: 0,
                company_logo: "",
                industry: "",
                company_size: "",
                founded_year: new Date().getFullYear(),
                about_company: "",
                perks: [],
                subscription_plan: "Free",
                created_at: ""
            });

            setPaymentMethods([]);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <UserContext.Provider value={{
            ...userProfile,
            userName: userProfile.name,
            userPhoto: userProfile.photo,
            userRole: userProfile.role,
            updateUserProfile,
            testScores: {
                iq: userProfile.iq,
                disc: userProfile.disc,
                english: userProfile.english
            },
            updateTestScores,
            paymentMethods,
            billingHistory,
            addPaymentMethod,
            removePaymentMethod,
            addBillingRecord,
            cancelSubscription,
            logout,
            loading
        }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

