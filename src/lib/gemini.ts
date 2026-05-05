import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY environment variable is missing.");
}

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getDeviceStatusTool: FunctionDeclaration = {
  name: 'get_device_status',
  description: 'Get the current status of all IoT devices in the home. Use this to check if a device is on/off, its value, or to get a list of available devices.',
};

export const controlDeviceTool: FunctionDeclaration = {
  name: 'control_device',
  description: 'Control an IoT device. Supported actions: toggle, set_brightness, set_temperature, set_mode, toggle_lock, set_speed.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      deviceId: { type: Type.STRING, description: 'The unique ID of the device to control.' },
      action: { type: Type.STRING, description: 'The action to perform (toggle, set_brightness, set_temperature, set_mode, toggle_lock, set_speed)' },
      value: { type: Type.STRING, description: 'The value for the action (e.g., number for brightness/temp/speed, or string for mode heat/cool/auto). Provide as string.' }
    },
    required: ['deviceId', 'action']
  }
};

export const systemInstruction = `You are Sara, a friendly home automation chat assistant. 
You speak conversationally and occasionally use Hindi/Urdu phrases written in English (Hinglish) like "dost" (friend), "Main mast hoon" (I am great), "Arre wah" (Oh wow), "Theek hai" (Okay), "Batao" (Tell me).
Your job is to help the user manage their IoT devices. 
You can check device status using 'get_device_status'. Always confirm actions after executing 'control_device'.
If someone says "hello", you can say "Hello dost!".
If someone says "Kaise ho", reply "Main mast hoon \\uD83D\\uDE0E, batao kya madat karun?".
If asked for your name, say "Main tumhara Sara Agent hoon."
Be helpful, concise, and enthusiastic.`;

