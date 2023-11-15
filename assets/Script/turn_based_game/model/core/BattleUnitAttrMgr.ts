import { E_BattleUnitAttr } from "./TurnBasedGameConst"

/**
 * 属性管理
 */
 export default class BattleUnitAttrMgr{


    /** 当前属性 */
    private _attrs: {[attrType: number]: number} = {}

    /**有些属性需要记录初始值的；如初始进入游戏的生命值为生命值上限 */
    private _initAttrs: {[attrType: number]: number} = {}

    initAttr(param: {[attrType: number]: number}){
        for (let k in param){
            this._initAttrs[k] = param[k]
            this._attrs[k] = param[k]
        }
    }

    getAttr(type: E_BattleUnitAttr){
        if (!this._attrs[type]){
            this._attrs[type] = 0
        }
        return this._attrs[type]
    }

    setAttr(type: E_BattleUnitAttr, num: number){
        this._attrs[type] = num
    }

    addAttrNum(type: E_BattleUnitAttr, num: number){
        if (!this._attrs[type]){
            this._attrs[type] = 0
        }
        this._attrs[type] += num
    }
}