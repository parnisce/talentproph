
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log("Checking Supabase connection...");
    const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Total Profiles:", count);
        console.log("Profiles by role:", data.reduce((acc, p) => {
            acc[p.role] = (acc[p.role] || 0) + 1;
            return acc;
        }, {}));
        if (data.length > 0) {
            console.log("Sample Profile (first one):", JSON.stringify(data[0], null, 2));
        }
    }
}

check();
