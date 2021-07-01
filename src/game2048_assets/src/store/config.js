import uuidv1 from "uuid/v1";

export default {
    state: {
        config: {
            uuid: uuidv1(),
            versionNO: "1.0.1",
        },
    },
    mutations: {
        setUUID(state, u){
            state.config.uuid = u;
        },
        setVersionNO(state, v){
            state.config.versionNO = v;
        },
    }
}