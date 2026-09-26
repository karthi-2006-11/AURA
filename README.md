# AURA - AI Railway Booking Assistant

AURA is an AI-powered assistant designed to facilitate train ticket booking.

## Milestone 1 Target
> **Natural-language railway booking request → Structured booking information**

---

## Technology Stack
- **Language**: TypeScript (Node.js runtime)
- **Execution / Tooling**: `tsx` (TypeScript execute), `tsc` (TypeScript compiler)
- **Testing**: Built-in `node:test` runner with TypeScript execution

> **Note**: Built strictly with JavaScript / TypeScript. No Python is used in this project.

---

## Project Structure

```text
AURA/
├── src/
│   ├── models/
│   │   ├── booking.ts       # Structured data interfaces (Passenger, BookingRequest, etc.)
│   │   └── index.ts         # Central export for models
│   ├── parser/
│   │   └── index.ts         # Placeholder for the upcoming natural-language parser
│   └── index.ts             # Main application entrypoint
├── tests/
│   └── foundation.test.ts   # Unit tests verifying foundation & parser stub status
├── .env.example             # Template for environment variables
├── .gitignore               # Git ignore rules for Node/TypeScript
├── package.json             # NPM project manifest & scripts
├── README.md                # Project documentation
└── tsconfig.json            # TypeScript compiler configuration
```

---

## Day 1 Scope

- **Included:** Clean TypeScript foundation, data model definitions (`Passenger`, `BookingRequest`, etc.), parser placeholder, and entrypoint script.
- **Excluded by Design:**
  - Booking parser implementation (scheduled for the next milestone)
  - Railway website automation
  - Browser automation
  - CAPTCHA handling
  - OTP handling
  - Payment processing
  - Train searching
  - Real railway booking

---

## How to Run the Project

### 1. Install Dependencies
Run from the project root:

```bash
npm install
```

### 2. Run the Application
Execute the Day 1 foundation script:

```bash
npm start
```

### 3. Run the Tests
Verify the foundation and test suite:

```bash
npm test
```

### 4. Type Check / Build
To check types or build the JavaScript output:

```bash
npm run typecheck
npm run build
```
