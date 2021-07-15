<script lang="ts">
  import {
    ControleType,
    ControleType2String,
    GetControleTypeOptions,
    String2ControleType,
  } from "../../data/domain/ControleType";
  import { DomainConstants } from "../../data/domain/DomainConstants";
  import type { IDataOption } from "../../data/domain/IDataOption";
  import ItemChoice from "./ItemChoice.svelte";

  import { PROMPT_CONTROLETYPE } from "../features/InfoPrompt";

  //
  export let value: ControleType = ControleType.Unknown;
  export let label: string = PROMPT_CONTROLETYPE;
  export let name: string = DomainConstants.FIELD_CONTROLETYPE;
  export let busy: boolean = false;
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval = ControleType2String(value);
  //
  const items: IDataOption[] = GetControleTypeOptions();
  //
  const valueChanged = (val: any, name: string) => {
    if (onValueChanged !== undefined && onValueChanged !== null) {
      const sx = val ? ("" + val).trim() : "";
      const v = String2ControleType(sx);
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
