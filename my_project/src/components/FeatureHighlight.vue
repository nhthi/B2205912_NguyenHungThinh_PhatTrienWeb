<template>
    <v-container class="py-10 text-center">
        <h3 class="font-weight-bold mb-6">✨ Tại sao chọn chúng tôi?</h3>
        <v-row>
            <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="4">
                <v-card class="pa-4 elevation-2 hover:elevation-10">
                    <v-icon size="40" color="black">{{ feature.icon }}</v-icon>
                    <h4 class="font-weight-medium mt-3">{{ feature.title }}</h4>
                    <p class="text-body-2 mt-2">{{ feature.description }}</p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const features = [
    { icon: 'mdi-truck-fast', title: 'Giao sách tận nơi', description: 'Nhanh chóng và tiện lợi.' },
    { icon: 'mdi-book-open-page-variant', title: 'Kho sách phong phú', description: 'Hơn 10.000 đầu sách đa thể loại.' },
    { icon: 'mdi-account-group', title: 'Cộng đồng yêu sách', description: 'Giao lưu & chia sẻ đam mê đọc.' }
]
</script>
