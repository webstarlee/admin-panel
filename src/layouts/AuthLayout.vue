<template>
    <v-app>
        <v-main class="d-flex justify-center align-center">
            <alert></alert>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import { useAuthStore } from '@/stores';
import router from '@/router';
import Alert from '@/components/Alert.vue'

// redirect home if already logged in

export default {
    components: {
        Alert,
    },
    beforeCreate() {
        const authStore = useAuthStore();
        if (authStore.user) {
            router.push('/');
        }
    }
}
</script>