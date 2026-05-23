# Quality Gate Checklist Template

## Git
- [ ] git status captured
- [ ] diff stat captured
- [ ] diff check passed
- [ ] untracked files accounted

## TypeScript / Build
- [ ] pnpm -w exec tsc --noEmit
- [ ] build/lint if applicable

## Architecture
- [ ] no direct Tamagui outside ui-kit
- [ ] no local design system
- [ ] no WLT mutation outside WLT
- [ ] no auth duplication

## UI/UX
- [ ] screenshot
- [ ] RTL
- [ ] overflow/clipping
- [ ] state coverage

## Contract
- [ ] OpenAPI validated
- [ ] operationId
- [ ] schemas
- [ ] auth/security
- [ ] errors
- [ ] pagination/on-demand if needed

## Runtime
- [ ] request/response
- [ ] backend log
- [ ] DB proof
- [ ] Postman evidence

## Security
- [ ] permission check
- [ ] denial state
- [ ] no secrets
- [ ] audit if needed

## Cross-surface
- [ ] app-client
- [ ] app-partner
- [ ] app-captain
- [ ] app-field
- [ ] control-panel
- [ ] WLT/Auth/Vars impact checked
