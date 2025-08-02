<template>
    <HeroSection />
    <CategoryCarousel />
    <BookList :books="books" />
    <FeatureHighlight />
    <TopBooks :books="books" />
    <Testimonials />
    <CallToAction />
    <FooterInfo />
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'
import CategoryCarousel from '@/components/CategoryCarousel.vue'
import BookList from '@/components/BookList.vue'
import FeatureHighlight from '@/components/FeatureHighlight.vue'
import Testimonials from '@/components/Testimonials.vue'
import CallToAction from '@/components/CallToAction.vue'
import FooterInfo from '@/components/FooterInfo.vue'
import TopBooks from '@/components/TopBooks.vue'
import { useRouter, useRoute } from 'vue-router'
import api from "@/services/api.service";

export default {
    name: 'BorrowHome',
    components: {
        HeroSection,
        FeatureHighlight,
        BookList,
        FooterInfo,
        CategoryCarousel,
        CallToAction,
        Testimonials,
        TopBooks
    },
    data() {
        return {
            books: [

            ]
        };
    },
    methods: {
        async fetchBooks() {
            try {
                const category = this.$route.query.category;
                const response = await api.get('/api/books', {
                    params: category ? { category } : {}
                })
                this.books = response.data
            } catch (error) {
                console.error('Lỗi khi tải danh sách sách:', error)
            }
        }
    },

    mounted() {
        if (!sessionStorage.getItem('reloaded')) {
            sessionStorage.setItem('reloaded', 'true');
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloaded');
        }
    },
    watch: {
        '$route.query.category': {
            immediate: true, // Gọi fetchBooks ngay khi component khởi tạo
            handler() {
                this.fetchBooks();
            }
        }
    },
    created() {
        this.fetchBooks(); // Gọi lần đầu
    },
};
</script>
