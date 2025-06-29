"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageTitle from "@/components/shared/PageTitle";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchProducts();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/chat");
      const result = await response.json();
      if (result.success) {
        setMessages(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch chat messages");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    setLoading(true);
    const userMessage = message;
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          product_id: selectedProduct || null,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessages(prev => [...prev, result.data]);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <PageTitle>AI Chat Assistant</PageTitle>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Product Context</h3>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific product</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              Select a product to get specific insights and recommendations.
            </p>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Chat with AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about your products, get business insights, or general ecommerce advice.
              </p>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with your AI assistant!</p>
                  </div>
                )}
                
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-4">
                    {/* User Message */}
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">{msg.user_message}</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start space-x-3">
                      <div className="bg-secondary text-secondary-foreground rounded-full p-2">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-background border rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm whitespace-pre-wrap">{msg.ai_response}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary text-secondary-foreground rounded-full p-2">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-background border rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your ecommerce business..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}