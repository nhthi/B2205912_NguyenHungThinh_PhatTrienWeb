<template>
    <div class="w-64 bg-gray-900 text-white min-h-screen px-4 py-6">
        <div class="text-xl font-bold mb-6">Admin Panel</div>
        <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.title">
                <router-link :to="item.to" class="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-800"
                    active-class="bg-gray-800" exact>
                    <span class="material-icons">{{ item.icon }}</span>
                    <span>{{ item.title }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'AdminSidebar',
    data() {
        return {
            menuItems: [
                { title: 'Tổng quan', icon: 'dashboard', to: '/admin/dashboard' },
                { title: 'Người dùng', icon: 'person', to: '/admin/users' },
                { title: 'Sách', icon: 'menu_book', to: '/admin/books' },
                { title: 'Thể loại', icon: 'category', to: '/admin/categories' },
                { title: 'Nhà xuất bản', icon: 'business', to: '/admin/publishers' },
                { title: 'Tác giả', icon: 'edit', to: '/admin/authors' },
                { title: 'Theo dõi mượn sách', icon: 'shopping_cart', to: '/admin/borrows' },
            ]

        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
