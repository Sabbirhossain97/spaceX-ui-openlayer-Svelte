<script>
    import { Button } from "flowbite-svelte";
    import ListIcon from "$lib/icons/ListIcon.svelte";
    import GridIcon from "$lib/icons/GridIcon.svelte";
    
    const { handleView, view } = $props();
</script>

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
