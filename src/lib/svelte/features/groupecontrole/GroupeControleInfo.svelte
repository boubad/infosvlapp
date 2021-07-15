<script lang="ts">
    //
    import { Container, Col, Form, Row } from "sveltestrap";
    //
    import InputObservations from "../../components/InputObservations.svelte";
    import InputText from "../../components/InputText.svelte";
    import EditCommands from "../../components/EditCommands.svelte";
    import {
        currentmatierestore,
        currentsemestrestore,
    } from "../../stores/GlobalStores";
    import {
        currentgroupecontrolesstore,
        groupecontrolesstore,
    } from "../../stores/ControleStore";
    import { busystore } from "../../stores/BusyStore";
    import type {
        IGroupeControlesDoc
    } from "../../../data/domain/IGroupeControlesDoc";
    import {
        CreateGroupeControles
    } from "../../../data/domain/IGroupeControlesDoc";
    import { GroupeControlesServices } from "../../../data/services/GroupeControlesServices";
    import { push } from "svelte-spa-router";
    import { ROUTE_GROUPECONTROLES_LIST } from "../../routesdefs";
    import { PROMPT_NAME, PROMPT_SIGLE } from "../InfoPrompt";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    //
    let prev: IGroupeControlesDoc = CreateGroupeControles();
    //
    $: semestre = $currentsemestrestore;
    $: matiere = $currentmatierestore;
    $: controle = $currentgroupecontrolesstore;
    $: busy = $busystore;
    $: isModified =
        controle._modified !== undefined &&
        controle._modified !== null &&
        controle._modified === true;
    $: storeable =
        isModified &&
        controle.semestreid.trim().length > 0 &&
        controle.matiereid.trim().length > 0 &&
        controle.sigle.trim().length > 0 &&
        controle.name.trim().length > 0;
    $: controleTitle = controle.name;
    //
    const onValueChanged = (val: any, name: string) => {
        const pp = Object.assign({}, controle);
        pp[name] = val;
        pp._modified = true;
        controle = pp;
    };
    const performCancel = async () => {
        controle = prev;
    };
    const performSave = async () => {
        busystore.set(true);
        try {
            const pMan = new GroupeControlesServices();
            const r = await pMan.saveItemAsync(controle);
            if (r && r.item) {
                $currentgroupecontrolesstore = r.item;
                controle = r.item;
            }
        } catch (e) {
            console.log(e);
        } finally {
            busystore.set(false);
        }
    };
    const performRemove = async () => {
        busystore.set(true);
        try {
            const pMan = new GroupeControlesServices();
            await pMan.removeItemAsync(controle);
            const gg = await pMan.datastore.getGroupeControlesOptionsAsync(
                semestre,
                matiere
            );
            if (gg !== undefined && gg !== null) {
                $currentgroupecontrolesstore = CreateGroupeControles();
                $groupecontrolesstore = gg;
                push(ROUTE_GROUPECONTROLES_LIST);
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
        <Col>
            <h2 class="text-center">{controleTitle}</h2>
        </Col>
    </Row>
    <Row>
        <Col>
            <Form>
                <Row>
                    <Col>
                        <InputText
                            value={controle.sigle}
                            label={PROMPT_SIGLE}
                            name={DomainConstants.FIELD_SIGLE}
                            {busy}
                            {onValueChanged}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputText
                            value={controle.name}
                            label={PROMPT_NAME}
                            name={DomainConstants.FIELD_NAME}
                            {busy}
                            {onValueChanged}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputObservations
                            value={controle.observations}
                            {busy}
                            {onValueChanged}
                        />
                    </Col>
                </Row>
            </Form>
        </Col>
    </Row>
    <EditCommands
        {busy}
        cancancel={isModified}
        canremove={controle._rev.length > 0}
        cansave={storeable}
        onCancel={performCancel}
        onRemove={performRemove}
        onSave={performSave}
    />
</Container>
