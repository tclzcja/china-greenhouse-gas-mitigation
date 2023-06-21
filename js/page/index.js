// jshint browser: true

var Current_Year = 0;
var Current_Use = 0;
var Data;
var Data_Backup;

var Data_Consumption_R_Base = 150;
var Data_Consumption_Base = 100000;

var Data_Pollution_CH4_Base = 500000000;
var Data_Pollution_CO2_Base = 5000000000;
var Data_Pollution_N2O_Base = 500000000;

var Data_Pollution_R_CH4_Base = 50;
var Data_Pollution_R_CO2_Base = 8;
var Data_Pollution_R_N2O_Base = 50;

var Data_Carbon_Footprint_R_Base = 200;

var $ = window.$;
var Pool = window.Pool;

$(document).ready(function () {
	Pool.Load("china.green.house.gas.mitigation.natural.gas.for.coal", function (data) {
		Data = JSON.parse(JSON.stringify(data));
		Data_Backup = JSON.parse(JSON.stringify(data));
		Prepare();
	});
});

function Prepare() {
	for (var i = 2000; i < 2013; i++) {
		var D = document.createElement("div");
		$(D)
			.html(i)
			.attr("data-index", i - 2000);
		$("#use-year").append(D);
	}
	$("#use-year div:first-child").addClass("active");

	$("#use-year div").on("click", function () {
		Current_Year = parseInt($(this).attr("data-index"));
		Loop_Year();
	});

	$(document).on("keydown", function (event) {
		event.preventDefault();

		if (event.which == 37 && Current_Year > 0) {
			Current_Year--;
			Loop_Year();
		}

		if (event.which == 39 && Current_Year < 12) {
			Current_Year++;
			Loop_Year();
		}

		if (event.which == 40) {
			$("#calculator").val(parseFloat($("#calculator").val()) - 10000);
			Render_Calculator();
		}

		if (event.which == 38) {
			$("#calculator").val(parseFloat($("#calculator").val()) + 10000);
			Render_Calculator();
		}
	});

	$("#calculator")
		.on("change", function () {
			Render_Calculator();
		})
		.bind("keydown", function (event) {
			event.preventDefault();
		});

	Loop_Year();
}

function Loop_Year() {
	$("#use-year div.active").removeClass("active");
	$("#use-year div[data-index='" + Current_Year + "']").addClass("active");
	$("#use-year").css("margin-left", -40 - Current_Year * 80);

	Data = JSON.parse(JSON.stringify(Data_Backup));

	Render();

	$("#calculator").attr("min", parseFloat($("#resource-ng-amount").html()));
	$("#calculator").attr("max", parseFloat($("#resource-coal-amount").html()) + parseFloat($("#resource-ng-amount").html()));
	$("#calculator").val(parseFloat($("#resource-ng-amount").html()));
}

