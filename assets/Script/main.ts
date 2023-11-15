// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import BattleUnit from "./turn_based_game/model/BattleUnit";
import Combat from "./turn_based_game/model/Combat";
import { E_BattleUnitAttr } from "./turn_based_game/model/core/TurnBasedGameConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    

    onBtnRun(){
        this.testBattle()
    }

    testBattle(){
        let unit_1 = new BattleUnit({
            uid: "1-1",
            unitType: 1,
            pos: {x: 0, y: 0}
        })
        unit_1.attrMgr.initAttr({
            [E_BattleUnitAttr.SPEED]: 100,
            [E_BattleUnitAttr.HP]: 100,
            [E_BattleUnitAttr.ATK]: 30,
            [E_BattleUnitAttr.DEFENSE]: 10,
            [E_BattleUnitAttr.DOUBLE_HIT_RATE]: 0.5,
            [E_BattleUnitAttr.COUNTERATTACK_RATE]: 0.5,
            [E_BattleUnitAttr.STUN_RATE]: 0.5,
        })

        let unit_11 = new BattleUnit({
            uid: "1-2",
            unitType: 1,
            pos: {x: 1, y: 0}
        })
        unit_11.attrMgr.initAttr({
            [E_BattleUnitAttr.SPEED]: 100,
            [E_BattleUnitAttr.HP]: 100,
            [E_BattleUnitAttr.ATK]: 30,
            [E_BattleUnitAttr.DEFENSE]: 10,
            [E_BattleUnitAttr.DOUBLE_HIT_RATE]: 0.5,
            [E_BattleUnitAttr.COUNTERATTACK_RATE]: 0.5,
        })

        let unit_2 = new BattleUnit({
            uid: "2-1",
            unitType: 2,
            pos: {x: 4, y: 0}
        })
        unit_2.attrMgr.initAttr({
            [E_BattleUnitAttr.SPEED]: 100,
            [E_BattleUnitAttr.HP]: 200,
            [E_BattleUnitAttr.ATK]: 20,
            [E_BattleUnitAttr.DEFENSE]: 10,
            [E_BattleUnitAttr.DOUBLE_HIT_RATE]: 0.5,
            [E_BattleUnitAttr.COUNTERATTACK_RATE]: 0.5,
        })

        let combat = new Combat([unit_1, unit_2, unit_11])
        let report = combat.runCombat()
        cc.log(report)

    }
}
