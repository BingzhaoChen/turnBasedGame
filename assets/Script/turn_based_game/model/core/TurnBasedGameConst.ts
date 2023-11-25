
/**
 * 
 *  buff and debuff
 * 
 */
export interface I_Effect{
    id: E_EffectType,

    eff_num: number,

    /**当前第几轮 */
    cur_round: number,

    /**持续作用多少轮; -1为持续到游戏结束，除非其他地方移除掉该effect */
    sustain_round: number,
}

/**
 * buff / debuff 类型；持续多回合影响属性效果
 */
export enum E_EffectType{

    NONE,
    
    // /**吸血 */
    // suck_blood = 1,

    // /**减少伤害 */
    // harm_reduction,

    // /**命中率下降 % */
    // reduce_hit_rate ,

    // /**攻击力下降 % */
    // reduce_atk_percent,

    // /**回复生命 % */
    // add_hp_percent,

    // /**增加攻击力 %*/
    // add_atk,

    // /**增加命中率 % */
    // add_hit_rate,

    // /**增加生命上限 */
    // add_hp_base,

    /**击晕 */
    STUN,

}

/**
 * 战斗单位属性
 */
export enum E_BattleUnitAttr{
    /**速度 */
    SPEED = 1,

    /**生命 */
    HP,

    /**基础攻击力 */
    ATK,

    /**防御值 */
    DEFENSE,
    
    /**百分比吸血 */
    SUCK_BLOOD,

    /**反击 */
    COUNTERATTACK_RATE,

    /**连击 */
    DOUBLE_HIT_RATE,

    /**闪避几率 */
    DODGE_RATE,

    /**暴击几率 小数表示 */
    CRITICAL_RATE,

    /**击晕概率 */
    STUN_RATE,

}

export enum E_SubActionType{
    NORMAL = 1,

    /**连击 */
    DOUBLE_HIT,

    /**反击 */
    COUNTERATTACK,
}

export interface I_SubActionMsg {
    
    subActionType: E_SubActionType

    /**行动ID */
    actionUID: string

    /**目标ID */
    targetUID: string

    isMiss?: Boolean

    hurtNum?: number

    /**暴击 */
    critical?: boolean

    /**吸血 */
    suckBlood?: number

    /** 击晕 */
    stun?: boolean

}

export interface I_ActionMsg {

    /**行动ID */
    actionUID: string

    /**目标ID */
    targetUID: string

    subActions: I_SubActionMsg[]
}


export interface I_RoundMsg{
    /**当前轮数 */
    curRound: number

    /**行动数据 */
    actions: I_ActionMsg[]
}

export interface UnitInfo{
    uid: string,
    id: number,
    pos: {x, y},
    unitType: number,
}

/**
 * 战斗数据
 */
export interface I_BattleMsg{
    /**初始单位信息 */
    units: UnitInfo[]
    rounds: I_RoundMsg[]
    winGroup: E_UnitGroup
}

/**
 * 单位阵营；敌我识别
 */
export enum E_UnitGroup{

    NONE,

    MYSELF,

    ENEMY,
}

