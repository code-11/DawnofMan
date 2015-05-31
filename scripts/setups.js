define(["./flow"], function(flow) {
var setups = setups || {};
setups.hunger_test=function (){
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

setups.thirst_test=function(){
	var pop_delta   = new flow.Mult("Pop Delta"    ,1);
	var nat_pop_rate= new flow.Source("Nat Pop Rate",.003);//realistic is .00003
	var pop_rate    = new flow.Rate("Pop Rate"     ,0);
	var pop         = new flow.Point("Pop Unit"    ,90);
	var pop_clamp   = new flow.LowClamp(pop,1,-1);
	var water       = new flow.Rate("Water"        ,0);
	var water_inflow= new flow.Source("Water Inflow",10);
	var water_clamp = new flow.LowClamp(water,0,0);
	var thirst      = new flow.Dup("Thirst"        ,0);
	var thirst_clamp= new flow.LowClamp(thirst,0,0); 

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
setups.shelter_test=function(){
	var pop_delta   = new flow.Mult("Pop Delta"    ,1);
	var nat_pop_rate= new flow.Source("Nat Pop Rate",.003);//realistic is .00003
	var pop_rate    = new flow.Rate("Pop Rate"     ,0);
	var pop         = new flow.Point("Pop Unit"    ,90);
	var pop_clamp   = new flow.LowClamp(pop,1,-1);
	var eff         = new flow.Mult("Efficiency"   ,1);
	var nat_eff     = new flow.Source("Nat Efficiency",10);
	var work        = new flow.Rate("Work"         ,0);
	var shelter     = new flow.Point("Shelter Unit"     ,0);
	var exposure    = new flow.Rate("Exposure"     ,0);
	var exposure_clamp=new flow.LowClamp(exposure,0,0);

	pop.conn_to(pop_delta,1);
	pop_rate.conn_to(pop_delta,1);
	pop_delta.conn_to(pop,1);
	nat_pop_rate.conn_to(pop_rate,1);

	pop.conn_to(eff,1);
	nat_eff.conn_to(eff,1);

	eff.conn_to(work,1);
	work.conn_to(shelter,.01);
	shelter.conn_to(exposure,-1);
	pop.conn_to(exposure,1);

	exposure.conn_to(pop,-.03);

	return [nat_pop_rate,pop_rate,pop_delta,pop,pop_clamp,nat_eff,eff,work,shelter,exposure,exposure_clamp];
}
setups.disconnect_test=function(){
	var pop_delta   = new flow.Mult("Pop Delta"    ,1);
	var nat_pop_rate= new flow.Source("Nat Pop Rate",.003);//realistic is .00003
	var pop_rate    = new flow.Rate("Pop Rate"     ,0);
	var pop         = new flow.Point("Pop Unit"    ,90);

	pop.conn_to(pop_delta,1);
	pop_rate.conn_to(pop_delta,1);
	pop_delta.conn_to(pop,1);
	nat_pop_rate.conn_to(pop_rate,1);

	return [nat_pop_rate,pop_rate,pop_delta,pop];
}

setups.disconnect_test_full=function(){
	var all_points=setups.disconnect_test();
	for (var j = 0;j < 100;j += 1){
		if (j==50){
			all_points[0].break_conn_to(all_points[1]);
		}
		for(var i = 0;i < all_points.length;i += 1){
			var point = all_points[i];
			point.full_calc();
		}
		for(var k=0;k<all_points.length;k+=1){
			var point=all_points[k];
			if(k==1){
				point.display_conns();
			}
			point.display();
		}
		console.log("----------- "+(j+1));
	}
}

setups.choice_test=function(){
	var pop_delta   = new flow.Mult("Pop Delta"    ,1);
	var nat_pop_rate= new flow.Source("Nat Pop Rate",.003);//realistic is .00003
	var nat_pop_rate2= new flow.Source("Nat Pop Rate2",0);
	var nat_pop_rate3= new flow.Source("Nat Pop Rate3",-.003);
	var pop_rate    = new flow.Rate("Pop Rate"     ,0);
	var pop         = new flow.Point("Pop Unit"    ,90);

	var opt1=function(){
		nat_pop_rate2.break_conn_to(pop_rate);
		nat_pop_rate3.break_conn_to(pop_rate);
		nat_pop_rate.conn_to(pop_rate,1);
	};
	var opt2=function(){
		nat_pop_rate.break_conn_to(pop_rate);
		nat_pop_rate3.break_conn_to(pop_rate);
		nat_pop_rate2.conn_to(pop_rate,1);
	};
	var opt3=function(){
		nat_pop_rate.break_conn_to(pop_rate);
		nat_pop_rate2.break_conn_to(pop_rate);
		nat_pop_rate3.conn_to(pop_rate,1);
	};
	var options={"grow":opt1,"neutral":opt2,"shrink":opt3};

	var rate_choice = new flow.Choice("Rate Choice","grow",options);


	pop.conn_to(pop_delta,1);
	pop_rate.conn_to(pop_delta,1);
	pop_delta.conn_to(pop,1);
	nat_pop_rate.conn_to(pop_rate,1);

	return [rate_choice,nat_pop_rate,pop_rate,pop_delta,pop];
}
setups.choice_test_full=function(){
	var all_points=setups.choice_test();
	for (var j = 0;j < 100;j += 1){
		if (j==30){
			all_points[0].value="neutral";
		}
		if (j==70){
			all_points[0].value="shrink";
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
	}
}

return setups;
});