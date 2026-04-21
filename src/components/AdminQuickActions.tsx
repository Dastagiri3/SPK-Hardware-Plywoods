import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { 
  Plus, 
  Package, 
  FileText, 
  Camera, 
  Upload,
  Loader2,
  X,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export function AdminQuickActions({ type, onAdd }: { type: 'products' | 'catalogs', onAdd?: () => void }) {
  const [user] = useAuthState(auth);
  
  // Persistence Keys
  const ROLE_KEY = 'spk-admin-role';
  const OPEN_KEY = `spk-qa-open-${type}`;
  const NAME_KEY = `spk-qa-name-${type}`;
  const PRICE_KEY = `spk-qa-price-${type}`;
  const IMG_KEY = `spk-qa-img-${type}`;

  const [role, setRole] = React.useState<string | null>(localStorage.getItem(ROLE_KEY));
  const [isOpen, setIsOpen] = React.useState(localStorage.getItem(OPEN_KEY) === 'true');
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Form states initialized from localStorage for mobile resilience
  const [name, setName] = React.useState(localStorage.getItem(NAME_KEY) || '');
  const [price, setPrice] = React.useState(localStorage.getItem(PRICE_KEY) || '');
  const [category, setCategory] = React.useState('cat-plywood');
  const [company, setCompany] = React.useState('Century Ply');
  const [imagePreview, setImagePreview] = React.useState<string | null>(localStorage.getItem(IMG_KEY));

  // Sync state to localStorage
  React.useEffect(() => {
    localStorage.setItem(OPEN_KEY, isOpen.toString());
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(PRICE_KEY, price);
    if (imagePreview) {
      // Only store if it's not too huge for localStorage (usually 5MB limit)
      // Our 600px-800px jpegs are usually ~50-100KB, which fits fine.
      try {
        localStorage.setItem(IMG_KEY, imagePreview);
      } catch (e) {
        console.warn("Storage quota exceeded, image not cached");
      }
    } else {
      localStorage.removeItem(IMG_KEY);
    }
  }, [isOpen, name, price, imagePreview, type]);

  React.useEffect(() => {
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then(snap => {
        const userRole = snap.data()?.role || 'customer';
        setRole(userRole);
        localStorage.setItem(ROLE_KEY, userRole);
      });
    }
  }, [user]);

  if (role !== 'admin' && !isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 600; 
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressed = canvas.toDataURL('image/jpeg', 0.6);
          setImagePreview(compressed);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      toast.error('Snap a photo first');
      return;
    }
    
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      if (type === 'products') {
        await addDoc(collection(db, 'products'), {
          name: name.trim(),
          price: Number(price) || 0,
          categoryId: category,
          images: [imagePreview],
          description: name + " - Mobile Add",
          unit: 'Sheet',
          createdAt: timestamp
        });
      } else {
        await addDoc(collection(db, 'catalogs'), {
          title: name.trim(),
          company,
          thumbnail: imagePreview,
          uploadedAt: timestamp,
          tags: ['Mobile'],
          version: '1.0',
          pages: 8
        });
      }
      
      toast.success('Added successfully!');
      
      // Full Cleanup
      setName('');
      setPrice('');
      setImagePreview(null);
      setIsOpen(false);
      localStorage.removeItem(OPEN_KEY);
      localStorage.removeItem(NAME_KEY);
      localStorage.removeItem(PRICE_KEY);
      localStorage.removeItem(IMG_KEY);
      
      if (onAdd) onAdd();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-28 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl bg-[#E67E22] hover:bg-[#d56d1b] text-white flex items-center justify-center ring-4 ring-white"
        >
          <PlusCircle className="w-8 h-8" />
        </Button>
      </div>

      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (loading) return; 
          setIsOpen(open);
        }}
      >
        <DialogContent 
          className="sm:max-w-[450px] bg-white p-0 overflow-hidden"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-[70] flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#E67E22] animate-spin mb-4" />
              <p className="font-bold text-[#1A3C6E]">Saving Listing...</p>
            </div>
          )}

          <div className="p-4 bg-[#1A3C6E] text-white flex justify-between items-center">
            <h2 className="font-bold">Add {type === 'products' ? 'Product' : 'Catalog'}</h2>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            <div 
              onClick={() => !loading && fileInputRef.current?.click()}
              className="relative w-full aspect-video rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden active:scale-[0.98] transition-transform"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-10 h-10 text-[#E67E22] mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase">Tap to Capture</p>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={handleImageChange}
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[10px] font-bold text-slate-400 uppercase">Item Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Name" className="bg-white" />
              </div>

              {type === 'products' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] font-bold text-slate-400 uppercase">Price (₹)</Label>
                    <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0" className="bg-white" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-slate-400 uppercase">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="cat-plywood">Plywood</SelectItem>
                        <SelectItem value="cat-hardware">Hardware</SelectItem>
                        <SelectItem value="cat-laminates">Laminates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">Company</Label>
                  <Input value={company} onChange={e => setCompany(e.target.value)} required placeholder="Brand" className="bg-white" />
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={loading || !imagePreview}
              className="w-full h-12 bg-[#1A3C6E] hover:bg-[#E67E22] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <PlusCircle className="w-5 h-5 mr-2" />}
              CONFIRM & ADD TO SHOP
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
