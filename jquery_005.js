/*
 * A simple jquery plugin to validate the characters typed in a text box
 * HTML element. Every time a key is pressed and if it is a character,
 * then the character is checked against a set of valid or invalid characters.
 *
 * The Valid characters or invalid characters are stored in the attributes
 * 		validchars AND invalidchars
 * attributes of the text box HTML element.
 *
 * 		AUTHOR		: Rajendran Sambasivam, Mobiledin, September 2011
 *
 *		USAGE		: To filter invalid characters
 *						$("selector").validateChars("<invalid characters>", false);
 *
 *					  To allow only valid characters
 *						$("selector").validateChars("<valid characters>", true);
 */
(function ($) {
	jQuery.fn.validateChars = function(characters, validOrNot) {
		if(validOrNot == true) {
			$(this).attr("validchars", characters);
			$(this).removeAttr("invalidchars");
		}
		else {
			$(this).attr("invalidchars", characters);
			$(this).removeAttr("validchars");
		}
		$(this).bind("keypress", textfieldKeyPress);
		$(this).bind("blur", textfieldBlur);
	};
	
	function textfieldKeyPress(evt) {
		if(evt.charCode == 118) return true;
		if(evt.keyCode == 116) return true;
		
		if(evt.charCode == 0 && evt.keyCode < 48)
			return true;
	
		var txt = $(evt.currentTarget);
		var ch = String.fromCharCode(evt.charCode);

		var invalidchars = txt.attr("invalidchars");
		if(invalidchars != undefined) {
			if(invalidchars.indexOf(ch) >= 0)
				return false;
			return true;
		}

		var validchars = txt.attr("validchars");
		if(validchars != undefined) {
			if(validchars.indexOf(ch) >= 0)
				return true;
			return false;
		}
	}

	function textfieldBlur(evt) {
		var txt = $(evt.currentTarget);
		var v = txt.val();
		var old = txt.val();
		var invalidchars = txt.attr("invalidchars");
		if(invalidchars != undefined) {
			for(var i = 0; i < invalidchars.length; i++) {
				var ch = invalidchars.charAt(i);
				while(v.indexOf(ch) >= 0)
					v = v.replace(ch, "");
			}
			txt.val(v);
			if(v =="" && old != ""){
				setTimeout(function(){	
					txt.val("");
					txt.focus();
				},0);	
			}
		}

		var validchars = txt.attr("validchars");
		if(validchars != undefined) {
			var new_val = "";
	
			for(var i = 0; i < v.length; i++) {
				var ch = v.charAt(i);
				if(validchars.indexOf(ch) >= 0)
					new_val += ch;
			}
			txt.val(new_val);
			if(new_val =="" && v != ""){
				setTimeout(function(){
					txt.focus();
				},0);
				
			}
		}
	}
})(jQuery);

