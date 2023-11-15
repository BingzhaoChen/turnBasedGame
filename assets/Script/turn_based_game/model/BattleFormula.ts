/**
 * 
 * 战斗数值计算类
 * 
 */

import BattleUnit from "./BattleUnit"
import { E_BattleUnitAttr } from "./core/TurnBasedGameConst"


export default class BattleFormula {


    /** 当前攻击力 */
    static getAtk(unit: BattleUnit) {
        let rate = 0
        let num = unit.attrMgr.getAttr(E_BattleUnitAttr.ATK) * (1 + rate)

        return num
    }

    static getDefense(unit: BattleUnit){
        return unit.attrMgr.getAttr(E_BattleUnitAttr.DEFENSE)
    }

    /**当前暴击几率 */
    static getCritical(unit: BattleUnit) {
        return unit.attrMgr.getAttr(E_BattleUnitAttr.CRITICAL_RATE)
    }

    /**
     * 闪避几率
     * @param unit 
     * @returns 
     */
    static getDodge(unit: BattleUnit) {
        return unit.attrMgr.getAttr(E_BattleUnitAttr.DODGE_RATE)
    }

    /**
     * 反击概率
     * @param unit 
     * @returns 
     */
    static getCounterattack(unit: BattleUnit){
        return unit.attrMgr.getAttr(E_BattleUnitAttr.COUNTERATTACK_RATE)
    }

    static getDoubleHit(unit: BattleUnit){
        return unit.attrMgr.getAttr(E_BattleUnitAttr.DOUBLE_HIT_RATE)
    }

    /**
     * 命中率
     * @param unit 
     * @returns 
     */
    static getCurHitRate(unit: BattleUnit) {
        let rate = 0

        // let reduce_hit_rate = this.effectMgr.effects[E_EffectType.reduce_hit_rate]
        // if (reduce_hit_rate){
        //     if (reduce_hit_rate.sustain_round == -1){
        //         rate -= reduce_hit_rate.eff_num
        //     }
        //     else if (reduce_hit_rate.cur_round <= reduce_hit_rate.sustain_round){
        //         rate -= reduce_hit_rate.eff_num
        //     }
        // }

        // let add_hit_rate = this.effectMgr.effects[E_EffectType.add_hit_rate]
        // if (add_hit_rate){
        //     if (add_hit_rate.sustain_round == -1){
        //         rate += add_hit_rate.eff_num
        //     }
        //     else if (add_hit_rate.cur_round <= add_hit_rate.sustain_round){
        //         rate += add_hit_rate.eff_num
        //     }
        // }


        // return this.attrMgr.getAttr(E_BattleUnitAttr.base_hitRate) + rate
        return 1
    }

    /**
     * 计算实际受到伤害值
     * @param originHurt 
     */
    static getBeActualHurt(originHurt: number, unit: BattleUnit) {

        let act_hurt = originHurt
        // let eff = unit.effectMgr.effects[E_EffectType.harm_reduction]
        // if (eff) {
        //     if (eff.sustain_round == -1) {
        //         act_hurt -= eff.eff_num
        //     }
        //     else if (eff.cur_round <= eff.sustain_round) {
        //         act_hurt -= eff.eff_num
        //     }
        // }

        return Math.round(act_hurt)
    }

    /**
     * 吸血
     * @param hurt 
     * @param unit 
     * @returns 
     */
    static getSuckBlood(hurt: number, unit: BattleUnit){
        let num = unit.attrMgr.getAttr(E_BattleUnitAttr.SUCK_BLOOD)
        // let eff = unit.effectMgr.effects[E_EffectType.suck_blood]
        // if (eff){
        //     if (eff.sustain_round == -1){
        //         num = eff.eff_num
        //     }
        //     else if (eff.cur_round <= eff.sustain_round){
        //         num = eff.eff_num
        //     }
        // }

        return Math.round(hurt * num)
    }

    static getStunRate(unit: BattleUnit){
        let num = unit.attrMgr.getAttr(E_BattleUnitAttr.STUN_RATE)
        return num
    }

    // getMaxHp(){
    //     let rate = 0
    //     let eff = this.effectMgr.getEffect(E_EffectType.add_hp_base)
    //     if (eff){
    //         if (eff.sustain_round == -1){
    //             rate += eff.eff_num
    //         }
    //         else if (eff.cur_round <= eff.sustain_round){
    //             rate += eff.eff_num
    //         }
    //     }

    //     let num = this.attrMgr.getAttr(E_BattleUnitAttr.hp_upper_limit) * (1 + rate)

    //     return num
    // }
}