define(["./comb"], function (comb){
var flow = flow || {};

flow.Point = function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
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
		this.value=comb.add(this.conns,this.value,false);
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
};
//Extend superclass
flow.Rate.prototype=Object.create(flow.Point.prototype);
flow.Rate.prototype.calc=function(){
	this.value=comb.add(this.conns,this.value,true);
};


flow.Mult =function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
};
//Extend superclass
flow.Mult.prototype=Object.create(flow.Point.prototype);
flow.Mult.prototype.calc=function(){
	this.value=comb.mult(this.conns,this.value);
};

flow.Source =function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
};
//Extend superclass
flow.Source.prototype=Object.create(flow.Point.prototype);
flow.Source.prototype.calc=function(){
	this.value=comb.no_input(this.conns,this.value);
};

flow.Sub =function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
};
//Extend superclass
flow.Sub.prototype=Object.create(flow.Point.prototype);
flow.Sub.prototype.calc=function(){
	this.value=comb.sub(this.conns,this.value);
};

//Modifies a point's calc function so that after calcuation it checks a lower bound. iF bound is reached, value is set.
flow.add_low_shift=function(point,bound,bound_set){
	point.post_calc=function(){
		if (point.value<bound){
			point.value=bound_set;
		}
	}
}



return flow});
