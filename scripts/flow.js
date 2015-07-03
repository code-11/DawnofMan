define(["./comb","jquery","time"], function (comb,$,time){
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
flow.Point.prototype.setVal=function(val){
	this.value=val;
	if (this.value<0){
		this.value=0;
	}
}

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

flow.Lerp=function(name,low_val_in,high_val_in,low_val_out,high_val_out){
	this.name=name;
	this.low_val_in=low_val_in;
	this.high_val_in=high_val_in;
	this.low_val_out=low_val_out;
	this.high_val_out=high_val_out;
	this.conns=[];
	this.value=0;
	this.debug=false;
	this.disabled=false;
}
flow.Lerp.prototype=Object.create(flow.Point.prototype);
flow.Lerp.prototype.calc=function(){
	this.value=comb.lerp(this);
};

flow.Least=function(name){
	this.name=name;
	this.value=0;
	this.conns=[];
	this.debug=false;
	this.disabled=false;
}
flow.Least.prototype=Object.create(flow.Point.prototype);
flow.Least.prototype.calc=function(){
	this.value=comb.least(this);
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

flow.Path=function(point,name,html_root){
	this.point=point;
	this.disp_name=point.name;
	this.name=name;
	this.disp_id=name+"_val";
	this.inited=false;
	this.value=0;
	this.root=document.getElementById(html_root);
}
flow.Path.prototype.display=function(){}
flow.Path.prototype.init_title=function(){
	var temp_p=document.createElement("P");
	var temp_txt=document.createTextNode(this.disp_name);
	temp_p.appendChild(temp_txt);
	this.root.appendChild(temp_p);
	this.title_html=temp_p;
}
flow.Path.prototype.init_disp=function(){
	var temp_p=document.createElement("P");
	var temp_txt=document.createTextNode("0");
	var temp_arr=document.createElement("P");
	var temp_arr_txt=document.createTextNode("→");
	temp_arr.appendChild(temp_arr_txt);
	temp_p.appendChild(temp_txt);
	temp_p.id=this.disp_id;
	temp_p.className="inline";
	temp_arr.className="inline";
	this.root.appendChild(temp_arr)
	this.root.appendChild(temp_p);
	this.disp_html=temp_p;
}
flow.Path.prototype.init_input=function(){
	var temp_in=document.createElement("Input");
	temp_in.id=this.name;
	temp_in.type="number";
	temp_in.value=0;
	temp_in.className="inline";
	this.root.appendChild(temp_in);
	this.input_html=temp_in;
	//console.log(temp_in);
}
flow.Path.prototype.set_all_onlick=function(){
	for (var i=0;i<this.decision.paths.length;i+=1){
		var el=this.decision.paths[i];
		if (el!=this){
			var val=0;
			el.disp_html.innerText=val.toFixed(2);
			el.input_html.value=val;
			el.value=val;
		}else{
			var val=1.00;
			el.disp_html.innerText=val.toFixed(2);
			el.input_html.value=val;
			el.value=val;
		}
	}
}
flow.Path.prototype.init_set_all=function(){
	var temp_in=document.createElement("input");
	temp_in.value="Set as Full";
	temp_in.type="Button";
	temp_in.id=this.name+"btn";
	temp_in.className="inline-push";
	var _this=this;
	temp_in.onclick=function(){_this.set_all_onlick(_this)};
	this.root.appendChild(temp_in);	
}
flow.Path.prototype.init=function(){
	this.init_title();
	this.init_input();
	this.init_disp();
	this.init_set_all();
}
flow.Path.prototype.full_calc=function(){
	this.point.value=this.value//parseFloat(this.disp_html.innerText);
}

flow.Decision=function(paths,name,root){
	this.paths=paths;
	this.name=name;
	this.debug=false;
	this.inited=false;
	this.root=document.getElementById(root);
}
flow.Decision.prototype.the_on_click=function(_this){
		var running_sum=0;
		for(var i=0;i<_this.paths.length;i+=1){
			el=this.paths[i];
			running_sum+=parseInt(el.input_html.value);
		}
		if (running_sum==0){
			for(var i=0;i<_this.paths.length;i+=1){
				el=this.paths[i];
				var new_val=1.0/_this.paths.length;
				el.disp_html.innerText=new_val.toFixed(2);
				el.value=new_val;
			}
		}else{
			for(var i=0;i<this.paths.length;i+=1){
				el=this.paths[i];
				var new_val=parseInt(el.input_html.value)/running_sum;
				el.disp_html.innerText=new_val.toFixed(2);
				el.value=new_val;
			}
		}
}
flow.Decision.prototype.init_paths=function(){
	for (var i=0; i<this.paths.length;i+=1){
		this.paths[i].decision=this;
	}
}
flow.Decision.prototype.init=function(){
	var temp_br=document.createElement("br");
	var temp_in=document.createElement("input");
	temp_in.value="Normalize";
	temp_in.type="Button";
	temp_in.id=this.name;
	var _this=this;
	temp_in.onclick=function(){_this.the_on_click(_this)};
	this.root.appendChild(temp_br);
	this.root.appendChild(temp_in);
	this.init_paths();
}
flow.Decision.prototype.display=function(){}
flow.Decision.prototype.full_calc=function(){}

flow.debug=function(point){
	point.debug=true;
}

flow.post_alert=function(text){
	var prior_events=$("#events").children();
	$("#events").empty();
	$("#events").append("<li>"+time.the_clock.getTime()+" "+text+"</li>");
	$("#events").append(prior_events);
}

flow.LowAlert=function(point,message){
	this.point=point;
	this.msg=message;
}
flow.LowAlert.prototype.display=function(){}
flow.LowAlert.prototype.full_calc=function(){
	if (this.point.value<=0){
		flow.post_alert(this.msg);
	}
}

flow.PresenceAlert=function(point,message){
	this.point=point;
	this.msg=message;
}
flow.PresenceAlert.prototype.display=function(){}
flow.PresenceAlert.prototype.full_calc=function(){
	if (this.point.value>.000001){
		flow.post_alert(this.msg);
	}
}

flow.GreaterAlert=function(point,o_point,coeff,msg){
	this.point=point;
	this.o_point=o_point;
	this.coeff=coeff;
	this.msg=msg;
}
flow.GreaterAlert.prototype.display=function(){}
flow.GreaterAlert.prototype.full_calc=function(){
	if (this.point.value>this.o_point.value*this.coeff){
		flow.post_alert(this.msg);
	}
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
