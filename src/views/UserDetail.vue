<template>
    <v-card>
        <v-card-title>
            <div class="text-subtitle-1 text-medium-emphasis">Fullname: {{ user.fullname }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">Username: {{ user.username }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">User Id: {{ user.user_id }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">Total Projects: {{ user.total_shills }}</div>
        </v-card-title>
        <v-tabs v-model="tab" bg-color="blue">
            <v-tab value="latest_projects">All Projects</v-tab>
            <v-tab value="groups">Groups</v-tab>
            <v-tab value="warns">Warns</v-tab>
            <v-tab value="bans">Bans</v-tab>
        </v-tabs>

        <v-card-text>
            <v-window v-model="tab">
                <v-window-item value="latest_projects">
                    <v-table fixed-header height="500px">
                        <thead>
                            <tr>
                                <th id="no_column" class="text-left">No</th>
                                <th id="symbol_column" class="text-left">Symbol</th>
                                <th id="shared_marketcap_column" class="text-left">Shared Marketcap</th>
                                <th id="current_marketcap_column" class="text-left">Current Marketcap</th>
                                <th id="ath_column" class="text-left">ATH</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item, index in user.latest_shills" :key="item.no">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <v-btn variant="plain" :href="item.pair_url" target="blink">
                                        {{ item.symbol }}
                                        <v-tooltip activator="parent" scrim location="top">{{ item.token }}</v-tooltip>
                                    </v-btn>
                                </td>
                                <td>{{ $numFormatWithDollar(item.marketcap) }}</td>
                                <td v-if="$isActive(item.status)">{{ $numFormatWithDollar(item.current_marketcap) }} ({{
                                    $getMultiple(item.current_marketcap, item.marketcap) }})</td>
                                <td v-else>REMOVED</td>
                                <td>{{ $numFormatWithDollar(item.ath) }} ({{ $getMultiple(item.ath, item.marketcap) }})</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-window-item>

                <v-window-item value="groups">
                    <v-table>
                        <thead>
                            <tr>
                                <th id="group_no_column" class="text-left">No</th>
                                <th id="group_title_column" class="text-left">Title</th>
                                <th id="group_id_column" class="text-left">Group Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="user.groups.length > 0" v-for="item, index in user.groups" :key="item.no">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.group_id }}</td>
                            </tr>
                            <tr v-else>
                                <td colspan="3" class="text-center">No Groups</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-window-item>

                <v-window-item value="warns">
                    <v-table>
                        <thead>
                            <tr>
                                <th id="warn_no_column" class="text-left">No</th>
                                <th id="warn_title_column" class="text-left">Title</th>
                                <th id="warn_group_id_column" class="text-left">Group Id</th>
                                <th id="warn_count_column" class="text-left">Count</th>
                                <th id="warn_action_column" class="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="user.warns.length > 0" v-for="item, index in user.warns" :key="item.no">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.group_id }}</td>
                                <td>{{ item.count }}</td>
                                <td><v-btn color="red" icon="mdi-delete" @click="openWarnDialog(item.group_id)"
                                        title="Remove Warning" size="x-small"></v-btn></td>
                            </tr>
                            <tr v-else>
                                <td colspan="5" class="text-center">No Warns</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-window-item>

                <v-window-item value="bans">
                    <v-table>
                        <thead>
                            <tr>
                                <th id="ban_no_column" class="text-left">No</th>
                                <th id="ban_title_column" class="text-left">Title</th>
                                <th id="ban_group_id_column" class="text-left">Group Id</th>
                                <th id="warn_action_column" class="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="user.bans.length > 0" v-for="item, index in user.bans" :key="item.no">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.group_id }}</td>
                                <td><v-btn color="red" icon="mdi-delete" @click="openBanDialog(item.group_id)"
                                        title="Remove Warning" size="x-small"></v-btn></td>
                            </tr>
                            <tr v-else>
                                <td colspan="4" class="text-center">No Bans</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
    <v-dialog v-model="warnDialog" persistent width="auto">
        <v-card>
            <v-card-title class="text-h5">
                Do you want to remove warning?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green-darken-1" variant="text" @click="cancelRemove">
                    Disagree
                </v-btn>
                <v-btn color="red" variant="text" @click="removeWarn">
                    Agree
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
import { useUsersStore } from '@/stores';
const userStore = useUsersStore();
const { user } = storeToRefs(userStore);

export default {
    data() {
        return {
            user: {},
            tab: null,
            warnDialog: false,
            banDialog: false,
            group_id: null,
            user_id: null
        }
    },
    created() {
        const userId = this.$route.params.user_id;
        userStore.getById(userId).then(() => {
            this.user = user.value;
        });
    },
    methods: {
        openWarnDialog(group_id) {
            this.group_id = group_id
            this.user_id = this.user.user_id
            this.warnDialog = true
        },
        openBanDialog(group_id) {
            this.group_id = group_id
            this.user_id = this.user.user_id
            this.banDialog = true
        },
        async removeWarn() {
            await userStore.removeWarning(this.user_id, this.group_id);
            userStore.getById(this.user_id).then(() => {
                this.user = user.value;
            });
            this.group_id = null
            this.user_id = null
            this.warnDialog = false
            this.banDialog = false
        },
        async removeBan() {
            await userStore.userUnban(this.user_id, this.group_id);
            userStore.getById(this.user_id).then(() => {
                this.user = user.value;
            });
            this.group_id = null
            this.user_id = null
            this.warnDialog = false
            this.banDialog = false
        },
        cancelRemove() {
            this.group_id = null
            this.user_id = null
            this.warnDialog = false
            this.banDialog = false
        }
    }
};
</script>