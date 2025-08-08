<template>
    <v-app-bar app color="black" dark flat>
        <v-toolbar-title>📚 Thư Viện Trực Tuyến</v-toolbar-title>
        <v-spacer></v-spacer>

        <router-link to="/"><v-btn text>Trang chủ</v-btn></router-link>
        <router-link to="/books"><v-btn text>Sách</v-btn></router-link>

        <template v-if="isLoggedIn">
            <v-menu offset-y>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" text class="d-flex align-center">
                        <v-avatar size="32" class="mr-2">
                            <img :src="user.anh_dai_dien || defaultAvatar" alt="Avatar" />
                        </v-avatar>
                        <span>{{ user.name || 'Tài khoản' }}</span>
                    </v-btn>
                </template>

                <v-list class="mt-4">
                    <v-list-item @click="goToProfile" class="hover:bg-gray-100 transition duration-200 cursor-pointer">
                        <v-list-item-title>Thông tin cá nhân</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="user.role === 'admin'" @click="goToDashboard"
                        class="hover:bg-gray-100 transition duration-200 cursor-pointer">
                        <v-list-item-title>Quản lí thư viện</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout"
                        class="hover:bg-red-100 text-red-600 transition duration-200 cursor-pointer">
                        <v-list-item-title>Đăng xuất</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>

        <template v-else>
            <router-link to="/login"><v-btn text>Đăng nhập</v-btn></router-link>
            <router-link to="/register"><v-btn text>Đăng ký</v-btn></router-link>
        </template>
    </v-app-bar>
</template>


<script>
export default {
    data() {
        return {
            user: {},
            defaultAvatar: 'https://i.pravatar.cc/300' // ảnh mặc định nếu user không có avatar
        }
    },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('token')
        }
    },
    created() {
        if (this.isLoggedIn) {
            const storedUser = localStorage.getItem('user')
            this.user = storedUser ? JSON.parse(storedUser) : {}
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.$router.push('/login')
            window.location.reload();
        },
        goToProfile() {
            this.$router.push('/profile')
        },
        goToDashboard() {
            this.$router.push('/admin/dashboard')
        }
    }
}
</script>
