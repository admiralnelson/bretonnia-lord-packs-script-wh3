namespace AdmiralNelsonLordPack {

    const DEBUG = true
    const VERSION = 1
    const ADMBRETLORDPACK = "ADMBRETLORDPACK:v"+VERSION

    const TAG_BRETLORDPOOL = "BRETLORDPOOL"
    const TAG_VERSIONSTRING = "ADMBRETLORDPACK"

    const HUMAN_THRESHOLD = 20
    const BOT_THRESHOLD = 10
    const DICE_NUMBER = 2
    const DICE_SIDES = 1

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
        
        private SpawnLordToPool(subtypeKey: string, factionKey: string): void {
            cm.spawn_character_to_pool(factionKey, "", "", "", "", 18, true, "general", subtypeKey, false, "")
            this.l.LogWarn(`I picked ${subtypeKey} lord to be added into pool ${factionKey}`)
        }

        private SpawnLordToCenter(subtypeKey: string, factionKey: string): void {

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

        SpawnLord() : void {

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
                return
            }
            
            this.l.LogWarn("First time setup")
            localStorage.setItem(TAG_VERSIONSTRING, ADMBRETLORDPACK)
            this.l.LogWarn("Save game has been tagged")
            this.BretonnianFactionsKeys.forEach(fac => {
                this.bretLordPool.push(new LordPool(fac, this.LordAgentSubtypes))
            })
            this.l.LogWarn("Bret lord pool json has been saved")
            this.Save()
        }

        SetupOnFactionTurnStart(): void {
            core.add_listener(
                "AdmiralNelsonLordPackOnTurnBegin", 
                "FactionTurnStart", 
                (context) => {
                    const faction = context ? context.faction().name() : ""
                    return this.BretonnianFactionsKeys.indexOf(faction) >= 0
                },
                (context) => {
                    const factionKey = context ? context.faction().name() : ""
                    if(factionKey == "") {
                        this.l.LogError(`should not happen!`)
                        return
                    }

                    this.l.Log(`current bret faction ${factionKey}`)

                    if(false) {
                        this.LordAgentSubtypes.forEach(key => {
                            this.SpawnLordToPool(key, factionKey)
                            this.GetLordPoolOnFaction(factionKey)?.IncrementAgentCount(key)
                        });       
                        this.Save()                 
                    }
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
                    const subtypeKey = context?.character().character_subtype_key() ?? ""
                    this.l.Log(`someone was spawned ${subtypeKey}`)
                    return this.LordAgentSubtypes.indexOf(subtypeKey) >= 0
                },
                (context) => {
                    this.l.LogWarn(`character recruited ${context?.character().character_subtype_key()}`)
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