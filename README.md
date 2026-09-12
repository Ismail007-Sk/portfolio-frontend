portfolio-frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── ...
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── experience/
│   │   │   │   └── page.tsx
│   │   │   ├── skills/
│   │   │   │   └── page.tsx
│   │   │   ├── certificates-education/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── achievements/
│   │   │   │   └── page.tsx
│   │   │   ├── certifications/
│   │   │   │   └── page.tsx
│   │   │   ├── education/
│   │   │   │   └── page.tsx
│   │   │   ├── experience/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   └── skills/
│   │   │       └── page.tsx
│   │   │
│   │   └── auth/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── navbar.module.css
│   │   │   ├── footer.tsx
│   │   │   └── footer.module.css
│   │   │
│   │   └── shared/
│   │       ├── loading.tsx
│   │       ├── loading.module.css
│   │       ├── error-message.tsx
│   │       └── error-message.module.css
│   │
│   ├── context/
│   │   ├── auth-context.tsx
│   │   └── auth.types.ts
│   │
│   ├── hooks/
│   │   └── use-auth.ts
│   │
│   ├── features/
│   │   ├── profile/
│   │   │   ├── profile.api.ts
│   │   │   └── profile.types.ts
│   │   ├── projects/
│   │   │   ├── project.api.ts
│   │   │   └── project.types.ts
│   │   ├── services/
│   │   │   ├── service.api.ts
│   │   │   └── service.types.ts
│   │   ├── experience/
│   │   │   ├── experience.api.ts
│   │   │   └── experience.types.ts
│   │   ├── education/
│   │   │   ├── education.api.ts
│   │   │   └── education.types.ts
│   │   ├── auth/
│   │   │   ├── auth.api.ts
│   │   │   └── auth.types.ts
│   │   ├── skills/
│   │   │   ├── skill.api.ts
│   │   │   └── skill.types.ts
│   │   ├── achievements/
│   │   │   ├── achievement.api.ts
│   │   │   └── achievement.types.ts
│   │   └── certificates/
│   │       ├── certificate.api.ts
│   │       └── certificate.types.ts
│   │
│   └── lib/
│       ├── api-client.ts
│       └── api.types.ts
│
├── .env.local
├── .env.example
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── package.json
└── README.md