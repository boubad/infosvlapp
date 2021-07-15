<script lang="ts">
    //
    import { onMount } from "svelte";
    import { Button, Container, Col, NavLink, Row, Table } from "sveltestrap";
    import { ConvertEvtTypeToString } from "../../../data/domain/EvtType";
    import {
        COMMAND_SELECT,
        MENU_NEW_EVT,
        PROMPT_ACTION,
        PROMPT_EVT,
        PROMPT_NAME,
        PROMPT_OBSERVATIONS,
        PROMPT_PHOTO,
    } from "../InfoPrompt";
    import PhotoComponent from "../../components/PhotoComponent.svelte";
    import PageNavigator from "../../components/PageNavigator.svelte";
    import type { IEvtDoc } from "../../../data/domain/IEvtDoc";
    import { CreateEvt } from "../../../data/domain/IEvtDoc";
    import type { IPaginationData } from "../../../data/services/IPaginationData";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import {
        GetInitialPaginationData,
        PaginationDataSetItemsCount,
        PaginationDataSetPage,
    } from "../../../data/services/PaginationUtils";
    import { busystore } from "../../stores/BusyStore";
    import {
        currentcontrolestore,
        currentevtstore,
    } from "../../stores/ControleStore";
    import { ControleServices } from "../../../data/services/ControleServices";
    import { currentetudiantstore } from "../../stores/EtudiantStore";
    import { GetControleTitle } from "../../../data/domain/IControleDoc";
    import { ROUTE_ETUDIANT_DETAIL, ROUTE_EVT_DETAIL } from "../../routesdefs";
import { InfoRouter } from "../inforouter";
    //
    let items: IEvtDoc[] = [];
    //
    //
    let allevts: IEvtDoc[] = [];
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
    //
    const performRefresh = async (id?: string) => {
        busystore.set(true);
        try {
            let itemsCount = 0;
            let xallevts = [];
            let xitems = [];
            let xpagination = Object.assign({}, pagination);
            let controleid = controle._id;
            if (controleid.length > 0) {
                const pMan = new ControleServices();
                const store = pMan.datastore;
                const p = await store.findControleByIdAsync(controleid);
                const filter: any = {
                    doctype: DomainConstants.TYPE_EVT,
                    controleid: controle._id,
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
                            const p = await store.findEvtByIdAsync("" + m._id);
                            if (p !== undefined && p !== null) {
                                xallevts.push(p);
                            }
                        } // id
                    } // i
                    itemsCount = xallevts.length;
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
                            xitems.push(xallevts[i]);
                        } // i
                    } // itemsCount
                } //mm
            }
            allevts = xallevts;
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
        const itemsCount = allevts.length;
        const opts: IEvtDoc[] = [];
        if (itemsCount > 0) {
            let page = pdata.page;
            let nc = pdata.pageSize;
            let offset = (page - 1) * nc;
            let last = offset + nc;
            if (last > itemsCount) {
                last = itemsCount;
            }
            for (let i = offset; i < last; i++) {
                const p = allevts[i];
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
    const handleCreate = async () => {
        if (!busy) {
            const p = CreateEvt();
            p.controleid = controle._id;
            $currentevtstore = p;
            InfoRouter(ROUTE_EVT_DETAIL);
        }
    };
    //
    const handleSelectEvt = async (evtid: string) => {
        if (!busy) {
            $busystore = true;
            try {
                const pMan = new ControleServices();
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
    //
    onMount(async () => {
        await performRefresh();
    });
    //
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
        <Col class="text-center">
            <Button color="secondary" on:click={handleCreate} disabled={busy}>
                {MENU_NEW_EVT}
            </Button>
        </Col>
    </Row>
    <Row>
        <Col>
            <Table bordered={true} striped={true}>
                <thead>
                    <tr>
                        <th>{PROMPT_PHOTO}</th>
                        <th>{PROMPT_NAME}</th>
                        <th>{PROMPT_EVT}</th>
                        <th>{PROMPT_OBSERVATIONS}</th>
                        <th>{PROMPT_ACTION}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as item}
                        <tr>
                            <td>
                                <PhotoComponent
                                    url={item._url}
                                    text={item._fullname ? item._fullname : ""}
                                />
                            </td>
                            <td>
                                <NavLink
                                    disabled={busy}
                                    on:click={() => {
                                        handleSelectEtudiant(item.etudiantid);
                                    }}
                                >
                                    {item._fullname ? item._fullname : ""}
                                </NavLink>
                            </td>
                            <td>{ConvertEvtTypeToString(item.evttype)}</td>
                            <td>{item.observations ? item.observations : ""}</td
                            >
                            <td>
                                <NavLink
                                    disabled={busy}
                                    on:click={() => {
                                        handleSelectEvt(item._id);
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
