# Fix All Build Issues Implementation Plan

## Repository Research
- Stack: Next.js 15 App Router (next.config.ts, `src/app/`) with TypeScript strict mode, Tailwind, `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` for Cloudflare R2.
- Observed current state as of baseline:
  - `npx tsc --noEmit` — **exits 0** (no type errors).
  - `npx next build` — **exits 0** (produces a successful build), but emits many ESLint warnings in its output (Next treats these as warnings, not build-failing errors).
  - `npx eslint . --ext .ts,.tsx` — **exits non-zero** because of 1 error + 84 warnings. The single **error** is the only one that will fail a typical CI build that runs standalone ESLint (as opposed to the `next lint` embedded step that Next ran during build):
    - `src/app/api/upload-consent/route.ts:46:15 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any`
  - The remaining 84 items reported by ESLint are categorized as:
    - **Unused eslint-disable directives** (~10 files): disable comments in files that no longer trigger the targeted rule.
    - **@typescript-eslint/no-unused-vars** (~40 occurrences): unused imports, destructured params, return-value bindings, callback args like `value`/`i`/`index`/`res`/`navigate`/`loading`/`charges`/`currencySymbol` etc.
    - **react-hooks/exhaustive-deps** (~15 occurrences): missing dependencies in useEffect arrays across dashboard/onboarding/profile sections.

Important distinction the plan must respect: the user said "fix all build issues". **Build (`next build`) is actually passing today**, so scope depends on whether the user's CI pipeline additionally runs a strict standalone ESLint step (which would fail due to the single `any` error and possibly due to treating warnings-as-errors). This plan fixes the hard lint error and upgrades the warning categories so a strict CI (`eslint --max-warnings=0` or future Next default changes) will not break. Because modifying useEffect dependency arrays across ~15 components is behavioral, the plan provides two explicit treatment options below (safe vs behavioral) and defaults to the safe option that preserves behavior exactly while still silencing the warning with documented eslint-disable-next-line comments at each affected site.

## Files and Modules
- `src/app/api/upload-consent/route.ts` — Replace the `catch (e: any)` typing with a typed `unknown` + `message` extraction so `@typescript-eslint/no-explicit-any` is resolved (the only ESLint **error**).
- All files flagged by the current ESLint run for **Unused eslint-disable directives** and **unused vars/imports/params/args** (see the list below for exact files) — remove stale disable comments; remove unused imports; for destructured params/args/callback-args that are part of a typed interface intentionally (e.g., `value`, `i`, `index`, `res`, `onClose`, `navigate`, `showPreview`, `setShowPreview`, `charges`, `currencySymbol`, `getProviders`, `validateRSA`, `showForm`, `setShowForm`, `setTxtPin`, `handleWithdrawal`, `selectedOption`, `setSelectedOption`, `list`, `setList`, `setList`, `loading`, `details`, `activate`, `remaining`, `HistorySection`, `BaseLoader`, `useHttpHook`, `useRouter`, `useEffect`, `useState`, `RouteItem`, `ROUTES`, icon imports `RemitIcon/UserIcon/WithdrawalIcon`, `setBtns` across 3 tabs components):
  - Prefer **removing the unused binding where obviously dead code**.
  - If removing would break a public prop type contract that callers enforce (e.g., a component prop defined in a JSX interface that callers pass by positional spread, OR a `.map((item,i)=>...)` signature), **rename it to an underscore-prefixed variant** (e.g., `(_value)`, `(_i,_index)`, `{onClose: _onClose}`) to keep intent visible while satisfying `@typescript-eslint/no-unused-vars`.
- All files flagged for `react-hooks/exhaustive-deps`:
  - Default safe treatment: add an `// eslint-disable-next-line react-hooks/exhaustive-deps` comment **immediately above** the offending useEffect line **and** a trailing short inline comment `// intentionally empty deps: mounted-only trigger` / `// intentionally missing deps: avoids re-trigger loops` (describe intent, per site) so reviewers know the omission is deliberate, not accidental.
  - *Alternative behavioral treatment (not default)*: actually add the deps + wrap referenced handlers in `useCallback` / wrap objects in `useMemo` where appropriate to avoid infinite loops. This is higher-risk because it changes render/re-fetch cadence across user-onboarding, dashboard stats, and RSA PIN polling flows. The plan defaults to safe treatment unless the user explicitly opts into the behavioral pass.

Affected file list (from ESLint output, for reference):
- Unused-disable-directive files (~10): `src/app/dashboard/profile/page.tsx`, `src/app/dashboard/profile/components/password-modal.tsx`, `src/app/dashboard/remit/components/payment_option_modal.tsx`, `src/app/dashboard/remit/page.tsx`, `src/app/dashboard/user-onboarding/components/employment.tsx`, `src/app/dashboard/user-onboarding/components/imagePickerOption.tsx`, `src/app/dashboard/user-onboarding/components/parentDetails.tsx`, `src/app/dashboard/users/components/Tabs.tsx`, `src/app/components/baseDropDown/index.tsx`, `src/app/components/baseInputDate/index.tsx`, `src/app/components/baseOTPInput/index.tsx`
- Unused-vars/imports/params/args files (~35 files): see earlier ESLint listing — all files with `@typescript-eslint/no-unused-vars` entries, including `Navbar/slider/slideItem.tsx`, `baseLoader/index.tsx`, `baseSelect/index.tsx`, `baseHorizontalIndicator/index.tsx`, commission/Tabs.tsx, commission/walletBalanceSection.tsx, commission/page.tsx, confirmPaymentAmountModal.tsx, featuresButtonSection.tsx, history.tsx, performanceSection.tsx, users.tsx, dashboard/history/page.tsx, dashboard/layout.tsx, profile/Tabs.tsx, profile/password-modal.tsx, profile/txt-pin-modal.tsx, remit/page.tsx, save-bank-account/page.tsx, select-bank-account/page.tsx, user-onboarding/{bankDetails,employment,nextOfKin,payment}.tsx, includes/functions.ts (L98 catch error unused), etc.
- exhaustive-deps files (~15): add-account/page.tsx, commission/Tabs.tsx, commission/walletBalanceSection.tsx, checkRSAStatusComponent.tsx, commission.tsx, performanceSection.tsx, users.tsx, dashboard/page.tsx, profile/Tabs.tsx, profile/txt-pin-modal.tsx, save-bank-account/page.tsx, user-onboarding/{bankDetails,employment,otpSection,payment}.tsx, users/Tabs.tsx.

