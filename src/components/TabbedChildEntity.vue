<template>
    <div class="tabbed-child-entity p-4">
        <h3>{{ name }}</h3>

        <div v-if="loading">
            <span class="spin">...</span>
        </div>
        <template v-else>
            <table class="table table-striped table-hover">
                <thead class="text-secondary">
                    <tr>
                        <th scope="col">Attribute</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="attribute in attributes" :key="attribute.id" class="mb-2">
                        <td class="fw-bold">{{ translateConcept(attribute.thesaurus_url) }}</td>
                        <td>{{ attributeTextValue(attribute) }}</td>
                    </tr>
                    <tr v-if="attributes.length === 0">
                        <td colspan="2">No attributes found for this entity.</td>
                    </tr>
                </tbody>
            </table>
        </template>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false,
    },
    type: {
        type: Number,
        required: true,
    }
})

const entity = ref(null);
const loading = ref(false);
const attributes = ref([]);
const error = ref(null);

const translateConcept = (conceptUrl) => SpPS.api.helpers.translateConcept(conceptUrl);
const attributeTextValue = (attribute) => {
    const value = entity.value ? entity.value[attribute.id] : null;
    if (attribute.datatype !== 'boolean' && (value == null || value.value == null)) {
        return '-';
    }
    const attributeValue = value?.value;

    switch (attribute.datatype) {
        case 'date':
            return new Date(attributeValue).toUTCString();
        case 'boolean':
            return attributeValue === 1 ? '✓' : '✕';
        case 'string-sc':
            if (!attributeValue.concept_url) return '-'
            else return translateConcept(attributeValue.concept_url);
        case 'string-mc':
            if (!attributeValue || attributeValue.length === 0) return '-'
            else return attributeValue.map(v => translateConcept(v.concept_url)).join(', ');
        case 'si-unit':
            return `${attributeValue.value} ${translateConcept(attributeValue.unit)}`;
        default:
            return attributeValue;
    }
};

onMounted(async () => {
    loading.value = true;

    try {
        attributes.value = await SpPS.api.store.entityStore.getEntityTypeAttributes(props.type);
        const response = await SpPS.api.http('get', `entity/${props.id}/entity_detail`)
        entity.value = response.data;
        loading.value = false;
    } catch (error) {
        console.error('Error fetching entity data:', error);
        error.value = 'Failed to load entity data.';
    };
    loading.value = false;
});

</script>