import React from 'react';
import Panel from './GlassPanel.tsx';
import Icon from './Icon.tsx';

interface Report {
    probableCauses: string[];
    recommendedSteps: string[];
    requiredParts: { part: string, quantity: number, price?: number }[];
}

interface AiDiagnosticReportModalProps {
  report: Report;
  onClose: () => void;
  onAddParts: (parts: { part: string, quantity: number, price?: number }[]) => void;
}

const AiDiagnosticReportModal: React.FC<AiDiagnosticReportModalProps> = ({ report, onClose, onAddParts }) => {
  
  const handleCopy = () => {
    const reportText = `
    Probable Causes:
    ${report.probableCauses.join('\n- ')}

    Recommended Steps:
    ${report.recommendedSteps.join('\n- ')}

    Required Parts:
    ${report.requiredParts.map(p => `- ${p.part} (Qty: ${p.quantity})`).join('\n')}
    `;
    navigator.clipboard.writeText(reportText.trim());
    // Optionally show a "Copied!" message
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <div className="flex items-center space-x-3">
            <Icon name="ai" className="w-6 h-6 text-dc-purple" />
            <h2 className="text-2xl font-bold text-dc-text-primary">AI Diagnostic Report</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-dc-text-primary mb-2">Probable Causes</h3>
            <ul className="list-disc list-inside space-y-1 text-dc-text-secondary">
              {report.probableCauses.map((cause, index) => <li key={index}>{cause}</li>)}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-dc-text-primary mb-2">Recommended Steps</h3>
            <ol className="list-decimal list-inside space-y-1 text-dc-text-secondary">
              {report.recommendedSteps.map((step, index) => <li key={index}>{step}</li>)}
            </ol>
          </div>

          {report.requiredParts && report.requiredParts.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-dc-text-primary mb-2">Potentially Required Parts</h3>
              <div className="bg-dc-input p-3 rounded-lg border border-dc-border">
                {report.requiredParts.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                        <span className="text-dc-text-primary">{item.part}</span>
                        <span className="text-dc-text-secondary">Qty: {item.quantity}</span>
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <footer className="p-6 flex justify-between items-center border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
          <button onClick={handleCopy} className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-dc-border font-semibold hover:bg-dc-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <span>Copy Report</span>
          </button>
          {report.requiredParts && report.requiredParts.length > 0 && (
            <button onClick={() => onAddParts(report.requiredParts)} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">
              Add Parts to Estimate
            </button>
          )}
        </footer>
      </Panel>
    </div>
  );
};

export default AiDiagnosticReportModal;
