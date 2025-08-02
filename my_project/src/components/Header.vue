<template>
    <v-app-bar app flat color="white" elevation="1">
        <!-- Logo và tiêu đề -->
        <v-row class="align-center ml-2" no-gutters>
            <v-icon color="primary" size="28">mdi-book-open-page-variant</v-icon>
            <v-toolbar-title class="text-primary font-weight-bold text-h6 ml-2">
                Quản lý Thư viện
            </v-toolbar-title>
        </v-row>

        <v-spacer />

        <!-- Menu navigation -->
        <div class="d-none d-md-flex align-center">
            <v-btn variant="text" to="/" class="nav-btn">Trang chủ</v-btn>
            <v-btn variant="text" to="/books" class="nav-btn">Sách</v-btn>
            <v-btn variant="text" to="/users" class="nav-btn">Người dùng</v-btn>
        </div>

        <!-- Dropdown user -->
        <v-menu offset-y>
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="text" class="ml-2 px-2">
                    <v-avatar size="32" class="me-2">
                        <img src="https://i.pravatar.cc/300" alt="Avatar" />
                    </v-avatar>
                    <span class="text-body-1 font-weight-medium">Admin</span>
                    <v-icon end>mdi-chevron-down</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item to="/profile">
                    <v-list-item-title>Hồ sơ</v-list-item-title>
                </v-list-item>
                <v-list-item to="/logout">
                    <v-list-item-title>Đăng xuất</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <!-- Mobile Menu -->
        <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />

        <v-navigation-drawer v-model="drawer" temporary location="right" class="d-md-none">
            <v-list>
                <v-list-item to="/">
                    <v-list-item-title>Trang chủ</v-list-item-title>
                </v-list-item>
                <v-list-item to="/books">
                    <v-list-item-title>Sách</v-list-item-title>
                </v-list-item>
                <v-list-item to="/users">
                    <v-list-item-title>Người dùng</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item to="/profile">
                    <v-list-item-title>Hồ sơ</v-list-item-title>
                </v-list-item>
                <v-list-item to="/logout">
                    <v-list-item-title>Đăng xuất</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-app-bar>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            drawer: false,
        };
    },
};
</script>

<style scoped>
.nav-btn {
    color: #333;
    font-weight: 500;
    margin: 0 6px;
    transition: 0.3s;
}

.nav-btn:hover {
    background-color: #f1f1f1;
    color: #1a237e;
    border-radius: 8px;
}
</style>
