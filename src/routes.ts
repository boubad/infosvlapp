import type { RouteDefinition } from 'svelte-spa-router';
import Home from './lib/svelte/features/home/Home.svelte';
import NotFound from './lib/svelte/features/NotFound.svelte';
import Test from "./lib/svelte/features/Test.svelte";
import Etudiants from "./lib/svelte/features/etudiant/Etudiants.svelte";
import Etudiant from "./lib/svelte/features/etudiant/Etudiant.svelte";
import EtudiantFilter from "./lib/svelte/features/etudiantfilter/EtudiantFilter.svelte";
import Note from "./lib/svelte/features/common/Note.svelte";
import Evt from "./lib/svelte/features/common/Evt.svelte";
import Controles from "./lib/svelte/features/controle/Controles.svelte";
import Controle from "./lib/svelte/features/controle/Controle.svelte";
import GroupeControles from "./lib/svelte/features/groupecontrole/GroupeControles.svelte";
import GroupeControle from "./lib/svelte/features/groupecontrole/GroupeControle.svelte";
//
export const routes: RouteDefinition = {
    '/': Home,
    '/test': Test,
    '/etudiants': Etudiants,
    '/etudiant': Etudiant,
    '/note': Note,
    '/evt': Evt,
    '/filter/etudiant': EtudiantFilter,
    '/controles': Controles,
    '/controle': Controle,
    '/groupecontroles': GroupeControles,
    '/groupecontrole': GroupeControle,
    // The catch-all route must always be last
    '*': NotFound
};
