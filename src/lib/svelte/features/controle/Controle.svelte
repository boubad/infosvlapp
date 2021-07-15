<script lang="ts">
    import { TabContent, TabPane, Row, Container } from "sveltestrap";
    import {
        MENU_BLOBS,
        MENU_EVTS,
        MENU_INFOS,
        MENU_NOTES,
    } from "../InfoPrompt";
    import ControleEvts from "./ControleEvts.svelte";
    import ControleInfo from "./ControleInfo.svelte";
    import ControleNotes from "./ControleNotes.svelte";
    import ControleBlobs from "./ControleBlobs.svelte";
    import InfoNavBar from "../InfoNavBar.svelte";
</script>

<Container>
    <Row>
        <InfoNavBar />
    </Row>
    <Row>
        <TabContent>
            <TabPane tabId="info" tab={MENU_INFOS} active>
                <ControleInfo />
            </TabPane>
            <TabPane tabId="notes" tab={MENU_NOTES}>
                <ControleNotes />
            </TabPane>
            <TabPane tabId="evts" tab={MENU_EVTS}>
                <ControleEvts />
            </TabPane>
            <TabPane tabId="blobs" tab={MENU_BLOBS}>
                <ControleBlobs />
            </TabPane>
        </TabContent>
    </Row>
</Container>
