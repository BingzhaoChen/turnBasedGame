/**
 * 
 * 回合制游戏；由N个回合组成，每个回合包含3个状态（回合开始前，回合进行中，回合结束后）
 * 
 */

import MathUtils from "../../../../../framework/utils/MathUtils"
import BattleFormula from "./BattleFormula"
import BattleUnit from "./BattleUnit"
import CombatBase from "./core/CombatBase"
import { I_BattleResultMsg, I_RoundMsg, I_ActionMsg, E_SubActionType, I_SubActionMsg, E_BattleUnitAttr, E_EffectType, E_UnitGroup } from "./core/TurnBasedGameConst"


export default class Combat extends CombatBase<BattleUnit> {

    /**
     * 战斗记录
     */
    private _battleReport: I_BattleResultMsg = null


    /**
     * 1: 竞技场； 2：PVE
     */
    battleType: number = 1;

    /**
     * 在构造函数里初始化完战斗数据后，调用该方法，自动执行整个战斗流程，并返回战报；
     * 外部UI可以根据返回的战报，写具体的UI界面
     * @returns 
     */
    runCombat(battleType: number) {
        this.battleType = battleType;
        this._battleReport = {
            units: [],
            rounds: [],
            winGroup: E_UnitGroup.NONE,
        }
        for (let e of this.units){
            this._battleReport.units.push({
                uid: e.uid,
                id: e.id,
                pos: e.pos,
                unitGroup: e.unitGroup,
                unitType: e.unitType,
                hp: e.attrMgr.getAttr(E_BattleUnitAttr.HP),
                power: e.power,
                nickname: e.nickname || "",
                headIcon: e.headIcon || "",
                sexID: e.sexID,
            })
        }

        this.combatStart();

        this._runNextRound()

        this._battleReport.winGroup = (this.getGameResult() == 1) ? E_UnitGroup.MYSELF : E_UnitGroup.ENEMY
        cc.log("战斗结果：", this._battleReport)
        return this._battleReport
    }

    private _runNextRound() {
        this.roundBegin()
        
        this._runNextAction()
    }

    private _runNextAction() {
        let unit = this.getNextUnit()
        if (unit) {
            let actionResult = this.executeAction(unit)
            this._battleReport.rounds[this._battleReport.rounds.length - 1].actions.push(actionResult)
            this._runNextAction()
        }
        else {
            if (!this.isBattleEnd) {
                this._runNextRound()
            }
            else {
                cc.log("game end")
            }
        }
    }

    /**
     * 单次行动具体逻辑
     * @param acitonUnit 
     * @returns 
     */
    protected _runAction(acitonUnit: BattleUnit) {
        let target = acitonUnit.getTarget(this.units)
        if (!target){
            cc.error("no target")
            return null
        }

        cc.log(`======= ${acitonUnit.uid} 选中了 ${target.uid}======`)
        let actionMsg: I_ActionMsg = {
            actionUID: acitonUnit.uid,
            targetUID: target.uid,
            subActions: []
        }
 
        const result_1 = this._runSubAction(acitonUnit, target, E_SubActionType.NORMAL);
        actionMsg.subActions.push(result_1)

        // 提取重复代码至独立函数，优化代码可读性和维护性
        const runCounterAttackIfNeeded = (attacker: BattleUnit, defender: BattleUnit) => {
            if (defender.canAction() && MathUtils.rateBingo(BattleFormula.getCounterattack(defender, attacker))) {
                let result = this._runSubAction(defender, attacker, E_SubActionType.COUNTERATTACK);
                actionMsg.subActions.push(result);
            }
        };

        runCounterAttackIfNeeded(acitonUnit, target);

        if (acitonUnit.isAlive() && target.isAlive()){
            if (MathUtils.rateBingo(BattleFormula.getDoubleHit(acitonUnit, target))){
                let result_3 = this._runSubAction(acitonUnit, target, E_SubActionType.DOUBLE_HIT)
                actionMsg.subActions.push(result_3)

                runCounterAttackIfNeeded(acitonUnit, target);
            }
        }

        return actionMsg
    }

