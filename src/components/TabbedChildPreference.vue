<template>
    <multiselect
        v-model="model.entity_types"
        mode="tags"
        :options="entityTypes"
        value-prop="id"
        label-prop="thesaurus_url"
        @change="changed"
    >
        <template #option="{ option }">
            {{ translateConcept(option.thesaurus_url) }}
        </template>
        <template #tag="{ option, handleTagRemove, disabled: tagDisabled }">
            <div class="multiselect-tag">
                {{ translateConcept(option.thesaurus_url) }}
                <span
                    class="multiselect-tag-remove"
                    @click.prevent
                    @mousedown.prevent.stop="handleTagRemove(option, $event)"
                >
                    <span class="multiselect-tag-remove-icon" />
                </span>
            </div>
        </template>
    </multiselect>
</template>

<script setup>
    import { computed } from 'vue';

    const model = defineModel({
        type: Object,
        required: true,
    })

    const emit = defineEmits(['changed'])

    const changed = (value) => {
        console.log('changed', value)
        emit('changed', {entity_types: value})
    }

    const entityTypes = computed(() => {
        const entityTypesObj = SpPS?.api?.store?.entityStore?.entityTypes
        if (!entityTypesObj) return []
        return Object.values(entityTypesObj)
    })

    const translateConcept = (conceptUrl) => {
        const translateConcept = SpPS?.api?.helpers?.translateConcept
        if (!translateConcept) return conceptUrl
        return translateConcept(conceptUrl)
    }
</script>
