<script lang="ts">
    //
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import { Container, Col, NavLink, Row, Table } from "sveltestrap";
    import type { IDataOption } from "../../../data/domain/IDataOption";
    import type { IPaginationData } from "../../../data/services/IPaginationData";
    import {
        currentetudiantstore,
        etudiantfilterstore,
    } from "../../stores/EtudiantStore";
    import ListCommands from "../../components/ListCommands.svelte";
    import PageNavigator from "../../components/PageNavigator.svelte";
    import PhotoComponent from "../../components/PhotoComponent.svelte";
    import {
        COMMAND_ETUDIANT_NEW,
        PROMPT_NAME,
        PROMPT_OBSERVATIONS,
        PROMPT_PHOTO,
        TITLE_ETUDIANTS_LIST,
    } from "../InfoPrompt";
    import {
        GetInitialPaginationData,
        PaginationDataSetItemsCount,
        PaginationDataSetPage,
    } from "../../../data/services/PaginationUtils";
    import { busystore } from "../../stores/BusyStore";
    import { EtudiantServices } from "../../../data/services/EtudiantServices";
    import { CreateEtudiant } from "../../../data/domain/IEtudiantDoc";
    import InfoNavBar from "../InfoNavBar.svelte";
    import { ROUTE_ETUDIANT_DETAIL } from "../../routesdefs";
    import { InfoRouter } from "../inforouter";
    //
    let items: IDataOption[] = [];
    let dataoptions: IDataOption[] = [];
    let pagination: IPaginationData = GetInitialPaginationData();
    //
    $: busy = $busystore;
    $: pagesCount = pagination.pagesCount;
    $: pageSize = pagination.pageSize;
    $: page = pagination.page;
    $: pages = pagination.pages;
    //
    const performRefresh = async () => {
        busystore.set(true);
        try {
            const pMan = new EtudiantServices();
            const store = pMan.datastore;
            const filter = $etudiantfilterstore;
            dataoptions = await store.getEtudiantsOptionsAsync(filter);
            const itemsCount = dataoptions.length;
            const pdata = PaginationDataSetItemsCount(pagination, itemsCount);
            let opts: IDataOption[] = [];
            if (itemsCount > 0) {
                page = pdata.page;
                pageSize = pdata.pageSize;
                if (pageSize < 1) {
                    pageSize = 16;
                }
                let offset = (page - 1) * pageSize;
                let last = offset + pageSize;
                if (last > itemsCount) {
                    last = itemsCount;
                }
                for (let i = offset; i < last; i++) {
                    opts.push(dataoptions[i]);
                } // i
            } // itemsCount
            pagination = pdata;
            items = opts;
        } finally {
            busystore.set(false);
        }
    };
    //
    const onGotoPage = (n: number) => {
        const pdata = PaginationDataSetPage(pagination, n);
        const itemsCount = dataoptions.length;
        const opts: IDataOption[] = [];
        if (itemsCount > 0) {
            let page = pdata.page;
            let nc = pdata.pageSize;
            let offset = (page - 1) * nc;
            let last = offset + nc;
            if (last > itemsCount) {
                last = itemsCount;
            }
            for (let i = offset; i < last; i++) {
                const p = dataoptions[i];
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
                const pMan = new EtudiantServices();
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
    const handleCreate = () => {
        if (!busy) {
            $currentetudiantstore = CreateEtudiant();
            InfoRouter(ROUTE_ETUDIANT_DETAIL);
        }
    };
    //
    onMount(async () => {
        await performRefresh();
    });
</script>

<Container>
    <Row>
        <InfoNavBar />
    </Row>
    <Row>
        <Col>
            <h2 class="text-center">{TITLE_ETUDIANTS_LIST}</h2>
        </Col>
    </Row>
    <Row>
        <Col class="text-center">
            <ListCommands
                {busy}
                cancreate={!busy}
                canrefresh={!busy}
                newbuttontext={COMMAND_ETUDIANT_NEW}
                onCreate={handleCreate}
                onRefresh={performRefresh}
            />
        </Col>
    </Row>
    {#if items.length > 0}
        <Row>
            <Col class="text-center">
                <PageNavigator
                    {pages}
                    {page}
                    {pagesCount}
                    {onGotoPage}
                    lpath={"#/etudiants"}
                />
            </Col>
        </Row>

        <Row>
            <Col>
                <Table bordered={true} striped={true}>
                    <thead>
                        <tr>
                            <th>{PROMPT_PHOTO}</th>
                            <th>{PROMPT_NAME}</th>
                            <th>{PROMPT_OBSERVATIONS}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each items as item (item.value)}
                            <tr>
                                <td>
                                    {#if item.url}
                                        <PhotoComponent
                                            url={item.url}
                                            text={item.name}
                                            height={56}
                                        />
                                    {/if}
                                </td>
                                <td>
                                    <NavLink
                                        disabled={busy}
                                        on:click={() => {
                                            handleSelectEtudiant(item.value);
                                        }}
                                    >
                                        {item.name}
                                    </NavLink>
                                </td>
                                <td>
                                    {item.subTitle}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </Table>
            </Col>
        </Row>
    {/if}
</Container>
