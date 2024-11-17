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
    import {
        ChevronDownOutline,
        ChevronUpOutline,
    } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import "ol/ol.css";
    import {
        TextPlaceholder,
        ListPlaceholder,
        WidgetPlaceholder,
    } from "flowbite-svelte";
    import { Progressbar } from "flowbite-svelte";
    import { Spinner } from "flowbite-svelte";
    import { Modal } from "flowbite-svelte";
    import { Chart, Card } from "flowbite-svelte";
    import { options } from "$lib/components/Chartoptions.js";
    import {
        LinkIcon,
        FilterIcon,
        ListIcon,
        GridIcon,
        ResetIcon,
    } from "$lib/icons/index.js";
    import { initializeMap } from "$lib/components/InitializeMap.js";
    import {
        successRateProgress,
        calculateSuccessRate,
    } from "$lib/helpers/helpers.js";

    let map;
    let defaultModal = $state(false);
    let landpads = $state([]);
    let filteredLandpads = $state([]);
    let landpadSuccessRates = $state([]);
    let filteredSuccessRates = $state([]);
    let uniqueStatuses = $state([]);
    let landpadDetails = $state({ name: "", details: "" });
    let landpadLabels = [];
    let statusFilter = null;
    let dropdownOpen = $state(false);
    let selectedStatus = $state(null);
    let view = $state("list");
    let loading = $state(true);
    let error = null;
    let customColor = $state("");
    let dropdownRef;
    let chartOptions = $state({ ...options });

    onMount(async () => {
        try {
            const response = await fetch(
                "https://api.spacexdata.com/v3/landpads",
            );
            if (!response.ok) throw new Error("Failed to fetch data");
            landpads = await response.json();
            filteredLandpads = landpads;
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

    const handleOutsideClick = (event) => {
        if (dropdownRef && !dropdownRef.contains(event.target)) {
            dropdownOpen = false;
        }
    };

    $effect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    });

    function handleView(e) {
        view = e.currentTarget.name;
    }

    function handleModal() {
        defaultModal = true;
        return defaultModal;
    }

    function getLandpadDetails(landpad) {
        landpadDetails.name = landpad.full_name;
        landpadDetails.details = landpad.details;
        return landpadDetails;
    }

    function handleStatusChange(status) {
        statusFilter = status;
        selectedStatus = selectedStatus === status ? null : status;
        filteredLandpads = statusFilter
            ? landpads.filter((landpad) => landpad.status === statusFilter)
            : landpads;
        filteredSuccessRates = filteredLandpads.map((item) => {
            if (item.attempted_landings === 0) {
                return 0;
            } else if (item.successful_landings === 0) {
                return 0;
            } else {
                return Math.round(
                    (item.successful_landings / item.attempted_landings) * 100,
                );
            }
        });
        chartOptions = {
            ...chartOptions,
            series: filteredSuccessRates,
            labels: landpadLabels,
        };
    }

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
        customColor == dropdownOpen ? "#3f83f8" : "#000";
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
                <Button
                    onclick={(e) => handleView(e)}
                    aria-label="list"
                    name="list"
                    class={`${view === "list" ? "bg-[#EBEDF0] text-[#1C64F2]" : "bg-white"} hover:text-[#1C64F2] focus:ring-2 focus:ring-gray-100 rounded-l-md rounded-r-none items-center border border-[#E5E7EB] p-3`}
                >
                    <ListIcon {view} />
                </Button>
                <Button
                    onclick={(e) => handleView(e)}
                    aria-label="grid"
                    name="grid"
                    class={`${view === "grid" ? "bg-[#EBEDF0] text-[#1C64F2]" : "bg-white"} hover:text-[#1C64F2] focus:ring-2 focus:ring-gray-100 rounded-r-md rounded-l-none items-center border border-[#E5E7EB] p-3`}
                >
                    <GridIcon {view} />
                </Button>
            </div>
            <div bind:this={dropdownRef} class="flex items-center gap-4">
                {#if selectedStatus}
                    <Button
                        onclick={() => handleStatusChange(null)}
                        class="cursor-pointer border bg-[#F8F8F8] hover:bg-gray-100"
                        ><ResetIcon /></Button
                    >
                {/if}
                <Button
                    onclick={toggleDropdown}
                    class={`${dropdownOpen ? "text-blue-500" : "text-gray-800"} bg-[#F8F8F8] hover:bg-gray-100 border border-gray-200 rounded-lg focus:ring-4 focus:ring-gray-100`}
                >
                    <FilterIcon {dropdownOpen} />
                    {#if selectedStatus === null}
                        <span class="ml-2">Filter By Status</span>
                    {:else}
                        <span class="ml-2 capitalize">{selectedStatus}</span>
                    {/if}
                    {#if dropdownOpen}
                        <ChevronUpOutline
                            class={`${dropdownOpen ? "text-blue-500" : "text-gray-800"} w-6 h-6 ms-2 `}
                        />
                    {:else}
                        <ChevronDownOutline
                            class={`${dropdownOpen ? "text-blue-500" : "text-gray-800"} w-6 h-6 ms-2 `}
                        />
                    {/if}
                </Button>
                <Dropdown class="p-3 space-y-1">
                    {#each uniqueStatuses as status}
                        <li class="rounded p-2 capitalize text-nowrap">
                            <Radio
                                name={status}
                                bind:group={selectedStatus}
                                onchange={() => {
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
        {#if loading}
            <div
                class="w-full flex justify-center items-center h-[500px] mt-[18px]"
            >
                <Spinner color="#3f83f8" size={12} />
            </div>
        {:else if view === "list"}
            <div class="shadow-custom-table rounded-[10px] mt-[18px] bg-[#fff]">
                <Table>
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
                        {#each filteredLandpads as landpad}
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
                                        onclick={() => {
                                            handleModal();
                                            getLandpadDetails(landpad);
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
            </div>
        {:else}
            <section>
                <div class="flex items-center justify-center">
                    <div
                        class="grid gap-8 my-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {#each filteredLandpads as landpad}
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
                                                onclick={() => {
                                                    handleModal();
                                                    getLandpadDetails(landpad);
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
    <div class="flex flex-col mt-[50px] rounded-lg w-1/4 relative">
        <div
            class="min-h-[300px] border border-[#E5E7EB] rounded-lg shadow-map relative"
        >
            <div class=" px-4 py-4">
                <p class="text-[16px] font-semibold leading-6">Map View</p>
            </div>
            {#if loading}
                <div
                    class="absolute left-[43%] top-1/2 flex justify-center items-center bg-white z-10"
                >
                    <Spinner color="#3f83f8" size={8} />
                </div>
            {/if}
            <div id="map" class={`${loading ? "opacity-0" : ""} `}></div>
        </div>

        <div
            class="mt-[30px] border border-[#E5E7EB] flex flex-col justify-center rounded-lg shadow-chart"
        >
            <div class="px-4 py-4">
                <p class="text-[16px] font-semibold leading-6">
                    Success Rate Chart
                </p>
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
    </div>
</div>

<style>
    #map {
        height: 300px;
        position: relative;
        filter: grayscale(100%);
    }
</style>
