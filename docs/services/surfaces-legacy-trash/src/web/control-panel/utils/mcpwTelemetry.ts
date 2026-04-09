export type McpwTelemetryEvent = {
  eventName: string;
  at: string;
  payload: Record<string, unknown>;
  eventId?: string;
  target?: string;
};

export type McpwTelemetryState = {
  eventCount: number;
  lastEventName?: string;
  lastEventAt?: string;
  lastEventId?: string;
  lastTarget?: string;
  serviceSwitchCount?: number;
  sidebarClickCount?: number;
  lastServiceFrom?: string;
  lastServiceTo?: string;
  lastServiceSwitchAt?: string;
  lastSidebarHref?: string;
  lastSidebarClickAt?: string;
  taskSessions?: Record<string, { startedAt: string; clickCount: number }>;
  taskResults?: Record<
    string,
    {
      successCount: number;
      failCount: number;
      lastDurationMs?: number;
      lastClicksToComplete?: number;
      lastStatus?: 'success' | 'fail';
      lastCompletedAt?: string;
    }
  >;
  events: McpwTelemetryEvent[];
};

export type McpwTaskCompletionRow = {
  taskId: string;
  status: 'success' | 'fail';
  clicksToComplete: number;
  durationMs: number;
  completedAt: string;
};

export type McpwTaskBaseline = {
  taskId: string;
  baselineClicks: number;
  targetMaxClicks: number;
};

const MCPW_TELEMETRY_KEY = 'control panel.click.telemetry.v2';
const LEGACY_MCPW_TELEMETRY_KEY = 'control panel.click.telemetry.v1';

function emptyTelemetryState(): McpwTelemetryState {
  return { eventCount: 0, events: [] };
}

function normalizeTelemetryEvent(raw: unknown): McpwTelemetryEvent | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const payload =
    record.payload && typeof record.payload === 'object'
      ? { ...(record.payload as Record<string, unknown>) }
      : {};
  const target =
    typeof record.target === 'string'
      ? record.target
      : typeof payload.target === 'string'
        ? payload.target
        : undefined;
  const eventName =
    typeof record.eventName === 'string'
      ? record.eventName
      : typeof record.eventId === 'string'
        ? record.eventId
        : 'unknown';
  const at =
    typeof record.at === 'string' ? record.at : new Date(0).toISOString();

  if (target && typeof payload.target !== 'string') {
    payload.target = target;
  }

  return {
    eventName,
    eventId: typeof record.eventId === 'string' ? record.eventId : eventName,
    target,
    at,
    payload,
  };
}

function readRawTelemetryState(): Partial<McpwTelemetryState> | null {
  if (typeof window === 'undefined') return null;

  for (const key of [MCPW_TELEMETRY_KEY, LEGACY_MCPW_TELEMETRY_KEY]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      return JSON.parse(raw) as Partial<McpwTelemetryState>;
    } catch {
      continue;
    }
  }

  return null;
}

function readTelemetryState(): McpwTelemetryState {
  const parsed = readRawTelemetryState();
  if (!parsed) return emptyTelemetryState();

  return {
    eventCount: Number(parsed.eventCount ?? 0),
    lastEventName:
      typeof parsed.lastEventName === 'string'
        ? parsed.lastEventName
        : typeof parsed.lastEventId === 'string'
          ? parsed.lastEventId
          : undefined,
    lastEventAt: parsed.lastEventAt,
    lastEventId:
      typeof parsed.lastEventId === 'string' ? parsed.lastEventId : undefined,
    lastTarget:
      typeof parsed.lastTarget === 'string' ? parsed.lastTarget : undefined,
    serviceSwitchCount: Number(parsed.serviceSwitchCount ?? 0),
    sidebarClickCount: Number(parsed.sidebarClickCount ?? 0),
    lastServiceFrom: parsed.lastServiceFrom,
    lastServiceTo: parsed.lastServiceTo,
    lastServiceSwitchAt: parsed.lastServiceSwitchAt,
    lastSidebarHref: parsed.lastSidebarHref,
    lastSidebarClickAt: parsed.lastSidebarClickAt,
    taskSessions:
      parsed.taskSessions && typeof parsed.taskSessions === 'object'
        ? parsed.taskSessions
        : {},
    taskResults:
      parsed.taskResults && typeof parsed.taskResults === 'object'
        ? parsed.taskResults
        : {},
    events: Array.isArray(parsed.events)
      ? parsed.events
          .map(normalizeTelemetryEvent)
          .filter((event): event is McpwTelemetryEvent => event !== null)
          .slice(-50)
      : [],
  };
}

export function getMcpwTelemetrySnapshot(): McpwTelemetryState {
  return readTelemetryState();
}

export function getRecentTelemetryEvents(limit = 8): McpwTelemetryEvent[] {
  return readTelemetryState().events.slice(-limit).reverse();
}

export function getRecentTaskCompletions(limit = 10): McpwTaskCompletionRow[] {
  const snap = readTelemetryState();
  const rows: McpwTaskCompletionRow[] = [];
  for (let i = snap.events.length - 1; i >= 0; i -= 1) {
    const ev = snap.events[i];
    if (ev.eventName !== 'task_session_complete') continue;
    const taskId = String(ev.payload.task_id ?? '');
    const statusRaw = String(ev.payload.status ?? '');
    const status: 'success' | 'fail' =
      statusRaw === 'fail' ? 'fail' : 'success';
    const clicksToComplete = Number(ev.payload.clicks_to_complete ?? 0);
    const durationMs = Number(ev.payload.duration_ms ?? 0);
    if (!taskId) continue;
    rows.push({
      taskId,
      status,
      clicksToComplete,
      durationMs,
      completedAt: ev.at,
    });
    if (rows.length >= limit) break;
  }
  return rows;
}

