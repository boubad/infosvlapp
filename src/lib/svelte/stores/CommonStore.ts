import { writable } from "svelte/store";
import { CreateControle } from "../../data/domain/IControleDoc";
export const currentcontroleidstore = writable(CreateControle());
export const currentnavstore = writable("");
//