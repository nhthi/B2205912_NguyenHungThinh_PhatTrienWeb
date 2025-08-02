<template>
    <div class="max-w-6xl mx-auto py-10 px-4">
        <v-card class="rounded-2xl shadow-md bg-white p-6">
            <!-- Thông tin sách -->
            <div class="grid md:grid-cols-2 gap-8 mb-10 px-6" v-if="book">
                <v-img :src="book.coverImage" class="rounded-xl shadow h-96 object-contain"></v-img>
                <div class="flex flex-col justify-between">
                    <div>
                        <h1 class="text-3xl font-semibold text-gray-900 mb-2">{{ book.title }}</h1>
                        <p class="text-gray-600 text-sm mb-4">
                            Tác giả: <span class="font-medium">{{ book.author.name }}</span>
                        </p>
                        <p class="text-gray-600 mb-6">{{ book.description }}</p>
                        <div class="flex items-center flex-wrap gap-3 text-gray-700 text-sm">
                            <div class="flex items-center gap-1">
                                <v-icon size="20">mdi-book-open-page-variant</v-icon>
                                <span>{{ 150 }} trang</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <v-icon size="20">mdi-calendar</v-icon>
                                <span>Xuất bản: {{ book.publishYear }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <v-icon size="20">mdi-tag</v-icon>
                                <span>Thể loại: {{ book.category.name }}</span>
                            </div>
                        </div>
                    </div>

                    <v-btn color="black"
                        class="mt-6 py-8 flex align-content-center  text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                        @click="borrowBook">
                        <v-icon start class="mr-1">mdi-book-check</v-icon>
                        Mượn sách
                    </v-btn>
                </div>
            </div>

            <!-- Đánh giá -->
            <div class="mt-10 px-6 py-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Đánh giá của bạn đọc</h2>
                <v-divider class="mb-4"></v-divider>

                <div v-for="(review, index) in reviews" :key="index" class="mb-6" v-if="reviews.length">
                    <div class="flex items-center gap-3 mb-1">
                        <v-icon color="grey darken-2">mdi-account-circle</v-icon>
                        <span class="font-medium">{{ review.name }}</span>
                        <v-rating :size="32" :model-value="review.rating" active-color="amber" readonly=""
                            :length="5" />
                    </div>
                    <p class="text-gray-600 ml-9">
                        {{ new Date(review.createAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
                        }}
                    </p>
                    <p class="text-gray-600 ml-9 mt-2">{{ review.comment }}</p>
                </div>
                <div class="text-center" v-else>
                    <span>Chưa có đánh giá nào.</span>
                </div>

                <!-- Thêm đánh giá -->
                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-2">Gửi đánh giá của bạn</h3>
                    <v-textarea v-model="newReview.comment" label="Nhận xét" outlined dense class="mb-4"></v-textarea>
                    <v-rating v-model="newReview.rating" :size="32" hover active-color="amber" :length="5" />
                    <div>

                        <v-btn class="mt-4 bg-black text-white" @click="submitReview">Gửi đánh giá</v-btn>
                    </div>
                </div>
            </div>
        </v-card>


        <v-dialog v-model="borrowDialog" max-width="500px">
            <v-card class="p-4">
                <v-card-title class="text-xl font-semibold">Thông tin mượn sách</v-card-title>
                <p v-if="borrowErrorMessage" class="text-red-600 mt-2 text-center">
                    {{ borrowErrorMessage }}
                </p>
                <v-card-text>
                    <v-text-field v-model="borrowForm.quantity" label="Số lượng mượn" type="number"
                        :rules="[v => v > 0 || 'Số lượng phải lớn hơn 0']" />
                    <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y
                        max-width="290px" min-width="auto">
                        <template #activator="{ on, attrs }">
                            <v-text-field v-model="borrowForm.borrowDate" label="Ngày mượn" readonly v-bind="attrs"
                                v-on="on" />
                        </template>

                        <v-date-picker :model-value="borrowForm.borrowDate" @update:model-value="onSelectDate"
                            :min="minDate" />
                    </v-menu>


                    <p class="mt-2 text-sm text-gray-600">📅 Ngày trả dự kiến: <strong>{{ dueDate }}</strong></p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="borrowDialog = false">Huỷ</v-btn>
                    <v-btn
                        class="font-bold text-white text-lg px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 shadow-md"
                        elevation="6" @click="confirmBorrow" color="primary">
                        <v-icon start>mdi-check-circle</v-icon>
                        Xác nhận
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>


</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import api from "@/services/api.service";
export default {
    name: "BookDetail",
    data() {
        return {
            book: null,
            reviews: [

            ],
            newReview: {
                name: "",
                comment: "",
                rating: 0,
            },
            borrowDialog: false,
            dateMenu: false,
            borrowForm: {
                quantity: 1,
                borrowDate: new Date().toISOString().substr(0, 10), // YYYY-MM-DD
            },
            borrowErrorMessage: "",
        };
    },
    computed: {
        minDate() {
            return new Date().toISOString().substr(0, 10);
        },
        dueDate() {
            const borrow = new Date(this.borrowForm.borrowDate);
            const due = new Date(borrow.setDate(borrow.getDate() + 14));
            return due.toISOString().substr(0, 10);
        }
    },
    async created() {
        const route = useRoute()
        const bookId = route.params.id

        try {
            const response = await api.get(`/api/books/${bookId}`)
            this.book = response.data
            // Gọi API lấy comment theo bookId
            const commentsRes = await api.get(`/api/comments/books/${bookId}`);
            this.reviews = commentsRes.data.map(c => ({
                name: c.user?.name || "Ẩn danh",
                comment: c.content,
                rating: c.rating || 3,
                createAt: c.createdAt
            })).reverse();

        } catch (error) {
            console.error("Lỗi khi tải chi tiết sách:", error)
        }
    },
    methods: {
        async submitReview() {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;

            if (!this.newReview.comment || this.newReview.rating <= 0) {
                alert("❗ Vui lòng nhập nhận xét và đánh giá.");
                return;
            }

            if (!userId) {
                alert("❗ Vui lòng đăng nhập để gửi đánh giá.");
                return;
            }

            try {
                const payload = {
                    userId: userId,
                    bookId: this.book._id,
                    content: this.newReview.comment,
                    rating: this.newReview.rating,
                };

                const res = await api.post("/api/comments", payload);

                // Cập nhật danh sách đánh giá
                this.reviews.unshift({
                    name: user.name,
                    comment: payload.content,
                    rating: payload.rating,
                    createAt: new Date().toISOString()
                });

                // Reset form
                this.newReview = { comment: "", rating: 0 };

                alert("✅ Cảm ơn bạn đã gửi đánh giá!");
            } catch (error) {
                console.error("Lỗi khi gửi đánh giá:", error);
                alert("❌ Gửi đánh giá thất bại. Vui lòng thử lại.");
            }
        },
        borrowBook() {
            this.borrowDialog = true;
        },

        async confirmBorrow() {
            const borrowDate = new Date(this.borrowForm.borrowDate);
            const today = new Date();

            // Reset lỗi cũ
            this.borrowErrorMessage = "";

            if (borrowDate < new Date(today.toDateString())) {
                this.borrowErrorMessage = "❌ Ngày mượn không được là ngày trong quá khứ!";
                return;
            }

            if (this.borrowForm.quantity <= 0) {
                this.borrowErrorMessage = "❌ Số lượng phải lớn hơn 0!";
                return;
            }
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;
            if (!userId) {
                this.borrowErrorMessage = "❌ Người dùng không tồn tại!";
                return;
            }
            try {
                const response = await api.post("/api/borrows", {
                    userId: userId,
                    bookId: this.book._id,
                    quantity: this.borrowForm.quantity,
                    borrowDate: this.borrowForm.borrowDate,
                    dueDate: this.dueDate,
                });

                alert("✅ Đăng ký mượn sách thành công!");
                this.borrowDialog = false;
            } catch (err) {
                // Lưu lỗi từ server
                this.borrowErrorMessage = err?.response?.data?.message || "Có lỗi xảy ra khi đăng ký mượn!";
            }

        },
    },
};
</script>
