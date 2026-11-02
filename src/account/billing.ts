import { FunctionsFetchError, FunctionsHttpError } from '@supabase/supabase-js'

import { supabase } from './client'

// One production's plan and billing, for its plan page. The server is
// stageroll-native's: `20261102120000_billing.sql` (what is kept, and who
// reads it) and the `billing-checkout` and `billing-portal` Edge Functions
// (`supabase/functions/_shared/billing.ts`, where each move goes). The plan
// itself moves only when Stripe tells `billing-webhook`, so after Stripe the
// page waits for the production to say so (`settle`).

export type Tier = 'free' | 'starter' | 'pro' | 'enterprise'
export type Plan = 'free' | 'starter' | 'pro'

export interface Billing {
  /** Stripe's word: active, past_due, canceled… */
  status: string | null
  plan: string | null
  renewsAt: string | null
  endsAt: string | null
}

export interface PlanRead {
  id: string
  /** As stored. */
  name: string
  tier: string
  /** The production is the signed-in account's own: only the owner changes its plan. */
  owned: boolean
  /** Null when it has never been billed. */
  billing: Billing | null
}

export type Read = { kind: 'read'; production: PlanRead } | { kind: 'missing' } | { kind: 'offline' } | { kind: 'failed' }

/** Still billing: as the server holds it (`billing_live`). */
export const isLive = (billing: Billing | null): billing is Billing =>
  billing?.status === 'active' || billing?.status === 'trialing' || billing?.status === 'past_due'

export async function readPlan(productionId: string, userId: string): Promise<Read> {
  const [production, billing] = await Promise.all([
    supabase.from('productions').select('id, name, tier, created_by').eq('id', productionId).maybeSingle(),
    supabase.from('production_billing').select('status, plan, renews_at, ends_at').eq('production_id', productionId).maybeSingle(),
  ])
  if (production.status === 0 || billing.status === 0) return { kind: 'offline' }
  if (production.error || billing.error) {
    console.error('[plan] the read failed', production.error ?? billing.error)
    return { kind: 'failed' }
  }
  const row = production.data as { id: string; name: string; tier: string; created_by: string | null } | null
  if (!row) return { kind: 'missing' }
  const bill = billing.data as { status: string | null; plan: string | null; renews_at: string | null; ends_at: string | null } | null
  return {
    kind: 'read',
    production: {
      id: row.id,
      name: row.name,
      tier: row.tier,
      owned: row.created_by === userId,
      billing: bill ? { status: bill.status, plan: bill.plan, renewsAt: bill.renews_at, endsAt: bill.ends_at } : null,
    },
  }
}

export type Move =
  | { kind: 'open'; url: string }
  | { kind: 'same' }
  | { kind: 'not-owner' }
  | { kind: 'enterprise' }
  | { kind: 'unbilled' }
  | { kind: 'no-billing' }
  | { kind: 'unavailable' }
  | { kind: 'signed-out' }
  | { kind: 'offline' }
  | { kind: 'failed' }

const KNOWN = new Set(['open', 'same', 'not-owner', 'enterprise', 'unbilled', 'no-billing', 'unavailable'])

async function ask(name: 'billing-checkout' | 'billing-portal', body: Record<string, string>): Promise<Move> {
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) {
    if (error instanceof FunctionsFetchError) return { kind: 'offline' }
    if (error instanceof FunctionsHttpError && error.context instanceof Response && error.context.status === 401) {
      return { kind: 'signed-out' }
    }
    console.error(`[plan] ${name} failed`, error)
    return { kind: 'failed' }
  }
  const answer = data as { outcome?: unknown; url?: unknown } | null
  const outcome = typeof answer?.outcome === 'string' ? answer.outcome : ''
  if (outcome === 'open') {
    return typeof answer?.url === 'string' ? { kind: 'open', url: answer.url } : { kind: 'failed' }
  }
  if (KNOWN.has(outcome)) return { kind: outcome } as Move
  console.error(`[plan] ${name} answered something else`, data)
  return { kind: 'failed' }
}

/** Free, Starter or Pro: Stripe Checkout from Free, Stripe's portal from a paid plan. */
export const movePlan = (productionId: string, plan: Plan) => ask('billing-checkout', { productionId, plan })

/** Stripe's portal: the card, the invoices, the company's details, renewing a cancelled plan. */
export const manageBilling = (productionId: string) => ask('billing-portal', { productionId })

/**
 * Back from Stripe, the plan moves when Stripe's webhook has landed, a
 * second or two later: read again until `done` says it has, or give up and
 * let the page say it is on its way.
 */
export async function settle(
  productionId: string,
  userId: string,
  done: (production: PlanRead) => boolean,
  tries = 15,
): Promise<PlanRead | null> {
  for (let i = 0; i < tries; i++) {
    await new Promise((resolve) => setTimeout(resolve, i === 0 ? 800 : 1500))
    const read = await readPlan(productionId, userId)
    if (read.kind === 'read' && done(read.production)) return read.production
  }
  return null
}
