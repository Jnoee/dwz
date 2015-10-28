/**
 * @author ZhangHuihua@msn.com
 * 
 */
var DWZ = {
	regPlugins: [], // [function($parent){} ...]
	// sbar: show sidebar
	keyCode: {
		ENTER: 13,
		ESC: 27,
		END: 35,
		HOME: 36,
		SHIFT: 16,
		TAB: 9,
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		DELETE: 46,
		BACKSPACE: 8
	},
	eventType: {
		pageClear: "pageClear", // 用于重新ajaxLoad、关闭nabTab, 关闭dialog时，去除xheditor等需要特殊处理的资源
		resizeGrid: "resizeGrid" // 用于窗口或dialog大小调整
	},
	isOverAxis: function(x, reference, size) {
		// Determines when x coordinate is over "b" element axis
		return (x > reference) && (x < (reference + size));
	},
	isOver: function(y, x, top, left, height, width) {
		// Determines when x, y coordinates is over "b" element
		return this.isOverAxis(y, top, height) && this.isOverAxis(x, left, width);
	},
	pageInfo: {
		pageNum: "pageNum",
		numPerPage: "numPerPage",
		orderField: "orderField",
		orderDirection: "orderDirection"
	},
	statusCode: {
		ok: "200",
		error: "300",
		timeout: "301"
	},
	keys: {
		statusCode: "statusCode",
		message: "message"
	},
	ui: {
		sbar: true,
		hideMode: 'display'
	},
	dialogWidth: {
		SSS: 300,
		SS: 400,
		S: 500,
		M: 700,
		L: 900,
		XL: 1100
	},
	dialogHeight: {
		SSS: 250,
		SS: 300,
		S: 400,
		M: 500,
		L: 600,
		XL: 700
	},
	frag: {
		dialogFrag: '<div class="dialog" style="top:150px; left:300px;">\
			<div class="dialogHeader" onselectstart="return false;" oncopy="return false;" onpaste="return false;" oncut="return false;">\
				<div class="dialogHeader_r">\
					<div class="dialogHeader_c">\
						<a class="close" href="#close">close</a>\
						<a class="maximize" href="#maximize">maximize</a>\
						<a class="restore" href="#restore">restore</a>\
						<a class="minimize" href="#minimize">minimize</a>\
						<h1>弹出窗口</h1>\
					</div>\
				</div>\
			</div>\
			<div class="dialogContent layoutBox unitBox"></div>\
			<div class="dialogFooter"><div class="dialogFooter_r"><div class="dialogFooter_c"></div></div></div>\
			<div class="resizable_h_l" tar="nw"></div>\
			<div class="resizable_h_r" tar="ne"></div>\
			<div class="resizable_h_c" tar="n"></div>\
			<div class="resizable_c_l" tar="w" style="height:300px;"></div>\
			<div class="resizable_c_r" tar="e" style="height:300px;"></div>\
			<div class="resizable_f_l" tar="sw"></div>\
			<div class="resizable_f_r" tar="se"></div>\
			<div class="resizable_f_c" tar="s"></div>\
		</div>',
		dialogProxy: '<div id="dialogProxy" class="dialog dialogProxy">\
			<div class="dialogHeader">\
				<div class="dialogHeader_r">\
					<div class="dialogHeader_c">\
						<a class="close" href="#close">close</a>\
						<a class="maximize" href="#maximize">maximize</a>\
						<a class="minimize" href="#minimize">minimize</a>\
						<h1></h1>\
					</div>\
				</div>\
			</div>\
			<div class="dialogContent"></div>\
			<div class="dialogFooter">\
				<div class="dialogFooter_r">\
					<div class="dialogFooter_c">\
					</div>\
				</div>\
			</div>\
		</div>',
		taskbar: '<div id="taskbar" style="left:0px; display:none;">\
			<div class="taskbarContent">\
				<ul></ul>\
			</div>\
			<div class="taskbarLeft taskbarLeftDisabled" style="display:none;">taskbarLeft</div>\
			<div class="taskbarRight" style="display:none;">taskbarRight</div>\
		</div>',
		dwzFrag: '<div id="splitBar"></div>\
			<div id="splitBarProxy"></div>\
			<div class="resizable"></div>\
			<div class="shadow" style="width:508px; top:148px; left:296px;">\
				<div class="shadow_h">\
					<div class="shadow_h_l"></div>\
					<div class="shadow_h_r"></div>\
					<div class="shadow_h_c"></div>\
				</div>\
				<div class="shadow_c">\
					<div class="shadow_c_l" style="height:296px;"></div>\
					<div class="shadow_c_r" style="height:296px;"></div>\
					<div class="shadow_c_c" style="height:296px;"></div>\
				</div>\
				<div class="shadow_f">\
					<div class="shadow_f_l"></div>\
					<div class="shadow_f_r"></div>\
					<div class="shadow_f_c"></div>\
				</div>\
			</div>\
			<div id="alertBackground" class="alertBackground"></div>\
			<div id="dialogBackground" class="dialogBackground"></div>\
			<div id="background" class="background"></div>\
			<div id="progressBar" class="progressBar">数据加载中，请稍等...</div>',
		pagination: '<ul>\
			<li class="j-first">\
				<a class="first" href="javascript:;"><span>首页</span></a>\
				<span class="first"><span>首页</span></span>\
			</li>\
			<li class="j-prev">\
				<a class="previous" href="javascript:;"><span>上一页</span></a>\
				<span class="previous"><span>上一页</span></span>\
			</li>\
			#pageNumFrag#\
			<li class="j-next">\
				<a class="next" href="javascript:;"><span>下一页</span></a>\
				<span class="next"><span>下一页</span></span>\
			</li>\
			<li class="j-last">\
				<a class="last" href="javascript:;"><span>末页</span></a>\
				<span class="last"><span>末页</span></span>\
			</li>\
			<li class="jumpto">\
				<input class="textInput" type="text" size="4" value="#currentPage#" />\
				<input class="goto" type="button" value="确定" />\
			</li>\
		</ul>',
		alertBoxFrag: '<div id="alertMsgBox" class="alert">\
			<div class="alertContent">\
				<div class="#type#">\
					<div class="alertInner"><h1>#title#</h1><div class="msg">#message#</div></div>\
					<div class="toolBar"><ul>#butFragment#</ul></div>\
				</div>\
			</div>\
			<div class="alertFooter">\
				<div class="alertFooter_r"><div class="alertFooter_c"></div></div></div>\
			</div>',
		alertButFrag: '<li>\
			<a class="button" rel="#callback#" onclick="alertMsg.close()" href="javascript:">\
			<span>#butMsg#</span></a>\
		</li>',
		calendarFrag: '<div id="calendar">\
			<div class="main">\
				<div class="head">\
					<table width="100%" border="0" cellpadding="0" cellspacing="2">\
					<tr>\
						<td><select name="year"></select></td>\
						<td><select name="month"></select></td>\
						<td width="20"><span class="close">×</span></td>\
					</tr>\
					</table>\
				</div>\
				<div class="body">\
					<dl class="dayNames"><dt>日</dt><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt>六</dt></dl>\
					<dl class="days">日期列表选项</dl>\
					<div style="clear:both;height:0;line-height:0"></div>\
				</div>\
				<div class="foot">\
					<table class="time">\
						<tr>\
							<td>\
								<input type="text" class="hh" maxlength="2" start="0" end="23"/>:\
								<input type="text" class="mm" maxlength="2" start="0" end="59"/>:\
								<input type="text" class="ss" maxlength="2" start="0" end="59"/>\
							</td>\
							<td><ul><li class="up">&and;</li><li class="down">&or;</li></ul></td>\
						</tr>\
					</table>\
					<button type="button" class="clearBut">清空</button>\
					<button type="button" class="okBut">确定</button>\
				<div>\
				<div class="tm">\
					<ul class="hh">\
						<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li>\
						<li>8</li><li>9</li><li>10</li><li>11</li><li>12</li><li>13</li><li>14</li><li>15</li>\
						<li>16</li><li>17</li><li>18</li><li>19</li><li>20</li><li>21</li><li>22</li><li>23</li>\
					</ul>\
					<ul class="mm">\
						<li>0</li><li>5</li><li>10</li><li>15</li><li>20</li><li>25</li>\
						<li>30</li><li>35</li><li>40</li><li>45</li><li>50</li><li>55</li>\
					</ul>\
					<ul class="ss">\
						<li>0</li><li>10</li><li>20</li><li>30</li><li>40</li><li>50</li>\
					</ul>\
				</div>\
			</div>\
		</div>',
		navTabCM: '<ul id="navTabCM">\
			<li rel="reload">刷新标签页</li>\
			<li rel="closeCurrent">关闭标签页</li>\
			<li rel="closeOther">关闭其它标签页</li>\
			<li rel="closeAll">关闭全部标签页</li>\
		</ul>',
		dialogCM: '<ul id="dialogCM">\
			<li rel="closeCurrent">关闭弹出窗口</li>\
			<li rel="closeOther">关闭其它弹出窗口</li>\
			<li rel="closeAll">关闭全部弹出窗口</li>\
		</ul>',
		externalFrag: '<iframe src="{url}" style="width:100%;height:{height};" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>'
	}, // page fragment
	_msg: {
		statusCode_503: '服务器当前负载过大或者正在维护!',
		validateFormError: '提交数据不完整，{0}个字段有错误，请改正后再提交!',
		sessionTimout: '会话超时，请重新登录!',
		alertSelectMsg: '请选择信息!',
		forwardConfirmMsg: '继续下一步!',
		dwzTitle: 'DWZ富客户端框架',
		mainTabTitle: '我的主页'
	}, // alert message
	_set: {
		loginUrl: "", // session timeout
		loginTitle: "", // if loginTitle open a login dialog
		debug: false
	},
	msg: function(key, args) {
		var _format = function(str, args) {
			args = args || [];
			var result = str || "";
			for(var i = 0; i < args.length; i++) {
				result = result.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
			}
			return result;
		}
		return _format(this._msg[key], args);
	},
	debug: function(msg) {
		if(this._set.debug) {
			if(typeof (console) != "undefined")
				console.log(msg);
			else
				alert(msg);
		}
	},
	loadLogin: function() {
		if($.pdialog && DWZ._set.loginTitle) {
			$.pdialog.open(DWZ._set.loginUrl, "login", DWZ._set.loginTitle, {
				mask: true,
				width: 520,
				height: 260
			});
		} else {
			window.location = DWZ._set.loginUrl;
		}
	},

	/*
	 * json to string
	 */
	obj2str: function(o) {
		var r = [];
		if(typeof o == "string")
			return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
		if(typeof o == "object") {
			if(!o.sort) {
				for( var i in o)
					r.push(i + ":" + DWZ.obj2str(o[i]));
				if(!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
					r.push("toString:" + o.toString.toString());
				}
				r = "{" + r.join() + "}"
			} else {
				for(var i = 0; i < o.length; i++) {
					r.push(DWZ.obj2str(o[i]));
				}
				r = "[" + r.join() + "]"
			}
			return r;
		}
		return o.toString();
	},
	jsonEval: function(data) {
		try {
			if($.type(data) == 'string')
				return eval('(' + data + ')');
			else
				return data;
		} catch(e) {
			return {};
		}
	},
	ajaxError: function(xhr, ajaxOptions, thrownError) {
		if(alertMsg) {
			if(xhr.status == "404") {
				alertMsg.error("<div>您访问的页面未找到。</div>");
			} else if(xhr.status == "500") {
				alertMsg.error("<div>服务器暂时繁忙，请稍候重试或与管理员联系。</div>");
			} else if(xhr.status == "403") {
				alertMsg.error("<div>您没有执行该操作的权限，请与管理员联系。</div>");
			} else {
				alertMsg.error("<div>Http status: " + xhr.status + " " + xhr.statusText + "</div>" + "<div>ajaxOptions: " + ajaxOptions + "</div>" + "<div>thrownError: " + thrownError + "</div>" + "<div>" + xhr.responseText + "</div>");
			}
		} else {
			if(xhr.status == "404") {
				alert("您访问的页面未找到。");
			} else if(xhr.status == "500") {
				alert("服务器暂时繁忙，请稍候重试或与管理员联系。");
			} else if(xhr.status == "403") {
				alert("您没有执行该操作的权限，请与管理员联系。");
			} else {
				alert("<div>Http status: " + xhr.status + " " + xhr.statusText + "</div>" + "<div>ajaxOptions: " + ajaxOptions + "</div>" + "<div>thrownError: " + thrownError + "</div>" + "<div>" + xhr.responseText + "</div>");
			}
		}
	},
	ajaxDone: function(json) {
		var statusCode = json[DWZ.keys.statusCode];
		var message = json[DWZ.keys.message];
		switch(statusCode) {
			case DWZ.statusCode.error:
				if(message && alertMsg) {
					alertMsg.error(message);
				}
				break;
			case DWZ.statusCode.timeout:
				if(alertMsg) {
					alertMsg.error(message || DWZ.msg("sessionTimout"), {
						okCall: DWZ.loadLogin
					});
				} else {
					DWZ.loadLogin();
				}
				break;
			case DWZ.statusCode.ok:
				if(message && alertMsg) {
					alertMsg.correct(message);
				}
				break;
			default:
				break;
		}
	},
	init: function(options) {
		var op = $.extend({
			loginUrl: "login.html",
			loginTitle: null,
			callback: null,
			debug: false,
			statusCode: {},
			keys: {}
		}, options);
		this._set.loginUrl = op.loginUrl;
		this._set.loginTitle = op.loginTitle;
		this._set.debug = op.debug;
		$.extend(DWZ.statusCode, op.statusCode);
		$.extend(DWZ.keys, op.keys);
		$.extend(DWZ.pageInfo, op.pageInfo);
		$.extend(DWZ.ui, op.ui);

		if(jQuery.isFunction(op.callback))
			op.callback();

		var _doc = $(document);
		if(!_doc.isBind(DWZ.eventType.pageClear)) {
			_doc.bind(DWZ.eventType.pageClear, function(event) {
				var box = event.target;
				if($.fn.xheditor) {
					$("textarea.editor", box).xheditor(false);
				}
			});
		}
	},
	openNavMenu: function(index) {
		var idx = index || 0;
		$("a", $("#navMenu")).eq(idx).click();
	},
	hideSideBar: function() {
		var sidebar = $("#sidebar");
		var sidebarBtn = $("#sidebar > .toggleCollapse > div");
		if(sidebar.css("display") != "none") {
			sidebarBtn.click();
		}
	},
	showSideBar: function() {
		var sidebar = $("#sidebar_s");
		var sidebarBtn = $("#sidebar_s > .collapse > .toggleCollapse > div");
		if(sidebar.css("display") != "none") {
			sidebarBtn.click();
		}
	}
};

