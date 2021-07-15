import { DomainConstants } from "./DomainConstants";
import type { IAffectationBaseDoc } from "./IAffectationBaseDoc";

export interface IAffectationDoc extends IAffectationBaseDoc {
    matiereid: string;
    _matiereSigle?: string;
    _uniteid?: string;
    _uniteSigle?: string;
    _matiereCoeff?: number;
}
export function CreateAffectation(anneid?: string, semestreid?: string, groupeid?: string, matiereid?: string): IAffectationDoc {
    return (
        {
            _id: "",
            _rev: "",
            anneeid: anneid ? anneid : "",
            semestreid: semestreid ? semestreid : "",
            groupeid: groupeid ? groupeid : "",
            matiereid: matiereid ? matiereid : "",
            doctype: DomainConstants.TYPE_AFFECTATION,
            _linkfield: DomainConstants.FIELD_AFFECTATIONID,
        }
    );
} // CreateAffectation
//
export const initialAffectation: IAffectationDoc = CreateAffectation();
//