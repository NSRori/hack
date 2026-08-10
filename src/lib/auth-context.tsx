'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'NGO';
  college_name?: string;
  skills?: string;
  contact_info?: string;
  avatar_url?: string;
}

const DEMO_USERS: AuthUser[] = [
  {
    id: 'usr_stu_1',
    name: 'Arun Kumar',
    email: 'arun.v@rnsit.ac.in',
    role: 'STUDENT',
    college_name: 'RNSIT (R.N.S. Institute of Technology)',
    skills: JSON.stringify(['Teaching & Tutoring', 'Python Coding', 'Event Operations', 'Food Distribution']),
    contact_info: '+91 98450 12345',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'usr_stu_2',
    name: 'Ananya Sharma',
    email: 'ananya.s@rvce.edu.in',
    role: 'STUDENT',
    college_name: 'RV College of Engineering (RVCE)',
    skills: JSON.stringify(['Social Media Campaigning', 'First Aid', 'Public Speaking']),
    contact_info: '+91 98451 23456',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'usr_ngo_1',
    name: 'Akshaya Patra Foundation',
    email: 'contact@akshayapatra-mock.org',
    role: 'NGO',
    contact_info: '+91 80 3001 2222',
    avatar_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'usr_ngo_2',
    name: 'Youth For Seva Bengaluru',
    email: 'bengaluru@youthforseva-mock.org',
    role: 'NGO',
    contact_info: '+91 80 2660 4123',
    avatar_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=300&q=80',
  },
];

interface AuthContextType {
  currentUser: AuthUser;
  switchUser: (userId: string) => void;
  demoUsers: AuthUser[];
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: DEMO_USERS[0],
  switchUser: () => {},
  demoUsers: DEMO_USERS,
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser>(DEMO_USERS[0]);

  useEffect(() => {
    const savedUserId = localStorage.getItem('impactsetu_user_id');
    if (savedUserId) {
      const found = DEMO_USERS.find((u) => u.id === savedUserId);
      if (found) setCurrentUser(found);
    }
  }, []);

  const switchUser = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('impactsetu_user_id', found.id);
    }
  };

  const refreshUser = () => {
    // Re-trigger state refresh if needed
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchUser, demoUsers: DEMO_USERS, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
