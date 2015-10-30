/**
 * @author ZhangHuihua@msn.com
 * 
 */

/**
 * 普通ajax表单提交
 * 
 * @param {Object}
 *            form
 * @param {Object}
 *            callback
 * @param {String}
 *            confirmMsg 提示确认信息
 */
function validateCallback(form, callback, confirmMsg) {
	var $form = $(form);

	if(!$form.valid()) {
		return false;
	}

	var _submitFn = function() {
		$.ajax({
			type: form.method || 'POST',
			url: $form.attr("action"),
			data: $form.serializeArray(),
			dataType: "json",
			cache: false,
			success: callback || DWZ.ajaxDone,
			error: DWZ.ajaxError
		});
	}

	if(confirmMsg) {
		alertMsg.confirm(confirmMsg, {
			okCall: _submitFn
		});
	} else {
		_submitFn();
	}

	return false;
}

/**
 * 带文件上传的ajax表单提交
 * 
 * @param {Object}
 *            form
 * @param {Object}
 *            callback
 */
function iframeCallback(form, callback) {
	var $form = $(form), $iframe = $("#callbackframe");
	if(!$form.valid()) {
		return false;
	}

	if($iframe.size() == 0) {
		$iframe = $("<iframe id='callbackframe' name='callbackframe' src='about:blank' style='display:none'></iframe>").appendTo("body");
	}
	if(!form.ajax) {
		$form.append('<input type="hidden" name="ajax" value="1" />');
	}
	form.target = "callbackframe";

	_iframeResponse($iframe[0], callback || DWZ.ajaxDone);
}

function _iframeResponse(iframe, callback) {
	var $iframe = $(iframe), $document = $(document);

	$document.trigger("ajaxStart");

	$iframe.bind("load", function(event) {
		$iframe.unbind("load");
		$document.trigger("ajaxStop");

		if(iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || // For Safari
		iframe.src == "javascript:'<html></html>';") { // For FF, IE
			return;
		}

		var doc = iframe.contentDocument || iframe.document;

		// fixing Opera 9.26,10.00
		if(doc.readyState && doc.readyState != 'complete')
			return;
		// fixing Opera 9.64
		if(doc.body && doc.body.innerHTML == "false")
			return;

		var response;

		if(doc.XMLDocument) {
			// response is a xml document Internet Explorer property
			response = doc.XMLDocument;
		} else if(doc.body) {
			try {
				response = $iframe.contents().find("body").text();
				response = jQuery.parseJSON(response);
			} catch(e) { // response is html document or plain text
				response = doc.body.innerHTML;
			}
		} else {
			// response is a xml document
			response = doc;
		}

		callback(response);
	});
}

/** 统一回调处理函数 */
function allAjaxDone(json) {
	DWZ.ajaxDone(json);
	if(json[DWZ.keys.statusCode] == DWZ.statusCode.ok) {
		_closeNavTab(json);
		_closeDialog(json);
		_reloadNavTab(json);
		_reloadDialog(json);
		_reloadDiv(json);
	}
}

function _closeNavTab(json) {
	var navTabs = _parseToResults(json.closeNavTab);
	for(var i = 0; i < navTabs.length; i++) {
		if(navTabs[i].id === "current") {
			navTab.closeCurrentTab();
		} else {
			navTab.closeTab(navTabs[i]);
		}
	}
}

function _reloadNavTab(json) {
	var navTabs = _parseToResults(json.reloadNavTab);
	for(var i = 0; i < navTabs.length; i++) {
		var reloadOptions = {
			data: navTabs[i].data || {},
			navTabId: navTabs[i].id === "current" ? "" : navTabs[i].id,
			callback: navTabs[i].callback
		};
		navTab.reload(navTabs[i].url, reloadOptions);
	}
}

