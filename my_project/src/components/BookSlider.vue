<template>
    <div class="pa-0 ma-0 w-100" style="width: 100vw; overflow-x: hidden">


        <v-carousel :show-arrows="false" hide-delimiters cycle :interval="2000">
            <v-carousel-item v-for="(book, index) in featuredBooks" :key="book.id" :value="index" cover>
                <v-row no-gutters class=" w-100">
                    <v-col cols="12" md="4" class="bg-grey-lighten-3">
                        <div class="h-100 d-flex align-center justify-center">
                            <v-img :src="book.image" class="rounded-0" contain
                                style="max-height: 500px; max-width: 100%;" />
                        </div>
                    </v-col>

                    <v-col cols="12" md="8" class="py-10 px-10" style="background-color: #111; color: white;">
                        <div class="d-flex flex-column justify-center align-start h-100">
                            <h2 class="text-h4 font-weight-bold mb-4">{{ book.title }}</h2>
                            <p class="text-subtitle-1 mb-2">Tác giả: {{ book.author }}</p>
                            <p class="text-body-1">
                                Một cuốn sách đặc sắc với nội dung hấp dẫn, mời bạn khám phá thêm!
                            </p>
                        </div>
                    </v-col>

                </v-row>
            </v-carousel-item>
        </v-carousel>

    </div>
</template>

<script>
export default {
    name: "BookSlider",
    data() {
        return {
            currentSlide: 0,
            featuredBooks: [
                {
                    id: 1,
                    title: "Dế Mèn Phiêu Lưu Ký",
                    author: "Tô Hoài",
                    image:
                        "https://i1-giaitri.vnecdn.net/2025/01/06/De-Me-n-phie-u-lu-u-ky-1736177-4191-9546-1736178205.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=8rrYxKTShyJtxNeazthCEw",
                },
                {
                    id: 2,
                    title: "Harry Potter",
                    author: "J.K. Rowling",
                    image:
                        "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/177166/Originals/poster-gioi-thieu-sach-3.jpg",
                },
                {
                    id: 3,
                    title: "Sherlock Holmes",
                    author: "Arthur Conan Doyle",
                    image:
                        "https://marketplace.canva.com/EAD5DFBuM78/1/0/1003w/canva-c%E1%BA%B7p-%C4%91%C3%B4i-trong-c%E1%BB%8F-khoa-h%E1%BB%8Dc-vi%E1%BB%85n-t%C6%B0%E1%BB%9Fng-s%C3%A1ch-b%C3%ACa-eRK4o7m6a6c.jpg",
                },
            ],
        };
    },
};
</script>

<style scoped>
.v-carousel .v-carousel-item {
    background-color: #fff;
}
</style>
