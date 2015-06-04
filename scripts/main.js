requirejs(["setups","jquery","actions"], function(setups,$,actions) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".


//disconnect_test_full();
//var all_points=setups.hunger_test();
//var all_points=thirst_test();
//var all_points=setups.shelter_test();
var all_points=setups.main_sim();
//var all_points=setups.decision_test();
var all_ids=["#house","#food","#water","#pop"];

//choice_test_full();
j=0;

$(document).ready(function(){
	for(var i=0;i<all_points.length;i+=1){
		var init_func=all_points[i].init;
		if (init_func){
			all_points[i].init();
		}
	}
    $("#next").click(function(){
        actions.next(all_points,all_ids);
    });
    $("#food_source_link").click(function(){
    	actions.switch_to("mainbar","food_source");
    });
    $("#event_delta_link").click(function(){
    	actions.switch_to("mainbar","event-delta");
    });
    $("#work_alot_link").click(function(){
    	actions.switch_to("mainbar","work_alot");
    });
    $("#constr_alot_link").click(function(){
    	actions.switch_to("mainbar","constr_alot");
    });
    $("#food_source").css("display","none");
    $("#work_alot").css("display","none");
    $("#constr_alot").css("display","none");
});

});