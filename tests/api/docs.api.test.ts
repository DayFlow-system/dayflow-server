import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';

describe('docs api', () => {
  it('exposes OpenAPI JSON with documented endpoints', async () => {
    const app = createTestApp();
    const res = await app.inject('/openapi.json');
    expect(res.statusCode).toBe(200);
    const spec = res.json();
    expect(spec.info.title).toBe('Dayflow API');
    expect(spec.paths).toHaveProperty('/tasks');
    expect(spec.paths).toHaveProperty('/today');
    await app.close();
  });
});
