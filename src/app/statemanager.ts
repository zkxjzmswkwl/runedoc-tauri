import { SkillData } from "./routes/tracker/skilldata";

export class StateManager {
  private static instance: StateManager;
  private state: { [key: string]: any } = {};
  private skillData: SkillData = new SkillData();

  private constructor() {}

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  public set(key: string, value: any): void {
    this.state[key] = value;
  }

  public get(key: string): any {
    return this.state[key];
  }

  public getSkillData(): SkillData {
    return this.skillData;
  }
}