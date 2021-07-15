<script lang="ts">
    //
    import { Container, Col, NavLink, Row, Table } from "sveltestrap";
    import { CreateGroupeControles } from "../../../data/domain/IGroupeControlesDoc";
    import { BaseServices } from "../../../data/services/BaseServices";
    import { ControleServices } from "../../../data/services/ControleServices";
    import { ROUTE_GROUPECONTROLE_DETAIL } from "../../routesdefs";
    import { busystore } from "../../stores/BusyStore";
    import {
        currentgroupecontrolesstore,
        groupecontrolesstore,
    } from "../../stores/ControleStore";
    import {
        currentmatierestore,
        currentsemestrestore,
    } from "../../stores/GlobalStores";
    import {
        COMMANT_NEW_GROUPEDONTROLE,
        PROMPT_NAME,
        PROMPT_OBSERVATIONS,
        PROMPT_SIGLE,
        TITLE_GROUPESCONTROLES,
    } from "../InfoPrompt";
    import ListCommands from "../../components/ListCommands.svelte";
    import InfoNavBar from "../InfoNavBar.svelte";
import { InfoRouter } from "../inforouter";
    //
    $: busy = $busystore;
    $: items = $groupecontrolesstore;
    $: semestre = $currentsemestrestore;
    $: matiere = $currentmatierestore;
    $: canCreate = semestre.length > 0 && matiere.length > 0;
    //
    const handleCreate = () => {
        const p = CreateGroupeControles();
        p.semestreid = semestre;
        p.matiereid = matiere;
        $currentgroupecontrolesstore = p;
        InfoRouter(ROUTE_GROUPECONTROLE_DETAIL);
    };
    //
    const handleSelectGroupeControle = async (id: string) => {
        busystore.set(true);
        try {
            const pMan = new ControleServices();
            const p = await pMan.datastore.findGroupeControlesByIdAsync(id);
            if (p !== undefined && p !== null) {
                $currentgroupecontrolesstore = p;
                InfoRouter(ROUTE_GROUPECONTROLE_DETAIL);
            }
        } catch (e) {
            console.log(e);
        } finally {
            busystore.set(false);
        }
    };
    //
    const performRefresh = async () => {
        busystore.set(true);
        try {
            const pMan = new BaseServices();
            const gg = await pMan.datastore.getGroupeControlesOptionsAsync(
                semestre,
                matiere
            );
            if (gg !== undefined && gg !== null) {
                $groupecontrolesstore = gg;
                items = gg;
            }
        } catch (e) {
            console.log(e);
        } finally {
            busystore.set(false);
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
            <h2 class="text-center">{TITLE_GROUPESCONTROLES}</h2>
        </Col>
    </Row>
    <Row>
        <Col>
            <ListCommands
                {busy}
                cancreate={canCreate && !busy}
                canrefresh={canCreate && !busy}
                newbuttontext={COMMANT_NEW_GROUPEDONTROLE}
                onCreate={handleCreate}
                onRefresh={performRefresh}
            />
        </Col>
    </Row>
    <Row>
        <Col>
            <Table bordered={true} hover={true}>
                <thead>
                    <tr>
                        <th>{PROMPT_SIGLE}</th>
                        <th>{PROMPT_NAME}</th>
                        <th>{PROMPT_OBSERVATIONS}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as item}
                        {#if item && item.value}
                            <tr>
                                <td>
                                    {#if item.name && item.name.length > 0}
                                        <NavLink
                                            disabled={busy}
                                            on:click={() => {
                                                handleSelectGroupeControle(
                                                    item.value
                                                );
                                            }}
                                        >
                                            {item.name}
                                        </NavLink>
                                    {/if}
                                </td>
                                <td>
                                    {#if item.subTitle && item.subTitle.length > 0}
                                        <NavLink
                                            disabled={busy}
                                            on:click={() => {
                                                handleSelectGroupeControle(
                                                    item.value
                                                );
                                            }}
                                        >
                                            {item.subTitle}
                                        </NavLink>
                                    {/if}
                                </td>
                                <td>
                                    {#if item.subText && item.subText.length > 0}
                                        <NavLink
                                            disabled={busy}
                                            on:click={() => {
                                                handleSelectGroupeControle(
                                                    item.value
                                                );
                                            }}
                                        >
                                            {item.subText}
                                        </NavLink>
                                    {/if}
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </Table>
        </Col>
    </Row>
</Container>
