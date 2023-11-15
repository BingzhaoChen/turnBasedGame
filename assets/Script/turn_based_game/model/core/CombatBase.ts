/**
 * 
 * 回合制游戏；
 * 
 */


import BattleUnitBase from "./BattleUnitBase";
import { I_ActionMsg } from "./TurnBasedGameConst";

export default abstract class CombatBase <T extends BattleUnitBase> {
    /** 所有单位 */
    units: T[];

    /**当前回合数 */
    curRound: number;   

    /** 该回合可以行动的战斗单位队列 */
    protected _actionUnitQueue: T[]; 

    curUnit: T = null; // 添加一个属性来跟踪当前执行行动的角色  

    /**
     * 战斗结束
     */
    private _battleEnd: boolean = false

    constructor(units: T[]) {
        this.units = units;
        this.curRound = 0;    
        this._battleEnd = false
    }

    battleStart(){
        this._actionUnitQueue = []
        this.curUnit = null
        this._battleEnd = false
        this.curRound = 0;   
    }

    /**
     * 行动队列筛选、行动顺序排序；
     */
    protected _resetAcitonQueue() {
        this._actionUnitQueue = this._actionUnitQueue.filter(c => c.canAction())
    }

    /**
     * 一轮开始
     */
    roundBegin(){
        this.curRound += 1
        this._actionUnitQueue = this.units
        this._resetAcitonQueue()
        for(let e of this.units){
            e.effectMgr.addEffectRound()
        }
        cc.log(`=======round: ${this.curRound} begin ====================`)
    }


    getNextUnit() {
        this._resetAcitonQueue()
        if (this._actionUnitQueue.length > 0 && !this._checkGameEnd()) { // 确保队列中还有角色  
            this.curUnit = this._actionUnitQueue[0]
            return this.curUnit
        }
        else {
            this._onRoundEnd()
            return null; // 返回null，表示没有可行动的角色  
        }
    }

    /**
     * 单位 执行行动
     * @param action_unit 
     * @returns 
     */
    executeAction(action_unit: T): I_ActionMsg {
        let result = this._runAction(action_unit)
        this._actionUnitQueue.shift()
        return result
    }

    /**
     * 一轮结束
     */
    private _onRoundEnd(){
        cc.log(`=======round: ${this.curRound} end =========`)
        if (this._checkGameEnd()){
            this._onBattleEnd()
        }
        else{
            let units = this.units.filter(c => c.isAlive())
            for (let e of units){
                e.onOneRoundEnd()
            }
        }
    }

    protected abstract _checkGameEnd(): boolean

    /**
     * 行动具体逻辑
     * @param unit 
     */
    protected abstract _runAction(unit: T): I_ActionMsg

    /**
     * 战斗结束
     */
    private _onBattleEnd(){
        this._battleEnd = true
        cc.log(`=======battle end =========`)
    }

    get battleEnd(){
        return this._battleEnd
    }

}