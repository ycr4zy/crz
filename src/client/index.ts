onNet("onClientMapStart", () => {
    emitNet('playerReady');
    DoScreenFadeOut(0);
})