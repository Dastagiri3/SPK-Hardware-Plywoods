import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Sparkles, Loader2, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAdvisor } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';

export function AIAdvisor() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<{ role: string, parts: { text: string }[] }[]>([
    { role: 'model', parts: [{ text: "Hello! I'm your SPK Advisor. How can I help you choose the right materials for your project today?" }] }
  ]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { role: 'user', parts: [{ text: message }] };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const response = await chatWithAdvisor(message, messages);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response || '' }] }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "I'm sorry, I encountered an error. Please try again." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[550px] flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-slate-200 bg-white"
          >
            <div className="bg-[#1A3C6E] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SPK Advisor</h3>
                  <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">AI Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-grow p-4 bg-slate-50">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-[#E67E22]' : 'bg-[#1A3C6E]'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
<div className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-[#E67E22] text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                      }`}>
                        <div className="prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown>
                            {msg.parts[0].text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-[#1A3C6E] flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                        <Loader2 className="w-4 h-4 animate-spin text-[#1A3C6E]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-white">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input 
                  placeholder="Ask about plywood, hardware..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-full border-slate-200 focus-visible:ring-[#1A3C6E]"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={loading || !message.trim()}
                  className="bg-[#1A3C6E] hover:bg-[#152e55] rounded-full shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-slate-200 text-slate-600 rotate-90' : 'bg-[#1A3C6E] text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>
    </div>
  );
}
