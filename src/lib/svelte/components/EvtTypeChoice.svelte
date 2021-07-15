<script lang="ts">
  import { DomainConstants } from "../../data/domain/DomainConstants";

  import {
    EvtType,
    EvtType2String,
    GetEvtTypeOptions,
    String2EvtType,
  } from "../../data/domain/EvtType";
  import type { IDataOption } from "../../data/domain/IDataOption";

  import { PROMPT_EVTTYPE } from "../features/InfoPrompt";

  import ItemChoice from "./ItemChoice.svelte";

  //
  export let value: EvtType = EvtType.Inconnu;
  export let label: string = PROMPT_EVTTYPE;
  export let name: string = DomainConstants.FIELD_EVTTYPE;
  export let busy: boolean = false;
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval = EvtType2String(value);
  //
  const items: IDataOption[] = GetEvtTypeOptions();
  //
  const valueChanged = (val: any, name: string) => {
    if (onValueChanged !== undefined && onValueChanged !== null) {
      const sx = val ? ("" + val).trim() : "";
      const v = String2EvtType(sx);
      onValueChanged(v, name);
    }
  };
</script>

<ItemChoice
  {busy}
  {items}
  {label}
  {name}
  onValueChanged={valueChanged}
  value={sval}
/>
