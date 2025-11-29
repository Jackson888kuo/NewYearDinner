import React from 'react';
import { UserOrder, FAMILY_MEMBERS } from '../types';

interface OrderSummaryProps {
  orders: Record<string, UserOrder>;
  onEdit: (name: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ orders, onEdit }) => {
  const [copied, setCopied] = React.useState(false);

  // Function to generate plain text content for the file download
  const generateFileContent = () => {
    let content = "DINNER ORDER SUMMARY\n";
    content += "====================\n\n";
    
    // Group by category for the kitchen
    const soups: string[] = [];
    const appetizers: string[] = [];
    const mains: string[] = [];
    const others: string[] = [];

    // Detailed breakdown per person
    Object.values(orders).forEach((order: UserOrder) => {
      content += `[ ${order.userName} ]\n`;
      content += `- Soup: ${order.soup?.name}\n`;
      content += `- Appetizer: ${order.appetizer?.name}\n`;
      content += `- Main: ${order.main?.name}\n`;
      if (order.aLaCarte.length > 0) {
        content += `- Add-ons: ${order.aLaCarte.map(i => i.name).join(', ')}\n`;
      }
      if (order.notes) {
        content += `- NOTE: ${order.notes}\n`;
      }
      content += "\n";
    });

    content += "====================\n";
    content += `Total Guests: ${Object.keys(orders).length}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    
    return content;
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generateFileContent()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Dinner_Order_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    const text = generateFileContent();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allOrdered = FAMILY_MEMBERS.every(m => orders[m]?.isConfirmed);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h2 className="text-4xl font-serif text-center text-ink mb-2">Order Summary</h2>
      <p className="text-center text-gray-500 mb-8 font-sans">Final review for restaurant staff</p>

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

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {Object.keys(orders).length === 0 ? (
           <p className="text-gray-400 italic">No orders placed yet.</p>
        ) : (
          <>
            <button
              onClick={handleCopy}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-white border-2 border-ink text-ink px-8 py-3 rounded-full font-bold shadow hover:bg-gray-50 transition-all"
            >
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={handleDownload}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-ink text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download File for Staff
            </button>
          </>
        )}
      </div>
      
      {!allOrdered && Object.keys(orders).length > 0 && (
          <p className="text-center text-red-500 text-sm mt-6">Waiting for: {FAMILY_MEMBERS.filter(m => !orders[m]).join(", ")}</p>
      )}
    </div>
  );
};

export default OrderSummary;