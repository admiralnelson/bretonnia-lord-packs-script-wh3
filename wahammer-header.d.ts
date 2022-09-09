/** @noSelfInFile */


declare function print(...args: any[]): void;
declare function DebuggerBreakHere(): void;
declare function PrintWarning(s: string): void;
declare function out(s: string): void;

interface CampaignManager {
    add_first_tick_callback(callback: Function): void;
}

declare const cm: CampaignManager