'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ["latin"] });
import { 
  Plus, Trash2, Edit2, ShoppingBag, List, Package, 
  TrendingUp, Search, PlusCircle, X, Check, Settings, 
  ShieldCheck, BarChart3, LayoutDashboard, Database,
  Eye, MonitorDot, History, ArrowUpRight, BadgeCheck, Loader2,
  MessageSquare, Star, MapPin, Pin
} from 'lucide-react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isPinned: boolean;
}

interface HeroSlide {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  displayOrder: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'reviews'>('products');
  const [reviews, setReviews] = useState<any[]>([]);
  const [heroImageSrc, setHeroImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImageSrc, setProductImageSrc] = useState<string | null>(null);
  const [productCrop, setProductCrop] = useState({ x: 0, y: 0 });
  const [productZoom, setProductZoom] = useState(1);
  const [productCroppedAreaPixels, setProductCroppedAreaPixels] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0,
    isPinned: false,
  });
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isUploadingSlide, setIsUploadingSlide] = useState(false);
  const [heroDelay, setHeroDelay] = useState<number>(5000);
  const [heroVideoEnabled, setHeroVideoEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }
    fetchProducts();
    fetchOrders();
    fetchHeroSlides();
    fetchHeroDelay();
    fetchHeroVideoStatus();
    fetchReviews();
  }, []);

  const fetchHeroVideoStatus = async () => {
    try {
      const res = await fetch('/api/settings?key=heroVideoEnabled');
      const data = await res.json();
      if (data && data.value) setHeroVideoEnabled(data.value === 'true');
    } catch (e) {
      console.error("Hero video status fetch failed", e);
    }
  };

  const fetchHeroDelay = async () => {
    try {
      const res = await fetch('/api/settings?key=heroDelay');
      const data = await res.json();
      if (data && data.value) setHeroDelay(parseInt(data.value));
    } catch (e) {
      console.error("Hero delay fetch failed", e);
    }
  };

  const fetchHeroSlides = async () => {
    try {
      const res = await fetch('/api/hero-slides');
      const data = await res.json();
      if (Array.isArray(data)) {
        setHeroSlides(data);
      }
    } catch (e) {
      console.error("Hero slides fetch failed", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Orders API did not return an array:", data);
        setOrders([]);
      }
    } catch (e) {
      console.error("Orders fetch failed", e);
      setOrders([]);
    }
  };


  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Products API did not return an array:", data);
        setProducts([]);
      }
    } catch (e) {
      console.error("Fetch failed", e);
      setProducts([]);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews/all');
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (e) {
      console.error("Reviews fetch failed", e);
    }
  };

  const handleOpenModal = (product?: Product) => {
    setProductImageSrc(null);
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        isPinned: product.isPinned || false,
      });
    } else {
      setEditingProduct(null);
      setFormData({ title: '', description: '', price: 0, image: '', category: '', stock: 0, isPinned: false });
    }
    setIsModalOpen(true);
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onProductCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setProductCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Canvas empty')); return; }
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingHero(true); 
    
    let finalImageUrl = formData.image || '/images/box-1.jpeg';
    
    if (productImageSrc && productCroppedAreaPixels) {
      try {
        console.log("[DEBUG] Starting product image cropping...");
        const croppedBlob = await getCroppedImg(productImageSrc, productCroppedAreaPixels);
        const fileName = `product-${Date.now()}.jpg`;
        const file = new File([croppedBlob], fileName, { type: "image/jpeg" });
        
        console.log("[DEBUG] Transmitting File:", fileName, "Size:", (file.size / 1024).toFixed(2), "KB");
        
        const uploadData = new FormData();
        uploadData.append('file', file);
        
        const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(fileName)}`, { 
          method: 'POST', 
          body: uploadData 
        });
        
        const responseText = await uploadRes.text();
        console.log("[DEBUG] Server Raw Response:", responseText);
        
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (pErr) {
          throw new Error("Server returned an invalid response (non-JSON). Check server logs.");
        }
        
        if (uploadRes.ok) {
          finalImageUrl = result.url;
          console.log("[DEBUG] Vercel Blob Sync Success:", finalImageUrl);
        } else {
          throw new Error(result.error || result.details || 'Vercel rejected file ingest.');
        }
      } catch (err: any) { 
        console.error("[DEBUG] Image Transmission Failure:", err);
        alert(`System Failure: ${err.message}. Please restart your server and verify your internet connection.`);
        setIsUploadingHero(false);
        return;
      }
    }
    
    try {
      console.log("[DEBUG] Archive finalization: saving product data...");
      const payload = { ...formData, image: finalImageUrl };
      const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(endpoint, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (res.ok) { 
        console.log("[DEBUG] Product archived successfully.");
        setIsModalOpen(false); 
        fetchProducts(); 
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || errorData.error || 'Database could not finalize the entry.');
      }
    } catch (err: any) {
      console.error("[DEBUG] Finalization Error:", err);
      alert(`Archive Error: ${err.message}`);
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently remove this asset from the catalog?')) {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Delete this order from history?')) {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
        if (res.ok) {
          fetchOrders();
        }
      } catch (err) {
        console.error("Order delete failed", err);
      }
    }
  };


  const handleDeleteSlide = async (id: string) => {
    if (confirm('Remove this slide?')) {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) fetchHeroSlides();
    }
  };

  const handleDelayUpdate = async (delay: number) => {
    setHeroDelay(delay);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'heroDelay', value: delay.toString() })
      });
    } catch (e) {
      console.error("Delay sync failed", e);
    }
  };

  const handleVideoToggle = async (enabled: boolean) => {
    setHeroVideoEnabled(enabled);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'heroVideoEnabled', value: enabled.toString() })
      });
    } catch (e) {
      console.error("Video toggle sync failed", e);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Permanently delete this review?')) {
      try {
        const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
        if (res.ok) fetchReviews();
      } catch (err) {
        console.error("Review delete failed", err);
      }
    }
  };
  const handleSlideUpload = async (file: File, type: 'IMAGE' | 'VIDEO', croppedBlob?: Blob) => {
    setIsUploadingSlide(true);
    try {
      const uploadFile = croppedBlob ? new File([croppedBlob], `hero-${Date.now()}.jpg`, { type: 'image/jpeg' }) : file;
      const fileName = uploadFile.name;
      const uploadData = new FormData();
      uploadData.append('file', uploadFile);

      const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(fileName)}`, {
        method: 'POST',
        body: uploadData
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();

      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          type,
          displayOrder: heroSlides.length
        })
      });

      if (res.ok) {
        fetchHeroSlides();
        setHeroImageSrc(null);
      }
    } catch (e: any) {
      alert(`Upload error: ${e.message}`);
    } finally {
      setIsUploadingSlide(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
      } else {
        alert('Security Breach: Authorization Failed.');
        setPassword('');
      }
    } catch (err) {
      console.error("Auth failed", err);
      alert('Authentication Service Error');
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] flex items-center justify-center p-6 selection:bg-indigo-500/10">
        <div className="w-full max-w-lg bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] text-center space-y-8 md:space-y-12 animate-in fade-in zoom-in-95 duration-1000">
           <div className="mx-auto w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 shadow-inner group transition-all">
              <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-500 group-hover:scale-110 transition-transform duration-700" strokeWidth={1.5} />
           </div>
           <div className="space-y-4">
               <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic font-serif">RUHQALAM <span className="text-indigo-600 lowercase tracking-normal font-sans not-italic">Dashboard</span></h1>
              <p className="text-gray-400 dark:text-gray-600 text-[10px] font-black tracking-[0.4em] uppercase">Manage your boutique archive</p>
           </div>
           <form onSubmit={handleLogin} className="space-y-6">
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entry Key" 
                className="w-full px-10 py-6 rounded-3xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:border-indigo-500 transition-all outline-none text-center font-black tracking-[0.4em] text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-800"
              />
              <button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-6 rounded-[2rem] font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-500 shadow-2xl shadow-indigo-500/30 active:scale-95">
                ACCESS DASHBOARD
              </button>
           </form>
        </div>
      </div>
    );
  }

  const totalSales = orders.reduce((total, order) => total + order.total, 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#020202] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/20">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 md:space-y-12 lg:space-y-16">
        
        {/* Gallery-Style Header */}
        <header className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 border-b border-gray-100 dark:border-white/5 pb-10 md:pb-16 text-center lg:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
             <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 md:ring-4 ring-white dark:ring-white/5 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700">
                <Image src="/logo.png" alt="Logo" fill className="object-cover" />
             </div>
             <div className="space-y-1 md:space-y-4">
                <h1 className={cn(cinzel.className, "text-4xl md:text-7xl font-black tracking-tighter md:tracking-[-0.04em] uppercase leading-none text-gray-900 dark:text-white")}>
                   RUHQALAM <span className="text-indigo-600 italic font-serif lowercase tracking-normal">Dashboard</span>
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                   <p className="text-[8px] md:text-[10px] font-black text-gray-500 dark:text-gray-600 tracking-[0.4em] md:tracking-[0.6em] uppercase">SPIRIT OF THE PEN • ARTISAN COMMAND CENTER</p>
                </div>
             </div>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-2 p-1.5 md:p-2 bg-white dark:bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/10 w-full lg:w-auto">
            {[
              { id: 'products', label: 'INVENTORY', icon: <Database className="w-3.5 h-3.5" /> },
              { id: 'orders', label: 'ANALYTICS', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: 'reviews', label: 'REVIEWS', icon: <MessageSquare className="w-3.5 h-3.5" /> },
              { id: 'settings', label: 'GLOBAL', icon: <LayoutDashboard className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 md:gap-4 px-4 md:px-10 py-3 md:py-5 rounded-[1.2rem] md:rounded-[2rem] font-black text-[8px] md:text-[10px] tracking-widest md:tracking-[0.25em] transition-all duration-700 ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105' : 'text-gray-400 hover:text-indigo-600'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Minimal Stats Bar */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "TOTAL SALES", value: `Rs. ${totalSales.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-indigo-500" />, sub: "CUMULATIVE REVENUE" },
            { label: "ORDERS", value: orders.length, icon: <ShoppingBag className="w-5 h-5 text-indigo-500" />, sub: "TOTAL ORDERS PROCESSED" },
            { label: "PRODUCTS", value: products.length, icon: <Package className="w-5 h-5 text-indigo-500" />, sub: "ACTIVE COLLECTION COUNT" },
            { label: "SYSTEM STATUS", value: "OPTIMAL", icon: <BadgeCheck className="w-5 h-5 text-indigo-500" />, sub: "ENCRYPTED & SYNCED" },
          ].map((stat, i) => (
            <article key={i} className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-lg hover:shadow-2xl transition-all duration-1000 group">
              <div className="flex justify-between items-start mb-6 md:mb-10">
                 <div className="p-4 md:p-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-[1rem] md:rounded-[1.5rem] text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">{stat.icon}</div>
                 <div className="text-right">
                    <p className="text-[8px] md:text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">{stat.label}</p>
                 </div>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">{stat.value}</h2>
              <p className="text-[8px] md:text-[9px] font-bold text-gray-500 tracking-widest uppercase">{stat.sub}</p>
            </article>
          ))}
        </section>

        {activeTab === 'products' && (
          <main className="space-y-8 md:space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
             <div className="flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-10 bg-white dark:bg-[#0a0a0a] p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl backdrop-blur-3xl">
                <div className="relative w-full lg:w-[600px] group">
                    <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input placeholder="SEARCH PRODUCTS..." className="w-full pl-16 md:pl-20 pr-6 md:pr-10 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none text-[9px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.3em] text-gray-900 dark:text-white transition-all" />
                </div>
                <button
                   onClick={() => handleOpenModal()}
                   className="w-full lg:w-auto bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-4 md:gap-6 px-10 md:px-16 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-[9px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.4em] uppercase transition-all duration-700 shadow-2xl active:scale-95"
                >
                  ADD NEW PRODUCT <PlusCircle className="w-4 md:w-5 h-4 md:h-5" />
                </button>
             </div>

             <div className="grid grid-cols-1 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-[#0a0a0a] hover:bg-gray-50 dark:hover:bg-white/[0.03] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-6 md:gap-12 transition-all duration-700 group">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 shadow-inner">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" />
                    </div>
                    <div className="flex-grow flex flex-col items-center md:flex-row md:items-center justify-between gap-6 md:gap-12 w-full text-center md:text-left">
                        <div className="space-y-3">
                           <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-indigo-500 tracking-[0.5em] uppercase px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">{product.category}</span>
                             {product.isPinned && (
                               <span className="text-[10px] font-black text-white px-4 py-1.5 bg-indigo-600 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                                 <Pin className="w-2.5 h-2.5 fill-current" /> PINNED
                               </span>
                             )}
                           </div>
                           <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{product.title}</h3>
                        </div>
                       <div className="flex flex-wrap items-center justify-center gap-16">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">PRODUCT PRICE</p>
                             <p className="font-black text-2xl text-gray-900 dark:text-white font-serif italic">Rs. {product.price.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">STOCK LEVEL</p>
                             <div className="flex items-center gap-3">
                                <div className="h-1.5 w-16 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                   <div className={cn("h-full rounded-full", product.stock <= 0 ? "bg-red-500" : "bg-indigo-600")} style={{ width: `${Math.min(Math.max(product.stock, 0) * 5, 100)}%` }} />
                                </div>
                                <span className={cn("font-black text-xl", product.stock <= 0 ? "text-red-500" : "text-indigo-600")}>{product.stock}</span>
                                {product.stock <= 0 && <span className="text-[8px] font-black bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full tracking-tighter">OUT OF STOCK</span>}
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <button onClick={() => handleOpenModal(product)} className="p-5 bg-white dark:bg-white/5 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-[1.5rem] transition-all border border-gray-100 dark:border-white/5 shadow-sm"><Edit2 className="w-5 h-5" /></button>
                             <button onClick={() => handleDelete(product.id)} className="p-5 bg-white dark:bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white rounded-[1.5rem] transition-all border border-gray-100 dark:border-white/5 shadow-sm"><Trash2 className="w-5 h-5" /></button>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </main>
        )}

        {/* Analytic Orders View */}
        {activeTab === 'orders' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-right-10 duration-1000">
             {orders.length === 0 ? (
               <div className="py-48 text-center bg-white dark:bg-[#0a0a0a] rounded-[5rem] border border-gray-100 dark:border-white/5 space-y-8">
                  <MonitorDot className="w-20 h-20 text-indigo-100 dark:text-white/5 mx-auto" strokeWidth={1} />
                  <p className="text-[12px] font-black text-gray-500 tracking-[0.5em] uppercase leading-none">Awaiting New Orders</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-12">
                 {[...orders].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order: any) => (
                    <div key={order.id} className="bg-white dark:bg-[#0a0a0a] p-8 md:p-16 rounded-[2.5rem] md:rounded-[5rem] shadow-2xl border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-700">
                       <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-10 md:mb-16 pb-8 md:pb-12 border-b border-gray-50 dark:border-white/5 gap-8 md:gap-10 text-center lg:text-left">
                          <div className="space-y-4 md:space-y-6 w-full lg:w-auto">
                             <div className="flex flex-col gap-2 items-center lg:items-start">
                                <span className="w-fit px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-indigo-500/10 text-[8px] md:text-[9px] font-black text-indigo-500 tracking-[0.4em] uppercase">{new Date(order.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter md:tracking-tight uppercase leading-none">ORDER #{order.id.slice(-6).toUpperCase()}</h3>
                             </div>
                            
                            {/* NEW: Customer Identity Block */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-4">
                               <div className="space-y-2">
                                  <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">CUSTOMER IDENT</p>
                                  <p className="text-xl font-black text-indigo-600 uppercase">{order.customerName || 'ANONYMOUS'}</p>
                               </div>
                               <div className="space-y-2">
                                  <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">CONTACT</p>
                                  <p className="text-xl font-black text-gray-900 dark:text-white">{order.customerPhone || 'N/A'}</p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">DELIVERY AXIS</p>
                                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-tight uppercase line-clamp-2">{order.customerAddress || 'LOCAL PICKUP'}</p>
                                </div>
                            </div>
                         </div>
                         <div className="flex flex-wrap items-center gap-12">
                           <div className="text-right">
                              <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase mb-3 text-ellipsis">TOTAL AMOUNT</p>
                              <p className="text-6xl font-black text-gray-900 dark:text-white font-serif italic leading-none">Rs. {order.total.toLocaleString()}</p>
                           </div>
                           <button onClick={() => handleDeleteOrder(order.id)} className="p-8 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-white hover:bg-red-600 rounded-[2.5rem] border border-gray-100 dark:border-white/5 transition-all shadow-xl">
                              <Trash2 className="w-6 h-6" />
                           </button>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
                         {order.items.map((item: any) => (
                           <div key={item.id} className="space-y-6 p-6 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors">
                              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl grayscale group hover:grayscale-0 transition-all duration-[2s]">
                                 <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-center">
                                 <p className="text-[11px] font-black text-gray-900 dark:text-white line-clamp-1 uppercase tracking-wider">{item.title}</p>
                                 <p className="text-[10px] font-black text-indigo-500 mt-2">QTY: {item.quantity}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-left-10 duration-1000 pb-40">
             <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-[#0a0a0a] p-10 md:p-16 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/30"><MessageSquare className="w-10 h-10 text-white" /></div>
                <div className="text-center md:text-left">
                   <h3 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">Full Reviews Inventory</h3>
                   <p className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">Total Reviews: {reviews.length} | Master Control (Delete Any Review)</p>
                </div>
             </div>

             {reviews.length === 0 ? (
               <div className="py-48 text-center bg-white dark:bg-[#0a0a0a] rounded-[5rem] border border-gray-100 dark:border-white/5 space-y-8">
                  <MonitorDot className="w-20 h-20 text-indigo-100 dark:text-white/5 mx-auto" strokeWidth={1} />
                  <p className="text-[12px] font-black text-gray-500 tracking-[0.5em] uppercase leading-none">No Reviews Available</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-8">
                 {reviews.map((review: any) => (
                   <div key={review.id} className="bg-white dark:bg-[#0a0a0a] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] shadow-xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-all duration-700 group hover:border-indigo-500/20">
                      <div className="relative w-24 h-24 md:w-40 md:h-40 rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-white/5 shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-700">
                         <img src={review.product?.image || '/placeholder.jpg'} alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow space-y-5 text-center md:text-left">
                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                            <div className="flex gap-1.5 p-2 bg-indigo-500/5 rounded-full px-4 border border-indigo-500/10">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <Star key={star} className={cn("w-4 h-4", review.rating >= star ? 'fill-gold text-gold drop-shadow-sm' : 'text-gray-200 dark:text-white/5')} />
                               ))}
                            </div>
                            <span className="text-[9px] font-black text-indigo-500 tracking-[0.3em] uppercase bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-500/10">PROD: {review.product?.title || 'System Ref'}</span>
                            <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">{new Date(review.createdAt).toLocaleDateString()}</span>
                         </div>
                         <div className="space-y-2">
                             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase leading-none tracking-tight">{review.userName}</h4>
                                <span className={cn("text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5", 
                                  "bg-gold/5 text-gold border border-gold/20")}>
                                  <MapPin className="w-3.5 h-3.5" /> {review.userCity || 'ISLAMABAD'}
                                </span>
                             </div>
                            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed italic selection:bg-gold/10">"{review.comment}"</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-8 md:p-10 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-white hover:bg-red-600 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 dark:border-white/5 transition-all shadow-xl active:scale-95"
                      >
                         <Trash2 className="w-7 h-7" />
                      </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* Visionary Settings */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-top-10 duration-1000 pb-40">
             <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-20 rounded-[3rem] md:rounded-[6rem] border border-gray-100 dark:border-white/5 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-20 border-b border-gray-50 dark:border-white/5 pb-16">
                   <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(79,70,229,0.3)]"><Settings className="w-10 h-10 text-white" /></div>
                   <div className="text-center lg:text-left">
                      <h3 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase mb-2">Store Settings</h3>
                      <p className="text-[12px] font-black text-gray-400 tracking-[0.5em] uppercase">Calibrating Environmental Graphics</p>
                   </div>
                </div>
                
                <div className="max-w-5xl space-y-16">
                   <div className="bg-gray-50 dark:bg-white/[0.02] p-6 md:p-16 rounded-[2.5rem] md:rounded-[4.5rem] border border-gray-100 dark:border-white/5 space-y-8 md:space-y-12">
                      <div className="space-y-4">
                         <div className="flex items-center gap-4 text-indigo-500"><span className="w-12 h-[1px] bg-indigo-500" /> <span className="text-[10px] font-black tracking-[0.5em] uppercase">HERO INTERFACE</span></div>
                         <h4 className="text-3xl font-black text-gray-900 dark:text-white">Multi-Media Auto-Slider</h4>
                         <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl">Upload up to 4 items (1 Video + 3 Images). 21:9 Ultra-Wide recommended.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {heroSlides.map((slide) => (
                          <div key={slide.id} className="relative group aspect-[21/9] md:aspect-square bg-black rounded-3xl overflow-hidden shadow-xl">
                            {slide.type === 'VIDEO' ? (
                              <video src={slide.url} className="w-full h-full object-cover opacity-60" muted loop playsInline />
                            ) : (
                              <img src={slide.url} className="w-full h-full object-cover opacity-60" alt="Slide" />
                            )}
                            <button 
                              onClick={() => handleDeleteSlide(slide.id)}
                              className="absolute top-4 right-4 p-3 bg-red-600/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-4 left-4">
                              <span className="text-[8px] font-black bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">{slide.type}</span>
                            </div>
                          </div>
                        ))}
                        
                        {heroSlides.length < 4 && !heroImageSrc && (
                          <div className="flex flex-col gap-4">
                            <label className="flex flex-col items-center justify-center h-full min-h-[150px] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-white dark:bg-transparent hover:bg-indigo-500/5 hover:border-indigo-500/50 transition-all cursor-pointer group">
                              <input type="file" accept="image/*,video/mp4" onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    if (file.type.startsWith('video/')) {
                                      handleSlideUpload(file, 'VIDEO');
                                    } else {
                                      const reader = new FileReader();
                                      reader.onload = () => setHeroImageSrc(reader.result as string);
                                      reader.readAsDataURL(file);
                                    }
                                  }
                              }} className="hidden" />
                              <Plus className="w-8 h-8 text-gray-300 group-hover:text-indigo-600 transition-colors mb-2" />
                              <p className="text-[9px] font-black text-gray-400 group-hover:text-indigo-600 tracking-[0.2em] uppercase">ADD MEDIA</p>
                            </label>
                          </div>
                        )}
                      </div>

                      {heroImageSrc && (
                        <div className="space-y-8 md:space-y-12 animate-in fade-in zoom-in-95 duration-500">
                          <div className="relative w-full h-[300px] md:h-[500px] rounded-[3rem] md:rounded-[5rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl">
                             <Cropper image={heroImageSrc} crop={crop} zoom={zoom} aspect={21 / 9} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                          </div>
                          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                             <div className="flex-grow w-full space-y-4">
                                <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">CROP SCALE</span> <span className="font-serif italic">{zoom.toFixed(1)}x</span></div>
                                <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1 bg-indigo-100 rounded-full appearance-none accent-indigo-600" />
                             </div>
                             <div className="flex gap-4 w-full lg:w-auto">
                                <button onClick={() => setHeroImageSrc(null)} className="px-10 py-5 rounded-2xl font-black text-[10px] tracking-widest text-gray-400 hover:bg-gray-100 transition-all">CANCEL</button>
                                <button 
                                  onClick={async () => {
                                    if (croppedAreaPixels) {
                                      const blob = await getCroppedImg(heroImageSrc, croppedAreaPixels);
                                      handleSlideUpload(new File([], 'temp.jpg'), 'IMAGE', blob);
                                    }
                                  }}
                                  disabled={isUploadingSlide}
                                  className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3"
                                >
                                  {isUploadingSlide ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                  SAVE IMAGE
                                </button>
                             </div>
                          </div>
                        </div>
                      )}
                   </div>

                   <div className="bg-gray-50 dark:bg-white/[0.02] p-6 md:p-16 rounded-[2.5rem] md:rounded-[4.5rem] border border-gray-100 dark:border-white/5 space-y-8 md:space-y-12">
                      <div className="flex flex-col lg:flex-row justify-between gap-12">
                        <div className="space-y-4 flex-grow">
                           <div className="flex items-center gap-4 text-indigo-500"><span className="w-12 h-[1px] bg-indigo-500" /> <span className="text-[10px] font-black tracking-[0.5em] uppercase">TIMING ENGINE</span></div>
                           <h4 className="text-3xl font-black text-gray-900 dark:text-white">Slider Duration</h4>
                           <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-md">Choose the speed at which your gallery transitions between masterpieces.</p>
                           <div className="space-y-6 pt-4">
                             <div className="flex justify-between items-end">
                                <span className={cn(cinzel.className, "text-5xl font-black text-indigo-600 italic")}>{heroDelay / 1000}s</span>
                                <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">PRECISION CALIBRATION</span>
                             </div>
                             <input 
                               type="range" 
                               min="1000" 
                               max="10000" 
                               step="500" 
                               value={heroDelay} 
                               onChange={(e) => setHeroDelay(parseInt(e.target.value))}
                               onMouseUp={(e) => handleDelayUpdate(parseInt((e.target as HTMLInputElement).value))}
                               onTouchEnd={(e) => handleDelayUpdate(parseInt((e.target as HTMLInputElement).value))}
                               className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600 cursor-pointer" 
                             />
                             <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase tracking-widest px-2">
                                <span>1s</span>
                                <span>2.5s</span>
                                <span>5s</span>
                                <span>7.5s</span>
                                <span>10s</span>
                             </div>
                           </div>
                        </div>

                        <div className="space-y-4 min-w-[300px]">
                            <div className="flex items-center gap-4 text-indigo-500"><span className="w-12 h-[1px] bg-indigo-500" /> <span className="text-[10px] font-black tracking-[0.5em] uppercase">MEDIA CONTROL</span></div>
                            <h4 className="text-3xl font-black text-gray-900 dark:text-white">Video Visibility</h4>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed">Instantly mute or reveal the cinematic video introduction.</p>
                            <div className="flex gap-2 md:gap-4 p-2 bg-gray-200 dark:bg-white/5 rounded-3xl w-fit">
                                <button onClick={() => handleVideoToggle(true)} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl text-[8px] md:text-[10px] font-black tracking-[0.2em] transition-all ${heroVideoEnabled ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}>ENABLE</button>
                                <button onClick={() => handleVideoToggle(false)} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl text-[8px] md:text-[10px] font-black tracking-[0.2em] transition-all ${!heroVideoEnabled ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400'}`}>BLOCK</button>
                            </div>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Artistic Asset Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-white/40 dark:bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-5xl rounded-[3rem] md:rounded-[6rem] border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[90vh] relative animate-in zoom-in-95 duration-700">
               <button onClick={() => setIsModalOpen(false)} className="absolute top-4 md:top-10 right-4 md:right-10 p-4 md:p-6 bg-gray-50 dark:bg-white/5 hover:bg-red-500 text-gray-400 hover:text-white rounded-full transition-all active:scale-90 z-[130] shadow-2xl">
                 <X className="w-5 md:w-6 h-5 md:h-6" />
               </button>
               
               {/* Visual Side */}
               <div className="w-full lg:w-5/12 bg-gray-50 dark:bg-white/[0.02] p-10 md:p-20 flex flex-col justify-center gap-8 md:gap-12 border-b lg:border-b-0 lg:border-r border-gray-50 dark:border-white/5 overflow-y-auto overflow-x-hidden">
                   <div className="space-y-4 text-center lg:text-left">
                      <Eye className="w-8 md:w-12 h-8 md:h-12 text-indigo-100 dark:text-white/5 mx-auto lg:mx-0" strokeWidth={1} />
                      <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">PRODUCT <br className="hidden md:block" /> IMAGE</h3>
                      <p className="text-[9px] md:text-[11px] font-black text-gray-400 tracking-[0.3em] md:tracking-[0.5em] uppercase leading-none">Store Item Preview</p>
                   </div>

                   <div className="space-y-8 md:space-y-12">
                      {!productImageSrc ? (
                         <label className="relative flex flex-col items-center justify-center h-96 rounded-[4rem] bg-white dark:bg-transparent border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xl group overflow-hidden">
                            <input type="file" accept="image/*" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.addEventListener('load', () => setProductImageSrc(reader.result?.toString() || null));
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                            }} className="hidden" />
                            <LayoutDashboard className="w-16 h-16 text-gray-200 dark:text-gray-800 group-hover:text-indigo-600 transition-all" />
                            {formData.image && <img src={formData.image} className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />}
                         </label>
                      ) : (
                         <div className="space-y-10">
                            <div className="relative h-[450px] rounded-[4rem] overflow-hidden border border-gray-200 dark:border-white/10 ring-8 ring-white dark:ring-white/5 shadow-inner bg-black">
                               <Cropper image={productImageSrc} crop={productCrop} zoom={productZoom} aspect={4 / 5} onCropChange={setProductCrop} onCropComplete={onProductCropComplete} onZoomChange={setProductZoom} />
                            </div>
                            <div className="flex items-center gap-6">
                               <input type="range" value={productZoom} min={1} max={3} step={0.1} onChange={(e) => setProductZoom(parseFloat(e.target.value))} className="flex-grow h-1 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600" />
                               <button type="button" onClick={() => setProductImageSrc(null)} className="text-[12px] font-black text-red-500 tracking-[0.2em] uppercase">RESET</button>
                            </div>
                         </div>
                      )}
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed">High-quality product images required. Portrait aspect (4:5) recommended.</p>
                   </div>
               </div>

               {/* Dossier Side */}
               <div className="w-full lg:w-7/12 p-8 md:p-24 overflow-y-auto space-y-8 md:space-y-16">
                  <div className="space-y-8 md:space-y-16">
                     <div className="space-y-2 md:space-y-3 text-center lg:text-left">
                        <span className="text-[8px] md:text-[10px] font-black text-indigo-500 tracking-[0.3em] md:tracking-[0.6em] uppercase">PRODUCT DETAILS</span>
                        <h2 className="text-2xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">{editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}</h2>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
                        <div className="space-y-10">
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">PRODUCT TITLE</label>
                              <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-6 md:px-10 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none text-2xl font-black text-gray-900 dark:text-white transition-all shadow-lg" />
                           </div>
                           <div className="grid grid-cols-2 gap-10">
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">CLASSIFICATION</label>
                                 <input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-6 md:px-10 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none font-bold text-gray-900 dark:text-white shadow-lg" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">PRICE (PKR)</label>
                                 <input required type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full px-6 md:px-10 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none font-black text-gray-900 dark:text-white text-2xl shadow-lg" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase ml-4">PRODUCT DESCRIPTION</label>
                              <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5} className="w-full px-6 md:px-10 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none font-medium text-lg leading-relaxed text-gray-500 transition-all resize-none shadow-lg" />
                           </div>
                           <div className="flex items-center justify-between bg-gray-50 dark:bg-white/[0.04] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-inner">
                              <div className="flex items-center gap-6">
                                 <div className={cn("p-4 rounded-3xl transition-all duration-500 shadow-xl", formData.isPinned ? "bg-indigo-600 text-white rotate-12" : "bg-white dark:bg-black/20 text-gray-400 -rotate-12")}>
                                    <Pin className={cn("w-6 h-6", formData.isPinned ? "fill-current" : "")} />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-[12px] font-black text-gray-900 dark:text-white tracking-widest uppercase">PIN TO TOP</p>
                                    <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase">Feature item at the start of gallery</p>
                                 </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, isPinned: !formData.isPinned})}
                                className={cn(
                                   "w-16 h-8 rounded-full relative transition-all duration-500",
                                   formData.isPinned ? "bg-indigo-600" : "bg-gray-200 dark:bg-white/10"
                                )}
                              >
                                 <div className={cn(
                                    "absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-lg",
                                    formData.isPinned ? "left-9" : "left-1"
                                 )} />
                              </button>
                           </div>
                           <div className="space-y-4">
                              <div className="flex items-center justify-between ml-4">
                                 <label className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase">STOCK QUANTITY</label>
                                 <button 
                                   type="button"
                                   onClick={() => setFormData({...formData, stock: formData.stock > 0 ? 0 : 10})}
                                   className={cn(
                                      "text-[9px] font-black px-4 py-2 rounded-full transition-all",
                                      formData.stock <= 0 ? "bg-green-500 text-white" : "bg-red-500/10 text-red-500"
                                   )}
                                 >
                                    {formData.stock <= 0 ? "RESTOCK ITEM" : "MARK OUT OF STOCK"}
                                 </button>
                              </div>
                              <input required type="number" value={formData.stock || ''} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full px-6 md:px-10 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 focus:border-indigo-500 outline-none font-black text-gray-900 dark:text-white text-2xl shadow-lg" />
                           </div>
                        </div>
                        <div className="pt-10">
                           <button type="submit" disabled={isUploadingHero} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-8 rounded-[2.5rem] text-[12px] font-black tracking-[0.5em] uppercase shadow-[0_25px_50px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center justify-center gap-6">
                              {isUploadingHero ? (
                                <>
                                  <Loader2 className="w-6 h-6 animate-spin" />
                                  SYNCING ARCHIVE...
                                </>
                              ) : (
                                <>
                                  {editingProduct ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'} <Check className="w-6 h-6" strokeWidth={3} />
                                </>
                              )}
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
