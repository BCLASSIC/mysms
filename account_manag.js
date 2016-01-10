var recipet_values = "";
var recipet_by = "";
var access_back_button_flag = "0";
var geo_access_level_value = "";
var org_access_level_flag = "";
var last_selected_access_state_id = "";
var last_selected_access_city_id = "";
var last_selected_access_area_id = "";
var org_access_click_flag = "0";
var geo_accessed_list = [];
var org_accessed_list = [];
var org_access_list_values = [];
var saved_geo_values = [];
var edit_id = "";
var access_value_array = [];
var receipt_value = "";
var access_type = "";
var org_access_value = "";
var list1 = $("#list1");
var list2 = $("#list2");
var headeralert = "Modify Access Status";
/*$("#addPlanList").on("shown.bs.modal", function() {
 $("#list1").jqGrid('setGridWidth', $(".grid_width").width());
 $("#list2").jqGrid('setGridWidth', $(".grid_width").width());
 });*/
getlcoplan();
var selectedPlanArray = [];
var plansArray = [];
var unselectedPlanArray = [];
var rows = [];
$("#list1").jqGrid('setGridWidth', "400px");
$("#list1").jqGrid({
	datatype: "local",
	data: rows,
	//url: "index.php?r=accountmanag/getLCOPlans",
	//datatype: "json", 
	//mtype: "GET",
	/* colModel: [
	 {name: "fulldetail", label: 'Plan Details'},
	 {name: 'descr', index: 'note', width: 150, hidden: true},
	 {name: 'code', index: 'note', width: 150, hidden: true},
	 {name: 'poid', index: 'note', width: 150, hidden: true},
	 {name: 'services', index: 'note', width: 150, hidden: true},
	 
	 ],*/
	colNames: ["Plan Details", "", "", "", ""],
	colModel: [
		{name: "plan_name"},
		{name: 'descr', "hidden": true},
		{name: "code", "hidden": true},
		{name: "poid", "hidden": true},
		{name: 'services', "hidden": true}

	],
	jsonReader: {
		repeatitems: false
	},
	beforeSelectRow: function(rowid, e) {
		return true;
	},
	multiselect: true,
	autowidth: true,
	pager: "pager1",
	sortname: "date",
	sortorder: "desc",
	viewrecords: true,
	gridview: true,
	autoencode: false,
	caption: "Available Plan List",
	height: "100%",
	gridComplete: function() {
		/*var ids = $("#list1").jqGrid('getDataIDs');
		 for (var i = 0; i < ids.length; i++) {
		 }*/
	}, onCellSelect: function(rowid, col, content, e) {
		var rowData = $("#list1").getRowData(rowid);
		var colData = rowData.id;
		if ($(this).find(".cbox").val() === 'on') {
			var thisRow = $(this).find(".cbox").closest('tr').attr('id');
			var data = $("#list1").jqGrid('getRowData', rowid);
			//addRowToSelectedPlan("list2", '1', data.fulldetail);
			//removeRowFromSelectedPlan("list2");
			unselectedPlanArray.push(rowData);
			$("#list2").jqGrid('addRowData', 0, rowData);
			//var $tr_last = $("#list2 tr:last");
			//$tr_last.attr('id', rows).find('td').eq(columnNum).html(text);
			//var $ele=$("#"+$tr_last.attr('id', rows).find('td').eq('0').find('.cbox').attr('id'));
			//$ele.prop('checked', true);
			$("#list2").trigger("reloadGrid");

			//onPlanSelect(rowid, rowData);

			$('#list1').jqGrid('delRowData', rowid);
		}
	},
	loadComplete: function(data) {
		//console.log(data);
		plansArray = data.rows;
		var table = this;
		setTimeout(function() {
			//styleCheckbox(table);
			//updateActionIcons(table);
			updatePagerIcons(table);
			//enableTooltips(table);
		}, 0);
	}
});

for (var i = 0; i < rows.length; i++) {
	$("#list1").jqGrid("addRowData", i, rows[i]);
}

var grid_selector = "#list2";

//resize to fit page size
$(window).on('resize.jqGrid', function() {
	//console.log($("#search_parent .modal-dialog .search_parent_grid_wrapper").width());
	$(grid_selector).jqGrid('setGridWidth', $("#main-contianer").width());
});
//resize on sidebar collapse/expand
var parent_column = $(grid_selector).closest('[class*="col-"]');
$(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
	if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
		//setTimeout is for webkit only to give time for DOM changes and then redraw!!!
		setTimeout(function() {
			$(grid_selector).jqGrid('setGridWidth', parent_column.width());
		}, 0);
	}
});

$("#list2").jqGrid({
	datatype: "local",
	colNames: ["Plan Details", "", "", "", ""],
	colModel: [
		{name: "plan_name"},
		{name: 'descr', "hidden": true},
		{name: "code", "hidden": true},
		{name: "poid", "hidden": true},
		{name: 'services', "hidden": true}

	],
	onCellSelect: function(rowid, col, content, e) {
		var rowData = $("#list2").getRowData(rowid);
		//var data = $("#list2").jqGrid('getRowData', rowid);
		unselectedPlanArray.push(rowData);
		$("#list2").jqGrid('addRowData', 0, rowData);
		$("#list2").trigger("reloadGrid");
		$('#list2').jqGrid('delRowData', rowid);
	},
	multiselect: true,
	shrinkToFit: false,
	caption: "Selected Plan List"
});

$(window).bind('resize', function() {
	list1.setGridWidth(checkPosition(), true);
	list2.setGridWidth(checkPosition(), true);
}).trigger('resize');

var width1 = list1.jqGrid('getGridParam', 'width'); // get current width
list1.jqGrid('setGridWidth', width1, true);

var width2 = list2.jqGrid('getGridParam', 'width'); // get current width
list2.jqGrid('setGridWidth', width2, true);

$("#list2").jqGrid('navGrid', '#pager2', {edit: true, add: false, del: false});

$("#removeBtn").click(function() {
	var ids = list2.jqGrid('getGridParam', 'selarrrow');
	console.log(ids.length);
	if (ids.length > 0) {
		var removedData = [];
		for (var i = 0; i < ids.length; i++) {
			var rowData = $("#list2").getRowData(ids[i]);
			removedData.push(rowData);
			unselectedPlanArray.pop(rowData);
			console.log(rowData);
		}
		for (var i = 0; i < removedData.length; i++) {
			$("#list1").jqGrid("addRowData", i, removedData[i]);
			var $ele = $("#" + $("#list1 tr").eq(removedData[i]).find('td').eq('0').find('.cbox').attr('id'));
			$ele.prop('checked', false);
		}
		$("#list2").jqGrid("clearGridData", true).trigger("reloadGrid");
		if (unselectedPlanArray.length > 0) {
			for (var j = 0; j < unselectedPlanArray.length; j++) {
				$("#list2").jqGrid("addRowData", j, unselectedPlanArray[j]);
			}
		}
		$("#list2").trigger("reloadGrid");
	} else {
		alert("select atleast one value");
	}
});

function onEditPlanListDetails() {
	$('#editPlanList').modal();
}


function onAddPlanListDetails() {
	var grid = $('#list1');
	//var rows = [];
	$('#addPlanList').modal();
	$.ajax({
		type: "post",
		url: "index.php?r=accountmanag/getLCOPlans",
		//data: {"data": post_values},
		success: function(d, s) { //Dont have to parse d value while declared datatype:json(befr this line)
			if (s == "success") {
				var res = JSON.parse(d);
				if (res["status"] == '0') {
					if (!res.plans) {
						$("#list1").jqGrid("clearGridData", true).trigger("reloadGrid");
						bootbox_alert("LCO Plan List Status", "No LCO Plans Available!");
						return;
					}
					var data = [];
					var desc = "";
					data = res.plans;
					var allserviceArr = [];
					if (data.length > 1) {
						for (var i = 0; i < data.length; i++) {
							var data_plan = {};
							data_plan = data[i];
							desc = data_plan.service_type_string;
							if (data_plan.services.length > 1) {
								allserviceArr = [];
								var flag = false;
								$.each(data_plan.services, function(index, service) {
									if (!flag) {
										var serviceArr = {};
										if (service.deal_obj)
											serviceArr["deal_obj"] = service.deal_obj;
										if (service.service_obj)
											serviceArr["service_obj"] = service.service_obj;

										allserviceArr.push(serviceArr);
									}
								});
								flag = true;

							} else {
								var serviceArr = {};
								allserviceArr = [];
								if (data_plan.services.deal_obj)
									serviceArr["deal_obj"] = data_plan.services.deal_obj;
								if (data_plan.services.service_obj)
									serviceArr["service_obj"] = data_plan.services.service_obj;
								allserviceArr.push(serviceArr);
							}

							var rowDetails = {
								//"fulldetail": "<b>" + data_plan.name + "</b><br><br>",
								"plan_name": data_plan.plan_name,
								"descr": data_plan.descr,
								"code": data_plan.code,
								"poid": data_plan.poid,
								"services": JSON.stringify(allserviceArr)

							};
							rows.push(rowDetails);

						}
					} else {
						var data_plan = {};
						data_plan = res.plans;
						if (data_plan.services.length > 1) {
							allserviceArr = [];
							$.each(data_plan.services, function(index, service) {
								var serviceArr = {};
								if (service.deal_obj)
									serviceArr["deal_obj"] = service.deal_obj;
								if (service.service_obj)
									serviceArr["service_obj"] = service.service_obj;

								allserviceArr.push(serviceArr);
							});
						} else {
							allserviceArr = [];
							var serviceArr = {};
							if (data_plan.services.deal_obj)
								serviceArr["deal_obj"] = data_plan.services.deal_obj;
							if (data_plan.services.service_obj)
								serviceArr["service_obj"] = data_plan.services.service_obj;

							allserviceArr.push(serviceArr);
						}

						var rowDetails = {
							//"fulldetail": "<b>" + data_plan.name + "</b><br><br>",
							"plan_name": data_plan.plan_name,
							"descr": data_plan.descr,
							"code": data_plan.code,
							"poid": data_plan.plan_poid,
							"services": JSON.stringify(allserviceArr),
						};
						rows.push(rowDetails);
					}
				} else if (res.status == '1') {
					bootbox_alert("Plan List Status", res.respxml);
					//$("#catvActivation").show();
				}
				console.log(rows);
				$("#list1")[0].addJSONData(rows);
			}
		}
	});

}


function checkPosition() {
	var len;
	if ($(window).width() < 767)
	{
		len = parseInt($("#legendDiv").width());
	} else {
		len = parseInt($("#legendDiv").width() / 2.2);
	}
	return len;
}

//$("#submitBtn").on("click", function() {
//		//if(validate()){
//			$.unique(unselectedPlanArray);
//			console.log(unselectedPlanArray);
//			//return;
//			$.ajax({
//				url: "index.php?r=accountmanag/lcoaddagreement",
//				type: "post",
//				dataType: "json",
//				data: {"data":unselectedPlanArray},
//				success: function(d, s) {
//					if (s == "success") {
//						if (d.statuscode == "0") {
//							bootbox_alert("New Plan List Creation Status","New Plan List successfully added!");
//                            unselectedPlanArray = [];
//							clearForm();
//							$("#planName").focus();
//						} else {
//							bootbox_alert("New Plan List Creation Status","Error");
//						}
//					} else {
//						bootbox_alert("New Plan List Creation Status","Error occurred!");
//					}
//				}
//			});
//		//}
//    });

//onAddPlanListDetails();


///******************************************************Get LCO PLANS BY KARTHI ***********************************
var changeplan_deal = "";
var changeplan_obj = "";
var lcoselectedrows = [];
var lcoavailablerows = [];
var cancelplanarray = [];
$("#list1_available_plan").jqGrid('setGridWidth', $("#available_lco_plans").width());
$("#list1_available_plan").jqGrid({
	datatype: "local",
	colNames: ["Plan Name", "plan poid"],
	colModel: [
		{name: "plan_name"},
		{name: "plan_poid", hidden: true},
	],
	jsonReader: {
		repeatitems: false
	},
	multiselect: true,
	autowidth: true,
	viewrecords: true,
	loadOnce:true,
	gridview: true,
	ignoreCase:true,
	//height:100, 
	autoencode: false,
	//caption: "Available Plans",
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
		}
});
$("#list2_selected_plan").jqGrid('setGridWidth', $("#assigned_lco_plans").width());
$("#list2_selected_plan").jqGrid({
	datatype: "local",
	colNames: ["Plan Name", "plan Poid"],
	colModel: [
		{name: "plan_name"},
		{name: "plan_poid", hidden: true}
	],
	jsonReader: {
		repeatitems: false
	},
	multiselect: true,
	autowidth: true,
	viewrecords: true,
	loadOnce:true,
	gridview: true,
	ignoreCase:true,
	//height:100, 
	autoencode: false,
	//caption: "Selected Plans",
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
	}

});
$("#list1_available_plan").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
$("#list2_selected_plan").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
function getlcoplan() {
	if ($("#list1_available_plan").length > 0){
	var lcoplan_value = {
		"poid": "0.0.0.1 /plan -1 0"
	};
	$.ajax({
		url: "index.php?r=accountmanag/getlcoplans",
		data: lcoplan_value,
		type: "post",
		success: function(d, s) {
			var data = JSON.parse(d);
			if (data.status == 0) {
				var plandetails = data.plans
				var planrows = [];
				if (plandetails.length > 1) {
					$.each(plandetails, function(b, c) {
						var plan_value = {
							"plan_name": c.code,
							"plan_poid": c.poid
						};
						planrows.push(plan_value);
					});
				} else {
					var plan_value = {
						"plan_name": data.plans.code,
						"plan_poid": data.plans.poid
					};
					planrows.push(plan_value);
				}
				console.log(planrows);
				if ($("#list1_available_plan").length > 0){
				$("#list1_available_plan").jqGrid('clearGridData');
					for (var j = 0; j < planrows.length; j++) {
						$("#list1_available_plan").jqGrid("addRowData", planrows[j]["ID"], planrows[j]);
					}
				$("#list1_available_plan").trigger("reloadGrid");
					}					
			} else {
				bootbox_alert("Get Lco Plan Details", data.respxml);
			}
		}
	});
	}
}

function MoveAlllcoplans() {
    var srcgrid = $("#list1_available_plan");
    var dstgrid = $("#list2_selected_plan");
    var allRowsInGrid = srcgrid.jqGrid('getGridParam', 'data');
    if (allRowsInGrid.length == 0) {
        bootbox_alert("Lco Commission Plan Creation Status", "Atleast One Plan should be there!");
        return;
    }

    allRowsInGrid.sort();
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(dstgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }
    $(srcgrid).jqGrid('clearGridData').trigger("reloadGrid");

}

