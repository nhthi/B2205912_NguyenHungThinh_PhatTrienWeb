<template>
    <v-container>
        <h2 class="text-center font-weight-bold my-10">📖 Sách nổi bật</h2>
        <v-row>
            <v-col v-for="(book, index) in books" :key="book.id" cols="12" sm="6" md="4">
                <v-card class="hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-in-out rounded-xl">

                    <v-img :src="book.coverImage" height="200px"></v-img>
                    <v-card-title>{{ book.title }}</v-card-title>
                    <v-card-subtitle>{{ book.authorName }}</v-card-subtitle>
                    <v-card-actions class="px-4 py-2">
                        <v-btn color="black" variant="text" @click="goToBookDetail(book._id)">Chi tiết</v-btn>

                        <v-spacer></v-spacer>

                        <v-btn icon @click="toggleExpand(index)">
                            <v-icon>{{ expanded[index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                        </v-btn>
                    </v-card-actions>

                    <v-expand-transition>
                        <div v-show="expanded[index]">
                            <v-divider></v-divider>
                            <v-card-text class="text-body-2">
                                {{ book.description }}
                            </v-card-text>
                        </div>
                    </v-expand-transition>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, watch, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'


export default defineComponent({
    name: 'BookList',
    props: {
        books: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const expanded = ref([])
        const router = useRouter()

        // Đồng bộ số lượng sách -> số lượng phần tử mở rộng
        watch(
            () => props.books,
            (newBooks) => {
                expanded.value = newBooks.map(() => false)
            },
            { immediate: true }
        )
        const goToBookDetail = (bookId) => {
            router.push(`/books/${bookId}`)
        }
        const toggleExpand = (index) => {
            expanded.value[index] = !expanded.value[index]
        }

        return { expanded, toggleExpand, goToBookDetail }
    }
})
</script>