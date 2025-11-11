import React from 'react';

// Extended PanelProps with React.HTMLAttributes<HTMLDivElement> to allow
// standard div props like 'draggable' and 'onDragStart', which were causing
// type errors in TicketCard.tsx.
interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const GlassPanel: React.FC<PanelProps> = ({ children, className = '', ...rest }) => {
  return (
    <div
      {...rest}
      className={`bg-dc-panel/60 backdrop-blur-xl border border-dc-border rounded-2xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassPanel;