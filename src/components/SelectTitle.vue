<template>
    <VueSelect v-model="modelValue.title" :data="data" />
</template>

<script setup>
    import { computed, watch } from 'vue';
    import VueSelect from './VueSelect.vue';

    defineOptions({ inheritAttrs: false });

    const t = SpPS.data.t

    const modelValue = defineModel({
        type: Object,
    })

    const emit = defineEmits(['changed'])

    const options = [
        "entity_type",
        "entity_name"
    ]

    const data = computed(() => {
        return options.map((option) => {
            return {
                option,
                label: t(option)
            }
        })
    })

    watch(modelValue, (newValue) => {
        emit('changed', newValue)
    }, { deep: true })


</script>