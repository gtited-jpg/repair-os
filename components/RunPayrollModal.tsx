import React, { useState } from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface RunPayrollModalProps {
  onClose: () => void;
}

const RunPayrollModal: React.FC<RunPayrollModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunPayroll = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">Run Payroll</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        
        {step === 1 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-dc-text-primary">Confirm Payroll for Pay Period</h3>
            <p className="text-dc-text-secondary mb-4">You are about to run payroll for the period of <strong>07/01/2024 - 07/15/2024</strong>. Please confirm all time logs are accurate before proceeding.</p>
            
            <div className="bg-dc-input p-4 rounded-lg border border-dc-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-dc-text-secondary">Total Employees:</span> <span className="font-semibold text-dc-text-primary">4</span></div>
                <div className="flex justify-between"><span className="text-dc-text-secondary">Total Hours:</span> <span className="font-semibold text-dc-text-primary">320.5</span></div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-dc-border"><span className="text-dc-text-primary">Estimated Gross Pay:</span> <span className="text-dc-purple">$8,450.00</span></div>
            </div>

            <footer className="mt-6 flex justify-end space-x-4">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
              <button onClick={handleRunPayroll} disabled={isProcessing} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80 disabled:bg-dc-hover">
                {isProcessing ? 'Processing...' : 'Confirm & Run Payroll'}
              </button>
            </footer>
          </div>
        )}

        {step === 2 && (
             <div className="p-8 text-center">
                <Icon name="checkCircle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dc-text-primary">Payroll Submitted</h3>
                <p className="text-dc-text-secondary mt-2">Payroll has been successfully processed. Paystubs are now available to employees.</p>
                <button onClick={onClose} className="mt-6 w-full bg-dc-hover py-2.5 rounded-lg font-semibold hover:bg-dc-input transition">
                    Close
                </button>
            </div>
        )}

      </Panel>
    </div>
  );
};

export default RunPayrollModal;