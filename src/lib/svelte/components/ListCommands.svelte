<script lang="ts">
  //
  import { Button, Col, Container, Row } from "sveltestrap";
  import { COMMAND_CREATE, COMMAND_REFRESH } from "../features/InfoPrompt";
  //
  export let busy: boolean = false;
  export let canrefresh: boolean = false;
  export let cancreate: boolean = true;
  export let newbuttontext = COMMAND_CREATE;
  export let onRefresh: () => any = () => {};
  export let onCreate: () => any = () => {};
  //
</script>

{#if !busy}
  <Container>
    <Row class="text-center">
      {#if canrefresh}
        <Col class="text-center">
          <Button
            color="primary"
            on:click={() => {
              if (onRefresh !== undefined && onRefresh !== null) {
                onRefresh();
              }
            }}
          >
            {COMMAND_REFRESH}
          </Button>
        </Col>
      {/if}
      {#if cancreate}
        <Col class="text-center">
          <Button
            color="secondary"
            on:click={() => {
              if (onCreate !== undefined && onCreate !== null) {
                onCreate();
              }
            }}
          >
            {newbuttontext}
          </Button>
        </Col>
      {/if}
    </Row>
  </Container>
{/if}
