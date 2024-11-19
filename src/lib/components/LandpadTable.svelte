<script>
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Progressbar,
        Button,
    } from "flowbite-svelte";
    import LinkIcon from "$lib/icons/LinkIcon.svelte";
    let { filteredLandpads, getLandpadDetails, calculateSuccessRate } =
        $props();
</script>

<Table>
    <TableHead
        class="bg-gray-50 h-[54px] border-b text-[12px] font-semibold leading-[18px] uppercase text-gray-500 custom-table-head"
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
                    {landpad.full_name}
                </TableBodyCell>
                <TableBodyCell>{landpad.location.name}</TableBodyCell>
                <TableBodyCell>{landpad.location.region}</TableBodyCell>
                <TableBodyCell>
                    <Button
                        onclick={() => {
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
                        {#if landpad.attempted_landings !== 0}
                            <Progressbar
                                progress={calculateSuccessRate(landpad)}
                                size="h-1.5"
                                progressClass="bg-green-400"
                            />
                        {/if}
                    </div>
                    {#if landpad.attempted_landings === 0}
                        <span> N/A </span>
                    {:else}
                        <span>
                            {calculateSuccessRate(landpad) + "%"}
                        </span>
                    {/if}
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
