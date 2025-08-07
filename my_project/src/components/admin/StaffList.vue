<template>
    <div class="p-6 bg-white rounded-xl shadow space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Danh sách quản trị</h2>
            <v-btn color="primary" @click="openDialog()">Thêm quản trị</v-btn>
        </div>
        <span v-if="message" :class="{
            'text-green-600': messageType === 'success',
            'text-red-600': messageType === 'error',
            'block text-center mb-4 font-medium': true
        }">
            {{ message }}
        </span>
        <v-text-field v-model="search" label="Tìm kiếm tên hoặc email" prepend-inner-icon="mdi-magnify" />

        <v-table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(reader, index) in filteredReaders" :key="reader._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ reader.ho_ten }}</td>
                    <td>{{ reader.email }}</td>
                    <td>{{ reader.so_dien_thoai || '' }}</td>
                    <td>{{ reader.dia_chi || '' }}</td>
                    <td>
                        <v-chip :color="reader.trang_thai === 'active' ? 'green' : 'red'" variant="flat" size="small">
                            {{ reader.trang_thai === 'active' ? 'Hoạt động' : 'Khoá' }}
                        </v-chip>
                    </td>
                    <td>
                        <v-btn color="blue" class="mr-2 my-2" icon
                            @click="$router.push(`/admin/users/edit/${reader._id}`)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deleteReader(reader._id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    {{ "Thêm Độc giả" }}
                </v-card-title>
                <v-card-text>
                    <span v-if="message" :class="{
                        'text-green-600': messageType === 'success',
                        'text-red-600': messageType === 'error',
                        'block text-center mb-4 font-medium': true
                    }">
                        {{ message }}
                    </span>
                    <Form @submit="saveReader" :validation-schema="readerSchema">
                        <Field name="name" v-slot="{ field, errorMessage, handleBlur }">
                            <v-text-field v-bind="field" @blur="handleBlur" :error-messages="errorMessage" label="Tên"
                                clearable />
                        </Field>
                        <Field name="email" v-slot="{ field, errorMessage, handleBlur }">
                            <v-text-field v-bind="field" @blur="handleBlur" :error-messages="errorMessage" label="Email"
                                clearable />
                        </Field>
                        <Field name="phone" v-slot="{ field, errorMessage, handleBlur }">
                            <v-text-field v-bind="field" @blur="handleBlur" :error-messages="errorMessage"
                                label="Số điện thoại" clearable />
                        </Field>
                        <Field name="address" v-slot="{ field, errorMessage, handleBlur }">
                            <v-text-field v-bind="field" @blur="handleBlur" :error-messages="errorMessage"
                                label="Địa chỉ" clearable />
                        </Field>
                        <Field name="password" v-slot="{ field, errorMessage, handleBlur }">
                            <v-text-field v-bind="field" @blur="handleBlur" :error-messages="errorMessage"
                                label="Mật khẩu" type="password" clearable />
                        </Field>
                        <Field name="status" v-slot="{ field, errorMessage, handleBlur }">
                            <v-select :items="['Hoạt động', 'Khóa']" v-bind="field" @blur="handleBlur"
                                :error-messages="errorMessage" label="Trạng thái" clearable />
                        </Field>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="blue-grey" text @click="closeDialog()">Hủy</v-btn>
                            <v-btn color="primary" type="submit">Lưu</v-btn>
                        </v-card-actions>
                    </Form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';
import api from '@/services/api.service';

const props = defineProps({
    users: {
        type: Array,
        default: () => [],
    },
});
const message = ref('');
const messageType = ref('');   // 'success' hoặc 'error'
const dialog = ref(false);
const search = ref('');
const readers = ref([...props.users]);

const readerSchema = yup.object({
    name: yup.string().required('Vui lòng nhập tên').min(6, 'Tên tối thiểu 6 ký tự'),
    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    phone: yup.string().nullable(),
    address: yup.string().nullable(),
    password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Tối thiểu 6 ký tự'),
    status: yup.string().required('Vui lòng chọn trạng thái'),
});

const filteredReaders = computed(() => {
    return readers.value.filter((r) =>
        (r.name + r.email).toLowerCase().includes(search.value.toLowerCase())
    );
});

function openDialog(reader = null) {
    dialog.value = true;
}
function closeDialog() {
    dialog.value = false
}
async function saveReader(values) {
    const payload = {
        ho_ten: values.name,
        email: values.email,
        so_dien_thoai: values.phone,
        dia_chi: values.address,
        mat_khau: values.password,
        trang_thai: values.status === 'Khóa' ? 'inactive' : 'active',
        vai_tro: 'admin'

    }
    try {
        const res = await api.post('/api/users/register', payload);
        message.value = 'Thêm quản trị thành công!';
        messageType.value = 'success';

        dialog.value = false;

    } catch (err) {
        message.value = 'Có lỗi xảy ra khi lưu quản trị: ' + (err.response?.data?.message || err.message);
        messageType.value = 'error';
    }
}
async function deleteReader(userId) {
    if (!confirm('Bạn có chắc chắn muốn xoá quản trị này không?')) return;

    try {
        console.log(userId);

        await api.delete(`/api/users/${userId}`);
        readers.value = readers.value.filter(r => r._id !== userId);
        message.value = 'Xoá người dùng thành công!';
        messageType.value = 'success';
    } catch (err) {
        message.value = 'Không thể xoá quản trị: ' + (err.response?.data?.message || err.message);
        messageType.value = 'error';
    }
}

</script>