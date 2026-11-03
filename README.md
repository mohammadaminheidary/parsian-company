# Parsian UPVC Workshop — Official Website

**Official landing page website for Parsian UPVC Workshop.**

[راهنمای کامل فارسی](README.fa.md)

> **Public repository · Proprietary project · All rights reserved**  
> This repository is publicly visible for presentation and portfolio purposes only. Its source code, original designs, and content are **not open source** and may not be reused without prior written permission. See [LICENSE](LICENSE).

## Project overview

This project is intended to be the official online presence of **Parsian UPVC Workshop**, giving prospective customers a clear introduction to the workshop and a convenient way to explore its products, services, completed work, and contact information.

**Current status:** The home route renders a responsive Persian RTL header and workshop hero, with a local Vazirmatn font, shared Tailwind design tokens, and optimized images. The mobile menu supports keyboard navigation, scroll locking, and reduced motion. Products, services, portfolio, about, contact, and quotation destinations are not implemented; their controls are marked unavailable. Contact details remain placeholders. No custom Django app, inquiry form, or production deployment is included.

## About Parsian UPVC Workshop

Parsian UPVC Workshop is the business represented by this website. The planned website will present the workshop's identity, UPVC-related offerings, services, and project portfolio. Specific product specifications, service areas, certifications, business claims, and contact details will be published only after confirmation by the project owner.

## Objectives

- Establish a professional, trustworthy digital presence for the workshop.
- Help visitors understand the available products and services.
- Present a curated selection of completed projects with approved images and descriptions.
- Make business contact details and inquiry options easy to find.
- Prioritize a responsive, accessible, performant, and search-friendly experience.
- Maintain a clean codebase that can be expanded without unnecessary complexity.

## Planned website sections and features

The following items describe the intended full website. The header and home hero are implemented; the remaining sections are planned.

| Section | Planned purpose |
| --- | --- |
| Home | Introduce the workshop, highlight core offerings, and direct visitors to relevant sections. |
| About | Explain the workshop's background, approach, and strengths using owner-approved information. |
| Products | Present product categories, photographs, and verified specifications. |
| Services | Describe services and the process for requesting information or a quotation. |
| Projects / Gallery | Showcase approved examples of completed work with photos and concise context. |
| Contact | Display approved contact channels, business location, and a clear inquiry route. |

**Cross-cutting priorities (planned):** mobile-first layouts, intuitive navigation, semantic HTML, accessible controls, optimized media, basic SEO metadata, and maintainable content organization. Any contact form or third-party integration will require an explicit implementation and appropriate privacy/security review.

## Technology stack

| Layer | Installed technology |
| --- | --- |
| Backend | Python 3.13.15, Django 6.1.2 |
| Templates | Django templates with semantic HTML5 |
| Styling | Tailwind CSS 4.3.3 and official `@tailwindcss/cli` 4.3.3 |
| Browser logic | Vanilla JavaScript (ES modules / ES6+) |
| Local database | SQLite, through Django's ORM |
| Future database | PostgreSQL settings available through environment variables |
| Frontend build tools | Node.js 24.19.0 and npm 11.17.0 used for installation |
| Environment configuration | python-dotenv 1.2.4 |

Python dependencies, including Django's transitive dependencies, are pinned in `backend/requirements.txt`. Frontend dependencies are pinned in `frontend/package.json` and `frontend/package-lock.json`. Node.js is only needed to build/watch CSS; Django renders and serves the application during development. No frontend framework or JavaScript bundler is required.

## Repository structure

```text
parsian-company/
├── backend/
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py       # Environment, database, frontend paths
│   │   ├── urls.py           # Home template route and Django admin
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── .env                 # Local secrets; ignored by Git
│   ├── .env.example
│   ├── db.sqlite3           # Local database; ignored by Git
│   ├── staticfiles/         # Collected deployment assets; ignored by Git
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── assets/css/input.css # Tailwind v4 sources, tokens, font, and animations
│   ├── templates/base.html  # Shared RTL shell, header, and home hero
│   ├── static/
│   │   ├── css/app.css      # Generated locally; ignored by Git
│   │   ├── js/app.js        # Header initialization (header.js)
│   │   ├── fonts/vazirmatn/ # Local font and OFL license
│   │   └── images/          # Logo and optimized hero images
│   ├── package.json
│   └── package-lock.json
├── .gitignore
├── package.json             # Root npm development/build shortcuts
├── run.py                   # Start backend, Tailwind, and browser
├── LICENSE
├── README.fa.md
└── README.md
```

The root `.venv/` is the local Python environment; `frontend/node_modules/` holds frontend build dependencies. Both are ignored by Git. Backend configuration lives in `backend/`; frontend sources live in `frontend/`. Django resolves frontend paths relative to its settings file. Collected deployment assets go to `backend/staticfiles/`. Never edit `frontend/static/css/app.css` directly.

## Installation and local development

### Prerequisites

- Python 3.12–3.14 (Python 3.13 was used here), with `venv` and pip
- Node.js 22 or newer and npm
- Git

### Set up a fresh checkout

```bash
git clone https://github.com/mohammadaminheidary/parsian-company.git
cd parsian-company
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
npm --prefix frontend ci
cp backend/.env.example backend/.env
python -c "from secrets import token_urlsafe; from dotenv import set_key; set_key('backend/.env', 'DJANGO_SECRET_KEY', token_urlsafe(64))"
python backend/manage.py migrate
npm --prefix frontend run build:css
```

