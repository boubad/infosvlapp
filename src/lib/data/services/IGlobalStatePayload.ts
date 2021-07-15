import type { IAffectationDoc } from "../domain/IAffectationDoc";
import type { IAnneeDoc } from "../domain/IAnneeDoc";
import type { IControleDoc } from "../domain/IControleDoc";
import type { IDataOption } from "../domain/IDataOption";
import type { IGroupeDoc } from "../domain/IGroupeDoc";
import type { IMatiereDoc } from "../domain/IMatiereDoc";
import type { ISemestreDoc } from "../domain/ISemestreDoc";
import type { IUniteDoc } from "../domain/IUniteDoc";

export interface IGlobalStatePayload {
    annees?: IDataOption[];
    semestres?: IDataOption[];
    groupes?: IDataOption[];
    unites?: IDataOption[];
    matieres?: IDataOption[];
    groupescontroles?:IDataOption[];
    etudiants?: IDataOption[];
    controles?: IControleDoc[];
    annee?: IAnneeDoc;
    semestre?: ISemestreDoc;
    groupe?: IGroupeDoc;
    unite?: IUniteDoc;
    matiere?: IMatiereDoc;
    affectation?: IAffectationDoc;
  } // interface IAppState
  