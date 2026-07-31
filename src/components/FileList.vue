<template>
    <div class="file-list overflow-x-auto" :style="containerStyle">
        <a v-for="file in files" :style="style" @click.prevent="openFile(file)" role="button" :key="file.id">
            <img v-if="file.category === 'image'" :src="file.thumb_url" :alt="file.name" class="img-fluid mb-2" :style="imageBoxStyle"/>
            <div v-else class="border rounded p-2 mb-2" :style="fileBoxStyle">
                {{ file.category }}
            </div>
            <span class="d-block text-truncate align-center" :title="file.name">{{ file.name }}</span>
        </a>
    </div>
</template>

<script setup>

const props = defineProps({
    files: {
        type: Array,
        required: true
    }
})

function openFile(file) {
    if(!window?.SpPS?.api?.store?.fileStore?.openFile) {
        console.error('File store is not available.');
        return;
    }
    try{
        SpPS.api.store.fileStore.openFile(file);
    } catch (error) {
        console.error('Error opening file:', error);
    }
}

const containerStyle = {
    display: 'flex',
    gap: '1rem',
}

const style = {

    overflow: 'none',
}

const imageBoxStyle = {
    height: '150px',
    width: '150px',
    objectFit: 'cover',
}

const fileBoxStyle = {
    height: '150px',
    width: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    color: '#333',
    fontWeight: 'bold',
    textTransform: 'capitalize'
}
</script>