<script>
    import Card from "../components/Card.svelte";
    import SocialIcons from "../components/SocialIcons.svelte";
</script>

<div
    class="lg:w-1/3 md:w-1/2 flex flex-col w-full md:py-8 mt-8 md:mt-0 rounded-xl bg-gray-800 p-4"
>
    <div class="relative mb-4">
        <label for="name" class="leading-7 text-sm text-gray-600">Name</label>
        <input
            type="text"
            id="name"
            name="name"
            class="w-full bg-gray-700 rounded text-base outline-none text-gray-200 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
    </div>
    <div class="relative mb-4">
        <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            class="w-full bg-gray-700 rounded text-base outline-none text-gray-200 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
    </div>
    <div class="relative mb-4">
        <label for="message" class="leading-7 text-sm text-gray-600"
            >Message</label
        >
        <textarea
            id="message"
            name="message"
            class="w-full bg-gray-700 rounded h-32 text-base outline-none text-gray-200 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
        />
    </div>
    <div>
        <button>Submit</button>
    </div>
    <SocialIcons />s
</div>
