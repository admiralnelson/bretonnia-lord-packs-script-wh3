/** @noSelfInFile */
/* eslint-disable */

declare function print(...args: any[]): void
/**
 * ONLY AVAILABLE IN SNED LOADER ENV ONLY! 
 * starts SNED lua debugger */
declare function StartDebugger(): void
/** 
 * ONLY AVAILABLE IN SNED LOADER ENV ONLY!
 * stops SNED lua debugger */
declare function StopDebugger(): void

/** ONLY AVAILABLE IN SNED LOADER ENV ONLY! */
declare function PrintWarning(s: string): void
/** ONLY AVAILABLE IN SNED LOADER ENV ONLY! */
declare function PrintError(s: string): void
declare function out(s: string): void

/** JSON interface: campaign\mod\JSON.lua */
interface JSON {
    stringify(this: void, o: any): string;
    /** 
    * @throws {Error} generic lua error, containing a message
    */
    parse(this: void, s: string): any;
}

interface INullScript {
    is_null_interface(): boolean
}

interface IListScript {
    num_items(): number
    is_empty(): boolean
}


interface IModelScript extends INullScript {
    can_reach_character(who: ICharacterScript, againstWho: ICharacterScript): boolean
    can_reach_settlement(who: ICharacterScript, where: ISettlementScript): boolean
    can_reach_position(who: ICharacterScript, x: number, y: number): boolean
    can_reach_character_in_stance(who: ICharacterScript, againstWho: ICharacterScript, stanceKey: string): boolean
    can_reach_settlement_in_stance(who: ICharacterScript, where: ISettlementScript, stanceKey: string): boolean
    can_reach_position_in_stance(who: ICharacterScript, x: number, y: number, stanceKey: string): boolean
    has_effect_bundle(effectBundleKey: string): boolean
}

interface IRegionListScript extends INullScript {

}

interface ICharacterListScript extends IListScript {

}

interface IMilitaryForceListScript extends IListScript {

}

interface IFactionListScript extends IListScript {

}

interface IUniqueAgentDetailsListScript extends IListScript {

}

interface IEffectBundleListScript extends IListScript {

}

interface ISettlementScript extends INullScript {

}

interface IBonusValuesScript extends INullScript {

}

interface IForeignSlotManagerListScript extends INullScript { 

}

interface IFactionRitualsScript extends INullScript {

}

interface IFactionProvinceManagerList extends INullScript {

}

interface IGarrisonResidenceScript extends INullScript {

}

interface IRegionScript extends INullScript {

}

interface ISeaRegionScript extends INullScript {

}

interface IRegionDataScript extends INullScript {

}

interface IMilitaryForceScript extends INullScript {

}

interface ICharacterScript extends INullScript, ICharacterDetailsScript, IModelScript {
    command_queue_index(): number
    has_garrison_residence(): boolean
    has_region(): boolean
    has_military_force(): boolean
    garrison_residence(): IGarrisonResidenceScript
    faction(): IFactionScript
    region(): IRegionScript
    sea_region(): ISeaRegionScript
    region_data(): IRegionDataScript
    military_force(): IMilitaryForceScript
    flag_path(): string
    in_settlement(): boolean
    in_port(): boolean
    is_besieging(): boolean
    is_blockading(): boolean
    is_carrying_troops(): boolean
    is_governor(): boolean

    battles_fought(): number
    action_points_remaining_percent(): number
    action_points_per_turn(): number

    performed_action_this_turn(): number
    is_ambushing(): boolean
    turns_at_sea(): number
    turns_in_own_regions(): number
    turns_in_enemy_regions(): number
    is_faction_leader(): boolean
    rank(): number
    defensive_sieges_fought(): number
    defensive_sieges_won(): number
    offensive_sieges_fought(): number
    offensive_sieges_won(): number
    fought_in_battle(): boolean
    won_battle(): number
    percentage_of_own_alliance_killed(): number
    ministerial_position(): string
    logical_position_x(): number
    logical_position_y(): number
    display_position_x(): number
    display_position_y(): number
    battles_won(): number
    offensive_battles_won(): number
    offensive_battles_fought(): number
    defensive_battles_won(): number
    defensive_battles_fought(): number
    offensive_naval_battles_won(): number
    offensive_naval_battles_fought(): number
    defensive_naval_battles_won(): number
    defensive_naval_battles_fought(): number
    offensive_ambush_battles_won(): number
    offensive_ambush_battles_fought(): number
    defensive_ambush_battles_won(): number
    defensive_ambush_battles_fought(): number
    cqi(): number
    is_embedded_in_military_force(): boolean
    embedded_in_military_force(): IMilitaryForceScript

