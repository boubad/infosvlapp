<script lang="ts">
  //
  import { Button, Col, Container, Row } from "sveltestrap";
  import {
    COMMAND_CANCEL,
    COMMAND_SAVE,
    DELETEITEM_BUTTON_TEXT,
    DELETEITEM_TEXT,
    DELETEITEM_TITLE,
  } from "../features/InfoPrompt";
  import DeleteItem from "./DeleteItem.svelte";
  //
  export let busy: boolean = false;
  export let canremove: boolean;
  export let cansave: boolean;
  export let cancancel: boolean;
  export let deleteButtonText: string = DELETEITEM_BUTTON_TEXT;
  export let deleteDialogTitle: string = DELETEITEM_TITLE;
  export let deleteDialogText: string = DELETEITEM_TEXT;
  export let onCancel: () => any;
  export let onSave: () => any;
  export let onRemove: () => any;
  //
</script>

{#if !busy}
  <Container>
    <Row>
      {#if cancancel !== undefined && cancancel !== null && cancancel === true && onCancel !== undefined && onCancel !== null}
        <Col>
          <Button
            color="secondary"
            on:click={onCancel}>
            {COMMAND_CANCEL}
          </Button>
        </Col>
      {/if}
      {#if cansave !== undefined && cansave !== null && cansave === true && onSave !== undefined && onSave !== null}
        <Col>
          <Button
            color="success"
            on:click={onSave}>
            {COMMAND_SAVE}
          </Button>
        </Col>
      {/if}
      {#if canremove !== undefined && canremove !== null && canremove === true && onRemove !== undefined && onRemove !== null}
        <Col>
          <DeleteItem
            {busy}
            buttonText={deleteButtonText}
            onDeleteItem= {onRemove}
            dialogTitle={deleteDialogTitle}
            dialogText={deleteDialogText} />
        </Col>
      {/if}
    </Row>
  </Container>
{/if}
