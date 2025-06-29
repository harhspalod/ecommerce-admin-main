"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageTitle from "@/components/shared/PageTitle";
import { toast } from "sonner";

interface SocialPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  product_id: string | null;
  product_name: string | null;
  image_url: string | null;
  scheduled_at: string | null;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
}

const platforms = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
];

const statuses = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
];

export default function SocialMediaPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    platform: "",
    product_id: "",
    image_url: "",
    scheduled_at: "",
    status: "draft",
  });

  useEffect(() => {
    fetchPosts();
    fetchProducts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/social-posts");
      const result = await response.json();
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch social posts");
    } finally {
      setLoading(false);
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
    
    const postData = {
      ...formData,
      product_id: formData.product_id || null,
      scheduled_at: formData.scheduled_at || null,
    };

    try {
      const url = editingPost ? `/api/social-posts/${editingPost.id}` : "/api/social-posts";
      const method = editingPost ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(editingPost ? "Post updated!" : "Post created!");
        fetchPosts();
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to save post");
    }
  };

  const handleEdit = (post: SocialPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      platform: post.platform,
      product_id: post.product_id || "",
      image_url: post.image_url || "",
      scheduled_at: post.scheduled_at ? post.scheduled_at.split('T')[0] : "",
      status: post.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/social-posts/${id}`, { method: "DELETE" });
      const result = await response.json();
      
      if (result.success) {
        toast.success("Post deleted!");
        fetchPosts();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      platform: "",
      product_id: "",
      image_url: "",
      scheduled_at: "",
      status: "draft",
    });
    setEditingPost(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook": return "📘";
      case "instagram": return "📷";
      case "twitter": return "🐦";
      case "linkedin": return "💼";
      case "tiktok": return "🎵";
      default: return "📱";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "published": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Social Media Management</PageTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Social Post" : "Create New Social Post"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {getPlatformIcon(platform.value)} {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="product">Related Product (Optional)</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
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
              </div>
              <div>
                <Label htmlFor="image_url">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="scheduled_at">Schedule Date (Optional)</Label>
                <Input
                  id="scheduled_at"
                  type="date"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                <span className="font-medium capitalize">{post.platform}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                {post.status}
              </span>
            </div>
            
            <h3 className="font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {post.content}
            </p>
            
            {post.product_name && (
              <p className="text-xs text-blue-600 mb-2">
                Related: {post.product_name}
              </p>
            )}
            
            {post.scheduled_at && (
              <div className="flex items-center text-xs text-muted-foreground mb-3">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(post.scheduled_at).toLocaleDateString()}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(post)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card className="p-8 text-center">
          <Share className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No social posts yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first social media post to get started with your marketing campaigns.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Post
          </Button>
        </Card>
      )}
    </section>
  );
}