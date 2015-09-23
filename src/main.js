require.config({
    baseUrl : '/',
    paths : {
        pixi : 'libs/pixi'
    },
});


require(['pixi'],function(pixi){
    console.log("test",pixi);

});
