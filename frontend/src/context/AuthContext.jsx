import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";

export const AuthContext = createContext()

export const useAuthContext = () => {
    return useContext(AuthContext) // returns the value prop of the nearest Provider above the current component tree.
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            setLoading(true)

            try {
                const res = await fetch('/api/auth/check', { credentials: "include" })
                if (!res.ok) {
                    throw new Error('Could not authenticate user')
                }
                const data = await res.json()
                setAuthUser(data.user)// null or aurthenticated user object
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        checkUserLoggedIn();
    }, [])
    return (
        <AuthContext.Provider value={{ authUser, setAuthUser ,loading}}>
            {children}
        </AuthContext.Provider>
    )
}