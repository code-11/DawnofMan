var comb = comb || {};

comb.add = function(point,dont_keep_old){
	var conns=point.conns;
	var value=point.value;
	var delta = 0;
	for(var i = 0; i < conns.length;i += 1){
		var tup = conns[i];
		var o_point = tup[0];
		var weight = tup[1];
		var coeff=o_point.value*weight
		if (point.debug){
			console.log("[Add "+point.name+"] Received "+coeff+" from "+o_point.name);
		}
		delta += coeff;
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
		var weight = tup[1];
		delta *= o_point.value*weight;
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
		return conns[0][0].value*conns[0][1];
	}
};

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

define(comb);