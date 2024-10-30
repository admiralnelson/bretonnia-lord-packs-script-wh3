namespace AdmiralNelsonLordPack {

    export const VERSION = 2
    export const ADMBRETLORDPACK = "ADMBRETLORDPACK:v"+VERSION

    export const TAG_BRETLORDPOOL = "BRETLORDPOOL"
    export const TAG_VERSIONSTRING = "ADMBRETLORDPACK"

    const RESET_EACH_TURN = 10
    const DEBUG = true
    
    const MAXIMUM_BIG_LORDS = 6

    const BOT_2HANDED_LORD_THRESHOLD = 26
    const BOT_MASSIF_LORD_THRESHOLD = 26

    const HUMAN_MASSIF_LORD_THRESHOLD = 30
    const HUMAN_2HANDED_LORD_THRESHOLD = 28

    const DICE_NUMBER = 2
    const DICE_SIDES = 20

    const RESET_POOL_COUNT_THRESHOLD = 10

    class BretLordPack {

        private localVersion = ADMBRETLORDPACK

        private readonly l = new Logger("BretLordPack")
        // ok
        private bretLordPool : LordPool[] = []
        // NOT SUPPORTED
        // private bretLordPool : Array<LordPool> = new Array
        // private bretLordPool = new Array<LordPool> 

        
        private readonly BigLordsSubtypes = [
            "admiralnelson_bret_lord_massif_agent_key",
            "admiralnelson_bret_lord_massif_sword_shield_agent_key",
        ]

        private readonly LordAgentSubtypes = this.BigLordsSubtypes.concat([
            "admiralnelson_bret_lord_2handed_agent_key",
        ])
        
        private readonly BretonnianFactionsKeys = [
            "wh2_dlc14_brt_chevaliers_de_lyonesse",
            "wh2_main_brt_knights_of_origo",
            "wh2_main_brt_knights_of_the_flame",
            "wh2_main_brt_thegans_crusaders",
            "wh3_dlc20_brt_march_of_couronne",
            "wh3_main_brt_aquitaine",
            "wh_main_brt_artois",
            "wh_main_brt_bastonne",
            "wh_main_brt_bordeleaux",
            "wh_main_brt_bretonnia",
            "wh_main_brt_carcassonne"
        ]

        public AddBigSizedLord(agentKey: string) {
            this.BigLordsSubtypes.push(agentKey)
        }

        public AddNormalSizedLord(agentKey: string) {
            this.LordAgentSubtypes.push(agentKey)
        }

        private GetLordPoolOnFaction(factionKey: string) : LordPool | null {
            for (const iterator of this.bretLordPool) {
                if (iterator.Faction == factionKey) return iterator
            }
            return null
        }

        Save(): void {
            localStorage.setItem(TAG_BRETLORDPOOL, JSON.stringify(this.bretLordPool))
            this.l.LogWarn(localStorage.getItem(TAG_BRETLORDPOOL) as string)
            this.l.LogWarn("Saved")
        }

        Load() : void {
            if(localStorage.getItem(TAG_BRETLORDPOOL) == null) {
                this.l.LogError(`Failed to load ${TAG_BRETLORDPOOL}`)
                return
            }
            const bretLordPoolJson = localStorage.getItem(TAG_BRETLORDPOOL) as string
            const bretLordPoolArr = JSON.parse(bretLordPoolJson)
            print(bretLordPoolArr)
            this.bretLordPool.length = 0
            for (const iterator of bretLordPoolArr) {
                const factionKey = iterator["FactionKey"]
                const lordAgentSubtypeToCount = iterator["LordAgentSubtypeToCount"]
                this.bretLordPool.push(new LordPool(factionKey, undefined, lordAgentSubtypeToCount))
            }
            this.l.LogWarn(JSON.stringify(this.bretLordPool))
            this.l.LogWarn("Loaded")
        }

        DiceRollCheck(threshold: number, noOfDices: number = 1, side: number = 6) : boolean {
            let total = 0
            for (let i = 1; i <= noOfDices; i++) {
                total += cm.random_number(side, 1)
            }
            return total >= threshold
        }

        ResetPool(): void {
            for (const iterator of this.bretLordPool) {
                iterator.Reset()
            }
            this.l.LogWarn("Lord pool has been reset")
            this.Save()
        }

        CountBigLords(faction: IFactionScript): number {
            let bigGuyCount = 0
            const armies = faction.military_force_list()
            for (let i = 0; i < armies.num_items() ; i++) {
                const theArmy = armies.item_at(i)
                if(!theArmy.is_armed_citizenry() && theArmy.has_general()) {
                    const theGeneral = theArmy.general_character()
                    //this.l.Log(`iterating ${theGeneral.character_subtype_key()}`)
                    if(this.BigLordsSubtypes.indexOf(theGeneral.character_subtype_key()) >= 0) bigGuyCount++
                }
            }
            return bigGuyCount            
        }

        FixLordsMountAnciliaries(): void {
            const theWorld = cm.model().world()

            let totalBuggedLord = 0
            const factionsToBeProcessed = []

            for (const iterator of this.BretonnianFactionsKeys) {
                const theFaction = theWorld.faction_by_key(iterator)
                this.l.Log(`is this faction dead? ${iterator}`)
                if(!theFaction.is_null_interface() && !theFaction.is_dead()) {
                    factionsToBeProcessed.push(theFaction)
                    this.l.Log(`no it isnt`)
                }
            }

            for (const theFaction of factionsToBeProcessed) {
                const theArmies = theFaction.military_force_list()
                for (let index = 0; index < theArmies.num_items(); index++) {
                    const theArmy = theArmies.item_at(index)
                    const theGeneral = theArmy.general_character()
                    this.l.Log(`iterating...${theGeneral.character_subtype_key()} in faction ${theFaction.name()}`)
                    if(theGeneral.has_skill("wh_main_skill_brt_lord_unique_general_royal_pegasus") && 
                       !theGeneral.has_ancillary("admiralnelson_bret_general_pegasus_massif_sword_shield_anciliary_key")) 
                    {
                        this.l.LogWarn(`found bugged lord ${theGeneral.character_subtype_key()} in faction ${theFaction.name()}, doesn't have admiralnelson_bret_general_pegasus_massif_sword_shield_anciliary_key`)
                        cm.force_add_ancillary(theGeneral, "admiralnelson_bret_general_pegasus_massif_sword_shield_anciliary_key", true, false)
                        this.l.Log(`ok`)
                        totalBuggedLord++
                    }
                    if(theGeneral.has_skill("wh_main_skill_brt_lord_unique_general_hippogryph") && 
                       !theGeneral.has_ancillary("admiralnelson_bret_general_hippogrif_massif_sword_shield_anciliary_key")) 
                    {
                        this.l.LogWarn(`found bugged lord ${theGeneral.character_subtype_key()} in faction ${theFaction.name()}, doesn't have admiralnelson_bret_general_hippogrif_massif_sword_shield_anciliary_key`)
                        cm.force_add_ancillary(theGeneral, "admiralnelson_bret_general_hippogrif_massif_sword_shield_anciliary_key", true, false)
                        this.l.Log(`ok`)
                        totalBuggedLord++
                    }
                }
                
            }

            this.l.Log(`FixLordsMountAnciliaries ok - fixed ${totalBuggedLord} lords`)
        }

        SpawnLordToPool(subtypeKey: string, factionKey: string): void {
            cm.spawn_character_to_pool(factionKey, "", "", "", "", 18, true, "general", subtypeKey, false, "")
            this.l.LogWarn(`I picked ${subtypeKey} lord to be added into pool ${factionKey}`)

            const lordPool = this.GetLordPoolOnFaction(factionKey)
            if(lordPool == null) return
            lordPool.IncrementAgentCount(subtypeKey)
            this.Save()
        }

        AttemptToSpawnLord(faction: IFactionScript): void {
            const factionKey = faction.name()
            const isFactionHuman = faction.is_human()
            
            const lordPool = this.GetLordPoolOnFaction(factionKey)
            if(lordPool == null) {
                this.l.LogError("Failed to AttemptToSpawnLord, lordPool appears to be null. has Load() called before?")
                return
            }
            
            this.l.Log(`AttemptToSpawnLord: current bret faction ${factionKey}`)            

            //try to spawn the big guy
            if(this.DiceRollCheck(isFactionHuman ? HUMAN_MASSIF_LORD_THRESHOLD : BOT_MASSIF_LORD_THRESHOLD, DICE_NUMBER, DICE_SIDES)) {
                isFactionHuman ? this.l.Log("Faction is human, roll success") : this.l.Log("Faction is bot, roll success")

                //count big lords
                const bigLordsTotal = this.CountBigLords(faction)
                this.l.LogWarn(`there are ${bigLordsTotal} in this faction ${faction.name()}`)
                if(bigLordsTotal <= MAXIMUM_BIG_LORDS) {
                    const roll = cm.random_number(1, 0) 
                    const whichAgentToChoose = this.LordAgentSubtypes[roll]
                    //check its pool before going further, we don't want to spam the recruitment tab 
                    //player can only get 1 (one) brute lord
                    if(lordPool.GetAgentCount(whichAgentToChoose) <= 1 && isFactionHuman) {
                        this.SpawnLordToPool(whichAgentToChoose, factionKey)
                        this.l.LogWarn(`big lord with a subtype ${whichAgentToChoose} spawned into pool ${factionKey}`)
                    } else if (lordPool.GetAgentCount(whichAgentToChoose) <= 2) {
                        this.SpawnLordToPool(whichAgentToChoose, factionKey)
                        this.l.LogWarn(`big lord with a subtype ${whichAgentToChoose} spawned into pool ${factionKey}`)
                    } else {
                        this.l.LogWarn(`big lord with a subtype ${whichAgentToChoose} cannot spawned into pool ${factionKey} because it's full (more than 2)`)
                    }
                } else {
                    this.l.LogWarn(`faction ${faction.name()} has reached maximum number of big lords. not spawning!`)
                }
                return
            }
            //try to spawn the 2handed guy instead
            if(this.DiceRollCheck(isFactionHuman ? HUMAN_2HANDED_LORD_THRESHOLD : BOT_2HANDED_LORD_THRESHOLD, DICE_NUMBER, DICE_SIDES)) {
                isFactionHuman ? this.l.Log("Faction is human, roll success") : this.l.Log("Faction is bot, roll success")
                const whichAgentToChoose = this.LordAgentSubtypes[2]
                //check its pool before going further, we don't want to spam the recruitment tab 
                if(lordPool.GetAgentCount(whichAgentToChoose) < 2 && isFactionHuman) {
                    this.SpawnLordToPool(whichAgentToChoose, factionKey)
                    this.l.LogWarn(`2handed lord with a subtype ${whichAgentToChoose} spawned into pool ${factionKey}`)
                } else if (lordPool.GetAgentCount(whichAgentToChoose) <= 2) {
                    this.SpawnLordToPool(whichAgentToChoose, factionKey)
                    this.l.LogWarn(`2handed lord with a subtype ${whichAgentToChoose} spawned into pool ${factionKey}`)
                } else {
                    this.l.LogWarn(`2handed lord with a subtype ${whichAgentToChoose} cannot spawned into pool ${factionKey} because it's full (more than 2)`)
                }
                
                return
            }
            
        }

        OnLordSpanedFromPool(agent: ICharacterScript): void {
            const agentSubtypeKey = agent.character_subtype_key()
            const factionKey = agent.faction().name()
            this.l.LogWarn(`character recruited ${agentSubtypeKey}`)
            const thePool = this.GetLordPoolOnFaction(factionKey)
            if(thePool) {
                thePool.DecrementAgentCount(agentSubtypeKey)
                this.Save()
            }
        }

        OnTurnToResetPool(): void {
            this.l.Log(`current turn is ${cm.turn_number()} will reset in each multiplication of turns ${RESET_EACH_TURN}`)
            if(cm.turn_number() % RESET_EACH_TURN == 0) this.ResetPool()
        }

        Init(): void {
            
            this.l.LogWarn("hello i'm compiled from typescript!")
            this.l.LogWarn(`BretLordPacks runtime version ${VERSION}`)
            this.l.LogWarn(`${JSON.stringify(this.LordAgentSubtypes)}`)
            this.FirstTimeSetup()
            this.SetupOnFactionTurnStart()
            this.SetupOnRecruitmentFromPool()
            this.SetupOnTurnToResetPool()
            this.FixLordsMountAnciliaries()
        }

        FirstTimeSetup(): void {
            if(localStorage.getItem(TAG_VERSIONSTRING) != null) {
                const savedGameVersion = localStorage.getItem(TAG_VERSIONSTRING) as string
                if(ADMBRETLORDPACK != savedGameVersion) {
                    this.l.LogWarn(`Mismatched save game version, attempting to upgrade from ${savedGameVersion} to ${ADMBRETLORDPACK}`)
                                        
                    if(cm.turn_number() > 15) {
                        this.l.LogWarn(`Attempting to load...`)
                        this.Load()
                        this.l.LogWarn(`Turn number is above > 15, Resetting it now`)
                        this.ResetPool()
                    }
                    this.l.LogWarn(`changing the game version from ${savedGameVersion} to ${ADMBRETLORDPACK}`)
                    localStorage.setItem(TAG_VERSIONSTRING, ADMBRETLORDPACK)
                }
                this.localVersion = localStorage.getItem(TAG_VERSIONSTRING) as string
                print(this.localVersion)
                this.l.Log(`system is set to version ${this.localVersion}`)
                this.Load()
                this.l.Log("FirstTimeSetup ok - existing campaign")
                return
            }
            
            this.l.LogWarn("First time setup")
            localStorage.setItem(TAG_VERSIONSTRING, ADMBRETLORDPACK)
            this.l.LogWarn("Save game has been tagged")
            this.BretonnianFactionsKeys.forEach(fac => {
                this.bretLordPool.push(new LordPool(fac, this.LordAgentSubtypes))
            })
            this.Save()
            this.l.LogWarn("Bret lord pool json has been saved")
            this.l.Log("FirstTimeSetup ok")
        }

        SetupOnFactionTurnStart(): void {
            core.add_listener(
                "AdmiralNelsonLordPackOnTurnBegin", 
                "FactionTurnStart", 
                (context) => {
                    const faction = context.faction ? context.faction().name() : ""
                    return this.BretonnianFactionsKeys.indexOf(faction) >= 0
                },
                (context) => {
                    const theFaction = context.faction ? context.faction() : null
                    if(theFaction == null) return

                    this.AttemptToSpawnLord(theFaction)
                },
                true
            )
            this.l.Log("SetupOnFactionTurnStart ok")
        }

        SetupOnRecruitmentFromPool(): void {
            core.add_listener(
                "AdmiralNelsonLordPackOnRecruitmentFromPool",
                "CharacterRecruited",
                (context) => {
                    const theChar = context.character ? context.character() : null
                    if(theChar == null) return false

                    const subtypeKey = theChar.character_subtype_key()
                    this.l.Log(`someone was spawned ${subtypeKey}`)
                    return this.LordAgentSubtypes.indexOf(subtypeKey) >= 0
                },
                (context) => {
                    const theChar = context.character ? context.character() : null
                    if(theChar == null) return false
                    
                    this.OnLordSpanedFromPool(theChar)
                },
                true
            )
            this.l.Log("SetupOnRecruitmentFromPool ok")
        }

        SetupOnTurnToResetPool(): void {
            core.add_listener(
                "AdmiralNelsonLordPackSetupOnTurnToResetPool",
                "EndOfRound",
                true,
                (_) => {
                    this.OnTurnToResetPool()
                },
                true
            )
            this.l.Log("SetupOnTurnToResetPool ok")
        }

        constructor() {
            cm.add_first_tick_callback( () => { this.Init() })
        }
    }
    
    new BretLordPack()
}