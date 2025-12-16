# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo-based React Native TODO application with persistent local storage. It uses modern React Native features including the React Compiler (experimental) and New Architecture.

## Development Commands

```bash
# Start development server
npx expo start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Linting
npm run lint
```

## Architecture

### Routing System
- **Expo Router** with file-based routing (not React Navigation directly)
- Entry point: `app/_layout.tsx` (Root Stack Navigator with ThemeProvider)
- Tab navigation: `app/(tabs)/_layout.tsx` (Bottom tabs)
- Routes are defined by file structure in `/app` directory
- The `(tabs)` folder represents a route group with shared layout

### Theme System
- Colors defined in `constants/theme.ts` with separate light/dark palettes
- Custom themed components: `ThemedView` and `ThemedText` (wrap native components with automatic theme colors)
- Theme switching via `useColorScheme()` hook
- Color access via `useThemeColor()` hook with fallback support
- When adding new UI features, extend the Colors object in `constants/theme.ts` for both light and dark modes

### Component Architecture
- **UI Components**: Located in `/components/ui/` for low-level reusable elements
- **Themed Components**: Located in `/components/` for app-specific themed wrappers
- **IconSymbol**: Cross-platform icon component using SF Symbols (iOS) and fallback icons (Android/web)
  - Mappings defined in `components/ui/icon-symbol.tsx`
  - iOS-specific optimizations in `components/ui/icon-symbol.ios.tsx`
- **HapticTab**: Tab bar component with haptic feedback using expo-haptics

### Storage Pattern
- AsyncStorage for persistent local storage
- Custom hooks pattern for storage operations (see `hooks/use-async-storage.ts`)
- Storage keys prefixed with `@app_name:` (e.g., `@todo_app:todos`)
- State management: useState + useEffect with optimistic updates and error rollback
- No external state management library (Redux, Zustand, etc.) - use React hooks

### Type System
- TypeScript with strict mode
- Types organized in `/types` directory
- Use path aliases (`@/` points to root directory)

## Key Patterns

### Adding New Features with Storage
1. Define TypeScript types in `/types`
2. Create custom hook in `/hooks` with AsyncStorage operations
3. Implement optimistic updates with error rollback
4. Use unique storage keys with app prefix

### Creating Themed Components
1. Use `useThemeColor()` hook for dynamic colors
2. Extend `Colors` object in `constants/theme.ts` for new color needs
3. Wrap in `ThemedView` or `ThemedText` for automatic theme support

### Navigation
- Add new screens by creating files in `/app` directory
- Use `(folder)` syntax for route groups with shared layouts
- Configure tab icons and options in `app/(tabs)/_layout.tsx`
- Modal screens configured in root `app/_layout.tsx`

## Expo Configuration

Located in `app.json`:
- **New Architecture**: Enabled (`newArchEnabled: true`)
- **React Compiler**: Experimental feature enabled
- **Typed Routes**: Enabled for type-safe navigation
- Supports iOS, Android, and Web platforms

## Path Aliases

- `@/` resolves to project root
- Example: `@/components/themed-view` instead of `../../components/themed-view`