    is_hidden(): boolean
    routed_in_battle(): boolean
    body_guard_casulties(): number
    is_deployed(): boolean
    is_at_sea(): boolean
    has_recruited_mercenaries(): boolean
    
    interfaction_loyalty(): number
    
    is_politician(): boolean
    post_battle_ancilary_chance(): number
    is_caster(): boolean
    is_visible_to_faction(): boolean
    can_equip_ancillary(): boolean
    is_wounded(): boolean
    character_details(): ICharacterDetailsScript
    effect_bundles(): IEffectBundleListScript

    bonus_values(): IBonusValuesScript
}

interface IPooledResourceManager extends INullScript {

}

interface IFactionScript extends INullScript {
    command_queue_index(): number
    region_list(): IRegionListScript
    character_list(): ICharacterListScript
    military_force_list(): IMilitaryForceListScript
    model(): IModelScript
    is_factions_turn(): boolean
    /** returns true if player is human */
    is_human(): boolean
    is_idle_human(): boolean
    /** returns faction key */
    name(): string
    home_region(): IRegionScript 
    faction_leader(): ICharacterScript
    has_faction_leader(): boolean
    has_home_region(): boolean
    flag_path(): string
    started_war_this_turn(): boolean
    ended_war_this_turn(): boolean
    ancillary_exists(anciliaryKey: string): boolean
    num_allies(): number
    at_war(): boolean
    allied_with(WithWho: IFactionScript): boolean
    non_aggression_pact_with(withWho: IFactionScript): boolean
    trade_agreement_with(WithWho: IFactionScript): boolean
    military_allies_with(WithWho: IFactionScript): boolean
    defensive_allies_with(WithWho: IFactionScript): boolean
    is_vassal_of(WithWho: IFactionScript): boolean
    is_ally_vassal_or_client_state_of(WithWho: IFactionScript): boolean
    at_war_with(WithWho: IFactionScript): boolean
    trade_resource_exists(resourceKey: string): boolean
    trade_value(): number
    trade_value_percent(): number
    unused_international_trade_route(): boolean
    trade_route_limit_reached(): boolean
    sea_trade_route_raided(): boolean
    treasury(): number
    treasury_percent(): number
    losing_money(): boolean
    expenditure(): number
    income(): number
    net_income(): number
    tax_level(): number
    upkeep(): number
    upkeep_income_percent(): number
    upkeep_expenditure_percent(): number
    research_queue_idle(): number
    has_technology(technologyKey: string): boolean
    is_currently_researching(): boolean
    has_available_technologies(): boolean
    num_completed_technologies(): number
    num_generals(): number
    culture(): string
    subculture(): string
    has_food_shortages(): boolean
    imperium_level(): number
    diplomatic_standing_with(withWho: IFactionScript): number
    diplomatic_attitude_towards(withWho: IFactionScript): number
    factions_non_aggression_pact_with(): IFactionListScript
    factions_trading_with(): IFactionListScript
    factions_at_war_with(): IFactionListScript
    factions_met(): IFactionListScript
    factions_of_same_culture(): IFactionListScript
    factions_of_same_subculture(): IFactionListScript
    factions_allied_with(): IFactionListScript
    factions_defensive_allies_with(): IFactionListScript
    factions_military_allies_with(): IFactionListScript
    get_foreign_visible_characters_for_player(): ICharacterListScript
    get_foreign_visible_regions_for_player(): IRegionListScript
    is_quest_battle_faction(): boolean
    holds_entire_province(provinceKey: string, includeVassals: boolean): boolean
    is_vassal(): boolean
    is_dead(): boolean
    total_food(): number
    food_production(): number
    food_consumption(): number
    get_food_factor_value(): number
    get_food_factor_base_value(): number
    get_food_factor_multiplier(): number
    unique_agents(): IUniqueAgentDetailsListScript
    has_effect_bundle(effectBundleKey: string): boolean
    has_rituals(): boolean
    rituals(): IFactionRitualsScript
    has_faction_slaves(): boolean
    num_faction_slaves(): number
    max_faction_slaves(): number
    percentage_faction_slaves(): number
    pooled_resource_manager(): IPooledResourceManager
    has_ritual_chain(ritualKey: string): boolean
    has_access_to_ritual_category(ritualCategoryKey: string): boolean
    get_climate_suitability(climateKey: string): string
    foreign_slot_managers(): IForeignSlotManagerListScript
    is_allowed_to_capture_territory(): boolean
    can_be_human(): boolean
    effect_bundles(): IEffectBundleListScript
    is_rebel(): boolean
    is_faction(): boolean
    unit_cap(): number
    unit_cap_remaining(): number
    bonus_values(): IBonusValuesScript
    agent_cap(): number
    agent_cap_remaining(): number
    agent_subtype_cap(): number
    agent_subtype_cap_remaining(): number
    team_mates(): IFactionListScript
    is_team_mate(withWho: IFactionScript): boolean
    is_primary_faction(): boolean
    turn_is_skipped(): boolean
    num_provinces(): number
    num_complete_provinces(): number
    provinces(): IFactionProvinceManagerList
    complete_provinces(): IFactionListScript
}

