<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4 text-center">
        <div class="animate-bounce text-red-600 text-8xl font-extrabold drop-shadow-lg">
            404
        </div>
        <h1 class="text-3xl font-bold mt-4">Oops! Trang không tồn tại.</h1>
        <p class="mt-2 text-gray-600">
            Có vẻ như bạn đã truy cập một liên kết không hợp lệ hoặc trang đã bị xóa.
        </p>
        <router-link to="/" class="mt-6 inline-block px-6 py-3 bg-black text-white rounded-lg shadow-md">
            Quay về trang chủ
        </router-link>
    </div>
</template>

<script setup>
// Không cần logic JS phức tạp ở đây
</script>
