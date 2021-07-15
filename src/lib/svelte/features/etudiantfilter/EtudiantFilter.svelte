<script lang="ts">
    import { TabContent, TabPane, Row, Container } from "sveltestrap";
    import {
        MENU_IDENT,
        MENU_INFOS,
    } from "../InfoPrompt";
    import InfoNavBar from "../InfoNavBar.svelte";
    import EtudiantFilterIdent from "./EtudiantFilterIdent.svelte";
    import EtudiantFilterInfo from "./EtudiantFilterInfo.svelte";
</script>

<Container>
    <Row>
        <InfoNavBar />
    </Row>
    <Row>
        <TabContent>
            <TabPane tabId="ident" tab={MENU_IDENT} active>
                <EtudiantFilterIdent />
            </TabPane>
            <TabPane tabId="info" tab={MENU_INFOS}>
                <EtudiantFilterInfo />
            </TabPane>
        </TabContent>
    </Row>
</Container>
