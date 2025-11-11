
// Updated to use new GoogleGenAI class and recommended generateContent method.
import { GoogleGenAI } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
// FIX: Removed .tsx extension from component imports
import Panel from './GlassPanel';
import Icon from './Icon';

interface AiChatPanelProps {
  isModal?: boolean;
  onClose?: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AiChatPanel: React.FC<AiChatPanelProps> = ({ isModal = false, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Updated to use new GoogleGenAI class with a named apiKey parameter as per SDK guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Updated to use the recommended ai.models.generateContent method for querying the model.
      // Used systemInstruction to provide context to the model instead of concatenating it with the user prompt.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: input,
        config: {
          systemInstruction: 'You are an AI assistant for a repair shop management software called DaemonCore. Be concise and helpful.',
        }
      });
      
      // The response object directly contains a .text property for the text output.
      const aiMessage: Message = { sender: 'ai', text: response.text };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const chatInterface = (
    <Panel className={`${isModal ? 'h-full' : ''} flex flex-col bg-dc-panel z-40`}>
      <header className="flex items-center justify-between p-4 border-b border-dc-border h-20 shrink-0">
        <div className="flex items-center space-x-3">
          <Icon name="ai" className="w-6 h-6 text-dc-purple" />
          <h2 className="text-xl font-bold text-dc-text-primary">AI Assistant</h2>
        </div>
        {isModal && (
          <button onClick={onClose} className="p-1 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        )}
      </header>
      <div className={`p-4 space-y-4 ${isModal ? 'flex-1 overflow-y-auto' : ''}`}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-dc-purple/20 flex items-center justify-center shrink-0"><Icon name="ai" className="w-5 h-5 text-dc-purple"/></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-dc-purple text-white' : 'bg-dc-hover'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-dc-purple/20 flex items-center justify-center shrink-0"><Icon name="ai" className="w-5 h-5 text-dc-purple"/></div>
                <div className="max-w-md p-3 rounded-lg bg-dc-hover">
                    <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-dc-text-secondary rounded-full animate-bounce delay-0"></span>
                        <span className="w-2 h-2 bg-dc-text-secondary rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-dc-text-secondary rounded-full animate-bounce delay-300"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-dc-border">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask the AI anything..."
            className="w-full bg-dc-input border border-dc-border rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-dc-purple"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dc-purple hover:bg-dc-purple/80 disabled:bg-gray-500 transition">
            <Icon name="send" className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </Panel>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed top-0 right-0 h-full w-96 transform transition-transform duration-300 ease-in-out"
        >
          {chatInterface}
        </div>
      </div>
    );
  }

  return chatInterface;
};

export default AiChatPanel;