define(["./flow"], function(flow) {
var setups = setups || {};
setups.hunger_test=function (){
	var pop_delta   = new flow.Mult("Pop Delta"    ,1);
	var nat_pop_rate= new flow.Source("Nat Pop Rate",.03);//realistic is .00003
	var pop_rate    = new flow.Rate("Pop Rate"     ,0);
	var pop         = new flow.Point("Pop Unit"    ,10);
	var pop_clamp   = new flow.LowClamp(pop,1,-1);
	var food        = new flow.Point("Food Unit"   ,10000);
	var hunger      = new flow.Dup("Hunger"       ,0);
	var food_clamp	= new flow.LowClamp(food,0,0);
	var hunger_clamp= new flow.LowClamp(hunger,0,0);

	pop.conn_to(pop_delta,1);
	pop_rate.conn_to(pop_delta,1);
	pop_delta.conn_to(pop,1);
	nat_pop_rate.conn_to(pop_rate,1);

	pop.conn_to(food,-1);
	//hunger subtracts population from food 
	food.conn_to(hunger,-1);
	hunger.conn_to(pop,-.1);
	return [nat_pop_rate,pop_rate,pop_delta,pop,pop_clamp,food,hunger,food_clamp,hunger_clamp];
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
setups.decision_test=function(){
	var thing=new flow.Source("Work",100);

	var hunt_perc= new flow.Source("Hunting Percent" ,0);
	var farm_perc= new flow.Source("Farming Percent" ,0);

	var hunt_path= new flow.Path(hunt_perc,"hunt_path","food_source");
	var farm_path= new flow.Path(farm_perc,"farm_path","food_source");

	var hunt= new flow.Mult("Hunting" ,0);
	var farm= new flow.Mult("Farming" ,0);

	var type_of_food= new flow.Decision([hunt_path,farm_path],"food_type","food_source");

	thing.conn_to(hunt,1);
	hunt_perc.conn_to(hunt,1);

	thing.conn_to(farm,1);
	farm_perc.conn_to(farm,1);

	return [hunt_path,farm_path,type_of_food,thing,hunt,farm];

	// var fish_path= new flow.Path("fish_path","Fishing","decisions");
	// var scav_path= new flow.Path("scav_path","Scavenging","decisions");
	// var hus_path= new flow.path("hus_path","Husbandry","decisions");


}
setups.main_sim=function(){
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
	var water       = new flow.Rate("Water"        ,0);
	var water_inflow= new flow.Source("Water Inflow",100);
	var water_clamp = new flow.LowClamp(water,0,0);
	var thirst      = new flow.Dup("Thirst"        ,0);
	var thirst_clamp= new flow.LowClamp(thirst,0,0);
	var hunger      = new flow.Dup("Hunger"       ,0);
	var food        = new flow.Point("Food Unit"   ,10000);
	var food_clamp	= new flow.LowClamp(food,0,0);
	var hunger_clamp= new flow.LowClamp(hunger,0,0);

	//BIRTHS
	pop.conn_to(pop_delta,1);
	pop_rate.conn_to(pop_delta,1);
	pop_delta.conn_to(pop,1);
	nat_pop_rate.conn_to(pop_rate,1);

	//FOOD
	pop.conn_to(food,-1);
	food.conn_to(hunger,-1);
	hunger.conn_to(pop,-.1);

	//WATER
	pop.conn_to(water,-1);
	water_inflow.conn_to(water,1);
	water.conn_to(thirst,-1);
	thirst.conn_to(pop,-.1);

	//SHELTER
	pop.conn_to(eff,1);
	nat_eff.conn_to(eff,1);
	eff.conn_to(work,1);
	work.conn_to(shelter,.01);
	shelter.conn_to(exposure,-1);
	pop.conn_to(exposure,1);
	exposure.conn_to(pop,-.03);

	var pop_stuff=[nat_pop_rate,pop_rate,pop_delta,pop,pop_clamp];
	var water_stuff=[water_inflow,water,thirst,water_clamp,thirst_clamp];
	var food_stuff=[food,hunger,food_clamp,hunger_clamp];
	var shelter_stuff=[nat_eff,eff,work,shelter,exposure,exposure_clamp];

	return pop_stuff.concat(water_stuff).concat(food_stuff).concat(shelter_stuff);
}

return setups;
});