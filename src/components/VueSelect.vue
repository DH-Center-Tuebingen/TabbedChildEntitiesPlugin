<template>
    <select class="form-select" v-model="model">
        <option v-for="{label, option} in data" :key="option" :value="option">
            {{ label }}
        </option>
    </select>
</template>

<script setup>

    const model = defineModel()

    const props = defineProps({
        data: Array,
        readonly: {
            type: Boolean,
            default: false, 
        } 
    })
</script>