
<% // ...  %>

<script type="text/javascript" src="/path/to/scripts/idleTimeoutHandler.js"></script>
<script type="text/javascript">
	var timeout_h = idleTimeoutHandler(20, 30, "/path/to/disconnect.html");
	timeout_h.initialize();
	function pop() { timeout_h.updateTimer(); }
	EPCM.subscribeEvent("urn:com.sapportals:navigation", "Navigate", pop);
	EPCM.subscribeEvent("urn:my.own.portal.event",       "MyEvent",  pop);
</script>

<% // ...  %>
