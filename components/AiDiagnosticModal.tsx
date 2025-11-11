import React, { useState, useEffect } from 'react';
// FIX: Updated to use the recommended `GoogleGenAI` class and `ai.models.generateContent` method.
import { GoogleGenAI, Type } from "@google/genai";
import { Ticket } from '../types';
import Panel from './GlassPanel';
import Icon from './Icon';

interface AiDiagnosticModalProps {
  ticket: Ticket;
  onClose: () => void;
  onComplete: (report: any) => void;
}

const AiDiagnosticModal: React.FC<AiDiagnosticModalProps> = ({ ticket, onClose, onComplete }) => {
  const [status, setStatus] = useState('Initializing diagnostics...');

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        setStatus('Analyzing issue description...');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // FIX: Changed ticket.device to ticket.vehicle to match the Ticket type definition.
        const prompt = `Diagnose the following issue for a ${ticket.vehicle}: "${ticket.issue}". 
        Provide a JSON response with three keys: 
        1. 'probableCauses': an array of strings describing likely root causes.
        2. 'recommendedSteps': an array of strings detailing diagnostic and repair steps.
        3. 'requiredParts': an array of objects, where each object has a 'part' (string) and 'quantity' (number).`;

        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('Querying knowledge base...');
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                probableCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                requiredParts: { 
                  type: Type.ARRAY, 
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      part: { type: Type.STRING },
                      quantity: { type: Type.INTEGER }
                    },
                    required: ['part', 'quantity']
                  } 
                }
              },
              required: ['probableCauses', 'recommendedSteps', 'requiredParts']
            }
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('Compiling report...');

        // The response.text is a string, which needs to be parsed into JSON
        const reportJson = JSON.parse(response.text);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        onComplete(reportJson);

      } catch (error) {
        console.error("AI Diagnostic Error:", error);
        // In a real app, show an error state
        onClose();
      }
    };

    runDiagnostics();
  }, [ticket, onComplete, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Panel className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-dc-purple rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-dc-purple/50 rounded-full animate-spin [animation-direction:reverse]"></div>
                <div className="w-full h-full flex items-center justify-center">
                    <Icon name="ai" className="w-10 h-10 text-dc-purple" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-dc-text-primary">Running AI Diagnostics</h2>
            <p className="text-dc-text-secondary mt-2 animate-pulse">{status}</p>
        </div>
      </Panel>
    </div>
  );
};

export default AiDiagnosticModal;