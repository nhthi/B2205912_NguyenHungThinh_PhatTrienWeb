<template>
    <v-container class="text-center py-10 bg-grey-lighten-4 rounded">
        <h2 class="font-weight-bold mb-4">📥 Bắt đầu hành trình đọc sách của bạn</h2>
        <p class="mb-6">Chỉ với vài bước đơn giản, bạn đã có thể mượn sách trực tuyến.</p>
        <v-btn @click="handleExplore" router color="black" size="large" class="text-white">Đăng ký ngay</v-btn>
    </v-container>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleExplore = () => {
    const token = localStorage.getItem('token') // hoặc 'user' tùy bạn lưu gì khi đăng nhập
    if (token) {
        router.push('/books')
    } else {
        router.push('/register')
    }
}
</script>