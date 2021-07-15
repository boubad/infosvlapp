import type { IControleDoc } from "../domain/IControleDoc";
import { DateToDisplay } from "./dateutils";

export function GetControleTitle(p: IControleDoc): string {
    const s = (p._matiereSigle) ? p._matiereSigle.toUpperCase() + " - " : "";
    return s + DateToDisplay(p.date) + " - " + p.name;
}//GetControleTitle
