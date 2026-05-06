import type { ArenaKey } from "@/types/quiz";

export const FIRST_EXPERIMENTS: Record<ArenaKey, { title: string; description: string }> = {
  work: {
    title: "The Chosen Work Test",
    description:
      "This week, identify one task at work that you would choose to do even if it were not required. Do that one first, before anything else, and notice how it feels compared to the rest of your day. You are looking for the difference between chosen and assigned."
  },
  financial: {
    title: "The Honest Money Hour",
    description:
      "Set aside one hour this week to look at your finances without judgment - just facts. Write down the one money decision that would most reduce your baseline stress. You do not have to act on it yet. Just name it clearly."
  },
  relationships: {
    title: "The Real Conversation experiment",
    description:
      "This week, have one conversation where you say what you actually think instead of what you think the other person wants to hear. It does not have to be dramatic. Just more true than usual."
  },
  health: {
    title: "The One Thing experiment",
    description:
      "Pick the single physical thing you know would make you feel better if you did it consistently - not the whole routine, just one thing. Do it every day this week. Notice whether the obstacle was actually time or something else."
  },
  freedom: {
    title: "The One No experiment",
    description:
      "This week, say no to one obligation you would normally say yes to out of habit or guilt. It can be small. Notice what happens - both in the world and in how you feel about having done it."
  },
  play: {
    title: "The Reclaim an Hour experiment",
    description:
      "This week, reclaim one hour that would normally go to something obligatory. Do something you actually want to do with it - not productive, not useful, just yours. Notice how it feels to take that space without justifying it."
  },
  creativity: {
    title: "The Make Something Ugly experiment",
    description:
      "Make something this week with no intention of it being good. Write something, draw something, build something - anything creative that you will not show anyone. The goal is to remember what it feels like to make something just because you wanted to."
  },
  contribution: {
    title: "The One Real Thing experiment",
    description:
      "This week, do one thing that genuinely helps someone - not out of obligation, but because you chose it. Notice whether it gives you energy or costs it. That answer tells you something important about what meaningful contribution looks like for you."
  }
};

export function getFirstExperiment(arenaKey: ArenaKey) {
  return FIRST_EXPERIMENTS[arenaKey];
}
