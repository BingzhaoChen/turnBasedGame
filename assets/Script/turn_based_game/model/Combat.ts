/**
 * 
 * 回合制游戏；由N个回合组成，每个回合包含3个状态（回合开始前，回合进行中，回合结束后）
 * 
 */

import MathUtils from "../../MathUtils"
import BattleFormula from "./BattleFormula"
import BattleUnit from "./BattleUnit"
import CombatBase from "./core/CombatBase"
import { I_BattleMsg, I_RoundMsg, I_ActionMsg, E_SubActionType, I_SubActionMsg, E_BattleUnitAttr, E_EffectType } from "./core/TurnBasedGameConst"


export default class Combat extends CombatBase<BattleUnit> {

    /**
     * 战斗记录
     */
    private _battleReport: I_BattleMsg = null

    runCombat() {
        this._battleReport = {
            rounds: []
        }
        this.battleStart()

        this._runNextRound()

        return this._battleReport
    }

    _runNextRound() {
        this.roundBegin()
        let roundMsg: I_RoundMsg = {
            curRound: this.curRound,
            actions: []
        }
        this._battleReport.rounds.push(roundMsg)

        this._runNextAction()
    }

    _runNextAction() {
        let unit = this.getNextUnit()
        if (unit) {
            let actionResult = this.executeAction(unit)
            cc.log("result :", actionResult)
            this._battleReport.rounds[this._battleReport.rounds.length - 1].actions.push(actionResult)
            this._runNextAction()
        }
        else {
            if (!this.battleEnd) {
                this._runNextRound()
            }
            else {
                cc.log("game end")
            }
        }
    }

    _runAction(action_unit: BattleUnit) {
        let target = action_unit.getTarget(this.units)
        if (!target){
            cc.error("no target")
            return null
        }

        cc.log(`======= ${action_unit.uid} 选中了 ${target.uid}======`)
        let actionMsg: I_ActionMsg = {
            subActions: []
        }
 
        let result_1 = this._runSubAction(action_unit, target, E_SubActionType.NORMAL)
        actionMsg.subActions.push(result_1)
        if (target.canAction()){
            if (MathUtils.rateBingo(BattleFormula.getCounterattack(target))){
                let result_2 = this._runSubAction(target, action_unit, E_SubActionType.COUNTERATTACK)
                actionMsg.subActions.push(result_2)
            }
        }

        if (action_unit.isAlive() && target.isAlive()){
            if (MathUtils.rateBingo(BattleFormula.getDoubleHit(action_unit))){
                let result_3 = this._runSubAction(action_unit, target, E_SubActionType.DOUBLE_HIT)
                actionMsg.subActions.push(result_3)

                if (target.canAction()){
                    if (MathUtils.rateBingo(BattleFormula.getCounterattack(target))){
                        let result_2 = this._runSubAction(target, action_unit, E_SubActionType.COUNTERATTACK)
                        actionMsg.subActions.push(result_2)
                    }
                }
            }
        }

        return actionMsg
    }

    /**
     * 子行为
     * @param actionUnit 
     * @param target 
     * @param subActionType 
     * @returns 
     */
    _runSubAction(actionUnit: BattleUnit, target: BattleUnit, subActionType: E_SubActionType) {
        cc.log(`${actionUnit.uid} 攻击 ${target.uid}==攻击类型：${E_SubActionType[subActionType]}`)

        let result: I_SubActionMsg = {
            subActionType: subActionType,
            actionUID: actionUnit.uid,
            targetUID: target.uid,
        }

        let hit_rate = BattleFormula.getCurHitRate(actionUnit)
        let rate = hit_rate - BattleFormula.getDodge(target)
        let hit = MathUtils.rateBingo(rate)
        if (hit) {
            //命中

            let attack = BattleFormula.getAtk(actionUnit)
            let targetDefense = BattleFormula.getDefense(target)

            let hurt_num = Math.max(attack - targetDefense, 1)
            if (MathUtils.rateBingo(BattleFormula.getCritical(actionUnit))) {
                // 暴击
                result.critical = true
                hurt_num *= 2
            }

            hurt_num = BattleFormula.getBeActualHurt(attack, target)
            target.beHurt(hurt_num)

            let suck_blood = BattleFormula.getSuckBlood(hurt_num, actionUnit)
            if (suck_blood) {
                cc.log(`${actionUnit.uid} 吸血:${suck_blood}`)
                actionUnit.attrMgr.addAttrNum(E_BattleUnitAttr.HP, suck_blood)
                result.suckBlood = suck_blood
            }

            if (MathUtils.rateBingo(BattleFormula.getStunRate(actionUnit))){
                //击晕
                cc.log(`${target.uid}==被晕了===`)
                target.effectMgr.addEffect({
                    id: E_EffectType.STUN, 
                    eff_num: 0, 
                    cur_round: 1,
                    sustain_round: 1,
                })
                result.stun = true
            }

            result.isMiss = false
            result.hurtNum = hurt_num
            return result
        }
        else {
            //未命中
            result.isMiss = true
            return result
        }
    }

    protected _checkGameEnd(): boolean {
        let units = this.units.filter(c => (c.isAlive() && c.unitType == 1))
        let units2 = this.units.filter(c => (c.isAlive() && c.unitType == 2))

        if (units.length >= 1 && units2.length >= 1) {
            return false
        }
        else {
            return true
        }
    }

    protected _resetAcitonQueue() {
        this._actionUnitQueue = this._actionUnitQueue.filter(c => c.canAction())
        this._actionUnitQueue.sort((a, b) => b.attrMgr.getAttr(E_BattleUnitAttr.SPEED) - a.attrMgr.getAttr(E_BattleUnitAttr.SPEED))
    }

}

