import Vuex from 'vuex';
import { RoomStatePacket } from '../../common/network/ServerPackets';
import Room from '../../common/models/Room';

export default new Vuex.Store({
    state: {
        room: null
    },
    mutations: {
        SOCKET_roomState(state, packet: RoomStatePacket) {
            state.room = packet
        }
    },
    getters: {
        room: function(state): Room {
            return state.room as Room
        }
    }
});