import { useCallback, useEffect, useState, type ReactNode } from "react";

import {
  confirmCheckout,
  isLive,
  manageBilling,
  movePlan,
  readPlan,
  settle,
  type Confirm,
  type Move,
  type Plan,
  type PlanRead,
  type Read,
} from "./billing";
import { supabase } from "./client";
import { isHeld } from "./keys";
import { planLabel } from "./productions";
import { CONTACT, endIfDue } from "./signIn";
import { useExpiry } from "./useExpiry";
import { Wait } from "./Wait";

// /productions/plan/?id=…, drawn in the browser: one production's plan, for
// its owner to change (stageroll-docs#45). Free to a paid plan is Stripe
// Checkout; from a paid plan, a change or a cancel is Stripe's portal, on
// the page for that change. Either way the plan moves when Stripe tells the
// server, so back from Stripe the page waits for it (`billing.ts` ›
// `settle`). Back from Checkout it first asks the server what the session
// in the address came to (`confirmCheckout`): "payment received" is Stripe's
// word, never the address bar's, which anyone can write. Prices and what
// each plan holds are the pricing page's, from stageroll-docs#18.

const toSignIn = () => window.location.replace("/sign-in/");

const PLANS: { plan: Plan; price: string; holds: string }[] = [
  {
    plan: "free",
    price: "£0",
    holds: "Just you. 50 items, 250 MB of photos and one script analysis.",
  },
  {
    plan: "starter",
    price: "£29 a month",
    holds:
      "10 seats. 1,000 items, 3 GB of photos and 10 script analyses a month.",
  },
  {
    plan: "pro",
    price: "£299 a month",
    holds:
      "Unlimited seats and script analyses, 100 GB of photos, spreadsheet reports and screenshot protection.",
  },
];

const RANK: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

/** Up the ladder: the action in ink. */
const isUp = (plan: Plan, tier: string) => RANK[plan]! > (RANK[tier] ?? 0);

