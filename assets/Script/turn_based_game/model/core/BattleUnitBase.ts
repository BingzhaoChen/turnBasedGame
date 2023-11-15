import BattleUnitAttrMgr from "./BattleUnitAttrMgr"
import BattleUnitEffectMgr from "./BattleUnitEffectMgr"

export default abstract class BattleUnitBase{

    /**唯一ID */
    uid: string = ""

    /**属性管理 */
    attrMgr = new BattleUnitAttrMgr()

    /** buff debuff */
    effectMgr = new BattleUnitEffectMgr()

    /** 位置 */
    pos: {x, y} = {x: 0, y: 0}

    constructor(uid: string){
        this.uid = uid
    }

    abstract isAlive(): boolean

    /**
     * 能否行动
     * @returns 
     */
    abstract canAction(): boolean

    onOneRoundEnd(){

    }
}