function _closeDialog(json) {
	var dialogs = _parseToResults(json.closeDialog);
	for(var i = 0; i < dialogs.length; i++) {
		if(dialogs[i].id === "current") {
			$.pdialog.closeCurrent();
		} else {
			$.pdialog.close(dialogs[i]);
		}
	}
}

function _reloadDialog(json) {
	var dialogs = _parseToResults(json.reloadDialog);
	for(var i = 0; i < dialogs.length; i++) {
		var reloadOptions = {
			data: dialogs[i].data || {},
			navTabId: dialogs[i].id === "current" ? "" : dialogs[i].id,
			callback: dialogs[i].callback
		};
		$.pdialog.reload(dialogs[i].url || $.pdialog._current.data("url"), reloadOptions);
	}
}

function _reloadDiv(json) {
	var divs = _parseToResults(json.reloadDiv);
	for(var i = 0; i < divs.length; i++) {
		var reloadOptions = {
			data: divs[i].data || {},
			callback: divs[i].callback
		};
		var $box = _getDivInCurrent("#" + divs[i].id);
		var $pagerForm = $("#pagerForm", $box.unitBox());
		if($pagerForm.size() > 0) {
			$pagerForm = $pagerForm.eq(0);
		} else {
			$pagerForm = null;
		}

		var serializeArray = $pagerForm ? $pagerForm.serializeArray() : {};
		if(!$.isEmptyObject(serializeArray)) {
			$.extend(reloadOptions.data, $.serializeArrayToJson(serializeArray));
		}
		var url = divs[i].url || $pageForm.attr("action");
		$.extend(reloadOptions.data, url.getParams());

		$box.ajaxUrl({
			type: "POST",
			url: url,
			data: reloadOptions.data,
			callback: function(response) {
				$box.find("[layoutH]").layoutH();
				if($.isFunction(reloadOptions.callback)) {
					reloadOptions.callback(response);
				}
			}
		});
	}
}

function _getDivInCurrent(divId) {
	// 如果当前有打开dialog，先从当前dialog中查找
	if($.pdialog.getCurrent()) {
		var div = $("#" + divId, $.pdialog.getCurrent());
		if(div.length > 0) {
			return div;
		}
	}
	// 如果当前dialog中未找到，则从当前navTab中查找
	var div = $("#" + divId, navTab.getCurrentPanel());
	if(div.length > 0) {
		return div;
	}
	throw new Error("当前页面未找到[id=" + divId + "的元素。" );
}

function _parseToResults(arrays) {
	var results = [];
	if(arrays) {
		for(var i = 0; i < arrays.length; i++) {
			var attrs = arrays[i].split(",");
			var result = {
				id: attrs[0],
				url: attrs[1] || null,
				data: attrs[2] ? attrs[2].toJson() : null,
				callback: attrs[3] || null
			}
			results.push(result);
		}
	}
	return results;
}

function navTabSearch() {
	_reloadNavTab({
		"reloadNavTab": [
			"current"
		]
	});
	return false;
}

function dialogSearch() {
	_reloadDialog({
		"reloadDialog": [
			"current"
		]
	});
	return false;
}

function divSearch(rel) {
	_reloadDiv({
		"reloadDiv": [rel]
	});
	return false;
}

function ajaxTodo(url, callback) {
	var $callback = callback || allAjaxDone;
	if(!$.isFunction($callback))
		$callback = eval('(' + callback + ')');
	$.ajax({
		type: 'POST',
		url: url,
		dataType: "json",
		cache: false,
		success: $callback,
		error: DWZ.ajaxError
	});
}

/**
 * http://www.uploadify.com/documentation/uploadify/onqueuecomplete/
 */
function uploadifyQueueComplete(queueData) {

	var msg = "The total number of files uploaded: " + queueData.uploadsSuccessful + "<br/>" + "The total number of errors while uploading: " + queueData.uploadsErrored + "<br/>" + "The total number of bytes uploaded: " + queueData.queueBytesUploaded + "<br/>"
			+ "The average speed of all uploaded files: " + queueData.averageSpeed;

	if(queueData.uploadsErrored) {
		alertMsg.error(msg);
	} else {
		alertMsg.correct(msg);
	}
}
/**
 * http://www.uploadify.com/documentation/uploadify/onuploadsuccess/
 */
