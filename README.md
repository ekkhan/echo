# Echo — SaaS AI Agent Platform

**Live Demo:** [https://echo-web-orpin.vercel.app/conversations](https://echo-web-orpin.vercel.app/conversations)

Echo is a full-stack AI customer support platform with real-time chat and voice assistance, built with **Next.js**, **Convex**, and **OpenAI**.  
Each organization has its own secure workspace, knowledge base, and embeddable chat widget for customer interactions.

---

## Try it Out

1. Go to the [live demo](https://echo-web-orpin.vercel.app/conversations).  
2. Register for an account using any email.  
3. Create a new organization and upload a few documents to build a knowledge base.  
4. Click **Integration** to generate your custom embed script.  
5. Copy and paste the script into any HTML page to add the AI chat widget.

---

## Apps

- **Dashboard (`apps/web`)** – Admin panel for managing agents, knowledge bases, and organization settings.
- Widget (`apps/widget`)* – The full chat UI and logic (conversation window, message handling, etc.). Built with React + Tailwind.
- **Embed Widget (`apps/embed`)** – A lightweight Vite-built script that loads the widget onto any external website through a `<script>` tag.  
- **Backend (`convex/`)** – Handles real-time messaging, AI responses, and organization data management.

---

## Tech Stack

**Frontend:** Next.js, React, Tailwind CSS, Jotai, shadcn/ui  
**Backend:** Convex, OpenAI (RAG-based knowledge retrieval)  
**Auth and Billing:** Clerk, Stripe  
**Infrastructure and Tools:** AWS (EC2 and Secrets Manager), Turborepo, Vite.

---

## Features

- Real-time chat and voice AI support  
- Retrieval-Augmented Generation (RAG) for accurate, grounded responses  
- Multi-tenant architecture with isolated organization data and API keys  
- Secure key management using AWS Secrets Manager  
- Embeddable chat widget for third-party sites  
- Operator Dashboard for managing and assisting live conversations  