function removeAllRoleFromUser() {
    var srcgrid = $("#list1_available_plan");
    var dstgrid = $("#list2_selected_plan");
    var allRowsInGrid = dstgrid.jqGrid('getGridParam', 'data');
    if (allRowsInGrid.length == 0) {
        bootbox_alert("Lco Commission Plan Creation Status", "Atleast One Plan should be there!");
        return;
    }

    allRowsInGrid.sort();
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(srcgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }
    $(dstgrid).jqGrid('clearGridData').trigger("reloadGrid");
}

function moveSelectedlcoplans() {

    var srcgrid = $("#list1_available_plan");
    var dstgrid = $("#list2_selected_plan");
    var allRowsInGrid = dstgrid.jqGrid('getGridParam', 'data');
    var selectArr = [];
    selectArr = jQuery("#list1_available_plan").jqGrid('getGridParam', 'selarrrow');
    if (selectArr.length == 0) {
        bootbox_alert(headeralert, "Atleast One Role should be selected!")
        return;
    }

    var parentArr = [];
    for (var rows = 0; rows < selectArr.length; rows++) {
        parentArr[rows] = $("#list1_available_plan").jqGrid('getRowData', selectArr[rows]);
    }

    for (var rows = 0; rows < selectArr.length; rows++) {
        var rd = parentArr[rows];
        allRowsInGrid.push(rd);
        allRowsInGrid.sort();
    }

    $(dstgrid).jqGrid('clearGridData').trigger("reloadGrid");
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(dstgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }

    $(dstgrid).trigger("reloadGrid");

    $.each(selectArr, function() {
        $(srcgrid).delRowData(this);
    });
    $(srcgrid).trigger("reloadGrid");
}

function removeSelectedlcoplans() {
    var srcgrid = $("#list1_available_plan");
    var dstgrid = $("#list2_selected_plan");
    var allRowsInGrid = srcgrid.jqGrid('getGridParam', 'data');
    var selectArr = [];
    selectArr = jQuery("#list2_selected_plan").jqGrid('getGridParam', 'selarrrow');
    if (selectArr.length == 0) {
        bootbox_alert(headeralert, "Atleast One Role should be selected!")
        return;
    }
    var parentArr = [];
    for (var rows = 0; rows < selectArr.length; rows++) {
        parentArr[rows] = $("#list2_selected_plan").jqGrid('getRowData', selectArr[rows]);
    }

    for (var rows = 0; rows < selectArr.length; rows++) {
        var rd = parentArr[rows];
        allRowsInGrid.push(rd);
        allRowsInGrid.sort();
    }

    $(srcgrid).jqGrid('clearGridData').trigger("reloadGrid");
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(srcgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }

    $(srcgrid).trigger("reloadGrid");
    $.each(selectArr, function() {
        $(dstgrid).delRowData(this);
    });
    $(dstgrid).trigger("reloadGrid");
}

$("#submitBtn").on("click", function() {
	var lco_planlist_name = $("#lco_plan_list_name").val();
	var selectedids = $("#list2_selected_plan").jqGrid("getDataIDs");
	if (lco_planlist_name == "") {
		bootbox_alert("Lco Get Plan Status", "Plan List Name Cann't Be Empty");
	}
	else if (selectedids.length > 0) {
		var selectedplanarray = [];
		console.log($("#list2_selected_plan").jqGrid("getDataIDs"));
		$.each(selectedids, function(b, c) {
			var selectedvalue = $("#list2_selected_plan").jqGrid("getRowData", c);
			var lco_plan_value = {
				"plan_name": selectedvalue.plan_name,
				"plan_poid": selectedvalue.plan_poid
			};
			selectedplanarray.push(lco_plan_value);
		});

		$.ajax({
			url: "index.php?r=accountmanag/lcoplanlistcreation",
			data: {"plandetails": selectedplanarray, "plan_list_name": lco_planlist_name},
			type: "post",
			success: function(d, s) {
				var data = JSON.parse(d);
				bootbox_alert("Lco Get Plan Status", data.statustext);
			}
		});
	} else {
		bootbox_alert("Lco Get Plan Status", "Plans Need to Be Select");
	}
});

$("#available_agreement").jqGrid('setGridWidth', $(".available_agreement").width());
$("#available_agreement").jqGrid({
	datatype: "local",
	colNames: ["Plan Name", "plan poid", "plan id"],
	colModel: [
		{name: "plan_name"},
		{name: "plan_poid", hidden: true},
		{name: "plan_id", hidden: true},
	],
	jsonReader: {
		repeatitems: false
	},
	multiselect: true,
	autowidth: true,
	viewrecords: true,
	gridview: true,
	//height:100, 
	autoencode: false,
	caption: "Available Plans",
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
	},
	onSelectRow: function(rowid, status, e) {
		if (status) {
			var rowDatas = $(this).jqGrid("getRowData", rowid);
			lcoselectedrows.push(rowDatas);
			$("#selected_agreement")[0].addJSONData(lcoselectedrows);
		}
	},
	onSelectAll: function(aRowids, status) {
		var rowDatas = "";
		if (status) {
			for (var i = 0; i < aRowids.length; i++) {
				rowDatas = $(this).jqGrid("getRowData", aRowids[i]);
				lcoselectedrows.push(rowDatas);
			}
			$("#selected_agreement")[0].addJSONData(lcoselectedrows);
		}
	}
});

$("#selected_agreement").jqGrid('setGridWidth', $(".selected_agreement").width());
$("#selected_agreement").jqGrid({
	datatype: "local",
	colNames: ["Plan Name", "plan Poid"],
	colModel: [
		{name: "plan_name"},
		{name: "plan_poid", hidden: true}
	],
	jsonReader: {
		repeatitems: false
	},
	multiselect: true,
	autowidth: true,
	viewrecords: true,
	gridview: true,
	//height:100, 
	autoencode: false,
	caption: "Selected Plans",
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
	},
	onSelectRow: function(rowid, status, e) {
		if (status) {
			$(this).jqGrid("delRowData", rowid);
		}
	},
	onSelectAll: function(aRowids, status) {
		if (status) {
			$(this).jqGrid("clearGridData");
		}
	}

});

$("#lco_agreement_list").on("change", function() {
	var plan_list = {
		"plan_list_name": $(this).val()
	};
	$.ajax({
		url: "index.php?r=accountmanag/lcoplans",
		data: plan_list,
		type: "post",
		success: function(d, s) {
			var data = JSON.parse(d);
			$("#available_agreement")[0].addJSONData(data);
			console.log(data);
		}
	});
});

$("#add_lco_agreement").on("click", function() {
	var selectedplans = $("#selected_agreement").jqGrid("getDataIDs");
	if (selectedplans.length < 0) {
		bootbox_alert("Lco Agreement Addition Status", "Plans Need To Be Select");
	} else {
		var agreement_array = [];
		$.each(selectedplans, function(b, c) {
			var rowDatas = $("#selected_agreement").jqGrid("getRowData", c);
			var agreement_values = {
				"plan_obj": rowDatas.plan_poid
			};
			agreement_array.push(agreement_values);
		});
		var add_agreement = {
			"poid": $("#customer_poid").val(),
			"agreement_plans": agreement_array
		};
		$.ajax({
			url: "index.php?r=accountmanag/add_agreement",
			data: add_agreement,
			type: "post",
			success: function(d, s) {
				var data = JSON.parse(d);
				if (data.status == "0") {
//					bootbox_alert("Lco Agreement Addition Status", data.descr);
					bootbox_refresh("Lco Agreement Addition Status",data.descr);
				} else {
					bootbox_alert("Lco Agreement Addition Status", data.respxml);
				}
			}
		});
	}
});
$("#lcoagreement").on("shown.bs.collapse", function() {
	$("#selected_agreement").jqGrid('setGridWidth', $(".available_agreement").width());
	$("#available_agreement").jqGrid('setGridWidth', $(".selected_agreement").width());
	

});

function OnChangePlanClick(deal_array, plan_obj) {
	changeplan_deal = deal_array;
	changeplan_obj = plan_obj;
	$("#change_agreement_plan").modal("show");
}
$("#change_agreement_plan").on("shown.bs.modal", function() {
//	alert("thapi");
	$("#change_avaliable_agreements").jqGrid('setGridWidth', $(".grid_size").width());
	$("#change_selected_agreements").jqGrid('setGridWidth', $(".grid_size").width());
});
$("#change_avaliable_agreements").jqGrid({
	datatype: "local",
	colNames: ["Plan Name", "plan poid", "plan id"],
	colModel: [
		{name: "plan_name"},
		{name: "plan_poid", hidden: true},
		{name: "plan_id", hidden: true},
	],
	jsonReader: {
		repeatitems: false
	},
	multiselect: true,
	autowidth: true,
	viewrecords: true,
	gridview: true,
	//height:100, 
	autoencode: false,
	caption: "Available Plans",
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
	},
	onSelectRow: function(rowid, status, e) {
		if (status) {
			var rowDatas = $(this).jqGrid("getRowData", rowid);
			lcoselectedrows.push(rowDatas);
			$("#change_selected_agreements")[0].addJSONData(lcoselectedrows);
		}
	},
	onSelectAll: function(aRowids, status) {
		var rowDatas = "";
		if (status) {
			for (var i = 0; i < aRowids.length; i++) {
				rowDatas = $(this).jqGrid("getRowData", aRowids[i]);
				lcoselectedrows.push(rowDatas);
			}
			$("#change_selected_agreements")[0].addJSONData(lcoselectedrows);
		}
	}
});


$("#change_selected_agreements").jqGrid({
	datatype: "local",
	colNames: ["Plan Name", "plan Poid"],
	colModel: [
		{name: "plan_name"},
		{name: "plan_poid", hidden: true}
	],
	jsonReader: {
		repeatitems: false
	},
	multiselect: true,
	autowidth: true,
	viewrecords: true,
	gridview: true,
	//height:100, 
	autoencode: false,
	caption: "Selected Plans",
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
	},
	onSelectRow: function(rowid, status, e) {
		if (status) {
			$(this).jqGrid("delRowData", rowid);
		}
	},
	onSelectAll: function(aRowids, status) {
		if (status) {
			$(this).jqGrid("clearGridData");
		}
	}

});
$("#change_agreement_plan_list").on("change", function() {
	var plan_list = {
		"plan_list_name": $(this).val()
	};
	$.ajax({
		url: "index.php?r=accountmanag/lcoplans",
		data: plan_list,
		type: "post",
		success: function(d, s) {
			var data = JSON.parse(d);
			$("#change_avaliable_agreements")[0].addJSONData(data);
			console.log(data);
		}
	});
});

$("#change_lco_aggrement").on("click", function() {
	var selectedids = $("#change_selected_agreements").jqGrid("getDataIDs");
	var newplan = [];
	var oldplan = [];
	var error_html = "";
	if (selectedids.length < 0) {
		error_html = "<h4 style='color:red;'>Must Select A Plan</h4>";
		$("#error_descr").html(error_html);
	} else {
		var oldplan_value = {
			"plan_obj": changeplan_obj,
			"deals": changeplan_deal
		};
		oldplan.push(oldplan_value);
		$.each(selectedids, function(b, c) {
			var rowData = $("#change_selected_agreements").jqGrid('getRowData', c);
			var newplan_value = {
				"plan_obj": rowData.plan_poid
			};
			oldplan.push(newplan_value);
		});


		var changeplan_value = {
			"poid": $("#customer_poid").val(),
			"agreement_plans": oldplan
		};
		$.ajax({
			url: "index.php?r=accountmanag/chnage_agreement",
			data: changeplan_value,
			type: "post",
			success: function(d, s) {
				var data = JSON.parse(d);
				if (data.status == 0) {
//					error_html = "<h4 style='color:green;'>" + data.descr + "</h4>";
					$("#change_agreement_plan").modal("hide");
					bootbox_refresh("Change Agreement Status",data.descr);
				} else {
					error_html = "<h4 style='color:red;'>" + data.respxml + "</h4>";
					$("#error_descr").html(error_html);
				}
			}
		});
	}
});

function OncancelPlan(deals_array, plan_obj) {
	cancelplanarray = [];
	var cancel_plan = {
		"plan_obj": plan_obj,
		"deals": deals_array
	};
	cancelplanarray.push(cancel_plan);
	bootbox.confirm({
		title: 'Lco Agreement Cancel Service',
		message: 'Are You Want TO Cancel This agreement',
		buttons: {
			confirm: {
				label: 'ok',
				className: 'btn-danger pull-right'
			}
		},
		callback: function(result) {
			if (result) {
				var cancel_value = {
					"poid": $("#customer_poid").val(),
					"agreement_plans": cancelplanarray
				};
				$.ajax({
					url: "index.php?r=accountmanag/cancel_agreement",
					data: cancel_value,
					type: "post",
					success: function(d, s) {
						var data = JSON.parse(d);
						if (data.status == "0") {
							console.log(data.descr);
//							bootbox_alert("Cancel Agreement",data.descr);
							bootbox_refresh("Cancel Agreement",data.descr);
						} else {
							bootbox_alert("Cancel Agreement",data.respxml);
//							bootbox_refresh("Cancel Agreement",data.respxml);
						}
					}
				});
			}

		}

	});


}

$(".business_unit_edit_status").on("click",function(){
	$("#buser_status_modal").modal("show");
});

$("#buser_status_change").on("click",function(){
	var buser_change_value = {
                "account_no":Customer_Account_No,
		"service_change_poid":$("#customer_poid").val(),
		"status_change_descr":$("#buser_status_notes").val(),
		"change_status":$("#buser_user_status").val()
	};
	$.ajax({
		url:"index.php?r=accountmanag/changeservicestatus",
		data:buser_change_value,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == 0){
				var result_value = data.data_array.pop();
				if(result_value.business_user_account_status == "10100"){
					$(".b_user_status_value").text("ACTIVE");
				}else{
					$(".b_user_status_value").text("INACTIVE");
				}
				$("#buser_status_modal").modal("hide");
				bootbox_alert("Service Change Status",data.descr);
			}else{
				$("#buser_status_modal").modal("hide");
				bootbox_alert("Service Change Status",data.respxml);
			}
		}
	});
});

