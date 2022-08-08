<script lang="ts">
    export let src: string;
    export let id: string;
</script>

<main class="h-screen p-32 w-screen rounded-xl space-y-3 overflow-x-hidden">
    <!-- <div class="overflow-auto h-full w-full"> -->
    <div
        style={`background-image: url(${src});`}
        class="h-full relative hover:bg-black/10 hover:scale-105 duration-500 bg-blend-multiply bg-no-repeat bg-cover w-full rounded-xl"
    >
        <a href={`/project/${id}`}>
            <button
                data-floating-link
                class="absolute bottom-5 right-5 rounded-full font-semibold text-white w-32  duration-500 py-1 text-xs hover:bg-white hover:text-black bg-black "
            >
                <i
                    class="bi bi-arrow-up-right-circle-fill opacity-0 absolute right-1 duration-500"
                />
                explore
            </button>
        </a>
    </div>
    <!-- </div> -->
    <!-- <h1
        class="text-xl col-span-2 text-center my-10 text-gray-400/90 font-semibold tracking-widest"
    >
        {title}
    </h1>
    <div><img {src} alt="img" /></div>
    <div class="space-y-4">
        <p>
            {shortDesc}
        </p>
        <p>
            {motivation}
        </p>
        <p>
            {tech}
        </p>
        <div class="space-x-4">
            <a
                class="hover:text-gray-400/60 duration-200"
                href={live}
                target="_blank"
                rel="noopener noreferrer">Live</a
            >
            <a
                class="hover:text-gray-400/60 duration-200"
                href={client}
                target="_blank"
                rel="noopener noreferrer">Client</a
            >
            {#if server}<a
                    class="hover:text-gray-400/60 duration-200"
                    href={server}
                    target="_blank"
                    rel="noopener noreferrer">server</a
                >
            {/if}
        </div>
    </div> -->
</main>
