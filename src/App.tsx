/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDevices } from './hooks/useDevices';
import { Dashboard } from './components/Dashboard';
import { ChatAgent } from './components/ChatAgent';

export default function App() {
  const { devices, dispatch } = useDevices();

  return (
    <div className="font-sans bg-[#050505] text-[#e5e5e5] min-h-screen">
      <Dashboard devices={devices} dispatch={dispatch} />
      <ChatAgent devices={devices} dispatch={dispatch} />
    </div>
  );
}

