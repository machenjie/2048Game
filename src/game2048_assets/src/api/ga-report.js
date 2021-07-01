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
    });
}

const CategoryActions = {
    GA_APP: {
        name: "GA_APP",
        actions: {
            OPERATION_START: "OPERATION_START",
        }
    },
    GA_NORMAL_GAME: {
        name: "GA_NORMAL_GAME",
        actions: {
            OPERATION_START: "OPERATION_START",
            OPERATION_CHANGE_ORDER_ADD: "OPERATION_CHANGE_ORDER_ADD",
            OPERATION_CHANGE_ORDER_MINUS: "OPERATION_CHANGE_ORDER_MINUS",
        }
    },
    GA_CHALLENGE_GAME: {
        name: "GA_CHALLENGE_GAME",
        actions: {
            OPERATION_START: "OPERATION_START",
            OPERATION_LEVEL_CHOOSE: "OPERATION_LEVEL_CHOOSE",
        }
    },
    GA_RATE: {
        name: "GA_RATE",
        actions: {
            OPERATION_NO: "OPERATION_NO",
            OPERATION_YES: "OPERATION_YES",
        }
    },
    GA_RADIO: {
        name: "GA_RADIO",
        actions: {
            OPERATION_ON: "OPERATION_ON",
            OPERATION_OFF: "OPERATION_OFF",
        }
    },
    GA_FEEDBACK: {
        name: "GA_FEEDBACK",
        actions: {
            OPERATION_SHOW: "OPERATION_SHOW",
            OPERATION_CANCEL: "OPERATION_CANCEL",
            OPERATION_SUBMIT: "OPERATION_SUBMIT",
        }
    }
};

export {GaReport as default, CategoryActions};