$("#lco_pay_submit").on("click",function(){
	var pay_type = $("input[name=optionsRadios]:checked").val();
	var effctive_time = "";
	if($("#lco_pay_cheque_date").val() != "")
	effctive_time = ($("#lco_pay_cheque_date").datepicker("getDate").getTime() / 1000);
	var error_html = "<ul>";
	$(".payment_validate_item").each(function(){
		if($(this).val() == ""){
			error_html += "<li>"+$(this).attr("placeholder")+" Cann't Be Empty</li>";
		}
	});
	
	if(error_html.length  > 5){
		error_html += "</ul>";
		bootbox_alert("Business Unit Payment Status",error_html);
		return false;
	}else{
		var payment_value = {
			"service_type":$("#lco_payment_service_type").val(),
			"amount":$("#lco_pay_amt").val(),
			"account_obj":$("#customer_poid").val(),
			"poid":$("#customer_poid").val(),
			"receipt_no":$("#lco_pay_reference_id").val(),
			"bank_account_no":$("#lco_pay_bank_acc_no").val(),
			"bank_name":$("#lco_pay_bank_name").val(),
			"bank_code":$("#lco_pay_micrcode").val(),
			"cheque_no":$("#lco_pay_cheque_no").val(),
			"start_date":effctive_time,
			"branch_no":$("#lco_pay_bank_branch").val(),
			"descr":$("#lco_pay_description").val(),
			"pay_type":pay_type,
			"channel":$("#lco_payment_channel option:selected").text(),
			"command":"0",
			"pymt_channel":"0",
			"type":"0"
		};
		$.ajax({
			url:"index.php?r=accountmanag/payments",
			data:payment_value,
			type:"post",
			success:function(d,s){
				var data = JSON.parse(d);
				console.log(data);
				
				if(data.status == "0"){
					var by = "";
					if(pay_type == "10011"){
						by = "Cash";
					}else{
						by = "Cheque";
					}
					data['by']  = by;
					bootbox.confirm({
						title: "Payment Status",
						message: "Payment Has Successfully Paid",
						buttons: {
							confirm: {
								label: 'ok',
								className: 'btn-danger pull-right'
							}
						},
						callback: function(result) {
							if (result) {
								window.localStorage.setItem("receiptparams",JSON.stringify(data));
								var popupwin = window.open("index.php?r=usersummary/show_receipt&t=" + (new Date().getTime())+"&type="+by,"receipt", "status=0,scrollbars=yes,toolbar=0,menubar=1");
								$(".validate_item").each(function(){
									$(this).val('');
								});
							}
						}
					});
					
				}
			}
		});
	}
});

$("input[type=radio][name=optionsRadios]").on("change",function(){
	if($(this).val() == "10012"){
		$(".pay_cheque").removeClass("hide");
		$(".cheque").addClass("validate_item");
	}else if($(this).val() == "10011"){
		$(".pay_cheque").addClass("hide");
		$(".cheque").removeClass("validate_item");
	}
});

$(document).on("focus",".datepicking",function(){
	$(this).datepicker({
		autoclose: true
	});
});


$("#lco_payment_reversal_submit").on("click", function() {
	var error_html = "<ul>";
	$(".reversel_payment_validate_item").each(function() {
		if ($(this).val() == "") {
			error_html += "<li>" + $(this).attr("placeholder") + " Cann't Be Empty</li>";
		}
	});
	if (error_html.length > 5) {
		error_html += "</ul>";
		bootbox_alert("Payment Reversal Status", error_html);
	} else {
		if (receipt_value != 4) {
			bootbox.confirm({
				title: "Payment Reversal Status",
				message: "Are You Sure want To Reverse",
				buttons: {
					confirm: {
						label: 'ok',
						className: 'btn-danger pull-right'
					}
				},
				callback: function(result) {
					if (result) {

						var reversel_value = {
							"poid": "0.0.0.1 /account 1 0",
							"reason_id": $("#lco_payment_reversal_type").val(),
							"amount": $("#reversalamount").val(),
							"receipt_no": $("#receipt_number").val(),
							"reason_code": $("#lco_payment_reversal_type").val(),
						}
						$.ajax({
							url: "index.php?r=accountmanag/lco_payment_reversal",
							data: reversel_value,
							type: "post",
							success: function(d, s) {
								var data = JSON.parse(d);
								if(data.status == "0"){
									bootbox_alert("Payment Reversal Status","Successfully Reversed");
								}else{
									bootbox_alert("Payment Reversal Status",data.respxml);
								}
							}
						});
					} 
				}

			});
		}else{
			bootbox.confirm({
				title: "Payment Correction Status",
				message: "Are You Sure want To Correct",
				buttons: {
					confirm: {
						label: 'ok',
						className: 'btn-danger pull-right'
					}
				},
				callback: function(result) {
					if (result) {
						var correct_value = {
							"poid":"0.0.0.1 /account 1 0",
							"receipt_no":$("#receipt_number").val(),
							"account_no":$("#pay_reversal_number").val()
						};
						$.ajax({
							url:"index.php?r=accountmanag/lco_payment_correction",
							type:"post",
							data:correct_value,
							success:function(){
								var data = JSON.parse(d);
								if(data.status == "0"){
									bootbox_alert("Payment Correction Status","Successfully Reversed");
								}else{
									bootbox_alert("Payment Correction Status",data.respxml);
								}
							}
						});
					} 
				}

			});
						
		}
	}
});

$("#lco_payment_reversal_type").on("change",function(){
	receipt_value = $(this).val();
	if(receipt_value == "1"){
		$(".correction_account").addClass("hide");
		$(".fine_amount").removeClass("hide");
		$("#reversalamount").addClass("reversel_validate_item");
		$("#pay_reversal_number").removeClass("reversel_validate_item");
	}else if(receipt_value == "4"){
		$(".correction_account").removeClass("hide");
		$(".fine_amount").addClass("hide");
		$("#reversalamount").removeClass("reversel_validate_item");
		$("#pay_reversal_number").addClass("reversel_validate_item");
	}else{
		$(".correction_account").addClass("hide");
		$(".fine_amount").addClass("hide");
		$("#reversalamount").removeClass("reversel_validate_item");
		$("#pay_reversal_number").removeClass("reversel_validate_item");
	}
});

$("#csr_edit_transaction_limit").on("click",function(){
	$("#monthly_credit_limit").modal("show");
});

$("#csr_edit_monthly_limit").on("click",function(){
	$("#monthly_transaction_limit").modal("show");
});

$("#cr_transaction_credit_limit").on("click",function(){
	var trans_adj_limit = {
		"trans_adj_limit_value":$("#modify_cr_limit_value").val(),
		"poid":$("#customer_poid").val(),
		"account_poid":$("#customer_poid").val()
	};
	$.ajax({
		url:"index.php?r=accountmanag/modifytranslimit",
		data:trans_adj_limit,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == "0"){
				var data_array = data.data_array;
				var last_value = data_array.pop();
				console.log(last_value);
				$(".transaction_limit").html(last_value.transaction_limit);
				bootbox_alert("Modify Credit Limit Status",data.descr);
				$("#monthly_credit_limit").modal("hide");
			}else if(data.status == "1"){
				bootbox_alert("Modify Credit Limit Status",data.respxml);
			}
		}
	});
});

$("#cr_monthly_credit_limit").on("click",function(){
	var trans_adj_limit = {
		"monthly_adj_limit_value":$("#modify_cr_monthly_limit_value").val(),
		"poid":$("#customer_poid").val(),
		"account_poid":$("#customer_poid").val()
	};
	$.ajax({
		url:"index.php?r=accountmanag/modifytranslimit",
		data:trans_adj_limit,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == "0"){
				var data_array = data.data_array;
				var last_value = data_array.pop();
				console.log(last_value);
				$(".monthly_limit").html(last_value.monthly_trans_limit);
				bootbox_alert("Modify Credit Limit Status",data.descr);
				$("#monthly_transaction_limit").modal("hide");
			}else if(data.status == "1"){
				bootbox_alert("Modify Credit Limit Status",data.respxml);
			}
		}
	});
});

$(document).on("click","#csr_edit_geo_access",function(){
	access_back_button_flag = "0";
	org_access_click_flag = "0";
	$("#geo_access_model").modal("show");
});

$(document).on("blur","#access_area_pincode",function(){
	var pincode_value = $(this).val();
	if(pincode_value =="" || pincode_value.length <= 5){
		bootbox_alert("Modify Geo Access Status","Should Enter A Valid Pincode");
	}else{
		showareas(pincode_value);
	}
});

$(document).on("blur","#access_location_pincode",function(){
	var pincode_value = $(this).val();
	if(pincode_value =="" || pincode_value.length <= 5){
		bootbox_alert("Modify Geo Access Status","Should Enter A Valid Pincode");
	}else{
		showareas(pincode_value);
	}
});

function showareas(pincode_value){
	$.ajax({
			url:"index.php?r=accountmanag/getarealist",
			data:{"pincode":pincode_value},
			type:"post",
			success:function(d,s){
				var data = JSON.parse(d);
				if(data.length < 1){
					bootbox_alert("Modify Geo Access Status","Area Not Available");
				}else{
					var option_html = "<option area_id='' value=''> --Select Area-- </option>";
					//var option_html = "";
					$.each(data,function(b,c){
						option_html += "<option area_id='"+c.area_id+"' value='"+c.area_name+"'>"+c.area_name+"</option>";
					});
					$(".access_area_value_list").html(option_html);
				}
			}
		});
}

$("#lcoation_access_value").on("change",function(){
	var location_access_value = $("#lcoation_access_value option:selected").attr("area_id");
	if(location_access_value != ''){
		$.ajax({
			url:"index.php?r=accountmanag/getlocationlist",
			data:{"areaid":location_access_value},
			type:"post",
			success:function(d,s){
				var data = JSON.parse(d);
				if(data.length < 1){
					bootbox_alert("Modify Geo Access Status","Location Not Available");
				}else{
					//var option_html = "<option value=''> --Select Area-- </option>";
					var option_html = "";
					$.each(data,function(b,c){
						option_html += "<option value='"+c.location_name+"'>"+c.location_name+"</option>";
					});
					$("#location_access_list").html(option_html);
				}
			}
		});
	}
	
});

$("#acc_type_value").on("change",function(){
	access_type = $("#acc_type_value option:selected").val();
	if(access_type =="0"){
		$("#state_values").addClass("hide");
		$("#city_values").addClass("hide");
		$("#area_values").addClass("hide");
		$("#location_values").addClass("hide");
	}else if(access_type == "1"){
		$("#state_values").removeClass("hide");
		$("#city_values").addClass("hide");
		$("#area_values").addClass("hide");
		$("#location_values").addClass("hide");
	}else if(access_type == "2"){
		$("#state_values").addClass("hide");
		$("#city_values").removeClass("hide");
		$("#area_values").addClass("hide");
		$("#location_values").addClass("hide");
	}else if(access_type == "3"){
		$("#state_values").addClass("hide");
		$("#city_values").addClass("hide");
		$("#area_values").removeClass("hide");
		$("#location_values").addClass("hide");
	}else if(access_type == "4"){
		$("#state_values").addClass("hide");
		$("#city_values").addClass("hide");
		$("#area_values").addClass("hide");
		$("#location_values").removeClass("hide");
	}
});

$("#geo_access_submit").on("click",function(){
	var available_geo_access = $("#assignedgeolist").jqGrid('getGridParam', 'data');
	if($("#buser_accesslevel").val() == ""){
		bootbox_alert(headeralert,"Need To Select Data Access");
		return false;
	}
	if(available_geo_access.length <= 0 && $("#buser_accesslevel").val() != "global" ){
		bootbox_alert(headeralert,"Need To Select Data Access");
		return false;
	}else{
		$('#geo_access_model').modal("hide");
		$("#org_access_model").modal("show");
		if($("#unit_account_type").val() != '' && $("#unit_account_type").val() != 0){
			$("#unit_account_type").trigger("change");
		}
	}
	/*var access_values = [];
	var access_data = {};
  if(access_type != ""){
	if(access_type == "2"){
		$("#access_city_list option:selected").each(function(){
			//access_values.push($(this).text());
			access_data = {
				"access_value":$(this).text()
			};
			access_values.push(access_data);
		});
		console.log(access_values);
	}else if(access_type == "1"){
		$("#access_state_list option:selected").each(function(){
			access_data = {
				"access_value":$(this).text()
			};
			access_values.push(access_data);
		});
	}else if(access_type == "3"){
		$("#access_city_list option:selected").each(function(){
			access_data = {
				"access_value":$(this).text()
			};
			access_values.push(access_data);
		});
	}else if(access_type == "4"){
		$("#access_area_value option:selected").each(function(){
			access_data = {
				"access_value":$(this).text()
			};
			access_values.push(access_data);
		});
	}
	
	var geo_access_data = {
		"geo_access_level":access_type,
		"access_list":access_values,
		"account_obj":$("#customer_poid").val(),
		"poid":$("#customer_poid").val(),
		"profile_obj":$("#access_profile_obj").val()
	};
	$.ajax({
		url:"index.php?r=accountmanag/modifygeoaccess",
		data:geo_access_data,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == "1"){
				bootbox_alert("Modify Geo Access Status",data.respxml);
			}else{
				bootbox_refresh("Modify Geo Access Status",data.descr);
			}
		}
	});
  }else{
	  bootbox_alert("Modify Geo Access Status","Access Type Need To Be Select");
  } */
});

$(document).on("click","#csr_edit_org_access",function(){
		org_access_click_flag = "1";
		$("#org_access_model").modal("show");
	});

$("#org_access_list").on("change",function(){
	access_value_array = [];
	org_access_value = $(this).val();
	var business_type = $("#org_access_list option:selected").attr("business_type");
	if(org_access_value != "0"){
		$("#org_access_values").removeClass("hide");
		$(".geo_access_list").each(function() {
			var spliter = $(this).html().split(':');
			access_value_array.push("'"+spliter[1].trim()+"'");
		});
		var org_access_data = {
			"geo_access_level":$("#geo_access_level_value").val(),
			"geo_access_list":access_value_array,
			"org_access_level":business_type
		};
                var availableTags=[];
                var person = [];
		$.ajax({
			url:"index.php?r=accountmanag/getorgaccesslist",
			data:org_access_data,
			type:"post",
			success:function(d,s){
				var data = JSON.parse(d);
				if(data.length < 1){
					bootbox_alert("Modify Org Access Status","Accounts Not Available");
				}else{
					var option_html = "<option value=''>--Select Account--</option>";
					$.each(data,function(b,c){
						option_html += "<option value='"+c.poid+"'>"+c.user_id+"</option>";
                                               
                                                person["'"+c.poid+"'"] = c.user_id;
                                                
                                               availableTags.push(c.user_id);
					});
					$("#org_access_values_list").html(option_html);
                                    
      
//    function split( val ) {
//      return val.split( /,\s*/ );
//    }
//    function extractLast( term ) {
//      return split( term ).pop();
//    }
// 
//    $( "#org_access_values_list_cv" )
//      // don't navigate away from the field on tab when selecting an item
//      .bind( "keydown", function( event ) {
//        if ( event.keyCode === $.ui.keyCode.TAB &&
//            $( this ).autocomplete( "instance" ).menu.active ) {
//          event.preventDefault();
//        }
//      })
//      .autocomplete({
//        minLength: 0,
//        source: function( request, response ) {
//          // delegate back to autocomplete, but extract the last term
//          response( $.ui.autocomplete.filter(
//            availableTags, extractLast( request.term ) ) );
//        },
//        focus: function() {
//          // prevent value inserted on focus
//          return false;
//        },
//        select: function( event, ui ) {
//          var terms = split( this.value );
//          // remove the current input
//          terms.pop();
//          // add the selected item
//          terms.push( ui.item.value );
//          // add placeholder to get the comma-and-space at the end
//          terms.push( "" );
//          this.value = terms.join( ", " );
//          return false;
//        }
//      });
				}
			}
		});
		console.log(access_value_array);
	}else{
		$("#org_access_values").addClass("hide");
	}
});

