<template>
    <div class="body d-flex flex-column">
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

    export default Vue.extend({
        name: 'gameOverview',
        computed: {
            room(): Room {
                return this.$store.state.room;
            },
        },
        methods: {
            openLeaveRoom() {
                (this.$refs.leavePrompt as any).show();
            },
            leaveRoom: function() {
                // this.$socket.send(new LeaveRoomPacket());
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