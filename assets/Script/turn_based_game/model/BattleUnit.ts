import Vec2Utils from "../../Vec2Utils"
import BattleUnitBase from "./core/BattleUnitBase"
import { E_BattleUnitAttr, E_EffectType } from "./core/TurnBasedGameConst"


export default class BattleUnit extends BattleUnitBase{
    
    id: number

    /**
     * 单位类型；敌我识别
     */
    unitType: number

    constructor(param: {uid: string, unitType: number, pos: {x,y}}){
        super(param.uid)
        this.pos = param.pos
        this.unitType = param.unitType
    }

    /**获取对手 */
    getTarget(targets: BattleUnit[]){

        let arr = targets.filter( (c) => {
            return ((c.unitType != this.unitType) && c.isAlive())
        })
        
        let target: BattleUnit = null
        let d: number = 0
        for (let e of arr){
            let distance = Vec2Utils.getDistance(e.pos, this.pos)
            if (!target){
                target = e
                d = distance
            }
            else{
                if (distance < d){
                    target = e
                    d = distance
                }
            }
        }

        return target
    }

    beHurt(count: number){
        this.attrMgr.addAttrNum(E_BattleUnitAttr.HP, -count)

        // if (this.attrMgr.getAttr(E_BattleUnitAttr.cur_hp) <= this.getMaxHp()/2){
        //     if (this.skills){
        //         for (let skill of this.skills){
        //             if (skill.id == 20003){
        //                 this._addEffectBySkill(skill)
        //                 return true
        //             }
        //         }
        //     }
        // }
    }

    // _addEffectBySkill(skill: SkillBase){
    //     if (skill.cfg.is_myself){
    //         if (skill.cfg.random_effect){
    //             let effect: gameConfig.IEffect = MathUtils.randomArr(skill.cfg.effect, 1)[0]
    //             if (effect && effect.effect_type){
    //                 this.effectMgr.addEffect({
    //                     id: effect.effect_type,
    //                     eff_num: effect.eff_num,
    //                     cur_round: 1,
    //                     sustain_round: effect.sustain_round,
    //                 })
    //             }
    //             else{
    //                 cc.error("random_effect:", skill.cfg.effect)
    //             }
    //         }
    //         else{
    //             for (let effect of skill.cfg.effect){
    //                 this.effectMgr.addEffect({
    //                     id: effect.effect_type,
    //                     eff_num: effect.eff_num,
    //                     cur_round: 1,
    //                     sustain_round: effect.sustain_round,
    //                 })
    //             }
    //         }
    //     }
    //     else {
    //         for (let effect of skill.cfg.effect){
    //             let target = this.getOpponent(this.targets)
    //             target?.effectMgr.addEffect({
    //                 id: effect.effect_type,
    //                 eff_num: effect.eff_num,
    //                 cur_round: 1,
    //                 sustain_round: effect.sustain_round,
    //             })
    //         }
    //     }
    // }

    onOneRoundEnd(){

        // let eff = this.effectMgr.effects[E_EffectType.add_hp_percent]
        // if (eff){
        //     if (eff.sustain_round == -1){
        //         let add = Math.round(this.getMaxHp() * eff.eff_num)
        //         this.attrMgr.addAttrNum(E_BattleUnitAttr.cur_hp, add)

        //         // let result = new ExtraMsg()
        //         // result.id = e.id
        //         // result.add_hp = add

        //         // this.round_end_result.push(result)
        //     }
        //     else if (eff.cur_round <= eff.sustain_round){
        //         let add = Math.round(this.getMaxHp() * eff.eff_num)
        //         this.attrMgr.addAttrNum(E_BattleUnitAttr.cur_hp, add)

        //         // let result = new ExtraMsg()
        //         // result.id = e.id
        //         // result.add_hp = add

        //         // this.round_end_result.push(result)
        //     }
        // }
    }

    canAction(): boolean {
        let eff = this.effectMgr.getEffect(E_EffectType.STUN)
        if (eff){
            if (eff.cur_round <= eff.sustain_round){
                return false
            }
        }

        return this.isAlive()
    }

    isAlive(): boolean {
        return this.attrMgr.getAttr(E_BattleUnitAttr.HP) > 0
    }

}

