import { writable, Writable } from "svelte/store";
import { DomainConstants } from "../../data/domain/DomainConstants";
import type {IEtudiantDoc } from "../../data/domain/IEtudiantDoc";
import { CreateEtudiant} from "../../data/domain/IEtudiantDoc";
//
export const etudiantfilterstore: Writable<any> = writable({'doctype': DomainConstants.TYPE_ETUDIANT});
export const currentetudiantstore: Writable<IEtudiantDoc> = writable(CreateEtudiant());
//