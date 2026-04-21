import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Package, 
  FileText, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<any[]>([]);
  const [catalogs, setCatalogs] = React.useState<any[]>([]);

  // Form States - Product
  const [pName, setPName] = React.useState('');
  const [pPrice, setPPrice] = React.useState('');
  const [pCategory, setPCategory] = React.useState('cat-plywood');
  const [pImage, setPImage] = React.useState('');

  // Form States - Catalog
  const [cTitle, setCTitle] = React.useState('');
  const [cCompany, setCCompany] = React.useState('Century Ply');
  const [cImage, setCImage] = React.useState('');

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pSnap = await getDocs(query(collection(db, 'products'), orderBy('name')));
      const cSnap = await getDocs(query(collection(db, 'catalogs'), orderBy('title')));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCatalogs(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        name: pName,
        price: Number(pPrice),
        categoryId: pCategory,
        images: [pImage || 'https://picsum.photos/seed/product/400/400'],
        description: 'New product added via admin dashboard.',
        createdAt: new Date().toISOString()
      });
      toast.success('Product added successfully');
      setPName('');
      setPPrice('');
      setPImage('');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'catalogs'), {
        title: cTitle,
        company: cCompany,
        thumbnail: cImage || 'https://picsum.photos/seed/catalog/400/600',
        uploadedAt: new Date().toISOString(),
        tags: ['New'],
        version: 'v1.0',
        pages: Math.floor(Math.random() * 50) + 10
      });
      toast.success('Catalog added successfully');
      setCTitle('');
      setCImage('');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, coll, id));
      toast.success('Deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#1A3C6E] mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your products, catalogs and store activities.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Products" value={products.length} icon={Package} color="blue" />
          <StatCard title="Active Catalogs" value={catalogs.length} icon={FileText} color="orange" />
          <StatCard title="New Orders" value="0" icon={ShoppingBag} color="green" />
          <StatCard title="Store Visitors" value="1.2k" icon={Users} color="purple" />
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm mb-8">
            <TabsTrigger value="products" className="px-8 rounded-lg">Products</TabsTrigger>
            <TabsTrigger value="catalogs" className="px-8 rounded-lg">Catalogs</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Product Form */}
              <Card className="lg:col-span-1 border-none shadow-sm h-fit">
                <CardHeader>
                  <CardTitle className="text-xl">Add New Product</CardTitle>
                  <CardDescription>Fill in the details to list a new item.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input value={pName} onChange={e => setPName(e.target.value)} required placeholder="e.g. Century Marine Ply" />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (₹)</Label>
                      <Input type="number" value={pPrice} onChange={e => setPPrice(e.target.value)} required placeholder="3200" />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL (Optional)</Label>
                      <Input value={pImage} onChange={e => setPImage(e.target.value)} placeholder="https://..." />
                    </div>
                    <Button className="w-full bg-[#1A3C6E] hover:bg-[#152e55]" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      Add Product
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Product List */}
              <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Manage Products</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-slate-100">
                      {products.map(p => (
                        <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900">{p.name}</h4>
                              <p className="text-sm text-slate-500 font-bold text-[#E67E22]">₹{p.price}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete('products', p.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {products.length === 0 && <div className="p-10 text-center text-slate-400">No products added yet.</div>}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="catalogs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Catalog Form */}
              <Card className="lg:col-span-1 border-none shadow-sm h-fit">
                <CardHeader>
                  <CardTitle className="text-xl">Upload Catalog</CardTitle>
                  <CardDescription>Add a new brand catalog for customers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCatalog} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Catalog Title</Label>
                      <Input value={cTitle} onChange={e => setCTitle(e.target.value)} required placeholder="e.g. Hettich 2024 Trends" />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand / Company</Label>
                      <Input value={cCompany} onChange={e => setCCompany(e.target.value)} required placeholder="Century Ply" />
                    </div>
                    <div className="space-y-2">
                      <Label>Thumbnail URL (Optional)</Label>
                      <Input value={cImage} onChange={e => setCImage(e.target.value)} placeholder="https://..." />
                    </div>
                    <Button className="w-full bg-[#E67E22] hover:bg-[#d56d1b]" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                      Add Catalog
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Catalog List */}
              <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Manage Catalogs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-slate-100">
                      {catalogs.map(c => (
                        <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-14 rounded overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                              <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900">{c.title}</h4>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.company}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete('catalogs', c.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {catalogs.length === 0 && <div className="p-10 text-center text-slate-400">No catalogs uploaded yet.</div>}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden relative">
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 mb-1">{value}</CardTitle>
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </CardContent>
    </Card>
  );
}
