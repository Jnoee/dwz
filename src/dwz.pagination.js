/**
 * 
 * @author ZhangHuihua@msn.com
 * @param {Object}
 *            opts Several options
 */
(function($) {
	$.fn.extend({
		pagination: function(opts) {
			var setting = {
				first$: "li.j-first",
				prev$: "li.j-prev",
				next$: "li.j-next",
				last$: "li.j-last",
				nums$: "li.j-num>a",
				jumpto$: "li.jumpto",
				pageNumFrag: '<li class="#liClass#"><a href="javascript:;">#pageNum#</a></li>'
			};
			return this.each(function() {
				var $this = $(this);
				var pc = new Pagination(opts);
				var interval = pc.getInterval();

				var pageNumFrag = '';
				for(var i = interval.start; i < interval.end; i++) {
					pageNumFrag += setting.pageNumFrag.replaceAll("#pageNum#", i).replaceAll("#liClass#", i == pc.getCurrentPage() ? 'selected j-num' : 'j-num');
				}
				$this.html(DWZ.frag["pagination"].replaceAll("#pageNumFrag#", pageNumFrag).replaceAll("#currentPage#", pc.getCurrentPage())).find("li").hoverClass();

				var $first = $this.find(setting.first$);
				var $prev = $this.find(setting.prev$);
				var $next = $this.find(setting.next$);
				var $last = $this.find(setting.last$);

				if(pc.hasPrev()) {
					$first.add($prev).find(">span").hide();
					_bindEvent($prev, pc.getCurrentPage() - 1);
					_bindEvent($first, 1);
				} else {
					$first.add($prev).addClass("disabled").find(">a").hide();
				}

				if(pc.hasNext()) {
					$next.add($last).find(">span").hide();
					_bindEvent($next, pc.getCurrentPage() + 1);
					_bindEvent($last, pc.numPages());
				} else {
					$next.add($last).addClass("disabled").find(">a").hide();
				}

				$this.find(setting.nums$).each(function(i) {
					_bindEvent($(this), i + interval.start);
				});
				$this.find(setting.jumpto$).each(function() {
					var $this = $(this);
					var $inputBox = $this.find(":text");
					var $button = $this.find(":button");
					$button.click(function(event) {
						var pageNum = $inputBox.val();
						if(pageNum && pageNum.isPositiveInteger()) {
							var form = $this.getPagerForm().get(0);
							form[DWZ.pageInfo.pageNum].value = pageNum;
							ajaxSearch(form);
						}
					});
					$inputBox.keyup(function(event) {
						if(event.keyCode == DWZ.keyCode.ENTER)
							$button.click();
					});
				});
			});

			function _bindEvent($target, pageNum) {
				$target.bind("click", {
					pageNum: pageNum
				}, function(event) {
					var form = $(this).getPagerForm().get(0);
					form[DWZ.pageInfo.pageNum].value = event.data.pageNum;
					ajaxSearch(form);
					event.preventDefault();
				});
			}
		},

		orderBy: function(options) {
			var op = $.extend({
				asc: "asc",
				desc: "desc"
			}, options);
			return this.each(function() {
				var $this = $(this).css({
					cursor: "pointer"
				}).click(function() {
					var orderField = $this.attr(DWZ.pageInfo.orderField);
					var orderDirection = $this.hasClass(op.asc) ? op.desc : op.asc;
					
					var form = $this.getPagerForm().get(0);
					form[DWZ.pageInfo.orderField].value = orderField;
					form[DWZ.pageInfo.orderDirection].value = orderDirection;
					ajaxSearch(form);
				});
			});
		}
	});

	var Pagination = function(opts) {
		this.opts = $.extend({
			totalCount: 0,
			numPerPage: 10,
			pageNumShown: 10,
			currentPage: 1,
			callback: function() {
				return false;
			}
		}, opts);
	}

	$.extend(Pagination.prototype, {
		numPages: function() {
			return Math.ceil(this.opts.totalCount / this.opts.numPerPage);
		},
		getInterval: function() {
			var ne_half = Math.ceil(this.opts.pageNumShown / 2);
			var np = this.numPages();
			var upper_limit = np - this.opts.pageNumShown;
			var start = this.getCurrentPage() > ne_half ? Math.max(Math.min(this.getCurrentPage() - ne_half, upper_limit), 0) : 0;
			var end = this.getCurrentPage() > ne_half ? Math.min(this.getCurrentPage() + ne_half, np) : Math.min(this.opts.pageNumShown, np);
			return {
				start: start + 1,
				end: end + 1
			};
		},
		getCurrentPage: function() {
			var currentPage = parseInt(this.opts.currentPage);
			if(isNaN(currentPage))
				return 1;
			return currentPage;
		},
		hasPrev: function() {
			return this.getCurrentPage() > 1;
		},
		hasNext: function() {
			return this.getCurrentPage() < this.numPages();
		}
	});
})(jQuery);
