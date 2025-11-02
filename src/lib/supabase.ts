import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Item {
  id: string;
  name: string;
  quantity: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Log {
  id: string;
  item_id: string | null;
  item_name: string;
  action: string;
  quantity_change: number;
  comment: string;
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  item_name: string;
  quantity: number;
  is_completed: boolean;
  memo: string;
  created_at: string;
  completed_at: string | null;
}
