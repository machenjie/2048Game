const TID = "UA-136518617-1";

export default function (eventCategory, eventAction, eventLable, eventValue) {
    $.post("http://www.google-analytics.com//collect",{
        v: 1,
        t: "event",
        tid: TID,

    })
}