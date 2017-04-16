
$(function(){



	/**
		抓取列表数据
	*/
	function pickListData(){

		var table = $("table.table-ng.table-ng-basic");
		var trs = table.find("tr")
		var result = [];
		for( i = 1 ; i< trs.length;i++ ){
			var tr = $(trs[i])
			result.push({
				id:tr.find("td.op").find("a").attr("href").match(/.*itemId=(\d+).*/)[1],
				pay_cri:tr.find("td.num").eq(2).html(),
				growth_rate:tr.find("td.num.diff-td").attr("value"),
				price:tr.find("p.extra-info").html().replace(/[^0-9]/ig,""),
				shop:tr.find("td").eq(2).find("a").html(),
				shop_url:tr.find('td').eq(2).find("a").attr("href"),
				sub_orders:tr.find("td.num").html(),
				url:tr.find("div.info-wrapper").find("a").attr("href"),
				index: i,
				detail:tr.find("td.op").find("a").attr("href")
			});
		}

		return {
			data:result,
			type:$("div.actions").find("a.btn-dropdown").attr("title")
		};

	}


	var port = window.port = chrome.extension.connect({name:"index"});
	port.onMessage.addListener(function(msg){
		console.log(msg)
	});


	var pickBtn = $("<div id='coke-book-pick' style='position:fixed;z-index:9999; background:#14A4FF;border-top:1px solid #0A82C8; top:300px; right:50px; padding:11px 12px;text-align:center;color:#fff;'>P</div>");
	pickBtn.appendTo($("body"));
	pickBtn.click(function(){

		var pickedData = null;
		try{
			var pickedData = pickListData();
		}catch(e){
			console.log(e)
			alert("数据抓起异常, 可能数据格式已经改变,请联系管理员");

			return ;
		}

		console.log(pickedData);
		port.postMessage({
			event:"start",
			data:pickedData
		});

	});






})