(function($) {
	// DWZ set regional
	$.setRegional = function(key, value) {
		if(!$.regional)
			$.regional = {};
		$.regional[key] = value;
	};

	$.serializeArrayToJson = function(serializeArray) {
		var json = {};
		if(!$.isEmptyObject(serializeArray)) {
			jQuery.each(serializeArray, function(i, item) {
				json[item.name] = item.value;
			});
		}
		return json;
	}

	$.fn.extend({
		ajaxUrl: function(op) {
			var $this = $(this);
			$this.trigger(DWZ.eventType.pageClear);
			$.ajax({
				type: op.type || 'GET',
				dataType: 'html',
				url: op.url,
				data: op.data,
				cache: false,
				success: function(response) {
					var json = DWZ.jsonEval(response);

					if(json[DWZ.keys.statusCode] == DWZ.statusCode.error) {
						if(json[DWZ.keys.message])
							alertMsg.error(json[DWZ.keys.message]);
					} else {
						$this.html(response).initUI();
						if($.isFunction(op.callback))
							op.callback(response);
					}

					if(json[DWZ.keys.statusCode] == DWZ.statusCode.timeout) {
						if($.pdialog)
							$.pdialog.checkTimeout();
						if(navTab)
							navTab.checkTimeout();

						alertMsg.error(json[DWZ.keys.message] || DWZ.msg("sessionTimout"), {
							okCall: function() {
								DWZ.loadLogin();
							}
						});
					}
				},
				error: DWZ.ajaxError,
				statusCode: {
					503: function(xhr, ajaxOptions, thrownError) {
						alert(DWZ.msg("statusCode_503") || thrownError);
					}
				}
			});
		},
		loadUrl: function(url, data, callback) {
			$(this).ajaxUrl({
				url: url,
				data: data,
				callback: callback
			});
		},
		initUI: function() {
			return this.each(function() {
				if($.isFunction(initUI))
					initUI(this);
			});
		},
		layoutH: function($refBox) {
			return this.each(function() {
				var $this = $(this);
				if(!$refBox)
					$refBox = $this.parents("div.layoutBox:first");
				var iRefH = $refBox.height();
				var iLayoutH = parseInt($this.attr("layoutH"));
				var iH = iRefH - iLayoutH > 50 ? iRefH - iLayoutH : 50;

				if($this.isTag("table")) {
					$this.removeAttr("layoutH").wrap('<div layoutH="' + iLayoutH + '" style="overflow:auto;height:' + iH + 'px"></div>');
				} else {
					$this.height(iH).css("overflow", "auto");
				}
			});
		},
		hoverClass: function(className, speed) {
			var _className = className || "hover";
			return this.each(function() {
				var $this = $(this), mouseOutTimer;
				$this.hover(function() {
					if(mouseOutTimer)
						clearTimeout(mouseOutTimer);
					$this.addClass(_className);
				}, function() {
					mouseOutTimer = setTimeout(function() {
						$this.removeClass(_className);
					}, speed || 10);
				});
			});
		},
		focusClass: function(className) {
			var _className = className || "textInputFocus";
			return this.each(function() {
				$(this).focus(function() {
					$(this).addClass(_className);
				}).blur(function() {
					$(this).removeClass(_className);
				});
			});
		},
		inputAlert: function() {
			return this.each(function() {

				var $this = $(this);

				function getAltBox() {
					return $this.parent().find("label.alt");
				}
				function altBoxCss(opacity) {
					var position = $this.position();
					return {
						width: $this.width(),
						top: position.top + 'px',
						left: position.left + 'px',
						opacity: opacity || 0.5
					};
				}
				if(getAltBox().size() < 1) {
					if(!$this.attr("id"))
						$this.attr("id", $this.attr("name") + "_" + Math.round(Math.random() * 10000));
					// 先设置为隐藏，避免占位影响input的位置。
					var $label = $('<label class="alt" style="display:none;" for="' + $this.attr("id") + '">' + $this.attr("alt") + '</label>').appendTo($this.parent());
					// 然后再显示出来，这样定位准确。
					$label.css(altBoxCss(0.5)).show();
					if($this.val())
						$label.hide();
				}

				$this.focus(function() {
					getAltBox().css(altBoxCss(0.3));
				}).blur(function() {
					if(!$(this).val())
						getAltBox().show().css("opacity", 0.5);
				}).keydown(function() {
					getAltBox().hide();
				});
			});
		},
		isTag: function(tn) {
			if(!tn)
				return false;
			return $(this)[0].tagName.toLowerCase() == tn ? true : false;
		},
		isBind: function(type) {
			var _events = $(this).data("events");
			return _events && type && _events[type];
		},
		log: function(msg) {
			return this.each(function() {
				if(console)
					console.log("%s: %o", msg, this);
			});
		},
		viewSource: function() {
			$(this).each(function(){
				$(this).click(function(event) {
					event.preventDefault();
					window.open("view-source:" + this.href);
				}); 
			});
		},
		unitBox: function() {
			return $(this).closest("div.unitBox");
		}
	});
})(jQuery);