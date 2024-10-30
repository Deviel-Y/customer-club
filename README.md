
# Customer Club

Customer Club is a full-stack application built with Next.js, designed to manage invoice issuance, proforma invoices with expiration dates, and ticket assignments between customers and admins. This project is not a typical e-commerce store but a specialized platform for managing invoicing, notifications, and communication between customers and admins in an organized, user-friendly way.

## Features

- **Invoice & Proforma Invoice Management**: Admins can create, update, delete, and archive invoices and proforma invoices. Archived invoices can be restored within a specific date range.
- **Ticketing System**: Customers can create tickets and assign them to admins, enabling a direct line of communication.
- **Notification System**: Alerts both customers and admins of important events and updates.
- **Logging System**: SuperAdmin users can access a log system that records activities for all users on the platform.

## Tech Stack

The project is powered by the following technologies:

- **Frontend**: Next.js, React, NextUI, Tailwind CSS, Framer Motion
- **Backend**: Prisma, NextAuth (for authentication)
- **Utilities**: Axios, Zod, React Hook Form, Moment-jalaali, Sharp, Date-fns, and bcrypt (for hashing)

### Full List of Dependencies

```json
"dependencies": {
    "@heroicons/react": "^2.1.5",
    "@hookform/resolvers": "^3.9.0",
    "@internationalized/date": "^3.5.6",
    "@nextui-org/react": "^2.4.6",
    "@prisma/client": "^5.20.0",
    "axios": "^1.7.7",
    "bcrypt": "^5.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^11.5.4",
    "moment-jalaali": "^0.10.1",
    "next": "^14.2.13",
    "next-auth": "^5.0.0-beta.22",
    "next-themes": "^0.3.0",
    "react": "^18",
    "react-dom": "^18",
    "react-hook-form": "^7.53.0",
    "react-hot-toast": "^2.4.1",
    "sharp": "^0.33.5",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/moment-jalaali": "^0.7.9",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.6",
    "postcss": "^8",
    "prisma": "^5.21.0",
    "react-icons": "^5.3.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd customer-club
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables in a `.env` file (see **Configuration** below for specifics).

4. Start the development server:

   ```bash
   npm run dev
   ```

## Configuration

Create a `.env` file in the root directory and add the required environment variables (if any are needed beyond what’s described). Typically, these will include database URLs, authentication secrets, and any third-party API keys.

## License

This project is provided under the [MIT License](https://opensource.org/licenses/MIT).
