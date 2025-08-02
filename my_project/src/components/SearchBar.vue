<template>
    <v-text-field v-model="search" label="Tìm kiếm sách..." prepend-inner-icon="mdi-magnify" clearable outlined dense />
</template>

<script>
export default {
    emits: ['update:search'],
    props: {
        modelValue: String
    },
    computed: {
        search: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:search', value);
            }
        }
    }
}
</script>
