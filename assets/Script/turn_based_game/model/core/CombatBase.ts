/**
 * 
 * 回合制游戏；
 * 
 */


import BattleUnitBase from "./BattleUnitBase";
import { E_UnitGroup, I_ActionMsg } from "./TurnBasedGameConst";

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
    private _isBattleEnd: boolean = false

    constructor(units: T[]) {
        this.units = units;
        this.curRound = 0;    
        this._isBattleEnd = false
        this._actionUnitQueue = []
        this.curUnit = null
    }

    /**
     * 行动队列筛选、行动顺序排序；
     */
    protected _resetAcitonQueue() {
        this._actionUnitQueue = this._actionUnitQueue.filter(c => c.canAction())
    }

    /**
     * 战斗开始
     */
    public combatStart(){
        for (let e of this.units){
            e.onCombatStart();
        }
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

        this.onRoundBegin()
    }

    protected onRoundBegin(): void{

    }

    /**从行动队列中获取下一行动单位 */
    getNextUnit() {
        this._resetAcitonQueue()
        if (this._actionUnitQueue.length > 0 && !this.getGameResult()) { // 确保队列中还有角色  
            this.curUnit = this._actionUnitQueue[0]
            return this.curUnit
        }
        else {
            this._onRoundEnd()
            return null; // 返回null，表示没有可行动的角色  
        }
    }

    /**
     * 行动单位 执行行动
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
        if (this.getGameResult()){
            this._onBattleEnd()
        }
        else{
            let units = this.units.filter(c => c.isAlive())
            for (let e of units){
                e.onOneRoundEnd()
            }
        }
    }

    /**
     * 游戏结果:
     * 0： 还在打；
     * -1： 输；
     * 1： 赢
     */
     protected getGameResult(): number {
        let units = this.units.filter(c => (c.isAlive() && c.unitGroup == E_UnitGroup.MYSELF))
        let units2 = this.units.filter(c => (c.isAlive() && c.unitGroup == E_UnitGroup.ENEMY))

        if (units.length <= 0){
            return -1
        }
        else if (units2.length <= 0){
            return 1
        }
        else{
            return 0
        }
    }

    /**
     * 行动具体逻辑
     * @param unit 
     */
    protected abstract _runAction(unit: T): I_ActionMsg

    /**
     * 战斗结束
     */
    private _onBattleEnd(){
        this._isBattleEnd = true
        cc.log(`=======battle end =========`)
    }

    get isBattleEnd(){
        return this._isBattleEnd
    }

}