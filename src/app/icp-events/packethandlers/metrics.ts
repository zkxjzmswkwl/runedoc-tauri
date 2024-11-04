import { StateManager } from '../../statemanager';

export function handleResponseMetrics(buffer: string) {

  const stateManager = StateManager.getInstance();
  var nodes = buffer.split('^').slice(0, -1);

  var skillData = stateManager.getSkillData();

  for (var node of nodes) {
    var data = node.split('#');
    // console.log(data);

    var skillId = parseInt(data[0]);
    var level = parseInt(data[1]);
    var current = parseInt(data[2]);
    var gained = parseInt(data[3]);
    var hourly = parseInt(data[4]);
    // console.log(hourly);

    skillData.addOrUpdateSkill(skillId, level, current, gained, hourly);
  }

  console.log(stateManager.getSkillData());
}