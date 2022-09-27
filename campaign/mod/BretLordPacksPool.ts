namespace AdmiralNelsonLordPack {
    export type AgentKeyToCount = LuaMap<string, number>
    export class LordPool {
        private FactionKey = ""
        private LordAgentSubtypeToCount : AgentKeyToCount = new LuaMap<string, number>

        constructor(factionkey?: string, agentSubtypes?: string[], agentSubtypesToCount?: LuaMap<string, number>){
            this.FactionKey = factionkey ?? "";

            if(agentSubtypes != null) {
                agentSubtypes.forEach(agent => {
                    this.LordAgentSubtypeToCount.set(agent, 0)
                })
            }

            if(agentSubtypesToCount != null) {
                for (const key in agentSubtypesToCount) {
                    this.LordAgentSubtypeToCount.set(key, agentSubtypesToCount.get(key) ?? 0)
                }    
            }
        }

        Reset(): void {
            for (const key in this.LordAgentSubtypeToCount) {
                this.LordAgentSubtypeToCount.set(key, 0)
            }    
        }

        IncrementAgentCount(agentkey: string): void {
            if (this.LordAgentSubtypeToCount.has(agentkey)) {
                const val =  this.LordAgentSubtypeToCount.get(agentkey) ?? -1
                this.LordAgentSubtypeToCount.set(agentkey, val + 1)
            }
        }
        
        DecrementAgentCount(agentkey: string): void {
            if (this.LordAgentSubtypeToCount.has(agentkey)) {
                const  val =  this.LordAgentSubtypeToCount.get(agentkey) ?? 1
                this.LordAgentSubtypeToCount.set(agentkey, clamp(val - 1, 0, 100))
            }
        }

        GetAgentCount(agentkey: string): number {
            return this.LordAgentSubtypeToCount.get(agentkey) ?? -1
        }

        public get AgentKeysToCounts() : ReadonlyLuaMap<string, number> {
            return this.LordAgentSubtypeToCount
        }

        public get Faction(): string {
            return this.FactionKey;
        }
        
    }
}