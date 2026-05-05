import React from 'react';
import { Lightbulb, Thermometer, Lock, Camera, Fan } from 'lucide-react';
import { Device, DeviceAction } from '../types';

export const DeviceCard: React.FC<{ device: Device, dispatch: (action: DeviceAction) => void }> = ({ device, dispatch }) => {
  
  const getIcon = () => {
    switch (device.type) {
      case 'light': return <Lightbulb strokeWidth={1.5} className={`w-4 h-4 ${device.isOn ? 'text-[#c5a47e]' : 'text-[#666]'}`} />;
      case 'thermostat': return <Thermometer strokeWidth={1.5} className="w-4 h-4 text-[#666]" />;
      case 'lock': return <Lock strokeWidth={1.5} className={`w-4 h-4 ${device.isLocked ? 'text-[#666]' : 'text-[#c5a47e]'}`} />;
      case 'camera': return <Camera strokeWidth={1.5} className={`w-4 h-4 ${device.isOn ? 'text-[#c5a47e]' : 'text-[#666]'}`} />;
      case 'fan': return <Fan strokeWidth={1.5} className={`w-4 h-4 ${device.isOn ? 'text-[#c5a47e] animate-spin-slow' : 'text-[#666]'}`} />;
    }
  };

  return (
    <div className={`p-6 rounded-sm border transition-all duration-300 relative ${
      device.isOn 
        ? 'bg-[#0e0e0e] border-[#c5a47e]/30' 
        : 'bg-[#0e0e0e] border-[#1a1a1a]'
    }`}>
      
      {/* Top right toggle / power button */}
      {device.type !== 'lock' && (
        <button 
          onClick={() => dispatch({ type: 'TOGGLE', deviceId: device.id })}
          className={`absolute top-6 right-6 w-10 h-5 rounded-full border transition-colors ${
            device.isOn ? 'bg-[#1a1a1a] border-[#333]' : 'bg-[#111] border-[#222]'
          }`}
        >
          <div className={`absolute top-[3px] w-3 h-3 rounded-full transition-all ${
            device.isOn ? 'right-[3px] bg-[#c5a47e]' : 'left-[3px] bg-[#444]'
          }`} />
        </button>
      )}

      <div className="text-[10px] uppercase tracking-[2px] text-[#666] mb-2 flex items-center gap-2 font-sans">
        {getIcon()} {device.type}
      </div>

      <h3 className="text-[20px] font-serif text-[#f3f4f6] mb-4">{device.name}</h3>

      <div className="flex items-center gap-2 text-[12px] uppercase text-[#888] mb-6 font-sans">
        <div className={`w-1.5 h-1.5 rounded-full ${device.isOn ? 'bg-[#c5a47e] shadow-[0_0_10px_#c5a47e]' : 'bg-[#444]'}`} />
        {device.isOn ? 'ON' : 'STANDBY'}
        {device.type === 'light' && device.isOn && ` — ${device.brightness}%`}
        {device.type === 'thermostat' && ` — ${device.temperature}°`}
        {device.type === 'lock' && (device.isLocked ? ' — LOCKED' : ' — UNLOCKED')}
      </div>

      {/* Specific Controls */}
      <div className="pt-4 border-t border-[#1a1a1a] font-sans">
        
        {device.type === 'light' && (
          <div className="flex items-center gap-4">
             <input 
               type="range" 
               min="0" max="100" 
               value={device.brightness || 0}
               onChange={(e) => dispatch({ type: 'SET_BRIGHTNESS', deviceId: device.id, value: parseInt(e.target.value) })}
               className="flex-1 h-1 bg-[#1a1a1a] appearance-none cursor-pointer accent-[#c5a47e]"
               disabled={!device.isOn}
             />
          </div>
        )}

        {device.type === 'thermostat' && (
          <div className="flex flex-col gap-4">
            <div className="flex bg-[#111] border border-[#1a1a1a] rounded-sm p-1">
              {['cool', 'auto', 'heat'].map(mode => (
                 <button 
                   key={mode}
                   onClick={() => dispatch({ type: 'SET_MODE', deviceId: device.id, value: mode as any })}
                   className={`flex-1 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                     device.mode === mode ? 'bg-[#1a1a1a] text-[#c5a47e]' : 'text-[#666] hover:text-[#888]'
                   }`}
                 >
                   {mode}
                 </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => dispatch({ type: 'SET_TEMPERATURE', deviceId: device.id, value: (device.temperature || 72) - 1 })}
                className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#c5a47e] bg-[#111] border border-[#1a1a1a]"
              >-</button>
              <span className="text-xl font-serif text-[#f3f4f6]">{device.temperature}&deg;</span>
              <button 
                onClick={() => dispatch({ type: 'SET_TEMPERATURE', deviceId: device.id, value: (device.temperature || 72) + 1 })}
                className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#c5a47e] bg-[#111] border border-[#1a1a1a]"
              >+</button>
            </div>
          </div>
        )}

        {device.type === 'lock' && (
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_LOCK', deviceId: device.id })}
            className={`w-full py-2 border text-[11px] uppercase tracking-wider transition-colors ${
              device.isLocked ? 'border-[#262626] text-[#888] hover:bg-[#111]' : 'border-[#c5a47e]/50 text-[#c5a47e] hover:bg-[#c5a47e]/10'
            }`}
          >
            {device.isLocked ? 'Unlock Door' : 'Lock Door'}
          </button>
        )}

        {device.type === 'fan' && (
          <div className="flex gap-1 items-center bg-[#111] border border-[#1a1a1a] p-1">
             {[1, 2, 3, 4, 5].map(speed => (
               <button
                 key={speed}
                 onClick={() => dispatch({ type: 'SET_SPEED', deviceId: device.id, value: speed })}
                 className={`flex-1 py-1 flex items-center justify-center text-[11px] transition-colors ${
                   device.speed === speed ? 'bg-[#1a1a1a] text-[#c5a47e]' : 'text-[#666] hover:text-[#888]'
                 }`}
                 disabled={!device.isOn}
               >
                 {speed}
               </button>
             ))}
          </div>
        )}

        {device.type === 'camera' && (
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#666]">
            {device.isOn ? 'Live Feed Available' : 'Offline'}
          </div>
        )}

      </div>
    </div>
  );
}
