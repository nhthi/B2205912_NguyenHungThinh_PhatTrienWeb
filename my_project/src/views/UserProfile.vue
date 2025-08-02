<template>
    <div class="max-w-5xl mx-auto py-10 px-4 space-y-5" v-if="user">
        <!-- Thông tin cá nhân -->
        <v-card class="rounded-2xl shadow-md bg-white p-6 px-6 py-6">
            <div class="flex items-center gap-6">
                <v-avatar size="80">
                    <img :src="user.avatar || 'https://cdn-icons-png.flaticon.com/512/8345/8345328.png'" alt="avatar" />
                </v-avatar>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
                    <p class="text-gray-600">{{ user.email }}</p>
                    <p class="text-gray-600">{{ user.phone }}</p>
                    <p class="text-gray-600">{{ user.address }}</p>
                    <span class="inline-block mt-1 px-3 py-1 bg-black text-white text-sm rounded-full">
                        {{ user.role }}
                    </span>
                </div>
                <div class="ml-auto">
                    <v-btn color="black" class="text-white" @click="editProfile">
                        <v-icon start class="mr-1">mdi-account-edit</v-icon>
                        Chỉnh sửa
                    </v-btn>
                </div>
            </div>
        </v-card>

        <!-- Bảng sách đã mượn -->
        <v-card class=" shadow bg-white p-6 px-6 py-6 my-8">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Sách đã mượn</h3>
            <v-table dense class="w-full text-sm" v-if="borrowedBooks.length > 0">
                <thead>
                    <tr class="bg-gray-100 text-gray-700">
                        <th class="py-2 px-3 text-left">Bìa sách</th>
                        <th class="py-2 px-3 text-left">Tiêu đề</th>
                        <th class="py-2 px-3 text-left">Số lượng</th>

                        <th class="py-2 px-3 text-left">Ngày mượn</th>

                        <th class="py-2 px-3 text-left">Hạn trả</th>
                        <th class="py-2 px-3 text-left">Ngày trả thực tế</th>
                        <th class="py-2 px-3 text-left">Tiền phạt</th>
                        <th class="py-2 px-3 text-left">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="book in borrowedBooks" :key="book.id" class="border-t">
                        <td class="py-2 px-3">
                            <v-img :src="book.book.coverImage" max-width="50" height="70"
                                class="rounded shadow-sm"></v-img>
                        </td>
                        <td class="py-2 px-3">{{ book.book.title }}</td>
                        <th class="py-2 px-3 text-left">{{ book.quantity || 1 }}</th>

                        <td class="py-2 px-3">{{ formatDate(book.borrowDate) }}</td>
                        <td class="py-2 px-3">{{ formatDate(book.dueDate) }}</td>
                        <td class="py-2 px-3">{{ formatDate(book.returnDate) || '---' }}</td>
                        <td class="py-2 px-3">
                            {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.fine)
                            }}
                        </td>

                        <td class="py-2 px-3">
                            <span :class="{
                                'text-yellow-600 font-bold': book.status === 'pending',
                                'text-blue-600 font-bold': book.status === 'borrowing',
                                'text-green-600 font-bold': book.status === 'returned'
                            }">
                                {{
                                    book.status === 'pending'
                                        ? 'Chờ duyệt'
                                        : book.status === 'borrowing'
                                            ? 'Đang mượn'
                                            : 'Đã trả'
                                }}
                            </span>
                        </td>

                    </tr>
                </tbody>
            </v-table>
            <div v-else class=" text-gray-500 text-sm mt-4 italic">
                Bạn chưa mượn quyển sách nào.
            </div>
        </v-card>

        <!-- Đánh giá đã viết -->
        <v-card class="rounded-2xl shadow bg-white p-6 px-6 px-6 py-6">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Đánh giá đã viết</h3>
            <v-alert v-if="deleteMessage" type="success" dense text>
                {{ deleteMessage }}
            </v-alert>
            <v-divider class="mb-6" />
            <v-table v-if="reviews.length">
                <thead>
                    <tr>
                        <th>Sách</th>
                        <th>Sao</th>
                        <th>Nội dung</th>
                        <th>Ngày đăng</th>
                        <th>Xóa</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(review, index) in reviews" :key="index">
                        <td>{{ review.bookTitle }}</td>
                        <td>{{ review.rating }} ⭐</td>
                        <td>{{ review.comment }}</td>
                        <td>{{ review.date }}</td>
                        <td>
                            <v-btn size="small" icon color="red" @click="deleteReview(review._id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div v-else class="text-gray-500 italic">Bạn chưa viết đánh giá nào.</div>
        </v-card>

        <!-- Dialog chỉnh sửa -->
        <v-dialog v-model="editDialog" max-width="500">
            <v-card class="px-6 py-6">
                <h3 class="text-lg font-semibold mb-4">Chỉnh sửa thông tin cá nhân</h3>
                <v-alert v-if="serverError" type="error" dense text>
                    {{ serverError }}
                </v-alert>
                <v-text-field label="Họ tên" v-model="editForm.name" :rules="[v => !!v || 'Họ tên không được để trống']"
                    dense outlined />
                <v-text-field label="Email" v-model="editForm.email" :rules="[v => !!v || 'Email không được để trống']"
                    dense outlined />
                <v-text-field label="Số điện thoại" v-model="editForm.phone"
                    :rules="[v => !!v || 'Số điện thoại không được để trống']" dense outlined />
                <v-text-field label="Địa chỉ" v-model="editForm.address"
                    :rules="[v => !!v || 'Địa chỉ không được để trống']" dense outlined />

                <div class="mt-4 flex justify-end gap-2">
                    <v-btn @click="closeDialog" text>Hủy</v-btn>
                    <v-btn color="primary" @click="saveProfile">Lưu</v-btn>
                </div>
            </v-card>
        </v-dialog>

    </div>


