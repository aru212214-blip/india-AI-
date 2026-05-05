import { Device } from '../types';

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'light-1',
    name: 'Living Room Light',
    type: 'light',
    room: 'Living Room',
    isOn: true,
    brightness: 80,
    color: '#ffffff',
  },
  {
    id: 'light-2',
    name: 'Bedroom Lamp',
    type: 'light',
    room: 'Bedroom',
    isOn: false,
    brightness: 50,
    color: '#ffcc00',
  },
  {
    id: 'thermostat-1',
    name: 'Main Thermostat',
    type: 'thermostat',
    room: 'Hallway',
    isOn: true,
    temperature: 72,
    mode: 'auto',
  },
  {
    id: 'lock-1',
    name: 'Front Door Lock',
    type: 'lock',
    room: 'Entryway',
    isOn: true,
    isLocked: true,
  },
  {
    id: 'fan-1',
    name: 'Ceiling Fan',
    type: 'fan',
    room: 'Bedroom',
    isOn: true,
    speed: 3,
  },
  {
    id: 'camera-1',
    name: 'Porch Camera',
    type: 'camera',
    room: 'Exterior',
    isOn: true,
  }
];
