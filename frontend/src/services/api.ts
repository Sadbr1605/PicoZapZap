
import { Credentials, PollResponse } from '../types';

const TIMEOUT = 8000;

async function fetchWithTimeout(resource: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  async send(creds: Credentials, text: string) {
    const res = await fetchWithTimeout('/api/web_send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...creds,
        text
      })
    });
    if (!res.ok) throw new Error(res.status === 403 ? 'AUTH_ERROR' : 'API_ERROR');
    return res.json();
  },

  async poll(creds: Credentials, lastId: number): Promise<PollResponse> {
    const url = `/api/web_pull?thread_id=${creds.thread_id}&pair_code=${creds.pair_code}&after=${lastId}`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(res.status === 403 ? 'AUTH_ERROR' : 'API_ERROR');
    return res.json();
  }
};
