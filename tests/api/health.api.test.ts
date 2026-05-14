import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';
describe('GET /health', () => {
  it('returns ok', async () => {
    const app = createTestApp();
    const res = await app.inject('/health');
    expect(res.json()).toEqual({ status: 'ok' });
    await app.close();
  });
});
