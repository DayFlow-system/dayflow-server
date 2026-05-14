import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';
describe('today api', () => {
  it('returns dashboard contract', async () => {
    const app = createTestApp();
    const res = await app.inject('/today');
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('suggestedTasks');
    await app.close();
  });
});
