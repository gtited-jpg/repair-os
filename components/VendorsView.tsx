import React, { useState, useEffect, useMemo } from 'react';
import type { Vendor, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import VendorDetailModal from './VendorDetailModal';
import AddVendorModal from './AddVendorModal';

interface VendorsViewProps {
    currentUser: Employee;
}

const VendorsView: React.FC<VendorsViewProps> = ({ currentUser }) => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchVendors = async () => {
        setIsLoading(true);
        try {
            const data = await api.getVendors();
            setVendors(data);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleAddVendor = async (vendorData: Omit<Vendor, 'id'>) => {
        try {
            const newVendor = await api.createVendor({
                ...vendorData,
                organization_id: currentUser.organization_id,
            });
            if (newVendor) {
                fetchVendors();
                setIsAddModalOpen(false);
            }
        } catch (e) { console.error(e) }
    };

    const handleUpdateVendor = async (vendorData: Vendor) => {
        try {
            const updated = await api.updateVendor(vendorData.id, vendorData);
            if (updated) {
                fetchVendors();
                setSelectedVendor(null);
            }
        } catch (e) { console.error(e) }
    };
    
    const handleDeleteVendor = async (vendor: Vendor) => {
        if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
            try {
                await api.deleteVendor(vendor.id);
                fetchVendors();
                setSelectedVendor(null);
            } catch (e) { console.error(e) }
        }
    };
    
    const filteredVendors = useMemo(() => {
        if (!searchTerm) return vendors;
        return vendors.filter(v => 
            v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vendors, searchTerm]);

    if (isLoading) {
        return <div className="text-center">Loading vendors...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Vendors</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dc-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-dc-input border border-dc-border rounded-lg pl-10 pr-4 py-2.5 w-72 focus:outline-none focus:ring-2 focus:ring-dc-purple transition"
                        />
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-dc-purple px-4 py-2.5 rounded-lg font-semibold flex items-center space-x-2 hover:bg-dc-purple/80 transition">
                        <Icon name="plus" className="w-5 h-5"/>
                        <span>New Vendor</span>
                    </button>
                </div>
            </div>

            <Panel className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-dc-panel/80">
                        <tr className="border-b border-dc-border">
                            <th className="p-4 font-semibold text-dc-text-secondary">Name</th>
                            <th className="p-4 font-semibold text-dc-text-secondary">Category</th>
                            <th className="p-4 font-semibold text-dc-text-secondary">Contact Person</th>
                            <th className="p-4 font-semibold text-dc-text-secondary">Email</th>
                            <th className="p-4 font-semibold text-dc-text-secondary">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVendors.map(vendor => (
                            <tr key={vendor.id} onClick={() => setSelectedVendor(vendor)} className="border-b border-dc-border last:border-b-0 hover:bg-dc-hover cursor-pointer">
                                <td className="p-4 text-dc-text-primary font-semibold">{vendor.name}</td>
                                <td className="p-4 text-dc-text-secondary">{vendor.category}</td>
                                <td className="p-4 text-dc-text-primary">{vendor.contactPerson}</td>
                                <td className="p-4 text-dc-text-secondary">{vendor.email}</td>
                                <td className="p-4 text-dc-text-secondary">{vendor.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Panel>
            
            {isAddModalOpen && (
                <AddVendorModal 
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddVendor}
                />
            )}

            {selectedVendor && (
                <VendorDetailModal 
                    vendor={selectedVendor} 
                    onClose={() => setSelectedVendor(null)} 
                    onUpdate={handleUpdateVendor}
                    onDelete={handleDeleteVendor}
                />
            )}
        </div>
    );
};

export default VendorsView;