# Script page (later)

A page of its own, e.g. `/product/script/`, linked from the home page's
"Analyse the script" step and the Redrafts section. Not on the home page.
Every claim below is something `script-analysis-rs` and the app do today
(parser `MergeSuggestion`, `BackgroundCandidate`, `reconcile.rs`; app
`script/names.tsx`, `script/merge.tsx`).

## Analyse the script

Drop in a PDF, a Final Draft file or plain text. StageRoll reads it on your
phone and turns it into scenes, characters and a running order. Nothing joins
the production until you've checked it.

1. **Read on your phone.** The script is never sent off to be analysed. It
   copes with messy PDFs too: scanned pages, odd typing in scene headings.
2. **Names, cleaned up.** Spots one character written several ways and
   suggests merging them:
   - a misread letter: SKINNER and SNINNER
   - a rank or title: DR. HATCHER and HATCHER, PC WALKER and WALKER
   - a fuller name: OMI and KASHIGI OMI

   The safe ones arrive already ticked; the judgement calls (fuller names)
   are left for you. Names that are genuinely different stay apart (HAMNET
   and HAMLET, both speaking a lot). Any character can also be merged into
   another by hand.
3. **Cast and background, counted.** Characters are ranked and given cast
   numbers. Groups that speak together (WEDDING GUESTS) are marked as groups.
   Crowds the action describes but who never speak are picked up as
   background, with the number the script asks for: "A DOZEN WEDDING GUESTS"
   counts as 12.
4. **Redrafts without the rework.** Each scene in the new draft is matched to
   the one you already have, and what changed is spelled out. Renames are
   caught and remembered for later drafts; two characters swapping names is
   flagged so their wardrobes don't swap with them.
5. **You have the final say.** Anything uncertain is put to you, nothing is
   applied without your approval, and old drafts are kept.

Note: the background headcount isn't mentioned anywhere on the home page yet.
