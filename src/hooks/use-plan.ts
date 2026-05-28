import { createClient } from '@/lib/supabase-client';
import { useQuery } from '@tanstack/react-query';

// This is a client-side Supabase client
const supabase = createClient();

const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('plan, stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (error) {
    // It's common for a profile to not exist immediately after signup.
    // Instead of throwing an error, we can return a known state.
    if (error.code === 'PGRST116') { // "PostgREST error: No rows found"
      return { plan: 'free', stripe_customer_id: null }; // Default to free plan
    } else {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  return profile;
};

export const usePlan = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  return {
    plan: profile?.plan,
    stripeCustomerId: profile?.stripe_customer_id,
    isLoading,
    error,
  };
};
