# React Native TODO App with Local Storage

A full-featured TODO application built with Expo and React Native, featuring persistent local storage using AsyncStorage.

## Features

- ✅ Add, edit, and delete TODOs
- ✅ Mark TODOs as complete/incomplete
- ✅ Filter by All/Active/Completed status
- ✅ Clear all completed TODOs
- ✅ Persistent storage across app restarts
- ✅ Full light/dark theme support
- ✅ Haptic feedback on interactions
- ✅ Smooth keyboard handling
- ✅ Cross-platform (iOS, Android, Web)

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in:

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)
- Web browser

## Usage

- **Add TODO**: Type in the input field and tap the + button or press Enter
- **Complete TODO**: Tap the checkbox next to a TODO item
- **Edit TODO**: Long-press on a TODO item to enter edit mode
- **Delete TODO**: Tap the trash icon on a TODO item
- **Filter TODOs**: Use the All/Active/Completed buttons to filter your list
- **Clear Completed**: Tap "Clear Completed" to remove all completed items

## Tech Stack

- **React Native** 0.81.5
- **Expo** ~54.0
- **Expo Router** - File-based routing
- **AsyncStorage** - Persistent local storage
- **TypeScript** - Type safety
- **React Navigation** - Bottom tab navigation
- **Expo Haptics** - Tactile feedback

## Project Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home screen (TODO app)
│   └── explore.tsx   # Explore screen
└── _layout.tsx       # Root layout with theme provider

components/
├── todo-input.tsx    # Input component for adding TODOs
├── todo-item.tsx     # Individual TODO item component
├── themed-view.tsx   # Theme-aware View wrapper
├── themed-text.tsx   # Theme-aware Text wrapper
└── ui/               # Reusable UI components

hooks/
├── use-async-storage.ts  # Custom hook for TODO storage
├── use-color-scheme.ts   # Color scheme detection
└── use-theme-color.ts    # Theme color management

types/
└── todo.ts           # TypeScript type definitions

constants/
└── theme.ts          # Theme colors and fonts
```

## Development

```bash
# Run on specific platforms
npm run android
npm run ios
npm run web

# Linting
npm run lint
```

## Architecture

This app uses:
- **Expo Router** for file-based routing
- **Custom hooks** for state management (no Redux/Zustand needed)
- **AsyncStorage** for persistent storage with optimistic updates
- **Theme system** with automatic light/dark mode support
- **TypeScript** for type safety throughout

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
