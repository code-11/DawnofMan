define(["./flow","jquery"], function(flow,$) {
var actions = actions || {};

actions.switch_to=function(main,o_id){
	$("#"+main).children().css("display","none");
	$("#"+o_id).css("display","initial");
}

actions.sidebar_to_basic=function(){
	$("#sidebar-advanced").css("display","none");
	$("#sidebar-basic").css("display","initial");
}
actions.sidebar_to_advanced=function(){
	$("#sidebar-basic").css("display","none");
	$("#sidebar-advanced").css("display","initial");
}

actions.update_time=function(new_time){
	$("#time").text(new_time);
}
actions.reset_events=function(){}

actions.next=function(all_points,all_ids,all_devs){
	actions.reset_events(j);
	for(var i=0; i<all_devs.length;i+=1){
		var devlop=all_devs[i];
		if (devlop.active==true){
			devlop.check_results(all_points);
		}
	}
	for(var i = 0;i < all_points.length;i += 1){
		var point = all_points[i];
		point.full_calc();
	}
	for(var k=0;k<all_points.length;k+=1){
		var point=all_points[k];
		point.display();
	}
	console.log("----------- "+(j+1));
	actions.update_all(all_points,all_ids);
	actions.update_time(j);
	j+=1;
}

actions.update_all=function(all_points,all_ids,year){
	var id_to_disp={
			"#house":"Shelter Unit",
			"#pop":"Pop Unit",
			"#food":"Food Unit",
			"#water":"Water",
			"#flint":"Flint",
			"#mine":"Mine Unit",
			"#irrigation":"Irrigation Unit",
			"#fort":"Fort Unit",
			"#weapons":"Weapons",
			"#tools":"Tools"

	};
	for (var l=0;l<all_ids.length;l+=1){
		var id=all_ids[l];
		var point=flow.select(all_points,id_to_disp[id]);
		if (point!=undefined){
			$(document).ready(function(){
				$(id).text(point.value.toFixed(0));
			});
		}else{
			console.log(id+" was undefined");
		}
	}
}
return actions;
});