This is a Number Match–style puzzle game inspired by the “Number Master” mobile game. The objective is to clear the grid by matching two numbers that are either equal or sum to 10. The game includes multiple levels with increasing difficulty, a countdown timer, and an “Add Row” mechanic for additional challenge. Matched cells fade instead of being removed, and invalid moves trigger a visual warning.

✅ Features Implemented

✅ Match two numbers if they are equal or sum = 10

✅ Three levels with unique grid sizes and difficulty

✅ Each level has a 2-minute timer

✅ Grid starts with only 3–4 rows filled

✅ Add Row button (limited per level)

✅ Matched cells remain but fade out

✅ Invalid match triggers shake animation

✅ Clean architecture with:

Pure game logic (logic.ts)

Reusable Cell component

Level configurations (levels.ts)

Main game screen handling state, timer, and progression

▶️ How to Set Up & Run the App
1. Install Dependencies
npm install
npx expo install react-native-reanimated react-native-gesture-handler expo-asset

2. Start the Development Server
npx expo start

3. Run on Device or Simulator

Press i to run on iOS Simulator

Press a to run on Android Emulator

Or scan QR code using Expo Go on mobile

4. Clean Start (if needed)
npx expo start -c
