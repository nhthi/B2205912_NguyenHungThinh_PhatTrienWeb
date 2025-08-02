<template>
    <div class="p-6 space-y-6">
        <h1 class="text-2xl font-semibold">Quản lý người dùng</h1>

        <!-- Tabs -->
        <div class="flex space-x-4">
            <button class="px-4 py-2 rounded"
                :class="activeTab === 'readers' ? 'bg-blue-600 text-white' : 'bg-gray-200'"
                @click="activeTab = 'readers'">
                Độc giả
            </button>
            <button class="px-4 py-2 rounded" :class="activeTab === 'staff' ? 'bg-blue-600 text-white' : 'bg-gray-200'"
                @click="activeTab = 'staff'">
                Nhân viên
            </button>
        </div>

        <!-- Nội dung -->
        <div v-if="readers.length || staff.length">
            <ReaderList v-if="activeTab === 'readers'" :users="readers" />
            <StaffList v-else :users="staff" />
        </div>
    </div>
</template>

<script>
import ReaderList from './ReaderList.vue'
import StaffList from './StaffList.vue'
import api from '@/services/api.service'

export default {
    name: 'UserManagement',
    components: {
        ReaderList,
        StaffList
    },
    data() {
        return {
            activeTab: 'readers',
            readers: [],
            staff: []
        }
    },
    methods: {
        async fetchUsers() {
            try {
                const res = await api.get('/api/users')
                const users = res.data
                this.readers = users.filter(u => u.role === 'reader')
                this.staff = users.filter(u => u.role === 'admin')
                console.log("Readers:", this.readers)
                console.log("Staff:", this.staff)
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng:', error)
            }
        }
    },
    mounted() {
        this.fetchUsers()
    }
}
</script>
