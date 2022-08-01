<script lang="ts">
    export let url: string;
    export let img: string;
    export let title: string;
    export let desc: string;
    export let live: string;
    export let client: string;
    export let server: string;
</script>

<a href={url}>
    <div class="p-6 text-gray-400 lg:w-3/4 mt-24 mx-auto">
        <div class="grid grid-cols-2 gap-10">
            <div>
                <div class="h-96 border-8 border-b-[40px]">
                    <img src={img} alt="" />
                </div>
                <div class="grid grid-cols-3 gap-5 space-x-4 mt-10">
                    <a
                        href={client}
                        target="_blank"
                        class="bg-white hover:bg-gray-600/40 hover:text-white text-gray-800 font-bold duration-500 px-4 py-2 text-center block"
                        rel="noopener noreferrer">Client Side</a
                    >
                    <a
                        href={server}
                        target="_blank"
                        class="bg-white hover:bg-gray-600/40 hover:text-white text-gray-800 font-bold duration-500 px-4 py-2 text-center block"
                        rel="noopener noreferrer">Server Side</a
                    >
                    <a
                        href={live}
                        target="_blank"
                        class="bg-white hover:bg-gray-600/40 hover:text-white text-gray-800 font-bold duration-500 px-4 py-2 text-center block"
                        rel="noopener noreferrer">Live Site</a
                    >
                </div>
            </div>
            <div>
                <p>{title}</p>
                <p>{desc}</p>
            </div>
        </div>
    </div>
</a>
