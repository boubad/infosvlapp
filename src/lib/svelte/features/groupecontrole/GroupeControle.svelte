<script lang="ts">
    import { TabContent, TabPane, Row, Container } from "sveltestrap";
    import { MENU_BLOBS, MENU_INFOS } from "../InfoPrompt";
    import GroupeControleInfo from "./GroupeControleInfo.svelte";
    import GroupeControleBlobs from "./GroupeControleBlobs.svelte";
    import InfoNavBar from "../InfoNavBar.svelte";
</script>

<Container>
    <Row>
        <InfoNavBar />
    </Row>
    <Row>
        <TabContent>
            <TabPane tabId="info" tab={MENU_INFOS} active>
                <GroupeControleInfo />
            </TabPane>
            <TabPane tabId="blobs" tab={MENU_BLOBS}>
                <GroupeControleBlobs />
            </TabPane>
        </TabContent>
    </Row>
</Container>
