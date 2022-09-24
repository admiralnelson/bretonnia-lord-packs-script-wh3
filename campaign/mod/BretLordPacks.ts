namespace AdmiralNelson {

    const DEBUG = true
    const VERSION = 1

    class BretLordPack {
        constructor() {}

        private readonly l = new Logger("BretLordPack")

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
        
        private SpawnLordToPool(subtypeKey: string, factionKey: string): void {
            this.l.LogWarn(debug.traceback())
            this.l.LogWarn(`I picked ${subtypeKey} lord to be added into pool`)
            cm.spawn_character_to_pool(factionKey, "", "", "", "", 18, true, "general", subtypeKey, false, "")
        }

        private SpawnLordToCenter(subtypeKey: string, factionKey: string): void {

        }

        Init(): void {
            this.LordAgentSubtypes.forEach(element => {
                this.l.Log(element)
            })

            this.l.LogWarn(JSON.stringify(this.BretonnianFactionsKeys))

            this.l.LogWarn("hello i'm compiled from typescript!")
            this.l.LogWarn(`BretLordPacks runtime version ${VERSION}`)
            core.add_listener(
                "admiralnelsonOnTurnBegin", 
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

                    //const randomNr = cm.random_number(this.LordAgentSubtypes.length - 1, 0)
                    //const pickedAgentKey = this.LordAgentSubtypes[0]
                    this.LordAgentSubtypes.forEach(key => {
                        this.SpawnLordToPool(key, factionKey)
                    });
                    
                },
                true
            )

            
        }
    }

    cm.add_first_tick_callback( () => {
        new BretLordPack().Init()
    })
}