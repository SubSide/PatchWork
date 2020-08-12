<template>
    <div class="row pt-5">
        <div class="col-12">
        </div>
        <!-- The play button -->
        <div class="col-12 mt-3">
            <button class="btn btn-primary" :disabled="!canPlay" @click="play">{{ playButtonText }}</button>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Player from '../../../common/models/Player';
    import Room from '../../../common/models/Room';
    import TileVue from './Tile.vue';
    
    export default Vue.extend({
        name: 'game',
        computed: {
            room(): Room {
                return this.$store.state.room;
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