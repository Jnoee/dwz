/**
 * @author ZhangHuihua@msn.com
 *
 */

function validateCallback(form, callback, confirmMsg) {
  var $form = $(form);

  if (!$form.valid()) {
    return false;
  }

  var _submitFn = function () {
    $.ajax({
      type: form.method || 'POST',
      url: $form.attr("action"),
      data: $form.serializeArray(),
      dataType: "json",
      cache: false,
      success: callback || DWZ.ajaxDone,
      error: DWZ.ajaxError
    });
  };

  if (confirmMsg) {
    alertMsg.confirm(confirmMsg, {
      okCall: _submitFn
    });
  } else {
    _submitFn();
  }

  return false;
}

function iframeCallback(form, callback) {
  var $form = $(form), $iframe = $("#callbackframe");
  if (!$form.valid()) return false;

  if ($iframe.size() == 0) {
    $iframe = $("<iframe id='callbackframe' name='callbackframe' src='about:blank' style='display:none'></iframe>").appendTo("body");
  }
  if (!form.ajax) {
    $form.append('<input type="hidden" name="ajax" value="1" />');
  }
  form.target = "callbackframe";

  _iframeResponse($iframe[0], callback || DWZ.ajaxDone);
}

function _iframeResponse(iframe, callback) {
  var $iframe = $(iframe), $document = $(document);

  $document.trigger("ajaxStart");

  $iframe.bind("load", function () {
    $iframe.unbind("load");
    $document.trigger("ajaxStop");

    if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || // For Safari
        iframe.src == "javascript:'<html></html>';") { // For FF, IE
      return;
    }

    var doc = iframe.contentDocument || iframe.document;

    // fixing Opera 9.26,10.00
    if (doc.readyState && doc.readyState != 'complete')
      return;
    // fixing Opera 9.64
    if (doc.body && doc.body.innerHTML == "false")
      return;

    var response;

    if (doc.XMLDocument) {
      // response is a xml document Internet Explorer property
      response = doc.XMLDocument;
    } else if (doc.body) {
      try {
        response = $iframe.contents().find("body").text();
        response = jQuery.parseJSON(response);
      } catch (e) { // response is html document or plain text
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
  if (json[DWZ.keys.statusCode] == DWZ.statusCode.ok) {
    _reloadDiv(json);
    _reloadDialog(json);
    _reloadNavTab(json);
    _closeDialog(json);
    _closeNavTab(json);
  }
}

/** 统一分页查询函数 */
function ajaxSearch(form) {
  var $form = $(form);
  var rel = $form.attr("rel");
  if (rel) {
    _reloadDiv({
      "reloadDiv": [
        rel
      ]
    });
  } else {
    if ($form.unitBox().hasClass("dialogContent")) {
      _reloadDialog({
        "reloadDialog": [
          ""
        ]
      });
    } else {
      _reloadNavTab({
        "reloadNavTab": [
          ""
        ]
      });
    }
  }
  return false;
}

function _closeNavTab(json) {
  var navTabs = _parseToResults(json.closeNavTab);
  for (var i = 0; i < navTabs.length; i++) {
    if (navTabs[i].id === "") {
      navTab.closeCurrentTab();
    } else {
      navTab.closeTab(navTabs[i]);
    }
  }
}

function _reloadNavTab(json) {
  var navTabs = _parseToResults(json.reloadNavTab);
  for (var i = 0; i < navTabs.length; i++) {
    navTab.reload(navTabs[i]);
  }
}

function _closeDialog(json) {
  var dialogs = _parseToResults(json.closeDialog);
  for (var i = 0; i < dialogs.length; i++) {
    if (dialogs[i].id === "") {
      $.pdialog.closeCurrent();
    } else {
      $.pdialog.close(dialogs[i]);
    }
  }
}

function _reloadDialog(json) {
  var dialogs = _parseToResults(json.reloadDialog);
  for (var i = 0; i < dialogs.length; i++) {
    var op = {
      dialogId: dialogs[i].id,
      data: dialogs[i].data || {},
      callback: dialogs[i].callback
    };
    $.pdialog.reload(dialogs[i].url || $.pdialog._current.data("url"), op);
  }
}

function _reloadDiv(json) {
  var divs = _parseToResults(json.reloadDiv);
  for (var i = 0; i < divs.length; i++) {
    var op = {
      data: divs[i].data || {},
      callback: divs[i].callback
    };
    var $box = _getDivInCurrent("#" + divs[i].id);
    var $pagerForm = $box.getPagerForm();
    if ($pagerForm) {
      $.extend(op.data, $pagerForm.serializeJson());
    }
    var url = divs[i].url || $pagerForm.attr("action");
    $.extend(op.data, url.getParams());

    $box.ajaxUrl({
      type: "POST",
      url: url,
      data: op.data,
      callback: function (response) {
        $box.find("[layoutH]").layoutH();
        if ($.isFunction(op.callback)) {
          op.callback(response);
        }
      }
    });
  }
}

function _getDivInCurrent(divId) {
  // 如果当前有打开dialog，先从当前dialog中查找
  var div;
  if ($.pdialog.getCurrent()) {
    div = $("#" + divId, $.pdialog.getCurrent());
    if (div.length > 0) return div;
  }
  // 如果当前dialog中未找到，则从当前navTab中查找
  div = $("#" + divId, navTab.getCurrentPanel());
  if (div.length > 0) return div;
  throw new Error("当前页面未找到[id=" + divId + "的元素。");
}

function _parseToResults(arrays) {
  var results = [];
  if (arrays) {
    for (var i = 0; i < arrays.length; i++) {
      var attrs = arrays[i].split(",");
      var result = {
        id: attrs[0],
        url: attrs[1] || "",
        data: attrs[2] ? attrs[2].toJson() : "",
        callback: attrs[3] || ""
      };
      results.push(result);
    }
  }
  return results;
}

function ajaxTodo(url, callback) {
  var $callback = callback || allAjaxDone;
  if (!$.isFunction($callback))
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

function uploadifyError(file, errorCode, errorMsg) {
  alertMsg.error(errorCode + ": " + errorMsg);
}

$.fn.extend({
  ajaxTodo: function () {
    return this.each(function () {
      var $this = $(this);
      $this.click(function (event) {
        if ($this.hasClass('disabled')) {
          return false;
        }

        var url = decodeURI($this.attr("href")).replaceTmById($(event.target).unitBox());
        DWZ.debug(url);
        if (!url.isFinishedTm()) {
          alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
          return false;
        }
        var title = $this.attr("title");
        if (title) {
          alertMsg.confirm(title, {
            okCall: function () {
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
  selectedTodo: function () {
    function _getIds($box, selectedIds) {
      var ids = "";
      $box.find("input:checked").filter("[name='" + selectedIds + "']").each(function (i) {
        var val = $(this).val();
        ids += i == 0 ? val : "," + val;
      });
      return ids;
    }

    return this.each(function () {
      var $this = $(this);
      var selectedIds = $this.attr("rel") || "ids";
      var postType = $this.attr("postType") || "map";

      $this.click(function () {
        var ids = _getIds($this.unitBox(), selectedIds);
        if (!ids) {
          alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
          return false;
        }

        var _callback = $this.attr("callback") || allAjaxDone;
        if (!$.isFunction(_callback))
          _callback = eval('(' + _callback + ')');

        function _doPost() {
          $.ajax({
            type: 'POST',
            url: $this.attr('href'),
            dataType: 'json',
            cache: false,
            data: function () {
              if (postType == 'map') {
                return $.map(ids.split(','), function (val) {
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
        if (title) {
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
  dwzExport: function () {
    function _doExport($this) {
      var $pagerform = $this.getPagerForm();
      var url = $this.attr("href");
      window.location = url + (url.indexOf('?') == -1 ? "?" : "&") + $pagerform.serialize();
    }

    return this.each(function () {
      var $this = $(this);
      $this.click(function (event) {
        var title = $this.attr("title");
        if (title) {
          alertMsg.confirm(title, {
            okCall: function () {
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
