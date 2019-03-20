const TID = "UA-136518617-1";

function GaReport (uuid, vid, eventCategory, eventAction, eventLabel = "default", eventValue = "0") {
    $.post("https://www.google-analytics.com/collect",{
        v: 1,
        t: "event",
        tid: encodeURI(TID),
        cid: encodeURI(uuid),
        an: "2048Game",
        av: encodeURI(vid),
        ec: encodeURI(eventCategory),
        ea: encodeURI(eventAction),
        el: encodeURI(eventLabel),
        ev: encodeURI(eventValue)
    })
}

const CategoryActions = {
    GA_APP_OPERATION: {
        name: "GA_APP_OPERATION",
        actions: {
            OPERATION_START: "OPERATION_START",
            OPERATION_HEARTBEAT: "OPERATION_HEARTBEAT",
        }
    },
}

export {GaReport as default, CategoryActions};

