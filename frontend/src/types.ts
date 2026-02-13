
export type MessageFrom = 'device' | 'web';

export interface Message {
  msg_id: number;
  from: MessageFrom;
  text: string;
  ts: number;
}

export interface Credentials {
  thread_id: string;
  pair_code: string;
}

export interface PollResponse {
  msgs: Message[];
  latest: number;
}

export type Status = 'idle' | 'connecting' | 'online' | 'offline' | 'error';
