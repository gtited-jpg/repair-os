import React, { useState } from 'react';
import { Employee, Organization } from '../types';
import * as api from '../api';
import Icon from './Icon';
import AddEmployeeModal from './AddEmployeeModal';

interface OrganizationSettingsProps {
    organization: Organization;
    employees: Employee[];
    onUpdate: (org: Organization) => void;
    currentUser: Employee;
}

const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ organization, employees, onUpdate, currentUser }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [orgName, setOrgName] = useState(organization.name);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [inviteMessage, setInviteMessage] = useState<string | null>(null);

    const handleNameSave = async () => {
        if (orgName.trim() === organization.name || orgName.trim() === '') return;
        try {
            const updatedOrg = await api.updateOrganization(organization.id, { name: orgName });
            if (updatedOrg) {
                onUpdate(updatedOrg);
            }
            setIsEditingName(false);
        } catch (error) {
            console.error("Failed to update organization name:", error);
            // Optionally show an error to the user
        }
    };
    
    const handleAddEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'image_url' | 'status' | 'uuid' | 'hire_date'>) => {
        try {
            const newEmployee = await api.createEmployee({
                ...employeeData,
                organization_id: currentUser.organization_id
            } as Omit<Employee, 'id' | 'created_at'>);
            if (newEmployee) {
                // In a real app, we'd refetch employees. For now, we just show a success message.
                setInviteMessage(`Invitation sent to ${newEmployee.email}. They will receive an email to set up their account.`);
                setTimeout(() => setInviteMessage(null), 5000);
            }
            setIsAddModalOpen(false);
        } catch (error: any) {
            console.error("Failed to add employee:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
             {inviteMessage && (
                <div className="bg-green-500/20 text-green-300 text-sm font-semibold p-3 rounded-lg border border-green-500/30">
                    {inviteMessage}
                </div>
            )}
            <div>
                <h3 className="font-bold text-dc-text-primary mb-2">Organization Name</h3>
                {isEditingName ? (
                    <div className="flex items-center space-x-2">
                        <input 
                            type="text" 
                            value={orgName} 
                            onChange={(e) => setOrgName(e.target.value)} 
                            className="flex-1 bg-dc-input border border-dc-border rounded-lg px-3 py-2"
                        />
                        <button onClick={handleNameSave} className="px-3 py-2 bg-dc-purple rounded-lg font-semibold">Save</button>
                        <button onClick={() => { setIsEditingName(false); setOrgName(organization.name); }} className="px-3 py-2 bg-dc-hover rounded-lg font-semibold">Cancel</button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <p className="text-xl text-dc-text-secondary">{organization.name}</p>
                        <button onClick={() => setIsEditingName(true)} className="p-1.5 rounded-full hover:bg-dc-hover">
                            <Icon name="pencil" className="w-4 h-4 text-dc-text-secondary"/>
                        </button>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-dc-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-dc-text-primary">Members ({employees.length})</h3>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 bg-dc-purple px-3 py-1.5 rounded-lg font-semibold text-sm">
                        <Icon name="plus" className="w-4 h-4"/>
                        <span>Invite Member</span>
                    </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {employees.map(emp => (
                        <div key={emp.id} className="flex items-center justify-between p-3 bg-dc-input rounded-lg border border-dc-border">
                            <div className="flex items-center space-x-3">
                                <img src={emp.image_url || `https://i.pravatar.cc/150?u=${emp.id}`} alt={emp.name} className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="font-semibold text-dc-text-primary">{emp.name}</p>
                                    <p className="text-xs text-dc-text-secondary">{emp.email}</p>
                                </div>
                            </div>
                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                 emp.role === 'Admin' ? 'bg-dc-purple/30 text-dc-purple' :
                                 emp.role === 'Manager' ? 'bg-blue-500/20 text-blue-300' :
                                 'bg-gray-500/20 text-gray-300'
                             }`}>
                                {emp.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
             {isAddModalOpen && (
                <AddEmployeeModal 
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddEmployee}
                />
            )}
        </div>
    );
};

export default OrganizationSettings;
