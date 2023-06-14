<template>
    <v-app>
        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title>
                <v-img class="" max-width="180" src="@/assets/logo.png"></v-img>
            </v-toolbar-title>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" permanent>
            <v-list nav>
                <v-list-item prepend-icon="mdi-home" title="HOME" value="home" to="/dashboard"></v-list-item>
                <v-list-item prepend-icon="mdi-cog" title="SETTING" value="setting" to="/setting"></v-list-item>
                <v-list-item prepend-icon="mdi-account-multiple" :active="isActive('user-management')"
                    title="USER MANAGEMENT" value="user-manage" to="/user-management"></v-list-item>
                <v-list-item prepend-icon="mdi-home-group" :active="isActive('group-management')" title="GROUP MANAGEMENT"
                    value="group-manage" to="/group-management"></v-list-item>
                <v-list-item prepend-icon="mdi-ethereum" title="TOKEN MANAGEMENT" value="token-manage"
                    to="/token-management"></v-list-item>
            </v-list>
            <template v-slot:append>
                <div class="pa-2">
                    <v-btn block @click="logout">
                        Logout
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-main>
            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col cols="12">
                        <router-view />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { useAuthStore } from '@/stores';
export default {
    data: () => ({ drawer: true }),
    methods: {
        // Log in with the form's email/username and password
        async logout() {
            const authStore = useAuthStore();
            await authStore.logout();
        },
        isActive(link) {
            return this.$route.path.includes(link);
        },

    },
}
</script>