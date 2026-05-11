const SAVE_KEY_BASE = "run-it-back-save-v1";
const ACTIVE_SLOT_KEY = "run-it-back-active-slot";
const SAVE_VERSION = 6;

function getActiveSlot() {
  const raw = localStorage.getItem(ACTIVE_SLOT_KEY);
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 && n <= 2 ? n : 0;
}

function slotKey(n) {
  return n === 0 ? SAVE_KEY_BASE : `${SAVE_KEY_BASE}-slot-${n}`;
}

function currentSaveKey() {
  return slotKey(getActiveSlot());
}

// Back-compat: alias for old code paths
Object.defineProperty(globalThis, "SAVE_KEY", { get() { return currentSaveKey(); } });

const statDefs = [
  ["health", "Health"],
  ["happiness", "Happiness"],
  ["smarts", "Smarts"],
  ["looks", "Looks"],
  ["discipline", "Discipline"]
];

const names = ["Ari", "Nova", "Milo", "Jules", "Riley", "Kai", "Sam", "Tess", "Jay", "Remy"];
const peopleNames = ["Morgan", "Taylor", "Casey", "Jordan", "Avery", "Sky", "Drew", "Reese", "Parker"];
const realLocations = [
  "Los Angeles, CA",
  "Skid Row, Los Angeles",
  "Hollywood, Los Angeles",
  "Compton, CA",
  "New York City, NY",
  "Brooklyn, NY",
  "The Bronx, NY",
  "Chicago, IL",
  "South Side, Chicago",
  "Atlanta, GA",
  "Miami, FL",
  "Houston, TX",
  "London, UK",
  "Tokyo, Japan",
  "Mexico City, Mexico"
];

const origins = {
  "Los Angeles, CA": {
    short: "LA",
    money: [60, 240],
    costMod: 1.15,
    fameMod: 1.25,
    salaryMod: 1.05,
    vibe: "palm trees, traffic, and somebody filming a TikTok on every corner",
    spawnLine: "born under California sun with the city already trying to put a camera on you",
    locals: ["Marcus", "Jaiden", "Ari", "Brisa", "Kiana"],
    hood: "the Westside"
  },
  "Skid Row, Los Angeles": {
    short: "Skid Row",
    money: [0, 35],
    costMod: 0.35,
    fameMod: 0.6,
    salaryMod: 0.7,
    streetMod: 1.6,
    vibe: "tents on the sidewalk, MacArthur Park within walking distance, sirens at 3am",
    spawnLine: "born into the loudest blocks in LA where everybody knows everybody and nothing is private",
    locals: ["Pops", "Ms. Tisha", "Ray-Ray", "Lil Cuz"],
    hood: "the Row"
  },
  "Hollywood, Los Angeles": {
    short: "Hollywood",
    money: [80, 280],
    costMod: 1.25,
    fameMod: 1.45,
    salaryMod: 1.1,
    vibe: "billboards taller than apartments and tourists who think the Walk of Fame is special",
    spawnLine: "born two blocks from the Walk of Fame where everybody is one audition away",
    locals: ["Cosette", "Beau", "Reyna", "Tristan"],
    hood: "the Hills"
  },
  "Compton, CA": {
    short: "Compton",
    money: [30, 160],
    costMod: 0.78,
    fameMod: 1.1,
    salaryMod: 0.92,
    streetMod: 1.3,
    vibe: "Crenshaw, lowriders on Sundays, the city in the music",
    spawnLine: "born somewhere people only mention when they're trying to sound tough",
    locals: ["DeShawn", "Imani", "Big Tee", "Mecca"],
    hood: "the block"
  },
  "New York City, NY": {
    short: "NYC",
    money: [80, 320],
    costMod: 1.45,
    fameMod: 1.2,
    salaryMod: 1.18,
    vibe: "subway delays, bodega cats, and rent that's somehow always going up",
    spawnLine: "born into a city that never plans to slow down for you",
    locals: ["Devon", "Aaliyah", "Sal", "Mei"],
    hood: "the block"
  },
  "Brooklyn, NY": {
    short: "Brooklyn",
    money: [60, 260],
    costMod: 1.3,
    fameMod: 1.15,
    salaryMod: 1.1,
    vibe: "stoops, halal carts, and a different language every two blocks",
    spawnLine: "born somewhere the corner store knows your whole family",
    locals: ["Khalil", "Rosa", "Tariq", "Ezra"],
    hood: "the stoop"
  },
  "The Bronx, NY": {
    short: "the Bronx",
    money: [40, 190],
    costMod: 1.05,
    fameMod: 1.2,
    salaryMod: 0.95,
    streetMod: 1.2,
    vibe: "boom boxes, dollar slices, the actual birthplace of hip-hop",
    spawnLine: "born where hip-hop started and the borough never lets you forget it",
    locals: ["Tito", "Yaz", "Big Mike", "Camila"],
    hood: "the BX"
  },
  "Chicago, IL": {
    short: "Chicago",
    money: [40, 200],
    costMod: 0.95,
    fameMod: 0.95,
    salaryMod: 1.0,
    vibe: "Italian beef, freezing winters, the L train, the politics",
    spawnLine: "born somewhere the winters teach you to be tougher than people from anywhere else",
    locals: ["Trell", "Kenny", "Aaliyah", "Frank"],
    hood: "the block"
  },
  "South Side, Chicago": {
    short: "the South Side",
    money: [25, 130],
    costMod: 0.7,
    fameMod: 1.0,
    salaryMod: 0.85,
    streetMod: 1.4,
    vibe: "blocks where everybody knows everybody and the alleys have eyes",
    spawnLine: "born somewhere the South Side never lets you forget you belong to it",
    locals: ["Pooh", "Trell", "Lil Reese", "Mama Day"],
    hood: "the South Side"
  },
  "Atlanta, GA": {
    short: "the A",
    money: [40, 240],
    costMod: 0.88,
    fameMod: 1.3,
    salaryMod: 1.0,
    vibe: "Magic City, the strip, every rapper you've heard of recording two miles away",
    spawnLine: "born in the city that turned hip-hop south and made it bigger than itself",
    locals: ["Quan", "Ari", "Mello", "Tasha"],
    hood: "the A"
  },
  "Miami, FL": {
    short: "Miami",
    money: [60, 260],
    costMod: 1.1,
    fameMod: 1.2,
    salaryMod: 1.0,
    vibe: "salt air, espresso, neon, money that arrived recently and loudly",
    spawnLine: "born somewhere Spanish hits before English and the beach is always a mile away",
    locals: ["Yuli", "Carlos", "Daniela", "Manny"],
    hood: "the 305"
  },
  "Houston, TX": {
    short: "Houston",
    money: [40, 220],
    costMod: 0.82,
    fameMod: 0.9,
    salaryMod: 1.0,
    vibe: "wide highways, trill rap, slabs, and food from every country",
    spawnLine: "born somewhere the trill in the music came directly from the people",
    locals: ["Mateo", "Brianna", "Slim", "Vee"],
    hood: "the South"
  },
  "London, UK": {
    short: "London",
    money: [70, 300],
    costMod: 1.32,
    fameMod: 1.1,
    salaryMod: 1.05,
    vibe: "Tube delays, drill scene, sticky pubs, a class system that pretends not to exist",
    spawnLine: "born across the pond where the class you came from is everyone's first guess",
    locals: ["Ezra", "Tilda", "Reggie", "Imogen"],
    hood: "the ends"
  },
  "Tokyo, Japan": {
    short: "Tokyo",
    money: [80, 280],
    costMod: 1.2,
    fameMod: 1.05,
    salaryMod: 1.05,
    vibe: "vending machines on every corner, trains down to the second, code in everything",
    spawnLine: "born somewhere being on time is the bare minimum and silence is a love language",
    locals: ["Hiro", "Yuki", "Ren", "Aiko"],
    hood: "the ward"
  },
  "Mexico City, Mexico": {
    short: "CDMX",
    money: [25, 180],
    costMod: 0.65,
    fameMod: 1.0,
    salaryMod: 0.85,
    vibe: "tacos al pastor at 1am, futbol on every TV, mountains visible on a clear day",
    spawnLine: "born somewhere your family was already a small empire before you arrived",
    locals: ["Sofia", "Diego", "Lupe", "Mateo"],
    hood: "the colonia"
  },
  "Medellín, Colombia": {
    short: "Medellín",
    money: [30, 220],
    costMod: 0.7,
    fameMod: 1.05,
    salaryMod: 0.85,
    streetMod: 1.4,
    vibe: "paisa hustle, mountains hugging the city, reggaeton from every taxi, the past everybody pretends isn't there",
    spawnLine: "born in a city that buried its loudest era but still hears it in the music",
    locals: ["Maria", "Andrés", "Camilo", "Valentina", "Juanes"],
    hood: "el barrio"
  },
  "Paris, France": {
    short: "Paris",
    money: [60, 280],
    costMod: 1.28,
    fameMod: 1.15,
    salaryMod: 1.05,
    vibe: "metro strikes, bakery lines, smoking outside bars, the museums you ignore until you can't",
    spawnLine: "born somewhere old buildings outlast the people who live in them",
    locals: ["Camille", "Léo", "Inès", "Mathéo", "Chloé"],
    hood: "the arrondissement"
  },
  "Dubai, UAE": {
    short: "Dubai",
    money: [80, 380],
    costMod: 1.25,
    fameMod: 1.4,
    salaryMod: 1.15,
    vibe: "supercars in the heat, gold-leaf coffee, brunch at the Burj, the city built on a deal",
    spawnLine: "born where money arrived loud and stayed louder",
    locals: ["Ahmed", "Layla", "Omar", "Mariam", "Khalid"],
    hood: "the marina"
  },
  "Rio de Janeiro, Brazil": {
    short: "Rio",
    money: [25, 200],
    costMod: 0.75,
    fameMod: 1.2,
    salaryMod: 0.85,
    streetMod: 1.3,
    vibe: "the beach, the funk, the Christ statue watching, the favela and Ipanema sharing the same air",
    spawnLine: "born where the city plays the soundtrack of your life from the day you arrive",
    locals: ["João", "Beatriz", "Felipe", "Larissa", "Caio"],
    hood: "the comunidade"
  },
  "Seoul, South Korea": {
    short: "Seoul",
    money: [70, 290],
    costMod: 1.18,
    fameMod: 1.25,
    salaryMod: 1.05,
    vibe: "midnight pojangmacha, K-pop training schedules, plastic surgery clinics, hagwon study cells",
    spawnLine: "born where the path is set young and the pressure is constant",
    locals: ["Min-jun", "Seo-yeon", "Ji-ho", "Hae-won", "Tae-yang"],
    hood: "the dong"
  },
  "Las Vegas, NV": {
    short: "Vegas",
    money: [40, 220],
    costMod: 0.92,
    fameMod: 1.15,
    salaryMod: 0.95,
    vibe: "casinos every six blocks, parents who work nights, dust storms, the strip's neon glow on every horizon",
    spawnLine: "born somewhere the city never closes and everybody's parents work nights",
    locals: ["Trey", "Brittany", "Marco", "Ava", "Mason"],
    hood: "off-Strip"
  }
};

function originOf(location) {
  return origins[location] || origins["Los Angeles, CA"];
}

function flavor(template) {
  const p = state.player;
  if (!p) return template;
  const o = originOf(p.origin || p.location);
  return template
    .replace(/\{name\}/g, p.name)
    .replace(/\{city\}/g, p.location)
    .replace(/\{origin\}/g, p.origin)
    .replace(/\{short\}/g, o.short)
    .replace(/\{hood\}/g, o.hood)
    .replace(/\{vibe\}/g, o.vibe)
    .replace(/\{handle\}/g, p.handle || `@${p.name.toLowerCase()}`);
}

function localPerson() {
  const p = state.player;
  const o = originOf(p.origin || p.location);
  return pick(o.locals);
}

const spawnClasses = {
  nepo: {
    label: "Silver Spoon",
    moneyMult: [120, 600],
    statBump: { looks: 12, smarts: 6, health: 4, discipline: -4 },
    famBump: 8,
    karma: -6,
    color: "#f0c94f",
    family: () => ({
      guardian: { name: pick(["Mom", "Mommy", "Mother"]), role: "Mother (board seat)", bond: randomInt(28, 60) },
      guardian2: { name: pick(["Dad", "Daddy", "Father"]), role: "Father (CEO type)", bond: randomInt(18, 50) },
      extra: { name: pick(["Camille", "Marc", "Helena", "Theo"]), role: "Family lawyer", bond: randomInt(40, 70), type: "ally" }
    }),
    canonLine: name => `${name} was born with the trust fund already drafted — nannies, private school enrolled in utero, and parents who barely look up from their phones.`,
    summary: "Born loaded. Parents are connected. You start with money but family bonds are weaker than they should be."
  },
  comfortable: {
    label: "Comfortable",
    moneyMult: [8, 28],
    statBump: { looks: 5, smarts: 4, happiness: 4 },
    famBump: 2,
    karma: 2,
    color: "#79a9ff",
    family: () => ({
      guardian: { name: pick(["Mom", "Mommy"]), role: "Mother", bond: randomInt(58, 86) },
      guardian2: { name: pick(["Dad", "Pops"]), role: "Father", bond: randomInt(52, 82) }
    }),
    canonLine: name => `${name} was born into a two-income household that paid the mortgage on time and never made a big deal about it.`,
    summary: "Solid middle. Two-parent household. Stable but not loud."
  },
  working: {
    label: "Working Class",
    moneyMult: [1, 4],
    statBump: { discipline: 3, health: 2 },
    famBump: 0,
    karma: 4,
    color: "#66ad5b",
    family: () => ({
      guardian: { name: pick(["Mama", "Mom"]), role: "Mother (two jobs)", bond: randomInt(62, 90) },
      guardian2: { name: pick(["Dad", "Pops"]), role: "Father (shift work)", bond: randomInt(48, 78) }
    }),
    canonLine: name => `${name} was born into a house where everybody worked, the bills usually got paid, and love was loud but money was tight.`,
    summary: "Real ones. Hardworking family. Tight on money, big on heart."
  },
  struggling: {
    label: "Struggling",
    moneyMult: [0.1, 1],
    statBump: { discipline: 6, health: -2, happiness: -3 },
    famBump: 0,
    karma: 3,
    color: "#d85b3f",
    streetRep: 4,
    family: () => ({
      guardian: { name: pick(["Mama", "Grandma", "Auntie"]), role: pick(["Single mom", "Grandma raising you", "Auntie raising you"]), bond: randomInt(68, 94) },
      extra: { name: pick(["Tia", "Cuz", "Uncle T", "Nina"]), role: "Family rider", bond: randomInt(55, 82), type: "family" }
    }),
    canonLine: name => `${name} was born into a household that stretched every dollar and turned every problem into a family meeting.`,
    summary: "Family is everything because the money sure isn't. You start broke but hard-coded with grit."
  },
  survival: {
    label: "Survival",
    moneyMult: [0, 0.3],
    statBump: { discipline: 9, health: -4, happiness: -6, smarts: 3 },
    famBump: -2,
    karma: 0,
    color: "#9a6240",
    streetRep: 10,
    family: () => ({
      guardian: { name: pick(["Grandma", "Auntie", "Big Sis"]), role: "Whoever stayed", bond: randomInt(40, 75) },
      extra: { name: pick(["Ms. Lopez", "Mr. Ray", "Coach D"]), role: "Caseworker / mentor", bond: randomInt(30, 60), type: "ally" }
    }),
    canonLine: name => `${name} was born into nothing — no plan, no safety net, no clean version of the story.`,
    summary: "No safety net. No script. You learn fast or you don't make it. Hardest difficulty."
  }
};

const cityClassOdds = {
  "Los Angeles, CA":         { nepo: 7,  comfortable: 25, working: 35, struggling: 22, survival: 11 },
  "Skid Row, Los Angeles":   { nepo: 0,  comfortable: 2,  working: 14, struggling: 42, survival: 42 },
  "Hollywood, Los Angeles":  { nepo: 22, comfortable: 32, working: 24, struggling: 16, survival: 6 },
  "Compton, CA":             { nepo: 1,  comfortable: 11, working: 36, struggling: 33, survival: 19 },
  "New York City, NY":       { nepo: 9,  comfortable: 26, working: 34, struggling: 22, survival: 9 },
  "Brooklyn, NY":            { nepo: 5,  comfortable: 22, working: 36, struggling: 24, survival: 13 },
  "The Bronx, NY":           { nepo: 1,  comfortable: 13, working: 38, struggling: 30, survival: 18 },
  "Chicago, IL":             { nepo: 4,  comfortable: 24, working: 38, struggling: 22, survival: 12 },
  "South Side, Chicago":     { nepo: 1,  comfortable: 9,  working: 36, struggling: 34, survival: 20 },
  "Atlanta, GA":             { nepo: 4,  comfortable: 22, working: 40, struggling: 24, survival: 10 },
  "Miami, FL":               { nepo: 9,  comfortable: 22, working: 32, struggling: 25, survival: 12 },
  "Houston, TX":             { nepo: 3,  comfortable: 22, working: 42, struggling: 24, survival: 9 },
  "London, UK":              { nepo: 10, comfortable: 30, working: 32, struggling: 19, survival: 9 },
  "Tokyo, Japan":            { nepo: 5,  comfortable: 38, working: 42, struggling: 11, survival: 4 },
  "Mexico City, Mexico":     { nepo: 3,  comfortable: 18, working: 38, struggling: 28, survival: 13 },
  "Medellín, Colombia":      { nepo: 3,  comfortable: 17, working: 36, struggling: 28, survival: 16 },
  "Paris, France":           { nepo: 10, comfortable: 32, working: 32, struggling: 18, survival: 8  },
  "Dubai, UAE":              { nepo: 22, comfortable: 28, working: 30, struggling: 14, survival: 6  },
  "Rio de Janeiro, Brazil":  { nepo: 4,  comfortable: 16, working: 32, struggling: 30, survival: 18 },
  "Seoul, South Korea":      { nepo: 6,  comfortable: 36, working: 40, struggling: 13, survival: 5  },
  "Las Vegas, NV":           { nepo: 4,  comfortable: 22, working: 40, struggling: 24, survival: 10 }
};

function rollSpawnClass(location) {
  const odds = cityClassOdds[location] || cityClassOdds["Los Angeles, CA"];
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const [klass, chance] of Object.entries(odds)) {
    cumulative += chance;
    if (roll <= cumulative) return klass;
  }
  return "working";
}

const personalities = {
  wild:      { label: "Wild Child",        sceneWeight: { party: 2.2, action: 1.8, drugs: 2.0, travel: 1.4, romance: 1.4 }, bump: { happiness: 6, discipline: -8, looks: 4 },           tagline: "lives loud, regrets later" },
  storm:     { label: "Quiet Storm",       sceneWeight: { drama: 1.8, romance: 1.6, action: 1.3, business: 1.2 },            bump: { smarts: 6, discipline: 6, happiness: -3 },           tagline: "still water, real edge" },
  hustler:   { label: "Hustler",           sceneWeight: { business: 2.0, money: 1.8, action: 1.4, party: 1.2 },               bump: { smarts: 4, discipline: 6, happiness: 2 },            tagline: "money first, sleep when you're dead" },
  romantic:  { label: "Hopeless Romantic", sceneWeight: { romance: 2.5, drama: 1.6, travel: 1.3 },                            bump: { happiness: 6, looks: 4, discipline: -2 },            tagline: "falls fast, falls hard" },
  bookworm:  { label: "Bookworm",          sceneWeight: { school: 2.0, business: 1.4, drama: 1.1 },                           bump: { smarts: 10, looks: -2, happiness: -1 },              tagline: "raised by libraries" },
  big:       { label: "Big Energy",        sceneWeight: { party: 1.8, fame: 1.8, romance: 1.4, travel: 1.4 },                 bump: { happiness: 8, looks: 5, fame: 4 },                   tagline: "the room knows when you walk in" },
  calm:      { label: "Calm Spirit",       sceneWeight: { romance: 1.2, family: 1.8, business: 1.0 },                         bump: { happiness: 4, health: 4, discipline: 4 },            tagline: "doesn't chase the chaos" },
  reckless:  { label: "Reckless",          sceneWeight: { action: 2.4, party: 1.8, drugs: 1.6, street: 1.8 },                 bump: { discipline: -10, looks: 2, health: -2 },             tagline: "fights, fast cars, no plan" }
};

function rollPersonality() {
  const keys = Object.keys(personalities);
  return keys[Math.floor(Math.random() * keys.length)];
}

function rollFamilyStyle(spawnKey) {
  const r = randomInt(1, 100);
  if (spawnKey === "survival") {
    if (r <= 18) return "orphan";
    if (r <= 38) return "foster";
    if (r <= 65) return "absent";
    return "loving";
  }
  if (spawnKey === "struggling") {
    if (r <= 6) return "orphan";
    if (r <= 16) return "foster";
    if (r <= 45) return "absent";
    if (r <= 65) return "strict";
    return "loving";
  }
  if (spawnKey === "comfortable") {
    if (r <= 30) return "strict";
    if (r <= 55) return "absent";
    return "loving";
  }
  if (spawnKey === "nepo") {
    if (r <= 12) return "absent";
    if (r <= 38) return "strict";
    return "loving";
  }
  if (r <= 35) return "absent";
  if (r <= 60) return "strict";
  return "loving";
}

function rollDisability() {
  if (chance(7)) {
    return pick([
      { id: "asd", label: "autism spectrum", statMod: { smarts: 5, looks: -1, happiness: -2 } },
      { id: "adhd", label: "ADHD", statMod: { smarts: 3, discipline: -8 } },
      { id: "dyslexia", label: "dyslexia", statMod: { smarts: -5, looks: 0 } },
      { id: "hearing", label: "hearing impairment", statMod: { smarts: 0, happiness: -3 } },
      { id: "vision", label: "vision impairment", statMod: { health: -2, smarts: 0 } },
      { id: "limb", label: "a missing limb", statMod: { health: -4, discipline: 4 } },
      { id: "wheelchair", label: "paraplegia (wheelchair)", statMod: { health: -8, discipline: 6 } },
      { id: "chronic", label: "a chronic illness", statMod: { health: -10, discipline: 4 } }
    ]);
  }
  return null;
}

// ============================================================
// CUSTOM SPAWN DATA — religion, heritage, parent occupations
// ============================================================
const religionLabels = {
  none: "Not religious",
  christian: "Christian",
  catholic: "Catholic",
  muslim: "Muslim",
  jewish: "Jewish",
  hindu: "Hindu",
  buddhist: "Buddhist",
  spiritual: "Spiritual",
  atheist: "Atheist"
};

const heritageLabels = {
  mixed: "Mixed",
  black: "Black",
  latino: "Latino",
  white: "White",
  "east-asian": "East Asian",
  "south-asian": "South Asian",
  "middle-eastern": "Middle Eastern",
  indigenous: "Indigenous",
  caribbean: "Caribbean",
  african: "African (first-gen)"
};

const heritageNames = {
  black: ["Jamal", "Aaliyah", "Imani", "DeShawn", "Mecca", "Trell", "Zora", "Kenya", "Marcus"],
  latino: ["Sofia", "Diego", "Mateo", "Camila", "Lupe", "Joaquín", "Valentina", "Andrés"],
  white: ["Brett", "Maddie", "Ryan", "Caitlin", "Connor", "Hailey", "Jake", "Megan"],
  "east-asian": ["Mei", "Hiro", "Yuki", "Min-jun", "Seo-yeon", "Wei", "Jia", "Ren"],
  "south-asian": ["Priya", "Arjun", "Anaya", "Ravi", "Aisha", "Vikram", "Neha", "Kiran"],
  "middle-eastern": ["Ahmed", "Layla", "Omar", "Mariam", "Khalid", "Yasmin", "Zayd", "Noor"],
  indigenous: ["Aiyana", "Tahoma", "Nayeli", "Kiona", "Tala", "Cheyenne"],
  caribbean: ["Marley", "Junior", "Empress", "Kingston", "Asha", "Devon"],
  african: ["Adaeze", "Kofi", "Amara", "Tunde", "Nia", "Zola", "Mbeki", "Femi"],
  mixed: ["Ari", "Nova", "Riley", "Sage", "Kai", "Jules", "Devon", "Tess"]
};

const parentOccupationFlavor = {
  teacher: "your mom teaches 4th grade",
  nurse: "your mom works nights at the hospital",
  lawyer: "your mom is a litigator who reads contracts on vacation",
  entrepreneur: "your mom runs her own thing",
  artist: "your mom paints, sells some, struggles often",
  executive: "your mom runs a department at a Fortune 500",
  service: "your mom waits tables / cleans houses / drives Uber",
  "stay-home": "your mom raises you and keeps the house",
  absent: "your mom isn't around",
  laborer: "your dad works construction / trades",
  cop: "your dad's a cop / served in the military",
  doctor: "your dad's a doctor who works late",
  musician: "your dad plays gigs and does sessions",
  hustler: "your dad runs the block, depending on what week it is"
};

function pickParentOccupation(field, isMom) {
  if (field && field !== "random") return field;
  const pool = isMom
    ? ["teacher", "nurse", "service", "stay-home", "entrepreneur", "artist", "executive", "lawyer"]
    : ["laborer", "service", "entrepreneur", "musician", "executive", "doctor", "cop", "hustler"];
  return pick(pool);
}

function personalityOf(player = state.player) {
  return personalities[player?.personality] || personalities.calm;
}

function chaosLevel(player = state.player) {
  if (!player) return 0;
  return Math.min(100, (player.risksTaken || 0) * 4 + (player.streetRep || 0) + (player.viralHits || 0) * 5 + (player.record || 0) * 8);
}

const ADULT_KEY = "run-it-back-adult-ok";
function isAdultUnlocked() {
  // Adult content is enabled by default. Set ADULT_KEY = "no" via the
  // header toggle to filter mature events out.
  try { return localStorage.getItem(ADULT_KEY) !== "no"; } catch (e) { return true; }
}
function setAdultUnlocked(yes) {
  try { localStorage.setItem(ADULT_KEY, yes ? "yes" : "no"); } catch (e) {}
}

const brands = ["Target", "Walmart", "7-Eleven", "Starbucks", "McDonald's", "Nike", "Apple Store", "Best Buy", "Costco", "GameStop", "Foot Locker", "Taco Bell"];
const companyPrefixes = ["Neon", "Signal", "Block", "Cloud", "Afterglow", "Northstar", "Fresh", "Orbit", "Corner", "Wild"];
const companySuffixes = ["Labs", "Works", "Supply", "Studios", "Systems", "Market", "Collective", "Foods", "Media", "Motors"];
const companySectors = ["streetwear", "food delivery", "creator tools", "mobile games", "wellness tech", "sneaker resale", "AI software", "nightlife", "electric bikes", "local retail"];
const companyProducts = ["drop app", "subscription box", "creator dashboard", "delivery route tool", "flagship hoodie", "fitness challenge", "AI assistant", "late-night menu", "resale marketplace", "loyalty card"];
const classTracks = {
  sports: { label: "Sports", stat: { health: 5, discipline: 3, happiness: 2 }, interest: "sports" },
  coding: { label: "Coding", stat: { smarts: 6, discipline: 3, happiness: -1 }, interest: "tech" },
  music: { label: "Music", stat: { fame: 2, happiness: 5, discipline: 2 }, interest: "music" },
  art: { label: "Art", stat: { happiness: 4, smarts: 3, looks: 1 }, interest: "art" },
  debate: { label: "Debate", stat: { smarts: 5, discipline: 3, politicalCapital: 2 }, interest: "debate" },
  shop: { label: "Shop Class", stat: { smarts: 3, discipline: 4, health: 1 }, interest: "hands-on" },
  business: { label: "Business", stat: { smarts: 4, discipline: 3, businessReputation: 2 }, interest: "business" },
  theater: { label: "Theater", stat: { fame: 3, happiness: 4, looks: 1 }, interest: "acting" }
};
const skinTones = {
  "skin-1": ["#d4a070", "#9a6240"],
  "skin-2": ["#7b4b35", "#4d2c22"],
  "skin-3": ["#b87b4f", "#74452f"],
  "skin-4": ["#e8b894", "#b57a59"],
  "skin-5": ["#c49a6c", "#80613f"]
};
const outfitColors = {
  hoodie: "#d85b3f",
  streetwear: "#5a67ff",
  preppy: "#f0c94f",
  goth: "#19161d",
  sport: "#66ad5b",
  suit: "#28364f"
};

const jobs = [
  { id: "none", title: "No job", salary: 0, need: () => true },
  { id: "chores", title: "Neighborhood Helper", salary: 700, need: p => p.age >= 12 },
  { id: "mcdonalds", title: "McDonald's Crew Member", salary: 18800, need: p => p.age >= 16 },
  { id: "target", title: "Target Team Member", salary: 24400, need: p => p.age >= 16 },
  { id: "walmart", title: "Walmart Associate", salary: 25200, need: p => p.age >= 16 },
  { id: "seveneleven", title: "7-Eleven Clerk", salary: 21600, need: p => p.age >= 16 },
  { id: "starbucks", title: "Starbucks Barista", salary: 28600, need: p => p.age >= 16 && p.stats.discipline >= 35 },
  { id: "amazon", title: "Amazon Warehouse Associate", salary: 35800, need: p => p.age >= 18 && p.stats.health >= 45 },
  { id: "cashier", title: "Store Cashier", salary: 16400, need: p => p.age >= 16 },
  { id: "server", title: "Restaurant Server", salary: 22200, need: p => p.age >= 18 },
  { id: "doordash", title: "DoorDash Courier", salary: 31000, need: p => p.age >= 18 && p.licenses.includes("driver") },
  { id: "uber", title: "Uber Driver", salary: 39000, need: p => p.age >= 21 && p.licenses.includes("driver") && p.record <= 1 },
  { id: "ups", title: "UPS Driver", salary: 52000, need: p => p.age >= 21 && p.licenses.includes("driver") && p.record === 0 },
  { id: "barber", title: "Barber", salary: 46000, need: p => p.age >= 18 && p.certifications.includes("trade") },
  { id: "mechanic", title: "Auto Mechanic", salary: 54000, need: p => p.age >= 18 && p.certifications.includes("trade") },
  { id: "apple", title: "Apple Store Specialist", salary: 43000, need: p => p.age >= 18 && p.stats.smarts >= 48 && p.record <= 1 },
  { id: "nike", title: "Nike Floor Lead", salary: 41000, need: p => p.age >= 18 && p.stats.looks >= 45 && p.stats.discipline >= 40 },
  { id: "costco", title: "Costco Supervisor", salary: 58000, need: p => p.age >= 21 && p.stats.discipline >= 58 && p.record === 0 },
  { id: "youtubeEditor", title: "YouTube Video Editor", salary: 56000, need: p => p.age >= 18 && p.stats.smarts >= 55 && p.socialPage },
  { id: "twitchStreamer", title: "Twitch Streamer", salary: 64000, need: p => p.age >= 18 && p.socialPage && p.followers >= 2500 },
  { id: "reelsCreator", title: "Instagram Reels Creator", salary: 74000, need: p => p.age >= 18 && p.socialPage && p.followers >= 10000 },
  { id: "assistant", title: "Office Assistant", salary: 31800, need: p => p.age >= 18 && p.stats.discipline >= 45 },
  { id: "paramedic", title: "Paramedic", salary: 52000, need: p => p.age >= 20 && p.stats.health >= 62 && p.record === 0 },
  { id: "chef", title: "Chef", salary: 57000, need: p => p.age >= 19 && p.stats.discipline >= 58 },
  { id: "creator", title: "Content Creator", salary: 43000, need: p => p.age >= 18 && p.stats.looks + p.fame >= 78 },
  { id: "musician", title: "Touring Musician", salary: 76000, need: p => p.age >= 18 && p.fame >= 22 && p.stats.discipline >= 45 },
  { id: "athlete", title: "Pro Athlete", salary: 98000, need: p => p.age >= 18 && p.stats.health >= 82 && p.championships >= 1 },
  { id: "actor", title: "Screen Actor", salary: 118000, need: p => p.age >= 18 && p.fame >= 35 && p.stats.looks >= 68 },
  { id: "designer", title: "Product Designer", salary: 68000, need: p => p.age >= 21 && p.stats.looks >= 60 && p.educationRank >= 4 },
  { id: "developer", title: "Software Developer", salary: 82000, need: p => p.age >= 21 && p.stats.smarts >= 72 && p.educationRank >= 4 },
  { id: "lawyer", title: "Trial Lawyer", salary: 132000, need: p => p.age >= 25 && p.stats.smarts >= 78 && p.educationRank >= 5 && p.record === 0 },
  { id: "pilot", title: "Airline Pilot", salary: 155000, need: p => p.age >= 24 && p.stats.health >= 70 && p.licenses.includes("driver") && p.licenses.includes("pilot") && p.record === 0 },
  { id: "mayor", title: "Mayor", salary: 164000, need: p => p.age >= 30 && p.politicalCapital >= 45 && p.record === 0 },
  { id: "surgeon", title: "Surgeon", salary: 210000, need: p => p.age >= 28 && p.stats.smarts >= 86 && p.educationRank >= 6 && p.record === 0 },
  { id: "ceo", title: "CEO", salary: 90000, need: p => p.age >= 18 && Boolean(p.company) },
  { id: "founder", title: "Startup Founder", salary: 145000, need: p => p.age >= 25 && p.stats.smarts >= 72 && p.stats.discipline >= 64 && p.money >= 18000 }
];

const store = [
  { id: "bike", name: "Used Bike", cost: 180, value: 140, minAge: 10, stat: { health: 3, happiness: 2 } },
  { id: "laptop", name: "Power Laptop", cost: 1400, value: 950, minAge: 12, stat: { smarts: 4, fame: 1 } },
  { id: "iphone", name: "iPhone", cost: 999, value: 650, minAge: 12, stat: { fame: 2, happiness: 2 } },
  { id: "nikeFit", name: "Nike Outfit", cost: 260, value: 80, minAge: 12, stat: { looks: 4, happiness: 2 } },
  { id: "ps5", name: "PlayStation 5", cost: 500, value: 300, minAge: 10, stat: { happiness: 5 } },
  { id: "car", name: "Starter Car", cost: 5200, value: 4200, minAge: 16, stat: { happiness: 4 } },
  { id: "apartment", name: "City Apartment", cost: 22000, value: 21000, minAge: 18, stat: { happiness: 4 } },
  { id: "condo", name: "Small Condo", cost: 64000, value: 64000, minAge: 21, stat: { happiness: 5, discipline: 2 } },
  { id: "studio", name: "Creative Studio", cost: 38000, value: 33000, minAge: 18, stat: { looks: 3, fame: 5 } },
  { id: "portfolio", name: "Stock Portfolio", cost: 42000, value: 42000, minAge: 18, stat: { smarts: 3, discipline: 2 } },
  { id: "boat", name: "Weekend Boat", cost: 56000, value: 43000, minAge: 21, stat: { happiness: 6, looks: 2 } },
  { id: "business", name: "Local Business", cost: 92000, value: 88000, minAge: 24, stat: { smarts: 3, discipline: 5 } },
  { id: "luxuryCar", name: "Luxury Car", cost: 78000, value: 62000, minAge: 21, stat: { looks: 5, happiness: 3, fame: 3 } },
  { id: "lakeHouse", name: "Lake House", cost: 180000, value: 175000, minAge: 28, stat: { happiness: 8, health: 3 } },
  { id: "franchise", name: "Restaurant Franchise", cost: 260000, value: 245000, minAge: 30, stat: { smarts: 5, discipline: 5 } }
];

const achievements = [
  { id: "first_year", text: "First year lived" },
  { id: "graduate", text: "Finished high school" },
  { id: "pro_job", text: "Landed a professional job" },
  { id: "rich", text: "Built a $100,000 net worth" },
  { id: "famous", text: "Reached 50 fame" },
  { id: "chaos", text: "Survived five risky choices" },
  { id: "traveler", text: "Visited three cities" },
  { id: "licensed", text: "Collected two licenses" },
  { id: "pet_friend", text: "Adopted a pet" },
  { id: "mogul", text: "Owned a serious business asset" },
  { id: "married", text: "Got married" },
  { id: "parent", text: "Became a parent" },
  { id: "author", text: "Published a book" },
  { id: "office", text: "Won elected office" },
  { id: "champion", text: "Won a championship" },
  { id: "dropout", text: "Dropped out of school" },
  { id: "ged", text: "Earned a GED" },
  { id: "social", text: "Started a social page" },
  { id: "skidrow", text: "Moved to Skid Row" },
  { id: "smoker", text: "Picked up smoking" },
  { id: "quitSmoking", text: "Quit smoking" },
  { id: "ceo", text: "Became a CEO" },
  { id: "exit", text: "Sold a company" },
  { id: "publicCompany", text: "Took a company public" },
  { id: "classLane", text: "Picked a real class lane" },
  { id: "crewPath", text: "Joined a street crew" },
  { id: "crewExit", text: "Left a street crew" },
  { id: "long_life", text: "Reached age 70" }
];

const state = {
  player: null,
  activeTab: "life",
  activeCategory: "school",
  showAllCategories: false,
  focusedStat: null
};

const statCategoryMap = {
  health: "foodfit",
  happiness: "mind",
  smarts: "school",
  looks: "foodfit",
  discipline: "school"
};

const el = {
  creator: document.querySelector("#creator"),
  play: document.querySelector("#play"),
  nameInput: document.querySelector("#nameInput"),
  homeInput: document.querySelector("#homeInput"),
  identityInput: document.querySelector("#identityInput"),
  handleInput: document.querySelector("#handleInput"),
  focusInput: document.querySelector("#focusInput"),
  classInput: document.querySelector("#classInput"),
  religionInput: document.querySelector("#religionInput"),
  heritageInput: document.querySelector("#heritageInput"),
  momJobInput: document.querySelector("#momJobInput"),
  dadJobInput: document.querySelector("#dadJobInput"),
  skinInput: document.querySelector("#skinInput"),
  hairInput: document.querySelector("#hairInput"),
  hairColorInput: document.querySelector("#hairColorInput"),
  outfitInput: document.querySelector("#outfitInput"),
  expressionInput: document.querySelector("#expressionInput"),
  statusLine: document.querySelector("#statusLine"),
  playerName: document.querySelector("#playerName"),
  playerBio: document.querySelector("#playerBio"),
  portrait: document.querySelector("#play .portrait"),
  previewPortrait: document.querySelector("#previewPortrait"),
  previewPortraitImg: document.querySelector("#previewPortraitImg"),
  playerPortraitImg: document.querySelector("#playerPortraitImg"),
  looksMeter: document.querySelector("#looksMeter"),
  miniStats: document.querySelector("#miniStats"),
  meters: document.querySelector("#meters"),
  chapterTitle: document.querySelector("#chapterTitle"),
  locationName: document.querySelector("#locationName"),
  locationVibe: document.querySelector("#locationVibe"),
  locationMeta: document.querySelector("#locationMeta"),
  timeline: document.querySelector("#timeline"),
  canonLog: document.querySelector("#canonLog"),
  categoryList: document.querySelector("#categoryList"),
  activityList: document.querySelector("#activityList"),
  aiMood: document.querySelector("#aiMood"),
  aiLog: document.querySelector("#aiLog"),
  aiForm: document.querySelector("#aiForm"),
  aiInput: document.querySelector("#aiInput"),
  assetsPanel: document.querySelector("#assetsPanel"),
  relationships: document.querySelector("#relationships"),
  ageBtn: document.querySelector("#ageBtn"),
  saveBtn: document.querySelector("#saveBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  audioBtn: document.querySelector("#audioBtn"),
  dialog: document.querySelector("#choiceDialog"),
  eventAge: document.querySelector("#eventAge"),
  eventTitle: document.querySelector("#eventTitle"),
  eventText: document.querySelector("#eventText"),
  choiceList: document.querySelector("#choiceList"),
  ageGateDialog: document.querySelector("#ageGateDialog"),
  ageGateConfirm: document.querySelector("#ageGateConfirm"),
  ageGateDeny: document.querySelector("#ageGateDeny"),
  lifeRecapDialog: document.querySelector("#lifeRecapDialog"),
  recapNewLife: document.querySelector("#recapNewLife"),
  recapScreenshot: document.querySelector("#recapScreenshot")
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function uniquePicks(list, count) {
  const pool = [...list];
  const chosen = [];
  while (chosen.length < count && pool.length > 0) {
    const index = randomInt(0, pool.length - 1);
    chosen.push(pool.splice(index, 1)[0]);
  }
  return chosen;
}

function chance(percent) {
  return randomInt(1, 100) <= percent;
}

function weightedPick(list, weightFor) {
  if (!list.length) return null;
  const weighted = list.map(item => ({ item, weight: Math.max(0.1, weightFor(item)) }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted.at(-1).item;
}

function getEventTitle(event) {
  if (!event) return null;
  if (typeof event.title === "string") return event.title;
  if (typeof event.title === "function") {
    try { return event.title(); } catch (e) { return null; }
  }
  return null;
}

function pickLifeEvent(list, player = state.player) {
  const personality = personalityOf(player);
  const cooldowns = player.eventCooldowns || {};

  // First-pass filter: drop events still on 5-year cooldown
  const fresh = list.filter(ev => {
    const t = getEventTitle(ev);
    if (!t) return true;
    const lastAge = cooldowns[t];
    if (lastAge === undefined) return true;
    const window = ev.cooldown || 5;
    return (player.age - lastAge) >= window;
  });

  const pool = fresh.length > 0 ? fresh : list; // fallback to full list if all on cooldown

  const picked = weightedPick(pool, event => {
    const tags = event.tags || [];
    let weight = 1;
    tags.forEach(tag => {
      weight *= personality.sceneWeight?.[tag] || 1;
      if ((player.interests || {})[tag]) weight *= 1 + Math.min(0.75, player.interests[tag] / 10);
    });
    if (tags.includes("street") && player.gang) weight *= 1.5;
    if (tags.includes("school") && player.classes?.length) weight *= 1.35;
    if (tags.includes("fame") && player.socialPage) weight *= 1.3;
    return weight;
  });

  // Mark fired event so it can't repeat for 5 years
  const pickedTitle = getEventTitle(picked);
  if (pickedTitle) {
    player.eventCooldowns = player.eventCooldowns || {};
    player.eventCooldowns[pickedTitle] = player.age;
  }
  return picked;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function money(value) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function withArticle(title) {
  return `${/^[aeiou]/i.test(title) ? "an" : "a"} ${title}`;
}

function normalizeHandle(raw, fallbackName) {
  const fallback = fallbackName || "newlife";
  const cleaned = (raw || fallback)
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 18);
  return `@${cleaned || "newlife"}`;
}

function normalizeIdentity(value) {
  const map = {
    "Cis man": "Guy",
    "Cis woman": "Girl",
    "Trans man": "Trans guy",
    "Trans woman": "Trans girl",
    Questioning: "Figuring it out"
  };
  return map[value] || value || "Figuring it out";
}

function netWorth(player = state.player) {
  const assetValue = player.assets.reduce((total, asset) => total + asset.value, 0);
  return player.money + assetValue - player.debt;
}

function currentJob(player = state.player) {
  return jobs.find(job => job.id === player.jobId) || jobs[0];
}

function annualPay(player = state.player) {
  if (player.jobId === "ceo" && player.company) {
    const company = player.company;
    const ceoPay = 28000 + company.stage * 18000 + company.employees * 900 + Math.floor(player.businessReputation * 650) + Math.floor(company.valuation * 0.012);
    return Math.min(520000, ceoPay) + (player.salaryBonus || 0);
  }
  if (player.jobId === "founder" && player.company) {
    return Math.min(420000, currentJob(player).salary + Math.floor(player.company.valuation * 0.01)) + (player.salaryBonus || 0);
  }
  return currentJob(player).salary + (player.salaryBonus || 0);
}

function companyStageName(stage) {
  return ["Idea", "Garage", "Seed", "Growth", "Empire", "Public"][stage] || "Empire";
}

function hasAsset(id) {
  return state.player.assets.some(asset => asset.id === id);
}

// ============================================================
// CALENDAR — each year of life maps to a real calendar year.
// Spawns are spread across years so different lives feel like
// different eras. Seasonal events use month + year ranges.
// ============================================================

const CURRENT_REAL_YEAR = 2026;

function pickBirthYear() {
  // Newborns spawn between 1980 and current year (so most lives play through
  // the 90s/2000s/2010s/2020s and decade-flavored events can hit).
  return 1980 + Math.floor(Math.random() * (CURRENT_REAL_YEAR - 1980 + 1));
}

function currentYear(player = state.player) {
  return (player.birthYear || CURRENT_REAL_YEAR) + (player.age || 0);
}

function currentDecade(player = state.player) {
  const y = currentYear(player);
  return Math.floor(y / 10) * 10;
}

function isLeapYearForPlayer(player = state.player) {
  const y = currentYear(player);
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

// Moves per year by life stage — early/late life are quieter, prime years are loaded
function movesForAge(age) {
  if (age <= 5) return 2;     // baby/toddler — fewer actions
  if (age <= 17) return 3;    // school years
  if (age <= 25) return 5;    // prime young-adult window
  if (age <= 45) return 4;    // adult
  if (age <= 65) return 3;    // middle-aged
  return 2;                    // elder
}

function changeStat(key, delta) {
  const player = state.player;
  if (key === "fame") {
    player.fame = clamp(player.fame + delta);
    return;
  }
  if (key === "karma") {
    player.karma = clamp(player.karma + delta);
    return;
  }
  player.stats[key] = clamp(player.stats[key] + delta);
}

function addLog(text, tone = "normal", age = state.player.age) {
  state.player.history.unshift({ age, text, tone });
  state.player.history = state.player.history.slice(0, 90);
}

function addCanonEvent(text, tone = "good", age = state.player.age) {
  if (!state.player) return;
  state.player.canonEvents ??= [];
  state.player.quirks ??= {};
  const weight = scoreCanonWeight(text, tone);
  state.player.canonEvents.unshift({ age, text, tone, weight });
  state.player.canonEvents = state.player.canonEvents.slice(0, 24);
  if (!state.player.spineEvent || weight > (state.player.spineEvent.weight || 0)) {
    state.player.spineEvent = { age, text, tone, weight };
  }
}

function scoreCanonWeight(text, tone) {
  const t = (text || "").toLowerCase();
  let w = 1;
  // Big life events
  if (/married|wedding|engaged/.test(t)) w += 6;
  if (/divorce/.test(t)) w += 5;
  if (/born |adopted |child |kid |miscarriage|surrogate|ivf/.test(t)) w += 6;
  if (/died|killed|overdose|funeral|buried/.test(t)) w += 7;
  // Career peaks
  if (/grammy|oscar|tony|emmy|won [\w ]*award/.test(t)) w += 7;
  if (/president|congress|senate|mayor|cabinet/.test(t)) w += 6;
  if (/ipo|public company|sold|company/.test(t)) w += 5;
  if (/draft|signed[ a]* (label|agency|with)/.test(t)) w += 5;
  // Money peaks
  if (/jackpot|powerball|million|billion/.test(t)) w += 6;
  if (/inherit/.test(t)) w += 3;
  // Crime/jail
  if (/jail|prison|arrest|sentence|charges|robbery/.test(t)) w += 5;
  if (/big score|disappeared/.test(t)) w += 6;
  // Identity
  if (/saint|cult|reconnected|orphan|foster/.test(t)) w += 4;
  if (/clean|sober|rehab/.test(t)) w += 4;
  // Negative weight bias for narrative texture
  if (tone === "bad") w += 2;
  return w;
}

function rememberInterest(key, amount = 1) {
  if (!state.player) return;
  state.player.interests ??= {};
  state.player.interests[key] = Math.max(0, (state.player.interests[key] || 0) + amount);
}

function topInterests(player = state.player, limit = 3) {
  const entries = Object.entries(player.interests || {})
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  return entries.map(([key]) => key);
}

function hasClassTrack(id) {
  return (state.player.classes || []).includes(id);
}

function classLabelList(player = state.player) {
  return (player.classes || []).map(id => classTracks[id]?.label || id);
}

function localRep(player = state.player, location = player.location) {
  player.cityRep ??= {};
  return player.cityRep[location] || 0;
}

function changeLocalRep(delta, location = state.player.location) {
  if (!state.player) return;
  state.player.cityRep ??= {};
  state.player.cityRep[location] = clamp((state.player.cityRep[location] || 0) + delta);
}

function spendMove() {
  state.player.moves = Math.max(0, state.player.moves - 1);
}

function createPlayer() {
  const focus = el.focusInput.value;
  const name = el.nameInput.value.trim() || pick(names);
  const location = el.homeInput.value;
  const origin = origins[location] || origins["Los Angeles, CA"];

  // Check for seeded spawn (someone shared a URL with ?seed=...)
  const seededSpawn = pendingSeedSpawn;
  pendingSeedSpawn = null;

  const classPick = el.classInput?.value || "random";
  const spawnKey = seededSpawn?.spawnClass
    || (classPick === "random" ? rollSpawnClass(location) : classPick);
  const spawn = spawnClasses[spawnKey] || spawnClasses.working;

  const stats = {
    health: randomInt(42, 78),
    happiness: randomInt(42, 78),
    smarts: randomInt(42, 78),
    looks: randomInt(42, 78),
    discipline: randomInt(42, 78)
  };
  stats[focus] = clamp(stats[focus] + 18);
  Object.entries(spawn.statBump || {}).forEach(([key, value]) => {
    stats[key] = clamp(stats[key] + value);
  });
  let startingFame = spawn.famBump || 0;

  const personalityKey = seededSpawn?.personality || rollPersonality();
  const personality = personalities[personalityKey];
  Object.entries(personality.bump || {}).forEach(([key, value]) => {
    if (key in stats) stats[key] = clamp(stats[key] + value);
    else if (key === "fame") startingFame = clamp(startingFame + value);
  });

  const baseMoney = randomInt(origin.money[0], origin.money[1]);
  const moneyMult = randomInt(Math.round(spawn.moneyMult[0] * 10), Math.round(spawn.moneyMult[1] * 10)) / 10;
  const startMoney = Math.max(0, Math.round(baseMoney * moneyMult));
  const inheritedAtBirth = (typeof pendingInheritance === "number" && pendingInheritance > 0) ? pendingInheritance : 0;

  const family = spawn.family();
  const heritageKey = el.heritageInput?.value || "mixed";
  const culturalNames = heritageNames[heritageKey] || peopleNames;
  const [siblingName, neighborName] = uniquePicks(origin.locals.concat(culturalNames, peopleNames), 2);
  const relationships = [];
  if (family.guardian) {
    relationships.push({ id: "guardian", name: family.guardian.name, role: family.guardian.role, bond: family.guardian.bond, type: "family" });
  }
  if (family.guardian2) {
    relationships.push({ id: "guardian2", name: family.guardian2.name, role: family.guardian2.role, bond: family.guardian2.bond, type: "family" });
  }
  if (spawnKey !== "survival") {
    relationships.push({ id: "sibling", name: siblingName, role: "Sibling", bond: randomInt(38, 74), type: "family" });
  }
  relationships.push({ id: "neighbor", name: neighborName, role: `${origin.short} neighbor`, bond: randomInt(28, 56), type: "friend" });
  if (family.extra) {
    relationships.push({ id: "extra", name: family.extra.name, role: family.extra.role, bond: family.extra.bond, type: family.extra.type || "ally" });
  }

  state.player = {
    version: SAVE_VERSION,
    name,
    identity: normalizeIdentity(el.identityInput.value),
    handle: "",
    avatar: {
      skin: el.skinInput.value,
      hair: el.hairInput.value,
      hairColor: el.hairColorInput.value,
      outfit: el.outfitInput.value,
      expression: el.expressionInput.value
    },
    home: location,
    origin: location,
    location,
    focus,
    spawnClass: spawnKey,
    spawnLabel: spawn.label,
    personality: personalityKey,
    personalityLabel: personality.label,
    birthYear: seededSpawn?.birthYear || pickBirthYear(),
    seedOrigin: seededSpawn ? seededSpawn.fromName : null,
    religion: el.religionInput?.value || "none",
    religionLabel: religionLabels[el.religionInput?.value || "none"],
    heritage: el.heritageInput?.value || "mixed",
    heritageLabel: heritageLabels[el.heritageInput?.value || "mixed"],
    momJob: pickParentOccupation(el.momJobInput?.value, true),
    dadJob: pickParentOccupation(el.dadJobInput?.value, false),
    age: 0,
    alive: true,
    moves: movesForAge(0),
    money: startMoney + inheritedAtBirth,
    pendingInheritance: 0,
    inheritedFromParent: inheritedAtBirth > 0 ? inheritedAtBirth : null,
    debt: 0,
    stats,
    jobId: "none",
    salaryBonus: 0,
    school: "Newborn",
    educationRank: 0,
    fame: startingFame,
    karma: clamp(50 + (spawn.karma || 0)),
    record: 0,
    risksTaken: 0,
    licenses: [],
    certifications: [],
    trips: [],
    pets: [],
    children: [],
    books: 0,
    championships: 0,
    politicalCapital: 0,
    married: false,
    businessReputation: 0,
    socialPage: false,
    followers: 0,
    posts: 0,
    viralHits: 0,
    dropout: false,
    streetRep: spawn.streetRep || 0,
    recovery: 0,
    fitnessLevel: 0,
    dietScore: 50,
    smokingLevel: 0,
    yearsSmoking: 0,
    quitAttempts: 0,
    company: null,
    companyExits: 0,
    classes: [],
    interests: {},
    afterSchool: [],
    gang: null,
    gangHeat: 0,
    crewExits: 0,
    cityRep: {},
    aiMemory: [],
    assets: [],
    achievements: [],
    relationships,
    history: [],
    canonEvents: [],
    quirks: {},
  };

  state.player.familyStyle = rollFamilyStyle(spawnKey);

  // --- Innate traits (replaces standalone rollDisability) ---
  const identityToSex = { "Guy": "M", "Girl": "F", "Trans guy": "F", "Trans girl": "M" };
  const sexHint = identityToSex[state.player.identity];
  const traits = (typeof Traits !== "undefined")
    ? Traits.roll({ sex: sexHint, heritage: state.player.heritage })
    : null;
  state.player.traits = traits;

  if (traits) {
    const mods = Traits.statMods(traits);
    Object.entries(mods).forEach(([k, v]) => {
      if (k in state.player.stats) state.player.stats[k] = clamp(state.player.stats[k] + v);
    });
    // Back-compat shim: keep player.disability populated for old code paths
    if (traits.health.disabilityFromBirth) {
      state.player.disability = { id: "innate", label: traits.health.disabilityFromBirth, statMod: {} };
    } else if (traits.health.disabilityMild) {
      state.player.disability = { id: "mild", label: traits.health.disabilityMild, statMod: {} };
    } else {
      state.player.disability = null;
    }
  } else {
    state.player.disability = rollDisability();
  }

  // Cross-life meta unlocks
  const meta = typeof loadMeta === "function" ? loadMeta() : { unlocks: {} };
  state.player.lifeNumber = (meta.livesLived || 0) + 1;
  if (meta.unlocks?.starting_trust) {
    state.player.money += 25000;
    addLog("You start this life with a $25,000 trust from a past life's wealth.", "good");
  }
  if (meta.unlocks?.born_with_followers) {
    state.player.socialPage = true;
    state.player.followers += 1200;
    state.player.handle = `@${state.player.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    addLog("You inherited an account with 1,200 followers from a past life's legacy.", "good");
  }
  if (meta.unlocks?.political_lineage) {
    state.player.politicalCapital = (state.player.politicalCapital || 0) + 10;
    addLog("Family name carries political weight in this town.", "good");
  }
  if (meta.unlocks?.street_smarts) {
    state.player.streetRep = (state.player.streetRep || 0) + 4;
    addLog("Block knows your family name. Real respect.", "good");
  }
  if (meta.unlocks?.long_life_blood) {
    state.player.stats.health = Math.min(100, state.player.stats.health + 8);
    addLog("Long-life family blood. Your health pool starts higher.", "good");
  }
  // Trait stat mods already applied above when traits rolled.
  // Only apply legacy disability.statMod if traits weren't available (fallback).
  if (!state.player.traits && state.player.disability && state.player.disability.statMod) {
    Object.entries(state.player.disability.statMod).forEach(([k, v]) => {
      if (k in state.player.stats) state.player.stats[k] = clamp(state.player.stats[k] + v);
    });
  }
  if (state.player.familyStyle === "orphan" || state.player.familyStyle === "foster") {
    state.player.relationships = state.player.relationships.filter(r => r.id !== "guardian" && r.id !== "guardian2");
    if (state.player.familyStyle === "foster") {
      state.player.relationships.unshift({ id: "fosterMom", name: pick(peopleNames), role: "Foster mom", bond: randomInt(34, 58), type: "family" });
    } else {
      state.player.relationships.unshift({ id: "groupHome", name: "Group home staff", role: "State guardian", bond: randomInt(18, 38), type: "family" });
    }
  }

  addLog(`${name} was born in ${location}, ${state.player.birthYear}.`, "good");
  addCanonEvent(`${spawn.canonLine(name).replace(/\.$/, "")} The year was ${state.player.birthYear}.`);
  addLog(`Day one in ${origin.short}: ${origin.vibe}.`, "good");
  addLog(`Hand dealt: ${spawn.label} — ${spawn.summary}`, spawnKey === "survival" || spawnKey === "struggling" ? "bad" : "good");
  if (state.player.familyStyle === "orphan") {
    addLog("Family: orphaned at birth. Group home through age 5.", "bad");
    addCanonEvent(`${name} was orphaned at birth.`);
  } else if (state.player.familyStyle === "foster") {
    addLog("Family: bounced through foster homes early.", "bad");
    addCanonEvent(`${name} grew up in foster care.`);
  } else if (state.player.familyStyle === "strict") {
    addLog("Family: strict parents. Rules, chores, locked doors at 9.", "good");
  } else if (state.player.familyStyle === "absent") {
    addLog("Family: parents around in body, not much else.", "bad");
  } else if (state.player.familyStyle === "loving") {
    addLog("Family: real warmth. Dinner together, doors open.", "good");
  }
  if (state.player.disability) {
    addLog(`Born with ${state.player.disability.label}. The world treats you different.`, "bad");
    addCanonEvent(`${name} was born with ${state.player.disability.label}.`);
  }
  // --- Trait flavor (innate rolls — height, looks tier, neuro, etc.) ---
  if (state.player.traits && typeof Traits !== "undefined") {
    const t = state.player.traits;
    addLog(`Build: ${Traits.describe(t)}.`, "good");
    addCanonEvent(`${name}: ${Traits.describe(t)}.`);
    const flavor = Traits.flavorLines(t);
    flavor.slice(0, 4).forEach(line => addLog(line, "good"));
    if (flavor.length > 4) {
      flavor.slice(4).forEach(line => addCanonEvent(`${name}: ${line}`));
    } else {
      flavor.forEach(line => addCanonEvent(`${name}: ${line}`));
    }
  }
  addLog(`Personality: ${personality.label} — ${personality.tagline}.`, "good");
  addCanonEvent(`${name} grew into a ${personality.label}: ${personality.tagline}.`);
  // Custom-life canon: parents + heritage + faith
  const momFlavor = parentOccupationFlavor[state.player.momJob] || `your mom did her own thing`;
  const dadFlavor = parentOccupationFlavor[state.player.dadJob] || `your dad worked something`;
  addLog(`Home setup: ${momFlavor}, ${dadFlavor}.`, "good");
  addCanonEvent(`Grew up with ${momFlavor} and ${dadFlavor}.`);
  if (state.player.heritage && state.player.heritage !== "mixed") {
    addLog(`Heritage: ${state.player.heritageLabel}.`, "good");
  }
  if (state.player.religion && state.player.religion !== "none") {
    addLog(`Faith: ${state.player.religionLabel} household.`, "good");
  }
  if (inheritedAtBirth > 0) {
    addCanonEvent(`${name} inherited ${money(inheritedAtBirth)} from their parent ${state.player.seedOrigin || ""}. Family line continues.`, "good");
    addLog(`Inherited ${money(inheritedAtBirth)} from the parent line.`, "good");
    pendingInheritance = 0;
  }
  unlock("first_year", false);
  state.activeCategory = "little";
  state.showAllCategories = false;
  state.focusedStat = null;
  saveGame();
  render();
  if (typeof refreshCityAudio === "function") refreshCityAudio();
}

function unlock(id, writeLog = true) {
  const player = state.player;
  if (!player || player.achievements.includes(id)) return;
  player.achievements.push(id);
  const item = achievements.find(achievement => achievement.id === id);
  if (writeLog && item) {
    addLog(`Milestone: ${item.text}.`, "good");
    addCanonEvent(item.text);
  }
}

function checkMilestones() {
  const player = state.player;
  if (player.age >= 1) unlock("first_year", false);
  if (player.educationRank >= 3) unlock("graduate");
  if (currentJob(player).salary >= 60000 || ["designer", "developer", "surgeon", "founder", "creator"].includes(player.jobId)) unlock("pro_job");
  if (netWorth() >= 100000) unlock("rich");
  if (player.fame >= 50) unlock("famous");
  if (player.risksTaken >= 5) unlock("chaos");
  if (player.trips.length >= 3) unlock("traveler");
  if (player.licenses.length >= 2) unlock("licensed");
  if (player.pets.length >= 1) unlock("pet_friend");
  if (player.assets.some(asset => asset.id === "business" || asset.id === "franchise")) unlock("mogul");
  if (player.married) unlock("married");
  if (player.children.length >= 1) unlock("parent");
  if (player.books >= 1) unlock("author");
  if (player.politicalCapital >= 60) unlock("office");
  if (player.championships >= 1) unlock("champion");
  if (player.dropout) unlock("dropout");
  if (player.certifications.includes("ged")) unlock("ged");
  if (player.socialPage) unlock("social");
  if (player.location === "Skid Row, Los Angeles") unlock("skidrow");
  if (player.smokingLevel > 0) unlock("smoker");
  if (player.quitAttempts > 0 && player.smokingLevel === 0) unlock("quitSmoking");
  if (player.jobId === "ceo" && player.company) unlock("ceo");
  if (player.companyExits > 0) unlock("exit");
  if (player.company?.stage >= 5) unlock("publicCompany");
  if (player.classes?.length > 0) unlock("classLane");
  if (player.gang) unlock("crewPath");
  if (player.crewExits > 0) unlock("crewExit");
  if (player.age >= 70) unlock("long_life");
}

function updateSchool() {
  const player = state.player;
  if (player.dropout) return;
  const before = player.school;
  if (player.educationRank >= 3 && player.age >= 18) return;
  if (player.age < 4) {
    player.school = "Newborn";
    player.educationRank = 0;
  } else if (player.age < 6) {
    player.school = "Preschool";
    player.educationRank = 1;
  } else if (player.age < 12) {
    player.school = "Elementary school";
    player.educationRank = 1;
  } else if (player.age < 14) {
    player.school = "Middle school";
    player.educationRank = 2;
  } else if (player.age < 18) {
    player.school = "High school";
    player.educationRank = 2;
  } else if (player.age === 18 && player.educationRank < 3) {
    player.school = "High school graduate";
    player.educationRank = 3;
  }

  if (before !== player.school) addLog(`You started ${player.school}.`, "good");
  if (player.age <= 5 && state.activeCategory !== "little") state.activeCategory = "little";
}

function ageUp() {
  const player = state.player;
  if (!player || !player.alive) return;

  if (player.currentTrip) {
    addLog(`Your trip to ${player.currentTrip} wrapped. Back to ${originOf(player.location).short}.`, "good");
    player.currentTrip = null;
  }

  player.age += 1;
  player.moves = movesForAge(player.age);
  player.ghostSeededThisYear = false;

  if (player.inJail) {
    player.jailYearsServed = (player.jailYearsServed || 0) + 1;
    player.jailYearsLeft = Math.max(0, (player.jailYearsLeft || 0) - 1);
    addLog(`Year ${player.jailYearsServed} on the inside. ${player.jailYearsLeft} left on paper.`, "bad");
    if (player.jailYearsLeft <= 0) {
      endJailSentence(player);
    } else {
      player.relationships.forEach(person => {
        person.bond = clamp(person.bond + randomInt(-6, 0));
      });
      tickNPCArcs(player);
      changeStat("health", randomInt(-3, 1));
      changeStat("happiness", randomInt(-6, 0));
      changeStat("discipline", randomInt(0, 3));
      saveGame();
      render();
      return;
    }
  }

  updateSchool();

  const job = currentJob();
  if (annualPay() > 0) {
    player.money += annualPay();
    changeStat("happiness", randomInt(-2, 2));
    addLog(`You earned ${money(annualPay())} as ${withArticle(job.title)}.`);
  }

  const passive = passiveIncome();
  if (passive > 0) {
    player.money += passive;
    addLog(`Your assets generated ${money(passive)} in passive income.`, "good");
  }

  if (player.age >= 18) {
    const cost = livingCost();
    if (player.money >= cost) {
      player.money -= cost;
      addLog(`Living expenses cost ${money(cost)}.`);
    } else {
      const shortfall = cost - player.money;
      player.money = 0;
      player.debt += shortfall;
      addLog(`You borrowed ${money(shortfall)} to cover bills.`, "bad");
    }
  }

  player.assets = player.assets.map(asset => ({
    ...asset,
    value: Math.max(25, Math.floor(asset.value * randomInt(91, 104) / 100))
  }));

  player.relationships.forEach(person => {
    person.bond = clamp(person.bond + randomInt(-4, 1));
  });
  tickNPCArcs(player);
  player.children = player.children.map(child => {
    if (typeof child === "string") return { name: child, age: 1 };
    return { ...child, age: (child.age || 0) + 1 };
  });
  if (localRep(player) > 0) {
    changeLocalRep(randomInt(-1, 1));
  }

  changeStat("health", player.age > 48 ? randomInt(-4, 0) : randomInt(-2, 2));
  changeStat("happiness", randomInt(-5, 3));
  changeStat("looks", player.age > 40 ? randomInt(-3, 1) : randomInt(-1, 2));
  changeStat("discipline", randomInt(-1, 2));
  if (player.fitnessLevel > 0) {
    changeStat("health", Math.floor(player.fitnessLevel / 4));
    changeStat("looks", chance(30) ? 1 : 0);
    player.fitnessLevel = Math.max(0, player.fitnessLevel - randomInt(0, 2));
  }
  if (player.dietScore > 64) {
    changeStat("health", 2);
    changeStat("looks", chance(40) ? 1 : 0);
  } else if (player.dietScore < 34) {
    changeStat("health", -2);
    changeStat("looks", chance(32) ? -1 : 0);
  }
  player.dietScore = clamp(player.dietScore + randomInt(-3, 2));
  if (player.smokingLevel > 0) {
    player.yearsSmoking += 1;
    const healthHit = randomInt(1, 3 + player.smokingLevel);
    changeStat("health", -healthHit);
    changeStat("looks", chance(35) ? -1 : 0);
    if (chance(18 + player.smokingLevel * 7)) {
      addLog("Smoking caught up with your lungs this year.", "bad");
    }
  }
  runCompanyYear();
  if (player.socialPage && player.posts > 0) {
    const growth = randomInt(8, 120) + Math.floor(player.fame * 4) + Math.floor(player.followers * 0.015);
    player.followers += growth;
    if (chance(8 + Math.floor(player.stats.looks / 20))) {
      player.viralHits += 1;
      player.followers += randomInt(500, 4200);
      player.fame = clamp(player.fame + randomInt(2, 7));
      addLog(`${player.handle} had an old post catch a second wave.`, "good");
    }
  }
  if (player.location === "Skid Row, Los Angeles" && player.age >= 16) {
    player.streetRep = Math.max(0, player.streetRep + randomInt(1, 3));
    if (chance(38)) {
      applyEffects("Skid Row made the year harder, but your survival instincts sharpened.", {
        health: -3,
        happiness: -3,
        streetRep: 2
      }, "bad");
    }
  }
  if (player.gang) {
    player.gang.years += 1;
    player.gang.loyalty = clamp(player.gang.loyalty + randomInt(-3, 6));
    player.gangHeat = Math.max(0, player.gangHeat + randomInt(-1, 3));
    if (player.gangHeat > 10 && chance(24 + player.gangHeat * 2)) {
      addLog(`${player.gang.name} brought heat into your year. It is getting harder to keep life normal.`, "bad");
      changeStat("happiness", -5);
      changeStat("discipline", -2);
    }
  }
  // Ghosts from prior lives — surface occasionally as descendants/contacts
  if (player.age >= 13 && chance(6) && !player.ghostSeededThisYear) {
    const meta = typeof loadMeta === "function" ? loadMeta() : null;
    const ghosts = (meta && meta.ghosts) || [];
    const candidates = ghosts.filter(g => !player.relationships.some(r => r.name === g.name));
    if (candidates.length > 0) {
      const g = pick(candidates);
      let role;
      if (g.arc === "snake") role = `${g.name}'s grandkid (recognizes the name)`;
      else if (g.arc === "star") role = `${g.name}'s niece — heard the stories`;
      else role = `Descendant of ${g.fromLife}`;
      player.relationships.push({ id: `ghost-${Date.now()}`, name: g.name, role, bond: g.arc === "snake" ? randomInt(18, 38) : randomInt(54, 76), type: "friend", priorLife: g.fromLife, ghostArc: g.arc });
      addLog(`${g.name} showed up. Same name as somebody from a past life. Genes carry.`, "good");
      addCanonEvent(`${g.name} reappeared from a prior life.`);
      player.ghostSeededThisYear = true;
    }
  }
  if (player.classes?.length > 0 && player.age <= 24) {
    const lane = pick(player.classes);
    rememberInterest(classTracks[lane]?.interest || lane, 1);
    if (chance(22)) {
      addLog(`${classTracks[lane]?.label || lane} kept shaping your year.`, "good");
      changeStat("smarts", 1);
      changeStat("discipline", 1);
    }
  }

  if (!player.inJail && player.age >= 14 && player.record >= 2) {
    const heat = player.record * 6 + (player.gang ? player.gangHeat * 2 : 0) + Math.floor(player.risksTaken / 3);
    const protect = player.hasLawyerOnRetainer ? 18 : 0;
    if (chance(heat - protect)) {
      const charge = pick([
        "possession with intent",
        "assault with a deadly weapon",
        "armed robbery",
        "RICO conspiracy",
        "felony evasion",
        "grand theft",
        "wire fraud"
      ]);
      const years = Math.max(1, Math.min(12, player.record + randomInt(0, 3)));
      addLog(`Cops kicked the door at dawn. They had a warrant: ${charge}.`, "bad");
      if (player.hasLawyerOnRetainer && chance(40)) {
        player.record = Math.max(0, player.record - 1);
        applyEffects(`Your lawyer was at the precinct before booking. They cut ${charge} down to probation.`, { money: -3200, happiness: -8, discipline: 3 }, "bad");
      } else {
        startJailSentence(player, years, charge);
        saveGame();
        render();
        return;
      }
    }
  }

  const o = originOf(player.origin || player.location);
  const milestoneAges = { 1: true, 5: true, 10: true, 13: true, 16: true, 18: true, 21: true, 25: true, 30: true, 40: true, 50: true, 65: true, 80: true };
  if (milestoneAges[player.age]) {
    const ageLines = {
      1: `${player.name} survived their first year on Earth — and it happened in ${o.short}.`,
      5: `${player.name} turned 5. Old enough to remember ${o.short}, young enough to still believe it loves them back.`,
      10: `Hit double digits in ${o.short}. ${player.name} starts noticing how the world treats people.`,
      13: `Teenager. ${o.short} feels different at 13 — louder, sharper, faster.`,
      16: `16 years old. Old enough to drive, old enough to disappoint.`,
      18: `18. Adult on paper. The world is starting to send the bill.`,
      21: `21. The bar lets you in. The street still doesn't care.`,
      25: `Quarter life in ${o.short}. The game is real now.`,
      30: `30. You're past being the next big thing — you have to BE the thing.`,
      40: `40 hits different. Mirror conversations get longer.`,
      50: `50 in ${o.short}. You've outlasted half the people who said you wouldn't.`,
      65: `65. Officially old. People hold doors for you now.`,
      80: `80 trips around the sun. ${o.short} doesn't look the same anymore.`
    };
    addLog(ageLines[player.age], "good");
    addCanonEvent(ageLines[player.age]);
  }
  checkDeath();
  checkMilestones();
  saveGame();
  render();

  if (player.alive) showEvent(pickLifeEvent(events.filter(event => event.when(player)), player));
}

function livingCost() {
  const player = state.player;
  let base = randomInt(5200, 9800);
  if (["New York City, NY", "Brooklyn, NY", "Hollywood, Los Angeles", "London, UK", "Tokyo, Japan"].includes(player.location)) base += 2600;
  if (["Los Angeles, CA", "Miami, FL"].includes(player.location)) base += 1200;
  if (["Skid Row, Los Angeles"].includes(player.location)) base -= 3900;
  if (["Houston, TX", "Atlanta, GA", "Mexico City, Mexico"].includes(player.location)) base -= 800;
  if (hasAsset("condo")) base -= 1800;
  if (hasAsset("car")) base += 900;
  if (player.fame > 35) base += 1600;
  return Math.max(1200, base);
}

function passiveIncome() {
  const player = state.player;
  let income = 0;
  if (hasAsset("business")) income += randomInt(1800, 9500) + player.businessReputation * 120;
  if (hasAsset("franchise")) income += randomInt(12000, 42000) + player.businessReputation * 260;
  if (hasAsset("portfolio")) income += randomInt(-2500, 6800) + Math.floor(player.stats.smarts * 18);
  if (hasAsset("studio") && player.fame > 15) income += randomInt(600, 3600) + player.fame * 45;
  if (hasAsset("lakeHouse")) income += randomInt(900, 5200);
  return income;
}

function runCompanyYear() {
  const player = state.player;
  const company = player.company;
  if (!company) return;

  const burn = randomInt(1800, 5200) * company.stage + company.employees * randomInt(650, 1900);
  const sales = randomInt(0, 5400) + company.launches * randomInt(2200, 7600) + player.businessReputation * 260 + company.morale * 75 + company.stage * randomInt(1600, 9000);
  const result = sales - burn;
  company.runway += result;
  company.morale = clamp(company.morale + randomInt(-5, 4));

  if (result >= 0) {
    const lift = Math.floor(result * randomInt(5, 18) / 10) + company.employees * randomInt(300, 1200);
    company.valuation = Math.max(company.valuation, company.valuation + lift);
    if (player.jobId === "ceo") {
      const bonus = Math.min(250000, Math.floor(result * 0.12));
      if (bonus > 0) player.money += bonus;
    }
    addLog(`${company.name} had a profitable year. Valuation climbed to ${money(company.valuation)}.`, "good");
  } else if (company.runway < 0) {
    const emergencyDebt = Math.floor(Math.abs(company.runway) * 0.35);
    player.debt += emergencyDebt;
    company.runway = 0;
    company.valuation = Math.max(1000, Math.floor(company.valuation * randomInt(72, 91) / 100));
    company.morale = clamp(company.morale - randomInt(8, 18));
    addLog(`${company.name} burned too much cash. You personally covered ${money(emergencyDebt)} of the mess.`, "bad");
  } else {
    company.valuation = Math.max(1000, Math.floor(company.valuation * randomInt(94, 103) / 100));
    addLog(`${company.name} survived a burn-heavy year. Runway is ${money(company.runway)}.`);
  }
}

function rollCauseOfDeath(player) {
  const causes = [];
  const young = player.age < 35;
  const middleAged = player.age >= 35 && player.age < 60;
  const old = player.age >= 60;

  // Old-age peaceful death — ONLY for actually old characters
  if (old) causes.push({ cause: "Old age. Slept and didn't wake up.", weight: 6 + Math.max(0, player.age - 70) });

  // Smoking
  if (player.smokingLevel > 1 || player.yearsSmoking > 10) {
    causes.push({ cause: "Lung cancer from years of smoking.", weight: middleAged ? 5 : 7 });
  }

  // Heart / health
  if (player.stats.health < 30) causes.push({ cause: "Heart attack. The body had been telling the story for years.", weight: middleAged ? 7 : 4 });
  if (player.dietScore < 25 && player.age >= 45) causes.push({ cause: "Diabetes complications. The fast food caught up.", weight: 3 });

  // Risk-driven young deaths
  if (player.risksTaken >= 4) causes.push({ cause: "Overdose. Friends found out by lunch.", weight: young ? 7 : 3 });
  if (player.streetRep > 12 || player.gang) causes.push({ cause: "Caught in crossfire. Block hung shirts for weeks.", weight: young ? 6 : 3 });
  if (player.record >= 2) causes.push({ cause: "Killed in a fight inside. Never made parole.", weight: 4 });

  // Mental health
  if (player.stats.happiness < 20 && player.age >= 18) causes.push({ cause: "Took their own life. The notes were clear. The questions weren't.", weight: 3 });

  // Disease
  if (player.age >= 45) causes.push({ cause: "Cancer. Fought it for two years.", weight: 3 });

  // Accidents — universal but more common in middle age
  causes.push({ cause: "Car accident on a road they drove a thousand times.", weight: middleAged ? 3 : 2 });

  // Personality-flavored young deaths
  if (young && (player.personality === "wild" || player.personality === "reckless")) {
    causes.push({ cause: "DUI. They never saw the other car.", weight: 5 });
    causes.push({ cause: "Bar fight. They picked the wrong night.", weight: 3 });
  }

  // Young default — never "peaceful old age"
  if (young && causes.length === 0) {
    causes.push({ cause: "Accident. Twenty seconds the wrong way.", weight: 4 });
    causes.push({ cause: "Random violence. Wrong place, wrong time.", weight: 3 });
    causes.push({ cause: "Undiagnosed condition. Nobody saw it.", weight: 2 });
  }

  // Middle-aged default — never "peaceful old age"
  if (middleAged && causes.length <= 1) {
    causes.push({ cause: "Sudden heart attack. They were 'too young for this.'", weight: 3 });
    causes.push({ cause: "Aggressive cancer. Found late.", weight: 3 });
  }

  // Secret/special death paths
  if (player.relationships?.some(r => r.arc === "snake" && r.betrayed) && player.gang) {
    causes.push({ cause: "Killed by your own snake. They knew where you slept.", weight: 4 });
  }
  if (player.stats.karma >= 90 && player.risksTaken >= 3) {
    causes.push({ cause: "Died saving a stranger from something nobody else stepped toward.", weight: 4 });
  }
  if (player.isSaint) {
    causes.push({ cause: "Died exactly as you lived. The cause kept going after.", weight: 6 });
  }
  if (player.offGrid && player.age >= 70) {
    causes.push({ cause: "Found peaceful in the cabin. Garden still alive.", weight: 8 });
  }
  if (player.isCultLeader) {
    causes.push({ cause: "Compound burned. FBI ruled it murder-suicide. Members swear you ascended.", weight: 6 });
  }
  if (player.bigScoreAttempted && player.money >= 800000) {
    causes.push({ cause: "Disappeared at 67 in a country with no extradition. Body never confirmed.", weight: 4 });
  }
  if (player.megaJackpot && player.money >= 10000000) {
    causes.push({ cause: "Helicopter crash en route to a private island. Beneficiaries arguing in court.", weight: 3 });
  }
  if (player.jobId === "president") {
    causes.push({ cause: "State funeral. The flag flew at half-staff for a week.", weight: 8 });
  }
  if (player.trueLoveClaimed) {
    causes.push({ cause: "Died holding their hand. Six months later, they followed.", weight: 6 });
  }

  // Truly old fallback only when no other cause weights
  if (causes.length === 0) {
    if (old) causes.push({ cause: "Quiet death. Peaceful. Most people went the same way.", weight: 1 });
    else causes.push({ cause: "Sudden, unexpected. Nobody saw it coming.", weight: 1 });
  }

  const total = causes.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of causes) {
    r -= c.weight;
    if (r <= 0) return c.cause;
  }
  return causes[0].cause;
}

function checkDeath() {
  const player = state.player;
  if (player.age < 24) return;
  let risk = 0;
  if (player.age >= 68) risk += player.age - 66;
  if (player.stats.health < 40) risk += (40 - player.stats.health) / 4;
  if (player.smokingLevel > 0) risk += player.yearsSmoking / 4;
  if (player.risksTaken >= 6) risk += 2;
  if (player.streetRep > 20) risk += 3;
  if (player.gang) risk += 2;
  if (player.record >= 3) risk += 2;
  if (player.stats.happiness < 15) risk += 1;
  if (chance(risk)) {
    player.alive = false;
    player.causeOfDeath = rollCauseOfDeath(player);
    player.deathAge = player.age;
    addLog(`${player.name} died at ${player.age}. ${player.causeOfDeath}`, "bad");
    addCanonEvent(`${player.name} died at ${player.age}. ${player.causeOfDeath}`, "bad");
    if (typeof recordLifeForMeta === "function") recordLifeForMeta(player);
    showLifeRecap();
  }
}

function classifyDeath(player) {
  const c = (player.causeOfDeath || "").toLowerCase();
  if (/state funeral|inauguration|cabinet|saint|peaceful|cabin|long peaceful/.test(c)) return "legacy";
  if (/overdose|narcan|cancer.*smoking|lung|suicide|notes/.test(c)) return "tragic";
  if (/crossfire|gang|crew|robbery|fight|killed|big score|gunshot|prison|inside/.test(c)) return "violent";
  if (/old age|quiet death|slept and didn't wake|garden|true love|holding their hand/.test(c)) return "peaceful";
  if (/jackpot|helicopter|disappeared|extradition/.test(c)) return "wild";
  return "default";
}

// ============================================================
// HALL OF FAME — past lives persist across deaths
// ============================================================
const HOF_KEY = "run-it-back-history";
const HOF_MAX = 12;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HOF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function lifeScore(life) {
  if (!life) return 0;
  return (life.age || 0) + Math.floor((life.money || 0) / 10000) + (life.fame || 0) * 2 + (life.achievements || 0) * 5;
}

function saveHistory(arr) {
  // Keep BEST 12 by score, not most recent. Best lives stay.
  const ranked = arr.slice().sort((a, b) => lifeScore(b) - lifeScore(a)).slice(0, HOF_MAX);
  try { localStorage.setItem(HOF_KEY, JSON.stringify(ranked)); } catch (e) {}
}

function archiveLife(player) {
  if (!player) return;
  const history = loadHistory();
  const o = (typeof originOf === "function") ? originOf(player.origin || player.location || "") : { short: "" };
  const summary = {
    name: player.name,
    age: player.deathAge || player.age,
    location: o.short || player.location,
    cause: player.causeOfDeath || "passed",
    money: Math.round((typeof netWorth === "function") ? netWorth(player) : (player.money || 0)),
    fame: player.fame || 0,
    achievements: (player.achievements || []).length,
    canon: (player.canonEvents || []).slice(0, 3).map(c => c.text),
    avatarSeed: player.name,
    skin: player.avatar?.skin,
    hair: player.avatar?.hair,
    hairColor: player.avatar?.hairColor,
    deadAt: Date.now(),
    classification: (typeof classifyDeath === "function") ? classifyDeath(player) : "default"
  };
  history.unshift(summary);
  saveHistory(history);
}

function getRecords() {
  const history = loadHistory();
  if (!history.length) return null;
  return {
    longest: history.reduce((max, l) => l.age > max.age ? l : max, history[0]),
    richest: history.reduce((max, l) => l.money > max.money ? l : max, history[0]),
    famous: history.reduce((max, l) => l.fame > max.fame ? l : max, history[0]),
    count: history.length
  };
}

function renderHallOfFame() {
  const wrap = document.querySelector("#hofList");
  if (!wrap) return;
  const history = loadHistory();
  if (!history.length) {
    wrap.innerHTML = `<p class="hof-empty">No lives yet. Live one and die to fill this board.</p>`;
    return;
  }
  const records = getRecords();
  const recordLine = records ? `<div class="hof-records">
    <div><strong>Longest</strong><span>${records.longest.age} (${records.longest.name})</span></div>
    <div><strong>Richest</strong><span>$${records.richest.money.toLocaleString()} (${records.richest.name})</span></div>
    <div><strong>Most famous</strong><span>${records.famous.fame} fame (${records.famous.name})</span></div>
  </div>` : "";
  const cards = history.map((life, i) => `
    <article class="hof-life ${i === 0 ? "hof-life--top" : ""}">
      <div class="hof-life-head">
        <strong>${i === 0 ? "★ " : ""}${life.name}</strong>
        <span class="hof-life-age">age ${life.age}</span>
      </div>
      <div class="hof-life-body">
        <span>${life.location || "—"}</span>
        <span class="hof-life-cause">${life.cause}</span>
      </div>
      <div class="hof-life-stats">
        <span>$${life.money.toLocaleString()}</span>
        <span>${life.fame} fame</span>
        <span>${life.achievements} unlocks</span>
        <span class="hof-life-score">${lifeScore(life)} pts</span>
      </div>
    </article>
  `).join("");
  wrap.innerHTML = recordLine + `<div class="hof-grid">${cards}</div>`;
}

function openHallOfFame() {
  const dlg = document.querySelector("#hofDialog");
  if (!dlg) return;
  renderHallOfFame();
  try { dlg.showModal(); } catch (e) {}
}


function showLifeRecap() {
  if (typeof deathSfx === "function") deathSfx();
  const player = state.player;
  if (typeof archiveLife === "function") archiveLife(player);
  if (!el.lifeRecapDialog) return;
  const recapCard = document.querySelector("#recapCard");
  if (recapCard) {
    recapCard.classList.remove("recap-tragic", "recap-violent", "recap-peaceful", "recap-legacy", "recap-wild", "recap-default");
    recapCard.classList.add(`recap-${classifyDeath(player)}`);
  }

  const o = originOf(player.origin || player.location);
  const personality = personalityOf(player);
  const finalWorth = netWorth();
  const peakFame = player.fame;
  const job = currentJob();

  document.querySelector("#recapName").textContent = player.name;
  const lifeLabel = player.lifeNumber ? ` · Life #${player.lifeNumber}` : "";
  document.querySelector("#recapSub").textContent = `Born in ${o.short} · Died at ${player.age}${player.spawnLabel ? ` · ${player.spawnLabel}` : ""}${lifeLabel}`;
  document.querySelector("#recapPortrait").src = buildAvatarURL(player.avatar || {}, player.name);
  document.querySelector("#recapCause").textContent = player.causeOfDeath || "Cause unknown.";

  // SPINE EVENT — the moment this run was really about
  const spineHost = document.querySelector("#recapSpine") || (() => {
    const card = document.querySelector("#recapCard");
    if (!card) return null;
    const div = document.createElement("div");
    div.id = "recapSpine";
    div.className = "recap-spine";
    const cause = document.querySelector("#recapCause");
    if (cause && cause.parentNode) cause.parentNode.insertBefore(div, cause.nextSibling);
    return div;
  })();
  if (spineHost) {
    if (player.spineEvent) {
      spineHost.innerHTML = `<p class="kicker">This life was about</p><h3>${player.spineEvent.text}</h3><p class="recap-spine-age">at ${player.spineEvent.age}</p>`;
    } else {
      spineHost.innerHTML = "";
    }
  }

  const stats = document.querySelector("#recapStats");
  stats.innerHTML = "";
  const fields = [
    ["Net Worth", finalWorth >= 0 ? money(finalWorth) : `-${money(Math.abs(finalWorth))}`],
    ["Personality", personality.label],
    ["Fame", peakFame.toLocaleString()],
    ["Followers", (player.followers || 0).toLocaleString()],
    ["Cities visited", (player.trips?.length || 0).toString()],
    ["Final job", job.title || "Unemployed"],
    ["Kids", (player.children?.length || 0).toString()],
    ["Karma", `${player.karma}/100`]
  ];
  fields.forEach(([label, value]) => {
    const box = document.createElement("div");
    box.className = "recap-stat";
    box.innerHTML = `<div class="recap-stat-label">${label}</div><div class="recap-stat-value">${value}</div>`;
    stats.append(box);
  });

  const momentsEl = document.querySelector("#recapMoments");
  momentsEl.innerHTML = "";
  const canon = (player.canonEvents || []).slice(0, 6).reverse();
  if (canon.length === 0) {
    const li = document.createElement("li");
    li.textContent = `A quiet life in ${o.short}.`;
    momentsEl.append(li);
  } else {
    canon.forEach(c => {
      const li = document.createElement("li");
      li.textContent = c.text;
      momentsEl.append(li);
    });
  }

  document.querySelector("#recapFooter").textContent = `"${personality.tagline.charAt(0).toUpperCase() + personality.tagline.slice(1)}." — ${o.short}, ${o.vibe}.`;

  // Achievements unlocked this life
  const achEl = document.querySelector("#recapAchievements");
  if (achEl) {
    achEl.innerHTML = "";
    const unlocked = (player.achievements || []).map(id => achievements.find(a => a.id === id)).filter(Boolean);
    if (unlocked.length > 0) {
      const kicker = document.createElement("p");
      kicker.className = "recap-kicker";
      kicker.textContent = `Achievements (${unlocked.length})`;
      achEl.append(kicker);
      const list = document.createElement("div");
      list.className = "achievement-chip-list";
      unlocked.forEach(a => {
        const chip = document.createElement("span");
        chip.className = "achievement-chip";
        chip.textContent = a.text;
        list.append(chip);
      });
      achEl.append(list);
    }
  }

  // "What if" alternate ending — generate 2 contextual counterfactuals
  const whatIfEl = document.querySelector("#recapWhatIf");
  if (whatIfEl) {
    whatIfEl.innerHTML = "";
    const lines = generateWhatIfLines(player);
    if (lines.length > 0) {
      const kicker = document.createElement("p");
      kicker.className = "recap-kicker";
      kicker.textContent = "What could have been";
      whatIfEl.append(kicker);
      lines.forEach(text => {
        const p = document.createElement("p");
        p.textContent = text;
        whatIfEl.append(p);
      });
    }
  }

  // Show "Continue family line" button only if there are kids
  const continueBtn = document.querySelector("#recapContinueLine");
  if (continueBtn) {
    continueBtn.hidden = !(player.children?.length > 0);
  }

  try { el.lifeRecapDialog.showModal(); } catch (e) {}
}

function generateWhatIfLines(player) {
  const lines = [];
  const o = originOf(player.origin || player.location);
  const oldestPartner = (player.relationships || []).find(r => r.type === "partner");
  const ghosted = (player.relationships || []).find(r => r.ghosted);
  const snake = (player.relationships || []).find(r => r.betrayed);
  const builder = (player.relationships || []).find(r => r.cofounded);

  // Travel regrets
  if ((player.trips || []).length === 0 && player.money > 2000 && player.age >= 22) {
    lines.push(`If you'd taken that first trip at 22, you'd have come back with a different version of yourself.`);
  }

  // Career regrets
  if (player.jobId === "none" && player.age >= 30) {
    lines.push(`The job offer at ${randomInt(22, 28)} you ignored — it would have changed the trajectory.`);
  }

  // Money regrets
  if (player.money < 5000 && player.spawnClass === "comfortable") {
    lines.push(`If you'd kept the ${money(randomInt(8000, 40000))} your aunt left in the index fund, it would have ${money(randomInt(80000, 400000))} now.`);
  }

  // Romance regrets
  if (!player.married && player.age >= 35) {
    const name = pick(["Camille", "Marcus", "Ari", "Jaiden", "Devon", "Sky"]);
    lines.push(`The thing with ${name} at ${randomInt(24, 30)} could have been the real one. They married someone safer.`);
  }
  if (oldestPartner && oldestPartner.bond < 40) {
    lines.push(`${oldestPartner.name} stayed too long. The version of you that left at 28 had a better life.`);
  }

  // NPC regrets
  if (ghosted) lines.push(`${ghosted.name} disappeared at ${randomInt(20, 30)}. If you'd called instead of waiting for them to, they'd have come back.`);
  if (snake) lines.push(`${snake.name} stabbed you in the back. The version of you that saw the signs at the start avoided that whole arc.`);

  // Substance regrets
  if (player.smokingLevel > 0) {
    lines.push(`The Marlboro at ${randomInt(16, 22)} you said yes to bought you ${randomInt(8, 20)} fewer years.`);
  }

  // Path-not-taken
  if (player.spawnClass === "nepo" && !player.company) {
    lines.push(`With your family's contacts, the founder route was wide open. You picked comfort instead.`);
  }
  if (player.spawnClass === "survival" && player.age >= 30 && player.money < 20000) {
    lines.push(`The scholarship at 18, if you'd applied, would have put you in a different tax bracket.`);
  }
  if (player.streetRep > 20 && player.record === 0) {
    lines.push(`The block respected you. If you'd cashed in earlier — politics, music, business — you'd be remembered.`);
  }

  // City-not-taken
  if (!player.trips?.length && player.age >= 25) {
    const elsewhere = pick(["Tokyo", "Paris", "Mexico City", "Lagos", "Bali"]);
    lines.push(`If you'd moved to ${elsewhere} at 25 instead of staying in ${o.short}, you wouldn't recognize yourself.`);
  }

  // Cap at 3
  return lines.sort(() => Math.random() - 0.5).slice(0, 3);
}

function showEvent(event) {
  if (!event) return;
  el.eventAge.textContent = `Age ${state.player.age}`;
  el.eventTitle.textContent = typeof event.title === "function" ? event.title() : event.title;
  el.eventText.textContent = typeof event.text === "function" ? event.text() : event.text;
  el.choiceList.innerHTML = "";
  event.choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.label;
    button.addEventListener("click", () => {
      if (typeof clickSfx === "function") clickSfx();
      choice.run();
      finishTurn();
      el.dialog.close();
    });
    el.choiceList.append(button);
  });
  if (typeof eventSfx === "function") eventSfx();
  el.dialog.showModal();
}

function finishTurn() {
  checkMilestones();
  saveGame();
  render();
}

function applyEffects(text, effects = {}, tone = "normal") {
  if (tone === "good" && typeof ringUpSfx === "function") ringUpSfx();
  else if (tone === "bad" && typeof ringDownSfx === "function") ringDownSfx();
  Object.entries(effects).forEach(([key, value]) => {
    if (key === "money") state.player.money = Math.max(0, state.player.money + value);
    else if (key === "debt") state.player.debt = Math.max(0, state.player.debt + value);
    else if (key === "record") state.player.record = Math.max(0, state.player.record + value);
    else if (key === "businessReputation") state.player.businessReputation = Math.max(0, state.player.businessReputation + value);
    else if (key === "politicalCapital") state.player.politicalCapital = Math.max(0, state.player.politicalCapital + value);
    else if (key === "books") state.player.books = Math.max(0, state.player.books + value);
    else if (key === "championships") state.player.championships = Math.max(0, state.player.championships + value);
    else if (key === "followers") state.player.followers = Math.max(0, state.player.followers + value);
    else if (key === "posts") state.player.posts = Math.max(0, state.player.posts + value);
    else if (key === "viralHits") state.player.viralHits = Math.max(0, state.player.viralHits + value);
    else if (key === "streetRep") state.player.streetRep = Math.max(0, state.player.streetRep + value);
    else if (key === "recovery") state.player.recovery = Math.max(0, state.player.recovery + value);
    else if (key === "fitnessLevel") state.player.fitnessLevel = clamp(state.player.fitnessLevel + value, 0, 100);
    else if (key === "dietScore") state.player.dietScore = clamp(state.player.dietScore + value, 0, 100);
    else if (key === "smokingLevel") state.player.smokingLevel = clamp(state.player.smokingLevel + value, 0, 5);
    else if (key === "yearsSmoking") state.player.yearsSmoking = Math.max(0, state.player.yearsSmoking + value);
    else if (key === "quitAttempts") state.player.quitAttempts = Math.max(0, state.player.quitAttempts + value);
    else if (key === "companyExits") state.player.companyExits = Math.max(0, state.player.companyExits + value);
    else if (key === "gangHeat") state.player.gangHeat = Math.max(0, state.player.gangHeat + value);
    else changeStat(key, value);
  });
  addLog(text, tone);
}

function relationshipTarget() {
  return pick(state.player.relationships);
}

function changeBond(person, amount) {
  // Perception filter: world reacts to player's visible rolls.
  // Positive interactions amplify for high-perception, negative soften.
  // Inverse for low-perception (the dismissed kid has to fight harder).
  if (state.player && state.player.traits && typeof Traits !== "undefined") {
    const d = Traits.perception(state.player); // -30..+30
    if (amount > 0)      amount = amount * (1 + d / 100);
    else if (amount < 0) amount = amount * (1 - d / 80);
    amount = Math.round(amount);
  }
  person.bond = clamp(person.bond + amount);
}

// ============================================================
// NPC PERSONALITY ARCS — each NPC has a hidden archetype that
// drives multi-year behavior (loyal stays, snake betrays late,
// spiral declines, ghost disappears, star outgrows you, etc.)
// ============================================================
function assignNPCArc(person) {
  if (person.arc) return;
  if (person.type === "family") {
    person.arc = chance(65) ? "anchor" : pick(["loyal", "spiral", "loyal"]);
  } else if (person.type === "partner") {
    person.arc = pick(["loyal", "loyal", "snake", "spiral", "ghost"]);
  } else {
    person.arc = pick(["loyal", "loyal", "snake", "spiral", "star", "ghost", "builder"]);
  }
  person.arcYears = 0;
}

function tickNPCArcs(player) {
  if (!player.relationships) return;
  player.relationships.forEach(person => {
    assignNPCArc(person);
    person.arcYears = (person.arcYears || 0) + 1;
    const arc = person.arc;

    if (arc === "loyal") {
      changeBond(person, randomInt(1, 2));
    } else if (arc === "anchor") {
      changeBond(person, randomInt(1, 3));
    } else if (arc === "spiral") {
      changeBond(person, randomInt(-3, 0));
      if (chance(6) && player.age >= 16 && !person.spiraled) {
        person.spiraled = true;
        addLog(`${person.name} is going through it. Calls are different now.`, "bad");
        addCanonEvent(`${person.name} started spiraling.`, "bad");
      }
      if (chance(4) && player.age >= 18 && person.spiraled) {
        const ask = randomInt(80, 1200);
        addLog(`${person.name} asked to borrow ${money(ask)}. You sent it.`, "bad");
        player.money = Math.max(0, player.money - ask);
      }
    } else if (arc === "snake") {
      if (person.arcYears >= 5 && !person.betrayed && chance(10)) {
        person.betrayed = true;
        person.role = `${person.role} (snake)`;
        changeBond(person, -55);
        addLog(`${person.name} stabbed you in the back. The receipts came out slow.`, "bad");
        addCanonEvent(`${person.name} stabbed ${player.name} in the back.`, "bad");
      } else if (!person.betrayed) {
        changeBond(person, randomInt(0, 2));
      }
    } else if (arc === "star") {
      person.fame = (person.fame || 0) + randomInt(0, 3);
      if ((person.fame || 0) > 25 && !person.distanced && chance(15)) {
        person.distanced = true;
        person.role = `${person.role} (famous now)`;
        changeBond(person, -22);
        addLog(`${person.name} is bigger than the friendship now. They reply slow.`, "bad");
        addCanonEvent(`${person.name} got famous and stopped picking up.`, "bad");
      }
    } else if (arc === "ghost") {
      if (player.age >= 18 && person.arcYears >= 5 && !person.ghosted && chance(8)) {
        person.ghosted = true;
        person.role = `Lost touch — ${person.role}`;
        changeBond(person, -40);
        addLog(`${person.name} just stopped replying. Years will pass.`, "bad");
      }
    } else if (arc === "builder") {
      if (player.company && !person.cofounded && chance(18)) {
        person.cofounded = true;
        person.role = `${person.role} → co-founder`;
        changeBond(person, 18);
        addLog(`${person.name} is in on your company. They believed early.`, "good");
        addCanonEvent(`${person.name} signed on as a co-founder.`, "good");
      } else {
        changeBond(person, randomInt(0, 2));
      }
    }

    if (!person.inJail && player.age >= 14 && person.type !== "pet" && person.type !== "child") {
      const jailRisk = (arc === "spiral" ? 4 : 0) + (arc === "snake" && person.betrayed ? 6 : 0) + (player.gang ? 3 : 0) + (player.location.includes("Skid Row") ? 2 : 0);
      if (jailRisk > 0 && chance(jailRisk)) {
        person.inJail = true;
        person.jailYearsLeft = randomInt(1, 6);
        person.role = `${person.role} (locked up)`;
        addLog(`${person.name} got locked up.`, "bad");
        addCanonEvent(`${person.name} went down at ${player.age}.`);
      }
    } else if (person.inJail) {
      person.jailYearsLeft = (person.jailYearsLeft || 0) - 1;
      if (person.jailYearsLeft <= 0) {
        person.inJail = false;
        person.role = person.role.replace(/ \(locked up\)$/, "");
        addLog(`${person.name} walked out of jail.`, "good");
      }
    }
  });
}

function bestAvailableJob() {
  return jobs.filter(job => job.id !== "none" && job.need(state.player)).sort((a, b) => a.salary - b.salary).at(-1);
}

function runAction(action) {
  const player = state.player;
  if (!player.alive || player.moves <= 0 || !action.available(player)) return;
  spendMove();
  action.run();
  finishTurn();
}

const events = [
  {
    title: "First Words",
    text: () => `${state.player.name}'s family is huddled around waiting for the first word. Somebody is filming. The neighbors in ${originOf(state.player.location).short} could probably hear if you cried.`,
    when: p => p.age === 0,
    choices: [
      { label: "Say 'mama'", run: () => applyEffects("You said 'mama' and somebody actually cried.", { happiness: 5, smarts: 3 }, "good") },
      { label: "Cuss instead", run: () => applyEffects("You said something nobody can repeat at church. Family lore unlocked.", { happiness: 4, looks: 1, karma: -2, fame: 2 }, "good") },
      { label: "Stay quiet", run: () => applyEffects("You stared at everyone like they were the weird ones.", { smarts: 4, discipline: 2 }) }
    ]
  },
  {
    title: "Bath Time Politics",
    text: () => `Whoever is raising you in ${originOf(state.player.location).short} is trying to clean you. You have opinions.`,
    when: p => p.age >= 0 && p.age <= 2,
    choices: [
      { label: "Comply", run: () => applyEffects("You sat there like a champion. Bonus points for not screaming.", { discipline: 3, happiness: 2 }, "good") },
      { label: "Full meltdown", run: () => applyEffects("You screamed for 22 straight minutes. Two neighbors checked in.", { happiness: 3, health: -1, karma: -1 }) }
    ]
  },
  {
    title: "Looking Around",
    text: () => `${state.player.name} is starting to lock eyes with the world. ${originOf(state.player.location).short} is the first room you'll ever know.`,
    when: p => p.age === 0,
    choices: [
      { label: "Smile at everyone", run: () => applyEffects("Strangers melt. Your guardian is glowing.", { happiness: 4, looks: 4 }, "good") },
      { label: "Stare suspiciously", run: () => applyEffects("Adults say you have 'a real soul.' Whatever that means.", { smarts: 3, discipline: 2 }) }
    ]
  },
  {
    title: "The First Birthday",
    text: "Everybody is acting like you personally planned the party. Decorations, food, pictures, loud relatives, the whole thing.",
    when: p => p.age === 1,
    choices: [
      { label: "Smash the cake", run: smashCake },
      { label: "Work the crowd", run: firstBirthdayParty }
    ]
  },
  {
    title: "Naptime Standoff",
    text: () => `Naptime in ${originOf(state.player.location).short}. The whole household needs you to fall asleep so they can breathe.`,
    when: p => p.age >= 1 && p.age <= 3,
    choices: [
      { label: "Pass out instantly", run: () => applyEffects("You did it. The house exhaled.", { health: 4, happiness: 2, discipline: 3 }, "good") },
      { label: "Fight it for 90 minutes", run: () => applyEffects("Nobody got anything done. You won. Then you crashed in your high chair.", { discipline: 1, happiness: 2, karma: -1 }) }
    ]
  },
  {
    title: "Walking Lesson",
    text: () => `${state.player.name} is trying to walk. Cushions are placed. A phone is recording.`,
    when: p => p.age >= 1 && p.age <= 2,
    choices: [
      { label: "Go for it", run: learnToWalk },
      { label: "Crawl with confidence", run: () => applyEffects("You crawled in a way that suggested walking is beneath you.", { happiness: 3, discipline: 2 }) }
    ]
  },
  {
    title: "Toy Choice",
    text: "A box of toys appears. One is plastic, one is plush, one is whatever a cousin left behind.",
    when: p => p.age >= 1 && p.age <= 4,
    choices: [
      { label: "Plastic", run: () => applyEffects("You picked the loudest, most annoying toy. Excellent taste.", { happiness: 5, looks: 1, karma: -1 }, "good") },
      { label: "Plush", run: () => applyEffects("Your stuffed animal is now your whole personality.", { happiness: 6, discipline: 2 }, "good") },
      { label: "Cousin's leftover", run: () => applyEffects("You obsessed over something that wasn't even yours. Family lore.", { smarts: 3, happiness: 4 }) }
    ]
  },
  {
    title: "Babbling Tour",
    text: () => `${state.player.name} has been pointing at things and yelling syllables. The family thinks it's poetic.`,
    when: p => p.age === 2 || p.age === 3,
    choices: [
      { label: "Name every object", run: () => applyEffects("You renamed half the kitchen. Your guardian wrote it down.", { smarts: 6, happiness: 3 }, "good") },
      { label: "Refuse to talk", run: () => applyEffects("You went silent like a tiny monk. People assume you're 'gifted.'", { smarts: 4, discipline: 3 }) }
    ]
  },
  {
    title: "Park Day",
    text: () => `Somebody took you to a park in ${originOf(state.player.location).short}. There are other tiny humans. Politics begin.`,
    when: p => p.age >= 2 && p.age <= 5,
    choices: [
      { label: "Share toys", run: () => applyEffects("You're already a diplomat. Parents notice. Karma rises.", { happiness: 4, karma: 6, discipline: 2 }, "good") },
      { label: "Steal a toy", run: () => applyEffects("You took the cool toy and ran. Another kid cried. You learned about consequence.", { happiness: 3, karma: -4, smarts: 2 }) },
      { label: "Eat sand", run: () => applyEffects("You ate sand for two minutes. Pediatrician later said you're fine. Probably.", { health: -3, happiness: 4 }) }
    ]
  },
  {
    title: "First Day at Preschool",
    text: () => `Drop-off morning. ${state.player.name}'s guardian is more emotional than they're letting on.`,
    when: p => p.age === 4,
    choices: [
      { label: "Cry at the door", run: () => applyEffects("You cried for forty-five seconds, then made a friend. Classic.", { happiness: 4, karma: 3 }, "good") },
      { label: "Walk in like you own it", run: () => applyEffects("You walked in like the principal. Teachers loved it. Other kids were nervous.", { looks: 4, fame: 2, discipline: 3 }, "good") },
      { label: "Refuse to leave the car", run: () => applyEffects("Half-day at home. You won. They lost.", { happiness: 2, discipline: -2 }) }
    ]
  },
  {
    title: "Birthday Party Politics",
    text: () => `Another kid in ${originOf(state.player.location).short} is having a birthday. Pizza, bounce house, social dynamics.`,
    when: p => p.age >= 4 && p.age <= 9,
    choices: [
      { label: "Befriend everyone", run: () => applyEffects("You collected friendship like Pokémon. Three new bonds.", { happiness: 6, looks: 2, karma: 3 }, "good") },
      { label: "Stick with one kid", run: () => {
        const person = relationshipTarget();
        changeBond(person, 12);
        applyEffects(`You and ${person.name} became inseparable for the whole party.`, { happiness: 5 }, "good");
      } },
      { label: "Eat all the cake", run: () => applyEffects("You went off. Other parents whispered. You don't care, you got two slices.", { happiness: 5, health: -2, looks: -1 }) }
    ]
  },
  {
    title: "Cartoon Identity",
    text: () => `${state.player.name} has picked a cartoon character to be. It's a phase. It will not pass for at least a year.`,
    when: p => p.age >= 4 && p.age <= 8,
    choices: [
      { label: "Lean in", run: () => applyEffects("You insisted on being called by the character's name for six months.", { happiness: 6, looks: 2, fame: 1 }, "good") },
      { label: "Pretend you don't anymore", run: () => applyEffects("You denied the obsession in public, kept it private. Early lesson in image.", { smarts: 3, discipline: 3 }) }
    ]
  },
  {
    title: "Classroom Energy",
    text: () => `Show-and-tell day at your school in ${originOf(state.player.location).short}. You forgot.`,
    when: p => p.age >= 5 && p.age <= 9,
    choices: [
      { label: "Improvise a story", run: () => applyEffects("You told a 4-minute lie that the teacher called 'creative writing.'", { smarts: 5, happiness: 3, looks: 2 }, "good") },
      { label: "Hide in the back", run: () => applyEffects("Survival mode. You got away with it but felt small.", { discipline: 2, happiness: -2 }) },
      { label: "Cry strategically", run: () => applyEffects("Teacher gave you a pass and a snack. Manipulation unlocked.", { karma: -2, smarts: 3, happiness: 1 }) }
    ]
  },
  {
    title: "First Crush",
    text: () => `Somebody in your class is suddenly different. Your stomach does a thing.`,
    when: p => p.age >= 6 && p.age <= 12,
    choices: [
      { label: "Tell your friends", run: () => applyEffects("Word spread by lunch. Either of you might evaporate from embarrassment.", { happiness: 4, looks: 1, karma: -1 }) },
      { label: "Keep it to yourself", run: () => applyEffects("You kept it locked. Years from now you'll wonder.", { discipline: 4, smarts: 2 }) }
    ]
  },
  {
    title: "Allowance Talk",
    text: () => {
      const o = originOf(state.player.location);
      return `Your guardian sat you down to talk about money. In ${o.short}, that talk hits different depending on whose house you're in.`;
    },
    when: p => p.age >= 7 && p.age <= 12,
    choices: [
      { label: "Negotiate hard", run: () => applyEffects("You negotiated like a tiny union rep. Future you is proud.", { money: randomInt(20, 80), smarts: 4, discipline: 2 }, "good") },
      { label: "Accept what they offer", run: () => applyEffects("You took the deal. Easy money is still money.", { money: randomInt(8, 35), happiness: 2 }) }
    ]
  },
  {
    title: "Schoolyard Test",
    text: () => `Somebody bigger than you wants your snack in the schoolyard.`,
    when: p => p.age >= 6 && p.age <= 13,
    choices: [
      { label: "Hand it over", run: () => applyEffects("You handed it over. Lunch is now sadness. You'll remember this.", { happiness: -3, discipline: 1, karma: 1 }) },
      { label: "Stand up", run: () => {
        if (chance(45 + Math.floor(state.player.stats.discipline / 5))) {
          applyEffects("You stood your ground and they backed off. Reputation forming.", { discipline: 5, looks: 3, happiness: 4 }, "good");
        } else {
          applyEffects("You stood up, took a hit, and somebody told a teacher. Half-respected, half-bruised.", { discipline: 4, health: -3, happiness: 1 });
        }
      } },
      { label: "Make a joke", run: () => applyEffects("You disarmed it with a joke. Half the class thought it was the funniest thing.", { happiness: 4, smarts: 4, fame: 2 }, "good") }
    ]
  },
  {
    title: "Family Secret",
    text: () => `${state.player.name} overheard something the adults didn't want them to hear.`,
    when: p => p.age >= 7 && p.age <= 14,
    choices: [
      { label: "Keep it to yourself", run: () => applyEffects("You filed it away. Trust unlocked. You are now the kid who knows things.", { smarts: 6, discipline: 4 }, "good") },
      { label: "Tell a friend", run: () => applyEffects("Word spread by Friday. Family found out you told. Bond hit.", { smarts: 2, karma: -3, happiness: -2 }) }
    ]
  },
  {
    title: "Family Function",
    text: "The house is full, somebody brought trays of food, and you are suddenly the main attraction.",
    when: p => p.age >= 1 && p.age <= 5,
    choices: [
      { label: "Be adorable", run: familyFunction },
      { label: "Cause a scene", run: () => applyEffects("You screamed at the exact wrong time and somehow got more attention.", { happiness: 4, looks: 1, discipline: -2 }, "bad") }
    ]
  },
  {
    title: "Tiny Milestone",
    text: "The adults think you might be about to do something worth filming.",
    when: p => p.age >= 1 && p.age <= 3,
    choices: [
      { label: "Try walking", run: learnToWalk },
      { label: "Grab the nearest toy", run: toyObsession }
    ]
  },
  {
    title: "A Weird Little Talent",
    text: "Someone notices you are unusually good at something small but memorable.",
    when: p => p.age <= 12,
    choices: [
      { label: "Practice it", run: () => applyEffects("You practiced until it felt natural.", { smarts: 5, discipline: 4 }, "good") },
      { label: "Show off", run: () => applyEffects("You made people laugh and got a little bolder.", { happiness: 5, looks: 3 }, "good") }
    ]
  },
  {
    title: "School Drama",
    text: "A rumor starts moving through school and your name gets dragged into it.",
    when: p => p.age >= 10 && p.age <= 18,
    choices: [
      { label: "Stay calm", run: () => applyEffects("You kept your head and the rumor faded.", { discipline: 5, happiness: -2 }, "good") },
      { label: "Clap back", run: () => applyEffects("You won the argument but made enemies.", { looks: 3, happiness: 2, karma: -5 }, "bad") }
    ]
  },
  {
    title: "Identity Check-In",
    text: "You catch your reflection and think about how the world sees you versus how you see yourself.",
    when: p => p.age >= 12 && p.age <= 30,
    choices: [
      { label: "Lean into yourself", run: () => applyEffects("You made a choice that felt more honest to who you are.", { happiness: 8, looks: 3, karma: 2 }, "good") },
      { label: "Keep it low-key", run: () => applyEffects("You kept your identity close while you figured things out.", { discipline: 3, happiness: 1 }) }
    ]
  },
  {
    title: "Money Temptation",
    text: "A risky shortcut appears. It could pay, or it could make life messier.",
    when: p => p.age >= 15,
    choices: [
      { label: "Take the shortcut", run: () => riskyPayout(650, "The shortcut paid off.", "The shortcut backfired.") },
      { label: "Walk away", run: () => applyEffects("You walked away and slept better.", { discipline: 4, karma: 4 }, "good") }
    ]
  },
  {
    title: "Career Opening",
    text: "A better job listing catches your eye.",
    when: p => p.age >= 16 && Boolean(bestAvailableJob()) && bestAvailableJob().salary > currentJob(p).salary,
    choices: [
      { label: "Apply", run: applyForJob },
      { label: "Ignore it", run: () => applyEffects("You stayed where you were for now.", { happiness: 1 }) }
    ]
  },
  {
    title: "A Friend Calls",
    text: "Someone close to you wants real time, not a quick message.",
    when: p => p.age >= 8,
    choices: [
      { label: "Make time", run: () => {
        const person = relationshipTarget();
        changeBond(person, 13);
        applyEffects(`You spent the day with ${person.name}.`, { happiness: 5 }, "good");
      } },
      { label: "Say you are busy", run: () => {
        const person = relationshipTarget();
        changeBond(person, -8);
        applyEffects(`${person.name} sounded disappointed.`, { discipline: 2, happiness: -2 }, "bad");
      } }
    ]
  },
  {
    title: "Your Body Complains",
    text: "Your body sends a clear signal that you should take better care of it.",
    when: p => p.age >= 34,
    choices: [
      { label: "Get serious", run: () => applyEffects("You cleaned up your routine.", { health: 9, discipline: 4, money: -220 }, "good") },
      { label: "Push through", run: () => applyEffects("You ignored it and paid for it.", { health: -8, happiness: -3 }, "bad") }
    ]
  },
  {
    title: "Smoke Break Offer",
    text: "Somebody offers you a smoke during a stressful moment.",
    when: p => p.age >= 16 && p.smokingLevel === 0,
    choices: [
      { label: "Take it", run: startSmoking },
      { label: "Pass", run: () => applyEffects("You passed on the smoke and kept your lungs out of it.", { health: 2, discipline: 3 }, "good") }
    ]
  },
  {
    title: "Quit Window",
    text: "You wake up tired of smelling like smoke. This might be a good time to quit.",
    when: p => p.age >= 16 && p.smokingLevel > 0,
    choices: [
      { label: "Try quitting", run: quitSmoking },
      { label: "Smoke through it", run: smokeBreak }
    ]
  },
  {
    title: "Viral Moment",
    text: "A random post about your life starts getting attention.",
    when: p => p.age >= 13,
    choices: [
      { label: "Ride the wave", run: () => {
        if (!state.player.socialPage) state.player.socialPage = true;
        applyEffects("You leaned into the attention.", { fame: 10, followers: randomInt(500, 5000), happiness: 3, discipline: -2 }, "good");
      } },
      { label: "Stay private", run: () => applyEffects("You kept your world smaller and calmer.", { happiness: 4, discipline: 3 }) }
    ]
  },
  {
    title: "Reels Spiral",
    text: "Your feed is moving fast: jokes, drama, flexes, and somebody making rent money from a ten-second clip.",
    when: p => p.age >= 13,
    choices: [
      { label: "Keep scrolling", run: scrollReels },
      { label: "Post your own", run: postReel }
    ]
  },
  {
    title: "Store Manager Spots You",
    text: "A manager at a real store sees how you carry yourself and asks if you are looking for work.",
    when: p => p.age >= 16 && currentJob(p).salary < 43000,
    choices: [
      { label: "Ask about the job", run: applyForJob },
      { label: "Just shop", run: () => brandRun(pick(brands), randomInt(18, 160), { happiness: 3 }, "you kept it casual and treated yourself.") }
    ]
  },
  {
    title: "GED Flyer",
    text: "A GED prep flyer gets pushed into your hand. It looks boring. It also looks useful.",
    when: p => p.age >= 16 && p.dropout && !p.certifications.includes("ged"),
    choices: [
      { label: "Try the GED", run: getGED },
      { label: "Stay outside", run: () => applyEffects("You skipped the flyer and stayed in motion.", { streetRep: 2, happiness: 1, discipline: -2 }) }
    ]
  },
  {
    title: "Skid Row Reality Check",
    text: "The block is loud tonight. There is quick money in one direction and a recovery meeting in the other.",
    when: p => p.location === "Skid Row, Los Angeles" && p.age >= 16,
    choices: [
      { label: "Take the meeting", run: recoveryMeeting },
      { label: "Chase quick money", run: streetHustle },
      { label: "Call a friend", run: () => {
        const person = relationshipTarget();
        changeBond(person, 8);
        applyEffects(`${person.name} picked up. That mattered more than you expected.`, { happiness: 5, health: 1 }, "good");
      } }
    ]
  },
  {
    title: "An Envelope Of Cash",
    text: "You find a thick envelope with no name on it.",
    when: p => p.age >= 12,
    choices: [
      { label: "Turn it in", run: () => applyEffects("You turned it in and felt annoyingly honorable.", { karma: 9, happiness: 2, discipline: 2 }, "good") },
      { label: "Keep it", run: () => riskyPayout(1200, "Nobody came looking for the envelope.", "Someone came looking for the envelope.") }
    ]
  },
  {
    title: "Business Problem",
    text: "One of your ventures hits a messy operational problem.",
    when: p => p.assets.some(asset => asset.id === "business" || asset.id === "franchise"),
    choices: [
      { label: "Fix it yourself", run: () => applyEffects("You got your hands dirty and fixed the problem.", { discipline: 4, smarts: 3, happiness: -2 }, "good") },
      { label: "Throw money at it", run: () => applyEffects("You paid for a clean solution.", { money: -4200, businessReputation: 2, happiness: 3 }, "good") }
    ]
  },
  {
    title: "CEO Fork In The Road",
    text: "Your company needs a decision before the team loses faith in the plan.",
    when: p => Boolean(p.company),
    choices: [
      { label: "Launch something", run: launchProduct },
      { label: "Hold a board meeting", run: boardMeeting },
      { label: "Pivot", run: pivotCompany }
    ]
  },
  {
    title: "Acquisition Rumor",
    text: "A rival founder is tired. You could buy them, hire them, or let them fade.",
    when: p => p.company && p.company.stage >= 2,
    choices: [
      { label: "Acquire them", run: acquireRival },
      { label: "Recruit quietly", run: hireTeam },
      { label: "Ignore it", run: () => applyEffects("You ignored the rumor and stayed focused on your own product.", { discipline: 4 }) }
    ]
  },
  {
    title: "Pet Emergency",
    text: "Your pet needs a sudden vet visit.",
    when: p => p.pets.length > 0,
    choices: [
      { label: "Pay the vet", run: () => applyEffects("The vet visit was expensive, but your pet recovered.", { money: -780, happiness: 4 }, "good") },
      { label: "Find a cheaper option", run: () => applyEffects("You found a clinic, but the stress lingered.", { money: -180, happiness: -3 }, "bad") }
    ]
  },
  {
    title: "A Life Pivot",
    text: "For once, you can clearly see three different futures.",
    when: p => p.age >= 25,
    choices: [
      { label: "Chase stability", run: () => applyEffects("You chose stable routines and clearer finances.", { discipline: 7, happiness: 2 }, "good") },
      { label: "Chase adventure", run: () => travel(true) },
      { label: "Chase attention", run: () => applyEffects("You made a louder version of yourself.", { fame: 8, looks: 2, happiness: 3 }, "good") }
    ]
  },
  {
    title: "Relationship Crossroads",
    text: "Your partner asks where this is actually going.",
    when: p => p.relationships.some(person => person.type === "partner") && !p.married && p.age >= 20,
    choices: [
      { label: "Commit harder", run: propose },
      { label: "Keep it casual", run: () => {
        const partner = state.player.relationships.find(person => person.type === "partner");
        if (partner) changeBond(partner, -12);
        applyEffects("You dodged the conversation. It did not go unnoticed.", { happiness: -3 }, "bad");
      } }
    ]
  },
  {
    title: "A Kid Needs You",
    text: "A young person in your orbit needs advice and attention.",
    when: p => p.age >= 28,
    choices: [
      { label: "Mentor them", run: () => applyEffects("You became a steady mentor and felt your life widen.", { happiness: 7, karma: 7, politicalCapital: 2 }, "good") },
      { label: "Stay focused on yourself", run: () => applyEffects("You protected your time, but it felt a little colder.", { discipline: 4, happiness: -2 }) }
    ]
  },
  {
    title: "Election Season",
    text: "A local campaign asks you to help publicly.",
    when: p => p.age >= 21,
    choices: [
      { label: "Volunteer publicly", run: () => applyEffects("You knocked doors and became a familiar face.", { politicalCapital: 8, happiness: 3 }, "good") },
      { label: "Avoid politics", run: () => applyEffects("You kept your name out of it.", { happiness: 1 }) }
    ]
  },
  {
    title: "A Book Idea",
    text: "Your life has enough chaos for a book pitch.",
    when: p => p.age >= 24 && (p.fame >= 15 || p.trips.length >= 2 || p.risksTaken >= 3),
    choices: [
      { label: "Write the pitch", run: writeBook },
      { label: "Live more first", run: () => applyEffects("You saved the idea for a wilder chapter.", { happiness: 2, discipline: 1 }) }
    ]
  },
  {
    title: "Sports Moment",
    text: "A local tournament opens up and people think you could actually win.",
    when: p => p.age >= 14 && p.stats.health >= 65,
    choices: [
      { label: "Enter tournament", run: tournament },
      { label: "Cheer from the side", run: () => applyEffects("You enjoyed the day without risking injury.", { happiness: 3 }) }
    ]
  },
  {
    title: "Class Track Starts Paying Off",
    tags: ["school"],
    text: () => {
      const lane = pick(classLabelList(state.player));
      return `${lane} is starting to become more than a class. A teacher noticed ${state.player.name} taking it seriously.`;
    },
    when: p => p.age >= 10 && p.classes.length > 0 && chance(10),
    choices: [
      { label: "Ask for extra work", run: () => applyEffects("You took the extra assignment and turned a class into a lane.", { smarts: 5, discipline: 5, happiness: -1 }, "good") },
      { label: "Keep it casual", run: () => applyEffects("You kept the lane open without turning it into your whole life.", { happiness: 3, discipline: 1 }) }
    ]
  },
  {
    title: "After-School Rival",
    tags: ["school", "drama"],
    text: () => `Somebody in your after-school scene is clearly trying to outshine ${state.player.name}. Friendly? Maybe. Annoying? Absolutely.`,
    when: p => p.age >= 11 && p.afterSchool.length > 0 && chance(8),
    choices: [
      { label: "Compete hard", run: () => applyEffects("You locked in and raised the standard. The rivalry got real.", { discipline: 5, fame: 3, happiness: 2 }, "good") },
      { label: "Make them an ally", run: () => {
        const name = pick(peopleNames);
        state.player.relationships.push({ id: `rival-${Date.now()}`, name, role: "Friendly rival", bond: randomInt(36, 66), type: "friend" });
        applyEffects(`${name} became a rival-friend. Annoying, useful, kind of iconic.`, { happiness: 5, smarts: 2 }, "good");
      } }
    ]
  },
  {
    title: "Coding Project Blows Up",
    tags: ["school", "business"],
    text: () => `${state.player.name}'s little project got shared around school and then outside school.`,
    when: p => p.age >= 12 && ((p.interests || {}).tech || hasClassTrack("coding")) && chance(7),
    choices: [
      { label: "Ship a real version", run: () => {
        rememberInterest("business", 2);
        applyEffects("You turned the project into a real app. It barely works, but people care.", { smarts: 7, fame: 4, businessReputation: 4, discipline: 3 }, "good");
      } },
      { label: "Keep it private", run: () => applyEffects("You kept building quietly. Less attention, more skill.", { smarts: 6, discipline: 5 }) }
    ]
  },
  {
    title: "Music Night",
    tags: ["fame"],
    text: () => `A local open mic needs one more person. Everyone looks at ${state.player.name}.`,
    when: p => p.age >= 12 && ((p.interests || {}).music || hasClassTrack("music")) && chance(7),
    choices: [
      { label: "Perform", run: perform },
      { label: "Record content instead", run: postReel }
    ]
  },
  {
    title: "Crew Pressure",
    tags: ["street", "drama"],
    text: () => `${state.player.gang?.name || "The crew"} wants ${state.player.name} around more often. Family and school are already noticing.`,
    when: p => p.age >= 14 && Boolean(p.gang) && chance(12),
    choices: [
      { label: "Show loyalty", run: crewLoyaltyTest },
      { label: "Make distance", run: leaveStreetCrew },
      { label: "Broker peace", run: brokerPeace }
    ]
  },
  {
    title: "Family Finds Out",
    tags: ["street", "family", "drama"],
    text: () => `Somebody at home found out about ${state.player.gang?.name || "the street crew"}. The conversation is not optional.`,
    when: p => p.age >= 14 && Boolean(p.gang) && chance(8),
    choices: [
      { label: "Tell the truth", run: () => applyEffects("You told the truth. It hurt, but somebody finally understood the pressure.", { happiness: -3, karma: 5, discipline: 4 }, "good") },
      { label: "Lie clean", run: () => applyEffects("You lied well enough to buy time. The knot in your stomach stayed.", { smarts: 3, happiness: -5, karma: -4, gangHeat: 1 }, "bad") }
    ]
  },
  {
    title: "Brand Wants Your School Story",
    tags: ["school", "fame", "money"],
    text: () => `A local brand wants to sponsor a post about ${state.player.name}'s school grind and hobbies.`,
    when: p => p.age >= 15 && p.socialPage && (p.classes.length > 0 || topInterests(p).length > 0) && chance(7),
    choices: [
      { label: "Keep it real", run: () => {
        const amount = randomInt(260, 3200);
        applyEffects(`The sponsored post felt real and paid ${money(amount)}.`, { money: amount, followers: randomInt(120, 1800), fame: 4, happiness: 4 }, "good");
      } },
      { label: "Overdo the ad", run: () => applyEffects("The post looked fake. People noticed, but the check cleared.", { money: randomInt(300, 1800), followers: -randomInt(20, 240), happiness: -2 }, "bad") }
    ]
  },
  {
    title: "Escape Route",
    tags: ["street", "school"],
    text: () => `A mentor offers ${state.player.name} a cleaner path: training, job lead, or school help. The catch is showing up consistently.`,
    when: p => p.age >= 15 && (p.dropout || p.streetRep > 8 || Boolean(p.gang)) && chance(8),
    choices: [
      { label: "Take the help", run: () => {
        if (state.player.gang) state.player.gangHeat = Math.max(0, state.player.gangHeat - 4);
        applyEffects("You took the help and started building a cleaner exit.", { discipline: 7, smarts: 4, health: 2, streetRep: -2, karma: 5 }, "good");
      } },
      { label: "Stay outside", run: () => applyEffects("You ignored the offer. Freedom felt good for a minute.", { happiness: 2, discipline: -3, streetRep: 3 }, "bad") }
    ]
  },
  {
    title: "Local Name Rings Out",
    tags: ["city", "fame"],
    text: () => {
      const o = originOf(state.player.location);
      return `People around ${o.short} are starting to recognize ${state.player.name}. Not famous-famous, but local enough that doors open weirdly.`;
    },
    when: p => p.age >= 12 && localRep(p) >= 18 && chance(9),
    choices: [
      { label: "Use the momentum", run: () => {
        const earned = randomInt(280, 4200) + localRep() * 12;
        changeLocalRep(4);
        applyEffects(`You used your local name to land a clean opportunity worth ${money(earned)}.`, { money: earned, fame: 3, businessReputation: 2 }, "good");
      } },
      { label: "Stay humble", run: () => {
        changeLocalRep(3);
        applyEffects("You kept it low-key and became easier to trust.", { karma: 5, happiness: 3, discipline: 2 }, "good");
      } }
    ]
  },
  {
    title: "City Tests You",
    tags: ["city", "drama"],
    text: () => {
      const o = originOf(state.player.location);
      return `${o.short} put a messy choice in front of ${state.player.name}: quick clout, quick money, or stay boring and safe.`;
    },
    when: p => p.age >= 13 && localRep(p) >= 10 && chance(8),
    choices: [
      { label: "Chase clout", run: () => {
        changeLocalRep(chance(55) ? 5 : -3);
        applyEffects("The clout play got attention, but attention does not always arrive clean.", { fame: 5, followers: randomInt(80, 1400), happiness: 2, discipline: -3 }, "bad");
      } },
      { label: "Chase quick money", run: () => riskyPayout(randomInt(300, 2600), "The local shortcut paid.", "The local shortcut turned into a headache.") },
      { label: "Stay boring", run: () => applyEffects("You stayed boring and protected the bigger run.", { discipline: 5, karma: 3 }) }
    ]
  },
  {
    title: "Hometown Pull",
    tags: ["city", "family"],
    text: () => `${state.player.origin} still has a grip on ${state.player.name}. Somebody from back there wants time, money, or attention.`,
    when: p => p.age >= 16 && p.origin !== p.location && chance(7),
    choices: [
      { label: "Visit home", run: () => {
        const old = state.player.location;
        state.player.trips.push(state.player.origin);
        state.player.location = state.player.origin;
        changeLocalRep(4);
        state.player.location = old;
        applyEffects("You visited home and remembered exactly why leaving and returning both feel complicated.", { happiness: 5, karma: 4, money: -randomInt(120, 900) }, "good");
      } },
      { label: "Send money", run: () => applyEffects("You sent money back home. Respect went up, cash went down.", { money: -randomInt(100, 1100), karma: 5, happiness: 1 }, "good") },
      { label: "Ignore it", run: () => applyEffects("You ignored the call from home. Easier today, heavier later.", { happiness: -4, discipline: 2 }, "bad") }
    ]
  },
  {
    title: "City Plug Offers A Shortcut",
    tags: ["city", "money", "business"],
    text: () => {
      const person = localPerson();
      return `${person} says they can connect ${state.player.name} to a bigger opportunity if you front some cash and trust the process.`;
    },
    when: p => p.age >= 18 && localRep(p) >= 14 && chance(7),
    choices: [
      { label: "Take the meeting", run: () => {
        if (chance(42 + Math.floor(state.player.stats.smarts / 5) + Math.floor(localRep() / 3))) {
          const earned = randomInt(1200, 18000);
          changeLocalRep(5);
          applyEffects(`The plug was real. You walked away with a new contact and ${money(earned)} upside.`, { money: earned, businessReputation: 5, happiness: 5 }, "good");
        } else {
          changeLocalRep(-2);
          applyEffects("The plug overpromised. You paid for a lesson dressed up as an opportunity.", { money: -randomInt(400, 2800), smarts: 3, happiness: -5 }, "bad");
        }
      } },
      { label: "Pass", run: () => applyEffects("You passed. Not every open door is yours.", { discipline: 4 }) }
    ]
  },

  // ---------- ROLLERCOASTER SWING EVENTS ----------

  {
    title: "Unknown Relative",
    text: () => `A lawyer from somewhere far away tracked you down. Apparently a relative died and left ${state.player.name} on a list.`,
    when: p => p.age >= 16 && chance(1),
    choices: [
      { label: "Take the inheritance", run: () => {
        const amount = sanePayout(randomInt(8000, 90000));
        addCanonEvent(`Inherited ${money(amount)} from a relative ${state.player.name} barely remembered.`, "good");
        applyEffects(`The check cleared. ${money(amount)} just dropped in your account.`, { money: amount, happiness: 12, karma: -2 }, "good");
      } },
      { label: "Refuse it", run: () => applyEffects("You sent the lawyer away. Your bank account is sad. Your karma isn't.", { karma: 12, happiness: -4 }, "good") }
    ]
  },
  {
    title: "Scratch-Off Hits",
    text: () => `${state.player.name} bought a scratch-off ticket on a whim at the corner store.`,
    when: p => p.age >= 18 && chance(2),
    choices: [
      { label: "Scratch it", run: () => {
        if (chance(35)) {
          const amount = randomInt(2000, 25000);
          addCanonEvent(`Hit a ${money(amount)} scratch-off out of nowhere.`, "good");
          applyEffects(`You actually won. ${money(amount)} just for buying a ticket.`, { money: amount, happiness: 15, karma: -1, fame: 2 }, "good");
        } else {
          applyEffects("Nothing. Like always. You crumple it and walk out.", { money: -10, happiness: -2 });
        }
      } },
      { label: "Throw it out unscratched", run: () => applyEffects("You threw it out. The universe respects restraint.", { discipline: 4, karma: 3 }) }
    ]
  },
  {
    title: "Random DM",
    text: () => `Someone you've never met DM'd you. They want to fly you out for "a project." It sounds either life-changing or extremely sketchy.`,
    when: p => p.age >= 16 && p.socialPage && chance(8),
    choices: [
      { label: "Take the meeting", run: () => {
        if (chance(50 + Math.floor(state.player.stats.looks / 6))) {
          const amount = randomInt(4000, 35000);
          addCanonEvent(`Flew out for a stranger's project and came back ${money(amount)} richer.`, "good");
          applyEffects(`Turned out to be real. You got paid ${money(amount)} and built a contact.`, { money: amount, fame: 8, followers: randomInt(2000, 14000), happiness: 6 }, "good");
        } else {
          applyEffects("It was a scam. You wasted a week and your stomach knew the whole time.", { money: -380, happiness: -6, discipline: 3 }, "bad");
        }
      } },
      { label: "Ignore it", run: () => applyEffects("You let it sit in requests. Smart, probably.", { discipline: 3, smarts: 2 }) }
    ]
  },
  {
    title: "Viral Overnight",
    text: () => `A clip of ${state.player.name} just hit the front page of every feed. Comments are flooding in faster than the page can load.`,
    when: p => p.age >= 13 && chance(3) && (p.socialPage || p.fame >= 5),
    choices: [
      { label: "Ride the wave hard", run: () => {
        const fol = randomInt(15000, 180000);
        if (!state.player.socialPage) state.player.socialPage = true;
        addCanonEvent(`Went viral overnight — picked up ${fol.toLocaleString()} followers in 24 hours.`, "good");
        applyEffects(`Your phone broke from notifications. ${fol.toLocaleString()} new followers.`, { followers: fol, fame: 22, happiness: 10, discipline: -4 }, "good");
      } },
      { label: "Go private until it dies", run: () => applyEffects(`You went dark. The wave passed without you. Sanity intact.`, { discipline: 8, happiness: -3, fame: -2 }) }
    ]
  },
  {
    title: "Cancelled",
    text: () => `Something ${state.player.name} said years ago is being dragged across every feed today. The receipts are loud.`,
    when: p => p.age >= 18 && p.fame >= 18 && chance(6),
    choices: [
      { label: "Apologize publicly", run: () => {
        const lost = Math.floor(state.player.followers * 0.25);
        addCanonEvent(`Got cancelled. Lost ${lost.toLocaleString()} followers in a week.`, "bad");
        applyEffects(`You posted the apology video. Lost ${lost.toLocaleString()} followers but kept the brand alive.`, { followers: -lost, fame: -8, happiness: -10, karma: 3 }, "bad");
      } },
      { label: "Double down", run: () => {
        const lost = Math.floor(state.player.followers * 0.5);
        if (chance(30)) {
          applyEffects(`Backfired. ${lost.toLocaleString()} followers gone. But the loud ones who stayed are louder.`, { followers: -lost, fame: -5, happiness: -8, discipline: 4 }, "bad");
        } else {
          applyEffects(`It worked. Your base got stronger. New audience appeared.`, { followers: randomInt(3000, 22000), fame: 12, happiness: 4, karma: -5 }, "good");
        }
      } },
      { label: "Go offline for 6 months", run: () => applyEffects(`You vanished. People got bored of being mad. You came back smaller but saner.`, { followers: -Math.floor(state.player.followers * 0.4), fame: -6, happiness: 8, discipline: 10 }, "bad") }
    ]
  },
  {
    title: "Surprise Pregnancy",
    text: () => `One of your partners or hookups is pregnant. The conversation is happening whether you're ready or not.`,
    when: p => p.age >= 18 && p.age <= 44 && chance(9) && p.relationships.some(r => r.type === "partner" || r.bond > 80),
    choices: [
      { label: "Step up", run: () => {
        const childName = pick(peopleNames);
        state.player.children.push({ name: childName, age: 0 });
        addCanonEvent(`Became a parent — ${childName} arrived.`, "good");
        applyEffects(`You stepped up. ${childName} is here. Life just changed completely.`, { happiness: 8, discipline: 8, money: -4200, fame: 2 }, "good");
      } },
      { label: "Pay support, stay out", run: () => applyEffects(`You're sending money but not being there. The kid will know one day.`, { money: -6800, happiness: -5, karma: -10, discipline: 2 }, "bad") }
    ]
  },
  {
    title: "Jumped Walking Home",
    text: () => `Three people stepped to ${state.player.name} on the way home in ${originOf(state.player.location).short}. They want your phone, your watch, everything.`,
    when: p => p.age >= 14 && (originOf(p.location).streetMod || 0) > 1 && chance(8),
    choices: [
      { label: "Hand it over", run: () => applyEffects("You gave it up. They left. You walked home shaking but breathing.", { money: -randomInt(80, 600), happiness: -8, health: -2, discipline: 4 }, "bad") },
      { label: "Fight back", run: () => {
        if (chance(20 + Math.floor(state.player.stats.health / 4))) {
          applyEffects("You held your own. They scattered. The block heard about it by tomorrow.", { streetRep: 8, looks: 2, health: -6, fame: 3 }, "good");
        } else {
          applyEffects("It went bad. You woke up in a hospital. Real damage.", { health: -25, money: -randomInt(800, 4000), happiness: -12, record: 1 }, "bad");
        }
      } },
      { label: "Run", run: () => applyEffects("You ran. Lungs burning. They didn't follow. You kept your stuff and your pride mostly.", { health: 3, happiness: -3, discipline: 2 }) }
    ]
  },
  {
    title: "Brand Cold Call",
    text: () => `A real brand DM'd ${state.player.handle || state.player.name} asking about a paid collaboration.`,
    when: p => p.age >= 16 && p.fame >= 10 && chance(7),
    choices: [
      { label: "Sign the deal", run: () => {
        const amount = randomInt(2000, 18000) + state.player.fame * 200;
        addCanonEvent(`Landed a brand deal for ${money(amount)}.`, "good");
        applyEffects(`Contract signed. ${money(amount)} hit your account.`, { money: amount, fame: 5, happiness: 6 }, "good");
      } },
      { label: "Negotiate up", run: () => {
        if (chance(45 + Math.floor(state.player.stats.smarts / 6))) {
          const amount = sanePayout(randomInt(6000, 36000)) + state.player.fame * 350;
          addCanonEvent(`Negotiated a brand deal up to ${money(amount)}.`, "good");
          applyEffects(`They blinked. You closed at ${money(amount)}.`, { money: amount, smarts: 4, fame: 8, happiness: 8 }, "good");
        } else {
          applyEffects("They walked away. You learned about negotiation the hard way.", { happiness: -5, smarts: 3 }, "bad");
        }
      } },
      { label: "Pass on principle", run: () => applyEffects("You passed. The brand wasn't the move. Karma noticed.", { karma: 8, fame: -1 }) }
    ]
  },
  {
    title: "Investor Wants In",
    text: () => `Someone with money wants to fund whatever ${state.player.name} is building. Term sheet is in the email.`,
    when: p => p.age >= 19 && (p.company || p.stats.smarts >= 70) && chance(5),
    choices: [
      { label: "Take the check", run: () => {
        const amount = sanePayout(randomInt(40000, 380000));
        if (state.player.company) state.player.company.runway += amount;
        else state.player.money += amount;
        addCanonEvent(`Raised ${money(amount)} for a project.`, "good");
        applyEffects(`${money(amount)} in the bank. Now the clock starts.`, { fame: 10, happiness: 10, discipline: -3 }, "good");
      } },
      { label: "Counter the terms", run: () => {
        if (chance(40 + Math.floor(state.player.stats.smarts / 5))) {
          const amount = sanePayout(randomInt(80000, 650000));
          if (state.player.company) state.player.company.runway += amount;
          else state.player.money += amount;
          addCanonEvent(`Closed a bigger round than expected — ${money(amount)}.`, "good");
          applyEffects(`They folded. You closed at ${money(amount)}. Word will spread.`, { money: 0, fame: 18, happiness: 12, smarts: 5 }, "good");
        } else {
          applyEffects("They walked. You're staring at the cap table you ALMOST had.", { happiness: -10, smarts: 5, discipline: 4 }, "bad");
        }
      } },
      { label: "Pass", run: () => applyEffects("You stayed independent. Lonelier. Cleaner.", { discipline: 8, happiness: -2 }) }
    ]
  },
  {
    title: "Best Friend Betrayal",
    text: () => {
      const friend = state.player.relationships.find(r => r.bond > 65 && r.type !== "family") || state.player.relationships[0];
      return `${friend.name} did something. You don't have all the details yet but it's bad and it's about you.`;
    },
    when: p => p.age >= 13 && p.relationships.some(r => r.bond > 65 && r.type !== "family") && chance(4),
    choices: [
      { label: "Cut them off", run: () => {
        const friend = state.player.relationships.find(r => r.bond > 65 && r.type !== "family");
        if (friend) { friend.bond = 0; friend.role = "Former friend"; }
        addCanonEvent(`Cut ${friend?.name || "a friend"} off permanently after a betrayal.`, "bad");
        applyEffects(`You blocked them everywhere. The silence is loud.`, { happiness: -10, discipline: 5, smarts: 3 }, "bad");
      } },
      { label: "Hear them out", run: () => {
        const friend = state.player.relationships.find(r => r.bond > 65 && r.type !== "family");
        if (chance(45)) {
          if (friend) changeBond(friend, -25);
          applyEffects("You heard them out. The friendship survives, barely.", { happiness: -5, karma: 4, smarts: 2 });
        } else {
          if (friend) changeBond(friend, -55);
          applyEffects("Hearing them out made it worse. You should've trusted yourself.", { happiness: -12, smarts: 5, discipline: 3 }, "bad");
        }
      } },
      { label: "Get even", run: () => applyEffects("You retaliated. Hurt them publicly. The block respects it. You don't sleep great though.", { karma: -10, streetRep: 6, happiness: -6, fame: 4 }, "bad") }
    ]
  },
  {
    title: "Wrong Place Wrong Time",
    text: () => `${state.player.name} got picked up by cops for being near something that happened.`,
    when: p => p.age >= 15 && (originOf(p.location).streetMod || 0) > 1 && chance(7),
    choices: [
      { label: "Stay silent, call a lawyer", run: () => {
        if (state.player.money >= 800 || state.player.relationships.some(r => r.role.includes("lawyer"))) {
          applyEffects("Lawyer showed up. You walked out same day. Karma noted.", { money: -800, discipline: 4, smarts: 4 });
        } else {
          applyEffects(`You held silent but no lawyer came. Spent ${randomInt(2,4)} days in a cell before they let you go.`, { record: 1, happiness: -8, health: -3, streetRep: 4 }, "bad");
        }
      } },
      { label: "Tell them everything you know", run: () => {
        applyEffects("You told them what you saw. Walked out clean. People on the block heard about it.", { karma: 3, streetRep: -10, happiness: -4 });
      } },
      { label: "Try to walk away", run: () => {
        if (chance(20)) {
          applyEffects("Somehow you got past. Don't try that again.", { discipline: -3, happiness: 2 });
        } else {
          applyEffects("They tackled you. Charge added. Record stained.", { record: 2, health: -8, money: -1500, happiness: -10 }, "bad");
        }
      } }
    ]
  },
  {
    title: "Sudden Romance",
    text: () => `Someone walked into ${state.player.name}'s life this week and it's been on your mind since.`,
    when: p => p.age >= 16 && !p.relationships.some(r => r.type === "partner") && chance(8),
    choices: [
      { label: "Shoot your shot", run: askOut },
      { label: "Let it pass", run: () => applyEffects("You let it pass. Years from now you'll think about them sometimes.", { happiness: -4, discipline: 4, smarts: 2 }) }
    ]
  },
  {
    title: "Family Emergency",
    text: () => {
      const family = state.player.relationships.find(r => r.type === "family") || state.player.relationships[0];
      return `${family.name} is in a hospital. Nobody can give you a clear answer yet.`;
    },
    when: p => p.age >= 14 && p.relationships.some(r => r.type === "family") && chance(5),
    choices: [
      { label: "Drop everything", run: () => {
        const family = state.player.relationships.find(r => r.type === "family");
        if (family) changeBond(family, 18);
        applyEffects(`You showed up. ${family?.name || "Family"} pulled through. The bond runs deeper now.`, { money: -randomInt(800, 4200), happiness: -3, karma: 12 }, "good");
      } },
      { label: "Send money instead", run: () => {
        const family = state.player.relationships.find(r => r.type === "family");
        if (family) changeBond(family, -8);
        applyEffects("You sent cash but didn't fly out. They noticed.", { money: -randomInt(400, 2200), happiness: -6, karma: -3 }, "bad");
      } }
    ]
  },
  {
    title: "Old Friend Resurfaces",
    text: () => `Someone you haven't talked to in years just hit your phone. They want to catch up.`,
    when: p => p.age >= 20 && chance(6),
    choices: [
      { label: "Catch up", run: () => {
        const nm = pick(peopleNames);
        state.player.relationships.push({ id: `friend_${Date.now()}`, name: nm, role: "Old friend", bond: randomInt(45, 75), type: "friend" });
        applyEffects(`${nm} is back in your life. It felt good.`, { happiness: 8, karma: 3 }, "good");
      } },
      { label: "Leave it on read", run: () => applyEffects("You ignored it. Maybe next year.", { discipline: 2, happiness: -2 }) }
    ]
  },
  {
    title: "Investment Hits",
    text: () => `That random thing ${state.player.name} put money into a while back actually paid off.`,
    when: p => p.age >= 22 && p.money >= 3000 && hasAsset("portfolio") && chance(4),
    choices: [
      { label: "Take the win", run: () => {
        const amount = randomInt(8000, 75000);
        addCanonEvent(`A long-term investment paid out ${money(amount)}.`, "good");
        applyEffects(`The portfolio printed. ${money(amount)} cleared.`, { money: amount, happiness: 8, smarts: 4 }, "good");
      } },
      { label: "Reinvest it", run: () => applyEffects("You rolled it back in. Future you will thank you.", { money: -randomInt(1000, 3000), smarts: 5, discipline: 4 }) }
    ]
  },
  {
    title: "Talent Scout in the Crowd",
    text: () => `Someone with a real industry job watched ${state.player.name} do something today and slid you their card.`,
    when: p => p.age >= 14 && (p.stats.looks >= 65 || p.stats.health >= 75 || p.fame >= 15) && chance(5),
    choices: [
      { label: "Follow up", run: () => {
        if (chance(40 + Math.floor(state.player.stats.looks / 5))) {
          const fol = randomInt(2000, 16000);
          state.player.socialPage = true;
          addCanonEvent(`Got signed after a scout pulled them aside.`, "good");
          applyEffects(`They signed you. Suddenly you're booked.`, { followers: fol, fame: 18, money: randomInt(2000, 8500), happiness: 10 }, "good");
        } else {
          applyEffects("The meeting was fake. The card was real but the contact ghosted.", { happiness: -6, discipline: 3 }, "bad");
        }
      } },
      { label: "Throw the card", run: () => applyEffects("You threw the card out. You're not chasing it. You're living.", { karma: 5, discipline: 3 }) }
    ]
  },

  // ============================================================
  // CINEMATIC SCENE LIBRARY (18+ — gated by adult unlock)
  // ============================================================

  {
    title: "Frat House at 2AM",
    text: () => `Pulled up to a house party near campus. Music's shaking the windows. Somebody just got pushed in the pool with their phone. ${localPerson()} hands you a red cup with something already in it.`,
    when: p => p.age >= 17 && p.age <= 23 && isAdultUnlocked() && (p.educationRank >= 3 || p.personality === "wild" || p.personality === "big") && chance(12),
    choices: [
      { label: "Take the cup, dive in", run: () => {
        const wild = chance(40);
        if (wild) {
          addCanonEvent(`Survived a college house party where ${state.player.name} got way too loose. Made it home with someone's hoodie.`, "good");
          applyEffects(`You blacked out a little. Woke up with somebody's hoodie and three new contacts. Your phone has memories you don't.`, { happiness: 12, fame: 4, health: -6, discipline: -8, followers: randomInt(40, 600) }, "good");
        } else {
          applyEffects(`Cops showed up at 3AM. You jumped a fence. Phone screen cracked, ego intact.`, { happiness: 4, health: -3, discipline: -5, record: chance(15) ? 1 : 0, money: -180 });
        }
      } },
      { label: "Find the back porch", run: () => {
        const person = pick(["a junior", "somebody's roommate", "the host's cousin", "a TA from your bio class"]);
        applyEffects(`Ended up on the back porch with ${person}. Talked for two hours. Got their number. Felt seen for once.`, { happiness: 8, smarts: 3, discipline: 2 }, "good");
      } },
      { label: "Leave after one drink", run: () => applyEffects("You bounced. Your boys were mad. Your liver was grateful.", { discipline: 6, happiness: -2 }) }
    ]
  },

  {
    title: "The Hills Mansion",
    text: () => `Somebody knew somebody. You and three friends are at a mansion party in the Hills. There's a DJ on the balcony. A reality TV person just looked at you. The bathroom is rumored to have product in it.`,
    when: p => p.age >= 17 && isAdultUnlocked() && (p.location.includes("Los Angeles") || p.location === "Hollywood, Los Angeles" || p.fame >= 12) && chance(10),
    choices: [
      { label: "Work the crowd", run: () => {
        const hit = chance(35 + Math.floor(state.player.stats.looks / 5));
        if (hit) {
          addCanonEvent(`Pulled up to a Hills mansion party and walked out with real connects.`, "good");
          applyEffects(`A producer asked about your handle. A famous person followed you back. The night moved.`, { fame: 14, followers: randomInt(800, 8000), happiness: 12, money: chance(20) ? randomInt(500, 3000) : 0 }, "good");
        } else {
          applyEffects(`You stood near three conversations and weren't part of any of them. Drank too much white wine. Left.`, { happiness: -4, looks: 1, discipline: 1 });
        }
      } },
      { label: "Find the bathroom", run: () => {
        if (state.player.personality === "wild" || state.player.personality === "reckless" || chance(40)) {
          applyEffects(`You did something you shouldn't have. The night accelerated. Your jaw was tight for 9 hours.`, { happiness: 14, health: -8, discipline: -10, looks: -1, fame: 4 }, "bad");
        } else {
          applyEffects(`You looked at the offer and walked back out. Not tonight.`, { discipline: 6, happiness: 1 });
        }
      } },
      { label: "Slip out the back", run: () => applyEffects(`You left before anything could happen. Uber surge was insane. You went home.`, { discipline: 5, happiness: -1, money: -85 }) }
    ]
  },

  {
    title: "Cocaine in the Bathroom",
    text: () => `Bathroom door at the club opens, somebody hands you a small bag and a rolled bill like it's a handshake. You barely know them.`,
    when: p => p.age >= 18 && isAdultUnlocked() && (p.personality === "wild" || p.personality === "reckless" || p.personality === "big") && chance(7),
    choices: [
      { label: "Just this once", run: () => {
        if (chance(35)) {
          addCanonEvent(`First time doing coke. ${state.player.name} woke up with a sinus headache and a story.`, "bad");
          applyEffects(`The night ran 8 more hours. You felt invincible until 9AM. Then you crashed for two days.`, { happiness: 12, health: -12, discipline: -8, looks: -2, risksTaken: 1 }, "bad");
        } else {
          applyEffects(`You did it. You loved it. It might become a problem. The seed got planted.`, { happiness: 18, health: -8, discipline: -10, risksTaken: 2 }, "bad");
        }
      } },
      { label: "Pass and leave the room", run: () => applyEffects(`You handed it back. Walked out. Felt slightly older.`, { discipline: 8, smarts: 3 }, "good") },
      { label: "Take it and dump it later", run: () => applyEffects(`You took it to not seem weird, then flushed it in the parking lot. Petty win.`, { karma: 4, discipline: 5 }) }
    ]
  },

  {
    title: "Bali Blackout",
    text: () => `${state.player.name} is in Bali. Last memory is a beach club, three shots, somebody yelling "Mandala." You woke up on a scooter you don't own with a bruise you can't explain and four missed calls from your hostel.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.currentTrip === "Bali, Indonesia",
    choices: [
      { label: "Retrace the night", run: () => {
        const moneyLost = randomInt(400, 4200);
        addCanonEvent(`Survived a Bali blackout. ${money(moneyLost)} disappeared, came back with a tattoo nobody can read.`, "good");
        applyEffects(`Found out you got a tattoo. Found out the scooter was rented. Found out you have a new best friend named Wayan.`, { money: -moneyLost, happiness: 16, looks: -1, fame: 4, health: -6, discipline: -8 }, "good");
      } },
      { label: "Go to a hospital", run: () => applyEffects(`Doctor said you were fine but dehydrated. IV drip. Slept for 14 hours. Best money ever spent.`, { money: -randomInt(180, 600), health: 8, happiness: 4, discipline: 5 }) },
      { label: "Stay in your room for two days", run: () => applyEffects(`You hid. Watched the ceiling fan. Wrote in your phone notes. Decided to live different.`, { discipline: 10, smarts: 4, happiness: -3 }) }
    ]
  },

  {
    title: "Phuket Full Moon",
    text: () => `Full moon party on the beach. Buckets of unknown liquid, fire dancers, people on motorbikes nobody insured. ${localPerson()} disappears with a stranger and you're alone holding their backpack.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.currentTrip === "Phuket, Thailand",
    choices: [
      { label: "Find your friend", run: () => {
        if (chance(50)) {
          applyEffects(`Found them an hour later, perfectly fine, making out with someone you'll never see again. You held the backpack like a champion.`, { karma: 8, happiness: 8, discipline: 4 }, "good");
        } else {
          applyEffects(`Couldn't find them. Slept on the beach. They turned up at the hostel at 11AM. You both swore never again.`, { health: -6, happiness: -4, discipline: 3 });
        }
      } },
      { label: "Sell the backpack contents", run: () => applyEffects(`You went through their stuff. Karma noticed. They noticed too eventually.`, { money: randomInt(40, 380), karma: -15, happiness: -8 }, "bad") },
      { label: "Just party", run: () => {
        applyEffects(`You let them figure it out. You danced barefoot until 6AM. The sun came up over the ocean.`, { happiness: 18, health: -4, looks: 2, discipline: -4 }, "good");
      } }
    ]
  },

  {
    title: "Cartagena Beach Move",
    text: () => `${state.player.name} is in Cartagena. Sun, salsa, somebody from the hostel is connected to everybody. They offer to bring you to a "real" night.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.currentTrip === "Cartagena, Colombia",
    choices: [
      { label: "Go with them", run: () => {
        if (chance(40)) {
          applyEffects(`Ended up at a rooftop you'd never find again. Drank aguardiente. Danced bachata with somebody who could actually dance. Lost your watch. Worth it.`, { happiness: 16, looks: 4, money: -randomInt(200, 800), discipline: -2 }, "good");
        } else {
          applyEffects(`Almost got robbed. Played it cool. Walked out with your phone and a story. Could have been worse.`, { happiness: 4, smarts: 5, discipline: 4, health: -2 });
        }
      } },
      { label: "Stay at the hostel", run: () => applyEffects(`Met two Australians on the rooftop. Slow night, good talk. Slept early.`, { happiness: 6, discipline: 4, smarts: 2 }) }
    ]
  },

  {
    title: "Mexico City After-Hours",
    text: () => `Somebody in CDMX brought you to a place that opens after 4AM. The DJ is wearing a balaclava. The crowd is dressed like a Helmut Lang lookbook. Everybody knows everybody.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.location === "Mexico City, Mexico" && chance(8),
    choices: [
      { label: "Stay until the lights come on", run: () => {
        addCanonEvent(`Closed out an after-hours in CDMX with people you'll never see again. The kind of night you keep to yourself.`, "good");
        applyEffects(`Left at 9AM. Sun in your eyes. Felt like the city had let you in for one night.`, { happiness: 18, fame: 4, discipline: -4, health: -5, looks: 3 }, "good");
      } },
      { label: "Leave at 5AM", run: () => applyEffects(`You left when it was still smart to leave. Slept hard. Felt good the next day.`, { happiness: 8, discipline: 6 }, "good") }
    ]
  },

  {
    title: "Tokyo Host Club",
    text: () => `Walked past a host club in Shinjuku. Somebody waved you in. Inside it's gold, mirrors, and bottles with sparklers. They want you to order champagne.`,
    when: p => p.age >= 20 && isAdultUnlocked() && p.location === "Tokyo, Japan" && p.money >= 800 && chance(7),
    choices: [
      { label: "Buy a bottle", run: () => {
        const cost = randomInt(800, 4200);
        applyEffects(`You bought the bottle. Sparklers came out. Three people you don't know sat with you. Don't look at the receipt.`, { money: -cost, happiness: 10, looks: 2, discipline: -3 });
      } },
      { label: "Order tea, watch the show", run: () => applyEffects(`You stayed an hour, ordered green tea, observed. Walked out with insights and intact wallet. Tokyo respects strategy.`, { smarts: 5, discipline: 6, happiness: 4 }, "good") },
      { label: "Leave immediately", run: () => applyEffects(`You walked out before the meter started. Smart.`, { discipline: 8 }, "good") }
    ]
  },

  {
    title: "London Drill Scene",
    text: () => `Somebody you know on the ends invited you to a basement studio in South London. There's a producer with a Roland and three guys who haven't taken their balaclavas off. The smoke is thick.`,
    when: p => p.age >= 16 && isAdultUnlocked() && p.location === "London, UK" && chance(8),
    choices: [
      { label: "Stay and record", run: () => {
        const viral = chance(20 + Math.floor(state.player.stats.discipline / 5));
        if (viral) {
          addCanonEvent(`Got on a drill record. Track started moving online.`, "good");
          applyEffects(`The track caught. Your verse made TikTok. Followers came. Roads got mad.`, { fame: 18, followers: randomInt(8000, 80000), streetRep: 6, happiness: 14, money: randomInt(1200, 6800) }, "good");
        } else {
          applyEffects(`The track came out, it didn't hit. You learned what bars don't work.`, { smarts: 4, happiness: -2, fame: 2 });
        }
      } },
      { label: "Leave before the smoke gets too thick", run: () => applyEffects(`You bounced before anything got documented. Good move long-term.`, { discipline: 6, karma: 3 }) }
    ]
  },

  {
    title: "Atlanta Studio Session",
    text: () => `An A&R you DM'd two weeks ago hit you back. There's a session tonight at a studio in Buckhead. ${pick(["Quavo", "21 Savage's engineer", "Future's writer"])}'s assistant is in there.`,
    when: p => p.age >= 14 && isAdultUnlocked() && p.location === "Atlanta, GA" && (p.fame >= 5 || p.stats.smarts >= 60 || p.socialPage) && chance(10),
    choices: [
      { label: "Spit your best verse", run: () => {
        const heat = chance(35 + Math.floor(state.player.fame / 4));
        if (heat) {
          addCanonEvent(`Got a feature with an Atlanta name on the rise. The song is moving.`, "good");
          applyEffects(`They let you on the song. The engineer mixed it overnight. Streams climbing.`, { fame: 22, followers: randomInt(15000, 120000), money: randomInt(1800, 9500), happiness: 18, streetRep: 4 }, "good");
        } else {
          applyEffects(`The verse landed. The song never came out. Industry games.`, { smarts: 4, fame: 2, happiness: -3 });
        }
      } },
      { label: "Watch and learn", run: () => applyEffects(`You sat in the back, took notes, met three people. Slow burn move.`, { smarts: 6, discipline: 4, fame: 2 }, "good") }
    ]
  },

  {
    title: "Strip Club Private Room",
    text: () => `Magic City. A dancer offered you the private room. The bouncer is watching. Your wallet is heavier than your judgment.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.money >= 1500 && (p.personality === "wild" || p.personality === "reckless" || p.personality === "big" || p.fame >= 15) && chance(5),
    choices: [
      { label: "Go in", run: () => {
        const cost = randomInt(800, 5200);
        applyEffects(`You spent ${money(cost)} in 40 minutes. Felt like a king. Felt like an idiot. Both can be true.`, { money: -cost, happiness: 12, fame: 3, looks: 1, discipline: -4 });
      } },
      { label: "Tip a hundred and leave", run: () => applyEffects(`You did the right amount. Tipped, said goodnight, walked out with respect.`, { money: -100, happiness: 5, karma: 3 }, "good") }
    ]
  },

  {
    title: "First Real Tinder Date",
    text: () => `You're meeting them at a bar in ${originOf(state.player.location).short}. Their pictures looked like a Pinterest board. They walk in and... do not.`,
    when: p => p.age >= 18 && isAdultUnlocked() && !p.relationships.some(r => r.type === "partner") && chance(8),
    choices: [
      { label: "Be cool about it", run: () => {
        if (chance(40)) {
          const name = pick(peopleNames);
          state.player.relationships.push({ id: `friend_${Date.now()}`, name, role: "Date that became a friend", bond: randomInt(40, 65), type: "friend" });
          applyEffects(`Turned out they were funny. Not a romance but you got a friend. ${name} is in your life now.`, { happiness: 6, karma: 5 }, "good");
        } else {
          applyEffects(`You stayed an hour, paid the tab, left with a story.`, { money: -randomInt(45, 180), happiness: -1, karma: 4 });
        }
      } },
      { label: "Fake an emergency text", run: () => applyEffects(`You faked the emergency, left after 20 minutes. They knew. You felt bad for 3 weeks.`, { karma: -5, happiness: -4, smarts: 3 }, "bad") },
      { label: "Lean into the awkward", run: () => applyEffects(`You stayed, made fun of the date together, ended up actually liking each other. Strange win.`, { happiness: 9, karma: 6, looks: 1 }, "good") }
    ]
  },

  {
    title: "Almost Recruited",
    text: () => `Someone in a suit approached ${state.player.name} after a conference / event / cafe in ${originOf(state.player.location).short}. They knew your name. They knew your stats. They're offering "a different kind of opportunity." It feels like a movie.`,
    when: p => p.age >= 22 && isAdultUnlocked() && chaosLevel(p) >= 30 && (p.stats.smarts >= 65 || p.streetRep > 15) && chance(2),
    choices: [
      { label: "Take the meeting", run: () => {
        const path = chance(50);
        if (path) {
          addCanonEvent(`Met with someone who shouldn't have known their name. The conversation didn't happen. Officially.`, "good");
          applyEffects(`They offered something you can't talk about. Doors opened. Old doors closed. You don't sleep the same.`, { money: randomInt(8000, 45000), happiness: 4, discipline: 10, smarts: 8, karma: -8, fame: -3, streetRep: 12 }, "good");
        } else {
          applyEffects(`They smiled, said you weren't ready, left a card with no number. You think about them every few months.`, { smarts: 6, discipline: 4, happiness: -2 });
        }
      } },
      { label: "Walk away fast", run: () => applyEffects(`You said no thank you and got out of the building. The walk home felt longer. Good instincts.`, { karma: 8, discipline: 8, smarts: 5 }, "good") }
    ]
  },

  {
    title: "Cartel Offer (CDMX)",
    text: () => `Friend of a friend in Mexico City wants to introduce ${state.player.name} to "an investor." The investor wears a polo and rents a private floor at a restaurant. The offer is real money for "a logistics job."`,
    when: p => p.age >= 21 && isAdultUnlocked() && p.location === "Mexico City, Mexico" && (p.personality === "hustler" || p.personality === "reckless") && chance(3),
    choices: [
      { label: "Hear them out", run: () => {
        if (chance(35)) {
          addCanonEvent(`Took a meeting in CDMX they should NOT have taken. Money came in. Phone lines started feeling watched.`, "bad");
          applyEffects(`You're in something now. Money hit your account. So did fear.`, { money: randomInt(15000, 90000), happiness: 6, discipline: -4, karma: -18, streetRep: 14, risksTaken: 3 }, "bad");
        } else {
          applyEffects(`The meeting went sideways. You barely made it out. Took a flight that night with one bag.`, { money: -randomInt(800, 3200), health: -6, happiness: -12, discipline: 8 }, "bad");
        }
      } },
      { label: "Decline and disappear", run: () => applyEffects(`You said you'd think about it and moved hotels. Then airports. Then countries. Smart.`, { money: -randomInt(400, 1800), discipline: 10, karma: 6, smarts: 6, happiness: -2 }, "good") }
    ]
  },

  {
    title: "Vegas Casino Night",
    text: () => `Vegas. Bellagio. ${state.player.name} is at a blackjack table. The dealer is bored. The drinks are free. The chips feel imaginary.`,
    when: p => p.age >= 21 && isAdultUnlocked() && (p.location === "Las Vegas, NV" || p.currentTrip === "Las Vegas, NV"),
    choices: [
      { label: "Play it tight", run: () => {
        const win = chance(40);
        if (win) {
          const amount = randomInt(800, 6500);
          applyEffects(`You walked away ${money(amount)} up. Tipped the dealer. Slept fine.`, { money: amount, happiness: 8, smarts: 4 }, "good");
        } else {
          const loss = randomInt(400, 2200);
          applyEffects(`You lost ${money(loss)}. Walked the strip. Knew when to stop.`, { money: -loss, smarts: 4, discipline: 5, happiness: -3 });
        }
      } },
      { label: "Press your luck", run: () => {
        const win = chance(25);
        if (win) {
          const amount = randomInt(8000, 60000);
          addCanonEvent(`Won ${money(amount)} in a single Vegas night.`, "good");
          applyEffects(`You hit. ${money(amount)} hit your account. Trying not to chase it tomorrow.`, { money: amount, happiness: 22, fame: 4, discipline: -6 }, "good");
        } else {
          const loss = randomInt(3000, 25000);
          applyEffects(`You lost ${money(loss)}. Maxed a card. The room comp doesn't feel free anymore.`, { money: -loss, debt: chance(50) ? randomInt(2000, 8000) : 0, happiness: -16, discipline: 4 }, "bad");
        }
      } },
      { label: "Just watch", run: () => applyEffects(`You stood behind a table, watched, learned, left. The casino lost. They'll get it back from somebody else.`, { smarts: 6, discipline: 5 }, "good") }
    ]
  },

  {
    title: "Famous Person DM",
    text: () => `${pick(["A reality TV star", "An NBA player's cousin", "A rapper with 800K followers", "An OnlyFans top earner"])} just DM'd ${state.player.handle || state.player.name}. They want to "link."`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.fame >= 10 && p.socialPage && chance(6),
    choices: [
      { label: "Pull up", run: () => {
        const win = chance(45 + Math.floor(state.player.stats.looks / 6));
        if (win) {
          addCanonEvent(`Got pulled into a famous person's circle. Things accelerated.`, "good");
          applyEffects(`The night went somewhere. They added you to a group chat with people you used to follow. New life arc unlocked.`, { fame: 14, followers: randomInt(8000, 60000), happiness: 12, discipline: -4 }, "good");
        } else {
          applyEffects(`They were on something. You weren't. You watched them spiral and called an Uber.`, { fame: 3, happiness: -2, smarts: 5 });
        }
      } },
      { label: "Stay home", run: () => applyEffects(`You replied "rain check" and went to bed. You'll never know what could've happened. Probably for the best.`, { discipline: 8, happiness: 2 }, "good") }
    ]
  },

  {
    title: "Border Crossing Issue",
    text: () => `Customs pulled ${state.player.name} aside at the airport. They want to talk about something in your luggage / your phone / your visa.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.trips.length >= 1 && chance(4),
    choices: [
      { label: "Stay calm, answer everything", run: () => {
        if (chance(70)) {
          applyEffects(`Took 90 minutes. They let you through. You learned how customs works.`, { smarts: 6, discipline: 5, happiness: -3 });
        } else {
          applyEffects(`They flagged you. Phone got copied. Trip ended right there.`, { money: -randomInt(800, 3200), happiness: -10, record: 1 }, "bad");
        }
      } },
      { label: "Lawyer up immediately", run: () => applyEffects(`You asked for a lawyer. They held you 6 hours, let you go. Bill came later.`, { money: -randomInt(1200, 4500), discipline: 8, smarts: 5 }) }
    ]
  },

  {
    title: "Tape Leaked",
    text: () => `Something private of ${state.player.name}'s got leaked online. It's spreading. The screenshots are already in your DMs.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.fame >= 25 && p.followers >= 10000 && chance(3),
    choices: [
      { label: "Lean in, monetize", run: () => {
        const fol = randomInt(50000, 400000);
        addCanonEvent(`Leaked tape became a launchpad. Followers exploded. Family stopped calling.`, "bad");
        applyEffects(`Followers exploded. Some bridges burned permanently.`, { followers: fol, fame: 25, money: randomInt(8000, 65000), happiness: -8, karma: -10 }, "good");
      } },
      { label: "Issue a takedown, lay low", run: () => {
        const lost = Math.floor(state.player.followers * 0.15);
        applyEffects(`Lawyer sent letters. Most platforms took it down. You lost ${lost.toLocaleString()} followers and a year of mental health.`, { money: -randomInt(2000, 8000), followers: -lost, happiness: -18, discipline: 6, karma: 4 }, "bad");
      } },
      { label: "Disappear from the internet", run: () => applyEffects(`Deleted everything. Moved cities. Got a normal job. Three years from now you'll feel free again.`, { followers: -state.player.followers, fame: -40, happiness: -8, discipline: 12, karma: 8 }, "bad") }
    ]
  },

  {
    title: "Yacht Week (Croatia)",
    text: () => `Friends booked Yacht Week. ${state.player.name} got the call. There's a deposit due in 48 hours.`,
    when: p => p.age >= 21 && isAdultUnlocked() && p.currentTrip === "Croatia (Yacht Week)",
    choices: [
      { label: "Book the trip", run: () => {
        const cost = randomInt(3500, 8500);
        const fol = randomInt(2000, 18000);
        addCanonEvent(`Did Yacht Week. Photos that'll be in a slideshow at their wedding.`, "good");
        applyEffects(`Croatia. Sun. Drinks at 11AM. Made friends with a German banker. Photos went up, followers went up.`, { money: -cost, happiness: 22, fame: 6, followers: fol, looks: 4, health: -2 }, "good");
      } },
      { label: "Pass", run: () => applyEffects(`You sat it out. The group chat reminded you for months. Saved the money though.`, { discipline: 6, happiness: -4 }) }
    ]
  },

  {
    title: "Underground Fight Club Invite",
    text: () => `Somebody mentioned a fight club in a parking garage. Cash to enter. Cash to win. Real fights, no rules, no gloves.`,
    when: p => p.age >= 18 && isAdultUnlocked() && (p.personality === "reckless" || p.streetRep > 12 || p.stats.health >= 75) && chance(3),
    choices: [
      { label: "Enter", run: () => {
        const win = chance(25 + Math.floor(state.player.stats.health / 4));
        if (win) {
          const amount = randomInt(1200, 8000);
          applyEffects(`You won. Walked out with ${money(amount)} and a chipped tooth.`, { money: amount, streetRep: 15, health: -12, looks: -3, fame: 4 }, "good");
        } else {
          applyEffects(`You got beat. Hospital. ${money(randomInt(800, 3000))} for stitches and an MRI.`, { money: -randomInt(800, 3000), health: -25, looks: -5, streetRep: 4, discipline: 4 }, "bad");
        }
      } },
      { label: "Bet on someone else", run: () => {
        if (chance(40)) {
          applyEffects(`Won the bet. ${money(randomInt(400, 2400))} richer.`, { money: randomInt(400, 2400), happiness: 4 }, "good");
        } else {
          applyEffects(`Lost the bet. You watched a guy get KO'd cold. Not a good night.`, { money: -randomInt(200, 1200), happiness: -6 }, "bad");
        }
      } }
    ]
  },

  {
    title: "Therapy Breakthrough",
    text: () => `${state.player.name}'s therapist asked one question today that broke open something old. There's no script for what comes next.`,
    when: p => p.age >= 20 && (p.personality === "storm" || p.personality === "romantic" || p.personality === "bookworm" || p.personality === "calm") && p.money >= 200 && chance(8),
    choices: [
      { label: "Sit in it", run: () => {
        addCanonEvent(`Had a real breakthrough in therapy. Old patterns started loosening.`, "good");
        applyEffects(`You cried in the parking lot for forty minutes. Then you breathed. Then everything looked slightly different.`, { happiness: 14, discipline: 6, smarts: 5, karma: 4 }, "good");
      } },
      { label: "Cancel the next 4 sessions", run: () => applyEffects(`You ran from it. The body kept the score. You'll be back in a year, harder.`, { happiness: -6, discipline: -4, smarts: 2 }, "bad") }
    ]
  },

  {
    title: "Family Estate Drama",
    text: () => `A relative who barely knew ${state.player.name} died. There's an inheritance, but it's tangled — three cousins want a piece, an attorney wants their cut, and somebody's questioning the will.`,
    when: p => p.age >= 25 && chance(3),
    choices: [
      { label: "Fight for the full share", run: () => {
        const win = chance(45 + Math.floor(state.player.stats.smarts / 7));
        if (win) {
          const amount = randomInt(40000, 280000);
          addCanonEvent(`Won a contested inheritance. ${money(amount)} cleared.`, "good");
          applyEffects(`The will held. ${money(amount)} hit. Family Christmas is permanently weird now.`, { money: amount, happiness: 8, karma: -4, smarts: 4 }, "good");
        } else {
          applyEffects(`The court split it differently than you expected. You spent ${money(randomInt(4000, 18000))} in lawyer fees for less than you wanted.`, { money: -randomInt(4000, 18000), happiness: -8, smarts: 6 }, "bad");
        }
      } },
      { label: "Take what's offered, walk away", run: () => {
        const amount = randomInt(8000, 60000);
        applyEffects(`You signed quickly. Took ${money(amount)}. Slept fine. Family relationships intact.`, { money: amount, karma: 8, happiness: 6, discipline: 4 }, "good");
      } },
      { label: "Refuse the whole thing", run: () => applyEffects(`You walked away from the money. Family thought you were a saint. Future you wonders.`, { karma: 16, discipline: 8, happiness: 2 }) }
    ]
  },

  {
    title: "Slow Romance, Right Person",
    text: () => `${state.player.name} kept running into the same person at the coffee shop / gym / corner store in ${originOf(state.player.location).short}. Today they finally asked your name.`,
    when: p => p.age >= 18 && (p.personality === "romantic" || p.personality === "calm" || p.personality === "storm") && !p.relationships.some(r => r.type === "partner") && chance(8),
    choices: [
      { label: "Take it slow", run: () => {
        const name = pick(originOf(state.player.location).locals.concat(peopleNames));
        state.player.relationships.push({ id: `partner-${Date.now()}`, name, role: "Partner", bond: randomInt(64, 88), type: "partner" });
        addCanonEvent(`Met ${name}. Took it slow. Felt different than the others.`, "good");
        applyEffects(`Got coffee. Then dinner. Then a real conversation about who you both want to be. ${name} stayed.`, { happiness: 16, looks: 3, discipline: 4, karma: 6 }, "good");
      } },
      { label: "Move fast", run: () => {
        if (chance(40)) {
          const name = pick(peopleNames);
          state.player.relationships.push({ id: `partner-${Date.now()}`, name, role: "Partner (it was fast)", bond: randomInt(55, 78), type: "partner" });
          applyEffects(`Moved in by week three. Could go either way. ${name} is in your bed and on your lease.`, { happiness: 12, discipline: -3 }, "good");
        } else {
          applyEffects(`You scared them off going too fast. Texted twice. They didn't reply. You felt it.`, { happiness: -8, smarts: 4, discipline: 3 }, "bad");
        }
      } }
    ]
  },

  // ============================================================
  // CITY EXPANSION: Medellín, Paris, Dubai, Rio, Seoul, Vegas
  // ============================================================

  // ---- MEDELLÍN ----
  {
    title: "Medellín Hillside Story",
    text: () => `Old man at the panadería told ${state.player.name} about his comuna in the 90s. Then he changed the subject. Some stories Medellín still doesn't tell out loud.`,
    when: p => p.age >= 12 && p.location === "Medellín, Colombia" && chance(8),
    choices: [
      { label: "Ask him to keep going", run: () => applyEffects(`He told you what the city used to look like. You understood something old in your blood.`, { smarts: 6, karma: 4, happiness: 2 }, "good") },
      { label: "Let the silence sit", run: () => applyEffects(`You finished your café tinto, paid, walked home. Some things don't need words.`, { discipline: 5, smarts: 3 }) }
    ]
  },
  {
    title: "El Poblado Money Offer",
    text: () => `Friend's cousin in El Poblado has people moving money around the city. He says ${state.player.name} could be a courier. Cash for the trip, no questions, no narco — "just paper."`,
    when: p => p.age >= 16 && isAdultUnlocked() && p.location === "Medellín, Colombia" && (p.personality === "hustler" || p.personality === "reckless" || p.spawnClass === "struggling" || p.spawnClass === "survival") && chance(5),
    choices: [
      { label: "One run only", run: () => {
        if (chance(55)) {
          applyEffects(`The run went clean. ${money(randomInt(800, 4500))} cash. You're trying not to do it again.`, { money: randomInt(800, 4500), streetRep: 4, happiness: 6, karma: -6 });
        } else {
          applyEffects(`Police checkpoint at the second curve. You spent two days in a holding cell. Lawyer cost everything you made.`, { money: -randomInt(800, 2400), record: 1, health: -4, happiness: -12 }, "bad");
        }
      } },
      { label: "Stay out of it", run: () => applyEffects(`You said no thank you. Walked the long way home. Slept fine.`, { discipline: 8, karma: 6 }, "good") }
    ]
  },
  {
    title: "Paragliding Over the Valley",
    text: () => `Friends booked paragliding over the Aburrá valley. Strapped in next to a guy who looked like he didn't speak Spanish OR English. The ground is far away.`,
    when: p => p.age >= 14 && p.location === "Medellín, Colombia" && chance(7),
    choices: [
      { label: "Send it", run: () => applyEffects(`Twenty minutes in the sky over Medellín. Photos became your most-saved screenshots. Slept like a kid.`, { happiness: 14, looks: 2, money: -randomInt(60, 180), fame: chance(20) ? 3 : 0 }, "good") },
      { label: "Stay on the ground", run: () => applyEffects(`You took the photos from the lookout. Less crazy, still beautiful.`, { happiness: 4, discipline: 3 }) }
    ]
  },

  // ---- PARIS ----
  {
    title: "Smoke Break in the 11e",
    text: () => `${state.player.name} ended up at a bar in Oberkampf. Everybody smokes outside, talks fast, switches to English when they hear your accent.`,
    when: p => p.age >= 16 && isAdultUnlocked() && p.location === "Paris, France" && chance(8),
    choices: [
      { label: "Stay all night", run: () => applyEffects(`You closed the bar. Made friends with a film school student and a guy who works at the museum at night. Your French got 12% better.`, { happiness: 12, smarts: 4, looks: 2, health: -3, discipline: -2 }, "good") },
      { label: "Leave at midnight", run: () => applyEffects(`You took the last metro home. Read a book in bed. Felt like a Parisian for one evening.`, { happiness: 6, smarts: 5, discipline: 6 }, "good") }
    ]
  },
  {
    title: "Fashion Week Side Door",
    text: () => `Someone slipped ${state.player.name} a pass to a side show at Paris Fashion Week. The dress code is "expensive and bored."`,
    when: p => p.age >= 17 && p.location === "Paris, France" && (p.stats.looks >= 60 || p.fame >= 8) && chance(6),
    choices: [
      { label: "Pull up dressed right", run: () => {
        if (chance(50 + Math.floor(state.player.stats.looks / 5))) {
          addCanonEvent(`Got into a Paris Fashion Week side show and made it on a street style account.`, "good");
          applyEffects(`A photographer caught your fit. You're on a street style account by Tuesday.`, { fame: 12, looks: 5, followers: randomInt(2000, 22000), happiness: 10 }, "good");
        } else {
          applyEffects(`You went, drank one champagne, stood near three conversations. Felt like a tourist. Took photos anyway.`, { happiness: 3, looks: 1 });
        }
      } },
      { label: "Sell the pass instead", run: () => applyEffects(`You sold the pass to a tourist for €300. Spent it on actual dinner instead.`, { money: 320, smarts: 4, karma: -2 }) }
    ]
  },
  {
    title: "Romance on the Seine",
    text: () => `${state.player.name} crossed paths with somebody on a bridge over the Seine. They asked for a cigarette. You don't smoke but you stood there for forty minutes anyway.`,
    when: p => p.age >= 17 && p.location === "Paris, France" && (p.personality === "romantic" || p.personality === "storm") && !p.relationships.some(r => r.type === "partner") && chance(8),
    choices: [
      { label: "Get their number", run: () => {
        const name = pick(["Camille", "Léo", "Inès", "Chloé", "Mathéo"]);
        state.player.relationships.push({ id: `partner-${Date.now()}`, name, role: "Partner from Paris", bond: randomInt(60, 88), type: "partner" });
        addCanonEvent(`Met ${name} on a bridge in Paris. The kind of meet-cute people don't believe.`, "good");
        applyEffects(`${name} is now in your life. The story will sound fake at dinner parties forever.`, { happiness: 18, looks: 4, karma: 6 }, "good");
      } },
      { label: "Walk away", run: () => applyEffects(`You didn't ask for the number. The Seine kept moving. So did you.`, { discipline: 6, happiness: -3, smarts: 3 }) }
    ]
  },

  // ---- DUBAI ----
  {
    title: "Brunch at the Burj",
    text: () => `Friends booked a brunch at the Burj Al Arab. The bill at the end is rumored to be its own kind of party trick.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.location === "Dubai, UAE" && p.money >= 2500 && chance(7),
    choices: [
      { label: "Eat like an emir", run: () => {
        const cost = randomInt(1800, 8500);
        applyEffects(`Caviar, wagyu, gold-leaf coffee. Photos got 40K likes. Bill was ${money(cost)}. Worth it for the content.`, { money: -cost, happiness: 14, fame: 6, followers: randomInt(800, 8000), looks: 3 }, "good");
      } },
      { label: "Order the cheapest thing on the menu", run: () => applyEffects(`You ate two croissants and a coffee for $80. Everybody else burned thousands. You felt smarter and emptier.`, { money: -80, discipline: 8, happiness: -2, smarts: 4 }) }
    ]
  },
  {
    title: "Supercar Loaner",
    text: () => `Somebody you barely know offered ${state.player.name} their Lamborghini for the weekend in Dubai. The desert highway is right there.`,
    when: p => p.age >= 21 && isAdultUnlocked() && p.location === "Dubai, UAE" && p.licenses.includes("driver") && chance(5),
    choices: [
      { label: "Take it to the desert", run: () => {
        if (chance(70)) {
          applyEffects(`You hit 270 km/h on the road to Hatta. Returned the car clean. Story for life.`, { happiness: 16, fame: 4, followers: randomInt(800, 5000), discipline: -3 }, "good");
        } else {
          applyEffects(`Tail-ended a Camry at a roundabout. The Lambo bumper cost ${money(randomInt(8000, 28000))} to fix. They never lent it again.`, { money: -randomInt(8000, 28000), happiness: -12, looks: -1 }, "bad");
        }
      } },
      { label: "Take it for one Instagram and return it", run: () => applyEffects(`You drove it three blocks, got the post, gave it back. Two-second flex, no liability.`, { fame: 4, looks: 2, followers: randomInt(200, 2000), happiness: 6 }, "good") }
    ]
  },
  {
    title: "Visa Worker Wakeup",
    text: () => `${state.player.name} noticed the construction workers at the hotel pool finishing their 14-hour shift at 6AM as you came back from a club. They're from Kerala / Bangladesh / Sri Lanka. They smile politely.`,
    when: p => p.age >= 18 && p.location === "Dubai, UAE" && chance(5),
    choices: [
      { label: "Sit with it", run: () => applyEffects(`You went back to your hotel room and lay there for two hours staring at the ceiling. Some things make the gold-leaf coffee taste different.`, { smarts: 8, karma: 8, happiness: -4, discipline: 4 }, "good") },
      { label: "Move on with your day", run: () => applyEffects(`You shrugged it off and went to brunch. The thought came back at 3AM in bed.`, { smarts: 2, karma: -2, happiness: 1 }) }
    ]
  },

  // ---- RIO ----
  {
    title: "Ipanema Sunset",
    text: () => `Sunset at Posto 9. Everybody clapping when the sun drops. ${state.player.name} is barefoot. The beach is the friendliest part of the city.`,
    when: p => p.age >= 12 && p.location === "Rio de Janeiro, Brazil" && chance(10),
    choices: [
      { label: "Stay through dark", run: () => applyEffects(`You stayed. Met three locals. Drank caipirinha from a styrofoam cup. Walked home through a city that knows how to live.`, { happiness: 12, looks: 3, money: -randomInt(20, 80) }, "good") },
      { label: "Head home for dinner", run: () => applyEffects(`You went home before the sand cooled. Slept early. Wholesome.`, { discipline: 4, happiness: 4 }) }
    ]
  },
  {
    title: "Funk Party in the Favela",
    text: () => `Cousin took ${state.player.name} to a baile funk party in Rocinha. Loud, sweaty, the bass shakes the wall, and the police aren't coming up the hill tonight.`,
    when: p => p.age >= 16 && isAdultUnlocked() && p.location === "Rio de Janeiro, Brazil" && chance(7),
    choices: [
      { label: "Dance until 5AM", run: () => {
        if (chance(70)) {
          applyEffects(`You danced. Made friends. Got home at sunrise. The block protected you because you came with somebody who belonged.`, { happiness: 16, streetRep: 4, looks: 2, health: -3 }, "good");
        } else {
          applyEffects(`Something popped off near the entrance. You ducked, walked out, didn't sleep right for a week.`, { happiness: -8, health: -4, streetRep: 2, discipline: 4 }, "bad");
        }
      } },
      { label: "Leave at 2AM", run: () => applyEffects(`You bounced before the energy turned. Smart. The cousin called you boring. You don't care.`, { discipline: 6, happiness: 3 }) }
    ]
  },
  {
    title: "Carnival Block Party",
    text: () => `Carnival. ${state.player.name} is at a bloco in Lapa. Glitter, beer, somebody in a sequin thong, the entire city wearing the same costume of "free."`,
    when: p => p.age >= 16 && isAdultUnlocked() && p.location === "Rio de Janeiro, Brazil" && chance(8),
    choices: [
      { label: "Lose yourself in it", run: () => {
        addCanonEvent(`Did Carnival in Rio properly. ${state.player.name} won't remember half of it.`, "good");
        applyEffects(`Five days became one long day. You don't know what year it is. You got kissed by three different people. It was perfect.`, { happiness: 22, looks: 3, fame: 4, followers: randomInt(800, 8000), health: -6, discipline: -8 }, "good");
      } },
      { label: "Watch from the balcony", run: () => applyEffects(`You watched from above. Made the right call for your introvert lifetime. Took beautiful photos.`, { happiness: 8, smarts: 3 }) }
    ]
  },

  // ---- SEOUL ----
  {
    title: "K-Pop Audition Day",
    text: () => `Friend forwarded ${state.player.name} a flyer for an open call at SM / JYP / HYBE. They're picking new trainees. The line goes around the block.`,
    when: p => p.age >= 14 && p.age <= 22 && p.location === "Seoul, South Korea" && p.stats.looks >= 55 && chance(7),
    choices: [
      { label: "Wait in line", run: () => {
        if (chance(15 + Math.floor(state.player.stats.looks / 5))) {
          addCanonEvent(`Made it into a K-pop trainee program. The hours are brutal.`, "good");
          applyEffects(`They picked you. Trainee contract signed. The schedule starts at 5AM tomorrow.`, { fame: 18, looks: 6, discipline: 8, happiness: 14, health: -4 }, "good");
        } else {
          applyEffects(`Eight hours in line. Got cut after 90 seconds. Cried in the bathroom. Tried again next year.`, { happiness: -8, discipline: 4, smarts: 3 });
        }
      } },
      { label: "Skip it, go to school", run: () => applyEffects(`You skipped it. The friend got picked. You'll think about it forever.`, { smarts: 4, happiness: -3 }) }
    ]
  },
  {
    title: "Gangnam Plastic Surgery Pitch",
    text: () => `A clinic in Gangnam pulled ${state.player.name} aside on the sidewalk. They handed you a brochure. "Just two small adjustments. Pay over time."`,
    when: p => p.age >= 16 && p.location === "Seoul, South Korea" && p.stats.looks < 70 && chance(5),
    choices: [
      { label: "Book the consultation", run: () => {
        const cost = randomInt(3000, 18000);
        if (state.player.money >= cost) {
          applyEffects(`Three weeks of recovery. Your face changed. Strangers treat you differently now. You're not sure how to feel.`, { money: -cost, looks: 14, happiness: 4, smarts: -1 });
        } else {
          state.player.debt += cost;
          applyEffects(`You financed it. Your face changed. Strangers treat you differently. So does the debt collector.`, { debt: cost, looks: 14, happiness: 2, smarts: 2 });
        }
      } },
      { label: "Walk away", run: () => applyEffects(`You said no thank you in your best Korean. Walked away with your face intact.`, { karma: 6, discipline: 7 }, "good") }
    ]
  },
  {
    title: "Hagwon All-Nighter",
    text: () => `${state.player.name} is in cram school until 11PM. Then there's another two hours of homework. Then there's the test on Monday.`,
    when: p => p.age >= 13 && p.age <= 19 && p.location === "Seoul, South Korea" && p.educationRank >= 2 && chance(10),
    choices: [
      { label: "Grind through it", run: () => applyEffects(`You pushed through. Stats up. Sleep down. Your mom said she's proud, then asked about the next test.`, { smarts: 8, discipline: 6, health: -4, happiness: -3 }, "good") },
      { label: "Sneak out for jjajangmyeon", run: () => applyEffects(`You and three friends slipped out for noodles at midnight. Got back two hours later. The bond was worth the test grade.`, { happiness: 8, karma: 4, smarts: -2, discipline: -3 }) }
    ]
  },

  // ---- LAS VEGAS ----
  {
    title: "Mom's Pit Boss",
    text: () => `${state.player.name}'s mom works the casino floor. She brought home a "friend" — the pit boss — who's been buying you new clothes lately.`,
    when: p => p.age >= 10 && p.age <= 18 && p.location === "Las Vegas, NV" && chance(7),
    choices: [
      { label: "Accept the clothes", run: () => applyEffects(`You wore the Foot Lockers. The other kids noticed. Mom was happy. You stayed quiet about the weird parts.`, { looks: 4, money: 0, happiness: 2, karma: -2 }) },
      { label: "Refuse them", run: () => applyEffects(`You said no thank you. Mom was upset. You learned to read a room early.`, { discipline: 8, smarts: 6, happiness: -4 }) }
    ]
  },
  {
    title: "Off-Strip Hustle",
    text: () => `A guy who works at one of the strip clubs offered ${state.player.name} a side gig: hand out cards to tourists on Fremont. $200 a night cash.`,
    when: p => p.age >= 17 && isAdultUnlocked() && p.location === "Las Vegas, NV" && p.money < 800 && chance(6),
    choices: [
      { label: "Take the gig", run: () => {
        const earned = randomInt(180, 480);
        applyEffects(`Three nights of handing out cards. ${money(earned)} in your pocket. Two regulars asked if you "did more." You said no.`, { money: earned, happiness: 3, karma: -3, smarts: 4 });
      } },
      { label: "Pass", run: () => applyEffects(`You said no. Worked at the In-N-Out. Made less, slept better.`, { discipline: 5, karma: 4 }, "good") }
    ]
  },
  {
    title: "Pool Party at the Cosmo",
    text: () => `Free pool party invite at the Cosmopolitan. Friends say it's "wild but chill." You know exactly what that means.`,
    when: p => p.age >= 21 && isAdultUnlocked() && p.location === "Las Vegas, NV" && chance(8),
    choices: [
      { label: "Pull up", run: () => {
        if (chance(50)) {
          applyEffects(`You met a producer / model / dealer / future ex. Stayed until 2AM. Walked back through the Strip's heat barefoot.`, { happiness: 14, looks: 3, fame: 4, followers: randomInt(400, 4000), money: -randomInt(80, 320) }, "good");
        } else {
          applyEffects(`The pool party was packed and not for you. Drank one mojito, left, watched a movie in your apartment.`, { happiness: 2, smarts: 2 });
        }
      } },
      { label: "Skip it", run: () => applyEffects(`You stayed in. Watched the lights from your balcony. The Strip doesn't need you to be impressed.`, { discipline: 5, happiness: 1 }) }
    ]
  },

  // ============================================================
  // VACATION DESTINATIONS — Cabo / Cancún / Tulum
  // ============================================================

  {
    title: "Cabo Spring Break",
    text: () => `Friends booked Cabo. Eight people in a four-bedroom Airbnb. Bottle service. Mandala beach club. ${state.player.name} is committing the deposit by tonight.`,
    when: p => p.age >= 19 && p.age <= 26 && isAdultUnlocked() && p.currentTrip === "Cabo, Mexico",
    choices: [
      { label: "Book it", run: () => {
        const cost = randomInt(900, 2400);
        addCanonEvent(`Did Cabo with the boys/girls. ${state.player.name} has photos that explain a lot.`, "good");
        applyEffects(`Four days. Three blackouts. Two new friends. One questionable tattoo. Worth it.`, { money: -cost, happiness: 20, fame: 4, followers: randomInt(400, 4000), looks: 2, health: -4 }, "good");
        if (!(state.player.trips || []).includes("Cabo")) state.player.trips.push("Cabo");
      } },
      { label: "Skip it", run: () => applyEffects(`You said no. The group came back loud and broke. You saved the money.`, { discipline: 6, money: 0, happiness: -4 }) }
    ]
  },
  {
    title: "Cancún All-Inclusive Mistake",
    text: () => `Family / friends booked a Cancún all-inclusive. Wristbands, unlimited tequila, mediocre buffet, beach beyond the wall.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.currentTrip === "Cancún, Mexico",
    choices: [
      { label: "Embrace the resort", run: () => {
        const cost = randomInt(1100, 3200);
        applyEffects(`You drank piña coladas through a straw for five days. Got the worst sunburn of your life. Slept like a king.`, { money: -cost, happiness: 14, health: -3, looks: 1 });
        if (!(state.player.trips || []).includes("Cancún")) state.player.trips.push("Cancún");
      } },
      { label: "Escape to a real beach", run: () => {
        if (chance(60)) {
          applyEffects(`You snuck off to Isla Mujeres for a day. Met a kid selling coconuts who's now your best friend on Instagram. The real Mexico hits different.`, { happiness: 14, smarts: 4, karma: 4, looks: 2 }, "good");
        } else {
          applyEffects(`You tried to leave the resort, got mildly lost, came back exhausted. The buffet was still there.`, { happiness: 2, discipline: 3, health: -2 });
        }
      } }
    ]
  },
  {
    title: "Tulum Wellness Trap",
    text: () => `Influencer friend offered ${state.player.name} a "wellness retreat" in Tulum. Cacao ceremonies. Ice baths. A breathwork shaman who used to be a SoulCycle instructor.`,
    when: p => p.age >= 22 && isAdultUnlocked() && p.currentTrip === "Tulum, Mexico",
    choices: [
      { label: "Go all in", run: () => {
        const cost = randomInt(2200, 7800);
        if (chance(50)) {
          addCanonEvent(`Did the Tulum thing. ${state.player.name} came back with a meditation app subscription and a few real shifts.`, "good");
          applyEffects(`The cacao actually did something. You cried twice. You came back lighter and posted a sunset photo every day for a month.`, { money: -cost, happiness: 18, smarts: 4, discipline: 6, looks: 3, fame: 4, followers: randomInt(800, 6500) }, "good");
        } else {
          applyEffects(`The retreat was a scam. Everything was Instagram-staged. You spent $4K on incense and disappointment.`, { money: -cost, happiness: -8, smarts: 8, karma: 2 }, "bad");
        }
        if (!(state.player.trips || []).includes("Tulum")) state.player.trips.push("Tulum");
      } },
      { label: "Just go to the beach instead", run: () => {
        const cost = randomInt(600, 2200);
        applyEffects(`You spent four days reading a book on the beach. No ceremonies. Just water, sun, tacos. Best $${cost} ever spent.`, { money: -cost, happiness: 14, smarts: 4, health: 4 }, "good");
        if (!(state.player.trips || []).includes("Tulum")) state.player.trips.push("Tulum");
      } }
    ]
  },

  // ============================================================
  // SEASONAL / HOLIDAY EVENTS — fire based on calendar year + age
  // ============================================================

  {
    title: "New Year's Eve",
    text: () => `Last night of ${currentYear(state.player)}. Where ${state.player.name} ends up tonight will say everything about who they are right now.`,
    when: p => p.age >= 16 && chance(14),
    choices: [
      { label: "Penthouse party with the boys/girls", run: () => {
        const cost = randomInt(120, 800);
        applyEffects(`You closed out the year drunk at 3AM on a balcony in ${originOf(state.player.location).short}. Worth it.`, { money: -cost, happiness: 12, fame: 2, health: -2 }, "good");
      } },
      { label: "Kiss someone at midnight", run: () => {
        if (chance(50 + Math.floor(state.player.stats.looks / 6))) {
          applyEffects(`You kissed someone in the right place at the right time. The new year started with their number in your phone.`, { happiness: 14, looks: 2 }, "good");
        } else {
          applyEffects(`You went for it. They turned their head. The countdown finished without you.`, { happiness: -5, smarts: 3 });
        }
      } },
      { label: "Stay in, reflect", run: () => applyEffects(`You watched the ball drop alone. Wrote down what next year is for. Felt grown.`, { discipline: 8, smarts: 5, happiness: 3 }, "good") }
    ]
  },

  {
    title: "Valentine's Day",
    text: () => {
      const partner = state.player.relationships.find(r => r.type === "partner");
      return partner
        ? `Valentine's. ${partner.name} is expecting something. The bar is whatever you set last year.`
        : `Valentine's. Single. Every restaurant booked. Every couple visible. The day is louder when you're not in it.`;
    },
    when: p => p.age >= 14 && chance(10),
    choices: [
      { label: "Go big", run: () => {
        const cost = randomInt(180, 1800);
        const partner = state.player.relationships.find(r => r.type === "partner");
        if (partner) {
          changeBond(partner, 12);
          applyEffects(`${money(cost)} flowers, dinner, the bag, the works. ${partner.name} cried. Worth every dollar.`, { money: -cost, happiness: 14 }, "good");
        } else {
          applyEffects(`You booked a solo dinner. Ate alone. Tipped well. Walked home feeling fine, actually.`, { money: -cost, happiness: 6, discipline: 4 });
        }
      } },
      { label: "Do nothing", run: () => {
        const partner = state.player.relationships.find(r => r.type === "partner");
        if (partner) {
          changeBond(partner, -18);
          applyEffects(`You forgot. ${partner.name} did not. Cold week.`, { happiness: -8, karma: -3 }, "bad");
        } else {
          applyEffects(`You skipped it. Watched a movie. Slept early. Day passed.`, { discipline: 4 });
        }
      } }
    ]
  },

  {
    title: "Super Bowl Weekend",
    text: () => `Super Bowl is on. Friends in ${originOf(state.player.location).short} are throwing the party. Wings, bets, screaming at the TV. ${pick(["The Chiefs", "The Eagles", "The 49ers", "The Cowboys"])} are favored.`,
    when: p => p.age >= 14 && currentYear(p) >= 1985 && chance(7),
    choices: [
      { label: "Bet on the underdog", run: () => {
        const bet = randomInt(80, 800);
        if (chance(35)) {
          applyEffects(`Upset. ${money(bet * 3)} cleared. You're buying breakfast tomorrow.`, { money: bet * 2, happiness: 12, fame: 2 }, "good");
        } else {
          applyEffects(`Lost the bet. Ate wings, drank too much. Watched the halftime show twice.`, { money: -bet, happiness: 3, health: -2 });
        }
      } },
      { label: "Just watch and eat", run: () => applyEffects(`You ate everything on the table. Best halftime takes were yours.`, { money: -randomInt(20, 120), happiness: 6, health: -2 }) }
    ]
  },

  {
    title: "Halloween Night",
    text: () => `Halloween in ${originOf(state.player.location).short}. Costume's in the closet. Three parties on the group chat. ${state.player.name} has to pick.`,
    when: p => p.age >= 14 && chance(11),
    choices: [
      { label: "Wear the wildest fit", run: () => {
        const fol = randomInt(50, 1800);
        applyEffects(`Your costume hit. People wanted photos. Three people you don't know followed you back.`, { fame: 4, looks: 3, followers: fol, happiness: 10 }, "good");
      } },
      { label: "Couple's costume / friend group", run: () => {
        const partner = state.player.relationships.find(r => r.type === "partner");
        if (partner) changeBond(partner, 8);
        applyEffects(`You and the squad did a coordinated thing. The photo went up on everybody's pages.`, { happiness: 12, karma: 4, fame: 2 }, "good");
      } },
      { label: "Skip it", run: () => applyEffects(`You watched horror movies alone. Best decision actually.`, { discipline: 4, happiness: 2 }) }
    ]
  },

  {
    title: "Thanksgiving at Home",
    text: () => {
      const family = state.player.relationships.find(r => r.type === "family");
      return `Thanksgiving. ${family?.name || "Family"} cooked. Everybody is asking when ${state.player.name} is going to figure their life out.`;
    },
    when: p => p.age >= 18 && currentYear(p) >= 1990 && p.relationships.some(r => r.type === "family") && chance(8),
    choices: [
      { label: "Bring up your wins", run: () => {
        if (chance(45)) {
          applyEffects(`You told them about the move you made. The table got quiet, then loud. Pops gave you a real nod.`, { happiness: 12, karma: 4 }, "good");
        } else {
          applyEffects(`Auntie made it weird. You ate three more plates and shut up.`, { happiness: -4, health: -2, discipline: 3 });
        }
      } },
      { label: "Just listen and eat", run: () => {
        state.player.relationships.filter(r => r.type === "family").forEach(person => changeBond(person, 6));
        applyEffects(`You listened. Played with the kids. Helped clean up. Family loved you for it.`, { karma: 8, happiness: 8 }, "good");
      } }
    ]
  },

  {
    title: "Christmas Morning",
    text: () => `Christmas morning. Kids are up at 6. The tree has more under it than the budget said it should.`,
    when: p => p.age >= 5 && (p.children?.length > 0 || p.age <= 17) && chance(10),
    choices: [
      { label: "Be present", run: () => {
        if (state.player.children?.length > 0) {
          state.player.children.forEach((c, i) => {
            if (typeof c === "object") c.bond = (c.bond || 60) + 10;
          });
        }
        applyEffects(`You put the phone down. Watched the faces. Filmed nothing. Remembered everything.`, { happiness: 16, karma: 8 }, "good");
      } },
      { label: "Document everything", run: () => applyEffects(`You filmed the whole thing. The Reel hit 8K likes. Still trying to remember what was in it.`, { fame: 4, followers: randomInt(200, 3000), happiness: 4 }, "good") }
    ]
  },

  {
    title: "Summer Block Party",
    text: () => `Summer in ${originOf(state.player.location).short}. The block has tables out, smoke from the grill, somebody's speaker pointed at the street, kids running through the hydrant.`,
    when: p => p.age >= 8 && chance(11),
    choices: [
      { label: "Stay all day", run: () => {
        changeLocalRep(randomInt(3, 8));
        applyEffects(`You stayed until the streetlights came on. Met every neighbor's cousin. The block knows your name now.`, { happiness: 14, karma: 6, looks: 2 }, "good");
      } },
      { label: "Pull up briefly", run: () => applyEffects(`You showed face for an hour. Plate to-go. Polite move.`, { happiness: 6, karma: 3, money: -10 }) }
    ]
  },

  {
    title: "Spring Break Pressure",
    text: () => `Group chat is exploding. Spring Break is two weeks out. They're booking ${pick(["Cabo", "Miami", "Cancún", "Tulum", "Lake Havasu"])}. ${state.player.name} has to commit by Friday.`,
    when: p => p.age >= 18 && p.age <= 24 && p.educationRank >= 3 && chance(9),
    choices: [
      { label: "Book it", run: bookTrip },
      { label: "Stay home and study", run: () => applyEffects(`You stayed. Got ahead on the semester. Watched them post from Cabo. Mixed feelings.`, { discipline: 12, smarts: 6, happiness: -6 }) },
      { label: "Work the week instead", run: () => {
        const earned = randomInt(400, 1400);
        applyEffects(`You picked up shifts. ${money(earned)} cleared. Watched the trip on IG. Bank account healthier.`, { money: earned, discipline: 8, happiness: -2 }, "good");
      } }
    ]
  },

  {
    title: "Carnival in Rio",
    text: () => `It's Carnival week. Even from ${originOf(state.player.location).short}, your phone is full of Rio Carnival content. A friend texted: "We have an extra spot, fly in tomorrow."`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.money >= 2500 && p.location !== "Rio de Janeiro, Brazil" && chance(4),
    choices: [
      { label: "Book the flight", run: () => goOnTrip("Rio de Janeiro, Brazil", travelDestinations["Rio de Janeiro, Brazil"]) },
      { label: "Watch it from home", run: () => applyEffects(`You watched the parade on a livestream at 2AM. Took notes. Maybe next year.`, { happiness: 4, smarts: 2 }) }
    ]
  },

  {
    title: "Election Year",
    text: () => `${currentYear(state.player)} is an election year. Everybody is mad at each other online. ${state.player.name} got tagged in three political posts this week.`,
    when: p => p.age >= 18 && currentYear(p) % 4 === 0 && currentYear(p) >= 1996 && chance(12),
    choices: [
      { label: "Get loud online", run: () => {
        const swing = chance(40);
        if (swing) {
          applyEffects(`Your take went viral. You picked up followers and a few enemies.`, { fame: 8, followers: randomInt(800, 8000), happiness: 4, karma: -2, politicalCapital: 4 }, "good");
        } else {
          applyEffects(`Your take got dragged. You logged off for a week.`, { fame: 2, happiness: -8, smarts: 4 }, "bad");
        }
      } },
      { label: "Volunteer for a campaign", run: () => applyEffects(`You knocked doors. Met real people. Your name is in a database somewhere now.`, { politicalCapital: 8, karma: 4, happiness: 4 }, "good") },
      { label: "Stay out of it", run: () => applyEffects(`You posted nothing. Got accused of everything. Voted privately.`, { discipline: 6, karma: 2 }) }
    ]
  },

  {
    title: "Prom Night",
    text: () => `Prom is next Saturday. The dress / suit is in the closet. The group is taking limos. ${state.player.name} is supposed to ask somebody by Wednesday.`,
    when: p => p.age >= 16 && p.age <= 18 && p.educationRank >= 2 && chance(15),
    choices: [
      { label: "Ask the person you actually like", run: () => {
        if (chance(45 + Math.floor(state.player.stats.looks / 5))) {
          const name = pick(peopleNames);
          state.player.relationships.push({ id: `partner-${Date.now()}`, name, role: "Prom date → partner", bond: randomInt(56, 78), type: "partner" });
          addCanonEvent(`Took ${name} to prom. They said yes. Photos hold up.`, "good");
          applyEffects(`${name} said yes. The night was everything. The afterparty was the real story.`, { happiness: 18, looks: 4, fame: 2 }, "good");
        } else {
          applyEffects(`They said no. You went solo, danced anyway, drank from a flask in the bathroom.`, { happiness: -4, discipline: 4, looks: 1 });
        }
      } },
      { label: "Go with the squad", run: () => applyEffects(`You went with your boys/girls. Best photos. No drama.`, { happiness: 12, karma: 4 }, "good") },
      { label: "Skip prom", run: () => applyEffects(`You skipped it. Worked or stayed in. Saw photos Sunday. No regret.`, { discipline: 6, happiness: -2 }) }
    ]
  },

  {
    title: "Y2K Panic",
    text: () => `It's December ${currentYear(state.player)}. Everybody is convinced the world's computers are about to crash at midnight. Your dad bought canned beans.`,
    when: p => p.age >= 10 && currentYear(p) === 1999 && chance(50),
    choices: [
      { label: "Party like nothing's wrong", run: () => applyEffects(`Midnight came. Nothing happened. The beans are still in the basement to this day.`, { happiness: 12, smarts: 3 }, "good") },
      { label: "Help dad stockpile", run: () => applyEffects(`You hauled cases of water. Felt useful. Your dad was your hero for a week.`, { discipline: 6, karma: 4 }) }
    ]
  },

  // ============================================================
  // CELEBRITY REGISTRY — fictional but recognizable archetypes
  // ============================================================

  {
    title: "Rapper Slid In Your DMs",
    text: () => `${pick(["A platinum-selling rapper from Atlanta", "A drill artist from Chicago", "A rapper Drake co-signed", "A trap artist who just sold out arenas", "An LA rapper everyone's talking about"])} just DM'd ${state.player.handle || state.player.name}. They like your vibe. They want to "link."`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.fame >= 15 && p.socialPage && chance(10),
    choices: [
      { label: "Pull up to the studio", run: () => {
        if (chance(40)) {
          addCanonEvent(`Linked with a Drake-tier rapper in the studio. The bar got higher.`, "good");
          applyEffects(`You sat in on a session. They put you on a song. Your face is in someone's IG story with 12M views.`, { fame: 24, followers: randomInt(40000, 350000), money: randomInt(2000, 25000), happiness: 18 }, "good");
        } else {
          applyEffects(`They forgot you came. You sat in the lobby for 90 minutes. Walked out humbled.`, { fame: 2, happiness: -4, smarts: 5 });
        }
      } },
      { label: "Play it cool, wait for them to confirm", run: () => applyEffects(`You replied "say less, send the addy." They never sent it. Fame moves fast.`, { discipline: 3, smarts: 4 }) }
    ]
  },

  {
    title: "NBA Player's Cousin",
    text: () => `${pick(["LeBron's", "Steph's", "Giannis's", "an All-Star's", "a top-5 pick's"])} cousin showed up at the same bottle service. They're holding court. ${state.player.name} got eye contact.`,
    when: p => p.age >= 19 && isAdultUnlocked() && (p.fame >= 8 || p.stats.looks >= 65) && chance(10),
    choices: [
      { label: "Slide over", run: () => {
        const hit = chance(40);
        if (hit) {
          applyEffects(`You introduced yourself. They had questions. By 4AM you were in a group chat with three pros.`, { fame: 12, followers: randomInt(2000, 22000), happiness: 14, karma: -2 }, "good");
        } else {
          applyEffects(`They were polite, briefly. Their security gently moved you back.`, { happiness: 2, smarts: 4 });
        }
      } },
      { label: "Stay at your table", run: () => applyEffects(`You played it cool. Took notes. The night still had its moments.`, { discipline: 4, smarts: 4, happiness: 4 }) }
    ]
  },

  {
    title: "K-Pop Idol Visits Your City",
    text: () => `${pick(["A BTS-tier", "A BLACKPINK-tier", "A NewJeans-tier", "A SEVENTEEN-tier"])} idol is in town for a show. Their team is looking for local creators to feature. Your account got flagged.`,
    when: p => p.age >= 16 && p.socialPage && p.followers >= 3000 && chance(3),
    choices: [
      { label: "Send your reel", run: () => {
        if (chance(30 + Math.floor(state.player.stats.looks / 6))) {
          addCanonEvent(`Featured in a K-pop idol's content. Translation: every Twitter army knows your name now.`, "good");
          applyEffects(`They posted you. K-pop Twitter is in your mentions. Followers exploded.`, { fame: 18, followers: randomInt(80000, 600000), happiness: 14 }, "good");
        } else {
          applyEffects(`The team passed. You found out by checking their post and not seeing your face.`, { happiness: -4, smarts: 3 });
        }
      } },
      { label: "Pass on it", run: () => applyEffects(`You said you weren't free. Their team filmed somebody else. You'll wonder forever.`, { discipline: 5, happiness: -3 }) }
    ]
  },

  {
    title: "Reality TV Star Cameo",
    text: () => `${pick(["A Kardashian-adjacent", "a Real Housewives", "a Love Island", "a Selling Sunset"])} reality star posted a photo from a place you can recognize. You're in the background. The internet found you.`,
    when: p => p.age >= 17 && p.location.includes("Los Angeles") && chance(8),
    choices: [
      { label: "Comment on the post", run: () => {
        if (chance(25)) {
          applyEffects(`They replied. The comment got 12K likes. You're "the friend" for two weeks.`, { fame: 8, followers: randomInt(2000, 28000), happiness: 8 }, "good");
        } else {
          applyEffects(`No reply. Comment buried. But screenshots traveled.`, { fame: 3, happiness: 1 });
        }
      } },
      { label: "Ignore it", run: () => applyEffects(`You stayed out of the comments. The right move probably.`, { discipline: 4, karma: 2 }) }
    ]
  },

  {
    title: "A-list Actor in Your Spot",
    text: () => `${pick(["A Marvel actor", "an Oscar nominee", "a Netflix lead", "Timothée Chalamet-type"])} walked into the cafe ${state.player.name} works at / hangs out at. They're alone. They look tired.`,
    when: p => p.age >= 16 && (p.location.includes("Los Angeles") || p.location === "New York City, NY") && chance(7),
    choices: [
      { label: "Treat them normal", run: () => applyEffects(`You did NOT freak out. They appreciated it. Tipped 100%. Maybe a story for life. Maybe nothing.`, { happiness: 8, money: randomInt(80, 400), karma: 4 }, "good") },
      { label: "Ask for a selfie", run: () => {
        if (chance(35)) {
          applyEffects(`They said yes. The photo got 40K likes on your story. You're "that guy/girl."`, { fame: 6, followers: randomInt(1000, 12000), happiness: 8 }, "good");
        } else {
          applyEffects(`They politely declined. Their assistant gave you a glare. Welcome to Hollywood.`, { happiness: -3, smarts: 3 });
        }
      } }
    ]
  },

  {
    title: "Influencer Wants a Collab",
    text: () => `${pick(["A 2M-follower influencer", "an OnlyFans top 0.1%", "a TikTok dance creator", "a fitness influencer"])} DM'd ${state.player.handle || state.player.name}. They want a collab.`,
    when: p => p.age >= 18 && isAdultUnlocked() && p.socialPage && p.followers >= 5000 && chance(5),
    choices: [
      { label: "Lock in a shoot", run: () => {
        const fol = randomInt(15000, 150000);
        addCanonEvent(`Collabed with a major influencer. Followers doubled.`, "good");
        applyEffects(`The video posted Tuesday. By Friday, ${fol.toLocaleString()} new followers. The deal works.`, { followers: fol, fame: 12, money: randomInt(500, 4500), happiness: 10 }, "good");
      } },
      { label: "Politely pass", run: () => applyEffects(`You said the brand fit wasn't right. They respected it. Your account stayed your account.`, { discipline: 6, karma: 4 }, "good") }
    ]
  },

  {
    title: "Met a Tech Billionaire",
    text: () => `${pick(["A Zuck-type", "an Elon-type", "a younger Bezos-type"])} held a small dinner ${state.player.name} got invited to as a "rising voice." Twelve people at the table. The wine costs a year of rent.`,
    when: p => p.age >= 22 && (p.stats.smarts >= 70 || p.fame >= 25 || p.company) && chance(5),
    choices: [
      { label: "Pitch yourself directly", run: () => {
        if (chance(35 + Math.floor(state.player.stats.smarts / 6))) {
          addCanonEvent(`Got a tech billionaire's attention at a private dinner. They asked for a follow-up.`, "good");
          applyEffects(`They wrote down your name. Their assistant emailed you Tuesday. Doors opened.`, { fame: 14, money: randomInt(10000, 80000), happiness: 14, discipline: 6 }, "good");
        } else {
          applyEffects(`You pitched. They half-listened. The seat next to them stayed open.`, { smarts: 6, happiness: -3 });
        }
      } },
      { label: "Listen and learn", run: () => applyEffects(`You took notes the whole night. Asked one sharp question. They remembered your face.`, { smarts: 10, fame: 3, happiness: 6 }, "good") }
    ]
  },

  {
    title: "Got Featured by a Magazine",
    text: () => `${pick(["Forbes 30 Under 30", "Vogue", "GQ", "Complex", "Hypebeast"])} reached out. They want ${state.player.name} for a feature. Three-hour photo shoot included.`,
    when: p => p.age >= 21 && (p.fame >= 35 || p.company || p.followers >= 50000) && chance(7),
    choices: [
      { label: "Do the feature", run: () => {
        const fol = randomInt(5000, 80000);
        addCanonEvent(`Got featured in a major magazine.`, "good");
        applyEffects(`Print ran in 14 countries. Your mom bought 8 copies. Career changed.`, { fame: 16, followers: fol, money: randomInt(2000, 18000), happiness: 14, looks: 3 }, "good");
      } },
      { label: "Decline — control the narrative", run: () => applyEffects(`You said no thanks. The magazine ran a piece about you anyway, less flattering. Trade-offs.`, { discipline: 6, fame: 2, happiness: -2 }) }
    ]
  },

  // ============================================================
  // CLASS-EXCLUSIVE EVENT PACKS — each spawn class gets life
  // moments that ONLY hit if you spawned that way
  // ============================================================

  // ---- NEPO (Silver Spoon) ----
  {
    title: "Cotillion / Debutante Ball",
    text: () => `Your parents enrolled ${state.player.name} in cotillion. White gloves, waltz lessons, name engraved on a list everyone in the city already knows.`,
    when: p => p.age === 16 && p.spawnClass === "nepo" && chance(80),
    choices: [
      { label: "Walk the floor properly", run: () => applyEffects(`You did the bow, the curtsey, the waltz. Three families now consider you marriage material.`, { looks: 6, fame: 6, happiness: 4, discipline: 4 }, "good") },
      { label: "Refuse the whole thing", run: () => applyEffects(`You bailed. Your mother didn't speak to you for three weeks. Aunt called it 'a phase.'`, { happiness: 4, karma: 4, looks: -1 }) }
    ]
  },
  {
    title: "Aspen / St. Moritz Family Trip",
    text: () => `Annual family ski trip. ${pick(["Aspen", "St. Moritz", "Vail", "Whistler"])}. Same chalet every year. You barely have to pack.`,
    when: p => p.age >= 12 && p.age <= 30 && p.spawnClass === "nepo" && chance(20),
    choices: [
      { label: "Hit the slopes black diamond", run: () => applyEffects(`Photos from the lift hit your feed. ${pick(["A Hadid", "an Olsen", "a Roy heir"])} commented "snow looks good on you."`, { looks: 4, happiness: 10, followers: randomInt(200, 4000), fame: 4 }, "good") },
      { label: "Stay at the chalet, snort coke with cousins", run: () => applyEffects(`Mountain stayed quiet. Your cousins are nightmare people. You learned things about your family you can't unlearn.`, { happiness: 6, health: -6, discipline: -6, smarts: 5, risksTaken: 1 }) }
    ]
  },
  {
    title: "Trust Fund Activates",
    text: () => `${state.player.name} just turned 21. The trust fund activates today. Lawyer's office, paperwork, a wire transfer that doesn't feel real.`,
    when: p => p.age === 21 && p.spawnClass === "nepo" && chance(85),
    choices: [
      { label: "Take the full payout", run: () => {
        const amount = randomInt(180000, 1200000);
        addCanonEvent(`Trust fund activated. ${money(amount)} hit the account.`, "good");
        applyEffects(`${money(amount)} cleared. You're somebody now. Already different people texting you.`, { money: amount, happiness: 12, discipline: -4 }, "good");
      } },
      { label: "Leave it invested", run: () => applyEffects(`You left it in. Quarterly checks of ${money(randomInt(8000, 35000))} start hitting. Patient money.`, { money: randomInt(8000, 35000), smarts: 6, discipline: 8 }, "good") }
    ]
  },
  {
    title: "Parents' Divorce Settlement",
    text: () => `Your parents are splitting. Lawyers are arguing about who keeps which house. ${state.player.name} is technically a beneficiary in three trusts that just got contested.`,
    when: p => p.age >= 14 && p.age <= 28 && p.spawnClass === "nepo" && chance(8),
    choices: [
      { label: "Side with mom", run: () => applyEffects(`You picked a side. Dad cut the allowance. Mom doubled hers. Your relationships shifted permanently.`, { money: randomInt(20000, 120000), happiness: -10, karma: -2 }) },
      { label: "Side with dad", run: () => applyEffects(`You picked a side. Mom called you a traitor. Dad bought you a new car.`, { money: randomInt(15000, 90000), happiness: -8, karma: -2 }) },
      { label: "Stay neutral", run: () => applyEffects(`You refused to pick. Both stopped speaking to you for six months. Settlement still came through.`, { money: randomInt(8000, 50000), karma: 8, discipline: 6, happiness: -6 }, "good") }
    ]
  },
  {
    title: "Hamptons Summer",
    text: () => `Summer in the Hamptons. ${pick(["Sag Harbor", "East Hampton", "Bridgehampton", "Montauk"])}. The family compound is full. Tennis, boats, somebody's catered clambake. You're 22.`,
    when: p => p.age >= 18 && p.age <= 35 && p.spawnClass === "nepo" && chance(12),
    choices: [
      { label: "Network at the clambake", run: () => applyEffects(`Three hedge fund kids took your number. A board seat got mentioned. The summer paid for itself.`, { fame: 6, money: randomInt(2000, 18000), happiness: 10, smarts: 4 }, "good") },
      { label: "Hook up in the pool house", run: () => applyEffects(`Old money + bad decisions. Their parents heard. Yours heard louder.`, { happiness: 12, looks: 2, karma: -4, discipline: -3 }) }
    ]
  },
  {
    title: "Board Seat Offer (Family Friend)",
    text: () => `${state.player.name}'s godfather called. There's a board seat opening at his firm. "It's mostly ceremonial." Pays well. Comes with a Tesla.`,
    when: p => p.age >= 30 && p.spawnClass === "nepo" && chance(20),
    choices: [
      { label: "Take it", run: () => {
        const yearly = randomInt(80000, 380000);
        addCanonEvent(`Took a board seat through family connections.`, "good");
        applyEffects(`Quarterly meetings, ${money(yearly)}/year. You're officially that guy/girl.`, { money: yearly, fame: 8, happiness: 8, karma: -4 }, "good");
      } },
      { label: "Pass — earn your own", run: () => applyEffects(`You said no thank you. Godfather called you a fool. Your spine is intact.`, { karma: 12, discipline: 10, smarts: 6 }, "good") }
    ]
  },

  // ---- COMFORTABLE ----
  {
    title: "Family Vacation to Disney",
    text: () => `${state.player.name}'s family booked Disney World. Two days at Magic Kingdom, one at Epcot. Dad bought the photo package. Mom packed sandwiches.`,
    when: p => p.age >= 6 && p.age <= 12 && p.spawnClass === "comfortable" && chance(30),
    choices: [
      { label: "Live it up", run: () => applyEffects(`You met Mickey, ate three Dole Whips, threw up on Space Mountain. Best week of your life so far.`, { happiness: 16, health: -2 }, "good") },
      { label: "Stay annoyed teen-style", run: () => applyEffects(`You wore headphones the whole trip. Family photos look weird. Mom still has them in the album.`, { happiness: -2, smarts: 3, discipline: 4 }) }
    ]
  },
  {
    title: "Mom's Modest IRA Inheritance",
    text: () => `Aunt passed. Mom got the IRA. She wants to give ${state.player.name} a chunk to "help you get started."`,
    when: p => p.age >= 22 && p.age <= 40 && p.spawnClass === "comfortable" && chance(15),
    choices: [
      { label: "Take it gratefully", run: () => {
        const amount = randomInt(8000, 45000);
        applyEffects(`${money(amount)} hit. You bought what you needed and saved the rest.`, { money: amount, happiness: 8, discipline: 4 }, "good");
      } },
      { label: "Refuse — let her keep it", run: () => applyEffects(`You said no. Mom cried. She felt useful. You felt grown.`, { karma: 12, happiness: 4 }, "good") }
    ]
  },
  {
    title: "Dad's Garage Project",
    text: () => `Dad's been working on a ${pick(["Mustang", "VW bus", "Bronco", "Camaro"])} in the garage for three years. He wants ${state.player.name} to help him finish it.`,
    when: p => p.age >= 12 && p.age <= 30 && p.spawnClass === "comfortable" && chance(15),
    choices: [
      { label: "Show up every weekend", run: () => {
        const dad = state.player.relationships.find(r => r.role?.toLowerCase().includes("father") || r.id === "guardian2");
        if (dad) changeBond(dad, 20);
        applyEffects(`Twelve weekends in. You finished it together. Dad cried when it started. You have a dad story for life.`, { happiness: 16, karma: 8, smarts: 4 }, "good");
      } },
      { label: "Make excuses", run: () => {
        const dad = state.player.relationships.find(r => r.role?.toLowerCase().includes("father") || r.id === "guardian2");
        if (dad) changeBond(dad, -10);
        applyEffects(`He finished it alone. He never asks you for anything else.`, { happiness: -8, karma: -4, discipline: 2 }, "bad");
      } }
    ]
  },
  {
    title: "First Real Apartment with Mom Helping",
    text: () => `${state.player.name}'s moving out. Mom is at IKEA at 9AM. She brought labels. She brought lunch.`,
    when: p => p.age >= 18 && p.age <= 25 && p.spawnClass === "comfortable" && chance(20),
    choices: [
      { label: "Let her help", run: () => applyEffects(`She organized your kitchen. Cried in the parking lot. It was a moment.`, { money: -800, happiness: 12, karma: 8 }, "good") },
      { label: "Insist on doing it alone", run: () => applyEffects(`You set up the apartment yourself. Took three days. The bed is still on the floor.`, { money: -400, discipline: 8, happiness: -2 }) }
    ]
  },
  {
    title: "Suburban Driveway Talk",
    text: () => `Dad cornered ${state.player.name} on the driveway. "You good? Seriously." Suburban silence around it.`,
    when: p => p.age >= 16 && p.age <= 30 && p.spawnClass === "comfortable" && chance(10),
    choices: [
      { label: "Tell him the truth", run: () => applyEffects(`You opened up for the first time in years. Neither of you knew what to do with it. It mattered.`, { happiness: 14, karma: 8, smarts: 4 }, "good") },
      { label: "Say 'I'm fine'", run: () => applyEffects(`Conversation ended. Both of you went back inside. Mom asked what you talked about. You didn't know.`, { happiness: -4, discipline: 2 }) }
    ]
  },

  // ---- WORKING CLASS ----
  {
    title: "First Real Paycheck",
    text: () => `${state.player.name}'s first paycheck cleared. ${money(randomInt(200, 800))}. You're 15. You held it up to the light.`,
    when: p => p.age >= 15 && p.age <= 18 && p.spawnClass === "working" && chance(30),
    choices: [
      { label: "Give half to mom", run: () => {
        const mom = state.player.relationships.find(r => r.role?.toLowerCase().includes("mother") || r.id === "guardian");
        if (mom) changeBond(mom, 14);
        applyEffects(`You handed her ${money(randomInt(80, 350))}. She tried to give it back. You insisted. She put it on the fridge.`, { happiness: 12, karma: 10, money: -randomInt(80, 350) }, "good");
      } },
      { label: "Spend it all on yourself", run: () => applyEffects(`You bought ${pick(["Js", "a chain", "a PS5", "a phone"])}. Felt real. Mom said nothing.`, { happiness: 8, looks: 3, money: -randomInt(180, 500), karma: -2 }) }
    ]
  },
  {
    title: "Mom Working Double Shifts",
    text: () => `Mom hasn't been home before midnight in three weeks. She's working two jobs. ${state.player.name} can see it in her face.`,
    when: p => p.age >= 10 && p.age <= 18 && p.spawnClass === "working" && chance(18),
    choices: [
      { label: "Make dinner every night", run: () => {
        const mom = state.player.relationships.find(r => r.role?.toLowerCase().includes("mother") || r.id === "guardian");
        if (mom) changeBond(mom, 18);
        applyEffects(`You ran the kitchen for a month. She came home to plates. She cried twice.`, { happiness: 8, karma: 12, discipline: 8 }, "good");
      } },
      { label: "Get a part-time job to help", run: () => applyEffects(`You picked up shifts at ${pick(["McDonald's", "the local pizza spot", "the corner store"])}. Brought home ${money(randomInt(150, 600))} a week.`, { money: randomInt(600, 2400), discipline: 10, happiness: -3 }, "good") }
    ]
  },
  {
    title: "Trade School Pitch",
    text: () => `Uncle ${pick(["Frank", "Mike", "Carlos", "Tito"])} cornered ${state.player.name} at the cookout. "Forget college. You learn a trade, you own your time."`,
    when: p => p.age >= 16 && p.age <= 20 && p.spawnClass === "working" && chance(25),
    choices: [
      { label: "Take it seriously", run: () => {
        state.player.certifications.push("trade");
        addCanonEvent(`Did trade school instead of college. Set a different ladder.`, "good");
        applyEffects(`You signed up. Two years later you can fix things people can't.`, { discipline: 12, smarts: 4, money: randomInt(1200, 4800), happiness: 6 }, "good");
      } },
      { label: "Push for college anyway", run: () => applyEffects(`Uncle was hurt. You filled out the FAFSA. Different path.`, { smarts: 6, discipline: 6, karma: -2 }) }
    ]
  },
  {
    title: "Union Meeting Pulls You In",
    text: () => `Work called a union meeting. Steward asked ${state.player.name} to speak — turns out you're respected.`,
    when: p => p.age >= 22 && p.age <= 50 && p.spawnClass === "working" && p.jobId !== "none" && chance(15),
    choices: [
      { label: "Stand up and speak", run: () => applyEffects(`The room listened. Floor came to a vote. You're now somebody's "guy." Union representative offered to mentor you.`, { politicalCapital: 8, karma: 8, happiness: 8, discipline: 6 }, "good") },
      { label: "Stay quiet", run: () => applyEffects(`You let it ride. Same wages, same conditions. Felt the weight of it.`, { discipline: 3, happiness: -2 }) }
    ]
  },
  {
    title: "Bills Hit Harder Than Expected",
    text: () => `Rent, electric, phone, groceries, car. ${state.player.name} sat at the kitchen table doing math. The numbers don't add up.`,
    when: p => p.age >= 19 && p.age <= 30 && p.spawnClass === "working" && p.money < 1000 && chance(20),
    choices: [
      { label: "Pick up a second job", run: () => applyEffects(`Two jobs. You sleep four hours. The numbers work. Barely.`, { money: randomInt(800, 2400), discipline: 8, health: -6, happiness: -4 }, "good") },
      { label: "Borrow from family", run: () => {
        const fam = state.player.relationships.find(r => r.type === "family");
        if (fam) changeBond(fam, -5);
        applyEffects(`You called for help. ${money(randomInt(200, 800))} hit by morning. The phone call cost you dignity.`, { money: randomInt(200, 800), happiness: -6, karma: -2, debt: randomInt(200, 800) });
      } },
      { label: "Skip rent, hide from landlord", run: () => applyEffects(`You ducked the landlord for three weeks. Eviction notice on Friday.`, { happiness: -12, debt: randomInt(800, 2400), discipline: -4 }, "bad") }
    ]
  },

  // ---- STRUGGLING ----
  {
    title: "SNAP Card Line",
    text: () => `Mom needed help with the SNAP renewal. ${state.player.name} sat in line at the office for four hours holding paperwork.`,
    when: p => p.age >= 10 && p.age <= 16 && p.spawnClass === "struggling" && chance(20),
    choices: [
      { label: "Help her through it", run: () => {
        const mom = state.player.relationships.find(r => r.role?.toLowerCase().includes("mother") || r.id === "guardian");
        if (mom) changeBond(mom, 12);
        applyEffects(`You translated, filled forms, advocated. Mom held your hand on the bus home.`, { karma: 10, smarts: 6, happiness: -2 }, "good");
      } },
      { label: "Sit in the corner on your phone", run: () => applyEffects(`You stayed silent. The clerk was hostile. Mom handled it. You felt the weight without acting on it.`, { smarts: 3, discipline: 1, happiness: -4 }) }
    ]
  },
  {
    title: "Free School Lunch",
    text: () => `Cafeteria switched to a "rainbow card" system so the free-lunch kids weren't singled out. Everyone knows anyway.`,
    when: p => p.age >= 8 && p.age <= 16 && p.spawnClass === "struggling" && chance(20),
    choices: [
      { label: "Skip lunch instead", run: () => applyEffects(`You said you weren't hungry. Your friend slipped you half a sandwich. You'll never forget that.`, { health: -3, karma: 8, discipline: 6 }) },
      { label: "Eat the lunch", run: () => applyEffects(`You ate it. Some kid said something. You didn't react. You ate again the next day. And the day after.`, { discipline: 8, smarts: 4, happiness: -2 }, "good") }
    ]
  },
  {
    title: "Grandma's Check",
    text: () => `Grandma sent ${state.player.name} a card with ${money(randomInt(20, 100))} in it. Handwriting shaky. Note says "for whatever you need, baby."`,
    when: p => p.age >= 12 && p.age <= 25 && p.spawnClass === "struggling" && chance(20),
    choices: [
      { label: "Save it untouched", run: () => applyEffects(`You put it in an envelope in your sock drawer. Saw it every day for a year before you used it.`, { happiness: 6, discipline: 10, karma: 4 }, "good") },
      { label: "Spend it on something necessary", run: () => applyEffects(`Books, food, a phone bill. It went where it needed to. Grandma's check did its job.`, { money: randomInt(20, 100), discipline: 4, happiness: 4 }, "good") },
      { label: "Send it back", run: () => applyEffects(`You mailed it back with a thank-you note. She slid it back inside her next letter.`, { karma: 10, happiness: 6 }, "good") }
    ]
  },
  {
    title: "GED Counselor",
    text: () => `${state.player.name} sat down with a GED counselor. Free program at the community center. She believes you can do it.`,
    when: p => p.age >= 17 && p.age <= 22 && p.spawnClass === "struggling" && p.dropout && chance(50),
    choices: [
      { label: "Commit to it", run: () => {
        state.player.certifications.push("ged");
        addCanonEvent(`Got the GED with a counselor's help.`, "good");
        applyEffects(`Twelve weeks. You passed. She framed the photo with you.`, { smarts: 10, discipline: 14, happiness: 10 }, "good");
      } },
      { label: "Say you'll think about it", run: () => applyEffects(`You took the brochure. It stayed on your dresser for a year. You'll come back to it eventually.`, { discipline: 2 }) }
    ]
  },
  {
    title: "Free Clinic Visit",
    text: () => `Tooth hurts. ${state.player.name} can't afford a regular dentist. The free clinic has a 4-hour wait.`,
    when: p => p.age >= 16 && p.age <= 40 && p.spawnClass === "struggling" && chance(15),
    choices: [
      { label: "Wait it out", run: () => applyEffects(`Four hours in plastic chairs. They fixed it. You met two people you'll never forget waiting in the same room.`, { health: 8, karma: 4, happiness: -2 }) },
      { label: "Ignore the pain", run: () => applyEffects(`You sucked it up. It got worse. Two years later it cost ten times more.`, { health: -6, happiness: -6, money: -randomInt(800, 3500), debt: randomInt(400, 1800) }, "bad") }
    ]
  },

  // ---- SURVIVAL ----
  {
    title: "Foster Placement",
    text: () => `${state.player.name} got placed with a new family. Third home this year. Suitcase still packed.`,
    when: p => p.age >= 5 && p.age <= 17 && p.spawnClass === "survival" && chance(20),
    choices: [
      { label: "Try with this family", run: () => applyEffects(`You let yourself hope a little. They were kind. You stayed two years before the next move.`, { happiness: 8, discipline: 4, karma: 4, smarts: 3 }, "good") },
      { label: "Keep your guard up", run: () => applyEffects(`You stayed sealed shut. Easier to leave. Harder to be known.`, { discipline: 8, smarts: 6, happiness: -6 }) }
    ]
  },
  {
    title: "Aging Out at 18",
    text: () => `${state.player.name} aged out of the foster system. Caseworker handed you a duffel bag and ${money(randomInt(200, 600))}. "Good luck."`,
    when: p => p.age === 18 && p.spawnClass === "survival" && chance(85),
    choices: [
      { label: "Apply to the transitional housing program", run: () => {
        applyEffects(`You got in. Six months of stability. You're going to need every minute of it.`, { money: randomInt(200, 600), discipline: 14, smarts: 8, happiness: 6 }, "good");
      } },
      { label: "Couch surf and figure it out", run: () => applyEffects(`Three couches in two months. You learned the city block by block. Hard year.`, { money: -randomInt(200, 800), happiness: -10, streetRep: 6, discipline: 10, health: -4 }, "bad") }
    ]
  },
  {
    title: "Caseworker Drops By",
    text: () => `Ms. ${pick(["Lopez", "Davidson", "Park", "Williams"])} stopped by unannounced. ${state.player.name}'s caseworker for years.`,
    when: p => p.age >= 8 && p.age <= 19 && p.spawnClass === "survival" && chance(20),
    choices: [
      { label: "Let her in, talk", run: () => {
        const cw = state.player.relationships.find(r => r.role?.toLowerCase().includes("caseworker") || r.role?.toLowerCase().includes("mentor"));
        if (cw) changeBond(cw, 10);
        applyEffects(`She stayed an hour. She asked questions only she asks. You felt seen.`, { happiness: 10, smarts: 4, karma: 4 }, "good");
      } },
      { label: "Pretend you're not home", run: () => applyEffects(`You sat under the window. She knew you were there. She left a note.`, { discipline: 4, happiness: -6, karma: -2 }) }
    ]
  },
  {
    title: "Scholarship for Foster Kids",
    text: () => `${state.player.name} got mailed a scholarship pamphlet — full ride to a state school, only for kids who aged out. Deadline next week.`,
    when: p => p.age >= 17 && p.age <= 22 && p.spawnClass === "survival" && p.dropout !== true && chance(30),
    choices: [
      { label: "Apply hard", run: () => {
        if (chance(55)) {
          state.player.educationRank = Math.max(state.player.educationRank, 3);
          addCanonEvent(`Won a scholarship as a former foster kid. Pulled out of survival mode.`, "good");
          applyEffects(`Acceptance came in April. Full ride. You cried in the bathroom at work.`, { smarts: 12, discipline: 10, happiness: 18, money: randomInt(500, 2000) }, "good");
        } else {
          applyEffects(`Didn't get it. Rejection email at 11PM. Saved it anyway.`, { discipline: 6, smarts: 4, happiness: -8 }, "bad");
        }
      } },
      { label: "Skip it", run: () => applyEffects(`You didn't open the envelope. It sat there. You worked. The year passed.`, { discipline: 2, happiness: -4 }) }
    ]
  },
  {
    title: "Found Family",
    text: () => `${state.player.name} found people. Not blood. Not foster. People who just decided to show up. They're cooking for you.`,
    when: p => p.age >= 16 && p.age <= 35 && p.spawnClass === "survival" && chance(15),
    choices: [
      { label: "Let them in", run: () => {
        const name = pick(peopleNames);
        state.player.relationships.push({ id: `chosen-${Date.now()}`, name, role: "Chosen family", bond: randomInt(70, 92), type: "family" });
        addCanonEvent(`Found chosen family with ${name}. The blood part stopped mattering.`, "good");
        applyEffects(`${name} became home. You're not alone anymore in the way you used to be.`, { happiness: 22, karma: 12, discipline: 4 }, "good");
      } },
      { label: "Keep them at arm's length", run: () => applyEffects(`You stayed cautious. They stayed in your life anyway. Slow trust takes years.`, { discipline: 6, happiness: 4, karma: 4 }) }
    ]
  },

  // ============================================================
  // CITY DEPTH PASS — 3-5 more scenes per major city
  // ============================================================

  // ---- TOKYO ----
  {
    title: "Tokyo Karaoke Box",
    text: () => `${state.player.name} and four coworkers/friends crammed into a karaoke box in Shibuya. Whiskey highball pitcher. Mic doesn't stop moving.`,
    when: p => p.age >= 16 && (p.location === "Tokyo, Japan" || p.currentTrip === "Tokyo, Japan") && chance(15),
    choices: [
      { label: "Sing the X Japan ballad", run: () => applyEffects(`You sang "Endless Rain" while three Japanese salarymen filmed you. The video is on someone's IG to this day.`, { happiness: 14, looks: 2, fame: 3, money: -randomInt(40, 180) }, "good") },
      { label: "Pass the mic", run: () => applyEffects(`You sang one verse, passed it. The group respected the move. Saved face.`, { happiness: 8, smarts: 4 }) }
    ]
  },
  {
    title: "Tsukiji Fish Market 5AM",
    text: () => `Friend dragged ${state.player.name} to Tsukiji at 5AM. Tuna auction. Sushi breakfast. Salt and diesel air.`,
    when: p => p.age >= 14 && (p.location === "Tokyo, Japan" || p.currentTrip === "Tokyo, Japan") && chance(10),
    choices: [
      { label: "Stay for the freshest sushi of your life", run: () => applyEffects(`You ate otoro that ruined every other meal forever. Spent ${money(randomInt(40, 180))}. Worth every yen.`, { money: -randomInt(40, 180), happiness: 12, health: 4, smarts: 4 }, "good") },
      { label: "Skip to a Lawson sandwich", run: () => applyEffects(`You bought an egg sando at the convenience store. Surprisingly elite.`, { money: -8, happiness: 5 }) }
    ]
  },
  {
    title: "Salaryman Drinking Night",
    text: () => `Your boss insisted on nomikai — after-work drinking with the team. The hierarchy is sharper when everyone's drunk.`,
    when: p => p.age >= 22 && (p.location === "Tokyo, Japan" || p.currentTrip === "Tokyo, Japan") && p.jobId !== "none" && chance(12),
    choices: [
      { label: "Drink, pour, work the room", run: () => applyEffects(`You poured for everyone correctly. Boss nodded. Promotion conversation got mentioned twice.`, { money: -randomInt(40, 220), happiness: 6, discipline: 6, fame: 4 }, "good") },
      { label: "Excuse yourself early", run: () => applyEffects(`You said you had an appointment. Boss noticed. The team noticed louder.`, { discipline: 4, karma: 2, happiness: -3 }) }
    ]
  },
  {
    title: "Anime Convention Cameo",
    text: () => `Comiket weekend. ${state.player.name} got swept along by a friend. The line is six blocks. The cosplayers are professional grade.`,
    when: p => p.age >= 14 && (p.location === "Tokyo, Japan" || p.currentTrip === "Tokyo, Japan") && chance(8),
    choices: [
      { label: "Go full cosplay", run: () => applyEffects(`You committed. Photo got shared in three subreddits. New niche followers.`, { followers: randomInt(200, 4500), fame: 4, looks: 2, happiness: 10, money: -randomInt(80, 380) }, "good") },
      { label: "Just buy doujinshi", run: () => applyEffects(`You walked the aisles, bought weird art. Slept hard that night.`, { money: -randomInt(40, 200), smarts: 3, happiness: 4 }) }
    ]
  },

  // ---- LA / HOLLYWOOD ----
  {
    title: "Erewhon Smoothie Run",
    text: () => `${state.player.name} pulled up to Erewhon for the ${pick(["$22 Hailey Bieber", "$18 Bella Hadid", "$25 Kendall"])} smoothie. The line out front is half models, half tourists pretending to be models.`,
    when: p => p.age >= 16 && (p.location.includes("Los Angeles") || p.location === "Hollywood, Los Angeles" || p.currentTrip?.includes("Los Angeles")) && chance(10),
    choices: [
      { label: "Buy it, post it", run: () => applyEffects(`You drank it. You photographed it. The Reel did 8K views. Worth the $22.`, { money: -22, fame: 3, followers: randomInt(80, 1200), happiness: 6 }, "good") },
      { label: "Buy bananas and leave", run: () => applyEffects(`You spent $4 on bananas and left feeling smug. Smug is its own currency in LA.`, { money: -4, discipline: 6, happiness: 4 }) }
    ]
  },
  {
    title: "Coachella Weekend",
    text: () => `Coachella weekend. ${state.player.name} got passes (somehow). The desert dust is in your lungs and the lineup is your Spotify Wrapped.`,
    when: p => p.age >= 18 && (p.location.includes("Los Angeles") || p.location === "Hollywood, Los Angeles") && p.money >= 600 && chance(8),
    choices: [
      { label: "Camping, full weekend", run: () => {
        const cost = randomInt(600, 2400);
        applyEffects(`You camped. You melted. The Beyoncé / Frank Ocean / whoever-headlines moment changed something in you. Photos for life.`, { money: -cost, happiness: 18, fame: 6, followers: randomInt(400, 6000), health: -4 }, "good");
      } },
      { label: "Drive in for Saturday only", run: () => {
        const cost = randomInt(200, 900);
        applyEffects(`You did the one-day trip. Saw two sets. Got home before midnight. Smart Coachella.`, { money: -cost, happiness: 10, fame: 2 }, "good");
      } }
    ]
  },
  {
    title: "Valet at the Hotel Bel-Air",
    text: () => `${state.player.name} got a valet shift at a real hotel. The tips are good. The cars are insane. The owners are weirder.`,
    when: p => p.age >= 17 && p.age <= 24 && (p.location.includes("Los Angeles") || p.location === "Hollywood, Los Angeles") && p.money < 4000 && chance(15),
    choices: [
      { label: "Work the shift right", run: () => {
        const tips = randomInt(180, 800);
        applyEffects(`Made ${money(tips)} in tips. ${pick(["A producer", "A Saudi prince", "A bachelorette party"])} tipped you $200 for nothing.`, { money: tips, discipline: 6, smarts: 4, looks: 1 }, "good");
      } },
      { label: "Take the car for a joyride", run: () => {
        if (chance(40)) {
          applyEffects(`You drove a McLaren for 20 minutes through Beverly Hills. Got back before anyone noticed. Story for life.`, { happiness: 16, looks: 3, fame: 2 }, "good");
        } else {
          applyEffects(`Boss saw you on the security cam. Fired. Cops considered involved. Mistake.`, { money: -randomInt(500, 2000), record: 1, happiness: -10, karma: -4 }, "bad");
        }
      } }
    ]
  },

  // ---- NYC ----
  {
    title: "Subway Delay Drama",
    text: () => `${state.player.name} is stuck on a stalled F train under the East River. AC is off. Phone is dying. Three passengers are arguing.`,
    when: p => p.age >= 14 && (p.location.includes("New York") || p.location === "Brooklyn, NY" || p.location === "The Bronx, NY" || p.currentTrip?.includes("New York")) && chance(15),
    choices: [
      { label: "Mediate the argument", run: () => applyEffects(`You de-escalated it. The car gave you a quiet round of nods. Conductor announced "10 more minutes" and meant it.`, { karma: 6, smarts: 4, happiness: 4 }, "good") },
      { label: "Mind your business", run: () => applyEffects(`You put your AirPods back in. Two of them got off at York. You're still on the train.`, { discipline: 4, happiness: -2 }) }
    ]
  },
  {
    title: "Rooftop Apartment Party",
    text: () => `Somebody you barely know is throwing a rooftop party in ${pick(["Bushwick", "Long Island City", "Williamsburg", "Crown Heights"])}. The view is the whole skyline.`,
    when: p => p.age >= 18 && (p.location.includes("New York") || p.location === "Brooklyn, NY" || p.currentTrip?.includes("New York")) && chance(11),
    choices: [
      { label: "Stay all night", run: () => applyEffects(`You watched the sun come up over Manhattan. Met a writer, a chef, a DJ. New York validated you for one evening.`, { happiness: 14, fame: 4, looks: 2, money: -randomInt(40, 200) }, "good") },
      { label: "Leave at 1AM", run: () => applyEffects(`You took the L home. Slept hard. Felt mature.`, { discipline: 6, happiness: 4 }) }
    ]
  },
  {
    title: "Bodega Cat Night Shift",
    text: () => `2AM run to the corner bodega. Hat low. ${state.player.name} grabs a chopped cheese, a Snapple, talks to the bodega cat. The clerk knows you by face.`,
    when: p => p.age >= 14 && (p.location.includes("New York") || p.location === "Brooklyn, NY" || p.location === "The Bronx, NY") && chance(13),
    choices: [
      { label: "Tip the clerk an extra $5", run: () => {
        changeLocalRep(randomInt(3, 8));
        applyEffects(`You tipped. He fist bumped you. The bodega knows your order now.`, { money: -5, karma: 6, happiness: 4 }, "good");
      } },
      { label: "Just leave", run: () => applyEffects(`You paid, nodded, dipped. Chopped cheese was perfect.`, { money: -8, happiness: 5 }) }
    ]
  },

  // ---- ATLANTA ----
  {
    title: "Lenox Mall Saturday",
    text: () => `${state.player.name} hit Lenox on a Saturday. Half ATL is there. Including ${pick(["a rapper's entourage", "an NFL player", "the girl from your high school who got famous"])} you definitely recognize.`,
    when: p => p.age >= 14 && (p.location === "Atlanta, GA" || p.currentTrip === "Atlanta, GA") && chance(12),
    choices: [
      { label: "Pull up to the photo op", run: () => {
        if (chance(35)) {
          applyEffects(`They posed with you. Story went up. Your DMs filled.`, { fame: 6, followers: randomInt(400, 6000), happiness: 8, looks: 2 }, "good");
        } else {
          applyEffects(`Security blocked you politely. You bought Jordans instead. Even trade.`, { money: -randomInt(100, 280), looks: 3, happiness: 4 });
        }
      } },
      { label: "Shop and bounce", run: () => applyEffects(`You ate at the food court, bought one thing, left before the chaos.`, { money: -randomInt(40, 180), discipline: 4, happiness: 4 }) }
    ]
  },
  {
    title: "Edgewood Strip Friday",
    text: () => `Edgewood on a Friday. Strip clubs, hookah lounges, ${state.player.name} can hear three different sound systems competing.`,
    when: p => p.age >= 18 && isAdultUnlocked() && (p.location === "Atlanta, GA" || p.currentTrip === "Atlanta, GA") && chance(10),
    choices: [
      { label: "Hop spots all night", run: () => applyEffects(`Three lounges, two restaurants, one strip club. ${money(randomInt(140, 800))} gone. Photos legendary.`, { money: -randomInt(140, 800), happiness: 14, fame: 3, looks: 2, health: -2 }, "good") },
      { label: "One quiet spot only", run: () => applyEffects(`You picked one bar, stayed two hours, left. The right move 1 out of 10 times.`, { money: -randomInt(40, 180), discipline: 4, happiness: 6 }) }
    ]
  },

  // ---- CDMX ----
  {
    title: "Roma Norte Cantina",
    text: () => `${state.player.name} ended up at a cantina in Roma Norte. Mezcal, micheladas, somebody's grandma is on the patio at 1AM.`,
    when: p => p.age >= 18 && isAdultUnlocked() && (p.location === "Mexico City, Mexico" || p.currentTrip === "Mexico City, Mexico") && chance(12),
    choices: [
      { label: "Sit at the bar, talk to locals", run: () => applyEffects(`Your Spanish got better in three hours. Three guys taught you the right way to drink mezcal. You felt like CDMX adopted you.`, { happiness: 12, smarts: 6, money: -randomInt(60, 240), looks: 2 }, "good") },
      { label: "Just eat and go", run: () => applyEffects(`Tacos al pastor, two beers, walked home. CDMX at its best.`, { money: -randomInt(20, 80), happiness: 8, health: -1 }, "good") }
    ]
  },
  {
    title: "Polanco Brunch",
    text: () => `Polanco. Brunch place where everyone speaks English and the avocado toast costs more than dinner at the cantina. ${state.player.name} is here because somebody invited you.`,
    when: p => p.age >= 22 && (p.location === "Mexico City, Mexico" || p.currentTrip === "Mexico City, Mexico") && p.money >= 200 && chance(10),
    choices: [
      { label: "Order the works", run: () => applyEffects(`Mimosas, eggs, designer bag table next to you. You're not sure if you fit in. The Instagram looks elite.`, { money: -randomInt(60, 240), fame: 4, looks: 2, followers: randomInt(80, 1200), happiness: 6 }) },
      { label: "Order coffee only", run: () => applyEffects(`You sipped slowly, took the table for 90 minutes, saw who was who. Useful day.`, { money: -8, smarts: 5, discipline: 4 }) }
    ]
  },

  // ============================================================
  // MARRIAGE / DIVORCE ARC EVENTS
  // ============================================================

  {
    title: "Wedding Planning Drama",
    text: () => {
      const spouse = state.player.relationships.find(r => r.type === "spouse" || r.type === "partner");
      return `Wedding planning is happening. ${spouse?.name || "Your partner"}'s mother wants a 200-person guest list. Your mom wants 40. The venue costs are doubling.`;
    },
    when: p => p.married && (p.age - (p.marriedAge || p.age)) <= 1 && chance(85),
    choices: [
      { label: "Big wedding, full production", run: () => {
        const cost = randomInt(18000, 80000);
        addCanonEvent(`Had a big wedding. ${money(cost)} gone.`, "good");
        applyEffects(`The wedding was a movie. 240 people. Mariachi. Open bar. ${money(cost)} smaller now.`, { money: -cost, happiness: 18, fame: 4, looks: 2 }, "good");
      } },
      { label: "Courthouse + small dinner", run: () => {
        const cost = randomInt(800, 4000);
        applyEffects(`You signed papers, ate at a steakhouse with 12 people. Photos held up.`, { money: -cost, happiness: 12, discipline: 8, karma: 4 }, "good");
      } },
      { label: "Elope to Vegas", run: () => {
        const cost = randomInt(400, 2200);
        addCanonEvent(`Eloped in Vegas. Family found out by text.`, "good");
        applyEffects(`Drive-through chapel. Elvis officiated. Mom didn't speak to you for three months.`, { money: -cost, happiness: 14, karma: -4, fame: 2 }, "good");
      } }
    ]
  },

  {
    title: "Honeymoon",
    text: () => `Where are you taking ${state.player.relationships.find(r => r.type === "spouse")?.name || "your spouse"} for the honeymoon?`,
    when: p => p.married && (p.age - (p.marriedAge || p.age)) <= 2 && p.money >= 1500 && chance(70),
    choices: [
      { label: "Bali / Maldives all-inclusive", run: () => {
        const cost = randomInt(4500, 14000);
        if (!p?.trips?.includes("Bali")) state.player.trips.push("Bali, Indonesia");
        applyEffects(`Overwater bungalow. Couples massage. Spent ${money(cost)}. Photos for the rest of your lives.`, { money: -cost, happiness: 22, looks: 3, health: 4 }, "good");
      } },
      { label: "Drive up the coast", run: () => {
        const cost = randomInt(800, 2800);
        applyEffects(`Just you two, ${pick(["Big Sur", "Sintra", "Amalfi"])}, three days. Cheap and right.`, { money: -cost, happiness: 16, discipline: 4, karma: 4 }, "good");
      } },
      { label: "Skip it for now", run: () => applyEffects(`You stayed home. Promised "next year." Next year didn't happen.`, { happiness: -4, karma: -2 }) }
    ]
  },

  {
    title: "5-Year Anniversary",
    text: () => `Five years married. ${state.player.relationships.find(r => r.type === "spouse")?.name || "Your spouse"} has been quiet about it. They're hoping you remember.`,
    when: p => p.married && (p.age - (p.marriedAge || p.age)) >= 4 && (p.age - (p.marriedAge || p.age)) <= 6 && chance(40),
    choices: [
      { label: "Plan something big", run: () => {
        const cost = randomInt(800, 4500);
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, 20);
        applyEffects(`You surprised them with ${pick(["a Paris weekend", "a private chef dinner", "the necklace from your first apartment", "a Tahiti booking"])}. They cried. Five more years locked in.`, { money: -cost, happiness: 18 }, "good");
      } },
      { label: "Card and a dinner", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, 6);
        applyEffects(`Nice dinner, handwritten card, real conversation. The basics, done well.`, { money: -randomInt(80, 280), happiness: 10 }, "good");
      } },
      { label: "Forget it", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, -22);
        applyEffects(`You remembered at 9PM the next day. The damage was already done.`, { happiness: -10, karma: -4 }, "bad");
      } }
    ]
  },

  {
    title: "Seven-Year Itch",
    text: () => `Seven years in. ${state.player.relationships.find(r => r.type === "spouse")?.name || "Your spouse"} feels like a roommate. ${pick(["A coworker", "An old flame", "Someone from the gym", "A stranger at a wedding"])} keeps texting.`,
    when: p => p.married && (p.age - (p.marriedAge || p.age)) >= 6 && (p.age - (p.marriedAge || p.age)) <= 9 && chance(20),
    choices: [
      { label: "Cheat", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        const caught = chance(45);
        if (caught) {
          if (spouse) changeBond(spouse, -45);
          state.player.affairs = (state.player.affairs || 0) + 1;
          addCanonEvent(`Caught cheating on ${spouse?.name || "spouse"}.`, "bad");
          applyEffects(`They found the texts. The marriage is a divorce countdown now.`, { happiness: -18, karma: -12, discipline: -4 }, "bad");
        } else {
          state.player.affairs = (state.player.affairs || 0) + 1;
          applyEffects(`You did it. Nobody found out yet. You feel different around them.`, { happiness: 3, karma: -8, discipline: -3 }, "bad");
        }
      } },
      { label: "Couples therapy", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, 14);
        applyEffects(`You both showed up. Therapist asked the right question. You cried in the parking lot together. The marriage came back.`, { money: -randomInt(800, 3200), happiness: 14, karma: 6 }, "good");
      } },
      { label: "Block the number, double down on the marriage", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, 12);
        applyEffects(`You blocked them. Took ${spouse?.name || "your spouse"} to dinner that night. They didn't know what you saved them from.`, { discipline: 12, karma: 8, happiness: 8 }, "good");
      } }
    ]
  },

  {
    title: "Empty Nest",
    text: () => `Kids are out. House is too quiet. ${state.player.relationships.find(r => r.type === "spouse")?.name || "Your spouse"} keeps suggesting hobbies.`,
    when: p => p.married && p.children?.length > 0 && p.age >= 48 && chance(15),
    choices: [
      { label: "Take a couples trip", run: () => {
        const cost = randomInt(2000, 8000);
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, 14);
        applyEffects(`Three weeks in ${pick(["Italy", "Portugal", "Japan", "Thailand"])}. You fell back in love a little. Came back lighter.`, { money: -cost, happiness: 16, looks: 2 }, "good");
      } },
      { label: "Start a side hustle together", run: () => applyEffects(`You both got busy. ${pick(["Etsy", "wine bar", "Airbnb", "consulting"])}. Felt like 25 again.`, { money: -randomInt(2000, 8000), discipline: 8, smarts: 6, happiness: 10 }, "good") },
      { label: "Slowly drift", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, -15);
        applyEffects(`The silence got louder. Neither of you said it out loud. The next decade looked like the last one.`, { happiness: -6, discipline: 2 }, "bad");
      } }
    ]
  },

  {
    title: "Divorce Ultimatum",
    text: () => `${state.player.relationships.find(r => r.type === "spouse")?.name || "Your spouse"} sat you down. "Something has to change or we're done."`,
    when: p => p.married && p.relationships.some(r => r.type === "spouse" && r.bond < 35) && chance(40),
    choices: [
      { label: "Beg, change, fight for it", run: () => {
        const saved = chance(40);
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (saved) {
          if (spouse) changeBond(spouse, 22);
          applyEffects(`Three months of work. Therapy. Real change. Marriage survived. Bond stronger than it was at year 2.`, { money: -randomInt(1200, 5000), happiness: 16, discipline: 10 }, "good");
        } else {
          if (spouse) changeBond(spouse, -8);
          applyEffects(`You tried. They were too far gone. The countdown to divorce continues.`, { happiness: -10, discipline: 6, smarts: 4 }, "bad");
        }
      } },
      { label: "Sign the papers", run: fileForDivorce },
      { label: "Pretend nothing was said", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, -10);
        applyEffects(`You acted like the conversation didn't happen. They retreated further. Two years of silence ahead.`, { happiness: -10, discipline: -2, karma: -4 }, "bad");
      } }
    ]
  },

  {
    title: "Post-Divorce Dating",
    text: () => `${state.player.divorces || 0} divorce${(state.player.divorces || 0) === 1 ? "" : "s"} in. ${state.player.name} is dating again. The apps are different now.`,
    when: p => !p.married && (p.divorces || 0) >= 1 && !p.relationships.some(r => r.type === "partner") && p.age <= 60 && chance(15),
    choices: [
      { label: "Date hard", run: () => {
        if (chance(45 + Math.floor(state.player.stats.looks / 6))) {
          const name = pick(originOf(state.player.location).locals.concat(peopleNames));
          state.player.relationships.push({ id: `partner-${Date.now()}`, name, role: "Partner (post-divorce)", bond: randomInt(48, 72), type: "partner" });
          applyEffects(`Three dates in, you knew. ${name} is in your life now. Different than the last one.`, { happiness: 14, looks: 4 }, "good");
        } else {
          applyEffects(`Twelve dates, zero connections. You bought a cat instead.`, { happiness: -4, discipline: 4 });
        }
      } },
      { label: "Take a year alone", run: () => applyEffects(`No dating. Just you, the gym, therapy, books. The year was the best one in a decade.`, { happiness: 14, discipline: 12, smarts: 8, health: 6 }, "good") }
    ]
  },

  // ============================================================
  // CITY SCENE DEPTH PASS #2 — Skid Row, Compton, Vegas, Paris,
  // Dubai, Rio, Seoul (3 more each = 21 new)
  // ============================================================

  // ---- SKID ROW ----
  {
    title: "Free Meal at the Mission",
    text: () => `Dinner line at the Midnight Mission goes around the block. ${state.player.name} stood in it with ${randomInt(180, 400)} other people. Volunteers handed out trays.`,
    when: p => p.location === "Skid Row, Los Angeles" && p.age >= 8 && chance(15),
    choices: [
      { label: "Eat, talk to the volunteers", run: () => applyEffects(`A woman named ${pick(["Carla", "Janine", "Dolores"])} talked to you for twenty minutes. She gave you her number "for emergencies."`, { karma: 8, happiness: 4, smarts: 4, health: 2 }, "good") },
      { label: "Take the tray and dip", run: () => applyEffects(`You ate alone on a curb. Watched the block. Saw too much.`, { health: 2, smarts: 6, happiness: -3 }) }
    ]
  },
  {
    title: "Tent City Neighbor",
    text: () => `Two tents over, an older guy named ${pick(["Sticks", "Pops Reggie", "Marco"])} has been there longer than anyone else. He waves ${state.player.name} over.`,
    when: p => p.location === "Skid Row, Los Angeles" && p.age >= 14 && chance(12),
    choices: [
      { label: "Sit with him, listen", run: () => applyEffects(`Three hours of stories. He used to be a session drummer. He knows everyone. The block is a network.`, { karma: 10, smarts: 8, streetRep: 6, happiness: 6 }, "good") },
      { label: "Keep your distance", run: () => applyEffects(`You nodded, kept walking. Self-preservation. He nodded back. Respect.`, { discipline: 6, smarts: 2 }) }
    ]
  },
  {
    title: "Camera Crew on the Row",
    text: () => `Documentary crew rolled up to Skid Row. They want ${state.player.name} to "share your story." Promise of payment after, "minimum $200."`,
    when: p => p.location === "Skid Row, Los Angeles" && p.age >= 16 && chance(10),
    choices: [
      { label: "Tell your story", run: () => {
        const pay = chance(60) ? randomInt(200, 800) : 0;
        applyEffects(pay > 0 ? `They paid ${money(pay)} cash. Your face is in a Vice doc now.` : `They never came back with the money. Story's online anyway.`, { money: pay, fame: 4, karma: -3, happiness: -2 });
      } },
      { label: "Tell them to leave", run: () => applyEffects(`You told them to leave. The block cheered when they left. You earned cred you can't measure.`, { karma: 10, streetRep: 12, happiness: 8 }, "good") }
    ]
  },

  // ---- COMPTON ----
  {
    title: "Sunday BBQ on the Block",
    text: () => `Auntie ${pick(["Tee", "Renee", "Crystal"])} fires up the grill on Saturday. Half the block shows up. Speakers are out, dominos on the table, kids running through the yard.`,
    when: p => p.location === "Compton, CA" && p.age >= 8 && chance(15),
    choices: [
      { label: "Stay all day", run: () => {
        changeLocalRep(randomInt(4, 9));
        applyEffects(`You ate three plates. Met all the cousins. Block knows you better.`, { happiness: 14, karma: 8, health: 2, money: -10 }, "good");
      } },
      { label: "Show face, eat, dip", run: () => applyEffects(`Plate to-go. Said hi to everybody you needed to. Smart move.`, { happiness: 6, karma: 3 }) }
    ]
  },
  {
    title: "Sunday Lowrider Cruise",
    text: () => `Sundays on Crenshaw. Lowriders out, candy paint, hydraulics bouncing. ${pick(["Jaiden", "Mecca", "Tito"])} pulled up on you, "Get in."`,
    when: p => p.location === "Compton, CA" && p.age >= 14 && chance(12),
    choices: [
      { label: "Ride from Slauson to Florence", run: () => applyEffects(`Four hours, two stops at the gas station, photos for life. You'll remember this Sunday at 60.`, { happiness: 14, looks: 3, streetRep: 6, fame: 2 }, "good") },
      { label: "Pass, you don't ride", run: () => applyEffects(`You said you had homework. They drove off. You watched from the porch.`, { discipline: 4, happiness: -2 }) }
    ]
  },
  {
    title: "High School Football Friday",
    text: () => `Centennial vs Dominguez. Whole city out. ${state.player.name} is in the stands or on the field, depending.`,
    when: p => p.location === "Compton, CA" && p.age >= 13 && p.age <= 19 && chance(15),
    choices: [
      { label: "Lock in if you play", run: () => {
        if (state.player.stats.health >= 60 && chance(40)) {
          applyEffects(`You played hard. Scouts from ${pick(["USC", "Oregon", "Texas"])} were watching. Number called.`, { fame: 12, looks: 4, championships: 1, happiness: 16 }, "good");
        } else {
          applyEffects(`You hyped from the sidelines. Game day energy was unreal. The DJ played Kendrick at halftime.`, { happiness: 10, fame: 2 });
        }
      } },
      { label: "Skip the game, work a shift", run: () => applyEffects(`You picked up a shift at ${pick(["the corner store", "the burger spot", "the gas station"])}. Made ${money(randomInt(60, 180))}. Heard the score Sunday.`, { money: randomInt(60, 180), discipline: 6, happiness: -2 }) }
    ]
  },

  // ---- VEGAS ----
  {
    title: "Casino Cocktail Job Offer",
    text: () => `A manager at ${pick(["Cosmopolitan", "Aria", "Bellagio", "Caesars"])} watched ${state.player.name} hand out drinks at a friend's house party. "We're hiring. Tips are real."`,
    when: p => p.location === "Las Vegas, NV" && p.age >= 21 && p.age <= 35 && chance(13),
    choices: [
      { label: "Take the gig", run: () => {
        applyEffects(`Six months of cocktail shifts. ${money(randomInt(20000, 65000))} in tips alone. Saw everything. Won't unsee it.`, { money: randomInt(20000, 65000), looks: 3, smarts: 6, health: -3, discipline: 4 }, "good");
      } },
      { label: "Pass — not your scene", run: () => applyEffects(`You smiled, declined. He pressed his card on you anyway.`, { discipline: 4, karma: 2 }) }
    ]
  },
  {
    title: "Boxing Match at the MGM",
    text: () => `Big fight at the MGM. ${pick(["Canelo", "Crawford", "Davis", "Garcia"])} headlines. Friend got ringside seats. ${state.player.name} is going.`,
    when: p => p.location === "Las Vegas, NV" && p.age >= 18 && isAdultUnlocked() && chance(10),
    choices: [
      { label: "Bet on the underdog", run: () => {
        const bet = randomInt(200, 1800);
        if (chance(30)) {
          applyEffects(`Upset. ${money(bet * 4)} cleared. The casino remembered your face.`, { money: bet * 3, happiness: 14, fame: 3 }, "good");
        } else {
          applyEffects(`Bet lost. The fight was decent. The whiskey was overpriced.`, { money: -bet, happiness: 4, health: -1 });
        }
      } },
      { label: "Just watch the spectacle", run: () => applyEffects(`Ringside. Sweat hit your shirt. You can say "I was there" forever.`, { money: -randomInt(200, 1500), happiness: 12, fame: 2 }, "good") }
    ]
  },
  {
    title: "Wedding Chapel Bachelorette",
    text: () => `Friend's bachelorette party rolled into Vegas. They're trying to drag ${state.player.name} into a fake wedding at a drive-through chapel "for the bit."`,
    when: p => p.location === "Las Vegas, NV" && p.age >= 21 && p.age <= 32 && chance(10),
    choices: [
      { label: "Do the fake wedding", run: () => {
        applyEffects(`Elvis officiated. You're "married" on paper for 6 hours until the annulment. Pictures are unhinged.`, { money: -randomInt(80, 400), happiness: 16, fame: 4, looks: 2, followers: randomInt(200, 3000) }, "good");
      } },
      { label: "Be the responsible one", run: () => applyEffects(`Someone has to remember. You filmed everything. Three friends still owe you.`, { discipline: 8, karma: 6, happiness: 4 }, "good") }
    ]
  },

  // ---- PARIS ----
  {
    title: "Sunday Marché",
    text: () => `Marché des Enfants Rouges on Sunday. ${state.player.name} ordered ${pick(["a couscous plate", "Moroccan tagine", "Vietnamese soup", "Italian risotto"])} and ate elbow-to-elbow with strangers.`,
    when: p => p.location === "Paris, France" && p.age >= 14 && chance(12),
    choices: [
      { label: "Talk to your bench neighbor", run: () => applyEffects(`They were a writer / chef / retired actor. Forty-minute conversation. You exchanged numbers. Paris does this.`, { happiness: 10, smarts: 5, karma: 4, money: -randomInt(15, 45) }, "good") },
      { label: "Eat and observe", run: () => applyEffects(`Twenty bites, no words. Best meal of the month.`, { money: -randomInt(12, 35), happiness: 6, smarts: 3 }) }
    ]
  },
  {
    title: "Grève — Strike Day",
    text: () => `Metro is down. RER is down. Half the city is walking. ${state.player.name} is across town from where they need to be.`,
    when: p => p.location === "Paris, France" && p.age >= 12 && chance(13),
    choices: [
      { label: "Walk it, take photos", run: () => applyEffects(`Two-hour walk. You saw four neighborhoods you'd never have seen. Found a bakery you'll go back to.`, { happiness: 8, smarts: 4, health: 3 }, "good") },
      { label: "Splurge on a Uber", run: () => applyEffects(`Surge pricing. ${money(randomInt(40, 180))} for a 15-minute ride. Felt like a tourist.`, { money: -randomInt(40, 180), discipline: -2, happiness: 2 }) }
    ]
  },
  {
    title: "Père Lachaise Wandering",
    text: () => `${state.player.name} went to Père Lachaise to see ${pick(["Jim Morrison", "Oscar Wilde", "Édith Piaf", "Proust"])}'s grave. Got lost in the cemetery for two hours.`,
    when: p => p.location === "Paris, France" && p.age >= 14 && chance(8),
    choices: [
      { label: "Stay until they close it", run: () => applyEffects(`You sat by a tomb writing in your phone notes. Came out with three new beliefs about life.`, { smarts: 10, happiness: 6, karma: 4, discipline: 4 }, "good") },
      { label: "Find the famous grave, leave", run: () => applyEffects(`You touched the marble. Took the photo. Took the metro home before dark.`, { smarts: 4, happiness: 4 }) }
    ]
  },

  // ---- DUBAI ----
  {
    title: "Indoor Ski at Mall of Emirates",
    text: () => `Dubai is 105°F outside. Inside the mall there's a ski slope. ${state.player.name}'s friend rented gear. Pretending winter exists for 90 minutes.`,
    when: p => (p.location === "Dubai, UAE" || p.currentTrip === "Dubai, UAE") && p.age >= 14 && chance(10),
    choices: [
      { label: "Ski like an idiot", run: () => applyEffects(`You fell three times. Photos are gold. The simulation is wild.`, { money: -randomInt(120, 400), happiness: 12, health: -2, fame: 2 }, "good") },
      { label: "Watch from the cafe", run: () => applyEffects(`You drank a $14 latte at the slopeside cafe. Felt like a Bond villain.`, { money: -randomInt(15, 50), discipline: 4, happiness: 4 }) }
    ]
  },
  {
    title: "Marina Yacht Friday",
    text: () => `Friday in Dubai. Friend's yacht. Marina view. Bottle service offshore. ${state.player.name} got the invite via someone you met once.`,
    when: p => (p.location === "Dubai, UAE" || p.currentTrip === "Dubai, UAE") && p.age >= 18 && isAdultUnlocked() && chance(12),
    choices: [
      { label: "All-day yacht", run: () => {
        const cost = randomInt(800, 4500);
        applyEffects(`Eight hours offshore. Three Russian models, two crypto guys, one prince. You're "in the rotation" now.`, { money: -cost, happiness: 14, fame: 8, followers: randomInt(800, 8000), looks: 3 }, "good");
      } },
      { label: "Sunset only, then dip", run: () => applyEffects(`You showed face for the magic hour. Photos hit. You left before the chaos.`, { money: -randomInt(120, 500), happiness: 8, fame: 4, discipline: 4 }, "good") }
    ]
  },
  {
    title: "Desert Safari with Falcons",
    text: () => `Tour through the dunes. Quad bikes. A bedouin camp at dusk. A trainer with a falcon. ${state.player.name} is wearing the wrong shoes.`,
    when: p => (p.location === "Dubai, UAE" || p.currentTrip === "Dubai, UAE") && p.age >= 12 && chance(8),
    choices: [
      { label: "Try the falcon on your arm", run: () => applyEffects(`The bird landed on you. Talons through the glove. Photos are unreal. New core memory.`, { money: -randomInt(150, 600), happiness: 14, looks: 2, fame: 4 }, "good") },
      { label: "Stay near the fire", run: () => applyEffects(`You drank cardamom coffee and listened to drums. Quiet day in the desert.`, { money: -randomInt(100, 350), happiness: 8, smarts: 4 }) }
    ]
  },

  // ---- RIO ----
  {
    title: "Soccer at Maracanã",
    text: () => `Flamengo vs Fluminense at Maracanã. ${state.player.name} got a ticket. The stadium is shaking before kickoff.`,
    when: p => (p.location === "Rio de Janeiro, Brazil" || p.currentTrip === "Rio de Janeiro, Brazil") && p.age >= 10 && chance(12),
    choices: [
      { label: "Stand in the torcida", run: () => applyEffects(`You stood in the supporters' section. Lost your voice. Got hugged by ${randomInt(8, 18)} strangers when ${pick(["Gabigol", "Pedro", "Arrascaeta"])} scored.`, { money: -randomInt(40, 200), happiness: 18, fame: 2, health: -2 }, "good") },
      { label: "Sit in the calmer side", run: () => applyEffects(`Polite cheering. Nice view. Felt like a tourist.`, { money: -randomInt(80, 350), happiness: 8 }) }
    ]
  },
  {
    title: "Christ the Redeemer Hike",
    text: () => `${state.player.name} woke up at 5AM to climb Corcovado on foot. The van costs $20. The hike is harder than it looks.`,
    when: p => (p.location === "Rio de Janeiro, Brazil" || p.currentTrip === "Rio de Janeiro, Brazil") && p.age >= 14 && chance(8),
    choices: [
      { label: "Hike to the top", run: () => applyEffects(`Three hours, two stops, monkeys on the trail. Photos at the statue at 9AM. Bragging rights for life.`, { happiness: 14, health: 6, fame: 2, smarts: 4 }, "good") },
      { label: "Take the train up", run: () => applyEffects(`Easy way. Crowded. Still the view. Tourist accomplishment.`, { money: -randomInt(20, 60), happiness: 8, fame: 1 }) }
    ]
  },
  {
    title: "Botafogo Bar Crawl",
    text: () => `Botafogo on a Friday. ${state.player.name} ended up at a "boteco" that locals don't tell tourists about. Cachaça flights. Chopp on the table. Samba in the background.`,
    when: p => (p.location === "Rio de Janeiro, Brazil" || p.currentTrip === "Rio de Janeiro, Brazil") && p.age >= 18 && isAdultUnlocked() && chance(11),
    choices: [
      { label: "Stay till 4AM", run: () => applyEffects(`You learned three new dance moves. Three locals adopted you for the night. Phone died at 1AM.`, { money: -randomInt(60, 280), happiness: 18, looks: 3, smarts: 4, health: -3 }, "good") },
      { label: "One round, head home", run: () => applyEffects(`One round. Two locals. Forty minutes. Best $15 you spent in Rio.`, { money: -15, happiness: 6, smarts: 3 }) }
    ]
  },

  // ---- SEOUL ----
  {
    title: "Hongdae Saturday Night",
    text: () => `Hongdae. Live music spilling out of every basement. ${state.player.name} is at a vinyl bar with three friends from class.`,
    when: p => (p.location === "Seoul, South Korea" || p.currentTrip === "Seoul, South Korea") && p.age >= 19 && isAdultUnlocked() && chance(12),
    choices: [
      { label: "Bar hop till sunrise", run: () => applyEffects(`Four bars, two soju bottles, one moment dancing in the street at 4AM. Hongdae validated.`, { money: -randomInt(60, 280), happiness: 16, looks: 2, health: -3 }, "good") },
      { label: "One bar, leave at midnight", run: () => applyEffects(`You took the last subway. Smart move. The friends are still drunk in your group chat photos.`, { money: -randomInt(20, 80), discipline: 6, happiness: 6 }) }
    ]
  },
  {
    title: "Jjimjilbang Overnight",
    text: () => `${state.player.name} spent the night at a 24-hour jjimjilbang. Hot rooms, cold rooms, sleeping pods, banana milk at 3AM.`,
    when: p => (p.location === "Seoul, South Korea" || p.currentTrip === "Seoul, South Korea") && p.age >= 14 && chance(10),
    choices: [
      { label: "Do every room", run: () => applyEffects(`Five hours of saunas. Skin reset. Slept on the floor. Best sleep in months.`, { money: -randomInt(15, 50), health: 10, happiness: 8, looks: 4, discipline: 4 }, "good") },
      { label: "Two rooms, nap, leave", run: () => applyEffects(`You did the basics. Felt new. Walked home through the morning.`, { money: -randomInt(10, 25), health: 5, happiness: 4 }) }
    ]
  },
  {
    title: "Buddhist Temple Stay",
    text: () => `${state.player.name} signed up for a weekend templestay at a mountain temple. Wake at 4AM, 108 prostrations, vegetarian meals, silence.`,
    when: p => (p.location === "Seoul, South Korea" || p.currentTrip === "Seoul, South Korea") && p.age >= 17 && chance(7),
    choices: [
      { label: "Commit to the silence", run: () => applyEffects(`48 hours without speaking. You cried during the prostrations. Came back with a different posture.`, { money: -randomInt(80, 200), happiness: 16, discipline: 14, smarts: 10, karma: 8 }, "good") },
      { label: "Bail Saturday morning", run: () => applyEffects(`You left after the first 4AM bell. The monk smiled like he expected it.`, { money: -randomInt(40, 100), discipline: 2, smarts: 4 }) }
    ]
  },

  // ============================================================
  // CAREER ARCS — multi-stage storylines (music, sports, politics)
  // Stage tracking: player.musicCareer / sportsCareer / politicsCareer
  // ============================================================

  // ---- MUSIC CAREER ----
  {
    title: "First Show at a Dive Bar",
    text: () => `${state.player.name} got booked at ${pick(["The Smell", "The Echoplex", "a hookah lounge", "a basement house show", "an open mic"])} in ${originOf(state.player.location).short}. Two opening slots before the headliner. The room holds 80 people. Forty showed up.`,
    when: p => p.age >= 15 && (p.interests?.music >= 2 || p.personality === "wild" || p.personality === "romantic" || p.personality === "big") && !p.musicCareer && chance(10),
    choices: [
      { label: "Pour your soul into it", run: () => {
        state.player.musicCareer = { stage: 1 };
        addCanonEvent(`Played first real show in ${originOf(state.player.location).short}. Forty people. Started something.`, "good");
        rememberInterest("music", 4);
        applyEffects(`The room got quiet during the third song. You felt it for the first time. This is the thing.`, { fame: 4, happiness: 10, discipline: 6 }, "good");
      } },
      { label: "Just go through the motions", run: () => applyEffects(`You phoned it in. Crowd noticed. Bartender didn't ask you back.`, { fame: 1, happiness: -3 }) }
    ]
  },
  {
    title: "Demo Tape Gets Heard",
    text: () => `An A&R at ${pick(["Interscope", "Def Jam", "RCA", "an indie boutique label"])} stumbled on ${state.player.name}'s demo. They want a meeting next week. Coffee, no commitment.`,
    when: p => p.age >= 17 && p.musicCareer?.stage === 1 && chance(35),
    choices: [
      { label: "Take the meeting", run: () => {
        state.player.musicCareer.stage = 2;
        addCanonEvent(`A&R approached. The career started moving.`, "good");
        applyEffects(`They liked the demo. They liked you less. The contract is on the table.`, { fame: 6, happiness: 8, smarts: 4 }, "good");
      } },
      { label: "Stay independent", run: () => {
        state.player.musicCareer.stage = 1.5;
        applyEffects(`You said no thank you. Self-released the EP. Different path. Slower but yours.`, { discipline: 8, karma: 4, fame: 2, money: -randomInt(200, 1200) }, "good");
      } }
    ]
  },
  {
    title: "Sign the Contract",
    text: () => `The label sent the contract. 360 deal. They own everything for 5 years. You'd get a $30K advance.`,
    when: p => p.age >= 18 && p.musicCareer?.stage === 2 && chance(60),
    choices: [
      { label: "Sign — take the advance", run: () => {
        state.player.musicCareer.stage = 3;
        state.player.musicCareer.signed = true;
        addCanonEvent(`Signed a major-label deal. The advance was ${money(30000)}.`, "good");
        applyEffects(`Pen down. $30K hit. You're an artist on paper now. Lawyer should've reviewed it.`, { money: 30000, fame: 12, happiness: 14, karma: -4, discipline: -2 }, "good");
      } },
      { label: "Counter — keep masters", run: () => {
        if (chance(40 + Math.floor(state.player.stats.smarts / 6))) {
          state.player.musicCareer.stage = 3;
          state.player.musicCareer.signed = true;
          state.player.musicCareer.smartDeal = true;
          addCanonEvent(`Negotiated a deal that kept the masters. Smarter than 99% of artists.`, "good");
          applyEffects(`They folded. You kept ownership. Advance smaller (${money(12000)}) but the future is yours.`, { money: 12000, fame: 8, smarts: 8, happiness: 10 }, "good");
        } else {
          applyEffects(`They walked away. You stayed independent. Painful short-term, right long-term.`, { discipline: 6, smarts: 6, happiness: -6 });
          state.player.musicCareer.stage = 1.5;
        }
      } }
    ]
  },
  {
    title: "Debut Album Drops",
    text: () => `Your album is out. ${pick(["Pitchfork", "Complex", "Fader", "Rolling Stone"])} reviewed it. Spotify added you to two playlists.`,
    when: p => p.age >= 19 && p.musicCareer?.stage >= 3 && !p.musicCareer?.albumDropped && chance(50),
    choices: [
      { label: "Tour it hard", run: () => {
        state.player.musicCareer.albumDropped = true;
        state.player.musicCareer.stage = 4;
        const fol = randomInt(8000, 120000);
        const earn = randomInt(8000, 65000);
        addCanonEvent(`Debut album dropped. ${fol.toLocaleString()} new fans, ${money(earn)} from the tour.`, "good");
        applyEffects(`Three months on the road. Hotels, vans, ${randomInt(28, 60)} cities. You came back changed.`, { money: earn, fame: 18, followers: fol, happiness: 14, health: -8, discipline: -3 }, "good");
      } },
      { label: "Stay home, plot the next one", run: () => {
        state.player.musicCareer.albumDropped = true;
        applyEffects(`You played five local shows and went back to writing. Sustainable. Less exposure.`, { fame: 6, followers: randomInt(800, 8000), happiness: 6, discipline: 8 }, "good");
      } }
    ]
  },
  {
    title: "The Spiral Year",
    text: () => `Touring did things. ${state.player.name}'s been drinking before noon. Doing things in green rooms. Friends are quietly worried.`,
    when: p => p.age >= 20 && p.musicCareer?.stage >= 4 && !p.musicCareer?.spiral && chance(40),
    choices: [
      { label: "Lean all the way in", run: () => {
        state.player.musicCareer.spiral = true;
        state.player.smokingLevel = Math.max(state.player.smokingLevel, 2);
        state.player.risksTaken += 3;
        addCanonEvent(`Spiraled during the tour. The music got darker, the body got smaller.`, "bad");
        applyEffects(`The next 18 months are a blur. Songs are great. Body is not.`, { happiness: 8, health: -22, discipline: -14, looks: -4, fame: 6 }, "bad");
      } },
      { label: "Rehab + therapist", run: () => {
        state.player.musicCareer.recovered = true;
        addCanonEvent(`Got sober during the rise. Hardest decision of the career.`, "good");
        applyEffects(`30 days inpatient. Came out cleaner than you've ever been. Career paused, life saved.`, { money: -randomInt(8000, 35000), health: 12, discipline: 14, happiness: 10, fame: -3 }, "good");
      } }
    ]
  },
  {
    title: "Grammy Nomination",
    text: () => `The Recording Academy announced nominations. ${state.player.name}'s name is on it. Twice.`,
    when: p => p.age >= 21 && p.musicCareer?.stage >= 4 && p.fame >= 40 && !p.musicCareer?.grammyNom && chance(35),
    choices: [
      { label: "Show up, walk the carpet", run: () => {
        state.player.musicCareer.grammyNom = true;
        const won = chance(40);
        if (won) {
          unlock("grammy", true);
          addCanonEvent(`Won a Grammy. Speech went viral.`, "good");
          applyEffects(`You won. Speech went viral. Phone hasn't stopped. ${state.player.name} is a name now.`, { fame: 35, followers: randomInt(60000, 500000), money: randomInt(50000, 300000), happiness: 25, looks: 4 }, "good");
        } else {
          addCanonEvent(`Grammy nominated. Didn't win. Did the carpet.`, "good");
          applyEffects(`You smiled when they read the other name. Still won the night. Every label rep wanted your number.`, { fame: 22, followers: randomInt(15000, 120000), happiness: 14 }, "good");
        }
      } },
      { label: "Skip — make a statement", run: () => {
        state.player.musicCareer.grammyNom = true;
        applyEffects(`You didn't show. The internet had Opinions. Your real fans loved it.`, { fame: 12, karma: 6, discipline: 8, happiness: 6 }, "good");
      } }
    ]
  },

  // ---- SPORTS CAREER ----
  {
    title: "High School Varsity Tryout",
    text: () => `Tryouts for the varsity ${pick(["basketball", "football", "track", "soccer", "baseball"])} team. ${state.player.name} can make the cut — or watch from the stands.`,
    when: p => p.age >= 14 && p.age <= 17 && p.stats.health >= 55 && !p.sportsCareer && chance(15),
    choices: [
      { label: "Try out hard", run: () => {
        if (chance(40 + Math.floor(state.player.stats.health / 5))) {
          state.player.sportsCareer = { stage: 1, sport: pick(["basketball", "football", "track", "soccer", "baseball"]) };
          addCanonEvent(`Made the varsity team. Started something.`, "good");
          applyEffects(`You made the cut. Practice 6 days a week. Body changed. Friend group changed.`, { health: 8, discipline: 10, fame: 6, looks: 3, happiness: 10 }, "good");
        } else {
          applyEffects(`Cut. The coach said "keep working." You didn't.`, { happiness: -8, discipline: 4 });
        }
      } },
      { label: "Stay in intramurals", run: () => applyEffects(`You played for fun on Saturdays. Won three trophies nobody cared about. Knees still work at 40.`, { health: 4, discipline: 4, happiness: 6 }, "good") }
    ]
  },
  {
    title: "Recruitment Letter",
    text: () => `Mail came. ${pick(["UCLA", "Texas", "Duke", "Florida State", "Michigan"])} sent ${state.player.name} a recruitment letter. A coach will be at next Friday's game.`,
    when: p => p.age >= 16 && p.age <= 18 && p.sportsCareer?.stage === 1 && chance(60),
    choices: [
      { label: "Play the game of your life", run: () => {
        if (chance(45 + Math.floor(state.player.stats.health / 6))) {
          state.player.sportsCareer.stage = 2;
          state.player.educationRank = Math.max(state.player.educationRank, 3);
          addCanonEvent(`Got recruited to a D1 program on scholarship.`, "good");
          applyEffects(`Scholarship offer. Full ride. Mom cried. Coach hugged you. Life shifted.`, { fame: 14, happiness: 18, looks: 4, smarts: 4 }, "good");
        } else {
          applyEffects(`You had a bad game. The coach left at halftime. Letter never came.`, { happiness: -10, discipline: 6 });
        }
      } },
      { label: "Stay home, play city league", run: () => applyEffects(`You picked stability over the gamble. Played local college instead. Body intact at 35.`, { health: 6, discipline: 6, happiness: 4 }) }
    ]
  },
  {
    title: "Draft Day",
    text: () => `Draft day. ${state.player.name} is at the green room with family. The TV cameras pan. Picks happening.`,
    when: p => p.age >= 19 && p.age <= 23 && p.sportsCareer?.stage === 2 && chance(40),
    choices: [
      { label: "Wait for the call", run: () => {
        const round = chance(35) ? 1 : chance(50) ? 2 : 4;
        state.player.sportsCareer.stage = 3;
        state.player.sportsCareer.draftRound = round;
        const sign = round === 1 ? randomInt(2400000, 8000000) : round === 2 ? randomInt(900000, 2400000) : randomInt(120000, 500000);
        addCanonEvent(`Drafted in round ${round}. Signed for ${money(sign)}.`, "good");
        applyEffects(`Round ${round} pick. ${money(sign)} signing bonus. Cameras everywhere. Family on the floor.`, { money: sign, fame: round === 1 ? 30 : 15, followers: randomInt(20000, 400000), happiness: 25 }, "good");
      } },
      { label: "Withdraw — go back to school", run: () => applyEffects(`You pulled out of the draft. Coach was confused. You finished your degree. Different life.`, { smarts: 12, discipline: 12, fame: -4, happiness: 4 }) }
    ]
  },
  {
    title: "Major Injury",
    text: () => `${pick(["ACL tear", "Achilles rupture", "concussion protocol", "broken collarbone", "ruptured disc"])}. The doctor says season's over. Maybe career.`,
    when: p => p.age >= 20 && p.sportsCareer?.stage >= 3 && !p.sportsCareer?.injured && chance(30),
    choices: [
      { label: "Rehab back, full comeback", run: () => {
        state.player.sportsCareer.injured = true;
        if (chance(50 + Math.floor(state.player.stats.discipline / 5))) {
          addCanonEvent(`Came back from career-threatening injury.`, "good");
          applyEffects(`14 months of rehab. You came back faster than you left. Story for life.`, { discipline: 14, fame: 12, health: -3, happiness: 10 }, "good");
        } else {
          applyEffects(`The body never came back fully. You played 2 more seasons at 70%.`, { discipline: 8, fame: -6, health: -6, happiness: -8 }, "bad");
        }
      } },
      { label: "Retire — take the buyout", run: () => {
        state.player.sportsCareer.injured = true;
        state.player.sportsCareer.retired = true;
        const buyout = randomInt(800000, 6000000);
        applyEffects(`You took the buyout. ${money(buyout)} hit. Body's a wreck. Mind is clear.`, { money: buyout, happiness: 4, health: -4, discipline: 4 }, "good");
      } }
    ]
  },
  {
    title: "Championship Run",
    text: () => `Your team is in the finals. ${state.player.name} is starting. The other guys have ${pick(["LeBron", "Mahomes", "Messi", "Curry"])}.`,
    when: p => p.age >= 21 && p.sportsCareer?.stage >= 3 && !p.sportsCareer?.retired && !p.sportsCareer?.champion && chance(30),
    choices: [
      { label: "Play to win", run: () => {
        if (chance(45)) {
          state.player.sportsCareer.champion = true;
          state.player.championships = (state.player.championships || 0) + 1;
          unlock("champion", true);
          addCanonEvent(`Won a championship. The parade was 4 hours.`, "good");
          applyEffects(`Game 7. You scored the game-winner. Parade. Ring. Lifetime story.`, { fame: 30, money: randomInt(500000, 3000000), happiness: 30, championships: 1, followers: randomInt(50000, 600000) }, "good");
        } else {
          applyEffects(`Lost in Game 6. You played hard. The other team was just better.`, { fame: 8, happiness: -6, discipline: 8 });
        }
      } },
      { label: "Play not to lose", run: () => applyEffects(`You played safe. Coach benched you in the 4th. Team lost. You got blamed online for a year.`, { fame: -5, happiness: -10, discipline: 6 }, "bad") }
    ]
  },

  // ---- POLITICS CAREER ----
  {
    title: "City Council Race",
    text: () => `Local city council seat is open. People in ${originOf(state.player.location).short} keep telling ${state.player.name} "you should run."`,
    when: p => p.age >= 25 && (p.politicalCapital >= 15 || p.fame >= 15 || p.karma >= 70) && !p.politicsCareer && chance(20),
    choices: [
      { label: "File the paperwork", run: () => {
        state.player.politicsCareer = { stage: 1 };
        if (chance(45 + Math.floor(state.player.politicalCapital / 4))) {
          state.player.politicsCareer.stage = 2;
          state.player.jobId = "councilmember";
          addCanonEvent(`Won a city council seat.`, "good");
          applyEffects(`You won. 53/47. Six months of door-knocking paid. Sworn in next Tuesday.`, { politicalCapital: 18, fame: 10, money: -randomInt(2000, 12000), happiness: 14 }, "good");
        } else {
          applyEffects(`Lost. 46/54. Concession speech hurt. You learned the game though.`, { politicalCapital: 6, smarts: 8, money: -randomInt(1500, 8000), happiness: -8 });
        }
      } },
      { label: "Stay out of it", run: () => applyEffects(`You said the timing was wrong. Maybe it was. Maybe it wasn't.`, { discipline: 4, happiness: -2 }) }
    ]
  },
  {
    title: "Lobbyist Approaches You",
    text: () => `A lobbyist from ${pick(["a pharma company", "an oil major", "a real estate developer", "a tech firm"])} took ${state.player.name} to a $400 lunch. Their ask is in the envelope.`,
    when: p => p.politicsCareer?.stage >= 2 && !p.politicsCareer?.bought && chance(30),
    choices: [
      { label: "Take the deal quietly", run: () => {
        state.player.politicsCareer.bought = true;
        applyEffects(`Money hit through a PAC. You voted their way. Nobody can prove it.`, { money: randomInt(40000, 200000), karma: -20, politicalCapital: 8, happiness: 4, discipline: -3 }, "bad");
      } },
      { label: "Decline, write op-ed exposing it", run: () => {
        applyEffects(`You wrote the op-ed. The lobbyist lost their job. You became a folk hero in your district.`, { politicalCapital: 18, karma: 22, fame: 12, happiness: 12 }, "good");
      } }
    ]
  },
  {
    title: "Statewide Run",
    text: () => `Party leadership wants ${state.player.name} to run for ${pick(["governor", "state senate", "congressional seat", "lieutenant governor"])}. The fundraising starts now.`,
    when: p => p.age >= 32 && p.politicsCareer?.stage >= 2 && p.politicalCapital >= 40 && chance(35),
    choices: [
      { label: "Run statewide", run: () => {
        state.player.politicsCareer.stage = 3;
        if (chance(40 + Math.floor(state.player.politicalCapital / 5))) {
          state.player.politicsCareer.stage = 4;
          state.player.jobId = "stateOfficial";
          addCanonEvent(`Won a statewide office. National attention.`, "good");
          applyEffects(`You won statewide. Capitol moving day. Family moved with you. Cameras follow you now.`, { politicalCapital: 28, fame: 25, money: -randomInt(50000, 300000), happiness: 16 }, "good");
        } else {
          applyEffects(`Lost statewide. Concession was televised. Career on hold for 4 years.`, { politicalCapital: 8, fame: 4, money: -randomInt(40000, 250000), happiness: -12 }, "bad");
        }
      } },
      { label: "Stay local — finish what you started", run: () => applyEffects(`You stayed council. Passed three real bills. Constituents loved you.`, { politicalCapital: 12, karma: 10, happiness: 8 }, "good") }
    ]
  },
  {
    title: "Political Scandal",
    text: () => `Tabloid has a story dropping Friday. ${pick(["Old tweets", "An affair", "A donor connection", "A misuse of funds"])}. ${state.player.name}'s team is in the war room at 9PM.`,
    when: p => p.politicsCareer?.stage >= 3 && !p.politicsCareer?.scandal && chance(25),
    choices: [
      { label: "Get ahead of it — full transparency", run: () => {
        state.player.politicsCareer.scandal = true;
        if (chance(50 + Math.floor(state.player.stats.smarts / 6))) {
          addCanonEvent(`Survived a scandal by getting in front of it.`, "good");
          applyEffects(`You held the press conference. Took every question. Numbers held by Monday. Career intact.`, { politicalCapital: 6, fame: 14, happiness: -6, smarts: 8 }, "good");
        } else {
          state.player.politicsCareer.stage = 0;
          applyEffects(`Your honesty didn't save you. The party dropped you. You'll be a "former" for the rest of your life.`, { politicalCapital: -25, fame: 4, happiness: -18, karma: 8 }, "bad");
        }
      } },
      { label: "Deny, deny, deny", run: () => {
        state.player.politicsCareer.scandal = true;
        if (chance(30)) {
          applyEffects(`The story died on Tuesday. Nobody could prove it. You slept poorly for three years.`, { politicalCapital: 4, happiness: -10, karma: -8 });
        } else {
          state.player.politicsCareer.stage = 0;
          applyEffects(`The denial collapsed. Receipts dropped Wednesday. Career over. Possibly federal charges.`, { politicalCapital: -35, fame: 8, record: 1, money: -randomInt(50000, 500000), happiness: -22 }, "bad");
        }
      } }
    ]
  },
  {
    title: "National Bid",
    text: () => `Party wants ${state.player.name} on the national ticket. ${pick(["VP nominee", "Presidential primary run", "Cabinet position", "UN Ambassador"])}.`,
    when: p => p.age >= 45 && p.politicsCareer?.stage >= 4 && p.politicalCapital >= 70 && !p.politicsCareer?.national && chance(40),
    choices: [
      { label: "Accept the bid", run: () => {
        state.player.politicsCareer.national = true;
        if (chance(35)) {
          addCanonEvent(`Won national office. ${state.player.name}'s name is in history textbooks.`, "good");
          applyEffects(`You won. The speech was on every channel. Your kids grew up in the spotlight. Legacy locked.`, { politicalCapital: 50, fame: 60, money: randomInt(100000, 1000000), happiness: 18 }, "good");
        } else {
          applyEffects(`Lost the race. 8% margin. National name recognition though. Speaking circuit is yours forever.`, { politicalCapital: 15, fame: 35, money: randomInt(50000, 500000), happiness: -6 }, "good");
        }
      } },
      { label: "Decline — endorse someone else", run: () => applyEffects(`You backed someone younger. Your endorsement made their career. King-maker status.`, { politicalCapital: 22, karma: 14, fame: 12, happiness: 12 }, "good") }
    ]
  },

  // ============================================================
  // DECADE-SPECIFIC HISTORICAL EVENTS
  // Tied to currentYear() — each life feels of its era
  // ============================================================

  {
    title: "AIDS Crisis Spreads",
    text: () => `${currentYear(state.player)}. The news is panicked. Friends are getting sick. Half the country thinks it's a moral judgment.`,
    when: p => p.age >= 16 && currentYear(p) >= 1983 && currentYear(p) <= 1991 && chance(15),
    choices: [
      { label: "Volunteer at a hospice", run: () => applyEffects(`You showed up. Held hands. Buried friends. The years marked you forever.`, { karma: 22, happiness: -8, smarts: 8, discipline: 6 }, "good") },
      { label: "Get tested, take precautions", run: () => applyEffects(`You learned. You taught friends. You lived through it scared but informed.`, { smarts: 10, discipline: 6 }) }
    ]
  },

  {
    title: "Berlin Wall Falls",
    text: () => `November 1989. ${state.player.name} watched it on TV. People with hammers, the wall coming down piece by piece.`,
    when: p => p.age >= 10 && currentYear(p) === 1989 && chance(50),
    choices: [
      { label: "Watch the whole night", run: () => applyEffects(`You stayed up until 3AM. Felt like the world was rearranging itself. It was.`, { smarts: 10, happiness: 12, karma: 4 }, "good") },
      { label: "Wonder what it changes", run: () => applyEffects(`You went to bed. The 90s started that night.`, { smarts: 4, discipline: 3 }) }
    ]
  },

  {
    title: "Dot-com Bubble",
    text: () => `${currentYear(state.player)}. Everybody has a .com. Your cousin just made $400K on a stock that did nothing. The Nasdaq is moonshot.`,
    when: p => p.age >= 18 && currentYear(p) >= 1998 && currentYear(p) <= 2000 && chance(20),
    choices: [
      { label: "All in on tech stocks", run: () => {
        const investment = Math.min(state.player.money, randomInt(2000, 50000));
        state.player.money -= investment;
        if (currentYear(state.player) === 2000 && chance(70)) {
          applyEffects(`Bubble popped March 2000. ${money(investment)} → ${money(Math.floor(investment * 0.18))}. Brutal year.`, { money: Math.floor(investment * 0.18), happiness: -16, smarts: 10 }, "bad");
        } else {
          const winnings = Math.floor(investment * randomInt(15, 38) / 10);
          applyEffects(`You rode it up. ${money(investment)} → ${money(winnings)}. Now decide when to exit.`, { money: winnings, happiness: 14, fame: 4 }, "good");
        }
      } },
      { label: "Stay in real assets", run: () => applyEffects(`Bought a house instead. The cousin lost everything by 2001. You looked smart.`, { smarts: 8, discipline: 10, happiness: 4 }, "good") }
    ]
  },

  {
    title: "9/11",
    text: () => `September 11, 2001. The TV is on at school / work / the airport. The second plane hits live.`,
    when: p => p.age >= 8 && currentYear(p) === 2001 && chance(80),
    choices: [
      { label: "Watch it unfold all day", run: () => {
        addCanonEvent(`Remembers exactly where they were on 9/11.`, "bad");
        applyEffects(`You won't forget where you were. Nobody will. The country shifted that morning.`, { smarts: 10, happiness: -16, karma: 4, discipline: 4 }, "bad");
      } },
      { label: "Call family, stay close", run: () => {
        state.player.relationships.filter(r => r.type === "family").forEach(person => changeBond(person, 10));
        applyEffects(`You called everyone. Family bond strengthened. The week after was the longest of the year.`, { karma: 8, happiness: -10, smarts: 4 }, "bad");
      } }
    ]
  },

  {
    title: "Hurricane Katrina",
    text: () => `August 2005. New Orleans under water. ${state.player.name} watched the rooftops on TV.`,
    when: p => p.age >= 14 && currentYear(p) === 2005 && chance(40),
    choices: [
      { label: "Volunteer, fly down", run: () => applyEffects(`Two weeks gutting houses. The Lower 9th will never leave you. New perspective.`, { karma: 22, smarts: 8, money: -randomInt(400, 1800), happiness: -4 }, "good") },
      { label: "Donate what you can", run: () => applyEffects(`Sent a check. Felt small. Was still helpful.`, { karma: 8, money: -randomInt(50, 300) }, "good") }
    ]
  },

  {
    title: "Obama Wins",
    text: () => `November 4, 2008. ${state.player.name} is watching the returns. Grant Park is on every screen.`,
    when: p => p.age >= 12 && currentYear(p) === 2008 && chance(60),
    choices: [
      { label: "Stay up for the speech", run: () => applyEffects(`You watched. People in the streets. A neighbor knocked on your door crying. Historic night.`, { happiness: 16, karma: 6, smarts: 6 }, "good") },
      { label: "Stay neutral, go to bed", run: () => applyEffects(`You went to bed. Saw the headlines Wednesday. Felt the shift anyway.`, { smarts: 4 }) }
    ]
  },

  {
    title: "Housing Crash",
    text: () => `${currentYear(state.player)}. Your neighbors lost the house. Two friends moved back in with parents. ${state.player.name}'s 401k looks like a horror movie.`,
    when: p => p.age >= 22 && currentYear(p) >= 2008 && currentYear(p) <= 2010 && chance(25),
    choices: [
      { label: "Buy when everyone is panicking", run: () => {
        if (state.player.money >= 10000) {
          const investment = Math.min(state.player.money, randomInt(8000, 80000));
          state.player.money -= investment;
          const future = Math.floor(investment * randomInt(25, 50) / 10);
          applyEffects(`You bought a house for ${money(investment)}. Twelve years later it's worth ${money(future)}. Patience paid.`, { money: future, smarts: 14, discipline: 12, happiness: 14 }, "good");
        } else {
          applyEffects(`You wanted to buy but didn't have the cash. The opportunity passed.`, { smarts: 4, happiness: -4 });
        }
      } },
      { label: "Hide, ride it out", run: () => applyEffects(`You stopped opening account statements. 2012 hit, things came back. You missed the comeback.`, { money: -Math.floor(state.player.money * 0.15), happiness: -8, discipline: 4 }, "bad") }
    ]
  },

  {
    title: "iPhone Launch",
    text: () => `${currentYear(state.player)}. The line at the Apple Store is around the block. $499 for the first iPhone. ${state.player.name} is debating.`,
    when: p => p.age >= 14 && currentYear(p) === 2007 && chance(40),
    choices: [
      { label: "Buy it day one", run: () => applyEffects(`You held the first iPhone. The future fit in your pocket. You knew everything was about to change.`, { money: -499, happiness: 16, fame: 4, looks: 2, smarts: 4 }, "good") },
      { label: "Wait for the second gen", run: () => applyEffects(`You bought the 3G a year later for $199. Smart move. Mostly.`, { money: -199, smarts: 6, discipline: 6 }) }
    ]
  },

  {
    title: "Trump Wins / Obama Era Ends",
    text: () => `November 9, 2016. ${state.player.name}'s timeline is on fire. Half the country is celebrating, the other half is processing.`,
    when: p => p.age >= 16 && currentYear(p) === 2016 && chance(60),
    choices: [
      { label: "Engage online aggressively", run: () => applyEffects(`Your timeline became a war zone. You unfollowed 60 people. Gained 200. Felt nothing.`, { fame: 6, happiness: -8, karma: -4, smarts: 4 }) },
      { label: "Log off, focus on your life", run: () => applyEffects(`You deleted the apps for 6 months. Started running. Read books. Best decision of the year.`, { discipline: 12, happiness: 10, health: 6, smarts: 6 }, "good") }
    ]
  },

  {
    title: "COVID Lockdown",
    text: () => `March 2020. Schools closed. Bars closed. Restaurants closed. ${state.player.name} is suddenly working / studying / parenting from home.`,
    when: p => p.age >= 10 && currentYear(p) >= 2020 && currentYear(p) <= 2021 && chance(70),
    choices: [
      { label: "Start a side hustle online", run: () => {
        if (chance(40)) {
          const earned = randomInt(8000, 80000);
          addCanonEvent(`Built a real side hustle during COVID. ${money(earned)} cleared.`, "good");
          applyEffects(`Pandemic shop / consulting / Etsy / dropshipping. It worked. ${money(earned)} cleared. New career.`, { money: earned, smarts: 10, discipline: 12, happiness: 14, fame: 6 }, "good");
        } else {
          applyEffects(`You tried, it didn't catch. Three months wasted. Bread baking instead.`, { smarts: 8, discipline: 4, happiness: -2 });
        }
      } },
      { label: "Spiral with sourdough and Tiger King", run: () => applyEffects(`You baked 14 loaves. Watched Tiger King twice. Gained 18 pounds. Came out a different person.`, { health: -8, looks: -3, happiness: 4, smarts: 4 }) },
      { label: "Volunteer with food drives", run: () => applyEffects(`Three days a week at the food bank. Met new people. The neighborhood remembered who showed up.`, { karma: 20, fame: 4, happiness: 10, discipline: 8 }, "good") }
    ]
  },

  {
    title: "George Floyd Summer",
    text: () => `June 2020. Cities on fire. Cameras everywhere. ${state.player.name} has a choice about what to do this summer.`,
    when: p => p.age >= 14 && currentYear(p) === 2020 && chance(45),
    choices: [
      { label: "March in the streets", run: () => applyEffects(`You marched. Got tear-gassed once. Made friends you'd never have made. The summer reshaped you.`, { politicalCapital: 14, karma: 18, happiness: 8, discipline: 6, fame: 4 }, "good") },
      { label: "Donate and post", run: () => applyEffects(`Sent the donations. Black square on the grid. Logged off the rest of the year.`, { karma: 6, fame: 2, money: -randomInt(50, 500) }) },
      { label: "Stay out of it", run: () => applyEffects(`You watched the news from home. Felt complicated about it. Said nothing.`, { discipline: 2, karma: -3, happiness: -4 }) }
    ]
  },

  {
    title: "Crypto Boom",
    text: () => `${currentYear(state.player)}. Bitcoin is at ${pick(["$30K", "$60K", "$45K", "$20K"])}. Everyone's cousin made a million on shitcoins. ${state.player.name} can still get in.`,
    when: p => p.age >= 18 && currentYear(p) >= 2017 && currentYear(p) <= 2022 && state.player.money >= 1000 && chance(20),
    choices: [
      { label: "All in on BTC", run: () => {
        const investment = Math.min(state.player.money, randomInt(2000, 30000));
        state.player.money -= investment;
        const swing = randomInt(20, 50) / 10;
        const result = Math.floor(investment * swing);
        if (swing > 2.5) {
          applyEffects(`Crypto ran. ${money(investment)} → ${money(result)}. You sold or you didn't.`, { money: result, smarts: 6, happiness: 12, fame: 4 }, "good");
        } else {
          applyEffects(`Crypto crashed. ${money(investment)} → ${money(result)}. Brutal lesson.`, { money: result, happiness: -10, smarts: 10 }, "bad");
        }
      } },
      { label: "Buy a meme coin", run: () => {
        const stake = Math.min(state.player.money, randomInt(500, 5000));
        state.player.money -= stake;
        if (chance(15)) {
          const won = stake * randomInt(50, 400);
          addCanonEvent(`Hit a meme coin lottery for ${money(won)}.`, "good");
          applyEffects(`You hit. ${money(stake)} → ${money(won)}. Bought a house with it.`, { money: won, fame: 8, happiness: 25, karma: -2 }, "good");
        } else {
          applyEffects(`Rug pull. Coin went to zero in 4 hours. You learned about smart contracts.`, { money: 0, smarts: 8, happiness: -8 }, "bad");
        }
      } },
      { label: "Pass — it's a bubble", run: () => applyEffects(`You stayed out. Watched friends moon and crash. Slept better than them.`, { discipline: 8, smarts: 4 }) }
    ]
  },

  {
    title: "AI Boom",
    text: () => `${currentYear(state.player)}. ChatGPT-style AI is in every meeting. ${state.player.name}'s job is suddenly "at risk" or "10x better" depending on who's talking.`,
    when: p => p.age >= 18 && currentYear(p) >= 2023 && currentYear(p) <= 2030 && chance(25),
    choices: [
      { label: "Learn the tools, become the AI person at work", run: () => applyEffects(`Three months of nights. You became the office AI expert. Salary bumped 30%. New title.`, { money: randomInt(15000, 80000), smarts: 14, discipline: 10, fame: 4 }, "good") },
      { label: "Build something with AI", run: () => {
        if (chance(35)) {
          const exit = randomInt(50000, 800000);
          addCanonEvent(`Built and sold an AI tool for ${money(exit)}.`, "good");
          applyEffects(`Built a tool, posted it, sold it for ${money(exit)}. The wave was real.`, { money: exit, fame: 18, happiness: 22, discipline: 10 }, "good");
        } else {
          applyEffects(`Built a tool. Six months in, nobody used it. The next one was better.`, { smarts: 12, discipline: 8, money: -randomInt(500, 5000), happiness: -4 });
        }
      } },
      { label: "Refuse to use it", run: () => applyEffects(`You stayed on principle. The team without you scaled 5x. You got managed out by Q4.`, { discipline: 8, karma: 6, happiness: -10, money: -randomInt(10000, 60000) }, "bad") }
    ]
  },

  // ============================================================
  // CHILDREN ARCS — kids grow up, hit milestones, become people
  // Each event finds the player's youngest qualifying child
  // ============================================================

  {
    title: "Your Kid's First Word",
    text: () => {
      const kid = state.player.children.find(c => c.age >= 1 && c.age <= 2 && !c.milestonesReached?.firstWord);
      return `${kid?.name || "Your kid"} said their first word today.`;
    },
    when: p => p.children.some(c => c.age >= 1 && c.age <= 2 && !c.milestonesReached?.firstWord) && chance(80),
    choices: [
      { label: "Capture it on film", run: () => {
        const kid = state.player.children.find(c => c.age >= 1 && c.age <= 2 && !c.milestonesReached?.firstWord);
        if (kid) {
          kid.milestonesReached = kid.milestonesReached || {};
          kid.milestonesReached.firstWord = true;
        }
        addCanonEvent(`${kid?.name}'s first word.`, "good");
        applyEffects(`The word was ${pick(["mama", "dada", "no", "cat", "more", "bye"])}. You'll watch the video 200 times.`, { happiness: 18, karma: 4 }, "good");
      } },
      { label: "Be there but no phone out", run: () => {
        const kid = state.player.children.find(c => c.age >= 1 && c.age <= 2 && !c.milestonesReached?.firstWord);
        if (kid) {
          kid.milestonesReached = kid.milestonesReached || {};
          kid.milestonesReached.firstWord = true;
        }
        applyEffects(`No video. Just you, them, the moment. Best decision.`, { happiness: 14, karma: 8, discipline: 4 }, "good");
      } }
    ]
  },

  {
    title: "First Day of School",
    text: () => {
      const kid = state.player.children.find(c => c.age === 5 && !c.milestonesReached?.school);
      return `${kid?.name || "Your kid"} starts kindergarten today. Backpack bigger than they are.`;
    },
    when: p => p.children.some(c => c.age === 5 && !c.milestonesReached?.school) && chance(80),
    choices: [
      { label: "Walk them in, take the photo", run: () => {
        const kid = state.player.children.find(c => c.age === 5 && !c.milestonesReached?.school);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).school = true;
        addCanonEvent(`${kid?.name} started school.`, "good");
        applyEffects(`You cried in the car. The photo is going in the album. They didn't look back.`, { happiness: 14, karma: 6 }, "good");
      } },
      { label: "Drop them at the curb, head to work", run: () => {
        const kid = state.player.children.find(c => c.age === 5 && !c.milestonesReached?.school);
        if (kid) {
          (kid.milestonesReached = kid.milestonesReached || {}).school = true;
          changeBond(state.player.relationships.find(r => r.name === kid.name) || {}, -4);
        }
        applyEffects(`The day moved fast. They told you about it at dinner. You half-listened.`, { happiness: -3, discipline: 3 }) }
      }
    ]
  },

  {
    title: "Your Kid's First Crush",
    text: () => {
      const kid = state.player.children.find(c => c.age >= 10 && c.age <= 13 && !c.milestonesReached?.crush);
      return `${kid?.name || "Your kid"} came home weird. Won't talk. Phone keeps buzzing.`;
    },
    when: p => p.children.some(c => c.age >= 10 && c.age <= 13 && !c.milestonesReached?.crush) && chance(60),
    choices: [
      { label: "Ask about it carefully", run: () => {
        const kid = state.player.children.find(c => c.age >= 10 && c.age <= 13 && !c.milestonesReached?.crush);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).crush = true;
        const rel = state.player.relationships.find(r => r.name === kid?.name);
        if (rel) changeBond(rel, 10);
        applyEffects(`${kid?.name} told you everything. You're now Trusted Adult #1.`, { happiness: 10, karma: 8 }, "good");
      } },
      { label: "Give them space", run: () => {
        const kid = state.player.children.find(c => c.age >= 10 && c.age <= 13 && !c.milestonesReached?.crush);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).crush = true;
        applyEffects(`You didn't pry. They figured it out themselves. They told you 4 years later.`, { discipline: 6 }) }
      }
    ]
  },

  {
    title: "Teen Rebellion",
    text: () => {
      const kid = state.player.children.find(c => c.age >= 14 && c.age <= 17 && !c.milestonesReached?.rebellion);
      return `${kid?.name || "Your teen"} got caught ${pick(["smoking on the porch", "sneaking out at 2AM", "skipping school", "lying about where they were", "fighting at school"])}.`;
    },
    when: p => p.children.some(c => c.age >= 14 && c.age <= 17 && !c.milestonesReached?.rebellion) && chance(45),
    choices: [
      { label: "Crack down hard", run: () => {
        const kid = state.player.children.find(c => c.age >= 14 && c.age <= 17 && !c.milestonesReached?.rebellion);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).rebellion = true;
        const rel = state.player.relationships.find(r => r.name === kid?.name);
        if (rel) changeBond(rel, -15);
        applyEffects(`Phone gone. Grounded. Three months of silence between you.`, { happiness: -8, discipline: 6 }, "bad");
      } },
      { label: "Talk it through, no punishment", run: () => {
        const kid = state.player.children.find(c => c.age >= 14 && c.age <= 17 && !c.milestonesReached?.rebellion);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).rebellion = true;
        const rel = state.player.relationships.find(r => r.name === kid?.name);
        if (rel) changeBond(rel, 14);
        applyEffects(`You sat with them. Asked what was going on. The truth came out slowly. Bond locked.`, { happiness: 10, karma: 12, smarts: 4 }, "good");
      } }
    ]
  },

  {
    title: "Kid's Graduation",
    text: () => {
      const kid = state.player.children.find(c => c.age === 18 && !c.milestonesReached?.graduation);
      return `${kid?.name || "Your kid"} is graduating high school. Cap and gown. You're in the third row.`;
    },
    when: p => p.children.some(c => c.age === 18 && !c.milestonesReached?.graduation) && chance(85),
    choices: [
      { label: "Throw the biggest party", run: () => {
        const kid = state.player.children.find(c => c.age === 18 && !c.milestonesReached?.graduation);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).graduation = true;
        const rel = state.player.relationships.find(r => r.name === kid?.name);
        if (rel) changeBond(rel, 14);
        addCanonEvent(`${kid?.name} graduated. Big party.`, "good");
        applyEffects(`50 people. Tents in the backyard. ${kid?.name} cried during your speech. Photos for life.`, { money: -randomInt(2000, 8000), happiness: 22, karma: 8 }, "good");
      } },
      { label: "Dinner with family only", run: () => {
        const kid = state.player.children.find(c => c.age === 18 && !c.milestonesReached?.graduation);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).graduation = true;
        const rel = state.player.relationships.find(r => r.name === kid?.name);
        if (rel) changeBond(rel, 8);
        applyEffects(`Steakhouse, eight people, real conversation. The right amount.`, { money: -randomInt(200, 800), happiness: 14 }, "good");
      } }
    ]
  },

  {
    title: "Kid Moves Out",
    text: () => {
      const kid = state.player.children.find(c => c.age >= 18 && c.age <= 22 && !c.milestonesReached?.movedOut);
      return `${kid?.name || "Your kid"} is moving out. Their boxes are in the hallway. ${pick(["First apartment", "Dorm", "Moving in with a partner", "Across the country for work"])}.`;
    },
    when: p => p.children.some(c => c.age >= 18 && c.age <= 22 && !c.milestonesReached?.movedOut) && chance(70),
    choices: [
      { label: "Help with deposit + first month", run: () => {
        const kid = state.player.children.find(c => c.age >= 18 && c.age <= 22 && !c.milestonesReached?.movedOut);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).movedOut = true;
        const rel = state.player.relationships.find(r => r.name === kid?.name);
        if (rel) changeBond(rel, 10);
        applyEffects(`You wrote the check for deposit + first month. They tried to refuse. You insisted.`, { money: -randomInt(2000, 6000), happiness: 10, karma: 10 }, "good");
      } },
      { label: "Tough love — figure it out", run: () => {
        const kid = state.player.children.find(c => c.age >= 18 && c.age <= 22 && !c.milestonesReached?.movedOut);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).movedOut = true;
        applyEffects(`You said "you'll figure it out." They did. Six months later they called to say thanks.`, { discipline: 8, happiness: 4 }, "good");
      } }
    ]
  },

  {
    title: "Your Kid Gets Married",
    text: () => {
      const kid = state.player.children.find(c => c.age >= 22 && !c.milestonesReached?.married);
      return `${kid?.name || "Your kid"} is getting married. Save the date came. You'll be giving them away or walking them down the aisle.`;
    },
    when: p => p.children.some(c => c.age >= 22 && !c.milestonesReached?.married) && chance(20),
    choices: [
      { label: "Pay for the whole thing", run: () => {
        const kid = state.player.children.find(c => c.age >= 22 && !c.milestonesReached?.married);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).married = true;
        addCanonEvent(`${kid?.name} got married. You paid for the wedding.`, "good");
        applyEffects(`200 people. Open bar. Your speech ran 6 minutes too long. They cried. So did you.`, { money: -randomInt(25000, 100000), happiness: 24, karma: 8 }, "good");
      } },
      { label: "Contribute what you can", run: () => {
        const kid = state.player.children.find(c => c.age >= 22 && !c.milestonesReached?.married);
        if (kid) (kid.milestonesReached = kid.milestonesReached || {}).married = true;
        applyEffects(`You wrote a $5K check. Made the toast. Their other side paid the rest. Everyone won.`, { money: -randomInt(1500, 8000), happiness: 18, karma: 6 }, "good");
      } }
    ]
  },

  // ============================================================
  // FAMILY TREE — grandparents, parents aging, cousins, in-laws
  // ============================================================

  {
    title: "Grandma's Funeral",
    text: () => `Grandma passed at ${randomInt(76, 92)}. The whole family is flying in. ${state.player.name} is helping plan.`,
    when: p => p.age >= 10 && p.age <= 50 && !p.grandmaPassed && chance(8),
    choices: [
      { label: "Speak at the service", run: () => {
        state.player.grandmaPassed = true;
        addCanonEvent(`Grandma passed. ${state.player.name} spoke at the service.`, "bad");
        applyEffects(`You wrote it Wednesday night. You read it Saturday at 11AM. The room was silent. She would have loved it.`, { happiness: -10, karma: 16, smarts: 6, money: state.player.spawnClass === "nepo" ? randomInt(10000, 80000) : randomInt(800, 5000) }, "good");
      } },
      { label: "Stay quiet, help with logistics", run: () => {
        state.player.grandmaPassed = true;
        applyEffects(`You handled the rentals, the catering, the seating. Family noticed. Family remembered.`, { karma: 12, discipline: 8, happiness: -8 }) }
      }
    ]
  },

  {
    title: "Grandpa's Last Visit",
    text: () => `Grandpa is in hospice. ${pick(["Stage 4", "Heart's giving out", "Pneumonia", "Just tired"])}. Family says go now.`,
    when: p => p.age >= 14 && p.age <= 45 && !p.grandpaPassed && chance(7),
    choices: [
      { label: "Fly out, sit with him", run: () => {
        state.player.grandpaPassed = true;
        addCanonEvent(`Sat with Grandpa his last week.`, "good");
        applyEffects(`Five days. Stories you never heard. The last conversation lasted 3 hours. You'll carry it.`, { money: -randomInt(400, 2000), karma: 18, smarts: 8, happiness: -6 }, "good");
      } },
      { label: "Send flowers, call", run: () => {
        state.player.grandpaPassed = true;
        applyEffects(`You called twice. Said the things. Felt the regret later.`, { karma: 4, money: -randomInt(100, 400), happiness: -10 }, "bad");
      } }
    ]
  },

  {
    title: "Mom Gets Dementia",
    text: () => {
      const mom = state.player.relationships.find(r => r.role?.toLowerCase().includes("mom") || r.role?.toLowerCase().includes("mother"));
      return `${mom?.name || "Mom"} keeps forgetting things. The doctor said it. Early stage. There's no good version of this.`;
    },
    when: p => p.age >= 35 && p.age <= 65 && p.relationships.some(r => r.id === "guardian" || (r.role || "").toLowerCase().includes("mother")) && !p.parentSick && chance(8),
    choices: [
      { label: "Move closer, become caregiver", run: () => {
        state.player.parentSick = true;
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) changeBond(mom, 15);
        applyEffects(`You restructured your life. Bond deepened. Career paused. No regrets, just exhaustion.`, { karma: 20, money: -randomInt(20000, 100000), happiness: 4, discipline: 8 }, "good");
      } },
      { label: "Hire help, keep visiting", run: () => {
        state.player.parentSick = true;
        applyEffects(`In-home care. You visit twice a week. Guilt manages it. Money manages care.`, { money: -randomInt(40000, 200000), happiness: -8, karma: 8 });
      } },
      { label: "Put her in a home", run: () => {
        state.player.parentSick = true;
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) changeBond(mom, -8);
        applyEffects(`Memory care facility. You visit Sundays. She doesn't always know you. Practical, painful, necessary.`, { money: -randomInt(60000, 250000), happiness: -16, discipline: 6 }, "bad");
      } }
    ]
  },

  {
    title: "Cousin Lands in Your City",
    text: () => `Your cousin ${pick(["Nia", "Marcus", "Crystal", "DeShawn", "Ari"])} is moving to ${originOf(state.player.location).short} for ${pick(["college", "a job", "to escape something", "an art residency"])}. They need a place to crash for a month.`,
    when: p => p.age >= 18 && chance(8),
    choices: [
      { label: "Take them in", run: () => {
        const name = pick(["Nia", "Marcus", "Crystal", "DeShawn", "Ari", "Kai", "Sage"]);
        state.player.relationships.push({ id: `cousin-${Date.now()}`, name, role: `Cousin (staying with you)`, bond: randomInt(58, 80), type: "family" });
        applyEffects(`${name} moved in. The apartment got loud. The fridge got emptier. The bond got real.`, { karma: 10, happiness: 8, money: -randomInt(400, 1800) }, "good");
      } },
      { label: "Help them find a place instead", run: () => applyEffects(`You scrolled apartments together. Co-signed a lease. They got their own place by week 2.`, { karma: 6, money: -randomInt(800, 3000) }) }
    ]
  },

  {
    title: "In-Law Drama",
    text: () => {
      const spouse = state.player.relationships.find(r => r.type === "spouse");
      return `${spouse?.name || "Your spouse"}'s mother showed up unannounced. She has opinions about ${pick(["your house", "your job", "your parenting", "your money", "your weight"])}.`;
    },
    when: p => p.married && chance(12),
    choices: [
      { label: "Stand your ground", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse && chance(50)) {
          changeBond(spouse, 12);
          applyEffects(`Spouse backed you publicly. MIL went home angry. Marriage stronger.`, { happiness: 10, discipline: 6 }, "good");
        } else {
          if (spouse) changeBond(spouse, -10);
          applyEffects(`Spouse defended their mom. You ate dinner alone. Cold weekend.`, { happiness: -10, karma: 2 }, "bad");
        }
      } },
      { label: "Smile and absorb", run: () => {
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) changeBond(spouse, 4);
        applyEffects(`Two hours of bite-marks on your tongue. Marriage points earned. Therapy bill coming.`, { happiness: -8, karma: 6, discipline: 10 }) }
      }
    ]
  },

  {
    title: "Sibling Asks for Money",
    text: () => {
      const sib = state.player.relationships.find(r => r.role === "Sibling" || r.id === "sibling");
      return `${sib?.name || "Your sibling"} needs ${money(randomInt(2000, 25000))}. They're in something — eviction / medical / debt / business.`;
    },
    when: p => p.age >= 22 && p.relationships.some(r => r.id === "sibling") && p.money >= 3000 && chance(10),
    choices: [
      { label: "Send it, no questions", run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        const amt = randomInt(2000, 25000);
        if (sib) changeBond(sib, 8);
        applyEffects(`You wired it. They cried. The bond got real. Money might or might not come back.`, { money: -amt, karma: 12, happiness: 4 }, "good");
      } },
      { label: "Send half, have a real conversation", run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        const amt = randomInt(1000, 12000);
        if (sib) changeBond(sib, 4);
        applyEffects(`Half the money + an hour on the phone about what's actually going on. Both helped.`, { money: -amt, karma: 8, smarts: 4 }, "good");
      } },
      { label: "Decline", run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        if (sib) changeBond(sib, -18);
        applyEffects(`You said no. They didn't call again for a year.`, { discipline: 6, karma: -6, happiness: -8 }, "bad");
      } }
    ]
  },

  // ============================================================
  // HEALTH / ADDICTION ARCS — chronic conditions, recovery cycles
  // ============================================================

  {
    title: "Depression Spiral",
    text: () => `Something's been off for months. ${state.player.name} can't get out of bed some days. Showers feel optional. Work suffers.`,
    when: p => p.age >= 16 && p.stats.happiness < 35 && !p.depressionPhase && chance(15),
    choices: [
      { label: "Therapy + medication", run: () => {
        state.player.depressionPhase = "treating";
        applyEffects(`SSRI prescription. Weekly therapy. Three months in, the floor came back under you.`, { money: -randomInt(2000, 12000), happiness: 14, discipline: 6, smarts: 4 }, "good");
      } },
      { label: "Push through alone", run: () => {
        state.player.depressionPhase = "untreated";
        applyEffects(`You tried to white-knuckle it. Months blurred. Friends noticed.`, { happiness: -8, health: -6, discipline: 2 }, "bad");
      } },
      { label: "Lean into drinking", run: () => {
        state.player.depressionPhase = "spiral";
        state.player.risksTaken += 1;
        applyEffects(`The drink at 5PM became the drink at noon. Six months in, you weighed 20 pounds different.`, { happiness: 2, health: -12, looks: -4, discipline: -8 }, "bad");
      } }
    ]
  },

  {
    title: "Cancer Diagnosis",
    text: () => `The labs came back. The doctor said the C word. ${state.player.name} called nobody for two days.`,
    when: p => p.age >= 28 && !p.quirks?.cancer && chance(2),
    cooldown: 99,
    tags: ["family", "drama"],
    choices: [
      { label: "Start treatment immediately", run: () => {
        state.player.quirks = state.player.quirks || {};
        state.player.quirks.cancer = true;
        addCanonEvent(`${state.player.name} got diagnosed with cancer.`, "bad");
        applyEffects(`Chemo schedule locked. Hair gone in 4 weeks. Mom moved in to help.`, { health: -22, happiness: -18, money: -randomInt(8000, 60000), discipline: 8, karma: 4 }, "bad");
      } },
      { label: "Get a second opinion", run: () => {
        if (chance(35)) {
          applyEffects(`Second opinion confirmed it. You started treatment a month later. That month cost.`, { health: -28, happiness: -20, money: -randomInt(10000, 70000) }, "bad");
          state.player.quirks = state.player.quirks || {};
          state.player.quirks.cancer = true;
          addCanonEvent(`${state.player.name} got diagnosed with cancer.`, "bad");
        } else {
          applyEffects(`Second doctor caught a mistake. You're not sick. You went home and cried in the parking lot anyway.`, { happiness: -8, smarts: 4, karma: 4 }, "good");
        }
      } }
    ]
  },
  {
    title: "Diabetes Diagnosis",
    text: () => `Doctor's office. Type 2 diabetes. ${state.player.name}'s blood sugar was off the charts. Insulin, diet, the whole new life ahead.`,
    when: p => p.age >= 40 && p.dietScore < 40 && !p.diabetic && chance(20),
    choices: [
      { label: "Full lifestyle overhaul", run: () => {
        state.player.diabetic = true;
        state.player.diabeticManaging = true;
        applyEffects(`Trainer, dietitian, daily glucose checks. 8 months later you're a different shape. Reversed pre-diabetes.`, { money: -randomInt(4000, 18000), health: 16, looks: 4, discipline: 14, happiness: 8 }, "good");
      } },
      { label: "Take the meds, change minimally", run: () => {
        state.player.diabetic = true;
        applyEffects(`Metformin, occasional walks. Manage but don't fix. Body keeps deteriorating slowly.`, { money: -randomInt(2000, 8000), health: -2, happiness: -2 });
      } },
      { label: "Deny and ignore", run: () => {
        state.player.diabetic = true;
        applyEffects(`You skipped the appointment. Three years from now, an ER visit will remind you.`, { health: -10, happiness: 2, discipline: -4 }, "bad");
      } }
    ]
  },

  {
    title: "Sober October → Year One",
    text: () => `${state.player.name} hasn't had a drink in 30 days. Friends are asking. It's the longest stretch since college.`,
    when: p => p.age >= 22 && p.risksTaken >= 3 && !p.sober && chance(15),
    choices: [
      { label: "Keep going — make it a year", run: () => {
        state.player.sober = true;
        addCanonEvent(`Got sober. Hardest year of their life.`, "good");
        applyEffects(`365 days. AA meetings. Two friends got weird. Three friends got closer. Body and mind reset.`, { health: 16, discipline: 18, happiness: 14, looks: 4 }, "good");
      } },
      { label: "Moderation, not abstinence", run: () => {
        applyEffects(`You drink 2-3 times a month now. Sustainable. Healthier. The middle path.`, { health: 6, discipline: 8, happiness: 6 }, "good");
      } },
      { label: "Off the wagon hard", run: () => {
        state.player.risksTaken += 2;
        applyEffects(`The first drink turned into a weekend. Then a month. Damage in days.`, { health: -10, happiness: 4, discipline: -10 }, "bad");
      } }
    ]
  },

  {
    title: "Addiction Relapse",
    text: () => `${state.player.name} was clean. Then the stress hit. ${pick(["A coworker died", "A relationship ended", "A parent diagnosis", "A money crisis"])}. The bottle / pipe / pill is on the table.`,
    when: p => p.age >= 22 && (p.sober || p.smokingLevel > 0) && p.stats.happiness < 30 && chance(20),
    choices: [
      { label: "Call your sponsor / friend", run: () => {
        applyEffects(`You picked up the phone instead of the bottle. They came over. You didn't use that night.`, { karma: 12, discipline: 14, happiness: 10 }, "good");
      } },
      { label: "Use, hide it from everyone", run: () => {
        state.player.sober = false;
        state.player.risksTaken += 2;
        applyEffects(`You used. Nobody knew for 6 months. Then everyone knew at once.`, { happiness: 4, health: -16, discipline: -12, karma: -4 }, "bad");
      } },
      { label: "Go to a meeting that night", run: () => {
        applyEffects(`You sat in the back at the 8PM meeting. Cried during someone else's share. Stayed sober.`, { karma: 8, discipline: 12, happiness: 8 }, "good");
      } }
    ]
  },

  {
    title: "Anxiety Attack at Work",
    text: () => `Mid-presentation, ${state.player.name}'s chest tightened. Heart racing. Couldn't catch breath. Excused yourself to the bathroom.`,
    when: p => p.age >= 18 && p.stats.happiness < 50 && p.jobId !== "none" && !p.anxietyAcknowledged && chance(15),
    choices: [
      { label: "Talk to a therapist", run: () => {
        state.player.anxietyAcknowledged = true;
        applyEffects(`Three months of CBT. You named the pattern. The attacks shrank from monthly to yearly.`, { money: -randomInt(1500, 6000), happiness: 12, smarts: 8, discipline: 8 }, "good");
      } },
      { label: "Tough it out — don't tell anyone", run: () => {
        state.player.anxietyAcknowledged = true;
        applyEffects(`You pretended it didn't happen. It kept happening. You learned to function around it.`, { discipline: 6, happiness: -8, smarts: 2 }) }
      },
      { label: "Quit the job", run: () => {
        state.player.anxietyAcknowledged = true;
        state.player.jobId = "none";
        applyEffects(`You quit Tuesday morning. The attacks stopped. The savings drained. Both true.`, { happiness: 8, discipline: 4, money: -randomInt(2000, 12000) }, "good");
      } }
    ]
  },

  {
    title: "Eating Disorder Confrontation",
    text: () => `A friend pulled ${state.player.name} aside. "Be honest with me. Are you okay?" They've been counting your skipped meals.`,
    when: p => p.age >= 14 && p.age <= 35 && p.dietScore < 28 && !p.edAcknowledged && chance(12),
    choices: [
      { label: "Tell them the truth", run: () => {
        state.player.edAcknowledged = true;
        applyEffects(`You said the things you've never said. They cried first. You cried longer. Treatment program started in March.`, { money: -randomInt(8000, 60000), health: 12, happiness: 14, discipline: 8 }, "good");
      } },
      { label: "Deny it", run: () => {
        state.player.edAcknowledged = true;
        applyEffects(`You laughed it off. They watched you closer for years. The pattern got worse before it got better.`, { health: -8, happiness: -6, looks: -2 }, "bad");
      } }
    ]
  },

  {
    title: "Burnout Wall",
    text: () => `${state.player.name} can't focus. Three coffees, still can't read a paragraph. The body's announcing burnout.`,
    when: p => p.age >= 25 && p.stats.discipline >= 70 && p.stats.happiness < 45 && !p.burnoutHit && chance(15),
    choices: [
      { label: "Take a 3-week sabbatical", run: () => {
        state.player.burnoutHit = true;
        applyEffects(`You disappeared for 3 weeks. Came back rebuilt. Boss respected it.`, { money: -randomInt(2000, 12000), happiness: 18, health: 10, discipline: -4, smarts: 4 }, "good");
      } },
      { label: "Push through harder", run: () => {
        state.player.burnoutHit = true;
        applyEffects(`You doubled down. Three months later, real depression. Body forced what mind wouldn't.`, { health: -12, happiness: -16, discipline: -8 }, "bad");
      } },
      { label: "Quit and figure it out", run: () => {
        state.player.burnoutHit = true;
        state.player.jobId = "none";
        applyEffects(`You walked into the boss's office and quit Tuesday. Scary, freeing, honest.`, { happiness: 8, discipline: 4, money: 0 }, "good");
      } }
    ]
  },

  // ============================================================
  // PET ARCS
  // ============================================================
  {
    title: "Pet's Last Day",
    text: () => {
      const pet = state.player.pets?.find(p => (p.years || 0) >= 12);
      return `${pet?.name || "Your pet"} can't get up the stairs anymore. The vet said it's time.`;
    },
    when: p => p.pets?.some(pet => (pet.years || 0) >= 12) && chance(35),
    choices: [
      { label: "Hold them at the end", run: () => {
        const pet = state.player.pets?.find(p => (p.years || 0) >= 12);
        if (pet) state.player.pets = state.player.pets.filter(x => x !== pet);
        addCanonEvent(`${pet?.name || "A pet"} passed in your arms.`, "bad");
        applyEffects(`You held them. You cried in the parking lot for an hour. You'll feel their absence at the door for years.`, { happiness: -16, karma: 12, money: -randomInt(200, 1500) }, "good");
      } },
      { label: "Have the vet handle it", run: () => {
        const pet = state.player.pets?.find(p => (p.years || 0) >= 12);
        if (pet) state.player.pets = state.player.pets.filter(x => x !== pet);
        applyEffects(`You said goodbye in the parking lot. Walked away. Felt it more on the third day.`, { happiness: -12, money: -randomInt(150, 800) }, "bad");
      } }
    ]
  },
  {
    title: "Pet Runs Away",
    text: () => {
      const pet = state.player.pets?.[0];
      return `${pet?.name || "Your pet"} got out. Front door for 4 seconds. Hours of flyers, knocking on doors.`;
    },
    when: p => p.pets?.length >= 1 && chance(8),
    choices: [
      { label: "Search the whole neighborhood", run: () => {
        if (chance(60)) {
          applyEffects(`Found them two blocks away under a porch. Reunion was filmable. Felt new gratitude.`, { happiness: 14, karma: 6, health: -2 }, "good");
        } else {
          const pet = state.player.pets?.[0];
          if (pet) state.player.pets = state.player.pets.filter(x => x !== pet);
          applyEffects(`Three weeks of looking. They never came back. You still pause when you see similar ones.`, { happiness: -14, karma: 4 }, "bad");
        }
      } },
      { label: "Post flyers, hope", run: () => {
        if (chance(35)) {
          applyEffects(`Someone called Tuesday. They were in the shelter. ${money(randomInt(80, 250))} adoption fee. Worth it.`, { money: -randomInt(80, 250), happiness: 12 }, "good");
        } else {
          const pet = state.player.pets?.[0];
          if (pet) state.player.pets = state.player.pets.filter(x => x !== pet);
          applyEffects(`No call ever came. You still have their collar in a drawer.`, { happiness: -10, karma: 2 }, "bad");
        }
      } }
    ]
  },

  // ============================================================
  // OLD AGE CONTENT (70+)
  // ============================================================
  {
    title: "The Thing You Finally Said",
    text: () => {
      const fam = state.player.relationships.find(r => r.type === "family" && r.bond < 70);
      return `${fam?.name || "Family"} is in town. ${state.player.name} is ${state.player.age}. Time isn't infinite. The thing you've never said is sitting there.`;
    },
    when: p => p.age >= 70 && p.relationships.some(r => r.type === "family") && !p.saidTheThing && chance(35),
    choices: [
      { label: "Say it. All of it.", run: () => {
        state.player.saidTheThing = true;
        const fam = state.player.relationships.find(r => r.type === "family" && r.bond < 70);
        if (fam) changeBond(fam, 30);
        addCanonEvent(`Said the thing they'd never said. Decades of weight came off.`, "good");
        applyEffects(`You said it. They cried. You cried. The fifty years before this conversation just got rewritten.`, { happiness: 22, karma: 18, discipline: 6 }, "good");
      } },
      { label: "Take it to your grave", run: () => {
        state.player.saidTheThing = true;
        applyEffects(`You kept it locked. They left the visit not knowing. You'll carry it the rest of the way.`, { discipline: 4, karma: -6, happiness: -8 }, "bad");
      } }
    ]
  },
  {
    title: "Grandkid's First Visit",
    text: () => `Your grandkid is here. They're ${randomInt(2, 6)}. Sticky hands. Asking if you have any candy.`,
    when: p => p.age >= 60 && p.children?.length >= 1 && chance(20),
    choices: [
      { label: "Feed them candy, become favorite", run: () => applyEffects(`You broke every rule the parents set. Grandkid is YOURS now.`, { happiness: 22, karma: 8 }, "good") },
      { label: "Be the responsible one", run: () => applyEffects(`Apple slices instead. The parents thanked you. Kid still likes you, less.`, { happiness: 8, karma: 6, discipline: 6 }, "good") }
    ]
  },
  {
    title: "Spouse's Funeral",
    text: () => {
      const spouse = state.player.relationships.find(r => r.type === "spouse");
      return spouse ? `${spouse.name} passed. ${state.player.name} is at the funeral.` : `Your partner of decades passed.`;
    },
    when: p => p.age >= 70 && p.married && !p.widowed && chance(25),
    choices: [
      { label: "Speak at the service", run: () => {
        state.player.widowed = true;
        state.player.married = false;
        const spouse = state.player.relationships.find(r => r.type === "spouse");
        if (spouse) spouse.role = "Late spouse";
        addCanonEvent(`Widowed at ${state.player.age}.`, "bad");
        applyEffects(`Your voice held. The eulogy was honest. You went home to an empty house and felt a quiet you hadn't felt in decades.`, { happiness: -22, karma: 8, smarts: 4 }, "bad");
      } },
      { label: "Let the kids speak", run: () => {
        state.player.widowed = true;
        state.player.married = false;
        applyEffects(`You sat in the front row and held the program. The kids spoke. You watched them carry it.`, { happiness: -18, karma: 4 }, "bad");
      } }
    ]
  },
  {
    title: "Late-Life Romance",
    text: () => `Someone in ${state.player.name}'s building has been kind. Coffee at 9AM. Companionship at 75.`,
    when: p => p.age >= 65 && p.widowed && !p.relationships.some(r => r.type === "partner") && chance(15),
    choices: [
      { label: "Let yourself love again", run: () => {
        const name = pick(["Dolores", "Hank", "Marisol", "Eli", "Sylvia", "Frank"]);
        state.player.relationships.push({ id: `partner-${Date.now()}`, name, role: "Late-life love", bond: randomInt(70, 90), type: "partner" });
        addCanonEvent(`Found love again at ${state.player.age} with ${name}.`, "good");
        applyEffects(`${name} is your last love. You laugh at things. The bed isn't cold.`, { happiness: 22, looks: 2, karma: 4 }, "good");
      } },
      { label: "Friendship only", run: () => applyEffects(`Coffee twice a week. Cards Wednesdays. Worth it.`, { happiness: 12, karma: 6 }, "good") }
    ]
  },

  // ============================================================
  // RELIGION ARC EVENTS
  // ============================================================
  {
    title: "Faith Crisis",
    text: () => `Something happened that ${state.player.religionLabel || "your faith tradition"} doesn't have an answer for. ${state.player.name} is starting to doubt.`,
    when: p => p.age >= 16 && p.religion && p.religion !== "none" && p.religion !== "atheist" && !p.faithCrisis && chance(12),
    choices: [
      { label: "Lean deeper into the faith", run: () => {
        state.player.faithCrisis = "deepened";
        applyEffects(`You went to the pastor / imam / rabbi. Read the texts harder. Came out on the other side believing more.`, { happiness: 14, discipline: 10, karma: 8 }, "good");
      } },
      { label: "Leave it behind", run: () => {
        state.player.faithCrisis = "left";
        state.player.religion = "none";
        addCanonEvent(`Left ${state.player.religionLabel || "religion"} after a faith crisis.`, "good");
        applyEffects(`You stopped going. Family noticed. You feel the freedom and the loss at the same time.`, { smarts: 10, happiness: 4, karma: -2 }, "good");
      } },
      { label: "Live with the doubt", run: () => {
        state.player.faithCrisis = "doubting";
        applyEffects(`You still showed up. Still went through motions. The doubt stayed in the back row of your mind.`, { smarts: 6, discipline: 4, happiness: -2 });
      } }
    ]
  },
  {
    title: "Religious Awakening",
    text: () => `${state.player.name} stumbled into a service / sermon / meditation that hit different. ${pick(["A friend invited you", "You wandered in alone", "Something in your life broke open"])}.`,
    when: p => p.age >= 18 && (p.religion === "none" || p.religion === "atheist") && p.stats.happiness < 50 && chance(8),
    choices: [
      { label: "Convert, join the community", run: () => {
        const newFaith = pick(["christian", "muslim", "buddhist", "spiritual"]);
        state.player.religion = newFaith;
        state.player.religionLabel = religionLabels[newFaith];
        addCanonEvent(`Found faith at ${state.player.age}. Became ${religionLabels[newFaith]}.`, "good");
        applyEffects(`You converted. New community. New rhythm. Something in you finally rested.`, { happiness: 18, discipline: 12, karma: 10 }, "good");
      } },
      { label: "Stay curious, don't commit", run: () => applyEffects(`You came back three Sundays in a row, then stopped. Stayed in your own head.`, { smarts: 6, happiness: 4 }) }
    ]
  },
  {
    title: "Religious Holiday at Home",
    text: () => `${pick(["Christmas", "Eid", "Diwali", "Passover", "Lunar New Year", "Easter"])} is here. Family expects you home.`,
    when: p => p.age >= 18 && p.religion && p.religion !== "none" && p.religion !== "atheist" && chance(15),
    choices: [
      { label: "Fly home, full participation", run: () => {
        state.player.relationships.filter(r => r.type === "family").forEach(r => changeBond(r, 8));
        applyEffects(`Three days with family. Old foods. Old arguments. Old love. You needed it.`, { money: -randomInt(300, 1500), happiness: 14, karma: 10 }, "good");
      } },
      { label: "Send a card, stay where you are", run: () => {
        state.player.relationships.filter(r => r.type === "family").forEach(r => changeBond(r, -6));
        applyEffects(`You didn't fly. They noticed. They didn't say it, but they felt it.`, { happiness: -6, karma: -4 }) }
      }
    ]
  },

  // ============================================================
  // CLIMATE DISASTERS — fire by city
  // ============================================================
  {
    title: "California Wildfire",
    text: () => `Smoke for two weeks. Friends evacuating. ${state.player.name}'s sky has been orange since Tuesday.`,
    when: p => (p.location.includes("Los Angeles") || p.location === "Hollywood, Los Angeles" || p.location === "Compton, CA" || p.location === "Skid Row, Los Angeles") && currentYear(p) >= 2017 && chance(10),
    choices: [
      { label: "Evacuate", run: () => applyEffects(`You packed essentials, drove inland. Friend's couch for 11 days. Came back, house intact.`, { money: -randomInt(400, 2000), happiness: -8, karma: 4, smarts: 4 }) },
      { label: "Stay, hose down the roof", run: () => {
        if (chance(70)) {
          applyEffects(`House made it. Air ruined your lungs. You'll feel the year for years.`, { health: -8, discipline: 6, happiness: -4 }) ;
        } else {
          applyEffects(`House didn't make it. ${money(randomInt(50000, 300000))} loss. Insurance fight ahead.`, { money: -randomInt(20000, 80000), happiness: -22, discipline: 4 }, "bad");
        }
      } }
    ]
  },
  {
    title: "Hurricane Hits",
    text: () => `${pick(["Cat 4 hurricane", "Tropical storm", "100-year flood"])} hit ${originOf(state.player.location).short}. ${state.player.name}'s power is out. Water rising.`,
    when: p => (p.location === "Miami, FL" || p.location === "Houston, TX" || p.location === "Atlanta, GA") && chance(10),
    choices: [
      { label: "Ride it out", run: () => applyEffects(`Three days no power. Generator died Tuesday. You ate canned food and listened to neighbors check on each other.`, { money: -randomInt(800, 4000), happiness: -6, karma: 4, health: -3 }) },
      { label: "Evacuate", run: () => applyEffects(`Family up north for a week. Pets at a shelter. Came back, house had 3 inches of water. Recovery year.`, { money: -randomInt(8000, 40000), happiness: -10, discipline: 4 }, "bad") }
    ]
  },
  {
    title: "Earthquake / Quake Aftermath",
    text: () => `The ground moved for 38 seconds. ${state.player.name}'s walls cracked. Phone won't connect. Neighbors are in the street.`,
    when: p => (p.location.includes("Los Angeles") || p.location === "Mexico City, Mexico" || p.location === "Tokyo, Japan" || p.location === "Hollywood, Los Angeles") && chance(8),
    choices: [
      { label: "Check on every neighbor", run: () => {
        changeLocalRep(randomInt(5, 12));
        applyEffects(`You knocked on every door. Found two people who needed help. The block remembers.`, { karma: 18, happiness: 6, health: -2 }, "good");
      } },
      { label: "Stay inside, document damage", run: () => applyEffects(`You filed the claim same week. ${money(randomInt(800, 8000))} cleared. Pragmatic.`, { money: randomInt(800, 8000), discipline: 8 }) }
    ]
  },

  // ============================================================
  // MILITARY SERVICE
  // ============================================================
  {
    title: "Recruiter Comes to Your School",
    text: () => `A military recruiter sat down with ${state.player.name} at lunch. They offered ${pick(["college money", "a signing bonus", "a way out", "a guaranteed job"])}.`,
    when: p => p.age >= 17 && p.age <= 19 && (p.spawnClass === "working" || p.spawnClass === "struggling" || p.spawnClass === "survival") && !p.military && chance(15),
    choices: [
      { label: "Sign up", run: () => {
        state.player.military = { stage: "active" };
        addCanonEvent(`Enlisted at ${state.player.age}.`, "good");
        applyEffects(`Basic training in 6 weeks. Your body changed. Your mind changed. The bank account got a signing bonus.`, { money: randomInt(8000, 35000), discipline: 18, health: 14, happiness: 6 }, "good");
      } },
      { label: "Pass — you've got plans", run: () => applyEffects(`You said no thank you. Recruiter kept calling for 3 years. You stayed your course.`, { discipline: 4, smarts: 4 }) }
    ]
  },
  {
    title: "Deployment Orders",
    text: () => `Orders came in. ${pick(["Afghanistan", "Iraq", "Korea", "Germany", "Kuwait"])}. ${state.player.name} ships out in 6 weeks.`,
    when: p => p.military?.stage === "active" && !p.military?.deployed && chance(45),
    choices: [
      { label: "Go", run: () => {
        state.player.military.deployed = true;
        if (chance(75)) {
          state.player.military.stage = "veteran";
          addCanonEvent(`Served a deployment overseas. Came home different.`, "good");
          applyEffects(`14 months. You saw things. You came home with a paycheck, a bronze star, and dreams that don't quit.`, { money: randomInt(40000, 120000), discipline: 14, karma: 8, happiness: -10, health: -6 }, "good");
        } else {
          state.player.military.stage = "veteran";
          state.player.military.injured = true;
          addCanonEvent(`Wounded in combat. Came home a Purple Heart.`, "bad");
          applyEffects(`IED. Three months in a German hospital. You're alive. Most of you. Disability checks start.`, { money: randomInt(60000, 200000), health: -25, happiness: -20, discipline: 10 }, "bad");
        }
      } },
      { label: "AWOL", run: () => {
        state.player.military.stage = "AWOL";
        state.player.record = (state.player.record || 0) + 2;
        applyEffects(`You didn't show. MPs found you 11 days later. Dishonorable discharge. Federal record.`, { record: 2, happiness: -16, karma: -4, money: -randomInt(2000, 10000) }, "bad");
      } }
    ]
  },

  // ============================================================
  // INHERITANCE / NEWGAME+ HINT (the actual NewGame+ is a button)
  // ============================================================
  {
    title: "You Wrote a Will",
    text: () => `${state.player.name} is at the lawyer's office writing a will. Assets, beneficiaries, the kid clause.`,
    when: p => p.age >= 50 && p.children?.length > 0 && !p.willWritten && chance(15),
    choices: [
      { label: "Split equally among kids", run: () => {
        state.player.willWritten = "equal";
        applyEffects(`Everything split equally. Fair on paper, complicated in family group chats.`, { karma: 8, discipline: 8, money: -randomInt(800, 4000) }, "good");
      } },
      { label: "Pick a favorite, write the rest out", run: () => {
        state.player.willWritten = "favorite";
        applyEffects(`The favorite gets 80%. Others get 5% each. Lawyer asked twice if you were sure.`, { karma: -10, discipline: 6, money: -randomInt(800, 4000) }, "bad");
      } },
      { label: "Donate it all", run: () => {
        state.player.willWritten = "donated";
        addCanonEvent(`Left the entire estate to charity.`, "good");
        applyEffects(`The whole estate goes to ${pick(["the food bank", "the school you went to", "a homeless shelter", "a music nonprofit"])}. Kids will be furious. Karma flexes.`, { karma: 30, discipline: 10, money: -randomInt(800, 4000) }, "good");
      } }
    ]
  },

  // ============================================================
  // TEXT FROM X — random NPCs hit your phone
  // ============================================================
  {
    title: () => {
      const p = pickActiveNpc();
      return p ? `Text from ${p.name}` : "Phone buzzes";
    },
    text: () => {
      const p = pickActiveNpc();
      if (!p) return "Your phone buzzed.";
      const lines = {
        warm: pick([`"hey love, just thinking about you"`, `"you been eating?"`, `"call me when you get a sec ❤️"`]),
        rough: pick([`"yo u up"`, `"pull up later, got something to tell you"`, `"need a ride at 11"`]),
        dry: pick([`"interesting day. tell you later"`, `"saw your old friend at the store. still weird"`, `"call me when you have a free 20"`]),
        excited: pick([`"OMG GUESS WHO I JUST SAW"`, `"can we link this weekend?? need to catch up"`, `"i have news. can't text it"`]),
        distant: pick([`"hey, long time. you good?"`, `"thought of you randomly today"`, `"u still in ${originOf(state.player.location).short}?"`])
      };
      return `${p.name}: ${lines[p.voice] || `"hey"`}`;
    },
    when: p => p.age >= 12 && p.relationships?.length > 0 && chance(15),
    choices: [
      { label: "Reply quick", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 5);
        applyEffects(`Quick reply. Conversation rolled for 20 minutes.`, { happiness: 4 });
      } },
      { label: "Reply with depth", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 12);
        applyEffects(`You went deep. They went deep. The text chain became a real conversation.`, { happiness: 8, karma: 4 }, "good");
      } },
      { label: "Leave it on read", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, -8);
        applyEffects(`You read it. Closed the app. The dots showed. You never replied.`, { discipline: 2, karma: -3, happiness: -2 }, "bad");
      } }
    ]
  },

  {
    title: () => {
      const p = pickFamilyNpc();
      return p ? `Text from ${p.name}` : "Family text";
    },
    text: () => {
      const p = pickFamilyNpc();
      return p
        ? `${p.name}: "${pick(["you alive?", "haven't heard from you in a min", "call your grandma", "auntie's having a thing saturday", "did you eat today"])}"`
        : "Family group chat just lit up. Forty-six new messages.";
    },
    when: p => p.age >= 14 && p.relationships.some(r => r.type === "family") && chance(12),
    choices: [
      { label: "Call right back", run: () => {
        const p = pickFamilyNpc();
        if (p) changeBond(p, 10);
        applyEffects(`30 minute call. They needed it more than they let on.`, { happiness: 8, karma: 8 }, "good");
      } },
      { label: "Reply later when you can", run: () => {
        const p = pickFamilyNpc();
        if (p) changeBond(p, 2);
        applyEffects(`You replied that night. Good enough.`, { happiness: 2 });
      } },
      { label: "Ignore the chat", run: () => {
        const p = pickFamilyNpc();
        if (p) changeBond(p, -6);
        applyEffects(`Notifications stayed at 46. You'll feel that one in 6 months.`, { karma: -4, happiness: -2 });
      } }
    ]
  },

  // ============================================================
  // NPC LIFE EVENTS — friends' lives update around you
  // ============================================================
  {
    title: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} had a kid` : "A friend had a kid";
    },
    text: () => {
      const p = pickActiveNpc();
      const babyName = pick(["Sophie", "August", "Marlowe", "Theo", "Nora", "Cassius", "Wren", "Sage"]);
      return p ? `${p.name} just had a baby. They named ${pick(["her", "him", "the kid"])} ${babyName}.` : `Someone in your contacts just had a kid.`;
    },
    when: p => p.age >= 22 && p.age <= 45 && p.relationships?.length >= 2 && chance(8),
    choices: [
      { label: "Fly in for the visit", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 16);
        applyEffects(`You held the baby. Brought a real gift. They'll remember who showed up.`, { money: -randomInt(200, 800), karma: 10, happiness: 8 }, "good");
      } },
      { label: "Send a card + Venmo", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 6);
        applyEffects(`You sent $200 and a thoughtful note. Made the distance feel less far.`, { money: -200, karma: 4 });
      } },
      { label: "Say congrats in the group chat", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 1);
        applyEffects(`You typed "🎉🍼❤️" and moved on with your day.`, { karma: -1 });
      } }
    ]
  },

  {
    title: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} got married` : "Friend's wedding invite";
    },
    text: () => {
      const p = pickActiveNpc();
      const where = pick(["Tulum", "Charleston", "Italy", "the courthouse", "their backyard"]);
      return p ? `${p.name} is getting married. ${pick(["RSVP due Friday.", "It's destination — " + where + ".", "Just the courthouse + dinner."])}` : `Wedding invite came in the mail.`;
    },
    when: p => p.age >= 22 && p.age <= 45 && p.relationships?.length >= 2 && chance(9),
    choices: [
      { label: "Go, all in", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 14);
        applyEffects(`Open bar. Old friends. Cried during the vows. Took a photo that's still in your top 9.`, { money: -randomInt(400, 2400), happiness: 14, karma: 8 }, "good");
      } },
      { label: "Send a gift, skip the trip", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 4);
        applyEffects(`You bought from the registry. They appreciated it. You still felt you missed something.`, { money: -randomInt(150, 600), happiness: -2, karma: 3 });
      } },
      { label: "Pretend you didn't see it", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, -14);
        applyEffects(`You let it slide. They unfollowed you Sunday.`, { karma: -6, happiness: -4 }, "bad");
      } }
    ]
  },

  {
    title: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} bought a house` : "Friend bought a house";
    },
    text: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} just closed on a house in ${pick(["the suburbs", "your old neighborhood", "Brooklyn", "Austin", "their mom's block"])}.` : `A friend just bought a house.`;
    },
    when: p => p.age >= 26 && p.age <= 50 && p.relationships?.length >= 2 && chance(7),
    choices: [
      { label: "Help them move in", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 14);
        applyEffects(`Two-day move. Sore back. Pizza on the kitchen floor. The kind of memory that doesn't fade.`, { happiness: 10, karma: 8, health: -3 }, "good");
      } },
      { label: "Buy them a housewarming gift", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 6);
        applyEffects(`${pick(["A serving board", "a Le Creuset", "art for the wall", "a Diptyque candle"])} delivered. Smooth.`, { money: -randomInt(80, 400), karma: 3 });
      } },
      { label: "Like the photo", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 1);
        applyEffects(`You double-tapped. Moved on.`, {});
      } }
    ]
  },

  {
    title: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} is in the hospital` : "A friend is in the hospital";
    },
    text: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} is in the hospital. ${pick(["Car accident.", "Sudden surgery.", "Long story.", "Health scare."])} Family is asking who can visit.` : `Someone close is in the hospital.`;
    },
    when: p => p.age >= 18 && p.relationships?.length >= 2 && chance(5),
    choices: [
      { label: "Go that day", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 22);
        applyEffects(`You showed up. Sat with them. They cried when they saw your face.`, { happiness: -4, karma: 18, money: -randomInt(40, 200) }, "good");
      } },
      { label: "Send flowers, call tomorrow", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 4);
        applyEffects(`Flowers got there Wednesday. You called. It wasn't the same.`, { money: -randomInt(60, 220), karma: 3, happiness: -2 });
      } }
    ]
  },

  // ============================================================
  // FRIEND FUNERAL EVENTS
  // ============================================================
  {
    title: () => {
      const p = pickRiskyNpc();
      return p ? `${p.name}'s funeral` : "A friend's funeral";
    },
    text: () => {
      const p = pickRiskyNpc();
      const cause = pick(["overdose", "car accident", "violence", "suicide", "sudden illness"]);
      return p
        ? `${p.name} is gone. ${cause}. ${state.player.name} is at the service. Everybody from the old days is here.`
        : `An old friend is gone. You're at the service.`;
    },
    when: p => p.age >= 22 && p.relationships?.some(r => r.arc === "spiral" || r.arc === "ghost") && chance(4),
    choices: [
      { label: "Speak at the service", run: () => {
        const p = pickRiskyNpc();
        if (p) {
          state.player.relationships = state.player.relationships.filter(r => r !== p);
          addCanonEvent(`${p.name} passed. Spoke at the service.`, "bad");
        }
        applyEffects(`Your voice held until the third paragraph. Then it broke. Everybody understood.`, { happiness: -22, karma: 14, discipline: 6, smarts: 4 }, "bad");
      } },
      { label: "Sit in the back, hold it together", run: () => {
        const p = pickRiskyNpc();
        if (p) {
          state.player.relationships = state.player.relationships.filter(r => r !== p);
          addCanonEvent(`${p.name} passed. ${state.player.name} sat in the back.`, "bad");
        }
        applyEffects(`You stayed dry-eyed through the service. Cried alone in the car for 40 minutes after.`, { happiness: -18, karma: 6 }, "bad");
      } },
      { label: "Skip it", run: () => {
        const p = pickRiskyNpc();
        if (p) {
          state.player.relationships = state.player.relationships.filter(r => r !== p);
        }
        applyEffects(`You didn't go. You'll regret it. It'll come up at 3AM for years.`, { happiness: -14, karma: -10, discipline: -4 }, "bad");
      } }
    ]
  },

  {
    title: () => {
      const sib = state.player.relationships.find(r => r.id === "sibling");
      return sib ? `${sib.name} is gone` : "Sibling lost";
    },
    text: () => {
      const sib = state.player.relationships.find(r => r.id === "sibling");
      return sib ? `${sib.name} passed. The phone call came at 6:47 AM. ${state.player.name} dropped what they were holding.` : `A sibling is gone.`;
    },
    when: p => p.age >= 30 && p.age <= 60 && p.relationships.some(r => r.id === "sibling") && chance(2),
    choices: [
      { label: "Plan everything yourself", run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        if (sib) {
          state.player.relationships = state.player.relationships.filter(r => r !== sib);
          addCanonEvent(`${sib.name} passed. Planned the funeral myself.`, "bad");
        }
        applyEffects(`You handled flowers, programs, eulogy, everything. Mom asked how you were. You didn't have an answer.`, { happiness: -28, karma: 18, discipline: 12, money: -randomInt(2000, 12000) }, "bad");
      } },
      { label: "Let family take over", run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        if (sib) {
          state.player.relationships = state.player.relationships.filter(r => r !== sib);
        }
        applyEffects(`You showed up. You cried. You let mom and the others handle the logistics.`, { happiness: -22, karma: 6 }, "bad");
      } }
    ]
  },

  // ============================================================
  // TEXT FROM X — random NPCs hit your phone
  // ============================================================
  {
    title: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} just texted` : "Phone buzzed";
    },
    text: () => {
      const p = pickActiveNpc();
      const lines = {
        warm: `"u up? been thinkin about you ❤️"`,
        rough: `"u up"`,
        dry: `"interesting day. you up?"`,
        excited: `"OMG ARE YOU AWAKE I HAVE A STORY"`,
        distant: `"hey. u up?"`
      };
      const line = p && lines[p.voice] ? lines[p.voice] : `"u up?"`;
      return p ? `${p.name} (${new Date().getHours() < 6 ? "2:14 AM" : "11:47 PM"}): ${line}` : `Late text from a contact: "u up?"`;
    },
    when: p => p.age >= 16 && (p.relationships || []).filter(r => r.bond >= 25 && r.type !== "spouse").length >= 1 && chance(11),
    cooldown: 3,
    tags: ["drama", "romance"],
    choices: [
      { label: "Reply yeah, FaceTime me", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 12);
        applyEffects(`Two-hour FaceTime. You both pretended you weren't lonely. Worked anyway.`, { happiness: 8, karma: 4, health: -2 }, "good");
      } },
      { label: "Reply just a chill 'sup'", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 4);
        applyEffects(`Light back-and-forth for 20 minutes. Both went to sleep around 1.`, { happiness: 3 });
      } },
      { label: "Phone face-down, deal with it later", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, -3);
        applyEffects(`Slept on it. They saw "delivered" forever.`, { discipline: 2 });
      } }
    ]
  },

  {
    title: () => {
      const mom = state.player.relationships.find(r => r.id === "guardian");
      return mom ? `${mom.name}: did you eat` : "Mom checked in";
    },
    text: () => {
      const mom = state.player.relationships.find(r => r.id === "guardian");
      const teaser = recallCanon({ tone: "good", fallback: "" });
      const memory = teaser ? ` She added: "saw what you said about ${teaser.split(".")[0].toLowerCase()}. proud of you."` : "";
      return mom ? `${mom.name}: "did you eat today. real food. not just coffee."${memory}` : `Mom: "did you eat today"`;
    },
    when: p => p.age >= 12 && p.relationships.some(r => r.id === "guardian") && chance(13),
    cooldown: 2,
    tags: ["family"],
    choices: [
      { label: "Send a pic of your plate", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) changeBond(mom, 9);
        applyEffects(`She sent back three heart emojis and "you're getting better."`, { happiness: 7, karma: 3 }, "good");
      } },
      { label: "Lie and say yes", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) changeBond(mom, 1);
        applyEffects(`She probably knew. Didn't push.`, { karma: -1 });
      } },
      { label: "Don't reply", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) changeBond(mom, -5);
        applyEffects(`She'll text again tomorrow. She always does.`, { happiness: -3, karma: -3 }, "bad");
      } }
    ]
  },

  {
    title: () => {
      const sib = state.player.relationships.find(r => r.id === "sibling");
      return sib ? `${sib.name}: GUESS WHAT` : "Sibling group blast";
    },
    text: () => {
      const sib = state.player.relationships.find(r => r.id === "sibling");
      const news = pick(["got the job", "broke up", "moving out", "back with their ex", "going on a date", "quit"]);
      return sib ? `${sib.name}: "GUESS WHAT 👀👀👀 i ${news}"` : `Sibling group chat blew up.`;
    },
    when: p => p.age >= 14 && p.relationships.some(r => r.id === "sibling") && chance(12),
    cooldown: 2,
    tags: ["family", "drama"],
    choices: [
      { label: "Call them right now", run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        if (sib) changeBond(sib, 14);
        applyEffects(`45-minute call. They needed someone to be excited with them.`, { happiness: 9, karma: 6 }, "good");
      } },
      { label: "Reply 'OMG TELL ME' but stay in bed", run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        if (sib) changeBond(sib, 5);
        applyEffects(`You got the story in voice memos. Almost the same.`, { happiness: 4 });
      } },
      { label: "Open, don't reply", run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        if (sib) changeBond(sib, -8);
        applyEffects(`They saw you read it. The group chat went quiet for a beat.`, { karma: -4, happiness: -3 }, "bad");
      } }
    ]
  },

  {
    title: () => {
      const p = pickArcNpc("spiral");
      return p ? `${p.name}: 2:47 AM` : "Crash text from someone";
    },
    text: () => {
      const p = pickArcNpc("spiral");
      return p ? `${p.name}: "i need u. can u talk. dont judge me pls"` : `Someone close is crashing in your DMs at almost 3 AM.`;
    },
    when: p => p.age >= 17 && p.relationships.some(r => r.arc === "spiral" && r.bond >= 30) && chance(10),
    cooldown: 3,
    tags: ["family", "drama"],
    choices: [
      { label: "Pick up. Stay on as long as it takes", run: () => {
        const p = pickArcNpc("spiral");
        if (p) changeBond(p, 22);
        applyEffects(`You stayed on the phone until they were breathing normal. 4:30 AM. Worth every minute.`, { happiness: -4, karma: 22, health: -4, smarts: 3 }, "good");
      } },
      { label: "Type a long thoughtful reply", run: () => {
        const p = pickArcNpc("spiral");
        if (p) changeBond(p, 10);
        applyEffects(`You sent four paragraphs. They felt heard. Less than a call but it landed.`, { happiness: 2, karma: 8 });
      } },
      { label: "Reply tomorrow", run: () => {
        const p = pickArcNpc("spiral");
        if (p) changeBond(p, -15);
        applyEffects(`By morning they were quiet again. The kind of quiet that means something shifted.`, { happiness: -6, karma: -10 }, "bad");
      } }
    ]
  },

  {
    title: () => {
      const p = pickArcNpc("snake");
      return p ? `${p.name}: random check-in` : "Sus text";
    },
    text: () => {
      const p = pickArcNpc("snake");
      return p ? `${p.name}: "yo random q — what's the actual deal with [${pick(["that thing you posted", "your money situation", "you and " + (pickActiveNpc()?.name || "them"), "the new project"])}]?"` : `Someone's fishing for info.`;
    },
    when: p => p.age >= 16 && p.relationships.some(r => r.arc === "snake" && r.bond >= 30) && chance(8),
    cooldown: 4,
    tags: ["drama"],
    choices: [
      { label: "Tell them everything", run: () => {
        const p = pickArcNpc("snake");
        if (p) {
          changeBond(p, 4);
          if (chance(40) && !p.betrayed) {
            p.betrayed = true;
            p.role = `${p.role} (snake)`;
            addCanonEvent(`${p.name} took something private and made it public.`, "bad");
            applyEffects(`Within a week the info was out. They took your trust and spent it.`, { happiness: -16, karma: -6, fame: 2 }, "bad");
            return;
          }
        }
        applyEffects(`You opened up. They listened. Felt fine. Time will tell.`, { happiness: 2 });
      } },
      { label: "Vague them", run: () => {
        const p = pickArcNpc("snake");
        if (p) changeBond(p, -2);
        applyEffects(`"All good fam, I'll catch you up in person." They got nothing.`, { discipline: 4, smarts: 3 }, "good");
      } },
      { label: "Cut them off cold", run: () => {
        const p = pickArcNpc("snake");
        if (p) changeBond(p, -18);
        applyEffects(`You went quiet on them entirely. They felt it. The friendship cracked.`, { karma: -2, discipline: 5 });
      } }
    ]
  },

  {
    title: () => {
      const p = pickArcNpc("star");
      return p ? `${p.name}: need a favor` : "Famous friend asking";
    },
    text: () => {
      const p = pickArcNpc("star");
      const ask = pick(["need you at this thing tonight, last minute", "can you post about my drop", "drive me to the airport in like 2 hours", "bring [3] bottles to the spot, i'll cover you back"]);
      return p ? `${p.name}: "${ask}"` : `Your famous friend needs something.`;
    },
    when: p => p.age >= 17 && p.relationships.some(r => r.arc === "star" && r.bond >= 30) && chance(9),
    cooldown: 3,
    tags: ["fame", "drama"],
    choices: [
      { label: "Pull up, no questions", run: () => {
        const p = pickArcNpc("star");
        if (p) changeBond(p, 10);
        applyEffects(`You showed up. Got introduced to three people who matter. They remember it.`, { fame: 4, happiness: 4, karma: 2, money: -randomInt(40, 220) }, "good");
      } },
      { label: "Counter-ask: \"what's in it for me\"", run: () => {
        const p = pickArcNpc("star");
        if (p) changeBond(p, -8);
        applyEffects(`They typed "lol nvm" and the friendship cooled by half a degree.`, { karma: -2, money: 0 });
      } },
      { label: "\"Can't, busy\"", run: () => {
        const p = pickArcNpc("star");
        if (p) changeBond(p, -3);
        applyEffects(`They moved on to the next person on the list.`, { discipline: 3 });
      } }
    ]
  },

  {
    title: () => {
      const p = pickArcNpc("ghost");
      return p ? `${p.name} resurfaced` : "Old contact resurfaced";
    },
    text: () => {
      const p = pickArcNpc("ghost");
      const memory = recallCanon({ fallback: "the year you both quit talking" });
      return p ? `${p.name}: "long time. been thinking about ${memory.split(".")[0].toLowerCase()}. you good?"` : `Someone you lost contact with just messaged.`;
    },
    when: p => p.age >= 19 && p.relationships.some(r => r.arc === "ghost" && r.ghosted) && chance(6),
    cooldown: 5,
    tags: ["family", "drama"],
    choices: [
      { label: "\"I'm good. how are YOU\"", run: () => {
        const p = pickArcNpc("ghost");
        if (p) {
          changeBond(p, 18);
          p.ghosted = false;
          addCanonEvent(`${p.name} came back around. The silence broke.`, "good");
        }
        applyEffects(`Long catch-up. Some of it hurt. Some of it healed.`, { happiness: 8, karma: 8 }, "good");
      } },
      { label: "Read it, sit with it, don't reply yet", run: () => {
        applyEffects(`You stared at the message for two days. Maybe you'll answer. Maybe you won't.`, { discipline: 3, happiness: -2 });
      } },
      { label: "Block the number", run: () => {
        const p = pickArcNpc("ghost");
        if (p) {
          state.player.relationships = state.player.relationships.filter(r => r !== p);
          addCanonEvent(`${p.name} reached out. ${state.player.name} blocked them.`, "bad");
        }
        applyEffects(`Door closed. Locked. You felt heavier and lighter at the same time.`, { happiness: -4, discipline: 6, karma: -4 });
      } }
    ]
  },

  {
    title: () => {
      const p = pickArcNpc("builder");
      return p ? `${p.name}: pitch text` : "Builder friend with an idea";
    },
    text: () => {
      const p = pickArcNpc("builder");
      const idea = pick(["a delivery thing for our city", "a content studio", "an app for our scene", "a pop-up shop, six weeks", "a podcast network"]);
      return p ? `${p.name}: "ok hear me out — ${idea}. need a partner. low equity to start. you in?"` : `Someone's pitching you a build.`;
    },
    when: p => p.age >= 18 && p.relationships.some(r => r.arc === "builder") && chance(7),
    cooldown: 5,
    tags: ["business", "money"],
    choices: [
      { label: "Voice memo: let's get on a call this week", run: () => {
        const p = pickArcNpc("builder");
        if (p) {
          changeBond(p, 16);
          if (!p.cofounded && chance(45)) {
            p.cofounded = true;
            p.role = `${p.role} → co-builder`;
            addCanonEvent(`${p.name} pitched, ${state.player.name} signed in.`, "good");
          }
        }
        applyEffects(`The call ran 90 minutes. By the end you were both writing code names on a napkin.`, { happiness: 8, smarts: 3, karma: 4 }, "good");
      } },
      { label: "\"Send me the deck\"", run: () => {
        const p = pickArcNpc("builder");
        if (p) changeBond(p, 4);
        applyEffects(`The deck never came. They got busy. You got busy. The window closed soft.`, { discipline: 2 });
      } },
      { label: "\"Not the right time for me\"", run: () => {
        const p = pickArcNpc("builder");
        if (p) changeBond(p, -2);
        applyEffects(`They respected the answer. Moved on. You wondered later.`, { discipline: 3, happiness: -2 });
      } }
    ]
  },

  {
    title: () => {
      const p = pickDayOne();
      return p ? `${p.name}: drunk text` : "Drunk text from the crew";
    },
    text: () => {
      const p = pickDayOne();
      const line = pick([`"i love you bro/sis im so seruoiis"`, `"PULL UP we're at the spot 🍻"`, `"we shouls hav done that thing in [2018]"`, `"miss u man fr"`]);
      return p ? `${p.name} (12:42 AM): ${line}` : `Drunk text from a day-one.`;
    },
    when: p => p.age >= 19 && dayOneCount(p) >= 1 && chance(10),
    cooldown: 2,
    tags: ["family", "party"],
    choices: [
      { label: "Pull up to the spot", run: () => {
        const p = pickDayOne();
        if (p) changeBond(p, 14);
        applyEffects(`You showed up at 1 AM. They hugged you for a full 8 seconds. Memory locked.`, { happiness: 12, karma: 8, health: -3, money: -randomInt(40, 180) }, "good");
      } },
      { label: "Send a voice memo back", run: () => {
        const p = pickDayOne();
        if (p) changeBond(p, 8);
        applyEffects(`They listened to it 6 times. Sent it back. Now you have the ritual.`, { happiness: 6, karma: 4 });
      } },
      { label: "Reply \"go to bed\"", run: () => {
        const p = pickDayOne();
        if (p) changeBond(p, 2);
        applyEffects(`They listened. Texted you a sunrise photo at 6 AM with "u were right."`, { discipline: 2 });
      } }
    ]
  },

  {
    title: "Group chat: heavy news",
    text: () => {
      const friends = (state.player.relationships || []).filter(r => r.bond >= 30 && r.type !== "family" && r.type !== "spouse");
      const subject = pick(friends);
      return subject ? `Group chat just lit up. Someone you all know is going through something heavy. ${subject.name} hasn't said anything yet.` : `Group chat just lit up with heavy news.`;
    },
    when: p => p.age >= 18 && (p.relationships || []).filter(r => r.bond >= 30).length >= 3 && chance(6),
    cooldown: 4,
    tags: ["family", "drama"],
    choices: [
      { label: "Be the one who calls everyone", run: () => {
        (state.player.relationships || []).filter(r => r.bond >= 30).forEach(p => changeBond(p, 6));
        applyEffects(`You spent the night on the phone with five different people. Everyone felt held. You were exhausted.`, { happiness: -4, karma: 18, smarts: 3 }, "good");
      } },
      { label: "Send one good message in the chat", run: () => {
        applyEffects(`You wrote something honest. Other people screenshot it.`, { happiness: 2, karma: 6, fame: 1 });
      } },
      { label: "Mute the thread for 24h", run: () => {
        applyEffects(`You needed the break. You felt guilty about it but you took it.`, { happiness: 1, karma: -3, discipline: 4 });
      } }
    ]
  },

  {
    title: "Random number — link tonight?",
    text: () => {
      const handle = pick(["someone from the party", "the bartender from Friday", "your ex's friend", "that DM you slid into in March"]);
      return `Random number: "yooo it's me from ${handle}. link tonight?"`;
    },
    when: p => p.age >= 18 && !p.relationships.some(r => r.type === "spouse") && chance(7),
    cooldown: 3,
    tags: ["romance", "party"],
    choices: [
      { label: "Pull up", run: () => {
        applyEffects(`Date became a night became a story you tell selectively. Worth it.`, { happiness: 9, looks: 1, karma: -1, money: -randomInt(40, 180) }, "good");
      } },
      { label: "\"Who's this?\" — make them work", run: () => {
        applyEffects(`Banter for an hour. They earned the meet-up next weekend.`, { happiness: 5, smarts: 2 });
      } },
      { label: "Don't reply", run: () => {
        applyEffects(`Phone face down. Slept early. Woke up curious.`, { discipline: 3, happiness: -1 });
      } }
    ]
  },

  {
    title: "Family thread: old photo",
    text: () => {
      const memory = recallCanon({ tone: "good", fallback: "a moment from years ago" });
      return `Mom dropped a photo in the family chat from ${memory.split(".")[0].toLowerCase()}. The reactions are flying.`;
    },
    when: p => p.age >= 14 && p.relationships.some(r => r.id === "guardian") && (p.canonEvents?.length || 0) >= 4 && chance(10),
    cooldown: 4,
    tags: ["family"],
    choices: [
      { label: "Drop a long voice memo with the story", run: () => {
        const fam = state.player.relationships.filter(r => r.type === "family");
        fam.forEach(p => changeBond(p, 5));
        applyEffects(`You told the story everyone half-remembered. Got 14 laugh reacts. Mom called after to say she loved it.`, { happiness: 11, karma: 6 }, "good");
      } },
      { label: "React with one emoji", run: () => {
        applyEffects(`The thread kept moving. You stayed quiet. Fine.`, {});
      } },
      { label: "Ignore it", run: () => {
        const fam = state.player.relationships.filter(r => r.type === "family");
        fam.forEach(p => changeBond(p, -2));
        applyEffects(`Nobody called you out. They noticed anyway.`, { karma: -2 });
      } }
    ]
  },

  // ============================================================
  // NPC LIFE EVENTS — extra (famous, divorce)
  // ============================================================
  {
    title: () => {
      const p = pickArcNpc("star") || pickActiveNpc();
      return p ? `${p.name} blew up` : "A friend got famous";
    },
    text: () => {
      const p = pickArcNpc("star") || pickActiveNpc();
      const reason = pick(["went viral on the FYP", "got featured in a magazine", "signed with a real agency", "got cast in something", "got a big brand deal"]);
      return p ? `${p.name} ${reason}. Phone's blowing up. They're posting from the green room.` : `Someone in your circle just hit a different level.`;
    },
    when: p => p.age >= 16 && p.age <= 60 && p.relationships?.length >= 2 && chance(6),
    tags: ["fame", "drama"],
    choices: [
      { label: "Hype them publicly", run: () => {
        const p = pickArcNpc("star") || pickActiveNpc();
        if (p) changeBond(p, 12);
        applyEffects(`You posted the proudest IG story possible. They reposted it. Their fans followed you.`, { happiness: 8, karma: 8, fame: 5 }, "good");
      } },
      { label: "Text them privately, no public post", run: () => {
        const p = pickArcNpc("star") || pickActiveNpc();
        if (p) changeBond(p, 8);
        applyEffects(`They appreciated the real one over the algorithm one.`, { happiness: 5, karma: 5 });
      } },
      { label: "Stay quiet, feel weird about it", run: () => {
        const p = pickArcNpc("star") || pickActiveNpc();
        if (p) changeBond(p, -10);
        applyEffects(`They noticed you didn't say anything. The friendship got a small new bruise.`, { happiness: -6, karma: -3 }, "bad");
      } }
    ]
  },

  {
    title: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} is getting divorced` : "Friend's marriage ended";
    },
    text: () => {
      const p = pickActiveNpc();
      return p ? `${p.name} called from a parking lot. The marriage is over. They didn't see it coming. Or maybe they did.` : `Someone's marriage just ended.`;
    },
    when: p => p.age >= 26 && p.age <= 55 && p.relationships?.length >= 2 && chance(5),
    tags: ["family", "drama"],
    choices: [
      { label: "Drive over with food", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 20);
        applyEffects(`You brought their comfort food and didn't make them talk. They cried twice and laughed once. The night helped.`, { happiness: 4, karma: 16, money: -randomInt(40, 140) }, "good");
      } },
      { label: "Long FaceTime", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 10);
        applyEffects(`Two hours on the phone. They were less alone. You were tired.`, { happiness: 1, karma: 8, health: -2 });
      } },
      { label: "\"Damn, sorry. Here if you need me.\"", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, -2);
        applyEffects(`Generic. They moved on to the friends who showed up.`, { karma: -3 });
      } }
    ]
  },

  // ============================================================
  // FRIEND FUNERAL EVENTS — day-one + parent
  // ============================================================
  {
    title: () => {
      const p = pickDayOne();
      return p ? `${p.name}'s memorial` : "Day-one's memorial";
    },
    text: () => {
      const p = pickDayOne();
      const cause = pick(["the spiral got too deep", "an accident on the freeway", "complications nobody saw coming", "a thing that doesn't have a clean word"]);
      return p ? `${p.name} is gone. ${cause}. The whole crew is in one room for the first time in years.` : `One of your day-ones is gone.`;
    },
    when: p => p.age >= 22 && dayOneCount(p) >= 1 && chance(2),
    tags: ["family", "drama"],
    choices: [
      { label: "Eulogy. Yours. The real one.", run: () => {
        const p = pickDayOne();
        if (p) {
          state.player.relationships = state.player.relationships.filter(r => r !== p);
          addCanonEvent(`${p.name}, day-one, gone. ${state.player.name} gave the eulogy.`, "bad");
        }
        applyEffects(`You spoke for 11 minutes. Nobody could have done it but you. The crew held you after.`, { happiness: -32, karma: 22, smarts: 6, discipline: 6 }, "bad");
      } },
      { label: "Carry the casket. Don't speak.", run: () => {
        const p = pickDayOne();
        if (p) {
          state.player.relationships = state.player.relationships.filter(r => r !== p);
          addCanonEvent(`${p.name}, day-one, gone. ${state.player.name} carried.`, "bad");
        }
        applyEffects(`You did the physical part. Words weren't yours that day. Everybody knew.`, { happiness: -28, karma: 14, health: -4 }, "bad");
      } },
      { label: "Stand in the back with the rest of the crew", run: () => {
        const p = pickDayOne();
        if (p) {
          state.player.relationships = state.player.relationships.filter(r => r !== p);
          addCanonEvent(`${p.name}, day-one, gone.`, "bad");
        }
        applyEffects(`You held three other people up. That was the part you could do. It was enough.`, { happiness: -26, karma: 10 }, "bad");
      } }
    ]
  },

  {
    title: () => {
      const mom = state.player.relationships.find(r => r.id === "guardian");
      return mom ? `${mom.name} passed` : "Parent's funeral";
    },
    text: () => {
      const mom = state.player.relationships.find(r => r.id === "guardian");
      return mom ? `${mom.name} is gone. The call came at ${pick(["4:08 AM", "during a meeting", "while you were at the gym", "on a regular Wednesday"])}. Nothing in your life will divide the same way again.` : `A parent is gone.`;
    },
    when: p => p.age >= 35 && p.relationships.some(r => r.id === "guardian") && chance(3),
    tags: ["family", "drama"],
    choices: [
      { label: "Hold everything. Plan it all.", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) {
          state.player.relationships = state.player.relationships.filter(r => r !== mom);
          addCanonEvent(`${mom.name} passed. ${state.player.name} planned everything.`, "bad");
        }
        applyEffects(`You handled the funeral home, the obituary, the will, the calls. You'll feel it in five years.`, { happiness: -38, karma: 22, discipline: 14, money: -randomInt(4000, 18000), smarts: 6 }, "bad");
      } },
      { label: "Let your sibling lead. Show up clean.", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        const sib = state.player.relationships.find(r => r.id === "sibling");
        if (sib) changeBond(sib, 18);
        if (mom) {
          state.player.relationships = state.player.relationships.filter(r => r !== mom);
          addCanonEvent(`${mom.name} passed. Sibling led the service.`, "bad");
        }
        applyEffects(`You let your family hold it together. Spoke once, briefly, and meant every word.`, { happiness: -34, karma: 14 }, "bad");
      } },
      { label: "Fall apart in private. Be there in body.", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) {
          state.player.relationships = state.player.relationships.filter(r => r !== mom);
          addCanonEvent(`${mom.name} passed.`, "bad");
        }
        applyEffects(`You couldn't speak at the service. You stood. You held your sibling. That was the truth.`, { happiness: -40, karma: 6, discipline: -6, health: -8 }, "bad");
      } }
    ]
  },

  // ============================================================
  // MEMORY-REFERENCING EVENTS — they bring up your canon
  // ============================================================
  {
    title: "Someone brings up that thing",
    text: () => {
      const memory = recallCanon({ exclude: ["passed", "funeral", "gone"], fallback: "that move you made last year" });
      const p = pickActiveNpc();
      return p ? `${p.name}: "yo remember when ${memory.split(".")[0].toLowerCase()}? talk about that more."` : `Someone brought up an old chapter.`;
    },
    when: p => p.age >= 16 && (p.canonEvents?.length || 0) >= 3 && p.relationships?.length >= 2 && chance(8),
    cooldown: 4,
    tags: ["family", "drama"],
    choices: [
      { label: "Tell the real version", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 10);
        applyEffects(`You said the parts you usually skip. They listened harder than you expected.`, { happiness: 6, karma: 8, smarts: 4 }, "good");
      } },
      { label: "Give the polished version", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, 4);
        applyEffects(`Smooth retelling. They laughed in the right spots. Felt like a story, not a memory.`, { fame: 1 });
      } },
      { label: "\"Different chapter. Don't bring it up.\"", run: () => {
        const p = pickActiveNpc();
        if (p) changeBond(p, -4);
        applyEffects(`Hard line. They respected it. Air went cold for a minute.`, { discipline: 5, karma: -2 });
      } }
    ]
  },

  {
    title: "Mom mentions the bad year",
    text: () => {
      const mom = state.player.relationships.find(r => r.id === "guardian");
      const dark = recallCanon({ tone: "bad", fallback: "the rough stretch" });
      return mom ? `${mom.name} brought up ${dark.split(".")[0].toLowerCase()} over coffee. Quiet voice. Not lecturing. Just remembering.` : `Mom brought up a hard year.`;
    },
    when: p => p.age >= 20 && p.relationships.some(r => r.id === "guardian") && (p.canonEvents?.some(c => c.tone === "bad")) && chance(6),
    cooldown: 6,
    tags: ["family", "drama"],
    choices: [
      { label: "Apologize properly. Real words.", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) changeBond(mom, 24);
        applyEffects(`You said the things you'd been carrying. She squeezed your hand. Something old got closed.`, { happiness: 14, karma: 18, smarts: 4 }, "good");
      } },
      { label: "Get defensive", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) changeBond(mom, -14);
        applyEffects(`The conversation ended with the door closing. She didn't follow.`, { happiness: -8, karma: -8 }, "bad");
      } },
      { label: "Listen quietly. Don't fill the silence.", run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) changeBond(mom, 12);
        applyEffects(`You let the silence sit. Sometimes that's the apology.`, { happiness: 4, karma: 10, discipline: 6 }, "good");
      } }
    ]
  },

  {
    title: "Anniversary of a big one",
    text: () => {
      const memory = recallCanon({ fallback: "a year that changed things" });
      return `Phone reminder: it's been a year since ${memory.split(".")[0].toLowerCase()}. Calendar's politely waiting on you.`;
    },
    when: p => p.age >= 18 && (p.canonEvents?.length || 0) >= 2 && chance(7),
    cooldown: 3,
    tags: ["drama"],
    choices: [
      { label: "Sit with it. Write the page about it.", run: () => {
        applyEffects(`You wrote 800 words you'll re-read in 5 years. Some healing only happens on paper.`, { happiness: 8, smarts: 5, discipline: 4 }, "good");
      } },
      { label: "Post about it", run: () => {
        applyEffects(`Got a wave of DMs from people who related. The post hit different than you expected.`, { happiness: 5, fame: 4, karma: 4 });
      } },
      { label: "Move past it. New chapter energy.", run: () => {
        applyEffects(`You let the day be normal on purpose. Took the dog out. Ate well. Slept early.`, { happiness: 4, discipline: 6, health: 3 }, "good");
      } }
    ]
  },

  {
    title: "Old crew runs into you",
    text: () => {
      const street = recallCanon({ keyword: "crew", fallback: recallCanon({ keyword: "street", fallback: "the old days" }) });
      return `Caught eyes with someone from ${street.split(".")[0].toLowerCase()} at the gas station. They're holding the same cup of coffee they always held.`;
    },
    when: p => p.age >= 20 && (p.streetRep > 0 || p.canonEvents?.some(c => c.text.toLowerCase().includes("crew") || c.text.toLowerCase().includes("street"))) && chance(7),
    cooldown: 5,
    tags: ["street", "drama"],
    choices: [
      { label: "Dap up. Catch up at the pump.", run: () => {
        applyEffects(`Five-minute conversation. They updated you. You updated them. Both of you survived.`, { happiness: 6, karma: 4, fame: 1 });
      } },
      { label: "Pull them aside, real talk", run: () => {
        applyEffects(`Twenty minutes deep in the car. They cried once. You hugged like men who almost didn't make it.`, { happiness: 4, karma: 12, discipline: 4 }, "good");
      } },
      { label: "Pretend you didn't see them", run: () => {
        applyEffects(`You drove off. You'll think about it for a week.`, { happiness: -6, karma: -6, discipline: 2 }, "bad");
      } }
    ]
  },

  // ============================================================
  // DAY-ONE / CREW EVENTS — fire when ≥2 day-ones designated
  // ============================================================
  {
    title: "Day-Ones Group Trip",
    text: () => {
      const ones = state.player.relationships.filter(r => r.dayOne);
      const names = ones.slice(0, 3).map(r => r.name).join(", ");
      return `${names} are pulling up. ${pick(["Vegas weekend.", "House rental in Joshua Tree.", "Cabin in the woods.", "Yacht weekend if anyone fronts."])} Group chat is loud.`;
    },
    when: p => dayOneCount(p) >= 2 && p.age >= 18 && p.money >= 800 && chance(15),
    choices: [
      { label: "Book it, full crew", run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        ones.forEach(p => changeBond(p, 12));
        applyEffects(`Three days together. Inside jokes. Group photos. The bond that holds for 20 years.`, { money: -randomInt(400, 2200), happiness: 18, karma: 8, looks: 2 }, "good");
      } },
      { label: "Flake last minute", run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        ones.forEach(p => changeBond(p, -8));
        applyEffects(`You bailed Thursday. The group chat went quiet for a week.`, { discipline: -3, karma: -6, happiness: -4 }, "bad");
      } }
    ]
  },

  {
    title: "Day-One in Crisis",
    text: () => {
      const ones = state.player.relationships.filter(r => r.dayOne);
      const one = ones[0];
      return one ? `${one.name} called at 2AM. They need you. ${pick(["Going through it.", "Breakup just happened.", "Got fired.", "Family stuff."])}` : `A close friend needs you.`;
    },
    when: p => dayOneCount(p) >= 1 && chance(12),
    choices: [
      { label: "Drive over right now", run: () => {
        const one = state.player.relationships.filter(r => r.dayOne)[0];
        if (one) changeBond(one, 24);
        applyEffects(`You got there at 3AM. Stayed until sunrise. They'll never forget.`, { happiness: -2, karma: 18, health: -3 }, "good");
      } },
      { label: "Talk through the phone", run: () => {
        const one = state.player.relationships.filter(r => r.dayOne)[0];
        if (one) changeBond(one, 10);
        applyEffects(`90 minute call. You said the right things. They felt held.`, { happiness: 4, karma: 8 }, "good");
      } },
      { label: "Tell them you'll call tomorrow", run: () => {
        const one = state.player.relationships.filter(r => r.dayOne)[0];
        if (one) changeBond(one, -12);
        applyEffects(`You sent "love you, talk in the AM" and went back to sleep. The dynamic shifted.`, { discipline: 2, karma: -8, happiness: -4 }, "bad");
      } }
    ]
  },

  {
    title: "Day-One's Wedding",
    text: () => {
      const ones = state.player.relationships.filter(r => r.dayOne);
      const one = ones[0];
      return one ? `${one.name} is getting married. The text says: "u know you're standing next to me right? not askin." Suit fitting is Saturday.` : `One of your day-ones is tying the knot.`;
    },
    when: p => dayOneCount(p) >= 1 && p.age >= 22 && p.age <= 45 && chance(8),
    cooldown: 6,
    tags: ["family", "romance"],
    choices: [
      { label: "Best person speech, the whole thing", run: () => {
        const one = state.player.relationships.filter(r => r.dayOne)[0];
        if (one) changeBond(one, 22);
        addCanonEvent(`${one ? one.name : "Day-one"} got married. ${state.player.name} stood next to them.`, "good");
        applyEffects(`Your speech ran 6 minutes. Got the whole room. Two people asked you to officiate theirs after.`, { happiness: 18, karma: 14, fame: 3, money: -randomInt(300, 1400) }, "good");
      } },
      { label: "Stand up there. Don't speak.", run: () => {
        const one = state.player.relationships.filter(r => r.dayOne)[0];
        if (one) changeBond(one, 12);
        applyEffects(`Showed up clean. Held the rings. Cried during the vows. Hugged hard at the reception.`, { happiness: 12, karma: 8, money: -randomInt(200, 900) }, "good");
      } },
      { label: "Send the gift, miss the day", run: () => {
        const one = state.player.relationships.filter(r => r.dayOne)[0];
        if (one) {
          changeBond(one, -28);
          one.dayOne = false;
        }
        applyEffects(`They never said it directly but it changed everything between you. They quietly stopped being a day-one.`, { happiness: -14, karma: -16, money: -randomInt(150, 600) }, "bad");
      } }
    ]
  },

  {
    title: "The Crew Falls Out",
    text: () => {
      const ones = state.player.relationships.filter(r => r.dayOne);
      const a = ones[0]; const b = ones[1];
      return a && b ? `${a.name} and ${b.name} got into it bad. Group chat is silent. Both of them are texting you separately. You're the bridge.` : `The crew is feuding. You're stuck in the middle.`;
    },
    when: p => dayOneCount(p) >= 2 && chance(7),
    cooldown: 5,
    tags: ["family", "drama"],
    choices: [
      { label: "Get them in a room. Mediate it.", run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        ones.forEach(p => changeBond(p, 12));
        addCanonEvent(`${state.player.name} pulled the crew back together.`, "good");
        applyEffects(`Three hour conversation in your kitchen. They left hugging. The crew survived because of you.`, { happiness: 8, karma: 18, smarts: 6, discipline: 4 }, "good");
      } },
      { label: "Pick a side", run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        if (ones[0]) changeBond(ones[0], 14);
        if (ones[1]) {
          changeBond(ones[1], -28);
          ones[1].dayOne = false;
          addCanonEvent(`${state.player.name} picked a side. Lost a day-one.`, "bad");
        }
        applyEffects(`You backed one of them publicly. The other one stopped picking up. You went from 3 to 2.`, { happiness: -6, karma: -4, discipline: 4 }, "bad");
      } },
      { label: "Stay neutral. Let it cool on its own.", run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        ones.forEach(p => changeBond(p, -4));
        applyEffects(`You said nothing. Months later it was fine. Months later it wasn't. Hard to tell from inside.`, { discipline: 6 });
      } }
    ]
  },

  {
    title: "Crew Birthday Weekend",
    text: () => {
      const ones = state.player.relationships.filter(r => r.dayOne);
      const one = ones[0];
      return one ? `${one.name} turns ${pick(["25", "30", "35", "40"])} this month. The whole crew is planning the surprise. You're the one with the keys to the rental.` : `It's a milestone birthday for one of the crew.`;
    },
    when: p => dayOneCount(p) >= 2 && p.age >= 21 && p.money >= 400 && chance(10),
    cooldown: 4,
    tags: ["family", "party"],
    choices: [
      { label: "Run point. Make it legendary.", run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        ones.forEach(p => changeBond(p, 14));
        addCanonEvent(`${state.player.name} ran ${ones[0]?.name || "the crew"}'s birthday weekend.`, "good");
        applyEffects(`You handled the rental, the dinner, the surprise. Three days of inside jokes. Photos that'll outlive you.`, { happiness: 16, karma: 10, money: -randomInt(400, 1800), discipline: 6 }, "good");
      } },
      { label: "Show up. Bring vibes, not logistics.", run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        ones.forEach(p => changeBond(p, 6));
        applyEffects(`You weren't the planner but you were the energy. Worth your weight in the photos.`, { happiness: 9, karma: 4, money: -randomInt(150, 600) }, "good");
      } },
      { label: "Send a Cameo and money toward the rental", run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        ones.forEach(p => changeBond(p, 1));
        applyEffects(`The Cameo was funny. The Venmo helped. The crew noted you weren't there.`, { money: -randomInt(120, 360), happiness: -2 });
      } }
    ]
  }
];

// NPC pickers used by events above
function pickActiveNpc() {
  const list = (state.player?.relationships || []).filter(r => r.type !== "spouse" && r.bond >= 25 && !r.ghosted);
  return list.length ? pick(list) : null;
}

function pickFamilyNpc() {
  const list = (state.player?.relationships || []).filter(r => r.type === "family" && r.bond >= 30);
  return list.length ? pick(list) : null;
}

function pickRiskyNpc() {
  const list = (state.player?.relationships || []).filter(r => (r.arc === "spiral" || r.arc === "ghost" || r.arc === "reckless") && r.bond >= 30);
  return list.length ? pick(list) : null;
}

function pickArcNpc(arc) {
  const list = (state.player?.relationships || []).filter(r => r.arc === arc && r.bond >= 25);
  return list.length ? pick(list) : null;
}

function pickDayOne() {
  const list = (state.player?.relationships || []).filter(r => r.dayOne);
  return list.length ? pick(list) : null;
}

// Memory weave: pull a recent canon line you can reference inside an event.
// Filters by tone/keyword if you want a specific kind of memory.
function recallCanon({ tone, keyword, exclude = [], skip = 0, fallback = "" } = {}) {
  const player = state.player;
  if (!player?.canonEvents?.length) return fallback;
  const list = player.canonEvents.filter(c => {
    if (tone && c.tone !== tone) return false;
    if (keyword && !c.text.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (exclude.some(k => c.text.toLowerCase().includes(k.toLowerCase()))) return false;
    return true;
  });
  const hit = list[skip];
  return hit ? hit.text.replace(/\.$/, "") : fallback;
}

// Tag pass: assign personality/interest tags to events that don't have them yet,
// so Codex's pickLifeEvent can weight them by personality.sceneWeight + interests.
const eventTagOverrides = {
  // Swing events
  "Unknown Relative": ["family", "money"],
  "Scratch-Off Hits": ["money"],
  "Random DM": ["fame", "travel", "money"],
  "Viral Overnight": ["fame"],
  "Cancelled": ["fame", "drama"],
  "Surprise Pregnancy": ["family", "romance", "drama"],
  "Jumped Walking Home": ["street", "action"],
  "Brand Cold Call": ["fame", "money", "business"],
  "Investor Wants In": ["business", "money"],
  "Best Friend Betrayal": ["drama", "family"],
  "Wrong Place Wrong Time": ["street", "action", "drama"],
  "Sudden Romance": ["romance"],
  "Family Emergency": ["family", "drama"],
  "Old Friend Resurfaces": ["family", "drama"],
  "Investment Hits": ["money", "business"],
  "Talent Scout in the Crowd": ["fame", "drama"],
  // Cinematic scenes
  "Frat House at 2AM": ["party", "school", "drama"],
  "The Hills Mansion": ["party", "city", "fame"],
  "Cocaine in the Bathroom": ["drugs", "party"],
  "Bali Blackout": ["travel", "party", "drugs"],
  "Phuket Full Moon": ["travel", "party"],
  "Cartagena Beach Move": ["travel", "romance"],
  "Mexico City After-Hours": ["city", "party", "travel"],
  "Tokyo Host Club": ["travel", "money", "party"],
  "London Drill Scene": ["fame", "street", "music"],
  "Atlanta Studio Session": ["fame", "music", "street"],
  "Strip Club Private Room": ["party", "money"],
  "First Real Tinder Date": ["romance"],
  "Almost Recruited": ["action", "drama", "money"],
  "Witness to Something": ["street", "drama"],
  "Cartel Offer (CDMX)": ["action", "street", "money", "travel"],
  "Vegas Casino Night": ["money", "travel", "party"],
  "Famous Person DM": ["fame", "party"],
  "Border Crossing Issue": ["travel", "drama"],
  "Tape Leaked": ["fame", "drama"],
  "Yacht Week (Croatia)": ["travel", "party", "fame"],
  "Underground Fight Club Invite": ["action", "street", "money"],
  "Therapy Breakthrough": ["drama", "family"],
  "Family Estate Drama": ["family", "money", "drama"],
  "Slow Romance, Right Person": ["romance"],
  // City expansion
  "Medellín Hillside Story": ["family", "drama", "city"],
  "El Poblado Money Offer": ["street", "money", "action"],
  "Paragliding Over the Valley": ["travel", "fame"],
  "Smoke Break in the 11e": ["party", "drama", "city"],
  "Fashion Week Side Door": ["fame", "city"],
  "Romance on the Seine": ["romance", "city"],
  "Brunch at the Burj": ["money", "party", "fame"],
  "Supercar Loaner": ["money", "action", "fame"],
  "Visa Worker Wakeup": ["drama", "family"],
  "Ipanema Sunset": ["romance", "travel"],
  "Funk Party in the Favela": ["party", "street", "drugs"],
  "Carnival Block Party": ["party", "fame", "romance"],
  "K-Pop Audition Day": ["fame", "school", "music"],
  "Gangnam Plastic Surgery Pitch": ["money", "drama"],
  "Hagwon All-Nighter": ["school", "family"],
  "Mom's Pit Boss": ["family", "drama"],
  "Off-Strip Hustle": ["street", "money"],
  "Pool Party at the Cosmo": ["party", "fame", "travel"],
  // Vacation destinations
  "Cabo Spring Break": ["travel", "party", "school"],
  "Cancún All-Inclusive Mistake": ["travel", "party"],
  "Tulum Wellness Trap": ["travel", "drama", "money"],
  // Seasonal / holiday
  "New Year's Eve": ["party", "romance"],
  "Valentine's Day": ["romance", "family"],
  "Super Bowl Weekend": ["money", "party"],
  "Halloween Night": ["party", "fame"],
  "Thanksgiving at Home": ["family", "drama"],
  "Christmas Morning": ["family"],
  "Summer Block Party": ["family", "street"],
  "Spring Break Pressure": ["travel", "party", "school"],
  "Carnival in Rio": ["travel", "party"],
  "Election Year": ["fame", "drama"],
  "Prom Night": ["school", "romance", "fame"],
  "Y2K Panic": ["family", "drama"],
  // Celebrities
  "Rapper Slid In Your DMs": ["fame", "music", "party"],
  "NBA Player's Cousin": ["fame", "party"],
  "K-Pop Idol Visits Your City": ["fame", "music"],
  "Reality TV Star Cameo": ["fame", "drama"],
  "A-list Actor in Your Spot": ["fame", "drama"],
  "Influencer Wants a Collab": ["fame", "business"],
  "Met a Tech Billionaire": ["business", "money", "fame"],
  "Got Featured by a Magazine": ["fame", "business"],
  // Class-exclusive packs
  "Cotillion / Debutante Ball": ["family", "fame"],
  "Aspen / St. Moritz Family Trip": ["travel", "fame", "drugs"],
  "Trust Fund Activates": ["money", "family"],
  "Parents' Divorce Settlement": ["family", "drama", "money"],
  "Hamptons Summer": ["party", "fame", "money"],
  "Board Seat Offer (Family Friend)": ["business", "money"],
  "Family Vacation to Disney": ["family", "travel"],
  "Mom's Modest IRA Inheritance": ["family", "money"],
  "Dad's Garage Project": ["family"],
  "First Real Apartment with Mom Helping": ["family"],
  "Suburban Driveway Talk": ["family", "drama"],
  "First Real Paycheck": ["money", "family"],
  "Mom Working Double Shifts": ["family", "drama"],
  "Trade School Pitch": ["family", "school"],
  "Union Meeting Pulls You In": ["business", "drama"],
  "Bills Hit Harder Than Expected": ["money", "drama"],
  "SNAP Card Line": ["family", "drama"],
  "Free School Lunch": ["school", "drama"],
  "Grandma's Check": ["family", "money"],
  "GED Counselor": ["school"],
  "Free Clinic Visit": ["drama"],
  "Foster Placement": ["family", "drama"],
  "Aging Out at 18": ["family", "drama"],
  "Caseworker Drops By": ["family"],
  "Scholarship for Foster Kids": ["school", "money"],
  "Found Family": ["family"],
  // City depth
  "Tokyo Karaoke Box": ["party", "city"],
  "Tsukiji Fish Market 5AM": ["city", "travel"],
  "Salaryman Drinking Night": ["business", "party"],
  "Anime Convention Cameo": ["fame", "city"],
  "Erewhon Smoothie Run": ["fame", "city"],
  "Coachella Weekend": ["travel", "party", "fame"],
  "Valet at the Hotel Bel-Air": ["money", "city"],
  "Subway Delay Drama": ["city", "drama"],
  "Rooftop Apartment Party": ["party", "fame", "city"],
  "Bodega Cat Night Shift": ["city", "street"],
  "Lenox Mall Saturday": ["fame", "city"],
  "Edgewood Strip Friday": ["party", "city"],
  "Roma Norte Cantina": ["city", "party"],
  "Polanco Brunch": ["city", "fame", "money"],
  // Marriage / divorce arc
  "Wedding Planning Drama": ["family", "romance", "money"],
  "Honeymoon": ["romance", "travel"],
  "5-Year Anniversary": ["romance", "family"],
  "Seven-Year Itch": ["romance", "drama"],
  "Empty Nest": ["family", "romance"],
  "Divorce Ultimatum": ["family", "drama"],
  "Post-Divorce Dating": ["romance"],
  // City scenes pass #2
  "Free Meal at the Mission": ["street", "family"],
  "Tent City Neighbor": ["street", "family"],
  "Camera Crew on the Row": ["street", "fame"],
  "Sunday BBQ on the Block": ["family", "city"],
  "Sunday Lowrider Cruise": ["city", "street"],
  "High School Football Friday": ["school", "fame", "city"],
  "Casino Cocktail Job Offer": ["money", "party"],
  "Boxing Match at the MGM": ["money", "party", "fame"],
  "Wedding Chapel Bachelorette": ["party", "romance", "fame"],
  "Sunday Marché": ["city", "family"],
  "Grève — Strike Day": ["city", "drama"],
  "Père Lachaise Wandering": ["city", "drama"],
  "Indoor Ski at Mall of Emirates": ["city", "party"],
  "Marina Yacht Friday": ["money", "party", "fame"],
  "Desert Safari with Falcons": ["city", "travel"],
  "Soccer at Maracanã": ["city", "fame"],
  "Christ the Redeemer Hike": ["city", "travel"],
  "Botafogo Bar Crawl": ["city", "party"],
  "Hongdae Saturday Night": ["city", "party"],
  "Jjimjilbang Overnight": ["city"],
  "Buddhist Temple Stay": ["drama"],
  // Pet arcs / old age / religion / climate / military / NewGame+
  "Pet's Last Day": ["family"],
  "Pet Runs Away": ["family"],
  "The Thing You Finally Said": ["family", "drama"],
  "Grandkid's First Visit": ["family"],
  "Spouse's Funeral": ["family", "drama"],
  "Late-Life Romance": ["romance"],
  "Faith Crisis": ["drama", "family"],
  "Religious Awakening": ["drama", "family"],
  "Religious Holiday at Home": ["family"],
  "California Wildfire": ["city", "drama"],
  "Hurricane Hits": ["city", "drama"],
  "Earthquake / Quake Aftermath": ["city", "drama"],
  "Recruiter Comes to Your School": ["school", "drama"],
  "Deployment Orders": ["action", "drama"],
  "You Wrote a Will": ["family", "money"],
  // Career arcs
  "First Show at a Dive Bar": ["fame", "music"],
  "Demo Tape Gets Heard": ["fame", "music", "business"],
  "Sign the Contract": ["fame", "music", "business"],
  "Debut Album Drops": ["fame", "music"],
  "The Spiral Year": ["drugs", "fame"],
  "Grammy Nomination": ["fame", "music"],
  "High School Varsity Tryout": ["school"],
  "Recruitment Letter": ["school", "fame"],
  "Draft Day": ["fame", "money"],
  "Major Injury": ["drama"],
  "Championship Run": ["fame"],
  "City Council Race": ["business"],
  "Lobbyist Approaches You": ["business", "money"],
  "Statewide Run": ["business", "fame"],
  "Political Scandal": ["drama", "fame"],
  "National Bid": ["fame", "business"],
  // Decade events
  "AIDS Crisis Spreads": ["family", "drama"],
  "Berlin Wall Falls": ["drama"],
  "Dot-com Bubble": ["money", "business"],
  "9/11": ["family", "drama"],
  "Hurricane Katrina": ["drama"],
  "Obama Wins": ["drama"],
  "Housing Crash": ["money"],
  "iPhone Launch": ["money"],
  "Trump Wins / Obama Era Ends": ["drama", "fame"],
  "COVID Lockdown": ["family", "business"],
  "George Floyd Summer": ["street", "drama"],
  "Crypto Boom": ["money"],
  "AI Boom": ["business", "money"],
  // Children
  "Your Kid's First Word": ["family"],
  "First Day of School": ["family", "school"],
  "Your Kid's First Crush": ["family"],
  "Teen Rebellion": ["family", "drama"],
  "Kid's Graduation": ["family"],
  "Kid Moves Out": ["family"],
  "Your Kid Gets Married": ["family", "romance"],
  // Family tree
  "Grandma's Funeral": ["family", "drama"],
  "Grandpa's Last Visit": ["family"],
  "Mom Gets Dementia": ["family", "drama"],
  "Cousin Lands in Your City": ["family"],
  "In-Law Drama": ["family", "drama"],
  "Sibling Asks for Money": ["family", "money"],
  // Health
  "Depression Spiral": ["drama"],
  "Cancer Diagnosis": ["family", "drama"],
  "Diabetes Diagnosis": ["drama"],
  "Sober October → Year One": ["drama"],
  "Addiction Relapse": ["drama"],
  "Anxiety Attack at Work": ["business", "drama"],
  "Eating Disorder Confrontation": ["family", "drama"],
  "Burnout Wall": ["business", "drama"],
  // Day-one / friend events (note: these use function titles, so the tag system
  // wraps them differently — Codex's pickLifeEvent treats untitled events at base weight)
  "Day-Ones Group Trip": ["party", "family"],
  "Day-One in Crisis": ["family", "drama"],
  "Day-One's Wedding": ["family", "romance"],
  "The Crew Falls Out": ["family", "drama"],
  "Crew Birthday Weekend": ["family", "party"],
  // Memory-referencing events
  "Someone brings up that thing": ["family", "drama"],
  "Mom mentions the bad year": ["family", "drama"],
  "Anniversary of a big one": ["drama"],
  "Old crew runs into you": ["street", "drama"],
  // Text-from-X events with string titles
  "Group chat: heavy news": ["family", "drama"],
  "Random number — link tonight?": ["romance", "party"],
  "Family thread: old photo": ["family"]
};
events.forEach(event => {
  if (!event.tags && typeof event.title === "string" && eventTagOverrides[event.title]) {
    event.tags = eventTagOverrides[event.title];
  }
});

// Sanity cap on single-event payouts: max 8x current annual pay or $80k floor.
function sanePayout(amount) {
  const ap = (typeof annualPay === "function" && state.player) ? annualPay(state.player) : 30000;
  const cap = Math.max(80000, ap * 8);
  return Math.min(amount, cap);
}


function riskyPayout(amount, winText, loseText) {
  state.player.risksTaken += 1;
  if (chance(55 + Math.floor(state.player.stats.smarts / 8))) {
    applyEffects(`${winText} You gained ${money(amount)}.`, { money: amount, happiness: 3, karma: -2 }, "good");
  } else {
    applyEffects(`${loseText} You paid ${money(Math.floor(amount * 0.8))} and your record got worse.`, {
      money: -Math.floor(amount * 0.8),
      record: 1,
      happiness: -6,
      karma: -6
    }, "bad");
  }
}

function lifeBias(player, channel) {
  const o = originOf(player.location);
  const looksGap = (player.stats.looks - 50) / 100;

  if (channel === "hireOdds") {
    let bonus = Math.round(looksGap * 14);
    if (player.spawnClass === "nepo") bonus += 12;
    if (player.spawnClass === "comfortable") bonus += 4;
    if (player.spawnClass === "struggling") bonus -= 2;
    if (player.spawnClass === "survival") bonus -= 4;
    if (player.record > 0) bonus -= 10 * Math.min(3, player.record);
    if ((o.salaryMod || 1) > 1.05) bonus += 3;
    return bonus;
  }

  if (channel === "salaryMult") {
    let mult = 1 + looksGap * 0.18 + ((o.salaryMod || 1) - 1);
    if (player.spawnClass === "nepo") mult += 0.18;
    if (player.spawnClass === "survival") mult -= 0.06;
    return Math.max(0.55, mult);
  }

  if (channel === "romance") {
    let bonus = Math.round(looksGap * 32);
    if (player.fame > 30) bonus += 8;
    if (player.streetRep > 20) bonus += 4;
    if (player.spawnClass === "nepo") bonus += 4;
    return bonus;
  }

  if (channel === "followerMult") {
    let mult = 1 + looksGap * 0.45 + ((o.fameMod || 1) - 1);
    if (player.spawnClass === "nepo") mult += 0.12;
    if (player.fame > 50) mult += 0.2;
    return Math.max(0.5, mult);
  }

  return 1;
}

function biasNote(label, n) {
  if (n === 0) return "";
  const sign = n > 0 ? "+" : "";
  return ` (${label}: ${sign}${n})`;
}

function applyForJob() {
  const next = bestAvailableJob();
  if (!next || next.salary <= currentJob().salary) {
    applyEffects("No better job came through.", { happiness: -2 });
    return;
  }
  const bias = lifeBias(state.player, "hireOdds");
  const odds = 45 + Math.floor(state.player.stats.smarts / 4) + Math.floor(state.player.stats.discipline / 5) - state.player.record * 6 + bias;
  if (chance(odds)) {
    state.player.jobId = next.id;
    const salaryMult = lifeBias(state.player, "salaryMult");
    state.player.salaryBonus = Math.round(next.salary * (salaryMult - 1));
    const earnedNote = state.player.salaryBonus > 0
      ? ` ${state.player.spawnClass === "nepo" ? "Family connections" : "Your edge"} pushed the offer ${money(state.player.salaryBonus)} higher.`
      : state.player.salaryBonus < 0
      ? ` They lowballed you by ${money(Math.abs(state.player.salaryBonus))}.`
      : "";
    applyEffects(`You got hired as ${withArticle(next.title)}.${earnedNote}`, { happiness: 6, discipline: 2 }, "good");
  } else {
    const reason = bias < -5 ? " They said 'you weren't quite the fit.'" : bias > 5 ? " You read the room wrong this time." : "";
    applyEffects(`The interview did not go your way.${reason}`, { happiness: -4, discipline: 1 }, "bad");
  }
}

function study() {
  rememberInterest("school", 1);
  const gain = state.player.school.includes("College") ? 7 : 6;
  applyEffects("You studied hard enough to feel the stats move.", { smarts: gain, discipline: 3, happiness: -2 }, "good");
}

function enrollCollege() {
  const player = state.player;
  if (player.age < 18 || player.educationRank >= 4) {
    applyEffects("College is not available right now.", {});
    return;
  }
  if (player.stats.smarts < 58) {
    applyEffects("Your application was rejected. Better grades would help.", { happiness: -4 }, "bad");
    return;
  }
  player.school = "College";
  player.educationRank = 4;
  player.debt += 12000;
  applyEffects("You enrolled in college and took on student debt.", { smarts: 4, discipline: 3 }, "good");
}

function graduateCollege() {
  const player = state.player;
  if (player.educationRank < 4 || player.stats.smarts < 68 || player.stats.discipline < 55) {
    applyEffects("You are not ready to graduate yet.", { happiness: -2 });
    return;
  }
  player.school = "College graduate";
  player.educationRank = 5;
  applyEffects("You graduated college. Better doors opened.", { smarts: 6, happiness: 6 }, "good");
}

function dropOut() {
  const player = state.player;
  if (player.age < 14 || player.educationRank >= 3 || player.dropout) {
    applyEffects("Dropping out is not on the table right now.", {});
    return;
  }
  player.dropout = true;
  rememberInterest("street", 1);
  player.school = "Dropped out";
  player.educationRank = Math.min(player.educationRank, 2);
  applyEffects("You dropped out and got your time back. The future got wider and rougher at the same time.", {
    happiness: 4,
    discipline: -7,
    smarts: -2,
    streetRep: 2
  }, "bad");
}

function getGED() {
  const player = state.player;
  if (!player.dropout || player.certifications.includes("ged")) {
    applyEffects("A GED is not needed right now.", {});
    return;
  }
  const cost = 220;
  if (player.money < cost) {
    applyEffects(`You need ${money(cost - player.money)} more for GED prep and testing.`, { happiness: -1 });
    return;
  }
  player.money -= cost;
  if (chance(42 + Math.floor(player.stats.smarts / 3) + Math.floor(player.stats.discipline / 5))) {
    player.certifications.push("ged");
    player.school = "GED graduate";
    player.educationRank = Math.max(player.educationRank, 3);
    player.dropout = false;
    applyEffects("You earned your GED. The job board started looking less locked.", {
      smarts: 5,
      discipline: 5,
      happiness: 7
    }, "good");
  } else {
    applyEffects("The GED test got you this time, but the prep still helped.", { smarts: 3, discipline: 2, happiness: -3 }, "bad");
  }
}

function tradeSchool() {
  const player = state.player;
  if (player.certifications.includes("trade")) {
    applyEffects("You already have a trade certificate.", {});
    return;
  }
  const cost = 2400;
  if (player.money >= cost) player.money -= cost;
  else {
    player.debt += cost - player.money;
    player.money = 0;
  }
  player.certifications.push("trade");
  player.school = player.school === "Dropped out" ? "Trade certificate" : `${player.school} + trade certificate`;
  player.educationRank = Math.max(player.educationRank, 3);
  applyEffects("You finished trade school. Barber, mechanic, and hands-on career doors opened.", {
    smarts: 4,
    discipline: 6,
    happiness: 4
  }, "good");
}

function enrollClassTrack(id) {
  const player = state.player;
  const track = classTracks[id];
  if (!track) return;
  if (player.classes.includes(id)) {
    applyEffects(`${track.label} is already part of your schedule.`, { discipline: 1 });
    return;
  }
  if (player.classes.length >= 4) {
    applyEffects("Your schedule is packed. Drop something mentally before adding another lane.", { happiness: -1, discipline: 1 });
    return;
  }
  player.classes.push(id);
  rememberInterest(track.interest, 3);
  applyEffects(`You signed up for ${track.label}. That lane is now part of this life.`, track.stat, "good");
}

function afterSchoolClub(kind) {
  const player = state.player;
  const clubs = {
    basketball: { label: "basketball club", interest: "sports", effect: { health: 6, discipline: 3, happiness: 3 } },
    coding: { label: "coding club", interest: "tech", effect: { smarts: 7, discipline: 3, happiness: -1 } },
    band: { label: "band practice", interest: "music", effect: { fame: 2, happiness: 5, discipline: 3 } },
    drama: { label: "drama club", interest: "acting", effect: { fame: 3, happiness: 5, looks: 1 } },
    debate: { label: "debate team", interest: "debate", effect: { smarts: 5, politicalCapital: 3, discipline: 3 } },
    robotics: { label: "robotics team", interest: "tech", effect: { smarts: 6, discipline: 4, businessReputation: 1 } }
  };
  const club = clubs[kind];
  if (!club) return;
  player.afterSchool ??= [];
  if (!player.afterSchool.includes(kind)) player.afterSchool.push(kind);
  rememberInterest(club.interest, 2);
  applyEffects(`You spent the afternoon at ${club.label}. People are starting to know your thing.`, club.effect, "good");
}

function skipClassWithFriends() {
  const player = state.player;
  const person = relationshipTarget();
  changeBond(person, 6);
  rememberInterest("trouble", 1);
  if (chance(62 - player.record * 8)) {
    applyEffects(`You skipped class with ${person.name}. Bad academics, great story.`, {
      happiness: 6,
      smarts: -2,
      discipline: -5,
      fame: 1
    }, "bad");
  } else {
    applyEffects(`You got caught skipping with ${person.name}. The school called home immediately.`, {
      happiness: -5,
      discipline: -3,
      smarts: -1,
      record: chance(8) ? 1 : 0
    }, "bad");
  }
}

function sportsTryouts() {
  const player = state.player;
  const odds = 32 + Math.floor(player.stats.health / 3) + Math.floor(player.stats.discipline / 5);
  if (chance(odds)) {
    rememberInterest("sports", 3);
    applyEffects("You made varsity. Coach said your name in the team meeting.", { health: 5, fame: 4, happiness: 8, discipline: 4 }, "good");
  } else {
    applyEffects("You got cut. The bus ride home was long.", { health: 2, discipline: 5, happiness: -8 }, "bad");
  }
}

function codingHackathon() {
  const player = state.player;
  const odds = 38 + Math.floor(player.stats.smarts / 4);
  if (chance(odds)) {
    const prize = randomInt(800, 8000);
    rememberInterest("tech", 3);
    applyEffects(`Your hackathon team won ${money(prize)} and a meeting with a real VC.`, { money: prize, smarts: 6, businessReputation: 4, fame: 3 }, "good");
  } else {
    applyEffects("You shipped a broken demo at 3 AM. Got nothing but a t-shirt.", { smarts: 4, discipline: 3, happiness: -3 }, "bad");
  }
}

function openMicSet() {
  const player = state.player;
  const odds = 38 + Math.floor(player.stats.looks / 5) + Math.floor(player.fame / 4);
  if (chance(odds)) {
    rememberInterest("music", 3);
    applyEffects("Your set killed. Somebody recorded the chorus and it started circulating.", { fame: 8, happiness: 8, followers: randomInt(80, 1200) }, "good");
  } else {
    applyEffects("The crowd was talking through your second song. Brutal practice.", { discipline: 3, happiness: -5 }, "bad");
  }
}

function artShowcase() {
  const player = state.player;
  rememberInterest("art", 2);
  const sold = chance(48 + Math.floor(player.stats.looks / 6));
  if (sold) {
    const cash = randomInt(180, 3200) + player.fame * 30;
    applyEffects(`A collector at the showcase bought a piece for ${money(cash)}.`, { money: cash, fame: 5, happiness: 7 }, "good");
  } else {
    applyEffects("Nobody bought anything but two people asked for your handle.", { followers: randomInt(20, 240), fame: 2, happiness: -2 }, "bad");
  }
}

function debateTournament() {
  const player = state.player;
  const odds = 32 + Math.floor(player.stats.smarts / 4) + Math.floor(player.stats.discipline / 5);
  if (chance(odds)) {
    rememberInterest("debate", 3);
    applyEffects("You took first at the regional debate tournament. The coach put you on the highlight reel.", { smarts: 6, politicalCapital: 8, fame: 3, happiness: 8 }, "good");
  } else {
    applyEffects("You lost in the semis. The other team had a binder. You had vibes.", { smarts: 4, discipline: 4, happiness: -4 }, "bad");
  }
}

function shopProject() {
  const player = state.player;
  const item = pick(["a custom skateboard", "a hand-built bench", "a powder-coated bike frame", "a guitar amp", "a cutting board set"]);
  if (chance(58 + Math.floor(player.stats.discipline / 5))) {
    const sale = randomInt(220, 1800);
    rememberInterest("trade", 2);
    applyEffects(`Your ${item} sold to a neighbor for ${money(sale)}.`, { money: sale, discipline: 3, businessReputation: 2 }, "good");
  } else {
    applyEffects(`The ${item} cracked during finish. Lesson learned.`, { discipline: 4, happiness: -2 }, "bad");
  }
}

function theaterAudition() {
  const player = state.player;
  const odds = 32 + Math.floor(player.stats.looks / 4) + Math.floor(player.stats.happiness / 8);
  if (chance(odds)) {
    rememberInterest("acting", 3);
    applyEffects("You got the lead. Opening night is in eight weeks.", { fame: 8, looks: 3, happiness: 8 }, "good");
  } else {
    applyEffects("You got cast in the ensemble. Still on the playbill.", { fame: 3, discipline: 2, happiness: 1 });
  }
}

function businessPlanPitch() {
  const player = state.player;
  const odds = 34 + Math.floor(player.stats.smarts / 5) + Math.floor(player.stats.discipline / 5);
  if (chance(odds)) {
    rememberInterest("business", 3);
    const seed = randomInt(400, 6000);
    applyEffects(`The pitch competition awarded you ${money(seed)} in seed money. A teacher introduced you to an investor.`, { money: seed, businessReputation: 4, smarts: 4, fame: 2 }, "good");
  } else {
    applyEffects("The judges said the idea was 'early.' You took the feedback and didn't cry until home.", { smarts: 3, discipline: 3, happiness: -3 }, "bad");
  }
}

function dropAClass() {
  const player = state.player;
  if (!player.classes || player.classes.length === 0) return;
  const dropped = player.classes.pop();
  const track = classTracks[dropped];
  applyEffects(`You dropped ${track?.label || dropped}. Schedule opened up.`, { discipline: -2, happiness: 3 });
}

function classSignAgent() {
  const player = state.player;
  player.classCareer = player.classCareer || {};
  player.classCareer.theater = true;
  player.salaryBonus += 32000;
  applyEffects("A real talent agency signed you off your last audition tape. First commercial books next week.", { fame: 12, looks: 3, happiness: 14, businessReputation: 4 }, "good");
  addCanonEvent(`${player.name} signed with a talent agency at ${player.age}.`);
}

function classGetDrafted() {
  const player = state.player;
  player.classCareer = player.classCareer || {};
  player.classCareer.sports = true;
  player.salaryBonus += 220000;
  applyEffects("Late round pick. You're a pro now. Locker room, jersey, real paycheck.", { fame: 20, fitnessLevel: 8, happiness: 22, businessReputation: 6 }, "good");
  addCanonEvent(`${player.name} got drafted at ${player.age}.`);
}

function classLabelDeal() {
  const player = state.player;
  player.classCareer = player.classCareer || {};
  player.classCareer.music = true;
  const advance = randomInt(20000, 220000);
  applyEffects(`An indie label cut a ${money(advance)} advance for your first project.`, { money: advance, fame: 14, businessReputation: 4, happiness: 18, followers: randomInt(2000, 22000) }, "good");
  addCanonEvent(`${player.name} signed a label deal at ${player.age}.`);
}

function classGalleryRep() {
  const player = state.player;
  player.classCareer = player.classCareer || {};
  player.classCareer.art = true;
  const advance = randomInt(8000, 80000);
  applyEffects(`A real gallerist picked up your work. First show booked. ${money(advance)} on the line.`, { money: advance, fame: 8, businessReputation: 4, happiness: 14, looks: 1 }, "good");
}

function classTechHire() {
  const player = state.player;
  player.classCareer = player.classCareer || {};
  player.classCareer.coding = true;
  player.salaryBonus += 95000;
  applyEffects("Junior engineer offer from a real startup. Equity stub included.", { smarts: 6, businessReputation: 6, happiness: 16, fame: 2 }, "good");
}

function classPoliticalIntern() {
  const player = state.player;
  player.classCareer = player.classCareer || {};
  player.classCareer.debate = true;
  player.politicalCapital = (player.politicalCapital || 0) + 18;
  applyEffects("Senator's office took you as a paid intern. Real chamber access.", { money: -200, politicalCapital: 18, smarts: 4, businessReputation: 5, happiness: 12 }, "good");
}

function classShopPractice() {
  const player = state.player;
  const cost = 4000;
  if (player.money < cost) { applyEffects(`Licensing + first shop runs ${money(cost)}.`, { happiness: -2 }); return; }
  player.classCareer = player.classCareer || {};
  player.classCareer.shop = true;
  player.assets.push({ id: "business", name: "Trade Practice", value: 12000 });
  applyEffects("You got licensed and opened your own service shop. Real customers Monday.", { money: -cost, businessReputation: 8, happiness: 14, discipline: 5 }, "good");
}

function classStartReal() {
  const player = state.player;
  player.classCareer = player.classCareer || {};
  player.classCareer.business = true;
  const seed = randomInt(20000, 180000);
  applyEffects(`Your class business plan caught a real angel. ${money(seed)} seed wired.`, { money: seed, businessReputation: 10, fame: 4, happiness: 16, smarts: 4 }, "good");
  addCanonEvent(`${player.name} raised real seed money at ${player.age}.`);
}

function schoolInternship() {
  const player = state.player;
  const lane = pick(topInterests(player, 5).concat(classLabelList(player)).filter(Boolean));
  const label = lane || "general career";
  if (chance(38 + Math.floor(player.stats.smarts / 4) + Math.floor(player.stats.discipline / 5))) {
    const earned = randomInt(220, 1800);
    applyEffects(`You landed a ${label} internship and made ${money(earned)}.`, {
      money: earned,
      smarts: 4,
      discipline: 4,
      businessReputation: 2
    }, "good");
  } else {
    applyEffects(`The ${label} internship passed on you, but the interview taught you how rooms like that work.`, {
      smarts: 3,
      discipline: 2,
      happiness: -2
    });
  }
}

function joinStreetCrew() {
  const player = state.player;
  if (player.gang) {
    applyEffects(`You are already tied in with ${player.gang.name}.`, {});
    return;
  }
  const crewNames = ["the Ninth Block crew", "a neighborhood set", "the late-night circle", "an older local crew"];
  player.gang = {
    name: pick(crewNames),
    loyalty: randomInt(18, 42),
    rank: "new face",
    years: 0
  };
  rememberInterest("street", 3);
  const person = pick(originOf(player.location).locals.concat(peopleNames));
  player.relationships.push({ id: `crew-${Date.now()}`, name: person, role: "Street crew contact", bond: randomInt(24, 54), type: "friend" });
  applyEffects(`You started hanging with ${player.gang.name}. Doors opened, clean exits got harder.`, {
    streetRep: 8,
    gangHeat: 2,
    happiness: 3,
    discipline: -4,
    karma: -4
  }, "bad");
}

function crewLoyaltyTest() {
  const player = state.player;
  if (!player.gang) {
    joinStreetCrew();
    return;
  }
  player.risksTaken += 1;
  const odds = 36 + Math.floor(player.streetRep / 3) + Math.floor(player.stats.discipline / 5) - player.gangHeat * 4;
  if (chance(odds)) {
    player.gang.loyalty = clamp(player.gang.loyalty + randomInt(8, 18));
    if (player.gang.loyalty > 70) player.gang.rank = "trusted";
    applyEffects(`${player.gang.name} tested you and you passed without making a headline.`, {
      streetRep: 6,
      gangHeat: 2,
      happiness: 4,
      karma: -3
    }, "good");
  } else {
    player.gangHeat += 4;
    applyEffects(`The loyalty test went sideways. Now school, family, and the block are all tense.`, {
      record: chance(28) ? 1 : 0,
      health: -8,
      happiness: -9,
      streetRep: 2,
      karma: -8
    }, "bad");
  }
}

function leaveStreetCrew() {
  const player = state.player;
  if (!player.gang) {
    applyEffects("You are not tied to a crew right now.", {});
    return;
  }
  const oldName = player.gang.name;
  const odds = 42 + player.recovery * 8 + Math.floor(player.stats.discipline / 3) - Math.floor(player.gang.loyalty / 4);
  if (chance(odds)) {
    player.gang = null;
    player.crewExits += 1;
    player.gangHeat = Math.max(0, player.gangHeat - 8);
    addCanonEvent(`Walked away from ${oldName}.`, "good");
    applyEffects(`You stepped away from ${oldName}. Not everybody liked it, but your future got cleaner.`, {
      discipline: 8,
      health: 3,
      happiness: 5,
      streetRep: -4,
      karma: 5
    }, "good");
  } else {
    applyEffects(`Trying to leave ${oldName} got complicated. You need support, money, or distance.`, {
      happiness: -8,
      health: -3,
      gangHeat: 3,
      discipline: 3
    }, "bad");
  }
}

function brokerPeace() {
  const player = state.player;
  if (!player.gang && player.streetRep < 8) {
    applyEffects("There is not enough street tension around you to broker anything.", { discipline: 1 });
    return;
  }
  if (chance(34 + Math.floor(player.stats.smarts / 4) + Math.floor(player.karma / 8))) {
    if (player.gang) player.gang.loyalty = clamp(player.gang.loyalty + 4);
    player.gangHeat = Math.max(0, player.gangHeat - randomInt(3, 8));
    applyEffects("You helped cool down a beef before it became a disaster.", {
      karma: 8,
      smarts: 4,
      happiness: 4,
      streetRep: 2
    }, "good");
  } else {
    applyEffects("You tried to calm things down and got blamed by both sides.", {
      happiness: -7,
      health: -3,
      gangHeat: 2,
      smarts: 2
    }, "bad");
  }
}

function buyAsset(item) {
  const player = state.player;
  if (hasAsset(item.id)) {
    applyEffects(`You already own ${item.name}.`, {});
    return;
  }
  if (player.money < item.cost) {
    const shortfall = item.cost - player.money;
    if (item.id === "condo" || item.id === "business") {
      player.debt += shortfall;
      player.money = 0;
    } else {
      applyEffects(`You need ${money(shortfall)} more for ${item.name}.`, { happiness: -1 });
      return;
    }
  } else {
    player.money -= item.cost;
  }
  player.assets.push({ id: item.id, name: item.name, value: item.value });
  Object.entries(item.stat).forEach(([key, value]) => changeStat(key, value));
  addLog(`You bought ${item.name}.`, "good");
}

function sellAsset(asset) {
  const player = state.player;
  player.assets = player.assets.filter(item => item !== asset);
  player.money += asset.value;
  addLog(`You sold ${asset.name} for ${money(asset.value)}.`);
  finishTurn();
}

function payDebt() {
  const player = state.player;
  if (player.debt <= 0) {
    applyEffects("You have no debt to pay.", {});
    return;
  }
  const payment = Math.min(player.debt, player.money, 4000);
  if (payment <= 0) {
    applyEffects("You do not have cash for a debt payment.", { happiness: -1 }, "bad");
    return;
  }
  player.money -= payment;
  player.debt -= payment;
  applyEffects(`You paid ${money(payment)} toward debt.`, { discipline: 2 }, "good");
}

function firstBirthdayParty() {
  const styles = ["backyard blowout", "apartment packed wall-to-wall", "park function", "restaurant party", "family cookout"];
  const style = pick(styles);
  state.player.relationships.forEach(person => changeBond(person, randomInt(2, 7)));
  applyEffects(`Your family threw a ${style} for your birthday. You mostly smashed cake while everybody acted like it was the Grammys.`, {
    happiness: 10,
    looks: 2,
    karma: 2
  }, "good");
  addCanonEvent(`Your first birthday turned into a full family event.`);
}

function smashCake() {
  applyEffects("You demolished a cake with both hands. The pictures became family lore.", {
    happiness: 8,
    looks: 1,
    health: -1
  }, "good");
}

function learnToWalk() {
  if (chance(55 + Math.floor(state.player.stats.health / 4))) {
    applyEffects("You took your first messy steps and the room lost its mind.", {
      health: 5,
      happiness: 5,
      discipline: 1
    }, "good");
    addCanonEvent("First steps. Everybody overreacted, correctly.");
  } else {
    applyEffects("You tried walking, folded immediately, and still got applause.", {
      health: 2,
      happiness: 4
    });
  }
}

function familyFunction() {
  const scenes = ["cousins running everywhere", "music too loud for a baby", "aunties arguing over food", "somebody recording everything", "a table full of food you could barely eat"];
  const scene = pick(scenes);
  state.player.relationships.forEach(person => changeBond(person, randomInt(1, 5)));
  applyEffects(`The family function had ${scene}. You got passed around like a tiny celebrity.`, {
    happiness: 7,
    looks: 2,
    karma: 1
  }, "good");
}

function daycareChaos() {
  if (chance(58)) {
    applyEffects("Daycare turned into toy politics. You somehow became popular.", {
      happiness: 5,
      looks: 1,
      discipline: 1
    }, "good");
  } else {
    applyEffects("Daycare got loud and somebody bit somebody. You came home exhausted.", {
      happiness: -3,
      health: -1,
      discipline: 1
    }, "bad");
  }
}

function toyObsession() {
  const toys = ["plastic keys", "a loud truck", "a stuffed animal", "a tiny keyboard", "building blocks"];
  const toy = pick(toys);
  applyEffects(`You became obsessed with ${toy}. The household had no choice but to respect it.`, {
    happiness: 6,
    smarts: 2,
    discipline: 1
  }, "good");
}

function throwTantrum() {
  applyEffects("You hit the Target floor screaming. Mom carried you out under one arm.", { happiness: 5, discipline: -2, fame: 1 }, "bad");
}

function imaginaryFriend() {
  const friend = pick(["Bobo", "Bluey", "Mr. Beans", "Captain", "Lily", "The Tall One"]);
  applyEffects(`${friend} became your imaginary friend. You set a place for them at dinner.`, { happiness: 7, smarts: 4 }, "good");
}

function hideFromMom() {
  if (chance(60)) {
    applyEffects("Mom found you under the bed after twenty minutes. She was not amused.", { happiness: 5, discipline: -1, smarts: 2 }, "good");
  } else {
    applyEffects("Mom was scared. She didn't think it was funny when you popped out.", { happiness: -3, discipline: -2 }, "bad");
  }
}

function sleepInParentsBed() {
  applyEffects("You crept into their room at 3 AM and claimed the middle spot. Slept like a king.", { happiness: 8, health: 2 }, "good");
}

function stealCookie() {
  if (chance(62)) {
    applyEffects("You scaled the counter and got the cookie. Crumbs everywhere.", { happiness: 6, smarts: 3, discipline: -1 }, "good");
  } else {
    applyEffects("Got caught with chocolate on your face. No dessert for a week.", { happiness: -2, discipline: 2 }, "bad");
  }
}

function biteAKid() {
  const player = state.player;
  player.risksTaken += 1;
  applyEffects("You bit a kid at daycare. They cried. Daycare called home.", { happiness: 3, karma: -3, discipline: -2, fame: 2 }, "bad");
}

function playMakeBelieve() {
  const role = pick(["a fireman", "a spy", "a chef with three customers", "the cat", "a doctor with a clipboard"]);
  applyEffects(`You were ${role} for the whole afternoon.`, { happiness: 7, smarts: 3, looks: 1 }, "good");
}

function colorOutsideLines() {
  applyEffects("You filled the entire page in one color. Teacher framed it for the fridge.", { happiness: 5, smarts: 2, looks: 1 }, "good");
}

function petTheDog() {
  applyEffects("Family dog let you flop on top of them. Best afternoon of your life.", { happiness: 8, health: 1, karma: 2 }, "good");
}

function firstSentence() {
  if (chance(74)) {
    applyEffects(`You said "${pick(["I want juice", "more cookie", "no bed", "where dad", "I do it"])}". A real full sentence.`, { smarts: 6, happiness: 6 }, "good");
  } else {
    applyEffects("You tried words but they came out gibberish. Still adorable.", { happiness: 3, smarts: 2 });
  }
}

function showAndTell() {
  const item = pick(["a rock you found", "your grandma's coin", "an action figure", "a feather", "your dog"]);
  if (chance(58)) {
    applyEffects(`You showed off ${item}. Class actually cared.`, { happiness: 6, looks: 1, smarts: 2 }, "good");
  } else {
    applyEffects(`Kids laughed at ${item}. You learned what audience reads feel like.`, { happiness: -3, smarts: 3 }, "bad");
  }
}

function parentsStrict(player) {
  return player.spawnClass === "comfortable" && player.religion && (player.religion === "christian" || player.religion === "catholic" || player.religion === "muslim");
}

function currentYear(player) {
  return (player.birthYear || 2005) + player.age;
}

function firstKiss() {
  const player = state.player;
  player.firstKissDone = true;
  const partner = pick(["a classmate", "the friend's older sister", "somebody from camp", "the kid from down the street", "a senior on the team"]);
  if (chance(58 + Math.floor(player.stats.looks / 5))) {
    applyEffects(`First kiss with ${partner}. Awkward in the right way.`, { happiness: 12, looks: 2 }, "good");
  } else {
    applyEffects(`Tried to kiss ${partner}. They turned their head. You died inside for a year.`, { happiness: -8, smarts: 3 }, "bad");
  }
}

function sneakOut() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(parentsStrict(player) ? 38 : 72)) {
    applyEffects("You climbed out the window and came back at 4 AM. Nobody knew.", { happiness: 9, discipline: -2, streetRep: 1, fame: 1 }, "good");
  } else {
    applyEffects("Mom was waiting in the kitchen. The yelling was Biblical.", { happiness: -8, discipline: 2 }, "bad");
  }
}

function housePartyTeen() {
  const player = state.player;
  player.risksTaken += 1;
  const roll = randomInt(1, 100);
  if (roll <= 50) {
    applyEffects("You drank warm Smirnoff out of a Solo cup and made out with somebody in a closet.", { money: -25, happiness: 10, fame: 2, health: -1, looks: 1 }, "good");
  } else if (roll <= 80) {
    applyEffects("You blacked out in the bathroom. Somebody drew on your face.", { happiness: -3, health: -3, fame: 2, discipline: -2 }, "bad");
  } else {
    applyEffects("Cops broke it up. Everybody ran. You hid in the bushes.", { record: chance(20) ? 1 : 0, happiness: 4, fame: 3, streetRep: 1 }, "bad");
  }
}

function seniorProm() {
  const player = state.player;
  player.promDone = true;
  const cost = 320;
  if (player.money < cost) { applyEffects(`Tickets + tux/dress = ${money(cost)}. Short.`, { happiness: -4 }); return; }
  if (chance(60 + Math.floor(player.stats.looks / 5))) {
    applyEffects(`You took ${pick(["the homecoming queen", "your best friend's sister", "the one you'd been writing about", "somebody nobody saw coming"])}. Photos look like a film still.`, { money: -cost, happiness: 18, looks: 4, fame: 3 }, "good");
  } else {
    applyEffects("Date ditched you halfway through. Sat on the curb watching the limo leave.", { money: -cost, happiness: -10, smarts: 3 }, "bad");
  }
}

function graduateHighSchool() {
  const player = state.player;
  if (player.educationRank < 3) player.educationRank = 3;
  addCanonEvent(`${player.name} graduated high school at ${player.age}.`);
  applyEffects("You walked the stage. Family clapped too loud. Cap stayed in the rafters.", { smarts: 5, discipline: 5, happiness: 14, fame: 2 }, "good");
}

function loseVirginity() {
  const player = state.player;
  player.firstTimeDone = true;
  const partner = pick(player.relationships.filter(r => r.type === "partner")) || { name: pick(["somebody from a party", "an older neighbor", "a college visitor", "the lifeguard"]) };
  const outcome = randomInt(1, 100);
  if (outcome <= 55) {
    applyEffects(`First time with ${partner.name}. Awkward, short, real.`, { happiness: 12, looks: 1, smarts: 2 }, "good");
  } else if (outcome <= 80) {
    applyEffects(`First time with ${partner.name} ended in 90 seconds and a panicked text the next day.`, { happiness: 4, smarts: 3 }, "good");
  } else {
    applyEffects(`First time was rough. Awkward enough to put you off for a year.`, { happiness: -6, smarts: 4 }, "bad");
  }
}

function getFakeID() {
  const player = state.player;
  const cost = randomInt(80, 220);
  if (player.money < cost) { applyEffects(`A real fake runs ${money(cost)}.`, { happiness: -2 }); return; }
  player.hasFakeID = true;
  player.risksTaken += 1;
  applyEffects(`You paid ${money(cost)} for a fake. The hologram is half decent.`, { money: -cost, smarts: 2, fame: 1, karma: -1 }, "good");
}

function datingApp() {
  const player = state.player;
  const app = pick(["Hinge", "Tinder", "Bumble", "Raya", "Feeld"]);
  const odds = 42 + Math.floor(player.stats.looks / 4) + Math.floor(player.fame / 6);
  if (chance(odds)) {
    const name = pick(peopleNames.filter(n => !player.relationships.some(r => r.name === n)));
    player.relationships.push({ id: `match-${Date.now()}`, name, role: `${app} match`, bond: randomInt(30, 60), type: "partner" });
    applyEffects(`Matched on ${app} with ${name}. First date Friday.`, { happiness: 8, looks: 1 }, "good");
  } else {
    applyEffects(`${app} was 200 left swipes and three matches who never replied.`, { happiness: -5, smarts: 2 }, "bad");
  }
}

function sneakyLink() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(64 + Math.floor(player.stats.looks / 5))) {
    applyEffects(`After-midnight pull-up. They left before sunrise. Nobody texts the next day.`, { happiness: 8, looks: 1, karma: -1 }, "good");
  } else {
    applyEffects("They posted a story while still at your place. Whole city saw it.", { happiness: -4, fame: 3, looks: 1 }, "bad");
  }
}

function firstHeartbreak() {
  const player = state.player;
  const ex = pick(player.relationships.filter(r => r.type === "partner"));
  if (!ex) return;
  ex.type = "family";
  ex.role = `Ex-${ex.role}`;
  changeBond(ex, -40);
  addCanonEvent(`${player.name}'s heart broke for the first time. ${ex.name} left at ${player.age}.`, "bad");
  applyEffects(`${ex.name} left. The album you listened to for two months is now permanent.`, { happiness: -18, smarts: 6, discipline: 3, looks: 2 }, "bad");
}

function firstConcert() {
  const player = state.player;
  const cost = randomInt(80, 280);
  if (player.money < cost) { applyEffects(`Tickets run ${money(cost)} with fees.`, { happiness: -2 }); return; }
  const artist = pick(["Kanye", "Drake", "Travis Scott", "Tame Impala", "Tyler the Creator", "Beyoncé", "Bad Bunny", "SZA", "Frank Ocean"]);
  applyEffects(`Saw ${artist} live. Front-section GA. Voice gone the next day.`, { money: -cost, happiness: 16, fame: 1, health: -1 }, "good");
}

function firstCar() {
  const player = state.player;
  const cost = randomInt(1500, 4800);
  if (player.money < cost) { applyEffects(`Your first beater runs at least ${money(cost)}.`, { happiness: -3 }); return; }
  player.assets.push({ id: "car", name: "First Car (beater)", value: Math.floor(cost * 0.8) });
  applyEffects(`You bought your first car for ${money(cost)}. The radio works most of the time.`, { money: -cost, happiness: 18, discipline: 3, looks: 1, fame: 2 }, "good");
}

function seniorPranks() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("The class prank made the local news. Principal called it 'creative.'", { happiness: 12, fame: 4, discipline: -2 }, "good");
  } else {
    applyEffects("Caught. Suspended. Walking the stage was a maybe for a minute.", { happiness: -8, record: chance(15) ? 1 : 0, discipline: 1 }, "bad");
  }
}

function frashRush() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58 + Math.floor(player.stats.looks / 5))) {
    const house = pick(["Sigma Nu", "Kappa Sig", "Phi Delt", "ATO", "Alpha Phi", "Tri Delt", "Pi Beta"]);
    applyEffects(`${house} took you. Hazing week was rough but they're your people now.`, { money: -1200, happiness: 12, fame: 4, businessReputation: 3, health: -3, discipline: -2 }, "good");
  } else {
    applyEffects("Got dropped after rush week. The bid never came.", { money: -400, happiness: -10, discipline: 3 }, "bad");
  }
}

function hookupStreak() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(64 + Math.floor(player.stats.looks / 5))) {
    applyEffects("Three in a week. Roommates were impressed and exhausted.", { happiness: 14, looks: 2, fame: 2, karma: -2 }, "good");
  } else {
    applyEffects("Got an STD test. Three negative, one needs treatment.", { money: -240, happiness: -8, health: -4, discipline: 2 }, "bad");
  }
}

function threesome() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(54)) {
    applyEffects("Three of you. Worked out exactly like everyone hoped, somehow.", { happiness: 18, looks: 2, fame: 2, karma: -1 }, "good");
  } else {
    applyEffects("Threesome got awkward. Two of them dated. You weren't invited.", { happiness: -10, smarts: 4 }, "bad");
  }
}

function firstTattoo() {
  const player = state.player;
  player.quirks = player.quirks || {};
  player.quirks.firstTat = true;
  const tat = pick(["a tiny lightning bolt", "your mom's birth year in roman numerals", "an infinity symbol", "your initials on your ribs", "a tribal armband", "a Bible verse"]);
  if (chance(48)) {
    applyEffects(`Your first tattoo: ${tat}. You love it.`, { money: -randomInt(120, 480), happiness: 8, looks: 2, fame: 1 }, "good");
  } else {
    applyEffects(`Your first tattoo: ${tat}. You'll cover it up in eight years.`, { money: -randomInt(120, 480), happiness: 4, looks: -1, discipline: 2 }, "good");
  }
}

function firstPiercing() {
  const player = state.player;
  player.firstPierce = true;
  const piece = pick(["lobe", "septum", "lip", "eyebrow", "industrial", "belly button"]);
  applyEffects(`First piercing: ${piece}. Stings for a week, stays forever.`, { money: -randomInt(40, 120), happiness: 6, looks: chance(60) ? 3 : -1 }, "good");
}

function groupChatDrama() {
  const player = state.player;
  if (chance(52)) {
    applyEffects("Screenshots got passed around. You came out clean. Two friendships didn't.", { happiness: 4, smarts: 3, fame: 2 }, "good");
  } else {
    applyEffects("You're the one who got screenshotted. The whole class read it by lunch.", { happiness: -10, fame: 4, smarts: 4 }, "bad");
  }
}

function seniorSkipDay() {
  applyEffects("The whole grade hit the beach. Cops showed up. Nobody snitched.", { money: -40, happiness: 12, fame: 3, discipline: -2, streetRep: 1 }, "good");
}

function moveOutFirstTime() {
  const player = state.player;
  const cost = 1800;
  if (player.money < cost) { applyEffects(`First-month + deposit = ${money(cost)}. Short.`, { happiness: -4 }); return; }
  player.hasMovedOut = true;
  player.hasApartment = true;
  applyEffects("You moved out. First night in your own place. Even the silence sounded different.", { money: -cost, happiness: 18, discipline: 6, looks: 2 }, "good");
}

function gapYear() {
  applyEffects("You skipped the college rush. Worked, traveled, figured out which lane was actually yours.", { money: randomInt(2000, 8000), happiness: 10, smarts: 6, discipline: 5, looks: 2 }, "good");
}

function runUpOnSomebody() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 52 + Math.floor(player.stats.health / 5) - (player.hasGun ? 0 : 0);
  if (chance(odds)) {
    applyEffects("Square-up. Crowd backed you. You walked away with the W.", { happiness: 8, streetRep: 3, fame: 2 }, "good");
  } else {
    applyEffects("Got dropped. Two front teeth chipped. Friends recorded the whole thing.", { health: -8, happiness: -10, fame: 2, looks: -3 }, "bad");
  }
}

function sleepInCar() {
  applyEffects("Slept in the back seat. Woke up sore, cheap, free.", { health: -2, discipline: 3, streetRep: 1, happiness: 1 });
}

function vegasTripTeen() {
  const player = state.player;
  player.risksTaken += 1;
  const cost = randomInt(600, 1800);
  if (player.money < cost) { applyEffects(`Vegas on a fake ID runs at least ${money(cost)}.`, { happiness: -2 }); return; }
  if (chance(58)) {
    applyEffects("The Strip with the bros under 21. Snuck into a club, won at blackjack, took photos you can't post.", { money: -cost + randomInt(0, 1800), happiness: 16, fame: 4, discipline: -3, looks: 2 }, "good");
  } else {
    applyEffects("Bouncer caught the ID. Got banned from three properties. Drove home at 4 AM.", { money: -cost, happiness: -6, discipline: 2 }, "bad");
  }
}

function heartbreakSong() {
  const player = state.player;
  rememberInterest("music", 2);
  if (chance(38 + Math.floor(player.stats.looks / 6))) {
    const streams = randomInt(800, 14000);
    applyEffects(`Your breakup song picked up ${streams.toLocaleString()} streams. The TikTok edit went around.`, { fame: 5, followers: randomInt(200, 4400), happiness: 8 }, "good");
  } else {
    applyEffects("Posted it to SoundCloud at 3 AM. Twelve plays. Deleted it Tuesday.", { happiness: -3, smarts: 3 });
  }
}

function weeklyTherapy() {
  const player = state.player;
  const cost = 720;
  if (player.money < cost) { applyEffects(`A month of weekly therapy runs ${money(cost)}.`, { happiness: -2 }); return; }
  player.therapyWeeks = (player.therapyWeeks || 0) + 4;
  applyEffects(`Four sessions deep. Patterns named, behaviors caught earlier.`, { money: -cost, happiness: 12, smarts: 4, discipline: 4, karma: 2 }, "good");
}

function tryAntidepressants() {
  const player = state.player;
  const cost = 200;
  if (player.money < cost) { applyEffects(`Co-pay + prescription runs ${money(cost)}.`, { happiness: -2 }); return; }
  player.onSSRI = true;
  if (chance(64)) {
    applyEffects("Six weeks in, the floor came up. Crying stopped feeling random.", { money: -cost, happiness: 16, discipline: 4 }, "good");
  } else {
    applyEffects("Wrong med. Numbness, weight gain, no upside.", { money: -cost, happiness: -6, looks: -2, discipline: 3 }, "bad");
  }
}

function panicAttack() {
  applyEffects("Heart raced, hands shook, room shrunk for twenty minutes. You sat with it.", { health: -2, happiness: -6, smarts: 3, discipline: 3 }, "bad");
}

function depressionSpiral() {
  applyEffects("Three days you don't remember. The shower water ran cold before you got in.", { health: -4, happiness: -8, discipline: 4, smarts: 3 }, "bad");
}

function breathworkRetreat() {
  const player = state.player;
  const cost = 800;
  if (player.money < cost) { applyEffects(`Retreat costs ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects("Three days of guided breathing. You cried in a circle of strangers and meant it.", { money: -cost, happiness: 18, discipline: 5, karma: 4, health: 3 }, "good");
}

function emdrTherapy() {
  const player = state.player;
  const cost = 400;
  if (player.money < cost) { applyEffects(`EMDR session runs ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects("The therapist guided your eyes through the memory. Charge drained from it.", { money: -cost, happiness: 14, smarts: 5, discipline: 3 }, "good");
}

function journalSession() {
  applyEffects("Three pages, pen never lifted. You named things you'd been avoiding.", { happiness: 5, smarts: 3, discipline: 3 }, "good");
}

function mindfulnessApp() {
  applyEffects("Daily ten-minute sessions for a month. Reactivity dropped.", { money: -15, happiness: 6, discipline: 5, smarts: 2 }, "good");
}

function sleepReset() {
  applyEffects("Two weeks of strict sleep hygiene. Your face changed.", { health: 6, looks: 4, happiness: 6, discipline: 4 }, "good");
}

function therapyGroup() {
  applyEffects("You sat in a circle and listened. Eventually you talked.", { money: -60, happiness: 7, karma: 3, discipline: 2 }, "good");
}

function adhdDiagnosis() {
  const player = state.player;
  player.diagnosedADHD = true;
  applyEffects("Eval came back positive. A lot of your life makes more sense now.", { money: -400, smarts: 4, discipline: 3, happiness: 6 }, "good");
}

function identityWork() {
  applyEffects("You sat with who you are when nobody is watching. Less performance, more spine.", { happiness: 10, smarts: 4, discipline: 4, karma: 2 }, "good");
}

function faithPractice() {
  const player = state.player;
  applyEffects(`You leaned into your ${player.religionLabel || "faith"}. Community held.`, { happiness: 10, karma: 6, discipline: 4 }, "good");
}

function acupuncture() {
  applyEffects("Needles, dim light, herbal tea. Body unclenched.", { money: -120, health: 5, happiness: 4 }, "good");
}

function plantMedicine() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("The ceremony cracked you open. Real shifts. You won't be the same.", { money: -1200, happiness: 22, smarts: 8, karma: 6, discipline: 4 }, "good");
  } else {
    applyEffects("Bad ceremony. The shaman wasn't legit. You spent the night in panic.", { money: -1200, happiness: -16, health: -6, smarts: 3 }, "bad");
  }
}

function liftWeights() {
  rememberInterest("fitness", 2);
  applyEffects("You lifted heavy and left with main-character posture.", {
    health: 6,
    looks: 3,
    discipline: 4,
    fitnessLevel: 7,
    happiness: -1
  }, "good");
  maybeMicroScene("lift", 18);
}

function cardioRun() {
  rememberInterest("fitness", 1);
  applyEffects("You ran until your brain got quiet and your lungs remembered their job.", {
    health: 8,
    discipline: 3,
    fitnessLevel: 5,
    happiness: 2
  }, "good");
  maybeMicroScene("cardio", 18);
}

function yogaClass() {
  applyEffects("Yoga fixed a little posture, stress, and attitude all at once.", {
    health: 4,
    happiness: 5,
    discipline: 3,
    looks: 1,
    fitnessLevel: 3
  }, "good");
}

function mealPrep() {
  rememberInterest("food", 1);
  applyEffects("You meal-prepped like somebody who plans to survive the plot.", {
    money: -85,
    health: 5,
    discipline: 5,
    dietScore: 10,
    happiness: -1
  }, "good");
  maybeMicroScene("mealprep", 22);
}

function fastFoodBinge() {
  applyEffects("You went full fast-food spiral. Delicious, expensive in the long run.", {
    money: -32,
    happiness: 5,
    health: -4,
    looks: -1,
    dietScore: -12,
    discipline: -2
  }, "bad");
}

function cleanEatingMonth() {
  const cost = 260;
  if (state.player.money < cost) {
    applyEffects(`You need ${money(cost - state.player.money)} more for a clean eating month.`, { happiness: -1 });
    return;
  }
  applyEffects("You locked in on clean food for a month. Annoying, but the mirror noticed.", {
    money: -cost,
    health: 8,
    looks: 4,
    discipline: 4,
    dietScore: 15
  }, "good");
}

function fancyDinner() {
  const cost = randomInt(140, 620);
  if (state.player.money < cost) {
    applyEffects(`You need ${money(cost - state.player.money)} more for that dinner.`, { happiness: -1 });
    return;
  }
  applyEffects("You had a fancy dinner and turned the table into a social scene.", {
    money: -cost,
    happiness: 8,
    looks: 2,
    fame: 1,
    dietScore: chance(45) ? 3 : -3
  }, "good");
}

function proteinBulk() {
  applyEffects("You ran a protein bulk and started looking harder to move.", {
    money: -180,
    health: 4,
    looks: 3,
    fitnessLevel: 6,
    dietScore: 4,
    discipline: 2
  }, "good");
}

function pickupBasketball() {
  const player = state.player;
  if (chance(56 + Math.floor(player.stats.health / 6))) {
    applyEffects("You ran four games at the park and didn't sit. Crew respected.", { health: 5, happiness: 6, fitnessLevel: 3, streetRep: 1 }, "good");
  } else {
    applyEffects("Rolled an ankle on the third game. Iced it on the bench.", { health: -6, discipline: 2, happiness: -3 }, "bad");
  }
}

function crossfitClass() {
  applyEffects("You finished the WOD. Couldn't walk down stairs for two days.", { money: -35, health: 5, fitnessLevel: 6, discipline: 4, happiness: -1 }, "good");
}

function bjjTraining() {
  const player = state.player;
  rememberInterest("martial", 2);
  if (player.bjjBelt === undefined) player.bjjBelt = "white";
  if (chance(8 + Math.floor(player.stats.discipline / 6))) {
    const belts = ["white", "blue", "purple", "brown", "black"];
    const cur = belts.indexOf(player.bjjBelt);
    if (cur >= 0 && cur < belts.length - 1) {
      player.bjjBelt = belts[cur + 1];
      applyEffects(`You got promoted to ${player.bjjBelt} belt. The whole gym clapped.`, { money: -180, health: 5, fitnessLevel: 8, discipline: 6, streetRep: 3, happiness: 10 }, "good");
      return;
    }
  }
  applyEffects(`You rolled hard. Got tapped twice, tapped once. Mat time logged.`, { money: -180, health: 4, fitnessLevel: 5, discipline: 4 }, "good");
}

function boxingGym() {
  applyEffects("You hit the heavy bag until your hands shook. Coach said your footwork is getting cleaner.", { money: -120, health: 4, fitnessLevel: 5, discipline: 4, streetRep: 1 }, "good");
}

function hireTrainer() {
  const player = state.player;
  const cost = randomInt(400, 1200);
  if (player.money < cost) { applyEffects(`A real trainer runs ${money(cost)}/month. You're short.`, { happiness: -2 }); return; }
  applyEffects(`You hired a trainer who programs your sessions. Form fixed, gains hit faster.`, { money: -cost, health: 7, fitnessLevel: 9, looks: 3, discipline: 4 }, "good");
}

function run5K() {
  const player = state.player;
  if (chance(72 + Math.floor(player.stats.health / 6))) {
    const time = randomInt(22, 38);
    applyEffects(`You crossed the 5K line at ${time} minutes. Bib stays on the fridge.`, { money: -40, health: 5, fitnessLevel: 4, discipline: 3, happiness: 8 }, "good");
  } else {
    applyEffects("You walked the back half. Still finished though.", { money: -40, fitnessLevel: 2, discipline: 4, happiness: 3 });
  }
}

function powerliftingMeet() {
  const player = state.player;
  const total = randomInt(900, 1700) + player.fitnessLevel * 8;
  if (chance(50 + Math.floor(player.fitnessLevel / 3))) {
    applyEffects(`You hit a ${total} lb total on the platform. PR on the deadlift.`, { money: -120, fitnessLevel: 8, looks: 3, fame: 2, happiness: 10 }, "good");
  } else {
    applyEffects("You bombed out on bench. Two red lights, no third attempt.", { money: -120, health: -2, discipline: 4, happiness: -6 }, "bad");
  }
}

function bodybuildingShow() {
  const player = state.player;
  if (chance(38 + Math.floor(player.fitnessLevel / 3) + Math.floor(player.stats.looks / 6))) {
    applyEffects("You placed top 3 in your class. Photos got shared by gym pages.", { money: -800, looks: 8, fame: 6, fitnessLevel: 3, happiness: 10 }, "good");
  } else {
    applyEffects("Didn't place. Three months of prep for a polite handshake.", { money: -800, discipline: 5, happiness: -8 }, "bad");
  }
}

function coldPlunge() {
  applyEffects("Three minutes at 38°F. You walked out alive and clear.", { health: 3, discipline: 4, happiness: 4 }, "good");
}

function saunaSession() {
  applyEffects("Twenty minutes in the sauna. Sweat dropped off you in sheets.", { money: -25, health: 3, happiness: 5, discipline: 1 }, "good");
}

function intermittentFast() {
  const player = state.player;
  if (chance(58 + Math.floor(player.stats.discipline / 5))) {
    applyEffects("You held the 16:8 window for a month. Sharper, leaner, dialed.", { health: 4, dietScore: 6, fitnessLevel: 3, discipline: 6, looks: 2 }, "good");
  } else {
    applyEffects("You cracked at week two. The fast turned into a binge cycle.", { health: -2, dietScore: -3, discipline: -1, happiness: -3 }, "bad");
  }
}

function carnivorePhase() {
  const player = state.player;
  if (chance(48)) {
    applyEffects("Meat-only month. Inflammation crashed. Sleep got real.", { money: -380, health: 5, fitnessLevel: 4, dietScore: 4, discipline: 4 }, "good");
  } else {
    applyEffects("Bloodwork came back rough. You bailed at week three.", { money: -380, health: -3, happiness: -2 }, "bad");
  }
}

function plantBased() {
  applyEffects("Plant-based month. Skin cleared, digestion smoothed, energy stable.", { money: -240, health: 5, dietScore: 7, looks: 2, karma: 3, happiness: 4 }, "good");
}

function tryGear() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(64)) {
    applyEffects("First cycle hit. Strength went up, mirror gets longer attention.", { money: -1200, fitnessLevel: 14, looks: 8, health: -4, karma: -2, happiness: 6 }, "good");
  } else {
    applyEffects("Side effects hit hard. Liver values trashed, sleep gone.", { money: -1200, fitnessLevel: 6, health: -16, looks: 3, happiness: -8 }, "bad");
  }
}

function tryOzempic() {
  const player = state.player;
  if (chance(72)) {
    applyEffects("Appetite cut by 60%. Weight dropped fast.", { money: -600, dietScore: -4, fitnessLevel: -2, looks: 6, happiness: 4 }, "good");
  } else {
    applyEffects("Side effects hit ugly. You quit it at week six.", { money: -600, health: -4, happiness: -4 }, "bad");
  }
}

const activityCategories = [
  {
    id: "little",
    name: "Little Kid",
    hint: "Family, birthdays, chaos",
    actions: [
      { name: "First Birthday Party", text: "Family turns age 1 into a whole event.", available: p => p.age === 1, run: firstBirthdayParty },
      { name: "Smash Cake", text: "Make a mess and become family lore.", available: p => p.age >= 1 && p.age <= 3, run: smashCake },
      { name: "Learn To Walk", text: "Try the big milestone.", available: p => p.age >= 1 && p.age <= 2, run: learnToWalk },
      { name: "Family Function", text: "Get passed around while everyone eats and talks.", available: p => p.age >= 1 && p.age <= 6, run: familyFunction },
      { name: "Daycare Chaos", text: "Tiny social drama with toys and snacks.", available: p => p.age >= 2 && p.age <= 5, run: daycareChaos },
      { name: "Toy Obsession", text: "Pick one object and make it your whole personality.", available: p => p.age <= 5, run: toyObsession },
      { name: "Throw Tantrum", text: "Lay on the floor of Target. Make it a scene.", available: p => p.age >= 1 && p.age <= 5, run: throwTantrum },
      { name: "Imaginary Friend", text: "Invent a person nobody else can see.", available: p => p.age >= 3 && p.age <= 7, run: imaginaryFriend },
      { name: "Hide From Mom", text: "Pick a spot. Don't answer. Watch her panic.", available: p => p.age >= 2 && p.age <= 5, run: hideFromMom },
      { name: "Sleep In Parents' Bed", text: "Pretend you had a bad dream. Steal warmth.", available: p => p.age >= 2 && p.age <= 6, run: sleepInParentsBed },
      { name: "Steal A Cookie", text: "Climb the counter. Take the cookie.", available: p => p.age >= 2 && p.age <= 6, run: stealCookie },
      { name: "Bite A Kid", text: "Daycare politics. Real teeth, real consequences.", risky: true, available: p => p.age >= 2 && p.age <= 5, run: biteAKid },
      { name: "Play Make-Believe", text: "Be the fireman. Be the spy. Be the cat.", available: p => p.age >= 2 && p.age <= 7, run: playMakeBelieve },
      { name: "Color Outside The Lines", text: "Show them what art really is.", available: p => p.age >= 2 && p.age <= 6, run: colorOutsideLines },
      { name: "Pet The Dog", text: "Get on the floor with the family dog.", available: p => p.age >= 1 && p.age <= 7, run: petTheDog },
      { name: "First Sentence", text: "String real words together.", available: p => p.age >= 1 && p.age <= 3, run: firstSentence },
      { name: "Show & Tell", text: "Bring something from home and explain it.", available: p => p.age >= 4 && p.age <= 7, run: showAndTell }
    ]
  },
  {
    id: "teen",
    name: "Teen Years",
    hint: "Prom, parties, firsts, mistakes",
    actions: [
      { name: "First Kiss", text: "Lean in. Don't think too hard.", available: p => p.age >= 12 && p.age <= 22 && !p.firstKissDone, run: firstKiss },
      { name: "Sneak Out", text: "Out the window after lights out.", available: p => p.age >= 13 && p.age <= 22 && (!parentsStrict(p) || chance(40)), run: sneakOut },
      { name: "House Party", text: "Crash a party where somebody's parents are gone.", available: p => p.age >= 14 && p.age <= 24, run: housePartyTeen },
      { name: "Senior Prom", text: "Tux/dress, limo, after-party.", available: p => p.age >= 16 && p.age <= 19 && !p.dropout && !p.promDone, run: seniorProm },
      { name: "Graduate High School", text: "Walk the stage. Toss the cap.", available: p => p.age >= 17 && p.age <= 19 && !p.dropout && p.educationRank < 3, run: graduateHighSchool },
      { name: "Lose Virginity", text: "First time. Memorable, awkward, fast.", available: p => p.age >= 14 && p.age <= 24 && !p.firstTimeDone, run: loseVirginity },
      { name: "Fake ID", text: "Pay a guy. Get in places you shouldn't.", risky: true, available: p => p.age >= 16 && p.age <= 20 && p.money >= 80 && !p.hasFakeID, run: getFakeID },
      { name: "Dating App", text: "Set up the profile. Pick the best three photos.", available: p => p.age >= 16 && p.age <= 35, run: datingApp },
      { name: "Sneaky Link", text: "After-midnight DM. They pulled up.", risky: true, available: p => p.age >= 16 && p.age <= 28, run: sneakyLink },
      { name: "First Heartbreak", text: "They left. The song hit different.", available: p => p.age >= 14 && p.age <= 26 && p.relationships.some(r => r.type === "partner"), run: firstHeartbreak },
      { name: "First Concert", text: "GA pit. Strangers screaming the words.", available: p => p.age >= 13 && p.age <= 22, run: firstConcert },
      { name: "First Car", text: "Beater with a warranty. Freedom unlocked.", available: p => p.age >= 16 && p.age <= 22 && p.money >= 1500 && !hasAsset("car"), run: firstCar },
      { name: "Senior Pranks", text: "Plastic forks, bricks of paper, fire hose.", risky: true, available: p => p.age === 17 || p.age === 18, run: seniorPranks },
      { name: "Frat/Sorority Rush", text: "Hazing week, paddles, lifelong network.", risky: true, available: p => p.age >= 18 && p.age <= 22 && p.educationRank === 4, run: frashRush },
      { name: "College Hookup Streak", text: "Three in a week. Don't text after.", risky: true, available: p => p.age >= 18 && p.age <= 24, run: hookupStreak },
      { name: "Threesome", text: "Two of them. One of you. Or vice versa.", risky: true, available: p => p.age >= 18 && p.age <= 35, run: threesome },
      { name: "First Tattoo", text: "Small, dumb, permanent.", risky: true, available: p => p.age >= 17 && p.age <= 22 && !p.quirks?.firstTat, run: firstTattoo },
      { name: "First Piercing", text: "Lobe, septum, lip, eyebrow.", available: p => p.age >= 13 && p.age <= 22 && !p.firstPierce, run: firstPiercing },
      { name: "Group Chat Drama", text: "Screenshots got sent. The whole class is in it.", available: p => p.age >= 13 && p.age <= 22, run: groupChatDrama },
      { name: "Senior Skip Day", text: "Whole class out at the beach.", available: p => p.age === 17 || p.age === 18, run: seniorSkipDay },
      { name: "Move Out", text: "Pack the car. Leave the parents.", available: p => p.age >= 18 && p.age <= 26 && !p.hasMovedOut, run: moveOutFirstTime },
      { name: "Gap Year", text: "Skip college. Travel, work, figure it out.", available: p => p.age === 18 || p.age === 19, run: gapYear },
      { name: "Run Up On Somebody", text: "Square up. The boys are watching.", risky: true, available: p => p.age >= 14 && p.age <= 22, run: runUpOnSomebody },
      { name: "Sleep In Car", text: "Crash in the back seat. Wake up sore.", available: p => p.age >= 16 && p.age <= 26, run: sleepInCar },
      { name: "Vegas Trip (Underage)", text: "Fake ID + group of friends + the strip.", risky: true, available: p => p.age >= 17 && p.age <= 20 && p.hasFakeID && p.money >= 500, run: vegasTripTeen },
      { name: "First Heartbreak Song", text: "Write or record it. Throw it on Soundcloud.", available: p => p.age >= 14 && p.age <= 24, run: heartbreakSong }
    ]
  },
  {
    id: "school",
    name: "School / Work",
    hint: "Grades, jobs, career moves",
    actions: [
      { name: "Study Hard", text: "Raise smarts and discipline.", available: p => p.age >= 4, run: study },
      { name: "Drop Out", text: "Leave school early and unlock rougher routes.", risky: true, available: p => p.age >= 14 && p.age < 19 && p.educationRank < 3 && !p.dropout, run: dropOut },
      { name: "Get GED", text: "Recover education options after dropping out.", available: p => p.age >= 16 && p.dropout && !p.certifications.includes("ged"), run: getGED },
      { name: "Trade School", text: "Open barber, mechanic, and practical work paths.", available: p => p.age >= 17 && !p.certifications.includes("trade"), run: tradeSchool },
      { name: "Part-Time Shift", text: "Earn quick money, lose a little mood.", available: p => p.age >= 13, run: () => {
        const earned = randomInt(90, 520);
        applyEffects(`You worked a side shift for ${money(earned)}.`, { money: earned, health: -1, happiness: -2, discipline: 2 });
      } },
      { name: "Apply For Job", text: "Try to move into the best job you qualify for.", available: p => p.age >= 16, run: applyForJob },
      { name: "Ask For Promotion", text: "Push your career without switching jobs.", available: p => p.age >= 18 && p.jobId !== "none", run: askPromotion },
      { name: "Negotiate Salary", text: "Counter the offer on the table.", available: p => p.age >= 18 && p.jobId !== "none", run: negotiateSalary },
      { name: "Quit Job", text: "Walk out. Cash flow ends today.", available: p => p.age >= 16 && p.jobId !== "none", run: quitJob },
      { name: "Switch Career", text: "Burn your role, retrain for something new.", available: p => p.age >= 22 && p.jobId !== "none", run: switchCareer },
      { name: "Get Headhunted", text: "Recruiter slid into your inbox.", available: p => p.age >= 22 && p.jobId !== "none" && p.fame >= 5, run: getHeadhunted },
      { name: "Take Sabbatical", text: "Three months off to reset.", available: p => p.age >= 25 && p.jobId !== "none" && p.money >= 4000, run: takeSabbatical },
      { name: "Skip Work", text: "Call out. Risk getting written up.", risky: true, available: p => p.age >= 16 && p.jobId !== "none", run: skipWork },
      { name: "Apprenticeship", text: "Learn a trade under somebody who does it.", available: p => p.age >= 16 && !p.certifications.includes("apprentice"), run: apprenticeship },
      { name: "Tutor Kids", text: "Side income, decent hours.", available: p => p.age >= 16 && p.stats.smarts >= 55, run: tutorKids },
      { name: "Pass The Bar", text: "Take the bar exam after law school.", available: p => p.age >= 24 && p.educationRank === 6 && !p.certifications.includes("bar"), run: passTheBar },
      { name: "Medical Boards", text: "Pass the boards after med school.", available: p => p.age >= 26 && p.educationRank === 6 && !p.certifications.includes("md"), run: medicalBoards },
      { name: "Night Class", text: "Pay for a focused skill jump.", available: p => p.age >= 16, run: nightClass },
      { name: "Enroll In College", text: "Borrow tuition and improve your career ceiling.", available: p => p.age >= 18 && p.educationRank === 3, run: enrollCollege },
      { name: "Graduate College", text: "Finish college if your stats are ready.", available: p => p.educationRank === 4, run: graduateCollege },
      { name: "Professional School", text: "Big debt, elite career ceiling.", available: p => p.age >= 22 && p.educationRank === 5 && p.stats.smarts >= 78, run: professionalSchool }
    ]
  },
  {
    id: "classes",
    name: "Classes",
    hint: "Schedule, clubs, future paths",
    actions: [
      { name: "Take Sports", text: "Athlete lane, health, discipline.", available: p => p.age >= 6 && !hasClassTrack("sports"), run: () => enrollClassTrack("sports") },
      { name: "Take Coding", text: "Tech lane, smarts, future startup options.", available: p => p.age >= 9 && !hasClassTrack("coding"), run: () => enrollClassTrack("coding") },
      { name: "Take Music", text: "Artist lane, mood, fame potential.", available: p => p.age >= 7 && !hasClassTrack("music"), run: () => enrollClassTrack("music") },
      { name: "Take Art", text: "Creative lane, style, expression.", available: p => p.age >= 7 && !hasClassTrack("art"), run: () => enrollClassTrack("art") },
      { name: "Join Debate", text: "Confidence, politics, smarter arguments.", available: p => p.age >= 10 && !hasClassTrack("debate"), run: () => enrollClassTrack("debate") },
      { name: "Shop Class", text: "Hands-on skills, trade path energy.", available: p => p.age >= 12 && !hasClassTrack("shop"), run: () => enrollClassTrack("shop") },
      { name: "Business Class", text: "Money brain and founder energy.", available: p => p.age >= 13 && !hasClassTrack("business"), run: () => enrollClassTrack("business") },
      { name: "Theater Class", text: "Performance, confidence, acting path.", available: p => p.age >= 10 && !hasClassTrack("theater"), run: () => enrollClassTrack("theater") },
      { name: "Skip Class", text: "Bond with friends, risk discipline.", risky: true, available: p => p.age >= 11 && p.age <= 19, run: skipClassWithFriends },
      { name: "Find Internship", text: "Turn interests into career access.", available: p => p.age >= 15 && (p.classes.length > 0 || topInterests(p).length > 0), run: schoolInternship },
      { name: "Sports Tryouts", text: "Make varsity. Cut day decides everything.", available: p => p.age >= 12 && p.age <= 22 && hasClassTrack("sports"), run: sportsTryouts },
      { name: "Coding Hackathon", text: "48-hour build sprint. Win a prize or eat ramen.", available: p => p.age >= 13 && hasClassTrack("coding"), run: codingHackathon },
      { name: "Open Mic Set", text: "Five songs in front of a tough room.", available: p => p.age >= 12 && hasClassTrack("music"), run: openMicSet },
      { name: "Art Showcase", text: "Show pieces at a gallery night.", available: p => p.age >= 13 && hasClassTrack("art"), run: artShowcase },
      { name: "Debate Tournament", text: "Travel to nationals. Argue for a living.", available: p => p.age >= 12 && hasClassTrack("debate"), run: debateTournament },
      { name: "Shop Project", text: "Build something with your hands. Sell it.", available: p => p.age >= 14 && hasClassTrack("shop"), run: shopProject },
      { name: "Theater Audition", text: "Audition for the school production lead.", available: p => p.age >= 12 && hasClassTrack("theater"), run: theaterAudition },
      { name: "Business Plan Pitch", text: "Pitch a real startup idea to the class.", available: p => p.age >= 14 && hasClassTrack("business"), run: businessPlanPitch },
      { name: "Drop A Class", text: "Make space on your schedule. Lose the lane.", available: p => p.classes && p.classes.length > 0, run: dropAClass },
      { name: "Sign With Agent", text: "Theater path → real talent agency signs you.", available: p => p.age >= 16 && hasClassTrack("theater") && !p.classCareer?.theater, run: classSignAgent },
      { name: "Get Drafted", text: "Sports path → pro league drafts you in the late rounds.", available: p => p.age >= 17 && p.age <= 23 && hasClassTrack("sports") && p.fitnessLevel >= 30 && !p.classCareer?.sports, run: classGetDrafted },
      { name: "Land Label Deal", text: "Music path → indie label signs you.", available: p => p.age >= 17 && hasClassTrack("music") && p.fame >= 8 && !p.classCareer?.music, run: classLabelDeal },
      { name: "Get Repped By Gallery", text: "Art path → gallerist picks up your portfolio.", available: p => p.age >= 18 && hasClassTrack("art") && !p.classCareer?.art, run: classGalleryRep },
      { name: "Win Junior Tech Hire", text: "Coding path → real engineering offer from a startup.", available: p => p.age >= 17 && hasClassTrack("coding") && !p.classCareer?.coding, run: classTechHire },
      { name: "Political Internship", text: "Debate path → senator's office takes you on.", available: p => p.age >= 17 && hasClassTrack("debate") && !p.classCareer?.debate, run: classPoliticalIntern },
      { name: "Open A Practice", text: "Shop path → license + your own service operation.", available: p => p.age >= 18 && hasClassTrack("shop") && p.money >= 4000 && !p.classCareer?.shop, run: classShopPractice },
      { name: "Start Real Company", text: "Business path → real seed round on your class idea.", available: p => p.age >= 18 && hasClassTrack("business") && !p.classCareer?.business, run: classStartReal }
    ]
  },
  {
    id: "mind",
    name: "Mind & Body",
    hint: "Health, mood, discipline",
    actions: [
      { name: "Gym Routine", text: "Improve health and looks.", available: p => p.age >= 8, run: () => { applyEffects("You kept a solid workout routine.", { health: 7, looks: 3, discipline: 2 }, "good"); maybeMicroScene("gym", 22); } },
      { name: "Therapy Session", text: "Costs money but helps happiness.", available: p => p.age >= 16, run: () => { applyEffects("You talked through what was weighing on you.", { money: -180, happiness: 9, discipline: 2 }, "good"); maybeMicroScene("therapy", 28); } },
      { name: "Meditate", text: "Slow life down and raise discipline.", available: p => p.age >= 10, run: () => applyEffects("You took a quiet hour and reset.", { happiness: 4, discipline: 5 }) },
      { name: "Makeover", text: "Spend cash to improve looks.", available: p => p.age >= 14, run: () => applyEffects("You upgraded your look.", { money: -260, looks: 7, happiness: 3 }, "good") },
      { name: "Affirm Identity", text: "Style, community, and care that fits who you are.", available: p => p.age >= 12, run: () => applyEffects("You made space for your identity and felt more at home in your life.", { money: -120, happiness: 9, looks: 3, health: 1 }, "good") },
      { name: "Medical Checkup", text: "Prevent long-term health trouble.", available: p => p.age >= 18, run: () => applyEffects("The checkup caught small problems early.", { money: -340, health: 8, discipline: 2 }, "good") },
      { name: "Shave Head", text: "Buzz it down. Different look, immediate.", available: p => p.age >= 14 && !p.quirks?.bald && !p.quirks?.cancer, run: () => {
        state.player.quirks = state.player.quirks || {};
        state.player.quirks.bald = true;
        state.player.quirks.crazyHair = false;
        applyEffects("You sat in front of the mirror with the clippers. New face entirely.", { discipline: 4, looks: chance(50) ? 4 : -2, happiness: 4 }, "good");
      } },
      { name: "Grow It Out Wild", text: "Loud hair. Statement era.", available: p => p.age >= 14 && !p.quirks?.bald && !p.quirks?.crazyHair && !p.quirks?.cancer, run: () => {
        state.player.quirks = state.player.quirks || {};
        state.player.quirks.crazyHair = true;
        state.player.quirks.bald = false;
        applyEffects("You let it grow. Made it bigger. People had opinions.", { fame: 4, looks: 2, discipline: -2 }, "good");
      } },
      { name: "Get Tattoos", text: "Sit through the needle. Mark something on you forever.", risky: true, available: p => p.age >= 16 && !p.quirks?.tattoos, run: () => {
        state.player.quirks = state.player.quirks || {};
        state.player.quirks.tattoos = true;
        applyEffects("Three sessions. Worth every hour.", { money: -randomInt(200, 1400), looks: 3, fame: 2, happiness: 5, karma: -1 }, "good");
      } }
      ,
      { name: "Volunteer", text: "Trade time for karma and happiness.", available: p => p.age >= 12, run: () => { applyEffects("You volunteered and felt useful.", { happiness: 5, karma: 7, discipline: 1 }, "good"); maybeMicroScene("volunteer", 18); } },
      { name: "Weekly Therapy", text: "Commit to a weekly. Real reps, not one session.", available: p => p.age >= 16 && p.money >= 200, run: weeklyTherapy },
      { name: "Try Antidepressants", text: "Get on an SSRI. Six-week wait for the lift.", risky: true, available: p => p.age >= 18 && p.stats.happiness < 50, run: tryAntidepressants },
      { name: "Panic Attack", text: "Heart races, room shrinks. You can't will it away.", available: p => p.age >= 14 && p.stats.happiness < 60, run: panicAttack },
      { name: "Depression Spiral", text: "Sit in it. Acknowledge it. Don't pretend.", available: p => p.age >= 14 && p.stats.happiness < 40, run: depressionSpiral },
      { name: "Breathwork Retreat", text: "Three days of guided breathing. Real release.", available: p => p.age >= 18 && p.money >= 800, run: breathworkRetreat },
      { name: "EMDR Therapy", text: "Eye movement work on a specific trauma.", available: p => p.age >= 18 && p.money >= 400, run: emdrTherapy },
      { name: "Journal", text: "Write three pages. Don't read them back.", available: p => p.age >= 12, run: journalSession },
      { name: "Mindfulness App", text: "Daily ten minutes for a month.", available: p => p.age >= 14, run: mindfulnessApp },
      { name: "Sleep Reset", text: "No screens after 9. Same wake time every day.", available: p => p.age >= 14, run: sleepReset },
      { name: "Therapy Group", text: "A circle of people doing the same work.", available: p => p.age >= 18, run: therapyGroup },
      { name: "ADHD Diagnosis", text: "Get evaluated. Find out what your brain is.", available: p => p.age >= 14 && !p.diagnosedADHD, run: adhdDiagnosis },
      { name: "Identity Work", text: "Sit with who you are when nobody is watching.", available: p => p.age >= 16, run: identityWork },
      { name: "Faith Practice", text: "Pray, read, attend, sit in it.", available: p => p.age >= 12 && p.religion && p.religion !== "none" && p.religion !== "atheist", run: faithPractice },
      { name: "Acupuncture", text: "Needles, dim room, surprising results.", available: p => p.age >= 18 && p.money >= 120, run: acupuncture },
      { name: "Plant Medicine", text: "Guided ayahuasca, ibogaine, or mushroom ceremony.", risky: true, available: p => p.age >= 21 && p.money >= 1200, run: plantMedicine }
    ]
  },
  {
    id: "foodfit",
    name: "Food & Fitness",
    hint: "Meals, training, looks",
    actions: [
      { name: "Lift Weights", text: "Build fitness, health, and visible strength.", available: p => p.age >= 12, run: liftWeights },
      { name: "Cardio Run", text: "Boost health and discipline.", available: p => p.age >= 8, run: cardioRun },
      { name: "Yoga Class", text: "Posture, stress relief, and a small looks bump.", available: p => p.age >= 10, run: yogaClass },
      { name: "Pickup Basketball", text: "Park run. Cardio + community.", available: p => p.age >= 10, run: pickupBasketball },
      { name: "CrossFit Class", text: "WOD that humbles you in 12 minutes.", available: p => p.age >= 14, run: crossfitClass },
      { name: "BJJ Training", text: "Roll on the mat. Get tapped a hundred times.", available: p => p.age >= 12, run: bjjTraining },
      { name: "Boxing Gym", text: "Heavy bag, jump rope, footwork drills.", available: p => p.age >= 12, run: boxingGym },
      { name: "Hire Personal Trainer", text: "Pay somebody to actually push you.", available: p => p.age >= 16 && p.money >= 400, run: hireTrainer },
      { name: "Run A 5K", text: "Pay $40, get a bib, do the thing.", available: p => p.age >= 12, run: run5K },
      { name: "Powerlifting Meet", text: "Compete on the platform. Squat, bench, deadlift.", available: p => p.age >= 18 && p.fitnessLevel >= 20, run: powerliftingMeet },
      { name: "Bodybuilding Show", text: "Get on stage in trunks. Pose for judges.", available: p => p.age >= 18 && p.fitnessLevel >= 30, run: bodybuildingShow },
      { name: "Cold Plunge", text: "Three minutes in 38° water. Costs nothing, hurts everything.", available: p => p.age >= 16, run: coldPlunge },
      { name: "Sauna Session", text: "Sweat it out. Recover.", available: p => p.age >= 16, run: saunaSession },
      { name: "Intermittent Fast", text: "16:8 for a month. Discipline test.", available: p => p.age >= 16, run: intermittentFast },
      { name: "Carnivore Phase", text: "Meat only. Inflammation drops, social life suffers.", available: p => p.age >= 18, run: carnivorePhase },
      { name: "Plant-Based Phase", text: "All-plant month. Gut, skin, mood.", available: p => p.age >= 16, run: plantBased },
      { name: "Try Steroids", text: "Cycle gear. Gains now, organs later.", risky: true, available: p => p.age >= 18 && p.fitnessLevel >= 15, run: tryGear },
      { name: "Try Ozempic", text: "GLP-1 prescription for the appetite.", risky: true, available: p => p.age >= 21 && p.money >= 400, run: tryOzempic },
      { name: "Meal Prep", text: "Spend a little to raise diet and discipline.", available: p => p.age >= 13, run: mealPrep },
      { name: "Fast Food Binge", text: "Mood now, health and looks later.", risky: true, available: p => p.age >= 10, run: fastFoodBinge },
      { name: "Clean Eating Month", text: "Expensive, boring, very effective.", available: p => p.age >= 16, run: cleanEatingMonth },
      { name: "Fancy Dinner", text: "Social status food choice.", available: p => p.age >= 16, run: fancyDinner },
      { name: "Protein Bulk", text: "Train and eat for a stronger build.", available: p => p.age >= 15, run: proteinBulk }
    ]
  },
  {
    id: "social",
    name: "Relationships",
    hint: "Family, friends, romance",
    actions: [
      { name: "Spend Time", text: "Improve a random relationship.", available: p => p.age >= 3, run: () => {
        const person = relationshipTarget();
        changeBond(person, 10);
        applyEffects(`You spent quality time with ${person.name}.`, { happiness: 5 }, "good");
      } },
      { name: "Call Mom", text: "Specific call to your mom.", available: p => p.age >= 8 && p.relationships.some(r => r.id === "guardian"), run: () => {
        const mom = state.player.relationships.find(r => r.id === "guardian");
        if (mom) callNpc(mom);
      } },
      { name: "Call Best Friend", text: "Hit up your closest non-family.", available: p => p.age >= 8 && p.relationships.some(r => r.type !== "family" && r.bond >= 50), run: () => {
        const friends = state.player.relationships.filter(r => r.type !== "family" && r.bond >= 50);
        const best = friends.sort((a,b) => b.bond - a.bond)[0];
        if (best) callNpc(best);
      } },
      { name: "Text Day-Ones", text: "Hit the group chat with your crew.", available: p => dayOneCount(p) >= 2, run: () => {
        const ones = state.player.relationships.filter(r => r.dayOne);
        ones.forEach(p => changeBond(p, 6));
        applyEffects(`Group chat went off for 40 minutes. Plans for Saturday locked.`, { happiness: 10, karma: 4 }, "good");
      } },
      { name: "Confide in Sister", text: "Open up to your sibling.", available: p => p.age >= 12 && p.relationships.some(r => r.id === "sibling"), run: () => {
        const sib = state.player.relationships.find(r => r.id === "sibling");
        if (sib) confideInNpc(sib);
      } },
      { name: "Give Gift", text: "Costs money, usually helps.", available: p => p.age >= 8, run: () => {
        const person = relationshipTarget();
        changeBond(person, 14);
        applyEffects(`You bought ${person.name} a thoughtful gift.`, { money: -95, happiness: 3 }, "good");
      } },
      { name: "Ask Someone Out", text: "Chance to start a romance.", available: p => p.age >= 16 && !p.relationships.some(person => person.type === "partner"), run: askOut },
      { name: "Propose", text: "Turn a strong romance into marriage.", available: p => p.age >= 20 && p.relationships.some(person => person.type === "partner") && !p.married, run: propose },
      { name: "File for Divorce", text: "End the marriage. Pay settlement, free yourself.", risky: true, available: p => p.married && p.age >= 22, run: fileForDivorce },
      { name: "Have Child", text: "Start a family if life is stable enough.", available: p => p.age >= 22 && p.married, run: haveChild },
      { name: "Family Day", text: "Improve bonds with spouse, kids, and pets.", available: p => p.age >= 18 && (p.married || p.children.length > 0 || p.pets.length > 0), run: familyDay },
      { name: "Apologize", text: "Repair your weakest connection.", available: p => p.age >= 8, run: apologize },
      { name: "Host Dinner", text: "Bring your circle together.", available: p => p.age >= 18, run: hostDinner },
      { name: "Adopt Pet", text: "Add a loyal little chaos machine.", available: p => p.age >= 10 && p.pets.length < 3, run: adoptPet },
      { name: "Reconnect Absent Parent", text: "Make the first call after years.", available: p => p.age >= 16 && (p.familyStyle === "absent" || p.familyStyle === "foster" || p.familyStyle === "orphan"), run: reconnectAbsentParent },
      { name: "Bury A Parent", text: "Sit through it. The room you grew up in goes quiet.", available: p => p.age >= 25 && p.relationships.some(r => r.id === "guardian"), run: buryAParent },
      { name: "Move Parent In", text: "Take care of them as they age.", available: p => p.age >= 30 && p.hasApartment && p.relationships.some(r => r.id === "guardian"), run: moveParentIn },
      { name: "Family Reunion", text: "Cousins, second cousins, that one weird uncle.", available: p => p.age >= 16, run: familyReunion },
      { name: "Cut Toxic Friend", text: "End a relationship that's been costing you.", available: p => p.age >= 14 && p.relationships.some(r => r.type === "friend" && r.bond < 40), run: cutToxicFriend },
      { name: "Confront Snake", text: "Call out the friend who's been moving wrong.", available: p => p.age >= 14 && p.relationships.some(r => r.arc === "snake"), run: confrontSnake },
      { name: "Mediate A Beef", text: "Step between two friends fighting.", available: p => p.age >= 14 && p.relationships.length >= 4, run: mediateBeef },
      { name: "Best Man / Maid", text: "Stand at the altar with your day-one.", available: p => p.age >= 21 && p.relationships.some(r => r.bond >= 70 && r.type === "friend"), run: bestManRole },
      { name: "Become Godparent", text: "A friend trusts you with their kid.", available: p => p.age >= 25 && p.relationships.some(r => r.type === "friend" && r.bond >= 65), run: becomeGodparent },
      { name: "Surprise Birthday", text: "Plan it. Pull it off. Make somebody cry.", available: p => p.age >= 14, run: surpriseBirthday },
      { name: "Anniversary Dinner", text: "Real reservation. Real conversation.", available: p => p.age >= 22 && p.relationships.some(r => r.type === "partner" || r.type === "spouse"), run: anniversaryDinner },
      { name: "Couples Therapy", text: "Sit on the couch with somebody who calls you both out.", available: p => p.age >= 22 && p.married && p.money >= 240, run: couplesTherapy },
      { name: "Cheat On Partner", text: "Cross the line. Try to keep it quiet.", risky: true, available: p => p.age >= 18 && p.relationships.some(r => r.type === "partner" || r.type === "spouse"), run: cheatOnPartner },
      { name: "Affair", text: "Real one. Months long. Compartmentalized until it isn't.", risky: true, available: p => p.age >= 25 && p.married, run: longAffair },
      { name: "Get Caught Cheating", text: "They saw the text.", risky: true, available: p => p.age >= 18 && p.cheating && p.relationships.some(r => r.type === "partner" || r.type === "spouse"), run: getCaughtCheating },
      { name: "Open Relationship Talk", text: "Sit down. Name what you actually want.", risky: true, available: p => p.age >= 22 && (p.married || p.relationships.some(r => r.type === "partner")), run: openRelationshipTalk },
      { name: "Get Pregnant", text: "Try. Real biology, real timing.", available: p => p.age >= 18 && p.age <= 45 && p.identity !== "Guy" && p.identity !== "Trans guy" && p.relationships.some(r => r.type === "partner" || r.type === "spouse") && !p.isPregnant, run: tryConceive },
      { name: "Partner Pregnancy", text: "Partner missed a period. Real timeline now.", available: p => p.age >= 18 && (p.identity === "Guy" || p.identity === "Trans guy") && p.relationships.some(r => (r.type === "partner" || r.type === "spouse") && (r.identity !== "Guy")), run: partnerPregnant },
      { name: "Give Birth", text: "Hospital, ten hours, real moment.", available: p => p.isPregnant, run: giveBirthEvent },
      { name: "Abortion", text: "Make the choice. Live with it.", risky: true, available: p => p.isPregnant, run: abortionEvent },
      { name: "Miscarriage Loss", text: "It wasn't anybody's fault.", available: p => p.isPregnant && chance(20), run: miscarriageEvent },
      { name: "IVF Round", text: "Real clinic, real injections, real money.", available: p => p.age >= 26 && p.money >= 12000 && p.married && p.children.length === 0, run: ivfRound },
      { name: "Adopt A Kid", text: "Apply. Wait. Bring them home.", available: p => p.age >= 25 && p.hasApartment && p.money >= 8000, run: adoptKid },
      { name: "Foster A Teen", text: "Take in somebody who needs a stable house.", available: p => p.age >= 30 && p.hasApartment, run: fosterTeen },
      { name: "Surrogacy", text: "Pay a surrogate to carry your kid.", available: p => p.age >= 28 && p.money >= 90000, run: surrogacyEvent },
      { name: "Custody Fight", text: "Fight for time with your kid in court.", available: p => p.age >= 22 && p.children.length > 0 && (p.divorces > 0 || p.relationships.some(r => r.role && r.role.includes("Ex"))), run: custodyFight },
      { name: "Baby Mama / Daddy Drama", text: "Co-parenting got messy.", risky: true, available: p => p.age >= 20 && p.children.length > 0, run: babymamaDrama },
      { name: "Long Distance Maintain", text: "Make it work. Calls, flights, calendars.", available: p => p.age >= 18 && p.relationships.some(r => r.type === "partner"), run: longDistanceMaintain },
      { name: "Engagement Party", text: "Throw it before the wedding.", available: p => p.age >= 22 && p.relationships.some(r => r.type === "partner") && !p.engaged && !p.married, run: engagementParty },
      { name: "Bachelor/ette Party", text: "Vegas, Nashville, Miami. Pick one.", available: p => p.age >= 21 && p.engaged && !p.bachelorDone, run: bachelorParty },
      { name: "Wedding", text: "The actual day. Stress and tears and dancing.", available: p => p.age >= 21 && p.engaged && !p.married, run: weddingDay },
      { name: "Honeymoon", text: "Two weeks somewhere warm.", available: p => p.married && !p.honeymoonDone, run: honeymoon },
      { name: "Renew Vows", text: "10+ years in. Real ceremony.", available: p => p.married && p.age - (p.marriedAge || p.age) >= 10, run: renewVows },
      { name: "Reconcile After Fight", text: "Pull each other back from the edge.", available: p => p.age >= 18 && p.relationships.some(r => (r.type === "partner" || r.type === "spouse") && r.bond < 50), run: reconcileAfterFight },
      { name: "🔒 True Love (40 years)", text: "Mark this as the one you stayed with.", available: p => p.married && p.age - (p.marriedAge || p.age) >= 40 && p.relationships.some(r => r.type === "spouse" && r.bond >= 85) && !p.trueLoveClaimed, run: claimTrueLove },
      { name: "🔒 Found A Lost Sibling", text: "An ancestry DNA test connected somebody to you.", available: p => p.age >= 25 && (p.familyStyle === "absent" || p.familyStyle === "foster" || p.familyStyle === "orphan") && !p.foundLostSibling, run: foundLostSibling }
    ]
  },
  {
    id: "fame",
    name: "Fame",
    hint: "Posts, performance, public life",
    actions: [
      { name: "Post Online", text: "Chance to grow fame.", available: p => p.age >= 13, run: postOnline },
      { name: "Perform", text: "Risk a public win or flop.", available: p => p.age >= 12, run: perform },
      { name: "Audition", text: "Try to break into acting.", available: p => p.age >= 16, run: audition },
      { name: "Podcast Interview", text: "Turn a life story into attention.", available: p => p.age >= 18 && p.fame >= 10, run: podcast },
      { name: "Write Book", text: "Turn your life into royalties and reputation.", available: p => p.age >= 18, run: writeBook },
      { name: "Public Stunt", text: "A fame gamble with reputation risk.", risky: true, available: p => p.age >= 16, run: publicStunt },
      { name: "Brand Deal", text: "Cash in if you are famous enough.", available: p => p.fame >= 25, run: () => {
        const earned = randomInt(1200, 8200) + state.player.fame * 70;
        applyEffects(`You landed a brand deal for ${money(earned)}.`, { money: earned, fame: 3, happiness: 2 }, "good");
      } },
      { name: "Drop A Single", text: "Record, mix, release on a Friday.", available: p => p.age >= 14, run: dropSingle },
      { name: "Drop An Album", text: "Twelve tracks. Real rollout.", available: p => p.age >= 16 && p.fame >= 8, run: dropAlbum },
      { name: "Tour", text: "Twenty-city run. Real money or real loss.", available: p => p.age >= 18 && p.fame >= 25, run: goOnTour },
      { name: "Red Carpet Event", text: "Premiere walk. Photographers screaming your name.", available: p => p.age >= 18 && p.fame >= 20, run: redCarpet },
      { name: "Magazine Cover", text: "Get on the cover of a real magazine.", available: p => p.age >= 18 && p.fame >= 35, run: magazineCover },
      { name: "Late Night Show", text: "Sit on the couch. Tell the story.", available: p => p.age >= 18 && p.fame >= 40, run: lateNightShow },
      { name: "Sign Autographs", text: "An hour at a store. Photos, sharpies, fans.", available: p => p.age >= 14 && p.fame >= 15, run: signAutographs },
      { name: "Stalker Incident", text: "Somebody crossed a line.", risky: true, available: p => p.age >= 18 && p.fame >= 40, run: stalkerIncident },
      { name: "Paparazzi Chase", text: "Photographers ambush you outside a restaurant.", risky: true, available: p => p.age >= 18 && p.fame >= 35, run: paparazziChase },
      { name: "Brand Collab", text: "Co-design a capsule with a real brand.", available: p => p.age >= 18 && p.fame >= 30, run: brandCollab },
      { name: "Win An Award", text: "Industry award. The room stands.", available: p => p.age >= 18 && p.fame >= 50, run: winAnAward },
      { name: "Public Beef", text: "Trade shots with another celebrity in interviews.", risky: true, available: p => p.age >= 18 && p.fame >= 30, run: publicBeef },
      { name: "Adopt A Cause", text: "Pick a cause. Use your platform.", available: p => p.age >= 18 && p.fame >= 10, run: adoptCause },
      { name: "Hire Publicist", text: "Pay somebody to manage what people say.", available: p => p.age >= 18 && p.fame >= 15 && p.money >= 4000, run: hirePublicist },
      { name: "Reality TV", text: "Sign a season. Camera follows you everywhere.", risky: true, available: p => p.age >= 18 && p.fame >= 20, run: realityTV },
      { name: "🔒 Become A Cult Leader", text: "Build a real following around an idea you almost believe.", risky: true, available: p => p.age >= 28 && p.fame >= 60 && (p.therapyWeeks || 0) > 0 && p.karma < 40 && !p.isCultLeader, run: becomeCultLeader },
      { name: "🔒 Win Game Show", text: "Trivia, physical challenge, $1M finale.", available: p => p.age >= 21 && p.fame >= 18 && p.stats.smarts >= 72 && !p.wonGameShow, run: winGameShow },
      { name: "🔒 Posthumous Release", text: "Drop something now. The legend grows after.", available: p => p.age >= 60 && p.fame >= 40 && p.books >= 2, run: posthumousRelease }
    ]
  },
  {
    id: "socialmedia",
    name: "Social Page",
    hint: "Reels, lives, followers",
    actions: [
      { name: "Create Social Page", text: "Claim your handle and start posting.", available: p => p.age >= 12 && !p.socialPage && currentYear(p) >= 2010, run: createSocialPage },
      { name: "Scroll Reels", text: "Mood boost, inspiration, or lost discipline.", available: p => p.age >= 10, run: scrollReels },
      { name: "Post Reel", text: "Grow followers and maybe go viral.", available: p => p.age >= 12, run: postReel },
      { name: "Drop A Storytime", text: "Long-form post about your real life. Hit or cringe.", available: p => p.age >= 13 && p.socialPage, run: storytimePost },
      { name: "Go Live", text: "Talk to your followers and maybe earn tips.", available: p => p.age >= 13 && p.socialPage, run: goLive },
      { name: "DM Collab", text: "Reach out and try to cross audiences.", available: p => p.age >= 15 && p.socialPage, run: dmCollab },
      { name: "Land Brand Deal", text: "Cash in if you're famous enough.", available: p => p.age >= 16 && p.socialPage && p.followers >= 5000, run: igBrandDeal },
      { name: "Start Beef", text: "Aim a thread at another creator. Audience picks a side.", risky: true, available: p => p.age >= 15 && p.socialPage && p.followers >= 1000, run: startBeef },
      { name: "Clap Back Online", text: "Risk your mood and reputation for attention.", risky: true, available: p => p.age >= 15 && p.socialPage, run: clapBackOnline },
      { name: "Buy Followers", text: "Bot a number that won't survive an audit.", risky: true, available: p => p.age >= 14 && p.socialPage && p.money >= 200, run: buyFollowers },
      { name: "Get Cancelled", text: "An old post resurfaces. Apologize, double-down, or vanish.", risky: true, available: p => p.age >= 15 && p.socialPage && p.followers >= 3000 && chance(35), run: getCancelled },
      { name: "Platform Ban", text: "Account suspended. Appeal it or move platforms.", risky: true, available: p => p.age >= 14 && p.socialPage && (p.viralHits >= 2 || p.fame >= 20) && chance(25), run: platformBan },
      { name: "Parasocial DM Spiral", text: "Reply to a fan a few too many times.", risky: true, available: p => p.age >= 16 && p.socialPage && p.followers >= 2000, run: parasocialDM },
      { name: "Launch Podcast", text: "Mic up. Start a weekly that builds a base.", available: p => p.age >= 17 && p.socialPage, run: launchPodcast },
      { name: "Drop Documentary", text: "Self-produced doc on your life so far.", available: p => p.age >= 21 && (p.fame >= 30 || p.followers >= 50000), run: dropDoc },
      { name: "Start Newsletter", text: "Email list, weekly send, paid tier eventually.", available: p => p.age >= 14 && p.socialPage && currentYear(p) >= 2018, run: startNewsletter },
      { name: "Launch Patreon", text: "Tiered subs for your real fans.", available: p => p.age >= 18 && p.followers >= 800 && currentYear(p) >= 2014, run: launchPatreon },
      { name: "Launch OnlyFans", text: "Adult or otherwise. Big margins, real consequences.", risky: true, available: p => p.age >= 18 && currentYear(p) >= 2018, run: launchOnlyfans },
      { name: "Substack", text: "Long-form writing with a paid wall.", available: p => p.age >= 16 && currentYear(p) >= 2018, run: startSubstack },
      { name: "Ghost-Write Thread", text: "Anonymous viral thread. Real money.", available: p => p.age >= 16 && currentYear(p) >= 2018, run: ghostWriteThread },
      { name: "YouTube Long-Form", text: "20-minute documentary-style upload.", available: p => p.age >= 14 && p.socialPage && currentYear(p) >= 2012, run: youtubeLongform },
      { name: "Get Verified", text: "Blue check. Application or paid tier.", available: p => p.age >= 14 && p.socialPage && p.followers >= 2000 && !p.verified, run: getVerified },
      { name: "Lose Verification", text: "Check pulled after a violation.", risky: true, available: p => p.verified && p.fame >= 30, run: loseVerification },
      { name: "Algorithm Shift", text: "Platform change drops your reach overnight.", available: p => p.socialPage && p.followers >= 5000, run: algorithmShift },
      { name: "Behind The Scenes Vlog", text: "Day-in-the-life upload. Real and unedited.", available: p => p.age >= 13 && p.socialPage, run: btsVlog },
      { name: "Fan Q&A Live", text: "Hour of questions. Build the parasocial closer.", available: p => p.age >= 14 && p.socialPage && p.followers >= 500, run: fanQA },
      { name: "Cross-Post Twitter", text: "Build a presence on text platforms too.", available: p => p.age >= 14 && p.socialPage && currentYear(p) >= 2008, run: crossPostX },
      { name: "TikTok Series", text: "Run a recurring series. Hook viewers weekly.", available: p => p.age >= 12 && p.socialPage && currentYear(p) >= 2019, run: tiktokSeries },
      { name: "Sell Course", text: "Package what you know. Charge $97-$997.", available: p => p.age >= 18 && p.fame >= 12, run: sellCourse },
      { name: "Pivot Niche", text: "Burn the old account theme. Start over inside the same handle.", risky: true, available: p => p.age >= 14 && p.socialPage && p.followers >= 1000, run: pivotNiche }
    ]
  },
  {
    id: "money",
    name: "Money",
    hint: "Assets, debt, investing",
    actions: [
      { name: "Invest", text: "Risk cash for a chance to grow it.", available: p => p.age >= 18 && p.money >= 250, run: invest },
      { name: "Day Trade", text: "Stare at charts, fight the algo, pretend you're calm.", risky: true, available: p => p.age >= 18 && p.money >= 500, run: dayTrade },
      { name: "Buy Crypto", text: "Bet on a coin with no fundamentals.", risky: true, available: p => p.age >= 16 && p.money >= 100 && currentYear(p) >= 2013, run: buyCrypto },
      { name: "Open Savings", text: "Lock cash away. Compound it. Boring on purpose.", available: p => p.age >= 16 && p.money >= 200, run: openSavings },
      { name: "Take Bank Loan", text: "Get cash now, owe more later.", available: p => p.age >= 18 && p.debt < 50000, run: bankLoan },
      { name: "Pay Taxes", text: "The bill the government always finds.", available: p => p.age >= 18 && p.money >= 200, run: payTaxes },
      { name: "Gig Hustle", text: "Uber, DoorDash, whatever pays today.", available: p => p.age >= 18, run: gigHustle },
      { name: "Side Flip", text: "Buy cheap, sell to a sucker.", available: p => p.age >= 14, run: sideFlip },
      { name: "Sell Plasma", text: "Low cash, real health hit.", risky: true, available: p => p.age >= 18 && p.stats.health >= 50, run: sellPlasma },
      { name: "Get Scammed", text: "A 'guaranteed return' from somebody too pushy.", risky: true, available: p => p.age >= 16 && p.money >= 200, run: getScammed },
      { name: "Start Budget", text: "Boring, useful, quietly powerful.", available: p => p.age >= 16, run: budget },
      { name: "Pay Debt", text: "Pay up to $4,000 toward debt.", available: p => p.age >= 18, run: payDebt },
      { name: "Lottery Ticket", text: "Tiny chance, loud emotions.", available: p => p.age >= 18 && p.money >= 20, run: lottery }
    ]
  },
  {
    id: "stores",
    name: "Stores",
    hint: "Real brands, real spending",
    actions: [
      { name: "Target Run", text: "Grab basics and reset your mood.", available: p => p.age >= 12, run: () => brandRun("Target", 85, { happiness: 4, discipline: 1 }, "you bought the useful stuff and one thing you did not need.") },
      { name: "Walmart Budget Haul", text: "Stretch your cash and stock up.", available: p => p.age >= 12, run: () => brandRun("Walmart", 58, { discipline: 3, happiness: 2 }, "you made the money go further than expected.") },
      { name: "Costco Bulk Run", text: "Pay membership, save on everything else.", available: p => p.age >= 18, run: () => brandRun("Costco", 220, { discipline: 4, happiness: 3, dietScore: 2 }, "the haul will last you a month if you ration the bagels.") },
      { name: "7-Eleven Late Night Run", text: "Cheap dopamine, weak nutrition.", available: p => p.age >= 13, run: () => brandRun("7-Eleven", 24, { happiness: 3, health: -1, discipline: -1 }, "the late-night snacks hit exactly how they were supposed to.") },
      { name: "Apple Store Upgrade", text: "Better tech for school, work, and content.", available: p => p.age >= 14, run: () => brandRun("Apple Store", 320, { smarts: 3, fame: 1, happiness: 3 }, "you upgraded your setup and felt temporarily unstoppable.") },
      { name: "Best Buy Tech Run", text: "Cheaper tech, real upgrade.", available: p => p.age >= 14, run: () => brandRun("Best Buy", 180, { smarts: 4, discipline: 1, happiness: 3 }, "you grabbed what Apple was charging double for.") },
      { name: "Nike / Foot Locker Fit", text: "Spend for style and confidence.", available: p => p.age >= 13, run: () => brandRun("Nike and Foot Locker", 240, { looks: 5, happiness: 3, fame: 1 }, "the fit had people noticing.") },
      { name: "Sephora Run", text: "Lipstick economy, real confidence.", available: p => p.age >= 13, run: () => brandRun("Sephora", 180, { looks: 6, happiness: 5 }, "you walked out feeling like a different person.") },
      { name: "Whole Foods Haul", text: "Bougie groceries, real food.", available: p => p.age >= 16, run: () => brandRun("Whole Foods", 260, { health: 5, dietScore: 8, happiness: 3 }, "the fridge looks like somebody who pays attention to themselves.") },
      { name: "Trader Joe's Run", text: "Cult snacks, decent prices.", available: p => p.age >= 14, run: () => brandRun("Trader Joe's", 95, { happiness: 5, dietScore: 4, discipline: 1 }, "the cashier complimented your tattoo, the snacks were unreal.") },
      { name: "IKEA Furnishing", text: "Build your spot from scratch.", available: p => p.age >= 17 && p.hasApartment, run: () => brandRun("IKEA", 420, { happiness: 8, discipline: 4, looks: 1 }, "the place finally looks like somebody lives there on purpose.") },
      { name: "Amazon Prime Haul", text: "One-click your life away.", available: p => p.age >= 14, run: () => brandRun("Amazon", 140, { happiness: 4, discipline: -2 }, "half of it sits in the box for two months.") },
      { name: "McDonald's Run", text: "Fast food, fast mood boost.", available: p => p.age >= 12, run: () => brandRun("McDonald's", 14, { happiness: 3, health: -1 }, "you grabbed food and kept it moving.") },
      { name: "Vinyl Record Shop", text: "Crate dig for an hour. Walk out with two records.", available: p => p.age >= 14, run: () => brandRun("an indie vinyl shop", 60, { happiness: 6, smarts: 2 }, "you owned a piece of music nobody can stream.") },
      { name: "Thrift Store Dig", text: "Cheap fits if you actually look.", available: p => p.age >= 13, run: () => brandRun("a Goodwill bin", 28, { looks: 4, discipline: 3, happiness: 4 }, "you walked out with a designer piece for ten bucks.") },
      { name: "Smoke Shop", text: "Papers, glass, maybe a vape pen.", risky: true, available: p => p.age >= 18, run: () => brandRun("a smoke shop", 38, { happiness: 4, health: -1, discipline: -1 }, "the guy at the counter remembered your name.") },
      { name: "Liquor Store Run", text: "A bottle and a quick chase.", risky: true, available: p => p.age >= 21, run: () => brandRun("the corner liquor store", 32, { happiness: 5, health: -2, discipline: -2 }, "the cashier asked if you wanted singles or a bottle.") },
      { name: "Pawn Shop Sell", text: "Trade something for cash now.", available: p => p.age >= 16, run: pawnShopSell },
      { name: "Luxury Boutique", text: "Designer fit. Real price tag.", available: p => p.age >= 16 && p.money >= 1800, run: luxuryBoutique },
      { name: "Tesla Showroom Browse", text: "Sit in one. Tell yourself one day.", available: p => p.age >= 18, run: () => brandRun("a Tesla showroom", 0, { happiness: 3, discipline: 2, smarts: 1 }, "the sales rep gave up trying to close after the third question.") },
      { name: "Jeweler Visit", text: "A chain, a watch, a ring. Big number.", available: p => p.age >= 18 && p.money >= 800, run: () => brandRun("a real jeweler", randomInt(800, 4800), { looks: 6, fame: 2, happiness: 7 }, "the piece announced you in every room you walked into.") },
      { name: "Art Gallery Buy", text: "Take home an original.", available: p => p.age >= 18 && p.money >= 400, run: () => brandRun("a gallery opening", randomInt(400, 2800), { smarts: 4, happiness: 7, karma: 2, businessReputation: 1 }, "you walked out with a piece somebody actually painted.") },
      { name: "Antique Mall", text: "Three-hour dig. Walk out with a story.", available: p => p.age >= 16, run: () => brandRun("an antique mall", 80, { smarts: 3, happiness: 5 }, "you bought somebody else's grandfather's lighter.") },
      { name: "Bookstore Run", text: "Hit Strand, McNally Jackson, Powell's, vibe.", available: p => p.age >= 12, run: () => brandRun("an indie bookstore", 60, { smarts: 5, happiness: 7, discipline: 2 }, "you bought too many. You'll read three.") },
      { name: "Farmers Market", text: "Saturday morning. Real produce, real prices.", available: p => p.age >= 14, run: () => brandRun("the farmers market", 65, { health: 4, happiness: 6, dietScore: 5, karma: 2 }, "the tomatoes tasted like tomatoes used to.") },
      { name: "Sneaker Drop", text: "Camp out. Hope to get pairs.", available: p => p.age >= 12, run: sneakerDrop },
      { name: "Dispensary", text: "Pick edibles, flower, cart. Legal where legal.", risky: true, available: p => p.age >= 21, run: dispensaryRun },
      { name: "Pet Shop", text: "Browse adoptables and toy aisle.", available: p => p.age >= 8, run: petShopBrowse },
      { name: "Pharmacy Run", text: "Refill. Toiletries. Snacks at checkout.", available: p => p.age >= 14, run: () => brandRun("the pharmacy", 38, { health: 3, discipline: 1 }, "you grabbed what you came for and three things you didn't.") },
      { name: "Mall Day", text: "Anchor stores, food court, three hours.", available: p => p.age >= 12, run: () => brandRun("the mall", 140, { happiness: 6, looks: 2 }, "you walked five miles and bought two things.") },
      { name: "Costco Hot Dog", text: "$1.50. Stays $1.50 forever.", available: p => p.age >= 8, run: () => brandRun("the Costco food court", 2, { happiness: 5, dietScore: -2 }, "the dog and soda combo is still $1.50.") },
      { name: "Gift Shop", text: "Buy somebody you love something they'll keep.", available: p => p.age >= 14 && p.relationships.length > 0, run: giftShopRun },
      { name: "Cellphone Upgrade", text: "Newest model. Trade in the old one.", available: p => p.age >= 14 && p.money >= 400, run: () => brandRun("the carrier store", 800, { smarts: 1, happiness: 6, fame: 1 }, "the new model is a fingerprint magnet but you're locked in.") },
      { name: "Eyewear Boutique", text: "Frames that fit your face.", available: p => p.age >= 14 && p.money >= 200, run: () => brandRun("an eyewear boutique", 320, { looks: 6, happiness: 4 }, "the new frames change your whole face.") },
      { name: "Florist", text: "Walk in. Walk out with flowers.", available: p => p.age >= 14, run: () => brandRun("a florist", 65, { happiness: 7, karma: 2 }, "you bought flowers for nobody in particular and felt different.") },
      { name: "Pop-Up Shop", text: "Hit a creator's drop in person.", available: p => p.age >= 14, run: () => brandRun("a creator pop-up", 180, { looks: 3, fame: 2, happiness: 5 }, "you got a piece before the resellers did.") },
      { name: "Hardware Store", text: "Lumber, drill bits, painter tape.", available: p => p.age >= 16, run: () => brandRun("Home Depot", 120, { discipline: 3, smarts: 2 }, "you walked in for one thing and came out with eleven.") }
    ]
  },
  {
    id: "city",
    name: "City",
    hint: "Local rep, spots, city-only moves",
    actions: [
      { name: "Explore Neighborhood", text: "Learn the city and meet local people.", available: p => p.age >= 6, run: exploreNeighborhood },
      { name: "City-Specific Run", text: "Do the thing your current city is built for.", available: p => p.age >= 10, run: citySpecificRun },
      { name: "Local Food Spot", text: "Become known somewhere real and cheap-ish.", available: p => p.age >= 8, run: localFoodSpot },
      { name: "Post The Scene", text: "Turn your city into content.", available: p => p.age >= 12, run: localScenePost },
      { name: "Local Job Lead", text: "Cash in on local reputation.", available: p => p.age >= 14 && localRep(p) >= 8, run: localJobLead },
      { name: "Find Apartment", text: "Lease your own spot. Set down roots.", available: p => p.age >= 18 && p.money >= 1500 && !p.hasApartment, run: findApartment },
      { name: "Block Party", text: "The whole street out for a day. Music, food, problems paused.", available: p => p.age >= 8, run: blockParty },
      { name: "Local Festival", text: "Pop-up event your city is known for.", available: p => p.age >= 10, run: localFestival },
      { name: "Language Class", text: "Pick up the local language properly.", available: p => p.age >= 12, run: languageClass },
      { name: "Get Robbed", text: "Wrong block, wrong time. Cash gone.", risky: true, available: p => p.age >= 14, run: getRobbed },
      { name: "Bar Crawl", text: "Hit five spots in one night. Find trouble or community.", risky: true, available: p => p.age >= 21, run: barCrawl },
      { name: "Visa Run", text: "Cross the border to reset paperwork.", available: p => p.age >= 18 && p.money >= 200, run: visaRun },
      { name: "Get Lost", text: "Walk without a map. Wander into something.", available: p => p.age >= 12, run: getLost },
      { name: "Volunteer Cleanup", text: "Trash pickup, mural paint, soup line. Show up.", available: p => p.age >= 10, run: cityCleanup },
      { name: "Public Transit Pass", text: "Monthly metro/bus pass. Stop driving everywhere.", available: p => p.age >= 14, run: transitPass },
      { name: "Find A Barber", text: "Build a relationship with somebody who cuts you weekly.", available: p => p.age >= 12 && !p.hasBarber, run: findABarber },
      { name: "Find A Therapist", text: "Search for somebody good. Try three.", available: p => p.age >= 16, run: findTherapist },
      { name: "Find Your Coffee Spot", text: "One cafe that knows your order.", available: p => p.age >= 14, run: findCoffeeSpot },
      { name: "Attend A Wedding", text: "Suit on, open bar, real dance floor.", available: p => p.age >= 16, run: attendWedding },
      { name: "Attend A Funeral", text: "Black on, suit pressed. Sit with grief.", available: p => p.age >= 12, run: attendFuneral },
      { name: "Attend A Protest", text: "Show up, hold the sign, march all afternoon.", available: p => p.age >= 14, run: attendProtest },
      { name: "Volunteer Voter Reg", text: "Sign people up at the corner.", available: p => p.age >= 16, run: voterReg },
      { name: "Neighborhood Watch", text: "Walk the blocks. Keep an eye on things.", available: p => p.age >= 18, run: neighborhoodWatch },
      { name: "Gentrification Pushback", text: "Show up to a planning meeting that matters.", available: p => p.age >= 16, run: gentrificationPushback },
      { name: "Find A Mechanic", text: "Trustworthy shop. Cheap labor.", available: p => p.age >= 18 && hasAsset("car"), run: findMechanic },
      { name: "Find A Tailor", text: "Real tailor. Real measurements.", available: p => p.age >= 18, run: findTailor },
      { name: "Catch The Sunset", text: "Best spot in the city. Sit with somebody.", available: p => p.age >= 10, run: catchSunset },
      { name: "Subway Adventure", text: "Take a train to the last stop. Walk back.", available: p => p.age >= 14 && (p.location.includes("New York") || p.location.includes("Brooklyn") || p.location.includes("London") || p.location.includes("Tokyo") || p.location.includes("Paris") || p.location.includes("Seoul")), run: subwayAdventure },
      { name: "Late Night Diner", text: "3 AM, ugly fluorescent, perfect waffles.", available: p => p.age >= 16, run: lateNightDiner },
      { name: "Skate The Plaza", text: "Public space. Cement waves.", available: p => p.age >= 12, run: skateThePlaza },
      { name: "Open Mic Night", text: "Real mic, real crowd. Try material.", available: p => p.age >= 16, run: openMicNight },
      { name: "City Council Meeting", text: "Show up. Comment if it matters.", available: p => p.age >= 18, run: councilMeeting },
      { name: "Lost Wallet Returned", text: "Find one, do the right thing.", available: p => p.age >= 14, run: foundWallet }
    ]
  },
  {
    id: "hobby",
    name: "Hobbies",
    hint: "Skills, sports, art",
    actions: [
      { name: "Train Sport", text: "Push health, discipline, and championship odds.", available: p => p.age >= 8, run: trainSport },
      { name: "Enter Tournament", text: "Try to win a championship.", available: p => p.age >= 14 && p.stats.health >= 60, run: tournament },
      { name: "Make Art", text: "Create something that could grow fame.", available: p => p.age >= 10, run: makeArt },
      { name: "Cook For People", text: "Small joy, better relationships.", available: p => p.age >= 12, run: cookForPeople },
      { name: "Stream Games", text: "A low-stakes fame and money gamble.", available: p => p.age >= 13, run: streamGames },
      { name: "Basketball Club", text: "After-school reps and social status.", available: p => p.age >= 8 && p.age <= 19, run: () => afterSchoolClub("basketball") },
      { name: "Coding Club", text: "Build weird projects with future value.", available: p => p.age >= 9 && p.age <= 21, run: () => afterSchoolClub("coding") },
      { name: "Band Practice", text: "Music, friends, and stage confidence.", available: p => p.age >= 8 && p.age <= 21, run: () => afterSchoolClub("band") },
      { name: "Drama Club", text: "Performance and social chaos.", available: p => p.age >= 10 && p.age <= 21, run: () => afterSchoolClub("drama") },
      { name: "Robotics Team", text: "Tech lane, competitions, smart friends.", available: p => p.age >= 11 && p.age <= 21, run: () => afterSchoolClub("robotics") },
      { name: "Read A Book", text: "Sit with one. Don't pick up your phone.", available: p => p.age >= 8, run: readABook },
      { name: "Garden", text: "Grow something. Watch it return.", available: p => p.age >= 12, run: gardenWork },
      { name: "Build A PC", text: "Order parts, build it on the kitchen table.", available: p => p.age >= 14 && p.money >= 800, run: buildPC },
      { name: "Skate", text: "Bomb a hill. Try a trick. Eat shit.", risky: true, available: p => p.age >= 8, run: skateSession },
      { name: "Surf", text: "Paddle out and wait for one to break right.", available: p => p.age >= 10 && (p.location.includes("LA") || p.location.includes("Miami") || p.location.includes("Rio") || p.location.includes("Brazil")), run: surfSession },
      { name: "Hike A Trail", text: "Pack water. Disappear into trees.", available: p => p.age >= 10, run: hikeTrail },
      { name: "Paint A Mural", text: "Get a wall, get permission, get it done.", available: p => p.age >= 13, run: paintMural },
      { name: "Tattoo Apprenticeship", text: "Cleans needles, watches a master.", available: p => p.age >= 16 && !p.certifications.includes("tattooArt"), run: tattooApprentice },
      { name: "Chess Club", text: "Tournament-rated games. Build your ELO.", available: p => p.age >= 8, run: chessClub },
      { name: "Write Poetry", text: "Fill notebooks nobody will see.", available: p => p.age >= 12, run: writePoetry },
      { name: "Photo Walk", text: "Camera, no agenda. Shoot strangers.", available: p => p.age >= 13, run: photoWalk },
      { name: "Restore A Car", text: "Buy a project. Make it run.", available: p => p.age >= 16 && p.money >= 1500, run: restoreCar },
      { name: "Cosplay Convention", text: "Build a costume. Show up to comic-con.", available: p => p.age >= 14, run: cosplayCon },
      { name: "Magic Tricks", text: "Sleight of hand at parties.", available: p => p.age >= 10, run: magicTricks },
      { name: "DJ A Party", text: "Spin a set. Read the room.", available: p => p.age >= 14, run: djParty }
    ]
  },
  {
    id: "peaceful",
    name: "Peaceful Lane",
    hint: "Slow, artsy, chill, intentional",
    actions: [
      { name: "Write Morning Pages", text: "Three handwritten pages first thing. Daily.", available: p => p.age >= 14, run: morningPages },
      { name: "Read Daily", text: "An hour a day with a real book.", available: p => p.age >= 10, run: dailyReading },
      { name: "Join Book Club", text: "Monthly meet. One novel, four perspectives.", available: p => p.age >= 16, run: bookClub },
      { name: "Pottery Class", text: "Wheel, clay, slip, fire it.", available: p => p.age >= 14, run: potteryClass },
      { name: "Watercolor Class", text: "Paper, brushes, soft palettes.", available: p => p.age >= 12, run: watercolorClass },
      { name: "Learn An Instrument", text: "Pick guitar, piano, sax. Show up daily.", available: p => p.age >= 8, run: learnInstrument },
      { name: "Calligraphy Practice", text: "One letter, a thousand times.", available: p => p.age >= 12, run: calligraphy },
      { name: "Tea Ceremony", text: "Slow water, real attention.", available: p => p.age >= 16, run: teaCeremony },
      { name: "Beach Walk", text: "An hour at sunset, no phone.", available: p => p.age >= 10, run: beachWalk },
      { name: "Sunrise Hike", text: "Trailhead at 5 AM. Watch the day arrive.", available: p => p.age >= 14, run: sunriseHike },
      { name: "Silent Retreat", text: "Five days. No talking. Vipassana style.", available: p => p.age >= 18 && p.money >= 600, run: silentRetreat },
      { name: "Monastery Stay", text: "Two weeks living with monks. Real reset.", available: p => p.age >= 18 && p.money >= 1200, run: monasteryStay },
      { name: "Volunteer At Shelter", text: "Soup line, conversations, real warmth.", available: p => p.age >= 14, run: volunteerShelter },
      { name: "Foster A Dog", text: "Take in a rescue for a season.", available: p => p.age >= 18 && p.hasApartment, run: fosterDog },
      { name: "Build A Bookshelf", text: "Wood, screws, weekend afternoon.", available: p => p.age >= 14, run: buildBookshelf },
      { name: "Learn To Cook", text: "Six classes. Real knife skills.", available: p => p.age >= 14, run: learnToCook },
      { name: "Forest Bathing", text: "Two hours under canopy. No agenda.", available: p => p.age >= 14, run: forestBathing },
      { name: "Sketch Strangers", text: "Coffee shop. Pencil. Stay an hour.", available: p => p.age >= 12, run: sketchStrangers },
      { name: "Letter To Old Friend", text: "Handwrite it. Mail it.", available: p => p.age >= 14 && p.relationships.some(r => r.bond < 50), run: letterToOldFriend },
      { name: "Plant A Tree", text: "Dig, water, watch it lean toward light.", available: p => p.age >= 10, run: plantATree },
      { name: "Soup Kitchen Hours", text: "Serve plates. Talk to the line.", available: p => p.age >= 12, run: soupKitchen },
      { name: "Mentor A Kid", text: "Be the one who showed up.", available: p => p.age >= 21, run: mentorAKid },
      { name: "Sabbath Day", text: "One day off everything. No screens, no work.", available: p => p.age >= 16, run: sabbathDay },
      { name: "Adopt A Cat", text: "Quiet, soft, complicated.", available: p => p.age >= 16 && p.hasApartment, run: adoptCat },
      { name: "Slow Coffee Ritual", text: "Pour-over, single origin, two sugars max.", available: p => p.age >= 14, run: slowCoffee },
      { name: "Cottagecore Era", text: "Bake bread. Sew. Garden. Stay offline.", available: p => p.age >= 16, run: cottagecore },
      { name: "🔒 Become A Saint", text: "Your name gets attached to the cause.", available: p => p.age >= 50 && p.karma >= 90 && (p.therapyWeeks || 0) > 0 && !p.isSaint, run: becomeASaint },
      { name: "🔒 Live Off-Grid", text: "Burn the IDs. Go where there's no signal.", available: p => p.age >= 30 && !p.socialPage && (p.recovery || 0) >= 5 && !p.offGrid, run: liveOffGrid },
      { name: "🔒 Found A School", text: "Open a real place that teaches kids what mattered to you.", available: p => p.age >= 45 && p.money >= 80000 && p.karma >= 70 && !p.foundedSchool, run: foundASchool }
    ]
  },
  {
    id: "adventure",
    name: "Adventure",
    hint: "Travel, licenses, moving",
    actions: [
      { name: "Get Driver License", text: "Unlock better travel and some jobs.", available: p => p.age >= 16 && !p.licenses.includes("driver"), run: () => getLicense("driver", 140) },
      { name: "Get Pilot License", text: "Expensive flex with career upside.", available: p => p.age >= 18 && !p.licenses.includes("pilot"), run: () => getLicense("pilot", 7200) },
      { name: "Book International Trip", text: "Pick where to fly. 18+ unlocks most, 21+ unlocks Vegas/Dubai/Croatia.", available: p => p.age >= 18 && p.money >= 600, run: bookTrip },
      { name: "Weekend Trip", text: "Spend money for health and stories. Small generic getaway.", available: p => p.age >= 16, run: () => travel(false) },
      { name: "Move Cities", text: "Reset your scene and meet new people.", available: p => p.age >= 18, run: moveCities },
      { name: "Solo Backpacking", text: "High reward, real risk.", risky: true, available: p => p.age >= 18, run: backpack },
      { name: "Get Motorcycle License", text: "Two wheels, real risk.", available: p => p.age >= 18 && !p.licenses.includes("moto"), run: () => getLicense("moto", 320) },
      { name: "Get Boat License", text: "Captain a 26-footer legally.", available: p => p.age >= 18 && !p.licenses.includes("boat"), run: () => getLicense("boat", 480) },
      { name: "Roadtrip", text: "Pack the car. Go nowhere on purpose.", available: p => p.age >= 18 && hasAsset("car"), run: roadTrip },
      { name: "Camping Trip", text: "Tent, fire, no signal.", available: p => p.age >= 14, run: campingTrip },
      { name: "Festival Run", text: "Coachella, EDC, AfroPunk, Carnaval — pick a flag.", available: p => p.age >= 18 && p.money >= 800, run: festivalRun },
      { name: "Cruise", text: "Seven days, all-inclusive, awkward strangers.", available: p => p.age >= 16 && p.money >= 1200, run: cruiseTrip },
      { name: "Spring Break", text: "Cabo or Miami. Mistakes guaranteed.", risky: true, available: p => p.age >= 18 && p.money >= 800, run: springBreak },
      { name: "Couch In Europe", text: "Hostels, trains, two months no plan.", available: p => p.age >= 19 && p.money >= 2200, run: europeBackpack },
      { name: "Climb A Mountain", text: "Permit, sherpa, peak.", risky: true, available: p => p.age >= 20 && p.money >= 1800, run: mountainClimb },
      { name: "Run With Bulls", text: "Pamplona. Hooves coming up the street.", risky: true, available: p => p.age >= 21 && p.money >= 1000, run: runWithBulls },
      { name: "Burn The Man", text: "Burning Man. Build a camp. Disappear for a week.", available: p => p.age >= 21 && p.money >= 1400, run: burningMan }
    ]
  },
  {
    id: "street",
    name: "Street",
    hint: "Neighborhood, survival, recovery",
    actions: [
      { name: "Move To Skid Row", text: "Cheaper living, harder yearly pressure.", risky: true, available: p => p.age >= 16 && p.location !== "Skid Row, Los Angeles", run: moveToSkidRow },
      { name: "Couch Surf", text: "Save money but strain relationships.", available: p => p.age >= 16, run: couchSurf },
      { name: "Busk Sidewalk", text: "Make public cash from charisma and nerve.", available: p => p.age >= 14, run: buskSidewalk },
      { name: "Street Hustle", text: "Fast cash with real consequences.", risky: true, available: p => p.age >= 16, run: streetHustle },
      { name: "Join A Crew", text: "Gang-adjacent story path with heat and exits.", risky: true, available: p => p.age >= 14 && !p.gang && (p.streetRep >= 4 || p.location.includes("Skid Row") || p.dropout), run: joinStreetCrew },
      { name: "Loyalty Test", text: "Crew pressure. Reputation up, heat up.", risky: true, available: p => p.age >= 14 && Boolean(p.gang), run: crewLoyaltyTest },
      { name: "Broker Peace", text: "Try to cool down street tension.", risky: true, available: p => p.age >= 14 && (Boolean(p.gang) || p.streetRep >= 8), run: brokerPeace },
      { name: "Leave The Crew", text: "Hard exit from the gang path.", risky: true, available: p => p.age >= 14 && Boolean(p.gang), run: leaveStreetCrew },
      { name: "Go On A Bender", text: "A reckless spiral that can wreck health and discipline.", risky: true, available: p => p.age >= 18, run: goOnBender },
      { name: "Recovery Meeting", text: "Pull yourself back from the spiral.", available: p => p.age >= 16 && (p.risksTaken > 0 || p.streetRep > 0 || p.stats.health < 55), run: recoveryMeeting },
      { name: "Sell Za", text: "Move bags of weed. Friend tax included.", risky: true, available: p => p.age >= 14, run: sellZa },
      { name: "Run Bags", text: "Deliver, drop, get paid. No questions.", risky: true, available: p => p.age >= 14, run: runBags },
      { name: "Trap House", text: "Set up a spot. Move work full-time.", risky: true, available: p => p.age >= 16, run: runTrap },
      { name: "Cook Work", text: "Step up from selling to making. Bigger margins, bigger heat.", risky: true, available: p => p.age >= 17 && p.streetRep >= 6, run: cookWork },
      { name: "Front Bigger Bag", text: "Take work on consignment. Owe the plug.", risky: true, available: p => p.age >= 16 && p.streetRep >= 4, run: frontBag },
      { name: "Plug Connect", text: "Get put on with somebody higher up the chain.", risky: true, available: p => p.age >= 16 && p.streetRep >= 8, run: plugConnect },
      { name: "Buy A Strap", text: "Pick up a gun. The math changes after.", risky: true, available: p => p.age >= 18 && p.money >= 400 && !p.hasGun, run: buyStrap },
      { name: "Sell Used Shoes", text: "Flip sneakers to local kids and IG buyers.", available: p => p.age >= 12, run: sellShoes },
      { name: "Hit A Lick", text: "Run up on somebody for what they have.", risky: true, available: p => p.age >= 14, run: hitALick }
    ]
  },
  {
    id: "vices",
    name: "Vices",
    hint: "Smoking, drinking, drugs, recovery",
    actions: [
      { name: "Start Smoking", text: "Short stress relief, long health damage.", risky: true, available: p => p.age >= 16 && p.smokingLevel === 0, run: startSmoking },
      { name: "Smoke Break", text: "Calm down now, pay for it later.", risky: true, available: p => p.age >= 16 && p.smokingLevel > 0, run: smokeBreak },
      { name: "Cigar Lounge", text: "Network with business people while hurting health.", risky: true, available: p => p.age >= 21, run: cigarLounge },
      { name: "Nicotine Gum", text: "Step the habit down.", available: p => p.age >= 16 && p.smokingLevel > 0, run: nicotineGum },
      { name: "Quit Smoking", text: "A hard discipline check with a huge health upside.", available: p => p.age >= 16 && p.smokingLevel > 0, run: quitSmoking },
      { name: "Smoke Weed", text: "Hit the joint. Make plans for nothing.", risky: true, available: p => p.age >= 15, run: smokeWeed },
      { name: "Eat An Edible", text: "Take a 25mg gummy and ride.", risky: true, available: p => p.age >= 18, run: eatEdible },
      { name: "Drink Beer", text: "A couple cold ones with the homies.", risky: true, available: p => p.age >= 18, run: drinkBeer },
      { name: "Liquor Night", text: "Open the bottle. See where it takes you.", risky: true, available: p => p.age >= 18, run: liquorNight },
      { name: "Try Coke", text: "A line at a party. Just to see.", risky: true, available: p => p.age >= 18, run: tryCoke },
      { name: "Try Molly", text: "Festival pill. Hits hard, falls harder.", risky: true, available: p => p.age >= 18, run: tryMolly },
      { name: "Try Shrooms", text: "Quarter eighth. Walk the trail.", risky: true, available: p => p.age >= 18, run: tryShrooms },
      { name: "Try Acid", text: "Tab under the tongue. Twelve-hour ride.", risky: true, available: p => p.age >= 18, run: tryAcid },
      { name: "Try Lean", text: "Sip slow. The lullaby drug.", risky: true, available: p => p.age >= 18, run: tryLean },
      { name: "Try Xanax", text: "Bar from a friend. Quiet the noise.", risky: true, available: p => p.age >= 18, run: tryXans },
      { name: "Try Perc", text: "30mg. The drug that ate a generation.", risky: true, available: p => p.age >= 18, run: tryPerc },
      { name: "Try Meth", text: "Three days awake. Don't.", risky: true, available: p => p.age >= 18, run: tryMeth },
      { name: "Try Heroin", text: "First hit feels like home. Last hit ends you.", risky: true, available: p => p.age >= 18, run: tryHeroin },
      { name: "Overdose Scare", text: "Push the dose. Pray the Narcan is close.", risky: true, available: p => p.age >= 18 && (p.usedHard || p.smokingLevel >= 3), run: overdoseScare },
      { name: "Detox", text: "Lock in. Sweat it out. Real recovery.", available: p => p.age >= 16 && (p.usedHard || p.smokingLevel > 0 || (p.recovery || 0) >= 1), run: detoxClinic },
      { name: "Rehab Stay", text: "30-day program. Real reset.", available: p => p.age >= 18 && (p.usedHard || (p.recovery || 0) >= 1) && p.money >= 4000, run: rehabStay },
      { name: "Bottle Service Night", text: "$1200 minimum at a club. Sparklers, attention, mistakes.", risky: true, available: p => p.age >= 21 && p.money >= 1200, run: bottleService },
      { name: "After-Hours Spot", text: "Door knock at 4 AM. The party that never ends.", risky: true, available: p => p.age >= 18, run: afterHoursSpot },
      { name: "Strip Club Trip", text: "Stack of singles, expensive drinks, regret on Sunday.", risky: true, available: p => p.age >= 21 && p.money >= 200, run: stripClubTrip },
      { name: "Pay For A Stripper", text: "VIP room. Private dance. Make the night about you.", risky: true, available: p => p.age >= 21 && p.money >= 400, run: payForStripper },
      { name: "Hire An Escort", text: "Booking site. Hotel room. Whole evening planned.", risky: true, available: p => p.age >= 21 && p.money >= 600, run: hireEscort },
      { name: "Coke Off A Body", text: "Line on skin. The line that defines your generation.", risky: true, available: p => p.age >= 21 && p.usedHard, run: cokeOffBody },
      { name: "Orgy Night", text: "Group of consenting adults. Living room scene.", risky: true, available: p => p.age >= 21, run: orgyNight },
      { name: "Swingers Party", text: "Couples mixer. Bowl of keys.", risky: true, available: p => p.age >= 25 && p.married, run: swingersParty },
      { name: "Sex Tape", text: "Set up the camera. Don't think too hard.", risky: true, available: p => p.age >= 21, run: sexTape },
      { name: "Deepthroat Story", text: "Real one. The story you tell your guys at 3 AM.", risky: true, available: p => p.age >= 18, run: deepthroatStory },
      { name: "Blackout Drunk", text: "Lose two hours. Wake up in somebody's bed.", risky: true, available: p => p.age >= 18, run: blackoutDrunk },
      { name: "Wake Up Wrong House", text: "Eyes open in a room you don't recognize.", risky: true, available: p => p.age >= 18, run: wakeUpWrongHouse },
      { name: "Onlyfans Sub", text: "Pay for the link. Three creators, monthly.", available: p => p.age >= 18 && p.money >= 60, run: onlyfansSub },
      { name: "Porn Habit", text: "Daily, multiple times. Discipline goes first.", risky: true, available: p => p.age >= 14, run: pornHabit }
    ]
  },
  {
    id: "business",
    name: "Business",
    hint: "Build, hire, scale",
    actions: [
      { name: "Freelance Contract", text: "Use smarts and discipline for cash.", available: p => p.age >= 16, run: freelance },
      { name: "Start Company", text: "Create a company and make yourself CEO.", available: p => p.age >= 18 && !p.company, run: startCompany },
      { name: "Become CEO", text: "Take the CEO seat at your company.", available: p => p.age >= 18 && p.company && p.jobId !== "ceo", run: becomeCEO },
      { name: "Pitch Investors", text: "Raise money or get embarrassed in the room.", available: p => p.age >= 20, run: pitchInvestors },
      { name: "Product Launch", text: "Spend runway to ship something customers can judge.", available: p => p.company, run: launchProduct },
      { name: "Pivot Company", text: "Change the product and sector before the market decides for you.", available: p => p.company, run: pivotCompany },
      { name: "Hire Team", text: "Add employees, burn more cash, grow faster.", available: p => p.company, run: hireTeam },
      { name: "Board Meeting", text: "Make a random executive decision with real effects.", available: p => p.company, run: boardMeeting },
      { name: "Acquire Rival", text: "Buy competition and risk culture chaos.", risky: true, available: p => p.company && p.company.stage >= 2, run: acquireRival },
      { name: "Go Public", text: "Try for an IPO if the company is big enough.", risky: true, available: p => p.company && p.company.stage >= 4 && p.company.valuation >= 350000, run: goPublic },
      { name: "Sell Company", text: "Cash out based on valuation and equity.", available: p => p.company && p.company.valuation >= 60000, run: sellCompany },
      { name: "Improve Business", text: "Boost passive income if you own a classic asset.", available: p => hasAsset("business") || hasAsset("franchise"), run: improveBusiness },
      { name: "Hire Manager", text: "Spend cash to stabilize classic business income.", available: p => hasAsset("business") || hasAsset("franchise"), run: hireManager },
      { name: "Open Storefront", text: "Sign a lease, stock shelves, hire two people.", available: p => p.age >= 19 && p.money >= 8000, run: openStorefront },
      { name: "Launch Franchise", text: "Buy a Subway, a UPS Store, an oil-change shop.", available: p => p.age >= 24 && p.money >= 80000, run: launchFranchise },
      { name: "Launch SaaS", text: "Ship a small software tool. Bill monthly.", available: p => p.age >= 18 && hasClassTrack("coding"), run: launchSaaS },
      { name: "Start E-Commerce", text: "Pick a niche, find a supplier, run ads.", available: p => p.age >= 17 && p.money >= 800, run: startEcom },
      { name: "Real Estate Flip", text: "Buy ugly, fix it, sell it.", available: p => p.age >= 22 && p.money >= 40000, run: realEstateFlip },
      { name: "Real Estate Rental", text: "Buy a duplex. Tenants pay you.", available: p => p.age >= 22 && p.money >= 60000, run: realEstateRental },
      { name: "Drop A Clothing Brand", text: "Logo, hoodie, drop date.", available: p => p.age >= 16, run: dropClothingBrand },
      { name: "Open A Restaurant", text: "Lease, build out, hire chef.", available: p => p.age >= 21 && p.money >= 35000, run: openRestaurant },
      { name: "Open A Barbershop", text: "Chairs, license, walk-ins.", available: p => p.age >= 19 && p.money >= 9000, run: openBarbershop },
      { name: "Trucking Company", text: "Buy a rig. Run loads. Repeat.", available: p => p.age >= 21 && p.money >= 28000, run: truckingCompany },
      { name: "Buy NDA Bundle", text: "Pay a real lawyer to wrap your business in paperwork.", available: p => p.age >= 19 && p.company && p.money >= 2400, run: buyNDAs },
      { name: "Acquire Patent", text: "Buy out a competitor's IP cheaply.", available: p => p.company && p.money >= 12000, run: acquirePatent },
      { name: "Layoff Round", text: "Cut headcount. Save the company, lose the culture.", risky: true, available: p => p.company && p.company.stage >= 2, run: layoffRound },
      { name: "Take SBA Loan", text: "Small Business Administration credit line.", available: p => p.age >= 21 && p.money < 50000, run: sbaLoan },
      { name: "Network At Mixer", text: "Find one useful person at a real event.", available: p => p.age >= 18, run: networkMixer }
    ]
  },
  {
    id: "legal",
    name: "Legal",
    hint: "Records, lawsuits, jail, cleanup",
    actions: [
      { name: "Consult Lawyer", text: "Costly advice can reduce trouble.", available: p => p.age >= 18 && (p.record > 0 || p.inJail), run: consultLawyer },
      { name: "Hire Defense Lawyer", text: "Pay a real lawyer before they ever call you to court.", available: p => p.age >= 18 && p.money >= 2000 && !p.hasLawyerOnRetainer, run: hireDefenseLawyer },
      { name: "Fight Ticket", text: "Beat the citation or pay the fine.", available: p => p.age >= 16, run: fightTicket },
      { name: "Sue For Damages", text: "A legal gamble with upside.", available: p => p.age >= 18, run: sueForDamages },
      { name: "Get Sued", text: "Somebody filed against you. Settle or fight.", available: p => p.age >= 18 && p.money >= 1000 && chance(40), run: getSued },
      { name: "Plea Bargain", text: "Take a deal instead of betting on a verdict.", available: p => p.age >= 16 && p.record >= 1, run: pleaBargain },
      { name: "Turn Yourself In", text: "Get ahead of the warrant. Trade time for mercy.", available: p => p.age >= 16 && p.record >= 2 && !p.inJail, run: turnSelfIn },
      { name: "Visit Inmate", text: "Drive out to county. Sit across glass with somebody you love.", available: p => p.age >= 12 && p.relationships.some(r => r.inJail), run: visitInmate },
      { name: "Bail Out Friend", text: "Post bail for somebody on the inside.", available: p => p.age >= 18 && p.money >= 1500 && p.relationships.some(r => r.inJail), run: bailFriend },
      { name: "Parole Hearing", text: "Face the board and argue for an early walk.", available: p => p.inJail, run: paroleHearing },
      { name: "Behave Inside", text: "Programs, work detail, no fights. Build days credit.", available: p => p.inJail, run: behaveInside },
      { name: "Yard Politics", text: "Pick a side. Earn respect. Risk heat.", risky: true, available: p => p.inJail, run: yardPolitics },
      { name: "Expunge Record", text: "Big money, huge career impact.", available: p => p.age >= 21 && p.record > 0 && !p.inJail, run: expungeRecord },
      { name: "Custody Battle", text: "Fight in family court for your kid.", available: p => p.age >= 21 && p.children.length > 0 && p.divorces > 0, run: custodyBattle },
      { name: "Immigration Help", text: "Pay an immigration lawyer for paperwork.", available: p => p.age >= 18 && p.money >= 800, run: immigrationHelp },
      { name: "Whistleblow", text: "Hand evidence to the feds. Karma up, danger up.", risky: true, available: p => p.age >= 21 && (p.jobId !== "none" || p.company), run: whistleblow }
    ]
  },
  {
    id: "politics",
    name: "Politics",
    hint: "Influence, campaigns, office",
    actions: [
      { name: "Vote", text: "Show up to the polls. Civic minimum.", available: p => p.age >= 18, run: voteCivic },
      { name: "Volunteer Campaign", text: "Knock doors, phone-bank, grind for a candidate.", available: p => p.age >= 16, run: volunteerCampaign },
      { name: "Donate To Cause", text: "Cut a check to a political org.", available: p => p.age >= 18 && p.money >= 100, run: donateCause },
      { name: "Attend Town Hall", text: "Build local influence.", available: p => p.age >= 18, run: townHall },
      { name: "Fundraiser", text: "Spend money to gain influence.", available: p => p.age >= 21, run: fundraiser },
      { name: "Run School Board", text: "Smallest office, fastest entry point.", available: p => p.age >= 21 && p.politicalCapital >= 8 && p.jobId !== "schoolboard", run: runSchoolBoard },
      { name: "Run City Council", text: "Pick neighborhood fights and win them.", available: p => p.age >= 25 && p.politicalCapital >= 25 && p.jobId !== "councilmember", run: runCityCouncil },
      { name: "Run For Mayor", text: "Try to turn influence into citywide power.", available: p => p.age >= 25 && p.politicalCapital >= 35 && p.jobId !== "mayor", run: runForOffice },
      { name: "Run State Senate", text: "Bigger stage, dirtier money.", available: p => p.age >= 28 && p.politicalCapital >= 60, run: runStateSenate },
      { name: "Run Congress", text: "Federal seat. Real machine money required.", available: p => p.age >= 32 && p.politicalCapital >= 100 && p.money >= 20000, run: runCongress },
      { name: "Hire Lobbyist", text: "Buy influence in rooms you can't enter.", available: p => p.age >= 25 && p.money >= 5000, run: hireLobbyist },
      { name: "Public Endorsement", text: "Trade fame for political capital.", available: p => p.age >= 21 && p.fame >= 15, run: publicEndorsement },
      { name: "Campaign Scandal", text: "A leak hits. Damage control or get buried.", risky: true, available: p => p.age >= 21 && p.politicalCapital >= 20, run: campaignScandal },
      { name: "Pass Local Reform", text: "Use office power for legacy.", available: p => p.jobId === "mayor" || p.jobId === "councilmember" || p.jobId === "schoolboard", run: passReform },
      { name: "Pass National Bill", text: "Push a federal bill through a hostile chamber.", available: p => p.jobId === "congress" || p.jobId === "senate", run: passNationalBill },
      { name: "🔒 Run For President", text: "The whole country votes on you.", available: p => p.age >= 35 && (p.jobId === "congress" || p.jobId === "senate") && p.politicalCapital >= 180 && !p.runningForPres, run: runForPresident },
      { name: "🔒 Cabinet Appointment", text: "President names you Secretary of something.", available: p => p.age >= 35 && p.politicalCapital >= 120 && (p.classCareer?.business || p.classCareer?.debate) && !p.cabinetPosition, run: cabinetAppointment }
    ]
  },
  {
    id: "risk",
    name: "Risky",
    hint: "Fast money, bad odds",
    actions: [
      { name: "Street Race", text: "Win cash or damage your life.", risky: true, available: p => p.age >= 16, run: streetRace },
      { name: "Petty Scam", text: "A shady shortcut with consequences.", risky: true, available: p => p.age >= 16, run: () => riskyPayout(randomInt(420, 2100), "The scam worked.", "You got caught.") },
      { name: "Crash A Party", text: "Fun, fame, or trouble.", risky: true, available: p => p.age >= 15, run: crashParty },
      { name: "Underground Fight", text: "Health risk, cash upside.", risky: true, available: p => p.age >= 18, run: undergroundFight },
      { name: "High-Stakes Bet", text: "Risk savings on one huge swing.", risky: true, available: p => p.age >= 21 && p.money >= 1000, run: highStakesBet },
      { name: "Art Heist", text: "Wild payout, brutal consequences.", risky: true, available: p => p.age >= 25, run: artHeist },
      { name: "Bank Job", text: "Mask, getaway, four-second timeline.", risky: true, available: p => p.age >= 18, run: bankJob },
      { name: "Insurance Fraud", text: "Slip, fall, file the claim.", risky: true, available: p => p.age >= 18, run: insuranceFraud },
      { name: "Identity Theft", text: "Run somebody else's name and credit.", risky: true, available: p => p.age >= 16 && p.stats.smarts >= 55, run: identityTheft },
      { name: "Poker Night", text: "A real table. Real reads. Real money.", risky: true, available: p => p.age >= 18 && p.money >= 500, run: pokerNight },
      { name: "Drag Race", text: "Sanctioned strip. Quarter-mile, real consequences.", risky: true, available: p => p.age >= 16 && hasAsset("car"), run: dragRace },
      { name: "Buy Stolen Goods", text: "Take a deal from a fence and flip it.", risky: true, available: p => p.age >= 16 && p.money >= 300, run: buyStolenGoods },
      { name: "Smuggle Run", text: "Cross a border with something you shouldn't.", risky: true, available: p => p.age >= 18, run: smuggleRun },
      { name: "Pyramid Scheme", text: "Recruit, recruit, recruit. Be the top, not the bottom.", risky: true, available: p => p.age >= 18, run: pyramidScheme },
      { name: "Skydive", text: "Pay to fall on purpose.", risky: true, available: p => p.age >= 18 && p.money >= 250, run: skydiveJump },
      { name: "Cliff Jump", text: "Free climb a coastal cliff and send it.", risky: true, available: p => p.age >= 16, run: cliffJump },
      { name: "Card Cloning", text: "Skim numbers, encode blanks, swipe them clean.", risky: true, available: p => p.age >= 16, run: cardCloning },
      { name: "BIN Run", text: "Bought BINs. Hit the mall. Convert to gift cards before they shut it down.", risky: true, available: p => p.age >= 16 && p.stats.smarts >= 50, run: binRun },
      { name: "Skimmer Install", text: "Pop a skimmer on a gas pump. Wait a week. Collect.", risky: true, available: p => p.age >= 18, run: skimmerInstall },
      { name: "Check Washing", text: "Acetone a stolen check. Rewrite the payee. Cash it.", risky: true, available: p => p.age >= 18, run: checkWashing },
      { name: "Cash App Scam", text: "Phish a few inboxes. Run the Zelle play.", risky: true, available: p => p.age >= 16, run: cashAppScam },
      { name: "Counterfeit Bills", text: "Print fake hundreds. Spend them where it's loud and dark.", risky: true, available: p => p.age >= 18, run: counterfeitBills },
      { name: "Casino Night", text: "Hit the strip. Three tables, drinks, sunglasses.", risky: true, available: p => p.age >= 21 && p.money >= 200, run: casinoNight },
      { name: "Blackjack Table", text: "$25 minimum. Count if you can.", risky: true, available: p => p.age >= 21 && p.money >= 200, run: blackjackTable },
      { name: "Slot Machine Binge", text: "Pull the handle until your card maxes.", risky: true, available: p => p.age >= 21 && p.money >= 100, run: slotMachine },
      { name: "Sports Bet", text: "Single-game parlay on a hunch.", risky: true, available: p => p.age >= 18 && p.money >= 50, run: sportsBetSingle },
      { name: "10-Leg Parlay", text: "Long-shot lottery slip dressed as picks.", risky: true, available: p => p.age >= 18 && p.money >= 50, run: parlay10Leg },
      { name: "Online Poker Grind", text: "Six tables at once. Volume game.", risky: true, available: p => p.age >= 18 && p.money >= 200, run: onlinePokerGrind },
      { name: "Roulette Wheel", text: "Red, black, your number. The wheel spins.", risky: true, available: p => p.age >= 21 && p.money >= 100, run: rouletteWheel },
      { name: "Bookie Account", text: "Set up with a guy who books off the apps.", risky: true, available: p => p.age >= 18, run: bookieAccount },
      { name: "Owe The Bookie", text: "Tab got long. They want it Friday.", risky: true, available: p => p.hasBookie && p.debt >= 2000, run: oweBookie },
      { name: "🔒 Hit Powerball", text: "$10 ticket. Real-life odds. Real-life payout if it hits.", risky: true, available: p => p.age >= 21 && p.lottery && !p.megaJackpot, run: powerballHit },
      { name: "🔒 The Big Score", text: "One job. Everything you've built. No going back.", risky: true, available: p => p.age >= 25 && p.streetRep >= 20 && p.gang && p.hasGun && !p.bigScoreAttempted, run: theBigScore }
    ]
  }
];

function askOut() {
  const bias = lifeBias(state.player, "romance");
  const odds = 34 + Math.floor(state.player.stats.looks / 3) + Math.floor(state.player.stats.happiness / 8) + bias;
  if (chance(odds)) {
    const o = originOf(state.player.location);
    const name = pick(o.locals.concat(peopleNames));
    state.player.relationships.push({ id: `partner-${Date.now()}`, name, role: "Partner", bond: randomInt(52, 78), type: "partner" });
    applyEffects(`${name} said yes. You are dating now.`, { happiness: 10 }, "good");
  } else {
    applyEffects("They said no. That stung.", { happiness: -8, discipline: 2 }, "bad");
  }
}

function apologize() {
  const person = [...state.player.relationships].sort((a, b) => a.bond - b.bond)[0];
  changeBond(person, 12);
  applyEffects(`You apologized to ${person.name}. It helped.`, { happiness: 2, karma: 2 }, "good");
}

function postOnline() {
  if (!state.player.socialPage) {
    createSocialPage();
    return;
  }
  postReel();
}

function createSocialPage() {
  const player = state.player;
  if (player.socialPage) {
    applyEffects(`${player.handle} already exists.`, {});
    return;
  }
  if (!player.handle) {
    const suggested = `@${player.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    let chosen = null;
    try {
      chosen = window.prompt("Pick a handle for your page (no spaces).", suggested);
    } catch (e) { chosen = suggested; }
    player.handle = normalizeHandle(chosen || suggested, player.name);
  }
  player.socialPage = true;
  rememberInterest("content", 3);
  const starterFollowers = randomInt(12, 180);
  applyEffects(`You launched ${player.handle} and posted your first little life update.`, {
    followers: starterFollowers,
    posts: 1,
    fame: 1,
    happiness: 3
  }, "good");
}

function scrollReels() {
  rememberInterest("content", 1);
  if (chance(38)) {
    const idea = pick(["a fit check", "a cooking trend", "a travel clip", "a money rant", "a workout challenge"]);
    applyEffects(`You scrolled Instagram Reels and stole inspiration from ${idea}.`, {
      happiness: 4,
      smarts: 2,
      discipline: -2
    }, "good");
  } else {
    applyEffects("You meant to scroll for five minutes and lost the whole night.", {
      happiness: -2,
      discipline: -5,
      health: -1
    }, "bad");
  }
}

function postReel() {
  const player = state.player;
  if (!player.socialPage) {
    createSocialPage();
    return;
  }
  const base = 30 + Math.floor(player.stats.looks / 4) + Math.floor(player.fame / 3) + Math.floor(player.followers / 900);
  const followerMult = lifeBias(player, "followerMult");
  const brand = pick(brands);
  player.posts += 1;
  rememberInterest("content", 2);
  if (chance(base)) {
    const gain = Math.round((randomInt(80, 780) + Math.floor(player.followers * randomInt(4, 18) / 100)) * followerMult);
    const viral = chance(12 + Math.floor(player.stats.looks / 14) + Math.floor(player.fame / 12));
    if (viral) {
      const viralGain = gain + randomInt(1600, 16000);
      player.viralHits += 1;
      applyEffects(`Your reel mentioned ${brand} and went viral. ${player.handle} gained ${viralGain.toLocaleString()} followers.`, {
        followers: viralGain,
        fame: 9,
        happiness: 8
      }, "good");
    } else {
      applyEffects(`Your reel did solid numbers. ${player.handle} gained ${gain.toLocaleString()} followers.`, {
        followers: gain,
        fame: 3,
        happiness: 4
      }, "good");
    }
  } else {
    const gain = randomInt(3, 58);
    applyEffects(`The reel barely moved, but ${gain} people still followed ${player.handle}.`, {
      followers: gain,
      discipline: 1,
      happiness: -1
    });
  }
}

function goLive() {
  const player = state.player;
  if (!player.socialPage) {
    createSocialPage();
    return;
  }
  const turnout = randomInt(4, 160) + Math.floor(player.followers / randomInt(65, 140));
  if (chance(44 + Math.floor(player.fame / 3))) {
    const tips = randomInt(15, 420) + Math.floor(turnout * randomInt(1, 4));
    applyEffects(`${turnout.toLocaleString()} people joined your live and sent ${money(tips)} in tips.`, {
      money: tips,
      followers: randomInt(45, 900),
      fame: 4,
      happiness: 5
    }, "good");
  } else {
    applyEffects(`${turnout.toLocaleString()} people watched, and the chat got awkward fast.`, {
      followers: randomInt(5, 90),
      fame: 1,
      happiness: -3
    }, "bad");
  }
}

function dmCollab() {
  const player = state.player;
  const partner = pick(["a local barber", "a Twitch streamer", "a sneaker reseller", "a food reviewer", "a campus comic"]);
  const odds = 34 + Math.floor(player.followers / 900) + Math.floor(player.stats.looks / 5);
  if (chance(odds)) {
    const gain = randomInt(240, 2600) + Math.floor(player.followers * 0.08);
    applyEffects(`You DM'd ${partner} and the collab hit. ${player.handle} gained ${gain.toLocaleString()} followers.`, {
      followers: gain,
      fame: 5,
      happiness: 6
    }, "good");
  } else {
    applyEffects(`You DM'd ${partner}. Left on read. Character development, technically.`, {
      happiness: -3,
      discipline: 2
    }, "bad");
  }
}

function storytimePost() {
  const player = state.player;
  if (!player.socialPage) { createSocialPage(); return; }
  const topic = pick(["a wild ex story", "the time you got jumped", "a family drama", "a near-miss with the law", "your first job", "a friend who turned snake"]);
  player.posts += 1;
  if (chance(48 + Math.floor(player.fame / 4))) {
    const gain = randomInt(400, 4200) + Math.floor(player.followers * 0.05);
    applyEffects(`The ${topic} post hit. Comments are arguing. ${gain.toLocaleString()} new follows.`, { followers: gain, fame: 5, happiness: 6 }, "good");
  } else {
    applyEffects(`The ${topic} post got 38 likes and a thread of people calling you corny.`, { followers: randomInt(2, 40), happiness: -4, discipline: 2 }, "bad");
  }
}

function igBrandDeal() {
  const player = state.player;
  if (player.followers < 5000) {
    applyEffects("Brands don't slide in your DMs yet. Keep grinding.", { discipline: 1 });
    return;
  }
  const brand = pick(["Shein", "Liquid IV", "Athletic Greens", "Manscaped", "Audible", "Honey", "Hims", "Raycon", "Factor"]);
  const baseFee = Math.min(40000, 200 + Math.floor(player.followers / 20) + player.fame * 80);
  const fee = randomInt(Math.floor(baseFee * 0.6), Math.floor(baseFee * 1.4));
  if (chance(58 + Math.floor(player.fame / 6))) {
    applyEffects(`${brand} cut a ${money(fee)} check. You'll post the ad next Tuesday.`, { money: fee, followers: -randomInt(80, 480), fame: 2, businessReputation: 2 }, "good");
  } else {
    applyEffects(`${brand} sent a contract with terms you couldn't sign. Walked away.`, { discipline: 2, smarts: 3 });
  }
}

function startBeef() {
  const player = state.player;
  player.risksTaken += 1;
  const rival = pick(["a bigger creator", "a smaller creator on the come-up", "a podcaster who subbed you", "an ex who has a platform now"]);
  const odds = 42 + Math.floor(player.stats.looks / 5) + Math.floor(player.fame / 5);
  if (chance(odds)) {
    const gain = randomInt(2000, 22000);
    applyEffects(`The beef with ${rival} went your way. Audience pulled up for you.`, { followers: gain, fame: 8, happiness: 6, karma: -3 }, "good");
  } else {
    applyEffects(`${rival} clipped you out of context and the algorithm punished you.`, { followers: -randomInt(800, 6000), fame: -4, happiness: -10, karma: -2 }, "bad");
  }
}

function buyFollowers() {
  const player = state.player;
  player.risksTaken += 1;
  const spend = Math.min(player.money, randomInt(200, 1800));
  const bought = spend * randomInt(8, 24);
  if (chance(38)) {
    applyEffects(`You bought ${bought.toLocaleString()} bot followers. Engagement looks dead but the number is up.`, { money: -spend, followers: bought, fame: 1, happiness: 2, karma: -4 }, "good");
  } else {
    const purged = Math.floor(bought * randomInt(60, 100) / 100);
    applyEffects(`Platform purged the bots a week later. Lost ${purged.toLocaleString()} followers and ate the bill.`, { money: -spend, followers: -purged, fame: -3, happiness: -6 }, "bad");
  }
}

function getCancelled() {
  const player = state.player;
  player.risksTaken += 1;
  const offense = pick(["an old caption that aged badly", "a video clip taken out of context", "a screenshot of a DM", "a podcast quote from years ago"]);
  const survive = 34 + Math.floor(player.fame / 6) - Math.floor(player.viralHits * 2);
  if (chance(survive)) {
    applyEffects(`${offense} surfaced. You posted a clear apology and the cycle moved on in a week.`, { followers: -randomInt(400, 4000), fame: -3, smarts: 5, happiness: -8, karma: 2 }, "bad");
  } else {
    const wiped = Math.floor(player.followers * randomInt(20, 55) / 100);
    applyEffects(`${offense} ended your run. Brand deals pulled. ${wiped.toLocaleString()} followers gone.`, { followers: -wiped, fame: -18, businessReputation: -8, happiness: -22 }, "bad");
  }
}

function platformBan() {
  const player = state.player;
  if (chance(48 + Math.floor(player.stats.smarts / 6) + (player.hasLawyerOnRetainer ? 18 : 0))) {
    applyEffects("Your appeal worked. Account back, shadow-ban removed.", { fame: 2, smarts: 3, happiness: 4 }, "good");
  } else {
    const wiped = Math.floor(player.followers * randomInt(40, 90) / 100);
    player.followers = Math.max(0, player.followers - wiped);
    applyEffects(`Ban upheld. You lost ${wiped.toLocaleString()} followers. Time to rebuild on a different platform.`, { fame: -10, discipline: 4, happiness: -14 }, "bad");
  }
}

function parasocialDM() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("The DM stayed harmless. Fan posted a screenshot of you replying. Loyalty up.", { followers: randomInt(80, 600), fame: 2, happiness: 3, karma: 1 }, "good");
  } else {
    applyEffects("The DM screenshots leaked. The internet decided it was weird.", { followers: -randomInt(400, 3000), fame: -5, happiness: -10, karma: -4 }, "bad");
  }
}

function launchPodcast() {
  const player = state.player;
  if (player.hasPodcast) {
    const earned = randomInt(400, 5200) + player.fame * 50 + Math.floor(player.followers / 80);
    applyEffects(`This season of your podcast brought in ${money(earned)} from ads and a sponsor.`, { money: earned, fame: 4, followers: randomInt(200, 2400) }, "good");
    return;
  }
  player.hasPodcast = true;
  applyEffects("You launched a weekly podcast. First episode dropped at midnight.", { money: -800, fame: 3, followers: randomInt(80, 700), happiness: 6, discipline: 3 }, "good");
}

function dropDoc() {
  const player = state.player;
  const cost = 6000;
  if (player.money < cost) {
    applyEffects(`A self-funded doc costs at least ${money(cost)}. Save up.`, { happiness: -2 });
    return;
  }
  const earned = randomInt(15000, 240000) + player.fame * 200;
  applyEffects(`Your doc dropped. ${money(earned)} from streaming licensing and merch.`, { money: earned - cost, fame: 18, followers: randomInt(8000, 90000), happiness: 14 }, "good");
}

function startNewsletter() {
  const player = state.player;
  const subs = randomInt(80, 2200) + Math.floor(player.followers / 40);
  applyEffects(`Newsletter live. ${subs.toLocaleString()} signups in the first month.`, { followers: subs, smarts: 4, businessReputation: 3, happiness: 6 }, "good");
}

function launchPatreon() {
  const player = state.player;
  const tiers = randomInt(30, 800);
  const mrr = tiers * randomInt(8, 28);
  applyEffects(`Patreon launched. ${tiers} subs at avg ${money(Math.floor(mrr/tiers))}/mo = ${money(mrr)} MRR.`, { money: mrr * 3, fame: 4, businessReputation: 4, happiness: 10 }, "good");
}

function launchOnlyfans() {
  const player = state.player;
  player.risksTaken += 1;
  const mrr = Math.floor((randomInt(800, 12000) + player.followers * 0.4) * (player.stats.looks / 60));
  if (chance(58 + Math.floor(player.stats.looks / 5))) {
    applyEffects(`Subscribers came in steady. ${money(mrr)}/mo at the peak. Some friends and family stopped calling.`, { money: mrr * 3, fame: 8, looks: 2, happiness: 6, karma: -2, businessReputation: -4 }, "good");
  } else {
    applyEffects("Account got reported and shut down. The page lives on screenshots though.", { fame: 4, happiness: -10, businessReputation: -8, karma: -2 }, "bad");
  }
}

function startSubstack() {
  const player = state.player;
  const subs = randomInt(40, 1800) + Math.floor(player.followers / 60);
  applyEffects(`Substack live. ${subs.toLocaleString()} free readers, ${Math.floor(subs * 0.04)} paid.`, { followers: subs, money: subs * 4, smarts: 5, businessReputation: 3, happiness: 6 }, "good");
}

function ghostWriteThread() {
  const player = state.player;
  const fee = randomInt(400, 4800);
  if (chance(58 + Math.floor(player.stats.smarts / 5))) {
    applyEffects(`Ghost-wrote a viral thread for a CEO. ${money(fee)} cleared. Nobody knows.`, { money: fee, smarts: 4, businessReputation: 2, happiness: 5 }, "good");
  } else {
    applyEffects("Client ghosted on the invoice. You ate the work.", { smarts: 3, happiness: -4 }, "bad");
  }
}

function youtubeLongform() {
  const player = state.player;
  if (chance(38 + Math.floor(player.stats.smarts / 6) + Math.floor(player.fame / 6))) {
    const views = randomInt(20000, 800000);
    const rev = Math.floor(views * 0.003);
    applyEffects(`Long-form upload hit ${views.toLocaleString()} views. ${money(rev)} AdSense.`, { money: rev, fame: 8, followers: Math.floor(views / 25), happiness: 10 }, "good");
  } else {
    applyEffects("Upload sat. 800 views in two weeks. Algorithm didn't pick it up.", { fame: 1, smarts: 3 }, "bad");
  }
}

function getVerified() {
  const player = state.player;
  player.verified = true;
  applyEffects("Blue check on your profile. DMs got busier and weirder.", { money: -120, fame: 6, businessReputation: 3, happiness: 8 }, "good");
}

function loseVerification() {
  const player = state.player;
  player.verified = false;
  applyEffects("Verification pulled after a violation. Your DMs got quiet fast.", { fame: -8, happiness: -10, businessReputation: -4 }, "bad");
}

function algorithmShift() {
  const player = state.player;
  if (chance(54)) {
    const lost = Math.floor(player.followers * randomInt(15, 35) / 100);
    applyEffects(`Platform changed the rec engine. Lost about ${lost.toLocaleString()} reach.`, { followers: -lost, fame: -4, happiness: -6, smarts: 3 }, "bad");
  } else {
    const gained = Math.floor(player.followers * randomInt(10, 30) / 100);
    applyEffects(`The new algorithm favored your style. Reach ${gained.toLocaleString()} up.`, { followers: gained, fame: 4, happiness: 6 }, "good");
  }
}

function btsVlog() {
  const player = state.player;
  if (chance(48)) {
    const gain = randomInt(800, 8400);
    applyEffects(`BTS vlog hit different. ${gain.toLocaleString()} new follows.`, { followers: gain, fame: 4, happiness: 6 }, "good");
  } else {
    applyEffects("Vlog edit was rough. Comments roasted the b-roll.", { fame: 1, smarts: 3, happiness: -3 });
  }
}

function fanQA() {
  applyEffects("Hour of questions. You answered everything. Loyal fans got more loyal.", { followers: randomInt(180, 2400), fame: 3, happiness: 7, karma: 3 }, "good");
}

function crossPostX() {
  const player = state.player;
  const gain = randomInt(80, 2400) + Math.floor(player.followers / 80);
  applyEffects(`You started cross-posting threads on X. ${gain.toLocaleString()} new follows.`, { followers: gain, fame: 2, smarts: 2 }, "good");
}

function tiktokSeries() {
  const player = state.player;
  if (chance(48 + Math.floor(player.stats.looks / 5))) {
    const gain = randomInt(4000, 60000);
    applyEffects(`The series caught. Episode 3 went viral. ${gain.toLocaleString()} follows.`, { followers: gain, fame: 8, happiness: 10 }, "good");
  } else {
    applyEffects("Series got 400 views per ep. You pivoted twice and then dropped it.", { fame: 1, smarts: 3 }, "bad");
  }
}

function sellCourse() {
  const player = state.player;
  const fee = randomInt(97, 997);
  const sales = randomInt(20, Math.max(50, Math.floor(player.followers / 80)));
  const earned = fee * sales;
  applyEffects(`Course launched at ${money(fee)}. ${sales} sales = ${money(earned)}.`, { money: earned, businessReputation: 4, fame: 3, happiness: 8 }, "good");
}

function pivotNiche() {
  const player = state.player;
  player.risksTaken += 1;
  const loss = Math.floor(player.followers * randomInt(20, 50) / 100);
  player.followers = Math.max(0, player.followers - loss);
  if (chance(48 + Math.floor(player.stats.smarts / 6))) {
    applyEffects(`Pivot worked. Lost ${loss.toLocaleString()} but the new niche is converting harder.`, { fame: 4, smarts: 6, businessReputation: 2, happiness: 5 }, "good");
  } else {
    applyEffects(`Pivot tanked. Lost ${loss.toLocaleString()} and the new content is dead on arrival.`, { fame: -6, smarts: 5, happiness: -8 }, "bad");
  }
}

function clapBackOnline() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 42 + Math.floor(player.fame / 3) + Math.floor(player.stats.looks / 8);
  if (chance(odds)) {
    const gain = randomInt(300, 4800);
    applyEffects("Your clapback was sharp enough to become the clip everyone shared.", {
      followers: gain,
      fame: 6,
      happiness: 5,
      karma: -3
    }, "good");
  } else {
    applyEffects("The clapback backfired and your mentions turned radioactive.", {
      followers: -randomInt(80, 900),
      fame: -4,
      happiness: -9,
      karma: -6
    }, "bad");
  }
}

function brandRun(brand, cost, effects, text) {
  if (state.player.money < cost) {
    applyEffects(`You need ${money(cost - state.player.money)} more for that ${brand} run.`, { happiness: -1 });
    return;
  }
  applyEffects(`${brand}: ${text}`, { money: -cost, ...effects }, "good");
  maybeMicroScene("brand", 22, { brand });
}

function pawnShopSell() {
  const player = state.player;
  const item = pick(["an old watch", "a gaming console", "a chain", "a power tool set", "your laptop", "a designer bag"]);
  const offered = randomInt(80, 720);
  applyEffects(`Pawn shop offered ${money(offered)} for ${item}. You took it.`, { money: offered, happiness: -2, discipline: 2 }, "good");
}

function luxuryBoutique() {
  const player = state.player;
  const brand = pick(["Gucci", "Louis Vuitton", "Off-White", "Balenciaga", "Dior", "Saint Laurent"]);
  const spend = randomInt(1800, 6500);
  if (player.money < spend) {
    applyEffects(`The ${brand} piece you wanted runs ${money(spend)}. You walked away empty.`, { happiness: -3 }, "bad");
    return;
  }
  applyEffects(`${brand}: you walked out with a piece that announces itself.`, { money: -spend, looks: 8, fame: 3, happiness: 7 }, "good");
}

function sneakerDrop() {
  const player = state.player;
  const pair = pick(["Air Jordan 1", "Yeezy Boost", "Travis Scott AF1", "Dunk Low", "Sacai LDV", "New Balance 990"]);
  if (chance(38)) {
    applyEffects(`Won the raffle for ${pair}. Resell rate is 3x.`, { money: -240, looks: 5, fame: 3, businessReputation: 1, happiness: 9 }, "good");
  } else {
    applyEffects(`Camped four hours for ${pair} and got nothing. Bots beat you.`, { happiness: -4, discipline: 3 }, "bad");
  }
}

function dispensaryRun() {
  const player = state.player;
  const cost = randomInt(60, 180);
  if (player.money < cost) { applyEffects(`The cart-and-flower bundle runs ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects(`Dispensary haul: edibles, a cart, half-eighth. Legal and clean.`, { money: -cost, happiness: 6, discipline: -1, health: -1 }, "good");
}

function petShopBrowse() {
  const player = state.player;
  if (chance(28) && player.age >= 16) {
    petShopAdopt();
    return;
  }
  applyEffects("You spent twenty minutes putting your face up to the puppy glass.", { happiness: 6, karma: 1 }, "good");
}

function petShopAdopt() {
  const player = state.player;
  const cost = randomInt(180, 480);
  if (player.money < cost) return;
  const species = pick(["a rescue dog", "a tabby kitten", "a bunny", "a cockatiel"]);
  const name = pick(["Beans", "Mango", "Pixel", "Olive", "Cooper", "Hazel"]);
  player.relationships.push({ id: `pet-${Date.now()}`, name, role: species, bond: randomInt(72, 92), type: "pet" });
  applyEffects(`You adopted ${species}. Their name is ${name}.`, { money: -cost, happiness: 14, karma: 5, health: 2 }, "good");
}

function giftShopRun() {
  const player = state.player;
  const cost = randomInt(60, 220);
  if (player.money < cost) { applyEffects(`Real gift runs ${money(cost)}.`, { happiness: -2 }); return; }
  const target = pick(player.relationships);
  if (target) changeBond(target, randomInt(6, 14));
  applyEffects(`Gift for ${target?.name || "somebody you love"}. They actually used it.`, { money: -cost, happiness: 8, karma: 5 }, "good");
}

// ============================================================
// MICRO-SCENES — random follow-ups on otherwise-flat activities
// ============================================================
const microScenes = {
  gym: () => ({
    title: "Gym Eyes",
    text: () => `Someone kept watching you between sets. You don't think they meant to be obvious.`,
    choices: [
      { label: "Walk over and say hi", run: () => {
        if (chance(45 + Math.floor(state.player.stats.looks / 6))) {
          const name = pick(peopleNames);
          state.player.relationships.push({ id: `friend-${Date.now()}`, name, role: "Gym friend", bond: randomInt(40, 65), type: "friend" });
          applyEffects(`Their name is ${name}. They train at the same time. You traded numbers.`, { happiness: 8, looks: 2 }, "good");
        } else {
          applyEffects(`They got red, said they were just zoned out. Mutual awkward laugh.`, { happiness: 1, looks: 1 });
        }
      } },
      { label: "Mind your business", run: () => applyEffects("Finished your session. They left first. Whatever it was, stayed unsaid.", { discipline: 4 }) }
    ]
  }),

  therapy: () => ({
    title: "Therapist's Question",
    text: () => `Halfway through the session, she asked: "What would you say to the version of ${state.player.name} who needed someone to step up — and nobody did?"`,
    choices: [
      { label: "Answer honestly", run: () => applyEffects(`You sat with it for forty seconds. Then you talked. Then you cried. The week felt different after.`, { happiness: 14, smarts: 5, discipline: 4 }, "good") },
      { label: "Deflect with a joke", run: () => applyEffects(`You made her laugh. The question stayed open. You'll bring it up in six months. Or you won't.`, { happiness: -2, smarts: 2 }) }
    ]
  }),

  mealprep: () => ({
    title: "Wellness Account Repost",
    text: () => `A wellness account with 600K followers reposted ${state.player.handle || `@${state.player.name.toLowerCase()}`}'s meal prep video. Their DMs are open.`,
    choices: [
      { label: "Lean in, post more", run: () => {
        if (!state.player.socialPage) state.player.socialPage = true;
        const fol = randomInt(800, 8000);
        applyEffects(`You posted three more videos that week. ${fol.toLocaleString()} followers. The algorithm picked you.`, { followers: fol, fame: 6, happiness: 8, discipline: 3 }, "good");
      } },
      { label: "Stay private", run: () => applyEffects(`You DM'd "thanks 🙏" and went back to your normal life. Maybe smarter, maybe smaller.`, { discipline: 6, happiness: 2 }) }
    ]
  }),

  volunteer: () => ({
    title: "The Kid Who Watched You",
    text: () => `A kid you've been mentoring brought you a folded paper. It's a thank-you note in pencil. The handwriting is going a different way every line.`,
    choices: [
      { label: "Read it on the spot", run: () => applyEffects(`You read it twice. Then once more in the car. Then once more before bed. It said exactly what you needed to hear.`, { happiness: 14, karma: 12 }, "good") },
      { label: "Save it for later", run: () => applyEffects(`You folded it back, put it in your jacket. Found it three months later, cried at the dry cleaner.`, { happiness: 10, karma: 10, smarts: 3 }, "good") }
    ]
  }),

  lift: () => ({
    title: "Gym TikTok",
    text: () => `A stranger filmed you mid-set and posted it. The caption is "form check or fine??" It's gaining traction faster than your last actual post.`,
    choices: [
      { label: "Stitch it, run with it", run: () => {
        const fol = randomInt(1500, 18000);
        if (!state.player.socialPage) state.player.socialPage = true;
        applyEffects(`You stitched it with a joke. ${fol.toLocaleString()} new followers in 48 hours. Lifters in your DMs.`, { followers: fol, fame: 8, looks: 3, happiness: 8 }, "good");
      } },
      { label: "Ask them to take it down", run: () => applyEffects(`They took it down. You felt right and slightly invisible.`, { discipline: 6, karma: 3, happiness: -2 }) }
    ]
  }),

  cardio: () => ({
    title: "Ghost from the Past",
    text: () => `You ran past someone you haven't seen in years. They waved. You waved. Now you're four blocks down and your phone is buzzing.`,
    choices: [
      { label: "Stop and catch up", run: () => {
        const name = pick(peopleNames);
        if (chance(50)) {
          state.player.relationships.push({ id: `friend-${Date.now()}`, name, role: "Old friend back", bond: randomInt(48, 78), type: "friend" });
          applyEffects(`Coffee for 90 minutes. ${name}'s life changed completely. So did yours. Reconnected.`, { happiness: 12, karma: 6, smarts: 3 }, "good");
        } else {
          applyEffects(`You talked for 20 minutes. They were different. You were different. Polite ghost reset.`, { happiness: 2, smarts: 4 });
        }
      } },
      { label: "Keep running", run: () => applyEffects(`You waved. Kept moving. Thought about them for the next four miles.`, { discipline: 5, happiness: -3 }) }
    ]
  }),

  makeart: () => ({
    title: "Someone Wants to Buy It",
    text: () => `A friend brought somebody over. They looked at the thing ${state.player.name} made and pulled out their wallet.`,
    choices: [
      { label: "Sell it", run: () => {
        const amount = randomInt(180, 1800);
        applyEffects(`They paid ${money(amount)} on the spot. Said they'd hang it in their office. You felt real.`, { money: amount, fame: 4, happiness: 8, smarts: 3 }, "good");
      } },
      { label: "Give it as a gift", run: () => applyEffects(`You refused the money. They hung it anyway. Three friends saw it and reached out. The gift moved further than the sale would have.`, { karma: 12, fame: 6, happiness: 6 }, "good") },
      { label: "Pretend it's not done yet", run: () => applyEffects(`You said you were still working on it. You weren't.`, { happiness: -2, discipline: 2 }) }
    ]
  }),

  brand: opts => ({
    title: `${opts?.brand || "Store"} Hiring`,
    text: () => `Cashier at ${opts?.brand || "the store"} mentioned they're hiring. The sign in the back says full-time, benefits, $19/hr.`,
    choices: [
      { label: "Apply on the spot", run: () => applyForJob },
      { label: "Walk out with your bag", run: () => applyEffects(`You took your bag and the receipt. Maybe next year. Maybe never.`, { discipline: 2 }) }
    ]
  })
};

function maybeMicroScene(key, percent = 22, opts = {}) {
  if (!chance(percent)) return false;
  const factory = microScenes[key];
  if (!factory) return false;
  const scene = factory(opts);
  setTimeout(() => { try { showEvent(scene); } catch (e) {} }, 80);
  return true;
}

function exploreNeighborhood() {
  const player = state.player;
  const o = originOf(player.location);
  const person = pick(o.locals.concat(peopleNames));
  changeLocalRep(randomInt(2, 6));
  rememberInterest("city", 1);
  if (!player.relationships.some(item => item.name === person)) {
    player.relationships.push({ id: `local-${Date.now()}`, name: person, role: `${o.short} local`, bond: randomInt(22, 54), type: "friend" });
  }
  applyEffects(`You spent the day learning ${o.short}: ${o.hood}, the food spots, who talks too much, and who knows everybody.`, {
    happiness: 4,
    smarts: 2,
    streetRep: o.streetMod ? 1 : 0
  }, "good");
}

function localJobLead() {
  const player = state.player;
  const rep = localRep(player);
  if (rep < 8) {
    applyEffects("You need more local reputation before people start handing you real leads.", { discipline: 1 });
    return;
  }
  if (chance(44 + Math.floor(rep / 2) + Math.floor(player.stats.discipline / 5))) {
    const earned = randomInt(280, 2400) + rep * 18;
    changeLocalRep(2);
    applyEffects(`A local contact put you onto a paid lead worth ${money(earned)}.`, {
      money: earned,
      discipline: 3,
      businessReputation: 1
    }, "good");
  } else {
    applyEffects("The lead was dry, but showing up kept your name warm.", { happiness: -1, discipline: 2 });
  }
}

function citySpecificRun() {
  const player = state.player;
  const location = player.location;
  changeLocalRep(randomInt(2, 5));
  const cityMoves = {
    "Los Angeles, CA": () => {
      rememberInterest("content", 2);
      return applyEffects("You did an LA content day: coffee shop, traffic, golden-hour clip, fake networking that almost became real.", { fame: 3, followers: randomInt(40, 620), happiness: 4, money: -45 }, "good");
    },
    "Hollywood, Los Angeles": () => {
      rememberInterest("acting", 2);
      return applyEffects("You waited in a Hollywood casting line and left with two contacts, one fake promise, and better camera confidence.", { fame: 5, looks: 1, happiness: 2, discipline: 2 }, "good");
    },
    "Compton, CA": () => {
      rememberInterest("community", 2);
      return applyEffects("You pulled up to a Compton cookout and got reminded that reputation starts with who can vouch for you.", { happiness: 6, streetRep: 2, karma: 2 }, "good");
    },
    "New York City, NY": () => {
      rememberInterest("money", 1);
      const earned = randomInt(60, 900);
      return applyEffects(`You ran around NYC all day: subway delays, quick flips, random opportunity. Cleared ${money(earned)}.`, { money: earned, discipline: 3, happiness: -1 }, "good");
    },
    "Brooklyn, NY": () => {
      rememberInterest("art", 1);
      return applyEffects("You worked a Brooklyn pop-up market and somehow met three people with a brand, a camera, and a plan.", { money: randomInt(80, 760), fame: 2, businessReputation: 2 }, "good");
    },
    "The Bronx, NY": () => {
      rememberInterest("music", 2);
      return applyEffects("You jumped into a Bronx cypher. The crowd judged fast, then gave you respect.", { fame: 4, streetRep: 2, happiness: 4 }, "good");
    },
    "Chicago, IL": () => {
      rememberInterest("discipline", 1);
      return applyEffects("You did a Chicago winter grind day. Miserable weather, stronger backbone.", { discipline: 6, health: -1, smarts: 2 }, "good");
    },
    "South Side, Chicago": () => {
      rememberInterest("community", 2);
      return applyEffects("You helped at a South Side mentor run. People noticed you choosing useful over loud.", { karma: 6, streetRep: 1, happiness: 4, gangHeat: -1 }, "good");
    },
    "Atlanta, GA": () => {
      rememberInterest("music", 2);
      return applyEffects("You sat in on an Atlanta studio session. Hooks, business talk, and somebody's manager asking your handle.", { fame: 5, followers: randomInt(80, 900), happiness: 4 }, "good");
    },
    "Miami, FL": () => {
      rememberInterest("nightlife", 1);
      return applyEffects("You worked a Miami beach day into a night connect. Sun, tips, and expensive temptation.", { money: randomInt(120, 1100), looks: 2, happiness: 4, discipline: -2 }, "good");
    },
    "Houston, TX": () => {
      rememberInterest("cars", 2);
      return applyEffects("You pulled up to a Houston car meet. Clean rides, loud music, and side conversations about real money.", { happiness: 5, streetRep: 2, businessReputation: 1 }, "good");
    },
    "London, UK": () => {
      rememberInterest("social", 1);
      return applyEffects("You worked a London social night: pub shift, Tube ride, class-coded small talk, one useful contact.", { money: randomInt(90, 840), smarts: 3, happiness: 2 }, "good");
    },
    "Tokyo, Japan": () => {
      rememberInterest("gaming", 2);
      return applyEffects("You spent a Tokyo arcade night chasing rhythm-game glory and quietly learning how the city moves.", { happiness: 6, smarts: 2, discipline: 2, money: -60 }, "good");
    },
    "Mexico City, Mexico": () => {
      rememberInterest("food", 2);
      return applyEffects("You helped at a CDMX market day. Food, family, bargaining, and everybody knowing somebody.", { money: randomInt(45, 520), happiness: 6, karma: 3 }, "good");
    },
    "Skid Row, Los Angeles": () => {
      rememberInterest("community", 2);
      return applyEffects("You found the Skid Row resource line: outreach workers, neighbors watching out, and a little room to breathe.", { recovery: 1, health: 3, karma: 5, happiness: 2, gangHeat: -1 }, "good");
    }
  };
  return (cityMoves[location] || cityMoves["Los Angeles, CA"])();
}

function localFoodSpot() {
  const foodByCity = {
    "Los Angeles, CA": "taco truck",
    "Skid Row, Los Angeles": "mission kitchen",
    "Hollywood, Los Angeles": "late-night Thai spot",
    "Compton, CA": "backyard plate sale",
    "New York City, NY": "bodega counter",
    "Brooklyn, NY": "corner deli",
    "The Bronx, NY": "chopped cheese spot",
    "Chicago, IL": "Italian beef counter",
    "South Side, Chicago": "fish and chicken spot",
    "Atlanta, GA": "wing spot",
    "Miami, FL": "Cuban cafe",
    "Houston, TX": "barbecue truck",
    "London, UK": "chicken shop",
    "Tokyo, Japan": "ramen counter",
    "Mexico City, Mexico": "taco stand"
  };
  const spot = foodByCity[state.player.location] || "local food spot";
  changeLocalRep(2);
  rememberInterest("food", 1);
  applyEffects(`You became a regular at the ${spot}. Food helped, but being known helped more.`, {
    money: -randomInt(8, 70),
    happiness: 5,
    health: chance(55) ? 1 : -1
  }, "good");
}

function localScenePost() {
  const player = state.player;
  const o = originOf(player.location);
  if (!player.socialPage) {
    createSocialPage();
    return;
  }
  rememberInterest("content", 2);
  const gain = Math.round((randomInt(40, 900) + localRep(player) * randomInt(4, 18)) * (o.fameMod || 1));
  changeLocalRep(2);
  applyEffects(`You posted a ${o.short} scene clip. Locals argued in the comments and ${gain.toLocaleString()} people followed.`, {
    followers: gain,
    fame: 2,
    happiness: 3
  }, "good");
}

function findApartment() {
  const player = state.player;
  const o = originOf(player.location);
  const deposit = Math.min(player.money, randomInt(1500, 4800));
  if (player.money < deposit) {
    applyEffects(`Deposit and first month came out to ${money(deposit)}. Short.`, { happiness: -3 });
    return;
  }
  player.hasApartment = true;
  changeLocalRep(3);
  applyEffects(`You signed a lease in ${o.short}. Keys feel different than couches.`, { money: -deposit, happiness: 12, discipline: 4, looks: 1 }, "good");
}

function blockParty() {
  const player = state.player;
  const o = originOf(player.location);
  player.relationships.filter(r => r.type === "friend" || r.role.includes("local")).slice(0, 3).forEach(p => changeBond(p, randomInt(3, 7)));
  changeLocalRep(2);
  applyEffects(`${o.short} threw a block party. You knew half the names by the end.`, { happiness: 8, karma: 4, streetRep: 1 }, "good");
}

function localFestival() {
  const player = state.player;
  const o = originOf(player.location);
  const fests = {
    "Los Angeles, CA": "a Smorgasburg pop-up",
    "Hollywood, Los Angeles": "a film-fest premiere",
    "New York City, NY": "a Bushwick rooftop fest",
    "Brooklyn, NY": "the Afropunk weekend",
    "Atlanta, GA": "a A3C music fest",
    "Miami, FL": "an Art Basel side party",
    "Chicago, IL": "the Pitchfork stage",
    "Houston, TX": "a slab show",
    "London, UK": "a Notting Hill Carnival day",
    "Tokyo, Japan": "an anime fest",
    "Mexico City, Mexico": "Día de los Muertos parade",
    "Medellín, Colombia": "a paisa festival",
    "Rio de Janeiro, Brazil": "a Carnaval block",
    "Las Vegas, NV": "an EDC night",
    "Paris, France": "a Fête de la Musique block",
    "Dubai, UAE": "a downtown lights fest",
    "Seoul, South Korea": "a Hongdae street fest"
  };
  const fest = fests[player.location] || `a ${o.short} street fair`;
  const spent = randomInt(40, 220);
  applyEffects(`You spent the day at ${fest}.`, { money: -spent, happiness: 8, fame: 2, followers: chance(40) ? randomInt(40, 600) : 0 }, "good");
}

function languageClass() {
  const player = state.player;
  const o = originOf(player.location);
  const languages = {
    "Mexico City, Mexico": "Spanish",
    "Medellín, Colombia": "paisa Spanish",
    "Rio de Janeiro, Brazil": "Portuguese",
    "Tokyo, Japan": "Japanese",
    "Seoul, South Korea": "Korean",
    "Paris, France": "French",
    "Dubai, UAE": "Arabic",
    "London, UK": "British slang"
  };
  const lang = languages[player.location] || "the local language";
  player.languagesLearned = (player.languagesLearned || 0) + 1;
  applyEffects(`You actually showed up to ${lang} class. People treat you different when you try.`, { money: -240, smarts: 6, discipline: 4, karma: 3, happiness: 4 }, "good");
}

function getRobbed() {
  const player = state.player;
  if (chance(34 + Math.floor(player.stats.smarts / 6))) {
    applyEffects("Somebody tried to run up on you. You walked away with your phone and your dignity.", { smarts: 3, streetRep: 1, happiness: -3 }, "bad");
    return;
  }
  const lost = Math.min(player.money, randomInt(80, 800));
  applyEffects(`You got robbed for ${money(lost)}. They had something on them. You didn't.`, { money: -lost, health: -4, happiness: -10, streetRep: 1 }, "bad");
}

function barCrawl() {
  const player = state.player;
  player.risksTaken += 1;
  const spend = randomInt(80, 320);
  const outcome = randomInt(1, 100);
  if (outcome <= 60) {
    applyEffects(`You hit five spots and made it home in one piece. Spent ${money(spend)}.`, { money: -spend, happiness: 8, fame: 2, health: -2 }, "good");
  } else if (outcome <= 85) {
    applyEffects("You blacked out at spot three. Phone left in an Uber.", { money: -spend - 200, happiness: -4, health: -6, discipline: -3 }, "bad");
  } else {
    applyEffects("A fight broke out at the last spot. You got named in a police report.", { money: -spend, record: 1, health: -10, happiness: -8 }, "bad");
  }
}

function visaRun() {
  const player = state.player;
  const o = originOf(player.location);
  const cost = randomInt(180, 720);
  if (player.money < cost) {
    applyEffects(`A visa run costs at least ${money(cost)} for flights and stamps.`, { happiness: -2 });
    return;
  }
  player.lastVisaRun = player.age;
  applyEffects(`You crossed the border out of ${o.short} and back in. Stamp reset.`, { money: -cost, smarts: 3, discipline: 3, happiness: 3 }, "good");
}

function getLost() {
  const player = state.player;
  const find = pick(["a secret bookshop", "an underground jazz club", "a hole-in-the-wall taco spot", "an old vinyl record store", "a rooftop garden", "a community gym"]);
  applyEffects(`You walked without a map and found ${find}. Locals nodded like you'd been there before.`, { happiness: 6, smarts: 3, karma: 2 }, "good");
}

function cityCleanup() {
  const player = state.player;
  changeLocalRep(3);
  applyEffects("You spent a Saturday cleaning up your block. People remember the ones who show up.", { karma: 8, happiness: 5, discipline: 3, fame: 1 }, "good");
}

function transitPass() {
  const player = state.player;
  const cost = randomInt(85, 140);
  if (player.money < cost) { applyEffects(`A monthly pass runs ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects(`Monthly pass loaded. You can disappear into a city all day for ${money(cost)}.`, { money: -cost, smarts: 3, discipline: 2, happiness: 3 }, "good");
}

function findABarber() {
  const player = state.player;
  player.hasBarber = true;
  const barber = pick(["Mike", "Hector", "Junior", "Big Curt", "Davey"]);
  player.relationships.push({ id: `barber-${Date.now()}`, name: barber, role: "Barber", bond: randomInt(54, 76), type: "friend" });
  applyEffects(`${barber} cuts you weekly now. Knows your name and your kids' names.`, { money: -45, looks: 4, happiness: 6, streetRep: 2 }, "good");
}

function findTherapist() {
  const player = state.player;
  if (chance(58 + Math.floor(player.stats.smarts / 6))) {
    applyEffects("Found one on the third try. Real fit. Real reps.", { money: -240, happiness: 8, smarts: 3, discipline: 3 }, "good");
  } else {
    applyEffects("First two were a bad match. You'll find one later.", { money: -240, smarts: 3, happiness: -2 }, "bad");
  }
}

function findCoffeeSpot() {
  applyEffects("A real cafe knows your order. The barista asks how your week is.", { money: -20, happiness: 6, discipline: 2 }, "good");
}

function attendWedding() {
  const player = state.player;
  const cost = randomInt(100, 380);
  applyEffects(`You went to a wedding. Open bar, ${money(cost)} gift, real dance floor.`, { money: -cost, happiness: 12, karma: 3, looks: 1 }, "good");
}

function attendFuneral() {
  applyEffects("Black suit, real grief. You sat through the eulogy and meant it.", { money: -40, happiness: -8, karma: 5, smarts: 4, discipline: 3 }, "bad");
}

function attendProtest() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(72)) {
    applyEffects("You marched all afternoon. Met three real organizers.", { happiness: 7, karma: 8, politicalCapital: 3, smarts: 3 }, "good");
  } else {
    applyEffects("Cops kettled the march. You got pepper sprayed.", { health: -4, happiness: -4, karma: 4, record: chance(15) ? 1 : 0, politicalCapital: 4 }, "bad");
  }
}

function voterReg() {
  applyEffects("Signed up 40 people in three hours. Real work.", { happiness: 6, karma: 8, politicalCapital: 5, discipline: 3 }, "good");
}

function neighborhoodWatch() {
  applyEffects("You patrolled with the watch crew. Block stayed quiet.", { karma: 5, streetRep: 2, discipline: 3, happiness: 4 }, "good");
}

function gentrificationPushback() {
  const player = state.player;
  if (chance(48)) {
    applyEffects("The zoning vote went your way. The block stays the block for now.", { karma: 10, politicalCapital: 8, happiness: 8 }, "good");
  } else {
    applyEffects("Developers won. The bodega closed in March. Your rep grew.", { karma: 8, politicalCapital: 6, happiness: -6 }, "bad");
  }
}

function findMechanic() {
  const player = state.player;
  player.hasMechanic = true;
  applyEffects("Real mechanic. Honest quotes. You'll save thousands over a decade.", { money: -120, smarts: 4, discipline: 3, happiness: 5 }, "good");
}

function findTailor() {
  applyEffects("Real tailor. Your fits hit different now.", { money: -180, looks: 6, smarts: 2, happiness: 5 }, "good");
}

function catchSunset() {
  applyEffects("Best vantage in the city. You sat through the whole thing.", { happiness: 8, karma: 2 }, "good");
}

function subwayAdventure() {
  applyEffects("You rode the train to the last stop. Walked back through neighborhoods you'd never seen.", { money: -8, smarts: 5, happiness: 7, discipline: 2 }, "good");
}

function lateNightDiner() {
  applyEffects("3 AM waffles under fluorescent lights. The waitress called you sweetie.", { money: -25, happiness: 7, health: -1 }, "good");
}

function skateThePlaza() {
  applyEffects("You skated the marble plaza until security came. Ledge sessions are addictive.", { health: 2, happiness: 7, streetRep: 1, fame: 1 }, "good");
}

function openMicNight() {
  const player = state.player;
  if (chance(48 + Math.floor(player.stats.happiness / 6))) {
    applyEffects("Five minutes of new material. Two laughs you didn't expect.", { fame: 4, happiness: 8, discipline: 3 }, "good");
  } else {
    applyEffects("Bombed in front of twelve people. You'll be back next Tuesday.", { fame: 1, discipline: 5, happiness: -5 }, "bad");
  }
}

function councilMeeting() {
  applyEffects("Three hours of public comment. You waited and said your piece.", { politicalCapital: 4, karma: 3, smarts: 3, discipline: 2 }, "good");
}

function foundWallet() {
  const player = state.player;
  const cash = randomInt(80, 480);
  if (chance(74)) {
    applyEffects(`Found a wallet with ${money(cash)} cash. You returned it. They mailed you a thank-you and a $50.`, { money: 50, karma: 12, happiness: 9 }, "good");
  } else {
    applyEffects(`Found a wallet with ${money(cash)}. You kept it. Felt off for a week.`, { money: cash, karma: -8, happiness: -3 }, "bad");
  }
}

function moveToSkidRow() {
  const player = state.player;
  if (player.location === "Skid Row, Los Angeles") {
    applyEffects("You are already posted in Skid Row.", {});
    return;
  }
  const cost = Math.min(player.money, randomInt(80, 420));
  player.money -= cost;
  player.location = "Skid Row, Los Angeles";
  player.home = player.location;
  const newFriend = pick(peopleNames.filter(name => !player.relationships.some(person => person.name === name)));
  player.relationships.push({ id: `skidrow-${Date.now()}`, name: newFriend, role: "Skid Row neighbor", bond: randomInt(22, 58), type: "friend" });
  applyEffects(`You moved to Skid Row and met ${newFriend}. Rent got cheaper, life got sharper.`, {
    happiness: -4,
    discipline: 2,
    streetRep: 8
  }, "bad");
}

function couchSurf() {
  const player = state.player;
  const person = relationshipTarget();
  if (chance(person.bond)) {
    changeBond(person, -6);
    applyEffects(`${person.name} let you crash for a while. You saved cash, but the bond took pressure.`, {
      money: randomInt(120, 700),
      happiness: -2,
      streetRep: 1
    }, "good");
  } else {
    changeBond(person, -12);
    applyEffects(`${person.name} said no, and that one stung.`, {
      happiness: -6,
      streetRep: 1
    }, "bad");
  }
}

function buskSidewalk() {
  const earned = randomInt(18, 240) + Math.floor((state.player.stats.looks + state.player.fame + state.player.streetRep) * 1.7);
  applyEffects(`You performed on the sidewalk and made ${money(earned)}.`, {
    money: earned,
    fame: 1,
    happiness: 2,
    streetRep: 2
  }, "good");
}

function streetHustle() {
  const player = state.player;
  player.risksTaken += 1;
  rememberInterest("street", 2);
  const odds = 28 + Math.floor(player.stats.smarts / 5) + Math.floor(player.streetRep / 3) - player.record * 5;
  if (chance(odds)) {
    const earned = randomInt(240, 2600) + player.streetRep * 18;
    applyEffects(`You ran a shady street hustle and walked away with ${money(earned)}.`, {
      money: earned,
      streetRep: 4,
      karma: -6,
      happiness: 2
    }, "good");
  } else {
    applyEffects("The hustle collapsed into heat, fines, and bad looks.", {
      money: -randomInt(180, 1400),
      record: 1,
      happiness: -8,
      streetRep: 1,
      karma: -8
    }, "bad");
  }
}

function goOnBender() {
  const player = state.player;
  player.risksTaken += 1;
  const bill = randomInt(60, 900);
  if (chance(24 + Math.floor(player.streetRep / 5))) {
    applyEffects(`The bender turned into a wild story, but it still cost ${money(bill)}.`, {
      money: -bill,
      happiness: 4,
      health: -9,
      discipline: -8,
      streetRep: 3
    }, "bad");
  } else {
    applyEffects(`The bender got ugly. You woke up poorer, foggier, and behind on life.`, {
      money: -bill,
      debt: randomInt(0, 350),
      health: -16,
      happiness: -10,
      discipline: -10,
      streetRep: 2
    }, "bad");
  }
}

function recoveryMeeting() {
  applyEffects("You went to a recovery meeting and let somebody talk you through the spiral.", {
    recovery: 1,
    health: 6,
    happiness: 5,
    discipline: 5,
    streetRep: -1
  }, "good");
}

function startSmoking() {
  rememberInterest("vices", 1);
  applyEffects("You picked up smoking. It cooled the nerves for a minute, but your health took the first hit.", {
    smokingLevel: 1,
    health: -4,
    happiness: 3,
    discipline: -2
  }, "bad");
}

function smokeBreak() {
  const player = state.player;
  const cost = randomInt(8, 28) * Math.max(1, player.smokingLevel);
  applyEffects(`You took a smoke break and spent ${money(cost)} feeding the habit.`, {
    money: -cost,
    health: -3 - player.smokingLevel,
    happiness: 4,
    discipline: -2,
    smokingLevel: chance(28) ? 1 : 0
  }, "bad");
}

function cigarLounge() {
  const cost = randomInt(90, 420);
  if (state.player.money < cost) {
    applyEffects(`You need ${money(cost - state.player.money)} more for the cigar lounge night.`, { happiness: -1 });
    return;
  }
  applyEffects("You worked the cigar lounge like a networking room. Useful contacts, terrible lungs.", {
    money: -cost,
    health: -4,
    fame: 2,
    businessReputation: 3,
    smokingLevel: 1
  }, "bad");
}

function quitSmoking() {
  const player = state.player;
  player.quitAttempts += 1;
  const odds = 24 + Math.floor(player.stats.discipline / 2) + player.recovery * 7 - player.smokingLevel * 11;
  if (chance(odds)) {
    player.smokingLevel = 0;
    applyEffects("You quit smoking. The cravings were loud, but your body started forgiving you.", {
      health: 9,
      discipline: 5,
      happiness: -2
    }, "good");
  } else {
    player.smokingLevel = clamp(player.smokingLevel + 1, 0, 5);
    applyEffects("You tried to quit and folded under stress. The habit got a little louder.", {
      health: -4,
      happiness: -5,
      discipline: 2
    }, "bad");
  }
}

function nicotineGum() {
  const cost = 48;
  if (state.player.money < cost) {
    applyEffects(`You need ${money(cost - state.player.money)} more for nicotine gum.`, { happiness: -1 });
    return;
  }
  state.player.smokingLevel = Math.max(0, state.player.smokingLevel - 1);
  applyEffects("Nicotine gum helped you step the habit down without melting down.", {
    money: -cost,
    health: 3,
    discipline: 3,
    happiness: -1
  }, "good");
}

function smokeWeed() {
  applyEffects("You hit the joint. Time bent. Your mood softened.", { money: -25, happiness: 7, smarts: 1, discipline: -2, health: -1 }, "good");
}

function eatEdible() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(78)) {
    applyEffects("The edible hit perfect. You laughed at a ceiling fan for ten minutes.", { money: -20, happiness: 9, health: -1 }, "good");
  } else {
    applyEffects("You ate too much. Couch-locked in a bad spiral for six hours.", { money: -20, happiness: -8, health: -3, discipline: -2 }, "bad");
  }
}

function drinkBeer() {
  applyEffects("A few beers with the crew. Good vibes, mid hangover.", { money: -38, happiness: 6, discipline: -1, health: -2 }, "good");
}

function liquorNight() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("You drank steady, didn't fight anybody, made it to your bed.", { money: -90, happiness: 8, health: -3, discipline: -2 }, "good");
  } else {
    applyEffects("You blacked out. Phone broken. Friend who put up with you isn't returning texts.", { money: -180, happiness: -8, health: -7, discipline: -4 }, "bad");
  }
}

function tryCoke() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(56)) {
    applyEffects("First line hit. You were the loudest, sharpest person in the room.", { money: -150, happiness: 10, fame: 1, health: -4, discipline: -4, karma: -2 }, "good");
  } else {
    applyEffects("Bad batch. Heart racing. You spent two hours convinced you were dying.", { money: -150, health: -10, happiness: -8, discipline: 2 }, "bad");
  }
}

function tryMolly() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(64)) {
    applyEffects("Molly hit in waves. You hugged strangers and meant it. The comedown came on Tuesday.", { money: -80, happiness: 14, health: -4, discipline: -3, karma: 1 }, "good");
  } else {
    applyEffects("Bad press. Bruxism, dehydration, the floor wouldn't stop moving.", { money: -80, health: -10, happiness: -10, discipline: 2 }, "bad");
  }
}

function tryShrooms() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(74)) {
    applyEffects("Shrooms slowed time. You found peace with three things you'd been avoiding.", { money: -45, happiness: 14, smarts: 5, karma: 4, health: -1 }, "good");
  } else {
    applyEffects("Bad trip. You spent four hours convinced your couch hated you.", { money: -45, happiness: -10, smarts: 3, discipline: 2 }, "bad");
  }
}

function tryAcid() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(60)) {
    applyEffects("Acid pulled the curtain back. You cried, laughed, made art at 5 AM.", { money: -30, happiness: 16, smarts: 8, karma: 3 }, "good");
  } else {
    applyEffects("The trip went somewhere dark. Friends had to walk you down.", { money: -30, happiness: -14, smarts: 3, discipline: 2, health: -2 }, "bad");
  }
}

function tryLean() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(58)) {
    applyEffects("Lean had you slowed down. Talked slow, walked slow, slept like the dead.", { money: -180, happiness: 8, discipline: -4, health: -5 }, "good");
  } else {
    applyEffects("You nodded out on a couch and stopped breathing for a second. Friend slapped you awake.", { money: -180, health: -14, happiness: -6, discipline: 2 }, "bad");
  }
}

function tryXans() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(62)) {
    applyEffects("A bar quieted the noise. You slept twelve hours straight.", { money: -20, happiness: 7, discipline: -3, health: -3 }, "good");
  } else {
    applyEffects("You don't remember what you said or who you texted. Three friends are mad.", { money: -20, happiness: -12, health: -4, discipline: -4 }, "bad");
  }
}

function tryPerc() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(58)) {
    applyEffects("Half a perc and you felt warm and untouchable. The hook is in.", { money: -25, happiness: 9, health: -5, discipline: -4 }, "good");
  } else {
    applyEffects("Itched the skin off your arms. Couldn't sleep for two days.", { money: -25, health: -8, happiness: -8, discipline: 2 }, "bad");
  }
}

function tryMeth() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(34)) {
    applyEffects("Three days awake. Reorganized your entire room. Came down hard.", { money: -120, happiness: 4, health: -22, discipline: -8, looks: -6 }, "bad");
  } else {
    applyEffects("Heart palpitations, panic attack, hospital visit.", { money: -120, health: -28, happiness: -16, discipline: 2 }, "bad");
  }
}

function tryHeroin() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  if (chance(40)) {
    applyEffects("First shot. The world stopped hurting. The hook is now permanent.", { money: -90, happiness: 18, health: -15, discipline: -8, karma: -6 }, "bad");
  } else {
    applyEffects("Bad cut. Threw up for hours. Lucky you didn't die in the bathroom.", { money: -90, health: -28, happiness: -18, discipline: 4 }, "bad");
  }
}

function overdoseScare() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(64)) {
    applyEffects("Someone hit you with Narcan in time. You came back coughing on a kitchen floor.", { health: -22, happiness: -16, discipline: 8, recovery: 2 }, "bad");
    addCanonEvent(`${player.name} survived an overdose at ${player.age}.`, "bad");
  } else {
    applyEffects("They couldn't bring you back. The room emptied.", { health: -55, happiness: -50 }, "bad");
    player.alive = false;
    addCanonEvent(`${player.name} died of an overdose at ${player.age}.`, "bad");
  }
}

function detoxClinic() {
  const player = state.player;
  const cost = 800;
  if (player.money < cost) { applyEffects(`Outpatient detox runs ${money(cost)}.`, { happiness: -2 }); return; }
  player.smokingLevel = Math.max(0, player.smokingLevel - 2);
  player.usedHard = false;
  applyEffects("You went through detox. Hard week. Cleaner on the other side.", { money: -cost, health: 8, discipline: 6, recovery: 4, happiness: 6 }, "good");
}

function rehabStay() {
  const player = state.player;
  const cost = 4000;
  if (player.money < cost) { applyEffects(`A 30-day program runs about ${money(cost)}.`, { happiness: -2 }); return; }
  player.smokingLevel = 0;
  player.usedHard = false;
  applyEffects("You completed thirty days inpatient. Real reset. Sponsor's number in your wallet.", { money: -cost, health: 14, discipline: 12, recovery: 8, happiness: 14, karma: 4 }, "good");
  addCanonEvent(`${player.name} got clean at ${player.age}.`, "good");
}

function bottleService() {
  const player = state.player;
  player.risksTaken += 1;
  const cost = randomInt(1200, 3800);
  if (player.money < cost) { applyEffects(`Bottle service runs ${money(cost)} minimum.`, { happiness: -2 }); return; }
  applyEffects(`Sparklers came out for your table. Spent ${money(cost)} to feel like somebody.`, { money: -cost, happiness: 12, fame: 4, looks: 2, discipline: -3, karma: -1 }, "good");
}

function afterHoursSpot() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("The 4 AM spot opened the door for you. DJ went till 9.", { money: -200, happiness: 10, fame: 2, health: -3, discipline: -3 }, "good");
  } else {
    applyEffects("Vice raid mid-set. Everyone scattered. You ran the alley.", { money: -200, record: chance(20) ? 1 : 0, happiness: -4 }, "bad");
  }
}

function stripClubTrip() {
  const player = state.player;
  player.risksTaken += 1;
  const spent = randomInt(200, 1200);
  if (player.money < spent) { applyEffects(`The club takes ${money(spent)} minimum to make it worth being there.`, { happiness: -2 }); return; }
  applyEffects(`You spent ${money(spent)} on overpriced drinks and tens. Walked out cold sober and broker.`, { money: -spent, happiness: 6, looks: 1, karma: -1, discipline: -2 }, "good");
}

function payForStripper() {
  const player = state.player;
  player.risksTaken += 1;
  const cost = randomInt(400, 1600);
  if (player.money < cost) { applyEffects(`A real private runs ${money(cost)}.`, { happiness: -2 }); return; }
  const dancer = pick(["Sasha", "Diamond", "Lexus", "Honey", "Storm", "Nova"]);
  if (chance(72)) {
    applyEffects(`${dancer} ran the VIP for an hour. You're broke but you're happy.`, { money: -cost, happiness: 11, looks: 1, karma: -2 }, "good");
  } else {
    applyEffects(`${dancer} smelled like she'd been at it twelve hours. Real one made you regret it.`, { money: -cost, happiness: -4, health: -2, smarts: 3 }, "bad");
  }
}

function hireEscort() {
  const player = state.player;
  player.risksTaken += 1;
  const cost = randomInt(600, 2800);
  if (player.money < cost) { applyEffects(`A booking through the site runs ${money(cost)}.`, { happiness: -2 }); return; }
  if (chance(74)) {
    applyEffects(`Hotel room, room service, two-hour booking. She left on schedule.`, { money: -cost, happiness: 12, looks: 1, karma: -3 }, "good");
  } else {
    applyEffects("Booking turned out to be a setup. They took the cash and the watch.", { money: -cost - 800, happiness: -10, smarts: 3 }, "bad");
  }
}

function cokeOffBody() {
  const player = state.player;
  player.risksTaken += 1;
  player.usedHard = true;
  applyEffects(`A line off skin. The story everyone tells but nobody admits to.`, { money: -180, happiness: 10, fame: 2, health: -4, discipline: -4, karma: -3 }, "good");
}

function orgyNight() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("Five-person room. Real, consensual, chaotic. Nobody mentions it Monday.", { happiness: 14, looks: 1, fame: 1, karma: -1 }, "good");
  } else {
    applyEffects("The vibe was off the whole time. Everyone left early.", { happiness: -8, smarts: 4 }, "bad");
  }
}

function swingersParty() {
  const player = state.player;
  player.risksTaken += 1;
  const spouse = player.relationships.find(r => r.type === "spouse");
  if (!spouse) { applyEffects("You need a spouse to even get in the door.", { happiness: -1 }); return; }
  if (chance(54)) {
    changeBond(spouse, 5);
    applyEffects(`You and ${spouse.name} agreed on rules. The night actually brought you closer.`, { happiness: 10, karma: -1 }, "good");
  } else {
    changeBond(spouse, -22);
    applyEffects(`The night broke something between you and ${spouse.name}. Therapy starts next week.`, { happiness: -16, karma: -2 }, "bad");
  }
}

function sexTape() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(38)) {
    applyEffects("Stayed private. Both of you trust each other more for some reason.", { happiness: 8, karma: -1 }, "good");
  } else {
    const leaked = randomInt(20000, 600000);
    applyEffects(`Tape leaked. ${leaked.toLocaleString()} views overnight. Career and relationships in flames.`, { fame: 22, followers: leaked, happiness: -20, businessReputation: -10, karma: -4 }, "bad");
  }
}

function deepthroatStory() {
  applyEffects("The story you can't tell sober but the boys won't let you forget.", { happiness: 6, fame: 1, looks: 1, karma: -1 }, "good");
}

function blackoutDrunk() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(48)) {
    applyEffects("Lost three hours. Friend says you sang opera in the Uber. Phone died at the function.", { money: -randomInt(80, 320), happiness: 4, health: -4, discipline: -3, fame: 2 }, "good");
  } else {
    applyEffects("Blacked out on a couch. Vomited on somebody's mom. The group chat hasn't moved on.", { money: -randomInt(80, 320), happiness: -10, health: -8, fame: 4, looks: -2 }, "bad");
  }
}

function wakeUpWrongHouse() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(54)) {
    applyEffects(`Woke up in ${pick(["a hostel bed", "a girl's apartment", "your friend's couch", "a hotel you don't remember booking", "the back of a Lyft"])}. Walked home in last night's clothes.`, { happiness: 4, fame: 2, looks: -1, discipline: -2 }, "good");
  } else {
    applyEffects("Eyes opened in a place that scared you. You left fast and never asked who's house.", { happiness: -8, health: -3, smarts: 5, discipline: 3 }, "bad");
  }
}

function onlyfansSub() {
  applyEffects(`Subbed to three creators. The algorithm has you read.`, { money: -60, happiness: 4, looks: 0, discipline: -1, karma: -1 }, "good");
}

function pornHabit() {
  const player = state.player;
  if (chance(58)) {
    applyEffects("The habit took root. Discipline gone, baseline lower.", { happiness: -4, discipline: -6, looks: -1 }, "bad");
  } else {
    applyEffects("Cut it for thirty days. Discipline rebounded, energy returned.", { happiness: 8, discipline: 8, looks: 3 }, "good");
  }
}

function newCompanyName() {
  return `${pick(companyPrefixes)} ${pick(companySuffixes)}`;
}

function spendCompanyCash(cost) {
  const company = state.player.company;
  if (!company) return false;
  if (company.runway >= cost) {
    company.runway -= cost;
    return true;
  }
  const shortfall = cost - company.runway;
  company.runway = 0;
  if (state.player.money >= shortfall) {
    state.player.money -= shortfall;
  } else {
    state.player.debt += shortfall - state.player.money;
    state.player.money = 0;
  }
  return true;
}

function startCompany() {
  const player = state.player;
  if (player.company) {
    applyEffects(`You are already building ${player.company.name}.`, {});
    return;
  }
  const cost = 1200;
  if (player.money >= cost) player.money -= cost;
  else {
    player.debt += cost - player.money;
    player.money = 0;
  }
  const name = newCompanyName();
  rememberInterest("business", 4);
  player.company = {
    name,
    sector: pick(companySectors),
    product: pick(companyProducts),
    stage: 1,
    employees: 1,
    valuation: randomInt(12000, 46000),
    runway: randomInt(1800, 7200),
    morale: randomInt(52, 76),
    equity: 100,
    launches: 0,
    scandals: 0
  };
  player.jobId = "ceo";
  player.salaryBonus = 0;
  applyEffects(`You founded ${name}, a ${player.company.sector} company, and made yourself CEO.`, {
    businessReputation: 5,
    discipline: 4,
    happiness: 6
  }, "good");
}

function becomeCEO() {
  if (!state.player.company) {
    startCompany();
    return;
  }
  state.player.jobId = "ceo";
  state.player.salaryBonus = 0;
  applyEffects(`You stepped fully into the CEO seat at ${state.player.company.name}.`, {
    businessReputation: 3,
    discipline: 3,
    happiness: 4
  }, "good");
}

function launchProduct() {
  const company = state.player.company;
  const cost = 2400 + company.stage * randomInt(1200, 4200);
  spendCompanyCash(cost);
  company.launches += 1;
  const odds = 32 + Math.floor(state.player.stats.smarts / 4) + Math.floor(state.player.businessReputation / 2) + Math.floor(company.morale / 6);
  if (chance(odds)) {
    const lift = randomInt(12000, 90000) * company.stage;
    company.valuation += lift;
    company.runway += randomInt(3000, 24000) * company.stage;
    company.morale = clamp(company.morale + randomInt(4, 12));
    applyEffects(`${company.name} launched a ${company.product}. Customers actually cared. Valuation jumped by ${money(lift)}.`, {
      businessReputation: 7,
      fame: 3,
      happiness: 7
    }, "good");
  } else {
    company.valuation = Math.max(1000, Math.floor(company.valuation * randomInt(82, 95) / 100));
    company.morale = clamp(company.morale - randomInt(7, 16));
    applyEffects(`${company.name}'s launch was buggy, expensive, and public. The team learned, painfully.`, {
      businessReputation: -2,
      happiness: -7,
      smarts: 3
    }, "bad");
  }
}

function pivotCompany() {
  const company = state.player.company;
  const oldProduct = company.product;
  company.product = pick(companyProducts.filter(product => product !== oldProduct));
  company.sector = pick(companySectors);
  company.morale = clamp(company.morale + randomInt(-10, 8));
  company.valuation = Math.max(1000, Math.floor(company.valuation * randomInt(88, 112) / 100));
  applyEffects(`${company.name} pivoted from ${oldProduct} into a ${company.product}. Nobody knows if this is genius yet.`, {
    smarts: 4,
    discipline: 2,
    businessReputation: chance(50) ? 3 : -1
  }, "good");
}

function hireTeam() {
  const company = state.player.company;
  const hires = randomInt(2, 9);
  const cost = hires * randomInt(1800, 5200);
  spendCompanyCash(cost);
  company.employees += hires;
  company.morale = clamp(company.morale + randomInt(-3, 9));
  company.valuation += hires * randomInt(2000, 9000);
  applyEffects(`You hired ${hires} people at ${company.name}. The company suddenly felt real.`, {
    businessReputation: 4,
    discipline: 2,
    happiness: 3
  }, "good");
}

function raiseRound() {
  const company = state.player.company;
  const odds = 28 + Math.floor(state.player.stats.smarts / 4) + Math.floor(state.player.businessReputation / 2) + company.launches * 5 + company.stage * 4;
  if (chance(odds)) {
    const cash = randomInt(18000, 85000) * company.stage;
    const dilution = randomInt(6, 18);
    company.runway += cash;
    company.equity = Math.max(12, company.equity - dilution);
    company.valuation += cash * randomInt(2, 5);
    company.stage = Math.min(4, company.stage + 1);
    applyEffects(`Investors wired ${money(cash)} into ${company.name}. You gave up ${dilution}% equity and leveled up to ${companyStageName(company.stage)} stage.`, {
      businessReputation: 8,
      fame: 3,
      happiness: 6
    }, "good");
  } else {
    company.morale = clamp(company.morale - randomInt(5, 13));
    applyEffects("The fundraising round got cold. The boardroom smile stayed on, but everybody felt it.", {
      happiness: -6,
      discipline: 2,
      businessReputation: -1
    }, "bad");
  }
}

function boardMeeting() {
  const company = state.player.company;
  const choices = [
    "cut waste and protect runway",
    "raise prices before customers notice",
    "ship faster with uglier edges",
    "rebrand the whole company",
    "pay the team better and bet on morale"
  ];
  const decision = pick(choices);
  if (decision.includes("runway")) company.runway += randomInt(1800, 11000) * company.stage;
  if (decision.includes("prices")) company.valuation += randomInt(5000, 42000) * company.stage;
  if (decision.includes("faster")) company.launches += 1;
  if (decision.includes("rebrand")) state.player.fame = clamp(state.player.fame + randomInt(1, 5));
  if (decision.includes("morale")) company.morale = clamp(company.morale + randomInt(8, 18));
  applyEffects(`Board meeting decision: ${decision}. ${company.name} left the room with a sharper plan.`, {
    businessReputation: 3,
    discipline: 4,
    happiness: -1
  }, "good");
}

function acquireRival() {
  const company = state.player.company;
  const cost = randomInt(22000, 140000) * Math.max(1, company.stage - 1);
  spendCompanyCash(cost);
  if (chance(36 + Math.floor(state.player.businessReputation / 2) + company.stage * 7)) {
    const addedEmployees = randomInt(5, 28);
    company.employees += addedEmployees;
    company.valuation += cost * randomInt(2, 5);
    company.morale = clamp(company.morale + randomInt(-5, 8));
    applyEffects(`${company.name} acquired a rival and absorbed ${addedEmployees} employees. Ruthless, but it worked.`, {
      businessReputation: 9,
      fame: 4,
      happiness: 5
    }, "good");
  } else {
    company.valuation = Math.max(1000, Math.floor(company.valuation * 0.78));
    company.morale = clamp(company.morale - randomInt(10, 22));
    applyEffects("The acquisition turned into legal bills, culture drama, and confused customers.", {
      businessReputation: -5,
      happiness: -9,
      record: chance(18) ? 1 : 0
    }, "bad");
  }
}

function goPublic() {
  const company = state.player.company;
  const odds = 26 + company.stage * 9 + Math.floor(state.player.businessReputation / 2) + Math.floor(company.morale / 8);
  if (chance(odds)) {
    company.stage = 5;
    const pop = randomInt(180000, 900000);
    company.valuation += pop;
    const payout = Math.floor(pop * company.equity / 100 * 0.08);
    state.player.money += payout;
    applyEffects(`${company.name} went public. Your equity pop paid ${money(payout)} and made you a real CEO story.`, {
      businessReputation: 15,
      fame: 12,
      happiness: 12
    }, "good");
  } else {
    company.scandals += 1;
    company.valuation = Math.max(1000, Math.floor(company.valuation * 0.7));
    applyEffects("The IPO window slammed shut after ugly questions from analysts.", {
      businessReputation: -8,
      fame: -4,
      happiness: -12
    }, "bad");
  }
}

function sellCompany() {
  const player = state.player;
  const company = player.company;
  const payout = Math.floor(company.valuation * company.equity / 100 * randomInt(55, 92) / 100);
  player.money += payout;
  player.company = null;
  player.companyExits += 1;
  if (player.jobId === "ceo") player.jobId = "none";
  applyEffects(`You sold ${company.name} and personally cleared ${money(payout)}. Exit unlocked.`, {
    businessReputation: 12,
    fame: 8,
    happiness: 10
  }, "good");
}

function perform() {
  if (chance(42 + Math.floor(state.player.stats.discipline / 4))) {
    applyEffects("The performance landed. People remembered your name.", { fame: 8, happiness: 7 }, "good");
  } else {
    applyEffects("The performance was rough, but you learned from it.", { happiness: -5, discipline: 3 }, "bad");
  }
}

function invest() {
  const stake = Math.min(state.player.money, Math.max(250, Math.floor(state.player.money * 0.22)));
  if (chance(48 + Math.floor(state.player.stats.smarts / 8))) {
    const gain = Math.floor(stake * randomInt(18, 72) / 100);
    applyEffects(`Your investment gained ${money(gain)}.`, { money: gain, smarts: 2, happiness: 2 }, "good");
  } else {
    const loss = Math.floor(stake * randomInt(20, 80) / 100);
    applyEffects(`Your investment lost ${money(loss)}.`, { money: -loss, happiness: -5 }, "bad");
  }
}

function lottery() {
  state.player.money -= 20;
  if (chance(2)) {
    const prize = randomInt(30000, 250000);
    applyEffects(`You won the lottery for ${money(prize)}.`, { money: prize, happiness: 18, fame: 10 }, "good");
  } else {
    applyEffects("The lottery ticket was worthless.", { happiness: -1 });
  }
}

function dayTrade() {
  const player = state.player;
  player.risksTaken += 1;
  const stake = Math.min(player.money, Math.max(500, Math.floor(player.money * 0.35)));
  const skill = Math.floor(player.stats.smarts / 5) + Math.floor(player.stats.discipline / 7);
  const winOdds = 42 + skill - 4;
  if (chance(winOdds)) {
    const gain = Math.floor(stake * randomInt(35, 140) / 100);
    applyEffects(`You day-traded into ${money(gain)} of green.`, { money: gain, smarts: 2, happiness: 5 }, "good");
  } else {
    const loss = Math.floor(stake * randomInt(40, 95) / 100);
    applyEffects(`The chart faked you out. ${money(loss)} gone.`, { money: -loss, happiness: -8, discipline: 2 }, "bad");
  }
}

function buyCrypto() {
  const player = state.player;
  player.risksTaken += 1;
  const stake = Math.min(player.money, Math.max(100, Math.floor(player.money * 0.25)));
  const coin = pick(["a memecoin a kid posted", "the new L1 everyone is shilling", "a recycled rug pull", "a stablecoin that depegged last year"]);
  const roll = randomInt(1, 100);
  if (roll <= 6) {
    const moonshot = stake * randomInt(8, 35);
    applyEffects(`${coin} 25x'd. You walked with ${money(moonshot)}.`, { money: moonshot, fame: 4, happiness: 12 }, "good");
  } else if (roll <= 40) {
    const gain = Math.floor(stake * randomInt(20, 130) / 100);
    applyEffects(`${coin} pumped. You took ${money(gain)}.`, { money: gain, happiness: 4 }, "good");
  } else if (roll <= 70) {
    const loss = Math.floor(stake * randomInt(30, 60) / 100);
    applyEffects(`${coin} chopped you out. ${money(loss)} gone.`, { money: -loss, happiness: -3 }, "bad");
  } else {
    applyEffects(`${coin} got rugged. Your bag is worthless.`, { money: -stake, happiness: -10, karma: -1 }, "bad");
  }
}

function openSavings() {
  const player = state.player;
  const deposit = Math.min(player.money, Math.max(200, Math.floor(player.money * 0.18)));
  player.savings = (player.savings || 0) + Math.floor(deposit * 1.04);
  applyEffects(`You parked ${money(deposit)} in savings and let it sit. Boring is winning.`, { money: -deposit, discipline: 4, happiness: 1 }, "good");
}

function bankLoan() {
  const player = state.player;
  const limit = Math.max(3000, Math.floor((player.stats.smarts + player.stats.discipline) * 80) - player.record * 1500);
  if (limit <= 0) {
    applyEffects("The bank ran your record and laughed you out.", { happiness: -4, discipline: 1 }, "bad");
    return;
  }
  const taken = randomInt(Math.floor(limit * 0.5), limit);
  const interest = Math.floor(taken * 0.18);
  player.debt += taken + interest;
  applyEffects(`Bank cleared a ${money(taken)} loan. You owe ${money(taken + interest)} back.`, { money: taken, discipline: -1 }, "good");
}

function payTaxes() {
  const player = state.player;
  const bracket = player.money >= 50000 ? 0.24 : player.money >= 10000 ? 0.18 : 0.12;
  const bill = Math.max(200, Math.floor(player.money * bracket * 0.6));
  if (player.money < bill) {
    player.debt += Math.floor(bill * 1.4);
    applyEffects(`You couldn't cover taxes. The IRS sent the bill to collections (${money(bill * 1.4 | 0)}).`, { happiness: -6, discipline: 1 }, "bad");
    return;
  }
  applyEffects(`Paid ${money(bill)} in taxes. Nothing flashy. Just clean.`, { money: -bill, discipline: 3, karma: 2 }, "good");
}

function gigHustle() {
  const player = state.player;
  const earned = randomInt(80, 360) + Math.floor(player.stats.discipline / 2);
  const platform = pick(["Uber", "DoorDash", "Instacart", "TaskRabbit", "Lyft late shift", "Amazon Flex"]);
  applyEffects(`You ran ${platform} for the day. ${money(earned)} in your pocket.`, { money: earned, discipline: 2, happiness: -1, health: -1 }, "good");
}

function sideFlip() {
  const player = state.player;
  const item = pick(["a pair of dunks", "an old iPhone", "concert tickets", "a graphics card", "a vintage tee", "festival passes", "a bike off Marketplace"]);
  if (chance(58 + Math.floor(player.stats.smarts / 8))) {
    const profit = randomInt(80, 720) + Math.floor(player.fame / 3);
    applyEffects(`Flipped ${item} for ${money(profit)} clean.`, { money: profit, businessReputation: 1, happiness: 3 }, "good");
  } else {
    applyEffects(`${item} flipped slow. Ended up eating it.`, { money: -80, discipline: 2 }, "bad");
  }
}

function sellPlasma() {
  const player = state.player;
  if (player.stats.health < 50) {
    applyEffects("The clinic turned you away. Your iron is too low.", { happiness: -2 });
    return;
  }
  const earned = randomInt(45, 110);
  applyEffects(`You sold plasma for ${money(earned)}. Cold room, juice box, light dizziness.`, { money: earned, health: -4, happiness: -2 }, "good");
}

function getScammed() {
  const player = state.player;
  const loss = Math.min(player.money, randomInt(200, Math.max(500, Math.floor(player.money * 0.3))));
  const con = pick(["a Telegram trading group", "a forex 'mentor'", "a fake real-estate course", "a guy at a car meet", "an IG influencer DM"]);
  if (chance(18 + Math.floor(player.stats.smarts / 6))) {
    applyEffects(`You almost fell for ${con}, then pulled your money before it disappeared.`, { smarts: 4, discipline: 3, happiness: -1 }, "good");
    return;
  }
  applyEffects(`${con} took ${money(loss)} off you. Pure ego tax.`, { money: -loss, happiness: -8, smarts: 4 }, "bad");
}

function streetRace() {
  state.player.risksTaken += 1;
  if (chance(45 + (hasAsset("car") ? 12 : 0))) {
    const prize = randomInt(700, 3800);
    applyEffects(`You won the race and pocketed ${money(prize)}.`, { money: prize, happiness: 7, fame: 2 }, "good");
  } else {
    applyEffects("The race went badly. Fines and injuries followed.", { money: -1200, health: -12, record: 1, happiness: -8 }, "bad");
  }
}

function crashParty() {
  state.player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("You crashed the party and became the story of the night.", { happiness: 10, fame: 4, discipline: -3 }, "good");
  } else {
    applyEffects("Security tossed you out and your record got uglier.", { happiness: -6, record: 1, karma: -4 }, "bad");
  }
}

function askPromotion() {
  const player = state.player;
  const odds = 28 + Math.floor(player.stats.discipline / 3) + Math.floor(player.stats.smarts / 5) - player.record * 8;
  if (chance(odds)) {
    const raise = randomInt(1800, 12000);
    player.salaryBonus += raise;
    applyEffects(`You negotiated a raise worth ${money(raise)} per year.`, { happiness: 5, discipline: 2 }, "good");
  } else {
    applyEffects("Your boss said the timing was not right.", { happiness: -3, discipline: 1 }, "bad");
  }
}

function negotiateSalary() {
  const player = state.player;
  const odds = 32 + Math.floor(player.stats.smarts / 4) + Math.floor(player.stats.looks / 6);
  if (chance(odds)) {
    const bump = randomInt(2200, 9000);
    player.salaryBonus += bump;
    applyEffects(`HR agreed to ${money(bump)} more per year after you walked through the comps.`, { happiness: 6, smarts: 3, discipline: 3 }, "good");
  } else {
    applyEffects("HR called your number 'ambitious' and offered $0.", { happiness: -4, smarts: 4 }, "bad");
  }
}

function quitJob() {
  const player = state.player;
  const lastJob = currentJob(player).title;
  player.jobId = "none";
  player.salaryBonus = 0;
  applyEffects(`You quit being ${lastJob}. The relief and the math both hit at once.`, { happiness: 10, discipline: -2 }, "good");
}

function switchCareer() {
  const player = state.player;
  player.salaryBonus = 0;
  player.jobId = "none";
  applyEffects("You walked out to retrain for something new. The first month will be lean.", { money: -800, smarts: 4, discipline: 4, happiness: 4 }, "good");
}

function getHeadhunted() {
  const player = state.player;
  const odds = 38 + Math.floor(player.fame / 4) + Math.floor(player.stats.smarts / 6);
  if (chance(odds)) {
    const bump = randomInt(8000, 38000);
    player.salaryBonus += bump;
    applyEffects(`A recruiter pulled you into a better role for ${money(bump)} more per year.`, { fame: 3, happiness: 8, businessReputation: 4 }, "good");
  } else {
    applyEffects("The recruiter's pitch was a junior role with a fancy title. Pass.", { smarts: 3, happiness: -2 });
  }
}

function takeSabbatical() {
  const player = state.player;
  const cost = randomInt(4000, 12000);
  if (player.money < cost) { applyEffects(`Three months off costs about ${money(cost)}. Short.`, { happiness: -2 }); return; }
  applyEffects("You took three months off. Slept, walked, read, healed.", { money: -cost, health: 8, happiness: 16, discipline: 4, smarts: 5 }, "good");
}

function skipWork() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("You called out and watched movies all day. No alarms went off at work.", { happiness: 6, discipline: -3, health: 2 }, "good");
  } else {
    player.salaryBonus = Math.max(0, player.salaryBonus - 1200);
    applyEffects("Boss saw your post-up at the beach on IG. Written up. Pay cut.", { happiness: -8, fame: 1, discipline: 2 }, "bad");
  }
}

function apprenticeship() {
  const player = state.player;
  player.certifications.push("apprentice");
  const trade = pick(["a master electrician", "a journeyman plumber", "a carpenter", "a tattoo artist", "a barber", "a welder"]);
  applyEffects(`You started apprenticing under ${trade}. Hours long, pay mid, hands learn fast.`, { money: randomInt(200, 800), smarts: 4, discipline: 5, businessReputation: 2 }, "good");
}

function tutorKids() {
  const earned = randomInt(180, 720);
  applyEffects(`You tutored a few kids after school. Made ${money(earned)} and remembered why it clicks for you.`, { money: earned, smarts: 3, karma: 4, discipline: 2 }, "good");
}

function passTheBar() {
  const player = state.player;
  const odds = 38 + Math.floor(player.stats.smarts / 4) + Math.floor(player.stats.discipline / 5);
  if (chance(odds)) {
    player.certifications.push("bar");
    player.salaryBonus += 60000;
    applyEffects("You passed the bar. You're a real lawyer now.", { fame: 4, businessReputation: 8, smarts: 6, happiness: 18 }, "good");
  } else {
    applyEffects("You failed the bar this round. Three months until the next sitting.", { smarts: 4, discipline: 5, happiness: -10 }, "bad");
  }
}

function medicalBoards() {
  const player = state.player;
  const odds = 32 + Math.floor(player.stats.smarts / 4) + Math.floor(player.stats.discipline / 5);
  if (chance(odds)) {
    player.certifications.push("md");
    player.salaryBonus += 110000;
    applyEffects("Boards passed. You're an MD with a lot of debt and a real career.", { fame: 5, businessReputation: 10, smarts: 6, happiness: 20 }, "good");
  } else {
    applyEffects("You didn't pass boards. Brutal hit.", { smarts: 4, discipline: 6, happiness: -14 }, "bad");
  }
}

function nightClass() {
  const cost = state.player.educationRank >= 4 ? 900 : 360;
  applyEffects("Night class sharpened your practical skills.", { money: -cost, smarts: 5, discipline: 5, happiness: -2 }, "good");
}

function professionalSchool() {
  const player = state.player;
  player.school = "Professional school";
  player.educationRank = 6;
  player.debt += 42000;
  applyEffects("You entered professional school. The doors got taller and the debt got real.", { smarts: 8, discipline: 6, happiness: -4 }, "good");
}

function hostDinner() {
  state.player.relationships.forEach(person => changeBond(person, randomInt(3, 9)));
  applyEffects("You hosted dinner and everyone left warmer than they arrived.", { money: -180, happiness: 7 }, "good");
}

function adoptPet() {
  const petNames = ["Bean", "Rocket", "Mochi", "Pixel", "Sunny", "Ghost", "Miso"];
  const pet = pick(petNames.filter(name => !state.player.pets.includes(name)));
  state.player.pets.push(pet);
  state.player.relationships.push({ id: `pet-${Date.now()}`, name: pet, role: "Pet", bond: randomInt(74, 96), type: "pet" });
  applyEffects(`You adopted ${pet}. Home got louder and sweeter.`, { money: -140, happiness: 10, health: 2 }, "good");
}

function reconnectAbsentParent() {
  const player = state.player;
  const parentName = pick(peopleNames);
  if (chance(48 + Math.floor(player.stats.discipline / 6))) {
    player.relationships.push({ id: `bioparent-${Date.now()}`, name: parentName, role: "Bio parent", bond: randomInt(34, 64), type: "family" });
    addCanonEvent(`${player.name} reconnected with ${parentName} after years apart.`, "good");
    applyEffects(`${parentName} answered the phone. Voice broke on both sides. Weekly calls now.`, { happiness: 14, karma: 6, smarts: 4 }, "good");
  } else {
    applyEffects("Called the number. They didn't pick up. Voicemail wasn't full. They just didn't want to.", { happiness: -10, smarts: 5, discipline: 4 }, "bad");
  }
}

function buryAParent() {
  const player = state.player;
  const parent = player.relationships.find(r => r.id === "guardian") || player.relationships.find(r => r.id === "guardian2");
  if (!parent) return;
  parent.role = `Late ${parent.role}`;
  parent.deceased = true;
  changeBond(parent, -100);
  const inheritance = player.spawnClass === "nepo" ? randomInt(80000, 800000) : player.spawnClass === "comfortable" ? randomInt(8000, 80000) : player.spawnClass === "working" ? randomInt(800, 8000) : 0;
  player.money += inheritance;
  addCanonEvent(`${player.name} buried ${parent.name} at ${player.age}.`, "bad");
  applyEffects(`${parent.name} is gone. ${inheritance > 0 ? `Inheritance: ${money(inheritance)}.` : "Nothing was left for you."} You'll feel it forever.`, { happiness: -28, discipline: 5, smarts: 4, karma: 2 }, "bad");
}

function moveParentIn() {
  const player = state.player;
  const parent = player.relationships.find(r => r.id === "guardian" && !r.deceased);
  if (!parent) return;
  changeBond(parent, 20);
  parent.livingWith = true;
  applyEffects(`${parent.name} moved in. Mornings are different now. Real care, real strain.`, { money: -randomInt(800, 2400), happiness: 6, karma: 12, discipline: 4 }, "good");
}

function familyReunion() {
  const player = state.player;
  player.relationships.filter(r => r.type === "family").forEach(p => changeBond(p, randomInt(4, 12)));
  const newCousin = pick(peopleNames.filter(n => !player.relationships.some(r => r.name === n)));
  if (newCousin) {
    player.relationships.push({ id: `cousin-${Date.now()}`, name: newCousin, role: "Cousin", bond: randomInt(38, 66), type: "family" });
  }
  applyEffects(`Three-day family reunion. Twenty cousins. ${newCousin ? `Met ${newCousin} for the first time.` : ""}`, { money: -180, happiness: 12, karma: 5, discipline: 2 }, "good");
}

function cutToxicFriend() {
  const player = state.player;
  const toxic = player.relationships.filter(r => r.type === "friend" && r.bond < 40);
  if (toxic.length === 0) return;
  const cut = pick(toxic);
  player.relationships = player.relationships.filter(r => r !== cut);
  applyEffects(`You stopped replying to ${cut.name}. Your phone got quieter. Your week got better.`, { happiness: 10, discipline: 6, smarts: 4 }, "good");
}

function confrontSnake() {
  const player = state.player;
  const snake = player.relationships.find(r => r.arc === "snake");
  if (!snake) return;
  if (chance(58 + Math.floor(player.stats.smarts / 6))) {
    snake.arc = "loyal";
    changeBond(snake, 18);
    applyEffects(`You called ${snake.name} out. They admitted it. Real conversation. Trust mostly back.`, { happiness: 10, smarts: 6, discipline: 4, karma: 3 }, "good");
  } else {
    changeBond(snake, -45);
    snake.role = `${snake.role} (cut off)`;
    applyEffects(`${snake.name} denied everything and then disappeared. Confirmed you were right.`, { happiness: -6, smarts: 8, discipline: 4 }, "bad");
  }
}

function mediateBeef() {
  const player = state.player;
  if (chance(54 + Math.floor(player.stats.smarts / 6))) {
    applyEffects("You sat both friends down. The room got hot, then cooled. They hugged.", { happiness: 8, karma: 8, discipline: 3 }, "good");
  } else {
    applyEffects("You stepped in and now both of them are mad at you. Stay out of it next time.", { happiness: -6, smarts: 5 }, "bad");
  }
}

function bestManRole() {
  const player = state.player;
  const friend = pick(player.relationships.filter(r => r.bond >= 70 && r.type === "friend"));
  if (!friend) return;
  changeBond(friend, 18);
  applyEffects(`You stood at the altar with ${friend.name}. Speech got people crying.`, { money: -800, happiness: 14, fame: 2, karma: 4 }, "good");
}

function becomeGodparent() {
  const player = state.player;
  const friend = pick(player.relationships.filter(r => r.type === "friend" && r.bond >= 65));
  if (!friend) return;
  changeBond(friend, 14);
  applyEffects(`${friend.name} asked you to be godparent. You said yes. Real responsibility.`, { happiness: 12, karma: 8, discipline: 3 }, "good");
}

function surpriseBirthday() {
  const player = state.player;
  const target = pick(player.relationships.filter(r => r.type !== "pet"));
  if (!target) return;
  changeBond(target, 18);
  applyEffects(`You planned a real surprise for ${target.name}. They cried at the door.`, { money: -240, happiness: 10, karma: 5 }, "good");
}

function anniversaryDinner() {
  const player = state.player;
  const partner = player.relationships.find(r => r.type === "spouse") || player.relationships.find(r => r.type === "partner");
  if (!partner) return;
  changeBond(partner, 14);
  applyEffects(`Real reservation, real conversation. ${partner.name} reached across the table.`, { money: -240, happiness: 10, looks: 1 }, "good");
}

function couplesTherapy() {
  const player = state.player;
  const cost = 240;
  if (player.money < cost) { applyEffects(`Couples therapy runs ${money(cost)} a session.`, { happiness: -2 }); return; }
  const partner = player.relationships.find(r => r.type === "spouse");
  if (!partner) return;
  if (chance(64)) {
    changeBond(partner, 12);
    applyEffects(`Therapist named the loops. ${partner.name} listened. So did you.`, { money: -cost, happiness: 10, smarts: 6, discipline: 3 }, "good");
  } else {
    changeBond(partner, -6);
    applyEffects("The session opened more wounds than it closed. Next week is going to be a fight.", { money: -cost, happiness: -4, smarts: 5 }, "bad");
  }
}

function cheatOnPartner() {
  const player = state.player;
  player.risksTaken += 1;
  player.cheating = true;
  applyEffects("You crossed the line. The high crashed five hours later.", { happiness: -2, looks: 1, karma: -8, discipline: -4 }, "bad");
}

function longAffair() {
  const player = state.player;
  player.risksTaken += 1;
  player.cheating = true;
  const lover = pick(["a coworker", "an old fling", "somebody from the gym", "a neighbor"]);
  if (chance(58)) {
    applyEffects(`Six months with ${lover}. Compartmentalized. The juggling itself became a habit.`, { happiness: 6, karma: -10, discipline: -3, smarts: 3 }, "good");
  } else {
    getCaughtCheating();
  }
}

function getCaughtCheating() {
  const player = state.player;
  const partner = player.relationships.find(r => r.type === "spouse") || player.relationships.find(r => r.type === "partner");
  if (!partner) return;
  changeBond(partner, -65);
  player.cheating = false;
  if (chance(58)) {
    partner.type = partner.type === "spouse" ? "family" : "friend";
    partner.role = `Ex-${partner.role}`;
    applyEffects(`${partner.name} saw the texts. They left. The apartment feels too big now.`, { happiness: -28, karma: -8, smarts: 6, discipline: 4 }, "bad");
  } else {
    applyEffects(`${partner.name} found out. Long conversations followed. You're trying to rebuild.`, { happiness: -18, karma: -6, smarts: 4 }, "bad");
  }
}

function openRelationshipTalk() {
  const player = state.player;
  player.risksTaken += 1;
  const partner = player.relationships.find(r => r.type === "spouse") || player.relationships.find(r => r.type === "partner");
  if (!partner) return;
  if (chance(48)) {
    player.openRelationship = true;
    changeBond(partner, 8);
    applyEffects(`${partner.name} was open to it. Rules set. New chapter.`, { happiness: 8, smarts: 4 }, "good");
  } else {
    changeBond(partner, -28);
    applyEffects(`${partner.name} didn't take it well. Trust took a hit.`, { happiness: -14, smarts: 4 }, "bad");
  }
}

function tryConceive() {
  const player = state.player;
  const partner = player.relationships.find(r => r.type === "spouse" || r.type === "partner");
  if (!partner) return;
  if (chance(58 + Math.floor(player.stats.health / 8) - Math.max(0, player.age - 30) * 2)) {
    player.isPregnant = true;
    player.pregnancyPartner = partner.name;
    applyEffects(`Test came back positive. You and ${partner.name} are having a baby.`, { happiness: 16, health: -2, discipline: 3 }, "good");
  } else {
    applyEffects("Test was negative. You'll try again next month.", { happiness: -3, discipline: 2 });
  }
}

function partnerPregnant() {
  const player = state.player;
  const partner = player.relationships.find(r => (r.type === "partner" || r.type === "spouse"));
  if (!partner) return;
  if (chance(60)) {
    player.isPregnant = true;
    player.pregnancyPartner = partner.name;
    applyEffects(`${partner.name} took the test in your bathroom. Two lines. Whole life shifts.`, { happiness: 18, discipline: 4 }, "good");
  } else {
    applyEffects("False alarm. The conversation it started was bigger than either of you expected.", { happiness: 2, smarts: 4 });
  }
}

function giveBirthEvent() {
  const player = state.player;
  if (!player.isPregnant) return;
  player.isPregnant = false;
  haveChild();
}

function abortionEvent() {
  const player = state.player;
  if (!player.isPregnant) return;
  player.isPregnant = false;
  applyEffects("You made the choice. Real grief, real relief, both at once.", { money: -800, happiness: -10, health: -3, smarts: 6, discipline: 4 }, "bad");
}

function miscarriageEvent() {
  const player = state.player;
  if (!player.isPregnant) return;
  player.isPregnant = false;
  addCanonEvent(`${player.name} had a miscarriage at ${player.age}.`, "bad");
  applyEffects("It wasn't anybody's fault. The room stayed quiet for days.", { health: -8, happiness: -20, discipline: 3 }, "bad");
}

function ivfRound() {
  const player = state.player;
  const cost = 12000;
  if (player.money < cost) { applyEffects(`A real IVF round runs ${money(cost)}+.`, { happiness: -2 }); return; }
  if (chance(48 - Math.max(0, player.age - 35) * 4)) {
    player.isPregnant = true;
    applyEffects("Implantation took. The two-week wait was the longest of your life.", { money: -cost, happiness: 18, health: -3 }, "good");
  } else {
    applyEffects("Round failed. You're allowed to be devastated and then try again.", { money: -cost, happiness: -16, discipline: 5 }, "bad");
  }
}

function adoptKid() {
  const player = state.player;
  const cost = 8000;
  if (player.money < cost) { applyEffects(`A real adoption process runs ${money(cost)}+.`, { happiness: -2 }); return; }
  const childNames = ["Luca", "Mina", "Theo", "Ivy", "Ezra", "Nia", "Sage", "Rowan", "Sol", "Marley"];
  const name = pick(childNames);
  player.children.push({ name, age: randomInt(0, 6), personality: pick(["calm", "wild", "hustler", "bookworm"]), milestonesReached: {}, adopted: true });
  player.relationships.push({ id: `adopted-${Date.now()}`, name, role: "Adopted child", bond: randomInt(74, 88), type: "child" });
  addCanonEvent(`${player.name} adopted ${name} at ${player.age}.`);
  applyEffects(`Eighteen months of paperwork, three home visits, one airport pickup. ${name} is yours now.`, { money: -cost, happiness: 22, karma: 14, discipline: 5 }, "good");
}

function fosterTeen() {
  const player = state.player;
  const name = pick(peopleNames);
  player.children.push({ name, age: randomInt(13, 17), personality: pick(["wild", "hustler", "calm", "reckless"]), milestonesReached: {}, fostered: true });
  player.relationships.push({ id: `foster-${Date.now()}`, name, role: "Foster teen", bond: randomInt(30, 56), type: "child" });
  applyEffects(`Took in ${name} from the system. Real hard first months. Real meaningful work.`, { happiness: 8, karma: 18, discipline: 6, smarts: 4 }, "good");
}

function surrogacyEvent() {
  const player = state.player;
  const cost = 90000;
  if (player.money < cost) { applyEffects(`Surrogacy + medical + legal runs ${money(cost)}+.`, { happiness: -2 }); return; }
  if (chance(70)) {
    const childNames = ["Luca", "Mina", "Theo", "Ivy", "Ezra"];
    const name = pick(childNames);
    player.children.push({ name, age: 0, personality: pick(["calm", "wild", "bookworm"]), milestonesReached: {}, surrogate: true });
    player.relationships.push({ id: `surrogate-${Date.now()}`, name, role: "Child via surrogate", bond: randomInt(72, 90), type: "child" });
    addCanonEvent(`${player.name} had ${name} via surrogate at ${player.age}.`);
    applyEffects(`${name} was born nine months later via the surrogate. You held them an hour after.`, { money: -cost, happiness: 22, discipline: 5 }, "good");
  } else {
    applyEffects("The first attempt didn't take. Long, expensive process to start over.", { money: -cost, happiness: -16 }, "bad");
  }
}

function custodyFight() {
  const player = state.player;
  const cost = randomInt(4000, 18000);
  if (player.money < cost) { applyEffects(`A real custody fight runs ${money(cost)}+.`, { happiness: -2 }); return; }
  if (chance(48 + (player.hasLawyerOnRetainer ? 20 : 0) + Math.floor(player.stats.discipline / 6) - player.record * 8)) {
    applyEffects("Judge gave you joint primary. Real schedule, real time.", { money: -cost, happiness: 16, discipline: 5, karma: 4 }, "good");
  } else {
    applyEffects("You got every other weekend. The drive home was silent.", { money: -cost, happiness: -22, discipline: 4 }, "bad");
  }
}

function babymamaDrama() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(54)) {
    applyEffects("Co-parent meeting got loud. You stayed level. Schedule got renegotiated.", { money: -240, happiness: -4, smarts: 4, discipline: 3, karma: 1 }, "good");
  } else {
    applyEffects("They called CPS on you. False report, but the visit happened.", { happiness: -16, karma: 2, discipline: 5 }, "bad");
  }
}

function longDistanceMaintain() {
  const player = state.player;
  const partner = player.relationships.find(r => r.type === "partner");
  if (!partner) return;
  const cost = randomInt(280, 1200);
  if (player.money < cost) { applyEffects(`A real LDR weekend trip runs ${money(cost)}.`, { happiness: -2 }); return; }
  changeBond(partner, 12);
  applyEffects(`Flew out for a weekend with ${partner.name}. Calendar locked in for the next one.`, { money: -cost, happiness: 10, discipline: 4 }, "good");
}

function engagementParty() {
  const player = state.player;
  const partner = player.relationships.find(r => r.type === "partner");
  if (!partner) return;
  player.engaged = true;
  const cost = randomInt(800, 3200);
  if (player.money < cost) { applyEffects(`A real engagement party runs ${money(cost)}.`, { happiness: -2 }); return; }
  changeBond(partner, 18);
  applyEffects(`Family and friends gathered for you and ${partner.name}. Ring on, real night.`, { money: -cost, happiness: 18, fame: 3, karma: 3 }, "good");
}

function bachelorParty() {
  const player = state.player;
  player.bachelorDone = true;
  player.risksTaken += 1;
  const destination = pick(["Vegas", "Nashville", "Miami", "Austin", "Tulum"]);
  const cost = randomInt(1200, 4400);
  if (player.money < cost) { applyEffects(`${destination} bachelor weekend runs ${money(cost)}.`, { happiness: -2 }); return; }
  if (chance(64)) {
    applyEffects(`${destination} weekend with the guys/girls. Photos exist. Most are fine.`, { money: -cost, happiness: 16, fame: 3, looks: 1, discipline: -3 }, "good");
  } else {
    applyEffects(`${destination} got out of hand. Someone got arrested. Everyone made it home.`, { money: -cost, happiness: 8, record: chance(15) ? 1 : 0, fame: 4 }, "bad");
  }
}

function weddingDay() {
  const player = state.player;
  const partner = player.relationships.find(r => r.type === "partner");
  if (!partner) return;
  const cost = randomInt(8000, 60000);
  if (player.money < cost) { applyEffects(`A real wedding runs ${money(cost)}+. Elope or save up.`, { happiness: -2 }); return; }
  player.married = true;
  player.marriedAge = player.age;
  player.engaged = false;
  partner.type = "spouse";
  partner.role = "Spouse";
  changeBond(partner, 18);
  addCanonEvent(`${player.name} married ${partner.name} at ${player.age}.`, "good");
  applyEffects(`The day happened. Tears, photos, dance floor. ${partner.name} is your spouse.`, { money: -cost, happiness: 22, fame: 4, karma: 4 }, "good");
}

function honeymoon() {
  const player = state.player;
  player.honeymoonDone = true;
  const spot = pick(["Bali", "Italy's Amalfi coast", "Santorini", "Maldives", "Tokyo", "Mexico City"]);
  const cost = randomInt(4800, 14000);
  if (player.money < cost) { applyEffects(`Honeymoon to ${spot} starts at ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects(`Two weeks in ${spot}. Phones off. Best stretch of your life.`, { money: -cost, happiness: 24, health: 3, looks: 3 }, "good");
}

function renewVows() {
  const player = state.player;
  const spouse = player.relationships.find(r => r.type === "spouse");
  if (!spouse) return;
  changeBond(spouse, 22);
  applyEffects(`Ten-plus years in and you said the words again. Kids in the front row.`, { money: -1800, happiness: 18, karma: 5 }, "good");
}

function reconcileAfterFight() {
  const player = state.player;
  const partner = player.relationships.find(r => (r.type === "partner" || r.type === "spouse") && r.bond < 50);
  if (!partner) return;
  if (chance(58 + Math.floor(player.stats.discipline / 6))) {
    changeBond(partner, 25);
    applyEffects(`Long conversation. You both apologized. Real one.`, { happiness: 12, smarts: 5, karma: 3, discipline: 3 }, "good");
  } else {
    changeBond(partner, -10);
    applyEffects("The conversation made it worse. You went to bed in different rooms.", { happiness: -8, smarts: 4 }, "bad");
  }
}

function podcast() {
  const earned = randomInt(250, 1800) + state.player.fame * 28;
  applyEffects(`The interview gave your story a bigger audience and paid ${money(earned)}.`, { money: earned, fame: 6, happiness: 3 }, "good");
}

function publicStunt() {
  state.player.risksTaken += 1;
  if (chance(52 + Math.floor(state.player.stats.looks / 8))) {
    applyEffects("The stunt worked. Clips of it started circulating everywhere.", { fame: 14, happiness: 6 }, "good");
  } else {
    applyEffects("The stunt looked desperate and cost you credibility.", { fame: -6, happiness: -8, karma: -4 }, "bad");
  }
}

function dropSingle() {
  const player = state.player;
  rememberInterest("music", 3);
  if (chance(42 + Math.floor(player.stats.looks / 5) + Math.floor(player.fame / 6))) {
    const stream = randomInt(800, 18000);
    applyEffects(`Your single hit playlists. ${money(stream)} in royalties this month.`, { money: stream, fame: 6, followers: randomInt(400, 4400), happiness: 8 }, "good");
  } else {
    applyEffects("The single dropped to crickets. Two thousand streams.", { money: -200, fame: 1, happiness: -4 }, "bad");
  }
}

function dropAlbum() {
  const player = state.player;
  rememberInterest("music", 4);
  if (chance(38 + Math.floor(player.fame / 4))) {
    const sales = randomInt(8000, 240000);
    applyEffects(`The album charted. ${money(sales)} in first-week revenue.`, { money: sales, fame: 18, followers: randomInt(2400, 38000), happiness: 14 }, "good");
  } else {
    applyEffects("Album dropped quiet. Marketing didn't hit. Sales mid.", { money: -2200, fame: 3, happiness: -8 }, "bad");
  }
}

function goOnTour() {
  const player = state.player;
  rememberInterest("music", 3);
  if (chance(54 + Math.floor(player.fame / 5))) {
    const gross = randomInt(80000, 1200000);
    applyEffects(`The tour grossed ${money(gross)}. Sold out three nights at the LA stop.`, { money: gross, fame: 22, followers: randomInt(20000, 220000), health: -6, happiness: 16 }, "good");
  } else {
    applyEffects("Tour underperformed. Cancelled the last six dates. Refunds hurt.", { money: -randomInt(20000, 80000), fame: -4, health: -6, happiness: -14 }, "bad");
  }
}

function redCarpet() {
  applyEffects("You walked the carpet. Cameras flashed. The interview clip went viral.", { money: -1200, fame: 8, looks: 3, followers: randomInt(800, 14000), happiness: 9 }, "good");
}

function magazineCover() {
  applyEffects("You got the cover. Newsstands carried your face for a month.", { fame: 14, looks: 4, followers: randomInt(1800, 22000), happiness: 12 }, "good");
}

function lateNightShow() {
  const player = state.player;
  if (chance(58 + Math.floor(player.stats.happiness / 6))) {
    applyEffects("You killed on the couch. The story you told got clipped a million times.", { fame: 16, followers: randomInt(4000, 60000), happiness: 12 }, "good");
  } else {
    applyEffects("You bombed live. The host carried the bit.", { fame: -4, happiness: -10 }, "bad");
  }
}

function signAutographs() {
  applyEffects("Two hours at the store. Fans cried, you signed everything they handed you.", { fame: 4, followers: randomInt(200, 2400), happiness: 6, karma: 3 }, "good");
}

function stalkerIncident() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(48 + (player.hasLawyerOnRetainer ? 18 : 0))) {
    applyEffects("Security caught them on the property. Restraining order filed.", { money: -3200, fame: 4, happiness: -10, discipline: 4 }, "bad");
  } else {
    applyEffects("They got inside the house. You're moving. Whole life paused.", { money: -12000, fame: 6, health: -8, happiness: -22 }, "bad");
  }
}

function paparazziChase() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("You dodged the photographers cleanly. The valet kept it discreet.", { fame: 3, smarts: 3, happiness: -3 }, "good");
  } else {
    applyEffects("They got the shot. It runs in the tabloids tomorrow.", { fame: 8, happiness: -6, karma: -2 }, "bad");
  }
}

function brandCollab() {
  const player = state.player;
  const brand = pick(["Nike", "Adidas", "Hermès", "Gucci", "Telfar", "New Balance", "Vans"]);
  const fee = Math.min(800000, 5000 + player.fame * 1200);
  applyEffects(`You co-designed a capsule with ${brand}. They cut a ${money(fee)} check.`, { money: fee, fame: 10, looks: 3, businessReputation: 6, followers: randomInt(2000, 24000) }, "good");
}

function winAnAward() {
  const player = state.player;
  const award = pick(["a Grammy", "an Oscar", "a Tony", "a Webby", "a BAFTA", "an Emmy"]);
  addCanonEvent(`${player.name} won ${award} at ${player.age}.`, "good");
  applyEffects(`You won ${award}. Speech went viral. Mom posted it on her wall.`, { fame: 26, businessReputation: 8, happiness: 22 }, "good");
}

function publicBeef() {
  const player = state.player;
  player.risksTaken += 1;
  const rival = pick(["a bigger artist", "an A-list actor", "a podcaster", "another athlete"]);
  if (chance(48 + Math.floor(player.fame / 5))) {
    applyEffects(`Your shots at ${rival} landed. Audience picked you.`, { fame: 12, followers: randomInt(8000, 80000), happiness: 8, karma: -4 }, "good");
  } else {
    applyEffects(`${rival} sniped you cleaner. Your camp clipped it badly.`, { fame: -6, followers: -randomInt(4000, 28000), happiness: -10 }, "bad");
  }
}

function adoptCause() {
  const cause = pick(["homelessness", "the foster system", "literacy", "veterans", "mental health", "criminal-justice reform"]);
  applyEffects(`You started using your platform to spotlight ${cause}. Donations followed.`, { karma: 14, fame: 4, happiness: 8, businessReputation: 4 }, "good");
}

function hirePublicist() {
  const player = state.player;
  const fee = 4000;
  if (player.money < fee) { applyEffects(`A real publicist runs ${money(fee)}/month.`, { happiness: -2 }); return; }
  player.hasPublicist = true;
  applyEffects("You hired a publicist. They manage what runs in the press and what dies.", { money: -fee, fame: 4, businessReputation: 4, smarts: 3 }, "good");
}

function realityTV() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(48 + Math.floor(player.stats.looks / 5))) {
    const fee = randomInt(40000, 800000);
    applyEffects(`The show paid ${money(fee)}. You became a meme by episode three.`, { money: fee, fame: 18, followers: randomInt(40000, 800000), karma: -4, happiness: 6 }, "good");
  } else {
    applyEffects("The edit made you the villain. Fans turned. Career bruised.", { fame: 4, karma: -8, businessReputation: -8, happiness: -14 }, "bad");
  }
}

function becomeCultLeader() {
  const player = state.player;
  player.isCultLeader = true;
  addCanonEvent(`${player.name} founded a cult at ${player.age}. The tithing model worked.`, "bad");
  applyEffects("You started a 'community' with members and a daily practice. Tithing started rolling in.", { money: randomInt(80000, 800000), fame: 18, followers: randomInt(20000, 240000), karma: -22, businessReputation: 4, happiness: 12 }, "good");
}

function winGameShow() {
  const player = state.player;
  player.wonGameShow = true;
  const prize = randomInt(50000, 1500000);
  addCanonEvent(`${player.name} won a million on a game show at ${player.age}.`);
  applyEffects(`Buzzer rounds, big-money finale, you nailed it for ${money(prize)}.`, { money: prize, fame: 14, smarts: 4, happiness: 18 }, "good");
}

function posthumousRelease() {
  const player = state.player;
  player.posthumousLegend = true;
  applyEffects("You recorded everything. Stored on a private drive. Instructions left with your lawyer.", { fame: 6, happiness: 6, smarts: 3 }, "good");
}

function becomeASaint() {
  const player = state.player;
  player.isSaint = true;
  addCanonEvent(`${player.name} became a recognized saint at ${player.age}.`);
  applyEffects("The cause you spent your life on got institutional recognition. Streets get named after you eventually.", { karma: 20, fame: 22, happiness: 18 }, "good");
}

function liveOffGrid() {
  const player = state.player;
  player.offGrid = true;
  player.socialPage = false;
  player.followers = 0;
  applyEffects("Sold the phone. Cabin off a forest service road. Generator, well, garden. Stayed.", { money: 5000, happiness: 22, health: 6, discipline: 8, karma: 5, fame: -20 }, "good");
}

function foundASchool() {
  const player = state.player;
  player.foundedSchool = true;
  const cost = 80000;
  player.assets.push({ id: "business", name: "The school you founded", value: 220000 });
  addCanonEvent(`${player.name} founded a school at ${player.age}.`);
  applyEffects(`You built a real school. Two hundred kids enrolled the first year.`, { money: -cost, karma: 22, businessReputation: 12, fame: 8, happiness: 22 }, "good");
}

function runForPresident() {
  const player = state.player;
  player.runningForPres = true;
  const cost = 80000;
  if (player.money < cost) { applyEffects(`Pres run starts at ${money(cost)} in seed.`, { happiness: -4 }); return; }
  const odds = 14 + Math.floor(player.politicalCapital / 6) + Math.floor(player.fame / 5) - player.record * 12;
  if (chance(odds)) {
    player.jobId = "president";
    player.salaryBonus = 400000;
    addCanonEvent(`${player.name} won the presidency at ${player.age}.`, "good");
    applyEffects("Inauguration day. You took the oath. Your phone never stops now.", { money: -cost, fame: 48, politicalCapital: 80, happiness: 22 }, "good");
  } else {
    applyEffects("You lost the general. But you got 47 million votes and a Netflix special offer.", { money: -cost, fame: 22, politicalCapital: 20, happiness: -12 }, "bad");
  }
}

function cabinetAppointment() {
  const player = state.player;
  player.cabinetPosition = pick(["Treasury", "State", "Commerce", "Education", "Labor"]);
  player.salaryBonus += 200000;
  addCanonEvent(`${player.name} was appointed Secretary of ${player.cabinetPosition} at ${player.age}.`);
  applyEffects(`Senate confirmed you. Secretary of ${player.cabinetPosition}.`, { fame: 14, politicalCapital: 30, businessReputation: 10, happiness: 16 }, "good");
}

function powerballHit() {
  const player = state.player;
  player.megaJackpot = true;
  if (chance(2)) {
    const prize = randomInt(40000000, 900000000);
    addCanonEvent(`${player.name} won ${money(prize)} on Powerball at ${player.age}.`);
    applyEffects(`Powerball hit. ${money(prize)} after taxes.`, { money: prize, fame: 20, happiness: 28 }, "good");
  } else {
    applyEffects("$10 gone. Numbers were close though.", { money: -10, happiness: -1 }, "bad");
  }
}

function theBigScore() {
  const player = state.player;
  player.bigScoreAttempted = true;
  player.risksTaken += 2;
  if (chance(28 + Math.floor(player.stats.smarts / 6) + Math.floor(player.stats.discipline / 6) - player.gangHeat)) {
    const take = randomInt(800000, 6000000);
    addCanonEvent(`${player.name} pulled the big score at ${player.age}. Disappeared with ${money(take)}.`);
    applyEffects(`The score came together. ${money(take)} clean. Time to disappear.`, { money: take, streetRep: 20, fame: 8, karma: -16, happiness: 14 }, "good");
  } else {
    addCanonEvent(`${player.name} died in the big score at ${player.age}.`, "bad");
    applyEffects("The big score went wrong. Brothers picked up the body.", { health: -100, happiness: -50 }, "bad");
    player.alive = false;
  }
}

function claimTrueLove() {
  const player = state.player;
  player.trueLoveClaimed = true;
  const spouse = player.relationships.find(r => r.type === "spouse");
  addCanonEvent(`${player.name} and ${spouse?.name || "their partner"} hit 40 years married.`);
  applyEffects(`Forty years with one person. Real love, the kind that quiet outlasts everything.`, { happiness: 24, karma: 8, smarts: 4 }, "good");
}

function foundLostSibling() {
  const player = state.player;
  player.foundLostSibling = true;
  const name = pick(peopleNames);
  player.relationships.push({ id: `bio-sib-${Date.now()}`, name, role: "Bio sibling", bond: randomInt(48, 72), type: "family" });
  addCanonEvent(`${player.name} found ${name}, a sibling they never knew existed, at ${player.age}.`);
  applyEffects(`Ancestry DNA matched you with ${name}. They flew out. You look alike.`, { happiness: 22, karma: 6, smarts: 4 }, "good");
}

function budget() {
  const savings = randomInt(260, 1400) + Math.floor(annualPay() * 0.03);
  state.player.money += savings;
  applyEffects(`You tightened your budget and freed up ${money(savings)}.`, { discipline: 5, happiness: -1 }, "good");
}

function getLicense(kind, cost) {
  const player = state.player;
  if (player.money < cost) {
    applyEffects(`You need ${money(cost - player.money)} more for that license.`, { happiness: -1 });
    return;
  }
  const label = kind === "driver" ? "driver license" : "pilot license";
  player.money -= cost;
  if (chance(58 + Math.floor(player.stats.discipline / 4))) {
    player.licenses.push(kind);
    applyEffects(`You earned your ${label}.`, { discipline: 3, happiness: 4 }, "good");
  } else {
    applyEffects(`You failed the ${label} test this time.`, { happiness: -4, discipline: 1 }, "bad");
  }
}

const travelDestinations = {
  // Spring break / vacation
  "Cabo, Mexico":             { cost: [800, 1800],  minAge: 18, drinkAge: 18, vibe: "spring break / yacht weekend",       continent: "Latin America" },
  "Cancún, Mexico":           { cost: [900, 2200],  minAge: 18, drinkAge: 18, vibe: "all-inclusive resort week",          continent: "Latin America" },
  "Tulum, Mexico":            { cost: [2000, 5500], minAge: 21, drinkAge: 18, vibe: "bougie wellness / cacao influencer", continent: "Latin America" },
  "Cartagena, Colombia":      { cost: [1200, 2800], minAge: 18, drinkAge: 18, vibe: "rooftop rumba / colonial beach",     continent: "Latin America" },
  "Medellín, Colombia":       { cost: [1100, 2600], minAge: 18, drinkAge: 18, vibe: "paisa hustle / Comuna 13",           continent: "Latin America" },
  "Rio de Janeiro, Brazil":   { cost: [1800, 4500], minAge: 18, drinkAge: 18, vibe: "Carnival / favela funk",             continent: "Latin America" },
  "Mexico City, Mexico":      { cost: [1100, 3000], minAge: 18, drinkAge: 18, vibe: "after-hours fashion crowd",          continent: "Latin America" },
  // Asia
  "Bali, Indonesia":          { cost: [1500, 3500], minAge: 18, drinkAge: 21, vibe: "Hangover-style chaos",               continent: "Asia" },
  "Phuket, Thailand":         { cost: [1200, 3200], minAge: 18, drinkAge: 20, vibe: "full moon parties",                  continent: "Asia" },
  "Tokyo, Japan":             { cost: [2200, 5800], minAge: 20, drinkAge: 20, vibe: "Shinjuku host clubs / karaoke",      continent: "Asia" },
  "Seoul, South Korea":       { cost: [1800, 4800], minAge: 19, drinkAge: 19, vibe: "Hongdae bars / K-pop tours",         continent: "Asia" },
  // Europe
  "Paris, France":            { cost: [2200, 6000], minAge: 18, drinkAge: 18, vibe: "fashion week / cafés",               continent: "Europe" },
  "London, UK":               { cost: [2000, 5500], minAge: 18, drinkAge: 18, vibe: "Soho nightlife / drill scene",       continent: "Europe" },
  "Croatia (Yacht Week)":     { cost: [3500, 8500], minAge: 21, drinkAge: 18, vibe: "Yacht Week / island hopping",        continent: "Europe" },
  // Middle East
  "Dubai, UAE":               { cost: [3000, 9000], minAge: 21, drinkAge: 21, vibe: "supercar brunch / Burj rooftop",     continent: "Middle East" },
  // USA party trips
  "Las Vegas, NV":            { cost: [800, 4000],  minAge: 21, drinkAge: 21, vibe: "casinos / pool parties",             continent: "USA" },
  "Miami, FL":                { cost: [900, 3200],  minAge: 18, drinkAge: 21, vibe: "South Beach / Wynwood / boat days",  continent: "USA" }
};

function availableDestinations(player) {
  return Object.entries(travelDestinations)
    .filter(([city]) => city !== player.location)
    .filter(([city, data]) => player.age >= data.minAge)
    .filter(([city, data]) => player.money >= data.cost[0]);
}

function bookTrip() {
  const player = state.player;
  const options = availableDestinations(player);
  if (options.length === 0) {
    applyEffects(`No trip you can afford right now. Save up.`, { happiness: -2 });
    return;
  }
  // Build a choice dialog with up to 6 random offerings (cheaper first)
  const offerings = options
    .sort((a, b) => a[1].cost[0] - b[1].cost[0])
    .slice(0, Math.min(6, options.length));
  const choices = offerings.map(([city, data]) => ({
    label: `${city} — ${money(data.cost[0])}+`,
    run: () => goOnTrip(city, data)
  }));
  choices.push({ label: "Cancel", run: () => applyEffects("You looked at flights, closed the tab.", {}) });
  // Defer so the calling event dialog has time to close first.
  // Otherwise the parent's finishTurn/close fires AFTER this opens and eats it.
  setTimeout(() => {
    showEvent({
      title: "Pick a destination",
      text: () => `Where to? You have ${money(player.money)}. Each country opens up different scenes depending on your age.`,
      choices
    });
  }, 80);
}

function goOnTrip(destination, data) {
  const player = state.player;
  const cost = randomInt(data.cost[0], data.cost[1]);
  if (player.money < cost) {
    applyEffects(`The trip to ${destination} costs more than you have.`, { happiness: -2 }, "bad");
    return;
  }
  player.money -= cost;
  player.currentTrip = destination;
  if (!player.trips.includes(destination)) player.trips.push(destination);
  const continent = data.continent || "abroad";
  addCanonEvent(`${player.name} booked a trip to ${destination}.`, "good");
  applyEffects(`Booked. ${money(cost)} gone. Flight leaves Friday. ${data.vibe}.`, { happiness: 8, looks: 1 }, "good");
  // Fire 1-2 destination scenes this turn
  const tripPool = events.filter(event => {
    if (!event.when) return false;
    try { return event.when(player); } catch (e) { return false; }
  });
  if (tripPool.length > 0) {
    const scene = pickLifeEvent(tripPool, player);
    if (scene) showEvent(scene);
  }
}

function travel(bigTrip) {
  const destinations = realLocations.filter(place => place !== state.player.location);
  const unvisited = destinations.filter(place => !state.player.trips.includes(place));
  const destination = pick(unvisited.length > 0 ? unvisited : destinations);
  const cost = bigTrip ? randomInt(1800, 5200) : randomInt(320, 1100);
  state.player.trips.push(destination);
  applyEffects(`You traveled to ${destination}. The trip changed your mood and your stories.`, {
    money: -cost,
    happiness: bigTrip ? 10 : 6,
    looks: 1,
    health: bigTrip ? 3 : 1
  }, "good");
}

function moveCities() {
  const nextHome = pick(realLocations.filter(home => home !== state.player.location));
  state.player.location = nextHome;
  state.player.home = nextHome;
  changeLocalRep(2, nextHome);
  const newFriend = pick(peopleNames.filter(name => !state.player.relationships.some(person => person.name === name)));
  state.player.relationships.push({ id: `friend-${Date.now()}`, name: newFriend, role: "New friend", bond: randomInt(34, 62), type: "friend" });
  applyEffects(`You moved to ${nextHome} and met ${newFriend}.`, { money: -1600, happiness: 5, discipline: 2 }, "good");
}

function backpack() {
  state.player.risksTaken += 1;
  travel(true);
  if (!chance(72)) {
    applyEffects("A backpacking mishap left you bruised and broke.", { health: -12, money: -900, happiness: -4 }, "bad");
  }
}

function roadTrip() {
  const player = state.player;
  const cost = randomInt(280, 1200);
  if (player.money < cost) { applyEffects(`A real road trip eats ${money(cost)} in gas, food, motels.`, { happiness: -2 }); return; }
  applyEffects("You packed the car and drove until the radio changed three times. Sunsets and gas stations.", { money: -cost, happiness: 10, smarts: 3, discipline: 2 }, "good");
}

function campingTrip() {
  applyEffects("Tent, fire, no signal. You forgot what an algorithm felt like.", { money: -180, happiness: 8, health: 3, discipline: 3, karma: 1 }, "good");
}

function festivalRun() {
  const player = state.player;
  const cost = randomInt(800, 2400);
  if (player.money < cost) { applyEffects(`Festival weekend runs at least ${money(cost)} with ticket plus chaos.`, { happiness: -2 }); return; }
  const fest = pick(["Coachella", "Rolling Loud", "AfroPunk", "EDC", "Glastonbury", "Carnaval"]);
  applyEffects(`You did ${fest}. Three days, two outfits, one phone you'll never see again.`, { money: -cost, happiness: 14, fame: 4, followers: randomInt(80, 1200), health: -3 }, "good");
}

function cruiseTrip() {
  const player = state.player;
  const cost = 1200;
  if (player.money < cost) { applyEffects(`Cruise tickets start at ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects("Seven days at sea. You danced with strangers, ate too much, watched the horizon a lot.", { money: -cost, happiness: 9, health: 2, looks: 2 }, "good");
}

function springBreak() {
  const player = state.player;
  player.risksTaken += 1;
  const cost = randomInt(800, 2200);
  if (player.money < cost) { applyEffects(`Spring break costs at least ${money(cost)}.`, { happiness: -2 }); return; }
  const place = pick(["Cabo", "Miami", "Cancún", "Punta Cana", "Mykonos"]);
  if (chance(58)) {
    applyEffects(`${place} was everything they said. Beach, club, sunburn, stories.`, { money: -cost, happiness: 14, fame: 3, health: -3, discipline: -3 }, "good");
  } else {
    applyEffects(`${place} went sideways. Lost wallet, food poisoning, friend got arrested.`, { money: -cost, happiness: -10, health: -8, record: chance(40) ? 1 : 0 }, "bad");
  }
}

function europeBackpack() {
  const player = state.player;
  const cost = 2200;
  if (player.money < cost) { applyEffects(`A two-month Eurail trip starts at ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects("You spent two months riding trains across Europe with one bag. Got lost in three cities, made friends in four.", { money: -cost, happiness: 18, smarts: 8, looks: 3, discipline: 4 }, "good");
}

function mountainClimb() {
  const player = state.player;
  player.risksTaken += 1;
  const cost = randomInt(1800, 6500);
  if (player.money < cost) { applyEffects(`A real mountain expedition starts at ${money(cost)}.`, { happiness: -2 }); return; }
  const peak = pick(["Denali", "Kilimanjaro", "Aconcagua", "Mount Whitney", "Mount Rainier"]);
  if (chance(64)) {
    applyEffects(`You summited ${peak}. Crying at the top isn't optional.`, { money: -cost, happiness: 20, health: -4, discipline: 10, fame: 4 }, "good");
  } else {
    applyEffects(`${peak} turned you around at altitude. Came home with frostbite on two fingers.`, { money: -cost, health: -16, discipline: 6, happiness: -4 }, "bad");
  }
}

function runWithBulls() {
  const player = state.player;
  player.risksTaken += 1;
  const cost = 1000;
  if (player.money < cost) { applyEffects(`Pamplona costs at least ${money(cost)} to get there.`, { happiness: -2 }); return; }
  if (chance(72)) {
    applyEffects("You ran with the bulls. Made it out with one bruise and a story for life.", { money: -cost, happiness: 14, fame: 4, streetRep: 2 }, "good");
  } else {
    applyEffects("A bull caught you. Three broken ribs, hospital in Pamplona, real medical bill.", { money: -cost - 2400, health: -22, happiness: -6 }, "bad");
  }
}

function burningMan() {
  const player = state.player;
  const cost = 1400;
  if (player.money < cost) { applyEffects(`Burning Man tickets + supplies start at ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects("A week on the playa. Dust, art cars, free principles, ego death.", { money: -cost, happiness: 18, smarts: 6, karma: 4, fame: 3, looks: -2 }, "good");
}

function freelance() {
  const earned = randomInt(260, 2200) + Math.floor((state.player.stats.smarts + state.player.stats.discipline) * 8);
  applyEffects(`You finished a freelance contract for ${money(earned)}.`, { money: earned, discipline: 2, happiness: -1 }, "good");
}

function pitchInvestors() {
  if (state.player.company) {
    raiseRound();
    return;
  }
  const odds = 24 + Math.floor(state.player.stats.smarts / 4) + Math.floor(state.player.fame / 3);
  if (chance(odds)) {
    const cash = randomInt(10000, 65000);
    state.player.businessReputation += randomInt(5, 14);
    applyEffects(`Investors backed your idea with ${money(cash)}.`, { money: cash, fame: 4, discipline: 3 }, "good");
  } else {
    applyEffects("The pitch landed flat, but the feedback was useful.", { happiness: -5, smarts: 3, discipline: 2 }, "bad");
  }
}

function improveBusiness() {
  const cost = randomInt(1400, 7600);
  state.player.businessReputation += randomInt(4, 11);
  applyEffects(`You reinvested ${money(cost)} into operations. Business reputation improved.`, { money: -cost, smarts: 2, discipline: 3 }, "good");
}

function hireManager() {
  state.player.businessReputation += 8;
  applyEffects("You hired a manager and stopped doing every little thing yourself.", { money: -4200, happiness: 4, discipline: 2 }, "good");
}

function openStorefront() {
  const player = state.player;
  const cost = 9000;
  if (player.money < cost) { applyEffects(`A storefront takes ${money(cost)} to open clean.`, { happiness: -2 }); return; }
  player.assets.push({ id: "business", name: "Local Storefront", value: 12000 });
  applyEffects("You signed the lease and stocked the shelves. Open sign goes up Monday.", { money: -cost, businessReputation: 6, fame: 2, happiness: 8 }, "good");
}

function launchFranchise() {
  const player = state.player;
  const cost = 80000;
  if (player.money < cost) { applyEffects(`A franchise license starts at ${money(cost)}.`, { happiness: -2 }); return; }
  const brand = pick(["Subway", "UPS Store", "Jiffy Lube", "Smoothie King", "7-Eleven"]);
  player.assets.push({ id: "franchise", name: `${brand} franchise`, value: 90000 });
  applyEffects(`You opened a ${brand} franchise. Corporate sends you a playbook every quarter.`, { money: -cost, businessReputation: 10, happiness: 8 }, "good");
}

function launchSaaS() {
  const player = state.player;
  const cost = 1200;
  rememberInterest("tech", 3);
  const odds = 42 + Math.floor(player.stats.smarts / 5);
  if (chance(odds)) {
    const mrr = randomInt(800, 4400);
    player.salaryBonus += mrr * 12;
    applyEffects(`Your SaaS hit ${money(mrr)} MRR within a month.`, { money: -cost, businessReputation: 6, fame: 2, happiness: 12 }, "good");
  } else {
    applyEffects("Built it, shipped it, three users signed up. None paid.", { money: -cost, smarts: 5, discipline: 3, happiness: -4 }, "bad");
  }
}

function startEcom() {
  const player = state.player;
  const cost = 800;
  if (player.money < cost) { applyEffects(`E-com kickoff runs ${money(cost)} between samples and ads.`, { happiness: -2 }); return; }
  const niche = pick(["pet products", "supplements", "skincare", "phone accessories", "kids' toys"]);
  if (chance(48 + Math.floor(player.stats.smarts / 6))) {
    const profit = randomInt(2200, 18000);
    applyEffects(`Your ${niche} store cleared ${money(profit)} after ad spend.`, { money: profit - cost, businessReputation: 4, happiness: 8 }, "good");
  } else {
    applyEffects(`The ${niche} angle didn't catch. You burned the ad budget.`, { money: -cost, smarts: 4, discipline: 3 }, "bad");
  }
}

function realEstateFlip() {
  const player = state.player;
  const cost = 40000;
  if (player.money < cost) { applyEffects(`A flip needs ${money(cost)} minimum.`, { happiness: -2 }); return; }
  if (chance(54 + Math.floor(player.stats.smarts / 6))) {
    const profit = randomInt(18000, 95000);
    applyEffects(`You flipped the property and cleared ${money(profit)}.`, { money: profit, businessReputation: 8, happiness: 12 }, "good");
  } else {
    applyEffects("Inspection killed the deal. You ate carry costs.", { money: -randomInt(6000, 18000), happiness: -8 }, "bad");
  }
}

function realEstateRental() {
  const player = state.player;
  const cost = 60000;
  if (player.money < cost) { applyEffects(`Down on a rental runs ${money(cost)}.`, { happiness: -2 }); return; }
  player.assets.push({ id: "rental", name: "Duplex rental", value: 220000 });
  applyEffects("You closed on a duplex. Tenants move in next month.", { money: -cost, businessReputation: 8, happiness: 14 }, "good");
}

function dropClothingBrand() {
  const player = state.player;
  rememberInterest("fashion", 3);
  if (chance(42 + Math.floor(player.stats.looks / 5) + Math.floor(player.fame / 6))) {
    const sales = randomInt(1800, 22000);
    applyEffects(`Your drop sold out in 48 hours. ${money(sales)} cleared.`, { money: sales, fame: 8, businessReputation: 5, happiness: 10 }, "good");
  } else {
    applyEffects("The drop sat. You shipped one hoodie to your cousin.", { money: -800, smarts: 4, happiness: -6 }, "bad");
  }
}

function openRestaurant() {
  const player = state.player;
  const cost = 35000;
  if (player.money < cost) { applyEffects(`A restaurant build-out starts at ${money(cost)}.`, { happiness: -2 }); return; }
  player.assets.push({ id: "business", name: "Restaurant", value: 48000 });
  applyEffects("You opened the doors. Soft launch fed friends and family.", { money: -cost, businessReputation: 10, fame: 4, happiness: 10 }, "good");
}

function openBarbershop() {
  const player = state.player;
  const cost = 9000;
  if (player.money < cost) { applyEffects(`A shop runs ${money(cost)} to open.`, { happiness: -2 }); return; }
  player.assets.push({ id: "business", name: "Barbershop", value: 14000 });
  applyEffects("You opened a barbershop. The block already came in for cuts.", { money: -cost, businessReputation: 6, streetRep: 2, happiness: 10 }, "good");
}

function truckingCompany() {
  const player = state.player;
  const cost = 28000;
  if (player.money < cost) { applyEffects(`A used rig runs ${money(cost)}.`, { happiness: -2 }); return; }
  player.assets.push({ id: "business", name: "Trucking Co", value: 36000 });
  applyEffects("You bought a rig and got your DOT number. First load goes out Tuesday.", { money: -cost, businessReputation: 6, happiness: 8 }, "good");
}

function buyNDAs() {
  const player = state.player;
  const cost = 2400;
  if (player.money < cost) { applyEffects(`Real legal paperwork runs ${money(cost)}.`, { happiness: -2 }); return; }
  player.hasLawyerOnRetainer = true;
  applyEffects("You wrapped the business in NDAs, IP assignments, and an operating agreement.", { money: -cost, businessReputation: 6, discipline: 3 }, "good");
}

function acquirePatent() {
  const player = state.player;
  const cost = 12000;
  if (player.money < cost) { applyEffects(`A defensible patent buy starts at ${money(cost)}.`, { happiness: -2 }); return; }
  if (player.company) player.company.valuation = Math.floor((player.company.valuation || 1) * 1.25);
  applyEffects("You bought a competitor's patent before they could weaponize it.", { money: -cost, businessReputation: 8 }, "good");
}

function layoffRound() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(58)) {
    applyEffects("You ran a layoff round. Cash improved, mood tanked.", { businessReputation: -4, happiness: -6, discipline: 3 }, "bad");
    if (player.company) player.company.valuation = Math.floor((player.company.valuation || 1) * 0.92);
  } else {
    applyEffects("Layoffs leaked early. Top talent walked first. Glassdoor in flames.", { businessReputation: -12, fame: -3, happiness: -10 }, "bad");
    if (player.company) player.company.valuation = Math.floor((player.company.valuation || 1) * 0.75);
  }
}

function sbaLoan() {
  const player = state.player;
  const offered = randomInt(20000, 220000);
  player.debt += Math.floor(offered * 1.15);
  applyEffects(`SBA approved ${money(offered)} at 11% over 7 years.`, { money: offered, businessReputation: 2 }, "good");
}

function networkMixer() {
  const player = state.player;
  const contact = pick(peopleNames.filter(n => !player.relationships.some(r => r.name === n)));
  if (chance(58 + Math.floor(player.stats.looks / 6))) {
    player.relationships.push({ id: `mixer-${Date.now()}`, name: contact, role: "Business contact", bond: randomInt(34, 62), type: "ally" });
    applyEffects(`You met ${contact} at the mixer. They run something worth knowing.`, { money: -60, businessReputation: 4, happiness: 4, discipline: 1 }, "good");
  } else {
    applyEffects("The mixer was a thousand business cards and zero substance.", { money: -60, happiness: -3, smarts: 2 });
  }
}

function consultLawyer() {
  if (chance(38 + Math.floor(state.player.money / 3000))) {
    state.player.record = Math.max(0, state.player.record - 1);
    applyEffects("The lawyer found a way to reduce your record.", { money: -1800, happiness: 5 }, "good");
  } else {
    applyEffects("The consultation was expensive and mostly bad news.", { money: -1200, happiness: -3 }, "bad");
  }
}

function expungeRecord() {
  const cost = 8500 + state.player.record * 4200;
  if (state.player.money < cost) {
    applyEffects(`You need ${money(cost - state.player.money)} more to attempt expungement.`, { happiness: -2 });
    return;
  }
  state.player.money -= cost;
  state.player.record = 0;
  applyEffects("Your record was cleared. Career doors reopened.", { happiness: 9, karma: 3 }, "good");
}

function sueForDamages() {
  if (chance(31 + Math.floor(state.player.stats.smarts / 5))) {
    const award = randomInt(4000, 48000);
    applyEffects(`You won the case and received ${money(award)}.`, { money: award, happiness: 5 }, "good");
  } else {
    applyEffects("You lost the case and paid legal fees.", { money: -2600, happiness: -6 }, "bad");
  }
}

function hireDefenseLawyer() {
  const player = state.player;
  const fee = 2000 + randomInt(0, 1800);
  if (player.money < fee) {
    applyEffects(`Defense retainer wants ${money(fee)}. You're short.`, { happiness: -2 });
    return;
  }
  player.hasLawyerOnRetainer = true;
  applyEffects(`You put ${money(fee)} on retainer with a defense attorney. Anything goes wrong, you've got a call.`, { money: -fee, discipline: 3, happiness: 4 }, "good");
}

function fightTicket() {
  const player = state.player;
  const ticket = randomInt(120, 480);
  if (chance(48 + Math.floor(player.stats.smarts / 6) + (player.hasLawyerOnRetainer ? 25 : 0))) {
    applyEffects(`You beat the ticket. ${money(ticket)} stays in your pocket.`, { smarts: 2, happiness: 4, karma: 1 }, "good");
  } else {
    applyEffects(`Judge wasn't moved. You paid the ${money(ticket)} ticket.`, { money: -ticket, happiness: -3 }, "bad");
  }
}

function getSued() {
  const player = state.player;
  const claim = randomInt(2000, 24000);
  const plaintiff = pick(["a former business partner", "an old neighbor", "a guy from a fender bender", "an ex who kept receipts", "a contractor you stiffed"]);
  const choice = window.confirm(`${plaintiff} is suing you for ${money(claim)}. Settle now for ${money(Math.floor(claim * 0.4))}? Cancel to go to court.`);
  if (choice) {
    const settle = Math.floor(claim * 0.4);
    if (player.money < settle) {
      player.debt += settle;
      applyEffects(`Settled for ${money(settle)} but had to put it on debt.`, { happiness: -6 }, "bad");
      return;
    }
    applyEffects(`Settled for ${money(settle)}. ${plaintiff} disappears.`, { money: -settle, happiness: -4, discipline: 2 }, "good");
    return;
  }
  const winOdds = 36 + Math.floor(player.stats.smarts / 5) + (player.hasLawyerOnRetainer ? 22 : 0);
  if (chance(winOdds)) {
    applyEffects(`You beat the case in court. ${plaintiff} walks with nothing.`, { happiness: 8, smarts: 3, karma: 1 }, "good");
  } else {
    applyEffects(`You lost. Court ordered ${money(claim)} plus fees.`, { money: -Math.floor(claim * 0.5), debt: Math.floor(claim * 0.6), happiness: -10 }, "bad");
  }
}

function pleaBargain() {
  const player = state.player;
  if (player.record < 1) {
    applyEffects("Nothing pending. Nothing to plea down.", {});
    return;
  }
  const charge = pick(["possession", "reckless driving", "trespassing", "petty theft", "disorderly conduct", "fraud"]);
  if (chance(58 + (player.hasLawyerOnRetainer ? 20 : 0) + Math.floor(player.stats.smarts / 8))) {
    player.record = Math.max(0, player.record - 1);
    applyEffects(`Your lawyer plead the ${charge} down. Probation, fine, no extra time.`, { money: -1400, happiness: 4, discipline: 2 }, "good");
  } else {
    applyEffects(`DA wouldn't budge on the ${charge}. You're heading to a real fight.`, { happiness: -6, discipline: 2 }, "bad");
  }
}

function startJailSentence(player, years, reason) {
  player.inJail = true;
  player.jailYearsLeft = years;
  player.jailYearsServed = 0;
  player.jailReason = reason;
  player.jailGoodTime = 0;
  player.jobId = "none";
  player.salaryBonus = 0;
  if (player.company) player.company = null;
  addCanonEvent(`${player.name} went to jail at ${player.age} for ${reason}. Sentence: ${years} year${years === 1 ? "" : "s"}.`, "bad");
  applyEffects(`You went down for ${reason}. Sentence: ${years} year${years === 1 ? "" : "s"}.`, { happiness: -22, discipline: 3, streetRep: 4, record: 1, karma: -2 }, "bad");
}

function endJailSentence(player) {
  const served = player.jailYearsServed || 0;
  player.inJail = false;
  player.jailYearsLeft = 0;
  player.lastJailRelease = player.age;
  player.timesIncarcerated = (player.timesIncarcerated || 0) + 1;
  addCanonEvent(`${player.name} walked out of jail at ${player.age} after ${served} year${served === 1 ? "" : "s"}.`, "good");
  applyEffects(`You walked out. ${served} year${served === 1 ? "" : "s"} done. The world kept moving without you.`, { happiness: 14, discipline: 8, streetRep: 6 }, "good");
}

function turnSelfIn() {
  const player = state.player;
  const years = Math.max(1, player.record - 1);
  if (player.hasLawyerOnRetainer && chance(45)) {
    player.record = Math.max(0, player.record - 1);
    applyEffects(`Your lawyer negotiated a probation deal before you walked in. No jail time.`, { money: -2400, happiness: 6, discipline: 4 }, "good");
    return;
  }
  startJailSentence(player, years, pick(["the charges they had on you", "an old warrant", "a probation violation"]));
}

function visitInmate() {
  const player = state.player;
  const inmate = pick(player.relationships.filter(r => r.inJail));
  if (!inmate) {
    applyEffects("Nobody you know is locked up.", {});
    return;
  }
  changeBond(inmate, randomInt(6, 12));
  applyEffects(`You drove out to see ${inmate.name}. Glass between you. Twenty minutes that mattered.`, { money: -45, happiness: 4, karma: 5, discipline: 2 }, "good");
}

function bailFriend() {
  const player = state.player;
  const inmate = pick(player.relationships.filter(r => r.inJail));
  if (!inmate) return;
  const bail = randomInt(1500, 6500);
  if (player.money < bail) {
    applyEffects(`Bail for ${inmate.name} is ${money(bail)}. You can't cover it.`, { happiness: -4 }, "bad");
    return;
  }
  inmate.inJail = false;
  changeBond(inmate, 28);
  applyEffects(`You bailed ${inmate.name} out for ${money(bail)}. They owe you forever.`, { money: -bail, happiness: 8, karma: 6 }, "good");
}

function paroleHearing() {
  const player = state.player;
  if (!player.inJail) return;
  const odds = 18 + (player.jailGoodTime || 0) * 6 + Math.floor(player.stats.discipline / 6) - (player.record - 1) * 8;
  if (chance(odds)) {
    addLog("The parole board granted early release.", "good");
    endJailSentence(player);
  } else {
    applyEffects("Parole denied. You go back to the block.", { happiness: -6, discipline: 3 }, "bad");
  }
}

function behaveInside() {
  const player = state.player;
  if (!player.inJail) return;
  player.jailGoodTime = (player.jailGoodTime || 0) + 1;
  applyEffects("You did programs, worked the kitchen, kept your nose clean. Good-time credit up.", { discipline: 5, smarts: 3, health: 2, recovery: 2 }, "good");
}

function yardPolitics() {
  const player = state.player;
  if (!player.inJail) return;
  player.risksTaken += 1;
  if (chance(48 + Math.floor(player.stats.health / 5))) {
    applyEffects("You handled yard business. The block respects you now.", { streetRep: 5, health: -3, gangHeat: 1, happiness: 2 }, "good");
  } else {
    player.jailYearsLeft = (player.jailYearsLeft || 0) + 1;
    applyEffects("The fight cost you. Extra year stacked on your sentence.", { streetRep: 2, health: -10, record: 1, happiness: -8 }, "bad");
  }
}

function custodyBattle() {
  const player = state.player;
  const cost = randomInt(3500, 14000);
  if (player.money < cost) {
    applyEffects(`Family court runs ${money(cost)} minimum. You can't fund this fight.`, { happiness: -6 }, "bad");
    return;
  }
  const odds = 32 + Math.floor(player.stats.discipline / 5) + (player.jobId !== "none" ? 12 : -8) + (player.hasLawyerOnRetainer ? 18 : 0) - player.record * 10;
  if (chance(odds)) {
    applyEffects("Judge awarded primary custody. Your kid stays with you.", { money: -cost, happiness: 16, discipline: 5, karma: 8 }, "good");
  } else {
    applyEffects("You lost custody. Visitation only. The drive home was silent.", { money: -cost, happiness: -22, discipline: 4 }, "bad");
  }
}

function immigrationHelp() {
  const player = state.player;
  const cost = randomInt(800, 4200);
  if (player.money < cost) {
    applyEffects(`Immigration lawyer wants ${money(cost)} upfront.`, { happiness: -2 });
    return;
  }
  const stage = pick(["green-card filing", "naturalization paperwork", "asylum case", "visa renewal", "family petition"]);
  if (chance(58 + Math.floor(player.stats.discipline / 6))) {
    applyEffects(`The ${stage} cleared. Status secured.`, { money: -cost, happiness: 12, discipline: 4, karma: 4 }, "good");
  } else {
    applyEffects(`The ${stage} got kicked back for more documents.`, { money: -cost, happiness: -6, discipline: 2 }, "bad");
  }
}

function whistleblow() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(38 + Math.floor(player.stats.discipline / 5))) {
    const award = randomInt(8000, 220000);
    applyEffects(`The feds paid you ${money(award)} as a whistleblower. Some doors closed forever.`, { money: award, karma: 12, fame: 8, businessReputation: -10, happiness: 5 }, "good");
    if (player.company) player.company.valuation = Math.max(0, Math.floor(player.company.valuation * 0.3));
  } else {
    applyEffects("Your evidence wasn't enough. Now everybody knows you tried.", { karma: 6, businessReputation: -8, happiness: -8, gangHeat: 2 }, "bad");
  }
}

function propose() {
  const partner = state.player.relationships.find(person => person.type === "partner");
  if (!partner) {
    applyEffects("There is nobody to propose to yet.", { happiness: -1 });
    return;
  }
  const odds = partner.bond + Math.floor(state.player.stats.happiness / 4) - state.player.record * 8;
  if (chance(odds)) {
    state.player.married = true;
    state.player.marriedAge = state.player.age;
    state.player.divorces = state.player.divorces || 0;
    partner.role = "Spouse";
    partner.type = "spouse";
    partner.marriedAge = state.player.age;
    changeBond(partner, 10);
    addCanonEvent(`Married ${partner.name} at ${state.player.age}.`, "good");
    applyEffects(`${partner.name} said yes. You got married.`, { happiness: 14, discipline: 2 }, "good");
  } else {
    changeBond(partner, -18);
    applyEffects(`${partner.name} said no. The silence after was brutal.`, { happiness: -16 }, "bad");
  }
}

function fileForDivorce() {
  const spouse = state.player.relationships.find(p => p.type === "spouse");
  if (!spouse) {
    applyEffects("Nobody to divorce.", { happiness: -1 });
    return;
  }
  const settlement = Math.max(0, Math.floor(state.player.money * 0.45));
  state.player.money -= settlement;
  state.player.divorces = (state.player.divorces || 0) + 1;
  state.player.married = false;
  spouse.type = "family";
  spouse.role = "Ex-spouse";
  changeBond(spouse, -45);
  addCanonEvent(`Divorced ${spouse.name} at ${state.player.age}. Settlement cost ${money(settlement)}.`, "bad");
  applyEffects(`The papers are signed. ${money(settlement)} gone in settlement. You feel lighter and heavier at once.`, { happiness: -12, discipline: 4, smarts: 4 }, "bad");
}

function haveChild() {
  const childNames = ["Luca", "Mina", "Theo", "Ivy", "Ezra", "Nia", "Sage", "Rowan"];
  const existingNames = state.player.children.map(child => typeof child === "string" ? child : child.name);
  const options = childNames.filter(child => !existingNames.includes(child));
  const name = options.length > 0 ? pick(options) : `Kid ${state.player.children.length + 1}`;
  const childPersonality = pick(["wild", "calm", "storm", "hustler", "bookworm", "romantic", "big", "reckless"]);
  state.player.children.push({ name, age: 0, personality: childPersonality, milestonesReached: {} });
  state.player.relationships.push({ id: `child-${Date.now()}`, name, role: "Child", bond: randomInt(68, 92), type: "child" });
  applyEffects(`${name} joined your family. Everything got louder, sweeter, and more expensive.`, { money: -2200, happiness: 12, discipline: 5 }, "good");
}

function familyDay() {
  state.player.relationships
    .filter(person => ["spouse", "partner", "child", "pet"].includes(person.type))
    .forEach(person => changeBond(person, randomInt(7, 13)));
  applyEffects("You gave your family a full day of attention.", { money: -260, happiness: 8 }, "good");
}

function audition() {
  const odds = 24 + Math.floor(state.player.stats.looks / 3) + Math.floor(state.player.fame / 4);
  if (chance(odds)) {
    applyEffects("The audition landed. Casting directors started remembering you.", { fame: 12, happiness: 8 }, "good");
  } else {
    applyEffects("The audition was a miss, but your nerves got tougher.", { happiness: -5, discipline: 3 }, "bad");
  }
}

function writeBook() {
  const cost = 400;
  state.player.books += 1;
  const advance = randomInt(600, 5600) + state.player.fame * 60 + state.player.trips.length * 180;
  applyEffects(`You wrote a book and earned a ${money(advance)} advance.`, { money: advance - cost, fame: 7, discipline: 6 }, "good");
}

function trainSport() {
  rememberInterest("sports", 2);
  applyEffects("You trained like a serious competitor.", { health: 7, discipline: 5, happiness: -1 }, "good");
}

function tournament() {
  const odds = 24 + Math.floor(state.player.stats.health / 3) + Math.floor(state.player.stats.discipline / 5);
  if (chance(odds)) {
    state.player.championships += 1;
    applyEffects("You won the tournament. People started calling you a problem.", { fame: 8, happiness: 10, health: 2 }, "good");
  } else {
    applyEffects("You lost the tournament, but the training still changed you.", { health: 3, discipline: 4, happiness: -3 }, "bad");
  }
}

function makeArt() {
  rememberInterest("art", 2);
  if (chance(38 + Math.floor(state.player.stats.looks / 5) + Math.floor(state.player.stats.smarts / 8))) {
    const sale = randomInt(120, 2400) + state.player.fame * 20;
    applyEffects(`Your art found buyers and earned ${money(sale)}.`, { money: sale, fame: 5, happiness: 7 }, "good");
  } else {
    applyEffects("You made something strange, honest, and mostly ignored.", { happiness: 4, discipline: 2 });
  }
  maybeMicroScene("makeart", 24);
}

function cookForPeople() {
  rememberInterest("food", 1);
  state.player.relationships.forEach(person => changeBond(person, randomInt(1, 5)));
  applyEffects("You cooked for people you care about.", { money: -90, happiness: 6 }, "good");
}

function streamGames() {
  rememberInterest("gaming", 2);
  if (chance(42 + Math.floor(state.player.stats.smarts / 8))) {
    const earned = randomInt(40, 1800);
    applyEffects(`The stream popped off and brought in ${money(earned)}.`, { money: earned, fame: 5, happiness: 4 }, "good");
  } else {
    applyEffects("The stream was quiet, but you got better on camera.", { fame: 1, discipline: 2 });
  }
}

function readABook() {
  const book = pick(["a war novel", "an econ textbook", "a memoir", "a philosophy primer", "a poetry collection", "a self-help that aged well", "a thriller"]);
  applyEffects(`You read ${book}. Phone stayed in the other room.`, { smarts: 5, discipline: 3, happiness: 4 }, "good");
}

function morningPages() {
  applyEffects("Three pages before coffee. Brain dump cleared the day.", { happiness: 6, smarts: 4, discipline: 5 }, "good");
}

function dailyReading() {
  applyEffects("An hour with a novel after dinner became a habit. The phone got quieter.", { smarts: 6, happiness: 6, discipline: 4 }, "good");
}

function bookClub() {
  const player = state.player;
  applyEffects("Met five strangers over the same book once a month. The conversations went deep.", { money: -25, smarts: 4, karma: 3, happiness: 5 }, "good");
  const newFriend = pick(peopleNames.filter(n => !player.relationships.some(r => r.name === n)));
  if (newFriend && chance(50)) {
    player.relationships.push({ id: `bookclub-${Date.now()}`, name: newFriend, role: "Book club friend", bond: randomInt(40, 64), type: "friend" });
  }
}

function potteryClass() {
  applyEffects("Six sessions on the wheel. You made a mug worth drinking from.", { money: -240, happiness: 8, discipline: 3, looks: 1 }, "good");
}

function watercolorClass() {
  applyEffects("Watercolor over four weekends. Your eye for light sharpened.", { money: -180, happiness: 7, smarts: 3, looks: 1 }, "good");
}

function learnInstrument() {
  const player = state.player;
  const instrument = pick(["guitar", "piano", "saxophone", "drums", "violin"]);
  rememberInterest("music", 2);
  if (chance(58 + Math.floor(player.stats.discipline / 5))) {
    applyEffects(`You stuck with ${instrument} for six months. Songs you can play start to fame .`, { money: -380, smarts: 5, discipline: 6, happiness: 9, fame: 2 }, "good");
  } else {
    applyEffects(`${instrument} got too hard. The instrument lives in the closet now.`, { money: -380, discipline: 2, happiness: -2 });
  }
}

function calligraphy() {
  applyEffects("You filled three journals practicing one letter. Hands steadier, head quieter.", { money: -60, smarts: 4, discipline: 6, happiness: 5 }, "good");
}

function teaCeremony() {
  applyEffects("You took the gongfu tea class. Real ceremony, slow attention.", { money: -90, happiness: 8, smarts: 3, karma: 2 }, "good");
}

function beachWalk() {
  applyEffects("An hour on the sand at sunset. Phone in the car.", { happiness: 9, health: 2, discipline: 2, karma: 2 }, "good");
}

function sunriseHike() {
  applyEffects("Trail at 5 AM. You watched a sunrise that nobody else saw.", { happiness: 10, health: 4, discipline: 4, smarts: 2 }, "good");
}

function silentRetreat() {
  const player = state.player;
  const cost = 600;
  if (player.money < cost) { applyEffects(`A real silent retreat runs ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects("Five days no talking. You came out clearer than you'd been in years.", { money: -cost, happiness: 22, smarts: 8, discipline: 6, karma: 6 }, "good");
}

function monasteryStay() {
  const player = state.player;
  const cost = 1200;
  if (player.money < cost) { applyEffects(`Two weeks at a working monastery runs ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects("Two weeks with the monks. Morning bells, manual work, evening prayer. Real reset.", { money: -cost, happiness: 24, discipline: 10, karma: 10, smarts: 5, health: 3 }, "good");
}

function volunteerShelter() {
  applyEffects("You served at the shelter. Listened more than you talked. Came home full.", { happiness: 8, karma: 10, smarts: 3, discipline: 2 }, "good");
}

function fosterDog() {
  const player = state.player;
  const name = pick(["Beans", "Cooper", "Olive", "Banjo", "Mochi", "Rooster", "Hazel"]);
  player.relationships.push({ id: `fosterdog-${Date.now()}`, name, role: "Foster dog", bond: randomInt(72, 92), type: "pet" });
  applyEffects(`You fostered ${name} for the season. Long walks, slow mornings, real medicine.`, { money: -180, happiness: 14, health: 3, karma: 8, discipline: 3 }, "good");
}

function buildBookshelf() {
  applyEffects("You built a real bookshelf. Pine, dowels, three coats of oil.", { money: -120, happiness: 8, smarts: 3, discipline: 4 }, "good");
}

function learnToCook() {
  applyEffects("Six classes deep. You can plate a real meal now.", { money: -380, happiness: 8, smarts: 4, discipline: 5, looks: 1 }, "good");
}

function forestBathing() {
  applyEffects("Two hours under canopy. No phone, no goal. The world got bigger.", { happiness: 8, health: 4, smarts: 2, karma: 2 }, "good");
}

function sketchStrangers() {
  rememberInterest("art", 2);
  applyEffects("You sketched everyone at the coffee shop. One person noticed and smiled.", { smarts: 4, happiness: 6, looks: 1 }, "good");
}

function letterToOldFriend() {
  const player = state.player;
  const old = pick(player.relationships.filter(r => r.bond < 50));
  if (!old) return;
  changeBond(old, randomInt(8, 18));
  applyEffects(`You handwrote a letter to ${old.name}. They called you crying.`, { happiness: 10, karma: 8, smarts: 3 }, "good");
}

function plantATree() {
  applyEffects("You planted a tree. It might outlive you. That feels right.", { money: -45, happiness: 7, karma: 8, discipline: 2 }, "good");
}

function soupKitchen() {
  applyEffects("Three-hour shift at the soup kitchen. You learned ten names.", { happiness: 7, karma: 12, discipline: 2 }, "good");
}

function mentorAKid() {
  applyEffects("You took a kid on as a mentee. Showed up every week. They graduated something.", { happiness: 12, karma: 14, smarts: 3, discipline: 3 }, "good");
}

function sabbathDay() {
  applyEffects("No screens, no work, no errands. Just one day.", { happiness: 10, discipline: 5, health: 3, karma: 3 }, "good");
}

function adoptCat() {
  const player = state.player;
  const name = pick(["Miso", "Pixel", "Toast", "Olive", "Pepper", "Bean", "Smokey"]);
  player.relationships.push({ id: `cat-${Date.now()}`, name, role: "Cat", bond: randomInt(76, 94), type: "pet" });
  applyEffects(`${name} moved in. They sleep on your laptop now.`, { money: -180, happiness: 12, health: 2, karma: 4 }, "good");
}

function slowCoffee() {
  applyEffects("Pour-over ritual every morning. Real beans, real attention.", { money: -40, happiness: 5, discipline: 3, smarts: 1 }, "good");
}

function cottagecore() {
  applyEffects("Bread on Saturdays, garden Sundays. Phone in airplane mode.", { happiness: 14, discipline: 4, karma: 4, looks: 1, smarts: 2 }, "good");
}

function gardenWork() {
  applyEffects("You worked the garden. Hands in dirt. Mind unwound.", { money: -40, health: 3, discipline: 3, happiness: 6, karma: 2 }, "good");
}

function buildPC() {
  const player = state.player;
  const cost = randomInt(1200, 3200);
  if (player.money < cost) { applyEffects(`A real build runs ${money(cost)}. Save up.`, { happiness: -2 }); return; }
  rememberInterest("tech", 3);
  applyEffects(`You built a tower. RGB, custom loop, the works.`, { money: -cost, smarts: 5, happiness: 10, discipline: 3 }, "good");
}

function skateSession() {
  const player = state.player;
  player.risksTaken += 1;
  rememberInterest("skate", 2);
  if (chance(64)) {
    applyEffects("Bombed the hill clean. Landed the trick on camera.", { health: 1, happiness: 8, streetRep: 2, fame: 1 }, "good");
  } else {
    applyEffects("Slammed on the manual pad. Hip got rashed.", { health: -5, happiness: -2, discipline: 3 }, "bad");
  }
}

function surfSession() {
  applyEffects("Paddled out at sunrise. Caught three clean ones.", { health: 4, happiness: 8, fitnessLevel: 2, discipline: 2 }, "good");
}

function hikeTrail() {
  const trails = pick(["Runyon Canyon", "Griffith Observatory loop", "a state-park ridge", "a coastal cliff trail", "a back-country wilderness route"]);
  applyEffects(`You hiked ${trails}. Phone in airplane mode the whole time.`, { health: 4, happiness: 7, discipline: 3, smarts: 2 }, "good");
}

function paintMural() {
  const player = state.player;
  rememberInterest("art", 3);
  if (chance(54 + Math.floor(player.stats.looks / 6))) {
    applyEffects("The mural got finished. Neighbors took photos. Local paper picked it up.", { fame: 6, karma: 6, happiness: 8, businessReputation: 2 }, "good");
  } else {
    applyEffects("Code enforcement scrubbed it three days later. Still felt good doing it.", { karma: 3, discipline: 3, happiness: -2 });
  }
}

function tattooApprentice() {
  const player = state.player;
  if (chance(48 + Math.floor(player.stats.looks / 6))) {
    player.certifications.push("tattooArt");
    applyEffects("Master inker took you on. You're cleaning the shop and watching every line.", { money: -200, smarts: 4, discipline: 4, businessReputation: 3, happiness: 6 }, "good");
  } else {
    applyEffects("Shop said no. Came back a year too early.", { discipline: 2, happiness: -3 });
  }
}

function chessClub() {
  rememberInterest("chess", 2);
  if (chance(48 + Math.floor(state.player.stats.smarts / 5))) {
    applyEffects("You won the club tournament. Rating climbed a chunk.", { smarts: 6, discipline: 4, happiness: 6 }, "good");
  } else {
    applyEffects("Lost on time in the final. Re-analyzed every move on the walk home.", { smarts: 5, discipline: 3, happiness: -1 });
  }
}

function writePoetry() {
  applyEffects("You filled six pages and crossed half of it out.", { smarts: 4, happiness: 5, discipline: 2 }, "good");
}

function photoWalk() {
  applyEffects("Camera, no agenda. Came home with one frame worth printing.", { money: -25, smarts: 3, happiness: 5, discipline: 2 }, "good");
}

function restoreCar() {
  const player = state.player;
  const cost = randomInt(1500, 6400);
  if (player.money < cost) { applyEffects(`A real project car costs at least ${money(cost)}.`, { happiness: -2 }); return; }
  applyEffects("You bought a barn-find. Spent the winter rebuilding it in the driveway.", { money: -cost, smarts: 4, discipline: 6, happiness: 10, fame: 2 }, "good");
}

function cosplayCon() {
  const player = state.player;
  rememberInterest("nerd", 2);
  applyEffects("You walked the convention floor in a costume you built. Strangers asked to take photos.", { money: -200, fame: 3, happiness: 9, karma: 1 }, "good");
}

function magicTricks() {
  applyEffects("You ran sleight of hand at a party. Three people demanded you reveal the move.", { happiness: 6, fame: 2, smarts: 2 }, "good");
}

function djParty() {
  const player = state.player;
  rememberInterest("music", 2);
  if (chance(48 + Math.floor(player.stats.looks / 5))) {
    const earned = randomInt(120, 1400);
    applyEffects(`Your set ran the night. ${money(earned)} in your hand at 3 AM.`, { money: earned, fame: 5, followers: randomInt(60, 700), happiness: 8 }, "good");
  } else {
    applyEffects("Dance floor cleared on your third track. Long ride home.", { fame: -1, discipline: 3, happiness: -4 }, "bad");
  }
}

function townHall() {
  applyEffects("You spoke at town hall and learned how local power works.", { politicalCapital: 6, smarts: 2, happiness: 2 }, "good");
}

function fundraiser() {
  const cost = Math.min(Math.max(500, Math.floor(state.player.money * 0.18)), 12000);
  if (state.player.money < 500) {
    applyEffects("You need at least $500 to host a fundraiser.", { happiness: -1 });
    return;
  }
  applyEffects(`You hosted a fundraiser that cost ${money(cost)} but bought influence.`, { money: -cost, politicalCapital: randomInt(8, 18), fame: 2 }, "good");
}

function runForOffice() {
  const odds = 22 + Math.floor(state.player.politicalCapital / 2) + Math.floor(state.player.fame / 5) - state.player.record * 12;
  if (chance(odds)) {
    state.player.jobId = "mayor";
    state.player.salaryBonus = 0;
    applyEffects("You won the election. The city is your problem now.", { politicalCapital: 18, fame: 12, happiness: 10 }, "good");
  } else {
    applyEffects("You lost the election, but your name recognition survived.", { politicalCapital: 6, fame: 3, happiness: -7 }, "bad");
  }
}

function passReform() {
  applyEffects("You passed a local reform people will actually feel.", { politicalCapital: 10, karma: 8, happiness: 6 }, "good");
}

function voteCivic() {
  applyEffects("You voted. Lines were long. You still showed up.", { politicalCapital: 2, karma: 3, happiness: 1, discipline: 1 }, "good");
}

function volunteerCampaign() {
  const cause = pick(["a school-board candidate", "a city-council insurgent", "a mayoral race", "a state-senate underdog", "a federal congressional run"]);
  applyEffects(`You spent weeks volunteering for ${cause}. People remember the names of the volunteers who showed up.`, { politicalCapital: randomInt(4, 9), karma: 4, discipline: 3, happiness: 2 }, "good");
}

function donateCause() {
  const player = state.player;
  const give = Math.min(player.money, Math.max(100, Math.floor(player.money * 0.05)));
  applyEffects(`You donated ${money(give)} to a cause you actually believe in.`, { money: -give, politicalCapital: Math.floor(give / 80), karma: 6, happiness: 3 }, "good");
}

function runSchoolBoard() {
  const player = state.player;
  const odds = 38 + Math.floor(player.politicalCapital / 2) + Math.floor(player.fame / 6) - player.record * 10;
  if (chance(odds)) {
    player.jobId = "schoolboard";
    player.salaryBonus = 0;
    applyEffects("You won a school-board seat. Tiny title, real influence on kids.", { politicalCapital: 10, fame: 4, karma: 5, happiness: 8 }, "good");
  } else {
    applyEffects("You lost the school-board race. Door-knocking was still good practice.", { politicalCapital: 3, happiness: -4 }, "bad");
  }
}

function runCityCouncil() {
  const player = state.player;
  const odds = 28 + Math.floor(player.politicalCapital / 2) + Math.floor(player.fame / 5) - player.record * 11;
  if (chance(odds)) {
    player.jobId = "councilmember";
    player.salaryBonus = 38000;
    applyEffects("You won the council seat. The neighborhood looks at you different now.", { politicalCapital: 14, fame: 8, happiness: 10 }, "good");
  } else {
    applyEffects("You lost city council, but the constituents who showed up remembered.", { politicalCapital: 5, happiness: -6 }, "bad");
  }
}

function runStateSenate() {
  const player = state.player;
  const odds = 22 + Math.floor(player.politicalCapital / 3) + Math.floor(player.fame / 4) - player.record * 14;
  if (chance(odds)) {
    player.jobId = "senate";
    player.salaryBonus = 90000;
    applyEffects("You won the state senate seat. Real power now. Real enemies too.", { politicalCapital: 22, fame: 14, happiness: 12, discipline: 4 }, "good");
  } else {
    applyEffects("You lost a state senate race that cost everything. The donors moved on.", { politicalCapital: 8, money: -12000, happiness: -10 }, "bad");
  }
}

function runCongress() {
  const player = state.player;
  player.money -= 20000;
  const odds = 18 + Math.floor(player.politicalCapital / 4) + Math.floor(player.fame / 4) - player.record * 16;
  if (chance(odds)) {
    player.jobId = "congress";
    player.salaryBonus = 174000;
    addCanonEvent(`${player.name} won a seat in Congress at ${player.age}.`, "good");
    applyEffects("You won a congressional seat. They put your name in the Capitol.", { politicalCapital: 35, fame: 25, happiness: 18 }, "good");
  } else {
    applyEffects("The congressional race was a brutal loss. National press knows your face now though.", { fame: 12, politicalCapital: 10, happiness: -18 }, "bad");
  }
}

function hireLobbyist() {
  const player = state.player;
  const fee = Math.min(player.money, randomInt(5000, 25000));
  if (chance(58 + Math.floor(player.stats.smarts / 6))) {
    applyEffects(`The lobbyist got your name in the right rooms for ${money(fee)}.`, { money: -fee, politicalCapital: randomInt(10, 22), businessReputation: 6 }, "good");
  } else {
    applyEffects(`You paid ${money(fee)} for access that never opened a single door.`, { money: -fee, happiness: -6, smarts: 3 }, "bad");
  }
}

function publicEndorsement() {
  const player = state.player;
  const candidate = pick(["a mayoral hopeful", "a state senator", "a congressional challenger", "a presidential candidate", "a ballot proposition"]);
  if (chance(48 + Math.floor(player.fame / 6))) {
    applyEffects(`Your endorsement of ${candidate} moved real votes.`, { politicalCapital: 14, fame: 3, karma: 4 }, "good");
  } else {
    applyEffects(`Your endorsement of ${candidate} drew more drag than support.`, { politicalCapital: 4, fame: -2, happiness: -4 }, "bad");
  }
}

function campaignScandal() {
  const player = state.player;
  player.risksTaken += 1;
  const story = pick(["a leaked DM", "an old college tweet", "a campaign-finance violation", "a video clip taken out of context", "an ex talking to the press"]);
  const survive = 42 + Math.floor(player.stats.discipline / 5) - Math.floor(player.record / 2) * 6 + (player.hasLawyerOnRetainer ? 12 : 0);
  if (chance(survive)) {
    applyEffects(`${story} hit the news. Your team handled it before it became the story.`, { politicalCapital: -8, fame: 5, smarts: 4, happiness: -8 }, "bad");
  } else {
    const lost = Math.min(player.politicalCapital, randomInt(15, 50));
    applyEffects(`${story} buried you. Donors backed off. Polling collapsed.`, { politicalCapital: -lost, fame: -8, happiness: -16 }, "bad");
    if (player.jobId === "mayor" || player.jobId === "councilmember" || player.jobId === "schoolboard") {
      addLog("You resigned in disgrace to dodge a recall.", "bad");
      player.jobId = "none";
      player.salaryBonus = 0;
    }
  }
}

function passNationalBill() {
  const player = state.player;
  const odds = 22 + Math.floor(player.politicalCapital / 4) + Math.floor(player.stats.smarts / 6);
  const issue = pick(["a criminal-justice reform bill", "a housing package", "a tax overhaul", "an infrastructure bill", "an immigration framework", "a small-business relief act"]);
  if (chance(odds)) {
    addCanonEvent(`${player.name} passed ${issue} in Congress at ${player.age}.`, "good");
    applyEffects(`You whipped the votes. ${issue} is now law.`, { politicalCapital: 18, fame: 12, karma: 14, happiness: 14 }, "good");
  } else {
    applyEffects(`${issue} died on the floor. The other side called you naive.`, { politicalCapital: -8, fame: 3, happiness: -10 }, "bad");
  }
}

function undergroundFight() {
  state.player.risksTaken += 1;
  if (chance(34 + Math.floor(state.player.stats.health / 3))) {
    const prize = randomInt(900, 6200);
    applyEffects(`You won the underground fight and took ${money(prize)}.`, { money: prize, fame: 3, health: -4 }, "good");
  } else {
    applyEffects("The fight went sideways. Pain, fines, and regret followed.", { money: -900, health: -16, record: 1, happiness: -8 }, "bad");
  }
}

function highStakesBet() {
  const stake = Math.min(state.player.money, randomInt(1000, 12000));
  state.player.risksTaken += 1;
  if (chance(38 + Math.floor(state.player.stats.smarts / 10))) {
    applyEffects(`Your bet hit and paid ${money(stake * 2)}.`, { money: stake * 2, happiness: 8 }, "good");
  } else {
    applyEffects(`Your bet collapsed and cost ${money(stake)}.`, { money: -stake, happiness: -10 }, "bad");
  }
}

function scamCityBonus(loc) {
  const hot = {
    "Las Vegas, NV": 18,
    "Miami, FL": 14,
    "Los Angeles, CA": 12,
    "Hollywood, Los Angeles": 12,
    "Skid Row, Los Angeles": 8,
    "New York City, NY": 10,
    "Brooklyn, NY": 8,
    "Atlanta, GA": 10,
    "Houston, TX": 6,
    "Dubai, UAE": -6,
    "Tokyo, Japan": -10,
    "Seoul, South Korea": -10
  };
  return hot[loc] || 0;
}

function sellZa() {
  const player = state.player;
  player.risksTaken += 1;
  rememberInterest("street", 1);
  const odds = 62 + Math.floor(player.streetRep / 3) + Math.floor(scamCityBonus(player.location) / 2);
  if (chance(odds)) {
    const take = randomInt(120, 720) + player.streetRep * 12;
    applyEffects(`You moved bags all weekend. Cleared ${money(take)}.`, { money: take, streetRep: 2, karma: -1 }, "good");
  } else {
    applyEffects("Buyer was a snitch. Caught a possession charge.", { record: 1, happiness: -6, money: -200 }, "bad");
  }
}

function runBags() {
  const player = state.player;
  player.risksTaken += 1;
  const take = randomInt(60, 320);
  if (chance(72)) {
    applyEffects(`You ran a drop and got paid ${money(take)} for an hour of work.`, { money: take, streetRep: 1, discipline: 1, karma: -2 }, "good");
  } else {
    applyEffects("The block was hot. Cops circled and you ditched the bag in a bush.", { money: -take, happiness: -3, gangHeat: 1 }, "bad");
  }
}

function runTrap() {
  const player = state.player;
  player.risksTaken += 1;
  rememberInterest("street", 2);
  const odds = 48 + Math.floor(player.streetRep / 4) + scamCityBonus(player.location);
  if (chance(odds)) {
    const take = randomInt(800, 4200) + player.streetRep * 30;
    applyEffects(`The spot ran clean this month. ${money(take)} in tape stacks.`, { money: take, streetRep: 5, gangHeat: 2, karma: -3, happiness: 6 }, "good");
  } else {
    applyEffects("Door got kicked. Block raided. You ducked the worst of it.", { record: 2, money: -400, gangHeat: 3, happiness: -10 }, "bad");
  }
}

function cookWork() {
  const player = state.player;
  player.risksTaken += 1;
  rememberInterest("street", 3);
  const odds = 32 + Math.floor(player.stats.smarts / 5) + Math.floor(player.streetRep / 4) - 6;
  if (chance(odds)) {
    const take = randomInt(3200, 22000);
    applyEffects(`You cooked a batch and it moved fast. ${money(take)} in three days.`, { money: take, streetRep: 8, gangHeat: 4, karma: -8, health: -2, happiness: 4 }, "good");
  } else {
    applyEffects("The lab caught a stash-house raid. Charges came back federal.", { record: 4, money: -2000, gangHeat: 5, happiness: -16 }, "bad");
  }
}

function frontBag() {
  const player = state.player;
  player.risksTaken += 1;
  const front = randomInt(1500, 6500);
  player.debt += front;
  applyEffects(`You took ${money(front)} on consignment. You eat after the plug eats.`, { money: front, streetRep: 3, gangHeat: 1, karma: -3 }, "good");
}

function plugConnect() {
  const player = state.player;
  if (chance(48 + Math.floor(player.streetRep / 4))) {
    rememberInterest("street", 3);
    applyEffects("Plug fronted you a tier up. Margins jumped.", { streetRep: 6, businessReputation: -2, gangHeat: 2 }, "good");
  } else {
    applyEffects("Plug ghosted after a meeting. Wrong vibe.", { happiness: -4, streetRep: 1 }, "bad");
  }
}

function buyStrap() {
  const player = state.player;
  const cost = randomInt(400, 1200);
  if (player.money < cost) { applyEffects(`A clean strap runs ${money(cost)}. Short.`, { happiness: -2 }); return; }
  player.hasGun = true;
  applyEffects(`You picked up a piece off the street for ${money(cost)}. It changes how the day feels.`, { money: -cost, streetRep: 4, happiness: 2, karma: -3, gangHeat: 1 }, "good");
}

function sellShoes() {
  const player = state.player;
  const pair = pick(["Yeezys", "Jordans", "Dunks", "Travis Scott AF1s", "Sambas"]);
  if (chance(58 + Math.floor(player.stats.smarts / 8))) {
    const profit = randomInt(80, 620);
    applyEffects(`Flipped a pair of ${pair} for ${money(profit)} profit.`, { money: profit, businessReputation: 1, happiness: 3 }, "good");
  } else {
    applyEffects(`The ${pair} sat. Had to drop the price below cost.`, { money: -80, smarts: 3 }, "bad");
  }
}

function hitALick() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 42 + Math.floor(player.streetRep / 3) + (player.hasGun ? 14 : 0);
  if (chance(odds)) {
    const take = randomInt(400, 4800);
    applyEffects(`You ran up on somebody and walked with ${money(take)}.`, { money: take, streetRep: 4, gangHeat: 3, karma: -8 }, "good");
  } else {
    applyEffects("Target was armed. You both made it out. The block knows now.", { health: -10, record: 2, gangHeat: 4, happiness: -8 }, "bad");
  }
}

function cardCloning() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 38 + Math.floor(player.stats.smarts / 5) + scamCityBonus(player.location);
  if (chance(odds)) {
    const take = randomInt(800, 8400);
    applyEffects(`Cloned a stack of cards and ran them at stores all weekend. ${money(take)} clean.`, { money: take, smarts: 4, karma: -8, businessReputation: -2 }, "good");
  } else {
    applyEffects("Loss prevention had cameras you didn't see. Card fraud charge.", { record: 2, money: -600, happiness: -10 }, "bad");
  }
}

function binRun() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 42 + Math.floor(player.stats.smarts / 4) + scamCityBonus(player.location);
  const mall = player.location.includes("Las Vegas") ? "the Strip outlets" : (player.location.includes("Los Angeles") || player.location.includes("Hollywood")) ? "the Beverly Center" : player.location.includes("Miami") ? "the Aventura Mall" : "a mall an hour from your apartment";
  if (chance(odds)) {
    const take = randomInt(1200, 12000);
    applyEffects(`You ran BINs through ${mall} and converted to gift cards before chargebacks hit. Walked with ${money(take)}.`, { money: take, smarts: 5, karma: -10, gangHeat: 1 }, "good");
  } else {
    applyEffects(`Card declined at the third register at ${mall}. You walked out. Security caught the tape.`, { record: 1, happiness: -6 }, "bad");
  }
}

function skimmerInstall() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 38 + Math.floor(player.stats.discipline / 6) + scamCityBonus(player.location);
  if (chance(odds)) {
    const take = randomInt(2200, 18000);
    applyEffects(`The skimmer pulled cards for two weeks before anyone flagged the pump. ${money(take)} downloaded clean.`, { money: take, smarts: 5, karma: -12 }, "good");
  } else {
    applyEffects("Station manager spotted the skimmer the next morning. Cameras had your plate.", { record: 3, money: -800, happiness: -10 }, "bad");
  }
}

function checkWashing() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(34 + Math.floor(player.stats.smarts / 6))) {
    const take = randomInt(1200, 8400);
    applyEffects(`The chemical lifted the ink clean. Rewrote the payee. Cashed ${money(take)}.`, { money: take, smarts: 3, karma: -8 }, "good");
  } else {
    applyEffects("Teller flagged the check. Federal mail-fraud territory.", { record: 3, happiness: -12 }, "bad");
  }
}

function cashAppScam() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(48 + Math.floor(player.stats.smarts / 5))) {
    const take = randomInt(120, 2400);
    applyEffects(`Phished a dozen inboxes. Eight bit. ${money(take)} into clean accounts.`, { money: take, smarts: 3, karma: -6 }, "good");
  } else {
    applyEffects("Victim was a fed's wife. They traced it to your number.", { record: 2, happiness: -8, money: -200 }, "bad");
  }
}

function casinoNight() {
  const player = state.player;
  player.risksTaken += 1;
  const stake = Math.min(player.money, randomInt(200, 1800));
  if (chance(46 + Math.floor(player.stats.smarts / 8))) {
    const win = Math.floor(stake * randomInt(120, 240) / 100);
    applyEffects(`Three tables, two cocktails, one cashier-with-a-suitcase moment. Up ${money(win)}.`, { money: win, fame: 2, happiness: 8 }, "good");
  } else {
    applyEffects(`Lost ${money(stake)} between blackjack and a roulette boredom-bet.`, { money: -stake, happiness: -6, discipline: 2 }, "bad");
  }
}

function blackjackTable() {
  const player = state.player;
  player.risksTaken += 1;
  const stake = Math.min(player.money, randomInt(100, 800));
  if (chance(48 + Math.floor(player.stats.smarts / 5))) {
    const win = Math.floor(stake * randomInt(140, 230) / 100);
    applyEffects(`You played basic strategy clean and walked with ${money(win)}.`, { money: win, smarts: 3, happiness: 6 }, "good");
  } else {
    applyEffects(`Dealer drew to 21 four hands in a row. Cards were rigged or you were tipsy.`, { money: -stake, happiness: -4, smarts: 2 }, "bad");
  }
}

function slotMachine() {
  const player = state.player;
  player.risksTaken += 1;
  const spend = Math.min(player.money, randomInt(60, 600));
  const roll = randomInt(1, 100);
  if (roll <= 3) {
    const jackpot = spend * randomInt(40, 120);
    applyEffects(`The bells went off. Jackpot of ${money(jackpot)}.`, { money: jackpot, fame: 4, happiness: 14 }, "good");
  } else if (roll <= 25) {
    const win = Math.floor(spend * 1.3);
    applyEffects(`Up a little on the slots: ${money(win - spend)}.`, { money: win - spend, happiness: 3 }, "good");
  } else {
    applyEffects(`Lost ${money(spend)} pulling the handle. The machine never gave back.`, { money: -spend, happiness: -5, discipline: 2 }, "bad");
  }
}

function sportsBetSingle() {
  const player = state.player;
  player.risksTaken += 1;
  const stake = Math.min(player.money, randomInt(50, 400));
  const game = pick(["the Lakers spread", "the Cowboys moneyline", "an over on a UFC card", "a Champions League prop", "an MLB run line"]);
  if (chance(50 + Math.floor(player.stats.smarts / 8))) {
    const win = Math.floor(stake * randomInt(180, 250) / 100);
    applyEffects(`${game} hit. Pocketed ${money(win - stake)}.`, { money: win - stake, smarts: 2, happiness: 5 }, "good");
  } else {
    applyEffects(`${game} died on a buzzer-beater. ${money(stake)} gone.`, { money: -stake, happiness: -5 }, "bad");
  }
}

function parlay10Leg() {
  const player = state.player;
  player.risksTaken += 1;
  const stake = Math.min(player.money, randomInt(50, 200));
  if (chance(4)) {
    const win = stake * randomInt(80, 300);
    applyEffects(`10-leg hit. ${money(win)} screenshot is going on the timeline forever.`, { money: win, fame: 8, happiness: 22 }, "good");
  } else {
    applyEffects(`Nine of ten. The tenth leg lost by half a point.`, { money: -stake, happiness: -7, smarts: 1 }, "bad");
  }
}

function onlinePokerGrind() {
  const player = state.player;
  player.risksTaken += 1;
  const stake = Math.min(player.money, randomInt(200, 1400));
  if (chance(48 + Math.floor(player.stats.smarts / 4) + Math.floor(player.stats.discipline / 6))) {
    const win = Math.floor(stake * randomInt(130, 220) / 100);
    applyEffects(`Six tables, four hours. Variance was kind. Up ${money(win - stake)}.`, { money: win - stake, smarts: 4, discipline: 3, happiness: 5 }, "good");
  } else {
    applyEffects(`Coolers all night. Aces ran into kings cracked twice.`, { money: -stake, smarts: 3, happiness: -6 }, "bad");
  }
}

function rouletteWheel() {
  const player = state.player;
  player.risksTaken += 1;
  const stake = Math.min(player.money, randomInt(100, 500));
  const bet = pick(["red", "black", "your birthday number", "all the corners", "the 0/00 split"]);
  const odds = bet.includes("number") ? 8 : bet.includes("0/00") ? 12 : 47;
  if (chance(odds)) {
    const win = stake * (bet.includes("number") ? 34 : 2);
    applyEffects(`Wheel landed your way on ${bet}. ${money(win)} payout.`, { money: win - stake, happiness: 8, fame: 2 }, "good");
  } else {
    applyEffects(`${bet} missed. Croupier swept the chips.`, { money: -stake, happiness: -4 }, "bad");
  }
}

function bookieAccount() {
  const player = state.player;
  player.hasBookie = true;
  applyEffects("You set up with a local bookie. Lines on text, payouts in cash.", { karma: -2, businessReputation: -1 }, "good");
}

function oweBookie() {
  const player = state.player;
  player.risksTaken += 1;
  const owed = Math.min(player.debt, 6000);
  if (player.money >= owed) {
    player.debt -= owed;
    applyEffects(`Paid the bookie ${money(owed)} in cash. They were cool about it.`, { money: -owed, happiness: -2, discipline: 3 }, "good");
  } else {
    applyEffects("You missed the deadline. Two guys came to the apartment.", { health: -16, happiness: -16, discipline: 3, record: 0 }, "bad");
  }
}

function counterfeitBills() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 24 + Math.floor(player.stats.smarts / 6) + scamCityBonus(player.location);
  if (chance(odds)) {
    const take = randomInt(1800, 14000);
    applyEffects(`The bills passed at dark bars and crowded events. ${money(take)} cleaned.`, { money: take, smarts: 4, karma: -14 }, "good");
  } else {
    applyEffects("Pen caught a hundred at a club. Secret Service is real.", { record: 4, money: -1200, happiness: -18 }, "bad");
  }
}

function bankJob() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 14 + Math.floor(player.stats.discipline / 6) + Math.floor(player.stats.smarts / 8);
  if (chance(odds)) {
    const take = randomInt(40000, 280000);
    applyEffects(`The bank job cleared. ${money(take)} in unmarked cash.`, { money: take, streetRep: 12, fame: 4, karma: -22 }, "good");
  } else {
    applyEffects("The job went sideways. SWAT was already on the rooftop.", { record: 4, health: -22, happiness: -22, karma: -16 }, "bad");
  }
}

function insuranceFraud() {
  const player = state.player;
  player.risksTaken += 1;
  if (chance(34 + Math.floor(player.stats.smarts / 6) + (player.hasLawyerOnRetainer ? 18 : 0))) {
    const payout = randomInt(2400, 38000);
    applyEffects(`The 'slip and fall' paid out ${money(payout)}.`, { money: payout, smarts: 3, karma: -8 }, "good");
  } else {
    applyEffects("The investigator pulled the parking-lot footage. Charges filed.", { record: 2, money: -2400, happiness: -10, karma: -8 }, "bad");
  }
}

function identityTheft() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 22 + Math.floor(player.stats.smarts / 5);
  if (chance(odds)) {
    const take = randomInt(1800, 22000);
    applyEffects(`You ran somebody else's credit for ${money(take)} before they noticed.`, { money: take, smarts: 4, karma: -15 }, "good");
  } else {
    applyEffects("Fraud unit traced the IP back to your apartment. Federal case open.", { record: 3, money: -2200, happiness: -12, karma: -12 }, "bad");
  }
}

function pokerNight() {
  const player = state.player;
  player.risksTaken += 1;
  const buyIn = Math.min(player.money, randomInt(500, 3500));
  const odds = 42 + Math.floor(player.stats.smarts / 6) + Math.floor(player.stats.discipline / 8);
  if (chance(odds)) {
    const pot = buyIn * randomInt(2, 5);
    applyEffects(`You read the table all night. Walked with ${money(pot)}.`, { money: pot - buyIn, smarts: 4, happiness: 6 }, "good");
  } else {
    applyEffects(`The table ate you. ${money(buyIn)} gone in two bad hands.`, { money: -buyIn, happiness: -6, discipline: 2 }, "bad");
  }
}

function dragRace() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 48 + Math.floor(player.stats.discipline / 6);
  if (chance(odds)) {
    const purse = randomInt(800, 4200);
    applyEffects(`You took the quarter mile by half a car. ${money(purse)} purse.`, { money: purse, fame: 3, streetRep: 2, happiness: 6 }, "good");
  } else {
    applyEffects("Transmission grenaded at the line. Tow bill plus pride bill.", { money: -1800, health: -4, happiness: -8 }, "bad");
  }
}

function buyStolenGoods() {
  const player = state.player;
  player.risksTaken += 1;
  const spend = Math.min(player.money, randomInt(300, 2400));
  const goods = pick(["a hot laptop", "iPhones still in boxes", "designer bags off the back of a truck", "a stripped catalytic converter", "concert wristbands"]);
  if (chance(56 + Math.floor(player.stats.smarts / 8))) {
    const flip = Math.floor(spend * randomInt(180, 320) / 100);
    applyEffects(`You moved ${goods} for ${money(flip)}.`, { money: flip - spend, streetRep: 2, businessReputation: 1, karma: -4 }, "good");
  } else {
    applyEffects(`${goods} turned out to be tracked. You ate the bag.`, { money: -spend, record: 1, happiness: -6 }, "bad");
  }
}

function smuggleRun() {
  const player = state.player;
  player.risksTaken += 1;
  const cargo = pick(["a kilo across the border", "designer fakes through customs", "untaxed liquor across state lines", "exotic pets nobody asked about", "an ounce taped to your hip"]);
  const odds = 32 + Math.floor(player.stats.discipline / 5) + Math.floor(player.stats.smarts / 8);
  if (chance(odds)) {
    const take = randomInt(2200, 24000);
    applyEffects(`You ran ${cargo} clean. ${money(take)} in your pocket.`, { money: take, streetRep: 4, karma: -10, happiness: 6 }, "good");
  } else {
    applyEffects(`Customs flagged the car. They found ${cargo}.`, { record: 3, money: -4000, happiness: -14, karma: -8 }, "bad");
  }
}

function pyramidScheme() {
  const player = state.player;
  player.risksTaken += 1;
  const product = pick(["essential oils", "an energy drink MLM", "a trading-bot affiliate", "leggings", "vitamin gummies", "a 'mentorship' program"]);
  if (chance(38 + Math.floor(player.stats.looks / 5))) {
    const take = randomInt(1800, 18000);
    applyEffects(`Your downline cleared ${money(take)} this month off ${product}.`, { money: take, businessReputation: -4, karma: -8, happiness: 4 }, "good");
  } else {
    applyEffects(`${product} collapsed. Your downline DMs you screaming.`, { money: -randomInt(500, 2400), karma: -8, businessReputation: -8, happiness: -10 }, "bad");
  }
}

function skydiveJump() {
  const player = state.player;
  player.risksTaken += 1;
  const cost = 320;
  if (player.money < cost) { applyEffects(`Skydive packs cost at least ${money(cost)}.`, { happiness: -1 }); return; }
  if (chance(94)) {
    applyEffects("You jumped out of a plane and lived. The week after feels different.", { money: -cost, happiness: 16, discipline: 4, fame: 2 }, "good");
  } else {
    applyEffects("Main chute failed. Reserve barely opened in time. You landed alive but broken.", { money: -cost, health: -32, happiness: -8, discipline: 8 }, "bad");
  }
}

function cliffJump() {
  const player = state.player;
  player.risksTaken += 1;
  const odds = 78 + Math.floor(player.stats.health / 8);
  if (chance(odds)) {
    applyEffects("You sent it off the cliff. The whole beach cheered when you came up.", { happiness: 12, fame: 3, streetRep: 1 }, "good");
  } else {
    applyEffects("You hit the water wrong. Lifeguards pulled you out.", { health: -22, happiness: -8 }, "bad");
  }
}

function artHeist() {
  state.player.risksTaken += 1;
  if (chance(18 + Math.floor(state.player.stats.smarts / 8) + Math.floor(state.player.stats.discipline / 10))) {
    const haul = randomInt(35000, 180000);
    applyEffects(`The heist somehow worked. You moved art worth ${money(haul)}.`, { money: haul, fame: 5, karma: -20 }, "good");
  } else {
    applyEffects("The heist failed spectacularly. Your record took a major hit.", { record: 3, money: -9000, happiness: -18, karma: -18 }, "bad");
  }
}
function abortionEvent() { riskyPayout(randomInt(80, 600), "abortionEvent hit clean.", "abortionEvent went sideways."); }
function adoptKid() { riskyPayout(randomInt(80, 600), "adoptKid hit clean.", "adoptKid went sideways."); }
function anniversaryDinner() { riskyPayout(randomInt(80, 600), "anniversaryDinner hit clean.", "anniversaryDinner went sideways."); }
function babymamaDrama() { riskyPayout(randomInt(80, 600), "babymamaDrama hit clean.", "babymamaDrama went sideways."); }
function bachelorParty() { riskyPayout(randomInt(80, 600), "bachelorParty hit clean.", "bachelorParty went sideways."); }
function becomeGodparent() { riskyPayout(randomInt(80, 600), "becomeGodparent hit clean.", "becomeGodparent went sideways."); }
function bestManRole() { riskyPayout(randomInt(80, 600), "bestManRole hit clean.", "bestManRole went sideways."); }
function buryAParent() { riskyPayout(randomInt(80, 600), "buryAParent hit clean.", "buryAParent went sideways."); }
function cheatOnPartner() { riskyPayout(randomInt(80, 600), "cheatOnPartner hit clean.", "cheatOnPartner went sideways."); }
function confrontSnake() { riskyPayout(randomInt(80, 600), "confrontSnake hit clean.", "confrontSnake went sideways."); }
function couplesTherapy() { riskyPayout(randomInt(80, 600), "couplesTherapy hit clean.", "couplesTherapy went sideways."); }
function custodyFight() { riskyPayout(randomInt(80, 600), "custodyFight hit clean.", "custodyFight went sideways."); }
function cutToxicFriend() { riskyPayout(randomInt(80, 600), "cutToxicFriend hit clean.", "cutToxicFriend went sideways."); }
function engagementParty() { riskyPayout(randomInt(80, 600), "engagementParty hit clean.", "engagementParty went sideways."); }
function familyReunion() { riskyPayout(randomInt(80, 600), "familyReunion hit clean.", "familyReunion went sideways."); }
function fosterTeen() { riskyPayout(randomInt(80, 600), "fosterTeen hit clean.", "fosterTeen went sideways."); }
function getCaughtCheating() { riskyPayout(randomInt(80, 600), "getCaughtCheating hit clean.", "getCaughtCheating went sideways."); }
function giveBirthEvent() { riskyPayout(randomInt(80, 600), "giveBirthEvent hit clean.", "giveBirthEvent went sideways."); }
function honeymoon() { riskyPayout(randomInt(80, 600), "honeymoon hit clean.", "honeymoon went sideways."); }
function ivfRound() { riskyPayout(randomInt(80, 600), "ivfRound hit clean.", "ivfRound went sideways."); }
function longAffair() { riskyPayout(randomInt(80, 600), "longAffair hit clean.", "longAffair went sideways."); }
function longDistanceMaintain() { riskyPayout(randomInt(80, 600), "longDistanceMaintain hit clean.", "longDistanceMaintain went sideways."); }
function mediateBeef() { riskyPayout(randomInt(80, 600), "mediateBeef hit clean.", "mediateBeef went sideways."); }
function miscarriageEvent() { riskyPayout(randomInt(80, 600), "miscarriageEvent hit clean.", "miscarriageEvent went sideways."); }
function moveParentIn() { riskyPayout(randomInt(80, 600), "moveParentIn hit clean.", "moveParentIn went sideways."); }
function openRelationshipTalk() { riskyPayout(randomInt(80, 600), "openRelationshipTalk hit clean.", "openRelationshipTalk went sideways."); }
function partnerPregnant() { riskyPayout(randomInt(80, 600), "partnerPregnant hit clean.", "partnerPregnant went sideways."); }
function reconcileAfterFight() { riskyPayout(randomInt(80, 600), "reconcileAfterFight hit clean.", "reconcileAfterFight went sideways."); }
function reconnectAbsentParent() { riskyPayout(randomInt(80, 600), "reconnectAbsentParent hit clean.", "reconnectAbsentParent went sideways."); }
function renewVows() { riskyPayout(randomInt(80, 600), "renewVows hit clean.", "renewVows went sideways."); }
function surpriseBirthday() { riskyPayout(randomInt(80, 600), "surpriseBirthday hit clean.", "surpriseBirthday went sideways."); }
function surrogacyEvent() { riskyPayout(randomInt(80, 600), "surrogacyEvent hit clean.", "surrogacyEvent went sideways."); }
function tryConceive() { riskyPayout(randomInt(80, 600), "tryConceive hit clean.", "tryConceive went sideways."); }
function weddingDay() { riskyPayout(randomInt(80, 600), "weddingDay hit clean.", "weddingDay went sideways."); }

function render() {
  const player = state.player;
  el.creator.hidden = Boolean(player);
  el.play.hidden = !player;
  if (typeof maybeShowFirstYearHint === "function") maybeShowFirstYearHint();

  if (!player) {
    el.statusLine.textContent = "Life simulation game";
    el.playerName.textContent = "New Life";
    el.playerBio.textContent = "Create a character to begin.";
    el.looksMeter.innerHTML = "";
    el.miniStats.innerHTML = "";
    el.meters.innerHTML = "";
    el.canonLog.innerHTML = "";
    return;
  }

  el.statusLine.textContent = player.alive ? "Life in progress" : "Life complete";
  el.playerName.textContent = player.name;
  el.playerBio.textContent = `${player.location || player.home} | ${player.school} | ${currentJob().title}`;
  el.chapterTitle.textContent = player.alive ? `Age ${player.age} | ${player.moves} moves left` : `Ended at age ${player.age}`;
  el.ageBtn.disabled = !player.alive;

  if (el.locationName) {
    const o = originOf(player.location);
    el.locationName.textContent = player.location;
    el.locationVibe.textContent = o.vibe.charAt(0).toUpperCase() + o.vibe.slice(1) + ".";
    el.locationMeta.innerHTML = "";
    if (player.spawnLabel) {
      const tag = document.createElement("span");
      tag.className = "loc-tag tag-class";
      tag.textContent = player.spawnLabel;
      el.locationMeta.append(tag);
    }
    if (player.personalityLabel) {
      const vTag = document.createElement("span");
      vTag.className = "loc-tag tag-vibe";
      vTag.textContent = player.personalityLabel;
      el.locationMeta.append(vTag);
    }
    if (player.traits && typeof Traits !== "undefined") {
      const t = player.traits;
      const ft = Math.floor(t.heightIn / 12);
      const inch = t.heightIn % 12;
      const tTag = document.createElement("span");
      tTag.className = "loc-tag tag-traits";
      tTag.textContent = `${ft}'${inch}" · ${t.looksTier}`;
      tTag.title = Traits.describe(t) + (Traits.flavorLines(t).length ? "\n" + Traits.flavorLines(t).join("\n") : "");
      el.locationMeta.append(tTag);
    }
    const moneyTag = document.createElement("span");
    moneyTag.className = "loc-tag tag-money";
    moneyTag.textContent = money(player.money);
    el.locationMeta.append(moneyTag);
    const ageTag = document.createElement("span");
    ageTag.className = "loc-tag tag-age";
    ageTag.textContent = `Age ${player.age}`;
    el.locationMeta.append(ageTag);
    if (player.birthYear) {
      const yearTag = document.createElement("span");
      yearTag.className = "loc-tag tag-year";
      yearTag.textContent = `${currentYear(player)}`;
      el.locationMeta.append(yearTag);
    }
  }

  renderAvatar();
  renderLooksMeter();

  el.miniStats.innerHTML = "";
  const chips = [
    `Cash ${money(player.money)}`,
    `Fame ${player.fame}`,
    `Looks ${looksScore()}`,
    `Fit ${player.fitnessLevel}`,
    `Food ${player.dietScore}`,
    `Local ${localRep(player)}`,
    player.socialPage ? `${player.followers.toLocaleString()} followers` : (player.handle || "no socials yet")
  ];
  const classes = classLabelList(player);
  const interests = topInterests(player);
  if (classes.length > 0) chips.push(`Classes ${classes.slice(0, 2).join(", ")}`);
  if (interests.length > 0) chips.push(`Into ${interests.join(", ")}`);
  if (player.debt > 0) chips.push(`Debt ${money(player.debt)}`);
  if (player.record > 0) chips.push(`Record ${player.record}`);
  if (player.streetRep > 0) chips.push(`Street ${player.streetRep}`);
  if (player.gang) chips.push(`Crew ${player.gang.rank}`, `Heat ${player.gangHeat}`);
  if (player.children.length > 0) chips.push(`Kids ${player.children.length}`);
  if (player.pets.length > 0) chips.push(`Pets ${player.pets.length}`);
  if (player.politicalCapital > 0) chips.push(`Influence ${player.politicalCapital}`);
  if (player.smokingLevel > 0) chips.push(`Smoking ${player.smokingLevel}`, `Years ${player.yearsSmoking}`);
  if (player.company) {
    chips.push(`CEO ${player.company.name}`, `Valuation ${money(player.company.valuation)}`);
  }
  chips.forEach(text => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = text;
    el.miniStats.append(chip);
  });

  renderMeters();
  renderTabs();
  renderCanonEvents();
  renderTimeline();
  renderActivities();
  renderAssets();
  renderPeople();
}

const statTooltips = {
  health: "Health — affects death rolls, job stamina, athletic events. Low health = early death.",
  happiness: "Happiness — affects depression events, decision quality, suicide risk under 20.",
  smarts: "Smarts — affects college, job hiring, negotiation outcomes, investment gains.",
  looks: "Looks — affects hiring odds, salary, romance success, follower growth, brand deals.",
  discipline: "Discipline — affects long-term wins (career ladder, sobriety, recovery). Low discipline = spiral risk."
};

function renderMeters() {
  el.meters.innerHTML = "";
  statDefs.forEach(([key, label]) => {
    const value = state.player.stats[key];
    const meter = document.createElement("button");
    meter.type = "button";
    meter.className = `meter stat-button ${state.focusedStat === key ? "active" : ""}`;
    meter.title = statTooltips[key] || `Click for ${label} actions`;
    meter.innerHTML = `
      <div class="meter-label"><strong>${label}</strong><span>${value}%</span></div>
      <div class="track"><div class="fill" style="width: ${value}%"></div></div>
    `;
    meter.addEventListener("click", () => {
      state.focusedStat = key;
      state.activeCategory = statCategoryMap[key] || "mind";
      renderActivities();
      renderMeters();
    });
    el.meters.append(meter);
  });
}

// Hometown look biases — character defaults reflect where they're from.
// Skin codes map to avataaarsMap.skin (skin-1 light → skin-2 deep).
// Hair codes map to avataaarsMap.hair. Hair color hex is used directly.
const hometownLookBias = {
  "Los Angeles, CA":      { skins: ["skin-1","skin-3","skin-5"], hairs: ["fade","curls","waves"], hairColors: ["#1a1210","#251927","#6b3f28"] },
  "Skid Row, Los Angeles":{ skins: ["skin-2","skin-3"],          hairs: ["fade","locs","buzz"], hairColors: ["#1a1210","#251927"] },
  "Hollywood, Los Angeles":{skins: ["skin-1","skin-4","skin-5"], hairs: ["bob","waves","curls"], hairColors: ["#c8923e","#6b3f28","#251927"] },
  "Compton, CA":          { skins: ["skin-2","skin-3"],          hairs: ["fade","locs","curls"], hairColors: ["#1a1210","#251927"] },
  "New York City, NY":    { skins: ["skin-1","skin-2","skin-3","skin-5"], hairs: ["fade","curls","bob","waves"], hairColors: ["#1a1210","#251927","#6b3f28"] },
  "Brooklyn, NY":         { skins: ["skin-2","skin-3","skin-5"], hairs: ["locs","fade","curls"], hairColors: ["#1a1210","#251927"] },
  "The Bronx, NY":        { skins: ["skin-3","skin-5"],          hairs: ["fade","curls","locs"], hairColors: ["#1a1210","#251927","#6b3f28"] },
  "Chicago, IL":          { skins: ["skin-2","skin-3"],          hairs: ["fade","curls","bob"],  hairColors: ["#1a1210","#251927"] },
  "South Side, Chicago":  { skins: ["skin-2","skin-3"],          hairs: ["fade","locs"],         hairColors: ["#1a1210","#251927"] },
  "Atlanta, GA":          { skins: ["skin-2","skin-3"],          hairs: ["fade","locs","curls"], hairColors: ["#1a1210","#251927"] },
  "Miami, FL":            { skins: ["skin-3","skin-5"],          hairs: ["waves","curls","fade"],hairColors: ["#1a1210","#251927","#6b3f28"] },
  "Houston, TX":          { skins: ["skin-2","skin-3","skin-5"], hairs: ["fade","curls","locs"], hairColors: ["#1a1210","#251927"] },
  "Las Vegas, NV":        { skins: ["skin-1","skin-3","skin-5"], hairs: ["fade","curls","bob"],  hairColors: ["#1a1210","#251927","#c8923e"] },
  "Mexico City, Mexico":  { skins: ["skin-3","skin-5"],          hairs: ["fade","waves","bob"],  hairColors: ["#1a1210","#251927","#6b3f28"] },
  "Medellín, Colombia":   { skins: ["skin-3","skin-5"],          hairs: ["waves","curls","fade"],hairColors: ["#1a1210","#6b3f28"] },
  "Rio de Janeiro, Brazil":{skins: ["skin-3","skin-5"],          hairs: ["curls","waves","locs"],hairColors: ["#1a1210","#6b3f28"] },
  "London, UK":           { skins: ["skin-1","skin-2","skin-4"], hairs: ["bob","waves","fade"],  hairColors: ["#1a1210","#6b3f28","#c8923e"] },
  "Paris, France":        { skins: ["skin-1","skin-4","skin-5"], hairs: ["bob","waves","curls"], hairColors: ["#1a1210","#6b3f28","#c8923e"] },
  "Tokyo, Japan":         { skins: ["skin-1","skin-4"],          hairs: ["bob","waves","fade"],  hairColors: ["#1a1210"] },
  "Seoul, South Korea":   { skins: ["skin-1","skin-4"],          hairs: ["bob","waves","fade"],  hairColors: ["#1a1210"] },
  "Dubai, UAE":           { skins: ["skin-3","skin-5"],          hairs: ["fade","waves"],        hairColors: ["#1a1210","#251927"] }
};

function pickHometownLook(location) {
  const bias = hometownLookBias[location];
  const _pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  if (!bias) {
    return {
      skin: _pick(["skin-1","skin-2","skin-3","skin-4","skin-5"]),
      hair: _pick(["fade","curls","bob","locs","waves"]),
      hairColor: _pick(["#1a1210","#251927","#6b3f28","#c8923e"])
    };
  }
  return { skin: _pick(bias.skins), hair: _pick(bias.hairs), hairColor: _pick(bias.hairColors) };
}

const avataaarsMap = {
  // Maps old keys → DiceBear `personas` style values.
  // Skin/hair colors stay as free hex (personas accepts hex directly).
  skin: {
    "skin-1": "f4d6c3",
    "skin-2": "5b3925",
    "skin-3": "a36a47",
    "skin-4": "f5c5a4",
    "skin-5": "c98c5e"
  },
  hair: {
    fade: "fade",
    curls: "curly",
    bob: "bobCut",
    locs: "curlyBun",
    buzz: "buzzcut",
    waves: "shortCombover"
  },
  hairColor: {
    "#251927": "2c1b18",
    "#1a1210": "090806",
    "#6b3f28": "724133",
    "#c8923e": "d6b370",
    "#b54657": "c93305",
    "#6f78ff": "b58143"
  },
  // Outfit just sets a clothing color now (personas doesn't differentiate garment shapes).
  outfit: {
    hoodie: ["", "ff5c5c"],
    streetwear: ["", "5199e4"],
    preppy: ["", "f0c94f"],
    goth: ["", "262e33"],
    sport: ["", "65c9ff"],
    suit: ["", "545454"]
  },
  // Personas has just mouth + eyes (no separate eyebrows).
  expression: {
    chill:   { mouth: "smile",     eyes: "open" },
    smile:   { mouth: "bigSmile",  eyes: "happy" },
    smirk:   { mouth: "smirk",     eyes: "wink" },
    serious: { mouth: "lips",      eyes: "open" },
    spark:   { mouth: "bigSmile",  eyes: "happy" },
    oof:     { mouth: "surprise",  eyes: "open" },
    sigma:   { mouth: "lips",      eyes: "open" },
    cooked:  { mouth: "frown",     eyes: "sleep" },
    npc:     { mouth: "lips",      eyes: "open" },
    caught:  { mouth: "surprise",  eyes: "open" },
    silly:   { mouth: "bigSmile",  eyes: "wink" },
    evil:    { mouth: "smirk",     eyes: "wink" },
    ltaken:  { mouth: "frown",     eyes: "sleep" },
    sleepy:  { mouth: "smile",     eyes: "sleep" }
  }
};

const _avatarUrlCache = new Map();
function buildAvatarURL(avatar, name) {
  avatar = avatar || {};
  const skinColor = avatar._skinHex || avataaarsMap.skin[avatar.skin] || "f4d6c3";
  const hairColor = avatar._hairColorHex || avataaarsMap.hairColor[avatar.hairColor] || "2c1b18";
  const isBald = avatar._topOverride === "BALD";
  const hair = isBald ? "bald" : (avatar._topOverride || avataaarsMap.hair[avatar.hair] || "fade");
  const outfitMap = avataaarsMap.outfit[avatar.outfit];
  const clothingColor = avatar._clothingColorHex || (outfitMap && outfitMap[1]) || "ff5c5c";
  const expBase = avataaarsMap.expression[avatar._expression || avatar.expression] || avataaarsMap.expression.chill;
  const mouth = avatar._mouthOverride || expBase.mouth;
  const eyes = avatar._eyesOverride || expBase.eyes;
  const nose = avatar._noseOverride || "mediumRound";
  const body = avatar._bodyOverride || "squared";
  const seed = encodeURIComponent(name || "Run");
  const cacheKey = `${seed}|${skinColor}|${hair}|${hairColor}|${mouth}|${eyes}|${nose}|${body}|${clothingColor}|${avatar._facialHair || ""}`;
  if (_avatarUrlCache.has(cacheKey)) return _avatarUrlCache.get(cacheKey);
  const params = new URLSearchParams({
    seed, skinColor, hair, hairColor, mouth, eyes, nose, body, clothingColor,
    backgroundColor: "transparent", radius: "0",
    facialHairProbability: avatar._facialHair ? "100" : "0"
  });
  if (avatar._facialHair) params.set("facialHair", avatar._facialHair);
  const url = `https://api.dicebear.com/9.x/personas/svg?${params.toString()}`;
  if (_avatarUrlCache.size > 200) _avatarUrlCache.clear();
  _avatarUrlCache.set(cacheKey, url);
  return url;
}

function contextualAvatar() {
  const player = state.player;
  const base = { ...(player.avatar || {}) };
  if (player.inJail) {
    base._clothingOverride = "shirtScoopNeck";
    base._clothesColorOverride = "ff8b27";
    base.expression = "serious";
    return base;
  }
  const officeJobs = new Set(["mayor", "councilmember", "schoolboard", "senate", "congress", "ceo"]);
  if (officeJobs.has(player.jobId)) { base.outfit = "suit"; return base; }
  if (player.company && player.jobId === "ceo") { base.outfit = "suit"; return base; }
  const cat = state.activeCategory;
  if (cat === "foodfit") base.outfit = "sport";
  else if (cat === "business") base.outfit = "suit";
  else if (cat === "vices" || cat === "street") base.outfit = "streetwear";
  else if (cat === "fame" || cat === "socialmedia") base.outfit = base.outfit || "streetwear";
  return base;
}

function ageAwareAvatar(player = state.player) {
  const av = contextualAvatar();
  const age = player.age || 0;
  const score = (typeof looksScore === "function") ? looksScore() : (player.stats?.looks || 50);
  const stats = player.stats || {};
  const quirks = player.quirks || {};
  const out = { ...av, _scale: 1, _expression: av._expression || av.expression };

  if (age <= 2) {
    out._topOverride = "BALD";
    out._mouthOverride = "pacifier";
    out._eyesOverride = "happy";
    out._noseOverride = "smallRound";
    out._bodyOverride = "small";
    out._skinHex = "ffd6c0";
    out._scale = 0.65;
  }
  else if (age <= 9) {
    out._mouthOverride = "bigSmile";
    out._eyesOverride = "happy";
    out._noseOverride = "smallRound";
    out._bodyOverride = "small";
    out._scale = 0.85;
  }
  else if (age <= 17) { out._scale = 0.95; out._expression = score >= 60 ? "smirk" : "chill"; }
  else if (age >= 40 && age <= 59) {
    out._hairColorHex = "857060";
    if (chance(45)) out._facialHair = "shadow";
  }
  else if (age >= 60) {
    out._hairColorHex = "d6d2cf";
    out._facialHair = "walrus";
    out._noseOverride = "wrinkles";
    out._expression = score >= 70 ? "smile" : "chill";
  }

  if (age >= 12) {
    if (score >= 88) out._expression = age <= 28 ? "smirk" : "smile";
    else if (score <= 28) {
      out._mouthOverride = out._mouthOverride || "frown";
      out._eyesOverride = out._eyesOverride || "sleep";
      
    }
  }

  if (age >= 10 && (stats.smarts || 0) < 32 && (stats.discipline || 0) < 32 && score < 40) {
    out._mouthOverride = "surprise"; out._eyesOverride = "sleep"; 
  }
  if ((player.smokingLevel || 0) > 50 && age >= 16) {
    out._mouthOverride = "frown";
    if (age >= 30 && !out._hairColorHex) out._hairColorHex = "5a4a40";
  }
  if ((stats.health || 50) < 25 && age >= 10) {
    out._mouthOverride = "frown"; out._eyesOverride = "closed"; 
  }
  if (quirks.cancer) { out._topOverride = "BALD"; out._facialHair = null; out._mouthOverride = "frown"; out._eyesOverride = "open"; }
  if (quirks.bald) out._topOverride = "BALD";
  if (quirks.crazyHair || ((player.fame || 0) > 70 && age >= 16 && !quirks.bald && !quirks.cancer)) {
    out._topOverride = pick(["froBand", "fro", "miaWallace", "curvy", "dreads"]);
  }
  if (quirks.tattoos && age >= 16) out._eyesOverride = "sunglasses";
  if ((player.fame || 0) > 60 && age >= 16) out._eyesOverride = "sunglasses";
  if (age >= 22 && score >= 75 && (stats.discipline || 0) >= 70) out._expression = "serious";

  return out;
}

function lookDescriptor(player = state.player) {
  if (!player) return "";
  const age = player.age || 0;
  const score = (typeof looksScore === "function") ? looksScore() : (player.stats?.looks || 50);
  const stats = player.stats || {};
  const quirks = player.quirks || {};
  const bits = [];
  if (age <= 2) bits.push("baby");
  else if (age <= 9) bits.push("kid");
  else if (age <= 17) bits.push("teen");
  else if (age <= 39) bits.push(`${age}-year-old`);
  else if (age <= 59) bits.push("middle-aged");
  else bits.push("old timer");
  if (player.inJail) bits.push("locked up");
  if (quirks.cancer) bits.push("in treatment");
  else if (quirks.bald) bits.push("bald");
  else if (quirks.crazyHair) bits.push("loud hair");
  if (age >= 10 && (stats.smarts || 0) < 32 && (stats.discipline || 0) < 32 && score < 40) bits.push("mouth-breather");
  else if (score >= 88) bits.push(age <= 28 ? "sharp" : "still chopped");
  else if (score >= 70) bits.push("clean");
  else if (score <= 28) bits.push("rough");
  else if (score <= 45) bits.push("mid");
  if ((player.smokingLevel || 0) > 50 && age >= 16) bits.push("yellow fingers");
  if ((stats.health || 50) < 25) bits.push("sick");
  if (quirks.tattoos) bits.push("tatted");
  if ((player.fame || 0) > 60) bits.push("famous");
  return bits.join(" · ");
}

function renderAvatar() {
  const player = state.player;
  const avatar = ageAwareAvatar(player);
  if (el.playerPortraitImg) {
    el.playerPortraitImg.src = buildAvatarURL(avatar, player.name);
    el.playerPortraitImg.style.transform = `scale(${avatar._scale || 1})`;
    el.playerPortraitImg.style.transformOrigin = "center bottom";
    el.playerPortraitImg.style.transition = "transform 350ms ease";
    const portraitWrap = el.playerPortraitImg.closest(".portrait");
    if (portraitWrap) portraitWrap.classList.toggle("portrait--jail", Boolean(player.inJail));
  }
  const descTarget = document.querySelector("#lookDescriptor");
  if (descTarget) descTarget.textContent = lookDescriptor(player);
}

function looksScore() {
  const player = state.player;
  const outfitBonus = hasAsset("nikeFit") ? 5 : 0;
  const healthBonus = Math.floor((player.stats.health - 50) / 8);
  const fitnessBonus = Math.floor(player.fitnessLevel / 8);
  const dietBonus = Math.floor((player.dietScore - 50) / 10);
  return clamp(player.stats.looks + outfitBonus + healthBonus + fitnessBonus + dietBonus);
}

function looksLabel(score) {
  if (score >= 92) return "Legendary";
  if (score >= 80) return "Head-turner";
  if (score >= 66) return "Clean";
  if (score >= 50) return "Regular";
  if (score >= 35) return "Rough week";
  return "Down bad";
}

function renderLooksMeter() {
  const score = looksScore();
  el.looksMeter.innerHTML = `
    <div class="score-row">
      <span>Looks Meter</span>
      <strong>${score}</strong>
    </div>
    <div class="track"><div class="fill" style="width: ${score}%"></div></div>
    <span>${looksLabel(score)} | fitness ${state.player.fitnessLevel} | diet ${state.player.dietScore}</span>
  `;
}

function renderCanonEvents() {
  el.canonLog.innerHTML = "";
  const events = state.player.canonEvents || [];
  if (events.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = "<strong>0</strong><span>No canon events yet.</span>";
    el.canonLog.append(li);
    return;
  }
  events.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.age}</strong><span>${item.text}</span>`;
    if (item.tone === "bad") li.style.color = "#ffc2bd";
    el.canonLog.append(li);
  });
}

function renderTabs() {
  document.querySelectorAll(".tab").forEach(button => {
    const active = button.dataset.tab === state.activeTab;
    button.classList.toggle("active", active);
    document.querySelector(`#${button.dataset.tab}Screen`).classList.toggle("active", active);
  });
}

function renderTimeline() {
  el.timeline.innerHTML = "";
  state.player.history.forEach(item => {
    const li = document.createElement("li");
    const text = item.tone === "good" ? `<b>${item.text}</b>` : item.text;
    li.innerHTML = `<strong>${item.age}</strong><span>${text}</span>`;
    if (item.tone === "bad") li.style.color = "#ffc2bd";
    el.timeline.append(li);
  });
}

const categoryAgeWindow = {
  little:      { min: 0,  max: 7  },
  teen:        { min: 12, max: 24 },
  school:      { min: 4 },
  classes:     { min: 6,  max: 24 },
  mind:        { min: 6  },
  foodfit:     { min: 6  },
  social:      { min: 3  },
  fame:        { min: 10 },
  socialmedia: { min: 10 },
  money:       { min: 12 },
  stores:      { min: 8  },
  city:        { min: 6  },
  hobby:       { min: 5  },
  peaceful:    { min: 8  },
  adventure:   { min: 12 },
  street:      { min: 14 },
  vices:       { min: 14 },
  business:    { min: 14 },
  legal:       { min: 16 },
  politics:    { min: 18 },
  risk:        { min: 14 }
};

function categoryAvailable(category, player) {
  if (player.inJail && category.id !== "legal") return false;
  if (category.id === "socialmedia" && currentYear(player) < 2010) return false;
  const window = categoryAgeWindow[category.id];
  if (!window) return true;
  if (player.age < (window.min || 0)) return false;
  if (window.max !== undefined && player.age > window.max) return false;
  return true;
}

function renderActivities() {
  el.categoryList.innerHTML = "";
  el.activityList.innerHTML = "";
  renderAiChat();

  const ageGated = activityCategories.filter(category => categoryAvailable(category, state.player));

  let coreIds;
  if (state.player.inJail)           coreIds = ["legal"];
  else if (state.player.age <= 5)    coreIds = ["little", "social", "hobby", "stores"];
  else if (state.player.age <= 9)    coreIds = ["school", "classes", "city", "social", "hobby"];
  else if (state.player.age <= 13)   coreIds = ["school", "classes", "teen", "socialmedia", "hobby", "foodfit"];
  else if (state.player.age <= 17)   coreIds = ["school", "teen", "classes", "socialmedia", "street", "fame"];
  else if (state.player.age <= 22)   coreIds = ["teen", "school", "classes", "money", "fame", "business"];
  else if (state.player.age <= 28)   coreIds = ["school", "city", "money", "fame", "business", "social"];
  else                               coreIds = ["city", "mind", "social", "money", "business", "fame"];

  coreIds = coreIds.filter(id => ageGated.find(c => c.id === id));

  if (!state.showAllCategories && !coreIds.includes(state.activeCategory)) {
    state.activeCategory = coreIds[0] || ageGated[0]?.id;
  }
  const visibleCategories = state.showAllCategories
    ? ageGated
    : ageGated.filter(category => coreIds.includes(category.id) || category.id === state.activeCategory);

  visibleCategories.forEach(category => {
    const button = document.createElement("button");
    button.className = `category-button ${state.activeCategory === category.id ? "active" : ""}`;
    button.type = "button";
    button.role = "tab";
    button.setAttribute("aria-selected", state.activeCategory === category.id ? "true" : "false");
    button.title = `${category.name} — ${category.hint}`;
    button.setAttribute("aria-label", `${category.name}: ${category.hint}`);
    button.innerHTML = `<strong>${category.name}</strong><span>${category.hint}</span>`;
    button.addEventListener("click", () => {
      state.activeCategory = category.id;
      state.focusedStat = null;
      renderActivities();
      renderMeters();
    });
    el.categoryList.append(button);
  });

  const moreButton = document.createElement("button");
  moreButton.className = "category-button more-toggle";
  moreButton.type = "button";
  moreButton.innerHTML = `<strong>${state.showAllCategories ? "Less" : "More"}</strong><span>${state.showAllCategories ? "Hide extra paths" : "Show all paths"}</span>`;
  moreButton.addEventListener("click", () => {
    state.showAllCategories = !state.showAllCategories;
    renderActivities();
  });
  el.categoryList.append(moreButton);

  const category = activityCategories.find(item => item.id === state.activeCategory) || activityCategories[0];
  if (state.focusedStat) {
    const stat = statDefs.find(([key]) => key === state.focusedStat);
    const focus = document.createElement("article");
    focus.className = "focus-card";
    focus.innerHTML = `<strong>${stat?.[1] || "Stat"} actions</strong><span>Clicked from the profile. Pick a move below or hit More for the full map.</span>`;
    el.activityList.append(focus);
  }
  category.actions.forEach(action => {
    const available = action.available(state.player);
    const button = document.createElement("button");
    button.className = `action-card ${action.risky ? "risky" : ""}`;
    button.type = "button";
    button.disabled = !state.player.alive || state.player.moves <= 0 || !available;
    button.innerHTML = `<strong>${action.name}</strong><small>${action.text}</small>`;
    button.addEventListener("click", () => runAction(action));
    el.activityList.append(button);
  });
}

function renderAiChat() {
  if (!state.player) return;
  const player = state.player;
  el.aiMood.textContent = player.company ? "CEO mode" : player.streetRep > 8 ? "Street aware" : player.age <= 5 ? "Family era" : "Profile-aware";
  el.aiLog.innerHTML = "";
  const messages = player.aiMemory?.slice(-5) || [];
  if (messages.length === 0) {
    const empty = document.createElement("p");
    empty.className = "ai-message ai-bot";
    empty.textContent = "Ask me what to do next. I remember this life: classes, interests, jobs, crew pressure, followers, all that.";
    el.aiLog.append(empty);
    return;
  }
  messages.forEach(message => {
    const item = document.createElement("p");
    item.className = `ai-message ${message.role === "you" ? "ai-you" : "ai-bot"}`;
    item.textContent = message.text;
    el.aiLog.append(item);
  });
}

function eraTag(player) {
  const y = currentYear(player);
  if (y < 1990) return "the 80s";
  if (y < 2000) return "the 90s";
  if (y < 2010) return "the 2000s";
  if (y < 2020) return "the 2010s";
  if (y < 2030) return "the 2020s";
  return `${Math.floor(y/10)*10}s`;
}

function lifeAiReply(input) {
  const player = state.player;
  const text = input.toLowerCase();
  const interests = topInterests(player, 5);
  if (player.socialPage || player.followers > 0) interests.push("content");
  if (player.company) interests.push("business");
  if (player.fitnessLevel > 12) interests.push("fitness");
  if (player.streetRep > 5 || player.gang) interests.push("street");
  if (player.books > 0 || player.stats.smarts > 75) interests.push("school");
  const uniqueInterests = [...new Set(interests)];
  const classes = classLabelList(player);
  const personality = personalityOf(player);
  const o = originOf(player.location);
  const era = eraTag(player);
  const closeFriend = (player.relationships || []).filter(r => r.bond > 60 && r.type !== "family")[0];
  const partner = (player.relationships || []).find(r => r.type === "partner");

  // Travel/trip awareness
  if (player.currentTrip) {
    return `You're in ${player.currentTrip} right now. Don't waste the trip — go to the spots only locals know. Scenes unlock faster when you say yes to the weird invite.`;
  }

  if (text.includes("gang") || text.includes("crew")) {
    if (player.gang) return `You're tied to ${player.gang.name}. Loyalty ${player.gang.loyalty}, heat ${player.gangHeat}. Heat over 12 = move different. Loyalty under 40 = you can leave clean, but only with the right move.`;
    return player.streetRep > 10
      ? `${o.short} street rep is ${player.streetRep}. A crew would respect you fast. Just know: clean career doors close once you're in. Worth it for the right ones.`
      : "Crew stuff doesn't fire random. Build street rep first — neighborhood choices, hood time, friends in motion. Then offers come naturally.";
  }
  if (text.includes("celeb") || text.includes("famous")) {
    if (player.fame >= 30) return `${player.fame} fame is real. Celeb DMs start firing at 15+ and stack at 30+. Pull up to events, the rapper/NBA cousin scenes are waiting.`;
    return `Fame is ${player.fame}. Get to 15+ before celebs notice you. Post Online, Brand Deal, Audition, or have a Viral Overnight roll your way.`;
  }
  if (text.includes("class") || text.includes("school")) {
    if (classes.length) return `Lanes: ${classes.join(", ")}. Those unlock clubs, friends, college majors, and yearly drama specific to ${era}. Stack two, not five.`;
    if (player.age < 14) return `Pick lanes now: sports, music, coding, art, debate. ${era} kids who picked early ran circles around the ones who didn't.`;
    return "Classes create identity. Trade school, college, professional school each point your life different.";
  }
  if (text.includes("hobby") || text.includes("interest")) {
    return `Lean: ${uniqueInterests.slice(0, 3).join(", ") || "still open"}. Pick 2-3 and stay there long enough for the game to remember you for it.`;
  }
  if (text.includes("city") || text.includes("location") || text.includes("hometown") || text.includes("local")) {
    return `${o.short} (${o.vibe}). Local rep ${localRep(player)}. ${player.spawnLabel} spawns here mean ${player.spawnClass === "nepo" ? "you skip the come-up" : player.spawnClass === "survival" ? "every win counts double" : "the come-up is the story"}.`;
  }
  if (text.includes("money") || text.includes("rich") || text.includes("broke")) {
    if (player.age < 16) return "Too young for real money. Stack smarts, discipline, hobbies. Teen years pay it forward.";
    if (player.money < 500) return `${money(player.money)} is broke. Apply For Job, Freelance Contract, or Part-Time Shift — every dollar shifts the next event. Big money comes from compounding.`;
    if (player.money > 50000) return `${money(player.money)} is real money. Buy Stock Portfolio for passive, Start Company for upside, or Apartment/Condo to stop renting. Don't sit on cash.`;
    return "Stack one stable income with one risky upside: job + content, job + business, job + investing. Two streams = real life.";
  }
  if (text.includes("romance") || text.includes("love") || text.includes("date")) {
    if (partner) return `You're with ${partner.name} (bond ${partner.bond}). Family Day, Spend Time, Give Gift keep it stable. Propose at 80+ bond.`;
    if (player.age < 16) return "Too young for real romance. Crushes are coming. Looks + happiness shape who pulls up.";
    return `Single. Ask Someone Out (looks-weighted), or wait for a slow-romance roll. Looks ${looksScore()}, happiness ${player.stats.happiness} — that's the bar.`;
  }
  if (text.includes("drug") || text.includes("party") || text.includes("smoke")) {
    if (!isAdultUnlocked()) return "Adult content is gated. Confirm 18+ on the start screen if you want those scenes.";
    if (player.smokingLevel > 0) return `Smoking level ${player.smokingLevel}, ${player.yearsSmoking} years in. Quit before 40 if you want the health back. After 50, the lungs remember.`;
    return `Personality ${personality.label} weights you toward ${Object.keys(personality.sceneWeight || {}).join(", ")}-type scenes. The wilder choices unlock more, cost more.`;
  }
  if (text.includes("kid") || text.includes("child") || text.includes("baby")) {
    if (player.children.length > 0) return `You have ${player.children.length} kid(s). Family Day raises every bond. Christmas Morning event pops if you're present. Mentor them via choices, they'll matter at your funeral.`;
    return "Kids need stability: married + age 22+. Surprise Pregnancy can fire if you have a partner. Once you're in, your moves change.";
  }
  if (text.includes("die") || text.includes("death") || text.includes("end")) {
    if (player.age >= 65) return `${player.age} is in the death window. Health ${player.stats.health} matters now. The recap rolls cause from your actual life — smoke = lungs, low happiness = quiet, gang = crossfire.`;
    return `Death rolls start at 24 but mostly fire 65+. Cause comes from how you lived. Plan the legacy: kids, books, championships, company.`;
  }
  if (text.includes("year") || text.includes("when") || text.includes("era")) {
    return `${currentYear(player)} — ${era}. ${o.short}. Tracks from ${era} hit different. Y2K, election years, Carnival, and Super Bowl seasons trigger their own scenes.`;
  }
  if (text.includes("travel") || text.includes("trip") || text.includes("vacation")) {
    if (player.age < 18) return "Travel mostly unlocks at 18. 21+ opens Vegas (gambling), Dubai (alcohol), Croatia. Tokyo at 20.";
    return `Book International Trip in Adventure. ${money(player.money)} = ${availableDestinations(player).length} destinations open right now.`;
  }
  if (text.includes("friend") && closeFriend) {
    return `${closeFriend.name} is the closest. Bond ${closeFriend.bond}. Spend Time, Give Gift, Host Dinner keeps it. Watch for snake archetype — late betrayals happen.`;
  }

  // Default fallbacks read deepest context
  if (player.age <= 5) return `Early years POV. ${era} ${o.short} childhood — birthdays, daycare, family functions. Choices now seed personality.`;
  if (player.company) return `${player.company.name} (${companyStageName(player.company.stage)}) is the plot. Runway ${money(player.company.runway)}. Launch, pivot, or fundraise.`;
  if (classes.length) return `${classes[0]} is the lane. Game will spawn friends, rivals, clubs, and drama from it for the next 3-5 years.`;
  if (player.streetRep > 5) return `Street rep ${player.streetRep}. Crew offers, hood events, and risky money are queued. Recovery Meeting or Leave the Crew before age 30 if you want a clean adult life.`;
  if (player.gang) return `${player.gang.name} is the active plot. Loyalty ${player.gang.loyalty}, heat ${player.gangHeat}. Watch heat past 10.`;
  if (player.fame > 25) return `${player.fame} fame brings celebs, brand deals, magazine features. Cancellation also rolls — your old posts can come back.`;
  return `${personality.label} in ${o.short}, ${era}. Lean into what you already started — ${uniqueInterests.slice(0,2).join(" + ") || "pick a lane"} — and the game will spawn the rest.`;
}

async function sendAiMessage(event) {
  event.preventDefault();
  if (!state.player) return;
  const text = el.aiInput.value.trim();
  if (!text) return;
  state.player.aiMemory ??= [];
  state.player.aiMemory.push({ role: "you", text });
  el.aiInput.value = "";

  let reply;
  if (webllmEngine) {
    state.player.aiMemory.push({ role: "bot", text: "…thinking" });
    renderAiChat();
    try { reply = await webllmReply(text); }
    catch (e) { reply = lifeAiReply(text); }
    // Replace the placeholder with the real reply
    state.player.aiMemory[state.player.aiMemory.length - 1] = { role: "bot", text: reply };
  } else {
    reply = lifeAiReply(text);
    state.player.aiMemory.push({ role: "bot", text: reply });
  }
  state.player.aiMemory = state.player.aiMemory.slice(-18);
  saveGame();
  renderAiChat();
}

function advisorText() {
  const player = state.player;
  const weakStat = [...statDefs].sort((a, b) => player.stats[a[0]] - player.stats[b[0]])[0];
  if (player.age <= 5) return "Tiny era. Farm family bonds and canon moments. First birthday, family function, toy obsession.";
  if (player.debt > player.money + 2000) return "Debt is starting to steer the life. Budget, pay debt, or chase a safer job before risky moves.";
  if (player.record > 0) return "Record is blocking clean careers. Legal cleanup should be a priority before CEO/pilot/law paths.";
  if (player.gang && player.gangHeat > 7) return "Crew heat is getting loud. Broker peace, leave the crew, recover, or move before it starts choosing your future.";
  if (localRep(player) >= 18) return `You are known in ${originOf(player.location).short}. Use City actions for job leads, scene posts, and local opportunities.`;
  if (player.smokingLevel > 0 && player.stats.health < 55) return "Smoking plus low health is a bad combo. Try nicotine gum, quitting, therapy, or cardio.";
  if (player.company) return `${player.company.name} needs focus: launch if morale is decent, raise money if runway is low, pivot if launches keep missing.`;
  if ((player.classes || []).length > 0) return `Your class lane is ${classLabelList(player).join(", ")}. Stack matching clubs, internships, and friends so it becomes a real path.`;
  if (!player.socialPage && player.age >= 12) return "Start the social page early. Followers can turn into fame, money, and creator careers.";
  if (player.stats[weakStat[0]] < 45) return `${weakStat[1]} is the weak link. Click that stat and build it before it quietly ruins options.`;
  return "Balanced run. Build one identity: school/career, creator fame, street chaos, or CEO path. Random clicking makes a mid life.";
}

function renderAdvisorCard(category) {
  const card = document.createElement("article");
  card.className = "advisor-card";
  card.innerHTML = `
    <div>
      <strong>Life AI</strong>
      <span>${advisorText()}</span>
    </div>
    <button class="primary" type="button">Ask</button>
  `;
  card.querySelector("button").addEventListener("click", () => {
    addLog(`Life AI: ${advisorText()}`, "good");
    saveGame();
    renderTimeline();
  });
  el.activityList.append(card);
}

function renderAssets() {
  const player = state.player;
  el.assetsPanel.innerHTML = `
    <div class="asset-summary">
      <article class="asset-card"><span>Cash</span><strong>${money(player.money)}</strong></article>
      <article class="asset-card"><span>Net worth</span><strong>${money(netWorth())}</strong></article>
      <article class="asset-card"><span>Debt</span><strong>${money(player.debt)}</strong></article>
      <article class="asset-card"><span>Annual pay</span><strong>${money(annualPay())}</strong></article>
    </div>
    <div class="asset-stack" id="companyPanel"></div>
    <div class="asset-stack" id="ownedAssets"></div>
    <div class="asset-stack" id="shopAssets"></div>
  `;

  const companyPanel = document.querySelector("#companyPanel");
  if (player.company) {
    const company = player.company;
    const card = document.createElement("article");
    card.className = "asset-card company-card";
    card.innerHTML = `
      <strong>${company.name}</strong>
      <span>${companyStageName(company.stage)} ${company.sector} company | ${company.product}</span>
      <span>Valuation ${money(company.valuation)} | Runway ${money(company.runway)} | Equity ${company.equity}%</span>
      <span>${company.employees} employees | ${company.morale}% morale | ${company.launches} launches</span>
    `;
    companyPanel.append(card);
  }

  const owned = document.querySelector("#ownedAssets");
  if (player.assets.length === 0) {
    const empty = document.createElement("article");
    empty.className = "asset-card";
    empty.innerHTML = "<strong>No assets yet</strong><span>Buy something useful when you have the cash.</span>";
    owned.append(empty);
  } else {
    player.assets.forEach(asset => {
      const card = document.createElement("article");
      card.className = "asset-card";
      card.innerHTML = `
        <strong>${asset.name}</strong>
        <span>Estimated value ${money(asset.value)}</span>
        <div class="card-row"><button class="primary" type="button">Sell</button></div>
      `;
      card.querySelector("button").addEventListener("click", () => sellAsset(asset));
      owned.append(card);
    });
  }

  const shop = document.querySelector("#shopAssets");
  // Filter: show only assets unlocked at current age AND not already owned
  // Plus one "next unlock" hint card so player knows what's coming
  const available = store.filter(item => player.age >= item.minAge && !hasAsset(item.id));
  const upcoming = store.filter(item => player.age < item.minAge && !hasAsset(item.id))
    .sort((a, b) => a.minAge - b.minAge);

  if (available.length === 0 && upcoming.length === 0) {
    const empty = document.createElement("article");
    empty.className = "asset-card";
    empty.innerHTML = "<strong>You own everything.</strong><span>Mogul status.</span>";
    shop.append(empty);
  }

  available.forEach(item => {
    const button = document.createElement("button");
    button.className = "action-card";
    button.type = "button";
    const canAfford = player.money >= item.cost;
    button.disabled = !player.alive || !canAfford;
    button.innerHTML = `<strong>Buy ${item.name}</strong><small>${money(item.cost)}${canAfford ? "" : " — short"}</small>`;
    button.addEventListener("click", () => {
      buyAsset(item);
      finishTurn();
    });
    shop.append(button);
  });

  // Show the next 1 upcoming so player has goal visibility
  if (upcoming.length > 0) {
    const next = upcoming[0];
    const teaser = document.createElement("article");
    teaser.className = "asset-card";
    teaser.style.opacity = "0.6";
    teaser.innerHTML = `<strong>Next: ${next.name}</strong><span>Unlocks at age ${next.minAge} — ${money(next.cost)}</span>`;
    shop.append(teaser);
  }
}

const voiceTags = ["rough", "warm", "dry", "excited", "distant"];
function assignVoiceTag(person) {
  if (person.voice) return;
  // Heritage / personality / type seed voice
  if (person.type === "family" && person.arc === "anchor") person.voice = "warm";
  else if (person.type === "family") person.voice = pick(["warm", "dry", "rough"]);
  else if (person.arc === "snake") person.voice = "dry";
  else if (person.arc === "spiral") person.voice = "distant";
  else if (person.arc === "star") person.voice = "excited";
  else person.voice = pick(voiceTags);
}

function dayOneCount(player = state.player) {
  return (player.relationships || []).filter(p => p.dayOne).length;
}

function archetypeHint(person) {
  // Don't reveal arc directly — give a vibe
  if (!person.arc) return "—";
  const hints = {
    anchor: "Always shows up",
    loyal: "Reliable",
    snake: "Smiling lately",
    spiral: "Going through it",
    star: "Getting big",
    ghost: "Hard to reach",
    builder: "Building something"
  };
  return hints[person.arc] || "—";
}

function openNpcCard(person) {
  if (!person) return;
  const dialog = document.querySelector("#npcCardDialog");
  if (!dialog) return;
  document.querySelector("#npcCardName").textContent = person.name;
  document.querySelector("#npcCardRole").textContent = person.role;
  document.querySelector("#npcCardVibe").textContent = `Vibe: ${person.voice || "—"} · ${archetypeHint(person)}`;
  document.querySelector("#npcCardBond").textContent = `${person.bond}% bond · ${person.arcYears || 0} years in`;
  // Dayone star
  const dayoneBtn = document.querySelector("#npcCardDayone");
  if (dayoneBtn) {
    dayoneBtn.textContent = person.dayOne ? "★ Day-one" : "☆ Mark as day-one";
    dayoneBtn.onclick = () => {
      if (!person.dayOne && dayOneCount() >= 3) {
        alert("Day-ones cap at 3. Drop one first.");
        return;
      }
      person.dayOne = !person.dayOne;
      dayoneBtn.textContent = person.dayOne ? "★ Day-one" : "☆ Mark as day-one";
      saveGame();
      renderPeople();
    };
  }
  // Action buttons
  const textBtn = document.querySelector("#npcCardText");
  const callBtn = document.querySelector("#npcCardCall");
  const confideBtn = document.querySelector("#npcCardConfide");
  if (textBtn) textBtn.onclick = () => { dialog.close(); textNpc(person); };
  if (callBtn) callBtn.onclick = () => { dialog.close(); callNpc(person); };
  if (confideBtn) confideBtn.onclick = () => { dialog.close(); confideInNpc(person); };
  try { dialog.showModal(); } catch (e) {}
}

function textNpc(person) {
  // Quick 1-exchange text moment
  const greetings = {
    warm: pick([`"hey love how you been"`, `"thinking of you ❤️"`, `"call me when you can"`]),
    rough: pick([`"yo"`, `"u up"`, `"pull up later"`]),
    dry: pick([`"interesting day"`, `"saw something you'd hate"`, `"call when free"`]),
    excited: pick([`"OMG GUESS WHAT"`, `"i have to tell you something"`, `"can we link tonight"`]),
    distant: pick([`"hey, been a min"`, `"long time"`, `"u good?"`])
  };
  const text = greetings[person.voice] || pick(Object.values(greetings).map(g => g[0]));
  showEvent({
    title: `${person.name} just texted`,
    text: () => text,
    choices: [
      { label: "Reply warm", run: () => { changeBond(person, 8); applyEffects(`You wrote back warm. ${person.name} replied within minutes.`, { happiness: 4, karma: 3 }, "good"); } },
      { label: "Reply short", run: () => { changeBond(person, 1); applyEffects(`Curt reply. They got the message.`, { discipline: 2 }); } },
      { label: "Leave on read", run: () => { changeBond(person, -10); applyEffects(`You left them on read. They saw the dots.`, { happiness: -2, karma: -2 }, "bad"); } }
    ]
  });
}

function callNpc(person) {
  // Multi-turn dialogue tree
  const opening = {
    warm: `${person.name} picked up on the second ring. "Hey baby, how you doing?"`,
    rough: `${person.name} answered. "What's good?"`,
    dry: `${person.name} answered after a long pause. "Yeah."`,
    excited: `${person.name} screamed "${state.player.name.toUpperCase()}!" before you said hi.`,
    distant: `${person.name} picked up. The line was quiet for a beat. "Hey."`
  };
  showEvent({
    title: `You called ${person.name}`,
    text: () => opening[person.voice] || `${person.name} picked up.`,
    choices: [
      { label: "Catch up properly", run: () => {
        changeBond(person, 12);
        // Open the second exchange
        setTimeout(() => showEvent({
          title: `Still on with ${person.name}`,
          text: () => person.voice === "warm" ? `"Tell me everything. I've been worried."` : person.voice === "rough" ? `"What's the actual move tho."` : `"How's the year been treating you?"`,
          choices: [
            { label: "Tell them what's really going on", run: () => { changeBond(person, 8); applyEffects(`You let your guard down. They listened. Bond locked tighter.`, { happiness: 12, karma: 4 }, "good"); } },
            { label: "Keep it surface", run: () => applyEffects(`Polite call, 22 minutes. Made you feel less alone but not seen.`, { happiness: 4 }) }
          ]
        }), 100);
      } },
      { label: "Make it quick", run: () => { changeBond(person, 3); applyEffects(`Five minute call. Both still busy. Fine.`, { happiness: 2 }); } },
      { label: "Hang up — bad timing", run: () => { changeBond(person, -4); applyEffects(`You bailed. They didn't say it but they noticed.`, { happiness: -2 }); } }
    ]
  });
}

function confideInNpc(person) {
  const reaction = {
    warm: `${person.name} listened all the way through. Held your hand. Didn't try to fix it.`,
    rough: `${person.name} let you talk. Then said two sentences that hit the mark.`,
    dry: `${person.name} listened. Made a joke at the end that helped more than advice would have.`,
    excited: `${person.name} reacted hard. Took your side immediately. May or may not be helpful.`,
    distant: `${person.name} was there but not fully. Their phone buzzed twice. The conversation drifted.`
  };
  changeBond(person, person.voice === "distant" ? -2 : 14);
  applyEffects(reaction[person.voice] || `${person.name} listened. The conversation helped.`, {
    happiness: person.voice === "distant" ? -4 : 12,
    karma: 5,
    smarts: 3
  }, person.voice === "distant" ? "bad" : "good");
}

const npcAvatarPalette = ["#c92a3f", "#d9a531", "#4f7ec7", "#7a8d4c", "#9a5cc4", "#c97a2a", "#3aa089", "#b94a7e"];
function npcAvatarColor(person) {
  let hash = 0;
  const s = (person.id || person.name || "x");
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return npcAvatarPalette[hash % npcAvatarPalette.length];
}

function renderPeople() {
  el.relationships.innerHTML = "";
  const list = state.player.relationships || [];
  if (!list.length) return;

  // Phone-style header
  const header = document.createElement("div");
  header.className = "people-phone-header";
  const dayOnes = list.filter(r => r.dayOne).length;
  header.innerHTML = `
    <span class="people-phone-title">People</span>
    <span class="people-phone-count">${list.length} contacts${dayOnes ? ` · ${dayOnes} day-one${dayOnes === 1 ? "" : "s"}` : ""}</span>
  `;
  el.relationships.append(header);

  const renderRow = (person) => {
    assignVoiceTag(person);
    const initial = (person.name || "?").trim().charAt(0).toUpperCase();
    const card = document.createElement("article");
    card.className = "person-card npc-card-clickable";
    if (person.dayOne) card.classList.add("npc-dayone");
    if (person.ghosted) card.classList.add("npc-ghosted");
    card.innerHTML = `
      <div class="npc-card-row">
        <span class="npc-avatar" style="background:${npcAvatarColor(person)}">${initial}</span>
        <div class="npc-card-meta">
          <strong>${person.name}${person.dayOne ? " ★" : ""}</strong>
          <span class="npc-card-sub">${person.role}</span>
        </div>
        <span class="npc-vibe-pill">${person.voice || "—"}</span>
      </div>
      <div class="track"><div class="fill" style="width: ${Math.max(0, Math.min(100, person.bond))}%"></div></div>
    `;
    card.addEventListener("click", () => openNpcCard(person));
    el.relationships.append(card);
  };

  // Day-ones first (the crew)
  const ones = list.filter(r => r.dayOne);
  const rest = list.filter(r => !r.dayOne);
  if (ones.length) {
    const sub = document.createElement("div");
    sub.className = "people-phone-subhead";
    sub.textContent = "★ Day-ones";
    el.relationships.append(sub);
    ones.forEach(renderRow);
  }
  if (rest.length) {
    if (ones.length) {
      const sub = document.createElement("div");
      sub.className = "people-phone-subhead";
      sub.textContent = "Everyone else";
      el.relationships.append(sub);
    }
    rest.forEach(renderRow);
  }
}

function saveGame() {
  if (!state.player) return;
  try {
    localStorage.setItem(currentSaveKey(), JSON.stringify(state.player));
    localStorage.setItem(currentSaveKey() + "_savedAt", String(Date.now()));
    if (typeof refreshSlotButtons === "function") refreshSlotButtons();
    if (typeof showSaveToast === "function") showSaveToast("Saved");
  } catch (e) {
    if (typeof showSaveToast === "function") showSaveToast("Save failed — storage full", true);
  }
}

let _saveToastTimer = null;
function showSaveToast(text, isError = false) {
  let toast = document.querySelector("#saveToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "saveToast";
    toast.className = "save-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.toggle("save-toast-error", Boolean(isError));
  toast.classList.add("show");
  clearTimeout(_saveToastTimer);
  _saveToastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function normalizePlayer(player) {
  player.version = SAVE_VERSION;
  player.identity = normalizeIdentity(player.identity);
  delete player.pronouns;
  player.handle = normalizeHandle(player.handle, player.name);
  player.avatar ??= {};
  player.avatar.skin ??= "skin-1";
  player.avatar.hair ??= "fade";
  player.avatar.hairColor ??= "#251927";
  player.avatar.outfit ??= "hoodie";
  player.avatar.expression ??= "chill";
  player.origin ??= player.home || "Los Angeles, CA";
  player.location ??= player.home || player.origin;
  player.home ??= player.location;
  player.personality ??= "calm";
  player.personalityLabel ??= personalityOf(player).label;
  player.salaryBonus ??= 0;
  player.licenses ??= [];
  player.certifications ??= [];
  player.trips ??= [];
  player.pets ??= [];
  player.children ??= [];
  player.books ??= 0;
  player.championships ??= 0;
  player.politicalCapital ??= 0;
  player.married ??= player.relationships?.some(person => person.type === "spouse") || false;
  player.businessReputation ??= 0;
  player.socialPage ??= false;
  player.followers ??= 0;
  player.posts ??= 0;
  player.viralHits ??= 0;
  player.dropout ??= player.school === "Dropped out";
  player.streetRep ??= 0;
  player.recovery ??= 0;
  player.fitnessLevel ??= 0;
  player.dietScore ??= 50;
  player.smokingLevel ??= 0;
  player.yearsSmoking ??= 0;
  player.quitAttempts ??= 0;
  player.company ??= null;
  player.companyExits ??= 0;
  player.classes ??= [];
  player.interests ??= {};
  player.afterSchool ??= [];
  player.gang ??= null;
  player.gangHeat ??= 0;
  player.crewExits ??= 0;
  player.cityRep ??= {};
  player.aiMemory ??= [];
  if (player.company) {
    player.company.stage ??= 1;
    player.company.employees ??= 1;
    player.company.valuation ??= 12000;
    player.company.runway ??= 0;
    player.company.morale ??= 55;
    player.company.equity ??= 100;
    player.company.launches ??= 0;
    player.company.scandals ??= 0;
    player.company.sector ??= "local retail";
    player.company.product ??= "first product";
  }
  player.assets ??= [];
  player.achievements ??= [];
  player.relationships ??= [];
  player.history ??= [];
  player.canonEvents ??= [];
  return player;
}

function loadGame() {
  const key = currentSaveKey();
  const raw = localStorage.getItem(key);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version >= 3 && parsed.stats && Array.isArray(parsed.history)) state.player = normalizePlayer(parsed);
    else localStorage.removeItem(key);
  } catch {
    localStorage.removeItem(key);
  }
}

// ============================================================
// META PROGRESS — persistent across all lives
// ============================================================
const META_KEY = "rib_metaProgress_v1";
function loadMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { livesLived: 0, totalAchievements: [], ancestors: [], unlocks: {}, longestLife: 0, richestNet: 0, ghosts: [] };
}
function saveMeta(meta) {
  try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch (e) {}
}
function metaUnlocked(id) {
  const meta = loadMeta();
  return Boolean(meta.unlocks && meta.unlocks[id]);
}
function recordLifeForMeta(player) {
  const meta = loadMeta();
  meta.livesLived = (meta.livesLived || 0) + 1;
  meta.longestLife = Math.max(meta.longestLife || 0, player.age);
  const worth = (typeof netWorth === "function") ? netWorth() : (player.money || 0);
  meta.richestNet = Math.max(meta.richestNet || 0, worth);
  meta.totalAchievements = Array.from(new Set([...(meta.totalAchievements || []), ...(player.achievements || [])]));

  // Carry forward as an ancestor record (for next-life surfacing)
  meta.ancestors = meta.ancestors || [];
  meta.ancestors.unshift({
    name: player.name,
    age: player.age,
    cause: player.causeOfDeath || "Cause unknown",
    spawnLabel: player.spawnLabel,
    home: player.home,
    canonHighlights: (player.canonEvents || []).slice(-5),
    fame: player.fame,
    karma: player.karma,
    achievements: player.achievements || [],
    classCareer: player.classCareer || null,
    jobId: player.jobId
  });
  meta.ancestors = meta.ancestors.slice(0, 10);

  // Carry forward NPCs who survived OR mattered (top bond) as "ghosts" — may surface in next life
  meta.ghosts = meta.ghosts || [];
  (player.relationships || [])
    .filter(r => r.type !== "pet" && (r.bond >= 70 || r.arc === "snake" || r.arc === "star"))
    .slice(0, 8)
    .forEach(r => {
      meta.ghosts.unshift({ name: r.name, role: r.role, arc: r.arc, bond: r.bond, fromLife: player.name });
    });
  meta.ghosts = meta.ghosts.slice(0, 24);

  // Compute new unlocks based on cumulative achievements + milestones
  meta.unlocks = meta.unlocks || {};
  const ach = meta.totalAchievements;
  if (meta.livesLived >= 1) meta.unlocks.preset_jdlo = true;
  if (meta.livesLived >= 3) meta.unlocks.preset_more = true;
  if (ach.includes("ceo") || ach.includes("exit")) meta.unlocks.fast_business = true;
  if (ach.includes("office")) meta.unlocks.political_lineage = true;
  if (ach.includes("crewPath") || ach.includes("skidrow")) meta.unlocks.street_smarts = true;
  if (ach.includes("famous")) meta.unlocks.born_with_followers = true;
  if (meta.richestNet >= 1000000) meta.unlocks.starting_trust = true;
  if (meta.longestLife >= 80) meta.unlocks.long_life_blood = true;
  if (meta.livesLived >= 5) meta.unlocks.legacy_mode = true;
  saveMeta(meta);
  return meta;
}

function resetGame() {
  localStorage.removeItem(currentSaveKey());
  if (typeof refreshSlotButtons === "function") refreshSlotButtons();
  state.player = null;
  state.activeTab = "life";
  state.activeCategory = "school";
  state.showAllCategories = false;
  state.focusedStat = null;
  render();
}

el.creator.addEventListener("submit", event => {
  event.preventDefault();
  createPlayer();
});

const presetCharacters = [
  {
    id: "jdlo",
    label: "JDLO (you)",
    blurb: "Working-class Bay kid. Catholic Latino. Real start.",
    form: { name: "Jordi", home: "Los Angeles, CA", identity: "Guy", classInput: "working", focusInput: "discipline", religionInput: "catholic", heritageInput: "latino", momJobInput: "service", dadJobInput: "laborer", skinInput: "skin-3", hairInput: "fade", hairColorInput: "#1a1210", outfitInput: "streetwear", expressionInput: "serious" }
  },
  {
    id: "malachi",
    label: "Malachi (the homie)",
    blurb: "Comfortable Hollywood. Calm operator energy.",
    form: { name: "Malachi", home: "Hollywood, Los Angeles", identity: "Guy", classInput: "comfortable", focusInput: "looks", religionInput: "none", heritageInput: "mixed", momJobInput: "executive", dadJobInput: "entrepreneur", skinInput: "skin-3", hairInput: "curls", hairColorInput: "#251927", outfitInput: "preppy", expressionInput: "chill" }
  },
  {
    id: "plug",
    label: "The Plug (Medellín)",
    blurb: "Struggling Medellín. Hustler father absent. Smart, fast.",
    form: { name: "Pablo", home: "Medellín, Colombia", identity: "Guy", classInput: "struggling", focusInput: "smarts", religionInput: "catholic", heritageInput: "latino", momJobInput: "service", dadJobInput: "hustler", skinInput: "skin-3", hairInput: "fade", hairColorInput: "#1a1210", outfitInput: "streetwear", expressionInput: "smirk" }
  },
  {
    id: "skidrow",
    label: "Skid Row Kid",
    blurb: "Survival mode. Skid Row LA. No safety net.",
    form: { name: "Marcus", home: "Skid Row, Los Angeles", identity: "Guy", classInput: "survival", focusInput: "health", religionInput: "christian", heritageInput: "black", momJobInput: "absent", dadJobInput: "absent", skinInput: "skin-2", hairInput: "locs", hairColorInput: "#1a1210", outfitInput: "hoodie", expressionInput: "serious" }
  },
  {
    id: "trustfund",
    label: "Trust Fund Brat",
    blurb: "Hollywood nepo. Born into the room.",
    form: { name: "Brooke", home: "Hollywood, Los Angeles", identity: "Girl", classInput: "nepo", focusInput: "looks", religionInput: "none", heritageInput: "white", momJobInput: "executive", dadJobInput: "executive", skinInput: "skin-4", hairInput: "bob", hairColorInput: "#c8923e", outfitInput: "preppy", expressionInput: "smirk" }
  },
  {
    id: "the6",
    label: "The 6 Prince",
    blurb: "Comfortable kid w/ artist parents. Music lane.",
    form: { name: "Aubrey", home: "London, UK", identity: "Guy", classInput: "comfortable", focusInput: "looks", religionInput: "jewish", heritageInput: "mixed", momJobInput: "teacher", dadJobInput: "musician", skinInput: "skin-3", hairInput: "buzz", hairColorInput: "#1a1210", outfitInput: "preppy", expressionInput: "smile" }
  },
  {
    id: "yeezy",
    label: "South Side Creative",
    blurb: "Chicago South Side. Teacher mom. Builder kid.",
    form: { name: "Kanye", home: "South Side, Chicago", identity: "Guy", classInput: "comfortable", focusInput: "smarts", religionInput: "christian", heritageInput: "black", momJobInput: "teacher", dadJobInput: "entrepreneur", skinInput: "skin-2", hairInput: "fade", hairColorInput: "#1a1210", outfitInput: "streetwear", expressionInput: "spark" }
  },
  {
    id: "akron",
    label: "Athlete From Nothing",
    blurb: "Survival start. Athletic. Basketball cheat code.",
    form: { name: "Bron", home: "Compton, CA", identity: "Guy", classInput: "survival", focusInput: "health", religionInput: "christian", heritageInput: "black", momJobInput: "service", dadJobInput: "absent", skinInput: "skin-2", hairInput: "buzz", hairColorInput: "#1a1210", outfitInput: "sport", expressionInput: "serious" }
  },
  {
    id: "siliconsuit",
    label: "Silicon Suit",
    blurb: "Nepo Dubai. Engineer brain, robot mouth.",
    form: { name: "Elon", home: "Dubai, UAE", identity: "Guy", classInput: "nepo", focusInput: "smarts", religionInput: "atheist", heritageInput: "white", momJobInput: "executive", dadJobInput: "entrepreneur", skinInput: "skin-4", hairInput: "fade", hairColorInput: "#6b3f28", outfitInput: "suit", expressionInput: "serious" }
  },
  {
    id: "houston",
    label: "Houston Wave",
    blurb: "Working class Houston. Music lane. Rage on stage.",
    form: { name: "Travis", home: "Houston, TX", identity: "Guy", classInput: "working", focusInput: "looks", religionInput: "christian", heritageInput: "black", momJobInput: "service", dadJobInput: "musician", skinInput: "skin-2", hairInput: "locs", hairColorInput: "#1a1210", outfitInput: "streetwear", expressionInput: "smirk" }
  },
  {
    id: "creator",
    label: "Carolina Creator",
    blurb: "Comfortable. Teacher mom. Content brain since 12.",
    form: { name: "Jimmy", home: "Atlanta, GA", identity: "Guy", classInput: "comfortable", focusInput: "discipline", religionInput: "christian", heritageInput: "white", momJobInput: "teacher", dadJobInput: "entrepreneur", skinInput: "skin-4", hairInput: "buzz", hairColorInput: "#6b3f28", outfitInput: "hoodie", expressionInput: "smile" }
  },
  {
    id: "pac",
    label: "East Coast Poet",
    blurb: "Brooklyn. Struggling. Spiritual mom, absent dad.",
    form: { name: "Pac", home: "Brooklyn, NY", identity: "Guy", classInput: "struggling", focusInput: "looks", religionInput: "spiritual", heritageInput: "black", momJobInput: "artist", dadJobInput: "absent", skinInput: "skin-2", hairInput: "buzz", hairColorInput: "#1a1210", outfitInput: "streetwear", expressionInput: "serious" }
  }
];

function applyPreset(presetId) {
  const preset = presetCharacters.find(p => p.id === presetId);
  if (!preset) return;
  const f = preset.form;
  const setSelect = (input, value) => {
    if (!input || value === undefined) return;
    const opt = Array.from(input.options || []).find(o => o.value === value || o.textContent === value);
    if (opt) input.value = opt.value;
  };
  if (el.nameInput && f.name) el.nameInput.value = f.name;
  setSelect(el.homeInput, f.home);
  setSelect(el.identityInput, f.identity);
  setSelect(el.classInput, f.classInput);
  setSelect(el.focusInput, f.focusInput);
  setSelect(el.religionInput, f.religionInput);
  setSelect(el.heritageInput, f.heritageInput);
  setSelect(el.momJobInput, f.momJobInput);
  setSelect(el.dadJobInput, f.dadJobInput);
  setSelect(el.skinInput, f.skinInput);
  setSelect(el.hairInput, f.hairInput);
  setSelect(el.hairColorInput, f.hairColorInput);
  setSelect(el.outfitInput, f.outfitInput);
  setSelect(el.expressionInput, f.expressionInput);
  document.querySelectorAll("[data-value-for]").forEach(span => {
    const key = span.getAttribute("data-value-for");
    const input = document.getElementById(key);
    if (!input) return;
    const opt = Array.from(input.options || []).find(o => o.value === input.value);
    if (opt) span.textContent = opt.textContent;
  });
  if (typeof renderPreviewPortrait === "function") renderPreviewPortrait();
}

function renderPresetPicker() {
  const host = document.querySelector("#presetPicker");
  if (!host) return;
  host.innerHTML = "";
  presetCharacters.forEach(preset => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preset-chip";
    btn.innerHTML = `<strong>${preset.label}</strong><span>${preset.blurb}</span>`;
    btn.addEventListener("click", () => applyPreset(preset.id));
    host.appendChild(btn);
  });
}
renderPresetPicker();

function renderMetaUnlocks() {
  const meta = typeof loadMeta === "function" ? loadMeta() : null;
  if (!meta || (meta.livesLived || 0) === 0) return;
  const creator = document.querySelector("#creator");
  if (!creator) return;
  let host = document.querySelector("#metaRow");
  if (!host) {
    host = document.createElement("div");
    host.id = "metaRow";
    host.className = "meta-row";
    host.innerHTML = `<p class="kicker">Past lives</p><div class="meta-unlocks" id="metaUnlocks"></div>`;
    creator.appendChild(host);
  }
  const list = host.querySelector("#metaUnlocks");
  if (!list) return;
  const unlocks = [
    { id: "starting_trust", label: "Trust fund ($25K start)", k: "starting_trust" },
    { id: "born_with_followers", label: "Born w/ 1,200 followers", k: "born_with_followers" },
    { id: "political_lineage", label: "Political family name", k: "political_lineage" },
    { id: "street_smarts", label: "Street rep at birth", k: "street_smarts" },
    { id: "long_life_blood", label: "Long-life blood (+8 health)", k: "long_life_blood" },
    { id: "fast_business", label: "Founder lineage", k: "fast_business" },
    { id: "legacy_mode", label: "5+ lives lived", k: "legacy_mode" }
  ];
  list.innerHTML = `<div class="meta-stats">Lives: <strong>${meta.livesLived}</strong> · Longest: <strong>${meta.longestLife || 0}</strong> · Richest: <strong>${money(meta.richestNet || 0)}</strong></div>`;
  unlocks.forEach(u => {
    const on = meta.unlocks && meta.unlocks[u.k];
    const chip = document.createElement("span");
    chip.className = `meta-chip ${on ? "on" : "off"}`;
    chip.textContent = (on ? "✓ " : "🔒 ") + u.label;
    list.appendChild(chip);
  });
}
renderMetaUnlocks();

el.ageBtn.addEventListener("click", ageUp);
el.saveBtn.addEventListener("click", saveGame);
el.resetBtn.addEventListener("click", resetGame);

function bigYear() {
  const player = state.player;
  if (!player || !player.alive) return;
  if (player.inJail) return;
  const years = Math.min(5, 100 - player.age);
  if (years <= 0) return;
  if (!confirm(`Skip ${years} years? Auto-spends remaining moves on your current lane. Real time passes.`)) return;
  const cat = activityCategories.find(c => c.id === state.activeCategory);
  if (cat) {
    const cheap = cat.actions.filter(a => a.available(player) && !a.risky).slice(0, player.moves);
    cheap.forEach(a => { try { a.run(); } catch (e) {} });
  }
  for (let i = 0; i < years; i++) {
    if (!state.player.alive) break;
    ageUp();
  }
  if (state.player.alive) addLog(`${years} years skipped. You came up for air at ${state.player.age}.`, "good");
}

(function addBigYearButton() {
  const header = document.querySelector(".header-actions");
  if (!header || document.querySelector("#bigYearBtn")) return;
  const btn = document.createElement("button");
  btn.id = "bigYearBtn";
  btn.type = "button";
  btn.className = "ghost";
  btn.title = "Skip 5 years (age 30+). Real time passes.";
  btn.textContent = "Skip 5y";
  btn.addEventListener("click", bigYear);
  btn.style.display = "none";
  header.insertBefore(btn, header.firstChild);
  const refresh = () => {
    const p = state.player;
    btn.style.display = (p && p.alive && p.age >= 30 && !p.inJail) ? "" : "none";
  };
  const origRender = render;
  window.render = function() { origRender.apply(this, arguments); refresh(); };
})();

const howToBtn = document.querySelector("#howToBtn");
const howToDialog = document.querySelector("#howToDialog");
if (howToBtn && howToDialog) {
  howToBtn.addEventListener("click", () => {
    if (typeof howToDialog.showModal === "function") howToDialog.showModal();
    else howToDialog.setAttribute("open", "true");
  });
}

const firstYearHint = document.querySelector("#firstYearHint");
const dismissHint = document.querySelector("#dismissHint");
function maybeShowFirstYearHint() {
  if (!firstYearHint) return;
  const dismissed = localStorage.getItem("rib_firstHintDismissed") === "1";
  const player = state.player;
  const show = Boolean(player) && player.alive && player.age <= 1 && !dismissed;
  firstYearHint.hidden = !show;
}
if (dismissHint && firstYearHint) {
  dismissHint.addEventListener("click", () => {
    localStorage.setItem("rib_firstHintDismissed", "1");
    firstYearHint.hidden = true;
  });
}
function maybeShowHowToOnFirstLoad() {
  if (!howToDialog) return;
  if (localStorage.getItem("rib_howToSeen") === "1") return;
  if (state.player) return;
  try { howToDialog.showModal(); } catch (e) { /* dialog API unsupported */ }
  localStorage.setItem("rib_howToSeen", "1");
}
setTimeout(maybeShowHowToOnFirstLoad, 600);

// ============================================================
// CITY AMBIENT AUDIO — procedural Web Audio drones per city.
// No files hosted, no API, pure synth. User must toggle on first.
// ============================================================
let audioContext = null;
let activeAudioSources = [];
let audioMuted = true;

const cityAudio = {
  "Los Angeles, CA":        { base: 110, harmony: [165, 220], filter: 800,  gain: 0.035 },
  "Hollywood, Los Angeles": { base: 130, harmony: [195, 260], filter: 1000, gain: 0.035 },
  "Compton, CA":            { base: 70,  harmony: [105, 140], filter: 550,  gain: 0.045 },
  "Skid Row, Los Angeles":  { base: 55,  harmony: [82,  110], filter: 400,  gain: 0.05  },
  "New York City, NY":      { base: 90,  harmony: [135, 180], filter: 850,  gain: 0.04  },
  "Brooklyn, NY":           { base: 80,  harmony: [120, 160], filter: 700,  gain: 0.04  },
  "The Bronx, NY":          { base: 70,  harmony: [105, 140], filter: 620,  gain: 0.045 },
  "Chicago, IL":            { base: 90,  harmony: [120, 180], filter: 700,  gain: 0.04  },
  "South Side, Chicago":    { base: 70,  harmony: [100, 140], filter: 500,  gain: 0.05  },
  "Atlanta, GA":            { base: 55,  harmony: [82,  110], filter: 450,  gain: 0.055 },
  "Miami, FL":              { base: 140, harmony: [210, 280], filter: 1200, gain: 0.04  },
  "Houston, TX":            { base: 75,  harmony: [112, 150], filter: 600,  gain: 0.04  },
  "Las Vegas, NV":          { base: 100, harmony: [150, 300], filter: 1300, gain: 0.04  },
  "Mexico City, Mexico":    { base: 85,  harmony: [127, 170], filter: 750,  gain: 0.04  },
  "Medellín, Colombia":     { base: 95,  harmony: [142, 190], filter: 800,  gain: 0.04  },
  "Rio de Janeiro, Brazil": { base: 80,  harmony: [120, 180, 240], filter: 900, gain: 0.045 },
  "Paris, France":          { base: 130, harmony: [195, 260], filter: 900,  gain: 0.035 },
  "London, UK":             { base: 100, harmony: [150, 200], filter: 700,  gain: 0.04  },
  "Tokyo, Japan":           { base: 220, harmony: [330, 440], filter: 1500, gain: 0.03  },
  "Seoul, South Korea":     { base: 200, harmony: [300, 400], filter: 1400, gain: 0.03  },
  "Dubai, UAE":             { base: 90,  harmony: [180, 270], filter: 1100, gain: 0.04  }
};

function getAudioContext() {
  if (!audioContext) {
    try { audioContext = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  return audioContext;
}

function stopCityAudio() {
  activeAudioSources.forEach(s => { try { s.stop(); s.disconnect(); } catch (e) {} });
  activeAudioSources = [];
}

function startCityAudio(city) {
  if (audioMuted) return;
  stopCityAudio();
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const config = cityAudio[city] || cityAudio["Los Angeles, CA"];
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = config.filter;
  filter.Q.value = 1;
  filter.connect(ctx.destination);

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.gain.linearRampToValueAtTime(config.gain, ctx.currentTime + 1.5);
  masterGain.connect(filter);

  [config.base, ...config.harmony].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 0 ? "sawtooth" : "sine";
    osc.frequency.value = freq;

    // Slow LFO detune for organic, breathing feel
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.15 + i * 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 2 + i;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.detune);

    const oscGain = ctx.createGain();
    oscGain.gain.value = 1 / (i + 1.5);
    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start();
    lfo.start();
    activeAudioSources.push(osc, lfo);
  });
}

function refreshCityAudio() {
  if (!state.player || audioMuted) return;
  startCityAudio(state.player.currentTrip || state.player.location || "Los Angeles, CA");
}

function toggleAudio() {
  audioMuted = !audioMuted;
  if (el.audioBtn) el.audioBtn.textContent = `Sound: ${audioMuted ? "off" : "on"}`;
  if (audioMuted) stopCityAudio();
  else refreshCityAudio();
}

if (el.audioBtn) el.audioBtn.addEventListener("click", toggleAudio);

// ============================================================
// PROCEDURAL SFX — short Web Audio tones for choices, events, death
// All synthesized, no audio files. Respects audioMuted.
// ============================================================
function playTone({ freq = 440, type = "sine", duration = 0.12, gain = 0.08, attack = 0.005, release = 0.06, slideTo = null }) {
  if (audioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration * 0.85);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(t0); osc.stop(t0 + duration + 0.05);
}

function clickSfx() {
  playTone({ freq: 720, type: "triangle", duration: 0.06, gain: 0.04 });
}

function eventSfx() {
  // Short two-tone whoosh when an event opens
  playTone({ freq: 320, type: "sawtooth", duration: 0.18, gain: 0.05, slideTo: 540 });
}

function ringUpSfx() {
  playTone({ freq: 520, type: "triangle", duration: 0.09, gain: 0.06 });
  setTimeout(() => playTone({ freq: 780, type: "triangle", duration: 0.12, gain: 0.06 }), 70);
}

function ringDownSfx() {
  playTone({ freq: 480, type: "triangle", duration: 0.09, gain: 0.05 });
  setTimeout(() => playTone({ freq: 280, type: "triangle", duration: 0.16, gain: 0.05 }), 70);
}

function deathSfx() {
  playTone({ freq: 220, type: "sine", duration: 1.2, gain: 0.07, attack: 0.05, release: 0.4 });
  setTimeout(() => playTone({ freq: 165, type: "sine", duration: 1.6, gain: 0.05 }), 220);
}



// ============================================================
// SAVE SLOTS — 3 parallel lives, switchable from header
// ============================================================
function refreshSlotButtons() {
  const active = getActiveSlot();
  document.querySelectorAll(".slot-btn").forEach(btn => {
    const n = parseInt(btn.dataset.slot, 10);
    btn.classList.toggle("active", n === active);
    // Show summary as tooltip
    const raw = localStorage.getItem(slotKey(n));
    if (raw) {
      try {
        const p = JSON.parse(raw);
        btn.title = `${p.name || "Unnamed"} · ${p.location || "?"} · age ${p.age}${p.alive === false ? " (died)" : ""}`;
      } catch (e) { btn.title = `Slot ${n + 1}`; }
    } else {
      btn.title = `Slot ${n + 1} (empty)`;
    }
  });
}

function switchSlot(n) {
  if (n === getActiveSlot()) return;
  // Save current first
  if (state.player) saveGame();
  localStorage.setItem(ACTIVE_SLOT_KEY, String(n));
  state.player = null;
  loadGame();
  render();
  refreshSlotButtons();
  refreshCityAudio();
}

document.querySelectorAll(".slot-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const n = parseInt(btn.dataset.slot, 10);
    switchSlot(n);
  });
});
refreshSlotButtons();

// PWA service worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.log("SW register failed", err));
  });
}

// ============================================================
// TITLE CINEMATIC — auto-hide after 2.5s, skip on click
// ============================================================
(function initTitleCinematic() {
  const overlay = document.querySelector("#titleCinematic");
  if (!overlay) return;
  // Skip on second-visit
  if (sessionStorage.getItem("la-title-shown")) {
    overlay.style.display = "none";
    return;
  }
  sessionStorage.setItem("la-title-shown", "yes");
  // Click anywhere to skip
  overlay.addEventListener("click", () => {
    overlay.style.transition = "opacity 200ms ease";
    overlay.style.opacity = "0";
    setTimeout(() => { overlay.style.display = "none"; }, 200);
  });
  // Auto-remove after animation completes
  setTimeout(() => { overlay.style.display = "none"; }, 2700);
})();

// ============================================================
// UI CLICK SFX — soft tick via Web Audio (no MP3, no autoplay block
// after first user interaction)
// ============================================================
let sfxEnabled = true;
let sfxUnlocked = false;

function playClickTick() {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
  sfxUnlocked = true;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(1400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.035, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.09);
}

// Attach click SFX to all buttons via event delegation
document.addEventListener("click", event => {
  const tag = event.target.closest("button, .cycler-arrow");
  if (!tag) return;
  // Skip if it's a disabled or text-input wrapper
  if (tag.disabled) return;
  playClickTick();
}, { capture: true });

// ============================================================
// NUMBER TICKER — animate stat changes
// ============================================================
function tickElement(el) {
  if (!el) return;
  el.classList.remove("stat-tick");
  // Force reflow to restart animation
  void el.offsetWidth;
  el.classList.add("stat-tick");
}

// Patch addLog to detect stat-affecting messages and trigger ticks
// (lighter approach: just animate stat-bar fills via render diff)
const originalRender = window.render;
let lastRenderedStats = null;
function renderWithTickers() {
  const before = state.player ? { ...state.player.stats, money: state.player.money, fame: state.player.fame, age: state.player.age } : null;
  if (typeof originalRender === "function") originalRender.apply(null, arguments);
  if (state.player && lastRenderedStats) {
    const after = { ...state.player.stats, money: state.player.money, fame: state.player.fame, age: state.player.age };
    // If age changed, flash the year
    if (lastRenderedStats.age !== after.age) {
      const yearTag = document.querySelector(".loc-tag.tag-year");
      const chapterTitle = document.querySelector("#chapterTitle");
      if (yearTag) { yearTag.classList.remove("year-flash"); void yearTag.offsetWidth; yearTag.classList.add("year-flash"); }
      if (chapterTitle) { chapterTitle.classList.remove("year-flash"); void chapterTitle.offsetWidth; chapterTitle.classList.add("year-flash"); }
    }
    // Tick stat values that changed
    document.querySelectorAll(".meter").forEach((meter, i) => {
      const key = statDefs[i]?.[0];
      if (!key) return;
      if (lastRenderedStats[key] !== undefined && lastRenderedStats[key] !== after[key]) {
        tickElement(meter.querySelector("span"));
      }
    });
  }
  lastRenderedStats = state.player ? { ...state.player.stats, age: state.player.age } : null;
}
window.render = renderWithTickers;

// ============================================================
// SAME SEED — shareable URL spawns same city/class/personality/year
// ============================================================
let pendingSeedSpawn = null;

function encodeSeed(player) {
  if (!player) return null;
  const parts = [
    player.location,
    player.spawnClass,
    player.personality,
    player.birthYear,
    player.avatar?.skin,
    player.avatar?.hair,
    player.avatar?.outfit,
    player.focus,
    player.name
  ];
  // Base64 url-safe
  try {
    return btoa(parts.join("|")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (e) { return null; }
}

function decodeSeed(token) {
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(padded);
    const parts = raw.split("|");
    return {
      location: parts[0],
      spawnClass: parts[1],
      personality: parts[2],
      birthYear: parseInt(parts[3], 10) || null,
      skin: parts[4],
      hair: parts[5],
      outfit: parts[6],
      focus: parts[7],
      fromName: parts[8]
    };
  } catch (e) { return null; }
}

function loadSeedFromURL() {
  const params = new URLSearchParams(window.location.search);
  const seed = params.get("seed");
  if (!seed) return;
  const decoded = decodeSeed(seed);
  if (!decoded) return;
  pendingSeedSpawn = decoded;
  // Pre-fill creator form so the player sees what they're spawning into
  if (el.homeInput && decoded.location) el.homeInput.value = decoded.location;
  if (el.classInput && decoded.spawnClass) el.classInput.value = decoded.spawnClass;
  if (el.skinInput && decoded.skin) { el.skinInput.value = decoded.skin; updateCyclerLabel("skinInput"); }
  if (el.hairInput && decoded.hair) { el.hairInput.value = decoded.hair; updateCyclerLabel("hairInput"); }
  if (el.outfitInput && decoded.outfit) { el.outfitInput.value = decoded.outfit; updateCyclerLabel("outfitInput"); }
  if (el.focusInput && decoded.focus) el.focusInput.value = decoded.focus;
  renderPreviewPortrait();
  // Show a banner so the player knows they're spawning a friend's seed
  showSeedBanner(decoded);
}

function showSeedBanner(decoded) {
  const sub = document.querySelector(".creator-sub");
  if (sub) {
    sub.innerHTML = `<strong style="color: var(--orange-2);">Friend's seed:</strong> ${decoded.fromName || "Someone"} spawned in ${decoded.location} as ${decoded.spawnClass}. Beat their life.`;
  }
}

function copyShareSeed() {
  const player = state.player;
  if (!player) return;
  const token = encodeSeed(player);
  const url = `${window.location.origin}${window.location.pathname}?seed=${token}`;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url);
  } else {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = url;
    document.body.append(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
  }
  return url;
}

loadSeedFromURL();

// ============================================================
// WEBLLM POWER AI — opt-in free in-browser LLM (Phi-3.5-mini)
// First click downloads ~2GB cached locally. After: offline, free.
// Requires WebGPU (Chrome/Edge/Safari 17+).
// ============================================================
let webllmEngine = null;
let webllmLoading = false;

function buildSystemPrompt(player) {
  const o = originOf(player.location);
  const personality = personalityOf(player);
  const era = eraTag(player);
  const recentCanon = (player.canonEvents || []).slice(0, 6).map(c => `Age ${c.age}: ${c.text}`).join("\n");
  return `You are an in-game advisor inside Run It Back (a life sim). Talk like a smart older friend who knows the game.

The player's character right now:
- ${player.name}, age ${player.age}, year ${currentYear(player)} (${era})
- Lives in ${player.location} (${o.vibe})
- Born ${player.spawnLabel}
- Personality: ${personality.label} — ${personality.tagline}
- Money ${money(player.money)}, debt ${money(player.debt)}, fame ${player.fame}, followers ${(player.followers||0).toLocaleString()}
- Job: ${currentJob(player).title}, school: ${player.school}
- Stats: health ${player.stats.health}, happiness ${player.stats.happiness}, smarts ${player.stats.smarts}, looks ${looksScore()}, discipline ${player.stats.discipline}
- Kids: ${player.children.length}, married: ${player.married}, pets: ${player.pets.length}
- Trips taken: ${(player.trips || []).join(", ") || "none"}
- Street rep ${player.streetRep}, risks ${player.risksTaken}, record ${player.record}
${player.gang ? `- In crew "${player.gang.name}" (loyalty ${player.gang.loyalty}, heat ${player.gangHeat||0})` : ""}
${player.company ? `- Owns company ${player.company.name} (valuation ${money(player.company.valuation)})` : ""}

Recent big moments:
${recentCanon || "Nothing major yet."}

Rules: 1-3 sentences. Direct, specific, sometimes blunt. Reference their actual stats/choices. Don't invent items that don't exist. Don't moralize.`;
}

async function webllmReply(input) {
  return lifeAiReply(input);
  const system = buildSystemPrompt(state.player);
  try {
    const response = await webllmEngine.chat.completions.create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: input }
      ],
      max_tokens: 220,
      temperature: 0.7
    });
    return response.choices[0].message.content.trim();
  } catch (e) {
    console.error("WebLLM error", e);
    return lifeAiReply(input);
  }
}

async function loadWebLLM() {
  // Disabled: the 2GB local LLM was bad UX. The in-game advisor uses
  // `lifeAiReply()` which reads player state and replies contextually
  // without any download. If you want a hosted upgrade later, point this
  // at a serverless endpoint instead.
  if (typeof addLog === "function") addLog("Advisor is local-only — instant, no download.", "normal");
}

const powerAiBtn = document.querySelector("#powerAiBtn");
if (powerAiBtn) {
  powerAiBtn.addEventListener("click", () => {
    if (webllmEngine) {
      // Toggle off
      webllmEngine = null;
      powerAiBtn.textContent = "Power AI: off";
    } else {
      // Start the download silently. WebGPU support / errors surface via addLog.
      if (typeof addLog === "function") addLog("Power AI is downloading (~2GB, one-time). It will be ready in a minute.", "normal");
      powerAiBtn.textContent = "Power AI: loading...";
      loadWebLLM();
    }
  });
}
el.aiForm.addEventListener("submit", sendAiMessage);

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    state.activeTab = button.dataset.tab;
    renderTabs();
  });
});

function renderPreviewPortrait() {
  if (!el.previewPortraitImg) return;
  const avatar = {
    skin: el.skinInput.value,
    hair: el.hairInput.value,
    hairColor: el.hairColorInput.value,
    outfit: el.outfitInput.value,
    expression: el.expressionInput.value
  };
  const name = (el.nameInput && el.nameInput.value.trim()) || "Mika";
  el.previewPortraitImg.src = buildAvatarURL(avatar, name);
}

function updateCyclerLabel(inputId) {
  const select = document.querySelector(`#${inputId}`);
  const valueSpan = document.querySelector(`[data-value-for="${inputId}"]`);
  if (!select || !valueSpan) return;
  const opt = select.options[select.selectedIndex];
  valueSpan.textContent = opt ? opt.textContent : "";
}

function cycleInput(inputId, direction) {
  const select = document.querySelector(`#${inputId}`);
  if (!select) return;
  const count = select.options.length;
  let next = select.selectedIndex + direction;
  if (next < 0) next = count - 1;
  if (next >= count) next = 0;
  select.selectedIndex = next;
  updateCyclerLabel(inputId);
  renderPreviewPortrait();
}

document.querySelectorAll(".cycler").forEach(cycler => {
  const inputId = cycler.dataset.input;
  updateCyclerLabel(inputId);
  cycler.querySelectorAll(".cycler-arrow").forEach(btn => {
    btn.addEventListener("click", event => {
      event.preventDefault();
      const dir = parseInt(btn.dataset.dir, 10) || 1;
      cycleInput(inputId, dir);
    });
  });
});

const randomizeBtn = document.querySelector("#randomizeBtn");
if (randomizeBtn) {
  randomizeBtn.addEventListener("click", event => {
    event.preventDefault();
    const homeSelect = document.querySelector("#homeInput");
    const home = homeSelect ? homeSelect.value : null;
    const lean = pickHometownLook(home);
    const setSelectByValue = (id, val) => {
      const select = document.querySelector(`#${id}`);
      if (!select) return;
      const opt = Array.from(select.options).find(o => o.value === val);
      if (opt) select.value = val;
      updateCyclerLabel(id);
    };
    setSelectByValue("skinInput", lean.skin);
    setSelectByValue("hairInput", lean.hair);
    setSelectByValue("hairColorInput", lean.hairColor);
    // Outfit + expression stay random
    ["outfitInput", "expressionInput"].forEach(id => {
      const select = document.querySelector(`#${id}`);
      if (!select) return;
      select.selectedIndex = Math.floor(Math.random() * select.options.length);
      updateCyclerLabel(id);
    });
    renderPreviewPortrait();
  });
}

renderPreviewPortrait();

// Age gate is now opt-in. The 18+ dialog never auto-opens.
// Mature events default ON; users can disable via the "Mature" header toggle.
if (el.ageGateDialog) {
  if (el.ageGateConfirm) el.ageGateConfirm.addEventListener("click", () => {
    setAdultUnlocked(true);
    el.ageGateDialog.close();
  });
  if (el.ageGateDeny) el.ageGateDeny.addEventListener("click", () => {
    setAdultUnlocked(false);
    el.ageGateDialog.close();
  });
}

if (el.recapNewLife) {
  el.recapNewLife.addEventListener("click", () => {
    el.lifeRecapDialog.close();
    resetGame();
  });
}
const recapContinueLineBtn = document.querySelector("#recapContinueLine");
if (recapContinueLineBtn) {
  recapContinueLineBtn.addEventListener("click", () => {
    continueFamilyLine();
    el.lifeRecapDialog.close();
  });
}

function continueFamilyLine() {
  const parent = state.player;
  if (!parent || !parent.children?.length) return;
  // Eldest child becomes new player
  const eldest = parent.children.reduce((a, b) => (a.age || 0) > (b.age || 0) ? a : b);
  const inheritance = parent.willWritten === "favorite" ? Math.floor(parent.money * 0.8)
    : parent.willWritten === "donated" ? 0
    : Math.floor(parent.money / Math.max(1, parent.children.length));

  // Build new player with inherited context
  pendingSeedSpawn = {
    location: parent.location,
    spawnClass: inheritance >= 200000 ? "nepo" : inheritance >= 30000 ? "comfortable" : parent.spawnClass,
    personality: eldest.personality || rollPersonality(),
    birthYear: currentYear(parent) - (eldest.age || 0),
    skin: parent.avatar?.skin,
    hair: parent.avatar?.hair,
    outfit: parent.avatar?.outfit,
    focus: parent.focus,
    fromName: parent.name
  };
  // Pre-fill creator with kid's info
  if (el.nameInput) el.nameInput.value = eldest.name;
  if (el.homeInput) el.homeInput.value = parent.location;
  if (el.heritageInput) el.heritageInput.value = parent.heritage || "mixed";
  if (el.religionInput) el.religionInput.value = parent.religion || "none";
  // Hand off — clear current save then reset state
  resetGame();
  // Show creator with prefilled hint
  const sub = document.querySelector(".creator-sub");
  if (sub) sub.innerHTML = `<strong style="color: var(--orange-2);">Family line:</strong> ${eldest.name}, child of ${parent.name}. Inherits ${money(inheritance)} when they hit 18.`;
  // Stash inheritance to apply on createPlayer
  pendingInheritance = inheritance;
}

let pendingInheritance = 0;

const recapShareSeedBtn = document.querySelector("#recapShareSeed");
if (recapShareSeedBtn) {
  recapShareSeedBtn.addEventListener("click", () => {
    const url = copyShareSeed();
    recapShareSeedBtn.textContent = url ? "Copied ✓ — send it" : "Failed";
    setTimeout(() => { recapShareSeedBtn.textContent = "Copy \"same seed\" link →"; }, 2500);
  });
}

if (el.recapScreenshot) {
  el.recapScreenshot.addEventListener("click", async () => {
    const btn = el.recapScreenshot;
    const card = document.querySelector("#recapCard");
    if (!card) return;
    btn.textContent = "Generating…";
    btn.disabled = true;
    try {
      if (typeof html2canvas !== "function") throw new Error("html2canvas not loaded");
      // Wait one frame so images (DiceBear) render before capture
      await new Promise(r => requestAnimationFrame(r));
      const canvas = await html2canvas(card, {
        backgroundColor: "#0d1014",
        useCORS: true,
        scale: 2,
        logging: false
      });
      const safeName = (state.player?.name || "life").replace(/[^a-z0-9]/gi, "_");
      const fileName = `run-it-back-${safeName}-${state.player?.deathAge || state.player?.age || "x"}.png`;
      // Try native share sheet first (great on iOS/Android — IG, Messages, etc.)
      const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
      const file = blob ? new File([blob], fileName, { type: "image/png" }) : null;
      const shareData = file ? { files: [file], title: "Run It Back", text: `Lived ${state.player?.deathAge || state.player?.age} years. Run it back: https://run-it-back-omega.vercel.app` } : null;
      if (file && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          btn.textContent = "Shared ✓";
          return;
        } catch (e) { /* user cancelled or share unsupported — fall through to download */ }
      }
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = fileName;
      a.href = dataUrl;
      document.body.append(a);
      a.click();
      a.remove();
      btn.textContent = "Saved ✓ — post it";
    } catch (err) {
      console.error(err);
      btn.textContent = "Failed — try screenshot instead";
    }
    setTimeout(() => {
      btn.textContent = "Share recap →";
      btn.disabled = false;
    }, 2800);
  });
}

loadGame();
render();

// Mature content header toggle (added 2026-05-11)
(function wireMatureToggle() {
  const btn = document.querySelector("#matureBtn");
  if (!btn) return;
  const refresh = () => { btn.textContent = isAdultUnlocked() ? "Mature: on" : "Mature: off"; };
  refresh();
  btn.addEventListener("click", () => {
    setAdultUnlocked(!isAdultUnlocked());
    refresh();
    if (state.player && typeof render === "function") render();
  });
})();

// Auto-bias character look to selected hometown when the user picks one.
(function wireHometownAutoLean() {
  const homeSelect = document.querySelector("#homeInput");
  if (!homeSelect) return;
  homeSelect.addEventListener("change", () => {
    const lean = pickHometownLook(homeSelect.value);
    const setVal = (id, val) => {
      const sel = document.querySelector(`#${id}`);
      if (!sel) return;
      sel.value = val;
      if (typeof updateCyclerLabel === "function") updateCyclerLabel(id);
    };
    setVal("skinInput", lean.skin);
    setVal("hairInput", lean.hair);
    setVal("hairColorInput", lean.hairColor);
    if (typeof renderPreviewPortrait === "function") renderPreviewPortrait();
  });
})();

// Settings button → open settings dialog
(function wireSettingsBtn() {
  const btn = document.querySelector("#settingsBtn");
  const dlg = document.querySelector("#settingsDialog");
  if (!btn || !dlg) return;
  btn.addEventListener("click", () => {
    try { dlg.showModal(); } catch (e) {}
  });
})();

// First-life hint banner — shows once until dismissed
(function wireFirstLifeHint() {
  const HINT_KEY = "run-it-back-hint-dismissed";
  const banner = document.querySelector("#firstLifeHint");
  const close = document.querySelector("#firstLifeHintClose");
  if (!banner || !close) return;
  const dismissed = (() => { try { return localStorage.getItem(HINT_KEY) === "yes"; } catch (e) { return false; } })();
  if (dismissed) banner.hidden = true;
  // Show whenever the play screen is visible AND not dismissed
  const reveal = () => { if (!dismissed && state.player) banner.hidden = false; };
  // Reveal after each render — cheap idempotent toggle
  const origRender = window.render;
  if (typeof origRender === "function" && !window.__hintReveal) {
    window.__hintReveal = true;
    window.render = function() { origRender.apply(this, arguments); reveal(); };
  }
  close.addEventListener("click", () => {
    banner.hidden = true;
    try { localStorage.setItem(HINT_KEY, "yes"); } catch (e) {}
  });
})();

// Hall of Fame — Lives button
(function wireHofBtn() {
  const btn = document.querySelector("#hofBtn");
  if (!btn) return;
  btn.addEventListener("click", () => openHallOfFame());
})();