The existing local environment has already been installed, `backend/.env` generated, and its database migrated. Do not replace an existing `backend/.env` or rotate its secret during normal startup. Django loads `backend/.env` automatically; already exported environment variables take precedence. Debug mode defaults to off if `DJANGO_DEBUG` is absent. A nonempty `DJANGO_SECRET_KEY` is required.

### Start development

From the repository root:

```bash
python3 run.py
```

The launcher uses the project's `.venv` without manual activation. It starts Django and waits for an HTTP response, builds CSS, starts Tailwind watch mode and waits for its initial build, then opens the default browser at [the local website](http://127.0.0.1:8000/). The page displays the header and hero. Press `Ctrl+C` to stop both processes. If either process fails, the other is stopped too.

Optional arguments:

```bash
python3 run.py --port 8001
python3 run.py --no-browser
```

Django reloads when Python code changes. Tailwind rebuilds CSS from frontend templates and static JavaScript; browser refresh remains manual. Frontend assets are served by Django during development, so no separate frontend HTTP server is needed.

To run each part independently:

```bash
source .venv/bin/activate
python backend/manage.py runserver
```

In another terminal:

```bash
npm --prefix frontend run watch:css
```

`npm run dev` from the root or `npm --prefix frontend run dev` starts the full Django/Tailwind launcher. Use `npm --prefix frontend run watch:css` for the standalone watcher. Root `npm run build`, `npm run build:css`, and `npm run watch:css` forward to the frontend scripts; install dependencies in `frontend/` as shown above.

The input is `frontend/assets/css/input.css`; output is `frontend/static/css/app.css`. Add `@source` entries if future templates live elsewhere, and use complete utility names for Tailwind discovery. The JavaScript entry point initializes `frontend/static/js/header.js`. Templates are composed from `frontend/templates/includes/`.

Original brand/hero assets live in `frontend/assets/image/`; browser assets live in `frontend/static/images/`. The local font and its SIL Open Font License are in `frontend/static/fonts/vazirmatn/`.

### Build and verify

```bash
npm --prefix frontend run build:css
python backend/manage.py check
python backend/manage.py migrate --check
python -m pip check
node --check frontend/static/js/app.js
node --check frontend/static/js/header.js
```

There is no automated application test suite or custom model yet. The `/` route uses Django's built-in `TemplateView`; `/admin/` remains available for Django's standard admin. Development static serving requires `DJANGO_DEBUG=true`.

## Database configuration

`DB_ENGINE=sqlite` is the default and stores local data in `backend/db.sqlite3`. Keep models and queries portable through Django's ORM rather than relying on SQLite-specific SQL.

For a future PostgreSQL deployment:

1. Provision PostgreSQL and install its driver into the activated environment with `python -m pip install "psycopg[binary]"`.
2. Add the installed driver dependencies to `backend/requirements.txt` using `python -m pip freeze > backend/requirements.txt`.
3. Set `DB_ENGINE=postgresql`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` through the deployment environment (or local `backend/.env`). Set `DB_SSLMODE` to the value required by the database provider, typically `require` for hosted databases.
4. Run `python backend/manage.py check` and `python backend/manage.py migrate` against the target database.

The driver and PostgreSQL service are intentionally not installed for SQLite development. Switching the connection does not copy existing SQLite records; plan a separate data migration if there is data to preserve.

## Deployment

**Hosting is not configured yet.** This application requires a Python-capable host and a production WSGI/ASGI server, to be chosen when deployment is planned.

Before deployment:

1. Install pinned Python and frontend dependencies; compile CSS with `npm --prefix frontend ci` and `npm --prefix frontend run build:css`.
2. Set a unique production `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, and `DJANGO_ALLOWED_HOSTS` to the actual comma-separated hostnames.
3. Configure the production database, HTTPS, secure cookies, and any trusted proxy settings for the chosen host.
4. Run migrations and `python backend/manage.py collectstatic --noinput`. Configure the host/web server to serve `backend/staticfiles/` at `/static/`; Django's development static server is not used in production.
5. Run `python backend/manage.py check --deploy` with production settings and resolve the findings for that environment.
6. Verify the site, then connect a custom domain and HTTPS after project-owner approval.

No production server, hosting credentials, contact integrations, or deployment have been added by the local stack setup.

## Contribution policy

This is a **proprietary, owner-controlled project**, not a community open-source project. Unsolicited contributions, forks for reuse, and externally maintained derivatives are **not authorized** by the repository's public visibility.

Contributions may be accepted **only with prior written authorization from the project owner**. Authorized contributors should:

- Work in a dedicated branch and submit changes for review before merging to `main`.
- Follow the existing architecture and documentation conventions.
- Never commit secrets, private customer information, or unapproved business assets.
- Verify that any third-party dependency or asset is legally usable under its own license and applicable conditions.
- Understand that contribution access does not grant ownership or reuse rights in the project.

Any intellectual-property transfer or contributor-specific rights must be documented in a separate written agreement where applicable.

## Copyright and ownership

**Copyright © 2026 Parsian UPVC Workshop / the lawful project owner. All rights reserved.**

Except for independently licensed third-party components and materials, the project's source code, original designs, graphics, written content, and project-specific assets are reserved to the project owner. Public access to this repository is for viewing and portfolio presentation only; **no license to copy, modify, distribute, publish, sublicense, sell, or commercially exploit its contents is granted**.

See the full [LICENSE](LICENSE) for the controlling proprietary terms. Third-party libraries, frameworks, and assets remain governed by their respective licenses.
