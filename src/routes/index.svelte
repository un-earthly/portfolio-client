<script>
    import SocialIcons from "../components/SocialIcons.svelte";
</script>

<svelte:head>
    <title>Home - MD Alamin</title>
</svelte:head>
<main>
    <div class="h-screen flex items-end justify-center">
        <img
            src="/profile-pic.png"
            class="h-52 rounded-full absolute top-1/2 left-1/2 bottom-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2"
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
