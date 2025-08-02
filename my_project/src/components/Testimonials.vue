<template>
    <v-container class="py-10">
        <h3 class="text-center font-weight-bold mb-6">🗣️ Người dùng nói gì?</h3>
        <v-row>
            <v-col v-for="(testimonial, index) in testimonials" :key="index" cols="12" sm="6" md="4">
                <v-card class="pa-4">
                    <v-avatar class="mb-3" size="60" color="grey-lighten-2">
                        <v-icon size="32">mdi-account</v-icon>
                    </v-avatar>
                    <p class="font-italic">"{{ testimonial.comment }}"</p>
                    <h5 class="mt-3 font-weight-bold">{{ testimonial.name }}</h5>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const testimonials = [
    { name: 'Nguyễn An', comment: 'Dịch vụ rất tốt, sách mới và sạch sẽ!' },
    { name: 'Lê Hương', comment: 'Mình mượn sách ở đây suốt. Rất hài lòng!' },
    { name: 'Phúc Trần', comment: 'Giao diện dễ dùng, dễ tìm sách.' }
]
</script>
