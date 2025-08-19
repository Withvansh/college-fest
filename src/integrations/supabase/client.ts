import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bdschyayzjrarabzjkmg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkc2NoeWF5empyYXJhYnpqa21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2Njg1MTMsImV4cCI6MjA2NjI0NDUxM30.w8WqTII0JUrTsSUQj7ma0EGNfusREUoBWXuUyB3NzbM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
