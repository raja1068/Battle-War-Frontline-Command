# Battle War: Frontline Command

A mobile‑first 3D/2.5D action war game with campaign, characters, vehicles, and secure cloud progress.

## Features
- 7 chapters with multiple missions
- Playable characters (Assault, Scout, Defender, etc.)
- Customizable appearance
- Weapons, armour, equipment with rarity
- Vehicle missions (Jeep, Tank, Ship)
- AI enemies and allies
- Server‑authoritative progression
- Secure authentication and payment (Razorpay/Skydo)
- Admin panel for live content management

## Tech Stack
- **Game Client**: Unity 2022 LTS (C#)
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (Atlas)
- **Payments**: Razorpay / Skydo
- **Admin**: React + Ant Design

## Setup
1. Clone the repository.
2. Set up environment variables (see `.env.example`).
3. Run `docker-compose up` for local development (backend + MongoDB + Redis).
4. Open Unity project in `client/` and configure API endpoint.
5. Build for Android/iOS/WebGL.

## Deployment
See `/docs/Deployment.md` for production deployment instructions.
