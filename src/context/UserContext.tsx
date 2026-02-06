import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
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
    updateUserProfile: (data: Partial<UserProfile>) => void;
    updateTestScores: (scores: UserContextType['testScores']) => void;
    paymentMethods: any[];
    addPaymentMethod: (method: any) => void;
    removePaymentMethod: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initial state: try to load from localStorage, otherwise use default
    const [userProfile, setUserProfile] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('talentpro_user_profile');
        return saved ? JSON.parse(saved) : {
            name: "Sarah Peterson",
            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf",
            role: "employer",
            title: "Senior Hiring Manager",
            company: "TalentPro PH",
            email: "sarah.peterson@talentpro.ph",
            phone: "+1 (555) 123-4567",
            location: "New York, USA",
            website: "https://talentpro.ph",
            bio: "Passionate about connecting world-class talent with innovative companies. I lead recruitment for technical and creative roles."
        };
    });

    const [testScores, setTestScores] = useState(() => {
        const saved = localStorage.getItem('talentpro_test_scores');
        return saved ? JSON.parse(saved) : {
            iq: 138,
            disc: {
                dominance: 36,
                influence: 24,
                steadiness: 22,
                compliance: 17
            },
            english: 'B1 (Intermediate)'
        };
    });

    const updateUserProfile = (data: Partial<UserProfile>) => {
        setUserProfile(prev => {
            const updated = { ...prev, ...data };
            try {
                localStorage.setItem('talentpro_user_profile', JSON.stringify(updated));
            } catch (error) {
                console.error("Failed to save profile to localStorage:", error);
                // Optionally alert the user if it's a quota error
            }
            return updated;
        });
    };

    const updateTestScores = (scores: UserContextType['testScores']) => {
        setTestScores(scores);
        try {
            localStorage.setItem('talentpro_test_scores', JSON.stringify(scores));
        } catch (error) {
            console.error("Failed to save scores to localStorage:", error);
        }
    };

    // Payment Methods
    const [paymentMethods, setPaymentMethods] = useState<any[]>(() => {
        const saved = localStorage.getItem('talentpro_payment_methods');
        return saved ? JSON.parse(saved) : [
            { id: '1', brand: 'visa', last4: '4242', expiry: '12/28', name: 'Sarah Peterson', isDefault: true }
        ];
    });

    const addPaymentMethod = (method: any) => {
        setPaymentMethods(prev => {
            // If new method is default, remove default from others
            const updated = method.isDefault
                ? prev.map(p => ({ ...p, isDefault: false }))
                : prev;

            const newList = [...updated, { ...method, id: Date.now().toString() }];
            try {
                localStorage.setItem('talentpro_payment_methods', JSON.stringify(newList));
            } catch (e) {
                console.error("Failed to save payment methods", e);
            }
            return newList;
        });
    };

    const removePaymentMethod = (id: string) => {
        setPaymentMethods(prev => {
            const newList = prev.filter(p => p.id !== id);
            localStorage.setItem('talentpro_payment_methods', JSON.stringify(newList));
            return newList;
        });
    };

    return (
        <UserContext.Provider value={{
            ...userProfile,
            userName: userProfile.name,
            userPhoto: userProfile.photo,
            userRole: userProfile.role,
            updateUserProfile,
            testScores,
            updateTestScores,
            paymentMethods,
            addPaymentMethod,
            removePaymentMethod
        }}>
            {children}
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
