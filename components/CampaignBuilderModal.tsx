import React, { useState } from 'react';
import { Promotion } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface CampaignBuilderModalProps {
  onClose: () => void;
  onLaunch: (campaignData: Omit<Promotion, 'id' | 'clicks' | 'conversions' | 'status'>) => void;
}

const CampaignBuilderModal: React.FC<CampaignBuilderModalProps> = ({ onClose, onLaunch }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'number' ? parseFloat(value) : value
      }));
  };
  
  const handleLaunch = () => {
    if (!formData.name || !formData.description || !formData.endDate || formData.value <= 0) {
        alert("Please fill out all fields and provide a value greater than 0.");
        return;
    }
    onLaunch(formData);
  }

  const StepIndicator: React.FC<{ current: number, stepNum: number, label: string }> = ({ current, stepNum, label }) => {
      const isActive = current === stepNum;
      const isCompleted = current > stepNum;
      
      return (
          <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${isCompleted ? 'bg-dc-purple border-dc-purple text-white' : isActive ? 'border-dc-purple text-dc-purple' : 'border-dc-border text-dc-text-secondary'}`}>
                  {isCompleted ? <Icon name="checkCircle" className="w-5 h-5"/> : stepNum}
              </div>
              <span className={`ml-2 font-semibold ${isActive || isCompleted ? 'text-dc-text-primary' : 'text-dc-text-secondary'}`}>{label}</span>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <Panel className="w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <header className="p-6 flex justify-between items-center border-b border-dc-border">
                <h2 className="text-2xl font-bold text-dc-text-primary">New Campaign Builder</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
                    <Icon name="close" className="w-6 h-6" />
                </button>
            </header>
            
            <div className="p-6 border-b border-dc-border flex justify-between items-center">
                <StepIndicator current={step} stepNum={1} label="Details" />
                <div className={`flex-1 mx-4 h-0.5 ${step > 1 ? 'bg-dc-purple' : 'bg-dc-border'}`}></div>
                <StepIndicator current={step} stepNum={2} label="Schedule" />
                <div className={`flex-1 mx-4 h-0.5 ${step > 2 ? 'bg-dc-purple' : 'bg-dc-border'}`}></div>
                <StepIndicator current={step} stepNum={3} label="Review" />
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Campaign Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Summer Screen Sale" required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dc-text-secondary mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="A short description for your campaign." required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5"></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Discount Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount ($)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Value</label>
                                <input type="number" name="value" value={formData.value} onChange={handleChange} min="0" step="0.01" required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                            </div>
                        </div>
                    </div>
                )}
                 {step === 2 && (
                     <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                            </div>
                        </div>
                     </div>
                 )}
                 {step === 3 && (
                     <div className="space-y-4">
                        <h3 className="text-lg font-bold text-dc-text-primary">Review Your Campaign</h3>
                        <div className="bg-dc-input p-4 rounded-lg border border-dc-border space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-dc-text-secondary">Name:</span> <span className="font-semibold text-dc-text-primary">{formData.name}</span></div>
                            <div className="flex justify-between"><span className="text-dc-text-secondary">Description:</span> <span className="font-semibold text-dc-text-primary text-right">{formData.description}</span></div>
                            <div className="flex justify-between"><span className="text-dc-text-secondary">Discount:</span> <span className="font-semibold text-dc-purple">{formData.type === 'percentage' ? `${formData.value}%` : `$${formData.value.toFixed(2)}`}</span></div>
                            <div className="flex justify-between"><span className="text-dc-text-secondary">Duration:</span> <span className="font-semibold text-dc-text-primary">{formData.startDate} to {formData.endDate}</span></div>
                        </div>
                         <p className="text-xs text-dc-text-secondary">Once launched, the campaign will become active based on the scheduled dates. You can monitor its performance on the Promotions page.</p>
                     </div>
                 )}
            </div>

            <footer className="p-6 flex justify-between items-center border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
                <button onClick={onClose} className="px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">Cancel</button>
                <div className="flex items-center space-x-4">
                {step > 1 && (
                        <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 rounded-lg font-semibold hover:bg-dc-hover">Back</button>
                )}
                {step < 3 ? (
                        <button onClick={() => setStep(s => s + 1)} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Next</button>
                ) : (
                        <button onClick={handleLaunch} className="px-4 py-2 rounded-lg bg-green-500 font-semibold hover:bg-green-500/80 flex items-center space-x-2">
                            <Icon name="promotions" className="w-5 h-5"/>
                            <span>Launch Campaign</span>
                        </button>
                )}
                </div>
            </footer>
        </Panel>
    </div>
  );
};
export default CampaignBuilderModal;