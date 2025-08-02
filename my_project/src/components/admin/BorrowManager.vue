<template>
    <div class="p-6 bg-white rounded-xl shadow space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Quản lý Mượn Sách</h2>
        </div>

        <span v-if="message" :class="{
            'text-green-600': messageType === 'success',
            'text-red-600': messageType === 'error',
            'block text-center mb-4 font-medium': true
        }">
            {{ message }}
        </span>

        <v-text-field v-model="search" label="Tìm kiếm theo độc giả hoặc tên sách" prepend-inner-icon="mdi-magnify" />

        <v-table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Độc giả</th>
                    <th>Tên sách</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                    <th>Ngày trả thực</th>
                    <th>Tiền phạt</th>
                    <th>Trạng thái</th>
                    <th>Trả sách</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(borrow, index) in filteredBorrows" :key="borrow._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ borrow.user.name }}</td>
                    <td>{{ borrow.book.title }}</td>
                    <td>{{ formatDate(borrow.borrowDate) }}</td>
                    <td>{{ formatDate(borrow.dueDate) }}</td>

                    <td>{{ borrow.returnDate ? formatDate(borrow.returnDate) : '---' }}</td>
                    <td>
                        <span :class="{
                            'text-red-600 font-semibold': borrow.fine > 0,
                            'text-gray-500': borrow.fine === 0
                        }">
                            {{ formatCurrency(borrow.fine) }}
                        </span>
                    </td>
                    <td>
                        <v-chip class="font-bold"
                            :color="borrow.status === 'borrowing' ? 'blue' : borrow.status === 'pending' ? 'red' : 'green'"
                            variant="flat">
                            <span class="font-bold">{{ borrow.status }}</span>
                        </v-chip>
                    </td>
                    <td>
                        <v-btn color="success" size="small" class="text-white font-bold"
                            @click="handleReturn(borrow._id)" :disabled="borrow.status !== 'borrowing'">
                            <v-icon size="18" class="mr-1">mdi-check</v-icon>
                            <span class="font-bold">Trả sách</span>
                        </v-btn>
                    </td>

                    <td>
                        <v-btn icon color="blue" @click="$router.push(`/admin/borrows/edit/${borrow._id}`)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deleteBorrow(borrow._id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api.service'

const borrows = ref([])
const search = ref('')
const message = ref('')
const messageType = ref('')

const fetchBorrows = async () => {
    try {
        const res = await api.get('/api/borrows')
        borrows.value = res.data
    } catch (err) {
        message.value = 'Lỗi khi tải dữ liệu'
        messageType.value = 'error'
    }
}

onMounted(fetchBorrows)

const filteredBorrows = computed(() => {
    const q = search.value.toLowerCase()
    return borrows.value.filter(
        (b) => b.user.name.toLowerCase().includes(q) || b.book.title.toLowerCase().includes(q)
    )
})

function formatCurrency(value) {
    if (!value) return '0 đ'
    return value.toLocaleString('vi-VN') + ' đ'
}

function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN')
}


async function handleReturn(borrowId) {
    try {
        await api.put(`/api/borrows/${borrowId}/return`, {
            returnDate: new Date().toISOString(), // hoặc dùng dayjs nếu cần định dạng
        });
        message.value = 'Trả sách thành công!'
        messageType.value = 'success'
        await fetchBorrows(); // ví dụ bạn có hàm này
    } catch (error) {
        message.value = 'Lỗi khi trả sách: ' + (err.response?.data?.message || err.message)
        messageType.value = 'error'
    }
};
async function deleteBorrow(id) {
    if (confirm('Bạn có chắc muốn xoá bản ghi này?')) {

        try {
            await api.delete(`/api/borrows/${id}`)
            message.value = 'Xoá thành công!'
            messageType.value = 'success'
            await fetchBorrows()
        } catch (err) {
            message.value = 'Lỗi khi xoá: ' + (err.response?.data?.message || err.message)
            messageType.value = 'error'
        }
    }
}
</script>

<style scoped>
.v-table th,
.v-table td {
    padding: 12px;
}
</style>
