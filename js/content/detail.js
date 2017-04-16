$(function(){

	var isDetail = location.href.indexOf("view=detail") != -1;
	var needPick = true;

	var port = window.port = chrome.extension.connect({name:"index"});

	port.onMessage.addListener(function(msg){

		if(msg.source_event == "get"){

			var app = msg.app;
			console.log(app);
			if(app.status == "start"){

				task(pcAndWirelessDataPick,1000,function(data){
					var group = location.href.match(/.*itemId=(\d+).*/);
					
					port.postMessage({
						event:"update-flow",
						data:{
							id:group[1],
							flow:data
						}
					});
					window.close();
				});
			}

		}

	});

	port.postMessage({
		event:"get"
	});


	function pick(trs,startIndex){
		var result = [];
		for( i = startIndex; i < trs.length; i++){
			var tr = $(trs[i]);
			result.push({
				name: tr.find("td").eq(0).html().replace(/\s/ig,""),
				uv:tr.find("td").eq(1).html().replace(/[^0-9]/ig,""),
				uvRate:tr.find("td").eq(2).html().replace(/\s/ig,""),
				pv:tr.find("td").eq(3).html().replace(/[^0-9]/ig,""),
				pvRate:tr.find("td").eq(4).html().replace(/\s/ig,"")
			});
		}
		return result;
	}

	function pcAndWirelessDataPick(){


		var div = $('div.mod-item-flow-source');
		var pcTrs = div.find("div.source-table-wrapper").eq(0).find("tr");
		var wirelessTrs = div.find("div.source-table-wrapper").eq(1).find("tr");
		return {
			pc: pick(pcTrs,1),
			wireless:pick(wirelessTrs,1)
		};

	}
	
	function task(func , interval, callback){
		var r  = func();
		if( r.pc.length > 0 && r.wireless.length > 0) {
			callback(r);
			return;
		}
		setTimeout(function(){
			console.log("......");
			task(func,interval,callback);
		} , interval);
	}


	//task(pcAndWirelessDataPick,1000);

});