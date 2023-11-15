import { E_BattleUnitAttr } from "./TurnBasedGameConst"

/**
 * 属性管理
 */
 export default class BattleUnitAttrMgr{


    /** 当前属性 */
    private _attrs: {[attrType: number]: number} = {}

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