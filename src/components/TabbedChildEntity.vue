<template>
    <div class="tabbed-child-entity p-4">
        <span v-if="errors.length > 0" class="text-danger mb-3 d-block">
            <div v-for="error in errors" :key="error">{{ error }}</div>
        </span>
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true">
        </span>
        <template v-else>
            <template v-if="hasFiles">
                <h3>Linked Files</h3>
                <FileList :files="files" v-if="files.length > 0" class="mb-3" />
            </template>

            <h3>Data</h3>
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
import { computed, onMounted, ref } from 'vue';
import FileList from '@/components/FileList.vue';

import useSharedLoading from '@/composables/shared-loading.js';

const props = defineProps({
    value: {
        type: Object,
        required: true
    },
})

const id = computed(() => props.value.id);
const type = computed(() => props.value.type);
const name = computed(() => props.value.name);

const { loading, setLoading } = useSharedLoading(`tabbed-child-entity-${id.value}`);

const entity = ref(null);
const files = ref([]);
const attributes = ref([]);
const errors = ref([]);

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

const loadChildEntityData = async () => {
    try {
        attributes.value = await SpPS.api.store.entityStore.getEntityTypeAttributes(type.value);
        const response = await SpPS.api.http('get', `entity/${id.value}/entity_detail`)
        entity.value = response.data;
    } catch (error) {
        console.error('Error fetching entity data:', error);
        errors.value.push('Failed to load entity data.');
    };
};

const loadChildEntityLinkedFiles = async () => {
    let loadedFiles = [];
    try {
        const filters = { linked: id.value };
        const response = await SpPS.api.http('get', `file?filters=${JSON.stringify(filters)}`);
        console.log('Linked files response:', response);
        loadedFiles = response.data;
    } catch (error) {
        console.error('Error fetching linked files:', error);
        errors.value.push('Failed to load linked files.');
    };
    files.value = loadedFiles;
    console.log('Linked files set to:', files.value);
};

async function loadData() {
    setLoading(true);
    errors.value = [];
    await loadChildEntityData();
    await loadChildEntityLinkedFiles();
    setLoading(false);
}

onMounted(async () => {
    await loadData();
});

const hasFiles = computed(() => files.value?.length && files.value.length > 0);

</script>