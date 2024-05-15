
/**
 * 
 *  buff and debuff
 * 
 */
export interface I_Effect{
    /**特效类型 */
    effType: E_EffectType,

    /**特效数值 */
    effNum: number,

    /**当前第几轮 */
    curRound: number,

    /**持续作用多少轮; -1为持续到游戏结束，除非其他地方移除掉该effect */
    sustain_round: number,
}

/**
 * buff / debuff 类型；持续多回合影响属性效果
 */
export enum E_EffectType{

    NONE,

    /**防御加成 */
    DEFENSE_ADD = 4,

    /**
     * 伤害减免
     */
    HART_REDUCE = 6,

    /**被点燃 */
    BE_FIRE = 10,

    /**增加生命上限比例 */
    ADD_HP_MAX = 18,

    /**被击晕 */
    BE_STUN = 100,

}

/**
 * 战斗单位属性
 */
export enum E_BattleUnitAttr{
    /**速度 */
    SPEED = 1001,

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

    /**忽视吸血 */
    IGNORE_SUCK_BLOOD,

    /**忽视反击 */
    IGNORE_CONUTERATTACT_RATE,

    /**忽视连击 */
    IGNORE_DOUBLE_HIT_RATE,

    /**忽视闪避 */
    IGNORE_DODGE_RATE,

    /**忽视暴击 */
    IGNORE_CRITICAL_RATE,

    /**忽视击晕 */
    IGNORE_STUN_RATE,

    /**暴虐 提高暴击伤害*/
    CRITICAL_HURT,

    /**仁爱 减少对方暴击伤害*/
    IGNORE_CRITICAL_HURT,

    /**泥泞 减少对方速度*/
    MUDDY,

    /**禁疗 减少对方治疗效果*/
    RECOVER_FORBIDDEN,

    /**回复 第五回合回复生命*/
    RECOVER,

    /**欺凌 对方低于半血增伤*/
    BULLYING,

    /**掠财 增加挑战胜利金币*/
    PLUNDER,

    /**伤害减免 */
    HURT_REDUCE_RATE,

    /**忽略防御 */
    IGNORE_DEFENSE_RATE,

    /**攻击力加成 */
    ATK_ADD_RATE,

    /**伤害加成 */
    HURT_ADD_RATE,
}


/**行动类型 */
export enum E_SubActionType{
    NORMAL = 1,

    /**连击 */
    DOUBLE_HIT = 2,

    /**反击 */
    COUNTERATTACK = 3,
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

    targetDie?: boolean

    playSkill?: {skillID: number, eff: I_Effect[]}[]
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

    beFireUnit?: string;

    beFireHurt?: number;
}

export interface UnitInfo{
    uid: string,
    id: string,
    pos: {x, y},
    unitGroup: number,
    unitType: number,
    hp: number,
    power: number,
    nickname: string,
    headIcon: string,
    sexID: number,
}

/**
 * 战斗数据
 */
export interface I_BattleResultMsg{
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

    /**自己 */
    MYSELF,

    /**敌人 */
    ENEMY,
}

