<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";
  import Loader from "../components/Loading.svelte";
  let loading: Boolean = true;
  onMount(() => (loading = false));
</script>

{#if loading}
  <Loader />
{/if}
<Navbar />
<slot />
