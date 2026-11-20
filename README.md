# StayHealthy — Medical Appointment Booking

## Project Overview

StayHealthy is a React and Vite healthcare demonstration application developed for an IBM Skills Network capstone project.

It supports patient authentication, a patient dashboard, sample doctor search, and database-backed appointment requests.

## Technologies

- React, JavaScript, Vite, HTML and CSS
- Vercel serverless API functions
- Neon PostgreSQL
- JWT authentication
- HTTP-only session cookies

## Features

### Patient Authentication

- Patient registration and login
- Password hashing and verification
- JWT-based sessions
- HTTP-only, Secure, SameSite cookies
- Session restoration after refresh
- Logout

### Patient Dashboard

Authenticated patients can:

- View their account information
- Search a sample doctor directory
- Submit appointment requests
- View their saved appointment requests
- Cancel their appointment requests

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Register a patient |
| POST | /api/auth/login | Authenticate a patient |
| GET | /api/auth/session | Verify session |
| POST | /api/auth/logout | Log out |
| GET | /api/appointments | List patient requests |
| POST | /api/appointments | Submit a request |
| DELETE | /api/appointments?id=ID | Cancel an owned request |

## Environment Variables

The application requires:

- NEON_POSTGRES_URL — PostgreSQL connection string
- JWT_SECRET — Random signing secret of at least 32 characters

Never commit real credentials or secrets to GitHub.

## Local Setup

1. Clone the repository from https://github.com/Mustyabu101/med_appt
2. Enter the med_appt directory.
3. Run npm ci.
4. Run npm run dev.

The standalone Vite development server does not automatically provide Vercel API functions.

## Validation

Run npm run lint and npm run build.

The frontend production build is generated in the dist directory.

## Deployment

The project uses Vercel for hosting and serverless functions, with Neon PostgreSQL for database storage.

Set the required environment variables in Vercel before deploying.

## Limitations

- Doctor listings are demonstration data.
- Appointment requests are not confirmed medical bookings.
- The standalone review component uses localStorage and is not currently integrated into the dashboard.
- This project is an educational demonstration, not a production healthcare service.

## License

Created for educational purposes.
