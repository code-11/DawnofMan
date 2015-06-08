define(["development"], function (development){
	var  dev_setups = dev_setups ||  {};
	dev_setups.test=function(){
		var start= new development.Rand("test","test","test",true);
		var end= new development.End("test2","test2","test2",false);

		start.config_result(end,.5);
		end.config_result(
			function(){console.log("Ending")}
		);

		return [start,end];
	}
	return dev_setups;
});