$("#org_access_submit").on("click",function(){
	var access_values = [];
	var access_data = {};
	if(org_access_value != ""){
	if(org_access_value != "0"){
	$("#org_access_values_list option:selected").each(function(){
			access_data = {
				"access_value":$(this).val()
			};
			access_values.push(access_data);
		});
	}
	var org_access_data = {
		"org_access_level":org_access_value,
		"access_list":access_values,
		"account_obj":$("#customer_poid").val(),
		"poid":$("#customer_poid").val(),
		"profile_obj":$("#access_profile_obj").val()
	};
	$.ajax({
		url:"index.php?r=accountmanag/modifyorgaccess",
		data:org_access_data,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == "1"){
				bootbox_alert("Modify Geo Access Status",data.respxml);
			}else{
				bootbox_refresh("Modify Geo Access Status",data.descr);
			}
		}
	});
	}else{
		bootbox_alert("Modify Geo Access Status","Access Type Need To Be Select");
	}
});

$(document).on("click",".business_unit_edit_tax",function(){
	var tax_edit_id = $(this).attr("id");
	
	if(tax_edit_id == "business_unit_edit_st"){
		$(".taxer_edit_model").html("Service Tax Number");
		$("#tax_type").html("Service Tax Number");
		$("#edit_tax_number").attr("placeholder","Service Tax Number");
		$("#edit_tax_number").attr("json_attr","service_tax_number");
		$("#edit_tax_number").val("");
	}else if(tax_edit_id == "business_unit_edit_vat"){
		$(".taxer_edit_model").html("VAT Number");
		$("#tax_type").html("VAT Number");
		$("#edit_tax_number").attr("placeholder","VAT Number");
		$("#edit_tax_number").attr("json_attr","vat_number");
		$("#edit_tax_number").val("");
	}else if(tax_edit_id == "business_unit_edit_et"){
		$(".taxer_edit_model").html("ET Number");
		$("#tax_type").html("ET Number");
		$("#edit_tax_number").attr("placeholder","ET Number");
		$("#edit_tax_number").attr("json_attr","et_number");
		$("#edit_tax_number").val("");
	}else if(tax_edit_id == "business_unit_edit_pan"){
		$(".taxer_edit_model").html("PAN Number");
		$("#tax_type").html("PAN Number");
		$("#edit_tax_number").attr("placeholder","PAN Number");
		$("#edit_tax_number").attr("json_attr","pan_number");
		$("#edit_tax_number").val("");
	}
	$("#tax_edit_model").modal("show");
});


$("#edit_tax_submit").on("click",function(){
	if($("#edit_tax_number").attr("json_attr") == "pan_number"){
		var tax_edit_details = {
			"poid":$("#customer_poid").val(),
			"profile_obj":$("#access_profile_obj").val(),
			"action_mode":"99",
			"pan_no":$("#edit_tax_number").val()
		};
	}else if($("#edit_tax_number").attr("json_attr") == "et_number"){
		var tax_edit_details = {
			"poid":$("#customer_poid").val(),
			"profile_obj":$("#access_profile_obj").val(),
			"action_mode":"99",
			"et_no":$("#edit_tax_number").val()
		};
	}else if($("#edit_tax_number").attr("json_attr") == "vat_number"){
		var tax_edit_details = {
			"poid":$("#customer_poid").val(),
			"profile_obj":$("#access_profile_obj").val(),
			"action_mode":"99",
			"vat_no":$("#edit_tax_number").val()
		};
	}else if($("#edit_tax_number").attr("json_attr") == "service_tax_number"){
		var tax_edit_details = {
			"poid":$("#customer_poid").val(),
			"profile_obj":$("#access_profile_obj").val(),
			"action_mode":"99",
			"st_no":$("#edit_tax_number").val()
		};
	}
	$.ajax({
		url:"index.php?r=accountmanag/modifytaxdetails",
		data:tax_edit_details,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == "0"){
				var data_array = data.data_array;
				var modified_output = data_array.pop();
				if(modified_output.wholesale_info.st_no){
					$("#summary_service_tax_number").html(modified_output.wholesale_info.st_no);
				}else if(modified_output.wholesale_info.et_no){
					$("#summary_et_tax_number").html(modified_output.wholesale_info.et_no);
				}else if(modified_output.wholesale_info.vat_no){
					$("#summary_vat_tax_number").html(modified_output.wholesale_info.vat_no);
				}else if(modified_output.wholesale_info.pan_no){
					$("#summary_pan_number").html(modified_output.wholesale_info.pan_no);
				}
				$("#tax_edit_model").modal("hide");
				bootbox_alert("Modify Tax Number Details",data.descr);
			}else if(data.status == "1"){
				bootbox_alert("Modify Tax Number Details",data.respxml);
			}
		}
	});
});

$(document).on("click",".edit_commission_service_model",function(){
	edit_id = $(this).attr("id");
	if(edit_id == "edit_commission_model"){
		$("#commission_details_edit_model").html("Edit Commission Model");
		$("#commission_details_type").html("Commission Model");
		var select_html = "<select id='commission_selected_value' class='col-xs-6 col-sm-6 col-md-6 col-lg-6'>";
			select_html += "<option value='1'>Prepaid Gross Billing</option>";
			select_html	+= "<option value='2'>Prepaid Net Billing</option>";
			select_html += "<option value='3'>Postpaid Gross Billing</option>";
			select_html	+= "<option value='4'>Postpaid Net Billing</option>";
			select_html	+= "<option value='5'>Postpaid BB Commision</option>";
			select_html += "<option value='0'>N/A</option>";
			select_html += "</select>";
		$("#commission_details_select_box").html(select_html);
	}else if(edit_id == "edit_commission_service"){
		$("#commission_details_edit_model").html("Edit Commission Service");
		$("#commission_details_type").html("Commission Service");
		var select_html = "<select id='commission_selected_value' class='col-xs-6 col-sm-6 col-md-6 col-lg-6'>";
			select_html += "<option value='1'>CATV</option>";
			select_html	+= "<option value='2'>Broad Band</option>";
			select_html += "<option value='0'>N/A</option>";
			select_html += "</select>";
		$("#commission_details_select_box").html(select_html);
	}
	$("#commission_edit_model").modal("show");
});

$("#edit_commission_details_submit").on("click",function(){
	if(edit_id == "edit_commission_model"){
		var tax_edit_details = {
			"poid":$("#customer_poid").val(),
			"profile_obj":$("#access_profile_obj").val(),
			"action_mode":"99",
			"commission_model":$("#commission_selected_value").val()
		};
	}else if(edit_id == "edit_commission_service"){
		var tax_edit_details = {
			"poid":$("#customer_poid").val(),
			"profile_obj":$("#access_profile_obj").val(),
			"action_mode":"99",
			"commission_service":$("#commission_selected_value").val()
		};
	}
	$.ajax({
		url:"index.php?r=accountmanag/modifycommissiondetails",
		data:tax_edit_details,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == "0"){
				var data_array = data.data_array;
				var modified_output = data_array.pop();
				if(modified_output.wholesale_info.commission_service){
					var commission_value = modified_output.wholesale_info.commission_service;
					if(commission_value == "1"){
						$("#summary_commission_service").html("CATV");
						$("#add_aggrement").removeClass("hide");
					}else if(commission_value == "2"){
						$("#summary_commission_service").html("Broad Band");
						$("#add_aggrement").removeClass("hide");
					}else if(commission_value == "0"){
						$("#add_aggrement").addClass("hide");
						$("#summary_commission_service").html("Not Applicable");
					}
				}else if(modified_output.wholesale_info.commission_model){
					var commission_value = modified_output.wholesale_info.commission_model;
					if(commission_value == "1"){
						$("#summary_commission_model").html("Prepaid Gross Billing");
						$("#add_aggrement").removeClass("hide");
					}else if(commission_value == "2"){
						$("#summary_commission_model").html("Prepaid Net Billing");
						$("#add_aggrement").removeClass("hide");
					}else if(commission_value == "3"){
						$("#summary_commission_model").html("Postpaid Gross Billing");
						$("#add_aggrement").removeClass("hide");
					}else if(commission_value == "4"){
						$("#summary_commission_model").html("Postpaid Net Billing");
						$("#add_aggrement").removeClass("hide");
					}else if(commission_value == "5"){
						$("#summary_commission_model").html("Postpaid BB Commision");
						$("#add_aggrement").removeClass("hide");
					}else if(commission_value == "0"){
						$("#summary_commission_model").html("Not Applicable");
						$("#add_aggrement").addClass("hide");
					}
				}
				$("#commission_edit_model").modal("hide");
				bootbox_alert("Modify Commission Details",data.descr);
			}else if(data.status == "1"){
				bootbox_alert("Modify Commission Details",data.respxml);
			}
		}
	});
});


//***************************************************Geo Access Details ********************************************
function loadaccesslist(){
	$("#geo_access_model").modal("show");
	$("#availablegeolist").jqGrid({
	colNames: ["Access List","Access ID","ID"],
	colModel: [
		{name: "access_list"},
		{name: "access_id",hidden:true},
        {name: "id",hidden:true}
		
	],
	jsonReader: {
		repeatitems: false
	},
    datatype: "local",
	multiselect:true,
	autowidth: true,
	ignoreCase: true,
    caption: "",
    gridview: true,
    rowNum: 10000,
	sortname: "access_list",
    sortorder: "asc",
	viewrecords: true,
	autoencode: false,
	loadComplete: function() {
		var table = this;
        setTimeout(function() 
        {
			updatePagerIcons(table);
			$(window).trigger("resize.jqGrid4");	
		}, 0);
		
    }
});

$("#assignedgeolist").jqGrid({
    datatype: "local",
    multiselect: true,
    autowidth: true,
    gridview: true,
    rowNum: 10000,
    viewrecords: true,
	ignoreCase: true,
    autoencode: false,
    colNames: ["Access List","Access ID","ID"],
    colModel: [
        {name: "access_list"},
		{name: "access_id",hidden:true},
		{name: "id",hidden:true}
      
    ],
    caption: ""
});

jQuery("#availablegeolist").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
jQuery("#assignedgeolist").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});

}







function MoveAllGeoAccess() {
    var srcgrid = $("#availablegeolist");
    var dstgrid = $("#assignedgeolist");
    var allRowsInGrid = srcgrid.jqGrid('getGridParam', 'data');
    if (allRowsInGrid.length == 0) {
        bootbox_alert(headeralert, "Atleast One Access should be there!");
        return false;
    }else if(allRowsInGrid.length > 500){ 
		bootbox_alert(headeralert, "Access List Cannot More Than 500");
		return false;
	}

    allRowsInGrid.sort();
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(dstgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }
    $(srcgrid).jqGrid('clearGridData').trigger("reloadGrid");

}

function removeAllGeoAccess() {
	$("#assignedorglist").jqGrid('clearGridData').trigger("reloadGrid");
	$("#selecteditems").html("");
   var srcgrid = $("#availablegeolist");
    var dstgrid = $("#assignedgeolist");
    var allRowsInGrid = dstgrid.jqGrid('getGridParam', 'data');
    if (allRowsInGrid.length == 0) {
        bootbox_alert(headeralert, "Atleast One Access should be there!")
        return;
    }

    allRowsInGrid.sort();
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(srcgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }
    $(dstgrid).jqGrid('clearGridData').trigger("reloadGrid");
}

function moveSelectedGeoAccess() {
    var srcgrid = $("#availablegeolist");
    var dstgrid = $("#assignedgeolist");
    var allRowsInGrid = dstgrid.jqGrid('getGridParam', 'data');
    var selectArr = [];
    selectArr = jQuery("#availablegeolist").jqGrid('getGridParam', 'selarrrow');
    if (selectArr.length == 0) {
        bootbox_alert(headeralert, "Atleast One Access should be selected!");
        return false;
    }else if(selectArr.length > 500) {
		bootbox_alert(headeralert, "Access List Cannot More Than 500");
        return false;
	}

    var parentArr = [];
    for (var rows = 0; rows < selectArr.length; rows++) {
        parentArr[rows] = $("#availablegeolist").jqGrid('getRowData', selectArr[rows]);
    }

    for (var rows = 0; rows < selectArr.length; rows++) {
        var rd = parentArr[rows];
        allRowsInGrid.push(rd);
        allRowsInGrid.sort();
    }

    $(dstgrid).jqGrid('clearGridData').trigger("reloadGrid");
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(dstgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }

    $(dstgrid).trigger("reloadGrid");

    $.each(selectArr, function() {
        $(srcgrid).delRowData(this);
    });
    $(srcgrid).trigger("reloadGrid");
}

function removeSelectedGeoAccess() {
	$("#assignedorglist").jqGrid('clearGridData').trigger("reloadGrid");
	$("#selecteditems").html("");
    var srcgrid = $("#availablegeolist");
    var dstgrid = $("#assignedgeolist");
    var allRowsInGrid = srcgrid.jqGrid('getGridParam', 'data');
    var selectArr = [];
    selectArr = jQuery("#assignedgeolist").jqGrid('getGridParam', 'selarrrow');
    if (selectArr.length == 0) {
        bootbox_alert(headeralert, "Atleast One Access should be selected!")
        return;
    }
    var parentArr = [];
    for (var rows = 0; rows < selectArr.length; rows++) {
        parentArr[rows] = $("#assignedgeolist").jqGrid('getRowData', selectArr[rows]);
    }

    for (var rows = 0; rows < selectArr.length; rows++) {
        var rd = parentArr[rows];
        allRowsInGrid.push(rd);
        allRowsInGrid.sort();
    }

    $(srcgrid).jqGrid('clearGridData').trigger("reloadGrid");
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(srcgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }

    $(srcgrid).trigger("reloadGrid");
    $.each(selectArr, function() {
        $(dstgrid).delRowData(this);
    });
    $(dstgrid).trigger("reloadGrid");
}

