<div align="center">

<img src="public/favicon.svg" alt="Sharm Cloud Tours" width="120" height="120" style="filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.5));" />

# Sharm Cloud Tours

### *Discover. Book. Explore Sharm El-Sheikh.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)](https://docker.com)

<br/>

![Type Animation](https://readme-typing-svg.demolab.com?font=Playfair+Display&weight=700&size=28&duration=3000&pause=1000&color=FFD700&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=%F0%9F%8F%96+Premium+Tour+Booking+Platform%3B+%F0%9F%8C%8D+Multi-Language+%7C+Multi-Currency%3B+%E2%9C%A8+Next.js+16+%2B+Prisma+%2B+PostgreSQL)

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](#)
[![Stars](https://img.shields.io/github/stars/ahmedhat/traveloo?style=flat-square&color=FFD700)](#)
[![Forks](https://img.shields.io/github/forks/ahmedhat/traveloo?style=flat-square)](#)

**[Live Demo](https://sharmcloudtours.vercel.app/)**

</div>

---

## Overview

Sharm Cloud Tours is a **single-vendor tour booking platform** built for tourism agencies in Sharm El-Sheikh, Egypt. It targets international tourists (English & Russian) and provides a full-featured admin dashboard for managing tours, bookings, reviews, and customer communication.

> Built with **Next.js 16**, **Prisma**, **PostgreSQL**, and **Tailwind CSS** — deployed with **Docker** and **Nginx** for under **$11/month**.

<div align="center">

![Hero Preview](public/images/previewer-images/1779740524960281560001-preview1.jpeg)

*Discover breathtaking underwater worlds and desert adventures in Sharm El-Sheikh*

</div>

---

## Features

<table>
<tr>
<td width="50%">

#### Tourist Experience
- **Tour Discovery** — Browse, search, and filter tours with a rich grid view
- **Multi-Language** — English & Russian with locale-prefixed URLs (`/en/`, `/ru/`)
- **Multi-Currency** — USD, EGP, RUB with live exchange rates
- **Booking System** — Date/guest selection with capacity checking & email confirmation
- **Reviews & Ratings** — Star ratings, comments, and admin replies
- **Wishlist** — Save favorite tours for later
- **Dark Mode** — True noir theme with one-click toggle
- **Real-time Messaging** — Chat directly with the agency
- **Responsive** — Mobile-first design that looks stunning everywhere

</td>
<td width="50%">

#### Admin Dashboard
- **Analytics Overview** — Pending bookings, confirmed tours, review stats
- **Tour Management** — Full CRUD with translations, image upload, itinerary editor
- **Booking Management** — Confirm, cancel, complete — or create bookings for users
- **Review Moderation** — Approve/reject with admin replies
- **User Management** — View users with online status indicators
- **Message Center** — Real-time chat with broadcast capability
- **Contact Settings** — Edit phone, WhatsApp, address with live preview
- **Image Management** — Preview and organize uploaded images

</td>
</tr>
</table>

---

## Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---|
| **Framework** | `Next.js 16` (App Router) + `React 19` |
| **Language** | `TypeScript 5` (strict mode) |
| **Styling** | `Tailwind CSS 4` + CSS custom properties |
| **Database** | `PostgreSQL 18` via Docker |
| **ORM** | `Prisma 5.22` |
| **Auth** | `NextAuth.js` (Google OAuth + Email/Password) |
| **Payments** | `Stripe` (feature-flagged) |
| **Email** | `Nodemailer` (Gmail SMTP) |
| **Validation** | `Zod 4` |
| **i18n** | `next-intl 4` |
| **Images** | `Cloudinary` |
| **Theme** | `next-themes` |
| **Container** | `Docker` + `Docker Compose` |
| **Reverse Proxy** | `Nginx` (SSL + gzip + caching) |
| **Package Manager** | `pnpm 11` |

</div>

---

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero section with featured tours and customer reviews |
| **Tours** | Browse all tours with search, filters, and sorting |
| **Tour Detail** | Images, itinerary, highlights, pricing, and booking widget |
| **Booking** | Date/guest selection with confirmation and email notification |
| **Profile** | Personal info, booking history, and review management |
| **Wishlist** | Saved tours for later |
| **Messages** | Chat directly with the agency |
| **About** | Learn about Sharm Cloud Tours |
| **Contact** | Get in touch with the team |
| **FAQ** | Frequently asked questions |
| **Auth** | Sign in, sign up, email verification, password reset |

---

## Security

- **CSP / HSTS** security headers
- **Rate limiting** on auth endpoints
- **Input validation** with Zod on all forms
- **RBAC** — Admin dashboard protected by role-based access control

---

<div align="center">

**Built with care for tourism agencies in Sharm El-Sheikh, Egypt**

<img src="public/favicon.svg" alt="Sharm Cloud Tours" width="48" height="48" style="filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.4));" />

</div>
