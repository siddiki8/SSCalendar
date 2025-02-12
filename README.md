# Sunday School Calendar

A modern, responsive calendar application built with Next.js and Firebase, designed specifically for managing Sunday School schedules. Features a clean interface with dark mode support and secure admin access.

## Features

- 📅 Dynamic calendar view showing Sundays with corresponding Islamic dates
- 🌙 Dark mode support (default) with emerald theme
- 🔒 Secure admin authentication via Firebase
- ✏️ Admin panel for managing calendar events
- 📱 Responsive design for all devices
- 🕌 Islamic date conversion
- 🎨 Modern UI with smooth transitions
- 💾 Real-time updates using Firebase

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Authentication, Firestore)
- **Date Handling**: date-fns, hijri-converter
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd sunday-school-calendar
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Set up Firebase:
   - Create a new Firebase project
   - Enable Email/Password authentication
   - Create an admin user in Firebase Authentication
   - Set up Firestore database with appropriate security rules

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Public View
- View the calendar with Sunday school dates
- Toggle between light and dark modes
- See Islamic dates for each Sunday

### Admin Access
- Navigate to `/admin`
- Log in with admin credentials
- Manage calendar events:
  - Mark Sundays as closed
  - Add special events
  - Set custom messages
  - Configure calendar date ranges

## Firebase Setup

1. Create a new project in Firebase Console
2. Enable Authentication:
   - Go to Authentication > Sign-in methods
   - Enable Email/Password authentication
   - Create an admin user

3. Set up Firestore:
   - Create a new database
   - Start in production mode
   - Set up security rules to restrict write access to authenticated users

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Firebase for backend services
- Islamic date conversion using hijri-converter 