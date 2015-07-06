define(["development","flow","time"], function (development,flow,time){
	var  dev_setups = dev_setups ||  {};
	dev_setups.test=function(all_points){

		var attack1 = new development.RandSpawn("attack1",true,all_points);
		var attack2 = new development.End("attackcheck",true,all_points);
		var attack3= new development.BoolChoice(
			"attack3",
			"Some of the younger warriors are eager to prove themselves. \n There is a small village nearby. Allow your warriors to attack?",
			"Your warriors attack the village...",
			"You tell your warriors not to attack the village...",
			false,
			all_points);
		var attackyesgood= new development.End("attackyesgood",false,all_points);
		var attackyesbad= new development.End("attackyesbad",false,all_points);
		var attackno= new development.End("attackno",false,all_points);
		var attackyes= new development.RandChoice("attackyes",false,all_points);

		attack1.config_result(attack2,.03);

		attack2.config_result(
			function(ap){
				if (flow.select(ap,"Soldier Force").value>20){
					attack3.make_active();
					this.active=false;
				}
			}
		);
		attack3.config_result(attackyes,attackno);
		attackyes.config_result([
			[attackyesgood,.6],
			[attackyesbad,.4]
		]);
		attackno.config_result(
			function(ap){
				attackno.addAlert("You admonish the younglings. Now is not the time for war. They return dissapointed, and you are sure this is not the last time they will ask.");
			}
		);
		attackyesgood.config_result(
			function(ap){
				var soldiers=flow.select(ap,"Soldier Force");
				var food=flow.select(ap,"Food Unit");
				var pop=flow.select(ap,"Pop Unit");
				pop.setVal(pop.value+soldiers.value*.15);
				food.setVal(food.value+soldiers.value*.5);
				attackno.addAlert("The warriors ransack the village, bringing back slaves and food");
			}
		);
		attackyesbad.config_result(
			function(ap){
				var soldiers=flow.select(ap,"Soldier Force");
				var food=flow.select(ap,"Food Unit");
				var pop=flow.select(ap,"Pop Unit");
				pop.setVal(pop.value-soldiers.value*.5);
				attackno.addAlert("The warriors attack the village but are repelled with heavy casualities.");
			}
		);


		var milestone0a= new development.Time("Alive0a",true,all_points);
		var milestone0b= new development.End("Alive0b",false,all_points); 
		milestone0a.config_result(-1,milestone0b);
		milestone0b.config_result(
			function(ap){
				milestone0a.addAlert("You are the head man of a small village in neolithic time. Do you have what it take to survive and achieve greatness?");
			}
		);

		var milestone1a= new development.Time("Alive100a",true,all_points);
		var milestone1b= new development.End("Alive100b",false,all_points); 
		milestone1a.config_result(100,milestone1b);
		milestone1b.config_result(
			function(ap){
				milestone1a.addAlert("Congratulations, you have managed to have your village survive for 100 Months!");
			}
		);
		var milestone2a= new development.Time("Alive1000a",true,all_points);
		var milestone2b= new development.End("Alive1000b",false,all_points); 
		milestone2a.config_result(1000,milestone2b);
		milestone2b.config_result(
			function(ap){
				milestone2a.addAlert("Congratulations, you have managed to have your village survive for 1000 Months!");
			}
		);

		var refugee1= new development.RandSpawn("popgood1",true,all_points);
		var refugee2= new development.End("popgood2",false,all_points);

		refugee1.config_result(refugee2,.02);
		refugee2.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value+30);
				refugee2.addAlert("Refugees from a distant war stream into your town.");
			}
		);

		var band1= new development.RandSpawn("band1",true,all_points);
		var band2= new development.End("band2",false,all_points);
		band1.config_result(band2,.01);
		band2.config_result(
			function(ap){
				var soldiers=flow.select(ap,"Soldier Force").value;
				if (soldiers<10){
					flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value*.9);
					flow.select(ap,"Food Unit").setVal(flow.select(ap,"Food Unit").value*.7);
					band2.addAlert("A band of foreigners forces their way into town. They kill anyone trying to stop them and take all the food they can lay their hands on.");
				}else{
					flow.select(ap,"Weapons").setVal(flow.select(ap,"Weapons").value+20);
					flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value+10);
					band2.addAlert("A band of foreigners attacks your village. However, the skill and training of your warriors is too much for them. Their weapons are confiscated and some are captured");
				}
			}
		); 

		var nat_disaster=new development.RandSpawn("nat_disaster",true,all_points);
		var nat_disaster2=new development.RandChoice("nat_disaster2",false,all_points);
		var earth= new development.End("earth",false,all_points);
		var food= new development.End("food",false,all_points);
		var fire= new development.End("fire",false,all_points);
		nat_disaster.config_result(nat_disaster2,.02);
		nat_disaster2.config_result([
			[earth,  1],
			[food, 1],
			[fire, 1],
		]);
		food.config_result(
			function(ap){
				flow.select(ap,"Food Unit").setVal(flow.select(ap,"Food Unit").value*.6);
				food.addAlert("Some of the food stores have spoiled!");
			}
		);
		fire.config_result(
			function(ap){
				flow.select(ap,"Shelter Unit").setVal(flow.select(ap,"Shelter Unit").value*.5);
				fire.addAlert("A horrible fire rages through town!");
			}
		);
		earth.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value*.9);
				flow.select(ap,"Shelter Unit").setVal(flow.select(ap,"Shelter Unit").value*.7);
				flow.select(ap,"Mine Unit").setVal(flow.select(ap,"Mine Unit").value*.5);
				earth.addAlert("The ground shakes terribly. Buildings fall all around. Mines collapse!");
			}
		);


		var stranger= new development.RandSpawn("stranger",true,all_points);
		var stranger2= new development.BoolChoice(
			"stranger2",
			"A stranger has appeared at the village. \n Should he be accepted?",
			"You accepted the stranger into the village...",
			"You denied the stranger entrance...",
			false,
			all_points);
		var strangeryesgood= new development.End("strangeryesgood",false,all_points);
		var strangernogood= new development.End("strangernogood",false,all_points);
		var strangeryesbad= new development.End("strangeryesbad",false,all_points);
		var strangernobad= new development.End("strangernobad",false,all_points);
		var strangerno=new development.RandChoice("strangerno","",false,all_points);
		var strangeryes=new development.RandChoice("strangeryes","",false,all_points);

		stranger.config_result(stranger2,.02);
		stranger2.config_result(strangeryes,strangerno);
		strangeryesgood.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value+10);
				flow.select(ap,"Shelter Unit").setVal(flow.select(ap,"Shelter Unit").value+3);
				strangeryesgood.addAlert("The stranger you accepted brings his family clan to your village.");
			}
		);
		strangeryesbad.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value-3);
				strangeryesbad.addAlert("The stranger you accepted was mentally ill. Once inside the village it was clear he had to be subdued and some villigers were killed in the process.");
			}
		);
		strangernogood.config_result(
			function(ap){
				strangernogood.addAlert("The stranger you denied leaves but curses you as he does so.");
			}
		);
		strangernobad.config_result(
			function(ap){
				flow.select(ap,"Food Unit").setVal(flow.select(ap,"Food Unit").value*.9);
				strangernobad.addAlert("The stranger you denied snuck over the wall and set fire to the store houses. Much food was lost but the stranger was eventually stopped.");
			}
		);
		strangeryes.config_result([
			[strangeryesbad,  .5],
			[strangeryesgood, .5]
		]);
		strangerno.config_result([
			[strangernobad,   .6],
			[strangernogood,  .4]
		]);

		var all_nat_disasters=[nat_disaster,nat_disaster2,fire,earth,food,fire];
		var all_attacks=[attack1,attack2,attack3,attackno,attackyes,attackyesgood,attackyesbad];
		var all_milestones=[milestone0a,milestone0b,milestone1a,milestone1b,milestone2a,milestone2b];

		return all_attacks.concat(all_nat_disasters).concat(all_milestones).concat([band1,band2,refugee1,refugee2,stranger,stranger2,strangerno,strangeryes]);
	}
	return dev_setups;
});