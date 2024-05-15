import { E_BattleUnitAttr } from "./TurnBasedGameConst"

/**
 * 属性管理
 */
 export default class BattleUnitAttrMgr{

    /** 当前属性 */
    private _attrs: {[id: string]: number} = {}

    /**有些属性需要记录初始值的；如初始进入游戏的生命值为生命值上限 */
    private _initialAttrs: {[id: string]: number} = {}

    initAttr(param: {[id: string]: number}){
        for (let k in param){
            this._initialAttrs[k] = param[k]
            this._attrs[k] = param[k]
        }
    }

    getAttr(id: E_BattleUnitAttr){
        if (!this._attrs[id]){
            this._attrs[id] = 0
        }
        return this._attrs[id]
    }

    getInitialAttr(type: E_BattleUnitAttr){
        if (!this._initialAttrs[type]){
            this._initialAttrs[type] = 0
        }
        return this._initialAttrs[type]
    }

    /**
     * 设置属性值
     * @param type 
     * @param value 
     */
    setAttr(type: E_BattleUnitAttr, value: number){
        this._attrs[type] = value
    }

    addAttrValue(type: E_BattleUnitAttr, value: number){
        if (!this._attrs[type]){
            this._attrs[type] = 0
        }
        this._attrs[type] += value
    }

    addAttrMaxValue(type: E_BattleUnitAttr, value: number){
        if (!this._initialAttrs[type]){
            this._initialAttrs[type] = 0;
        }
        this._initialAttrs[type] += value;
    }

    add(attr: BattleUnitAttrMgr){
        if (!attr) return;
        for (let k in attr.attrs){
            this.addAttrValue(Number(k), attr.attrs[k])
        }
    }

    get attrs(){
        return this._attrs
    }

    getList(){
        let arr: {k: number, v: number}[] = []
        for (let k in this._attrs){
            arr.push({k: Number(k), v: this._attrs[k]})
        }

        arr.sort((a, b) => {
            return a.k - b.k
        })

        return arr
    }
}