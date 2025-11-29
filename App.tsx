import React, { useState, useRef, useEffect } from 'react';
import { FAMILY_MEMBERS, FamilyMember, FullMenu, UserOrder } from './types';
import { INITIAL_MENU } from './constants';
import MenuForm from './components/MenuForm';
import OrderSummary from './components/OrderSummary';
import { parseMenuImage } from './services/geminiService';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'users' | 'ordering' | 'summary'>('users');
  const [selectedUser, setSelectedUser] = useState<FamilyMember | null>(null);
  const [orders, setOrders] = useState<Record<string, UserOrder>>({});
  const [menu, setMenu] = useState<FullMenu>(INITIAL_MENU);
  const [isParsing, setIsParsing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data and handle URL imports
  useEffect(() => {
    // 1. Load local data
    const savedOrders = storageService.getOrders();
    
    // 2. Check for URL import (Simulated Network Sync)
    const params = new URLSearchParams(window.location.search);
    const importData = params.get('import');
    
    let finalOrders = { ...savedOrders };

    if (importData) {
      const importedOrders = storageService.decodeOrdersFromUrl(importData, menu);
      finalOrders = { ...finalOrders, ...importedOrders };
      
      // Clear URL to prevent re-importing on refresh
      window.history.replaceState({}, '', window.location.pathname);
      alert(`Sync successful! Updated orders for: ${Object.keys(importedOrders).join(', ')}`);
    }

    setOrders(finalOrders);
    storageService.saveOrders(finalOrders);
  }, []);

  const handleUserSelect = (user: FamilyMember) => {
    setSelectedUser(user);
    setCurrentView('ordering');
  };

  const handleOrderSave = (order: UserOrder) => {
    const newOrders = {
      ...orders,
      [order.userName]: order
    };
    setOrders(newOrders);
    storageService.saveOrders(newOrders); // Persist
    setCurrentView('users');
    setSelectedUser(null);
  };

  const handleMenuUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const parsedMenu = await parseMenuImage(base64String);
        if (parsedMenu) {
          setMenu(parsedMenu);
          alert("Menu updated successfully via Gemini AI!");
        } else {
          alert("Could not parse menu. Please try a clearer image.");
        }
      } catch (e) {
        console.error(e);
        alert("Error parsing menu. Make sure your API Key is valid.");
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const generateShareLink = (specificUser?: string) => {
    let payloadOrders = orders;
    // If specificUser is provided, only share that order (good for individual guests)
    if (specificUser && orders[specificUser]) {
        payloadOrders = { [specificUser]: orders[specificUser] };
    }
    
    const base64 = storageService.encodeOrdersToUrl(payloadOrders);
    const url = `${window.location.origin}${window.location.pathname}?import=${base64}`;
    navigator.clipboard.writeText(url);
    alert(specificUser ? `Link for ${specificUser} copied! Send this to the Host.` : "Group Sync Link copied! Anyone who opens this will see all current orders.");
  };

  const activeOrdersCount = Object.keys(orders).length;

  return (
    <div className="min-h-screen bg-paper bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight cursor-pointer" onClick={() => setCurrentView('users')}>
            Dinner<span className="text-gold">Concierge</span>
          </h1>
          <div className="flex gap-4 items-center">
             <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleMenuUpload}
            />
            
            <button 
              onClick={triggerFileUpload}
              className="text-xs font-sans text-gray-400 hover:text-gold flex items-center gap-1"
              title="Scan a new menu with AI"
            >
              📷 Scan Menu
            </button>

            <button 
              onClick={() => generateShareLink()}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              title="Generate a link to share state between devices"
            >
              🔗 Sync / Share
            </button>

            {activeOrdersCount > 0 && (
              <button 
                onClick={() => setCurrentView('summary')}
                className="font-sans text-sm font-bold text-ink hover:text-gold underline decoration-gold underline-offset-4"
              >
                View Summary ({activeOrdersCount})
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        {currentView === 'users' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
             <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif text-ink mb-4">Who is ordering?</h2>
                <p className="text-gray-500 font-sans text-lg">Select your name to begin. Data is saved automatically.</p>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {FAMILY_MEMBERS.map((member) => {
                 const hasOrdered = !!orders[member];
                 return (
                   <div key={member} className="relative group">
                     <button
                      onClick={() => handleUserSelect(member)}
                      className={`
                        w-full h-48 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-4 relative z-10
                        ${hasOrdered 
                          ? 'bg-green-50 border-green-200 shadow-sm' 
                          : 'bg-white border-gray-200 hover:border-gold hover:shadow-xl hover:-translate-y-1'}
                      `}
                     >
                       {hasOrdered && (
                         <div className="absolute top-3 right-3 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm">
                           ✓
                         </div>
                       )}
                       <div className={`
                         w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl font-serif
                         ${hasOrdered ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600 group-hover:bg-gold group-hover:text-white transition-colors'}
                       `}>
                         {member.charAt(0)}
                       </div>
                       <span className="font-serif text-xl text-ink font-medium">{member}</span>
                       {hasOrdered ? (
                         <span className="text-xs text-green-600 font-sans mt-2">Order Confirmed</span>
                       ) : (
                         <span className="text-xs text-gray-400 font-sans mt-2 group-hover:text-gold">Tap to order</span>
                       )}
                     </button>
                     
                     {/* Share Individual Link Button */}
                     {hasOrdered && (
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          generateShareLink(member);
                        }}
                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-20 bg-white border border-gray-200 shadow-md rounded-full px-3 py-1 text-[10px] text-gray-500 hover:text-gold hover:border-gold flex items-center gap-1 whitespace-nowrap"
                       >
                         📤 Share
                       </button>
                     )}
                   </div>
                 );
               })}
             </div>
             
             {activeOrdersCount > 0 && (
               <div className="mt-16 flex justify-center">
                 <button 
                  onClick={() => setCurrentView('summary')}
                  className="bg-ink text-white px-8 py-3 rounded-full font-sans font-bold hover:bg-gray-800 transition-colors shadow-lg"
                 >
                   Review All Orders →
                 </button>
               </div>
             )}
          </div>
        )}

        {currentView === 'ordering' && selectedUser && (
          <MenuForm 
            userName={selectedUser}
            menu={menu}
            existingOrder={orders[selectedUser]}
            onSave={handleOrderSave}
            onBack={() => {
              setSelectedUser(null);
              setCurrentView('users');
            }}
          />
        )}

        {currentView === 'summary' && (
          <div>
             <div className="mb-4">
               <button 
                onClick={() => setCurrentView('users')} 
                className="text-gray-500 hover:text-gold flex items-center gap-2"
               >
                 ← Back to Selection
               </button>
             </div>
             <OrderSummary 
                orders={orders} 
                onEdit={(name) => {
                  setSelectedUser(name as FamilyMember);
                  setCurrentView('ordering');
                }}
             />
          </div>
        )}

      </main>
      
      {isParsing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="font-sans font-bold text-lg">Analyzing Menu Image...</p>
        </div>
      )}
    </div>
  );
};

export default App;