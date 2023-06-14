<template>
    <v-container class="d-flex justify-center align-center">
        <v-row>
            <v-spacer></v-spacer>
            <v-col md="6" sm="12" cols="12">
                <v-form @submit.prevent="login">
                    <v-img class="mx-auto mb-10" max-width="228" src="@/assets/logo.png"></v-img>

                    <v-card class="mx-auto pa-6 pb-8" elevation="8" max-width="380" rounded="lg">

                        <p class="text-h4 text-center pt-3 pb-8">SIGN IN</p>

                        <div class="text-subtitle-1 text-medium-emphasis">Username</div>

                        <v-text-field density="compact" placeholder="Emter your username"
                            prepend-inner-icon="mdi-shield-account-outline" variant="outlined" v-model="username"></v-text-field>

                        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                            Password
                        </div>

                        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
                            prepend-inner-icon="mdi-lock-outline" variant="outlined"
                            @click:append-inner="visible = !visible" v-model="password">
                        </v-text-field>

                        <v-btn block type="submit" size="large">
                            Sign In
                        </v-btn>
                    </v-card>
                </v-form>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
    </v-container>
</template>
  
<script>
import { useAuthStore } from '@/stores';

export default {
    data() {
        return {
            visible: false, // Add the 'visible' property here
            username: "",
            password: "",
        }
    },
    computed: {
        isDark() {
            return this.$vuetify.theme.dark
        }
    },
    methods: {
        // Log in with the form's email/username and password
        async login() {
            const authStore = useAuthStore();
            await authStore.login(this.username, this.password);
        },
    },
}
</script>