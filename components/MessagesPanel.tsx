
import React from 'react';
// FIX: Removed .tsx extension from component imports
import Panel from './GlassPanel';
import Icon from './Icon';

interface MessagesPanelProps {
    onClose: () => void;
}

const MessagesPanel: React.FC<MessagesPanelProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose}>
            <Panel 
                onClick={(e) => e.stopPropagation()}
                className="fixed top-0 right-0 h-full w-96 bg-dc-panel z-40 flex flex-col transform transition-transform duration-300 ease-in-out"
            >
                <header className="flex items-center justify-between p-4 border-b border-dc-border h-20 shrink-0">
                    <h2 className="text-xl font-bold text-dc-text-primary">Notifications</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-dc-hover">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {/* Placeholder Messages */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-dc-hover">
                         <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0"><Icon name="tickets" className="w-5 h-5 text-blue-300"/></div>
                        <div>
                            <p className="text-sm text-dc-text-primary">New ticket <span className="font-bold text-dc-purple">#T-102</span> assigned to you.</p>
                            <p className="text-xs text-dc-text-secondary">5 minutes ago</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0"><Icon name="checkCircle" className="w-5 h-5 text-green-300"/></div>
                        <div>
                            <p className="text-sm text-dc-text-primary">Ticket <span className="font-bold text-dc-purple">#T-104</span> marked as Completed.</p>
                            <p className="text-xs text-dc-text-secondary">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg">
                        {/* Replaced non-existent 'package' icon with 'box' icon. */}
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0"><Icon name="box" className="w-5 h-5 text-yellow-300"/></div>
                        <div>
                            <p className="text-sm text-dc-text-primary">Parts for ticket <span className="font-bold text-dc-purple">#T-103</span> have been ordered.</p>
                            <p className="text-xs text-dc-text-secondary">1 day ago</p>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default MessagesPanel;