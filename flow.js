var flow = flow || {};
var comb = comb || {};

comb.add = function(conns,value,dont_keep_old){
	var delta = 0;
	for(var i = 0; i < conns.length;i += 1){
		var tup = conns[i];
		var o_point = tup[0];
		var weight = tup[1];
		delta += o_point.value*weight;
	}
	if(dont_keep_old){
		return delta;
	}else{
		//console.log("New value="+(value+delta));
		return value + delta;
	}
};

comb.onecomp = function(conns,value,comb_func){
	var f_point=conns[0][0];
	var f_weight=conns[0][1];
	var s_point=conns[1][0];
	var s_weight=conns[1][1];
	comb_func(f_point,f_weight,s_point,s_weight);
};

comb.no_input = function(conns,value){
	return value;
};

comb.mult = function(conns,value){
	var delta = 1;
	for(var i = 0; i < conns.length;i += 1){
		var tup = conns[i];
		var o_point = tup[0];
		var weight = tup[1];
		delta *= o_point.value*weight;
	}
	return delta;
};

comb.sub =function(conns,value){
	var f_point=conns[0][0];
	var f_weight=conns[0][1];
	var s_point=conns[1][0];
	var s_weight=conns[1][1];
	return ((f_point.value*f_weight)-(s_point.value*s_weight));
};	

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
flow.Point.prototype.display = function(){
	console.log(this.name + "," + this.value);
};
flow.Point.prototype.val_display = function(){
	console.log(this.value);
}
flow.Point.prototype.calc=function(){
	this.value=comb.add(this.conns,this.value,false);
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


var shelter     = new flow.Point("Shelter Unit",0);
var pop_health  = new flow.Rate("Pop Health"   ,0);
var pop_delta   = new flow.Mult("Pop Delta"    ,1);
var nat_pop_rate= new flow.Source("Nat Pop Rate",0);//.09//.1
var pop_rate    = new flow.Rate("Pop Rate"     ,0);
var pop         = new flow.Point("Pop Unit"    ,10);
var work        = new flow.Rate("Work Unit"    ,0);
var food        = new flow.Point("Food Unit"   ,1000);
var gather_type = new flow.Point("Gather Type" ,0);
var food_rate   = new flow.Rate("Food Rate"    ,0);
var exposure    = new flow.Sub("Exposure"     ,0);
var hunger      = new flow.Sub("Hunger"       ,0);

pop.conn_to(pop_delta,1);
pop.conn_to(food,-1);
pop.conn_to(work,10);
pop_rate.conn_to(pop_delta,1);
pop_delta.conn_to(pop,1);
work.conn_to(shelter,.1);

nat_pop_rate.conn_to(pop_rate,1);

//exposure subtracts population from shelter
pop.conn_to(exposure,1);
shelter.conn_to(exposure,1);

//hunger subtracts population from food 
pop.conn_to(hunger,1);
food.conn_to(hunger,1);

hunger.conn_to(pop_rate,-.002);
exposure.conn_to(pop_rate,-.001);


//shelter.conn_to(pop_health,0);
// pop_health.conn_to(pop_rate,1);
// pop_rate.conn_to(pop,1);
// pop.conn_to(work,1);
// pop.conn_to(food_rate,-.4);
//work.conn_to(shelter,0);
// work.conn_to(food_rate,.5);
// food.conn_to(pop_health,.1);
//gather_type.conn_to(pop,0);
//gather_type.conn_to(food_rate,0);
// food_rate.conn_to(food,1);

all_points=[nat_pop_rate,pop_rate,pop_delta,pop,work,shelter,exposure,food,hunger];

// all_points = [pop,
// 			work,
// 			shelter,
// 			food_rate,
// 			gather_type,
// 			food,
// 			pop_health,
// 			pop_rate];

for (var j = 0;j < 100;j += 1){
	for(var i = 0;i < all_points.length;i += 1){
		var point = all_points[i];
		point.calc();
		
		if (food.value<0){
				food.value=0;
		}
		
		if (shelter.value>(2*pop.value)){
			shelter.value=2*pop.value;
		}

		if (point.name=="Pop Unit"){//||point.name=="Food Unit"){//||point.name=="Exposure"||point.name=="Hunger"){
			point.val_display();
		}
		if(pop.value<1){
			pop.value=0;
		}
	}
	//console.log("-----------");
}
// for(var k = 0;k < all_points.length;k += 1){
// 	var point = all_points[k];
// 	point.display();
// }
