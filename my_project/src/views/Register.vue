<template>
    <div class="h-[80vh] flex justify-center items-center bg-white mt-10">
        <v-card class="w-full max-w-md mx-auto p-8 rounded-2xl shadow-md border border-gray-200 bg-white" elevation="2">
            <div class="text-center mb-6 mt-4">
                <v-icon size="48" class="text-black mb-2">mdi-account-plus</v-icon>
                <h2 class="text-2xl font-bold text-black">Đăng ký</h2>
                <v-alert v-if="serverError" type="error" dense text>
                    {{ serverError }}
                </v-alert>
            </div>

            <Form @submit="submitRegister" :validation-schema="schema" class="space-y-5 px-6 pb-6">
                <Field name="name" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Họ và tên" prepend-inner-icon="mdi-account-outline"
                        variant="outlined" color="black" :error-messages="errors" class="mb-4" />
                </Field>

                <Field name="email" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" label="Email" prepend-inner-icon="mdi-email-outline" variant="outlined"
                        color="black" :error-messages="errors" class="mb-4" />
                </Field>

                <Field name="password" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" :type="showPassword ? 'text' : 'password'" label="Mật khẩu"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showPassword = !showPassword" variant="outlined" color="black"
                        :error-messages="errors" class="mb-4" />
                </Field>

                <Field name="confirmPassword" v-slot="{ field, errors }">
                    <v-text-field v-bind="field" :type="showPassword ? 'text' : 'password'" label="Nhập lại mật khẩu"
                        prepend-inner-icon="mdi-lock-check-outline"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showPassword = !showPassword" variant="outlined" color="black"
                        :error-messages="errors" class="mb-4" />
                </Field>
                <v-btn type="submit" class="bg-black text-white w-full py-3 rounded-md text-base" depressed>
                    Đăng ký
                </v-btn>
            </Form>

            <p class="text-sm text-gray-600 my-4 text-center">
                Đã có tài khoản?
                <router-link to="/login" class="text-black hover:underline">Đăng nhập</router-link>
            </p>
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
            showPassword: false,
            schema: yup.object({
                name: yup.string().required("Họ và tên không được để trống"),
                email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
                password: yup.string().min(6, "Mật khẩu phải ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
                confirmPassword: yup
                    .string()
                    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
                    .required("Vui lòng nhập lại mật khẩu"),
            }),
            serverError: ""
        }
    },
    methods: {
        async submitRegister(values) {
            try {
                const response = await api.post('/api/users/register', {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                });
                alert("Đăng ký thành công!");
                this.$router.push('/login');
            } catch (error) {
                this.serverError = (error.response?.data?.message || error.message)
            }
        },
    },
}
</script>
