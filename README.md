# Parsian UPVC Workshop — Official Website

**Official landing page website for Parsian UPVC Workshop.**

> **Public repository · Proprietary project · All rights reserved**  
> This repository is publicly visible for presentation and portfolio purposes only. Its source code, original designs, and content are **not open source** and may not be reused without prior written permission. See [LICENSE](LICENSE).

## Project overview

This project is intended to be the official online presence of **Parsian UPVC Workshop**, giving prospective customers a clear introduction to the workshop and a convenient way to explore its products, services, completed work, and contact information.

**Current status:** Project initialization and documentation. The website application, its final technology stack, and deployment configuration have **not yet been implemented** in this repository.

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

The following items describe the **intended scope**, not functionality already delivered.

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

**Proposed direction — not yet installed or finalized:**

| Layer | Proposed technology | Status |
| --- | --- | --- |
| Structure | HTML5 and semantic markup | Planned |
| Styling | CSS3 with responsive design | Planned |
| Application logic | TypeScript | Planned |
| Development/build | Node.js (active LTS), npm, and Vite | Planned |
| Hosting | Static hosting provider, to be selected | Undecided |

The implementation may be adjusted as the project requirements become clearer. No framework, dependency, backend, database, or hosting provider should be assumed to be in use until corresponding project files are committed.

## Repository structure

**Current initialization files:**

```text
parsian-company/
├── .gitignore     # Local files, secrets, dependencies, and build artifacts excluded from Git
├── LICENSE        # Proprietary, all-rights-reserved terms
└── README.md      # Project information and guidance
```

Application directories such as `src/` and `public/`, along with a `package.json` and build configuration, can be introduced when development begins. **Update this section to reflect the actual files and directories as the project evolves.**

## Installation and local development

### Prerequisites

- Git
- When the proposed Vite/TypeScript implementation is added: a supported **Node.js LTS** release and npm

### Clone the repository

```bash
git clone https://github.com/mohammadaminheidary/parsian-company.git
cd parsian-company
```

At the present documentation-only stage, there is **no runnable website or package installation step**.

### After the application is initialized

Once a `package.json` and dependency lockfile are committed, the expected npm workflow for the proposed Vite-based stack will be:

```bash
npm ci
npm run dev
```

To create and inspect a production build (once the corresponding scripts are defined):

```bash
npm run build
npm run preview
```

If a lockfile has not yet been generated, the initial dependency installation should use `npm install` instead of `npm ci`. Check `package.json` for the actual scripts and tool versions once implementation starts. Do not commit `.env` files containing credentials.

## Deployment

**Not configured yet.** Once the site has been implemented and tested:

1. Select a hosting provider capable of serving the application's output (for example, a static hosting platform).
2. Confirm the actual build commands and output directory from the committed project configuration. For the proposed Vite setup, the conventional build command is `npm run build` and the default output directory is `dist/`.
3. Configure deployment through the chosen platform using the repository's `main` branch.
4. Set any deployment secrets in the hosting platform's protected environment settings, not in Git.
5. Verify the production site on desktop and mobile, including navigation, accessibility, page metadata, images, and contact links.
6. Connect a custom domain and HTTPS only after the project owner approves the configuration.

No production URL or deployment status is claimed here until a deployment has been completed.

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
