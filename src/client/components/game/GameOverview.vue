<template>
    <div class="body d-flex flex-column">
        <div v-if="room == null">
            <button class="btn btn-success" @click="createRoom">Create a room</button>
        </div>
        <div v-else>We got a room! Test. {{room}}</div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Player from '../../../common/models/Player';
    import Room from '../../../common/models/Room';
    import Game from './Game.vue';
    import RoomSettings from './RoomSettings.vue';
    import PlayerList from './PlayerList.vue';
    import ding from '../../assets/sounds/ding.wav';
import { CreateRoomPacket } from '../../../common/network/ClientPackets';

    export default Vue.extend({
        name: 'gameOverview',
        computed: {
            room(): Room {
                return this.$store.state.room;
            },
        },
        methods: {
            createRoom() {
                this.$socket.send(new CreateRoomPacket());
            }

        },
        components: {
            'game': Game,
        }
    });
</script>

<style scoped>
    .body {
        height: 100%;
    }

    .footer {
        flex-shrink: 0;
    }

    .content {
        flex: 1 0 auto;
    }
</style>