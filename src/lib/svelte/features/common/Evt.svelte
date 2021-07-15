<script lang="ts">
    //
    import { Container, Col, Form, Row } from "sveltestrap";
    import PersonHeader from "../../components/PersonHeader.svelte";
    import EvtTypeChoice from "../../components/EvtTypeChoice.svelte";
    import InputObservations from "../../components/InputObservations.svelte";
    import BlobInfo from "../../components/BlobInfo.svelte";
    import ItemChoice from "../../components/ItemChoice.svelte";
    import InputText from "../../components/InputText.svelte";
    import InputJustife from "../../components/InputJustifie.svelte";
    import EditCommands from "../../components/EditCommands.svelte";
    import { busystore } from "../../stores/BusyStore";
    import type { IEvtDoc } from "../../../data/domain/IEvtDoc";
    import { CreateEvt } from "../../../data/domain/IEvtDoc";
    import { EvtType } from "../../../data/domain/EvtType";
    import { InfoDataStore } from "../../../data/services/InfoDataStore";
    import type { IAttachedDoc } from "../../../data/domain/IAttachedDoc";
    import { onMount } from "svelte";
    import {
        PROMPT_DURATION,
        PROMPT_ETUDIANT,
        TEXT_REMOVE_EVT,
        TITLE_REMOVE_EVT,
    } from "../InfoPrompt";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import {
        controleetudiantsstore,
        currentevtstore,
    } from "../../stores/ControleStore";
    import { ControleServices } from "../../../data/services/ControleServices";
    import InfoNavBar from "../InfoNavBar.svelte";
import { DateToDisplay } from "../../../data/services/dateutils";
    //
    let prev: IEvtDoc = CreateEvt();
    //
    $: busy = $busystore;
    $: evt = $currentevtstore;
    $: etudiants = $controleetudiantsstore;
    //
    $: notPersisted = evt._rev.trim().length < 1;
    $: isEvtModified =
        evt._modified !== undefined && evt._modified !== null
            ? evt._modified
            : false;
    $: storeable =
        evt.evttype != EvtType.Inconnu &&
        evt.etudiantid.trim().length > 0 &&
        evt.controleid.trim().length > 0 &&
        isEvtModified;
    $: controleTitle =
        DateToDisplay(evt._date) +
        " - " +
        (evt._controleName ? evt._controleName : "");
    $: blobs = evt._attachments ? evt._attachments : [];
    //
    const performRefresh = async () => {
        busystore.set(true);
        try {
            const evtid = evt._id;
            const xblobs: IAttachedDoc[] = [];

            if (evtid.length > 0) {
                const pMan = new ControleServices();
                const store = pMan.datastore;
                const p = await store.findEvtByIdAsync(evtid);
                if (p !== undefined && p !== null) {
                    evt = p;
                    const bb = p._attachments ? p._attachments : [];
                    const n = bb.length;
                    for (let i = 0; i < n; i++) {
                        const p = bb[i];
                        await store.checkAttachedDocUrl(p);
                        xblobs.push(p);
                    } // i
                    evt = p;
                }
            }
            prev = Object.assign({}, evt);
            blobs = xblobs;
        } catch (_e) {
            console.log(_e);
        } finally {
            busystore.set(false);
        }
    }; // performRefresh
    //
    const onValueChanged = async (val: any, name: string) => {
        const p: any = Object.assign({}, evt);
        p[name] = val;
        p._modified = true;
        evt = p;
        isEvtModified =
            evt._modified !== undefined && evt._modified !== null
                ? evt._modified
                : false;
        storeable =
            evt.evttype != EvtType.Inconnu &&
            evt.etudiantid.trim().length > 0 &&
            evt.controleid.trim().length > 0 &&
            isEvtModified;
    };
    //
    const performRemove = async () => {
        busystore.set(true);
        try {
            const store = new InfoDataStore();
            const r = await store.removeDocAsync(evt._id);
            await performRefresh();
            blobs = [];
            evt = CreateEvt();
            prev = CreateEvt();
        } catch (e) {}
        busystore.set(false);
    };
    //
    const performCancel = () => {
        evt = prev;
    };
    const performSave = async () => {
        busystore.set(true);
        try {
            const store = new InfoDataStore();
            const r = await store.maintainsDocAsync(evt);
            if (r !== undefined && r !== null && r.length > 0) {
                await performRefresh();
            }
        } catch (e) {}
        busystore.set(false);
    };
    const onSaveAttachment = async (
        name: string,
        mime: string,
        data: Blob,
        _owner?: string
    ): Promise<any> => {
        try {
            const store = new InfoDataStore();
            await store.maintainsBlobAsync(evt._id, name, mime, data);
            await performRefresh();
        } finally {
            busystore.set(false);
        }
    };
    const onRemoveAttachment = async (
        name: string,
        _parentid?: string
    ): Promise<any> => {
        busystore.set(true);
        try {
            const store = new InfoDataStore();
            await store.removeBlobAsync(evt._id, name);
            await performRefresh();
        } finally {
            busystore.set(false);
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
            <h2>{controleTitle}</h2>
        </Col>
    </Row>
    <Row>
        <Col>
            <PersonHeader
                url={evt._url}
                firstname={evt._firstname}
                lastname={evt._lastname}
            />
        </Col>
    </Row>
    <Row>
        <Col>
            <Form>
                {#if notPersisted}
                    <Row>
                        <Col>
                            <ItemChoice
                                value={evt._id}
                                label={PROMPT_ETUDIANT}
                                name={DomainConstants.FIELD_ETUDIANTID}
                                {busy}
                                items={etudiants}
                                {onValueChanged}
                            />
                        </Col>
                    </Row>
                {/if}
                <Row>
                    <Col>
                        <EvtTypeChoice
                            value={evt.evttype}
                            {busy}
                            {onValueChanged}
                        />
                    </Col>
                    <Col>
                        <InputText
                            value={evt.duration}
                            label={PROMPT_DURATION}
                            name={DomainConstants.FIELD_DURATION}
                            {busy}
                            {onValueChanged}
                        />
                    </Col>
                    <Col>
                        <InputJustife
                            {busy}
                            value={evt.justifie}
                            {onValueChanged}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputObservations
                            value={evt.observations}
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
        deleteDialogTitle={TITLE_REMOVE_EVT}
        deleteDialogText={TEXT_REMOVE_EVT}
        cancancel={isEvtModified}
        canremove={evt._rev.trim().length > 0}
        cansave={storeable}
        onCancel={performCancel}
        onRemove={performRemove}
        onSave={performSave}
    />
    <Row>
        <Col>
            <BlobInfo
                {busy}
                parentid={evt._id}
                {blobs}
                onSave={onSaveAttachment}
                onRemove={onRemoveAttachment}
            />
        </Col>
    </Row>
</Container>
