import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://krlkpdqmillhraqyawax.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybGtwZHFtaWxsaHJhcXlhd2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MDM0MjYsImV4cCI6MjA1MjM3OTQyNn0.NELLhXz_81B4iK9OJQZC3VoK9aNxK_Obpmp_6AFb_rY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
