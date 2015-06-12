define(["development","flow"], function (development,flow){
	var  dev_setups = dev_setups ||  {};
	dev_setups.test=function(all_points){
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

		return [food1,food2,pop1,pop2,pop3,pop4,earth1,earth2];
	}
	return dev_setups;
});