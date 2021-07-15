<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import { IdUtils } from "../IdUtils";

  //
  export let value: string = new Date().toISOString().slice(0, 10);
  export let label: string = "";
  export let name: string = "";
  export let min: string = "1980-01-01";
  export let max: string = "2030-12-31";
  export let busy: boolean = false;
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  const id = IdUtils.CreateID("date_");
  //
  const onChanged = (e: Event) => {
    const sx = (e.target as HTMLInputElement).value;
    const val = sx.trim();
    if (onValueChanged !== undefined && onValueChanged !== null) {
      onValueChanged(val, name);
    }
  };
  //
</script>

<FormGroup>
  <Label for={id} class="font-weight-bold ">{label}</Label>
  <Input
    class="font-weight-bold"
    type="date"
    size="31"
    readonly={busy}
    {name}
    {id}
    {min}
    {max}
    disabled={busy}
    on:change={onChanged}
    bind:value />
</FormGroup>
