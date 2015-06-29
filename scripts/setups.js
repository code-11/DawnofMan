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
	var pop         = new flow.Point("Pop Unit"    ,50);
	var pop_alert   = new flow.LowAlert(pop,"Your people are broken. They are no more.");
	var pop_clamp   = new flow.LowClamp(pop,1,-1);
	//var eff         = new flow.Mult("Efficiency"   ,1);
	//var nat_eff     = new flow.Source("Nat Efficiency",10);
	var work        = new flow.Rate("Work"         ,0);
	var water       = new flow.Point("Water"        ,1000);
	var water_env   = new flow.Rate("Available Water",0); 
	var water_inflow= new flow.Source("Water Inflow",100);
	var water_clamp = new flow.LowClamp(water,0,0);
	var water_limit = new flow.Least("Water Limit");
	var thirst      = new flow.Dup("Thirst"        ,0);
	var thirst_alert= new flow.PresenceAlert(thirst,"The people cry for water! The weak and old collapse dead in the streets!");
	var thirst_clamp= new flow.LowClamp(thirst,0,0);
	var hunger      = new flow.Dup("Hunger"       ,0);
	var hunger_alert= new flow.PresenceAlert(hunger,"There is no more food! The weak and old collapse dead in the streets!");
	var food        = new flow.Point("Food Unit"   ,1000);
	var food_clamp	= new flow.LowClamp(food,0,0);
	var hunger_clamp= new flow.LowClamp(hunger,0,0);

	var gather_perc    =new flow.Source("Food Gather Percent",0);
	var construct_perc =new flow.Source("Construction Percent",0);
	var mining_perc    =new flow.Source("Mining Percent",0);
	var soldier_perc   =new flow.Source("Soldier Percent",0);
	var craft_perc     =new flow.Source("Craft Percent"  ,0);
	var water_perc     =new flow.Source("Water Percent"  ,0);
	var food_force     =new flow.Mult  ("Food Force"     ,0);
	var construct_force=new flow.Mult  ("Construct Force",0);
	var mining_force   =new flow.Mult  ("Mining Force",   0);
	var soldier_force  =new flow.Mult  ("Soldier Force",  0);
	var craft_force    =new flow.Mult  ("Craft Force"  ,  0);
	var water_force    =new flow.Mult  ("Water Force"  ,  0);
	var gather_path    =new flow.Path  (gather_perc,"gather_path","work_alot");
	var construct_path =new flow.Path  (construct_perc,"construct_path","work_alot");
	var mining_path    =new flow.Path  (mining_perc,"mining_path","work_alot");
	var soldier_path   =new flow.Path  (soldier_perc,"soldier_path","work_alot");
	var craft_path     =new flow.Path  (craft_perc,"craft_path","work_alot");
	var water_path     =new flow.Path  (water_perc,"water_path","work_alot");
	var work_alotment  =new flow.Decision([gather_path,construct_path,mining_path,soldier_path,craft_path,water_path],"work_type","work_alot");

	var water_inef_alert= new flow.GreaterAlert(water_force,water_env,.1,"People crowd the river trying to get water.");

	var weapon_perc   =new flow.Source("Weapon Percent",0);
	var tool_perc     =new flow.Source("Tool Percent",0);
	var weapon_path   =new flow.Path(weapon_perc,"weapon_path","craft_alot");
	var tool_path     =new flow.Path(tool_perc,"tool_path","craft_alot");
	var weapon_temp   =new flow.Mult("Weapon Rate",0);
	var tool_temp     =new flow.Mult("Tool Rate"  ,0);
	var weapons       =new flow.Point("Weapons"   ,0);
	var tools         =new flow.Point("Tools"     ,0);
	var craft_alotment = new flow.Decision([weapon_path,tool_path],"craft_type","craft_alot");


	var hunt_perc= new flow.Source("Hunting Percent" ,0);
	var farm_perc= new flow.Source("Farming Percent" ,0);
	var idle_perc= new flow.Source("Idle    Percent" ,0);
	var hunt_path= new flow.Path(hunt_perc,"hunt_path","food_source");
	var farm_path= new flow.Path(farm_perc,"farm_path","food_source");
	var idle_path= new flow.Path(idle_perc,"idle_path","food_source");
	var hunt= new flow.Mult("Hunting" ,0);
	var farm= new flow.Mult("Farming" ,0);
	var type_of_food= new flow.Decision([hunt_path,farm_path,idle_path],"food_type","food_source");

	var shelter        = new flow.Point("Shelter Unit"     ,60);
	var shelter_temp   = new flow.Mult("Shelter Rate"); 
	var shelter_perc   = new flow.Source("Shelter Percent" ,0);
	var shelter_path   = new flow.Path(shelter_perc,"shelter_path","constr_alot");
	var exposure       = new flow.Rate("Exposure"     ,0);
	var exposure_alert = new flow.PresenceAlert(exposure,"The homeless are dying of exposure!");
	var exposure_clamp = new flow.LowClamp(exposure,0,0);
	var irrigation     = new flow.Point("Irrigation Unit"  ,0);
	var irrigation_temp= new flow.Mult("Irrigation Rate",0);
	var irrigation_perc= new flow.Source("Irrigation Percent",0);
	var irrigation_path= new flow.Path(irrigation_perc,"irrigation_path","constr_alot");
	var mine           = new flow.Point("Mine Unit",0);
	var mine_temp      = new flow.Mult("Mine Building Rate");
	var mine_perc      = new flow.Source("Mine Building Percent",0);
	var mine_path      = new flow.Path(mine_perc,"mine_build_path","constr_alot");
	var fort           = new flow.Point("Fort Unit",0);
	var fort_temp      = new flow.Mult("Fortification Rate");
	var fort_perc      = new flow.Source("Fortification Percent",0);
	var fort_path      = new flow.Path(fort_perc,"fort_build_path","constr_alot");
	var constr_alotment= new flow.Decision([shelter_path,irrigation_path, mine_path,fort_path],"constr_type","constr_alot");
	
	var mine_inef_alert= new flow.GreaterAlert(mining_force,mine,10,"There is not enough space in the mines.");
	var mine_limit     = new flow.Least("Mine Limit");
	var flint          = new flow.Point("Flint",0);

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
	water_inflow.conn_to(water_env,1);
	water_env.conn_to(water_limit,1);
	water_force.conn_to(water_limit,10);
	water_limit.conn_to(water,1);
	water.conn_to(thirst,-1);
	thirst.conn_to(pop,-.1);

	//WORK
	//pop.conn_to(eff,1);
	//nat_eff.conn_to(eff,1);
	//eff.conn_to(work,1);
	pop.conn_to(work,1);
	work.conn_to(construct_force,1);
	work.conn_to(food_force,1);
	work.conn_to(mining_force,1);
	work.conn_to(soldier_force,1);
	work.conn_to(craft_force,1);
	work.conn_to(water_force,1);
	gather_perc.conn_to(food_force,1);
	construct_perc.conn_to(construct_force,1);
	mining_perc.conn_to(mining_force,1);
	soldier_perc.conn_to(soldier_force,1);
	craft_perc.conn_to(craft_force,1);
	water_perc.conn_to(water_force,1);

	//MINING
	mining_force.conn_to(mine_limit,1);
	mine.conn_to(mine_limit,10);
	mine_limit.conn_to(flint,1);

	//CONSTRUCTION
	construct_force.conn_to(shelter_temp,1);
	shelter_perc.conn_to(shelter_temp,1);
	shelter_temp.conn_to(shelter,.1);
	construct_force.conn_to(irrigation_temp,1);
	irrigation_perc.conn_to(irrigation_temp,1);
	irrigation_temp.conn_to(irrigation,.1);
	construct_force.conn_to(mine_temp,1);
	mine_perc.conn_to(mine_temp,1);
	mine_temp.conn_to(mine,.05);
	construct_force.conn_to(fort_temp,1);
	fort_perc.conn_to(fort_temp,1);
	fort_temp.conn_to(fort,.07);

	//CRAFTWORK
	craft_force.conn_to(tool_temp,1);
	tool_perc.conn_to(tool_temp,1);
	tool_temp.conn_to(tools,1);
	craft_force.conn_to(weapon_temp,1);
	weapon_perc.conn_to(weapon_temp,1);
	weapon_temp.conn_to(weapons,1);

	//EXPOSURE
	shelter.conn_to(exposure,-1);
	pop.conn_to(exposure,1);
	exposure.conn_to(pop,-.03);

	//FOOD GATHERING
	food_force.conn_to(hunt,1);
	hunt_perc.conn_to(hunt,1);
	food_force.conn_to(farm,1);
	farm_perc.conn_to(farm,1);
	hunt.conn_to(food,1.5);
	farm.conn_to(food,1.1);
	hunt.conn_to(pop,-.01);
	farm.conn_to(water,-.1);


	var pop_stuff=[nat_pop_rate,pop_rate,pop_delta,pop,pop_alert,pop_clamp];
	var water_stuff=[water_inflow,water_env,water_limit,water_inef_alert,water,thirst,thirst_alert,water_clamp,thirst_clamp];
	var food_stuff=[food,hunger,hunger_alert,food_clamp,hunger_clamp];
	var work_stuff=[work,gather_path,construct_path,mining_path,soldier_path,craft_path,water_path,work_alotment,food_force,construct_force,mining_force,soldier_force,water_force,craft_force];//[nat_eff,eff,work]
	
	var constr_paths=[irrigation_path,shelter_path,mine_path,fort_path];
	var constr_temps=[irrigation_temp,shelter_temp,mine_temp,fort_temp];
	var constructions=[irrigation,shelter,mine,fort];
	var constr_stuff=constr_paths.concat([constr_alotment]).concat(constr_temps).concat(constructions);

	var craft_paths=[weapon_path,tool_path];
	var craft_temps=[weapon_temp,tool_temp];
	var crafts=[weapons,tools];
	var craft_stuff=craft_paths.concat([craft_alotment]).concat(craft_temps).concat(crafts);

	//var constr_stuff=[irrigation_path,shelter_path,mine_path,constr_alotment,irrigation_temp,shelter_temp,mine_temp,irrigation,shelter,mine]
	var mining_stuff=[mine_limit,mine_inef_alert,flint];
	var exposure_stuff=[exposure,exposure_alert,exposure_clamp];
	var food_source_stuff=[hunt_path,farm_path,idle_path,type_of_food,hunt,farm];

	return pop_stuff.concat(food_stuff).concat(work_stuff).concat(water_stuff).concat(mining_stuff).concat(constr_stuff).concat(exposure_stuff).concat(food_source_stuff).concat(craft_stuff);
}

return setups;
});