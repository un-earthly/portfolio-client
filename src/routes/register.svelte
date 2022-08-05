<script>
    import PageTransitions from "../components/PageTransitions.svelte";
    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const pass = e.target.pass.value;
        const name = e.target.name.value;
        const credentials = JSON.stringify({ email, pass, name });
        console.log(credentials);
    };
</script>

<PageTransitions>
    <main class="grid place-items-center h-screen p-4">
        <form
            on:submit={(e) => handleLogin(e)}
            class="lg:w-1/3 w-full relative space-y-6 text-gray-400"
        >
            <h3 class="text-3xl text-center">Please Register</h3>
            <input
                type="text"
                name="name"
                id="name"
                class="bg-gray-400/10 focus:bg-gray-400/20 duration-500 p-3 outline-none focus:outline-none block w-full"
                placeholder="user name"
                required
            />
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
            <a class="absolute" href="/login">Login.</a>
            <a href="/" class="absolute right-0">fly home.</a>
        </form>
    </main>
</PageTransitions>
