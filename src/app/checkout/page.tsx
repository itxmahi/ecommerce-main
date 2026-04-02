'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, Lock, CreditCard, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [shippingData, setShippingData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Islamabad'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // 1. Save to Database
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: getCartTotal(),
          customerName: shippingData.name,
          customerPhone: shippingData.phone,
          customerAddress: `${shippingData.address}, ${shippingData.city}`
        })
      });

      if (!res.ok) throw new Error('Failed to save order');
      const order = await res.json();
      
      // 2. Prepare WhatsApp Message
      const message = `*NEW ORDER - AL-JAMAAL ART*%0A%0A` +
        `*Order ID:* ${order.id.slice(-6).toUpperCase()}%0A` +
        `*Customer:* ${shippingData.name}%0A` +
        `*Phone:* ${shippingData.phone}%0A` +
        `*Address:* ${shippingData.address}, ${shippingData.city}%0A%0A` +
        `*ITEMS:*%0A` +
        cart.map(item => `- ${item.title} (x${item.quantity}) - Rs. ${item.price.toLocaleString()}`).join('%0A') +
        `%0A%0A*TOTAL AMOUNT:* Rs. ${getCartTotal().toLocaleString()}%0A%0A` +
        `Please confirm my order. Thank you!`;

      const whatsappUrl = `https://wa.me/923455096636?text=${message}`;

      // 3. Finalize
      clearCart();
      window.open(whatsappUrl, '_blank');
      router.push(`/checkout/success?id=${order.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };


  if (cart.length === 0 && !isProcessing) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-6xl font-black text-foreground mb-12 tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
        CHECK<span className="text-indigo-600">OUT</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Checkout Form */}
        <div className="space-y-12">
          <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-left-6">
            <div className="space-y-8 glass p-10 rounded-3xl border border-border">
              <h3 className="text-3xl font-black flex items-center gap-4 tracking-tighter uppercase">
                <Truck className="w-8 h-8 text-indigo-600" /> SHIPPING DETAILS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black tracking-[0.4em] text-muted uppercase ml-4">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={shippingData.name}
                    onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                    placeholder="Enter your name" 
                    className="w-full px-8 py-5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-lg font-bold text-foreground outline-none transition-all shadow-lg" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black tracking-[0.4em] text-muted uppercase ml-4">WhatsApp Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                    placeholder="+92..." 
                    className="w-full px-8 py-5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-lg font-bold text-foreground outline-none transition-all shadow-lg" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black tracking-[0.4em] text-muted uppercase ml-4">Delivery Address</label>
                <input 
                  required 
                  type="text" 
                  value={shippingData.address}
                  onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                  placeholder="House #, Street, Area" 
                  className="w-full px-8 py-5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-lg font-bold text-foreground outline-none transition-all shadow-lg" 
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black tracking-[0.4em] text-muted uppercase ml-4">City</label>
                <input 
                  required 
                  type="text" 
                  value={shippingData.city}
                  onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                  placeholder="e.g. Islamabad" 
                  className="w-full px-8 py-5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-indigo-600 text-lg font-bold text-foreground outline-none transition-all shadow-lg" 
                />
              </div>
            </div>

            <div className="space-y-8 glass p-10 rounded-3xl border border-border opacity-50 pointer-events-none grayscale">
              <h3 className="text-3xl font-black flex items-center gap-4 tracking-tighter uppercase">
                <CreditCard className="w-8 h-8 text-indigo-600" /> PAYMENT METHOD
              </h3>
              <p className="text-sm font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-2xl border border-indigo-100 flex items-center gap-4">
                <Lock className="w-6 h-6" /> CASH ON DELIVERY (SECURE)
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`btn-primary w-full py-10 text-2xl font-black tracking-[0.3em] flex items-center justify-center gap-6 shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-95 duration-500 rounded-[2.5rem] uppercase ${
                isProcessing ? 'animate-pulse' : ''
              }`}
            >
              {isProcessing ? 'PROCESSING...' : 'PLACE ORDER NOW'} <ArrowRight className="w-8 h-8" />
            </button>
          </form>
        </div>

        {/* Order Review Sidebar */}
        <div className="space-y-10 lg:sticky lg:top-32 h-fit animate-in fade-in slide-in-from-right-6 transition-all">
          <div className="glass p-12 rounded-[40px] border border-border shadow-2xl space-y-8">
            <h3 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis border-b pb-6">ORDER REVIEW</h3>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-6 group">
                  <div className="relative w-20 h-20 bg-secondary rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-muted font-black tracking-widest mt-1">QTY: {item.quantity}</p>
                  </div>
                  <p className="font-black text-indigo-600">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t space-y-4">
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted">
                <span>SUBTOTAL</span>
                <span className="text-foreground">Rs. {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted">
                <span>ESTIMATED TAX</span>
                <span className="text-foreground">Rs. 0</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-2xl font-black tracking-tighter">TOTAL</span>
                <span className="text-4xl font-black text-indigo-600">Rs. {getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-10 border-t pt-8">
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-2xl border">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                <span className="text-[10px] font-black uppercase text-muted tracking-widest">SECURE</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary/50 rounded-2xl border">
                <Truck className="w-6 h-6 text-indigo-600" />
                <span className="text-[10px] font-black uppercase text-muted tracking-widest">FREE SHIP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
