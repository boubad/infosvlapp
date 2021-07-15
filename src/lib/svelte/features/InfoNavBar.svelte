<script lang="ts">
    import { push } from "svelte-spa-router";

    import {
        Collapse,
        Container,
        Navbar,
        NavbarToggler,
        NavbarBrand,
        Nav,
        NavItem,
        NavLink,
        Row,
    } from "sveltestrap";
    import { onMount } from "svelte";
    import { busystore } from "../stores/BusyStore";
    import { currentaffectationstore } from "../stores/GlobalStores";
    import { groupecontrolesstore } from "../stores/ControleStore";
    import {
        MENU_CONTROLES_LIST,
        MENU_ETUDIANTS_LIST,
        MENU_FILTER_ETUDIANT,
        MENU_GROUPECONTROLES_LIST,
        MENU_HOME,
    } from "./InfoPrompt";
    import { currentnavstore } from "../stores/CommonStore";
    import Global from "./global/Global.svelte";
    import {
        ROUTE_CONTROLES_LIST,
        ROUTE_ETUDIANTS_LIST,
        ROUTE_FILTER_ETUDIANT,
        ROUTE_GROUPECONTROLES_LIST,
        ROUTE_TEST,
    } from "../routesdefs";
    //
    let isOpen = false;
    //
    $: busy = $busystore;
    $: mode = $currentnavstore;
    $: canControles =
        $currentaffectationstore._id.length > 0 &&
        $currentaffectationstore._rev.length > 0 &&
        $groupecontrolesstore.length > 0;
    //
    const handleUpdate = (event?: any) => {
        if (event && event.detail) {
            isOpen = event.detail.isOpen;
        }
    }; // handleUpdate
    //
    const performNavigate = (spath: string) => {
        push(spath);
    };
    //
    interface MenuItem {
        title: string;
        spath: string;
        fDisable: () => boolean;
    }
    const MenuItems: MenuItem[] = [
        {
            title: MENU_GROUPECONTROLES_LIST,
            spath: ROUTE_GROUPECONTROLES_LIST,
            fDisable: () => {
                return false;
            },
        },
        {
            title: MENU_CONTROLES_LIST,
            spath: ROUTE_CONTROLES_LIST,
            fDisable: () => {
                return false;
            },
        },
        {
            title: MENU_ETUDIANTS_LIST,
            spath: ROUTE_ETUDIANTS_LIST,
            fDisable: () => {
                return false;
            },
        },
        {
            title: MENU_FILTER_ETUDIANT,
            spath: ROUTE_FILTER_ETUDIANT,
            fDisable: () => {
                return false;
            },
        },
        {
            title: "Test",
            spath: ROUTE_TEST,
            fDisable: () => {
                return false;
            },
        },
    ];
    //
    onMount(async () => {
        busy = $busystore;
        canControles =
            $currentaffectationstore._id.length > 0 &&
            $currentaffectationstore._rev.length > 0 &&
            $groupecontrolesstore.length > 0;
    });
    //
</script>

<Container>
    <Row>
        <Navbar expand="md">
            <NavbarBrand href="/">InfoApp</NavbarBrand>
            <NavbarToggler on:click={() => (isOpen = !isOpen)} />
            <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
                <Nav class="ms-auto" navbar>
                    {#each MenuItems as item (item.title)}
                        <NavItem active={item.spath === mode}>
                            <NavLink
                                disabled={item.fDisable()}
                                on:click={() => {
                                    mode = item.spath;
                                    $currentnavstore = item.spath;
                                    performNavigate(item.spath);
                                }}
                            >
                                <span>{item.title}</span>
                            </NavLink>
                        </NavItem>
                    {/each}
                </Nav>
            </Collapse>
        </Navbar>
    </Row>
    <Row>
        <Global />
    </Row>
</Container>
