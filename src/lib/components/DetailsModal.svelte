<script>
    import { Modal } from "flowbite-svelte";
    let { landpadDetails, modal = $bindable() } = $props();
</script>

<Modal
    title={`Details - ${landpadDetails.name}`}
    bind:open={modal}
    autoclose
    outsideclose
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
