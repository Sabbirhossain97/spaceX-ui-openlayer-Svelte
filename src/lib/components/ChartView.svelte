<script>
    import { Chart, Card } from "flowbite-svelte";
    import { Spinner } from "flowbite-svelte";
    const { loading,chartOptions } = $props();
</script>

<div
    class="border w-full lg:w-1/2 xl:w-full border-[#E5E7EB] flex flex-col justify-center rounded-lg shadow-chart"
>
    <div class="px-4 py-4">
        <p class="text-[16px] font-semibold leading-6">Success Rate Chart</p>
    </div>
    <div class="flex justify-center pb-10">
        {#if loading}
            <div class="py-20">
                <Spinner color="#3f83f8" size={8} />
            </div>
        {:else}
            <Card class="border-none shadow-none">
                <Chart options={chartOptions} />
            </Card>
        {/if}
    </div>
</div>
