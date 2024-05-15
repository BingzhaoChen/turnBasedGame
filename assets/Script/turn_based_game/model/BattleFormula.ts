/**
 * 
 * 战斗数值计算类
 * 
 */

import MathUtils from "../../../../../framework/utils/MathUtils"
import BattleUnit from "./BattleUnit"
import { E_BattleUnitAttr } from "./core/TurnBasedGameConst"

export default class BattleFormula {

    /** 当前攻击力 */
    static getAtk(unit: BattleUnit) {

        let rate = unit.attrMgr.getAttr(E_BattleUnitAttr.ATK_ADD_RATE)
        rate /= 10000

        let num = unit.attrMgr.getAttr(E_BattleUnitAttr.ATK) * (1 + rate)

        return num
    }

    /**
     * 普通伤害值
     * @param action 
     * @param target 
     */
    static getNormalHurt(action: BattleUnit, target: BattleUnit) {
        let atk = this.getAtk(action)
        let defense = this.getDefense(action, target)

        let hurt = Math.max((atk - defense), 0) + atk * 0.025
        hurt *=  (MathUtils.randomNum(95, 105) / 100)

        if (this.getHpPercent(target) < 0.5) {
            let bullying = action.attrMgr.getAttr(E_BattleUnitAttr.BULLYING) / 10000
            if (bullying) {
                /**触发 欺凌 */
                hurt += bullying * hurt
            }
        }
        return Math.round(hurt)
    }

    /**
     * 伤害加成
     */
    static hurtAdd(hurt: number, action: BattleUnit) {
        let num = action.attrMgr.getAttr(E_BattleUnitAttr.HURT_ADD_RATE)
        if (num) {
            let reduceNum = num / 10000 * hurt
            cc.log(`行动角色：${action.id};伤害加成比例${num/10000},加成数值:${reduceNum}`)
            hurt += reduceNum
        }

        return Math.round(hurt)
    }

    /**
     * 伤害减免
     */
    static hurtReduce(hurt: number, target: BattleUnit) {
        let num = target.attrMgr.getAttr(E_BattleUnitAttr.HURT_REDUCE_RATE)
        if (num) {
            let reduceNum = num / 10000 * hurt
            cc.log("伤害减免：", reduceNum)
            hurt -= reduceNum
        }

        return Math.round(hurt)
    }

    /**防御 */
    static getDefense(action: BattleUnit, target: BattleUnit) {

        let defense = target.attrMgr.getAttr(E_BattleUnitAttr.DEFENSE)

        let rate = action.attrMgr.getAttr(E_BattleUnitAttr.IGNORE_DEFENSE_RATE)

        defense = defense * (1 - rate/10000)

        return Math.round(defense)
    }

    static getHpPercent(unit: BattleUnit) {
        return unit.attrMgr.getAttr(E_BattleUnitAttr.HP) / unit.attrMgr.getInitialAttr(E_BattleUnitAttr.HP)
    }

    /**当前暴击几率 */
    static getCritical(unit: BattleUnit, target: BattleUnit) {
        let rate = 0

        let n1 = unit.attrMgr.getAttr(E_BattleUnitAttr.CRITICAL_RATE)

        let n2 = target.attrMgr.getAttr(E_BattleUnitAttr.IGNORE_CRITICAL_RATE)

        rate = Math.max(n1 - n2, 0) / 10000
        return rate
    }

    /**暴击伤害 */
    static getCriticalHurt(normalHurt: number, unit: BattleUnit, target: BattleUnit) {

        let n1 = unit.attrMgr.getAttr(E_BattleUnitAttr.CRITICAL_HURT)
        let n2 = target.attrMgr.getAttr(E_BattleUnitAttr.IGNORE_CRITICAL_HURT)
        let finalHurt = normalHurt * (1.5 + Math.max(n1 - n2, 0))

        return Math.round(finalHurt)
    }

    /**
     * 反击概率
     * @param unit 
     * @returns 
     */
    static getCounterattack(unit: BattleUnit, target: BattleUnit) {

        let rate = 0

        let n1 = target.attrMgr.getAttr(E_BattleUnitAttr.COUNTERATTACK_RATE)

        let n2 = unit.attrMgr.getAttr(E_BattleUnitAttr.IGNORE_CONUTERATTACT_RATE)

        rate = Math.max(n1 - n2, 0) / 10000
        return rate
    }

    /**
     * 连击
     * @param unit 
     * @param target 
     * @returns 
     */
    static getDoubleHit(unit: BattleUnit, target: BattleUnit) {

        let rate = 0

        let n1 = unit.attrMgr.getAttr(E_BattleUnitAttr.DOUBLE_HIT_RATE)

        let n2 = target.attrMgr.getAttr(E_BattleUnitAttr.IGNORE_DOUBLE_HIT_RATE)

        rate = Math.max(n1 - n2, 0) / 10000
        return rate
    }

    /**
     * 命中率
     * @param unit 
     * @returns 
     */
    static getCurHitRate(unit: BattleUnit, target: BattleUnit) {
        let rate = 0

        let n1 = target.attrMgr.getAttr(E_BattleUnitAttr.DODGE_RATE)

        let n2 = unit.attrMgr.getAttr(E_BattleUnitAttr.IGNORE_DODGE_RATE)

        rate = 1 - Math.max(n1 - n2, 0) / 10000
        return rate
    }

    /**
     * 吸血
     * @param hurt 
     * @param unit 
     * @returns 
     */
    static getSuckBlood(hurt: number, unit: BattleUnit, targetUnit: BattleUnit) {
        let num = unit.attrMgr.getAttr(E_BattleUnitAttr.SUCK_BLOOD)
        let num_2 = targetUnit.attrMgr.getAttr(E_BattleUnitAttr.IGNORE_SUCK_BLOOD)

        let rate = Math.max(num - num_2, 0) / 10000

        return Math.round(hurt * rate)
    }

    /**
     * 击晕概率
     * @param unit 
     * @param target 
     * @returns 
     */
    static getStunRate(unit: BattleUnit, target: BattleUnit) {
        let n1 = unit.attrMgr.getAttr(E_BattleUnitAttr.STUN_RATE)
        let n2 = target.attrMgr.getAttr(E_BattleUnitAttr.IGNORE_STUN_RATE)

        let rate = Math.max(n1 - n2, 0) / 10000

        return rate
    }

    static getSpeed(unit: BattleUnit, target: BattleUnit) {
        let speed = unit.attrMgr.getAttr(E_BattleUnitAttr.SPEED) * (1 - Math.min(target.attrMgr.getAttr(E_BattleUnitAttr.MUDDY) / 10000, 0.75))
        return speed
    }

}