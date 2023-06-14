import { defineStore } from 'pinia';
import { fetchWrapper, BASE_URL } from '@/helpers';
import { useAuthStore } from '@/stores';

export const useLeaderStore = defineStore({
    id: 'leaders',
    state: () => ({
        leaders: null
    }),
    actions: {
        async fetch() {
            try {
                const leaders = await fetchWrapper.get(`${BASE_URL}/api/leaderboards`);
                this.leaders = leaders;
            } catch (error) {
                const { user, logout } = useAuthStore();
                if ([401, 403].includes(error.response.status) && user) {
                    logout();
                }
            }
        },
    }
});
