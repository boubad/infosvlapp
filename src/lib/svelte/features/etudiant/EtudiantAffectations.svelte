<script lang="ts">
    import { onMount } from "svelte";

    import { Container, Col, Row, Table } from "sveltestrap";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import type { IEtudAffectationDoc } from "../../../data/domain/IEtudAffectationDoc";
    import { DateToDisplay } from "../../../data/services/dateutils";
    import { EtudiantServices } from "../../../data/services/EtudiantServices";
    import type { InfoDataStore } from "../../../data/services/InfoDataStore";
    import PersonHeader from "../../components/PersonHeader.svelte";
    import { busystore } from "../../stores/BusyStore";
    import { currentetudiantstore } from "../../stores/EtudiantStore";
    import {
        PROMPT_ANNEE,
        PROMPT_ENDDATE,
        PROMPT_GROUPE,
        PROMPT_OBSERVATIONS,
        PROMPT_SEMESTRE,
        PROMPT_STARTDATE,
        TITLE_ETUDIANT_AFFECTATIONS,
    } from "../InfoPrompt";
    //
    let items: IEtudAffectationDoc[] = [];
    //
    $: etudiant = $currentetudiantstore;
    //
    const fillEtudiantAffectations = async (
        store: InfoDataStore,
        id: string
    ): Promise<IEtudAffectationDoc[]> => {
        const affs: IEtudAffectationDoc[] = [];
        if (id.length < 1) {
            return affs;
        }
        const fields: string[] = [DomainConstants.FIELD_ID];
        const filter: any = {
            doctype: DomainConstants.TYPE_ETUDAFFECTATION,
            etudiantid: id,
        };
        const dd = await store.findAllDocsBySelectorAsync(filter, fields);
        if (dd !== undefined && dd !== null && dd.length > 0) {
            const n = dd.length;
            for (let i = 0; i < n; i++) {
                const m = dd[i];
                if (m._id) {
                    const id = "" + m._id;
                    const pz = await store.findEtudAffectationByIdAsync(id);
                    if (pz) {
                        affs.push(pz);
                    }
                }
            } // i
        } // dd
        if (affs.length > 1) {
            affs.sort((a: IEtudAffectationDoc, b: IEtudAffectationDoc) => {
                const s1: string = a.startdate ? a.startdate : "";
                const s2: string = b.startdate ? b.startdate : "";
                if (s1 < s2) {
                    return 1;
                } else if (s1 > s2) {
                    return -1;
                } else {
                    return 0;
                }
            });
        } // sort
        return affs;
    }; //fillEtudiantNotes
    //
    const performRefresh = async () => {
        busystore.set(true);
        try {
            const pMan = new EtudiantServices();
            const store = pMan.datastore;
            const etudiantid = etudiant._id;
            const pp = await fillEtudiantAffectations(store, etudiantid);
            if (pp !== undefined && pp !== null) {
                items = pp;
            } else {
                items = [];
            }
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
            <h2 class="text-center">{TITLE_ETUDIANT_AFFECTATIONS}</h2>
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
            <Table bordered={true} striped={true}>
                <thead>
                    <tr>
                        <th>{PROMPT_ANNEE}</th>
                        <th>{PROMPT_SEMESTRE}</th>
                        <th>{PROMPT_GROUPE}</th>
                        <th>{PROMPT_STARTDATE}</th>
                        <th>{PROMPT_ENDDATE}</th>
                        <th>{PROMPT_OBSERVATIONS}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as aff}
                        <tr>
                            <td>{aff._anneeSigle ? aff._anneeSigle : ""}</td>
                            <td
                                >{aff._semestreSigle
                                    ? aff._semestreSigle
                                    : ""}</td
                            >
                            <td>{aff._groupeSigle ? aff._groupeSigle : ""}</td>
                            <td>{DateToDisplay(aff.startdate)}</td>
                            <td>{DateToDisplay(aff.enddate)}</td>
                            <td>{aff.observations}</td>
                        </tr>
                    {/each}
                </tbody>
            </Table>
        </Col>
    </Row>
</Container>
