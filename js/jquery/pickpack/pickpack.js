(function ($) {
	var xmlUrl = "http://partner.pickpackpont.hu/stores/storelist.xml";
	var baseElementId = "s_method_pickpackshipping_";
	var selectedShopId = 0;


    onComplete = function (results) {
	    loadPickPackData(results[0].d);
	}

	$(document).ready(function () {
	    //Sys.Net.WebServiceProxy.invoke(xmlUrl, null, true, null, onComplete);
	    $.getJSON(xmlUrl+"?callback=?");
	});



	function createXmlDOMObject(xml) {
	    var xmlDoc = null;

	    if (!window.DOMParser) {
	        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	        xmlDoc.async = false;
	        xmlDoc.loadXML(xml);
	    }
	    else {
	        parser = new DOMParser();
	        xmlDoc = parser.parseFromString(xml, "text/xml");
	    }

	    return xmlDoc;
	}



	loadPickPackData = function(xml) {
        // A lista eltárolása oltalbetöltődéskor
		if (typeof($.storedXml) == 'undefined') {
			$.storedXml = xml;
		}
        // Eltárolt lista használata
		if (xml == undefined) {
			xml = $.storedXml;
		}
        //Még nem töltődött be a fizetési mód ajaxszal
		if(!$('#'+baseElementId).length) {
			return;
		}
		//Már létre vannak hozva az elemek - hívás másodjára
		if($('.store-select').length) {
			return;
		}
		//Elemek létrehozása
	    var xmlDoc = createXmlDOMObject(xml);

	    // Megyeválasztó Lista
	    var elementToAppend = $('<div class="pickpack-wrapper"></div>').appendTo($('#'+baseElementId).parent());
	    //elementToAppend.css({border:'1px solid red'});
	    if (window.console) {
			//console.log(elementToAppend);
	    }
	    var countySelect = $('<select>').attr('id', 'pick-packCountySelect').append('<option value="0">Kérjük válasszon megyét!</option>').appendTo(elementToAppend);
	    var countyList = $('<ul>').attr('id','pick-packCounties').appendTo(elementToAppend);

	    var countyCounter = 0;
	    var cityCounter = 0;
	    var storeCounter = 0;
	    $(xmlDoc).find('county').each(function (index, item) {
    		countyCounter++;
	        var countyname = $(this).find('name').text();
	        // Megyeelem hozzáadás a megyeválasztó listához
	        countySelect.append('<option value="'+countyCounter+'">'+countyname+'</option>');
	        // Megye hozzáadása a megyelistához
	        var county = $('<li class="county">').attr('id','county-'+countyCounter).appendTo(countyList);
	        // Városválasztó select létrehozása a megyéhez
	        var citySelect = $('<select class="city-select" name="city[]" id="city-select-'+countyCounter+'">').append('<option value="0">Kérjük válasszon várost vagy kerületet!</option>').appendTo(county)
	        // Városlista létrehozása a megyéhez
	        var cityList = $('<ul class="cities" id="citites-of-'+countyCounter+'">').appendTo(county);
	        $(this).find('location').each(function (index2, item2) {
        		cityCounter++;
        		var locationname = $(this).find('locationname').text();
        		// A településválasztó feltöltése Városnevekkel
        		citySelect.append('<option value="'+cityCounter+'">'+locationname+'</option>');
        		// Város hozzáadása a városlistához
        		var city = $('<li class="city">').attr('id','city-'+cityCounter).appendTo(cityList);
        		// A boltválasztó létrehozása, és hozzáfűzése a város listaelemhez
        		var storeSelect = $('<select name="stores[]" class="store-select" id="stores-select-'+cityCounter+'">').append('<option value="0">Kérjük válasszon boltot!</option>').appendTo(city);

	            $(this).find('store').each(function (index3, item3) {
            		storeCounter++
	                var storename = $(this).find('title').text();
	                var address = $(this).find('address').text();
	                var type = $(this).find('type').text();
	                var id = $(this).find('id').text();
	               // A városok boltlistájának feltöltése
	               storeSelect.append('<option value="'+id+'">'+storename+' '+address+'</option>');

	            });

	        });

	    });

	    //$('#pick-packCountySelect, .city-select, .store-select').addClass('required-entry');


	    $('<input id="pickpackStoreText" name="pickpackStoreText" type="hidden" value="0" />').insertAfter('#'+baseElementId);
	    $('<input id="pickpackStoreCode" name="pickpackStoreCode" type="hidden" value="0" />').insertAfter('#'+baseElementId);
	    $('.county, .city').hide();
	    $('#pick-packCountySelect').change(function() {
    		var optionVal = $(this).find(":selected").val();
    		$('.county').fadeOut();
    		$('.city').fadeOut();
    		$('#county-'+optionVal).fadeIn();
    		resetSelection();
    		//$(".city option[index='0']").find().attr("selected", "selected");
  		});
  		 $('.city-select').change(function() {
    		var optionVal = $(this).find(":selected").val();
    		$('.city').fadeOut();
    		$('#city-'+optionVal).fadeIn();
    		resetSelection();
    		//$(".city option[index='0']").find().attr("selected", "selected");
  		});
		$('.store-select').change(function() {
			 $('#pickpackStoreText').attr('value',($(this).find(":selected").text()));
			 $('#pickpackStoreCode').attr('value',($(this).find(":selected").val()));
			 pickpackAfterSelect();
			 //Pickpack kiválasztása
			 $('#'+baseElementId).attr('checked','checked');
		});


        $('input[name=shipping_method]').click(function() {
			pickpackAfterSelect();
        })


		function resetSelection() {
			 $('#pickpackStoreText').attr('value','0');
			 $('#pickpackStoreCode').attr('value','0');
			 pickpackAfterReset();
		}


		// Vásárlás gomb vezérlése
 		function pickpackAfterSelect() {
			 if (parseInt($('#pickpackStoreCode').val()) != 0) {
				$("#shipping-method-buttons-container .button").show();
			 } else {
				pickpackAfterReset();
			 }
		}

		function pickpackAfterReset() {

			if ($('#'+baseElementId) && $('#'+baseElementId).filter(':checked').length && $('#'+baseElementId).filter(':checked').is(':checked')) {
				$("#shipping-method-buttons-container .button").hide();
			} else {
				$("#shipping-method-buttons-container .button").show();
			}
		}
        //init
		pickpackAfterReset();

	}

})(jQuery)