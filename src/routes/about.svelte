<script lang="ts">
    import Step from "../components/Step.svelte";
</script>

<svelte:head>
    <title>about - md alamin</title>
</svelte:head>

<main class="text-gray-400 relative mt-40 p-4 space-y-32">
    <div>
        <h4
            class="absolute -top-1 left-1/4 animate-bounce hover:animate-none text-xl "
        >
            who am i??
        </h4>
        <blockquote class="text-center text-5xl">
            <span class="text-cyan-400 animate-pulse"> &quot;</span> creative
            passionate Javascript developer.<span
                class="text-cyan-400 animate-pulse"
            >
                &quot;</span
            >
        </blockquote>
    </div>

    <p class="lg:w-1/4 text-right ml-auto mr-10">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
        eligendi quod maiores numquam quas rem corporis. Sunt quibusdam harum
        illo ex modi odio corrupti quam! Repellendus est fugit ipsa ex.
    </p>
    <div class="relative grid grid-cols-3 m-12 gap-8">
        <div>
            <Step
                content="illum architecto quam officia facere fuga aut eum, harum quo odio totam
                    incidunt? Ratione inventore sequi aut officia dicta deleniti suscipit
                    non facilis tenetur perspiciatis, ut, explicabo totam a dolore magni,"
                heading="Hello"
            />
        </div>
        <div>
            <Step
                content="illum architecto quam officia facere fuga aut eum, harum quo odio totam
                        incidunt? Ratione inventore sequi aut officia dicta deleniti suscipit
                        non facilis tenetur perspiciatis, ut, explicabo totam a dolore magni,"
                heading="Hello"
            />
        </div>
        <div>
            <Step
                content="illum architecto quam officia facere fuga aut eum, harum quo odio totam
                        incidunt? Ratione inventore sequi aut officia dicta deleniti suscipit
                        non facilis tenetur perspiciatis, ut, explicabo totam a dolore magni,"
                heading="Hello"
            />
        </div>

        <h4
            class="absolute -bottom-5 right-10 animate-bounce hover:animate-none text-xl "
        >
            my approch??
        </h4>
    </div>
</main>
