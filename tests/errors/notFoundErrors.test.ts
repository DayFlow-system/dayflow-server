import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';
const id = '00000000-0000-4000-8000-000000000001';
describe('not found errors', () => {
  it('returns not found for missing entities', async () => {
    const app = createTestApp();
    const res = await app.inject(`/tasks/${id}`);
    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe('NOT_FOUND');
    await app.close();
  });
});
