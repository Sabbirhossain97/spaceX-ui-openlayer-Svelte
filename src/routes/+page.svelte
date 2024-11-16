<script>
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import { Button, Dropdown, Radio } from "flowbite-svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import "ol/ol.css";
    import { TextPlaceholder } from "flowbite-svelte";
    import { Progressbar } from "flowbite-svelte";
    import { Modal } from "flowbite-svelte";
    import { Chart, Card } from "flowbite-svelte";
    import { options } from "$lib/components/Chartoptions.js";
    import {
        LinkIcon,
        FilterIcon,
        ListIcon,
        GridIcon,
    } from "$lib/icons/index.js";
    import { initializeMap } from "$lib/components/Map.js";

    let map;
    let defaultModal = false;
    let landpads = [];
    let landpadSuccessRates = [];
    let uniqueStatuses = [];
    let landpadDetails = { name: "", details: "" };
    let landpadLabels = [];
    let statusFilter = null;
    let view = "list";
    let loading = true;
    let error = null;
    let chartOptions = { ...options };

    onMount(async () => {
        try {
            const response = await fetch(
                "https://api.spacexdata.com/v3/landpads",
            );
            if (!response.ok) throw new Error("Failed to fetch data");
            landpads = await response.json();
            landpadSuccessRates = landpads.map((item) => {
                if (item.attempted_landings === 0) {
                    return 0;
                } else if (item.successful_landings === 0) {
                    return 0;
                } else {
                    return Math.round(
                        (item.successful_landings / item.attempted_landings) *
                            100,
                    );
                }
            });

            landpadLabels = landpads.map((item) => item.full_name);

            chartOptions = {
                ...chartOptions,
                series: landpadSuccessRates,
                labels: landpadLabels,
            };

            uniqueStatuses = [...new Set(landpads.map((zone) => zone.status))];

            const activeLandpads = landpads.filter(
                (zone) => zone.status === "active",
            );

            map = initializeMap("map", activeLandpads);
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });

    function handleView(e) {
        view = e.currentTarget.name;
        return view;
    }

    function calculateSuccessRate(landpad) {
        const { successful_landings, attempted_landings } = landpad;
        if (!attempted_landings || attempted_landings === 0) {
            return "N/A";
        }
        return (
            Math.round((successful_landings / attempted_landings) * 100) + "%"
        );
    }

    function successRateProgress(landpad) {
        const { successful_landings, attempted_landings } = landpad;
        if (!attempted_landings || attempted_landings === 0) {
            return "N/A";
        }
        return Math.round((successful_landings / attempted_landings) * 100);
    }

    function handleModal() {
        defaultModal = true;
        return defaultModal;
    }
    function getDetails(landpad) {
        landpadDetails.name = landpad.full_name;
        landpadDetails.details = landpad.details;
        return landpadDetails;
    }

    function handleStatusChange(status) {
        statusFilter = status;
    }

    function filterByStatus() {
        return statusFilter
            ? landpads.filter((landpad) => landpad.status === statusFilter)
            : landpads;
    }
</script>

<div
    class="h-10 px-0 py-10 border rounded-[2px] bg-[#fff] flex justify-center items-center shadow-header"
>
    <img src="/logo.png" alt="logo" />
</div>
<div
    class="px-[50px] flex flex-row justify-center items-start gap-10 pb-[230px]"
>
    <div class="mt-[50px] flex flex-col w-3/4">
        <div class="flex justify-between">
            <div class="flex">
                <button
                    on:click={(e) => handleView(e)}
                    aria-label="list"
                    name="list"
                    class={`${view === "list" ? "bg-[#EBEDF0] text-[#1C64F2]" : "bg-white"} hover:bg-[#EBEDF0] hover:text-[#1C64F2] items-center border-t border-b border-l rounded-l-[6px] border-[#E5E7EB] p-3`}
                >
                    <ListIcon />
                </button>
                <button
                    on:click={(e) => handleView(e)}
                    aria-label="grid"
                    name="grid"
                    class={`${view === "grid" ? "bg-[#EBEDF0] text-[#1C64F2]" : "bg-white"} hover:bg-[#EBEDF0] hover:text-[#1C64F2] items-center border-t border-b border-r rounded-r-[6px] border-[#E5E7EB] p-3`}
                >
                    <GridIcon />
                </button>
            </div>
            <div>
                <Button
                    class="bg-[#F8F8F8] border border-gray-200 rounded-lg text-gray-800 focus:ring-4 focus:ring-gray-100"
                >
                    <FilterIcon />
                    <span class="ml-2">Filter By Status</span>
                    <ChevronDownOutline
                        class="w-6 h-6 ms-2 text-gray-800"
                    /></Button
                >
                <Dropdown class="w-48 p-3 space-y-1">
                    {#each uniqueStatuses as status}
                        <li
                            class="rounded p-2 capitalize text-nowrap hover:bg-gray-100"
                        >
                            <Radio
                                name="group2"
                                bind:group={statusFilter}
                                on:click={() => {
                                    handleStatusChange(status);
                                }}>{status}</Radio
                            >
                        </li>
                    {/each}
                </Dropdown>
            </div>
        </div>
        <Modal
            title={`Details - ${landpadDetails.name}`}
            bind:open={defaultModal}
            autoclose
            classHeader="text-[18px] font-semibold not-italic leading-[27px] text-gray-900"
        >
            <div class="pb-[130px]">
                <p
                    class="text-wrap text-[16px] not-italic font-normal leading-[24px] text-gray-500"
                >
                    {landpadDetails.details}
                </p>
            </div>
        </Modal>
        {#if view === "list"}
            <Table class="border rounded-[10px] bg-[#fff] mt-[18px]">
                <TableHead
                    class="bg-gray-50 border-b text-[12px] font-semibold leading-[18px] uppercase text-gray-500 inter"
                >
                    <TableHeadCell>Full name</TableHeadCell>
                    <TableHeadCell>Location Name</TableHeadCell>
                    <TableHeadCell>Region</TableHeadCell>
                    <TableHeadCell>Details</TableHeadCell>
                    <TableHeadCell>Success Rate</TableHeadCell>
                    <TableHeadCell>Wikipedia link</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                    {#each landpads as landpad}
                        <TableBodyRow>
                            <TableBodyCell>
                                {#if loading}
                                    <TextPlaceholder />
                                {:else}
                                    {landpad.full_name}
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell
                                >{landpad.location.name}</TableBodyCell
                            >
                            <TableBodyCell
                                >{landpad.location.region}</TableBodyCell
                            >
                            <TableBodyCell>
                                <Button
                                    on:click={() => {
                                        handleModal();
                                        getDetails(landpad);
                                    }}
                                    class="bg-gray-100 transition duration-300 hover:bg-gray-200 "
                                >
                                    <span
                                        class="hover:text-gray-900 text-gray-900 text-[12px] font-medium leading-[18px] -px-4 -py-4"
                                        >View Details</span
                                    >
                                </Button>
                            </TableBodyCell>
                            <TableBodyCell>
                                <div>
                                    {#if successRateProgress(landpad) !== "N/A"}
                                        <Progressbar
                                            progress={successRateProgress(
                                                landpad,
                                            )}
                                            size="h-1.5"
                                            progressClass="bg-green-400"
                                        />
                                    {/if}
                                </div>
                                <span>
                                    {calculateSuccessRate(landpad)}
                                </span>
                            </TableBodyCell>
                            <TableBodyCell>
                                {#if landpad.wikipedia}
                                    <a
                                        href={landpad.wikipedia}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="link"
                                    >
                                        <LinkIcon />
                                    </a>
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell class="text-start">
                                {#if landpad.status === "active"}
                                    <span
                                        class="capitalize bg-green-100 text-green-800 px-[16px] py-[6px] rounded-md"
                                    >
                                        {landpad.status}
                                    </span>
                                {/if}
                                {#if landpad.status === "retired"}
                                    <span
                                        class="capitalize bg-red-100 text-red-800 px-[16px] py-[6px] rounded-md"
                                    >
                                        {landpad.status}
                                    </span>
                                {/if}
                                {#if landpad.status === "under construction"}
                                    <span
                                        class="capitalize bg-[#E1EFFE] text-[#1E429F] px-[16px] py-[6px] rounded-md"
                                    >
                                        {landpad.status}
                                    </span>
                                {/if}
                            </TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        {:else}
            <section>
                <div class="flex items-center justify-center">
                    <div
                        class="grid gap-8 my-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {#each landpads as landpad}
                            <div class="w-full text-start">
                                <div
                                    class="object-cover object-center px-4 w-full mx-auto h-72 rounded-lg border border-gray-200"
                                >
                                    <div class="pt-4 space-y-2 h-3/4">
                                        <div class="flex justify-between">
                                            <h5 class="text-xl font-bold">
                                                {landpad.full_name}
                                            </h5>
                                        </div>
                                        <p class="mt-1 font-medium">
                                            <span class="font-semibold"
                                                >Location:</span
                                            >
                                            <span class="text-gray-500"
                                                >{landpad.location.name}</span
                                            >
                                        </p>
                                        <p class="mt-1 font-medium">
                                            <span class="font-semibold"
                                                >Region:</span
                                            >
                                            <span class="text-gray-500"
                                                >{landpad.location.region}</span
                                            >
                                        </p>
                                        <div class="flex items-center">
                                            <p
                                                class="font-semibold text-nowrap"
                                            >
                                                Success Rate:
                                            </p>
                                            <p class="ml-2 text-gray-500">
                                                {calculateSuccessRate(landpad)}
                                            </p>
                                        </div>
                                        <p class="mt-1 font-medium">
                                            <span class="font-semibold"
                                                >Status:</span
                                            >
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
                                    </div>
                                    <div
                                        class="flex h-1/4 justify-center items-start"
                                    >
                                        <div class="flex gap-4">
                                            <Button
                                                on:click={() => {
                                                    handleModal();
                                                    getDetails(landpad);
                                                }}
                                                class="bg-gray-100 text-nowrap transition duration-300 hover:bg-gray-200 "
                                            >
                                                <span
                                                    class="hover:text-gray-900 text-gray-900 text-[12px] font-medium leading-[18px] -px-4 -py-4"
                                                    >View Details</span
                                                >
                                            </Button>
                                            <Button
                                                class="bg-gray-100 text-nowrap transition duration-300 hover:bg-gray-200 focus:ring-1 focus:ring-gray-200"
                                            >
                                                <a
                                                    href={landpad.wikipedia}
                                                    target="_blank"
                                                >
                                                    <span
                                                        class="hover:text-gray-900 flex items-center gap-2 text-gray-900 text-[12px] font-medium leading-[18px] -px-4 -py-4"
                                                        >Wikipedia Link
                                                        <LinkIcon />
                                                    </span>
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </section>
        {/if}
    </div>
    <div class="flex flex-col mt-[50px] rounded-lg w-1/4">
        <div class="border px-4 py-4">
            <p class="text-[16px] font-semibold leading-6">Map View</p>
        </div>
        <div id="map"></div>
        <div class="mt-[30px] border flex flex-col justify-center">
            <div class="px-4 py-4">
                <p class="text-[16px] font-semibold leading-6">
                    Success Rate Chart
                </p>
            </div>
            <div class="flex justify-center pb-10">
                <Card class="border-none shadow-none">
                    <Chart options={chartOptions} />
                </Card>
            </div>
        </div>
    </div>
</div>

<style>
    #map {
        height: 300px;
        filter: grayscale(100%);
    }
</style>
