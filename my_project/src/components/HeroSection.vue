<template>
    <div class="text-center py-16">
        <h1 class="display-1 font-weight-bold text-black">Chào mừng bạn đến với Thư viện Trực Tuyến</h1>
        <p class="text-grey-darken-1 text-subtitle-1 mt-4">
            Khám phá kho sách khổng lồ và mượn ngay cuốn sách bạn yêu thích!
        </p>
        <v-btn to="/books" router color="black" class="my-6" dark>Khám phá ngay</v-btn>
        <BookSlider />
    </div>
</template>
<script>
import BookSlider from './BookSlider.vue'

export default {
    name: 'HeroSection',
    components: {
        BookSlider
    }
}
</script>