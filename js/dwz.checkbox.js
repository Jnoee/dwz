/**
 * @author ZhangHuihua@msn.com
 */
(function($) {
	$.fn.extend({
		checkboxCtrl: function(parent) {
			return this.each(function() {
				var $parent = $(parent || document);
				var $box = $(this).attr("box");
				if($box) {
					$parent = $(this).closest($box);
				}
				
				var $checkAllBtn = $(this);
				var group = $(this).attr("group").escape();
				var $checkboxs = $parent.find(":checkbox[name=" + group + "]");
				
				$(this).bind("checkSelected", function() {
					var $checkedCheckboxs = $parent.find(":checkbox[name=" + group + "]:checked");
					if($checkboxs.size() > 0 && $checkedCheckboxs.size() == $checkboxs.size()) {
						$(this).attr("checked", true);
					} else {
						$(this).attr("checked", false);
					}
				});
				
				$(this).click(function() {
					if($(this).is(":checkbox")) {
						var type = $(this).is(":checked") ? "all" : "none";
						if(group)
							$.checkbox.select(group, type, $parent);
					} else {
						if(group)
							$.checkbox.select(group, $(this).attr("selectType") || "all", $parent);
					}

				});
				
				$checkboxs.each(function() {
					$(this).click(function() {
						$checkAllBtn.trigger("checkSelected");
					});
				});

				$(this).trigger("checkSelected");
			});
		}
	});

	$.checkbox = {
		selectAll: function(_name, _parent) {
			this.select(_name, "all", _parent);
		},
		unSelectAll: function(_name, _parent) {
			this.select(_name, "none", _parent);
		},
		selectInvert: function(_name, _parent) {
			this.select(_name, "invert", _parent);
		},
		select: function(_name, _type, $parent) {
			$checkboxLi = $parent.find(":checkbox[name='" + _name + "']");
			switch(_type) {
				case "invert":
					$checkboxLi.each(function() {
						$checkbox = $(this);
						$checkbox.attr('checked', !$checkbox.is(":checked"));
					});
					break;
				case "none":
					$checkboxLi.attr('checked', false);
					break;
				default:
					$checkboxLi.attr('checked', true);
					break;
			}
		}
	};
})(jQuery);
