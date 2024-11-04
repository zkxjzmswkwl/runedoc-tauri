enum Skill {
  ATTACK = 0,
  DEFENCE = 1,
  STRENGTH = 2,
  HITPOINTS = 3,
  RANGED = 4,
  PRAYER = 5,
  MAGIC = 6,
  COOKING = 7,
  WOODCUTTING = 8,
  FLETCHING = 9,
  FISHING = 10,
  FIREMAKING = 11,
  CRAFTING = 12,
  SMITHING = 13,
  MINING = 14,
  HERBLORE = 15,
  AGILITY = 16,
  THIEVING = 17,
  SLAYER = 18,
  FARMING = 19,
  RUNECRAFTING = 20,
  HUNTER = 21,
  CONSTRUCTION = 22,
  SUMMONING = 23,
  DUNGEONEERING = 24,
  DIVINATION = 25,
  INVENTION = 26,
  ARCHAEOLOGY = 27,
  NECROMANCY = 28,
}

export const SkillColors: { [key: number]: string } = {
  [Skill.ATTACK]: '#AA0000',
  [Skill.DEFENCE]: '#007F00',
  [Skill.STRENGTH]: '#FF0000',
  [Skill.HITPOINTS]: '#FF0000',
  [Skill.RANGED]: '#007F0E',
  [Skill.PRAYER]: '#FFFFFF',
  [Skill.MAGIC]: '#1E90FF',
  [Skill.COOKING]: '#6E2D04',
  [Skill.WOODCUTTING]: '#006000',
  [Skill.FLETCHING]: '#3A8E00',
  [Skill.FISHING]: '#0000FF',
  [Skill.FIREMAKING]: '#B45F06',
  [Skill.CRAFTING]: '#964B00',
  [Skill.SMITHING]: '#4A4A4A',
  [Skill.MINING]: '#3C3C3C',
  [Skill.HERBLORE]: '#00A500',
  [Skill.AGILITY]: '#000000',
  [Skill.THIEVING]: '#562C05',
  [Skill.SLAYER]: '#414141',
  [Skill.FARMING]: '#32CD32',
  [Skill.RUNECRAFTING]: '#6B4226',
  [Skill.HUNTER]: '#6A5ACD',
  [Skill.CONSTRUCTION]: '#8B4513',
  [Skill.SUMMONING]: '#3C4D3C',
  [Skill.DUNGEONEERING]: '#5F5A58',
  [Skill.DIVINATION]: '#317873',
  [Skill.INVENTION]: '#B4B4B4',
  [Skill.ARCHAEOLOGY]: '#004080',
  [Skill.NECROMANCY]: '#2E2B5F',
};

export const SkillNames = [
  "Attack", "Defence", "Strength", "Hitpoints", "Ranged", "Prayer", "Magic",
  "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting",
  "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming",
  "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering",
  "Divination", "Invention", "Archaeology", "Necromancy"
];

export function getColorForSkill(skillId: number): string {
  return SkillColors[skillId] || '#000000';
}

export function convertSkillToFormattedString(skillId: number): string {
  return SkillNames[skillId] || `Skill ${skillId}`;
}
