<template>
  <div>
    <p class="text-h5">
      LeaderBoards
    </p>
    <v-container class="d-flex justify-space-evenly">
      <v-card v-for="(leaderboard, key) in leaderboards" :key="key" class="pa-5 ma-3">
        <div v-html="$br_replace(leaderboard.text)"></div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useLeaderStore } from '@/stores';
const leaderStore = useLeaderStore();
const { leaders } = storeToRefs(leaderStore);

export default {
  data() {
    return {
      leaderboards: []
    }
  },
  created() {
    leaderStore.fetch().then(()=>{
      this.leaderboards = leaders.value
    })
  }
}
</script>