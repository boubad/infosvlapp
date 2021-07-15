<script lang="ts">
    import { Container, Col, Row } from "sveltestrap";
    import BlobInfo from "../../components/BlobInfo.svelte";
    import PersonHeader from "../../components/PersonHeader.svelte";
    import { TITLE_ETUDIANT_BLOBS } from "../InfoPrompt";
    import { onMount } from "svelte";
    import type { IAttachedDoc } from "../../../data/domain/IAttachedDoc";
    import { busystore } from "../../stores/BusyStore";
    import { EtudiantServices } from "../../../data/services/EtudiantServices";
    import { currentetudiantstore } from "../../stores/EtudiantStore";
    //
    let blobs: IAttachedDoc[] = [];
    //
    $: busy = $busystore;
    $: etudiant = $currentetudiantstore;
    //
    const performRefresh = async () => {
        busystore.set(true);
        try {
            const etudiantid = etudiant._id;
            if (etudiantid.length > 0) {
                const pMan = new EtudiantServices();
                const store = pMan.datastore;
                const pp = await store.findEtudiantByIdAsync(etudiantid);
                if (pp !== undefined && pp !== null) {
                    const xblobs: IAttachedDoc[] = [];
                    const bb = etudiant._attachments
                        ? etudiant._attachments
                        : [];
                    const n = bb.length;
                    for (let i = 0; i < n; i++) {
                        const p = bb[i];
                        await store.checkAttachedDocUrl(p);
                        xblobs.push(p);
                    } // i
                    blobs = xblobs;
                } else {
                    blobs = [];
                }
            } else {
                blobs = [];
            }
        } finally {
            busystore.set(false);
        }
    };
    //
    const onSaveAttachment = async (
        name: string,
        mime: string,
        data: Blob,
        _owner?: string
    ): Promise<any> => {
        busystore.set(true);
        try {
            const pMan = new EtudiantServices();
            const r = await pMan.saveItemAttachmentAsync(
                etudiant,
                name,
                mime,
                data
            );
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
            const pMan = new EtudiantServices();
            await pMan.removeAttachmentAsync(etudiant._id, name);
            await performRefresh();
        } finally {
            busystore.set(false);
        }
    };
    //
    //
    onMount(async () => {
        await performRefresh();
    });
    //
</script>

<Container>
    <Row>
        <Col>
            <h2 class="ext-center">{TITLE_ETUDIANT_BLOBS}</h2>
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
        <Col>
            <BlobInfo
                {busy}
                parentid={etudiant._id}
                {blobs}
                onSave={onSaveAttachment}
                onRemove={onRemoveAttachment}
            />
        </Col>
    </Row>
</Container>
