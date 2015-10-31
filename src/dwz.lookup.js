(function($) {
	var _lookup = {
		currentGroup: "",
		suffix: "",
		$target: null,
		pk: "id"
	};
	var _util = {
		_lookupPrefix: function(key) {
			var strDot = _lookup.currentGroup ? "." : "";
			return _lookup.currentGroup + strDot + key + _lookup.suffix;
		},
		lookupPk: function(key) {
			return this._lookupPrefix(key);
		},
		lookupField: function(key) {
			return this.lookupPk(key);
		}
	};

	$.extend({
		lookupBack: function(args) {
			var $box = _lookup['$target'].unitBox();
			$box.find(":input").each(function() {
				var $input = $(this), inputName = $input.attr("name");

				for( var key in args) {
					var name = (_lookup.pk == key) ? _util.lookupPk(key) : _util.lookupField(key);

					if(name == inputName) {
						$input.val(args[key]);
						break;
					}
				}
			});
			$.pdialog.closeCurrent();
		}
	});

	$.fn.extend({
		lookup: function() {
			return this.each(function() {
				var $this = $(this);
				var w = $this.attr("width") || "M";
				var h = $this.attr("height") || "M";
				var options = {
					mask: true,
					width: DWZ.dialogWidth[w] || w,
					height: DWZ.dialogHeight[h] || h,
					maxable: eval($this.attr("maxable") || "true"),
					resizable: eval($this.attr("resizable") || "true")
				};
				$this.click(function(event) {
					_lookup = $.extend(_lookup, {
						currentGroup: $this.attr("lookupGroup") || "",
						suffix: $this.attr("suffix") || "",
						$target: $this,
						pk: $this.attr("lookupPk") || "id"
					});

					var url = unescape($this.attr("href")).replaceTmById($(event.target).unitBox());
					if(!url.isFinishedTm()) {
						alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
						return false;
					}

					$.pdialog.open(url, "_blank", $this.attr("title") || $this.text(), options);
					return false;
				});
			});
		},
		multLookup: function() {
			return this.each(function() {
				var $this = $(this), args = {};
				$this.click(function(event) {
					var $unitBox = $this.unitBox();
					$unitBox.find("[name='" + $this.attr("multLookup") + "']").filter(":checked").each(function() {
						var _args = DWZ.jsonEval($(this).val());
						for( var key in _args) {
							var value = args[key] ? args[key] + "," : "";
							args[key] = value + _args[key];
						}
					});

					if($.isEmptyObject(args)) {
						alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
						return false;
					}
					$.lookupBack(args);
				});
			});
		}
	});
})(jQuery);
