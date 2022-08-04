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
    class="text-gray-500 font-azoSans font-semibold flex items-center text-[10px] justify-between"
>
    <div
        class="absolute left-8 top-10 cursor-pointer"
        on:click={handleMobileIconClick}
    >
        <i
            class={`bi bi-${
                showMenu ? "list-nested" : "list"
            } text-2xl duration-500`}
        />
    </div>
    <div class="flex flex-col absolute left-14 space-y-3 top-20 duration-500">
        <a
            class={`${path === "/" ? " active" : ""}
            
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            hover:text-gray-400 mr-auto link duration-500 delay-75 uppercase tracking-widest relative`}
            href="/">Home</a
        >
        <a
            class={`${path === "/about" ? " active" : ""}
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            hover:text-gray-400 mr-auto link ml-4 duration-500 delay-150 uppercase tracking-widest relative`}
            href="/about">About</a
        >
        <a
            class={`${path === "/contact" ? " active " : ""}
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            
            hover:text-gray-400 mr-auto link ml-8 duration-500 delay-300 uppercase tracking-widest relative`}
            href="/contact">Contact</a
        >
        <!-- <a
            class={`${path === "/login" ? " active " : ""}
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            
            hover:text-gray-400 mr-auto link ml-16 duration-500 delay-300 uppercase tracking-widest relative`}
            href="/login">Login</a
        > -->
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
        background: rgb(107 114 128);
        bottom: 0;
        left: 0;
        transition: 0.5s;
    }
    .link:hover:after {
        width: 70%;
    }
</style>
