<template>
    <div class="tabbed-child-tab">
        <i class="fas fa-fw fa-cube me-2" />
        <span>{{ name }}</span>
    </div>
</template>

<script setup>
    defineProps({
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: Number,
            required: false,
        }
    })
</script>