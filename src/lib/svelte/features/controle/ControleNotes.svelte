<script lang="ts">
    import { onMount } from "svelte";
    import { Container, Col, NavLink, Row, Table } from "sveltestrap";
    import PhotoComponent from "../../components/PhotoComponent.svelte";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import type { IPaginationData } from "../../../data/services/IPaginationData";
    import PageNavigator from "../../components/PageNavigator.svelte";
    import {
        COMMAND_SELECT,
        PROMPT_ACTION,
        PROMPT_NAME,
        PROMPT_NOTE,
        PROMPT_OBSERVATIONS,
        PROMPT_PHOTO,
    } from "../InfoPrompt";
    import {
        GetInitialPaginationData,
        PaginationDataSetItemsCount,
        PaginationDataSetPage,
    } from "../../../data/services/PaginationUtils";
    import { busystore } from "../../stores/BusyStore";
    import { ControleServices } from "../../../data/services/ControleServices";
    import {
        currentcontrolestore,
        currentnotestore,
    } from "../../stores/ControleStore";
    import type { INoteDoc } from "../../../data/domain/INoteDoc";
    import { currentetudiantstore } from "../../stores/EtudiantStore";
import { GetControleTitle } from "../../../data/domain/IControleDoc";
import { ROUTE_ETUDIANT_DETAIL, ROUTE_NOTE_DETAIL } from "../../routesdefs";
import { InfoRouter } from "../inforouter";
    //
    let items: INoteDoc[] = [];
    //
    let allnotes: INoteDoc[] = [];
    let pagination: IPaginationData = GetInitialPaginationData();
    //
    $: busy = $busystore;
    $: controle = $currentcontrolestore;
    $: controletitle = GetControleTitle(controle);
    $: pagesCount = pagination.pagesCount;
    $: pageSize = pagination.pageSize;
    $: page = pagination.page;
    $: pages = pagination.pages;
    //
    const performRefresh = async () => {
        busystore.set(true);
        try {
            let itemsCount = 0;
            let xallnotes = [];
            let xitems = [];
            let xpagination = Object.assign({}, pagination);
            let controleid = controle._id;
            if (controleid.length > 0) {
                const pMan = new ControleServices();
                const store = pMan.datastore;
                const filter: any = {
                    doctype: DomainConstants.TYPE_NOTE,
                    controleid,
                };
                const fields: string[] = [DomainConstants.FIELD_ID];
                const mm = await store.findAllDocsBySelectorAsync(
                    filter,
                    fields
                );
                if (mm !== undefined && mm !== null) {
                    const n = mm.length;
                    for (let i = 0; i < n; i++) {
                        const m = mm[i];
                        if (m && m._id) {
                            const p = await store.findNoteByIdAsync("" + m._id);
                            if (p !== undefined && p !== null) {
                                xallnotes.push(p);
                            }
                        } // id
                    } // i
                    itemsCount = xallnotes.length;
                    xpagination = PaginationDataSetItemsCount(
                        pagination,
                        itemsCount
                    );
                    if (itemsCount > 0) {
                        page = xpagination.page;
                        pageSize = xpagination.pageSize;
                        if (pageSize < 1) {
                            pageSize = 16;
                        }
                        let offset = (page - 1) * pageSize;
                        let last = offset + pageSize;
                        if (last > itemsCount) {
                            last = itemsCount;
                        }
                        for (let i = offset; i < last; i++) {
                            xitems.push(xallnotes[i]);
                        } // i
                    } // itemsCount
                } //mm
            } 
            allnotes = xallnotes;
            items = xitems;
            pagination = xpagination;
            pagesCount = pagination.pagesCount;
            pageSize = pagination.pageSize;
            page = pagination.page;
            pages = pagination.pages;
        } catch (e) {
            console.log(e);
        }
        busystore.set(false);
    }; // performRefresh
    //
    const onGotoPage = (n: number) => {
        const pdata = PaginationDataSetPage(pagination, n);
        const itemsCount = allnotes.length;
        const opts: INoteDoc[] = [];
        if (itemsCount > 0) {
            let page = pdata.page;
            let nc = pdata.pageSize;
            let offset = (page - 1) * nc;
            let last = offset + nc;
            if (last > itemsCount) {
                last = itemsCount;
            }
            for (let i = offset; i < last; i++) {
                const p = allnotes[i];
                opts.push(p);
            } // i
        } // itemsCount
        items = opts;
        pagination = pdata;
    };
    //
    const handleSelectEtudiant = async (etudiantid: string) => {
        if (!busy) {
            $busystore = true;
            try {
                const pMan = new ControleServices();
                const p = await pMan.datastore.findEtudiantByIdAsync(
                    etudiantid
                );
                if (p !== undefined && p !== null) {
                    $currentetudiantstore = p;
                    InfoRouter(ROUTE_ETUDIANT_DETAIL);
                }
            } catch (e) {
                console.log(e);
            } finally {
                $busystore = false;
            }
        }
    };
    //
    const handleSelectNote = async (noteid: string) => {
        if (!busy) {
            $busystore = true;
            try {
                const pMan = new ControleServices();
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
    //
    //
    onMount(async () => {
        await performRefresh();
    });
</script>

<Container>
    <Row>
        <Col>
            <h2 class="text-center">{controletitle}</h2>
        </Col>
    </Row>
    <Row>
        <Col>
            <PageNavigator {page} {pagesCount} {onGotoPage} {pages} {busy} />
        </Col>
    </Row>
    <Row>
        <Col>
            <Table bordered={true}  striped={true}>
                <thead>
                    <tr>
                        <th>{PROMPT_PHOTO}</th>
                        <th>{PROMPT_NAME}</th>
                        <th>{PROMPT_NOTE}</th>
                        <th>{PROMPT_OBSERVATIONS}</th>
                        <th>{PROMPT_ACTION}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as note}
                        <tr>
                            <td>
                                <PhotoComponent
                                    url={note._url}
                                    text={note._fullname ? note._fullname : ""}
                                />
                            </td>
                            <td>
                                <NavLink
                                    disabled={busy}
                                    on:click={() => {
                                        handleSelectEtudiant(note.etudiantid);
                                    }}
                                >
                                    {note._fullname ? note._fullname : ""}
                                </NavLink>
                            </td>
                            <td class="float-right">
                                {note.value !== undefined && note.value !== null
                                    ? "" + note.value
                                    : ""}
                            </td>
                            <td>{note.observations ? note.observations : ""}</td
                            >
                            <td>
                                <NavLink
                                    disabled={busy}
                                    on:click={() => {
                                        handleSelectNote(note._id);
                                    }}
                                >
                                    {COMMAND_SELECT}
                                </NavLink>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </Table>
        </Col>
    </Row>
</Container>