interface ICharacterInitiativeSetListScript extends INullScript {

}

interface IPooledResourceManager extends INullScript {

}

interface ICharacterDetailsScript extends INullScript {
    faction(): IFactionScript
    forename(fornameDbKey: string): boolean
    surname(surnameDbKey: string): boolean
    get_forename(): string
    get_surname(): string
    character_type(agentKey: string): boolean
    /** Returns the character's type key, from the agents table */
    character_type_key(): string
    character_subtype(agentSubtypeKey: string): boolean 
    /** Returns the character's subtype key, from the agents table */
    character_subtype_key(): string
    character_subtype_has_female_name(unknown: any): any
    is_part_of_subtype_set(unknown: any): any
    is_immortal(): boolean
    is_unique(): boolean
    has_trait(traitKey: string): boolean
    all_traits(): any
    trait_points(traitKey: string): number
    has_ancillary(anciliaryKey: string): boolean
    is_male(): boolean
    age(): number
    has_skill(skillKey: string): boolean
    background_skill(unknown: any): any
    number_of_traits(): number
    trait_level(traitKey: string): number
    loyalty(): number
    personal_loyalty_factor(): number
    has_father(): boolean
    has_mother(): boolean
    /** undefined in warhammer 3 anyway */
    father(): any
    /** undefined in warhammer 3 anyway */
    mother(): any
    /** undefined in warhammer 3 anyway */
    family_member(): any
    character_initiative_sets(): ICharacterInitiativeSetListScript
    lookup_character_initiative_set_by_key(recordKey: string): ICharacterInitiativeSetListScript
    pooled_resource_manager(): IPooledResourceManager
    character(): ICharacterScript
}

interface ICampaignManager {
    null_interface(): any
    /** a function will fire right after loading has finished  */
    add_first_tick_callback(callback: Function): void
    spawn_character_to_pool(faction: string, forename: string, surname: string, clanname: string, othername: string, age: number, male: boolean, agentKey: string, agentSubtypeKey: string, immortal: boolean, artSetKey: string): ICharacterDetailsScript
    /** max and min are inclusive. multiplayer safe */
    random_number(max: number, min: number): number
    random_sort(list: Array<any>): Array<any>
    random_sort_copy(list: Array<any>): Array<any>
    shuffle_table(list: Array<any>): void
    /** forcefully add skill to a character. don't know what stringLookup is? search this in manual: Character Lookups */
    force_add_skill(stringLookUp: string, skillKey: string): void
    char_lookup_str(character: ICharacterScript): string
    set_saved_value(key: string, value: any): void
    get_saved_value(key: string): unknown 
    /** returns current turn number */
    turn_number(): number
    get_faction(factionKey: string, errorIfNotFound?: boolean): IFactionScript
    get_character_by_cqi(cqiNo: number): ICharacterScript
}

/** context of the callback or conditional checks, get your faction, char, etc. from here */
interface IContext {
    /** gets faction interface, could be INullScript */
    faction?() : IFactionScript
    character?(): ICharacterScript
    character_details?(): ICharacterDetailsScript
}

type ConditionalTest = {
    (context: IContext) : boolean
}
type Callback = {
    (context: IContext) : void
}

interface ICore {
    add_listener(listenerName: string, eventName: string, conditionalTest: ConditionalTest | Boolean, callback: Callback, persistsAfterCall :boolean): void
}

declare const cm: ICampaignManager
declare const core: ICore