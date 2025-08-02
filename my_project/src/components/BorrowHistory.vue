<template>
    <v-container>
        <h3 class="my-4">Lịch sử mượn sách</h3>
        <v-data-table :items="history" :headers="headers" class="elevation-1"></v-data-table>
    </v-container>
</template>

<script>
export default {
    name: 'BorrowHistory',
    props: ['history'],
    data() {
        return {
            headers: [
                { text: 'Tên sách', value: 'title' },
                { text: 'Ngày mượn', value: 'borrowedAt' },
                { text: 'Trạng thái', value: 'status' },
            ],
        };
    },
};
</script>
