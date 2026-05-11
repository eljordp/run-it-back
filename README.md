# Run It Back

A life simulator you can play in a browser. Spawn point, family, and luck are rolled. Everything else is yours.

## Current game loop

- Start a new life with a custom name, hometown, identity, pronouns, social handle, randomized stats, and relationships.
- Age up year by year and respond to random life events.
- Spend yearly moves on school/work, health, relationships, fame, a social page, real-world-inspired stores, money, hobbies, adventure, street life, business, politics, legal cleanup, or risky activities.
- Build cash, buy and sell assets, take on debt, grow fame, collect licenses, travel, adopt pets, start businesses, run for office, publish books, compete in tournaments, and deal with a record if reckless choices go badly.
- Progress through school, dropping out, GED, trade school, brand/store jobs, creator careers, college, professional school, marriage, kids, relationships, milestones, passive income, and eventual endings.
- Move through real places like Los Angeles, Skid Row, New York, Chicago, Atlanta, London, Tokyo, and Mexico City, with location-specific living costs and events.
- Build a company, become CEO, launch products, pivot, hire teams, raise money, make boardroom decisions, acquire rivals, go public, or sell the company.
- Pick up smoking as a vice, take smoke breaks, network at cigar lounges, try nicotine gum, or quit with health and discipline consequences.
- The desktop dashboard keeps the character sheet, animated life scene, life timeline, activity board, assets, and people visible together.

## Run on your computer

From this folder:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Play on your phone

Keep the server running on your computer, make sure your phone is on the same Wi-Fi, then open your computer's local network address with the same port. For example:

```text
http://192.168.1.25:4173/
```

You can find the computer's address on macOS with:

```sh
ipconfig getifaddr en0
```

## Customize

- Edit `app.js` to add new events, actions, jobs, achievements, or relationship types.
- Edit `styles.css` to change the look.
- Expand the game by adding more chapters, event chains, careers, locations, and endings.
