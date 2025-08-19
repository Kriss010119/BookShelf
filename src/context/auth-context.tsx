import type {User} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {SignOutUser, userStateListener} from "../firebase/firebase-config";
import {createContext, type ReactNode, useEffect, useState} from "react";

type Props = {
    children?: ReactNode;
}

export const AuthContext = createContext({
    user: {} as User | null,
    signOut: () => {}
})

export const AuthProvider = ({children}: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        return userStateListener((user) => {
            setUser(user);
        });
    }, []);

    const signOut = () => {
        SignOutUser().then(() => {
            setUser(null);
            navigate("/");
        });
    };

    const value = {user, signOut};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};