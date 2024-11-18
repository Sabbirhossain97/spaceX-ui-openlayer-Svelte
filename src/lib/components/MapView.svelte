<script>
    import { Spinner } from "flowbite-svelte";
    const { loading } = $props();
</script>

<div
    class="min-h-[300px] z-20 border w-full lg:w-1/2 xl:w-full border-[#E5E7EB] rounded-[12px] shadow-map relative"
>
    <div class="px-4 py-4 md:py-6">
        <p class="text-[16px] font-semibold leading-6">Map View</p>
    </div>
    {#if loading}
        <div
            class="absolute left-[43%] top-1/2 flex justify-center items-center bg-white"
        >
            <Spinner color="#3f83f8" size={8} />
        </div>
    {/if}
    <div
        id="map"
        class={`${loading ? "opacity-50" : ""} overflow-hidden h-[300px] rounded-b-[12px]`}
    ></div>
</div>
