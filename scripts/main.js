requirejs(["flow"], function(flow) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
function hunger_test(){
	var shelter     = new flow.Point("Shelter Unit",0);
	var pop_health  = new flow.Rate("Pop Health"   ,0);
	var pop_delta   = new flow.Mult("Pop Delta"    ,1);
	var nat_pop_rate= new flow.Source("Nat Pop Rate",.0003);//realistic is .00003
	var pop_rate    = new flow.Rate("Pop Rate"     ,0);
	var pop         = new flow.Point("Pop Unit"    ,10);
	var work        = new flow.Rate("Work Unit"    ,0);
	var food        = new flow.Point("Food Unit"   ,10000);
	var gather_type = new flow.Point("Gather Type" ,0);
	var food_rate   = new flow.Rate("Food Rate"    ,0);
	var exposure    = new flow.Sub("Exposure"     ,0);
	var hunger      = new flow.Sub("Hunger"       ,0);

	flow.add_low_shift(food,0,0);
	flow.add_low_shift(pop,1,0);
	flow.add_low_shift(hunger,0,0);

	pop.conn_to(pop_delta,1);
	pop.conn_to(food,-1);
	pop_rate.conn_to(pop_delta,1);
	pop_delta.conn_to(pop,1);

	nat_pop_rate.conn_to(pop_rate,1);

	//hunger subtracts population from food 
	pop.conn_to(hunger,1);
	food.conn_to(hunger,1);

	hunger.conn_to(pop,-.1);
	return [nat_pop_rate,pop_rate,pop_delta,pop,food,hunger];
}

function thirst_test(){
	var pop_delta   = new flow.Mult("Pop Delta"    ,1);
	var nat_pop_rate= new flow.Source("Nat Pop Rate",.003);//realistic is .00003
	var pop_rate    = new flow.Rate("Pop Rate"     ,0);
	var pop         = new flow.Point("Pop Unit"    ,90);
	var pop_clamp   = new flow.LowClamp("Pop Clamp",pop,1,-1);
	var water       = new flow.Rate("Water"        ,0);
	var water_inflow= new flow.Source("Water Inflow",10);
	var water_clamp = new flow.LowClamp("Water Clamp",water,0,0);
	var thirst      = new flow.Dup("Thirst"        ,0);
	var thirst_clamp= new flow.LowClamp("Thirst Clamp",thirst,0,0); 

	// flow.debug(water);
	//flow.debug(thirst);

	pop.conn_to(pop_delta,1);
	pop_rate.conn_to(pop_delta,1);
	pop_delta.conn_to(pop,1);
	nat_pop_rate.conn_to(pop_rate,1);

	pop.conn_to(water,-1);
	water_inflow.conn_to(water,1);
	water.conn_to(thirst,-1);

	thirst.conn_to(pop,-.1);
	return [nat_pop_rate,pop_rate,pop_delta,pop,pop_clamp,water_inflow,water,thirst,water_clamp,thirst_clamp];
}

//var all_points=hunger_test();
var all_points=thirst_test();
for (var j = 0;j < 1000;j += 1){
	for(var i = 0;i < all_points.length;i += 1){
		var point = all_points[i];
		point.full_calc();
	}
	for(var k=0;k<all_points.length;k+=1){
		var point=all_points[k];
		point.display();
	}
	console.log("----------- "+(j+1));
}

});