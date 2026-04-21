import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  Sparkles,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  const [user] = useAuthState(auth);
  const [role, setRole] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    async function fetchRole() {
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            setRole(snap.data().role || 'customer');
          } else {
            setRole('customer');
          }
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole('customer');
        }
      } else {
        setRole(null);
      }
    }
    fetchRole();
  }, [user]);

  const navLinks = [
    { name: 'Catalog', href: '/catalog', icon: LayoutGrid },
    { name: 'Design AI', href: '/design-ai', icon: Sparkles },
    { name: 'Products', href: '/products', icon: ShoppingCart },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#1A3C6E] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[#1A3C6E] leading-none">SPK</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#E67E22] font-semibold">Hardware & Plywoods</p>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className="text-sm font-medium text-slate-600 hover:text-[#1A3C6E] transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5 text-[#1A3C6E]" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200">
                <DropdownMenuLabel className="text-slate-900">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                {user ? (
                  <>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                      onClick={() => navigate('/profile')}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                      onClick={() => navigate('/orders')}
                    >
                      Orders
                    </DropdownMenuItem>
                    {role === 'admin' && (
                      <DropdownMenuItem 
                        className="cursor-pointer font-bold text-[#E67E22] hover:bg-orange-50 focus:bg-orange-50"
                        onClick={() => navigate('/admin')}
                      >
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-slate-100" />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                      onClick={() => auth.signOut()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                    onClick={() => navigate('/auth')}
                  >
                    Login / Register
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button className="bg-[#E67E22] hover:bg-[#d56d1b] text-white rounded-full px-6">
              Get Quote
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-4">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-8 mt-12">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.href}
                      className={cn(buttonVariants({ variant: "ghost" }), "justify-start text-lg font-semibold text-slate-900 flex items-center gap-4")}
                    >
                      <link.icon className="w-6 h-6 text-[#1A3C6E]" />
                      {link.name}
                    </Link>
                  ))}
                  <Separator className="my-4" />
                  {user ? (
                    <Button variant="outline" onClick={() => auth.signOut()} className="justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Button onClick={() => navigate('/auth')}>Login / Register</Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1A3C6E] font-bold text-xl">
                S
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-none">SPK</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#E67E22] font-semibold">Hardware & Plywoods</p>
              </div>
            </div>
            <p className="text-slate-400 max-w-md mb-8">
              Premium hardware and plywood solutions for modern interiors. 
              Authorized dealer for Century Ply, Greenply, Hettich, and more.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/catalog" className="hover:text-white transition-colors">Browse Catalog</Link></li>
              <li><Link to="/design-ai" className="hover:text-white transition-colors">AI Design Assistant</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-[#E67E22]">Add:</span>
                <span>123 Hardware Lane, Industrial Area, Bangalore - 560001</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E67E22]">Tel:</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E67E22]">Mail:</span>
                <span>info@spkhardware.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SPK Hardware & Plywoods. All rights reserved. GSTIN: 29AAAAA0000A1Z5</p>
        </div>
      </div>
    </footer>
  );
}
