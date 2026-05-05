export type DeviceType = 'light' | 'thermostat' | 'lock' | 'camera' | 'fan';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  isOn: boolean;
  
  // Specific properties based on device type
  brightness?: number; // 0-100 for lights
  color?: string; // hex color for lights
  temperature?: number; // for thermostat
  mode?: 'heat' | 'cool' | 'auto'; // for thermostat
  isLocked?: boolean; // for lock
  speed?: number; // 0-100 for fan
}

export type DeviceAction = 
  | { type: 'TOGGLE'; deviceId: string }
  | { type: 'SET_BRIGHTNESS'; deviceId: string; value: number }
  | { type: 'SET_COLOR'; deviceId: string; value: string }
  | { type: 'SET_TEMPERATURE'; deviceId: string; value: number }
  | { type: 'SET_MODE'; deviceId: string; value: 'heat' | 'cool' | 'auto' }
  | { type: 'TOGGLE_LOCK'; deviceId: string }
  | { type: 'SET_SPEED'; deviceId: string; value: number };
