<script>
    export let url;
    export let desc;
    export let img;
    export let title;
    export let isImg;
</script>

<div class="grid grid-cols-12 bg-gray-900 p-5 gap-4 rounded-xl lg:w-1/2">
    <div class="col-start-3 py-1 px-2 col-span-8 rounded-full bg-gray-800">
        <a
            class="text-gray-500 block text-xs text-center"
            href={url}
            target="_blank"
            rel="noopener noreferrer">{url}</a
        >
    </div>
    <div class="lg:col-span-4 col-span-12 rounded-xl p-4 bg-gray-800">
        <h4 class="text-base text-gray-200 mb-2">{title}</h4>
        <p class="text-gray-400">
            {desc}
        </p>
    </div>
    <div class="lg:col-span-8 col-span-12 rounded-xl bg-gray-800 p-4">
        <img class="h-full object-cover rounded-lg" src={img} alt={title} />
    </div>
</div>
