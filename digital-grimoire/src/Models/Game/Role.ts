import {NightOrder} from "./NightOrder.ts";

export interface Role {
    script_id: string;
    name: string;
    type: string;
    edition: string;
    official_icon: string;
    official_icon_bg: string;
    firstNightOrder?: Array<NightOrder>;
    otherNightOrder?: Array<NightOrder>;
}