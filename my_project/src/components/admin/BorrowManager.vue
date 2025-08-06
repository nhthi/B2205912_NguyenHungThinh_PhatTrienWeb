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
                    <th>Duyệt/ Trả</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(borrow, index) in filteredBorrows" :key="borrow._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ borrow.docgia.ho_ten }}</td>
                    <td>{{ borrow.sach.ten_sach }}</td>
                    <td>{{ formatDate(borrow.ngay_muon) }}</td>
                    <td>{{ formatDate(borrow.han_tra) }}</td>

                    <td>{{ borrow.ngay_tra_thuc_te ? formatDate(borrow.ngay_tra_thuc_te) : '---' }}</td>
                    <td>
                        <span :class="{
                            'text-red-600 font-semibold': borrow.tien_phat > 0,
                            'text-gray-500': borrow.tien_phat === 0
                        }">
                            {{ formatCurrency(borrow.tien_phat) }}
                        </span>
                    </td>
                    <td>
                        <v-chip class="font-bold"
                            :color="borrow.trang_thai === 'borrowing' ? 'blue' : borrow.trang_thai === 'pending' ? 'red' : 'green'"
                            variant="flat">
                            <span class="font-bold">{{ borrow.trang_thai === 'pending' ? 'Chờ duyệt' : borrow.trang_thai
                                === 'borrowing' ? 'Đang mượn' : 'Đã trả' }}</span>
                        </v-chip>
                    </td>
                    <td class="text-center">
                        <v-btn v-if="borrow.trang_thai === 'pending'" color="warning" size="small"
                            class="text-white font-bold" @click="handleApprove(borrow._id)">
                            <v-icon size="18" class="mr-1">mdi-check</v-icon>
                            <span class="font-bold">Duyệt</span>
                        </v-btn>
                        <v-btn v-else color="success" size="small" class="text-white font-bold"
                            @click="handleReturn(borrow._id)" :disabled="borrow.trang_thai !== 'borrowing'">
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
        borrows.value = res.data.reverse()
        console.log(borrows.value);

    } catch (err) {
        message.value = 'Lỗi khi tải dữ liệu'
        messageType.value = 'error'
    }
}

onMounted(fetchBorrows)

const filteredBorrows = computed(() => {
    const q = search.value.toLowerCase()
    return borrows.value.filter(
        (b) => b.docgia.ho_ten.toLowerCase().includes(q) || b.sach.ten_sach.toLowerCase().includes(q)
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

async function handleApprove(borrowId) {
    try {
        await api.put(`/api/borrows/${borrowId}`, {
            trang_thai: 'borrowing', // hoặc dùng dayjs nếu cần định dạng
        });
        message.value = 'Duyệt đăng ký mượn thành công!'
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
