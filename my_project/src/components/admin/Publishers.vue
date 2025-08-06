<template>
    <div class="p-6 bg-white rounded-xl shadow space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Quản lý Nhà Xuất Bản</h2>
            <v-btn color="primary" @click="openDialog()">Thêm NXB</v-btn>
        </div>

        <span v-if="message" :class="{
            'text-green-600': messageType === 'success',
            'text-red-600': messageType === 'error',
            'block text-center mb-4 font-medium': true
        }">
            {{ message }}
        </span>

        <v-text-field v-model="search" label="Tìm kiếm NXB" prepend-inner-icon="mdi-magnify" />

        <v-table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên NXB</th>
                    <th>Địa chỉ</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(publisher, index) in filteredPublishers" :key="publisher._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ publisher.ten_nxb }}</td>
                    <td>{{ publisher.dia_chi }}</td>
                    <td>
                        <v-btn icon color="blue" @click="$router.push(`/admin/publishers/edit/${publisher._id}`)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deletePublisher(publisher._id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    {{ 'Thêm NXB' }}
                </v-card-title>
                <v-card-text>
                    <Form @submit="savePublisher" :validation-schema="publisherSchema">
                        <Field name="name" v-slot="{ field, errorMessage }">
                            <v-text-field v-bind="field" :error-messages="errorMessage" label="Tên NXB" />
                        </Field>
                        <Field name="address" v-slot="{ field, errorMessage }">
                            <v-text-field v-bind="field" :error-messages="errorMessage" label="Địa chỉ" />
                        </Field>

                        <v-card-actions>
                            <v-spacer />
                            <v-btn text @click="closeDialog">Hủy</v-btn>
                            <v-btn color="primary" type="submit">Lưu</v-btn>
                        </v-card-actions>
                    </Form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import api from '@/services/api.service'

const dialog = ref(false)
const search = ref('')
const message = ref('')
const messageType = ref('')

const publishers = ref([])


// Schema xác thực với yup
const publisherSchema = yup.object({
    name: yup.string().required('Vui lòng nhập tên NXB'),
    address: yup.string().required('Vui lòng nhập địa chỉ')
})

// Lọc theo ô tìm kiếm
const filteredPublishers = computed(() =>
    publishers.value.filter(p =>
        p.ten_nxb.toLowerCase().includes(search.value.toLowerCase()) ||
        p.dia_chi.toLowerCase().includes(search.value.toLowerCase())
    )
)

// Mở form thêm mới
function openDialog() {

    dialog.value = true
}



// Đóng dialog
function closeDialog() {
    dialog.value = false
}

// Lưu (thêm mới hoặc cập nhật)
async function savePublisher(values) {
    try {
        const payload = {
            ten_nxb: values.name,
            dia_chi: values.address
        }
        await api.post('/api/publishers', payload)
        message.value = 'Thêm NXB thành công!'

        messageType.value = 'success'
        await fetchPublishers()
        closeDialog()
    } catch (err) {
        message.value = 'Lỗi: ' + (err.response?.data?.message || err.message)
        messageType.value = 'error'
    }
}

// Xoá NXB
async function deletePublisher(id) {
    if (confirm('Bạn có chắc chắn muốn xoá NXB này?')) {
        try {
            await api.delete(`/api/publishers/${id}`)
            message.value = 'Xoá thành công!'
            messageType.value = 'success'
            await fetchPublishers()
        } catch (err) {
            message.value = 'Lỗi khi xoá: ' + (err.response?.data?.message || err.message)
            messageType.value = 'error'
        }
    }
}

// Lấy danh sách NXB
async function fetchPublishers() {
    try {
        const res = await api.get('/api/publishers')
        publishers.value = res.data.reverse()
    } catch (err) {
        console.error('Lỗi khi lấy danh sách NXB:', err.response?.data?.message || err.message)
    }
}

onMounted(() => {
    fetchPublishers()
})
</script>
