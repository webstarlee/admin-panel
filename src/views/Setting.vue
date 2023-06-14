<template>
    <v-card width="400">
        <template v-slot:title>
            Shillmaster Bot Default Setting
        </template>

        <template v-slot:text>
            <v-switch v-model="shillMode" hide-details true-value="On" color="success" false-value="Off"
                :label="`Shill Mode Turned ${shillMode}`"></v-switch>
            <v-switch v-model="banMode" hide-details true-value="On" color="success" false-value="Off"
                :label="`Ban Mode Turned ${banMode}`"></v-switch>
        </template>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" prepend-icon="mdi-check-circle" class="px-5" color="success" @click="update">Save</v-btn>
        </v-card-actions>
    </v-card>
</template>
  
<script>
import { storeToRefs } from 'pinia';
import { useSettingStore } from '@/stores';
const settingStore = useSettingStore();
const { setting } = storeToRefs(settingStore);

export default {
    data() {
        return {
            banMode: "Off",
            shillMode: "Off"
        }
    },
    created() {
        if (setting.value === null) {
            settingStore.fetch().then(() => {
                this.banMode = setting.value.ban_mode ? "On" : "Off";
                this.shillMode = setting.value.shill_mode ? "On" : "Off";
            });
        } else {
            this.banMode = setting.value.ban_mode ? "On" : "Off";
            this.shillMode = setting.value.shill_mode ? "On" : "Off";
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
  