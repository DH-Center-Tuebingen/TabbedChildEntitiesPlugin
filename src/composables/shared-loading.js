
import { ref, computed } from 'vue'

const sharedLoadingMap = ref({})

const useSharedLoading = (sharedKey) => {

    const loading = computed(() => {
        return sharedLoadingMap.value[sharedKey] || false
    })

    const setLoading = (value) => {
        sharedLoadingMap.value[sharedKey] = value
    }

    return {
        loading,
        setLoading,
    }
}
export default useSharedLoading;