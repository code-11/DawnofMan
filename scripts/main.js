requirejs(["flow"], function(flow) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".

var shelter     = new flow.Point("Shelter Unit",0);
var pop_health  = new flow.Rate("Pop Health"   ,0);
var pop_delta   = new flow.Mult("Pop Delta"    ,1);
var nat_pop_rate= new flow.Source("Nat Pop Rate",.00003);//.09//.1
var pop_rate    = new flow.Rate("Pop Rate"     ,0);
var pop         = new flow.Point("Pop Unit"    ,10);
var work        = new flow.Rate("Work Unit"    ,0);
var food        = new flow.Point("Food Unit"   ,10000);
var gather_type = new flow.Point("Gather Type" ,0);
var food_rate   = new flow.Rate("Food Rate"    ,0);
var exposure    = new flow.Sub("Exposure"     ,0);
var hunger      = new flow.Sub("Hunger"       ,0);

flow.add_low_shift(food,0,0);
flow.add_low_shift(pop,1,0);
flow.add_low_shift(hunger,0,0);

pop.conn_to(pop_delta,1);
pop.conn_to(food,-1);
//pop.conn_to(work,10);
pop_rate.conn_to(pop_delta,1);
pop_delta.conn_to(pop,1);
// work.conn_to(shelter,.1);

nat_pop_rate.conn_to(pop_rate,1);

//exposure subtracts population from shelter
// pop.conn_to(exposure,1);
// shelter.conn_to(exposure,1);

//hunger subtracts population from food 
pop.conn_to(hunger,1);
food.conn_to(hunger,1);

hunger.conn_to(pop,-.1);

// hunger.conn_to(pop_rate,-.002);
// exposure.conn_to(pop_rate,-.001);

all_points=[nat_pop_rate,pop_rate,pop_delta,pop,food,hunger];

for (var j = 0;j < 2000;j += 1){
	for(var i = 0;i < all_points.length;i += 1){
		var point = all_points[i];
		point.full_calc();
		
		// if (shelter.value>(2*pop.value)){
		// 	shelter.value=2*pop.value;
		// }

		if (point.name=="Pop Unit"){//||point.name=="Hunger"||point.name=="Food Unit"){//||point.name=="Exposure"){
			point.val_display();
		}
	}
	//console.log("----------- "+(j+1));
}
// for(var k = 0;k < all_points.length;k += 1){
// 	var point = all_points[k];
// 	point.display();
// }
});