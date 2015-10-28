/**
 * @author ZhangHuihua@msn.com
 */
(function($) {
	$.extend($.validator.messages, {
		required: "必填字段。",
		remote: "请修正该字段。",
		email: "请输入正确格式的电子邮件。",
		url: "请输入正确格式的网址。",
		date: "请输入正确格式的日期。",
		dateISO: "请输入正确格式的日期 (ISO)。",
		number: "请输入数字。",
		digits: "请输入整数。",
		creditcard: "请输入正确格式的信用卡号。",
		equalTo: "请再次输入相同的值。",
		accept: "请输入正确格式后缀名的字符串。",
		maxlength: $.validator.format("请输入长度最多是 {0} 的字符串。"),
		minlength: $.validator.format("请输入长度最少是 {0} 的字符串。"),
		rangelength: $.validator.format("请输入长度介于 {0} 和 {1} 之间的字符串。"),
		range: $.validator.format("请输入介于 {0} 和 {1} 之间的值。"),
		max: $.validator.format("请输入最大为 {0} 的值。"),
		min: $.validator.format("请输入最小为 {0} 的值。")
	});

	$.setRegional("datepicker", {
		dayNames: [
				'日', '一', '二', '三', '四', '五', '六'
		],
		monthNames: [
				'一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
		]
	});
	$.setRegional("alertMsg", {
		title: {
			error: "错误",
			info: "提示",
			warn: "警告",
			correct: "成功",
			confirm: "确认提示"
		},
		butMsg: {
			ok: "确定",
			yes: "是",
			no: "否",
			cancel: "取消"
		}
	});
})(jQuery);