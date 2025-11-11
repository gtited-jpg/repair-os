import React, { useState, useEffect } from 'react';
import type { Employee } from '../types';
import * as api from '../api';
import Panel from './GlassPanel';
import Icon from './Icon';

interface MessagingViewProps {
  currentUser: Employee;
}

const MessagingView: React.FC<MessagingViewProps> = ({ currentUser }) => {
    const [channels, setChannels] = useState<{ id: string; name: string; unread: number }[]>([]);
    const [conversations, setConversations] = useState<any>({});
    const [activeChannel, setActiveChannel] = useState('general');

    useEffect(() => {
        const fetchData = async () => {
            const [ch, conv] = await Promise.all([api.getChannels(), api.getConversations()]);
            setChannels(ch);
            setConversations(conv);
        };
        fetchData();
    }, []);
    
    const activeConversation = conversations[activeChannel] || [];

    return (
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-dc-text-primary mb-6">Team Chat</h1>
          <Panel className="flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-dc-panel/50 border-r border-dc-border flex flex-col">
                <div className="p-4 border-b border-dc-border">
                    <h2 className="font-bold text-dc-text-primary">Channels</h2>
                </div>
                <nav className="flex-1 p-2 space-y-1">
                    {channels.map(channel => (
                        <button 
                            key={channel.id} 
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-md font-semibold flex justify-between items-center ${activeChannel === channel.id ? 'bg-dc-purple text-white' : 'text-dc-text-secondary hover:bg-dc-hover'}`}
                        >
                            <span># {channel.name}</span>
                            {channel.unread > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{channel.unread}</span>}
                        </button>
                    ))}
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="p-4 border-b border-dc-border">
                    <h3 className="font-bold text-xl text-dc-text-primary"># {activeChannel}</h3>
                </header>
                <div className="p-4 space-y-4">
                    {activeConversation.map((msg: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                            <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="flex items-baseline space-x-2">
                                    <span className="font-bold text-dc-text-primary">{msg.user}</span>
                                    <span className="text-xs text-dc-text-secondary">{msg.time}</span>
                                </div>
                                <p className="text-dc-text-primary">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-dc-border">
                    <div className="relative">
                        <input type="text" placeholder={`Message #${activeChannel}`} className="w-full bg-dc-input border border-dc-border rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
                         <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dc-purple hover:bg-dc-purple/80 transition">
                           <Icon name="send" className="w-5 h-5 text-white" />
                         </button>
                    </div>
                </div>
            </main>
          </Panel>
        </div>
    );
};

export default MessagingView;