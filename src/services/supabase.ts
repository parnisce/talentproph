import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
    profiles: {
        get: async (id: string) => supabase.from('profiles').select('*').eq('id', id).single(),
        update: async (id: string, data: any) => supabase.from('profiles').update(data).eq('id', id),
    },
    jobs: {
        list: async () => supabase.from('jobs').select('*').order('created_at', { ascending: false }),
        create: async (data: any) => supabase.from('jobs').insert(data),
        get: async (id: string) => supabase.from('jobs').select('*, employer:profiles(*)').eq('id', id).single(),
    },
    applications: {
        submit: async (data: any) => supabase.from('applications').insert(data),
        listByJob: async (jobId: string) => supabase.from('applications').select('*, seeker:profiles(*)').eq('job_id', jobId),
    },
    messages: {
        send: async (data: any) => supabase.from('messages').insert(data),
        list: async (userId1: string, userId2: string) =>
            supabase.from('messages')
                .select('*')
                .or(`sender_id.eq.${userId1},receiver_id.eq.${userId1}`)
                .or(`sender_id.eq.${userId2},receiver_id.eq.${userId2}`)
                .order('created_at', { ascending: true }),
    },
    interviews: {
        schedule: async (data: any) => supabase.from('interviews').insert(data),
        list: async (userId: string) =>
            supabase.from('interviews')
                .select('*')
                .or(`seeker_id.eq.${userId},employer_id.eq.${userId}`)
                .order('scheduled_at', { ascending: true }),
    }
};
