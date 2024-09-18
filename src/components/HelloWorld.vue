<script setup>
console.log('Hello World');
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
    <div class="window">
        {{ count }}
        <button @click="count++">
            count++
        </button>
    </div>
</template>
