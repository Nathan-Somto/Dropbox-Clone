/* eslint-disable react-refresh/only-export-components */
import { auth } from "@/config/firebase";
import { onAuthStateChanged, User } from "firebase/auth"
import React, {createContext, useContext, useState, useEffect} from "react"
const Auth = createContext<AuthContext | null>(null)
export type AuthStateType = {
    user: null | User;
    loading: boolean;
    error: boolean;
}
export type AuthContext = {
    authState: AuthStateType;
    setAuthState : React.Dispatch<React.SetStateAction<AuthStateType>>
} 
function AuthProvider({children}: {children : React.ReactNode}) {
    const [ authState, setAuthState] = useState<AuthStateType>({
        user: null,
        loading: true,
        error:false
    })
    useEffect(() => {
        const unSub = onAuthStateChanged(auth,(user) => {        
                setAuthState(prevState => ({
                        ...prevState,
                        user,
                        loading: false
                    }))
            }
             
        )
        return  unSub
    }, [])
    return(
        <Auth.Provider value={{authState, setAuthState}}>
            {children}
        </Auth.Provider>
    )
}
export function useAuth() : AuthContext | null {
    return useContext(Auth)
}
export default AuthProvider