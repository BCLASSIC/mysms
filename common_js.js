var homepass = "";
var id = "";
var user_area = "";
var user_street = "";
var user_location = "";
var user_building = "";
function updatePagerIcons(table) {
	var replacement =
			{
				'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
				'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
				'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
				'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
			};
	$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function() {
		var icon = $(this);
		var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

		if ($class in replacement)
			icon.attr('class', 'ui-icon ' + replacement[$class]);
	});
}
/********************************************************* Checking the json ***************************************/

function IsJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/**********************************************************Alert Box*************************************************/
function bootbox_alert(header, msg, mycallback) {
    var box = bootbox.dialog({
        message: msg,
        title: header,
        buttons: [
            {
                label: "OK",
                "class": "btn btn-xs",
                click: function() {
                    if (mycallback)
                        mycallback();
                   // $(this).dialog(close); 
                    $(this).modal('hide');
                }
            }]
    });
    box.on('hidden.bs.modal', function (e) {
        if($('.modal.in').css('display') == 'block'){
            $('body').addClass('modal-open');
}
    });
}
function bootbox_refresh(header, msg,url) {
    bootbox.dialog({
        message: msg,
        title: header,
        buttons: [
            {
                label: "OK",
                "class": "btn btn-xs",
                callback: function() {
                    if(url==""||url===undefined)
					location.reload();
                    else
                        document.location.href=url;
				}
            }]
    });
}
/**********************************************************USER NAME*************************************************/
function usersuggestion(usergen) {

	var dateuser = new Date(); // for now
	var month = dateuser.getMonth() + 1;
	var date = dateuser.getDate();
	var hours = dateuser.getHours();
	var minutes = dateuser.getMinutes();
	var seconds = dateuser.getSeconds();
	var usernamesug = +month + "" + date + "" + hours + "" + minutes + "" + seconds;
	return usernamesug;
}
var user_availability = function() {
	var username = $("#user_username").val();
	if (username)
		$.ajax({
			type: "post",
			url: "index.php?r=accountmanag/checkAvailLogin",
			data: {"user_name": username},
			success: function(d) {
				if (d == 0) {
					$("#user_username").attr("data-content", "User available");
					$("#user_username").popover('show');
				} else {
					$("#user_username").attr("data-content", "User Exist");
					$("#user_username").popover('show');
				}
			}
		});
};
/******************************************************Billing Address*********************************************/
$(document).on("blur", '.pincode', function() {
	//alert("we");
	var current = $(this);
	var pincode = current.closest("input").val();
	var id = $(this).closest(".billing_address").find(".country").attr("value", 10);
	var geo_master_service_type = $(".geo_master_service_type option:selected").attr("geo_service");
	if (pincode != '' && geo_master_service_type != '')
		$.ajax({
			url: "index.php?r=masterdata/get_streets_buildings",
			dataType: "json",
			data: {"data": pincode,"geo_master_service_type":geo_master_service_type},
			success: function(d, s) {
				if (d.status == "0") {
					//$("#city").html(d.city);
					//$("#state").html(d.state);
					//$("#country").html(d.country);
					current.closest(".billing_address").find(".country").attr("value", d.country);
					current.closest(".billing_address").find(".state").attr("code",d.statecode);
					current.closest(".billing_address").find(".region").attr("value", d.region);
					current.closest(".billing_address").find(".state").attr("value", d.state);
					current.closest(".billing_address").find(".city").attr("value", d.city);
					current.closest(".billing_address").find(".city").attr("code", d.citycode);
					streetbuildingjson = d;
					var ghh = localStorage.setItem("zipareacode", d.zipcode);
					var areaHtml = "<option value=''>-- SELECT AREA --</option>";

					if (d.areadet) {
						for (var idx = 0; idx < d.areadet.length; idx++) {
							var r = d.areadet[idx];
							areaHtml += "<option date-stateid='"+d.stateid+"' areacode ='"+ r.AREA_CODE +"' data-statename='"+d.state+"' data-cityname = '"+d.city+"' data-citycode='"+d.citycode+"' value='" + r.ID + "' homepass='" + r.HOME_PASS_NAME + "'>" + r.AREA_NAME + "</option>";
						}

						current.closest(".billing_address").find(".area").html(areaHtml);
					}

				}
			}
		});
});

