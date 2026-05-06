const NARRATIVES: Record<string, string> = {
  deferred_explorer:
    "[firstName], the pattern here is pretty clear. [topArenaLabel] keeps showing up as your biggest gap, and it is not because you forgot it matters. It is because you have been too responsible to prioritize it. The life you actually want has not gone anywhere. You have just kept putting it after everything else.",
  goalpost_mover:
    "[firstName], you are not avoiding your life. You are building toward it. The next project, the next milestone, the next thing. The gap in [topArenaLabel] keeps appearing because the version of your life you are working toward keeps moving. You are excellent at the next important thing. The question is whether someday has become a permanent address.",
  obligation_carrier:
    "[firstName], you are good at showing up for everyone else. The score shows it. [topArenaLabel] is where your life has drifted furthest from what you said matters most. The gap is not about capability. It is about permission. And nobody external is going to grant it.",
  quiet_achiever:
    "[firstName], by most measures things look fine. But [topArenaLabel] keeps pulling your score down because it is the area you actually care about most. You have been winning at a game that does not quite feel like yours. That is not a small thing.",
  mid_crossing:
    "[firstName], you are not lost. You are between. [topArenaLabel] is showing up as your biggest gap right now, and that tracks with someone who can see where they want to go more clearly than they can live it yet. The distance is not the problem. Staying still would be.",
  scattered_potential:
    "[firstName], a lot of things feel slightly off at once - and [topArenaLabel] is pulling the score down most. That is not a character flaw. That is what accumulated drift feels like. You do not need to fix everything. You need one thread to pull.",
  almost_there:
    "[firstName], most of your life is genuinely yours. But [topArenaLabel] keeps dragging the score down because it is the area you care about most. One focused gap is actually a good problem to have. It means the work is specific."
};

export function getResultNarrative(
  typeKey: string,
  vars: { firstName: string; topArenaLabel: string; futureVision?: string | null }
) {
  const template = NARRATIVES[typeKey] ?? NARRATIVES.mid_crossing;
  let narrative = template
    .replaceAll("[firstName]", vars.firstName || "Friend")
    .replaceAll("[topArenaLabel]", vars.topArenaLabel || "this area");

  const futureVision = vars.futureVision?.trim();
  if (futureVision) {
    narrative += `\n\nYou said you want ${futureVision} to be true in a year. That is exactly what closing this gap points toward.`;
  }

  return narrative;
}

export { NARRATIVES };
