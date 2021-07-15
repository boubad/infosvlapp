import { Writable, writable } from "svelte/store";
import type { IControleDoc } from "../../data/domain/IControleDoc";
import { CreateControle } from "../../data/domain/IControleDoc";
import type { IDataOption } from "../../data/domain/IDataOption";
import type { IEvtDoc } from "../../data/domain/IEvtDoc";
import { CreateEvt } from "../../data/domain/IEvtDoc";
import type { IGroupeControlesDoc } from "../../data/domain/IGroupeControlesDoc";
import { CreateGroupeControles } from "../../data/domain/IGroupeControlesDoc";
import type { INoteDoc } from "../../data/domain/INoteDoc";
import { CreateNote } from "../../data/domain/INoteDoc";
//
export const currentcontrolestore: Writable<IControleDoc> = writable(CreateControle());
export const controlesstore: Writable<IControleDoc[]> = writable([]);
export const controleetudiantsstore: Writable<IDataOption[]> = writable([]);
export const groupecontrolesstore: Writable<IDataOption[]> = writable([]);
export const currentgroupecontrolesstore: Writable<IGroupeControlesDoc> = writable(CreateGroupeControles());
export const currentnotestore: Writable<INoteDoc> = writable(CreateNote());
export const currentevtstore: Writable<IEvtDoc> = writable(CreateEvt());
//

