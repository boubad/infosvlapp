<script lang="ts">
    export let url: string;
    export let text: string;
    export let height: number = 48;
    //
    $: hasUrl = url !== undefined && url !== null && url.trim().length > 0;
  </script>
  
  {#if hasUrl}
    <img src={url} alt={text} {height} />
  {/if}
  