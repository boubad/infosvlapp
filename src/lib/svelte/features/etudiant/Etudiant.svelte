<script lang="ts">
    import { TabContent, TabPane, Row, Container } from "sveltestrap";
    import {
        MENU_AFFECTATIONS,
        MENU_BLOBS,
        MENU_EVTS,
        MENU_IDENT,
        MENU_INFOS,
        MENU_NOTES,
    } from "../InfoPrompt";
    import InfoNavBar from "../InfoNavBar.svelte";
    import EtudiantIdent from "./EtudiantIdent.svelte";
    import EtudiantInfo from "./EtudiantInfo.svelte";
    import EtudiantNotes from "./EtudiantNotes.svelte";
    import EtudiantEvts from "./EtudiantEvts.svelte";
    import EtudiantBlobs from "./EtudiantBlobs.svelte";
    import EtudiantAffectations from "./EtudiantAffectations.svelte";
</script>

<Container>
    <Row>
        <InfoNavBar />
    </Row>
    <Row>
        <TabContent>
            <TabPane tabId="ident" tab={MENU_IDENT} active>
                <EtudiantIdent />
            </TabPane>
            <TabPane tabId="info" tab={MENU_INFOS}>
                <EtudiantInfo />
            </TabPane>
            <TabPane tabId="notes" tab={MENU_NOTES}>
                <EtudiantNotes />
            </TabPane>
            <TabPane tabId="evts" tab={MENU_EVTS}>
                <EtudiantEvts />
            </TabPane>
            <TabPane tabId="affs" tab={MENU_AFFECTATIONS}>
                <EtudiantAffectations />
            </TabPane>
            <TabPane tabId="blobs" tab={MENU_BLOBS}>
                <EtudiantBlobs />
            </TabPane>
        </TabContent>
    </Row>
</Container>
