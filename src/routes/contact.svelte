<script>
    import SocialIcons from "../components/SocialIcons.svelte";
</script>

<svelte:head>
    <title>Contact - Alamin</title>
</svelte:head>
<div class=" text-gray-400 space-y-10 grid lg:grid-cols-2 p-5 lg:w-3/4 mx-auto">
    <form class="space-y-4 md:py-8 mt-8 md:mt-32 p-4">
        <div class="relative">
            <label for="name" class="leading-7 text-sm">Name</label>
            <input
                type="text"
                id="name"
                name="name"
                class="w-full border-b border-gray-400 bg-transparent text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
        </div>
        <div class="relative">
            <label for="email" class="leading-7 text-sm">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                class="w-full border-b border-gray-400 bg-transparent text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
        </div>
        <div class="relative">
            <label for="message" class="leading-7 text-sm">Message</label>
            <textarea
                id="message"
                name="message"
                class="w-full border-b border-gray-400 bg-transparent h-32 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            />
        </div>
        <div>
            <button class="text-gray-400 border-b border-gray-400"
                >Submit</button
            >
        </div>
        <SocialIcons />
    </form>
</div>
