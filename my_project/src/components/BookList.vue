<template>
    <v-sheet class="mx-auto" elevation="4" max-width="90%">
        <v-slide-group class="pa-4" show-arrows>
            <v-slide-group-item v-for="(book, index) in books" :key="index" v-slot="{ toggle }">
                <v-card @click="goToBookDetail(book._id)" class="ma-2 hover:scale-105 transition-transform duration-300"
                    color="grey-lighten-4" height="400" width="200">
                    <v-img :src="book.coverImage" height="300" cover></v-img>
                    <v-card-title class="text-truncate">{{ book.title }}</v-card-title>
                    <v-card-subtitle class="text-truncate">{{ book.authorName }}</v-card-subtitle>
                </v-card>
            </v-slide-group-item>
        </v-slide-group>
    </v-sheet>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToBookDetail(bookId) {
    router.push(`/books/${bookId}`)
}

defineProps({
    books: Array
})


</script>
