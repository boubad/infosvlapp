<script lang="ts">
  //
  import { FormGroup, Input, Label } from "sveltestrap";
  import type { IDataOption } from "../../data/domain/IDataOption";
  import { IdUtils } from "../IdUtils";
  //
  export let value: string = "";
  export let label: string = "";
  export let name: string = "";
  export let busy: boolean = false;
  export let items: IDataOption[] = [];
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  const id = IdUtils.CreateID("choice_");
  //
  const onChanged = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    if (onValueChanged !== undefined && onValueChanged !== null) {
      onValueChanged(val, name);
    }
  };
  //
</script>

<FormGroup>
  <Label for={id} class="font-weight-bold">{label}</Label>
  <Input
    class="font-weight-bold"
    type="select"
    size="1"
    readonly={busy}
    {name}
    {id}
    disabled={busy}
    on:change={onChanged}
    bind:value
  >
    {#each items as item}
      <option value={item.value}>{item.name}</option>
    {/each}
  </Input>
</FormGroup>
