import { SupabaseClient, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createContext, useContext, useEffect } from 'react';

type ClientType = {
  client:SupabaseClient|null
}

const AuthContext = createContext<ClientType>({client:null});

function AuthContextProvider({ children}: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  let sharedState = {client:supabase}
 
  return (
    <AuthContext.Provider value={sharedState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
export default AuthContextProvider