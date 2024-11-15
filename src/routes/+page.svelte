<script>
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import { Button, Dropdown, DropdownItem, Radio } from "flowbite-svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import "ol/ol.css"; // Import OpenLayers CSS
    import Map from "ol/Map";
    import View from "ol/View";
    import TileLayer from "ol/layer/Tile";
    import OSM from "ol/source/OSM";
    import Feature from "ol/Feature";
    import Point from "ol/geom/Point";
    import VectorLayer from "ol/layer/Vector";
    import VectorSource from "ol/source/Vector";
    import Style from "ol/style/Style";
    import Icon from "ol/style/Icon";
    import { fromLonLat } from "ol/proj";
    import { TextPlaceholder } from "flowbite-svelte";
    import { ListPlaceholder } from "flowbite-svelte";
    import { Spinner } from "flowbite-svelte";
    import { Progressbar } from "flowbite-svelte";
    import { Modal } from "flowbite-svelte";
    let group2 = 2;
    let map;
    let defaultModal = false;

    onMount(() => {
        const coordinates = [
            [26.0, 58.4],
            [26.2, 58.5],
            [25.8, 58.3],
            [26.1, 58.2],
            [25.9, 58.1],
        ];

        const markers = coordinates.map((coord) => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(coord)),
            });
            feature.setStyle(
                new Style({
                    image: new Icon({
                        color: "#00FF00",
                        crossOrigin: "anonymous",
                        src: "data:image/svg+xml;base64,<YOUR_SVG_BASE64>",
                    }),
                }),
            );
            return feature;
        });

        const markerLayer = new VectorLayer({
            source: new VectorSource({
                features: markers,
            }),
        });

        map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                markerLayer,
            ],
            view: new View({
                center: fromLonLat([26.0, 58.4]),
                zoom: 8,
            }),
        });
    });

    let landpads = [];
    let uniqueStatuses = [];
    let landpadDetails = { name: "", details: "" };
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const response = await fetch(
                "https://api.spacexdata.com/v3/landpads",
            );
            if (!response.ok) throw new Error("Failed to fetch data");
            landpads = await response.json();
            uniqueStatuses = [...new Set(landpads.map((zone) => zone.status))];
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });

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
</script>

<div
    class="h-10 px-0 py-10 border rounded-[2px] bg-[#fff] flex justify-center items-center shadow-header"
>
    <img src="/logo.png" alt="logo" />
</div>
<div class="px-[110px] flex flex-row justify-center items-start gap-10">
    <div class=" mt-[104px] flex flex-col">
        <div class="flex justify-between">
            <div class="flex">
                <p
                    class="bg-[#EBEDF0] items-center border-t border-b border-l rounded-l-[6px] border-[#E5E7EB] p-3"
                >
                    <svg
                        class="w-5 h-5 text-[#1C64F2]"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-width="2"
                            d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                        />
                    </svg>
                </p>
                <p
                    class="bg-white items-center border-t border-b border-r rounded-r-[6px] border-[#E5E7EB] p-3"
                >
                    <svg
                        class="w-4 h-4 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </p>
            </div>
            <div>
                <Button
                    class="bg-[#F8F8F8] border border-gray-200 rounded-lg text-gray-800 focus:ring-4 focus:ring-gray-100"
                    ><svg
                        class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M5 13.17a3.001 3.001 0 0 0 0 5.66V20a1 1 0 1 0 2 0v-1.17a3.001 3.001 0 0 0 0-5.66V4a1 1 0 0 0-2 0v9.17ZM11 20v-9.17a3.001 3.001 0 0 1 0-5.66V4a1 1 0 1 1 2 0v1.17a3.001 3.001 0 0 1 0 5.66V20a1 1 0 1 1-2 0Zm6-1.17V20a1 1 0 1 0 2 0v-1.17a3.001 3.001 0 0 0 0-5.66V4a1 1 0 1 0-2 0v9.17a3.001 3.001 0 0 0 0 5.66Z"
                        />
                    </svg>
                    <span class="ml-2">Filter By Status</span>
                    <ChevronDownOutline
                        class="w-6 h-6 ms-2 text-gray-800"
                    /></Button
                >
                <Dropdown class="w-48 p-3 space-y-1">
                    {#each uniqueStatuses as statuses}
                        <li
                            class="rounded p-2 capitalize text-nowrap hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <Radio name="group2" bind:group={group2} value={1}
                                >{statuses}</Radio
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
        <Table class="border rounded-[10px] bg-[#fff] mt-[18px] max-w-[1158px]">
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
                        <TableBodyCell>{landpad.location.name}</TableBodyCell>
                        <TableBodyCell>{landpad.location.region}</TableBodyCell>
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
                                        progress={successRateProgress(landpad)}
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
                                    <svg
                                        class="w-6 h-6 text-[#1C64F2]"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
                                        />
                                    </svg></a
                                >
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
    <div class="flex flex-col mt-[104px] rounded-lg">
        <div class="border px-4 py-4">
            <p class="text-[16px] font-semibold leading-6">Map View</p>
        </div>
        <div id="map"></div>
    </div>
</div>

<style>
    #map {
        width: 600px;
        height: 300px;
    }
</style>