## Implementation Steps
1. **Fix the single hard ESLint error first** — `upload-consent/route.ts` L46:
   - Change the catch signature to `(e: unknown)` and then extract a message with standard `e instanceof Error ? e.message : String(e ?? "Unknown error")`. This also matches how nearby routes already format error messages.
2. **Clean up stale eslint-disable directives** in the ~10 files listed above — only remove the specific directive lines reported as unused; do not blanket delete all disables.
3. **Resolve unused imports** — delete the `import ...` lines that correspond to unused symbols (e.g., icons, `useRouter`, `HistorySection`, `RouteItem`, `ROUTES`, unused hooks like `useCallback/useEffect/useState/useHttpHook`).
4. **Resolve unused local variables / return bindings** (e.g., `charges`, `currencySymbol`, `showPreview`/`setShowPreview`, `setTxtPin`, `handleWithdrawal`, `selectedOption`/`setSelectedOption`, `list`/`setList`, `setList` in baseHorizontalIndicator, `remaining`/`activate` in layout, `loading` in txt-pin-modal, `error` in functions.ts L98):
   - Delete the declaration entirely when it is dead code AND removing it cannot affect semantics.
   - Otherwise prefix with `_` (e.g., `const _charges = ...`, `const _ = fn()`).
5. **Resolve unused destructured props / callback args** (`onClose`, `navigate`, `res`, `value`, `i`, `index`, `details`, `id`, `title`, `description`, `graphics`, `color` etc.):
   - Where the variable is a positional parameter or a prop contract, **rename the destructured/param binding to underscore prefix** (e.g., `{onClose: _onClose}`, `(_i)`, `(_value,_index)`, `({id:_id,...})`) so signatures stay compatible with caller expectations and type definitions remain intact.
   - Only remove the destructured key if the type signature for the callback/component does not require it (err on the side of `_` rename to avoid accidental interface changes).
6. **Resolve exhaustive-deps warnings (SAFE path, default)** — for every `useEffect` flagged by ESLint:
   - Insert a line immediately above `useEffect(...` with:
     ```
     // eslint-disable-next-line react-hooks/exhaustive-deps // intent: <one-liner per site, e.g. mounted-only / polling interval / avoids stale closures>
     ```
   - Do not mutate the dependency array. This preserves current runtime behavior 100%.
7. **Post-fix verification**:
   - `npx eslint . --ext .ts,.tsx` — expect `0 errors, 0 warnings`.
   - `npx tsc --noEmit` — must remain `0`.
   - `npx next build` — must succeed with no warnings printed in its ESLint summary section.
8. **Optional (opt-in only) behavioral pass**:
   - If the user approves a behavioral follow-up, go through the exhaustive-deps sites and add missing dependencies, wrapping handlers/objects in `useCallback`/`useMemo` where needed to prevent infinite loops, and test each affected page's fetch flow. This is a separate step intentionally left out of the default fix-all to avoid runtime regressions.

## Dependencies and Considerations
- No new npm deps. Relies on existing `@typescript-eslint/eslint-plugin` rule set already wired in `eslint.config.mjs`.
- The R2 upload presign flow (consent.tsx + upload-consent route) must keep working because `next build` already succeeded for it; the only route.ts change is typings in the catch block.
- Risk of over-aggressive removal: removing a prop from a destructured parameter without the `_` prefix can cause type incompatibilities at call sites that still pass that prop (TypeScript won't complain if it's an extra prop unless exactOptionalTypes or `exact` is on, but ESLint/TS won't catch call sites that relied on destructuring). Hence **prefix-with-underscore is the default strategy for props/params, not deletion**.
- exhaustive-deps is a **runtime correctness** rule; the chosen safe path silences warnings while preserving current behavior. The tradeoff is: possible subtle stale-closure bugs that already exist remain, but we avoid introducing new regressions during a "make CI green" pass.

## Validation
- `npx eslint . --ext .ts,.tsx` — 0 errors, 0 warnings.
- `npx tsc --noEmit` — 0 errors.
- `npx next build` — successful production build (exit 0) with no ESLint warnings in the output log.

## Risks
- **Risk (behavioral)**: exhaustive-deps default fix does not fix real stale closures. Mitigation: disable-next-line comments record deliberate intent; offer an optional behavioral follow-up pass.
- **Risk (semantic)**: accidental removal of a prop that is actually used via object rest spread or elsewhere in a file. Mitigation: for every unused-vars site, first `Grep` for the symbol within the same file and its immediate callers before deleting; prefer `_` rename to actual deletion for parameter/prop positions. Then full tsc + build + lint validates.
- **Risk (stale-disable cleanup)**: accidentally removing a disable that *is* used in certain environments (e.g., react rules that fire only in JSX). Mitigation: only remove the specific directive lines reported by ESLint as "Unused eslint-disable directive"; do not invent or guess.
