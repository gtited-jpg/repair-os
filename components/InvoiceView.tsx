
import React from 'react';
import Panel from './GlassPanel';

const InvoiceView: React.FC = () => {
  return (
    <Panel className="p-6">
      <h2 className="text-xl font-bold text-dc-text-primary mb-4">Invoice Details</h2>
      <p className="text-dc-text-secondary">This is a placeholder for an invoice.</p>
    </Panel>
  );
};

export default InvoiceView;