/** "2 December", or "2 December 2027" when it is not this year. */
function dayOf(stamp: string): string {
  const date = new Date(stamp);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

const nameOf = (production: PlanRead) =>
  production.name.trim() ? production.name : "Untitled production";

/** Where the production stands, in a line under its name. */
function standing(production: PlanRead): string {
  const plan = planLabel(production.tier);
  const billing = production.billing;
  if (production.tier === "free" || !isLive(billing)) return `On ${plan}.`;
  if (billing.endsAt)
    return `On ${plan} until ${dayOf(billing.endsAt)}, then Free.`;
  if (billing.status === "past_due")
    return `On ${plan}. The last payment didn’t go through, so check the card in billing.`;
  return billing.renewsAt
    ? `On ${plan}. Renews on ${dayOf(billing.renewsAt)}.`
    : `On ${plan}.`;
}

/** Why a move went nowhere, in the page's words. */
function sayMove(move: Move, production: PlanRead): string | null {
  switch (move.kind) {
    case "open":
    case "signed-out":
      return null;
    case "same":
      return `${nameOf(production)} is already on that plan.`;
    case "not-owner":
      return "Only the production’s owner changes its plan.";
    case "enterprise":
      return `Enterprise is billed by invoice. Write to ${CONTACT} to change it.`;
    case "unbilled":
      return `StageRoll set this plan for you. Write to ${CONTACT} to change it.`;
    case "no-billing":
      return "This production has no billing yet.";
    case "unavailable":
      return "Billing isn’t available right now. Try again in a little while.";
    case "paced":
      return `That’s a lot of billing requests for one day. Try again tomorrow, or write to ${CONTACT}.`;
    case "offline":
      return "No connection. Check your network and try again.";
    case "failed":
      return "That didn’t go through. Try again in a moment.";
  }
}

/** What the page was sent back with, taken off the address so a reload asks nothing again. */
function takeReturn(): {
  id: string | null;
  session: string | null;
  fromBilling: boolean;
} {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const session = params.get("session");
  const fromBilling = params.get("from") === "billing";
  if (session || fromBilling) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?id=${encodeURIComponent(id ?? "")}`,
    );
  }
  return { id, session, fromBilling };
}

/** Back from Checkout and not paid, in the page's words; null where there is nothing to say. */
function sayConfirm(confirm: Confirm): string | null {
  switch (confirm.kind) {
    case "paid":
    case "signed-out":
    // A checkout that is not this production's, or not the caller's: a crafted address, and nothing to tell.
    case "unknown":
    case "not-owner":
      return null;
    case "processing":
      return `Payment is on its way. ${planLabel(confirm.plan)} arrives once it has cleared, and this page shows it then.`;
    case "unpaid":
      return "That checkout wasn’t completed, so nothing has changed.";
    case "paced":
      return "That’s a lot of billing requests for one day, so the payment wasn’t checked. If you paid, the plan arrives in a minute or two, and this page shows it once it has.";
    case "unavailable":
    case "offline":
    case "failed":
      return "The payment couldn’t be checked with Stripe just now. If you paid, the plan arrives in a minute or two, and this page shows it once it has.";
  }
}

/** Every fact the page shows, so a change is any of them moving. */
const factsOf = (p: PlanRead) => JSON.stringify([p.tier, p.billing]);

export default function PlanPage() {
  const [read, setRead] = useState<Read | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [settling, setSettling] = useState<string | null>(null);
  const [busy, setBusy] = useState<Plan | "billing" | null>(null);

  const load = useCallback(async () => {
    if (await endIfDue()) return toSignIn();
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session || isHeld(session.access_token)) return toSignIn();
    const back = takeReturn();
    if (!back.id) return window.location.replace("/productions/");
    setUserId(session.user.id);
    const first = await readPlan(back.id, session.user.id);
    setRead(first);
    if (first.kind !== "read") return;

    const was = factsOf(first.production);
    if (back.session) {
      setSettling("Checking the payment with Stripe.");
      const confirm = await confirmCheckout(back.id, back.session);
      if (confirm.kind === "signed-out") return toSignIn();
      if (confirm.kind !== "paid") {
        setSettling(null);
        return setNotice(sayConfirm(confirm));
      }
      const paid = confirm.plan;
      const plan = planLabel(paid);
      if (first.production.tier === paid) {
        setSettling(null);
        return setNotice(`${nameOf(first.production)} is on ${plan}.`);
      }
      setSettling(`Payment received. Moving to ${plan}.`);
      const landed = await settle(
        back.id,
        session.user.id,
        (p) => p.tier === paid,
      );
      setSettling(null);
      if (landed) {
        setRead({ kind: "read", production: landed });
        setNotice(`${nameOf(landed)} is on ${plan}.`);
      } else {
        setNotice(
          `Payment received. ${plan} arrives in a minute or two, and this page shows it once it has.`,
        );
      }
    } else if (back.fromBilling) {
      setSettling("Bringing in the change from billing.");
      const landed = await settle(
        back.id,
        session.user.id,
        (p) => factsOf(p) !== was,
        6,
      );
      setSettling(null);
      if (landed) setRead({ kind: "read", production: landed });
    }
  }, []);

  useEffect(() => {
    void load();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") toSignIn();
    });
    return () => data.subscription.unsubscribe();
  }, [load]);

  useExpiry(toSignIn);

  if (!read) return <Wait />;

  if (read.kind !== "read") {
    return (
      <Column title={read.kind === "missing" ? "Production not found" : "Plan"}>
        <div className="acct-empty">
          <p>
            {read.kind === "missing"
              ? "It isn’t on your account, or it has been deleted."
              : read.kind === "offline"
                ? "No connection. Check your network and try again."
                : "The plan couldn’t be loaded."}
          </p>
          {read.kind !== "missing" && (
            <button
              type="button"
              className="pill acct-retry"
              onClick={() => {
                setRead(null);
                void load();
              }}
            >
              Try again
            </button>
          )}
        </div>
      </Column>
    );
  }

  const production = read.production;
  const billing = production.billing;
  const ending = isLive(billing) && billing.endsAt ? billing.endsAt : null;

  if (!production.owned) {
    return (
      <Column
        title={nameOf(production)}
        sub={`On ${planLabel(production.tier)}.`}
      >
        <p className="acct-plan-note">
          Only the production’s owner changes its plan.
        </p>
      </Column>
    );
  }

  const go = async (move: Promise<Move>, what: Plan | "billing") => {
    if (busy || !userId) return;
    setBusy(what);
    setNotice(null);
    const answer = await move;
    if (answer.kind === "open") return window.location.assign(answer.url);
    setBusy(null);
    if (answer.kind === "signed-out") return toSignIn();
    setNotice(sayMove(answer, production));
  };

  const enterprise = production.tier === "enterprise";

  return (
    <Column title={nameOf(production)} sub={standing(production)}>
      {settling ? (
        <p className="acct-plan-settling" role="status">
          <span className="acct-spin" aria-hidden="true" />
          {settling}
        </p>
      ) : (
        notice && (
          <p className="acct-plan-notice" role="alert">
            {notice}
          </p>
        )
      )}

      <section className="acct-group">
        <h2>Plans</h2>
        <ul className="acct-rows acct-plans">
          {PLANS.map(({ plan, price, holds }) => {
            const current = production.tier === plan;
            const choose = (label: string, ink: boolean) => (
              <button
                type="button"
                className={`pill acct-choose${ink ? " dark" : ""}`}
                disabled={busy !== null || settling !== null}
                aria-busy={busy === plan}
                onClick={() => void go(movePlan(production.id, plan), plan)}
              >
                {busy === plan ? (
                  <span className="acct-spin" aria-label="Working" />
                ) : (
                  label
                )}
              </button>
            );
            let end: ReactNode;
            if (enterprise) {
              end = null;
            } else if (current) {
              // Cancelled, it is kept from the portal's own page (`movePlan` sends it there).
              end = ending ? (
                choose("Keep", true)
              ) : (
                <span className="acct-end">Current plan</span>
              );
            } else if (plan === "free" && ending) {
              end = <span className="acct-end">From {dayOf(ending)}</span>;
            } else {
              end = choose("Choose", isUp(plan, production.tier));
            }
            return (
              <li key={plan}>
                <div className="acct-plan-what">
                  <span className="acct-name">{planLabel(plan)}</span>
                  <span className="acct-plan-holds">{holds}</span>
                </div>
                <div className="acct-plan-end">
                  <span className="acct-plan-price">{price}</span>
                  {end}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="acct-plan-note">
          {enterprise ? (
            <>
              This production is on Enterprise, billed by invoice. To change it,
              write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
            </>
          ) : (
            <>
              Prices are per production and plus VAT, paid by card through
              Stripe. A plan you cancel runs to the end of the month you’ve paid
              for, then moves to Free. Enterprise is priced with each
              production: <a href="/contact/">get in touch</a>.
            </>
          )}
        </p>
      </section>

      {billing?.status && (
        <section className="acct-group">
          <h2>Billing</h2>
          <p className="acct-plan-note acct-plan-note-first">
            The card, the invoices, and the company name, address and VAT number
            on them.
          </p>
          <button
            type="button"
            className="pill acct-billing"
            disabled={busy !== null || settling !== null}
            aria-busy={busy === "billing"}
            onClick={() => void go(manageBilling(production.id), "billing")}
          >
            {busy === "billing" ? (
              <span className="acct-spin" aria-label="Working" />
            ) : (
              "Manage billing"
            )}
          </button>
        </section>
      )}
    </Column>
  );
}

function Column({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <section className="acct acct-wide">
      <div className="acct-col">
        <h1>{title}</h1>
        {sub && <p className="acct-sub">{sub}</p>}
        {children}
        <p className="acct-foot">
          <a className="acct-link" href="/productions/">
            Your productions
          </a>
        </p>
      </div>
    </section>
  );
}
