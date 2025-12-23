# Sugu Quiz App - Subae Gubae

A mobile-first quiz game web application built with Next.js, featuring a beautiful glassmorphic UI and smooth animations.

## Features

- ✨ Beautiful splash screen with EJaT and Subae Gubae branding
- 📋 Game rules screen
- 🎯 7 randomly selected multiple-choice questions (from 14 total)
- ⏱️ 30-second timer per question
- 📊 Results screen with score and encouraging messages
- 🏆 Global leaderboard powered by Supabase
- 🎨 Glassmorphic UI design
- 📱 Mobile-first responsive design
- ⚡ Smooth animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (for leaderboard)
- **Font**: Nokia Pure Heading (local)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up assets** (already done if files are in `public` folder):
   - `ejat-logo.png`
   - `subae-logo.png`
   - `Nokia Pureheadline Bold.ttf`

3. **Set up Supabase database:**
   - **Follow the step-by-step guide**: [DATABASE_SETUP.md](./DATABASE_SETUP.md)
   - This will take about 5-10 minutes
   - You'll need to run a SQL script and create a `.env.local` file

4. **Run the development server:**
```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with game state management
│   └── globals.css         # Global styles and font
├── components/
│   ├── SplashScreen.tsx    # Splash screen component
│   ├── RulesScreen.tsx     # Game rules screen
│   ├── QuizScreen.tsx      # Quiz question screen
│   ├── ResultsScreen.tsx   # Results screen
│   └── LeaderboardScreen.tsx # Leaderboard screen
├── data/
│   └── quizData.ts         # Quiz questions and answers
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── types/
│   ├── quiz.ts             # Quiz TypeScript types
│   └── leaderboard.ts      # Leaderboard TypeScript types
├── utils/
│   ├── quizUtils.ts        # Quiz utility functions
│   └── leaderboardUtils.ts # Leaderboard utility functions
└── public/                 # Static assets
```

## Customization

### Adding Quiz Questions

Edit `data/quizData.ts` to add or modify questions:

```typescript
{
  text: 'Your question text here',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 0, // 0-based index of correct answer
}
```

### Styling

The app uses Tailwind CSS with custom colors defined in `tailwind.config.js`. The glassmorphic effects are applied inline using CSS backdrop-filter.

## Build for Production

```bash
npm run build
npm start
```

## License

Private project for Subae Gubae initiative.

