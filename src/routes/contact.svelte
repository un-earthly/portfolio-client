<script>
    import SocialIcons from "../components/SocialIcons.svelte";
    // @ts-ignore
    import PageTransitions from "../components/PageTransitions.svelte";
</script>

<svelte:head>
    <title>contact - alamin</title>
</svelte:head>
<PageTransitions>
    <main class="text-gray-400 p-10 grid place-items-center h-screen">
        <div
            class="w-1/2 border-t border rounded-xl border-gray-400/50 relative h-4/5"
        >
            <div class="middle">
                <div class="relative">
                    <div class="incoming">
                        <div class="bubble">
                            Hey, Father's Day is coming up..
                        </div>
                        <div class="bubble">
                            What are you getting.. Oh, oops sorry dude.
                        </div>
                    </div>
                    <div class="outgoing">
                        <div class="bubble lower">Nah, it's cool.</div>
                        <div class="bubble">
                            Well you should get your Dad a cologne. Here smell
                            it. Oh wait! ...
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="absolute x-50 p-2 bottom-0 bg-gray-500/50 rounded-b-xl w-full"
            >
                <div class="flex">
                    <input
                        type="text"
                        class="bg-transparent flex-grow p-3 focus:outline-none"
                        placeholder="Type a message..."
                    />
                    <button type="submit" class="px-5"
                        ><i class="bi bi-send" /></button
                    >
                </div>
            </div>
        </div>
    </main>
</PageTransitions>

<style>
    .incoming {
        position: absolute;
        width: 50%;
        height: 100%;
        padding: 20px;
    }

    .bubble {
        position: relative;
        display: inline-block;
        margin-bottom: 5px;
        color: var(--white);
        font-size: 0.7em;
        padding: 10px 10px 10px 12px;
        border-radius: 20px;
    }

    .lower {
        margin-top: 45px;
    }

    .outgoing {
        position: absolute;
        padding: 20px;
        right: 0;
        top: 15%;
        width: 50%;
        height: 100%;
    }
    .outgoing .bubble {
        background: var(--primary);
        float: right;
    }
</style>
