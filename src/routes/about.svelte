<script lang="ts">
    import Step from "../components/Step.svelte";
    // @ts-ignore
    import PageTransitions from "../components/PageTransitions.svelte";
</script>

<svelte:head>
    <title>about - md alamin</title>
</svelte:head>
<PageTransitions>
    <main class="text-gray-400 relative mt-44 p-4 space-y-32">
        <div>
            <h4
                class="absolute -top-1 left-1/4 animate-bounce hover:animate-none text-xl "
            >
                who am i??
            </h4>
            <blockquote class="text-center text-5xl">
                <span class="text-cyan-400 animate-pulse"> &quot;</span>
                creative passionate Javascript developer.<span
                    class="text-cyan-400 animate-pulse"
                >
                    &quot;</span
                >
            </blockquote>
        </div>

        <div
            class="flex items-center container mx-auto lg:px-10 p-3 justify-between"
        >
            <p class="w-1/3 text-left">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab in
                ipsa iure quaerat unde dolore, nisi dolorum repellat maxime
                facilis.
            </p>
            <p class="w-1/3 text-right">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab in
                ipsa iure quaerat unde dolore, nisi dolorum repellat maxime
                facilis.
            </p>
        </div>

        <div
            class="h-32 w-32 absolute px-8 flex items-center justify-center text-center bg-gray-700/10 left-1/2 -translate-x-1/2 -top-0 rounded-full hover:bg-gray-700/30 py-2 duration-500"
        >
            <a href="/projects"> show me some work </a>
        </div>
        <div class="relative grid lg:grid-cols-3 p-4 lg:m-12 gap-8">
            <div>
                <Step
                    content="illum architecto quam officia facere fuga aut eum, harum quo odio totam
                    incidunt? Ratione inventore sequi aut officia dicta deleniti suscipit
                    non facilis tenetur perspiciatis, ut, explicabo totam a dolore magni,"
                    heading="analysis and simplify the problem"
                />
            </div>
            <div>
                <Step
                    content="illum architecto quam officia facere fuga aut eum, harum quo odio totam
                    incidunt? Ratione inventore sequi aut officia dicta deleniti suscipit
                    non facilis tenetur perspiciatis, ut, explicabo totam a dolore magni,"
                    heading="define the possible required tools and technologies"
                />
            </div>
            <div>
                <Step
                    content="illum architecto quam officia facere fuga aut eum, harum quo odio totam
                    incidunt? Ratione inventore sequi aut officia dicta deleniti suscipit
                    non facilis tenetur perspiciatis, ut, explicabo totam a dolore magni,"
                    heading="code the web and pushlish"
                />
            </div>

            <h4
                class="absolute lg:top-56 -top-4 right-10 animate-bounce hover:animate-none text-xl "
            >
                my approch??
            </h4>
        </div>
    </main>
</PageTransitions>

<style>
    .animate-bounce {
        animation-duration: 1.5s;
    }
</style>
