<template>
    <div class="p-6 bg-white rounded-xl shadow space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Quản lý Thể loại</h2>
            <v-btn color="primary" @click="openDialog()">Thêm thể loại</v-btn>
        </div>

        <span v-if="message" :class="{
            'text-green-600': messageType === 'success',
            'text-red-600': messageType === 'error',
            'block text-center mb-4 font-medium': true
        }">
            {{ message }}
        </span>

        <v-text-field v-model="search" label="Tìm kiếm thể loại" prepend-inner-icon="mdi-magnify" />

        <v-table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên thể loại</th>
                    <th>Mô tả</th>

                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in filteredCategories" :key="category._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ category.ten_the_loai }}</td>
                    <td>{{ category.mo_ta }}</td>

                    <td>
                        <v-btn icon color="blue" class="my-2 mr-2"
                            @click="$router.push(`/admin/categories/edit/${category._id}`)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deleteCategory(category._id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    {{ 'Thêm Thể loại' }}
                </v-card-title>
                <v-card-text>
                    <Form @submit="saveCategory" :validation-schema="categorySchema" :initial-values="initialValues">
                        <Field name="name" v-slot="{ field, errorMessage }">
                            <v-text-field v-bind="field" :error-messages="errorMessage" label="Tên thể loại" />
                        </Field>
                        <Field name="description" v-slot="{ field, errorMessage }">
                            <v-textarea v-bind="field" :error-messages="errorMessage" label="Mô tả" auto-grow outlined
                                color="black" class="mb-2" :model-value="field.value"
                                @update:model-value="field.value = $event" />
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
const categories = ref([])

const initialValues = ref({
    name: ''
})

const categorySchema = yup.object({
    name: yup.string().required('Vui lòng nhập tên thể loại')
})

const filteredCategories = computed(() =>
    categories.value.filter(c =>
        c.ten_the_loai.toLowerCase().includes(search.value.toLowerCase())
    )
)

function openDialog() {
    initialValues.value = { name: '' }
    dialog.value = true
}


function closeDialog() {
    dialog.value = false
}

async function saveCategory(values) {
    try {
        const payload = {
            ten_the_loai: values.name,
            mo_ta: values.description
        }
        await api.post('/api/categories', payload)
        message.value = 'Thêm thể loại thành công!'


        messageType.value = 'success'
        await fetchCategories()
        closeDialog()
    } catch (err) {
        message.value = 'Lỗi: ' + (err.response?.data?.message || err.message)
        messageType.value = 'error'
    }
}

async function deleteCategory(id) {
    if (confirm('Bạn có chắc chắn muốn xoá thể loại này?')) {
        try {
            await api.delete(`/api/categories/${id}`)
            message.value = 'Xoá thành công!'
            messageType.value = 'success'
            await fetchCategories()
        } catch (err) {
            message.value = 'Lỗi khi xoá: ' + (err.response?.data?.message || err.message)
            messageType.value = 'error'
        }
    }
}

async function fetchCategories() {
    try {
        const res = await api.get('/api/categories')
        categories.value = res.data.reverse()
    } catch (err) {
        console.error('Lỗi khi lấy danh sách thể loại:', err.response?.data?.message || err.message)
    }
}

onMounted(() => {
    fetchCategories()
})
</script>

<style scoped>
.v-table th,
.v-table td {
    padding: 12px;
}
</style>
