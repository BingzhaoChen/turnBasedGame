import MathUtils from "../../../../../framework/utils/MathUtils"
import Vec2Utils from "../../../../../framework/utils/Vec2Utils"
import BattleUnitBase from "./core/BattleUnitBase"
import { E_BattleUnitAttr, E_EffectType, I_Effect } from "./core/TurnBasedGameConst"


export default class BattleUnit extends BattleUnitBase{

    /**
     *  用于战斗单位外形
     */
    unitType: number
    
    /**
     *  用于战斗单位外形
     */
    id: string

    /**
     * 战力
     */
    power: number = 0

    nickname: string = ""

    headIcon: string = ""

    sexID: number = 0

    /**获取对手 */
    getTarget(targets: BattleUnit[]){

        let arr = targets.filter( (c) => {
            return ((c.unitGroup != this.unitGroup) && c.isAlive())
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

    onCombatStart(){
        
    }

    playSkill(targets: BattleUnit[]){
        // let ids: number[] = []

        let skills:{skillID: number, eff: I_Effect[]}[] = []
        for (let e of this.allSkills){
            let temp: {skillID: number, eff: I_Effect[]} = {
                skillID: e.id,
                eff: [],
            }
            if (e.moment == 2 && e.target_type == 1){
                let b = MathUtils.weightBingo(e.rate, 10000)
                if (b){
                    for (let eff of e.effects){
                        targets[0].effectMgr.addEffect(eff)
                        temp.eff.push(eff)
                        cc.log(`uid:${targets[0].uid}被挂上BUFF`, eff)
                    }
                }
            }
            skills.push(temp)
        }
        return skills;
    }

    beHurt(count: number){
        this.attrMgr.addAttrValue(E_BattleUnitAttr.HP, -count)
    }

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
        let eff = this.effectMgr.getEffect(E_EffectType.BE_STUN)
        if (eff){
            return false
        }

        return this.isAlive()
    }

    isAlive(): boolean {
        return this.attrMgr.getAttr(E_BattleUnitAttr.HP) > 0
    }

}

