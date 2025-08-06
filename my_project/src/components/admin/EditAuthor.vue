<template>
    <div class="flex justify-center items-center bg-white mt-10">
        <v-card class="w-full max-w-xl mx-auto p-8 rounded-2xl shadow-md border border-gray-200 bg-white" elevation="2">
            <div class="text-center mb-6 mt-4">
                <v-icon size="48" class="text-black mb-2">mdi-account-edit</v-icon>
                <h2 class="text-2xl font-bold text-black">Chỉnh sửa Tác giả</h2>
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
                    <v-text-field v-bind="field" label="Tên tác giả" prepend-inner-icon="mdi-account" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" :model-value="field.value"
                        @update:model-value="field.value = $event" />
                </Field>

                <Field name="nationality" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Quốc tịch" prepend-inner-icon="mdi-earth" variant="outlined"
                        color="black" :error-messages="errors" class="mb-2" :model-value="field.value"
                        @update:model-value="field.value = $event" />
                </Field>

                <Field name="biography" v-slot="{ field, errors }">
                    <v-textarea v-bind="field" label="Tiểu sử" prepend-inner-icon="mdi-book-open-page-variant"
                        variant="outlined" color="black" :error-messages="errors" rows="4" class="mb-2"
                        :model-value="field.value" @update:model-value="field.value = $event" />
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
                name: yup.string().required("Vui lòng nhập tên tác giả"),
                nationality: yup.string().required("Vui lòng nhập quốc tịch"),
                biography: yup.string().nullable(),
            }),
        };
    },
    created() {
        this.fetchAuthor();
    },
    methods: {
        async fetchAuthor() {
            const id = this.$route.params.id;
            try {
                const response = await api.get(`/api/authors/${id}`);
                const author = response.data;

                this.initialValues = {
                    name: author.ho_ten || "",
                    nationality: author.quoc_tich || "",
                    biography: author.tieu_su || "",
                };

                this.formKey++; // Re-render form
            } catch (error) {
                this.message = error.response?.data?.message || "Lỗi tải thông tin tác giả.";
                this.messageType = "error";
            }
        },
        async submitForm(values) {
            const id = this.$route.params.id;
            try {
                const payload = {
                    ho_ten: values.name,
                    tieu_su: values.biography,
                    quoc_tich: values.nationality
                }
                await api.put(`/api/authors/${id}`, payload);
                this.message = "Cập nhật tác giả thành công!";
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
/* Bạn có thể thêm style nếu cần */
</style>
