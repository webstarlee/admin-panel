<template>
    <v-card>
        <v-card-title>
            Group List
            <v-spacer></v-spacer>
            <v-text-field v-model="search" label="Search" class="mt-2" density="compact" append-inner-icon="mdi-magnify" hide-details single-line></v-text-field>
        </v-card-title>
        <v-card-text>
            <v-data-table :headers="headers" :items="groups" :sort-by="[{ key: 'no', order: 'asc' }]" :search="search">
                <template v-slot:item.actions="{ item }">
                    <v-btn icon="mdi-information-variant" :to="`/group-management/${item.raw.group_id}`" color="blue" size="x-small"></v-btn>
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
import { useGroupsStore } from '@/stores';
const groupStore = useGroupsStore();
const { groups } = storeToRefs(groupStore);

export default {
    data() {
        return {
            search: '',
            headers: [
                {
                    title: 'No',
                    align: 'start',
                    key: 'no',
                },
                { title: 'Group Title', align: 'start', key: 'title' },
                { title: 'Group Link', align: 'start', key: 'link' },
                { title: 'Total Users', align: 'start', key: 'users' },
                { title: 'Total Projects', align: 'start', key: 'shills' },
                { title: 'Actions', key: 'actions', sortable: false },
            ],
            groups: [],
        }
    },
    created() {
        if (groups.value.length === 0) {
            groupStore.getAll().then(() => {
                this.groups = groups.value;
            });
        } else {
            this.groups = groups.value;
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