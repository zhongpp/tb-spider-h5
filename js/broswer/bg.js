(function(){

	var SERVER = "http://spider.cokebook.xyz";

	var app = {ts:new Date().getTime()};

	chrome.extension.onConnect.addListener(function(port){
		
		port.onMessage.addListener(function(msg,sender){
			if(msg.event == "get"){
				port.postMessage({
					source_event:msg.event,
					app:app
				});
				return;
			}
			if(msg.event == "start"){
				app.status = msg.event;
				app.data = msg.data;
				port.postMessage(app);
				startPickDetail(msg);
				return;
			}

			if(msg.event == "update-flow"){
				
				$.ajax({
						url:SERVER + "/industry/flow",
						data:{data: JSON.stringify(msg.data)},
						type:"POST",
						success:function(a){
							//console.log(a);
						}
				});

				return;
			}

		});

	});


	function startPickDetail(msg){
			var index = 0; 
			var datas = msg.data.data;

			for(var i=0; i< datas.length;i++){
				var item = datas[i];
				item.type = msg.data.type;
				$.ajax({
					url:SERVER + "/industry/item",
					data:item,
					type:"POST",
					dataType:"json",
					success:function(data){
						//console.log(data);
					}
				});
			}

			function task(){
				if(index < datas.length){
					var item = datas[index++]
					chrome.tabs.create({
						url:"https://sycm.taobao.com/mq/industry/rank/industry.htm?spm=a21ag.7782695.LeftMenu.d343.PJbORx"+item.detail
					});
					setTimeout(task,2000);
				}else{
					msg.type="end";
					alert("数据加载完成...")
				}

			}
			task();
			
		
	}

})();