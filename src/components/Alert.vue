<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch, computed } from "vue";
import { useAlertStore } from '@/stores';

const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);
const is_alert = ref(false);
watch(alert, () => {
    if (alert.value.message) {
        is_alert.value = true
    }
})
</script>

<template>
    <v-alert
        v-model="is_alert"
        title-font-size="10"
        color="red"
        position="fixed"
        class="custom-alert"
        >
        Username or Password dose not match
    </v-alert>
</template>

<style scoped>
.custom-alert {
    top: 10px;
}
</style>

