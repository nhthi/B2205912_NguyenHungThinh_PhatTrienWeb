<template>
    <v-chip-group v-model="selected" column @change="emitCategory">
        <v-chip v-for="cat in categories" :key="cat" filter>
            {{ cat }}
        </v-chip>
    </v-chip-group>
</template>

<script>
export default {
    props: ['categories'],
    data() {
        return {
            selected: null
        };
    },
    methods: {
        emitCategory() {
            this.$emit('category-selected', this.selected);
        }
    }
}
</script>