export function getTaskBaselines(): McpwTaskBaseline[] {
  return [
    { taskId: 'esf_primary', baselineClicks: 3, targetMaxClicks: 2 },
    { taskId: 'esf_inline_save', baselineClicks: 3, targetMaxClicks: 2 },
    { taskId: 'esf_primary_start', baselineClicks: 3, targetMaxClicks: 2 },
    { taskId: 'esf_primary_stop', baselineClicks: 3, targetMaxClicks: 2 },
    { taskId: 'mrf_primary', baselineClicks: 3, targetMaxClicks: 1 },
    { taskId: 'mrf_search', baselineClicks: 4, targetMaxClicks: 2 },
    { taskId: 'mrf_create', baselineClicks: 4, targetMaxClicks: 2 },
    { taskId: 'mrf_claim_get', baselineClicks: 4, targetMaxClicks: 2 },
    { taskId: 'mrf_match_respond', baselineClicks: 4, targetMaxClicks: 2 },
    { taskId: 'kwd_primary', baselineClicks: 3, targetMaxClicks: 2 },
    { taskId: 'kwd_jobs_search', baselineClicks: 4, targetMaxClicks: 2 },
    { taskId: 'kwd_apply', baselineClicks: 4, targetMaxClicks: 2 },
    { taskId: 'kwd_my_applications', baselineClicks: 4, targetMaxClicks: 2 },
    { taskId: 'kwd_report', baselineClicks: 4, targetMaxClicks: 2 },
  ];
}

function writeTelemetryState(next: McpwTelemetryState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MCPW_TELEMETRY_KEY, JSON.stringify(next));
    window.localStorage.setItem(
      LEGACY_MCPW_TELEMETRY_KEY,
      JSON.stringify(next)
    );
  } catch {
    // Ignore storage write errors.
  }
}

export function trackMcpwTelemetry(
  eventName: string,
  payload: Record<string, unknown> = {}
): void {
  const now = new Date().toISOString();
  const prev = readTelemetryState();
  const taskId = typeof payload.task_id === 'string' ? payload.task_id : null;
  const target =
    typeof payload.target === 'string'
      ? payload.target
      : typeof payload.href === 'string'
        ? payload.href
        : typeof payload.click_target === 'string'
          ? payload.click_target
          : undefined;
  const nextTaskSessions = { ...(prev.taskSessions ?? {}) };
  if (taskId && payload.click_target) {
    const existing = nextTaskSessions[taskId];
    if (existing) {
      nextTaskSessions[taskId] = {
        ...existing,
        clickCount: existing.clickCount + 1,
      };
    }
  }
  const event: McpwTelemetryEvent = {
    eventName,
    eventId: eventName,
    target,
    at: now,
    payload: target ? { ...payload, target } : payload,
  };
  const events = [...prev.events, event].slice(-50);
  writeTelemetryState({
    ...prev,
    eventCount: prev.eventCount + 1,
    lastEventName: eventName,
    lastEventAt: now,
    lastEventId: eventName,
    lastTarget: target,
    taskSessions: nextTaskSessions,
    events,
  });
}

export function startTaskSession(
  taskId: string,
  meta: Record<string, unknown> = {}
): void {
  if (!taskId) return;
  const now = new Date().toISOString();
  const prev = readTelemetryState();
  const taskSessions = {
    ...(prev.taskSessions ?? {}),
    [taskId]: { startedAt: now, clickCount: 0 },
  };
  writeTelemetryState({
    ...prev,
    taskSessions,
  });
  trackMcpwTelemetry('task_session_start', { task_id: taskId, ...meta });
}

export function completeTaskSession(
  taskId: string,
  status: 'success' | 'fail',
  meta: Record<string, unknown> = {}
): void {
  if (!taskId) return;
  const nowIso = new Date().toISOString();
  const now = Date.now();
  const prev = readTelemetryState();
  const session = prev.taskSessions?.[taskId];
  const startedMs = session ? new Date(session.startedAt).getTime() : now;
  const durationMs = Math.max(0, now - startedMs);
  const clicksToComplete = Number(session?.clickCount ?? 0);
  const current = prev.taskResults?.[taskId] ?? {
    successCount: 0,
    failCount: 0,
  };
  const taskResults = {
    ...(prev.taskResults ?? {}),
    [taskId]: {
      successCount: current.successCount + (status === 'success' ? 1 : 0),
      failCount: current.failCount + (status === 'fail' ? 1 : 0),
      lastDurationMs: durationMs,
      lastClicksToComplete: clicksToComplete,
      lastStatus: status,
      lastCompletedAt: nowIso,
    },
  };
  const taskSessions = { ...(prev.taskSessions ?? {}) };
  delete taskSessions[taskId];
  writeTelemetryState({
    ...prev,
    taskSessions,
    taskResults,
  });
  trackMcpwTelemetry('task_session_complete', {
    task_id: taskId,
    status,
    duration_ms: durationMs,
    clicks_to_complete: clicksToComplete,
    ...meta,
  });
}

export function incrementServiceSwitch(from: string, to: string): void {
  const now = new Date().toISOString();
  const prev = readTelemetryState();
  writeTelemetryState({
    ...prev,
    serviceSwitchCount: Number(prev.serviceSwitchCount ?? 0) + 1,
    lastServiceFrom: from,
    lastServiceTo: to,
    lastServiceSwitchAt: now,
  });
}

export function incrementSidebarClick(href: string): void {
  const now = new Date().toISOString();
  const prev = readTelemetryState();
  writeTelemetryState({
    ...prev,
    sidebarClickCount: Number(prev.sidebarClickCount ?? 0) + 1,
    lastSidebarHref: href,
    lastSidebarClickAt: now,
  });
}

