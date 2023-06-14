<template>
    Group Detail page
    <v-card>
        <v-card-title>
            <div class="text-subtitle-1 text-medium-emphasis">Group Title: {{ group.title }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">Group Link: {{ group.link }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">Group Id: {{ group.group_id }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">Total Projects: {{ group.total_shills }}</div>
        </v-card-title>
        <v-tabs v-model="tab" bg-color="blue">
            <v-tab value="all_projects">All Projects</v-tab>
            <v-tab value="users">Users</v-tab>
            <v-tab value="bans">Bans</v-tab>
            <v-tab value="setting">Setting</v-tab>
        </v-tabs>

        <v-card-text>
            <v-window v-model="tab">
                <v-window-item value="all_projects">
                    <v-text-field v-model="search" label="Search" class="mt-2" density="compact"
                        append-inner-icon="mdi-magnify" hide-details single-line></v-text-field>
                    <v-data-table :headers="headers" :items="group.latest_shills" :sort-by="[{ key: 'no', order: 'asc' }]"
                        :search="search">
                        <template v-slot:item.symbol="{ item }">
                            <v-btn variant="plain" :href="item.raw.pair_url" target="blink">
                                {{ item.raw.symbol }}
                                <v-tooltip activator="parent" scrim location="top">{{ item.raw.token }}</v-tooltip>
                            </v-btn>
                        </template>
                        <template v-slot:item.marketcap="{ item }">
                            {{ $numFormatWithDollar(item.raw.marketcap) }}
                        </template>
                        <template v-slot:item.current_marketcap="{ item }">
                            {{ $isActive(item.raw.status) ? `${$numFormatWithDollar(item.raw.current_marketcap)}
                                                        (${$getMultiple(item.raw.current_marketcap, item.raw.marketcap)})` : "removed" }}
                        </template>
                        <template v-slot:item.ath="{ item }">
                            {{ $numFormatWithDollar(item.raw.ath) }} ({{ $getMultiple(item.raw.ath, item.raw.marketcap) }})
                        </template>
                        <template v-slot:no-data>
                            no data
                        </template>
                    </v-data-table>
                </v-window-item>

                <v-window-item value="users">
                    <v-text-field v-model="search_user" label="Search" class="mt-2" density="compact"
                        append-inner-icon="mdi-magnify" hide-details single-line></v-text-field>
                    <v-data-table :headers="user_headers" :items="group.users" :sort-by="[{ key: 'no', order: 'asc' }]"
                        :search="search_user">
                        <template v-slot:no-data>
                            no data
                        </template>
                    </v-data-table>
                </v-window-item>

                <v-window-item value="bans">
                    <v-table>
                        <thead>
                            <tr>
                                <th id="ban_no_column" class="text-left">No</th>
                                <th id="ban_fullname_column" class="text-left">Fullname</th>
                                <th id="ban_username_column" class="text-left">Username</th>
                                <th id="ban_user_id_column" class="text-left">User Id</th>
                                <th id="action_column" class="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="group.bans.length > 0" v-for="item, index in group.bans" :key="item.no">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.fullname }}</td>
                                <td>{{ item.username }}</td>
                                <td>{{ item.user_id }}</td>
                                <td><v-btn color="red" icon="mdi-delete" @click="openBanDialog(item.user_id)"
                                        title="Remove Warning" size="x-small"></v-btn></td>
                            </tr>
                            <tr v-else>
                                <td colspan="5" class="text-center">No Groups</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-window-item>

                <v-window-item value="setting">
                    <v-card width="400">
                        <template v-slot:title>
                            Group Setting
                        </template>

                        <template v-slot:text>
                            <v-switch v-model="shillMode" hide-details true-value="On" color="success" false-value="Off"
                                :label="`Shill Mode Turned ${shillMode}`"></v-switch>
                            <v-switch v-model="banMode" hide-details true-value="On" color="success" false-value="Off"
                                :label="`Ban Mode Turned ${banMode}`"></v-switch>
                        </template>
                        <v-card-actions>
                            <v-btn variant="tonal" prepend-icon="mdi-check-circle" class="px-5" color="success"
                                @click="settingUpdate">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
    <v-dialog v-model="banDialog" persistent width="auto">
        <v-card>
            <v-card-title class="text-h5">
                Do you want to unBan this user?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green-darken-1" variant="text" @click="cancelRemove">
                    Disagree
                </v-btn>
                <v-btn color="red" variant="text" @click="removeBan">
                    Agree
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script>
import { storeToRefs } from 'pinia';
import { useGroupsStore } from '@/stores';
import { useUsersStore } from '@/stores';
const userStore = useUsersStore();
const groupStore = useGroupsStore();
const { group } = storeToRefs(groupStore);

export default {
    data() {
        return {
            tab: null,
            search: '',
            search_user: '',
            banDialog: false,
            banMode: "Off",
            shillMode: "Off",
            headers: [
                {
                    title: 'No',
                    align: 'start',
                    key: 'no',
                },
                { title: 'Symbol', align: 'start', key: 'symbol' },
                { title: 'Shared Marketcap', align: 'start', key: 'marketcap' },
                { title: 'Current Marketcap', align: 'start', key: 'current_marketcap' },
                { title: 'ATH', align: 'start', key: 'ath' },
            ],
            user_headers: [
                {
                    title: 'No',
                    align: 'start',
                    key: 'no',
                },
                { title: 'Fullname', align: 'start', key: 'fullname' },
                { title: 'Username', align: 'start', key: 'username' },
                { title: 'User Id', align: 'start', key: 'user_id' },
            ],
            group: [],
            group_id: null,
            user_id: null,
        }
    },
    created() {
        const groupId = this.$route.params.group_id;
        this.group_id = groupId
        groupStore.getById(groupId).then(() => {
            this.group = group.value;
            this.banMode = group.value.setting.ban_mode ? "On" : "Off";
            this.shillMode = group.value.setting.shill_mode ? "On" : "Off";
        });
    },
    methods: {
        openBanDialog(userId) {
            this.user_id = userId
            this.group_id = this.group.group_id
            this.banDialog = true
        },
        async removeBan() {
            await userStore.userUnban(this.user_id, this.group_id);
            groupStore.getById(this.group_id).then(() => {
                this.group = group.value;
            });
            this.group_id = null
            this.user_id = null
            this.banDialog = false
        },
        cancelRemove() {
            this.group_id = null
            this.user_id = null
            this.banDialog = false
        },
        async settingUpdate() {
            await groupStore.updateSetting(this.banMode, this.shillMode, this.group_id);
            groupStore.getById(this.group_id).then(() => {
                this.group = group.value;
            });
        },
    },
};
</script>