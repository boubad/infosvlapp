<script lang="ts">
    import { Container, Col, Form, Row } from "sveltestrap";
    import InputText from "../../components/InputText.svelte";
    import PersonHeader from "../../components/PersonHeader.svelte";
    import EditCommands from "../../components/EditCommands.svelte";
    import {
        PROMPT_DEPARTEMENT,
        PROMPT_DOSSIER,
        PROMPT_ETABLISSEMENT,
        PROMPT_ETUDESSUPERIEURES,
        PROMPT_MENTIONBAC,
        PROMPT_OPTIONBAC,
        PROMPT_REDOUBLANT,
        PROMPT_SERIEBAC,
        PROMPT_TYPEFORMATION,
        PROMPT_VILLE,
        TITLE_ETUDIANT_INFO,
    } from "../InfoPrompt";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import { onMount } from "svelte";
    import type { IEtudiantDoc } from "../../../data/domain/IEtudiantDoc";
    import { CreateEtudiant } from "../../../data/domain/IEtudiantDoc";
    import { busystore } from "../../stores/BusyStore";
    import { EtudiantServices } from "../../../data/services/EtudiantServices";
    import { currentetudiantstore } from "../../stores/EtudiantStore";
    //
    let prev: IEtudiantDoc = CreateEtudiant();
    //
    $: busy = $busystore;
    $: etudiant = $currentetudiantstore;
    $: isModified =
        etudiant._modified !== undefined &&
        etudiant._modified !== null &&
        etudiant._modified === true;
    $: storeable =
        etudiant.lastname.trim().length > 0 &&
        etudiant.firstname.trim().length &&
        isModified;
    //
    const onValueChanged = (val: any, name: string) => {
        const pp = Object.assign({}, etudiant);
        pp[name] = val;
        pp._modified = true;
        etudiant = pp;
        isModified =
            etudiant._modified !== undefined &&
            etudiant._modified !== null &&
            etudiant._modified === true;
        storeable =
            etudiant.lastname.trim().length > 0 &&
            etudiant.firstname.trim().length &&
            isModified;
    }; // onVakueChanged
    //
    const onCancelEtudiant = () => {
        etudiant = prev;
    };
    const onSaveEtudiant = async () => {
        busystore.set(true);
        try {
            let vret = Object.assign({}, etudiant);
            const pMan = new EtudiantServices();
            const p = await pMan.saveItemAsync(etudiant);
            if (p.item) {
                vret = p.item;
                $currentetudiantstore = p.item;
                etudiant = vret;
            }
        } finally {
            busystore.set(false);
        }
    };
    //
    const performRefresh = async () => {
        prev = Object.assign({}, etudiant);
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
            <h2 class="text-center">{TITLE_ETUDIANT_INFO}</h2>
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
        <Form>
            <Row>
                <Col>
                    <InputText
                        value={etudiant.departement}
                        label={PROMPT_DEPARTEMENT}
                        name={DomainConstants.FIELD_DEPARTEMENT}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etudiant.ville}
                        label={PROMPT_VILLE}
                        name={DomainConstants.FIELD_VILLE}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etudiant.etablissement}
                        label={PROMPT_ETABLISSEMENT}
                        name={DomainConstants.FIELD_ETABLISSEMENT}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        value={etudiant.seriebac}
                        label={PROMPT_SERIEBAC}
                        name={DomainConstants.FIELD_SERIEBAC}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etudiant.optionbac}
                        label={PROMPT_OPTIONBAC}
                        name={DomainConstants.FIELD_OPTIONBAC}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etudiant.mentionbac}
                        label={PROMPT_MENTIONBAC}
                        name={DomainConstants.FIELD_MENTIONBAC}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        value={etudiant.sup}
                        label={PROMPT_ETUDESSUPERIEURES}
                        name={DomainConstants.FIELD_ETUDESSUPERIEURES}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etudiant.redoublant}
                        label={PROMPT_REDOUBLANT}
                        name={DomainConstants.FIELD_REDOUBLANT}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etudiant.typeformation}
                        label={PROMPT_TYPEFORMATION}
                        name={DomainConstants.FIELD_TYPEFORMATION}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        value={etudiant.ident}
                        label={PROMPT_DOSSIER}
                        name={DomainConstants.FIELD_DOSSIER}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
        </Form>
    </Row>
    <EditCommands
        {busy}
        cancancel={isModified}
        canremove={false}
        cansave={storeable}
        onCancel={() => {
            onCancelEtudiant();
        }}
        onSave={async () => {
            onSaveEtudiant();
        }}
        onRemove={() => {}}
    />
</Container>