$(document).on("blur", '.pincode_gf', function() {
    var current = $(this);
    var pincode = current.closest("input").val();
    var id = $(this).closest(".billing_address").find(".country").attr("value", 10);
    var geo_master_service_type = $(".geo_master_service_type option:selected").attr("geo_service");
    if (pincode != '' && geo_master_service_type != ''){
        $.ajax({
            url: "index.php?r=masterdata/get_streets_buildings",
            dataType: "json",
            //data: {"data": pincode},
            data: {"data": pincode,"geo_master_service_type":geo_master_service_type},
            global:false,
            success: function(d, s) {
                if (d.status == "0") {
                    //$("#city").html(d.city);
                    //$("#state").html(d.state);
                    //$("#country").html(d.country);
                    current.closest(".billing_address").find(".country").attr("value", d.country);
                    current.closest(".billing_address").find(".state").attr("code", d.statecode);
                    current.closest(".billing_address").find(".region").attr("value", d.region);
                    current.closest(".billing_address").find(".state").attr("value", d.state);
                    current.closest(".billing_address").find(".city").attr("value", d.city);
                    current.closest(".billing_address").find(".city").attr("code", d.citycode);
                    streetbuildingjson = d;
                    var ghh = localStorage.setItem("zipareacode", d.zipcode);
                    var areaHtml = "<option value=''>-- SELECT AREA --</option>";

                    if (d.areadet) {
                        for (var idx = 0; idx < d.areadet.length; idx++) {
                            var r = d.areadet[idx];
                            areaHtml += "<option date-stateid='" + d.stateid + "' areacode ='" + r.AREA_CODE + "' data-statename='" + d.state + "' data-cityname = '" + d.city + "' data-citycode='" + d.citycode + "' value='" + r.ID + "' homepass='" + r.HOME_PASS_NAME + "'>" + r.AREA_NAME + "</option>";
                        }

                        current.closest(".billing_address").find(".area").html(areaHtml);
                    }

                }
            }
        });
    }
});
$(document).on("change", '.area', function() {
	user_area = $("option:selected",this).text();
	var geo_master_service_type = $(".geo_master_service_type option:selected").attr("geo_service");
	var current = $(this);
	var zipcodeareaid = $.trim(current.val());

	if ($("#area_label").length > 0)
	{
		id = "area_label";
		//homepass = parseInt($("option:selected", this).attr("homepass"));
		homepass = $("option:selected", this).attr("homepass");
		homepassvalidate(id, homepass);
	}
	if (zipcodeareaid == '' || zipcodeareaid == 0 || geo_master_service_type == '' || geo_master_service_type == undefined) {
		$("select#street").html("<option value=''>-- SELECT STREET --</option>)");
		$("select#building").html("<option value=''>-- SELECT BUILDING --</option>)");
		return false;
	}
	$.ajax({
		type: "post",
		url: "index.php?r=role/get_streets",
		data: {"zipcodeareaid": zipcodeareaid,"geo_master_service_type":geo_master_service_type},
		type: "post",
				success: function(d) {
					var json = $.parseJSON(d);
					var jd = json.streets;
					var jl = json.location;
					var streets = '';
					current.closest(".billing_address").find(".region").attr("value", jd[0].AREA_REGION);
					streets += "<option value=''>-- SELECT STREET --</option>";
					for (i = 0; i < jd.length; i++) {
						streets += "<option value='" + jd[i].ID + "' areacode='" + jd[i].AREA_CODE + "' homepass='" + jd[i].HOME_PASS_NAME + "'>" + jd[i].STREET_NAME + "</option>";
					}
					var locations = '';
					locations += "<option value=''>-- SELECT LOCATION --</option>";
					for (var j = 0; j < jl.length; j++) {
						locations += "<option data-areaid='"+jl[j].AREA_ID+"' data-stateid='"+jl[j].STATE_ID+"' data-areaname='"+jl[j].AREA_NAME+"' data-locationid='"+jl[j].L_ID+"' data-statename='"+jl[j].STATE_NAME+"' data-citycode='"+jl[j].CITY_CODE+"' data-cityname='"+jl[j].CITY_NAME+"' value ='" + jl[j].LOCATION_NAME + "'homepass='" + jl[j].HOME_PASS_NAME + "'>" + jl[j].LOCATION_NAME + "</option>";
					}
					var building = "<option value=''>-- SELECT BUILDING --</option>";
					current.closest(".billing_address").find(".location").html(locations);
					current.closest(".billing_address").find(".street").html(streets);
					current.closest(".billing_address").find(".building").html(building);
					current.closest(".billing_address").find(".area_hidden").val(user_area);
				}
	});
});
$(document).on("change", '.street', function() {
	user_street = $("option:selected",this).text();
	var geo_master_service_type = $(".geo_master_service_type option:selected").attr("geo_service");
	var current = $(this);
	if (("#street_label").length > 0) {
		id = "street_label";
		//homepass = parseInt($("option:selected", this).attr("homepass"));
        homepass = $("option:selected", this).attr("homepass");
		homepassvalidate(id, homepass);
	}
	var ddlstreet = current.closest(".billing_address").find(".street").val();
	var ddlbuilding = current.closest(".billing_address").find(".building");
	if (ddlstreet == 0 || ddlstreet == '' || geo_master_service_type == undefined || geo_master_service_type == '') {
		current.closest(".billing_address").find(".building").html("<option value=''>-- SELECT BUILDING --</option>)");
		return false;
	}

	$.ajax({
		type: "post",
		url: "index.php?r=masterdata/get_buildings",
		data: {"streetid": ddlstreet,"geo_master_service_type":geo_master_service_type},
		type: "post",
				success: function(d) {
					var json = $.parseJSON(d);
					var jd = json.buildings;
					var buildings = '';
					buildings += "<option value=''>-- SELECT BUILDING --</option>";
					for (i = 0; i < jd.length; i++) {
						buildings += "<option value='" + jd[i].ID + "' homepass='" + jd[i].HOME_PASS_NAME + "'>" + jd[i].BUILDING_NAME + "</option>";
					}
					console.log(buildings);
					current.closest(".billing_address").find(".building").html(buildings);
					current.closest(".billing_address").find(".street_hidden").val(user_street);
				}
	});
});
$(document).on("change", '.location', function() {
	var current = $(this);
	user_location = $("option:selected",this).text();
	current.closest(".billing_address").find(".location_hidden").val(user_location);
});
$(document).on("change", '.building', function() {
	var current = $(this);
	user_building = $("option:selected",this).text();
	current.closest(".billing_address").find(".building_hidden").val(user_building);
});
/*************************************************homepass validation************************************************/
function homepassvalidate(id, homepass) {
    if ($.trim(homepass) == "" || homepass == null) {
        $("#" + id).removeClass("label-success");
        $("#" + id).removeClass("label-danger");
        $("#" + id).html("");
    }
    else if (homepass === "NONE") {
        $("#" + id).removeClass("label-success");
        $("#" + id).addClass("label-danger");
        $("#" + id).html(homepass);
    } else {
        $("#" + id).removeClass("label-danger");
        $("#" + id).addClass("label-success");
        $("#" + id).html(homepass);
    }
}
/**********************************************************Search*****************************************************/
var search_data = {};
//<!-- Modified by Mydeen. 02_04_15 CATV Changes Begin-->
var flag = "6";
var falg2 = "6";
//<!-- Modified by Mydeen. 02_04_15 CATV Changes END-->
$(".inner_custom").on("change", function() {
	flag = $("option:selected", this).attr("flag");
	//alert(flag);
	
});
$(".inner_custom_mobile").on("change", function() {
	flag2 = $("option:selected", this).attr("flag");
	//alert(flag);
	
});
$(".nav-search-input").on("keyup", function(e) {
	if (e.keyCode == 13) {
		//alert("jungle");
	}
});
$("#search-model").on("shown.bs.modal", function() {
	$(window).trigger("resize.jqGrid_search");
});
var grid_selector = "#searchgrid";
var current_active_dialog_id = "";

