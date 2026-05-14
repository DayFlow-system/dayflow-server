const idParam = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'string', format: 'uuid' } },
} as const;

const errorResponse = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message', 'details'],
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        details: { type: 'array', items: {} },
      },
    },
  },
} as const;

const timestamps = {
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
} as const;

const nullableString = { anyOf: [{ type: 'string' }, { type: 'null' }] } as const;
const nullableDate = { anyOf: [{ type: 'string', format: 'date' }, { type: 'null' }] } as const;

const taskBody = {
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', minLength: 1 },
    description: nullableString,
    status: { type: 'string', enum: ['planned', 'in_progress', 'done', 'skipped', 'archived'] },
    type: { type: 'string', enum: ['task', 'study', 'health', 'routine', 'fun', 'admin'] },
    priority: { type: 'integer', minimum: 1, maximum: 5, default: 3 },
    deadline: nullableDate,
    plannedDate: nullableDate,
    lastDoneAt: nullableDate,
    energyRequired: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
    healthRule: {
      type: 'string',
      enum: ['always', 'skip_if_sick', 'only_if_healthy'],
      default: 'always',
    },
  },
} as const;

const taskPatchBody = { ...taskBody, required: [] } as const;

const taskResponse = {
  ...taskBody,
  required: ['id', 'title', 'status', 'type', 'priority', 'energyRequired', 'healthRule'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    ...taskBody.properties,
    ...timestamps,
  },
} as const;

const eventBody = {
  type: 'object',
  required: ['title', 'date'],
  properties: {
    title: { type: 'string', minLength: 1 },
    description: nullableString,
    date: { type: 'string', format: 'date' },
    startTime: nullableString,
    endTime: nullableString,
    status: { type: 'string', enum: ['planned', 'done', 'cancelled'], default: 'planned' },
    importance: {
      type: 'string',
      enum: ['low', 'medium', 'high', 'mandatory'],
      default: 'medium',
    },
    location: nullableString,
  },
} as const;

const eventPatchBody = { ...eventBody, required: [] } as const;

const eventResponse = {
  ...eventBody,
  required: ['id', 'title', 'date', 'status', 'importance'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    ...eventBody.properties,
    ...timestamps,
  },
} as const;

const scheduleBody = {
  type: 'object',
  required: ['title', 'dayOfWeek', 'startTime'],
  properties: {
    title: { type: 'string', minLength: 1 },
    description: nullableString,
    dayOfWeek: { type: 'integer', minimum: 1, maximum: 7 },
    startTime: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' },
    endTime: nullableString,
    type: {
      type: 'string',
      enum: ['study', 'work', 'health', 'routine', 'admin', 'free_time', 'other'],
      default: 'other',
    },
    status: { type: 'string', enum: ['active', 'paused', 'archived'], default: 'active' },
    importance: {
      type: 'string',
      enum: ['low', 'medium', 'high', 'mandatory'],
      default: 'medium',
    },
    location: nullableString,
  },
} as const;

const schedulePatchBody = { ...scheduleBody, required: [] } as const;

const scheduleResponse = {
  ...scheduleBody,
  required: ['id', 'title', 'dayOfWeek', 'startTime', 'type', 'status', 'importance'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    ...scheduleBody.properties,
    ...timestamps,
  },
} as const;

const dayStateBody = {
  type: 'object',
  properties: {
    health: { type: 'string', enum: ['healthy', 'slightly_sick', 'sick'], default: 'healthy' },
    energy: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
    mood: { anyOf: [{ type: 'integer', minimum: 1, maximum: 5 }, { type: 'null' }] },
    notes: nullableString,
  },
} as const;

const dayStateResponse = {
  ...dayStateBody,
  required: ['id', 'date', 'health', 'energy'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    date: { type: 'string', format: 'date' },
    ...dayStateBody.properties,
    ...timestamps,
  },
} as const;

