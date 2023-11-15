/**
 *  buff / debuff 管理
 * 
 */

import { I_Effect, E_EffectType } from "./TurnBasedGameConst"

export default class BattleUnitEffectMgr{
    private _effects: {[id: number]: I_Effect} = {}

    addEffect(effect: I_Effect){
        if (effect && effect.id){
            this._effects[effect.id] = effect
        }
        else{
            
            cc.error("effect null")
        }
    }

    getEffect(type: E_EffectType){
        return this._effects[type]
    }

    addEffectRound(){
        for (let k in this._effects){
            let eff = this._effects[k]
            eff.cur_round += 1
            if (eff.sustain_round !== -1 && eff.cur_round > eff.sustain_round){
                delete this._effects[k]
            }
        }
    }

    get effects(){
        return this._effects
    }
}