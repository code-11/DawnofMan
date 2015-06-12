define(["flow"], function (flow){
var  development = development ||  {};

development.addAlert=function(text){
	var prior_events=$("#events").children();
	$("#events").empty();
	$("#events").append("<li>"+j+" "+text+"</li>");
	$("#events").append(prior_events);
}


development.D_node=function(alias,msg,start_as_active,all_points){
	//this.results={};
	this.msg=msg;
	this.active=start_as_active;
	this.all_points=all_points
}
// development.prototype.addResult=function(result){
// 	this.results[result.alias]=result;
// }
development.D_node.prototype.enter=function(){
	console.log("Needs to be overwritten");
}
development.D_node.prototype.check_results=function(){
	console.log("Needs to be overwritten");
}
development.D_node.prototype.make_active=function(){
	this.active=true;
	this.enter();
}

//Is a one off random start for development chains
development.Rand=function(alias,start_as_active,all_points){
	this.alias=alias;
	this.active=start_as_active;
	this.all_points=all_points
}
development.Rand.prototype=Object.create(development.D_node.prototype);
development.Rand.prototype.config_result=function(result,perc){
	this.the_result=result;
	this.perc=perc;
}
development.Rand.prototype.enter=function(){};
development.Rand.prototype.check_results=function(){
	var prob=Math.random();
	console.log(this.alias+"=>prob:"+prob+" threshold:"+this.perc);
    if (this.perc>prob){
    	this.the_result.make_active();
    	this.active=false;
    }
}
//Continuous spawner for development chains
development.RandSpawn=function(alias,start_as_active,all_points){
	this.alias=alias;
	this.active=start_as_active;
	this.all_points=all_points
}
development.RandSpawn.prototype=Object.create(development.Rand.prototype);
development.RandSpawn.prototype.check_results=function(){
	var prob=Math.random();
	console.log(this.alias+"=>prob:"+prob+" threshold:"+this.perc);
    if (this.perc>prob){
    	this.the_result.make_active();
    }
}

//One off one change end to a development chain
development.End=function(alias,start_as_active,all_points){
	this.alias=alias;
	this.active=start_as_active;
	this.all_points=all_points;
}
development.End.prototype=Object.create(development.D_node.prototype);
development.End.prototype.config_result=function(func){
	this.the_effect=func;
}
development.End.prototype.enter=function(){
	this.the_effect(this.all_points);
}
development.End.prototype.check_results=function(){
	this.active=false;
}

return development;
});
