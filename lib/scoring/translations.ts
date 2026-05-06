export function translatePermissionOrientation(key: string | null): string {
  const map: Record<string, string> = {
    A: "They know what they want but feel uncertain they are allowed to want it",
    B: "They have been so busy doing the next thing they have lost track of what they actually want",
    C: "They know what they want and are actively working toward it",
    D: "They want something to change but do not know what yet"
  };
  return map[key ?? ""] ?? "unclear";
}

export function translateInfluenceSource(key: string | null): string {
  const map: Record<string, string> = {
    parents: "their parents and upbringing",
    partner_family: "their partner or family",
    peers: "their peers and social circle",
    society: "society and culture broadly",
    past_decisions: "old decisions they feel locked into",
    inner_critic: "their own inner critic and self-imposed standards"
  };
  return map[key ?? ""] ?? "external expectations";
}

export function translateSacrifice(key: string | null): string {
  const map: Record<string, string> = {
    time_myself: "time for themselves",
    creative_projects: "creative projects",
    physical_health: "physical health",
    meaningful_work: "meaningful work",
    close_relationships: "their closest relationships",
    fun_spontaneity: "fun and spontaneity",
    learning: "learning something new",
    sleep_rest: "sleep and rest"
  };
  return map[key ?? ""] ?? "personal needs";
}

export function translateEnvy(key: string | null): string {
  const map: Record<string, string> = {
    freedom_time: "others' freedom and how they spend their time",
    purpose_impact: "others' sense of purpose and impact",
    creative_output: "others' creative output",
    relationship_quality: "the quality of others' relationships",
    financial_independence: "others' financial independence",
    health_energy: "others' health and energy",
    sense_of_adventure: "others' sense of adventure",
    confidence_to_be_themselves: "others' confidence to just be themselves"
  };
  return map[key ?? ""] ?? "aspects of others lives";
}
