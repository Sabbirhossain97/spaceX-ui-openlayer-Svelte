<script>
    import LinkIcon from "$lib/icons/LinkIcon.svelte";
    import { Button } from "flowbite-svelte";
    let {
        filteredLandpads,
        getLandpadDetails,
        calculateSuccessRate,
    } = $props();
</script>

<section>
    <div class="flex items-center">
        <div
            class="grid w-full gap-8 my-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
        >
            {#each filteredLandpads as landpad}
                <div class="w-full text-start">
                    <div
                        class="px-4 flex flex-col w-full mx-auto h-72 rounded-lg border border-gray-200"
                    >
                        <div class="pt-4 space-y-2">
                            <div class="flex justify-between">
                                <h5 class="text-xl font-bold">
                                    {landpad.full_name}
                                </h5>
                            </div>
                            <p class="mt-1 font-medium">
                                <span class="font-semibold">Location:</span>
                                <span class="text-gray-500"
                                    >{landpad.location.name}</span
                                >
                            </p>
                            <p class="mt-1 font-medium">
                                <span class="font-semibold">Region:</span>
                                <span class="text-gray-500"
                                    >{landpad.location.region}</span
                                >
                            </p>
                            <div class="flex items-center">
                                <p class="font-semibold text-nowrap">
                                    Success Rate:
                                </p>
                                {#if landpad.attempted_landings === 0}
                                    <p class="ml-2 text-gray-500">N/A</p>
                                {:else}
                                    <p class="ml-2 text-gray-500">
                                        {calculateSuccessRate(landpad) + "%"}
                                    </p>
                                {/if}
                            </div>
                            <p class="mt-1 font-medium">
                                <span class="font-semibold">Status:</span>
                                {#if landpad.status === "active"}
                                    <span
                                        class="capitalize text-[12px] bg-green-100 text-green-800 px-[16px] py-[6px] rounded-md"
                                    >
                                        {landpad.status}
                                    </span>
                                {/if}
                                {#if landpad.status === "retired"}
                                    <span
                                        class="capitalize text-[12px] bg-red-100 text-red-800 px-[16px] py-[6px] rounded-md"
                                    >
                                        {landpad.status}
                                    </span>
                                {/if}
                                {#if landpad.status === "under construction"}
                                    <span
                                        class="capitalize text-[12px] bg-[#E1EFFE] text-[#1E429F] px-[16px] py-[6px] rounded-md"
                                    >
                                        {landpad.status}
                                    </span>
                                {/if}
                            </p>
                            <p>
                                <span class="font-semibold flex gap-2"
                                    ><span>Wikipedia Link</span>
                                    <a href={landpad.wikipedia} target="_blank"
                                        ><LinkIcon /></a
                                    ></span
                                >
                            </p>
                        </div>
                        <div class="flex justify-center items-center h-full">
                            <Button
                                onclick={() => {
                                    getLandpadDetails(landpad);
                                }}
                                size="sm"
                                class="bg-gray-100 text-nowrap transition duration-300 hover:bg-gray-200 w-full"
                            >
                                <span
                                    class="hover:text-gray-900 text-gray-900 text-[16px] font-medium leading-[18px] px-4 -py-4"
                                    >View Details</span
                                >
                            </Button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
