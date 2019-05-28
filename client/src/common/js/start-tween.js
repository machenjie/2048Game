export * from "@tweenjs/tween.js";
import TWEEN from "@tweenjs/tween.js";

let _animateStart = false;
function animate() {
    if (TWEEN.update()) {
        requestAnimationFrame(animate);
    }
    else {
        _animateStart = false;
    }
}

export default function (startObj, endObj, updateEvent, duration = 1000, endEvent = null, startEvent = null, delay = 0, mode = TWEEN.Easing.Linear.None) {
    new TWEEN.Tween(startObj)
      .to(endObj, duration)
      .easing(mode)
      .onStart(startEvent)
      .onUpdate(updateEvent)
      .onComplete(endEvent)
      .delay(delay)
      .start();

    if (!_animateStart){
        _animateStart = true;
        animate();
    }
};
