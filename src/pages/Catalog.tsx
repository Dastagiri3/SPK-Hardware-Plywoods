import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  FileText, 
  ExternalLink, 
  Filter,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { AdminQuickActions } from '@/components/AdminQuickActions';

const STATIC_CATALOGS = [
  { 
    id: 's1', 
    company: 'Century Ply', 
    title: 'Architectural Plywood 2024', 
    pages: 48, 
    version: 'v2.1', 
    thumbnail: 'https://picsum.photos/seed/catalog1/400/600',
    tags: ['Marine', 'BWP', 'Fire Retardant']
  },
  { 
    id: 's2', 
    company: 'Hettich', 
    title: 'Kitchen Fittings & Hardware', 
    pages: 120, 
    version: 'v4.0', 
    thumbnail: 'https://picsum.photos/seed/catalog2/400/600',
    tags: ['Kitchen', 'Hinges', 'Drawers']
  },
  { 
    id: 's3', 
    company: 'Greenply', 
    title: 'Eco-Friendly Collection', 
    pages: 32, 
    version: 'v1.5', 
    thumbnail: 'https://picsum.photos/seed/catalog3/400/600',
    tags: ['Eco', 'Zero Emission']
  },
  { 
    id: 's4', 
    company: 'Merino', 
    title: 'Laminates & Surfaces', 
    pages: 84, 
    version: 'v3.2', 
    thumbnail: 'https://picsum.photos/seed/catalog4/400/600',
    tags: ['Laminates', 'Textures']
  },
];

export default function Catalog() {
  const [search, setSearch] = React.useState('');
  const [dbCatalogs, setDbCatalogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchDbCatalogs();
  }, []);

  const fetchDbCatalogs = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'catalogs'), orderBy('uploadedAt', 'desc')));
      setDbCatalogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const allCatalogs = [...dbCatalogs, ...STATIC_CATALOGS];

  const filteredCatalogs = allCatalogs.filter(cat => 
    cat.title.toLowerCase().includes(search.toLowerCase()) || 
    cat.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 relative">
      <AdminQuickActions type="catalogs" onAdd={fetchDbCatalogs} />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#1A3C6E] mb-2">Brand Catalogs</h1>
            <p className="text-slate-500">Download and browse official product catalogs from our partners.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search catalogs..." 
                className="pl-10 h-11 rounded-xl bg-white border-none shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-11 rounded-xl bg-white border-none shadow-sm">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCatalogs.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white flex flex-col h-full">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={cat.thumbnail} 
                    alt={cat.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button size="icon" className="rounded-full bg-white text-[#1A3C6E] hover:bg-[#E67E22] hover:text-white">
                      <BookOpen className="w-5 h-5" />
                    </Button>
                    <Button size="icon" className="rounded-full bg-white text-[#1A3C6E] hover:bg-[#E67E22] hover:text-white">
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#1A3C6E] text-white border-none">{cat.company}</Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-[#E67E22] transition-colors">
                    {cat.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cat.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">#{tag}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      <span className="text-slate-600">{cat.pages} Pages</span> • {cat.version}
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#1A3C6E] font-bold p-0 h-auto hover:bg-transparent hover:text-[#E67E22]">
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCatalogs.length === 0 && (
          <div className="py-20 text-center">
            <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No catalogs found</h3>
            <p className="text-slate-400">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
