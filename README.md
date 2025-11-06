Number Match Puzzle Game

A React Native + Expo puzzle game inspired by Number Master by KiwiFun.
Built as part of the Fresher Assignment to demonstrate clean architecture, reusable components, and game logic implementation.

✅ 📱 Game Overview

A number-matching puzzle game where the player clears the grid by matching:

Two equal numbers, or

Two numbers whose sum = 10

Additional rules (as in Number Master):

✅ Matched cells fade (not removed)

✅ Grid starts with only 3–4 rows filled

✅ “Add Row” button inserts a new row (limited per level)

✅ Must complete each level in 2 minutes

✅ Progressive difficulty across 3 distinct levels

✅ Valid selection = fade animation

✅ Invalid selection = shake animation

This game follows the same mechanics of the Google Play version:
https://play.google.com/store/apps/details?id=com.kiwifun.game.android.numbermaster.puzzles

✅ 📂 Project Structure
rn-number-match/
├─ App.tsx
├─ app.json
├─ package.json
├─ babel.config.js
├─ tsconfig.json
├─ assets/
│  ├─ icon.png
│  ├─ splash.png
│  └─ adaptive-icon.png
└─ src/
   ├─ components/
   │  └─ Cell.tsx           # UI for each number tile (fade, shake animations)
   ├─ screens/
   │  └─ GameScreen.tsx     # Main game screen (grid, timer, levels)
   ├─ game/
   │  └─ logic.ts           # Pure match logic (sum=10, path rule, add row)
   ├─ levels.ts             # Level definitions
   └─ types.ts              # Shared TypeScript models

✅ 🎮 Features Implemented
✅ Matching Rules

Match equal numbers

Match numbers whose sum is exactly 10

Faded cells remain on the board (not removed)

✅ Grid & Path Rules

Only first 3–4 rows are filled at start

Player can add limited rows

Matches allowed if:

Direct line is clear (horizontal/vertical/diagonal), or

Flattened path between cells has no obstacles

✅ Levels
Level	Grid Size	Filled Rows	Add Rows Allowed	Time
1	8×9	3	6	120s
2	9×10	4	7	120s
3	10×12	4	8	120s
