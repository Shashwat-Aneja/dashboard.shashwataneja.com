# Dashboard

A shared client and administration workspace for Shashwat Aneja Studio.

## Product direction

- **Client workspace:** projects, requirements, tasks, communication, deliverables, approvals, payments, and activity.
- **Admin workspace:** client management, project operations, tasks, finance, analytics, and configuration.
- **Design system:** Xylo Editorial, with expressive visual hierarchy and light/dark themes.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Custom CSS design system

## Development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run build
```

## Git workflow

- `main` is the production baseline.
- All application development happens on feature branches.
- Changes are proposed through pull requests.
- Do not commit application work directly to `main`.

## Current foundation

The first UI pass includes the responsive application shell, admin/client workspace switcher, light/dark theme persistence, navigation state, dashboard metrics, project progress, revenue visualisation, follow-up items, and recent activity.

The current dashboard data is illustrative and must be replaced by authorised backend data before production use. Authentication, role enforcement, database access, and Studio integration are not yet implemented.


## Authentication

The Dashboard uses Supabase Auth with email/password sign-in. Client accounts are provisioned after Studio confirms a Razorpay payment through its signed webhook. Invitation links redirect to `/auth/set-password`; clients set their own password. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project. Set `app_metadata.role=admin` only from a trusted server or Supabase dashboard for administrator accounts. The browser never decides admin access from user-editable metadata.
