<script lang="ts">
    import { page } from "$app/stores";
    let path: string;

    function getPath(currentPath: string) {
        path = currentPath;
    }

    $: getPath($page.url.pathname);
    let showMenu: boolean = false;
    const handleMobileIconClick = () => (showMenu = !showMenu);
</script>

<nav
    class="text-gray-500 font-azoSans font-semibold flex items-center justify-between"
>
    <div
        class="absolute left-10 top-10 cursor-pointer"
        on:click={handleMobileIconClick}
    >
        <i
            class={`bi bi-${
                showMenu ? "list-nested" : "list"
            } text-2xl duration-500`}
        />
    </div>
    <div
        class="flex flex-col absolute left-5 space-y-6 top-20 text-center duration-500"
    >
        <a
            class={`${path === "/" ? "text-gray-300 active" : ""}
            
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            hover:text-gray-100 link duration-500 delay-75 uppercase text-xs tracking-widest relative`}
            href="/">Home</a
        >
        <a
            class={`${path === "/about" ? "text-gray-300 active" : ""}
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            hover:text-gray-100 link duration-500 delay-150 uppercase text-xs tracking-widest relative`}
            href="/about">About</a
        >
        <a
            class={`${path === "/contact" ? "text-gray-300 active" : ""}
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            
            hover:text-gray-100 link duration-500 delay-300 uppercase text-xs tracking-widest relative`}
            href="/contact">Contact</a
        >
    </div>
</nav>

<style>
    .active.link::after {
        width: 70%;
    }
    .link::after {
        content: "";
        position: absolute;
        height: 2px;
        width: 0%;
        background: rgb(198, 198, 198);
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
        transition: 0.5s;
    }
    .link:hover:after {
        width: 70%;
    }
</style>
