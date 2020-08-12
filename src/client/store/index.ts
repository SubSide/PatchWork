import Vuex from 'vuex';
import { RoomStatePacket } from '../../common/network/ServerPackets';
import Room from '../../common/models/Room';

export default new Vuex.Store({
    state: {
        room: null,
        isPlayer1: false
    },
    mutations: {
        SOCKET_roomState(state, packet: RoomStatePacket) {
            state.room = packet.room;
            state.isPlayer1 = packet.isPlayer1;
        }
    },
    getters: {
        room: function(state): Room {
            return state.room as Room
        },
        isPlayer1: function(state): Boolean {
            return state.isPlayer1 as Boolean;
        }
    }
});