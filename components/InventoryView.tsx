import React, { useState, useEffect, useMemo } from 'react';
import type { InventoryItem, Vendor, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import InventoryDetailModal from './InventoryDetailModal';

interface InventoryViewProps {
  currentUser: Employee;
}

const InventoryView: React.FC<InventoryViewProps> = ({ currentUser }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invData, vendorData, empData] = await Promise.all([
        api.getInventory(),
        api.getVendors(),
        api.getEmployees(),
      ]);
      setInventory(invData);
      setVendors(vendorData);
      setEmployees(empData);
    } catch (error) {
      console.error("Failed to fetch inventory data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (itemData: InventoryItem, action: 'add' | 'update') => {
    try {
      if (action === 'update') {
        await api.updateInventoryItem(itemData.id, itemData);
      } else {
        const { id, updated_at, ...newItemData } = itemData;
        await api.createInventoryItem({
          ...newItemData,
          organization_id: currentUser.organization_id
        } as Omit<InventoryItem, 'id' | 'updated_at'>);
      }
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const handleOpenNew = () => {
      const newItemTemplate: InventoryItem = {
          id: 0,
          part_name: '', // Will be mapped to `name`
          name: '',
          sku: '',
          cost: 0, // Will be mapped to `price`
          price: 0,
          quantity: 0, // Will be mapped to `stock`
          stock: 0,
          updated_at: new Date().toISOString(),
          category: '',
          manufacturer: '',
          vendor_id: undefined,
          supplier: '',
          purchase_date: '',
          warranty_expiry_date: '',
          serial_number: '',
          location: '',
          notes: '',
      };
      setSelectedItem(newItemTemplate);
  };

  const filteredInventory = useMemo(() => {
    if (!searchTerm) return inventory;
    const lowerCaseTerm = searchTerm.toLowerCase();
    return inventory.filter(i =>
      (i.name && i.name.toLowerCase().includes(lowerCaseTerm)) ||
      (i.sku && i.sku.toLowerCase().includes(lowerCaseTerm)) ||
      (i.category && i.category.toLowerCase().includes(lowerCaseTerm))
    );
  }, [inventory, searchTerm]);


  if (isLoading) {
    return <div className="text-center">Loading inventory from Supabase...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex items-center space-x-4">
             <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dc-text-secondary" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-dc-input border border-dc-border rounded-lg pl-10 pr-4 py-2.5 w-72 focus:outline-none focus:ring-2 focus:ring-dc-purple transition"
              />
            </div>
            <button onClick={handleOpenNew} className="bg-dc-purple px-4 py-2.5 rounded-lg font-semibold flex items-center space-x-2 hover:bg-dc-purple/80 transition">
                <Icon name="plus" className="w-5 h-5"/>
                <span>New Item</span>
            </button>
        </div>
      </div>
      <Panel className="overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-dc-panel/80">
                 <tr className="border-b border-dc-border">
                    <th className="p-4 font-semibold text-dc-text-secondary">Item Name</th>
                    <th className="p-4 font-semibold text-dc-text-secondary">SKU</th>
                    <th className="p-4 font-semibold text-dc-text-secondary">Category</th>
                    <th className="p-4 font-semibold text-dc-text-secondary text-center">Stock</th>
                    <th className="p-4 font-semibold text-dc-text-secondary text-right">Price</th>
                </tr>
            </thead>
            <tbody>
                {filteredInventory.map(item => (
                    <tr key={item.id} onClick={() => setSelectedItem(item)} className="border-b border-dc-border last:border-b-0 hover:bg-dc-hover cursor-pointer">
                        <td className="p-4 font-semibold text-dc-text-primary">{item.name}</td>
                        <td className="p-4 font-mono text-dc-purple">{item.sku}</td>
                        <td className="p-4 text-dc-text-secondary">{item.category}</td>
                        <td className="p-4 text-dc-text-primary font-bold text-center">{item.stock}</td>
                        <td className="p-4 text-green-400 font-bold text-right">${item.price?.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </Panel>

      {selectedItem && (
        <InventoryDetailModal 
          item={selectedItem}
          vendors={vendors}
          onClose={() => setSelectedItem(null)} 
          onSave={handleSave}
          currentUser={currentUser}
          allEmployees={employees}
        />
      )}
    </div>
  );
};

export default InventoryView;