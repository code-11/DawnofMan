define(["./comb"], function (comb){
var flow = flow || {};

flow.Point = function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
	this.debug=false;
	this.disabled=false;
};
flow.Point.prototype.conn_to= function(o_point,weight){
		for (var i=0; i<o_point.conns.length;i+=1){
			el=o_point.conns[i][0];
			if (el.name==this.name){
				console.log("[Point "+this.name+"] A connection already exists with "+o_point.name);
				return;
			} 
		}
		o_point.conns.push([this,weight]);
};
flow.Point.prototype.break_conn_to=function(o_point){
		for (var i=0; i<o_point.conns.length;i+=1){
			el=o_point.conns[i][0];
			if (el.name==this.name){
				o_point.conns.splice(i,1);
			} 
		}
};
flow.Point.prototype.display_conns = function(){
	for (var i=0; i<this.conns.length;i+=1){
		console.log("[Point "+this.name+"] connects with "+this.conns[i][0].name+" with weight "+this.conns[i][1]);
	}
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
	if(this.disabled==false){
		this.pre_calc();
		this.calc();
		this.post_calc();
	}
};

//Rates don't accumulate, they are set every step.
//They add all weighted
flow.Rate = function(name,init_val){
	this.name = name;
	this.value = init_val;
	//All connections to this point
	this.conns = [];
	this.debug=false;
	this.disabled=false;
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
	this.disabled=false;
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
	this.disabled=false;
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
	this.disabled=false;
}
flow.Dup.prototype=Object.create(flow.Point.prototype);
flow.Dup.prototype.calc=function(){
	this.value=comb.dup(this);
};

flow.Choice=function(name,initial_val,options){
	this.name=name;
	this.value=initial_val;
	this.prev_value=this.value;
	this.debug=false;
	this.options=options;
}
flow.Choice.prototype.full_calc=function(){
	comb.choose(this);
};
flow.Choice.prototype.display=function(){};


flow.LowClamp=function(point,value,fudge){
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

flow.HighClamp=function(point,value,fudge){
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

flow.select=function(point_list,name){
	for (var i=0; i<point_list.length;i+=1){
		el=point_list[i];
		if (el.name==name){
			return el;
		} 
	}
}



return flow});
