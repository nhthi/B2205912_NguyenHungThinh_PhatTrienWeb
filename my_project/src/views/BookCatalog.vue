<template>
    <v-container class="max-w-6xl mx-auto py-12 bg-white">
        <!-- Header với tìm kiếm và bộ lọc -->
        <v-row class="mb-8 items-center">
            <v-col cols="12" md="6">
                <v-text-field v-model="searchQuery" label="Tìm kiếm sách" prepend-inner-icon="mdi-magnify"
                    variant="outlined" density="compact" clearable
                    class="bg-white border-gray-300 rounded-lg text-gray-800" flat @input="filterBooks"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
                <v-select v-model="selectedGenre" :items="genres" label="Thể loại"
                    prepend-inner-icon="mdi-filter-outline" variant="outlined" density="compact" clearable
                    class="bg-white border-gray-300 rounded-lg text-gray-800" flat
                    @update:modelValue="filterBooks"></v-select>
            </v-col>
            <v-col cols="12" md="3">
                <v-select v-model="itemsPerPage" :items="[10, 20, 50]" label="Sách mỗi trang"
                    prepend-inner-icon="mdi-format-list-numbered" variant="outlined" density="compact"
                    class="bg-white border-gray-300 rounded-lg text-gray-800" flat
                    @update:modelValue="updatePagination"></v-select>
            </v-col>
        </v-row>

        <!-- Danh sách sách -->
        <v-row>
            <v-col v-if="filteredBooks.length === 0" cols="12">
                <v-alert type="info" icon="mdi-information-outline"
                    class="bg-gray-50 text-gray-700 border border-gray-200 rounded-lg">
                    Không tìm thấy sách nào.
                </v-alert>
            </v-col>
            <v-col v-else v-for="book in paginatedBooks" :key="book._id" cols="12" sm="6" md="3">
                <v-card
                    class="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
                    elevation="0">



                    <div class="px-40 md:px-10 py-4">
                        <v-img :src="book.coverImage" height="280" aspect-ratio="2/3" cover
                            class="border-b border-gray-200"></v-img>
                    </div>
                    <v-card-title class="text-lg font-medium text-gray-900 pt-4">
                        {{ book.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-gray-500 text-sm">
                        {{ book.author }}
                    </v-card-subtitle>
                    <v-card-actions class="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <router-link :to="`/books/${book._id}`" class="no-underline">
                            <!-- Nút Chi tiết -->
                            <v-btn variant="elevated" color="#5865f2"
                                class=" font-medium capitalize rounded-lg transition-colors">
                                Chi tiết
                            </v-btn>
                        </router-link>
                        <v-spacer></v-spacer>

                        <!-- Nút mở rộng / thu gọn -->
                        <v-btn icon @click="toggleExpand(book._id)"
                            class="text-gray-600 hover:bg-gray-300 rounded-full transition-colors">
                            <v-icon>
                                {{ expanded[book._id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                            </v-icon>
                        </v-btn>
                    </v-card-actions>


                    <v-expand-transition>
                        <div v-show="expanded[book._id]">
                            <v-divider class="border-gray-200"></v-divider>
                            <v-card-text class="text-gray-600 text-sm">
                                {{ book.description }}
                            </v-card-text>
                        </div>
                    </v-expand-transition>
                </v-card>

            </v-col>
        </v-row>

        <!-- Phân trang -->
        <v-row class="mt-10">
            <v-col cols="12" class="flex justify-center">
                <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" density="comfortable"
                    rounded="circle" active-color="gray-900" @update:modelValue="updatePagination"></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import api from "@/services/api.service";

export default {
    name: 'BookCatalog',
    data() {
        return {
            searchQuery: '',
            selectedGenre: null,
            itemsPerPage: 10,
            currentPage: 1,
            genres: [],
            books: [

            ],
            filteredBooks: [],
            expanded: {}, // Theo dõi trạng thái mở rộng theo book.id
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
        },
        paginatedBooks() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredBooks.slice(start, end);
        },
    },
    methods: {
        filterBooks() {
            let filtered = this.books;
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (book) =>
                        book.title.toLowerCase().includes(query) ||
                        book.author.toLowerCase().includes(query)
                );
            }
            if (this.selectedGenre && this.selectedGenre !== 'Tất cả') {
                filtered = filtered.filter((book) => book.category === this.selectedGenre);
            }
            this.filteredBooks = filtered;
            this.currentPage = 1; // Reset về trang đầu tiên khi lọc
        },
        updatePagination() {
            this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
        },
        toggleExpand(bookId) {
            this.expanded = {
                ...this.expanded,
                [bookId]: !this.expanded[bookId], // Toggle trạng thái mở rộng
            };
        },
        // ✅ Gọi API lấy sách và thể loại
        async fetchBooksAndGenres() {
            try {
                const booksRes = await api.get('/api/books/details')


                this.books = booksRes.data || [];
                this.genres = ['Tất cả', ...new Set(this.books.map(g => g.category))];
                this.filteredBooks = [...this.books];
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sách/thể loại:", error);
            }
        }
    },


    async created() {
        await this.fetchBooksAndGenres();
    },

};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>