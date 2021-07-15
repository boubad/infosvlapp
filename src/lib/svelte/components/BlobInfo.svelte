<script lang="ts">
  //
  import { Col, Container, Row, Table } from "sveltestrap";
  import DeleteItem from "./DeleteItem.svelte";
  import InputFile from "./InputFile.svelte";
  import {
    PROMPT_NAME,
    PROMPT_ACTION,
    PROMPT_MIMETYPE,
    COMMAND_REMOVE,
    TITLE_BLOBS_DELETE,
    TEXT_BLOBS_DELETE,
  } from "../features/InfoPrompt";
  import type { IAttachedDoc } from "../../data/domain/IAttachedDoc";
  //
  //
  export let busy: boolean = false;
  export let parentid: string = "";
  export let blobs: IAttachedDoc[] = [];
  //
  export let onSave: (
    name: string,
    mime: string,
    data: Blob,
    parentid?: string
  ) => any;
  export let onRemove: (name: string, parentid?: string) => any;
  //
</script>

<Container>
  <Row>
    <Col>
      <InputFile onFileSelected={onSave} {busy} {parentid} />
    </Col>
  </Row>
  {#if blobs !== undefined && blobs !== null && blobs.length > 0}
    <Row>
      <Col>
        <Table bordered={true}  striped={true}>
          <thead>
            <tr>
              <th>{PROMPT_NAME}</th>
              <th>{PROMPT_MIMETYPE}</th>
              <th>{PROMPT_ACTION}</th>
            </tr>
          </thead>
          <tbody>
            {#each blobs as bx }
             {#if bx !== undefined && bx !== null}
              <tr>
                <th>
                  {#if bx.url && bx.url.length > 0}
                    <a
                      href={bx.url}
                      target={"_blank"}
                      rel={"noopener norefrerrer"}
                    >
                      {bx.name}
                    </a>
                  {:else}{bx.name}{/if}
                </th>
                <td>{bx.content_type}</td>
                <td>
                  <DeleteItem
                    {busy}
                    buttonText={COMMAND_REMOVE}
                    dialogTitle={TITLE_BLOBS_DELETE}
                    dialogText={TEXT_BLOBS_DELETE}
                    onDeleteItem={() => {
                      if (onRemove !== undefined && onRemove !== null) {
                        onRemove(bx.name, parentid);
                      }
                    }}
                  />
                </td>
              </tr>
              {/if}
            {/each}
          </tbody>
        </Table>
      </Col>
    </Row>
  {/if}
</Container>
