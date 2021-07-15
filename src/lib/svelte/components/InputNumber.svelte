<script lang="ts">
  import InputText from "./InputText.svelte";

  export let value: number | null;
  export let label: string;
  export let name: string;
  export let busy: boolean = false;
  export let onValueChanged: (val: any, name: string) => any = (
    _val: any,
    _name: string
  ) => {};
  //
  $: sval =
    value !== undefined && value !== null ? "" + value : "";
  //
  const valueChanged = (val: any, name: string) => {
    if (onValueChanged !== undefined && onValueChanged !== null) {
      let done = false;
      const sx = val ? ("" + val).trim() : "";
      if (sx.length > 0) {
        const v = parseFloat(sx);
        if (v !== null && !isNaN(v)) {
          onValueChanged(v, name);
          done = true;
        }
      }
      if (!done){
        onValueChanged(null, name);
      }
    }
  };
</script>

<InputText {busy} {label} value={sval} onValueChanged={valueChanged} {name} />
