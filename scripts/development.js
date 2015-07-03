define(["flow","time"], function (flow,time){
var  development = development ||  {};

development.addAlert=function(text){
	var prior_events=$("#events").children();
	$("#events").empty();
	$("#events").append("<li>"+j+" "+text+"</li>");
	$("#events").append(prior_events);
}
development.addHtmlAlert=function(html,dev_alias){
	var prior_events=$("#events").children();
	$("#events").empty();
	var temp_li=$("<li>"+j+" "+"</li>").attr({
		id:dev_alias+"li"
	});
	$("#events").append(temp_li);
	$("#"+dev_alias+"li").append(html);
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
development.D_node.prototype.addAlert=function(text){
	var prior_events=$("#events").children();
	$("#events").empty();
	$("#events").append("<li>"+time.the_clock.getTime()+" "+text+"</li>");
	$("#events").append(prior_events);
}
development.D_node.prototype.addHtmlAlert=function(html,dev_alias){
	var prior_events=$("#events").children();
	$("#events").empty();
	var temp_li=$("<li>"+time.the_clock.getTime()+" "+"</li>").attr({
		id:dev_alias+"li"
	});
	$("#events").append(temp_li);
	$("#"+dev_alias+"li").append(html);
	$("#events").append(prior_events);
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
	this.all_points=all_points;
}
development.RandSpawn.prototype=Object.create(development.Rand.prototype);
development.RandSpawn.prototype.check_results=function(){
	var prob=Math.random();
	console.log(this.alias+"=>prob:"+prob+" threshold:"+this.perc);
    if ((this.perc>prob)&&(this.the_result.active==false)){
    	this.the_result.make_active();
    }
}

development.RandChoice=function(alias,msg,start_as_active,all_points){
	this.alias=alias;
	this.msg=msg;
	this.active=start_as_active;
	this.all_points=all_points;
}
development.RandChoice.prototype=Object.create(development.D_node.prototype);
development.RandChoice.prototype.enter=function(){};
development.RandChoice.prototype.normalize=function(){
	var sum=0;
	for (var name in this.name2prob) {
		sum+=this.name2prob[name];
	}
	for(var name in this.name2prob){
		this.name2prob[name]=this.name2prob[name]/sum;
	}
};
development.RandChoice.prototype.config_result=function(tup_list){
	var name2prob={};
	var name2obj={};
	for (var i=0;i<tup_list.length;i+=1){
		var tup=tup_list[i];
		name2prob[tup[0].alias]=tup[1];
		name2obj[tup[0].alias]=tup[0];
	}
	this.name2prob=name2prob;
	this.name2obj=name2obj;
	this.normalize();
}
development.RandChoice.prototype.choose=function(){
	var prob=Math.random();
	var sum=0;
	for (var name in this.name2prob){
		sum+=this.name2prob[name];
		if (prob<sum){
			return this.name2obj[name];
		}
	}
}
development.RandChoice.prototype.check_results=function(){
	var res=this.choose();
	//console.log(this.alias+" chose "+res.alias);
	if (res!==undefined){
		res.make_active();
		this.active=false;
	}
};

development.Time=function(alias,start_as_active,all_points){
	this.alias=alias;
	this.all_points=all_points;
	this.active=start_as_active;
}
development.Time.prototype=Object.create(development.D_node.prototype);
development.Time.prototype.config_result=function(active_time,next_node){
	this.active_time=active_time;
	this.next_node=next_node;
}
development.Time.prototype.enter=function(){};
development.Time.prototype.check_results=function(){
	if (time.the_clock.getTime()>this.active_time){
		this.next_node.make_active();
		this.active=false;
	}
}

development.BoolChoice=function(alias,start_msg,yes_msg,no_msg,start_as_active,all_points){
	this.alias=alias;
	this.start_msg=start_msg;
	this.yes_msg=yes_msg;
	this.no_msg=no_msg;
	this.active=start_as_active;
	this.all_points=all_points;
	this.choice=undefined;
}
development.BoolChoice.prototype=Object.create(development.D_node.prototype);
development.BoolChoice.prototype.config_result=function(yes_res,no_res){
	this.yes_res=yes_res;
	this.no_res=no_res;
}
development.BoolChoice.prototype.enter=function(){
	var _this=this;

	var yes = document.createElement("button"); 
	var no = document.createElement("button");
	var yesno=$("<div></div>").attr({
		id:this.alias+"div",
		class:"choice-el"
	});

	yes.id=this.alias+"yesbtn";
	yes.onclick=function(){
		_this.choice=true;
		yes.remove();
		no.remove();
		var yes_text=document.createElement("p");
		var t = document.createTextNode(_this.yes_msg);
		yes_text.appendChild(t);
		yesno.append(yes_text);
	};
	var t = document.createTextNode("Yes");       
	yes.appendChild(t);

	 
	no.id=this.alias+"nobtn";
	no.onclick=function(){
		_this.choice=false;
		yes.remove();
		no.remove();
		var no_text=document.createElement("p");
		var t = document.createTextNode(_this.no_msg);
		no_text.appendChild(t);
		yesno.append(no_text);
	};
	var t = document.createTextNode("no");       
	no.appendChild(t);   

	var msg_txt=document.createElement("p");
	var t = document.createTextNode(this.start_msg);
	msg_txt.appendChild(t);


	yesno.append(msg_txt);
	yesno.append(yes);
	yesno.append(no);
	this.addHtmlAlert(yesno,this.alias);
}
development.BoolChoice.prototype.check_results=function(){
	console.log(this.alias+" is "+this.choice);
	if(this.choice!==undefined){
		if (this.choice){
			this.yes_res.make_active();
			this.active=false;
			this.choice=undefined;
		}else{
			this.no_res.make_active();
			this.active=false;
			this.choice=undefined;

		}
	}
};

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
