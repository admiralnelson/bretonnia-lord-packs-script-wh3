namespace AdmiralNelsonLordPack {

    const DEBUG = true
    const VERSION = 1
    const ADMBRETLORDPACK = "ADMBRETLORDPACK:v"+VERSION

    const TAG_BRETLORDPOOL = "BRETLORDPOOL"
    const TAG_VERSIONSTRING = "ADMBRETLORDPACK"

    const BOT_2HANDED_LORD_THRESHOLD = 18
    const BOT_MASSIF_LORD_THRESHOLD = 18

    const HUMAN_MASSIF_LORD_THRESHOLD = 32
    const HUMAN_2HANDED_LORD_THRESHOLD = 28

    const DICE_NUMBER = 20
    const DICE_SIDES = 2

    class BretLordPack {

        private localVersion = ADMBRETLORDPACK
        private readonly l = new Logger("BretLordPack")
        // ok
        private bretLordPool : Array<LordPool> = []
        // NOT SUPPORTED
        // private bretLordPool : Array<LordPool> = new Array
        // private bretLordPool = new Array<LordPool> 

        private readonly LordAgentSubtypes = [
            "admiralnelson_bret_lord_massif_agent_key",
            "admiralnelson_bret_lord_massif_sword_shield_agent_key",
            "admiralnelson_bret_lord_2handed_agent_key",
        ]
        
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

        private SpawnLordToPool(subtypeKey: string, factionKey: string): void {
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
                const roll = cm.random_number(1, 0) 
                const whichAgentToChoose = this.LordAgentSubtypes[roll]
                //check its pool before going further, we don't want to spam the recruitment tab 
                if(lordPool.GetAgentCount(whichAgentToChoose) <= 2) {
                    this.SpawnLordToPool(whichAgentToChoose, factionKey)
                    this.l.LogWarn(`big lord with a subtype ${whichAgentToChoose} spawned into pool ${factionKey}`)
                } else {
                    this.l.LogWarn(`big lord with a subtype ${whichAgentToChoose} cannot spawned into pool ${factionKey} because it's full (more than 2)`)
                }
                
                return
            }
            //try to spawn the 2handed guy instead
            if(this.DiceRollCheck(isFactionHuman ? HUMAN_2HANDED_LORD_THRESHOLD : BOT_2HANDED_LORD_THRESHOLD, DICE_NUMBER, DICE_SIDES)) {
                isFactionHuman ? this.l.Log("Faction is human, roll success") : this.l.Log("Faction is bot, roll success")
                const whichAgentToChoose = this.LordAgentSubtypes[2]
                //check its pool before going further, we don't want to spam the recruitment tab 
                if(lordPool.GetAgentCount(whichAgentToChoose) <= 2) {
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

        Init(): void {
            
            this.l.LogWarn("hello i'm compiled from typescript!")
            this.l.LogWarn(`BretLordPacks runtime version ${VERSION}`)
            
            this.FirstTimeSetup()
            this.SetupOnFactionTurnStart()
            this.SetupOnRecruitmentFromPool()
        }

        FirstTimeSetup(): void {
            if(localStorage.getItem(TAG_VERSIONSTRING) != null) {
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

        constructor() {
            this.Init()
        }
    }

    cm.add_first_tick_callback( () => {
        new BretLordPack()
    })
}