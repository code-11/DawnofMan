requirejs(["setups","jquery"], function(setups,$) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".


//disconnect_test_full();
//var all_points=hunger_test();
//var all_points=thirst_test();
all_points=setups.shelter_test();
//choice_test_full();
j=0;

function next(){
	for(var i = 0;i < all_points.length;i += 1){
		var point = all_points[i];
		point.full_calc();
	}
	for(var k=0;k<all_points.length;k+=1){
		var point=all_points[k];
		point.display();
	}
	console.log("----------- "+(j+1));
	j+=1;
}

$(document).ready(function(){
    $("#next").click(function(){
        next();
    });
});

});