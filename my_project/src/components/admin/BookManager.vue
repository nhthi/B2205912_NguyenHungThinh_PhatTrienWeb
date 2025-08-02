<template>
    <div class="p-6 bg-white rounded-xl shadow space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Quản lý Sách</h2>
            <v-btn color="primary" @click="openDialog()">Thêm Sách</v-btn>
        </div>

        <span v-if="message" :class="{
            'text-green-600': messageType === 'success',
            'text-red-600': messageType === 'error',
            'block text-center mb-4 font-medium': true
        }">
            {{ message }}
        </span>

        <v-text-field v-model="search" label="Tìm kiếm Sách" prepend-inner-icon="mdi-magnify" />

        <v-table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Ảnh bìa</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Thể loại</th>

                    <th>Nhà xuất bản</th>
                    <th>Năm xuất bản</th>
                    <th>Số lượng</th>
                    <th>Mô tả</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, index) in filteredBooks" :key="book._id">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <img :src="book.coverImage" alt="Bìa sách" class="w-20 h-28 object-cover rounded shadow my-2" />
                    </td>
                    <td>{{ book.title }}</td>
                    <td>{{ book.author }}</td>
                    <td>{{ book.category }}</td>

                    <td>{{ book.publisher }}</td>
                    <td>{{ book.publishYear }}</td>
                    <td>{{ book.quantity }}</td>
                    <td>{{ book.description }}</td>
                    <td>
                        <v-btn icon color="blue" @click="$router.push(`/admin/books/edit/${book._id}`)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deleteBook(book._id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <!-- Dialog Thêm/Sửa -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    {{ 'Thêm Sách' }}
                </v-card-title>
                <v-card-text class="overflow-auto no-scrollbar">
                    <Form @submit="saveBook" :validation-schema="bookSchema">
                        <Field name="title" v-slot="{ field, errorMessage }">
                            <v-text-field v-bind="field" label="Tên sách" :error-messages="errorMessage" />
                        </Field>

                        <Field name="authorId" v-slot="{ field, errorMessage }">
                            <v-select v-bind="field" :items="authors" item-title="name" item-value="_id" label="Tác giả"
                                :error-messages="errorMessage" />
                        </Field>

                        <Field name="categoryId" v-slot="{ field, errorMessage }">
                            <v-select v-bind="field" :items="categories" item-title="name" item-value="_id"
                                label="Thể loại" :error-messages="errorMessage" />
                        </Field>

                        <Field name="publisherId" v-slot="{ field, errorMessage }">
                            <v-select v-bind="field" :items="publishers" item-title="name" item-value="_id"
                                label="Nhà xuất bản" :error-messages="errorMessage" />
                        </Field>

                        <Field name="publishYear" v-slot="{ field, errorMessage }">
                            <v-text-field v-bind="field" label="Năm xuất bản" type="number"
                                :error-messages="errorMessage" />
                        </Field>

                        <Field name="quantity" v-slot="{ field, errorMessage }">
                            <v-text-field v-bind="field" label="Số lượng" type="number"
                                :error-messages="errorMessage" />
                        </Field>

                        <Field name="description" v-slot="{ field, errorMessage }">
                            <v-textarea v-bind="field" label="Mô tả" rows="3" :error-messages="errorMessage" />
                        </Field>

                        <Field name="coverImage" v-slot="{ field, errorMessage }">
                            <v-text-field v-bind="field" label="Link ảnh bìa" :error-messages="errorMessage" />
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

// Data
const books = ref([])
const dialog = ref(false)
const search = ref('')
const message = ref('')
const messageType = ref('')
const authors = ref([])
const categories = ref([])
const publishers = ref([])
// Schema xác thực
const bookSchema = yup.object({
    title: yup.string().required('Vui lòng nhập tên sách'),
    authorId: yup.string().required('Chọn tác giả'),
    categoryId: yup.string().required('Chọn thể loại'),
    publisherId: yup.string().required('Chọn nhà xuất bản'),
    publishYear: yup.number().required('Nhập năm xuất bản'),
    quantity: yup.number().required('Nhập số lượng').moreThan(0, 'Số lượng phải lớn hơn 0'),
    description: yup.string().nullable(),
    coverImage: yup.string().url('Phải là một URL hợp lệ').required()
})

// Lọc danh sách theo từ khóa
const filteredBooks = computed(() =>
    books.value.filter(b =>
        b.title.toLowerCase().includes(search.value.toLowerCase()) ||
        b.author.toLowerCase().includes(search.value.toLowerCase()) ||
        b.publisher.toLowerCase().includes(search.value.toLowerCase())
    )
)
async function fetchAuthors() {
    const res = await api.get('/api/authors')
    authors.value = res.data
}

async function fetchCategories() {
    const res = await api.get('/api/categories')
    categories.value = res.data
}

async function fetchPublishers() {
    const res = await api.get('/api/publishers')
    publishers.value = res.data
}
// Lấy danh sách sách từ API
async function fetchBooks() {
    try {
        const res = await api.get('/api/books/details')
        books.value = res.data
    } catch (err) {
        console.error('Lỗi khi tải sách:', err.response?.data?.message || err.message)
    }
}

// Mở dialog thêm mới
function openDialog() {
    dialog.value = true
}


// Đóng dialog
function closeDialog() {
    dialog.value = false
}

// Lưu sách (thêm hoặc cập nhật)
async function saveBook(values) {
    try {
        await api.post('/api/books', values)
        message.value = 'Thêm sách thành công!'

        messageType.value = 'success'
        await fetchBooks()
        closeDialog()
    } catch (err) {
        message.value = 'Lỗi: ' + (err.response?.data?.message || err.message)
        messageType.value = 'error'
    }
}

// Xoá sách
async function deleteBook(id) {
    if (confirm('Bạn có chắc chắn muốn xoá sách này?')) {
        try {
            await api.delete(`/api/books/${id}`)
            message.value = 'Xoá sách thành công!'
            messageType.value = 'success'
            await fetchBooks()
        } catch (err) {
            message.value = 'Lỗi khi xoá: ' + (err.response?.data?.message || err.message)
            messageType.value = 'error'
        }
    }
}

onMounted(() => {
    fetchBooks()
    fetchAuthors()
    fetchCategories()
    fetchPublishers()
})
</script>
