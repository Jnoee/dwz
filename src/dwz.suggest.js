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
		suggestBack: function(args) {
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
		}
	});

	$.fn.extend({
		suggest: function() {
			var op = {
				suggest$: "#suggest",
				suggestShadow$: "#suggestShadow"
			};
			var selectedIndex = -1;
			return this.each(function() {
				var $input = $(this).attr('autocomplete', 'off').keydown(function(event) {
					if(event.keyCode == DWZ.keyCode.ENTER && $(op.suggest$).is(':visible'))
						return false; // 屏蔽回车提交
				});

				var suggestFields = $input.attr('suggestFields').split(",");

				function _show(event) {
					var offset = $input.offset();
					var iTop = offset.top + this.offsetHeight;
					var $suggest = $(op.suggest$);
					if($suggest.size() == 0)
						$suggest = $('<div id="suggest"></div>').appendTo($('body'));

					$suggest.css({
						left: offset.left + 'px',
						top: iTop + 'px'
					}).show();

					_lookup = $.extend(_lookup, {
						currentGroup: $input.attr("lookupGroup") || "",
						suffix: $input.attr("suffix") || "",
						$target: $input,
						pk: $input.attr("lookupPk") || "id"
					});

					var url = unescape($input.attr("suggestUrl")).replaceTmById($(event.target).unitBox());
					if(!url.isFinishedTm()) {
						alertMsg.error($input.attr("warn") || DWZ.msg("alertSelectMsg"));
						return false;
					}

					var postData = {};
					postData[$input.attr("postField") || "inputValue"] = $input.val();

					$.ajax({
						global: false,
						type: 'POST',
						dataType: "json",
						url: url,
						cache: false,
						data: postData,
						success: function(response) {
							if(!response)
								return;
							var html = '';

							$.each(response, function(i) {
								var liAttr = '', liLabel = '';

								for(var i = 0; i < suggestFields.length; i++) {
									var str = this[suggestFields[i]];
									if(str) {
										if(liLabel)
											liLabel += '-';
										liLabel += str;
									}
								}
								for( var key in this) {
									if(liAttr)
										liAttr += ',';
									liAttr += key + ":'" + this[key] + "'";
								}
								html += '<li lookupAttrs="' + liAttr + '">' + liLabel + '</li>';
							});

							var $lis = $suggest.html('<ul>' + html + '</ul>').find("li");
							$lis.hoverClass("selected").click(function() {
								_select($(this));
							});
							if($lis.size() == 1 && event.keyCode != DWZ.keyCode.BACKSPACE) {
								_select($lis.eq(0));
							} else if($lis.size() == 0) {
								var jsonStr = "";
								for(var i = 0; i < suggestFields.length; i++) {
									if(_util.lookupField(suggestFields[i]) == event.target.name) {
										break;
									}
									if(jsonStr)
										jsonStr += ',';
									jsonStr += suggestFields[i] + ":''";
								}
								jsonStr = "{" + _lookup.pk + ":''," + jsonStr + "}";
								$.suggestBack(DWZ.jsonEval(jsonStr));
							}
						},
						error: function() {
							$suggest.html('');
						}
					});

					$(document).bind("click", _close);
					return false;
				}
				function _select($item) {
					var jsonStr = "{" + $item.attr('lookupAttrs') + "}";
					$.suggestBack(DWZ.jsonEval(jsonStr));
				}
				function _close() {
					$(op.suggest$).html('').hide();
					selectedIndex = -1;
					$(document).unbind("click", _close);
				}

				$input.focus(_show).click(false).keyup(function(event) {
					var $items = $(op.suggest$).find("li");
					switch(event.keyCode) {
						case DWZ.keyCode.ESC:
						case DWZ.keyCode.TAB:
						case DWZ.keyCode.SHIFT:
						case DWZ.keyCode.HOME:
						case DWZ.keyCode.END:
						case DWZ.keyCode.LEFT:
						case DWZ.keyCode.RIGHT:
							break;
						case DWZ.keyCode.ENTER:
							_close();
							break;
						case DWZ.keyCode.DOWN:
							if(selectedIndex >= $items.size() - 1)
								selectedIndex = -1;
							else
								selectedIndex++;
							break;
						case DWZ.keyCode.UP:
							if(selectedIndex < 0)
								selectedIndex = $items.size() - 1;
							else
								selectedIndex--;
							break;
						default:
							_show(event);
					}
					$items.removeClass("selected");
					if(selectedIndex >= 0) {
						var $item = $items.eq(selectedIndex).addClass("selected");
						_select($item);
					}
				});
			});
		}
	});
})(jQuery);