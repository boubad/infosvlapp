<script lang="ts">
    import { push } from "svelte-spa-router";

    import { Container, Nav, NavItem, NavLink } from "sveltestrap";
    import {
        MENU_CONTROLES_LIST,
        MENU_ETUDIANTS_LIST,
        MENU_HOME,
    } from "../InfoPrompt";
    import { currentaffectationstore } from "../../stores/GlobalStores";
    import { busystore } from "../../stores/BusyStore";
    import { groupecontrolesstore } from "../../stores/ControleStore";
    import { onMount } from "svelte";
    //
    let mode: string = "";
    //
    $: busy = $busystore;
    $: canControles =
        $currentaffectationstore._id.length > 0 &&
        $currentaffectationstore._rev.length > 0 &&
        $groupecontrolesstore.length > 0;
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
            title: MENU_HOME,
            spath: "/",
            fDisable: () => {
                return busy;
            },
        },
        {
            title: MENU_CONTROLES_LIST,
            spath: "/controles",
            fDisable: () => {
                return busy || !canControles;
            },
        },
        {
            title: MENU_ETUDIANTS_LIST,
            spath: "/etudiants",
            fDisable: () => {
                return busy;
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
    <Nav vertical>
        {#each MenuItems as item (item.title)}
            <NavItem active={item.spath === mode}>
                <NavLink
                    disabled={item.fDisable()}
                    on:click={() => {
                        mode = item.spath;
                        performNavigate(item.spath);
                    }}
                >
                    {#if item.spath === mode}
                        <h3>{item.title}</h3>
                    {:else}
                        <span>{item.title}</span>
                    {/if}
                </NavLink>
            </NavItem>
        {/each}
    </Nav>
</Container>
