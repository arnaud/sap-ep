
/**
* Custom Timeout Handler
* @param warn_delay Delay until the warning message (in minutes)
* @param kick_delay Delay until the "session timed out" message (in minutes)
*/
var idleTimeoutHandler = function(warn_delay, kick_delay, timeout_popup_url) {
	return {
		debug_mode:         false,                  // Switches the display of the timer (function _displayTimer) [true/false]
		timeout_wait:       1000 * 10,              // Delay for the 'setTimeout' native function
		timeout_warn_delay: 1000 * 60 * warn_delay, // Delay until the warning message
		timeout_kick_delay: 1000 * 60 * kick_delay, // Delay until the timeout message and the effective timeout
		timeout_popup_url:  timeout_popup_url,
		timeout_popup_visible: false,
		/**
		* Initializes the custom portail timeout (called at first time)
		**/
		initialize: function() {
			this.updateTimer();
			setTimeout("timeout_h.checkTimeout()", this.timeout_wait);
		},
		/**
		* Updates the custom portail timeout (called whenever the user navigates in the portal)
		**/
		updateTimer: function() {
			var dt = new Date();
			writeCookie('custom_timeout', dt.getTime());
			if(this.debug_mode) {
				this._displayTimer();
			}
		},
		/**
		* Checks wether the timeout has occured or not ( repeatedly called)
		**/
		checkTimeout: function() {
			var now = new Date();
			var diff = now.getTime() - this._getTimerStart();
			if(diff <= this.timeout_warn_delay && this.timeout_popup_visible) {
				this.timeout_popup_visible = false;
			} else if(diff > this.timeout_warn_delay && !this.timeout_popup_visible) {
				var cx = document.body.clientWidth / 2;
				var cy = document.body.clientHeight / 2;
				if(!this.timeout_popup_visible) {
					window.open(
            this.timeout_popup_url,
            "",
            "left="+(cx-260)+"; top="+(cy-135)+"; width=520; height=270; " +
            "toolbar=no; location=no; directories=no; status=no; " +
            "menubar=no; scrollbars=no; resizable=yes"
          );
					this.timeout_popup_visible = true;
				}
			}
			setTimeout("timeout_h.checkTimeout()", this.timeout_wait);
			if(this.debug_mode) {
				this._displayTimer( diff + " > " + this.timeout_kick_delay + " ? " + (diff > this.timeout_kick_delay) );
			}
		},
		/**
		*
		*/
		_getTimerStart: function() {
			var timeout_start = parseInt(readCookie('custom_timeout'));
			return new Date(timeout_start);
		},
		/**
		* Displays the timer informations in the window status bar
		**/
		_displayTimer: function(message) {
			var dt = this._getTimerStart();
			var timer_start_string = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
			if(message && message!=null && message!="") {
				window.status = timer_start_string + " - " + message;
			} else {
				window.status = timer_start_string;
			}
		},
		/**
		* Refreshes the portal page content
		**/
		_refreshPage: function() {
			try {
				frameworkSupport.refreshContentArea();
			} catch(e) {
				document.location.reload()
			}
		},
		/**
		* Subscribes to an EPCM event
		**/
		addListener: function(urn, action) {
			EPCM.subscribeEvent(urn, action, this.updateTimer);
		},
		/**
		* Called from the disconnection popup, when clicking on the "OK" button
		**/
		stayAlive: function() {
			this._refreshPage();
			this.updateTimer();
			this.timeout_popup_visible = false;
			setTimeout("timeout_h.checkTimeout()", this.timeout_wait);
		}
	}
}


// cookies functions

function writeCookie(name, value) {
	document.cookie = name + "=" + escape(value);
}
function readCookie(name) {
	var arg = name+'=';
	var alen = arg.length;
	var clen = document.cookie.length;
	var i=0;
	while (i < clen){
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
		i=document.cookie.indexOf(' ', i) + 1;
		if (i == 0) break;
	}
	return null;
}
function getCookieVal(offset){
	var endstr = document.cookie.indexOf (';', offset);
	if (endstr == -1) endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}