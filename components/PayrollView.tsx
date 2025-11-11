import React, { useState, useEffect } from 'react';
import type { PayrollEntry, Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import RunPayrollModal from './RunPayrollModal';
import PaystubModal from './PaystubModal';

const PayrollRow: React.FC<{ entry: PayrollEntry; onClick: () => void }> = ({ entry, onClick }) => (
    <tr onClick={onClick} className="border-b border-dc-border last:border-b-0 hover:bg-dc-hover cursor-pointer">
        <td className="p-3 text-dc-text-primary">{entry.employee_name}</td>
        <td className="p-3 text-dc-text-secondary">{entry.pay_period}</td>
        <td className="p-3 text-right font-semibold text-dc-text-primary">${entry.pay_amount.toFixed(2)}</td>
        <td className="p-3 text-center">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.processed ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                {entry.processed ? 'Processed' : 'Pending'}
            </span>
        </td>
    </tr>
);


const PayrollView: React.FC = () => {
    const [payroll, setPayroll] = useState<PayrollEntry[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRunPayrollOpen, setIsRunPayrollOpen] = useState(false);
    const [selectedPaystub, setSelectedPaystub] = useState<PayrollEntry | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [payrollData, empData] = await Promise.all([api.getPayroll(), api.getEmployees()]);
            setPayroll(payrollData);
            setEmployees(empData);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const handleSelectEntry = (entry: PayrollEntry) => {
        // Create detailed mock data for the modal
        const grossPay = entry.pay_amount;
        const fica = grossPay * 0.0765;
        const federal = grossPay * 0.12;
        const state = grossPay * 0.04;
        const deductions = grossPay * 0.02; // e.g. 401k
        const netPay = grossPay - fica - federal - state - deductions;
        
        const detailedEntry: PayrollEntry = {
            ...entry,
            grossPay,
            netPay,
            payDate: new Date().toISOString().slice(0,10),
            earnings: [{name: 'Regular Pay', amount: grossPay}],
            deductions: [{name: '401k', amount: deductions}],
            taxes: [
                {name: 'FICA', amount: fica},
                {name: 'Federal', amount: federal},
                {name: 'State', amount: state},
            ]
        };
        setSelectedPaystub(detailedEntry);
    };


    if (isLoading) return <div className="text-center">Loading payroll...</div>;

    return (
        <div className="space-y-6 flex flex-col">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Payroll</h1>
                <button onClick={() => setIsRunPayrollOpen(true)} className="bg-dc-purple px-4 py-2 rounded-lg font-semibold">Run Payroll</button>
            </div>
            <Panel className="flex flex-col overflow-hidden">
                <div>
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-dc-panel/80 backdrop-blur-sm">
                            <tr className="border-b border-dc-border">
                                <th className="p-3 font-semibold text-dc-text-secondary">Employee</th>
                                <th className="p-3 font-semibold text-dc-text-secondary">Pay Period</th>
                                <th className="p-3 font-semibold text-dc-text-secondary text-right">Pay Amount</th>
                                <th className="p-3 font-semibold text-dc-text-secondary text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payroll.map(entry => <PayrollRow key={entry.id} entry={entry} onClick={() => handleSelectEntry(entry)} />)}
                        </tbody>
                    </table>
                </div>
            </Panel>
            
            {isRunPayrollOpen && (
                <RunPayrollModal onClose={() => setIsRunPayrollOpen(false)} />
            )}

            {selectedPaystub && (
                <PaystubModal 
                    paystub={selectedPaystub}
                    onClose={() => setSelectedPaystub(null)}
                />
            )}
        </div>
    );
};

export default PayrollView;