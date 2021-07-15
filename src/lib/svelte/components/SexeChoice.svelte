<script lang="ts">
import { VALUE_FEMININ, VALUE_MASCULIN } from "../../data/DataConstants";

import { DomainConstants } from "../../data/domain/DomainConstants";
import type { IDataOption } from "../../data/domain/IDataOption";

  //
  import {
    PROMPT_SEXE,
    OPTION_SEXE_INCONNU,
    OPTION_SEXE_MASCULIN,
    OPTION_SEXE_FEMININ,
  } from "../features/InfoPrompt";

  import ItemChoice from "./ItemChoice.svelte";
  //
  export let value: string = "";
  export let label: string = PROMPT_SEXE;
  export let name: string = DomainConstants.FIELD_SEXE;
  export let busy: boolean = false;
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  const items: IDataOption[] = [
    { value: "", name: OPTION_SEXE_INCONNU },
    { value: VALUE_MASCULIN, name: OPTION_SEXE_MASCULIN },
    { value: VALUE_FEMININ, name: OPTION_SEXE_FEMININ },
  ];
</script>

<ItemChoice {busy} {items} {label} {name} {onValueChanged} {value} />
