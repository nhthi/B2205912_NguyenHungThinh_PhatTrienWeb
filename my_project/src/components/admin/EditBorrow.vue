<template>
    <div class="flex justify-center items-center bg-white mt-10">
        <v-card class="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-md border border-gray-200 bg-white"
            elevation="2">
            <div class="text-center mb-6 mt-4">
                <v-icon size="48" class="text-black mb-2">mdi-calendar-edit</v-icon>
                <h2 class="text-2xl font-bold text-black">Chỉnh sửa Mượn Sách</h2>
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

                <Field name="userId" v-slot="{ field, errors }">
                    <v-select v-bind="field" :items="users" item-title="ho_ten" item-value="_id" label="Độc giả"
                        prepend-inner-icon="mdi-account" variant="outlined" color="black" :error-messages="errors"
                        class="mb-2" :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="bookId" v-slot="{ field, errors }">
                    <v-select v-bind="field" :items="books" item-title="ten_sach" item-value="_id" label="Tên sách"
                        prepend-inner-icon="mdi-book" variant="outlined" color="black" :error-messages="errors"
                        class="mb-2" :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="borrowDate" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Ngày mượn" type="date" prepend-inner-icon="mdi-calendar"
                        variant="outlined" color="black" :error-messages="errors" class="mb-2"
                        :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="dueDate" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Ngày trả" type="date" prepend-inner-icon="mdi-calendar-check"
                        variant="outlined" color="black" :error-messages="errors" class="mb-2"
                        :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="fine" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Tiền phạt (VNĐ)" type="number"
                        prepend-inner-icon="mdi-currency-usd" variant="outlined" color="black" :error-messages="errors"
                        class="mb-2" :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="status" v-slot="{ field, errors }">
                    <v-select v-bind="field" :items="['borrowing', 'returned', 'pending']" label="Trạng thái"
                        prepend-inner-icon="mdi-information" variant="outlined" color="black" :error-messages="errors"
                        class="mb-2" :model-value="field.value" @update:model-value="field.value = $event" />
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
    components: { Form, Field },
    data() {
        return {
            formKey: 0,
            initialValues: null,
            message: '',
            messageType: '',
            users: [],
            books: [],
            schema: yup.object({
                userId: yup.string().required('Vui lòng chọn độc giả'),
                bookId: yup.string().required('Vui lòng chọn sách'),
                borrowDate: yup.date().required('Chọn ngày mượn'),
                dueDate: yup.date().nullable(),
                fine: yup.number().min(0).required('Tiền phạt không hợp lệ'),
                status: yup.string().required('Chọn trạng thái'),
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
                const [borrowRes, usersRes, booksRes] = await Promise.all([
                    api.get(`/api/borrows/${id}`),
                    api.get('/api/users'),
                    api.get('/api/books'),
                ])

                const borrow = borrowRes.data
                this.initialValues = {
                    userId: borrow.ma_doc_gia,
                    bookId: borrow.ma_sach,
                    borrowDate: borrow.ngay_muon.split('T')[0],
                    dueDate: borrow.han_tra ? borrow.han_tra.split('T')[0] : '',
                    fine: borrow.tien_phat,
                    status: borrow.trang_thai,
                    returnDate: borrow.ngay_tra_thuc_te
                }

                this.users = usersRes.data
                this.books = booksRes.data
                this.formKey++
            } catch (err) {
                this.message = 'Lỗi khi tải dữ liệu: ' + (err.response?.data?.message || err.message)
                this.messageType = 'error'
            }
        },
        async submitForm(values) {
            const id = this.$route.params.id
            try {
                const payload = {
                    ma_doc_gia: values.userId,
                    ma_sach: values.bookId,
                    ngay_muon: values.borrowDate,
                    han_tra: values.dueDate,
                    tien_phat: values.fine,
                    trang_thai: values.status,
                    ngay_tra_thuc_te: values.returnDate
                }
                console.log(payload);

                await api.put(`/api/borrows/${id}`, payload)
                this.message = 'Cập nhật phiếu mượn thành công!'
                this.messageType = 'success'
                setTimeout(() => this.$router.push('/admin/borrows'), 1000)
            } catch (err) {
                this.message = 'Lỗi khi cập nhật: ' + (err.response?.data?.message || err.message)
                this.messageType = 'error'
            }
        },
    },
}
</script>

<style scoped>
/* Tuỳ chỉnh giao diện thêm nếu cần */
</style>