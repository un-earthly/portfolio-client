<script lang="ts">
    export let heading: string | number;
    export let content: string | number;
</script>

<div class="container w-full">
    <div
        class="bg-gray-700/10  p-10 rounded-lg hover:bg-gray-700/30 duration-500"
    >
        <p>{heading}</p>
        <p>{content}</p>
    </div>
</div>