//resize to fit page size
$(window).on('resize.jqGrid', function() {
	//console.log($("#search-model .modal-dialog .search_parent_grid_wrapper").width());
	$(grid_selector).jqGrid('setGridWidth', $("#search-model .modal-dialog .search_parent_grid_wrapper").width());
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
var value = {};
var rows =[];
var forward_link = "";
var business_type = "";
var account_type = "";

function onCustomerSearchButtonClick() {
	search_value = {
		"search": $(".inner_custom").val(),
		"value": $.trim($(".nav-search-input").val()),
		"flags": flag
	};
	
	
	$.ajax({
		url: "index.php?r=site/search",
		data: search_value,
		type: "post",
		success: function(d, s) {
			rows = [];
			console.log("----- ############## " + s+d);
			var data = JSON.parse(d);
			if(data.status == "0") {
                            if(flag=='125'||flag=='126'){
                                $("#pre-active").modal('show');	
                                    var preactive_value = {
                                            "stbid":data.STB_ID,
                                            "vcid":data.VC_ID,
                                            "pname":data.NAME,
                                            "createt":data.CREATED_T,
                                            "action":"<a href='index.php?r=bulk/preactivationsummary&stb_id="+data.STB_ID+"'>Open</a>"
                                    };
                                    rows.push(preactive_value);
                                    $("#pre-active-grid")[0].addJSONData(rows);
                            }else{
                                if(data.data){
				if (data.data.length > 0){
					$("#search-model").modal('show');
					var data_value = data.data;
					$.each(data_value, function(b, c) {
						business_type = c.business_type;
						forward_link = "<a href='index.php?r="+c.controller+"/"+c.action+"&account_no="+c.account_no+"'>Open</a>";
						value = {
						"acc_no":c.account_no,
						"first_name":c.first_name,
						"last_name":c.last_name,
						"company_name":c.company,
						"action":forward_link
					};
					rows.push(value);
					});
				}
				else{
					window.location = "index.php?r="+data.data.controller+"/"+data.data.action+"&account_no="+data.data.account_no;
					forward_link = "<a href='index.php?r="+data.data.controller+"/"+data.data.action+"&account_no="+data.data.account_no+"'>Open</a>";
					value = {
						"acc_no":data.data.account_no,
						"first_name":data.data.first_name,
						"last_name":data.data.last_name,
						"company_name":data.data.company,
						"action":forward_link
					};
					rows.push(value);
				}
				//
                        //$("#searchgrid")[0].addJSONData(rows);
        		$("#searchgrid").jqGrid("clearGridData").trigger("reloadGrid");                        
                        for(var count = 0;count < rows.length;count++){
                            $("#searchgrid").addRowData(count, rows[count]);
                        }
                        $("#searchgrid").trigger("reloadGrid");  
                                    
                                }else{
                        bootbox_alert("Search Customer","No Record Found");
                            }
                        }
			} else if(data.status == "1") {
                bootbox_alert("Search Customer",data.statustext);
			}
		}
	});
	$("#searchgrid").jqGrid({
	 //url: "index.php?r=site/search",
	 //serializeGridData : function(postdata) {
	 //postdata.search_value = search_data;
	 //return postdata;
	 //},
	 datatype: "local", 
	 data:rows,
	 colNames: ["Account No", "First Name","Last Name","Company Name","Action"],
	 colModel: [
	 { name: "acc_no"},
	 { name: "first_name"},
	 { name: "last_name"},
	 { name: "company_name"},
	 { name: "action",align:"center"}
	 ],
	 jsonReader : {
	 repeatitems:false
	 },
	 autowidth:true,
        rowNum: 10,
        rowList: [10, 20, 30],
	 cmTemplate: {sortable:false},
        loadonce:true, 
	 viewrecords: true,
	 gridview: true,
	 autoencode: false,
        pager:"#searchgrid_pager",        
        caption: "",
        loadComplete : function() {
	 var table = this;
	 setTimeout(function(){
            resize_search_grid();
            $(window).trigger("resize.jqGrid_search");
	 updatePagerIcons(table);
	 }, 0);
         },
	 onCellSelect : function(rowid,iCol,cellcontent){
	 var rowData = $(this).jqGrid("getRowData",rowid);
	 if(iCol == 5){			 
	 $("#"+current_active_dialog_id).trigger("search_event_success",{'rowid':rowid,"iCol":iCol,"cellcontent":cellcontent,"rowData":rowData});
	 }
	 }
	 });

    $("#searchgrid").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: 'cn'});

	return false;
}
function onCustomerSearchButtonClick_mobile() {
	search_value = {
		"search": $(".inner_custom_mobile").val(),
		"value": $.trim($(".nav-search-input_mobile").val()),
		"flags": flag2
	};
	
	
	$.ajax({
		url: "index.php?r=site/search",
		data: search_value,
		type: "post",
		success: function(d, s) {
			rows = [];
			console.log("----- ############## " + s+d);
			var data = JSON.parse(d);
			if(data.status == "0") {
                            if(flag=='125'||flag=='126'){
                                $("#pre-active").modal('show');	
                                    var preactive_value = {
                                            "stbid":data.STB_ID,
                                            "vcid":data.VC_ID,
                                            "pname":data.NAME,
                                            "createt":data.CREATED_T,
                                            "action":"<a href='index.php?r=bulk/preactivationsummary&stb_id="+data.STB_ID+"'>open</a>"
                                    };
                                    rows.push(preactive_value);
                                    $("#pre-active-grid")[0].addJSONData(rows);
                            }else{
                                if(data.data){
				if (data.data.length > 0)
				{
					$("#search-model").modal('show');
					var data_value = data.data;
					$.each(data_value, function(b, c) {
						business_type = c.business_type;
						forward_link = "<a href='index.php?r="+c.controller+"/"+c.action+"&account_no="+c.account_no+"'>open</a>";
						value = {
						"acc_no":c.account_no,
						"first_name":c.first_name,
						"last_name":c.last_name,
						"company_name":c.company,
						"action":forward_link
					};
					rows.push(value);
					});
				}
				else{
					window.location = "index.php?r="+data.data.controller+"/"+data.data.action+"&account_no="+data.data.account_no;
					forward_link = "<a href='index.php?r="+data.data.controller+"/"+data.data.action+"&account_no="+data.data.account_no+"'>open</a>";
					value = {
						"acc_no":data.data.account_no,
						"first_name":data.data.first_name,
						"last_name":data.data.last_name,
						"company_name":data.data.company,
						"action":forward_link
					};
					rows.push(value);
				}
				//
        		$("#searchgrid").jqGrid("clearGridData").trigger("reloadGrid");                        
                        for(var count = 0;count < rows.length;count++){
                            $("#searchgrid").addRowData(count, rows[count]);
                        }
                        $("#searchgrid").trigger("reloadGrid");  

                                 }else{
                        bootbox_alert("Search Customer","No Record Found");
                            }
                        }
			} else {
                bootbox_alert("Search Customer",data.statustext);
			}
		}
	});
	$("#searchgrid").jqGrid({
	 //url: "index.php?r=site/search",
	 //serializeGridData : function(postdata) {
	 //postdata.search_value = search_data;
	 //return postdata;
	 //},
	 datatype: "local", 
	 data:rows,
	 colNames: ["Account No", "First Name","Last Name","Company Name","Action"],
	 colModel: [
	 { name: "acc_no"},
	 { name: "first_name"},
	 { name: "last_name"},
	 { name: "company_name"},
	 { name: "action",align:"center"}
	 ],
	 jsonReader : {
	 repeatitems:false
	 },
	 autowidth:true,
	 //rowNum: 10,
	 //rowList: [10, 20, 30],
	 cmTemplate: {sortable:false},
	 viewrecords: true,
	 gridview: true,
	 autoencode: false,
        loadonce: true,
        pager: "#searchgrid_pager",
        caption: "",
        loadComplete : function() {
	 var table = this;
	 setTimeout(function(){
            resize_search_grid();
	 updatePagerIcons(table);
            $(window).trigger("resize.jqGrid_search");
	 }, 0);
         },
	 onCellSelect : function(rowid,iCol,cellcontent){
	 var rowData = $(this).jqGrid("getRowData",rowid);
	 if(iCol == 5){			 
	 $("#"+current_active_dialog_id).trigger("search_event_success",{'rowid':rowid,"iCol":iCol,"cellcontent":cellcontent,"rowData":rowData});
	 }
	 }
	 });
    $("#searchgrid").jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: 'cn'});
	return false;
}

            

