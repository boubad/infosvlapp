<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import { IdUtils } from "../IdUtils";
  import { PROMPT_FICHIER } from "../features/InfoPrompt";
  //
  export let busy: boolean = false;
  export let parentid: string = "";
  export let onFileSelected: (
    name: string,
    mime: string,
    data: Blob,
    parentid?: string
  ) => any = (
    _name: string,
    _mime: string,
    _data: Blob,
    _parentid?: string
  ) => {};
  //
  //
  interface IMyEvent extends EventTarget {
    target: { files: any; result: any };
  }
  const handleChange = (e: any) => {
    const event = e as IMyEvent;
    const files = event.target.files;
    if (files !== undefined && files !== null && files.length > 0) {
      const file = files[0];
      const fr = new FileReader();
      fr.onloadend = (ex: any) => {
        if (onFileSelected !== undefined && onFileSelected !== null) {
          onFileSelected(
            file.name,
            file.type,
            new Blob([new Uint8Array(ex.target.result)]),
            parentid
          );
        }
      };
      fr.readAsArrayBuffer(file);
    } // files
  }; // handleChange
  //
  const id = IdUtils.CreateID("file_");
  //
</script>

<FormGroup>
  <Label class="" for={id}>{PROMPT_FICHIER}</Label>
  <Input
    size="255"
    readonly={!busy}
    type="file"
    name="file"
    disabled={busy}
    {id}
    on:change={handleChange} />
</FormGroup>