function Render() {
	/* Rendering Consumption */

	var Consumption_All = parseFloat(Data["Resource Consumption"][Current_Year]["Total Consumption"]).toFixed(2);

	$("#use-all").html(Consumption_All);

	var Consumption_NG = parseFloat(Data["Resource Consumption"][Current_Year]["Natural Gas Consumption"]).toFixed(2);
	var Ratio_NG = Math.sqrt(Consumption_NG / Data_Consumption_Base);
	var R_NG = Data_Consumption_R_Base * Ratio_NG;

	var Consumption_Coal = parseFloat(Data["Resource Consumption"][Current_Year]["Coal Consumption"]).toFixed(2);
	var Ratio_Coal = Math.sqrt(Consumption_Coal / Data_Consumption_Base);
	var R_Coal = Data_Consumption_R_Base * Ratio_Coal;

	$("#resource-ng")
		.css("height", R_NG * 2)
		.css("width", R_NG * 2)
		.css("margin-top", 0 - R_NG)
		.css("margin-left", 0 - R_NG);
	$("#resource-coal")
		.css("height", R_Coal * 2)
		.css("width", R_Coal * 2)
		.css("margin-top", 0 - R_Coal)
		.css("margin-left", 0 - R_Coal);

	$("#resource-ng-amount")
		.css("top", $(window).outerHeight() * 0.3 + R_NG)
		.html(Consumption_NG);
	$("#resource-coal-amount")
		.css("top", $(window).outerHeight() * 0.7 + R_Coal)
		.html(Consumption_Coal);
	$("#resource-ng-percentage")
		.html(((Consumption_NG / Consumption_All) * 100).toFixed(2))
		.css("width", $(window).width() * 0.83 - $(window).width() * 0.5 - 200 - R_NG);
	$("#resource-coal-percentage")
		.html(((Consumption_Coal / Consumption_All) * 100).toFixed(2))
		.css("width", $(window).width() * 0.83 - $(window).width() * 0.5 - 200 - R_Coal);

	/* Rendering Pollution */

	var Pollution_Coal_CH4 = parseFloat(Data["Pollution per Consumption"][0].CH4) * Consumption_Coal;
	var Pollution_NG_CH4 = parseFloat(Data["Pollution per Consumption"][1].CH4) * Consumption_NG;
	var Pollution_CH4 = (Pollution_Coal_CH4 + Pollution_NG_CH4).toFixed(2);
	var Ratio_CH4 = Math.sqrt(Pollution_CH4 / Data_Pollution_CH4_Base);
	var R_CH4 = Math.ceil(Data_Pollution_R_CH4_Base * Ratio_CH4);
	$("#pollution-ch4")
		.css("height", R_CH4 * 2)
		.css("width", R_CH4 * 2)
		.css("margin-top", 0 - R_CH4)
		.css("margin-left", 0 - R_CH4);
	$("#pollution-ch4-amount")
		.css("top", $(window).outerHeight() * 0.73 + R_CH4)
		.html((Pollution_CH4 / 1000000).toFixed(2));
	$("#pollution-ch4-percentage").css("width", $(window).width() * 0.7 - $(window).width() * 0.5 - 200 - R_CH4);

	var Pollution_Coal_CO2 = parseFloat(Data["Pollution per Consumption"][0].CO2) * Consumption_Coal;
	var Pollution_NG_CO2 = parseFloat(Data["Pollution per Consumption"][1].CO2) * Consumption_NG;
	var Pollution_CO2 = (Pollution_Coal_CO2 + Pollution_NG_CO2).toFixed(2);
	var Ratio_CO2 = Math.sqrt(Pollution_CO2 / Data_Pollution_CO2_Base);
	var R_CO2 = Math.ceil(Data_Pollution_R_CO2_Base * Ratio_CO2);
	$("#pollution-co2")
		.css("height", R_CO2 * 2)
		.css("width", R_CO2 * 2)
		.css("margin-top", 0 - R_CO2)
		.css("margin-left", 0 - R_CO2);
	$("#pollution-co2-amount")
		.css("top", $(window).outerHeight() * 0.33 + R_CO2)
		.html((Pollution_CO2 / 1000000).toFixed(2));
	$("#pollution-co2-percentage").css("width", $(window).width() * 0.8 - $(window).width() * 0.5 - 200 - R_CO2);

	var Pollution_Coal_N2O = parseFloat(Data["Pollution per Consumption"][0].N2O) * Consumption_Coal;
	var Pollution_NG_N2O = parseFloat(Data["Pollution per Consumption"][1].N2O) * Consumption_NG;
	var Pollution_N2O = (Pollution_Coal_N2O + Pollution_NG_N2O).toFixed(2);
	var Ratio_N2O = Math.sqrt(Pollution_N2O / Data_Pollution_N2O_Base);
	var R_N2O = Math.ceil(Data_Pollution_R_N2O_Base * Ratio_N2O);
	$("#pollution-n2o")
		.css("height", R_N2O * 2)
		.css("width", R_N2O * 2)
		.css("margin-top", 0 - R_N2O)
		.css("margin-left", 0 - R_N2O);
	$("#pollution-n2o-amount")
		.css("top", $(window).outerHeight() * 0.88 + R_N2O)
		.html((Pollution_N2O / 1000000).toFixed(2));
	$("#pollution-n2o-percentage").css("width", $(window).width() * 0.65 - $(window).width() * 0.5 - 200 - R_N2O);

	var FP = parseFloat(Pollution_CH4) * parseFloat(Data["Global Warming Potential"][0].CH4) + parseFloat(Pollution_CO2) * parseFloat(Data["Global Warming Potential"][0].CO2) + parseFloat(Pollution_N2O) * parseFloat(Data["Global Warming Potential"][0].N2O);
	$("#carbon-footprint").html((FP / 1000000).toFixed(0));

	var FP_Ratio_Base = ((FP / 1000000 - 3000000) / 1000000) * 0.1 + 0.2;
	$("#carbon-footprint-bg").css("opacity", FP_Ratio_Base);
}

function Render_Calculator() {
	var V = parseFloat($("#calculator").val());
	var Gap = V - parseFloat(Data["Resource Consumption"][Current_Year]["Natural Gas Consumption"]);
	Data["Resource Consumption"][Current_Year]["Natural Gas Consumption"] = (parseFloat(Data["Resource Consumption"][Current_Year]["Natural Gas Consumption"]) + Gap).toString();
	Data["Resource Consumption"][Current_Year]["Coal Consumption"] = (parseFloat(Data["Resource Consumption"][Current_Year]["Coal Consumption"]) - Gap).toString();

	Render();
}
