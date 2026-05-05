import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, Loader2, MessageSquare } from 'lucide-react';
import { ai, getDeviceStatusTool, controlDeviceTool, systemInstruction } from '../lib/gemini';
import { Device, DeviceAction } from '../types';
import { Content, Part } from '@google/genai';

interface ChatAgentProps {
  devices: Device[];
  dispatch: (action: DeviceAction) => void;
}

export function ChatAgent({ devices, dispatch }: ChatAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<Content[]>([
    { role: 'model', parts: [{ text: 'Hello dost! 🚀 Main tumhara Sara Agent hoon. How can I help you with your home today?' }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const handleFunctionCall = async (call: any): Promise<Part> => {
    const { name, args } = call;
    
    if (name === 'get_device_status') {
      return { 
        functionResponse: {
          name, 
          response: { devices } 
        }
      };
    }
    
    if (name === 'control_device') {
      const { deviceId, action, value } = args;
      const device = devices.find(d => d.id === deviceId);
      
      if (!device) {
        return { functionResponse: { name, response: { error: `Device ${deviceId} not found` } } };
      }

      switch (action) {
        case 'toggle':
          dispatch({ type: 'TOGGLE', deviceId });
          break;
        case 'set_brightness':
          dispatch({ type: 'SET_BRIGHTNESS', deviceId, value: parseInt(value, 10) });
          break;
        case 'set_temperature':
          dispatch({ type: 'SET_TEMPERATURE', deviceId, value: parseInt(value, 10) });
          break;
        case 'set_mode':
          dispatch({ type: 'SET_MODE', deviceId, value: value as 'heat' | 'cool' | 'auto' });
          break;
        case 'toggle_lock':
          dispatch({ type: 'TOGGLE_LOCK', deviceId });
          break;
        case 'set_speed':
          dispatch({ type: 'SET_SPEED', deviceId, value: parseInt(value, 10) });
          break;
        default:
          return { functionResponse: { name, response: { error: `Unknown action ${action}` } } };
      }
      return { functionResponse: { name, response: { success: true, message: `Executed ${action} on ${device.name}` } } };
    }
    
    return { functionResponse: { name, response: { error: 'Unknown function' } } };
  };

  const sendMessage = async () => {
    if (!input.trim() || !ai) return;

    const userMsg = input.trim();
    setInput('');
    
    const newUserContent: Content = { role: 'user', parts: [{ text: userMsg }] };
    let currentHistory = [...history, newUserContent];
    setHistory(currentHistory);
    setIsLoading(true);

    try {
      let done = false;
      
      while (!done) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: currentHistory,
          config: {
            systemInstruction: systemInstruction,
            tools: [{ functionDeclarations: [getDeviceStatusTool, controlDeviceTool] }],
            temperature: 0.7,
          }
        });

        // Add the model's response to history
        if (response.candidates?.[0]?.content) {
            currentHistory = [...currentHistory, response.candidates[0].content];
            setHistory(currentHistory);
        }

        if (response.functionCalls && response.functionCalls.length > 0) {
          const functionResponseParts: Part[] = [];
          for (const call of response.functionCalls) {
             const resultPart = await handleFunctionCall(call);
             functionResponseParts.push(resultPart);
          }
           // Add function responses as user
          currentHistory = [...currentHistory, { role: 'user', parts: functionResponseParts }];
          setHistory(currentHistory);
        } else {
          done = true;
        }
      }
    } catch (err) {
      console.error(err);
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: 'Oops, kuch error aagaya. Try again later dost.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to extract text from a Content object for display
  const renderContent = (content: Content, idx: number) => {
    const textParts = content.parts?.map(p => p.text).filter(Boolean).join('\\n');
    if (!textParts && content.parts?.some(p => p.functionCall)) {
         return null; // hide raw function calls from UI unless text is present
    }
    if (!textParts && content.role === 'user' && content.parts?.some(p => p.functionResponse)) {
        return null; // hide raw function responses from UI
    }

    if (!textParts) return null;

    return (
      <div key={idx} className={`flex w-full ${content.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
          content.role === 'user' 
            ? 'text-[#888] text-right' 
            : 'bg-[#c5a47e]/10 border-l-2 border-[#c5a47e] text-[#d1d5db]'
        }`}>
          {textParts}
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-[#c5a47e] hover:bg-[#b0906a] text-[#050505] rounded-none shadow-xl transition-all z-50 flex items-center justify-center"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] bg-[#0a0a0a] border border-[#262626] flex flex-col z-50 overflow-hidden shadow-2xl font-sans" style={{ height: '500px', maxHeight: '80vh' }}>
      {/* Header */}
      <div className="bg-[#050505] p-4 border-b border-[#262626] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-[#c5a47e]">
            <Bot strokeWidth={1.5} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-[#f3f4f6] flex items-center gap-2 text-lg">Assistant Agent <span className="w-1.5 h-1.5 rounded-full bg-[#c5a47e] shadow-[0_0_8px_#c5a47e] inline-block"></span></h3>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-[#666] hover:text-[#c5a47e] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {history.map((msg, idx) => renderContent(msg, idx))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 bg-[#c5a47e]/10 border-l-2 border-[#c5a47e] flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#c5a47e] animate-spin" />
              <span className="text-[#d1d5db] text-[13px]">Processing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#262626]">
        <div className="flex items-center bg-[#111]">
          <input
            type="text"
            className="flex-1 bg-transparent text-[#e5e5e5] placeholder-[#666] px-4 py-4 focus:outline-none text-[13px]"
            placeholder="Type instructions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="text-[#c5a47e] px-4 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition-colors h-full flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
