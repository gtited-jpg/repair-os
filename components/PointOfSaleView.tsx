import React, { useState, useMemo, useEffect } from 'react';
import type { Employee, CartItem, Customer, InventoryItem } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import CustomerSelectModal from './CustomerSelectModal';
import CustomItemModal from './CustomItemModal';
import HeldCartsModal from './HeldCartsModal';
import CheckoutModal from './CheckoutModal';

interface PointOfSaleViewProps {
  addLogEntry: (action: string, details: string) => void;
  currentUser: Employee;
  allEmployees: Employee[];
  onSwitchUser: (employeeId: number) => void;
}

const PointOfSaleView: React.FC<PointOfSaleViewProps> = ({ addLogEntry, currentUser }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [inventory, setInventory] =useState<InventoryItem[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [attachedCustomer, setAttachedCustomer] = useState<Customer | null>(null);
    const [heldCarts, setHeldCarts] = useState<{ cart: CartItem[], customer: Customer | null }[]>([]);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isCustomItemModalOpen, setIsCustomItemModalOpen] = useState(false);
    const [isHeldCartsModalOpen, setIsHeldCartsModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        const [invData, custData] = await Promise.all([api.getInventory(), api.getCustomers()]);
        setInventory(invData);
        setCustomers(custData);
      };
      fetchData();
    }, []);

    const filteredInventory = useMemo(() => {
        if (!searchTerm) return inventory;
        return inventory.filter(i => i.part_name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [inventory, searchTerm]);

    const { subtotal, tax, total } = useMemo(() => {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = subtotal * 0.0825; // Placeholder tax
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }, [cart]);
    
    const addToCart = (item: { id: number | string, name: string, price: number }) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };
    
    const updateQuantity = (id: number | string, newQuantity: number) => {
        if (newQuantity < 1) {
            setCart(prev => prev.filter(i => i.id !== id));
        } else {
            setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
        }
    };

    const holdSale = () => {
        if (cart.length === 0) return;
        setHeldCarts(prev => [...prev, { cart, customer: attachedCustomer }]);
        setCart([]);
        setAttachedCustomer(null);
        addLogEntry('SALE_HOLD', `Sale with ${cart.length} items put on hold.`);
    };

    const resumeSale = (index: number) => {
        const saleToResume = heldCarts[index];
        setCart(saleToResume.cart);
        setAttachedCustomer(saleToResume.customer);
        setHeldCarts(prev => prev.filter((_, i) => i !== index));
        setIsHeldCartsModalOpen(false);
    };

    const clearSale = () => {
        setCart([]);
        setAttachedCustomer(null);
    };

    return (
        <div className="flex gap-6">
            {/* Register */}
            <div className="w-1/3 flex flex-col">
                <Panel className="flex flex-col overflow-hidden">
                     <div className="p-4 border-b border-dc-border">
                        <h2 className="text-xl font-bold">Register</h2>
                        {attachedCustomer && <p className="text-sm text-dc-purple font-semibold">{attachedCustomer.name}</p>}
                    </div>
                    <div className="p-4 space-y-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <input type="number" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))} className="w-16 bg-dc-input border border-dc-border rounded px-2 py-1 text-center" />
                                <div className="flex-1 text-sm">
                                    <p className="font-semibold text-dc-text-primary">{item.name}</p>
                                    <p className="text-dc-text-secondary">${item.price.toFixed(2)}</p>
                                </div>
                                <p className="font-bold text-dc-text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        {cart.length === 0 && <p className="text-center text-dc-text-secondary italic pt-8">Cart is empty</p>}
                    </div>
                    {cart.length > 0 && (
                        <div className="p-4 border-t border-dc-border space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-dc-text-secondary">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-dc-text-secondary">Tax</span><span>${tax.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-xl border-t border-dc-border pt-1 mt-1">
                                <span className="text-dc-text-primary">Total</span>
                                <span className="text-dc-purple">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                    <div className="p-4 border-t border-dc-border grid grid-cols-2 gap-2">
                        <button onClick={() => setIsCustomerModalOpen(true)} className="flex items-center justify-center space-x-2 p-2 bg-dc-hover rounded-lg font-semibold"><Icon name="customers" className="w-5 h-5"/><span>Customer</span></button>
                        <button onClick={() => setIsCustomItemModalOpen(true)} className="flex items-center justify-center space-x-2 p-2 bg-dc-hover rounded-lg font-semibold"><Icon name="plus" className="w-5 h-5"/><span>Custom Item</span></button>
                        <button onClick={holdSale} className="flex items-center justify-center space-x-2 p-2 bg-dc-hover rounded-lg font-semibold"><Icon name="clock" className="w-5 h-5"/><span>Hold Sale</span></button>
                        <button onClick={() => setIsHeldCartsModalOpen(true)} className="flex items-center justify-center space-x-2 p-2 bg-dc-hover rounded-lg font-semibold">
                            <Icon name="inventory" className="w-5 h-5"/><span>Held Sales ({heldCarts.length})</span>
                        </button>
                    </div>
                    <div className="p-4">
                        <button onClick={() => setIsCheckoutModalOpen(true)} disabled={cart.length === 0} className="w-full bg-dc-purple py-4 rounded-lg font-bold text-xl hover:bg-dc-purple/80 transition disabled:bg-dc-hover">
                            Checkout
                        </button>
                    </div>
                </Panel>
            </div>

            {/* Products */}
            <div className="w-2/3 flex flex-col">
                <Panel className="flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-dc-border">
                         <input type="text" placeholder="Search inventory..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-dc-input border border-dc-border rounded-lg px-4 py-2" />
                    </div>
                    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredInventory.map(item => (
                            <Panel key={item.id} onClick={() => addToCart({id: item.id, name: item.part_name, price: item.cost})} className="p-3 text-center cursor-pointer hover:border-dc-purple transition">
                                <p className="font-bold text-sm truncate">{item.part_name}</p>
                                <p className="text-xs text-dc-text-secondary">{item.sku}</p>
                                <p className="text-lg font-bold text-green-400 mt-2">${item.cost.toFixed(2)}</p>
                            </Panel>
                        ))}
                    </div>
                </Panel>
            </div>
            
            {isCustomerModalOpen && <CustomerSelectModal customers={customers} onClose={() => setIsCustomerModalOpen(false)} onSelect={c => { setAttachedCustomer(c); setIsCustomerModalOpen(false); }} />}
            {isCustomItemModalOpen && <CustomItemModal onClose={() => setIsCustomItemModalOpen(false)} onSave={(name, price) => addToCart({id: `custom-${Date.now()}`, name, price})} />}
            {isHeldCartsModalOpen && <HeldCartsModal heldCarts={heldCarts} onClose={() => setIsHeldCartsModalOpen(false)} onResume={resumeSale} />}
            {isCheckoutModalOpen && <CheckoutModal cart={cart} total={total} addLogEntry={addLogEntry} onClose={() => { setIsCheckoutModalOpen(false); clearSale(); }} />}
        </div>
    );
};

export default PointOfSaleView;