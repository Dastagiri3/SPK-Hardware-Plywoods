import React from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Github, Mail, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Auth() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isAdminLogin, setIsAdminLogin] = React.useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to login with Google');
    }
  };

  const handleEmailAuth = async (type: 'login' | 'register') => {
    setLoading(true);
    try {
      let userCred;
      if (type === 'register') {
        userCred = await createUserWithEmailAndPassword(auth, email, password);
        // During registration, we set the role
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        await setDoc(doc(db, 'users', userCred.user.uid), {
          uid: userCred.user.uid,
          email: userCred.user.email,
          name: 'User',
          role: isAdminLogin ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        });
        toast.success(`${isAdminLogin ? 'Admin' : 'Customer'} account created successfully`);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="w-12 h-12 bg-[#1A3C6E] rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            S
          </div>
          <CardTitle className="text-2xl font-bold text-[#1A3C6E]">
            {isAdminLogin ? 'Admin Gateway' : 'Customer Portal'}
          </CardTitle>
          <CardDescription>
            {isAdminLogin ? 'Manage your inventory and catalogs' : 'Premium Hardware & Plywoods'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button 
              className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", !isAdminLogin ? "bg-white shadow-sm text-[#1A3C6E]" : "text-slate-500")}
              onClick={() => setIsAdminLogin(false)}
            >
              Customer
            </button>
            <button 
              className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", isAdminLogin ? "bg-[#E67E22] shadow-sm text-white" : "text-slate-500")}
              onClick={() => setIsAdminLogin(true)}
            >
              Admin
            </button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <div className="space-y-4 mb-8">
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl border-slate-200"
                onClick={handleGoogleLogin}
              >
                <img src="https://www.gstatic.com/firebase/builtins/pixel.gstatic.com/firebasejs/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 font-bold">Or continue with email</span>
              </div>
            </div>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 h-11 rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 h-11 rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="w-full h-12 rounded-xl bg-[#1A3C6E] hover:bg-[#152e55] font-bold"
                onClick={() => handleEmailAuth('login')}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="reg-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 h-11 rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="reg-password" 
                    type="password" 
                    className="pl-10 h-11 rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="w-full h-12 rounded-xl bg-[#E67E22] hover:bg-[#d56d1b] font-bold"
                onClick={() => handleEmailAuth('register')}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
