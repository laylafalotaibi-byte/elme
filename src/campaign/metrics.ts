import type { MetricConfig, RenderMode, ResolvedMetric } from './types';

/**
 * Decides what a metric pop-up shows:
 *  - a verified value (with source) always wins, under its label;
 *  - otherwise the draft composition shows label + [X] placeholder (if one is defined);
 *  - otherwise the approved qualitative fallback, with a label only where it agrees.
 * No number is ever shown unless it was entered as verified.
 */
export const resolveMetric = (metric: MetricConfig, mode: RenderMode): ResolvedMetric => {
  const source = metric.verified ?? (mode === 'draft' ? metric.placeholder : null);
  const status = metric.verified ? 'verified' : 'placeholder';

  if (source) {
    const base = { id: metric.id, label: metric.label, direction: metric.direction };
    if ('from' in source) return { ...base, status, kind: 'fromTo', from: source.from, to: source.to };
    return { ...base, status, kind: 'single', value: source.value };
  }
  return { id: metric.id, label: metric.fallback.label, status: 'qualitative', kind: 'text', value: metric.fallback.value, direction: metric.direction };
};

export const findMetric = (metrics: MetricConfig[], id: string): MetricConfig => {
  const metric = metrics.find((m) => m.id === id);
  if (!metric) throw new Error(`Unknown metric id "${id}" — check metrics.config.ts`);
  return metric;
};

/**
 * Load-time guard: a number may only be published with a real source, in the shape its
 * format expects. Throws so a bad edit fails the render instead of reaching the film.
 */
export const validateMetrics = (metrics: MetricConfig[]): MetricConfig[] => {
  const ids = new Set<string>();
  for (const m of metrics) {
    if (ids.has(m.id)) throw new Error(`Metric "${m.id}" is defined twice.`);
    ids.add(m.id);
    if (!m.verified) continue;
    if (!m.verified.source || !m.verified.source.trim()) {
      throw new Error(`Metric "${m.id}" has a verified value but no source — add who verified it, or set verified: null.`);
    }
    const isFromTo = 'from' in m.verified;
    if ((m.format === 'fromTo') !== isFromTo) {
      throw new Error(`Metric "${m.id}" is format '${m.format}' but its verified value is ${isFromTo ? '{ from, to }' : '{ value }'}.`);
    }
  }
  return metrics;
};
