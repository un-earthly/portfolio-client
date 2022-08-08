<script lang="ts" context="module">
    export async function load({ params }: any) {
        const id: string | number = params.id;

        return {
            props: { id },
        };
    }
</script>

<script>
    export let id;
    console.log(id);
</script>

<main>
    <h1>{id}</h1>
</main>
