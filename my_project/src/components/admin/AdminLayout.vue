<template>
    <div class="flex min-h-screen bg-gray-50 text-gray-900">
        <!-- Sidebar -->
        <div class="fixed inset-y-0 left-0 w-64 z-10">
            <AdminSidebar />
        </div>


        <!-- Main Content -->
        <div class="flex-1 p-6 ml-64">
            <!-- Slot để render nội dung từng trang -->
            <router-view />
        </div>
    </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'

export default {
    name: 'AdminLayout',
    components: { AdminSidebar }
}
</script>
