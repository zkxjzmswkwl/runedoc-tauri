export type MetricSnapshot = {
    skillId: number;
    level: number;
    current: number;
    gained: number;
    hourly: number[];
};

export class SkillData {
    public snapshots: MetricSnapshot[] = Array(29).fill(null);

    constructor() {
        for (let i = 0; i < 29; i++) {
            this.addOrUpdateSkill(i, 1, 0, 0, 0);
        }
    }

    addOrUpdateSkill(skillId: number, level: number, current: number, gained: number, newHourly: number) {
        console.log(`Adding or updating skill ${skillId} with level ${level}, current ${current}, gained ${gained}, and hourly ${newHourly}.`);
        
        if (skillId < 0 || skillId >= this.snapshots.length) {
            console.error(`Skill ID ${skillId} is out of bounds.`);
        }

        const snapshot = this.snapshots[skillId];

        if (snapshot) {
            // Update existing skill
            snapshot.level = level;
            snapshot.current = current;
            snapshot.gained = gained;

            // Append to hourly, and maintain a max of 50 entries
            snapshot.hourly.push(newHourly);
            if (snapshot.hourly.length > 50) {
                snapshot.hourly.shift(); // Remove the oldest entry
            }
        } else {
            // Add new skill with the given values
            this.snapshots[skillId] = {
                skillId,
                level,
                current,
                gained,
                hourly: [newHourly],
            };
        }
    }

    getSkill(skillId: number): MetricSnapshot | null {
        return this.snapshots[skillId] || null;
    }

    getAllSkills(): (MetricSnapshot | null)[] {
        return this.snapshots;
    }
}