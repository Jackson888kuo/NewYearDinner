import React from 'react';
import { UserOrder, FAMILY_MEMBERS } from '../types';

interface OrderSummaryProps {
  orders: Record<string, UserOrder>;
  onEdit: (name: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ orders, onEdit }) => {
  const [copied, setCopied] = React.useState(false);

  const generateTextSummary = () => {
    let text = "🍽️ *Family Dinner Orders* 🍽️\n\n";
    
    Object.values(orders).forEach((order: UserOrder) => {
      text += `👤 *${order.userName}*\n`;
      text += `🍲 Soup: ${order.soup?.name}\n`;
      text += `🥗 Appetizer: ${order.appetizer?.name}\n`;
      text += `🥩 Main: ${order.main?.name}\n`;
      if (order.aLaCarte.length > 0) {
        text += `🍤 Add-ons: ${order.aLaCarte.map(i => i.name).join(', ')}\n`;
      }
      if (order.notes) {
        text += `📝 Note: ${order.notes}\n`;
      }
      text += `-------------------\n`;
    });

    return text;
  };

  const handleCopy = () => {
    const text = generateTextSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allOrdered = FAMILY_MEMBERS.every(m => orders[m]?.isConfirmed);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h2 className="text-4xl font-serif text-center text-ink mb-2">Order Summary</h2>
      <p className="text-center text-gray-500 mb-8 font-sans">Ready to send to the restaurant</p>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {FAMILY_MEMBERS.map(member => {
          const order = orders[member];
          if (!order) return null;

          return (
            <div key={member} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gold relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-serif text-ink">{member}</h3>
                <button 
                  onClick={() => onEdit(member)}
                  className="text-sm text-gray-400 hover:text-gold underline font-sans"
                >
                  Edit
                </button>
              </div>
              
              <div className="space-y-2 text-gray-700 font-sans">
                <p><span className="font-bold text-xs uppercase tracking-wider text-gray-400 block">Soup</span> {order.soup?.name}</p>
                <p><span className="font-bold text-xs uppercase tracking-wider text-gray-400 block">Appetizer</span> {order.appetizer?.name}</p>
                <p><span className="font-bold text-xs uppercase tracking-wider text-gray-400 block">Main Course</span> {order.main?.name}</p>
                
                {order.aLaCarte.length > 0 && (
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-400 block">Add-ons</span>
                    <ul className="list-disc list-inside">
                      {order.aLaCarte.map(item => (
                        <li key={item.id}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {order.notes && (
                   <p className="bg-yellow-50 p-2 rounded mt-2 text-sm border border-yellow-100">
                    <span className="font-bold">Note:</span> {order.notes}
                   </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4">
        {Object.keys(orders).length === 0 ? (
           <p className="text-gray-400 italic">No orders placed yet.</p>
        ) : (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-ink text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all"
          >
            {copied ? (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Copied to Clipboard!
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copy for Restaurant Staff
              </>
            )}
          </button>
        )}
        
        {!allOrdered && Object.keys(orders).length > 0 && (
            <p className="text-red-500 text-sm mt-2">Waiting for: {FAMILY_MEMBERS.filter(m => !orders[m]).join(", ")}</p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;