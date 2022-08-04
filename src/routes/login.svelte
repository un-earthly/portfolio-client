<script lang="ts">
    import PageTransitions from "../components/PageTransitions.svelte";
    const handleLogin = (e: Event) => {
        e.preventDefault();
        const email: string = e.target.email.value;
        const pass: string = e.target.pass.value;
        const credentials = JSON.stringify({ email, pass });
    };
</script>

<PageTransitions>
    <main class="grid place-items-center h-screen">
        <form
            on:submit={(e) => handleLogin(e)}
            class="lg:w-1/3 w-full space-y-6 text-gray-400"
        >
            <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-400/10 focus:bg-gray-400/20 duration-500 p-3 outline-none focus:outline-none block w-full"
                placeholder="email@mail.com"
                required
            />
            <input
                type="password"
                name="pass"
                id="password"
                class="bg-gray-400/10 focus:bg-gray-400/20 duration-500 outline-none focus:outline-none flex items-center justify-center w-full p-3"
                placeholder="password"
                required
            />
            <button
                type="submit"
                class="bg-gray-400/10 hover:bg-gray-400/20 duration-500 flex items-center justify-center w-full p-3"
                >submit</button
            >
        </form>
    </main>
</PageTransitions>
