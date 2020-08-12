<template>
    <div class="body d-flex flex-column">
        <div class="navbar navbar-expand-sm" :class="{ 'navbar-dark bg-dark': !isLightTheme, 'navbar-light bg-light': isLightTheme }">
            <span class="navbar-brand order-0" href="#">CAH</span>
            <!-- <div class="collapse navbar-collapse order-sm-0 order-10 mx-5" id="navbarSupportedContent">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link 1</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link 2</a>
                    </li>
                </ul>
            </div> -->
            <!-- <button class="navbar-toggler order-6" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button> -->
        </div>
        <div class="container position-relative">
            <game-overview />
            <toasts />
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import sessionStorage from 'sessionstorage';
    import Cookies from 'js-cookie';
    import { SocketChangePacket, RequestStateUpdatePacket, JoinWithInvitePacket } from '../../common/network/ClientPackets';
    import { ErrorPacket } from '../../common/network/ServerPackets';
    import RoomList from './roomlist/RoomList.vue';
    import GameOverview from './game/GameOverview.vue';
    import Room from '../../common/models/Room';
    import { mapGetters } from 'vuex';
    import Login from './common/Login.vue';
    import Toasts from './toasts/ToastHolder.vue';
    import Settings from './common/Settings.vue';
    import UserManagement from './common/UserManagement.vue';

    const STORAGE_PREVIOUS_ID = 'STORAGE_PREVIOUS_ID';

    export default Vue.extend({
        components: { 
            'game-overview': GameOverview,
            'toasts': Toasts,
        },
        computed: {
            currentRoom(): Room {
                return this.$store.state.room;
            },
            isLightTheme(): boolean {
                return false; // TODO
            }
        },
        mounted: function() {
            this.doTheming();
            this.handleHash();
        },
        methods: {
            doTheming: function() {
                if (this.isLightTheme) {
                    $("#darkTheme").attr("disabled", "disabled");
                    $("#lightTheme").removeAttr("disabled");
                } else {
                    $("#darkTheme").removeAttr("disabled");
                    $("#lightTheme").attr("disabled", "disabled");
                }
            },
            handleHash: function() {
                let hashRegex = /^(#|)invite=(.*)$/;
                
                let hashExec = hashRegex.exec(document.location.hash);
                
                if (hashExec != null) {
                    this.$socket.send(new JoinWithInvitePacket(hashExec[2]));
                }

                // Clear hash
                history.pushState("", document.title, window.location.pathname + window.location.search);
            }
        },
        sockets: {
            connect: function() {
                let id = Cookies.get(STORAGE_PREVIOUS_ID);
                Cookies.set(STORAGE_PREVIOUS_ID, this.$socket.id, {
                    sameSite: 'Strict',
                    secure: document.location.protocol == 'https',
                    expires: 1 // Expires in 1 day
                });

                if (id != undefined && id != "undefined" && this.$socket.id !== id) {
                    this.$socket.send(new SocketChangePacket(id));
                } else {
                    this.$socket.send(new RequestStateUpdatePacket());
                }
            }
        }
    });
    
</script>

<style scoped>
    .body {
        height: 100%;
    }

    .navbar {
        flex-shrink: 0;
    }

    .container {
        flex: 1 0 auto;
    }
</style>