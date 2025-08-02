<template>
    <div class="flex justify-center items-center bg-white mt-10">
        <v-card class="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-md border border-gray-200 bg-white"
            elevation="2">
            <div class="text-center mb-6 mt-4">
                <v-icon size="48" class="text-black mb-2">mdi-book-open-page-variant</v-icon>
                <h2 class="text-2xl font-bold text-black">Chỉnh sửa Sách</h2>
            </div>

            <span v-if="message" :class="{
                'text-green-600': messageType === 'success',
                'text-red-600': messageType === 'error',
                'block text-center mb-4 font-medium': true
            }">
                {{ message }}
            </span>

            <Form v-if="initialValues" :key="formKey" @submit="submitForm" :initial-values="initialValues"
                :validation-schema="schema" class="space-y-5 px-6 pb-6">

                <Field name="title" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Tên sách" prepend-inner-icon="mdi-book" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" :model-value="field.value"
                        @update:model-value="field.value = $event" />
                </Field>

                <Field name="authorId" v-slot="{ field, errors }">
                    <v-select v-bind="field" :items="authors" item-title="name" item-value="_id" label="Tác giả"
                        prepend-inner-icon="mdi-account" variant="outlined" color="black" :error-messages="errors"
                        class="mb-2" :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="categoryId" v-slot="{ field, errors }">
                    <v-select v-bind="field" :items="categories" item-title="name" item-value="_id" label="Thể loại"
                        prepend-inner-icon="mdi-tag" variant="outlined" color="black" :error-messages="errors"
                        class="mb-2" :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="publisherId" v-slot="{ field, errors }">
                    <v-select v-bind="field" :items="publishers" item-title="name" item-value="_id" label="Nhà xuất bản"
                        prepend-inner-icon="mdi-domain" variant="outlined" color="black" :error-messages="errors"
                        class="mb-2" :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="publishYear" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Năm xuất bản" type="number" prepend-inner-icon="mdi-calendar"
                        variant="outlined" color="black" :error-messages="errors" class="mb-2"
                        :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="quantity" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Số lượng" type="number" prepend-inner-icon="mdi-counter"
                        variant="outlined" color="black" :error-messages="errors" class="mb-2"
                        :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="description" v-slot="{ field, errors }">
                    <v-textarea v-bind="field" label="Mô tả" prepend-inner-icon="mdi-text" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" :model-value="field.value"
                        @update:model-value="field.value = $event" rows="3" />
                </Field>

                <Field name="coverImage" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Link ảnh bìa" prepend-inner-icon="mdi-image" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" :model-value="field.value"
                        @update:model-value="field.value = $event" />
                </Field>

                <v-btn type="submit" class="bg-black text-white w-full py-3 rounded-md text-base" depressed>
                    Cập nhật
                </v-btn>
            </Form>
        </v-card>
    </div>
</template>

<script>
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import api from '@/services/api.service'

export default {
    components: {
        Form,
        Field,
    },
    data() {
        return {
            formKey: 0,
            initialValues: null,
            message: '',
            messageType: '',
            authors: [],
            categories: [],
            publishers: [],
            schema: yup.object({
                title: yup.string().required('Vui lòng nhập tên sách'),
                authorId: yup.string().required('Chọn tác giả'),
                categoryId: yup.string().required('Chọn thể loại'),
                publisherId: yup.string().required('Chọn nhà xuất bản'),
                publishYear: yup.number().required('Nhập năm xuất bản'),
                quantity: yup.number().required('Nhập số lượng').moreThan(0, 'Số lượng phải lớn hơn 0'),
                description: yup.string().nullable(),
                coverImage: yup.string().url('Phải là một URL hợp lệ').required(),
            }),
        }
    },
    created() {
        this.fetchInitialData()
    },
    methods: {
        async fetchInitialData() {
            const id = this.$route.params.id
            try {
                const [bookRes, authorsRes, categoriesRes, publishersRes] = await Promise.all([
                    api.get(`/api/books/${id}`),
                    api.get('/api/authors'),
                    api.get('/api/categories'),
                    api.get('/api/publishers'),
                ])

                const book = bookRes.data
                this.initialValues = {
                    title: book.title,
                    authorId: book.authorId || '',
                    categoryId: book.categoryId || '',
                    publisherId: book.publisherId || '',
                    publishYear: book.publishYear,
                    quantity: book.quantity,
                    description: book.description,
                    coverImage: book.coverImage,
                }

                this.authors = authorsRes.data
                this.categories = categoriesRes.data
                this.publishers = publishersRes.data
                this.formKey++
            } catch (err) {
                this.message = 'Lỗi khi tải dữ liệu: ' + (err.response?.data?.message || err.message)
                this.messageType = 'error'
            }
        },
        async submitForm(values) {
            const id = this.$route.params.id
            try {
                await api.put(`/api/books/${id}`, values)
                this.message = 'Cập nhật sách thành công!'
                this.messageType = 'success'
                setTimeout(() => this.$router.push('/admin/books'), 1000)
            } catch (err) {
                this.message = 'Lỗi khi cập nhật: ' + (err.response?.data?.message || err.message)
                this.messageType = 'error'
            }
        },
    },
}
</script>

<style scoped>
/* Tuỳ chọn thêm */
</style>
