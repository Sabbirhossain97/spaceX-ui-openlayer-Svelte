<script>
    import LandpadTable from "$lib/components/LandpadTable.svelte";
    import LandpadGrid from "$lib/components/LandpadGrid.svelte";
    import MapView from "$lib/components/MapView.svelte";
    import ChartView from "$lib/components/ChartView.svelte";
    import View from "$lib/components/layout/View.svelte";
    import { Button, Dropdown, Spinner, Modal } from "flowbite-svelte";
    import {
        ChevronDownOutline,
        ChevronUpOutline,
    } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import "ol/ol.css";
    import { options } from "$lib/helpers/Chartoptions.js";
    import { FilterIcon, ResetIcon } from "$lib/icons/index.js";
    import { initializeMap } from "$lib/helpers/InitializeMap.js";
    import { calculateSuccessRate } from "$lib/helpers/helpers.js";

    let defaultModal = $state(false);
    let landpads = $state([]);
    let filteredLandpads = $state([]);
    let landpadSuccessRates = $state([]);
    let filteredSuccessRates = $state([]);
    let landpadDetails = $state({ name: "", details: "" });
    let landpadLabels = [];
    let statusFilter = null;
    let dropdownOpen = $state(false);
    let selectedStatus = $state(null);
    let view = $state("list");
    let loading = $state(true);
    let customColor = $state("");
    let dropdownRef;
    let mapInstance;
    let chartOptions = $state({ ...options });
    let error = $state(null);

    onMount(async () => {
        try {
            const response = await fetch(
                "https://api.spacexdata.com/v3/landpads",
            );
            if (!response.ok) throw new Error("Failed to fetch data");
            landpads = await response.json();
            filteredLandpads = landpads;

            //show success rate for chart
            landpadSuccessRates = landpads.map((landpad) =>
                calculateSuccessRate(landpad),
            );

            //show landpad labels on chart
            landpadLabels = landpads.map((item) => item.full_name);

            chartOptions = {
                ...chartOptions,
                series: landpadSuccessRates,
                labels: landpadLabels,
            };

            //to initialize map
            const { map, updateMarkers, flyTo } = initializeMap(
                "map",
                filteredLandpads,
            );
            mapInstance = { map, updateMarkers, flyTo };
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });

    const handleDropDownOutsideClick = (event) => {
        if (dropdownRef && !dropdownRef.contains(event.target)) {
            dropdownOpen = false;
        }
    };

    $effect(() => {
        document.addEventListener("mousedown", handleDropDownOutsideClick);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleDropDownOutsideClick,
            );
        };
    });

    function handleView(e) {
        view = e.currentTarget.name;
    }

    function handleModal() {
        defaultModal = true;
        return defaultModal;
    }

    //get landpadDetails for modal
    function getLandpadDetails(landpad) {
        landpadDetails.name = landpad.full_name;
        landpadDetails.details = landpad.details;
        return landpadDetails;
    }

    //to filter based on status change
    function handleStatusChange(status) {
        statusFilter = status;
        selectedStatus = status;
        filteredLandpads = statusFilter
            ? landpads.filter((landpad) => landpad.status === statusFilter)
            : landpads;
        mapInstance.updateMarkers(filteredLandpads);
        mapInstance.flyTo(filteredLandpads);
        filteredSuccessRates = filteredLandpads.map((landpad) =>
            calculateSuccessRate(landpad),
        );
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
    class="px-[50px] flex flex-col xl:flex-row justify-center items-start xl:gap-10 pb-[230px]"
>
    <div class="mt-[50px] flex flex-col w-full xl:w-3/4">
        <div class="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between">
            <View {handleView} {view} />
            <div bind:this={dropdownRef} class="flex items-center gap-4">
                {#if selectedStatus}
                    <Button
                        onclick={() => handleStatusChange(null)}
                        class="cursor-pointer border bg-[#F8F8F8] hover:bg-gray-100 w-full xs:w-[80px]"
                        ><ResetIcon /></Button
                    >
                {/if}
                <Button
                    onclick={toggleDropdown}
                    class={`${dropdownOpen ? "text-blue-500" : "text-gray-800"} w-full xs:w-[250px] sm:w-full bg-[#F8F8F8] hover:bg-gray-100 border border-gray-200 rounded-lg focus:ring-4 focus:ring-gray-100`}
                >
                    <FilterIcon {dropdownOpen} />
                    {#if selectedStatus === null}
                        <span class="ml-2">Filter By Status</span>
                    {:else}
                        <span class="ml-2 capitalize text-nowrap"
                            >{selectedStatus}</span
                        >
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
                    {#each [...new Set(landpads.map((zone) => zone.status))] as status}
                        <li class="rounded p-2 capitalize text-nowrap">
                            <div>
                                <input
                                    id={status}
                                    bind:group={selectedStatus}
                                    type="radio"
                                    value={status}
                                    onchange={() => {
                                        handleStatusChange(status);
                                    }}
                                    name={status}
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:outline-none"
                                />
                                <label
                                    for={status}
                                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >{status}</label
                                >
                            </div>
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

        <!-- table and grid section -->

        {#if loading}
            <div
                class="w-full flex justify-center items-center h-[500px] mt-[18px]"
            >
                <Spinner color="#3f83f8" size={12} />
            </div>
        {:else if view === "list"}
            <div class="shadow-custom-table rounded-[10px] mt-[18px] bg-[#fff]">
                <LandpadTable
                    {filteredLandpads}
                    {loading}
                    {handleModal}
                    {getLandpadDetails}
                    {calculateSuccessRate}
                />
            </div>
        {:else}
            <LandpadGrid
                {filteredLandpads}
                {loading}
                {handleModal}
                {getLandpadDetails}
                {calculateSuccessRate}
            />
        {/if}
    </div>

    <!-- map and chart section -->
    <div
        class="flex flex-col lg:flex-row gap-[30px] xl:flex-col mt-[50px] w-full xl:w-1/4 relative"
    >
        <MapView {loading} />
        <ChartView {loading} {chartOptions} />
    </div>
</div>
