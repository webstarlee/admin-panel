import { defineStore } from 'pinia';

import { fetchWrapper, BASE_URL } from '@/helpers';
import { useAuthStore } from '@/stores';

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: [],
        user: {}
    }),
    actions: {
        async getAll() {
            try {
                this.users = await fetchWrapper.get(`${BASE_URL}/api/users`);

            } catch (error) {
                const { user, logout } = useAuthStore();
                if ([401, 403].includes(error.response.status) && user) {
                    logout();
                }
            }
        },
        async getById(userId) {
            try {
                this.user = await fetchWrapper.get(`${BASE_URL}/api/user/${userId}`);

            } catch (error) {
                const { user, logout } = useAuthStore();
                if ([401, 403].includes(error.response.status) && user) {
                    logout();
                }
            }
        },
        async removeWarning(userId, groupId) {
            try {
                await fetchWrapper.delete(`${BASE_URL}/api/user/${userId}/${groupId}/warn`);

            } catch (error) {
                const { user, logout } = useAuthStore();
                if ([401, 403].includes(error.response.status) && user) {
                    logout();
                }
            }
        },
        async userUnban(userId, groupId) {
            try {
                await fetchWrapper.get(`${BASE_URL}/api/user/${userId}/${groupId}/unban`);

            } catch (error) {
                const { user, logout } = useAuthStore();
                if ([401, 403].includes(error.response.status) && user) {
                    logout();
                }
            }
        },
        async delete(id) {
            // add isDeleting prop to user being deleted
            this.users.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.users = this.users.filter(x => x.id !== id);

            // auto logout if the logged in user deleted their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                authStore.logout();
            }
        }
    }
});
