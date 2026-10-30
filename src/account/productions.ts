import { supabase } from './client'

// The signed-in account's productions: the app's own read behind the
// production switcher (stageroll-native `src/production/store.ts` ›
// `readList`). Every production the account can see, by name, and its role
// on each. A binned production has no owner and no members, so the policies
// leave it out of the read without a filter here, as they do in the app.

export interface Production {
  id: string
  /** As stored. */
  name: string
  /** The plan as the column stores it ('free', 'starter', 'pro', 'enterprise'). */
  tier: string
  /** The account's role, or null where it sees the production without a member row (it made it). */
  role: string | null
}

export type ListRead = { kind: 'read'; yours: Production[]; shared: Production[] } | { kind: 'offline' } | { kind: 'failed' }

export async function readProductions(userId: string): Promise<ListRead> {
  const [productions, members] = await Promise.all([
    supabase.from('productions').select('id, name, tier').order('name', { ascending: true }),
    supabase.from('production_members').select('production_id, role').eq('user_id', userId),
  ])
  const error = productions.error ?? members.error
  if (error) {
    // PostgREST answers a dead network with status 0.
    if (productions.status === 0 || members.status === 0) return { kind: 'offline' }
    console.error('[productions] the read failed', error)
    return { kind: 'failed' }
  }
  const rows = (productions.data ?? []) as { id: string; name: string; tier: string }[]
  const roles = new Map(
    ((members.data ?? []) as { production_id: string; role: string }[]).map((m) => [m.production_id, m.role]),
  )
  const list = rows.map((p) => ({ id: p.id, name: p.name, tier: p.tier, role: roles.get(p.id) ?? null }))
  // Yours is the owner's: the owner role, or the creator's own production
  // with no member row, the same person (the app's `usePlan`).
  const owns = (p: Production) => p.role === 'owner' || p.role === null
  return { kind: 'read', yours: list.filter(owns), shared: list.filter((p) => !owns(p)) }
}

const PLANS: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise' }
const ROLES: Record<string, string> = { owner: 'Owner', coordinator: 'Coordinator', crew: 'Crew' }

/** A word the list does not know still prints as a word. */
const asWord = (value: string) => {
  const word = value.trim()
  return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''
}

export const planLabel = (tier: string) => PLANS[tier] ?? asWord(tier)
export const roleLabel = (role: string | null) => (role ? (ROLES[role] ?? asWord(role)) : '')
