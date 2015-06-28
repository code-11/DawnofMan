requirejs(["setups","jquery","actions","dev_setups","time"], function(setups,$,actions,dev_setups,time) {
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
var all_ids=["#house","#food","#water","#pop","#flint","#mine","#irrigation","#fort","#weapons","#tools"];
var all_devs=dev_setups.test(all_points);

//choice_test_full();
j=0;
var clock=new time.Time(0);

//give all points a reference to the master clock in case they need it
for (var i=0;i<all_points.length;i+=1){
    all_points[i].config_clock(clock);
}
for (var i=0;i<all_devs.length;i+=1){
    all_devs[i].config_clock(clock);
}

$(document).ready(function(){
	for(var i=0;i<all_points.length;i+=1){
		var init_func=all_points[i].init;
		if (init_func){
			all_points[i].init();
		}
	}
    $("#next").click(function(){
        actions.next(all_points,all_ids,all_devs,clock);
    });
    $("#food_source_link").click(function(){
    	actions.switch_to("mainbar","food_source");
    });
    $("#event_link").click(function(){
    	actions.switch_to("mainbar","event_box");
    });
    $("#work_alot_link").click(function(){
    	actions.switch_to("mainbar","work_alot");
    });
    $("#constr_alot_link").click(function(){
    	actions.switch_to("mainbar","constr_alot");
    });
    $("#craft_alot_link").click(function(){
        actions.switch_to("mainbar","craft_alot");
    });
    $("#sidebar-basic-link").click(function(){
        actions.sidebar_to_basic();
    });
    $("#sidebar-advanced-link").click(function(){
        actions.sidebar_to_advanced();
    });
    $("#sidebar-advanced").css("display","none");
    $("#food_source").css("display","none");
    $("#work_alot").css("display","none");
    $("#constr_alot").css("display","none");
    $("#craft_alot").css("display","none");
});

});