<template>
    <v-card>
        <v-card-title>
            User List
            <v-spacer></v-spacer>
            <v-text-field v-model="search" label="Search" class="mt-2" density="compact" append-inner-icon="mdi-magnify" hide-details single-line></v-text-field>
        </v-card-title>
        <v-card-text>
            <v-data-table :headers="headers" :items="users" :sort-by="[{ key: 'no', order: 'asc' }]" :search="search">
                <template v-slot:item.actions="{ item }">
                    <v-btn icon="mdi-information-variant" :to="`/user-management/${item.raw.user_id}`" color="blue" size="x-small"></v-btn>
                </template>
                <template v-slot:no-data>
                    no data
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>
  
<script>
import { storeToRefs } from 'pinia';
import { useUsersStore } from '@/stores';
const userStore = useUsersStore();
const { users } = storeToRefs(userStore);

export default {
    data() {
        return {
            search: '',
            itemsPerPage: 5,
            headers: [
                {
                    title: 'No',
                    align: 'start',
                    key: 'no',
                },
                { title: 'Username', align: 'start', key: 'username' },
                { title: 'UserId', align: 'start', key: 'user_id' },
                { title: 'Total Project', align: 'start', key: 'shills' },
                { title: 'Actions', key: 'actions', sortable: false },
            ],
            users: [],
        }
    },
    created() {
        if (users.value.length === 0) {
            userStore.getAll().then(() => {
                this.users = users.value;
            });
        } else {
            this.users = users.value;
        }
    },
    methods: {
        // Log in with the form's email/username and password
        async update() {
            await settingStore.update(this.banMode, this.shillMode);
        },
    },
};
</script>