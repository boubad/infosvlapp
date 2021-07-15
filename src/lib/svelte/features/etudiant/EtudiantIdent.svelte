<script lang="ts">
    import { Container, Col, Form, Row } from "sveltestrap";
    import InputDate from "../../components/InputDate.svelte";
    import InputText from "../../components/InputText.svelte";
    import InputObservations from "../../components/InputObservations.svelte";
    import InputEmail from "../../components/InputEmail.svelte";
    import InputPhone from "../../components/InputPhone.svelte";
    import SexeChoice from "../../components/SexeChoice.svelte";
    import EditCommands from "../../components/EditCommands.svelte";
    import DeleteItem from "../../components/DeleteItem.svelte";
    import PersonHeader from "../../components/PersonHeader.svelte";
    import type { IEtudiantDoc } from "../../../data/domain/IEtudiantDoc";
    import { CreateEtudiant } from "../../../data/domain/IEtudiantDoc";
    import {
        COMMAND_REMOVE_ETUDIANT,
        PROMPT_ADDRESS,
        PROMPT_BIRTHDATE,
        PROMPT_EMAIL,
        PROMPT_FIRSTNAME,
        PROMPT_LASTNAME,
        PROMPT_PHONE,
        PROMPT_USERNAME,
        TEXT_REMOVE_ETUDIANT,
        TITLE_ETUDIANT_IDENT,
        TITLE_REMOVE_ETUDIANT,
    } from "../InfoPrompt";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import { onMount } from "svelte";
    import { busystore } from "../../stores/BusyStore";
    import { EtudiantServices } from "../../../data/services/EtudiantServices";
    import { currentetudiantstore } from "../../stores/EtudiantStore";
    //
    let prev: IEtudiantDoc = CreateEtudiant();
    //
    $: etudiant = $currentetudiantstore;
    $: isPersisted = etudiant._rev.trim().length > 0;
    $: busy = $busystore;
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
    const onRemoveEtudiant = async () => {
        busystore.set(true);
        try {
            const id = etudiant._id;
            const rev = etudiant._rev;
            let bRet = false;
            if (id.length > 0 && rev.length > 0) {
                const pMan = new EtudiantServices();
                bRet = await pMan.removeItemAsync(etudiant);
            }
            const r = bRet ? CreateEtudiant() : etudiant;
            etudiant = r;
        } finally {
            busystore.set(false);
        }
    };
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
                etudiant = p.item;
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
    //
</script>

<Container>
    <Row>
        <Col>
            <h2 class="text-center">{TITLE_ETUDIANT_IDENT}</h2>
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
    {#if isPersisted && !busy}
        <Row>
            <Col class="text-center">
                <DeleteItem
                    {busy}
                    buttonText={COMMAND_REMOVE_ETUDIANT}
                    dialogText={TEXT_REMOVE_ETUDIANT}
                    dialogTitle={TITLE_REMOVE_ETUDIANT}
                    onDeleteItem={onRemoveEtudiant}
                />
            </Col>
        </Row>
    {/if}
    <Row>
        <Form>
            <Row>
                <Col>
                    <!-- svelte-ignore missing-declaration -->
                    <InputText
                        value={etudiant.username}
                        label={PROMPT_USERNAME}
                        name={DomainConstants.FIELD_USERNAME}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <SexeChoice value={etudiant.sexe} {busy} {onValueChanged} />
                </Col>
                <Col>
                    <InputDate
                        value={etudiant.birthdate}
                        label={PROMPT_BIRTHDATE}
                        name={DomainConstants.FIELD_BIRTHDATE}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        value={etudiant.lastname}
                        label={PROMPT_LASTNAME}
                        name={DomainConstants.FIELD_LASTNAME}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etudiant.firstname}
                        label={PROMPT_FIRSTNAME}
                        name={DomainConstants.FIELD_FIRSTNAME}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputEmail
                        value={etudiant.email}
                        label={PROMPT_EMAIL}
                        name={DomainConstants.FIELD_EMAIL}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputPhone
                        value={etudiant.phone}
                        label={PROMPT_PHONE}
                        name={DomainConstants.FIELD_PHONE}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etudiant.address}
                        label={PROMPT_ADDRESS}
                        name={DomainConstants.FIELD_ADDRESS}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputObservations
                        value={etudiant.observations}
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
        onRemove={() => {}}
        onSave={async () => {
            onSaveEtudiant();
        }}
    />
</Container>
