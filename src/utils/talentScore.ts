import type { UserProfile } from '../context/UserContext';

export interface ScoreBreakdown {
    name: number;
    picture: number;
    resume: number;
    education: number;
    psychometric: number;
    verification: number;
    skills: number;
    social: number;
    total: number;
}

export const calculateTalentScore = (profile: Partial<UserProfile>): ScoreBreakdown => {
    const breakdown = {
        name: profile.name ? 10 : 0,
        picture: (profile.photo && !profile.photo.includes('seed=Guest')) ? 10 : 0,
        resume: profile.resume_url ? 20 : 0,
        education: profile.education ? 10 : 0,
        psychometric: (profile.iq && profile.iq > 0) ? 20 : 0, // Simplified: check if IQ is set
        verification: profile.verification_proof_url ? 10 : 0,
        skills: (profile.skills && profile.skills.length > 0) ? 10 : 0,
        social: (profile.linkedin || profile.twitter || profile.facebook || profile.instagram) ? 10 : 0,
    };

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    return {
        ...breakdown,
        total
    };
};
