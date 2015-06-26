define(["development","flow"], function (development,flow){
	var  dev_setups = dev_setups ||  {};
	dev_setups.test=function(all_points){
		var start = new development.Rand("start",true,all_points);
		var start2= new development.End("start2",false,all_points);
		start.config_result(start2,1);
		start2.config_result(
			function(ap){
				development.addAlert("You are the head man of a small village in neolithic time. Do you have what it take to survive and achieve greatness?");
			}
		);

		var food1= new development.RandSpawn("food1",true,all_points);
		var food2= new development.End("food2",false,all_points);

		food1.config_result(food2,.05);
		food2.config_result(
			function(ap){
				flow.select(ap,"Food Unit").setVal(flow.select(ap,"Food Unit").value-2000)
				development.addAlert("Some of the food stores have spoiled!");
			}
		);

		var pop1= new development.RandSpawn("popbad1",true,all_points);
		var pop2= new development.End("popbad2",false,all_points);

		pop1.config_result(pop2,.05);
		pop2.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value*.5)
				development.addAlert("A deadly disease has hit your village. Bodies line the streets!");
			}
		);

		var pop3= new development.RandSpawn("popgood1",true,all_points);
		var pop4= new development.End("popgood2",false,all_points);

		pop3.config_result(pop4,.05);
		pop4.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value+30);
				development.addAlert("Refugees from a distant war steam into your town.");
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
				development.addAlert("The ground shakes terribly. Buildings fall all around. Mines collapse!");
			}
		);

		var stranger= new development.Rand("stranger",true,all_points);
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
				development.addAlert("The stranger you accepted brings his family clan to your village.");
			}
		);
		strangeryesbad.config_result(
			function(ap){
				flow.select(ap,"Pop Unit").setVal(flow.select(ap,"Pop Unit").value-3);
				development.addAlert("The stranger you accepted was mentally ill. Once inside the village it was clear he had to be subdued and some villigers were killed in the process.");
			}
		);
		strangernogood.config_result(
			function(ap){
				development.addAlert("The stranger you denied leaves but curses you as he does so.");
			}
		);
		strangernobad.config_result(
			function(ap){
				flow.select(ap,"Food Unit").setVal(flow.select(ap,"Food Unit").value*.9);
				development.addAlert("The stranger you denied snuck over the wall and set fire to the store houses. Much food was lost but the stranger was eventually stopped.");
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

		return [start,start2,food1,food2,pop1,pop2,pop3,pop4,earth1,earth2,stranger,stranger2,strangerno,strangeryes];
	}
	return dev_setups;
});