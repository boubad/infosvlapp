<script lang="ts">
    import { Container, Col, Row } from "sveltestrap";
    import BlobInfo from "../../components/BlobInfo.svelte";
    import { onMount } from "svelte";
    import { InfoDataStore } from "../../../data/services/InfoDataStore";
    import type { IAttachedDoc } from "../../../data/domain/IAttachedDoc";
    import { TITLE_ETUDIANT_BLOBS } from "../InfoPrompt";
    import { busystore } from "../../stores/BusyStore";
    import { currentgroupecontrolesstore } from "../../stores/ControleStore";
    //
    let blobs: IAttachedDoc[] = [];
    //
    $: busy = $busystore;
    $: controle =$currentgroupecontrolesstore;
    //
    const performRefresh = async () => {
        busystore.set(true);
        try {
            const controleid = controle._id;
            if (controleid.length > 0) {
                const store = new InfoDataStore();
                const pp = await store.findGroupeControlesByIdAsync(controleid);
                if (pp !== undefined && pp !== null) {
                    controle = pp;
                    const xblobs: IAttachedDoc[] = [];
                    const bb = controle._attachments
                        ? controle._attachments
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
            const store = new InfoDataStore();
            await store.maintainsBlobAsync(controle._id, name, mime, data);
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
            await store.removeBlobAsync(controle._id, name);
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
            <h2 class="text-center">{TITLE_ETUDIANT_BLOBS}</h2>
        </Col>
    </Row>
    <Row>
        <Col>
            <BlobInfo
                {busy}
                parentid={controle._id}
                {blobs}
                onSave={onSaveAttachment}
                onRemove={onRemoveAttachment}
            />
        </Col>
    </Row>
</Container>
