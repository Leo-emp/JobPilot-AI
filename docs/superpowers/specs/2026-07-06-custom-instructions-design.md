# Custom Instructions for Resume Actions

**Date:** 2026-07-06
**Status:** Approved

## Summary

Add an optional "Custom Instructions" textarea to Quick Optimize, Full Rebuild, and Career Pivot tabs in Resume Intelligence. Users type free-form instructions about what they want changed in their resume content (e.g., "emphasize leadership", "remove internship", "add more metrics"). The AI follows these instructions while preserving its standard formatting rules and resume structure.

## Key Constraint

Custom instructions affect **content decisions only** — what to emphasize, reword, remove, or add. They do NOT change resume structure, section order, formatting rules, or markdown output format. The existing `RESUME_RULES` remain the highest-priority formatting layer.

## Changes

### 1. UI — `src/app/dashboard/resume/page.tsx`

- Add `customInstructions` state (`useState("")`)
- Add a textarea to the **optimize**, **rebuild**, and **pivot** tab sections
- Position: below existing fields, above the action button
- Placeholder: `"Optional: Tell the AI what to change (e.g. emphasize leadership experience, remove internship section, add more quantified metrics...)"`
- The field is always optional — never gates the action button
- Pass `customInstructions` in the payload alongside existing fields

### 2. Payload — `callAI` function in page.tsx

Add `customInstructions` to the payload when non-empty:

```ts
if (customInstructions.trim()) {
  payload.customInstructions = customInstructions;
}
```

### 3. Prompts — `src/lib/prompts/resume.ts`

Append a guarded block to `optimizeResume`, `rebuildResume`, and `careerPivot` when `payload.customInstructions` is present:

```
USER INSTRUCTIONS (CONTENT ONLY):
The user has provided specific instructions below. Apply these to CONTENT decisions only — what to emphasize, reword, remove, or add. Do NOT change the resume structure, section order, formatting rules, or output format. The RESUME_RULES above always take priority for structure and formatting. If a user instruction conflicts with formatting rules, keep the formatting and adapt the content.

User's instructions:
{customInstructions}
```

### 4. API Routes — No changes needed

Both `/api/ai/stream/route.ts` and `/api/ai/route.ts` already pass the full `payload` object to `buildPrompt()`. The `customInstructions` field flows through automatically — no route changes required.

### 5. Validation — `src/lib/validations.ts`

Add `customInstructions` as an optional string field to the `aiSchema` Zod schema (max 2000 characters).

## Files to Modify

| File | Change |
|------|--------|
| `src/app/dashboard/resume/page.tsx` | Add state + textarea to 3 tabs + pass in payload |
| `src/lib/prompts/resume.ts` | Append custom instructions block to 3 prompt functions |
| `src/lib/validations.ts` | Add optional `customInstructions` field to `aiSchema` |

## What Does NOT Change

- Analyze Resume tab (no custom instructions — it's a scoring tool)
- Resume output format (same structured markdown)
- `RESUME_RULES` priority (always enforced for structure/formatting)
- AI model, temperature, caching, rate limits
- API route logic
- Career context injection
