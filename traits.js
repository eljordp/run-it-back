// ============================================================
// TRAITS — innate rolls (body, brain, family, hidden modifiers)
// Real-life % data. Sets odds, not outcomes.
// Globals exposed: rollTraits, predictLifeEvent, perceptionDelta,
//                  describeTraits, traitFlavorLines.
// ============================================================
(function (global) {
  "use strict";

  // --- utilities ---
  function rnd() { return Math.random(); }
  function chance(p) { return rnd() * 100 < p; }
  function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
  // Box-Muller bell curve, clamped to [min,max], mean = (min+max)/2
  function bell(min, max, mean, sd) {
    mean = mean == null ? (min + max) / 2 : mean;
    sd = sd == null ? (max - min) / 6 : sd;
    let u = 0, v = 0;
    while (u === 0) u = rnd();
    while (v === 0) v = rnd();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return Math.max(min, Math.min(max, Math.round(mean + z * sd)));
  }

  // ============================================================
  // BODY ROLLS
  // ============================================================
  function rollHeight(sex) {
    // inches. US adult mean: M 69" SD 3", F 64" SD 2.7"
    if (sex === "F") return bell(54, 76, 64, 2.7);
    return bell(58, 84, 69, 3);
  }
  function heightTier(inches, sex) {
    const mean = sex === "F" ? 64 : 69;
    const d = inches - mean;
    if (d <= -4) return "very short";
    if (d <= -2) return "short";
    if (d <  2)  return "average";
    if (d <  4)  return "tall";
    return "very tall";
  }

  function rollLooks() {
    // 0-100, bell. Top 10% = pretty, bottom 10% = ugly tax.
    return bell(15, 95, 55, 15);
  }
  function looksTier(score) {
    if (score >= 85) return "stunning";
    if (score >= 72) return "good-looking";
    if (score >= 45) return "average";
    if (score >= 30) return "below average";
    return "unfortunate";
  }

  function rollVoice() {
    const r = rnd() * 100;
    if (r <  4) return "stutter";       // 4% adult stutter (slightly elevated for flavor)
    if (r <  6) return "lisp";          // 2%
    if (r < 16) return "raspy";         // 10%
    if (r < 36) return "deep";          // 20%
    if (r < 56) return "soft";          // 20%
    if (r < 70) return "high-pitched";  // 14%
    return "neutral";                   // 30%
  }

  function rollBodyType() {
    const r = rnd() * 100;
    if (r < 25) return "ectomorph";   // skinny ceiling, hard gainer
    if (r < 75) return "mesomorph";   // average / athletic ceiling
    return "endomorph";               // gains easy, both ways
  }

  function rollMetabolism() {
    const r = rnd() * 100;
    if (r < 10) return "fast";    // can't gain weight if tried
    if (r < 35) return "slow";    // gains easy
    return "average";
  }

  function rollAthleticCeiling() { return bell(20, 95, 55, 15); }

  // ============================================================
  // VISIBLE PHYSICAL FLAGS (the ones other NPCs read)
  // ============================================================
  function rollPhysicalFlags(sex, heritage) {
    const flags = {};
    if (chance(10)) flags.leftHanded = true;                     // 10%
    if (sex === "M" && chance(8))  flags.colorBlind = true;      // 8% men
    if (sex === "F" && chance(0.5)) flags.colorBlind = true;     // 0.5% women
    if (chance(40)) flags.needsGlasses = true;                   // 40% myopia
    if (chance(20)) flags.acneProne = true;
    if (chance(30)) flags.crookedTeeth = true;
    if (sex === "M" && chance(50)) flags.baldnessGene = true;    // 50% men carry it; activates with age
    if (heritage === "east-asian" && chance(36)) flags.alcoholFlush = true; // ALDH2
    else if (chance(8)) flags.alcoholFlush = true;
    if (chance(2))  flags.heterochromia = true;
    if ((heritage === "white" && chance(6)) || (heritage !== "white" && chance(1.5))) flags.redhead = true;
    if (chance(0.005 * 100)) flags.albinism = true;              // 0.005%
    if (chance(15)) flags.doubleJointed = true;
    if (chance(33)) flags.cantWhistle = true;                    // pure flavor
    if (chance(0.4)) flags.identicalTwin = true;
    return flags;
  }

  // ============================================================
  // HEALTH PREDISPOSITIONS
  // ============================================================
  function rollHealth(sex) {
    const h = {};
    if (chance(8))  h.asthma = true;
    if (chance(10)) h.eczema = true;
    if (chance(2))  h.peanutAllergy = true;
    if (chance(1))  h.celiac = true;
    h.lactoseIntolerant = chance(65);                            // varies by ethnicity in reality
    if (chance(2))  h.disabilityFromBirth = pick(["wheelchair", "limb difference", "deaf", "blind"]);
    if (chance(6))  h.disabilityMild = pick(["hearing impairment", "vision impairment", "mobility issue"]);
    if (sex === "F" && chance(10)) h.severePeriods = true;
    h.immuneBaseline = bell(20, 95, 60, 14);                     // higher = sicks less
    h.painTolerance = bell(20, 95, 55, 15);
    h.alcoholTolerance = chance(10) ? "iron-liver" : (chance(15) ? "lightweight" : "average");
    h.sleepNeed = chance(1) ? "short-sleeper" : (chance(3) ? "long-sleeper" : "average");
    return h;
  }

  // ============================================================
  // BRAIN ROLLS (the cognitive + personality wiring)
  // ============================================================
  function rollIQ() { return bell(60, 145, 100, 15); }

  function rollNeuro() {
    const n = {};
    if (chance(5))  n.adhd = true;
    if (chance(2.5)) n.autism = true;
    if (chance(7))  n.dyslexia = true;
    if (chance(4))  n.aphantasia = true;
    if (chance(4))  n.synesthesia = true;
    if (chance(2))  n.faceBlind = true;
    if (chance(4))  n.toneDeaf = true;
    if (chance(0.01)) n.perfectPitch = true;
    return n;
  }

  function rollPersonalityAxes() {
    // Big 5, 0-100 bells. 50% heritable in real life.
    return {
      openness: bell(10, 95, 55, 15),
      conscientiousness: bell(10, 95, 55, 15),
      extraversion: bell(10, 95, 50, 18),
      agreeableness: bell(10, 95, 55, 15),
      neuroticism: bell(10, 95, 50, 18),
      impulsivity: bell(10, 95, 50, 18),
      noveltySeeking: bell(10, 95, 50, 18),
      empathy: bell(0, 100, 55, 18)
    };
  }

  function rollMentalRisks() {
    // Predispositions, not diagnoses. May or may not manifest.
    return {
      depressionRisk: chance(40) ? "elevated" : "baseline",
      anxietyRisk: chance(40) ? "elevated" : "baseline",
      bipolarRisk: chance(3) ? "elevated" : "baseline",
      schizophreniaRisk: chance(1) ? "elevated" : "baseline",
      addictionRisk: chance(50) ? "elevated" : "baseline",
      psychopathyLean: chance(1)
    };
  }

  function rollOrientation() {
    const r = rnd() * 100;
    if (r < 1) return "asexual";
    if (r < 5) return "gay";
    if (r < 10) return "bi";
    return "straight";
  }

  // ============================================================
  // FAMILY / ORIGIN — kept lightweight; spawnClass already exists
  // ============================================================
  function rollSex() {
    if (chance(0.05)) return "I";  // intersex
    return rnd() < 0.5 ? "M" : "F";
  }

  function rollBirthOrder() {
    const r = rnd() * 100;
    if (r < 15) return "only";
    if (r < 50) return "eldest";
    if (r < 75) return "middle";
    return "youngest";
  }

  // ============================================================
  // MASTER ROLL
  // ============================================================
  function rollTraits(opts) {
    opts = opts || {};
    const sex = opts.sex || rollSex();
    const heritage = opts.heritage || "mixed";

    const heightIn = rollHeight(sex);
    const looks = rollLooks();
    const iq = rollIQ();
    const physical = rollPhysicalFlags(sex, heritage);
    const health = rollHealth(sex);
    const neuro = rollNeuro();
    const personality = rollPersonalityAxes();
    const mental = rollMentalRisks();

    return {
      sex,
      heightIn,
      heightTier: heightTier(heightIn, sex),
      looks,
      looksTier: looksTier(looks),
      voice: rollVoice(),
      bodyType: rollBodyType(),
      metabolism: rollMetabolism(),
      athleticCeiling: rollAthleticCeiling(),
      orientation: rollOrientation(),
      birthOrder: rollBirthOrder(),
      iq,
      iqTier: iq < 85 ? "below avg" : iq < 115 ? "average" : iq < 130 ? "bright" : "gifted",
      physical,
      health,
      neuro,
      personality,
      mental
    };
  }

  // ============================================================
  // STAT MODIFIERS — apply traits → existing stats
  // health, happiness, smarts, looks, discipline (game's stats)
  // ============================================================
  function statModsFromTraits(t) {
    const mods = { health: 0, happiness: 0, smarts: 0, looks: 0, discipline: 0 };
    // looks: anchor game's 'looks' stat to the looks roll
    mods.looks += Math.round((t.looks - 55) * 0.5);              // ±20 ceiling
    // smarts: anchor to IQ
    mods.smarts += Math.round((t.iq - 100) * 0.4);               // ±18 ceiling
    // discipline: pulled from conscientiousness, impulsivity inverse
    mods.discipline += Math.round((t.personality.conscientiousness - 50) * 0.3);
    mods.discipline -= Math.round((t.personality.impulsivity - 50) * 0.15);
    // health: immune + body type + disabilities
    mods.health += Math.round((t.health.immuneBaseline - 60) * 0.2);
    if (t.health.disabilityFromBirth) mods.health -= 10;
    if (t.health.disabilityMild) mods.health -= 4;
    if (t.health.asthma) mods.health -= 2;
    // happiness: neuroticism inverse, mental risks
    mods.happiness -= Math.round((t.personality.neuroticism - 50) * 0.2);
    if (t.mental.depressionRisk === "elevated") mods.happiness -= 4;
    if (t.mental.anxietyRisk === "elevated") mods.happiness -= 3;
    // neuro
    if (t.neuro.adhd) { mods.discipline -= 6; mods.smarts += 1; }
    if (t.neuro.autism) { mods.smarts += 3; mods.happiness -= 2; }
    if (t.neuro.dyslexia) { mods.smarts -= 4; }
    return mods;
  }

  // ============================================================
  // LIFE EVENT PROBABILITY SHIFTER
  // event ∈ jail, college, marriage, kids, addiction, depression,
  //         viral, ceo, rich, dies-young, divorces, dropout
  // Returns multiplier on base probability (1.0 = unchanged).
  // ============================================================
  function predictLifeEvent(npc, event) {
    const t = npc.traits;
    if (!t) return 1;
    let m = 1;
    const p = t.personality;

    if (event === "jail") {
      if (p.impulsivity > 70) m *= 1.6;
      if (p.conscientiousness < 30) m *= 1.5;
      if (t.iq < 90) m *= 1.4;
      if (t.mental.addictionRisk === "elevated") m *= 1.3;
      if (t.mental.psychopathyLean) m *= 1.8;
      if (npc.spawnClass === "survival" || npc.spawnClass === "struggling") m *= 1.6;
      if (p.conscientiousness > 70) m *= 0.5;
      if (t.iq > 115) m *= 0.6;
    }
    if (event === "college") {
      if (t.iq > 115) m *= 1.7;
      if (p.conscientiousness > 65) m *= 1.5;
      if (t.neuro.dyslexia) m *= 0.7;
      if (npc.spawnClass === "nepo") m *= 1.8;
      if (npc.spawnClass === "survival") m *= 0.4;
    }
    if (event === "marriage") {
      if (p.agreeableness > 65) m *= 1.4;
      if (p.neuroticism > 75) m *= 0.7;
      if (t.looks > 70) m *= 1.2;
      if (t.mental.psychopathyLean) m *= 0.6;
    }
    if (event === "kids") {
      if (p.agreeableness > 60) m *= 1.3;
      if (t.orientation === "gay" || t.orientation === "lesbian") m *= 0.4;
      if (t.orientation === "asexual") m *= 0.2;
    }
    if (event === "addiction") {
      if (t.mental.addictionRisk === "elevated") m *= 2.0;
      if (p.impulsivity > 70) m *= 1.4;
      if (p.neuroticism > 70) m *= 1.3;
      if (p.conscientiousness > 70) m *= 0.5;
    }
    if (event === "depression") {
      if (t.mental.depressionRisk === "elevated") m *= 1.8;
      if (p.neuroticism > 70) m *= 1.5;
      if (t.health.disabilityFromBirth) m *= 1.3;
      if (p.extraversion > 70) m *= 0.7;
    }
    if (event === "viral") {
      if (p.extraversion > 70) m *= 1.4;
      if (t.looks > 80) m *= 1.5;
      if (p.openness > 70) m *= 1.3;
      if (p.neuroticism > 75) m *= 0.7;
    }
    if (event === "ceo" || event === "founder") {
      if (p.conscientiousness > 65) m *= 1.5;
      if (p.openness > 65) m *= 1.3;
      if (t.iq > 115) m *= 1.4;
      if (p.extraversion > 60) m *= 1.2;
      if (t.heightTier === "tall" || t.heightTier === "very tall") m *= 1.4;
      if (t.mental.psychopathyLean) m *= 1.3;
    }
    if (event === "rich") {
      if (npc.spawnClass === "nepo") m *= 2.5;
      if (npc.spawnClass === "comfortable") m *= 1.4;
      if (t.iq > 120) m *= 1.5;
      if (p.conscientiousness > 70) m *= 1.5;
    }
    if (event === "dies-young") {
      if (t.health.disabilityFromBirth) m *= 1.4;
      if (p.impulsivity > 80) m *= 1.5;
      if (t.mental.addictionRisk === "elevated") m *= 1.4;
      if (npc.spawnClass === "survival") m *= 1.6;
    }
    if (event === "dropout") {
      if (t.neuro.adhd) m *= 1.5;
      if (t.neuro.dyslexia) m *= 1.4;
      if (p.conscientiousness < 30) m *= 1.6;
      if (npc.spawnClass === "survival") m *= 1.8;
      if (t.iq > 120) m *= 0.5;
    }
    if (event === "viralHate") {
      if (t.mental.psychopathyLean) m *= 1.5;
      if (p.agreeableness < 30) m *= 1.4;
    }
    return m;
  }

  // ============================================================
  // PERCEPTION FILTER — how an observer treats this NPC
  // Returns delta to apply to bond/treatment outcomes (-30..+30)
  // ============================================================
  function perceptionDelta(observed) {
    const t = observed.traits;
    if (!t) return 0;
    let d = 0;
    // pretty privilege
    if (t.looks >= 85) d += 12;
    else if (t.looks >= 72) d += 6;
    else if (t.looks <= 30) d -= 6;
    else if (t.looks <= 20) d -= 10;
    // tall privilege (men more)
    if (t.sex === "M") {
      if (t.heightTier === "very tall") d += 6;
      else if (t.heightTier === "tall") d += 3;
      else if (t.heightTier === "short") d -= 3;
      else if (t.heightTier === "very short") d -= 6;
    }
    // voice
    if (t.voice === "stutter" || t.voice === "lisp") d -= 3;
    if (t.voice === "deep" && t.sex === "M") d += 3;
    if (t.voice === "raspy") d += 1;
    if (t.voice === "high-pitched" && t.sex === "M") d -= 2;
    // articulation proxy: IQ + extraversion read as "smart/articulate"
    if (t.iq >= 120 && t.personality.extraversion > 50) d += 4;
    if (t.iq < 85) d -= 3;
    // visible disability — strangers treat different (not always negatively, but differently)
    if (t.health.disabilityFromBirth) d -= 4;
    // confidence proxy
    if (t.personality.extraversion > 75) d += 3;
    if (t.personality.neuroticism > 80) d -= 3;
    return d;
  }

  // ============================================================
  // FLAVOR DESCRIPTIONS
  // ============================================================
  function describeTraits(t) {
    const ft = Math.floor(t.heightIn / 12);
    const inch = t.heightIn % 12;
    return `${ft}'${inch}" · ${t.looksTier} · IQ ${t.iq} · ${t.voice} voice · ${t.bodyType}`;
  }

  function traitFlavorLines(t) {
    const lines = [];
    if (t.physical.leftHanded) lines.push("Left-handed.");
    if (t.physical.colorBlind) lines.push("Color blind.");
    if (t.physical.needsGlasses) lines.push("Needs glasses.");
    if (t.physical.redhead) lines.push("Redhead.");
    if (t.physical.heterochromia) lines.push("Eyes are two different colors.");
    if (t.physical.albinism) lines.push("Albino — sensitive to sunlight.");
    if (t.physical.acneProne) lines.push("Skin breaks out bad in your teens.");
    if (t.physical.crookedTeeth) lines.push("Teeth came in crooked.");
    if (t.physical.baldnessGene && t.sex === "M") lines.push("Baldness gene — hairline starts retreating in your 20s.");
    if (t.physical.doubleJointed) lines.push("Double-jointed.");
    if (t.physical.identicalTwin) lines.push("Identical twin — there's another you out there.");
    if (t.physical.alcoholFlush) lines.push("Asian flush / alcohol intolerance.");
    if (t.physical.cantWhistle) lines.push("Cannot whistle. Never could.");

    if (t.health.asthma) lines.push("Asthma — inhaler kid.");
    if (t.health.peanutAllergy) lines.push("Peanut allergy — actually dangerous.");
    if (t.health.celiac) lines.push("Celiac — gluten wrecks you.");
    if (t.health.severePeriods) lines.push("Period pain that levels you (genetic).");
    if (t.health.disabilityFromBirth) lines.push(`Born with ${t.health.disabilityFromBirth}. World treats you different.`);
    if (t.health.disabilityMild) lines.push(`Born with a ${t.health.disabilityMild}. Background fact, but it's there.`);
    if (t.health.sleepNeed === "short-sleeper") lines.push("True short-sleeper gene — 5 hours and you're set.");
    if (t.health.sleepNeed === "long-sleeper") lines.push("You need 9+ hours or you're useless.");
    if (t.health.alcoholTolerance === "iron-liver") lines.push("Iron liver — you can drink anyone under the table.");
    if (t.health.alcoholTolerance === "lightweight") lines.push("Lightweight — two drinks and it's over.");

    if (t.neuro.adhd) lines.push("ADHD wiring — hyperfocus or zero focus, no in-between.");
    if (t.neuro.autism) lines.push("Autism spectrum — pattern brain, struggles with small talk.");
    if (t.neuro.dyslexia) lines.push("Dyslexia — reading is work.");
    if (t.neuro.aphantasia) lines.push("Aphantasia — cannot picture things in your head.");
    if (t.neuro.synesthesia) lines.push("Synesthesia — numbers have colors.");
    if (t.neuro.faceBlind) lines.push("Face blindness — you remember names, not faces.");
    if (t.neuro.toneDeaf) lines.push("Tone deaf — singing is not your gift.");
    if (t.neuro.perfectPitch) lines.push("Perfect pitch — 1 in 10,000.");

    if (t.mental.depressionRisk === "elevated") lines.push("Depression runs in your family.");
    if (t.mental.anxietyRisk === "elevated") lines.push("Anxiety baseline runs hot.");
    if (t.mental.bipolarRisk === "elevated") lines.push("Bipolar lean — the ups feel like flying.");
    if (t.mental.addictionRisk === "elevated") lines.push("Addictive personality wired in. Be careful what you start.");
    if (t.mental.psychopathyLean) lines.push("Empathy dial sits a few notches low.");

    if (t.orientation !== "straight") lines.push(`Orientation: ${t.orientation}.`);

    return lines;
  }

  // ============================================================
  // EXPORT
  // ============================================================
  global.Traits = {
    roll: rollTraits,
    statMods: statModsFromTraits,
    predict: predictLifeEvent,
    perception: perceptionDelta,
    describe: describeTraits,
    flavorLines: traitFlavorLines,
    // expose internals for testing
    _bell: bell,
    _chance: chance
  };
})(typeof window !== "undefined" ? window : globalThis);