$(window).on('resize.jqGrid4', function() {
	//alert($(".panelhead").width());
    //$(grid_selector2).jqGrid('setGridWidth', $(".panelhead").width());
    $("#availablegeolist").jqGrid('setGridWidth', $("#available_geoaccess_grid").width());
    $("#assignedgeolist").jqGrid('setGridWidth', $("#available_geoaccess_grid").width());
});
var parent_column = $("#availablegeolist").closest('[class*="col-"]');
$(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
	if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
		setTimeout(function() {
            //$(grid_selector2).jqGrid('setGridWidth', parent_column.width());
            $("#availablegeolist").jqGrid('setGridWidth', $("#available_geoaccess_grid").width());
            $("#assignedgeolist").jqGrid('setGridWidth', $("#available_geoaccess_grid").width());
		}, 0);
	}
});
$(window).trigger("resize.jqGrid4");	
$('#geo_access_model').on('shown.bs.modal', function(e) {
	geo_access_level_value = "";
	geo_accessed_list = [];
	$(window).trigger("resize.jqGrid4");
	loadaccesslist();
	if(access_back_button_flag != "1"){
	$(".geo_access_list").each(function(){
		var splitter = $(this).text().split(':');;
		geo_accessed_list.push("'"+splitter[1].trim().toUpperCase()+"'");
	});
	$.ajax({
		url:"index.php?r=accountmanag/getaccessedlist",
		data:{"geo_access":geo_accessed_list,"access_level":$("#geo_access_level_value").val()},
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			
			saved_geo_values = [];
			if($("#geo_access_level_value").val() == "4"){
				$(data).each(function(b,c){
					var grid_value = {
						"access_id":c.location_id,
						"access_list":c.location_name
					};
					saved_geo_values.push(grid_value);
				});
					var last_data_value = data.pop();
					last_selected_access_state_id = last_data_value.state_name;
					last_selected_access_city_id = last_data_value.city_id;  // This values has triggering capacity
					last_selected_access_area_id = last_data_value.area_id;
			}else if($("#geo_access_level_value").val() == "3"){
				$(data).each(function(b,c){
					var grid_value = {
						"access_id":c.area_id,
						"access_list":c.area_name
					};
					saved_geo_values.push(grid_value);
				});
					var last_data_value = data.pop();
					last_selected_access_state_id = last_data_value.state_name;
					last_selected_access_city_id = last_data_value.city_id;  // This values has triggering capacity
					//last_selected_access_area_id = last_data_value.area_id;
			}else if($("#geo_access_level_value").val() == "2"){
				$(data).each(function(b,c){
					var grid_value = {
						"access_id":c.city_id,
						"access_list":c.city_name
					};
					saved_geo_values.push(grid_value);
				});
					var last_data_value = data.pop();
					console.log(last_data_value);
					last_selected_access_state_id = last_data_value.state_name;
					//last_selected_access_city_id = last_data_value.city_id;  // This values has triggering capacity
			}else if($("#geo_access_level_value").val() == "1"){
				$(data).each(function(b,c){
					var grid_value = {
						"access_id":c.state_id,
						"access_list":c.state_name
					};
					saved_geo_values.push(grid_value);
				});
					//var last_data_value = data.pop();
					//last_selected_access_state_id = last_data_value.state_name;
					//last_selected_access_city_id = last_data_value.city_id;  // This values has triggering capacity
			}
			console.log(saved_geo_values);
		},complete:function(){
			var access_data = "";
			if($("#geo_access_level_value").val() == "0"){
					access_data = "global";
			}else if($("#geo_access_level_value").val() == "1"){
					access_data = "state";
			}else if($("#geo_access_level_value").val() == "2"){
					access_data = "city";
			}else if($("#geo_access_level_value").val() == "3"){
					access_data = "area";
			}else if($("#geo_access_level_value").val() == "4"){
					access_data = "location";
			}
			if(access_data != ''){
				$("#buser_accesslevel").val(access_data);
				$("#buser_accesslevel").trigger("change");
			} 
		}
	});
	}	
});

$("#list_of_geo_state").on("change",function(){
	var available_geo_access = $("#assignedgeolist").jqGrid('getGridParam', 'data');
	last_selected_access_state_id = $(this).val();
	$.ajax({
		url:"index.php?r=userregistration/getaccesscity",
		data:{"state_id":$('option:selected', this).attr('date-stateid')},
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			access_array = [];
			var html = "<option value=''>--Select City--</option>";
			$("#availablegeolist").jqGrid('clearGridData').trigger("reloadGrid");
				//var dd = data[i];
			if(acc == "area" || acc =="location"){
			for (var gc = 0; gc < data.length; gc++) {	
					html += "<option value='" + data[gc].access_id + "'>" + data[gc].access_list + "</option>";
				}
				$("#list_of_geo_cities").html(html);
			}else{	
				var available_geo_id_array = [];
				for(var gac = 0;gac < available_geo_access.length;gac++){
					available_geo_id_array.push(available_geo_access[gac].access_id);
				}
				for (var gc = 0; gc < data.length; gc++) {
					if(available_geo_id_array.indexOf(data[gc].access_id) == -1){
						$("#availablegeolist").jqGrid("addRowData", data[gc]["id"], data[gc]);
					}
				}
			}
		},complete:function(){
			if(geo_access_level_value >= "3"){	
				if(saved_geo_values.length > 0 && geo_access_level_value == "3"){
					for (var gc = 0; gc < saved_geo_values.length; gc++) {
						$("#assignedgeolist").jqGrid("addRowData", saved_geo_values[gc]["id"], saved_geo_values[gc]);
					}
				}
				if(last_selected_access_city_id != ""){
					$("#list_of_geo_cities").val(last_selected_access_city_id);
					$("#list_of_geo_cities").trigger("change");
				}
			}
			
			
		}
	});
});

$("#list_of_geo_cities").on("change",function(){
	var available_geo_access = $("#assignedgeolist").jqGrid('getGridParam', 'data');
	last_selected_access_city_id = $(this).val();
	var geo_master_service_type = $(".geo_master_service_type option:selected").attr("geo_service");
	if(geo_master_service_type !="" && geo_master_service_type != undefined)
	$.ajax({
		url:"index.php?r=userregistration/getaccessarealist",
		data:{"city_id":$('option:selected', this).val(),"geo_service_type":geo_master_service_type},
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			console.log(data);
			if(acc == "location"){
				var html = "<option value=''>--Select Area--</option>";
				for (var gc = 0; gc < data.length; gc++) {
					html += "<option value='"+data[gc].access_id+"'>"+data[gc].access_list+"</option>";
				}
				$("#list_of_geo_location").html(html);
			}else{
				var available_geo_id_array = [];
				for(var gac = 0;gac < available_geo_access.length;gac++){
					available_geo_id_array.push(available_geo_access[gac].access_id);
				}
				$("#availablegeolist").jqGrid('clearGridData').trigger("reloadGrid");
				for (var gc = 0; gc < data.length; gc++) {
					if(available_geo_id_array.indexOf(data[gc].access_id) == -1){
						$("#availablegeolist").jqGrid("addRowData", data[gc]["id"], data[gc]);
					}
				}
			}
		},complete:function(){
			if(geo_access_level_value >= "4"){	
				if(saved_geo_values.length > 0 && geo_access_level_value == "4" ){
					for (var gc = 0; gc < saved_geo_values.length; gc++) {
						$("#assignedgeolist").jqGrid("addRowData", saved_geo_values[gc]["id"], saved_geo_values[gc]);
					}
				}
				if(last_selected_access_area_id != ""){
					$("#list_of_geo_location").val(last_selected_access_area_id);
					$("#list_of_geo_location").trigger("change");
				}
			}
			
		}
	});
});

$("#list_of_geo_location").on("change",function(){
	
	var available_geo_access = $("#assignedgeolist").jqGrid('getGridParam', 'data');
	console.log(available_geo_access);
	last_selected_access_area_id = $(this).val();
	var geo_master_service_type = $(".geo_master_service_type option:selected").attr("geo_service");
	if(geo_master_service_type !="" && geo_master_service_type != undefined)
	$.ajax({
		url:"index.php?r=userregistration/getaccesslocationlist",
		data:{"area_id":$('option:selected', this).val(),"geo_service_type":geo_master_service_type},
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
				var available_geo_id_array = [];
				for(var gac = 0;gac < available_geo_access.length;gac++){
					available_geo_id_array.push(available_geo_access[gac].access_id);
				}
				$("#availablegeolist").jqGrid('clearGridData').trigger("reloadGrid");
				for (var gc = 0; gc < data.length; gc++) {
					if(available_geo_id_array.indexOf(data[gc].access_id) == -1){
						$("#availablegeolist").jqGrid("addRowData", data[gc]["id"], data[gc]);
					}
				}
			
		}
	});
});

function onaccessLevelFill() {
		acc = $("#buser_accesslevel").val();		
		//alert(acc);
		if(geo_access_level_value != ""){
			saved_geo_values = [];
		}
		geo_access_level_value = $("#buser_accesslevel option:selected").attr("access_value");		
		$("#availablegeolist").jqGrid('clearGridData').trigger("reloadGrid");
		$("#assignedgeolist").jqGrid('clearGridData').trigger("reloadGrid");
		//$("#assignedorglist").jqGrid('clearGridData').trigger("reloadGrid");
		if(acc != "global" && acc != ""){
		
		if (acc == 'city' || acc == 'area' || acc == 'location') {
			$(".access_state_geo").removeClass('hide');
			if(acc == 'city'){
				$(".access_cities_geo").addClass('hide');
				$(".access_area_geo").addClass('hide');
			}else if(acc == 'area'){
				$(".access_cities_geo").removeClass('hide');
				$(".access_area_geo").addClass('hide');
			}else if(acc == 'location') {
				$(".access_cities_geo").removeClass('hide');
				$(".access_area_geo").removeClass('hide');
			}
			$("#arealocation").addClass('hide');
			$.ajax({
				type: "post",
				url: "index.php?r=accountmanag/accessLevelDetailsState",
				data: {"data": acc},
				success: function(d) {
					var data = $.parseJSON(d);
					console.log(data);
					var html  = "";
					html += "<option value=''>--Select State--</option>";
					for (i = 0; i < data.length; i++) {
						var dd = data[i];
						html += "<option date-stateid='" + dd.state_id + "' value='" + dd.state + "'>" + dd.state + "</option>";
					//	html += "<option date-stateid='" + dd.state_id + "' data-state_name='" + dd.state + "' data-city_code='" + dd.city_code + "' value='" + dd.city + "'>" + dd.city + "</option>";
					}
					//$("#listaccess").removeClass('hide');
					$("#list_of_geo_state").html(html);
				},complete:function(){
					if(geo_access_level_value >= "2"){	
						if(saved_geo_values.length > 0 && geo_access_level_value == "2" ){
							for (var gc = 0; gc < saved_geo_values.length; gc++) {
								$("#assignedgeolist").jqGrid("addRowData", saved_geo_values[gc]["id"], saved_geo_values[gc]);
							}
						}
						if(last_selected_access_state_id != ""){
							console.log(last_selected_access_state_id);
							$("#list_of_geo_state").val(last_selected_access_state_id);
							$("#list_of_geo_state").trigger("change");
						}
					}
					
				}
			});
		} else if (acc == 'state') {
			$(".access_cities_geo").addClass('hide');
			$(".access_area_geo").addClass('hide');
			$(".access_state_geo").addClass('hide');
			$("#arealocation").addClass('hide');
			if(geo_access_level_value == "1"){	
				for (var gc = 0; gc < saved_geo_values.length; gc++) {
					$("#assignedgeolist").jqGrid("addRowData", saved_geo_values[gc]["id"], saved_geo_values[gc]);
				}
			}
			var available_geo_access = $("#assignedgeolist").jqGrid('getGridParam', 'data');
			var available_geo_id_array = [];
			for(var gac = 0;gac < available_geo_access.length;gac++){
				available_geo_id_array.push(available_geo_access[gac].access_id);
			}
		
			$.ajax({
				type: "post",
				url: "index.php?r=accountmanag/accessLevelDetailsState",
				data: {"data": acc},
				success: function(d) {
					var data = $.parseJSON(d);
					access_array = [];
					var html = "";
					for (i = 0; i < data.length; i++) {
						var dd = data[i];
						if(available_geo_id_array.indexOf(dd.access_id) == -1){
							var access_value = {
								"access_list":dd.state,
								"access_id":dd.state_id
							};
							access_array.push(access_value);
						//html += "<option date-stateid='" + dd.state_id + "' value='" + dd.state + "'>" + dd.state + "</option>";
						}
					}
					$("#availablegeolist").jqGrid('clearGridData').trigger("reloadGrid");
					for (var gc = 0;gc < access_array.length;gc++){
						$("#availablegeolist").jqGrid("addRowData", access_array[gc]["id"], access_array[gc]);
					}
					//$("#listaccess").removeClass('hide');
					$("#listofaccess").html(html);
				}
			});
		}
	} else if (acc == 'global') {
			$(".access_cities_geo").addClass('hide');
			$(".access_area_geo").addClass('hide');
			$(".access_state_geo").addClass('hide');
			$("#arealocation").addClass('hide');
		}
  }


