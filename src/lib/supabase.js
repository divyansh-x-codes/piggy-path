import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dnbqtysewtjqiadoveay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuYnF0eXNld3RqcWlhZG92ZWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NjgzNDEsImV4cCI6MjA5MTU0NDM0MX0.isbl3-grt1Ec_Kv7W7-XwU5kBSxFAr5b-DsyAPnBWPA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Authentication Helper Functions
 */

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
