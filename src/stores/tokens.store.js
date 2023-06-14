import { defineStore } from 'pinia';

import { fetchWrapper, BASE_URL } from '@/helpers';
import { useAuthStore } from '@/stores';

export const useTokensStore = defineStore({
    id: 'tokens',
    state: () => ({
        tokens: [],
        token: {}
    }),
    actions: {
        async getPageData(pageNum, perPage, sortKey, sortOrder, search) {
            try {
                const data = {
                    "page_num": pageNum,
                    "items_per_page": perPage,
                    "sort_by_key": sortKey,
                    "sort_by_order": sortOrder,
                    "search": search,
                }
                this.tokens = await fetchWrapper.post(`${BASE_URL}/api/projects`, data);
            } catch (error) {
                const { user, logout } = useAuthStore();
                if ([401, 403].includes(error.response.status) && user) {
                    logout();
                }
            }
        },
        async update(data) {
            try {
                await fetchWrapper.post(`${BASE_URL}/api/project/update`, data);
            } catch (error) {
                if ([401].includes(error.response.status)) {
                    const alertStore = useAlertStore();
                    alertStore.error("Username or Password do not match");
                }
            }
        },
    }
});
