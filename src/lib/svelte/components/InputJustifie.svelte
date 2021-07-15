<script lang="ts">
import { VALUE_NO, VALUE_YES } from "../../data/DataConstants";

import { DomainConstants } from "../../data/domain/DomainConstants";
import type { IDataOption } from "../../data/domain/IDataOption";

  //
  import {
    PROMPT_JUSTIFIE,
    OPTION_JUSTIFIE_INCONNU,
    OPTION_JUSTIFIE_YES,
    OPTION_JUSTIFIE_NO,
  } from "../features/InfoPrompt";

  import InputBoolean from "./InputBoolean.svelte";
  //
  export let value: boolean;
  export let label: string = PROMPT_JUSTIFIE;
  export let name: string = DomainConstants.FIELD_JUSTIFIE;
  export let busy: boolean = false;
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  const items: IDataOption[] = [
    { id: "", title: OPTION_JUSTIFIE_INCONNU },
    { id: VALUE_YES, title: OPTION_JUSTIFIE_YES },
    { id: VALUE_NO, title: OPTION_JUSTIFIE_NO },
  ];
  //
</script>

<InputBoolean {busy} {items} {label} {name} {onValueChanged} {value} />
