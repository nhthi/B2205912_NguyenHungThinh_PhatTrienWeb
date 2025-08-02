<template>
    <div class="flex justify-center items-center bg-white mt-10">
        <v-card class="w-full max-w-xl mx-auto p-8 rounded-2xl shadow-md border border-gray-200 bg-white" elevation="2">
            <div class="text-center mb-6 mt-4">
                <v-icon size="48" class="text-black mb-2">mdi-domain</v-icon>
                <h2 class="text-2xl font-bold text-black">Chỉnh sửa Nhà xuất bản</h2>
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
                    <v-text-field v-bind="field" label="Tên nhà xuất bản" prepend-inner-icon="mdi-domain"
                        variant="outlined" color="black" :error-messages="errors" class="mb-2"
                        :model-value="field.value" @update:model-value="field.value = $event" />
                </Field>

                <Field name="address" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Địa chỉ" prepend-inner-icon="mdi-map-marker" variant="outlined"
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
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import api from "@/services/api.service";

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
            schema: yup.object({
                name: yup.string().required("Vui lòng nhập tên nhà xuất bản"),
                address: yup.string().required("Vui lòng nhập địa chỉ"),
            }),
        };
    },
    created() {
        this.fetchPublisher();
    },
    methods: {
        async fetchPublisher() {
            const id = this.$route.params.id;
            try {
                const response = await api.get(`/api/publishers/${id}`);
                const publisher = response.data;

                this.initialValues = {
                    name: publisher.name || "",
                    address: publisher.address || "",
                };

                this.formKey++;
            } catch (error) {
                this.message = error.response?.data?.message || "Lỗi tải thông tin nhà xuất bản.";
                this.messageType = "error";
            }
        },
        async submitForm(values) {
            const id = this.$route.params.id;
            try {
                await api.put(`/api/publishers/${id}`, values);
                this.message = "Cập nhật nhà xuất bản thành công!";
                this.messageType = "success";
            } catch (error) {
                this.message = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật.";
                this.messageType = "error";
            }
        },
    },
};
</script>

<style scoped>
/* Thêm style nếu cần */
</style>
