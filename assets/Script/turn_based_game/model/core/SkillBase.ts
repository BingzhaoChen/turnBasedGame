import { I_Effect } from "./TurnBasedGameConst"


export default class SkillBase {

   id: number = 0

   /**
    * 触发特效概率
    */
   rate: number = 0

   /**
    * 作用目标类型
       1 敌方单体
       2 敌方全体
       3 按敌方血量比
       10 己方自己
       11 己方伙伴
       12 己方全体
    */
   target_type: number = 1;

   /**
    * 效果触发时机
       1 战斗开始触发
       2 每回合开始触发
    */
   moment: number = 1;

   effects: I_Effect[] = []
}