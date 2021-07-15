import { DomainConstants } from "./DomainConstants";
import type { ISigleNamedDoc } from "./ISigleNamedDoc";

export interface IGroupeControlesDoc extends ISigleNamedDoc {
    matiereid: string;
    semestreid: string;
    _semestreSigle?: string;
    _matiereSigle?: string;
}
export function CreateGroupeControles(semestreid?: string, matiereid?: string): IGroupeControlesDoc {
    return {
        _id: "",
        _rev: "",
        sigle: "",
        name: "",
        semestreid: semestreid ? semestreid : "",
        matiereid: matiereid ? matiereid : "",
        doctype: DomainConstants.TYPE_GROUPCONTROLE,
        _linkfield: DomainConstants.FIELD_GROUPECONTROLEID,
    };
} // GetInitialGroupeControles
//
export const initialGroupeControles: IGroupeControlesDoc = CreateGroupeControles();
