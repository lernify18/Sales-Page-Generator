
export interface Message {
  type: 'text' | 'image';
  content: string;
}

export interface ScriptSection {
  title: string;
  messages: Message[];
}

export type GeneratedScript = ScriptSection[];
