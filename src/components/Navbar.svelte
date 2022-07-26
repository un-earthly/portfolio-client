<script>
    let showMenu = true;
    const handleMobileIconClick = () => (showMenu = !showMenu);
</script>

<nav
    class="text-gray-500 font-azoSans font-semibold flex items-center justify-between p-5"
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
        <a class="link uppercase text-xs tracking-widest relative" href="/"
            >Home</a
        >
        <a class="link uppercase text-xs tracking-widest relative" href="/about"
            >About</a
        >
        <a
            class="link uppercase text-xs tracking-widest relative"
            href="/contact">Contact</a
        >
    </div>
</nav>

<style>
    .link::after {
        content: "";
        position: absolute;
        height: 2px;
        width: 0%;
        background: rgb(107 114 128);
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
        transition: 0.5s;
    }
    .link:hover:after {
        width: 70%;
    }
</style>
