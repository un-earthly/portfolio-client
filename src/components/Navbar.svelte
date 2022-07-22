<script>
    let showMenu = true;
    const handleMobileIconClick = () => (showMenu = !showMenu);
</script>

<nav
    class="lg:fixed text-cyan-400 lg:top-1/2 lg:-translate-y-1/2 lg:right-3 font-azoSans font-semibold flex items-center justify-between p-5"
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
        } flex-col lg:flex-row lg:space-y-4 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 duration-500`}
    >
        <a href="/">Home</a>
        <a href="/about">About</a>
    </div>
</nav>

<style>
    @media only screen and (min-width: 1024px) {
        nav {
            writing-mode: vertical-lr;
        }
    }
</style>
