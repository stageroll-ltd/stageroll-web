import { useCallback, useEffect, useState, type ReactNode } from "react";

import {
  confirmCheckout,
  isLive,
  manageBilling,
  movePlan,
  readCounts,
  readLimits,
  readPlan,
  readUsage,
  settle,
  type Confirm,
  type Counts,
  type HeldKind,
  type Limits,
  type Move,
  type Plan,
  type PlanRead,
  type Read,
  type Usage,
} from "./billing";
import { Icon } from "../components/Icon";
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

const PLANS: {
  plan: Plan;
  price: string;
  /** What it holds, said on the card that offers it. */
  holds: string[];
}[] = [
  { plan: "free", price: "£0", holds: [] },
  {
    plan: "starter",
    price: "£29",
    holds: [
      "10 seats",
      "3 GB of photos",
      "1,000 items",
      "10 script analyses a month",
    ],
  },
  {
    plan: "pro",
    price: "£299",
    holds: [
      "Unlimited seats",
      "Several scripts and episodes",
      "Unlimited items and script analyses",
      "Spreadsheet reports",
      "100 GB of photos",
      "Screenshot protection",
    ],
  },
];

// What Enterprise adds, from the pricing page's table (stageroll-docs#18).
const ENTERPRISE = [
  "Unlimited seats and items",
  "A contract of the length you need",
  "Storage and limits set for the production",
  "Invoice or purchase order",
  "Screenshot protection",
  "Priority support",
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

/** The line under the plan's name: what it costs and its next date, or what is wrong. */
function standing(production: PlanRead): ReactNode {
  const tier = production.tier;
  const billing = production.billing;
  if (tier === "enterprise") {
    return (
      <>
        Billed by invoice. To change it, write to{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </>
    );
  }
  if (tier === "free") return "£0. Up to three free productions per account.";
  const listed = PLANS.find((one) => one.plan === tier);
  const price = listed ? `${listed.price} a month.` : "";
  if (!isLive(billing)) return price;
  if (billing.endsAt)
    return `Cancelled. It runs until ${dayOf(billing.endsAt)}, then moves to Free.`;
  if (billing.status === "past_due")
    return "The last payment didn’t go through. Check the card in billing.";
  return billing.renewsAt
    ? `${price} Next payment ${dayOf(billing.renewsAt)}.`
    : price;
}

const count = (n: number) => n.toLocaleString("en-GB");

/** "120 MB", "1.2 GB": the plans' own units, 1,024 to the next. */
function size(bytes: number): string {
  const mb = bytes / 1024 ** 2;
  if (mb < 1024) return `${count(Math.round(mb))} MB`;
  const gb = mb / 1024;
  return `${count(gb >= 100 ? Math.round(gb) : Math.round(gb * 10) / 10)} GB`;
}

interface Meter {
  label: string;
  used: string;
  /** "of 50", "Unlimited", or "Not on this plan". */
  of: string;
  /** How full, 0 to 1; null where the plan sets no number. */
  full: number | null;
}

/** What the production has used of its plan, a line per kind. A fair-use cap is never shown: that kind reads Unlimited. */
function metersOf(usage: Usage): Meter[] {
  const total = usage.analyses_in_total;
  // Free is held to its analyses in total; the paid plans to a month's.
  const inTotal = total?.hint === "plan" && total.most !== null;
  const lines: [string, string, boolean][] = [
    ["seats", "Seats", false],
    ["items", "Items", false],
    ["collections", "Crates", false],
    ["research_references", "Research references", false],
    ["storage_bytes", "Photo storage", true],
    inTotal
      ? ["analyses_in_total", "Script analyses", false]
      : ["analyses_per_month", "Script analyses this month", false],
  ];
  const meters: Meter[] = [];
  for (const [kind, label, bytes] of lines) {
    const use = usage[kind];
    if (!use) continue;
    const say = bytes ? size : count;
    const most = use.hint === "plan" ? use.most : null;
    meters.push({
      label,
      used: most === 0 ? "" : say(use.used),
      of:
        most === null
          ? "Unlimited"
          : most === 0
            ? "Not on this plan"
            : `of ${say(most)}`,
      full:
        most === null ? null : most === 0 ? 0 : Math.min(use.used / most, 1),
    });
  }
  return meters;
}

const KIND_WORDS: Record<Exclude<HeldKind, "seats">, string> = {
  items: "items",
  collections: "crates",
  research_references: "research references",
  storage_bytes: "photos",
};

const listed = (words: string[]) =>
  words.length < 2
    ? (words[0] ?? "")
    : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;

/**
 * What moving down to a plan would do, said before the button: the pricing
 * page's two rules (work over a limit stays, a team over the seats is
 * removed). Empty when the production fits, or when it could not be read.
 */
function oversOf(
  plan: Plan,
  usage: Usage | null,
  limits: Limits | null,
): string[] {
  const held = limits?.[plan];
  if (!usage || !held) return [];
  const over = (kind: HeldKind) =>
    held[kind] !== null && (usage[kind]?.used ?? 0) > held[kind];
  const lines: string[] = [];
  if (over("seats")) {
    lines.push(
      `Your team is bigger than ${planLabel(plan)} allows, so its members are removed. They can be invited again up to the limit.`,
    );
  }
  const kinds = (Object.keys(KIND_WORDS) as (keyof typeof KIND_WORDS)[]).filter(
    over,
  );
  if (kinds.length > 0) {
    lines.push(
      `You have more ${listed(kinds.map((kind) => KIND_WORDS[kind]))} than ${planLabel(plan)} holds. They all stay, and you can add more once you’re back under.`,
    );
  }
  return lines;
}

/** Why a move went nowhere, in the page's words. */
function sayMove(move: Move): string | null {
  switch (move.kind) {
    case "open":
    case "signed-out":
      return null;
    case "same":
      return "Your production is already on that plan.";
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
  const [usage, setUsage] = useState<Usage | null>(null);
  const [limits, setLimits] = useState<Limits | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  // The notice is good news: the plan it paid for has arrived.
  const [won, setWon] = useState(false);

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
      // The confirm moved the plan itself, so one more read usually has it.
      const now = await readPlan(back.id, session.user.id);
      if (now.kind === "read" && now.production.tier === paid) {
        setSettling(null);
        setRead(now);
        setWon(true);
        return setNotice(`Your production is on ${plan}.`);
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
        setWon(true);
        setNotice(`Your production is on ${plan}.`);
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

  // What it has used, read again when the plan moves: the plan's numbers move with it.
  const shown = read?.kind === "read" ? read.production : null;
  const shownId = shown?.id ?? null;
  const shownTier = shown?.tier ?? null;
  useEffect(() => {
    if (!shownId) return;
    let gone = false;
    void Promise.all([
      readUsage(shownId),
      readLimits(),
      readCounts(shownId),
    ]).then(([u, l, c]) => {
      if (gone) return;
      setUsage(u);
      setLimits(l);
      setCounts(c);
    });
    return () => {
      gone = true;
    };
  }, [shownId, shownTier]);

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
      <Column production={production} counts={counts}>
        <PlanRow production={production}>
          Only the production’s owner changes its plan.
        </PlanRow>
        <UsageList usage={usage} />
      </Column>
    );
  }

  const go = async (move: Promise<Move>, what: Plan | "billing") => {
    if (busy || !userId) return;
    setBusy(what);
    setNotice(null);
    setWon(false);
    const answer = await move;
    if (answer.kind === "open") return window.location.assign(answer.url);
    setBusy(null);
    if (answer.kind === "signed-out") return toSignIn();
    setNotice(sayMove(answer));
    // "Same" can be news: a checkout already paid was found and taken.
    if (answer.kind === "same") {
      const now = await readPlan(production.id, userId);
      if (now.kind === "read") setRead(now);
    }
  };

  const enterprise = production.tier === "enterprise";
  const idle = busy === null && settling === null;
  const failed = isLive(billing) && billing.status === "past_due";

  const going = (what: Plan | "billing") =>
    what !== "billing" && isUp(what, production.tier)
      ? "Taking you to payment"
      : "Taking you to billing";

  /** A button that moves the plan, or opens billing. */
  const act = (
    what: Plan | "billing",
    label: string,
    look: "ink" | "line" | "text" = "line",
  ) => (
    <button
      key={what}
      type="button"
      className={
        look === "text"
          ? "acct-text"
          : `acct-btn${look === "ink" ? " ink" : ""}`
      }
      disabled={!idle}
      aria-busy={busy === what}
      onClick={() =>
        void go(
          what === "billing"
            ? manageBilling(production.id)
            : movePlan(production.id, what),
          what,
        )
      }
    >
      {/* Pressed, the button says where it is taking them: to pay for a plan above, or to billing for anything else. */}
      {busy !== what ? (
        label
      ) : look === "text" ? (
        `${going(what)}…`
      ) : (
        <>
          <span className="acct-spin" aria-hidden="true" />
          {going(what)}
        </>
      )}
    </button>
  );

  // The plans above this one are offered, a card each; those below are moved to from the page's foot.
  const ups = enterprise
    ? []
    : PLANS.filter((p) => isUp(p.plan, production.tier));
  const downs =
    enterprise || ending
      ? []
      : PLANS.filter(
          (p) => p.plan !== production.tier && !isUp(p.plan, production.tier),
        ).reverse();
  // What moving down would do: for a plan already cancelled, what Free will.
  const overs = (ending ? PLANS.filter((p) => p.plan === "free") : downs)
    .filter(() => production.tier !== "free")
    .flatMap(({ plan }) => {
      const lines = oversOf(plan, usage, limits);
      return lines.length > 0 ? [{ plan, lines }] : [];
    });

  return (
    <Column production={production} counts={counts}>
      <PlanRow
        production={production}
        status={
          settling ? (
            <span className="acct-status" role="status">
              <span className="acct-spin" aria-hidden="true" />
              {settling}
            </span>
          ) : notice ? (
            <span className="acct-status" role={won ? "status" : "alert"}>
              {won && <Icon name="check" className="acct-tick" />}
              {notice}
            </span>
          ) : null
        }
        actions={
          enterprise ? null : (
            <>
              {billing?.status &&
                act(
                  "billing",
                  failed ? "Update card" : "Manage billing",
                  failed ? "ink" : "line",
                )}
              {/* Cancelled, it is kept from the portal's own page (`movePlan` sends it there). */}
              {ending &&
                production.tier !== "free" &&
                act(
                  production.tier as Plan,
                  `Keep ${planLabel(production.tier)}`,
                  "ink",
                )}
            </>
          )
        }
      />

      {ups.map(({ plan, price, holds }) => (
        <section key={plan} className="acct-box">
          <div className="acct-row">
            <div>
              <h2>Upgrade to {planLabel(plan)}</h2>
              <p>{price} a month</p>
            </div>
            <div className="acct-row-acts">
              <a
                className="acct-text"
                href="/pricing/"
                target="_blank"
                rel="noreferrer"
              >
                Compare plans
              </a>
              {act(plan, "Upgrade now", failed ? "line" : "ink")}
            </div>
          </div>
          <ul className="acct-holds">
            {holds.map((line) => (
              <li key={line}>
                <Icon name="check" className="acct-tick" />
                {line}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Above every plan with a price: always here, so the way to it is never in doubt. */}
      {!enterprise && (
        <section className="acct-box">
          <div className="acct-row">
            <div>
              <h2>Enterprise</h2>
              <p>For studio productions, priced with each one.</p>
            </div>
            <a className="acct-btn" href="/contact/">
              Contact us
            </a>
          </div>
          <ul className="acct-holds">
            {ENTERPRISE.map((line) => (
              <li key={line}>
                <Icon name="check" className="acct-tick" />
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {overs.map(({ plan, lines }) => (
        <section key={plan} className="acct-box">
          <div className="acct-row">
            <div>
              <h2>
                {ending
                  ? `On ${planLabel(plan)} from ${dayOf(ending)}`
                  : `Before you move to ${planLabel(plan)}`}
              </h2>
              <p>{lines.join(" ")}</p>
            </div>
          </div>
        </section>
      ))}

      <UsageList usage={usage} />

      {!enterprise && (
        <p className="acct-plan-note">
          Paid by card through Stripe. A plan you cancel runs to the end of the
          month you’ve paid for, then moves to Free.
          {downs.map(({ plan }) => (
            <span key={plan}>
              {" "}
              {act(
                plan,
                plan === "free" ? "Cancel plan" : `Move to ${planLabel(plan)}`,
                "text",
              )}
            </span>
          ))}
        </p>
      )}
    </Column>
  );
}

/** The plan the production is on: its name and standing, its actions at the row's end. */
function PlanRow({
  production,
  status,
  actions,
  children,
}: {
  production: PlanRead;
  /** What is happening or just happened, said in the standing line's place so nothing on the page moves. */
  status?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const billing = production.billing;
  const live = production.tier !== "free" && isLive(billing);
  const failed = live && billing.status === "past_due" && !billing.endsAt;
  const chip =
    live && billing.endsAt
      ? `Ends ${dayOf(billing.endsAt)}`
      : failed
        ? "Payment failed"
        : "Current";
  return (
    <section className={`acct-box${failed ? " bad" : ""}`}>
      <div className="acct-row">
        <div>
          <h2>
            {planLabel(production.tier)} plan
            <span
              className={`acct-chip${failed ? " bad" : chip !== "Current" ? " strong" : ""}`}
            >
              {chip}
            </span>
          </h2>
          <p>
            {status ?? (
              <>
                {standing(production)}
                {children && <> {children}</>}
              </>
            )}
          </p>
        </div>
        {actions && <div className="acct-row-acts">{actions}</div>}
      </div>
    </section>
  );
}

/** What it has used of its plan: a row per kind, its bar between the name and the number. */
function UsageList({ usage }: { usage: Usage | null }) {
  const meters = usage ? metersOf(usage) : [];
  if (meters.length === 0) return null;
  return (
    <>
      <h2 className="acct-plan-head">Usage</h2>
      <ul className="acct-box acct-meters">
        {meters.map(({ label, used, of, full }) => (
          <li key={label}>
            <span className="acct-meter-label">{label}</span>
            <span className="acct-meter-bar" aria-hidden="true">
              {full !== null && full > 0 && (
                <span style={{ width: `${Math.round(full * 100)}%` }} />
              )}
            </span>
            <span className="acct-meter-used">
              {used && <b>{used}</b>} {of}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** "3 October 2026": a day with its year, for a date that stands alone. */
const fullDay = (stamp: string) =>
  new Date(stamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** The page: the production in a pane on the left, so whose plan this is is never in doubt, and the plan beside it. */
function Column({
  production,
  counts,
  title = "Plan and billing",
  children,
}: {
  production?: PlanRead;
  counts?: Counts | null;
  title?: string;
  children: ReactNode;
}) {
  const figures: [string, number | null | undefined][] = [
    ["Scenes", counts?.scenes],
    ["Characters", counts?.characters],
    ["Items", counts?.items],
    ["Photos", counts?.photos],
    ["Team", counts?.team],
  ];
  return (
    <section className="acct acct-wide acct-plan">
      <div className="acct-col">
        <aside className="acct-side">
          <a className="acct-back" href="/productions/">
            <span className="acct-chevron" aria-hidden="true" />
            Your productions
          </a>
          {production && (
            <>
              <p className="acct-side-label">Production</p>
              <p className="acct-side-name">{nameOf(production)}</p>
              {production.type && production.type !== "Other" && (
                <p className="acct-side-type">{production.type}</p>
              )}
              <dl className="acct-figures">
                {figures.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value == null ? "" : count(value)}</dd>
                  </div>
                ))}
              </dl>
              <dl className="acct-dates">
                {production.startDate && (
                  <div>
                    <dt>Filming from</dt>
                    <dd>{fullDay(production.startDate)}</dd>
                  </div>
                )}
                {production.endDate && (
                  <div>
                    <dt>Filming to</dt>
                    <dd>{fullDay(production.endDate)}</dd>
                  </div>
                )}
                {production.createdAt && (
                  <div>
                    <dt>Made</dt>
                    <dd>{fullDay(production.createdAt)}</dd>
                  </div>
                )}
              </dl>
            </>
          )}
        </aside>
        <div className="acct-main">
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </section>
  );
}
