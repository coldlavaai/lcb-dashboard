import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bmvixozvbtrgungtccup.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdml4b3p2YnRyZ3VuZ3RjY3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODQwNTcsImV4cCI6MjA4MDI2MDA1N30._oPRnNEIuQyo3M3MAWWqireDnLLiWrR1oywrOO3lqlc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CottonPriceData {
  id?: number;
  date: string;
  marketing_year?: string | null;
  cny_exchange_rate?: number | null;
  czce_cotton?: number | null;
  czce_cotton_usc_lb?: number | null;
  czce_yarn?: number | null;
  czce_yarn_usc_lb?: number | null;
  cc_index?: number | null;
  cc_index_usc_lb?: number | null;
  czce_psf?: number | null;
  czce_psf_usc_lb?: number | null;
  czce_pta?: number | null;
  czce_pta_usc_lb?: number | null;
  inr_exchange_rate?: number | null;
  mcx?: number | null;
  mcx_usc_lb?: number | null;
  ice?: number | null;
  ice_hi?: number | null;
  ice_lo?: number | null;
  ice_spread?: number | null;
  volume?: string | null;
  open_interest?: string | null;
  a_index?: number | null;
  awp?: number | null;
  certificates?: string | null;
  efp?: number | null;
  // Add any other fields from the original JSON data
  [key: string]: any;
}

export async function getCottonData(): Promise<CottonPriceData[]> {
  const { data, error } = await supabase
    .from('cotton_prices')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching cotton data from Supabase:', error);
    throw error;
  }

  return data || [];
}
