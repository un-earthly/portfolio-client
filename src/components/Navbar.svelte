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
                showMenu ? "" : "list"
            } fixed top-10 text-2xl duration-500`}
        />
    </div>
    <div
        class={`
        flex flex-col fixed space-y-3 duration-500 bg-black/70 w-96 h-screen top-0 p-10
        ${showMenu ? "left-0" : "-left-96"}
        `}
    >
        <button
            on:click={handleMobileIconClick}
            class={`
            ${showMenu ? "opacity-100" : "opacity-0"}
            ${showMenu ? "-left-96" : "left-0"} delay-700`}
            ><i
                class={`
            ${showMenu ? "opacity-100" : "opacity-0"}            
            text-3xl bi bi-x absolute right-3 top-3`}
            /></button
        >
        <a
            class={`${path === "/" ? " active text-gray-400" : ""}
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            hover:text-gray-400 link w-max duration-500 delay-150 uppercase tracking-widest relative`}
            href="/">Home</a
        >
        <a
            class={`${path === "/about" ? " active text-gray-400" : ""}
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            hover:text-gray-400 link w-max duration-500 delay-200 uppercase tracking-widest relative`}
            href="/about">About</a
        >
        <a
            class={`${
                path === "/contact" ? " active text-gray-400" : ""
            }            
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}

            hover:text-gray-400 link w-max duration-500 delay-300 uppercase tracking-widest relative`}
            href="/contact">Contact</a
        >
        <a
            class={`${path === "/login" ? " active " : ""}
            ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
            
            hover:text-gray-400 link w-max duration-500 delay-500 uppercase tracking-widest relative`}
            href="/login">Login</a
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
        background: rgb(107 114 128);
        bottom: 0;
        left: 0;
        transition: 0.5s;
    }
    .link:hover:after {
        width: 70%;
    }
</style>
