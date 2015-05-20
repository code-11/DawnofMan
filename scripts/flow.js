define(["./comb"], function (comb){
var flow = flow || {};

flow.Point = function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
	this.debug=false;
};
flow.Point.prototype.conn_to= function(o_point,weight){
		o_point.conns.push([this,weight]);
};
flow.Point.prototype.display_conns = function(){
	console.log(this.name + " contains:");
	console.log(this.conns);
};
flow.Point.prototype.display = function(ticks){
	if(ticks!=undefined){
		console.log(this.name + "," + this.value+" at tick "+ticks);
	}else{
		console.log(this.name + "," + this.value);
	}
};
flow.Point.prototype.val_display = function(ticks){
	if(ticks!=undefined){
		console.log(this.value+" at tick "+ticks);
	}else{
		console.log(this.value);
	}
}
flow.Point.prototype.pre_calc=function(){};
flow.Point.prototype.post_calc=function(){};
flow.Point.prototype.calc=function(){
		this.value=comb.add(this,false);
};
flow.Point.prototype.full_calc=function(){
		this.pre_calc();
		this.calc();
		this.post_calc();
};

//Rates don't accumulate, they are set every step.
//They add all weighted
flow.Rate = function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
	this.debug=false;
};
//Extend superclass
flow.Rate.prototype=Object.create(flow.Point.prototype);
flow.Rate.prototype.calc=function(){
	this.value=comb.add(this,true);
};


flow.Mult =function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
	this.debug=false;
};
//Extend superclass
flow.Mult.prototype=Object.create(flow.Point.prototype);
flow.Mult.prototype.calc=function(){
	this.value=comb.mult(this);
};

flow.Source =function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
	this.debug=false;
};
//Extend superclass
flow.Source.prototype=Object.create(flow.Point.prototype);
flow.Source.prototype.calc=function(){
	this.value=comb.no_input(this);
};

flow.Sub =function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
	this.debug=false;
};
//Extend superclass
flow.Sub.prototype=Object.create(flow.Point.prototype);
flow.Sub.prototype.calc=function(){
	this.value=comb.sub(this);
};

flow.Dup=function(name){
	this.name=name;
	this.value=0;
	this.conns=[];
	this.debug=false;
}
flow.Dup.prototype=Object.create(flow.Point.prototype);
flow.Dup.prototype.calc=function(){
	this.value=comb.dup(this);
};

flow.LowClamp=function(name,point,value,fudge){
	this.value=value;
	this.target=point;
	this.debug=false;
	this.fudge=fudge;
	this.name=point.name+" Clamp";
}
flow.LowClamp.prototype.full_calc=function(){
	comb.low_clamp(this);
};
flow.LowClamp.prototype.display=function(){};

flow.HighClamp=function(name,point,value,fudge){
	this.value=value;
	this.target=point;
	this.debug=false;
	this.fudge=fudge;
	this.name=point.name+" Clamp";
}
flow.HighClamp.prototype=Object.create(flow.LowClamp.prototype);
flow.HighClamp.prototype.full_calc=function(){
	comb.high_clamp(this);
};

flow.debug=function(point){
	point.debug=true;
}


return flow});
