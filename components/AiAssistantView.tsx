import React from 'react';
import AiChatPanel from './AiChatPanel';

const AiAssistantView: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dc-text-primary">AI Assistant</h1>
      </div>
      <div>
        <AiChatPanel isModal={false} />
      </div>
    </div>
  );
};

export default AiAssistantView;