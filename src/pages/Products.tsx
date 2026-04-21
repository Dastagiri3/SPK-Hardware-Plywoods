import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  ChevronRight,
  LayoutGrid,
  List,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { AdminQuickActions } from '@/components/AdminQuickActions';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [dbProducts, setDbProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const categoryFilter = searchParams.get('category');

  React.useEffect(() => {
    fetchDbProducts();
  }, []);

  const fetchDbProducts = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
      setDbProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const allProducts = [...dbProducts, ...PRODUCTS];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                         product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 relative">
      <AdminQuickActions type="products" onAdd={fetchDbProducts} />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#1A3C6E] mb-2">Our Products</h1>
            <p className="text-slate-500">Explore our extensive range of hardware, plywood, and interior solutions.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 h-11 rounded-xl bg-white border-none shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className={cn("h-11 w-11 rounded-xl bg-white border-none shadow-sm", viewMode === 'grid' && "text-[#E67E22]")}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn("h-11 w-11 rounded-xl bg-white border-none shadow-sm", viewMode === 'list' && "text-[#E67E22]")}
                onClick={() => setViewMode('list')}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  className={cn("w-full justify-start font-medium", !categoryFilter && "bg-slate-100 text-[#1A3C6E]")}
                  onClick={() => setSearchParams({})}
                >
                  All Categories
                </Button>
                {CATEGORIES.map(cat => (
                  <Button 
                    key={cat.id}
                    variant="ghost" 
                    className={cn("w-full justify-start font-medium", categoryFilter === cat.id && "bg-slate-100 text-[#1A3C6E]")}
                    onClick={() => setSearchParams({ category: cat.id })}
                  >
                    {cat.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={cn(
                      "group border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white h-full",
                      viewMode === 'list' && "flex flex-row"
                    )}>
                      <div className={cn(
                        "relative overflow-hidden",
                        viewMode === 'grid' ? "h-48" : "w-48 h-48 shrink-0"
                      )}>
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-[#1A3C6E] backdrop-blur-sm border-none shadow-sm">
                            {product.unit}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-slate-900 group-hover:text-[#E67E22] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-grow">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Price</p>
                            <p className="text-lg font-bold text-[#1A3C6E]">₹{product.price.toLocaleString()}</p>
                          </div>
                          <Button size="sm" className="bg-[#1A3C6E] hover:bg-[#E67E22] text-white rounded-lg">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center bg-white rounded-3xl shadow-sm border border-slate-100">
                <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">No products found</h3>
                <p className="text-slate-400">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