/*******************************************************Address*******************************************************/
$(".summary_address").on("change",function(){
	var address_value = parseInt($(this).val());
	if(address_value === 2){
		$("#installation").addClass("hide");
		$("#billing").removeClass("hide");
	}
	else{
		$("#installation").removeClass("hide");
		$("#billing").addClass("hide");
	}
	
});

/**************************************************Validation*********************************************************/
function emailvalidate(email){
	var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
	var valid = emailRegex.test(email);
	if(!valid){
		return false;
	}
	return true;
}
function mobilevalidate(mobile){
	var validate_result = isNaN(mobile);
	var mobile_length = mobile.length;
	if(validate_result){
		return false;
	}else if(mobile_length != 10){
		return false;
	}
		return true;
}
function numbervalidate(number){
	var validate_result = isNaN(number);
	if(validate_result){
		return false;
	}
	return true;
}
function wordsvalidate(words){
	var wordRegex = new RegExp(/^[A-Za-z `&/10]{1,}$/i);
	var valid = wordRegex.test(words);
	if(!valid){
		return false;
	}
	return true;
}
function repasswordvalide(repass,pass){
	if(pass != repass){
		return false;
	}
	return true;
}


jQuery(function() {
                gridSelect("#list1");
                gridSelect("#list2");
                gridSelect("#list3");
            });

            function gridSelect(gridName) {
                var grid_selector = gridName;
                //alert(grid_selector);
                //resize to fit page size
                $(window).on('resize.jqGrid', function() {
                    //alert($(".page-content").width());
                    $(grid_selector).jqGrid('setGridWidth', $(".page-content").width());
                })
                //resize on sidebar collapse/expand
                var parent_column = $(grid_selector).closest('[class*="col-xs"]');
                $(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
                    if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
                        //setTimeout is for webkit only to give time for DOM changes and then redraw!!!
                        setTimeout(function() {
                            $(grid_selector).jqGrid('setGridWidth', parent_column.width());
                        }, 0);
                    }
                });
                $(window).trigger("resize.jqGrid");
            }
$("#pre-active-grid").jqGrid({
	datatype: "local",
	data: rows,
	colNames: ["STB ID", "Card No", "Plan Name", "Created Date", "Action"],
	colModel: [
		{name: "stbid"},
		{name: "vcid"},
		{name: "pname"},
		{name: "createt"},
		{name: "action", align: "center"}
	],
	jsonReader: {
		repeatitems: false
	},
	autowidth: true,
	viewrecords: true,
	gridview: true,
	autoencode: false,
	caption: "Search Details",
	loadComplete: function() {
		var table = this;
		setTimeout(function() {
			updatePagerIcons(table);
		}, 0);
	},
	onCellSelect: function(rowid, iCol, cellcontent) {
		var rowData = $(this).jqGrid("getRowData", rowid);
		if (iCol == 4) {
			$("#" + current_active_dialog_id).trigger("search_event_success", {'rowid': rowid, "iCol": iCol, "cellcontent": cellcontent, "rowData": rowData});
		}
	}
});
$("#pre-active").on("shown.bs.modal", function() {
	//alert("tickly");
	$(window).trigger("resize.jqGrid1");
});
var grid_selector = "#pre-active-grid";
$(window).on('resize.jqGrid1', function() {
	//alert("tickly tickly");
	//console.log($("#pre-active .modal-dialog .preactive_grid_wrapper").width());
	$(grid_selector).jqGrid('setGridWidth',$("#pre-active .modal-dialog .preactive_grid_wrapper").width()-20);
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

function resize_search_grid(){
    var grid_selector = "#searchgrid";
    $(window).on('resize.jqGrid_search', function() {
        $(grid_selector).jqGrid('setGridWidth', $("#global_search_grid_size").width());
    });
    //resize on sidebar collapse/expand
    $(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
        if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
            setTimeout(function() {
                $(grid_selector).jqGrid('setGridWidth', $("#global_search_grid_size").width());
            }, 0);
        }
    });
}

function bootbox_confirm(title,message){
	bootbox.confirm({
		title: title,
		message: message,
		buttons: {
			confirm: {
				label: 'ok',
				className: 'btn-danger pull-right'
			}
		},
		callback: function(result) {
			if (result) {
				location.reload();
			}
		}
	});
}

	
//  $(document).ajaxStart(function() {
//	  alert("testing");
//		showSpinner("Please wait. Loading...");
//   });
      
  $(document).ajaxSend(function() {
	  //alert("welcome");
		showSpinner("Please wait. Loading...");
   });

$(document).ajaxComplete(function(event, xhr, settings) {
		hideSpinner();
	var data = JSON.parse(xhr.responseText);
	if (data.status == "logout") {
		window.location="index.php?r=login/index";
	}
   });
  
  
  window.onerror = function(msg, url, linenumber) {
	  hideSpinner();
      console.log('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
      return true;
   };
   
   
   $(".modal").on("show.bs.modal",function(){
	   $(this).parent().addClass("modal-open");
	   console.log($('body').css("overflow"));
	   $('body').css("overflow","hidden");
	});

	$(".modal").on("hide.bs.modal",function(){
		 $(this).parent().removeClass("modal-open");
		 console.log($('body').css("overflow"));
		 if($('.modal.in').length != 0){
			$('body').css("overflow","visible");
       }
  });
