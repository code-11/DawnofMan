define(["flow"], function (flow){
var  development = development ||  {};

development.D_node=function(alias,header,msg,start_as_active){
	//this.results={};
	this.header=header;
	this.msg=msg;
	this.active=start_as_active;
}
// development.prototype.addResult=function(result){
// 	this.results[result.alias]=result;
// }
development.D_node.prototype.enter=function(all_points){
	console.log("Needs to be overwritten");
}
development.D_node.prototype.check_results=function(all_points){
	console.log("Needs to be overwritten");
}
development.D_node.prototype.make_active=function(){
	this.active=true;
	this.enter();
}

//Is a one off random start for development chains
development.Rand=function(alias,header,msg,start_as_active){
	//this.results={};
	this.header=header;
	this.msg=msg;
	this.active=start_as_active;
}
development.Rand.prototype=Object.create(development.D_node.prototype);
development.Rand.prototype.config_result=function(result,perc){
	this.the_result=result;
	this.perc=perc;
}
development.Rand.prototype.enter=function(){};
development.Rand.prototype.check_results=function(all_points){
	var prob=Math.random();
	console.log("prob:"+prob+" threshold:"+this.perc);
    if (this.perc>prob){
    	this.the_result.make_active();
    	this.active=false;
    }
}

//One off one change end to a development chain
development.End=function(alias,header,msg,start_as_active){
	//this.results={};
	this.header=header;
	this.msg=msg;
	this.active=start_as_active;
}
development.End.prototype=Object.create(development.D_node.prototype);
development.End.prototype.config_result=function(func){
	this.the_effect=func;
}
development.End.prototype.enter=function(){
	this.the_effect();
}
development.End.prototype.check_results=function(all_points){
	this.active=false;
}

return development;
});
