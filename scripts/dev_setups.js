define(["development","flow","time"], function (development,flow,time){
	var  dev_setups = dev_setups ||  {};
	dev_setups.test=function(all_points){

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

		var start = new development.Rand("start",true,all_points);
		var start2= new development.End("start2",false,all_points);
		start.config_result(start2,1);
		start2.config_result(
			function(ap){
				start2.addAlert("You are the head man of a small village in neolithic time. Do you have what it take to survive and achieve greatness?");
			}
		);

		var food1= new development.RandSpawn("food1",true,all_points);
		var food2= new development.End("food2",false,all_points);

		food1.config_result(food2,.05);
		food2.config_result(
			function(ap){
				flow.select(ap,"Food Unit").setVal(flow.select(ap,"Food Unit").value-200)
				food2.addAlert("Some of the food stores have spoiled!");
			}
		);

		var pop1= new development.RandSpawn("popbad1",true,all_points);
		var pop2= new development.End("popbad2",false,all_points);

		pop1.config_result(pop2,.05);
		pop2.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value*.5)
				pop2.addAlert("A deadly disease has hit your village. Bodies line the streets!");
			}
		);

		var pop3= new development.RandSpawn("popgood1",true,all_points);
		var pop4= new development.End("popgood2",false,all_points);

		pop3.config_result(pop4,.05);
		pop4.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value+30);
				pop4.addAlert("Refugees from a distant war steam into your town.");
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

		var earth1= new development.RandSpawn("earth1",true,all_points);
		var earth2= new development.End("earth2",false,all_points);

		earth1.config_result(earth2,.01);
		earth2.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value*.9);
				flow.select(ap,"Shelter Unit").setVal(flow.select(ap,"Shelter Unit").value*.5);
				flow.select(ap,"Mine Unit").setVal(flow.select(ap,"Mine Unit").value*.5);
				earth2.addAlert("The ground shakes terribly. Buildings fall all around. Mines collapse!");
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


		stranger.config_result(stranger2,.05);
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

		return [start,start2,food1,food2,pop1,pop2,pop3,pop4,earth1,earth2,stranger,stranger2,strangerno,strangeryes,milestone1a,milestone1b,milestone2a,milestone2b];
	}
	return dev_setups;
});