</template>

<script>
import api from '@/services/api.service'

export default {
    name: "UserProfile",
    data() {
        return {
            user: null
            ,
            borrowedBooks: [
            ],
            reviews: [

            ],
            editDialog: false,
            editForm: {
                name: '',
                email: '',
                phone: '',
                address: ''
            },
            serverError: "",
            deleteMessage: ""
        };
    },
    mounted() {
        this.fetchUserProfile();
        this.fetchUserBorrows();
        this.fetchUserComments();
    },
    methods: {
        async deleteReview(commentId) {
            if (!confirm("Bạn có chắc muốn xoá đánh giá này?")) return;

            try {
                await api.delete(`/api/comments/${commentId}`);
                this.reviews = this.reviews.filter(r => r._id !== commentId);
                this.deleteMessage = "Đánh giá đã được xoá thành công ✅"
                setTimeout(() => {
                    this.deleteMessage = "";
                }, 3000);
            } catch (error) {
                console.error("Lỗi khi xoá đánh giá:", error);
            }
        },
        editProfile() {
            if (this.user) {
                this.editForm = { ...this.user };
                this.editDialog = true;
            }
        },
        closeDialog() {
            this.editDialog = false
            this.serverError = ""

        },
        async saveProfile() {
            try {
                if (!this.editForm.name || !this.editForm.email || !this.editForm.phone || !this.editForm.address) {
                    this.serverError = "❗ Vui lòng nhập đầy đủ thông tin";
                    return;
                }
                const response = await api.put(`/api/users/${this.user._id}`, this.editForm);
                this.user = response.data; // Cập nhật lại thông tin hiển thị
                this.editDialog = false;
                alert("✅ Cập nhật thông tin thành công!");
                this.serverError = ""
                await this.fetchUserProfile()
            } catch (error) {
                this.serverError =
                    error.response?.data?.message || "❌ Cập nhật không thành công. Vui lòng thử lại.";
            }
        },
        async fetchUserProfile() {
            try {
                const response = await api.get('/api/users/profile')
                this.user = response.data

                // this.borrowedBooks = response.data.borrowedBooks || []
                // this.reviews = response.data.reviews || []
            } catch (error) {
                console.error('Lỗi khi tải thông tin người dùng:', error)
                this.$router.push('/login') // Đưa về đăng nhập nếu lỗi xác thực
            }
        },
        async fetchUserComments() {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const userId = user?.id;

                if (!userId) return;

                const response = await api.get(`/api/comments/users/${userId}`);
                this.reviews = response.data.map(item => ({
                    bookTitle: item.bookTitle,
                    rating: item.rating,
                    comment: item.content,
                    date: this.formatDate(item.createdAt),
                    _id: item._id
                }));
            } catch (error) {
                console.error("Lỗi khi tải đánh giá:", error);
            }
        },
        async fetchUserBorrows() {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const userId = user?.id;
                if (!userId) {
                    this.borrowErrorMessage = "❌ Người dùng không tồn tại!";
                    return;
                }
                const response = await api.get(`/api/borrows/user/${userId}`)

                this.borrowedBooks = response.data || []
            } catch (error) {
                console.error('Lỗi khi tải thông tin người dùng:', error)
                this.$router.push('/login') // Đưa về đăng nhập nếu lỗi xác thực
            }
        },
        formatDate(date) {
            return date ? new Date(date).toLocaleDateString('vi-VN') : '---';
        }
    },
};
</script>

<style scoped>
.v-table th,
.v-table td {
    padding: 12px;
}
</style>
