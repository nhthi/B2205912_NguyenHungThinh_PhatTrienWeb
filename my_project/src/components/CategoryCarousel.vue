<template>
    <v-container class="py-6">
        <h3 class="font-weight-bold mb-4">📚 Danh mục sách</h3>
        <v-slide-group show-arrows>
            <v-slide-group-item v-for="category in categories" :key="category._id">
                <v-chip class="ma-2" color="black" text-color="white" pill @click="selectCategory(category._id)">
                    {{ category.ten_the_loai }}
                </v-chip>
            </v-slide-group-item>

        </v-slide-group>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.service'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectCategory = (name) => {
    const query = { ...route.query, category: name }
    router.push({ query })
}
const categories = ref([])

const fetchCategories = async () => {
    try {
        const response = await api.get('/api/categories')
        categories.value = response.data
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error)
    }
}

onMounted(() => {
    fetchCategories()
})

</script>
