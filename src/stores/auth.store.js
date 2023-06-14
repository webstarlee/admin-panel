import { defineStore } from 'pinia';
import { fetchWrapper, BASE_URL } from '@/helpers';
import router from '@/router';
import { useAlertStore } from '@/stores';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async login(username, password) {
            try {
                const user = await fetchWrapper.post(`${BASE_URL}/api/signin`, { username, password })

                // update pinia state
                this.user = user;

                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));

                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/');
            } catch (error) {
                if ([401].includes(error.response.status)) {
                    const alertStore = useAlertStore();
                    alertStore.error("Username or Password do not match");
                }
            }
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/auth/signin');
        }
    }
});
