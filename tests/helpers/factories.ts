import { parseDateOnly } from '../../src/utils/date.js';
export const taskFactory = (overrides = {}) => ({ title: 'Task', priority: 3, ...overrides });
export const eventFactory = (overrides = {}) => ({
  title: 'Event',
  date: parseDateOnly('2026-05-14'),
  ...overrides,
});
export const scheduleFactory = (overrides = {}) => ({
  title: 'Block',
  dayOfWeek: 4,
  startTime: '09:00',
  ...overrides,
});
export const dayStateFactory = (overrides = {}) => ({
  health: 'healthy',
  energy: 'medium',
  ...overrides,
});
