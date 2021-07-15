import { Writable, writable} from "svelte/store";
import { CreateAffectation } from "../../data/domain/IAffectationDoc";
import type { IDataOption } from "../../data/domain/IDataOption";
export const currentanneestore = writable("");
export const anneesstore: Writable<IDataOption[]> = writable([]);
//
export const currentsemestrestore = writable("");
export const semestresstore: Writable<IDataOption[]> = writable([]);
//
export const currentunitestore = writable("");
export const unitesstore: Writable<IDataOption[]> = writable([]);
//
export const currentmatierestore = writable("");
export const matieresstore: Writable<IDataOption[]> = writable([]);
//
export const currentgroupestore = writable("");
export const groupesstore: Writable<IDataOption[]> = writable([]);
//
export const currentaffectationstore = writable(CreateAffectation());
//
//

