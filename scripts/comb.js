var comb = comb || {};

comb.add = function(point,dont_keep_old){
	var conns=point.conns;
	var value=point.value;
	var delta = 0;
	for(var i = 0; i < conns.length;i += 1){
		var tup = conns[i];
		var o_point = tup[0];
		if (o_point.disabled==false){
			var weight = tup[1];
			var coeff=o_point.value*weight
			if (point.debug){
				console.log("[Add "+point.name+"] Received "+coeff+" from "+o_point.name);
			}
			delta += coeff;
		}else{
			if (point.debug){
				console.log("[Add "+point.name+"] touched "+o_point.name+" but it is disabled");
			}
		}
	}
	if(dont_keep_old){
		if (point.debug){
			console.log("[Add "+point.name+"] Returned "+delta);
		}
		return delta;
	}else{
		if (point.debug){
			console.log("[Add "+point.name+"] Returned "+(value+delta));
		}
		return value + delta;
	}
};

comb.onecomp = function(point,comb_func){
	var conns=point.conns;
	var value=point.value;
	var f_point=conns[0][0];
	var f_weight=conns[0][1];
	var s_point=conns[1][0];
	var s_weight=conns[1][1];
	comb_func(f_point,f_weight,s_point,s_weight);
};

comb.no_input = function(point){
	var value=point.value;
	return value;
};

comb.mult = function(point){
	var conns=point.conns;
	var value=point.value;
	var delta = 1;
	for(var i = 0; i < conns.length;i += 1){
		var tup = conns[i];
		var o_point = tup[0];
		if (o_point.disabled==false){
			var weight = tup[1];
			var coeff=o_point.value*weight
			if (point.debug){
				console.log("[Add "+point.name+"] Received "+coeff+" from "+o_point.name);
			}
			delta *=coeff ;
		}else{
			if (point.debug){
				console.log("[Add "+point.name+"] touched "+o_point.name+" but it is disabled");
			}
		}
	}
	return delta;
};

comb.sub =function(point){
	var conns=point.conns;
	var value=point.value;
	var f_point=conns[0][0];
	var f_weight=conns[0][1];
	var s_point=conns[1][0];
	var s_weight=conns[1][1];
	var f_coeff=f_point.value*f_weight;
	var s_coeff=s_point.value*s_weight;
	if (point.debug){
		console.log("[Sub "+point.name+"] Received "+f_coeff+" from "+f_point.name);
		console.log("[Sub "+point.name+"] Received "+s_coeff+" from "+s_point.name);
		console.log("[Sub "+point.name+"] Returned "+(f_coeff-s_coeff));
	}
	return ((f_coeff)-(s_coeff));
};	

comb.dup=function(point){
	var conns=point.conns;
	if (conns.length>1){
		console.log("[Dup ERROR "+point.name+"] Duplicate point received multiple inputs!");
	}else{
		if (conns[0][0].disabled==false){
			return conns[0][0].value*conns[0][1];
		}
	}
};
comb.least= function(point){
	var conns=point.conns;
	if(conns.length==0){
		console.log("[Least ERROR "+point.name+"] Least point received no inputs!");
	}else{
		var minimum=conns[0][0].value*conns[0][1];
		for(var i=0; i<conns.length;i+=1){
			var point=conns[i][0];
			var weight=conns[i][1];
			var temp_val=point.value*weight;
			if (temp_val<minimum){
				minimum=temp_val;
			}
		}
		return minimum;
	}

}

comb.low_clamp=function(point){
	var value=point.value;
	if (point.target.value<point.value){
			point.target.value=point.value+point.fudge;
	}
};

comb.high_clamp=function(point){
	var value=point.value;
	if (point.target.value>point.value){
			point.target.value=point.value+point.fudge;
	}
};

comb.choose=function(point){
	if (point.prev_value!=point.value){
		var func=point.options[point.value];
		func();
		point.prev_value=point.value;
	}
}
comb.lerp=function(point){
	if (point.conns.length==1){
		var val_in=point.conns[0][0].value*point.conns[0][1];
		if (val_in<point.low_val_in){
			return point.low_val_out;
		}else if (val_in>point.high_val_in){
			return point.high_val_out;
		}else{
			var m=(point.high_val_out-point.low_val_out)/(point.high_val_in-point.low_val_in);
			var temp=((val_in-point.high_val_in)*m)+point.high_val_out;
			console.log("temp "+temp);
			return temp;
		}
	}else{
		console.log("[Lerp ERROR "+point.name+"] Lerp point can only receive one input!");
	}
}

define(comb);