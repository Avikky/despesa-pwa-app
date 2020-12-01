<template>
    <div class="content-centered">
        <q-dialog
        v-model="dialog"
        >
        <q-card style="width: 300px">
            <q-card-section>
            <div class="text-h6 text-center">Are you still there..?</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                We are about to log you out
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-primary">
            <q-btn flat label="Don't Log me out" @click="refreshToken" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>
    </div>
</template>

<script>
    import { Cookies } from 'quasar';
    export default {
        name: "AutoLogout",
        data () {
            return {
                dialog: false,
                events: ['click', 'mousemove', 'mousedown', 'scroll', 'keypress', 'load'],

                warningTimer: null,
                logoutTimer: null,
            }
        },
        methods: {
            refreshToken(){
                this.$store.dispatch('refreshToken');
            },
            setTimers(){
                this.warningTimer = setTimeout(this.warningMsg, 800 * 1000); //test with 7 * 1000
                this.logoutTimer = setTimeout(this.logoutUser, 1000 * 1000); //test with 13 * 1000
                //this.dialog = false;
            },
            warningMsg(){
                this.dialog = true;
            },
            logoutUser(){
                this.$store.dispatch('logout', this.$store.getters.getAuthUser);
            },
            resetTimer(){ 
                clearTimeout(this.warningTimer);
                clearTimeout(this.logoutTimer);
                this.setTimers();
            }
        },
        mounted(){
            this.events.forEach((event) => {
                window.addEventListener(event, this.resetTimer)
            });

            this.setTimers();
        },
        destroyed(){
            this.events.forEach((event) => {
                window.removeEventListener(event, this.resetTimer)
            });

            this.$route.path == '/login' ? clearTimeout(this.logoutTimer) : this.resetTimer();

        },
    }
</script>