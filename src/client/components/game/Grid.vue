<template>
    <div class="row pt-5">

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Player from '../../../common/models/Player';
    import Room from '../../../common/models/Room';
    import TileVue from './Tile.vue';
    
    export default Vue.extend({
        name: 'game',
        data: function() {
            return {
                playingCards: [],
                czarPicked: null
            }
        },
        computed: {
            room(): Room {
                return this.$store.state.game.room;
            },
        },
        methods: {
            play: function() {
                // this.$socket.send(new PlayCardPacket(this.playingCards));
                // TODO
            }
        },
        components: {
            'tile': TileVue,
        }
    })
</script>

<style scoped>

</style>