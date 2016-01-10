/**
Address editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class address
@extends abstractinput
@final
@example
<a href="#" id="address" data-type="address" data-pk="1">awesome</a>
<script>
$(function(){
    $('#address').editable({
        url: '/post',
        title: 'Enter city, street and building #',
        value: {
            city: "Moscow", 
            street: "Lenina", 
            building: "15"
        }
    });
});
</script>
**/
(function ($) {
    "use strict";
    
    var Fullname= function(options){
        this.init('fullname',options,Fullname.defaults);
    };
    
    
    var Address = function (options) {
        this.init('address', options, Address.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Address, $.fn.editabletypes.abstractinput);
    $.fn.editableutils.inherit(Fullname, $.fn.editabletypes.abstractinput);


    $.extend(Address.prototype, {
        /**
        Renders input from tpl

        @method render() 
        **/        
        render: function() {
           this.$input = this.$tpl.find('input');
        },
        
        /**
        Default method to show value in element. Can be overwritten by display option.
        
        @method value2html(value, element) 
        **/
        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return; 
            }
            //var html = $('<div>').text(value.city).html() + ', ' + $('<div>').text(value.street).html() + ' st., bld. ' + $('<div>').text(value.building).html();
            var html = $('<div> ').text($.trim(value.flat_no)).html() + ' ' + $('<div>').text($.trim(value.building)).html() + '<br /> '+ $('<div>').text($.trim(value.street)).html()+ '  ' + $('<div>').text($.trim(value.location)).html() +' '+$('<div>').text($.trim(value.city)).html()+' <br /> '+$('<div>').text($.trim(value.state)).html() +' <br />' +$('<div>').text($.trim(value.country)).html()+ '. <br />  Pin code : '+$('<div>').text($.trim(value.pincode)).html();
            $(element).html(html); 
        },
        /**
        Gets value from element's html
        
        @method html2value(html) 
        **/        
        html2value: function(html) {        
          /*
            you may write parsing method to get value by element's html
            e.g. "Moscow, st. Lenina, bld. 15" => {city: "Moscow", street: "Lenina", building: "15"}
            but for complex structures it's not recommended.
            Better set value directly via javascript, e.g. 
            editable({
                value: {
                    city: "Moscow", 
                    street: "Lenina", 
                    building: "15"
                }
            });
          */ 
          return null;  
        },
      
       /**
        Converts value to string. 
        It is used in internal comparing (not for sending to server).
        
        @method value2str(value)  
       **/
       value2str: function(value) {
           var str = '';
           if(value) {
               for(var k in value) {
                   str = str + k + ':' + value[k] + ';';  
               }
           }
           return str;
       }, 
       
       /*
        Converts string to value. Used for reading value from 'data-value' attribute.
        
        @method str2value(str)  
       */
       str2value: function(str) {
           /*
           this is mainly for parsing value defined in data-value attribute. 
           If you will always set value by javascript, no need to overwrite it
           */
           return str;
       },
       /**
        Sets value of input.
        
        @method value2input(value) 
        @param {mixed} value
       **/         
       value2input: function(value) {
           if(!value) {
             return;
           }
           this.$input.filter('[name="pincode"]').val($.trim(value.pincode));
           this.$input.filter('[name="area"]').val($.trim(value.area));
           this.$input.filter('[name="location"]').val($.trim(value.location)); 
           this.$input.filter('[name="street"]').val($.trim(value.street)); 
           this.$input.filter('[name="building"]').val($.trim(value.building));
           this.$input.filter('[name="flat_no"]').val($.trim(value.flat_no)),
           this.$input.filter('[name="city"]').val($.trim(value.city));
           this.$input.filter('[name="state"]').val($.trim(value.state));
           this.$input.filter('[name="country"]').val($.trim(value.country));
       },       
       
       /**
        Returns value of input.
        
        @method input2value() 
       **/          
       input2value: function() { 
           return {
              pincode:this.$input.filter('[name="pincode"]').val(),
              area:this.$input.filter('[name="area"]').val(),
              location: this.$input.filter('[name="location"]').val(), 
              street: this.$input.filter('[name="street"]').val(), 
              building: this.$input.filter('[name="building"]').val(),
              flat_no: this.$input.filter('[name="flat_no"]').val(),
              city: this.$input.filter('[name="city"]').val(), 
              state: this.$input.filter('[name="state"]').val(), 
              country: this.$input.filter('[name="country"]').val()
           };
       },        
       
        /**
        Activates input: sets focus on the first field.
        
        @method activate() 
       **/        
       activate: function() {
            this.$input.filter('[name="pincode"]').focus();
            this.$input.filter('[name="pincode"]').blur();
            this.$input.filter('[name="area"]').blur();
            this.$input.filter('[name="street"]').blur();
            this.$input.filter('[name="building"]').blur();
            //alert("setting output...");
       },  
       
       /**
        Attaches handler to submit form in case of 'showbuttons=false' mode
        
        @method autosubmit() 
       **/       
       autosubmit: function() {
           this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
           });
       }       
    });
    
    $.extend(Fullname.prototype, {
        /**
        Renders input from tpl

        @method render() 
        **/        
        render: function() {
           this.$input = this.$tpl.find('input');
        },
        
        /**
        Default method to show value in element. Can be overwritten by display option.
        
        @method value2html(value, element) 
        **/
        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return; 
            }
     
            var html = $('<div>').text($.trim(value.salutation)).val() + ' ' + $('<div>').text($.trim(value.firstname)).html() + '  ' + $('<div>').text($.trim(value.middlename)).html()+ '  ' + $('<div>').text($.trim(value.lastname)).html();
            $(element).html(html); 
        },
        
        /**
        Gets value from element's html
        
        @method html2value(html) 
        **/        
        html2value: function(html) {        
          /*
            you may write parsing method to get value by element's html
            e.g. "Moscow, st. Lenina, bld. 15" => {city: "Moscow", street: "Lenina", building: "15"}
            but for complex structures it's not recommended.
            Better set value directly via javascript, e.g. 
            editable({
                value: {
                    city: "Moscow", 
                    street: "Lenina", 
                    building: "15"
                }
            });
          */ 
          return null;  
        },
      
       /**
        Converts value to string. 
        It is used in internal comparing (not for sending to server).
        
        @method value2str(value)  
       **/
       value2str: function(value) {
           var str = '';
           if(value) {
               for(var k in value) {
                   str = str + k + ':' + value[k] + ';';  
               }
           }
           return str;
       }, 
       
       /*
        Converts string to value. Used for reading value from 'data-value' attribute.
        
        @method str2value(str)  
       */
       str2value: function(str) {
           /*
           this is mainly for parsing value defined in data-value attribute. 
           If you will always set value by javascript, no need to overwrite it
           */
           return str;
       },                
       
       /**
        Sets value of input.
        
        @method value2input(value) 
        @param {mixed} value
       **/         
       value2input: function(value) {
           if(!value) {
             return;
           }
           //this.$input.filter('[name="salutation"]').val(value.salutation);
           this.$input.filter('[name="firstname"]').val($.trim(value.firstname));
           this.$input.filter('[name="middlename"]').val($.trim(value.middlename));
           this.$input.filter('[name="lastname"]').val($.trim(value.lastname));
       },       
       
       /**
        Returns value of input.
        
        @method input2value() 
       **/          
       input2value: function() { 
           return {
              //salutation: this.$input.filter('[name="salutation"]').val(), 
              firstname: this.$input.filter('[name="firstname"]').val(), 
              middlename: this.$input.filter('[name="middlename"]').val(),
              lastname: this.$input.filter('[name="lastname"]').val()
           
           };
       },        
       
        /**
        Activates input: sets focus on the first field.
        
        @method activate() 
       **/        
       activate: function() {
            this.$input.filter('[name="firstname"]').focus();
            //this.$input.filter('[name="city"]').focus();
       },  
       
       /**
        Attaches handler to submit form in case of 'showbuttons=false' mode
        
        @method autosubmit() 
       **/       
       autosubmit: function() {
           this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
           });
       }       
    });
    
    /*Fullname.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div class="editable-address"><label><span>Salutation: </span><input type="text" name="salutation" class="input-small"></label></div>'+
             '<div class="editable-address"><label><span>First name: </span><input type="text" name="firstname" class="input-small"></label></div>'+
             '<div class="editable-address"><label><span>Middle name: </span><input type="text" name="middlename" class="input-mini"></label></div>'+
             '<div class="editable-address"><label><span>Last name: </span><input type="text" name="lastname" class="input-mini"></label></div>',
        inputclass: ''
    });

    $.fn.editabletypes.fullname = Fullname;
*/
    //'<div class="editable-address"><label><span>Salutation: </span><input type="text" name="salutation" class="input-mini"></label></div>'+
    Fullname.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div class="editable-address"><label><span>First name: </span><input type="text" name="firstname" class="input-small"></label></div>'+
             '<div class="editable-address"><label><span>Middle name: </span><input type="text" name="middlename" class="input-small"></label></div>'+
             '<div class="editable-address"><label><span>Last name: </span><input type="text" name="lastname" class="input-small"></label></div>',
        inputclass: ''
    });

    $.fn.editabletypes.fullname = Fullname;
    
    Address.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div class="editable-address"><label><span>Pincode: </span><input type="text" name="pincode" id="pincode" maxlength="6" class="input-small" onblur="onZipCodeChange(areaId);return false;"></label></div>'+
             '<div class="editable-address"><label><span>Area: </span><select name="area" id="area" class="input-small" onchange="onAreaChange(streetId, locationId);return false;"><option val="0">Select</option></select></label></div>'+
             '<div class="editable-address"><label><span>Location: </span><select name="location" id="location" class="input-small input-mini"><option val="0">Select</option></select></label></div>'+
             '<div class="editable-address"><label><span>Street: </span><select name="street" id="street" class="input-small input-mini" onchange="onStreetChange(buildingId);return false;"><option val="0">Select</option></select></label></div>'+
             '<div class="editable-address"><label><span>Building: </span><select name="building" id="building" class="input-small input-mini"><option val="0">Select</option></select></label></div>'+
             '<div class="editable-address"><label><span>Flat & Phase: </span><input type="text" id="flat_no" name="flat_no" class="input-small"></label></div>'+
             '<div class="editable-address"><label><span>City: </span><div id="city" name="city" class="input-small" style="display:inline-block;"></div></label></div>'+
             '<div class="editable-address"><label><span>State: </span><div id="state" name="state" class="input-small"  style="display:inline-block;"></div></label></div>'+
             '<div class="editable-address"><label><span>Country: </span><div id="country" name="country" class="input-small"  style="display:inline-block;"></div></label></div>',
       inputclass: ''
    });
    
    $.fn.editabletypes.address = Address;
}(window.jQuery));