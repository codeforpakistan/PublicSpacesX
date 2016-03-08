MyAppExporter = {
	exportJson: function(json) {
		var blob = new Blob([JSON.stringify(json)]);
		var a = window.document.createElement("a");
	    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
	    a.download = "unidades_export.json";
	    document.body.appendChild(a);
	    a.click();
	    document.body.removeChild(a);
	},

}
