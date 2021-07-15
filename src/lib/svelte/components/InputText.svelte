<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import { IdUtils } from "../IdUtils";

  //
  export let value: string = "";
  export let label: string = "";
  export let name: string = "";
  export let busy: boolean = false;
  export let onValueChanged: (val: any, name: string) => any = (
    _value,
    _name
  ) => {};
  //
  const id = IdUtils.CreateID("text_");
  //
  const onChanged = (e: Event) => {
    if (onValueChanged !== undefined && onValueChanged !== null) {
      const sx = (e.target as HTMLInputElement).value;
      const val = sx.trim();
      onValueChanged(val, name);
    }
  };
  //
</script>

<FormGroup>
  <Label for={id} class="font-weight-bold ">{label}</Label>
  <Input
    class="font-weight-bold"
    type="text"
    size="512"
    readonly={busy}
    {name}
    {id}
    disabled={busy}
    on:change={onChanged}
    bind:value />
</FormGroup>
