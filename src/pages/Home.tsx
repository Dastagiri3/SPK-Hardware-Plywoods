import React from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Clock, 
  LayoutGrid,
  ChevronRight,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';

const BRANDS = [
  { name: 'Century Ply', logo: 'https://picsum.photos/seed/century/200/100', tagline: 'Marine, BWR, BWP' },
  { name: 'Greenply', logo: 'https://picsum.photos/seed/greenply/200/100', tagline: 'Eco-friendly Plywood' },
  { name: 'Hettich', logo: 'https://picsum.photos/seed/hettich/200/100', tagline: 'German Hardware' },
  { name: 'Hafele', logo: 'https://picsum.photos/seed/hafele/200/100', tagline: 'Premium Fittings' },
  { name: 'Merino', logo: 'https://picsum.photos/seed/merino/200/100', tagline: 'Laminates & Surfaces' },
  { name: 'Ebco', logo: 'https://picsum.photos/seed/ebco/200/100', tagline: 'Hardware Solutions' },
];

const CATEGORIES = [
  { name: 'Plywood & Boards', icon: LayoutGrid, count: '120+ Products', id: 'cat-plywood' },
  { name: 'Hardware Fittings', icon: LayoutGrid, count: '500+ Products', id: 'cat-hardware' },
  { name: 'Laminates', icon: LayoutGrid, count: '300+ Products', id: 'cat-laminates' },
  { name: 'Doors & Frames', icon: LayoutGrid, count: '50+ Products', id: 'cat-doors' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#1A3C6E]">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/interior/1920/1080" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A3C6E] via-[#1A3C6E]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E67E22]/20 text-[#E67E22] font-bold text-xs uppercase tracking-widest mb-6"
            >
              <Star className="w-3 h-3 fill-current" />
              Premium Hardware & Plywoods
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            >
              Building Excellence <br />
              <span className="text-[#E67E22]">Layer by Layer.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 mb-10 leading-relaxed"
            >
              Discover India's finest collection of plywood, hardware fittings, and laminates. 
              Authorized partners for Century Ply, Hettich, and Greenply.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/catalog" 
                className={cn(buttonVariants({ size: "lg" }), "bg-[#E67E22] hover:bg-[#d56d1b] text-white rounded-full px-8 h-14 text-lg font-bold")}
              >
                Browse Catalog <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/design-ai" 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white text-white hover:bg-white hover:text-[#1A3C6E] rounded-full px-8 h-14 text-lg font-bold")}
              >
                <Sparkles className="mr-2 w-5 h-5" /> AI Design Assistant
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Stats */}
        <div className="absolute bottom-12 right-12 hidden lg:flex gap-8">
          {[
            { label: 'Happy Clients', value: '10K+' },
            { label: 'Premium Brands', value: '25+' },
            { label: 'Years of Trust', value: '15+' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white text-center min-w-[140px]"
            >
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Genuine Products', desc: '100% Original Brands' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Across Bangalore' },
              { icon: Clock, title: 'Expert Support', desc: 'Technical Guidance' },
              { icon: Star, title: 'Best Pricing', desc: 'Bulk Order Discounts' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1A3C6E]/5 flex items-center justify-center text-[#1A3C6E]">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#1A3C6E] mb-2">Our Brand Partners</h2>
              <p className="text-slate-500">Authorized distributors for leading industry names</p>
            </div>
            <Button variant="link" className="text-[#E67E22] font-bold">View All Brands <ChevronRight className="ml-1 w-4 h-4" /></Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {BRANDS.map((brand, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-16 flex items-center justify-center mb-4 grayscale group-hover:grayscale-0 transition-all">
                      <img src={brand.logo} alt={brand.name} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{brand.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{brand.tagline}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A3C6E] mb-4">Explore by Category</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Everything you need for your construction and interior projects in one place.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CATEGORIES.map((cat, i) => (
              <Link key={i} to={`/products?category=${cat.id}`}>
                <Card className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img 
                    src={`https://picsum.photos/seed/${cat.name}/600/600`} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="w-10 h-10 rounded-lg bg-[#E67E22] flex items-center justify-center text-white mb-3">
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-white/60 text-xs font-medium">{cat.count}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="py-24 bg-[#1A3C6E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Sparkles className="w-full h-full text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Confused about materials?</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
            Our AI Design Assistant can analyze your room photos and suggest the best 
            plywood, hardware, and interior themes within your budget.
          </p>
          <Link 
            to="/design-ai" 
            className={cn(buttonVariants({ size: "lg" }), "bg-[#E67E22] hover:bg-[#d56d1b] text-white rounded-full px-12 h-14 text-lg font-bold shadow-xl shadow-black/20")}
          >
            Try AI Assistant Now
          </Link>
        </div>
      </section>
    </div>
  );
}
