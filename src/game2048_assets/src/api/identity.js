import {AuthClient} from "@dfinity/auth-client";

// let identityProvider = "http://rwlgt-iiaaa-aaaaa-aaaaa-cai.localhost:8000/";
let identityProvider = null;
let localhostProvider = !!identityProvider;
let authClient;
let inInitAuthClient = false;

async function getAuthClient() {
    while (inInitAuthClient) {
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 100)
        });
    }
    if (authClient) {
        return authClient;
    }
    inInitAuthClient = true;
    try {
        authClient = await AuthClient.create();
    } catch (e) {
        console.log(e);
    }
    inInitAuthClient = false
    return authClient;
}

export {identityProvider, localhostProvider, getAuthClient};