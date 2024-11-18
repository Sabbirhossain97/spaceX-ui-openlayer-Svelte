<script>
    import { Button, Dropdown } from "flowbite-svelte";
    import {
        ChevronDownOutline,
        ChevronUpOutline,
    } from "flowbite-svelte-icons";
    import FilterIcon from "$lib/icons/FilterIcon.svelte";
    import ResetIcon from "$lib/icons/ResetIcon.svelte";

    let {
        dropdownref = $bindable(),
        filterstatus = $bindable(),
        selectedStatus,
        handleStatusChange,
        toggleDropdown,
        dropdownOpen,
        landpads,
    } = $props();
</script>

<div bind:this={dropdownref} class="flex items-center gap-4">
    {#if selectedStatus}
        <Button
            onclick={() => handleStatusChange(null)}
            class="cursor-pointer focus:ring-4 focus:ring-gray-100 border bg-[#F8F8F8] hover:bg-gray-100 w-full xs:w-[80px]"
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
            <span class="ml-2 capitalize text-nowrap">{selectedStatus}</span>
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
                        bind:group={filterstatus}
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