function uploadifySuccess(file, data, response) {
	alert(data)
}

/**
 * http://www.uploadify.com/documentation/uploadify/onuploaderror/
 */
function uploadifyError(file, errorCode, errorMsg) {
	alertMsg.error(errorCode + ": " + errorMsg);
}

/**
 * http://www.uploadify.com/documentation/
 * 
 * @param {Object}
 *            event
 * @param {Object}
 *            queueID
 * @param {Object}
 *            fileObj
 * @param {Object}
 *            errorObj
 */
function uploadifyError(event, queueId, fileObj, errorObj) {
	alert("event:" + event + "\nqueueId:" + queueId + "\nfileObj.name:" + fileObj.name + "\nerrorObj.type:" + errorObj.type + "\nerrorObj.info:" + errorObj.info);
}

$.fn.extend({
	ajaxTodo: function() {
		return this.each(function() {
			var $this = $(this);
			$this.click(function(event) {
				if($this.hasClass('disabled')) {
					return false;
				}

				var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
				DWZ.debug(url);
				if(!url.isFinishedTm()) {
					alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
					return false;
				}
				var title = $this.attr("title");
				if(title) {
					alertMsg.confirm(title, {
						okCall: function() {
							ajaxTodo(url, $this.attr("callback"));
						}
					});
				} else {
					ajaxTodo(url, $this.attr("callback"));
				}
				event.preventDefault();
			});
		});
	},
	selectedTodo: function() {
		function _getIds(selectedIds, targetType) {
			var ids = "";
			var $box = targetType == "dialog" ? $.pdialog.getCurrent() : navTab.getCurrentPanel();
			$box.find("input:checked").filter("[name='" + selectedIds + "']").each(function(i) {
				var val = $(this).val();
				ids += i == 0 ? val : "," + val;
			});
			return ids;
		}
		return this.each(function() {
			var $this = $(this);
			var selectedIds = $this.attr("rel") || "ids";
			var postType = $this.attr("postType") || "map";

			$this.click(function() {
				var targetType = $this.attr("targetType");
				var ids = _getIds(selectedIds, targetType);
				if(!ids) {
					alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
					return false;
				}

				var _callback = $this.attr("callback") || allAjaxDone;
				if(!$.isFunction(_callback))
					_callback = eval('(' + _callback + ')');

				function _doPost() {
					$.ajax({
						type: 'POST',
						url: $this.attr('href'),
						dataType: 'json',
						cache: false,
						data: function() {
							if(postType == 'map') {
								return $.map(ids.split(','), function(val, i) {
									return {
										name: selectedIds,
										value: val
									};
								})
							} else {
								var _data = {};
								_data[selectedIds] = ids;
								return _data;
							}
						}(),
						success: _callback,
						error: DWZ.ajaxError
					});
				}
				var title = $this.attr("title");
				if(title) {
					alertMsg.confirm(title, {
						okCall: _doPost
					});
				} else {
					_doPost();
				}
				return false;
			});
		});
	},
	dwzExport: function() {
		function _doExport($this) {
			var $p = $this.attr("targetType") == "dialog" ? $.pdialog.getCurrent() : navTab.getCurrentPanel();
			var $form = $("#pagerForm", $p);
			var url = $this.attr("href");
			window.location = url + (url.indexOf('?') == -1 ? "?" : "&") + $form.serialize();
		}

		return this.each(function() {
			var $this = $(this);
			$this.click(function(event) {
				var title = $this.attr("title");
				if(title) {
					alertMsg.confirm(title, {
						okCall: function() {
							_doExport($this);
						}
					});
				} else {
					_doExport($this);
				}
				event.preventDefault();
			});
		});
	}
});