function getorgaccesslist(){
	$("#availableorglist").jqGrid('clearGridData').trigger("reloadGrid");
	$("#assignedorglist").jqGrid('clearGridData').trigger("reloadGrid");
	var data_accessed_list = [];
	//if(org_accessed_list.length > 0 && org_access_level_flag == "" && org_access_click_flag == "1"){
//	if(org_accessed_list.length > 0){
//		for (var gc = 0; gc < org_accessed_list.length; gc++) {
//			$("#assignedorglist").jqGrid("addRowData", org_accessed_list[gc]["id"], org_accessed_list[gc]);
//		}
//	}
	var org_level = org_access_level_flag = $("option:selected","#unit_account_type").val();
	var Access_level = "";
//	var available_org_access_list = $("#assignedorglist").jqGrid('getGridParam','data');
	var geo_service_type = $(".geo_master_service_type option:selected").attr("geo_service");
	if((org_level != "0" && org_level != '')&& (geo_service_type != '' && geo_service_type != undefined)){
	if(org_access_click_flag != "1"){
		var allRowsAccessList = $("#assignedgeolist").jqGrid('getGridParam', 'data');
		Access_level = $("option:selected","#buser_accesslevel").val();
		$.each(allRowsAccessList,function(b,c){
			data_accessed_list.push("'"+c.access_list.toUpperCase()+"'");
		});
	}else{
//		org_level = $("option:selected","#unit_account_type").val();
		if($("#geo_access_level_value").val() == "0"){
			Access_level = "global";
		}else if($("#geo_access_level_value").val() == "1"){
			Access_level = "state";
		}else if($("#geo_access_level_value").val() == "2"){
			Access_level = "city";
		}else if($("#geo_access_level_value").val() == "3"){
			Access_level = "area";
		}else if($("#geo_access_level_value").val() == "4"){
			Access_level = "location";
		}
		$(".geo_access_list").each(function() {
			var spliter = $(this).html().split(':');
			data_accessed_list.push("'"+spliter[1].trim().toUpperCase()+"'");
		});
	}
		var org_access_value = {
			"data_access_level": Access_level,
			"data_access_value": data_accessed_list,
			"org_access_level":org_level,
			"geo_service_type":geo_service_type
		};
		$.ajax({
			url:"index.php?r=userregistration/getorgaccessvalue",
			data:org_access_value,
			type:"post",
			success:function(d,s){
				var data = JSON.parse(d);
				
				if(data.status == "1"){
					bootbox_alert(headeralert,"No Records Found");
				}else{
					var org_values = data.rows;
					var available_org_id_array = [];
					var assigned_org_id_array = [];
						var final_assigned_org_array = [];
//					for(var gac = 0;gac < available_org_access_list.length;gac++){
//						available_org_id_array.push(available_org_access_list[gac].user_id);
//					}
					for(var gac = 0;gac < org_values.length;gac++){
						available_org_id_array.push(org_values[gac].user_id);
					}
						var org_accessed_list_length = org_accessed_list.length;
						for(var gac = 0;gac < org_accessed_list_length;gac++){
								if(available_org_id_array.indexOf(org_accessed_list[gac].user_id) != -1){
									final_assigned_org_array.push(org_accessed_list[gac]);
						}
					}
					}
						for(var gac = 0;gac < final_assigned_org_array.length;gac++){
							assigned_org_id_array.push(final_assigned_org_array[gac].user_id);
					}
						for(var gac = 0;gac < final_assigned_org_array.length;gac++){
							$("#assignedorglist").jqGrid("addRowData", final_assigned_org_array[gac]["id"], final_assigned_org_array[gac]);
						}
						if(assigned_org_id_array.length > 0){
					for (var gc = 0; gc < org_values.length; gc++) {
						if(assigned_org_id_array.indexOf(org_values[gc].user_id) == -1){
							$("#availableorglist").jqGrid("addRowData", org_values[gc]["id"], org_values[gc]);
						}
							}
						}else{
							for (var gc = 0; gc < org_values.length; gc++) {
								$("#availableorglist").jqGrid("addRowData", org_values[gc]["id"], org_values[gc]);
					}
				}
			}
		});
	}
}

function loadorgaccesslist(){
	var data_access_level = $("#buser_accesslevel").val();
	var available_geo_access = $("#assignedgeolist").jqGrid('getGridParam','data');
	if(org_access_click_flag != "1"){
		if(data_access_level != "global" && available_geo_access.length <= 0){
				$("#org_access_model").modal("hide");
				bootbox_alert(headeralert,"Data Accesss Need To Valid");
				return false;
		//	}
		}
	}
	$("#availableorglist").jqGrid({
	colNames: ["Account Numbers","First Name","POID","ID"],
	colModel: [
		{name: "user_id"},
		{name:"user_name"},
		{name: "poid",hidden:true},
        {name: "id",hidden:true}
		
	],
	jsonReader: {
		repeatitems: false
	},
    datatype: "local",
	multiselect:true,
	autowidth: true,
	ignoreCase: true,
    caption: "",
    gridview: true,
    rowNum: 10000,
	sortname: "role_name",
    sortorder: "asc",
	viewrecords: true,
	autoencode: false,
	loadComplete: function() {
		var table = this;
        setTimeout(function() 
        {
			updatePagerIcons(table);
			$(window).trigger("resize.jqGrid4");	
		}, 0);
		
    }
});

$("#assignedorglist").jqGrid({
    datatype: "local",
    multiselect: true,
    autowidth: true,
    gridview: true,
    rowNum: 10000,
    viewrecords: true,
	ignoreCase: true,
    autoencode: false,
  colNames: ["Account Numbers","First Name","ID","POID"],
	colModel: [
		{name: "user_id"},
		{name:"user_name"},
		{name: "poid",hidden:true},
        {name: "id",hidden:true}
		
	],
    caption: ""
});

jQuery("#availableorglist").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
jQuery("#assignedorglist").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});

}







function MoveAllOrgAccess() {
    var srcgrid = $("#availableorglist");
    var dstgrid = $("#assignedorglist");
    var allRowsInGrid = srcgrid.jqGrid('getGridParam', 'data');
    if (allRowsInGrid.length == 0) {
        bootbox_alert(headeralert, "Atleast One Access should be there!")
        return;
    }

    allRowsInGrid.sort();
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(dstgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }
    $(srcgrid).jqGrid('clearGridData').trigger("reloadGrid");

}

function removeAllOrgAccess() {
   var srcgrid = $("#availableorglist");
    var dstgrid = $("#assignedorglist");
    var allRowsInGrid = dstgrid.jqGrid('getGridParam', 'data');
    if (allRowsInGrid.length == 0) {
        bootbox_alert(headeralert, "Atleast Access should be there!")
        return;
    }

    allRowsInGrid.sort();
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(srcgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }
    $(dstgrid).jqGrid('clearGridData').trigger("reloadGrid");
}

function moveSelectedOrgAccess() {
    var srcgrid = $("#availableorglist");
    var dstgrid = $("#assignedorglist");
    var allRowsInGrid = dstgrid.jqGrid('getGridParam', 'data');
    var selectArr = [];
    selectArr = jQuery("#availableorglist").jqGrid('getGridParam', 'selarrrow');
    if (selectArr.length == 0) {
        bootbox_alert(headeralert, "Atleast One Access should be selected!")
        return;
    }

    var parentArr = [];
    for (var rows = 0; rows < selectArr.length; rows++) {
        parentArr[rows] = $("#availableorglist").jqGrid('getRowData', selectArr[rows]);
    }

    for (var rows = 0; rows < selectArr.length; rows++) {
        var rd = parentArr[rows];
        allRowsInGrid.push(rd);
        allRowsInGrid.sort();
    }

    $(dstgrid).jqGrid('clearGridData').trigger("reloadGrid");
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(dstgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }

    $(dstgrid).trigger("reloadGrid");

    $.each(selectArr, function() {
        $(srcgrid).delRowData(this);
    });
    $(srcgrid).trigger("reloadGrid");
}

function removeSelectedOrgAccess() {
    var srcgrid = $("#availableorglist");
    var dstgrid = $("#assignedorglist");
    var allRowsInGrid = srcgrid.jqGrid('getGridParam', 'data');
    var selectArr = [];
    selectArr = jQuery("#assignedorglist").jqGrid('getGridParam', 'selarrrow');
    if (selectArr.length == 0) {
        bootbox_alert(headeralert, "Atleast One Access should be selected!")
        return;
    }
    var parentArr = [];
    for (var rows = 0; rows < selectArr.length; rows++) {
        parentArr[rows] = $("#assignedorglist").jqGrid('getRowData', selectArr[rows]);
    }

    for (var rows = 0; rows < selectArr.length; rows++) {
        var rd = parentArr[rows];
        allRowsInGrid.push(rd);
        allRowsInGrid.sort();
    }

    $(srcgrid).jqGrid('clearGridData').trigger("reloadGrid");
    for (var j = 0; j < allRowsInGrid.length; j++) {
        $(srcgrid).jqGrid("addRowData", allRowsInGrid[j]["ID"], allRowsInGrid[j]);
    }

    $(srcgrid).trigger("reloadGrid");
    $.each(selectArr, function() {
        $(dstgrid).delRowData(this);
    });
    $(dstgrid).trigger("reloadGrid");
}

$(window).on('resize.jqGrid5', function() {
	//alert($(".panelhead").width());
    //$(grid_selector2).jqGrid('setGridWidth', $(".panelhead").width());
    $("#availableorglist").jqGrid('setGridWidth', $("#available_orgaccess_grid").width());
    $("#assignedorglist").jqGrid('setGridWidth', $("#available_orgaccess_grid").width());
});
var parent_column = $("#availableorglist").closest('[class*="col-"]');
$(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
	if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
		setTimeout(function() {
            //$(grid_selector2).jqGrid('setGridWidth', parent_column.width());
            $("#availableorglist").jqGrid('setGridWidth', $("#available_orgaccess_grid").width());
            $("#assignedorglist").jqGrid('setGridWidth', $("#available_orgaccess_grid").width());
		}, 0);
	}
});
$(window).trigger("resize.jqGrid5");	
$('#org_access_model').on('shown.bs.modal', function(e) {
	loadorgaccesslist();
	org_access_level_flag = "";
	$(window).trigger("resize.jqGrid5");	
	if(org_access_click_flag != "0"){
		$("#org_access_back").addClass("hide");
	}else{
		$("#org_access_back").removeClass("hide");
	}
	org_access_list_values = [];
	org_accessed_list = [];
	$(".org_access_list").each(function(){
		var splitter = $(this).text().split(':');;
		org_access_list_values.push("'"+splitter[1].trim()+"'");
	});
	$.ajax({
		url:"index.php?r=accountmanag/getorgaccessedlist",
		data:{"org_access":org_access_list_values},
		type:"post",
		success:function(d,s){
			org_accessed_list = JSON.parse(d);
			
		},complete:function(){
		//if(org_access_click_flag != "0"){	
			var access_data = "";
			if($("#org_access_level_value").val() == "0"){
					access_data = "0";
			}else if($("#org_access_level_value").val() == "1"){
					access_data = "22";
			}else if($("#org_access_level_value").val() == "2"){
					access_data = "15";
			}else if($("#org_access_level_value").val() == "3"){
					access_data = "16";
			}else if($("#org_access_level_value").val() == "4"){
					access_data = "13";
			}
			$("#unit_account_type").val(access_data);
			$("#unit_account_type").trigger("change");
		 }
		//}
	});
	//$("#availableorglist").jqGrid('clearGridData').trigger("reloadGrid");
	//$("#assignedorglist").jqGrid('clearGridData').trigger("reloadGrid");
	
});
$('#org_access_model').on('hidden.bs.modal', function(e) {
	org_access_click_flag = "0";
});
$("#unit_account_type").on("change",function(){
	//$("#org_access_model").modal("show");
	getorgaccesslist();
	//account_type = $(this).val();
	
});

$("#org_access_back").on("click",function(){
	access_back_button_flag = "1";
	$('#geo_access_model').modal("show");
	$("#org_access_model").modal("hide");
	
});

$("#org_access_done").on("click",function(){
	var available_org_access_list = $("#assignedorglist").jqGrid('getGridParam','data');
	if(available_org_access_list.length <= 0 && $("#unit_account_type option:selected").attr("access_value") != "0"){
		bootbox_alert(headeralert,"Need To Select One Org Access");
		return false;
	}else{
	var org_access_values = [];
	if(org_access_click_flag != "1"){
		
		var available_geo_access_list = $("#assignedgeolist").jqGrid('getGridParam','data');
		var geo_access_values = [];
		
		$(available_geo_access_list).each(function(b,c){
			var geo_access_data = {
				"access_value":c.access_list
			};
			geo_access_values.push(geo_access_data);
		});
		$(available_org_access_list).each(function(b,c){
			var org_access_data = {
				"access_value":c.poid
			};
			org_access_values.push(org_access_data);
		});
		console.log(org_access_values);
		var geo_org_access_data = {
			"geo_access_level":$("#buser_accesslevel option:selected").attr("access_value"),
			"org_access_level":$("#unit_account_type option:selected").attr("access_value"),
			"org_access_list":org_access_values,
			"geo_access_list":geo_access_values,
			"account_obj":$("#customer_poid").val(),
			"poid":$("#customer_poid").val(),
			"profile_obj":$("#access_profile_obj").val()
		};
		$.ajax({
		url:"index.php?r=accountmanag/modifyorgaccess",
		data:geo_org_access_data,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == "1"){
				bootbox_alert("Modify Geo Access Status",data.respxml);
			}else{
				$("#org_access_model").modal("hide");
				bootbox_refresh("Modify Geo Access Status",data.descr);
			}
		}
	});
	}else{
		$(available_org_access_list).each(function(b,c){
			var org_access_data = {
				"access_value":c.poid
			};
			org_access_values.push(org_access_data);
		});
		var org_access_data = {
			"org_only_access_level":$("#unit_account_type option:selected").attr("access_value"),
			"org_access_list":org_access_values,
			"account_obj":$("#customer_poid").val(),
			"poid":$("#customer_poid").val(),
			"profile_obj":$("#access_profile_obj").val()
		};
		$.ajax({
		url:"index.php?r=accountmanag/modifyorgaccess",
		data:org_access_data,
		type:"post",
		success:function(d,s){
			var data = JSON.parse(d);
			if(data.status == "1"){
				bootbox_alert("Modify Geo Access Status",data.respxml);
			}else{
				$("#org_access_model").modal("hide");
				bootbox_refresh("Modify Geo Access Status",data.descr);
			}
			}
		});
	}
	}
});

$(function(){
    var lcopd = $("#lco_obj_poid").val();
                    if(lcopd){
                    var xmldata = "<MSO_OP_SEARCH_inputFlist>";
                    xmldata += "<ACCOUNT_OBJ>" + lcopd + "</ACCOUNT_OBJ>";
                    xmldata += "<FLAGS>1</FLAGS>";
                    xmldata += "<POID>0.0.0.1 /search -1 0</POID>";
                    xmldata += "</MSO_OP_SEARCH_inputFlist>";
                    $.ajax({
                        type: "post",
                        url: "index.php?r=modify/getjvobjpoiddetails",
                        data: {"data": xmldata},
                        success: function(d) {
                            var resp = $.parseJSON(d);
                            var nodes = [{"text": "AccountNo = " + resp.accno},
                                //{"text":"RMN = "+resp.rmn},
                                //{"text":"First Name = "+resp.first},
                                //{"text":"Middle Name = "+resp.middle},
                                //{"text":"Last Name = "+resp.last},
                                {"text": "Company = " + resp.company}
                            ];
					var append_text="<ul><li><span>Account No :"+resp.accno+"</span></li><li><span>Company Name :"+resp.company+"</span></li></ul>";

                            $('#lcoDetailsFill').append(append_text);
                           
                        }
                    });
                    }
             var lcopd = $("#dt_obj_poid").val();
             if(lcopd){
                    var xmldata = "<MSO_OP_SEARCH_inputFlist>";
                    xmldata += "<ACCOUNT_OBJ>" + lcopd + "</ACCOUNT_OBJ>";
                    xmldata += "<FLAGS>1</FLAGS>";
                    xmldata += "<POID>0.0.0.1 /search -1 0</POID>";
                    xmldata += "</MSO_OP_SEARCH_inputFlist>";
                    $.ajax({
                        type: "post",
                        url: "index.php?r=modify/getjvobjpoiddetails",
                        data: {"data": xmldata},
                        success: function(d) {
                            var resp = $.parseJSON(d);
                            var nodes = [{"text": "AccountNo = " + resp.accno},
                                //{"text":"RMN = "+resp.rmn},
                                //{"text":"First Name = "+resp.first},
                                //{"text":"Middle Name = "+resp.middle},
                                //{"text":"Last Name = "+resp.last},
                                {"text": "Company = " + resp.company}
                            ];
				var append_text="<ul><li><span>Account No :"+resp.accno+"</span></li><li><span>Company Name :"+resp.company+"</span></li></ul>";
                            $('#dtDetailsFill').append(append_text);
                            

                        }
                    });
                    }

       
                    var lcopd = $("#sdt_obj_poid").val();
                    if(lcopd){
                    var xmldata = "<MSO_OP_SEARCH_inputFlist>";
                    xmldata += "<ACCOUNT_OBJ>" + lcopd + "</ACCOUNT_OBJ>";
                    xmldata += "<FLAGS>1</FLAGS>";
                    xmldata += "<POID>0.0.0.1 /search -1 0</POID>";
                    xmldata += "</MSO_OP_SEARCH_inputFlist>";
                    $.ajax({
                        type: "post",
                        url: "index.php?r=modify/getjvobjpoiddetails",
                        data: {"data": xmldata},
                        success: function(d) {
                            var resp = $.parseJSON(d);
                            var nodes = [{"text": "AccountNo = " + resp.accno},
                                //{"text":"RMN = "+resp.rmn},
                                //{"text":"First Name = "+resp.first},
                                //{"text":"Middle Name = "+resp.middle},
                                //{"text":"Last Name = "+resp.last},
                                {"text": "Company = " + resp.company}
                            ];
			var append_text="<ul><li><span>Account No :"+resp.accno+"</span></li><li><span>Company Name :"+resp.company+"</span></li></ul>";
                            $('#sdtDetailsFill').append(append_text);
                        }
                    });
                    }
});
                    

