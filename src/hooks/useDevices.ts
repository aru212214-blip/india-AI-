import { useState, useCallback } from 'react';
import { Device, DeviceAction } from '../types';
import { INITIAL_DEVICES } from '../data/devices';

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);

  const dispatch = useCallback((action: DeviceAction) => {
    setDevices((prev) => 
      prev.map((device) => {
        if (device.id !== action.deviceId) return device;

        switch (action.type) {
          case 'TOGGLE':
            return { ...device, isOn: !device.isOn };
          case 'SET_BRIGHTNESS':
            return { ...device, brightness: action.value };
          case 'SET_COLOR':
            return { ...device, color: action.value };
          case 'SET_TEMPERATURE':
            return { ...device, temperature: action.value };
          case 'SET_MODE':
            return { ...device, mode: action.value };
          case 'TOGGLE_LOCK':
            return { ...device, isLocked: !device.isLocked };
          case 'SET_SPEED':
            return { ...device, speed: action.value };
          default:
            return device;
        }
      })
    );
  }, []);

  return { devices, dispatch };
}
