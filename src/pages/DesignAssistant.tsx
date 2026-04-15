import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDesignSuggestion } from '@/services/gemini';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  DollarSign, 
  Home,
  ArrowRight,
  Info,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

export default function DesignAssistant() {
  const [user] = useAuthState(auth);
  const [image, setImage] = React.useState<string | null>(null);
  const [budget, setBudget] = React.useState(50000);
  const [roomType, setRoomType] = React.useState('living-room');
  const [loading, setLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }
    if (!user) {
      toast.error('Please login to use the AI Assistant');
      return;
    }

    setLoading(true);
    try {
      const result = await getDesignSuggestion(image, budget, roomType);
      setSuggestion(result);
      
      // Save to Firestore
      await addDoc(collection(db, 'designSuggestions'), {
        userId: user.uid,
        imageUrl: image, // In real app, upload to Storage first
        budget,
        roomType,
        suggestionText: result.suggestionText,
        interiorOptions: result.interiorOptions,
        createdAt: serverTimestamp()
      });

      toast.success('Design suggestion generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E67E22]/10 text-[#E67E22] font-bold text-sm mb-4"
          >
            <Sparkles className="w-4 h-4" />
            AI-POWERED INTERIOR ASSISTANT
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A3C6E] mb-4">Transform Your Space</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload a photo of your room or a plain wall, set your budget, and let our AI 
            suggest the perfect hardware, plywood, and interior design options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <Card className="lg:col-span-1 border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#1A3C6E]">Design Parameters</CardTitle>
              <CardDescription>Customize your AI suggestion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="living-room">Living Room</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="office">Home Office</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Budget (INR)</Label>
                  <span className="font-bold text-[#E67E22]">₹{budget.toLocaleString()}</span>
                </div>
                <Slider 
                  value={[budget]} 
                  onValueChange={(val) => setBudget(val[0])}
                  max={500000} 
                  step={5000}
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  <span>Economy</span>
                  <span>Premium</span>
                  <span>Luxury</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Photo</Label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    image ? 'border-[#E67E22] bg-[#E67E22]/5' : 'border-slate-200 hover:border-[#1A3C6E]'
                  }`}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-40 object-cover rounded-lg shadow-md" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Upload className="w-8 h-8 text-slate-400" />
                      <p className="text-sm text-slate-500">Click to upload room photo</p>
                    </div>
                  )}
                  <input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={loading || !image}
                className="w-full bg-[#1A3C6E] hover:bg-[#152e55] h-12 rounded-xl text-lg font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Design
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {suggestion ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="border-none shadow-2xl overflow-hidden">
                    <div className="bg-[#1A3C6E] p-6 text-white flex justify-between items-center">
                      <div>
                        <p className="text-xs uppercase tracking-widest opacity-70 font-bold mb-1">Recommended Theme</p>
                        <h2 className="text-2xl font-bold">{suggestion.theme}</h2>
                      </div>
                      <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                        <p className="text-[10px] uppercase font-bold opacity-70">Budget Status</p>
                        <p className="font-bold text-[#E67E22] uppercase">{suggestion.budgetStatus}</p>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <div className="prose prose-slate max-w-none mb-8">
  <ReactMarkdown>{suggestion.suggestionText}</ReactMarkdown>
</div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-bold text-[#1A3C6E] flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            Interior Options
                          </h3>
                          <ul className="space-y-2">
                            {suggestion.interiorOptions?.map((opt: string, i: number) => (
                              <li key={i} className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-bold text-[#1A3C6E] flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-[#E67E22]" />
                            Material Checklist
                          </h3>
                          <div className="space-y-2">
                            {suggestion.materials?.map((mat: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{mat.name}</p>
                                  <p className="text-[10px] uppercase text-slate-500 font-bold">{mat.type}</p>
                                </div>
                                <span className="text-sm font-bold text-[#1A3C6E]">₹{mat.estimatedPrice}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-[#1A3C6E] text-[#1A3C6E] font-bold">
                      Download PDF Report
                    </Button>
                    <Button className="flex-1 h-12 rounded-xl bg-[#E67E22] hover:bg-[#d56d1b] font-bold">
                      Request Quote for Materials
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white/30">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                    <Home className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400 mb-2">No Design Generated Yet</h3>
                  <p className="text-slate-400 max-w-xs">
                    Upload a photo and set your budget to see AI-powered interior design suggestions.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
