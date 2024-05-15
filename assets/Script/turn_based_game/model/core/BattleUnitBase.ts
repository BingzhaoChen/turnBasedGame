import BattleUnitAttrMgr from "./BattleUnitAttrMgr"
import BattleUnitEffectMgr from "./BattleUnitEffectMgr"
import SkillBase from "./SkillBase"

export default abstract class BattleUnitBase{

    /**唯一ID */
    uid: string = ""

    /**属性管理 */
    attrMgr = new BattleUnitAttrMgr()

    /** buff debuff */
    effectMgr = new BattleUnitEffectMgr()

    allSkills: SkillBase[] = [];

    /** 位置 */
    pos: {x, y} = {x: 0, y: 0}

    /**
     * 单位分组；敌我识别
     */
    unitGroup: number

    constructor(param: {uid: string, group: number, pos: {x,y}}){
        this.uid = param.uid
        this.pos = param.pos
        this.unitGroup = param.group
    }

    abstract isAlive(): boolean

    /**
     * 能否行动
     * @returns 
     */
    abstract canAction(): boolean

    /**
     * 战斗开始
     */
    abstract onCombatStart(): void;

    onOneRoundEnd(){

    }
}