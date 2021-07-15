<script lang="ts">
  //
  import InputBoolean from "./InputBoolean.svelte";
  import {
    OPTION_HASNOTES_INCONNU,
    OPTION_HASNOTES_YES,
    OPTION_HASNOTES_NO,
    PROMPT_HASNOTES,
  } from "../features/InfoPrompt";
import { DomainConstants } from "../../data/domain/DomainConstants";
import type { IDataOption } from "../../data/domain/IDataOption";
import { VALUE_NO, VALUE_YES } from "../../data/DataConstants";
  //
  export let value: boolean = false;
  export let label: string = PROMPT_HASNOTES;
  export let name: string = DomainConstants.FIELD_HASNOTES;
  export let busy: boolean = false;
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  const items: IDataOption[] = [
    { id: "", title: OPTION_HASNOTES_INCONNU },
    { id: VALUE_YES, title: OPTION_HASNOTES_YES },
    { id: VALUE_NO, title: OPTION_HASNOTES_NO },
  ];
  //
</script>

<InputBoolean {busy} {items} {label} {name} {onValueChanged} {value} />
