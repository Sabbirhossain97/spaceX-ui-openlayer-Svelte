<script>
    import LandpadTable from "$lib/components/LandpadTable.svelte";
    import LandpadGrid from "$lib/components/LandpadGrid.svelte";
    import MapView from "$lib/components/MapView.svelte";
    import ChartView from "$lib/components/ChartView.svelte";
    import View from "$lib/components/layout/View.svelte";
    import { Spinner } from "flowbite-svelte";
    import { onMount } from "svelte";
    import "ol/ol.css";
    import { initializeMap } from "$lib/helpers/InitializeMap.js";
    import { calculateSuccessRate } from "$lib/helpers/helpers.js";
    import DetailsModal from "../DetailsModal.svelte";
    import Filter from "./Filter.svelte";
    import { getChartOptions } from "$lib/helpers/Chartoptions.js";

    let defaultModal = $state(false);
    let landpads = $state([]);
    let filteredLandpads = $state([]);
    let landpadSuccessRates = $state([]);
    let filteredSuccessRates = $state([]);
    let landpadDetails = $state({});
    let landpadLabels = [];
    let dropdownOpen = $state(false);
    let selectedStatus = $state(null);
    let view = $state("list");
    let loading = $state(true);
    let dropdownRef = $state(null);
    let mapInstance;
    let chartOptions = $state({});
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

            //initialize chart options
            chartOptions = getChartOptions(landpadSuccessRates, landpadLabels);

            //initialize map
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

    //handle outside click of filter dropdown
    $effect(() => {
        const handleDropDownOutsideClick = (event) => {
            if (dropdownRef && !dropdownRef.contains(event.target)) {
                dropdownOpen = false;
            }
        };
        document.addEventListener("mousedown", handleDropDownOutsideClick);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleDropDownOutsideClick,
            );
        };
    });

    //handle grid or list view
    function handleView(e) {
        view = e.currentTarget.name;
    }

    //get landpadDetails for modal
    function getLandpadDetails(landpad) {
        defaultModal = true;
        return Object.assign(landpadDetails, {
            name: landpad.full_name,
            details: landpad.details,
        });
    }

    //to filter based on status change
    function handleStatusChange(status) {
        selectedStatus = status;

        //filter landpads based on status
        filteredLandpads = selectedStatus
            ? landpads.filter((landpad) => landpad.status === selectedStatus)
            : landpads;
        mapInstance.updateMarkers(filteredLandpads);
        mapInstance.flyTo(filteredLandpads);

        //filter success rate for chart
        filteredSuccessRates = filteredLandpads.map((landpad) =>
            calculateSuccessRate(landpad),
        );

        //filter labels for chart
        landpadLabels = filteredLandpads.map((landpad) => landpad.full_name);

        //update chart based on filter
        chartOptions = getChartOptions(filteredSuccessRates, landpadLabels);
    }

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }
</script>

<DetailsModal bind:modal={defaultModal} {landpadDetails} />

<div
    class="px-[50px] flex flex-col xl:flex-row justify-center items-start xl:gap-10 pb-[230px]"
>
    <div class="mt-[50px] flex flex-col w-full xl:w-3/4">
        <!-- view and filter section -->

        <div class="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between">
            <View {handleView} {view} />
            <Filter
                bind:dropdownref={dropdownRef}
                bind:filterstatus={selectedStatus}
                {selectedStatus}
                {handleStatusChange}
                {toggleDropdown}
                {dropdownOpen}
                {landpads}
            />
        </div>

        <!-- table and grid section -->

        {#if loading}
            <div
                class="w-full flex justify-center items-center h-[500px] mt-[18px]"
            >
                <Spinner color="#3f83f8" size={12} />
            </div>
        {:else if view === "list"}
            <div
                class="shadow-custom-table overflow-hidden rounded-[10px] mt-[18px] bg-[#fff]"
            >
                <LandpadTable
                    {filteredLandpads}
                    {getLandpadDetails}
                    {calculateSuccessRate}
                />
            </div>
        {:else}
            <LandpadGrid
                {filteredLandpads}
                {getLandpadDetails}
                {calculateSuccessRate}
            />
        {/if}
    </div>

    <!-- map and chart section -->
    <div
        class="flex flex-col md:flex-row gap-[30px] xl:flex-col mt-[50px] w-full xl:w-1/4 relative"
    >
        <MapView {loading} />
        <ChartView {loading} {chartOptions} />
    </div>
</div>
