namespace AdmiralNelson {

    const DEBUG = true

    class BretLordPack {
        constructor() {}

        private readonly LordAgentSubtypes = [
            "admiralnelson_bret_lord_massif_agent_key",
            "admiralnelson_bret_lord_massif_sword_shield_agent_key",
            "admiralnelson_bret_lord_2handed_agent_key"
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
        

        Init(): void {
            this.LordAgentSubtypes.forEach(element => {
                Log(element)
            });

            LogWarn("hello i'm compiled from typescript!")
            core.add_listener(
                "admiralnelsonOnTurnBegin", 
                "FactionTurnStart", 
                (context) => {
                    return true
                },
                (context) => {},
                true
            )
        
        }
    }

    cm.add_first_tick_callback( () => {
        new BretLordPack().Init()
    })
}