// **** **** ***  **** Commission MODEL *** **** *****
$(".date-time-picker").datetimepicker({
	format: "dd-MM-yyyy",
        autoclose: true,
        todayBtn: false,
        startDate: "01-01-2010",
        //minuteStep: 10,
        pickerPosition:"top-right",
        minView:2
		//pickerReferer:"input"


	});
	
	$(document).on('click', '.datetimeer', function(e) {
	
		$(this).children(".date-time-picker").trigger("click");
	});
	
	$(".date-time-picker").on("changeDate",function(ev){
		var datepickerdate = "";
		var converteddate = "";
		datepickerdate = new Date($(this).datetimepicker('getDate'));
		converteddate = $.datepicker.formatDate("D M d yy",datepickerdate);
		var locale = "en-us";
		$(this).closest(".datetimeer").find("input").val(datepickerdate.getDate()+"-"+(datepickerdate.toLocaleString(locale,{month:"long"}))+"-"+datepickerdate.getFullYear());
		$(this).closest(".datetimeer").find("input").attr("raw_date",converteddate);
		$(this).closest(".datetimeer").find("input").attr("format_date",datepickerdate.getFullYear().toString()+(datepickerdate.getMonth()+1)+datepickerdate.getDate());
	});
	
	$("#payment_history").on("click",function(){
	var check_date = "";
	var payment_repeits_array = [];
	var startdate = $.trim($("#startdate").val());
	var error_html = "<ul>";
	var enddate = $.trim($("#enddate").val());
	var starting_date = "";
	var ending_date = "";
	if (startdate != "") {
		starting_date = parseInt(Date.parse($("#startdate").attr('raw_date')))/ 1000;
	} else {
		error_html += "<li>Start Date cannot be Empty</li>";
	}
	if (enddate != "") {
		ending_date = parseInt(Date.parse($("#enddate").attr('raw_date')))/ 1000;
	} else {
		error_html += "<li>End Date cannot be Empty</li>";
	}

	if (starting_date > ending_date) {
		error_html += "<li>End Date cannot be Before Start Date</li>";
	}
	if (error_html.length > 5) {
		error_html += "</ul>";
		bootbox_alert("Payment History Status", error_html);
	} else {
		ending_date = ending_date + 86399;   //add one day to search
		var data_get_payment_history_repeits = {
			//"service_type": $("#servicetype_customer").val(),
			"poid": $("#customer_poid").val(),
			"start_date": starting_date,
			"end_date": ending_date,
			"flags": 1
		};

		$.ajax({
			url: "index.php?r=history/getpaymentrecipets",
			data: data_get_payment_history_repeits,
			type: "post",
			success: function(d, s) {
				var data = JSON.parse(d);
				var services = "";
				var is_reverse = "";
				var payment_mode = "";
				if (data.status == "0") {
					$('#payment_list_grid').show();
					$("#payment_grid_history").jqGrid('setGridWidth', $('.paymentgrid_size').width());
					recipet_values = data.results;
					console.log(recipet_values);
					if (recipet_values.length > 1) {
						$.each(recipet_values, function(b, c) {
							if (c.service_type == "0") {
								services = "CATV";
							} else if (c.service_type == "1") {
								services = "BROAD BAND";
							}
							if (c.pay_type == "10011") {
								payment_mode = "Cash";
							} else if (c.pay_type == "10012") {
								payment_mode = "Cheque";
								check_date = c.effective_t;
							} else if (c.pay_type == "10013") {
								payment_mode = "online";
							} else if (c.pay_type == "10018") {
								payment_mode = "TDS";
							}
							if (c.is_reversed == "0") {
								is_reverse = "NO";
							} else if (c.is_reversed == "1") {
								is_reverse = "YES";
							}
							recipet_values[b]['by'] = payment_mode;
							var recipet_rows = {
								"receipt_no": c.receipt_no,
								"service_type": services,
								"amount": c.amount,
								"created_t": c.created_t,
								"effective_t":check_date,
								"pay_type": payment_mode,
								"is_reversed": is_reverse,
								"print_option": "<i class='fa fa-print fa-3'></i>"
							};
							payment_repeits_array.push(recipet_rows);
						});
					} else {
						if (recipet_values.service_type == "0") {
							services = "CATV";
						} else if (recipet_values.service_type == "1") {
							services = "BROAD BAND";
						}
						if (recipet_values.pay_type == "10011") {
							payment_mode = "Cash";
						} else if (recipet_values.pay_type == "10012") {
							payment_mode = "Cheque";
							check_date = recipet_values.effective_t;
						} else if (recipet_values.pay_type == "10013") {
							payment_mode = "Online";
						} else if (recipet_values.pay_type == "10018") {
							payment_mode = "TDS";
						}
						if (recipet_values.is_reversed == "0") {
							is_reverse = "NO";
						} else if (recipet_values.is_reversed == "1") {
							is_reverse = "YES";
						}
						recipet_values['by'] = payment_mode;
						var recipet_rows = {
							"receipt_no": recipet_values.receipt_no,
							"service_type": services,
							"amount": recipet_values.amount,
							"created_t": recipet_values.created_t,
							"effective_t":check_date,
							"pay_type": payment_mode,
							"is_reversed": is_reverse,
							"print_option": "<i class='fa fa-print fa-3'></i>"
						};
						payment_repeits_array.push(recipet_rows);
					}
					$("#payment_grid_history").jqGrid("clearGridData").trigger("reloadGrid");
                    for (var count = 0; count < payment_repeits_array.length; count++) {
						$("#payment_grid_history").addRowData(count, payment_repeits_array[count]);
					}
					$("#payment_grid_history").trigger("reloadGrid");
				} else if (data.status == "1") {
					$("#payment_grid_history").jqGrid("clearGridData").trigger("reloadGrid");
					bootbox_alert("Payment History status", data.respxml);
				}
			}
		});

	}

});

$("#payment_grid_history").jqGrid({
	colModel: [
		{name: "receipt_no", resizable: true, label: "Receipt Number"},
		{name: "service_type", resizable: true, label: "Service Type"},
		{name: "amount", resizable: true, label: "Amount",formatter:'currency',decimalPlaces:2},
		{name: "created_t", resizable: true, label: "Payment Date", sorttype: 'date', formatter: 'date', formatoptions: {srcformat: 'ISO8601Long', newformat: 'M d Y, H:i A'}},
		{name: "effective_t",hidden:true, resizable: true, label: "Payment Date", sorttype: 'date', formatter: 'date', formatoptions: {srcformat: 'ISO8601Long', newformat: 'd-m-Y'}},
		{name: "pay_type", resizable: true, label: "Payment Mode"},
		{name: "is_reversed", label: "Reversed"},
		{name: "print_option", resizable: true, label: "Print",align:"center"}
	],
	datatype: "local",
	jsonReader: {
		repeatitems: false
	},
	//cmTemplate: {sortable: false},
	loadonce: true,
	ignoreCase:true,
	autowidth: true,
	height: "auto",
	width: "auto",
	rowNum: 10,
	rowList: [10, 20, 30],
	sortname: "created_t",
	sortorder: "asc",
	viewrecords: true,
	rownumbers: true,
	pager: "#gridpager_payment",
	gridview: true,
	autoencode: false,
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
			
		}, 0);
	},
	onCellSelect: function(rowid, iCol, cellcontent) {
		var rowData = $(this).jqGrid("getRowData", rowid);
		recipet_by = rowData.pay_type;
		if (recipet_values.length > 1) {
			recipet_values[rowid]['created_t'] = rowData.created_t;
			recipet_values[rowid]['effective_t'] = rowData.effective_t;
			window.localStorage.setItem("receiptparams", JSON.stringify(recipet_values[rowid]));
			var popupwin = window.open("index.php?r=usersummary/show_receipt&t=" + (new Date().getTime()) + "&type=" + recipet_by, "receipt", "status=0,scrollbars=yes,toolbar=0,menubar=1");
		} else {
			console.log(rowData.created_t);
			recipet_values['created_t'] = rowData.created_t;
			recipet_values['effective_t'] = rowData.effective_t;
			window.localStorage.setItem("receiptparams", JSON.stringify(recipet_values));
			var popupwin = window.open("index.php?r=usersummary/show_receipt&t=" + (new Date().getTime()) + "&type=" + recipet_by, "receipt", "status=0,scrollbars=yes,toolbar=0,menubar=1");
		}
	}

});

$("#payment_grid_history").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});

function onHistoryTransactionGoClick() {
	$('#transaction_list_grid').show();
	$("#grid_tran").jqGrid('setGridWidth', $(".transgrid_size").width());
	var sd = $.trim($("#transactionstartdate").val());
	var ed = $.trim($("#transactionenddate").val());
	var poid = $.trim($("#customer_poid").val());
	var header = "Transaction History Status";

	if (sd != "")
		sd = parseInt(Date.parse($("#transactionstartdate").attr('raw_date')))/ 1000;
	if (ed != "")
		ed = parseInt(Date.parse($("#transactionenddate").attr('raw_date')))/ 1000;

	if (sd == "") {
		bootbox_alert(header, "Please Select Start date!");
		return;
	}
	if (ed == "") {
		bootbox_alert(header, "Please Select End date!");
		return;
	}


	if (sd > ed) {
		bootbox_alert(header, "Invalid date range.");
		return;
	}
	ed = ed + 86399;
	var d = {
		"poid": poid,
		"startdate": sd,
		"enddate": ed,
		"status": $("#historytransactionstatus").val()
	};

	$.ajax({
		url: "index.php?r=history/transactions_history",
		data: d,
		type: "POST",
		success: function(d, s)
		{
			if (s == "success") {
				var resp = JSON.parse(d);
				if (resp.status == "0") {
					if(resp.data){
					//alert("inside success");
					$("#grid_tran").jqGrid("clearGridData").trigger("reloadGrid");
					if (resp.data.length > 1) {
						for (var count = 0; count < resp.data.length; count++) {
							resp.data[count].programe_name = (resp.data[count].programe_name);
							resp.data[count].th_amt = resp.data[count].th_total_amt.th_amt;
							resp.data[count].th_type = resp.data[count].th_total_amt.th_type;
							resp.data[count].desc_action = resp.data[count].descr_action;
							$("#grid_tran").addRowData(count, resp.data[count]);
						}
					} else {
						resp.data.programe_name = resp.data.programe_name;
						resp.data.th_amt = resp.data.th_total_amt.th_amt;
						resp.data.th_type = resp.data.th_total_amt.th_type;
						resp.data.desc_action = resp.data.descr_action;
						$("#grid_tran").addRowData(count, resp.data);
					}
					$("#grid_tran").trigger("reloadGrid");
				}else{
					$("#grid_tran").jqGrid("clearGridData").trigger("reloadGrid");
					bootbox_alert(header, "No Records Found");
				}
			} else {
					$("#grid_tran").jqGrid("clearGridData").trigger("reloadGrid");
					bootbox_alert(header, resp.statustext);
				}
			} else {
				$("#grid_tran").jqGrid("clearGridData").trigger("reloadGrid");
				bootbox_alert(header, resp.statustext);
			}
		}

	});
}

$("#grid_tran").jqGrid({
	datatype: "local",
	colModel: [
		{name: "th_created_date", label: "Date", sorttype: 'date', formatter: 'date', formatoptions: {srcformat: 'ISO8601Long', newformat: 'd-m-Y H:i:s A'}},
		{name: "programe_name", label: "User Info"},
		{name: "th_sys_descr", label: "Description"},
		{name: "th_type", label: "Type", resizable: true, hidden: true},
		{name: "th_amt", align: "right", label: "Charges",formatter:'currency'},
		{name: "desc_action", label: "Action", hidden: true}
		//{ name: "editstatus",align:"center"}
	],
	jsonReader: {
		repeatitems: false
	},
	//cmTemplate: {sortable:false},
	loadonce: true,
	pager: "#grid_tran_pager",
	ignoreCase: true,
	autowidth: true,
	rowNum: 10,
	rowList: [10, 20, 30],
	sortname: "th_created_date",
	sortorder: "asc",
	viewrecords: true,
	gridview: true,
	autoencode: false,
	loadComplete: function(data) {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
		
		if(data){
			console.log(data);
             /*   if (data.rows.length == 0) {
                   $(this).closest(".ui-jqgrid-bdiv").addClass("hide");
                }else{
					$("#grid_tran").closest(".ui-jqgrid-bdiv").removeClass("hide");

					$(this).closest(".ui-jqgrid-bdiv").removeClass("hide");
				} */
               }
	}
});

jQuery("#grid_tran").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});

