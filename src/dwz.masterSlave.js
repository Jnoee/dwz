(function($) {
	$.fn.extend({
		masterSlave: function() {
			return this.each(function() {
				var $table = $(this).css("clear", "both"), $tbody = $table.find("tbody");
				var fields = [];

				$table.find("tr:first th[type]").each(function(i) {
					var $th = $(this);
					var field = {
						type: $th.attr("type") || "text",
						patternDate: $th.attr("dateFmt") || "yyyy-MM-dd",
						name: $th.attr("name") || "",
						defaultVal: $th.attr("defaultVal") || "",
						hiddenName: $th.attr("hiddenName") || "",
						hiddenVal: $th.attr("hiddenVal") || "",
						size: $th.attr("size") || "12",
						align: $th.attr("align") || "left",
						enumUrl: $th.attr("enumUrl") || "",
						lookupGroup: $th.attr("lookupGroup") || "",
						lookupUrl: $th.attr("lookupUrl") || "",
						lookupPk: $th.attr("lookupPk") || "id",
						suggestUrl: $th.attr("suggestUrl"),
						suggestFields: $th.attr("suggestFields"),
						postField: $th.attr("postField") || "",
						fieldClass: $th.attr("fieldClass") || "",
						fieldAttrs: $th.attr("fieldAttrs") || ""
					};
					fields.push(field);
				});

				$tbody.find("a.btnDel").click(function() {
					var $btnDel = $(this);

					if($btnDel.is("[href^=javascript:]")) {
						$btnDel.parents("tr:first").remove();
						initSuffix($tbody);
						return false;
					}

					function delDbData() {
						$.ajax({
							type: 'POST',
							dataType: "json",
							url: $btnDel.attr('href'),
							cache: false,
							success: function() {
								$btnDel.parents("tr:first").remove();
								initSuffix($tbody);
							},
							error: DWZ.ajaxError
						});
					}

					if($btnDel.attr("title")) {
						alertMsg.confirm($btnDel.attr("title"), {
							okCall: delDbData
						});
					} else {
						delDbData();
					}

					return false;
				});

				var addButTxt = $table.attr('addButton') || "新增条目";
				if(addButTxt) {
					var $addBut = $('<a href="javascript:;" class="button"><span class="fa-plus">' + addButTxt + '</span></a>');
					$addBut.insertBefore($table);

					var trTm = "";
					$addBut.click(function() {
						if(!trTm)
							trTm = trHtml(fields);
						var rowNum = 1;

						for(var i = 0; i < rowNum; i++) {
							var $tr = $(trTm);
							$tr.appendTo($tbody).initUI().find("a.red").click(function() {
								$(this).parents("tr:first").remove();
								initSuffix($tbody);
								return false;
							});
						}
						initSuffix($tbody);
					});
				}
			});

			/**
			 * 删除时重新初始化下标
			 */
			function initSuffix($tbody) {
				$tbody.find('>tr').each(function(i) {
					$(':input, a.btn, span', this).each(function() {
						var $this = $(this), name = $this.attr('name'), val = $this.val();

						if(name)
							$this.attr('name', name.replaceSuffix(i));

						var lookupGroup = $this.attr('lookupGroup');
						if(lookupGroup) {
							$this.attr('lookupGroup', lookupGroup.replaceSuffix(i));
						}

						var suffix = $this.attr("suffix");
						if(suffix) {
							$this.attr('suffix', suffix.replaceSuffix(i));
						}

						if(val && val.indexOf("#index#") >= 0)
							$this.val(val.replace('#index#', i + 1));

						if($this.is("span")) {
							$this.text($this.text().replace(/[0-9]+/, i + 1).replace('#index#', i + 1));
						}
					});
				});
			}

			function tdHtml(field) {
				var html = '', suffix = '';

				if(field.name.endsWith("[#index#]"))
					suffix = "[#index#]";
				else if(field.name.endsWith("[]"))
					suffix = "[]";

				var suffixFrag = suffix ? ' suffix="' + suffix + '" ' : '';

				var attrFrag = '';
				if(field.fieldAttrs) {
					var attrs = DWZ.jsonEval(field.fieldAttrs);
					for( var key in attrs) {
						attrFrag += key + '="' + attrs[key] + '"';
					}
				}
				switch(field.type) {
					case 'del':
						html = '<a href="javascript:;" style="font-size: 14px;" class="fa-remove red' + field.fieldClass + '" title="删除条目"></a>';
						break;
					case 'lookup':
						var suggestFrag = '';
						if(field.suggestFields) {
							suggestFrag = 'autocomplete="off" lookupGroup="' + field.lookupGroup + '"' + suffixFrag + ' suggestUrl="' + field.suggestUrl + '" suggestFields="' + field.suggestFields + '"' + ' postField="' + field.postField + '"';
						}

						html = '<input type="hidden" name="' + field.lookupGroup + '.' + field.lookupPk + suffix + '"/>' + '<input type="text" name="' + field.name + '"' + suggestFrag + ' lookupPk="' + field.lookupPk + '" size="' + field.size + '" class="' + field.fieldClass + '"/>'
								+ '<a class="btn fa-search-plus" href="' + field.lookupUrl + '" lookupGroup="' + field.lookupGroup + '" ' + suggestFrag + ' lookupPk="' + field.lookupPk + '" title="查找带回">查找带回</a>';
						break;
					case 'attach':
						html = '<input type="hidden" name="' + field.lookupGroup + '.' + field.lookupPk + suffix + '"/>' + '<input type="text" name="' + field.name + '" size="' + field.size + '" readonly="readonly" class="' + field.fieldClass + '"/>' + '<a class="btn fa-cloud-upload" href="'
								+ field.lookupUrl + '" lookupGroup="' + field.lookupGroup + '" ' + suffixFrag + ' lookupPk="' + field.lookupPk + '" width="SS" height="S" title="上传文件">上传文件</a>';
						break;
					case 'enum':
						$.ajax({
							type: "POST",
							dataType: "html",
							async: false,
							url: field.enumUrl,
							data: {
								inputName: field.name
							},
							success: function(response) {
								html = response;
							}
						});
						break;
					case 'date':
						html = '<input type="text" name="' + field.name + '" value="' + field.defaultVal + '" class="date ' + field.fieldClass + '" dateFmt="' + field.patternDate + '" size="' + field.size + '"/>' + '<a class="btn fa-calendar" href="javascript:void(0)">选择</a>';
						break;
					// 增加checkbox支持
					case 'checkbox':
						html = '<input type="checkbox" name="' + field.name + '" value="' + field.defaultVal + '" size="' + field.size + '" class="' + field.fieldClass + '" ' + attrFrag + '/>';
						break;
					// 增加span文本支持
					case 'span':
						html = '<span class="' + field.fieldClass + '">' + field.defaultVal + '</span>';
						break;
					default:
						html = '<input type="' + field.type + '" name="' + field.name + '" value="' + field.defaultVal + '" size="' + field.size + '" class="' + field.fieldClass + '" ' + attrFrag + '/>';
						break;
				}
				if(field.hiddenName) {
					html += '<input type="hidden" name="' + field.hiddenName + '" value="' + field.hiddenVal + '" />';
				}
				return '<td align="' + field.align +'">' + html + '</td>';
			}
			function trHtml(fields) {
				var html = '';
				$(fields).each(function() {
					html += tdHtml(this);
				});
				return '<tr class="unitBox">' + html + '</tr>';
			}
		}
	});
})(jQuery);
