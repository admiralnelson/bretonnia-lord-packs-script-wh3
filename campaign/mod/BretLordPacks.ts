const DEBUG = true

class BretLordPacks {
    constructor() {}

    private readonly LordAgentSubtypes = [
        "admiralnelson_bret_lord_massif_agent_key",
        "admiralnelson_bret_lord_massif_sword_shield_agent_key",
        "admiralnelson_bret_lord_2handed_agent_key"
    ]

    Init(): void {
        this.LordAgentSubtypes.forEach(element => {
            Log(element)
        });

       LogWarn("hello i'm compiled from typescript!")

       
    }
}


cm.add_first_tick_callback( () => {
    new BretLordPacks().Init();
})