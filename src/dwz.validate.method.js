(function($) {
	if($.validator) {
		var match = function(value, pattern, attrs) {
			if(value) {
				if(pattern instanceof RegExp) {
					return pattern.test(value);
				} else {
					attrs = attrs || "g";
					var ex = new RegExp(pattern, attrs);
					return ex.test(value);
				}
			}
			return true;
		};

		var getTarget = function(element, param) {
			var form = $(element).closest("form");
			var target = form.find("[name=" + param + "]");
			if(target.length == 0) {
				target = $(param, form);
			}
			return target;
		};

		$.validator.addMethod("alphanumeric", function(value, element) {
			return this.optional(element) || match(value, /^\w+$/i);
		}, "请输入字母、数字、下划线。");

		$.validator.addMethod("lettersonly", function(value, element) {
			return this.optional(element) || match(value, /^[a-z]+$/i);
		}, "请输入字母。");

		$.validator.addMethod("phone", function(value, element) {
			return this.optional(element) || match(value, /^[0-9 \(\)]{7,30}$/);
		}, "请输入正确格式的电话号码。");

		$.validator.addMethod("postcode", function(value, element) {
			return this.optional(element) || match(value, /^[0-9 A-Za-z]{5,20}$/);
		}, "请输入正确格式的邮政编码。");

		$.validator.addMethod("date", function(value, element) {
			value = value.replace(/\s+/g, "");
			var $input = $(element);
			var pattern = $input.attr('dateFmt') || 'yyyy-MM-dd';
			return !value || value.parseDate(pattern);
		}, "请输入正确格式的日期。");

		$.validator.addMethod("time", function(value, element) {
			value = value.replace(/\s+/g, "");
			var $input = $(element);
			var pattern = $input.attr('timeFmt') || 'HH:mm';
			return !value || value.parseDate(pattern);
		}, "请输入正确格式的时间。");

		$.validator.addMethod("price", function(value, element) {
			return this.optional(element) || match(value, /^\d+[\.]?\d{0,2}$/);
		}, "请输入正确格式的价格。");

		$.validator.addMethod("params", function(value, element) {
			return this.optional(element) || match(value, /^\s*[^\s=]+[ ]*=[ ]*[^\s=]+\s*$|^\s*[^\s=]+[ ]*=[ ]*[^\s=]+\s*\n+(\s*[^\s=]+[ ]*=[ ]*[^\s=]+\s*\n)*(\s*[^\s=]+[ ]*=[ ]*[^\s=]+\s*)$/g);
		}, "请输入正确格式的参数。");

		$.validator.addMethod("eqTo", function(value, element, param) {
			var target = getTarget(element, param);
			return value === target.val();
		}, "请再次输入相同的值。");

		$.validator.addMethod("gtTo", function(value, element, param) {
			var target = getTarget(element, param);
			if(value && target.val()) {
				return parseFloat(value) > parseFloat(target.val());
			}
			return true;
		}, "截止值必须大于起始值。");

		$.validator.addMethod("geTo", function(value, element, param) {
			var target = getTarget(element, param);
			if(value && target.val()) {
				return parseFloat(value) >= parseFloat(target.val());
			}
			return true;
		}, "截止值必须大于等于起始值。");

		$.validator.addMethod("gtToDate", function(value, element, param) {
			var endDate = $(element);
			var startDate = getTarget(element, param);
			var endDatePattern = endDate.attr("dateFmt") || "yyyy-MM-dd";
			var startDatePattern = startDate.attr("dateFmt") || "yyyy-MM-dd";

			if(endDate.val() && startDate.val()) {
				return endDate.val().parseDate(endDatePattern) > startDate.val().parseDate(startDatePattern);
			}
			return true;
		}, "截止日期必须大于起始日期。");

		$.validator.addMethod("geToDate", function(value, element, param) {
			var endDate = $(element);
			var startDate = getTarget(element, param);
			var endDatePattern = endDate.attr("dateFmt") || "yyyy-MM-dd";
			var startDatePattern = startDate.attr("dateFmt") || "yyyy-MM-dd";

			if(endDate.val() && startDate.val()) {
				return endDate.val().parseDate(endDatePattern) >= startDate.val().parseDate(startDatePattern);
			}
			return true;
		}, "截止日期必须大于等于起始日期。");

		$.validator.addMethod("gtToTime", function(value, element, param) {
			var endTime = $(element);
			var startTime = getTarget(element, param);
			var endTimePattern = endTime.attr("timeFmt") || "HH:mm";
			var startTimePattern = startTime.attr("timeFmt") || "HH:mm";

			if(endDate.val() && startDate.val()) {
				return endTime.val().parseDate(endTimePattern) > startTime.val().parseDate(startTimePattern);
			}
			return true;
		}, "截止时间必须大于起始时间。");

		$.validator.addMethod("geToTime", function(value, element, param) {
			var endTime = $(element);
			var startTime = getTarget(element, param);
			var endTimePattern = endTime.attr("timeFmt") || "HH:mm";
			var startTimePattern = startTime.attr("timeFmt") || "HH:mm";

			if(endDate.val() && startDate.val()) {
				return endTime.val().parseDate(endTimePattern) >= startTime.val().parseDate(startTimePattern);
			}
			return true;
		}, "截止时间必须大于等于起始时间。");

		/*
		 * 自定义js函数验证 <input type="text" name="xxx" customvalid="xxxFn(element)" title="xxx" />
		 */
		$.validator.addMethod("customvalid", function(value, element, params) {
			try {
				return eval('(' + params + ')');
			} catch(e) {
				return false;
			}
		}, "请修正该字段信息。");

		$.validator.addClassRules({
			date: {
				date: true
			},
			alphanumeric: {
				alphanumeric: true
			},
			lettersonly: {
				lettersonly: true
			},
			phone: {
				phone: true
			},
			postcode: {
				postcode: true
			},
			time: {
				time: true
			},
			price: {
				price: true
			},
			params: {
				params: true
			}
		});
		$.validator.setDefaults({
			errorElement: "span",
			errorPlacement: function(error, element) {
				error.addClass("fa fa-bell-o red");
				if(element.hasClass("hideError")) {
					element.attr("title", error.text());
				} else {
					element.parent().append(error);
					error.attr("title", error.text());
				}
				error.empty();
			}
		});
		$.validator.autoCreateRanges = true;
		$.validator.prototype.showLabel = function(element, message) {
			var label = this.errorsFor(element);
			if(label.length) {
				label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
				label.html(message).attr("title", message);
			} else {
				label = $("<" + this.settings.errorElement + ">");
				label.attr("for", this.idOrName(element));
				label.addClass(this.settings.errorClass);
				label.html(message || "").attr("title", message || "");
				if(this.settings.wrapper) {
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if(!this.labelContainer.append(label).length) {
					if(this.settings.errorPlacement) {
						this.settings.errorPlacement(label, $(element));
					} else {
						label.insertAfter(element);
					}
				}
			}
			if(!message && this.settings.success) {
				label.text("").attr("title", "");
				if(typeof this.settings.success === "string") {
					label.addClass(this.settings.success);
				} else {
					this.settings.success(label, element);
				}
			}
			this.toShow = this.toShow.add(label);
		}
	}
})(jQuery);