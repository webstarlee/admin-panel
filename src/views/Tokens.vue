<template>
    <v-card>
        <v-card-title>
            Project List
        </v-card-title>
        <v-card-text>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers"
                :items-length="totalItems" :items="tokens" :loading="loading" :search="search" item-value="name"
                @update:options="loadProjects">
                <template v-slot:item.username="{ item }">
                    @{{ item.raw.username }}
                </template>
                <template v-slot:item.symbol="{ item }">
                    <v-btn variant="plain" :href="item.raw.pair_url" target="blink" class="pl-0">
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
                <template v-slot:item.action="{ item }">
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                            <v-btn icon v-bind="props" size="x-small" color="blue" @click="editToken(item.raw)">
                                <v-icon color="grey-lighten-1">
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Edit Token</span>
                    </v-tooltip>
                </template>
                <template v-slot:no-data>
                    no data
                </template>
                <template v-slot:top>
                    <v-toolbar color="transparent" height="50">
                        <v-text-field v-model="search" label="Search" class="mt-2" density="compact"
                            append-inner-icon="mdi-magnify" hide-details single-line></v-text-field>
                        <v-dialog v-model="dialog" persistent max-width="500px">
                            <v-card>
                                <v-card-title class="pt-5">
                                    <span class="text-h6">Edit {{ token.symbol }} Token</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container class="px-0 py-0">
                                        <v-row>
                                            <v-col cols="6 py-0" sm="6" md="3">
                                                <v-text-field v-model="token.username" color="blue" disabled
                                                    label="Username" variant="plain" hide-details></v-text-field>
                                            </v-col>
                                            <v-col cols="6 py-0" sm="6" md="3">
                                                <v-text-field v-model="token.symbol" disabled color="blue" label="Symbol"
                                                    variant="plain" hide-details></v-text-field>
                                            </v-col>
                                            <v-col cols="6 py-0" sm="6" md="3">
                                                <v-text-field prefix="$" v-model="token.marketcap" disabled color="blue"
                                                    label="Marketcap" variant="plain" hide-details></v-text-field>
                                            </v-col>
                                            <v-col cols="6 py-0" sm="6" md="3">
                                                <v-text-field prefix="$" v-model="token.current_marketcap" disabled
                                                    color="blue" label="Current" variant="plain"
                                                    hide-details></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12 py-0">
                                                <v-text-field v-model="token.token" color="blue" disabled
                                                    label="Token Address" variant="plain" hide-details></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-row>
                                            <v-col cols="12 py-0">
                                                <v-text-field v-model="token.pair_address" color="blue" disabled
                                                    label="Pair address" variant="plain" hide-details></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field prefix="$" v-model="token.ath" color="blue" label="ATH"
                                                    variant="underlined"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-combobox v-model="token.status" :items="['active', 'remove']"
                                                    label="Status" variant="underlined"></v-combobox>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="red" variant="text" @click="close">
                                        Cancel
                                    </v-btn>
                                    <v-btn color="success" variant="text" @click="save">
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>
</template>
  
<script>
import { storeToRefs } from 'pinia';
import { useTokensStore } from '@/stores';
const tokenStore = useTokensStore();
const { tokens } = storeToRefs(tokenStore);
export default {
    data() {
        return {
            itemsPerPage: 10,
            search: '',
            headers: [
                {
                    title: 'No',
                    align: 'start',
                    key: 'no',
                },
                { title: 'User', align: 'start', key: 'username' },
                { title: 'Symbol', align: 'start', key: 'symbol' },
                { title: 'Shared Marketcap', align: 'start', key: 'marketcap' },
                { title: 'Current Marketcap', align: 'start', key: 'current_marketcap' },
                { title: 'ATH', align: 'start', key: 'ath' },
                { title: 'Action', align: 'end', key: 'action' },
            ],
            tokens: [],
            loading: true,
            totalItems: 0,
            page: 1,
            sortBy: { key: 'created_at', order: 'asc' },
            symbol: '',
            dialog: false,
            editedIndex: -1,
            token: {
                ath: "",
                chain: "",
                created_at: "",
                current_marketcap: "",
                group_id: "",
                marketcap: "",
                no: 1,
                pair_address: "",
                pair_url: "",
                status: "",
                symbol: "",
                token: "",
                user_id: "",
                username: "",
            },
            defaultToken: {
                ath: "",
                chain: "",
                created_at: "",
                current_marketcap: "",
                group_id: "",
                marketcap: "",
                no: 1,
                pair_address: "",
                pair_url: "",
                status: "",
                symbol: "",
                token: "",
                user_id: "",
                username: "",
            },
        }
    },
    methods: {
        // Log in with the form's email/username and password
        async loadProjects({ page, itemsPerPage, sortBy }) {
            this.loading = true
            if (sortBy.length > 0) {
                this.sortBy = sortBy[0]
            }
            this.page = page
            this.itemsPerPage = itemsPerPage

            tokenStore.getPageData(this.page, this.itemsPerPage, this.sortBy.key, this.sortBy.order, this.search).then(() => {
                this.tokens = tokens.value.projects
                this.totalItems = tokens.value.total_count
                this.loading = false
            });
        },
        editToken(token) {
            this.editedIndex = this.tokens.indexOf(token)
            this.token = Object.assign({}, token)
            this.dialog = true
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.token = Object.assign({}, this.defaultToken)
                this.editedIndex = -1
            })
        },
        save() {
            if (this.editedIndex > -1) {
                tokenStore.update(this.token).then(() => {
                    this.token = Object.assign({}, this.defaultToken)
                    this.editedIndex = -1
                    this.loading = true
                    tokenStore.getPageData(this.page, this.itemsPerPage, this.sortBy.key, this.sortBy.order, this.search).then(() => {
                        this.tokens = tokens.value.projects
                        this.totalItems = tokens.value.total_count
                        this.loading = false
                    });
                });
            } else {
                console.log("HIHI")
            }
            this.close()
        }
    },
};
</script>