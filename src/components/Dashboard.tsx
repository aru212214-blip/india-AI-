import React from 'react';
import { Device, DeviceAction } from '../types';
import { DeviceCard } from './DeviceCard';

interface DashboardProps {
  devices: Device[];
  dispatch: (action: DeviceAction) => void;
}

export function Dashboard({ devices, dispatch }: DashboardProps) {
  
  const activeCount = devices.filter(d => d.isOn).length;
  
  return (
    <div className="min-h-screen bg-[#080808] text-[#e5e5e5]">
      
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-[#262626] sticky top-0 z-10 px-8 h-[70px] flex items-center justify-between">
        <div className="text-[#c5a47e] font-serif text-2xl tracking-[4px] uppercase">
          Sara
        </div>
        
        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-8 text-[12px] uppercase tracking-[1px] text-[#888]">
           <span>System: Optimal</span>
           <span>Temp: 22&deg;C</span>
           <span>Secured: 100%</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-8 py-10">
         <div className="mb-8 flex justify-between items-end border-b border-[#262626] pb-6">
           <div>
             <h2 className="text-2xl font-serif font-normal text-[#f3f4f6]">Smart Environments</h2>
           </div>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
           {devices.map(device => (
             <DeviceCard key={device.id} device={device} dispatch={dispatch} />
           ))}
         </div>
      </main>

    </div>
  );
}