    /**
     * 子行为
     * @param actionUnit 
     * @param targetUnit 
     * @param subActionType 
     * @returns 
     */
    _runSubAction(actionUnit: BattleUnit, targetUnit: BattleUnit, subActionType: E_SubActionType) {
        cc.log(`${actionUnit.uid} 攻击 ${targetUnit.uid}==攻击类型：${E_SubActionType[subActionType]}`)

        let result: I_SubActionMsg = {
            subActionType: subActionType,
            actionUID: actionUnit.uid,
            targetUID: targetUnit.uid,
        }

        let hitRate = BattleFormula.getCurHitRate(actionUnit, targetUnit)
        let hit = MathUtils.rateBingo(hitRate)
        if (hit) {
            //命中

            let hurtNum = BattleFormula.getNormalHurt(actionUnit, targetUnit)
            if (this.battleType == 1){
                if (!targetUnit.power){
                    cc.error("power not found")
                    hurtNum = Math.round(hurtNum)
                }
                else{
                    if (actionUnit.unitGroup == E_UnitGroup.MYSELF && actionUnit.power > targetUnit.power){
                        hurtNum = Math.round(hurtNum * (actionUnit.power / targetUnit.power))
                    }
                    else{
                        hurtNum = Math.round(hurtNum)
                    }
                }
            }
            if (MathUtils.rateBingo(BattleFormula.getCritical(actionUnit, targetUnit))) {
                // 暴击
                result.critical = true
                hurtNum = BattleFormula.getCriticalHurt(hurtNum, actionUnit, targetUnit)
            }

            hurtNum = BattleFormula.hurtAdd(hurtNum, actionUnit)

            hurtNum = BattleFormula.hurtReduce(hurtNum, targetUnit)

            targetUnit.beHurt(hurtNum)

            let suck_blood = BattleFormula.getSuckBlood(hurtNum, actionUnit, targetUnit)
            if (suck_blood) {
                cc.log(`${actionUnit.uid} 吸血:${suck_blood}`)
                actionUnit.attrMgr.addAttrValue(E_BattleUnitAttr.HP, suck_blood)
                result.suckBlood = suck_blood
            }

            if (MathUtils.rateBingo(BattleFormula.getStunRate(actionUnit, targetUnit))){
                //击晕
                cc.log(`${targetUnit.uid}==被晕了===`)
                targetUnit.effectMgr.addEffect({
                    effType: E_EffectType.BE_STUN, 
                    effNum: 0, 
                    curRound: 1,
                    sustain_round: 1,
                })
                result.stun = true
            }

            let skills = actionUnit.playSkill([targetUnit]);
            if (skills){
                result.playSkill = skills;
            }

            if (targetUnit.attrMgr.getAttr(E_BattleUnitAttr.HP) <= 0){
                result.targetDie = true;
            }

            result.isMiss = false
            result.hurtNum = hurtNum
            return result
        }
        else {
            //未命中
            result.isMiss = true
            return result
        }
    }

    protected _resetAcitonQueue() {
        this._actionUnitQueue = this._actionUnitQueue.filter(c => c.canAction())
        this._actionUnitQueue.sort((a, b) => BattleFormula.getSpeed(b, a) - BattleFormula.getSpeed(a, b) )
    }

    onRoundBegin(): void {
        let roundMsg: I_RoundMsg = {
            curRound: this.curRound,
            actions: []
        }
        this._battleReport.rounds.push(roundMsg)
        for (let e of this._actionUnitQueue){
            for (let key in e.effectMgr.effects){
                let effect = e.effectMgr.effects[key]
                if (effect.effType == E_EffectType.BE_FIRE){
                    let hurt = effect.effNum / 10000 * e.attrMgr.getAttr(E_BattleUnitAttr.HP)
                    hurt = Math.round(hurt)
                    e.beHurt(hurt)
                    this._battleReport.rounds[this._battleReport.rounds.length - 1].beFireUnit = e.uid;
                    this._battleReport.rounds[this._battleReport.rounds.length - 1].beFireHurt = hurt;

                    cc.log(`uid: ${e.uid},被烧伤：${hurt}`);
                }
            }
        }
    }

}

