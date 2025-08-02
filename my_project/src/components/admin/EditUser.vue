<template>
    <div class=" flex justify-center items-center bg-white mt-10">
        <v-card class="w-full max-w-xl mx-auto p-8 rounded-2xl shadow-md border border-gray-200 bg-white" elevation="2">
            <div class="text-center mb-6 mt-4">
                <v-icon size="48" class="text-black mb-2">mdi-account-edit</v-icon>
                <h2 class="text-2xl font-bold text-black">Chỉnh sửa độc giả</h2>
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
                <Field name="name" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Họ tên" prepend-inner-icon="mdi-account" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" :model-value="field.value"
                        @update:model-value="field.value = $event" />
                </Field>

                <Field name="email" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Email" prepend-inner-icon="mdi-email-outline" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" @update:model-value="field.value = $event"
                        :model-value="field.value" />
                </Field>

                <Field name="phone" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Số điện thoại" prepend-inner-icon="mdi-phone" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" @update:model-value="field.value = $event"
                        :model-value="field.value" />
                </Field>

                <Field name="address" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Địa chỉ" prepend-inner-icon="mdi-map-marker" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" @update:model-value="field.value = $event"
                        :model-value="field.value" />
                </Field>

                <Field name="status" v-slot="{ field, errors }">
                    <v-select v-bind="field" :items="['active', 'inactive']" label="Trạng thái" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" :model-value="field.value"
                        @update:model-value="field.value = $event" />
                </Field>

                <Field name="role" v-slot="{ field, errors }">
                    <v-select v-bind="field" :items="['reader', 'admin']" label="Vai trò" variant="outlined"
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
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import api from "@/services/api.service";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        return {
            formKey: 0,
            initialValues: null,
            message: '',          // Thông báo hiển thị
            messageType: '',      // 'success' hoặc 'error'
            schema: yup.object({
                name: yup.string().required("Vui lòng nhập họ tên"),
                email: yup
                    .string()
                    .email("Email không hợp lệ")
                    .required("Vui lòng nhập email"),
                phone: yup.string().required("Vui lòng nhập số điện thoại"),
                address: yup.string().required("Vui lòng nhập địa chỉ"),
                status: yup.string().required("Vui lòng chọn trạng thái"),
                role: yup.string().required("Vui lòng chọn vai trò"),
            }),
        };
    },
    created() {
        this.fetchUser();
    },
    methods: {
        async fetchUser() {
            const id = this.$route.params.id;

            try {
                const response = await api.get(`/api/users/${id}`);
                const user = response.data;

                this.initialValues = {
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                    status: user.status || "active",
                    role: user.role || "reader",
                };

                this.formKey++; // Force re-render Form
            } catch (error) {
                this.message = error.response?.data?.message || 'Lỗi tải thông tin độc giả.';
                this.messageType = 'error';
            }
        },
        async submitForm(values) {
            const id = this.$route.params.id;

            try {
                await api.put(`/api/users/${id}`, values);
                this.message = 'Cập nhật độc giả thành công!';
                this.messageType = 'success';
            } catch (error) {
                this.message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.';
                this.messageType = 'error';
            }
        },
    },
};
</script>

<style scoped>
/* Thêm CSS tùy chỉnh nếu cần */
</style>