const todayDashboardResponse = {
  type: 'object',
  required: [
    'date',
    'dayState',
    'mandatoryEvents',
    'plannedEvents',
    'scheduleBlocks',
    'deadlineTasks',
    'plannedTasks',
    'suggestedTasks',
  ],
  properties: {
    date: { type: 'string', format: 'date' },
    dayState: dayStateResponse,
    mandatoryEvents: { type: 'array', items: eventResponse },
    plannedEvents: { type: 'array', items: eventResponse },
    scheduleBlocks: { type: 'array', items: scheduleResponse },
    deadlineTasks: { type: 'array', items: taskResponse },
    plannedTasks: { type: 'array', items: taskResponse },
    suggestedTasks: { type: 'array', items: taskResponse },
  },
} as const;

const emptyBody = { type: 'object', additionalProperties: false } as const;

export const commonResponses = {
  validation: { 400: errorResponse },
  notFound: { 404: errorResponse },
} as const;

export const healthRouteSchema = {
  tags: ['Health'],
  summary: 'Health check',
  response: {
    200: { type: 'object', required: ['status'], properties: { status: { const: 'ok' } } },
  },
} as const;

export const taskRouteSchemas = {
  list: {
    tags: ['Tasks'],
    summary: 'List tasks',
    response: { 200: { type: 'array', items: taskResponse } },
  },
  get: {
    tags: ['Tasks'],
    summary: 'Get task by id',
    params: idParam,
    response: { 200: taskResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
  create: {
    tags: ['Tasks'],
    summary: 'Create task',
    body: taskBody,
    response: { 201: taskResponse, ...commonResponses.validation },
  },
  update: {
    tags: ['Tasks'],
    summary: 'Update task',
    params: idParam,
    body: taskPatchBody,
    response: { 200: taskResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
  archive: {
    tags: ['Tasks'],
    summary: 'Archive task',
    params: idParam,
    response: { 200: taskResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
} as const;

export const eventRouteSchemas = {
  list: {
    tags: ['Events'],
    summary: 'List events',
    response: { 200: { type: 'array', items: eventResponse } },
  },
  get: {
    tags: ['Events'],
    summary: 'Get event by id',
    params: idParam,
    response: { 200: eventResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
  create: {
    tags: ['Events'],
    summary: 'Create event',
    body: eventBody,
    response: { 201: eventResponse, ...commonResponses.validation },
  },
  update: {
    tags: ['Events'],
    summary: 'Update event',
    params: idParam,
    body: eventPatchBody,
    response: { 200: eventResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
  cancel: {
    tags: ['Events'],
    summary: 'Cancel event',
    params: idParam,
    response: { 200: eventResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
} as const;

export const scheduleRouteSchemas = {
  list: {
    tags: ['Schedule'],
    summary: 'List schedule blocks',
    response: { 200: { type: 'array', items: scheduleResponse } },
  },
  today: {
    tags: ['Schedule'],
    summary: "List today's active schedule blocks",
    response: { 200: { type: 'array', items: scheduleResponse } },
  },
  get: {
    tags: ['Schedule'],
    summary: 'Get schedule block by id',
    params: idParam,
    response: { 200: scheduleResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
  create: {
    tags: ['Schedule'],
    summary: 'Create schedule block',
    body: scheduleBody,
    response: { 201: scheduleResponse, ...commonResponses.validation },
  },
  update: {
    tags: ['Schedule'],
    summary: 'Update schedule block',
    params: idParam,
    body: schedulePatchBody,
    response: { 200: scheduleResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
  archive: {
    tags: ['Schedule'],
    summary: 'Archive schedule block',
    params: idParam,
    response: { 200: scheduleResponse, ...commonResponses.notFound, ...commonResponses.validation },
  },
} as const;

export const dayStateRouteSchemas = {
  today: {
    tags: ['Day State'],
    summary: "Get or create today's day state",
    response: { 200: dayStateResponse },
  },
  putToday: {
    tags: ['Day State'],
    summary: "Update today's day state",
    body: dayStateBody,
    response: { 200: dayStateResponse, ...commonResponses.validation },
  },
} as const;

export const todayRouteSchema = {
  tags: ['Today'],
  summary: 'Get Today dashboard',
  response: { 200: todayDashboardResponse },
} as const;

export const emptyBodySchema = emptyBody;
