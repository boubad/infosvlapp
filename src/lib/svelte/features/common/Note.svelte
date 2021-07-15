<script lang="ts">
    import { ControleServices } from "./../../../data/services/ControleServices";
    //
    import { Container, Col, Form, Row } from "sveltestrap";
    import PersonHeader from "../../components/PersonHeader.svelte";
    import InputNote from "../../components/InputNote.svelte";
    import InputObservations from "../../components/InputObservations.svelte";
    import BlobInfo from "../../components/BlobInfo.svelte";
    import EditCommands from "../../components/EditCommands.svelte";
    import type { IAttachedDoc } from "../../../data/domain/IAttachedDoc";
    import { onMount } from "svelte";
    import { TEXT_REMOVE_NOTE, TITLE_REMOVE_NOTE } from "../InfoPrompt";
    import type { INoteDoc } from "../../../data/domain/INoteDoc";
    import { CreateNote } from "../../../data/domain/INoteDoc";
    import { busystore } from "../../stores/BusyStore";
    import { currentnotestore } from "../../stores/ControleStore";
    import InfoNavBar from "../InfoNavBar.svelte";
    import { DateToDisplay } from "../../../data/services/dateutils";
    //
    let prev: INoteDoc = CreateNote();
    //
    $: busy = $busystore;
    $: note = $currentnotestore;
    //
    $: controleTitle =
        DateToDisplay(note._date) +
        " - " +
        (note._controleName ? note._controleName : "");
    $: isNoteModified =
        note._modified !== undefined && note._modified !== null
            ? note._modified
            : false;
    $: blobs = note._attachments ? note._attachments : [];
    //
    const performRefresh = async (id?: string) => {
        busystore.set(true);
        try {
            prev = Object.assign({}, note);
            let noteid = note._id;
            const xblobs: IAttachedDoc[] = [];
            if (noteid.length > 0) {
                const pMan = new ControleServices();
                const store = pMan.datastore;
                const p = await store.findNoteByIdAsync(noteid);
                if (p !== undefined && p !== null) {
                    const bb = p._attachments ? p._attachments : [];
                    const n = bb.length;
                    for (let i = 0; i < n; i++) {
                        const p = bb[i];
                        await store.checkAttachedDocUrl(p);
                        xblobs.push(p);
                    } // i
                    note = p;
                    $currentnotestore = p;
                } // p
            } // noteid
            blobs = xblobs;
        } catch (_e) {
            console.log(_e);
        } finally {
            busystore.set(false);
        }
    }; // performRefresh
    //
    const onChangeValue = (val: any, name: string) => {
        const p: any = Object.assign({}, note);
        p[name] = val;
        p._modified = true;
        note = p;
        isNoteModified =
            note._modified !== undefined && note._modified !== null
                ? note._modified
                : false;
    };
    //
    const performCancel = () => {
        prev = note;
    };
    const performSave = async () => {
        busystore.set(true);
        try {
            const pMan = new ControleServices();
            const store = pMan.datastore;
            const r = await store.maintainsDocAsync(note);
        } catch (e) {}
        busystore.set(false);
        await performRefresh();
    };
    const onSaveAttachment = async (
        name: string,
        mime: string,
        data: Blob,
        _owner?: string
    ): Promise<any> => {
        busystore.set(true);
        try {
            const pMan = new ControleServices();
            const store = pMan.datastore;
            await store.maintainsBlobAsync(note._id, name, mime, data);
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
            const pMan = new ControleServices();
            const store = pMan.datastore;
            await store.removeBlobAsync(note._id, name);
            await performRefresh();
        } finally {
            busystore.set(false);
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
                url={note._url}
                firstname={note._firstname}
                lastname={note._lastname}
            />
        </Col>
    </Row>
    <Row>
        <Col>
            <Form>
                <InputNote
                    value={note.value}
                    {busy}
                    onValueChanged={onChangeValue}
                />
                <InputObservations
                    value={note.observations}
                    {busy}
                    onValueChanged={onChangeValue}
                />
            </Form>
        </Col>
    </Row>
    <EditCommands
        {busy}
        deleteDialogTitle={TITLE_REMOVE_NOTE}
        deleteDialogText={TEXT_REMOVE_NOTE}
        cancancel={isNoteModified}
        canremove={false}
        cansave={isNoteModified}
        onCancel={performCancel}
        onRemove={() => {}}
        onSave={performSave}
    />
    <Row>
        <Col>
            <BlobInfo
                {busy}
                parentid={note._id}
                {blobs}
                onSave={onSaveAttachment}
                onRemove={onRemoveAttachment}
            />
        </Col>
    </Row>
</Container>
