<script>
    import SocialIcons from "../components/SocialIcons.svelte";
</script>

<svelte:head>
    <title>home - md alamin</title>
</svelte:head>
<main
    class="bg-gradient-to-b from-black to-black bg-center bg-cover duration-1000"
>
    <div
        class="h-screen flex items-end justify-center bg-black/90 bg-blend-soft-light bg-[url('/indarkbg.jpg')] bg-center bg-contain bg-no-repeat"
    >
        <img
            src="/indarkbg.jpg"
            class="h-52 absolute top-1/2 left-1/2 hidden bottom-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2"
            alt=""
        />
        <div class="text-center space-y-5 mb-32">
            <h5 class="lg:text-xl font-wo1 text-gray-400 tracking-widest">
                ALAMIN
            </h5>
            <!-- <p class="uppercase text-gray-100">
                MERN STACK | Javascript DEVELOPER
            </p> -->
            <SocialIcons />
        </div>
    </div>
</main>
