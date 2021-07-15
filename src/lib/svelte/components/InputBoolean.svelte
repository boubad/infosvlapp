<script lang="ts">
  import { VALUE_NO, VALUE_YES } from "../../data/DataConstants";

  import type { IDataOption } from "../../data/domain/IDataOption";

  //
  import ItemChoice from "./ItemChoice.svelte";
  //
  export let value: boolean;
  export let label: string;
  export let name: string;
  export let busy: boolean = false;
  export let items: IDataOption[];
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval =
    value !== undefined && value != null && value === true
      ? VALUE_YES
      : VALUE_NO;

  //
  const valueChanged = (val: any, name: string) => {
    if (onValueChanged !== undefined && onValueChanged !== null) {
      const sx = val ? ("" + val).trim().toUpperCase() : "";
      const v = sx === VALUE_YES ? true : false;
      onValueChanged(v, name);
    }
  };
  //
</script>

<ItemChoice
  {busy}
  {items}
  {label}
  {name}
  onValueChanged={valueChanged}
  value={sval}
/>
