import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Navbar, Footer } from '@/components/Layout';
import Home from '@/pages/Home';
import DesignAssistant from '@/pages/DesignAssistant';
import Auth from '@/pages/Auth';
import Catalog from '@/pages/Catalog';
import Products from '@/pages/Products';
import { AIAdvisor } from '@/components/AIAdvisor';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function App() {
  const [user, loading] = useAuthState(auth);

  React.useEffect(() => {
    if (user) {
      // Ensure user document exists
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then((docSnap) => {
        if (!docSnap.exists()) {
          setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'User',
            role: 'customer',
            createdAt: new Date().toISOString()
          });
        }
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#1A3C6E] rounded-2xl" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans selection:bg-[#E67E22]/30">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/design-ai" element={<DesignAssistant />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/products" element={<Products />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <Footer />
        <AIAdvisor />
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}
