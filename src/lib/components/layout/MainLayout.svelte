<script>
    import LandpadTable from "$lib/components/LandpadTable.svelte";
    import LandpadGrid from "$lib/components/LandpadGrid.svelte";
    import MapView from "$lib/components/MapView.svelte";
    import ChartView from "$lib/components/ChartView.svelte";
    import View from "$lib/components/layout/View.svelte";
    import { Spinner } from "flowbite-svelte";
    import { onMount } from "svelte";
    import "ol/ol.css";
    import { options } from "$lib/helpers/Chartoptions.js";
    import { initializeMap } from "$lib/helpers/InitializeMap.js";
    import { calculateSuccessRate } from "$lib/helpers/helpers.js";
    import DetailsModal from "../DetailsModal.svelte";
    import Filter from "./Filter.svelte";

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
    let dropdownRef = $state(null);
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

        //filter success rate for chart
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

<DetailsModal bind:modal={defaultModal} {landpadDetails} />

<div
    class="px-[50px] flex flex-col xl:flex-row justify-center items-start xl:gap-10 pb-[230px]"
>
    <div class="mt-[50px] flex flex-col w-full xl:w-3/4">
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
        class="flex flex-col md:flex-row gap-[30px] xl:flex-col mt-[50px] w-full xl:w-1/4 relative"
    >
        <MapView {loading} />
        <ChartView {loading} {chartOptions} />
    </div>
</div>
