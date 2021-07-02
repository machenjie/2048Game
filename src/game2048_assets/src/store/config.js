import uuidv1 from "uuid/v1";

export default {
    state: {
        config: {
            uuid: uuidv1(),
            versionNO: "1.0.1",
        },
        user: {
            principal: "",
            userName: "",
            lastLoginAt: Date.now(),
        }
    },
    mutations: {
        setUUID(state, u){
            state.config.uuid = u;
        },
        setVersionNO(state, v){
            state.config.versionNO = v;
        },
        setPrincipal(state, v) {
            state.user.principal = v;
        },
        setUserName(state, v) {
            state.user.userName = v;
        },
        setLastLoginAt(state, v) {
            state.user.lastLoginAt = v;
        },
    }
}