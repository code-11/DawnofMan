requirejs(["setups","jquery","actions"], function(setups,$,actions) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".


//disconnect_test_full();
var all_points=setups.hunger_test();
//var all_points=thirst_test();
//var all_points=setups.shelter_test();

var all_ids=["#house","#food","#water","#pop"];

//choice_test_full();
j=0;

$(document).ready(function(){
    $("#next").click(function(){
        actions.next(all_points,all_ids);
    });
});

});