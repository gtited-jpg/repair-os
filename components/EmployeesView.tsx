import React, { useState, useEffect, useMemo } from 'react';
import type { Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';
import EmployeeDetailModal from './EmployeeDetailModal';
import AddEmployeeModal from './AddEmployeeModal';
import TerminationModal from './TerminationModal';

interface EmployeesViewProps {
  currentUser: Employee;
}

const EmployeesView: React.FC<EmployeesViewProps> = ({ currentUser }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToTerminate, setEmployeeToTerminate] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'image_url' | 'status' | 'uuid' | 'hire_date'>) => {
    try {
        const newEmployee = await api.createEmployee({
          ...employeeData,
          organization_id: currentUser.organization_id
        } as Omit<Employee, 'id' | 'created_at'>);
        if (newEmployee) {
            fetchEmployees();
            setIsAddModalOpen(false);
        }
    } catch (error) {
        console.error("Failed to add employee:", error);
        alert(`Error: ${error.message}`);
    }
  };

  const handleUpdateEmployee = async (employeeData: Employee) => {
      try {
          const updated = await api.updateEmployee(employeeData.id, employeeData);
          if (updated) {
              fetchEmployees();
              setSelectedEmployee(updated);
          }
      } catch (error) {
          console.error("Failed to update employee:", error);
      }
  };

  const handleConfirmTermination = async (employee: Employee, reasonType: string, reasonDetails: string) => {
    const updatedEmployee = {
        ...employee,
        status: 'Terminated' as 'Terminated',
        terminationDate: new Date().toISOString().slice(0,10),
        terminationReason: `${reasonType}: ${reasonDetails}`
    };
    await handleUpdateEmployee(updatedEmployee);
    setEmployeeToTerminate(null);
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter(e =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);


  if (isLoading) {
    return <div className="text-center">Loading employees from Supabase...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employees</h1>
         <div className="flex items-center space-x-4">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dc-text-secondary" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-dc-input border border-dc-border rounded-lg pl-10 pr-4 py-2.5 w-72 focus:outline-none focus:ring-2 focus:ring-dc-purple transition"
              />
            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-dc-purple px-4 py-2.5 rounded-lg font-semibold flex items-center space-x-2 hover:bg-dc-purple/80 transition">
                <Icon name="plus" className="w-5 h-5"/>
                <span>New Employee</span>
            </button>
        </div>
      </div>
      <Panel className="overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-dc-panel/80">
                <tr className="border-b border-dc-border">
                    <th className="p-4 font-semibold text-dc-text-secondary">Name</th>
                    <th className="p-4 font-semibold text-dc-text-secondary">Role</th>
                    <th className="p-4 font-semibold text-dc-text-secondary">Email</th>
                    <th className="p-4 font-semibold text-dc-text-secondary">Phone</th>
                    <th className="p-4 font-semibold text-dc-text-secondary">Status</th>
                </tr>
            </thead>
            <tbody>
                {filteredEmployees.map(employee => (
                    <tr key={employee.id} onClick={() => setSelectedEmployee(employee)} className="border-b border-dc-border last:border-b-0 hover:bg-dc-hover cursor-pointer">
                        <td className="p-4 flex items-center space-x-3">
                            <img src={employee.image_url || `https://i.pravatar.cc/150?u=${employee.id}`} alt={employee.name} className="w-8 h-8 rounded-full"/>
                            <span className="font-semibold text-dc-text-primary">{employee.name}</span>
                        </td>
                        <td className="p-4 text-dc-text-secondary font-semibold">{employee.role}</td>
                        <td className="p-4 text-dc-text-secondary">{employee.email}</td>
                        <td className="p-4 text-dc-text-secondary">{employee.phone}</td>
                        <td className="p-4">
                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${employee.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {employee.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </Panel>
      
      {isAddModalOpen && (
        <AddEmployeeModal 
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddEmployee}
        />
      )}

      {selectedEmployee && (
        <EmployeeDetailModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
          onUpdate={handleUpdateEmployee}
          onTerminate={(emp) => {
            setSelectedEmployee(null);
            setEmployeeToTerminate(emp);
          }}
        />
      )}

      {employeeToTerminate && (
        <TerminationModal
            employee={employeeToTerminate}
            onClose={() => setEmployeeToTerminate(null)}
            onConfirm={handleConfirmTermination}
        />
      )}
    </div>
  );
};

export default EmployeesView;