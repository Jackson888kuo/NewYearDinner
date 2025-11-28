import React from 'react';
import { FullMenu, MenuItem, UserOrder, MenuCategory } from '../types';

interface MenuFormProps {
  userName: string;
  menu: FullMenu;
  existingOrder?: UserOrder;
  onSave: (order: UserOrder) => void;
  onBack: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ userName, menu, existingOrder, onSave, onBack }) => {
  const [soup, setSoup] = React.useState<MenuItem | undefined>(existingOrder?.soup);
  const [appetizer, setAppetizer] = React.useState<MenuItem | undefined>(existingOrder?.appetizer);
  const [main, setMain] = React.useState<MenuItem | undefined>(existingOrder?.main);
  const [aLaCarte, setALaCarte] = React.useState<MenuItem[]>(existingOrder?.aLaCarte || []);
  const [notes, setNotes] = React.useState<string>(existingOrder?.notes || '');

  const handleALaCarteToggle = (item: MenuItem) => {
    setALaCarte(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isFormValid = () => {
    return !!soup && !!appetizer && !!main;
  };

  const handleSave = () => {
    if (!isFormValid()) return;
    onSave({
      userName,
      soup,
      appetizer,
      main,
      aLaCarte,
      notes,
      isConfirmed: true
    });
  };

  const renderSection = (
    category: MenuCategory, 
    selectedItem: MenuItem | undefined, 
    onSelect: (item: MenuItem) => void
  ) => (
    <div className="mb-10 animate-fade-in-up">
      <h3 className="font-serif text-2xl text-ink mb-4 border-b border-gold/30 pb-2">
        {category.title}
      </h3>
      <div className="space-y-3">
        {category.items.map((item) => (
          <label 
            key={item.id} 
            className={`
              block relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedItem?.id === item.id 
                ? 'border-gold bg-gold/5 shadow-md' 
                : 'border-transparent bg-white hover:border-gray-200 shadow-sm'}
            `}
          >
            <input
              type="radio"
              name={category.title}
              value={item.id}
              checked={selectedItem?.id === item.id}
              onChange={() => onSelect(item)}
              className="absolute opacity-0"
            />
            <div className="flex justify-between items-start">
              <span className="font-serif text-lg text-ink/90 font-medium pr-4">{item.name}</span>
              {item.price && (
                <span className="text-gray-500 font-sans text-sm whitespace-nowrap">NT$ {item.price.toLocaleString()}</span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gold transition-colors font-sans text-sm flex items-center"
        >
          ← Back to Users
        </button>
        <h2 className="text-3xl font-serif text-center text-gold">Dining selection for {userName}</h2>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {renderSection(menu.soup, soup, setSoup)}
      {renderSection(menu.aLaCarte, undefined, (item) => handleALaCarteToggle(item))}
      
      {/* A La Carte Special Render for checkboxes */}
       {/* Note: I'm reusing the logic above for structure but overriding UI for checkboxes below */}
       <div className="-mt-10 mb-10 hidden"></div> {/* Placeholder to offset reuse if needed, but doing manual override below */}

      {/* Manual A La Carte Section Override */}
      <div className="hidden">
         {/* Hiding the previous render call to do custom MultiSelect */}
      </div>
      
      {/* Re-rendering A La Carte properly as multiselect */}
      <div className="mb-10">
        <h3 className="font-serif text-2xl text-ink mb-4 border-b border-gold/30 pb-2">
          {menu.aLaCarte.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
          {menu.aLaCarte.items.map((item) => {
            const isSelected = aLaCarte.some(i => i.id === item.id);
            return (
              <label 
                key={item.id} 
                className={`
                  block relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${isSelected
                    ? 'border-gold bg-gold/5 shadow-md' 
                    : 'border-transparent bg-white hover:border-gray-200 shadow-sm'}
                `}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleALaCarteToggle(item)}
                  className="absolute opacity-0"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded border border-gray-400 mr-3 flex items-center justify-center ${isSelected ? 'bg-gold border-gold' : ''}`}>
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="font-serif text-lg text-ink/90 font-medium">{item.name}</span>
                  </div>
                  {item.price && (
                    <span className="text-gray-500 font-sans text-sm">NT$ {item.price.toLocaleString()}</span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {renderSection(menu.appetizer, appetizer, setAppetizer)}
      {renderSection(menu.main, main, setMain)}

      <div className="mb-10">
        <h3 className="font-serif text-2xl text-ink mb-4 border-b border-gold/30 pb-2">
          Special Requests / Dietary Restrictions
        </h3>
        <textarea 
          className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none shadow-sm"
          rows={3}
          placeholder="E.g., No cilantro, medium-rare steak..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-center z-50">
        <button
          onClick={handleSave}
          disabled={!isFormValid()}
          className={`
            px-8 py-3 rounded-full font-sans font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1
            ${isFormValid() 
              ? 'bg-gold text-white hover:bg-amber-700 hover:shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default MenuForm;