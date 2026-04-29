import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function productImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${supabaseUrl}/storage/v1/object/public/product-images/${path}`;
}
