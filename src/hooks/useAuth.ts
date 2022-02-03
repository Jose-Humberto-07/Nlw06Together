import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

//arquivi para transformar duas importações em uma

export function useAuth() {
    const value = useContext(AuthContext);
    
    return value;
}