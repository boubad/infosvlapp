<script lang="ts">
    import { onMount } from "svelte";
    import { Container, Col, NavLink, Row, Table } from "sveltestrap";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import { ConvertEvtTypeToString } from "../../../data/domain/EvtType";
    import type { IEvtDoc } from "../../../data/domain/IEvtDoc";
    import PersonHeader from "../../components/PersonHeader.svelte";
    import {
        PROMPT_CONTROLE,
        PROMPT_DATE,
        PROMPT_EVT,
        PROMPT_MATIERE,
        PROMPT_OBSERVATIONS,
        PROMPT_SEMESTRE,
        TITLE_ETUDIANT_EVTS,
    } from "../InfoPrompt";
    import { busystore } from "../../stores/BusyStore";
    import { currentetudiantstore } from "../../stores/EtudiantStore";
    import { EtudiantServices } from "../../../data/services/EtudiantServices";
    import {
        currentcontrolestore,
        currentevtstore,
    } from "../../stores/ControleStore";
    import type { InfoDataStore } from "../../../data/services/InfoDataStore";
import { DateToDisplay } from "../../../data/services/dateutils";
import { ROUTE_CONTROLE_DETAIL, ROUTE_EVT_DETAIL } from "../../routesdefs";
import { InfoRouter } from "../inforouter";
    //
    let items: IEvtDoc[] = [];
    //
    $: busy = $busystore;
    $: etudiant = $currentetudiantstore;
    //

    const selectItem = async (evtid: string) => {
        if (!busy) {
            $busystore = true;
            try {
                const pMan = new EtudiantServices();
                const p = await pMan.datastore.findEvtByIdAsync(evtid);
                if (p !== undefined && p !== null) {
                    $currentevtstore = p;
                    InfoRouter(ROUTE_EVT_DETAIL);
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
    const fillEtudiantEvts = async (
        store: InfoDataStore,
        id: string
    ): Promise<IEvtDoc[]> => {
        const evts: IEvtDoc[] = [];
        if (id.length < 1) {
            return evts;
        }
        const fields: string[] = [DomainConstants.FIELD_ID];
        const filter: any = {
            doctype: DomainConstants.TYPE_EVT,
            etudiantid: id,
        };
        const dd = await store.findAllDocsBySelectorAsync(filter, fields);
        if (dd !== undefined && dd !== null && dd.length > 0) {
            const n = dd.length;
            for (let i = 0; i < n; i++) {
                const m = dd[i];
                if (m._id) {
                    const id = "" + m._id;
                    const pz = await store.findEvtByIdAsync(id);
                    if (pz) {
                        evts.push(pz);
                    }
                }
            } // i
        } // dd
        if (evts.length > 1) {
            evts.sort((a: IEvtDoc, b: IEvtDoc) => {
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
        return evts;
    }; //fillEtudiantNotes
    //
    const performRefresh = async () => {
        busystore.set(true);
        try {
            const pMan = new EtudiantServices();
            const etudiantid = etudiant._id;
            const store = pMan.datastore;
            const pp = await fillEtudiantEvts(store, etudiantid);
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
    //
</script>

<Container>
    <Row>
        <Col>
            <h2 class="text-center">{TITLE_ETUDIANT_EVTS}</h2>
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
                        <th>{PROMPT_EVT}</th>
                        <th>{PROMPT_OBSERVATIONS}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as evt}
                        <tr>
                            <td>
                                <NavLink
                                    disabled={busy}
                                    on:click={() => {
                                        selectItem(evt._id);
                                    }}
                                >
                                    {DateToDisplay(evt._date)}
                                </NavLink>
                            </td>
                            <td>
                                {evt._semestreSigle ? evt._semestreSigle : ""}
                            </td>
                            <td>{evt._matiereSigle ? evt._matiereSigle : ""}</td
                            >
                            <td>
                                <NavLink
                                    disabled={busy}
                                    on:click={() => {
                                        selectControle(evt.controleid);
                                    }}
                                >
                                    {evt._controleName ? evt._controleName : ""}
                                </NavLink>
                            </td>
                            <td>{ConvertEvtTypeToString(evt.evttype)}</td>
                            <td>{evt.observations ? evt.observations : ""}</td>
                        </tr>
                    {/each}
                </tbody>
            </Table>
        </Col>
    </Row>
</Container>
