(function () {
  var envelope = document.getElementById("envelope");
  var envelopeWrapper = document.querySelector(".envelope-wrapper");
  var tapHint = document.getElementById("tap-hint");
  var cardSlot = document.getElementById("card-slot");
  var cardQuestion = document.getElementById("card-question");
  var cardYes = document.getElementById("card-yes");
  var cardNo = document.getElementById("card-no");
  var btnYes = document.getElementById("btn-yes");
  var btnNo = document.getElementById("btn-no");
  var btnYesReconfirm = document.getElementById("btn-yes-reconfirm");
  var btnNoReconfirm = document.getElementById("btn-no-reconfirm");
  var noFinal = document.getElementById("no-final");
  var audioHappy = document.getElementById("audio-happy");
  var audioSad = document.getElementById("audio-sad");
  var happyFallback = document.getElementById("audio-happy-fallback");
  var sadFallback = document.getElementById("audio-sad-fallback");

  var HAPPY_SONG = "audio/happy.mp3";
  var SAD_SONG = "audio/sad.mp3";

  function playOne(audio, mainSrc, fallbackSource) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.muted = false;
    audio.src = mainSrc;
    audio.load();
    audio.play().catch(function () {
      if (fallbackSource && fallbackSource.src) {
        audio.src = fallbackSource.src;
        audio.load();
        audio.play().catch(function () {});
      }
    });
  }

  function playBackgroundMusic(state) {
    if (audioHappy) audioHappy.pause();
    if (audioSad) audioSad.pause();
    if (state === "yes" && audioHappy) playOne(audioHappy, HAPPY_SONG, happyFallback);
    else if (state === "no" && audioSad) playOne(audioSad, SAD_SONG, sadFallback);
  }

  function setCardState(state) {
    if (!cardSlot || !cardQuestion || !cardYes || !cardNo) return;
    cardQuestion.classList.remove("active");
    cardYes.classList.remove("active");
    cardNo.classList.remove("active");
    if (state === "question") {
      cardQuestion.classList.add("active");
      playBackgroundMusic(null);
    } else if (state === "yes") {
      cardYes.classList.add("active");
      playBackgroundMusic("yes");
    } else if (state === "no") {
      cardNo.classList.add("active");
      playBackgroundMusic("no");
    }
  }

  function openEnvelope() {
    if (!envelope || envelope.classList.contains("open")) return;
    envelope.classList.add("open");
    if (cardSlot) {
      cardSlot.classList.add("visible", "card-out");
      setCardState("question");
    }
    if (tapHint) tapHint.classList.add("hidden");
  }

  // Open envelope on tap/click (envelope or hint)
  if (envelope) {
    envelope.addEventListener("click", function () {
      openEnvelope();
    });
  }
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener("click", function (e) {
      if (e.target.classList.contains("tap-hint")) openEnvelope();
    });
  }

  // Don't open when clicking inside the card slot (buttons)
  if (cardSlot) {
    cardSlot.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  if (btnYes) {
    btnYes.addEventListener("click", function (e) {
      e.stopPropagation();
      setCardState("yes");
    });
  }

  if (btnNo) {
    btnNo.addEventListener("click", function (e) {
      e.stopPropagation();
      setCardState("no");
    });
  }

  if (btnYesReconfirm) {
    btnYesReconfirm.addEventListener("click", function () {
      setCardState("yes");
    });
  }

  if (btnNoReconfirm) {
    btnNoReconfirm.addEventListener("click", function () {
      if (noFinal) noFinal.classList.remove("hidden");
      btnNoReconfirm.style.visibility = "hidden";
    });
  }
})();
