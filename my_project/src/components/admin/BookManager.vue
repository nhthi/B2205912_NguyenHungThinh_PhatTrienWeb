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
                <!-- <tr v-for="(book, index) in filteredBooks" :key="book._id"> -->
                <tr v-for="(book, index) in paginatedBooks" :key="book._id">
                    <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <!-- <td>{{ index + 1 }}</td> -->
                    <td>
                        <img :src="book.anh_bia" alt="Bìa sách" class="w-20 h-28 object-cover rounded shadow my-2" />
                    </td>
                    <td>{{ book.ten_sach }}</td>
                    <td>{{ book.ten_tac_gia }}</td>
                    <td>{{ book.ten_the_loai }}</td>

                    <td>{{ book.ten_nxb }}</td>
                    <td>{{ book.nam_xuat_ban }}</td>
                    <td>{{ book.so_luong }}</td>
                    <td class="">
                        <div class="tooltip-container">
                            <div class="truncate-multi-line">
                                {{ book.mo_ta }}
                            </div>
                            <span class="tooltip-text">{{ book.mo_ta }}</span>
                        </div>
                    </td>
                    <td>
                        <v-btn icon color="blue" class="my-1" @click="$router.push(`/admin/books/edit/${book._id}`)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deleteBook(book._id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <div class="flex justify-between items-center mt-4">
            <span>Trang {{ currentPage }} / {{ totalPages }}</span>
            <div class="space-x-2">
                <v-btn size="small" :disabled="currentPage === 1" @click="currentPage--">Trước</v-btn>
                <v-btn size="small" :disabled="currentPage === totalPages" @click="currentPage++">Sau</v-btn>
            </div>
        </div>
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
                            <v-select v-bind="field" :items="authors" item-title="ho_ten" item-value="_id"
                                label="Tác giả" :error-messages="errorMessage" />
                        </Field>

                        <Field name="categoryId" v-slot="{ field, errorMessage }">
                            <v-select v-bind="field" :items="categories" item-title="ten_the_loai" item-value="_id"
                                label="Thể loại" :error-messages="errorMessage" />
                        </Field>

                        <Field name="publisherId" v-slot="{ field, errorMessage }">
                            <v-select v-bind="field" :items="publishers" item-title="ten_nxb" item-value="_id"
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
const currentPage = ref(1)
const itemsPerPage = ref(5)
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
        b.ten_sach.toLowerCase().includes(search.value.toLowerCase()) ||
        b.ten_tac_gia.toLowerCase().includes(search.value.toLowerCase()) ||
        b.ten_nxb.toLowerCase().includes(search.value.toLowerCase())
    )
)
const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage.value))

const paginatedBooks = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredBooks.value.slice(start, end)
})
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
        books.value = res.data.reverse()
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
    console.log(values);

    try {
        const payload = {
            ma_tac_gia: values.authorId,
            ten_sach: values.title,
            anh_bia: values.coverImage,
            ma_the_loai: values.categoryId,
            mo_ta: values.description,
            ma_nxb: values.publisherId,
            nam_xuat_ban: values.publishYear,
            so_luong: values.quantity
        }
        await api.post('/api/books', payload)
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
import { watch } from 'vue'
watch(search, () => {
    currentPage.value = 1
})
onMounted(() => {
    fetchBooks()
    fetchAuthors()
    fetchCategories()
    fetchPublishers()
})
</script>
<style scoped>
.truncate-multi-line {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    max-width: 300px;
    line-height: 1.4em;
    max-height: 4.2em;
    /* 3 dòng x line-height */
}

.tooltip-container {
    position: relative;
    display: inline-block;
}

.tooltip-text {
    visibility: hidden;
    background-color: black;
    color: #fff;
    text-align: left;
    padding: 5px;
    border-radius: 4px;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    /* phía trên */
    left: 0;
    width: max-content;
    max-width: 300px;
    white-space: normal;
}

.tooltip-container:hover .tooltip-text {
    visibility: visible;
}
</style>