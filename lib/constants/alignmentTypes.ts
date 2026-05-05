import type { ArenaKey } from "@/types/quiz";

export interface AlignmentTypeDefinition {
  key: string;
  name: string;
  tagline: string;
  description: string;
  gapPattern: ArenaKey[];
  q13Match: Array<"A" | "B" | "C" | "D">;
}

export const ALIGNMENT_TYPES: AlignmentTypeDefinition[] = [
  {
    key: "deferred_explorer",
    name: "The Deferred Explorer",
    tagline: "The map you're following isn't quite yours.",
    description:
      "You've been responsible, and it shows. What's also showing is how long it's been since you did something just because you wanted to. Adventure, creativity, and play have quietly moved to the back of the line while everything else took priority.",
    gapPattern: ["play", "creativity", "freedom"],
    q13Match: ["A", "B"]
  },
  {
    key: "goalpost_mover",
    name: "The Goalpost Mover",
    tagline: "Someday has been the answer for a while now.",
    description:
      "You're not avoiding your life — you're building toward it. The next project, the next quarter, the next milestone. The thing is, the life you're building toward keeps moving. You're excellent at doing the next important thing. The gap is in noticing that 'someday' has been the answer for a while now.",
    gapPattern: ["play", "freedom", "contribution"],
    q13Match: ["B"]
  },
  {
    key: "obligation_carrier",
    name: "The Obligation Carrier",
    tagline: "Permission is the thing you're waiting for.",
    description:
      "You're good at showing up for everyone else. The gap is in showing up for yourself without feeling like it needs to be earned first. You know what you want — you're just not sure you're allowed to want it. No external source is going to grant that permission.",
    gapPattern: ["freedom", "play", "creativity"],
    q13Match: ["A"]
  },
  {
    key: "quiet_achiever",
    name: "The Quiet Achiever",
    tagline: "Winning at the wrong game is still losing.",
    description:
      "By most measures you're doing well. By your own measure — the one that tracks meaning and genuine impact — something's off. You've been aware of this longer than you've admitted. The gap isn't in your effort; it's in the direction of it.",
    gapPattern: ["contribution", "play"],
    q13Match: ["A", "B", "C"]
  },
  {
    key: "mid_crossing",
    name: "The Mid-Crossing",
    tagline: "You can see the other side. You're already moving.",
    description:
      "You're not lost — you're between. You can see what you want more clearly than you can live it yet. The gap isn't about understanding; it's about the slow, steady work of closing the distance. The fact that multiple areas are in flux isn't a problem. It's a sign you're actually doing it.",
    gapPattern: ["work", "contribution", "freedom"],
    q13Match: ["B", "D"]
  },
  {
    key: "scattered_potential",
    name: "The Scattered Potential",
    tagline: "You don't need to fix everything. You need to find the thread.",
    description:
      "A lot of things feel slightly off at once, which makes it hard to know where to start. That's not a character flaw — it's what misalignment feels like when it's been building for a while. You don't need to fix everything. One arena, one experiment, one degree of drift corrected at a time.",
    gapPattern: ["work", "freedom", "play", "creativity", "contribution"],
    q13Match: ["D"]
  },
  {
    key: "almost_there",
    name: "The Almost There",
    tagline:
      "Most of your life is genuinely yours. One thing keeps pulling the score down.",
    description:
      "Most of your life is genuinely yours — and you've done real work to get here. One area keeps dragging the score down, and it's usually the area you care about most. Often it's work or contribution: the thing that should feel like the point, but currently doesn't quite.",
    gapPattern: ["contribution", "work"],
    q13Match: ["A", "B", "C"]
  }
];
