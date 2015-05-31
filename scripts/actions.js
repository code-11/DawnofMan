define(["./flow","jquery"], function(flow,$) {
var actions = actions || {};
actions.next=function(all_points,all_ids){
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
	j+=1;
}

actions.update_all=function(all_points,all_ids){
	var id_to_disp={
			"#house":"Shelter Unit",
			"#pop":"Pop Unit",
			"#food":"Food Unit",
			"#water":"Water"
	};
	for (var l=0;l<all_ids.length;l+=1){
		var id=all_ids[l];
		var point=flow.select(all_points,id_to_disp[id]);
		if (point!=undefined){
			$(document).ready(function(){
				$(id).text(point.value);
			});
		}else{
			console.log(id+" was undefined");
		}
	}
	
}
return actions;
});