$("#search_account_smt").on("click", function() {
        var sd = $.trim($("#account_statement_start_date").val());
	var ed = $.trim($("#account_statement_end_date").val());
	var header = "Account Summary Status";

	if (sd != "")
		sd = parseInt(Date.parse($("#account_statement_start_date").attr('raw_date')))/ 1000;
	if (ed != "")
		ed = parseInt(Date.parse($("#account_statement_end_date").attr('raw_date')))/ 1000;

	if (sd == "") {
		bootbox_alert(header, "Please Select Start date!");
		return;
	}
	if (ed == "") {
		bootbox_alert(header, "Please Select End date!");
		return;
	}


	if (sd > ed) {
		bootbox_alert(header, "Invalid date range.");
		return;
	}
	ed = ed+86399;
	var get_account_smt_value = {
		"start_date": sd,
		"end_date": ed,
		"flags": 127,
		"account_poid_statement": $("#customer_poid").val()
	};

	$.ajax({
		url: "index.php?r=usersummary/getaccountstatement",
		data: get_account_smt_value,
		type: "post",
		success: function(d, s) {
			var data = JSON.parse(d);
			console.log(data);
			if (data.status == "0") {
				var acc_smt_rows = [];
				var results = data.results;
				if (results.length > 1) {
					
					$.each(results, function(b, c) {
						var account_statement_value = {
							"document_no": c.document_no,
							"transcation_id": c.transcation_id,
							"transaction_date": c.transaction_date,
							"start_date": c.start_date,
							"end_date": c.end_date,
							"description": c.description,
							"debits": c.debits,
							"credits": c.credits,
							"balance": c.balance,
							"action_name": c.action_name,
							"user_id": c.user_id,
							"open_balance": c.open_balance
						};
						acc_smt_rows.push(account_statement_value);
					});
				} else {
					var account_statement_value = {
						"document_no": results.document_no,
						"transcation_id": results.transcation_id,
						"transaction_date": results.transaction_date,
						"start_date": results.start_date,
						"end_date": results.end_date,
						"description": results.description,
						"debits": results.debits,
						"credits": results.credits,
						"balance": results.balance,
						"action_name": results.action_name,
						"user_id": results.user_id,
						"open_balance": results.open_balance
					};
					acc_smt_rows.push(account_statement_value);
				}
				$("#account_smt_grid").removeClass("hide");
				console.log(acc_smt_rows);
				$("#account_statement_history").jqGrid("clearGridData").trigger("reloadGrid");
				for (var i = 0; i < acc_smt_rows.length; i++) {
					$("#account_statement_history").jqGrid('addRowData', i, acc_smt_rows[i]);
				}
				$("#account_statement_history").trigger("reloadGrid");
			} else if (data.status == 1) {
				$("#account_statement_history").jqGrid("clearGridData").trigger("reloadGrid");
				bootbox_alert("Account Statement Status", data.statustext);
			}
		}
	});
});

$("#account_statement_history").jqGrid({
	datatype: "local",
	//data: rows,
	colNames: ["Tran No", "Tran Date","Document No","Value Date", "End Date", "Description", "Action Name", "Program Name", "Opening Balance", "Debits", "Credits", "Balance"],
	colModel: [
		{name: "transcation_id"},
		{name: "transaction_date",sorttype:'date',formatter:'date',formatoptions:{srcformat:'ISO8601Long',newformat:'d-m-Y H:i:s A'}},
		{name: "document_no"},
		{name: "start_date",sorttype:'date',formatter:'date',formatoptions:{srcformat:'ISO8601Long',newformat:'d-m-Y H:i:s A'},hidden:true},
		{name: "end_date",hidden:true},
		{name: "description",width:300},
		{name: "action_name"},
		{name: "user_id",hidden:true},
		{name: "open_balance",hidden:true},
		{name: "debits",formatter:'currency'},
		{name: "credits",formatter:'currency'},
		{name: "balance",formatter:'currency'}
	],
	jsonReader: {
		repeatitems: false
	},
	cmTemplate: {sortable:false},
	loadonce:true,
    ignoreCase:true,
	//multiselect: true,
	//autowidth: true,
	rowNum: 10,
	rowList: [10, 20, 30],
	//sortname: "transaction_date",
	//sortorder: "asc",
	viewrecords: true,
	gridview: true,
	autoencode: false,
    pager: "#account_statement_history_pager",
	caption: "",
	shrinkToFit: false,
    forceFit: true,
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
			$(window).trigger("resize.jqGridaccount_smt");
		}, 100);
		
	},
	gridComplete: function() {
//	var selectedrows = 	$("#ipsearch_grid").jqGrid("getDataIDs");
//	console.log(selectedrows);
//	$.each(selectedrows,function(b,c){
//		$("#ipsearch_grid").jqGrid('setSelection',b,true);
//	});
	}
});
$(window).trigger("resize.jqGridaccount_smt");
jQuery("#account_statement_history").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
var account_statement_grid_selector = "#account_statement_history";
$(window).on('resize.jqGridaccount_smt', function() {
	var gridwidth = $("#account_smt_grid").width();
	$(account_statement_grid_selector).jqGrid('setGridWidth', gridwidth);
});
var parent_column = $(account_statement_grid_selector).closest('[class*="col-"]');
$(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
	if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
		//setTimeout is for webkit only to give time for DOM changes and then redraw!!!
		setTimeout(function() {
			$(account_statement_grid_selector).jqGrid('setGridWidth', $("#account_smt_grid").width());
		}, 0);
	}
});

function onlifecycleTransactionGoClick() {
	$('#lifecycle_list_grid').show();
	$("#grid_tranlifecyle").jqGrid('setGridWidth', $(".lifecycletransgrid_size").width());
	var sd = $.trim($("#lifecyclestartdate").val());
	var ed = $.trim($("#lifecycleenddate").val());
	var poid = $.trim($("#customer_poid").val());
	var header = "Transaction Life Cycle Status";

	if (sd != "")
		sd = parseInt(Date.parse($("#lifecyclestartdate").attr('raw_date')))/ 1000;
	if (ed != "")
		ed = parseInt(Date.parse($("#lifecycleenddate").attr('raw_date')))/ 1000;

	if (sd == "") {
		bootbox_alert(header, "Please Select Start date!");
		return;
	}
	if (ed == "") {
		bootbox_alert(header, "Please Select End date!");
		return;
	}


	if (sd > ed) {
		bootbox_alert(header, "Invalid date range.");
		return;
	}
	ed = ed + 86399;
	var d = {
		"poid": poid,
		"startdate": sd,
		"enddate": ed,
		"status": "5"
	};

	$.ajax({
		url: "index.php?r=history/transactions_history",
		data: d,
		type: "POST",
		success: function(d, s)
		{
			if (s == "success") {
				var resp = JSON.parse(d);
				if (resp.status == "0") {
					//alert("inside success");
					$("#grid_tranlifecyle").jqGrid("clearGridData").trigger("reloadGrid");
					if(resp.data){
						if (resp.data.length > 1) {
							for (var count = 0; count < resp.data.length; count++) {
								resp.data[count].programe_name = (resp.data[count].programe_name);
								resp.data[count].th_amt = resp.data[count].th_total_amt.th_amt;
								resp.data[count].th_type = resp.data[count].th_total_amt.th_type;
								resp.data[count].desc_action = resp.data[count].descr_action;
								$("#grid_tranlifecyle").addRowData(count, resp.data[count]);
							}
						} else {
							resp.data.programe_name = resp.data.programe_name;
							resp.data.th_amt = resp.data.th_total_amt.th_amt;
							resp.data.th_type = resp.data.th_total_amt.th_type;
							resp.data.desc_action = resp.data.descr_action;
							$("#grid_tranlifecyle").addRowData(count, resp.data);
						}
						$("#grid_tranlifecyle").trigger("reloadGrid");
					}else{
                        $("#grid_tranlifecyle").jqGrid("clearGridData").trigger("reloadGrid");
						bootbox_alert(header, "No Records Found");
					}
				} else {
					$("#grid_tranlifecyle").jqGrid("clearGridData").trigger("reloadGrid");
					bootbox_alert(header, resp.statustext);
				}
			} else {
				$("#grid_tranlifecyle").jqGrid("clearGridData").trigger("reloadGrid");
				bootbox_alert(header, resp.statustext);
			}
		}

	});
}

$("#grid_tranlifecyle").jqGrid({
	datatype: "local",
	colModel: [
		{name: "th_created_date", label: "Date", sorttype: 'date', formatter: 'date', formatoptions: {srcformat: 'ISO8601Long', newformat: 'd-m-Y H:i:s A'}},
		{name: "programe_name", label: "User Info"},
		{name: "th_sys_descr", label: "Description"},
		{name: "th_type", label: "Type", resizable: true, hidden: true},
		{name: "th_amt", align: "right", label: "Charges", hidden: true},
		{name: "desc_action", label: "Action"}
		//{ name: "editstatus",align:"center"}
	],
	//height:"100px",
	//shrinkToFit: false,
	jsonReader: {
		repeatitems: false
	},
	//cmTemplate: {sortable:false},
	loadonce: true,
	pager: "#grid_tran_pagerlifecyle",
	ignoreCase: true,
	autowidth: true,
	rowNum: 10,
	rowList: [10, 20, 30],
	sortname: "th_created_date",
	sortorder: "asc",
	viewrecords: true,
	gridview: true,
	autoencode: false,
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
	},
	onCellSelect: function(rowid, iCol, cellcontent) {
		var rowData = $(this).jqGrid("getRowData", rowid);
		orderid = rowData.order_id;
		oncellorderclick(orderid);
	}
});


jQuery("#grid_tranlifecyle").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});

function searchBillsClick() {
	var radio_value1 = parseInt($('input[name=billssearchby]:checked').val());

	if (radio_value1 == 1) {
		$("#billscountmain").addClass('hide');
		$("#searchdaterow").removeClass('hide');
	} else {

		$("#billscountmain").removeClass('hide');
		$("#searchdaterow").addClass('hide');
	}


}

function onSearchBillsGoClick() {
	var sd = $("#billsstartdate").val();
	var ed = $("#billsenddate").val();
	
	var count_value = "";
	var acnt_no = $("#customer_account_number").val();//'<?php echo $_GET['accountno']; ?>';
	var msg, header;
	var search_type = $('input[name=billssearchby]:checked').val();
	if (search_type == "0") {
	 count_value = $("#billscount").val();
		if (count_value == "") {
			msg = "Please Enter a valid count";
			bootbox_alert(header, msg);
			return false;
		}
	} else {
		if (sd == ""){
			msg = "Please Select Start date ";
			bootbox_alert(header, msg);
			return false;
		}
		if(ed == ""){
			msg = "Please Select End date ";
			bootbox_alert(header, msg);
			return false;
		}
		
		sd = parseInt(Date.parse($("#billsstartdate").attr('raw_date')))/ 1000;
		ed = parseInt(Date.parse($("#billsenddate").attr('raw_date')))/ 1000;
	}
	if(ed > sd){
		bootbox_alert(header,"End Cannot Be Greater than From Date");
	}
	ed = ed+86399;
	var service_type = $("#billservicetype").val();
	var d = {
		"count": count_value,
		"sd": sd,
		"ed": ed,
		"flags": search_type,
		"accountno": acnt_no,
		"customerpoid": $("#customer_poid").val(),
		"service_type":service_type
	};
	$.ajax({
		url: "index.php?r=usersummary/invoices_list",
		data: d,
		type: "POST",
		success: function(d, s) {
			if (s == "success") {
				var json = JSON.parse(d);
				var header = "Bills Search";
				if (json["status"] == "0") {
					$("#bill_grid_view").removeClass("hide");
					$("#bill_grid").jqGrid("clearGridData").trigger("reloadGrid");
                    for (var count = 0; count < json.rows.length; count++) {
						if(json.rows[count].billno != null){
							$("#bill_grid").addRowData(count, json.rows[count]);
						}
					}
                                    $("#bill_grid").trigger("reloadGrid");
				} else {
					$("#bill_grid").jqGrid("clearGridData").trigger("reloadGrid");
					bootbox_alert(header, json["statustext"]);
				}
			}
		}
	});
}

function onGeneratePDF(idx) {
	var invoice_poid = "";
	var poid_array = "";
	var rowData = $("#bill_grid").jqGrid("getRowData", idx);
	console.log(rowData);
	var view_template = {
		"bill_no": rowData.billno,
		"account_poid": $("#customer_poid").val(),
	};
	$.ajax({
		url: "index.php?r=usersummary/viewinvoice",
		data: view_template,
		type: "post",
		success: function(d, s) {
			var data = JSON.parse(d);
			if (data.brm_status == "0") {
				poid_array = data.invoice_obj.split(" ");
				invoice_poid = poid_array[2];
				console.log(invoice_poid);
				var theurl = "http://172.20.20.12:7001/xmlpserver/BB_Invoices/BB_Invoice_Report.xdo?_xpf=&_xpt=0&_xdo=%2FBB_Invoices%2FBB_Invoice_Report.xdo&_paramsp_Inv_Type=2&_xf=pdf&_xautorun=true&_xt=BB_Invoice_Template&_paramsp_Inv_POID=" + invoice_poid + "&_paramsp_Inv_Status="+data.invoice_status+"&_xmode=4&id=viewinvoice&passwd=viewinvoice1";
				var popupwin = window.open(theurl, "receipt", "status=0,scrollbars=yes,toolbar=0,menubar=1");
			} else if (data.brm_status == "1") {
				bootbox_alert("Invoice Status", data.respxml);
			}
		}
	});


	//window.open(theurl, "Mywindow");

	//document.getElementById("billsform").submit();
	return false;
}

$("#bill_grid").jqGrid({
	datatype: "local",
	//data: rows,
	colNames: ["Bill Number", "Due Amount", "End date", "Invoice"],
	colModel: [
		{name: "billno"},
		{name: "due",formatter:'currency'},
		{name: "endtime"},
		{name: "action"}
	],
	jsonReader: {
		repeatitems: false
	},
        loadonce:true,
	autowidth: true,
	width: "100%",
	viewrecords: true,
    ignoreCase:true,
	pager: "#bill_pager",
	gridview: true,
	height: "auto",
	autoencode: false,
	caption: "",
	loadComplete: function(data) {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
                $(window).trigger("resize.jqGrid_bill");
		}, 0);
		
		if(data){
			console.log(data);
             /*   if (data.rows.length == 0) {
                   $(this).closest(".ui-jqgrid-bdiv").addClass("hide");
                }else{
					$("#grid_tran").closest(".ui-jqgrid-bdiv").removeClass("hide");

					$(this).closest(".ui-jqgrid-bdiv").removeClass("hide");
				} */
               }
	},
	onCellSelect: function(rowid, iCol, cellcontent) {
		//var rowData = $(this).jqGrid("getRowData", rowid);
		if(iCol == "3")
		onGeneratePDF(rowid);
	}
}); 
jQuery("#bill_grid").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
var grid_selector_bill = "#bill_grid";
$(window).on('resize.jqGrid_bill', function() {
	var gridwidth = $("#bill_grid_view").width();
	$(grid_selector_bill).jqGrid('setGridWidth', gridwidth);
});

$(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
	if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
		//setTimeout is for webkit only to give time for DOM changes and then redraw!!!
		setTimeout(function() {
			$(grid_selector_bill).jqGrid('setGridWidth', gridwidth);
		}, 0);
	}
});
