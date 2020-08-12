<template>
    <div class="row pt-5">

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Player from '../../../common/models/Player';
    import Room from '../../../common/models/Room';
    import { TilePlacement } from '../../../common/models/Tile';
    
    export default Vue.extend({
        name: 'tile',
        data: function() {
            return {
                tilePlacement: null, // TilePlacement
            }
        },
        computed: {
            tileP: function(): TilePlacement {
                return this.tilePlacement as TilePlacement;
            }
        },
        methods: {
            play: function() {
                // this.$socket.send(new PlayCardPacket(this.playingCards));
                // TODO
            }
        },
    })
</script>

<style scoped>

</style>