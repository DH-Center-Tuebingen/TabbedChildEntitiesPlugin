<template>
    <div class="tabbed-child-tab">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true">

        </span>
        <span v-else>
            <i class="fas fa-fw fa-cube me-2" />
        </span>
        <span>{{ label }}</span>
    </div>
</template>

<script setup>
    import useSharedLoading from '@/composables/shared-loading.js';
    import { computed } from 'vue';

    const props = defineProps({
        value: {
            type: Object,
            required: true
        },
    })


    const label = computed(() => {
        const type = SpPS.api.store.systemStore.getPreference("plugin.tabbed_child_entities.preference.title")?.title;

        console.log(type, props.value)
        if (type === "entity_type") {
            return props.value.entity_type_name || 'N/A';
        } else {
            if (type !== "entity_name") {
                console.error(`Unknown title type: ${type}`);
            }
            return props.value.name || 'N/A';
        }
    })

    const entityTypeName = props.value.entity_type_name || 'N/A';

    const { loading } = useSharedLoading(`tabbed-child-entity-${props.id}`);

    const SpPS = window.SpPS;
</script>