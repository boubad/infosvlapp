<script lang="ts">
    //
    import { Container, Col, NavLink, Row, Table } from "sveltestrap";
    import {
        COMMAND_CONTROLE_NEW,
        PROMPT_DATE,
        PROMPT_GROUPE,
        PROMPT_GROUPECONTROLES,
        PROMPT_NAME,
        TITLE_CONTROLES_LIST,
    } from "../InfoPrompt";
    import ListCommands from "../../components/ListCommands.svelte";
    import { currentaffectationstore } from "../../stores/GlobalStores";
    import {
        controlesstore,
        currentcontrolestore,
        currentgroupecontrolesstore,
        groupecontrolesstore,
    } from "../../stores/ControleStore";
    import { busystore } from "../../stores/BusyStore";
    import { ControleServices } from "../../../data/services/ControleServices";
    import { CreateControle } from "../../../data/domain/IControleDoc";
    import InfoNavBar from "../InfoNavBar.svelte";
    import { DateToDisplay } from "../../../data/services/dateutils";
    import { InfoRouter } from "../inforouter";
    import {
        ROUTE_CONTROLE_DETAIL,
        ROUTE_GROUPECONTROLE_DETAIL,
    } from "../../routesdefs";
    //
    $: items = $controlesstore;
    $: busy = $busystore;
    $: canCreate =
        $currentaffectationstore._id.length > 0 &&
        $groupecontrolesstore.length > 0;
    //
    const handleCreate = async () => {
        if (!busy) {
            $currentcontrolestore = CreateControle();
            InfoRouter(ROUTE_CONTROLE_DETAIL);
        }
    };
    //
    const handleSelectControle = async (controleid: string) => {
        if (!busy) {
            $busystore = true;
            try {
                const pMan = new ControleServices();
                const p = await pMan.datastore.findControleByIdAsync(
                    controleid
                );
                if (p !== undefined && p !== null) {
                    $currentcontrolestore = p;
                    InfoRouter(ROUTE_CONTROLE_DETAIL);
                }
            } catch (e) {
                console.log(e);
            }
            $busystore = false;
        }
    };
    const handleSelectGroupeControle = async (groupecontroleid: string) => {
        if (!busy) {
            $busystore = true;
            try {
                const pMan = new ControleServices();
                const p = await pMan.datastore.findGroupeControlesByIdAsync(
                    groupecontroleid
                );
                if (p !== undefined && p !== null) {
                    $currentgroupecontrolesstore = p;
                    InfoRouter(ROUTE_GROUPECONTROLE_DETAIL);
                }
            } catch (e) {
                console.log(e);
            }
            $busystore = false;
        }
    };
    //
</script>

<Container>
    <Row>
        <InfoNavBar />
    </Row>
    <Row>
        <Col>
            <Row>
                <Col>
                    <h2 class="text-center">
                        {TITLE_CONTROLES_LIST}
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListCommands
                        {busy}
                        cancreate={!busy && canCreate}
                        canrefresh={canCreate}
                        newbuttontext={COMMAND_CONTROLE_NEW}
                        onCreate={handleCreate}
                        onRefresh={() => {}}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table bordered={true} striped={true}>
                        <thead>
                            <tr>
                                <th>{PROMPT_DATE}</th>
                                <th>{PROMPT_NAME}</th>
                                <th>{PROMPT_GROUPECONTROLES}</th>
                                <th>{PROMPT_GROUPE}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each items as item}
                                <tr>
                                    <td>
                                        <NavLink
                                            disabled={busy}
                                            on:click={() => {
                                                handleSelectControle(item._id);
                                            }}
                                        >
                                            {DateToDisplay(item.date)}
                                        </NavLink>
                                    </td>
                                    <td>
                                        <NavLink
                                            disabled={busy}
                                            on:click={() => {
                                                handleSelectControle(item._id);
                                            }}
                                        >
                                            {item.name}
                                        </NavLink>
                                    </td>
                                    <td>
                                        <NavLink
                                            disabled={busy}
                                            on:click={() => {
                                                handleSelectGroupeControle(
                                                    item.groupecontroleid
                                                );
                                            }}
                                        >
                                            {item._groupeControlesSigle}
                                        </NavLink>
                                    </td>
                                    <td>
                                        {item._groupeSigle}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Col>
    </Row>
</Container>
