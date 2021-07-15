<script lang="ts">
    import { Container, Col, NavLink, Row, Table } from "sveltestrap";
    import { push } from "svelte-spa-router";
    import PersonHeader from "../../components/PersonHeader.svelte";
    import { onMount } from "svelte";
    import type { INoteDoc } from "../../../data/domain/INoteDoc";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import {
        PROMPT_CONTROLE,
        PROMPT_DATE,
        PROMPT_MATIERE,
        PROMPT_NOTE,
        PROMPT_OBSERVATIONS,
        PROMPT_SEMESTRE,
        TITLE_ETUDIANT_NOTES,
    } from "../InfoPrompt";
    import { busystore } from "../../stores/BusyStore";
    import { currentetudiantstore } from "../../stores/EtudiantStore";
    import { EtudiantServices } from "../../../data/services/EtudiantServices";
    import {
        currentcontrolestore,
        currentnotestore,
    } from "../../stores/ControleStore";
    import type { InfoDataStore } from "../../../data/services/InfoDataStore";
import { DateToDisplay } from "../../../data/services/dateutils";
import { InfoRouter } from "../inforouter";
import { ROUTE_CONTROLE_DETAIL, ROUTE_NOTE_DETAIL } from "../../routesdefs";
    //
    let items: INoteDoc[] = [];
    //
    $: busy = $busystore;
    $: etudiant = $currentetudiantstore;
    //
    const selectItem = async (noteid: string) => {
        if (!busy) {
            $busystore = true;
            try {
                const pMan = new EtudiantServices();
                const p = await pMan.datastore.findNoteByIdAsync(noteid);
                if (p !== undefined && p !== null) {
                    $currentnotestore = p;
                    InfoRouter(ROUTE_NOTE_DETAIL);
                }
            } catch (e) {
                console.log(e);
            } finally {
                $busystore = false;
            }
        }
    };
    const selectControle = async (controleid: string) => {
        if (!busy) {
            $busystore = true;
            try {
                const pMan = new EtudiantServices();
                const p = await pMan.datastore.findControleByIdAsync(
                    controleid
                );
                if (p !== undefined && p !== null) {
                    $currentcontrolestore = p;
                    InfoRouter(ROUTE_CONTROLE_DETAIL);
                }
            } catch (e) {
                console.log(e);
            } finally {
                $busystore = false;
            }
        }
    };
    //
    const fillEtudiantNotes = async (
        store: InfoDataStore,
        id: string
    ): Promise<INoteDoc[]> => {
        const notes: INoteDoc[] = [];
        if (id.length < 1) {
            return notes;
        }
        const fields: string[] = [DomainConstants.FIELD_ID];
        const filter: any = {
            doctype: DomainConstants.TYPE_NOTE,
            etudiantid: id,
        };
        const dd = await store.findAllDocsBySelectorAsync(filter, fields);
        if (dd !== undefined && dd !== null) {
            const n = dd.length;
            for (let i = 0; i < n; i++) {
                const m = dd[i];
                if (m._id) {
                    const id = "" + m._id;
                    if (id.length > 0) {
                        const pz = await store.findNoteByIdAsync(id);
                        if (pz) {
                            notes.push(pz);
                        }
                    }
                }
            } // i
        } // dd
        if (notes.length > 1) {
            notes.sort((a: INoteDoc, b: INoteDoc) => {
                const s1: string = a._date ? a._date : "";
                const s2: string = b._date ? b._date : "";
                if (s1 < s2) {
                    return 1;
                } else if (s1 > s2) {
                    return -1;
                } else {
                    return 0;
                }
            });
        } // sort
        return notes;
    }; //fillEtudiantNotes
    const performRefresh = async () => {
        busystore.set(true);
        try {
            const pMan = new EtudiantServices();
            const store = pMan.datastore;
            const etudiantid = etudiant._id;
            const pp = await fillEtudiantNotes(store, etudiantid);
            items = pp;
        } catch (e) {
            console.log(e);
        } finally {
            busystore.set(false);
        }
    }; // performRefresh
    //
    onMount(async () => {
        await performRefresh();
    });
    //
</script>

<Container>
    <Row>
        <Col>
            <h2 class="text-center">{TITLE_ETUDIANT_NOTES}</h2>
        </Col>
    </Row>
    <Row>
        <Col>
            <PersonHeader
                url={etudiant._url}
                firstname={etudiant.firstname}
                lastname={etudiant.lastname}
            />
        </Col>
    </Row>
    <Row>
        <Col>
            <Table bordered={true}  striped={true}>
                <thead>
                    <tr>
                        <th>{PROMPT_DATE}</th>
                        <th>{PROMPT_SEMESTRE}</th>
                        <th>{PROMPT_MATIERE}</th>
                        <th>{PROMPT_CONTROLE}</th>
                        <th>{PROMPT_NOTE}</th>
                        <th>{PROMPT_OBSERVATIONS}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as note}
                        {#if note.value !== undefined && note.value !== null}
                            <tr>
                                <td>
                                    <NavLink
                                        disabled={busy}
                                        on:click={() => {
                                            selectItem(note._id);
                                        }}
                                    >
                                        {DateToDisplay(note._date)}
                                    </NavLink>
                                </td>
                                <td>
                                    {note._semestreSigle
                                        ? note._semestreSigle
                                        : ""}
                                </td>
                                <td>
                                    {note._matiereSigle
                                        ? note._matiereSigle
                                        : ""}
                                </td>
                                <td>
                                    <NavLink
                                        disabled={busy}
                                        on:click={() => {
                                            selectControle(note.controleid);
                                        }}
                                    >
                                        {note._controleName
                                            ? note._controleName
                                            : ""}
                                    </NavLink>
                                </td>
                                <td class="float-right">
                                    {note.value !== undefined &&
                                    note.value !== null
                                        ? "" + note.value
                                        : ""}
                                </td>
                                <td
                                    >{note.observations
                                        ? note.observations
                                        : ""}</td
                                >
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </Table>
        </Col>
    </Row>
</Container>
