import {useState, type ReactNode} from 'react';

import type {User} from "../api/user"
import { AuthContext } from "./useAuth";


function readSavedUser(): User | null {
  const saved = localStorage.getItem("user");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function AuthProvider({children}: {children: ReactNode}){
    const[user, setUser] = useState<User| null>(readSavedUser);
    const[token,setToken] = useState<string | null>(() => localStorage.getItem("token"));


    function login(newUser: User, newToken: string){
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem("token", newToken);
         localStorage.setItem("user", JSON.stringify(newUser));
    }

    function logout(){
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
         localStorage.removeItem("user");

    }
    return(
        <AuthContext.Provider value={{user, token, isLoggedIn: !!token
            ,login,logout}}>
        {children}
        </AuthContext.Provider>
    );
}
    
