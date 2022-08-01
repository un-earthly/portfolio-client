<script lang="ts">
    import { page } from "$app/stores";
    let path: string;

    function getPath(currentPath: string) {
        path = currentPath;
    }

    $: getPath($page.url.pathname);
    let showMenu: boolean = true;
    const handleMobileIconClick = () => (showMenu = !showMenu);
</script>

<nav
    class="text-gray-500 font-azoSans font-semibold flex items-center justify-between"
>
    <div class="lg:hidden font-breathing">MA</div>
    <div class="lg:hidden" on:click={handleMobileIconClick}>
        <i
            class={`bi bi-${
                showMenu ? "list-nested" : "list"
            } text-2xl duration-500`}
        />
    </div>
    <div
        class={`${
            showMenu ? "flex" : "hidden"
        } flex-col lg:flex-row lg:space-x-4 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 lg:top-32 duration-500`}
    >
        <a
            class={`${
                path === "/" ? "text-gray-300 active" : ""
            } hover:text-gray-100 link duration-500 uppercase text-xs tracking-widest relative`}
            href="/">Home</a
        >
        <a
            class={`${
                path === "/about" ? "text-gray-300 active" : ""
            } hover:text-gray-100 link duration-500 uppercase text-xs tracking-widest relative`}
            href="/about">About</a
        >
        <a
            class={`${
                path === "/contact" ? "text-gray-300 active" : ""
            } hover:text-gray-100 link duration-500 uppercase text-xs tracking-widest relative`}
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
