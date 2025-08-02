<template>
    <v-card class="ma-2" elevation="2">
        <v-img :src="book.image" height="180px"></v-img>
        <v-card-title>{{ book.title }}</v-card-title>
        <v-card-subtitle>Tác giả: {{ book.author }}</v-card-subtitle>
        <v-card-actions>
            <v-btn color="primary" @click="$emit('borrow', book)">Mượn sách</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'BookItem',
    props: ['book'],
};
</script>
