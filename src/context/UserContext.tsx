import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

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
    addPaymentMethod: (method: any) => void;
    removePaymentMethod: (id: string) => void;
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
                    company_logo: data.company_logo || "",
                    industry: data.industry || "",
                    company_size: data.company_size || "",
                    founded_year: data.founded_year || new Date().getFullYear(),
                    about_company: data.about_company || "",
                    perks: data.perks || [],
                    created_at: data.created_at || ""
                });
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

    const removePaymentMethod = (id: string) => {
        setPaymentMethods(prev => prev.filter(p => p.id !== id));
    };

    const logout = async () => {
        await supabase.auth.signOut();
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
            addPaymentMethod,
            removePaymentMethod,
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

