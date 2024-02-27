
# 概述

通用回合制战斗游戏逻辑框架；不少游戏需要有一个回合制的小游戏作为一个子系统，因此特意写了一个较为通用简单的回合制逻辑框架。  
目前主要功能有：
- 多对多战斗  
- 属性管理
- buff管理
- 战报

仓库地址:https://github.com/BingzhaoChen/turnBasedGame

# 核心逻辑
主要战斗逻辑如下：
游戏有多个回合组成，每个回合由N个角色行动，每个角色包含N个子行动；从战报的结构更容易看出战斗的逻辑。
```ts
/*
    回合
        A对B发起行动
            A攻击B
            A连击
            B还击
        B对A发起行动
            B攻击A
            A还击
    回合
        A对B发起行动
            A攻击B
            A连击
            B还击
        B对A发起行动
            B攻击A
            A还击
            
*/

```

# 代码结构
核心代码在core文件夹；
- core
  - BattleUnitAttrMgr.ts (属性管理)
  - BattleUnitBase.ts (战斗单位基类)
  - BattleUnitEffectMgr.ts (Buff/Debuff管理)
  - CombatBase.ts (基础回合制游戏作战逻辑)
  - SkillBase.ts (技能；未完善)
  - TurnBasedGameConst.ts (一些枚举、战报数据接口)
- BattleFormula.ts (数值计算，每个项目不一样。例如：计算基础攻击+Buff后的攻击力)
- BattleUnit.ts （继承BattleUnitBase，根据具体项目，重写或新加一些方法。例如：对战斗顺序排序）
- Combat.ts (继承CombatBase，对战斗一些特殊逻辑重写)

# 核心代码解析

**Effect相关**
```ts

// buff 和 debuff
export interface I_Effect{
    id: E_EffectType,

    eff_num: number,

    /**当前第几轮 */
    cur_round: number,

    /**持续作用多少轮; -1为持续到游戏结束，除非其他地方移除掉该effect */
    sustain_round: number,
}

/*
添加一个BUFF/DEBUFF；这里添加一个持续一回合的击晕debuff
每轮Effect的cur_round都会+1，不需要自己维护buff的生命周期了
当到达声明周期则自动移除
*/
target.effectMgr.addEffect({
                    id: E_EffectType.STUN, 
                    eff_num: 0, 
                    cur_round: 1,
                    sustain_round: 1,
                })

/*
判断是否被击晕
*/
let eff = this.effectMgr.getEffect(E_EffectType.STUN)
if (eff){
    return false
}

```

# 使用

```ts
testBattle(){
    /*============我方*/


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


    /*===========敌方*/
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
```

---

<div style="text-align:center">
  <a href="https://star-history.com/#lining808/CS-Ebook&Date">
    <img src="https://api.star-history.com/svg?repos=lining808/CS-Ebook&type=Date" alt="Star History Chart">
  </a>
</div>


