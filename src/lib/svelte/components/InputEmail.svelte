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
    _val: any,
    _name: string
  ) => {};
  //
  const id = IdUtils.CreateID("email_");
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
    type="email"
    size="255"
    readonly={busy}
    disabled={busy}
    {name}
    {id}
    on:change={onChanged}
    bind:value />
</FormGroup>
