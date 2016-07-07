(function($) {
  $.fn.extend({
    uploadifiveImg: function() {
      var $this = $(this);
      var options = {
        auto: true,
        dnd: false,
        width: 80,
        height: 20,
        buttonText: '选择图片',
        fileObjName: 'file',
        fileSizeLimit: '2MB',
        fileType: ['image/png', 'image/jpeg', 'image/gif'],
        overrideEvents: ['onError'],
        // 扩展属性
        iwidth: 100, //图片宽度
        iheight: 100, //图片高度
        iname: 'img' //图片ID隐藏域名称，提交到后台的字段名
      };
      var uploadifiveOptions = DWZ.jsonEval($this.attr('uploadifiveImg'));
      $.extend(options, uploadifiveOptions);
      
      // 设置上传队列限制等于上传文件数量限制
      options.queueSizeLimit = options.uploadLimit;
      
      // 初始化方法
      options.onInit = function() {
        var $this = $(this);
        // 如果是必填，增加一个用于判断必填的隐藏域
        if($this.hasClass("required")) {
          options.inputHidden = $('<input type="hidden" class="required" />');
          var inputHiddenId = options.queueID + '_hidden';
          options.inputHidden.attr('id', inputHiddenId);
          options.inputHidden.attr('name', inputHiddenId);
          $this.after(options.inputHidden);
          $this.removeClass('required');
        }
        
        var $queue = $('#' + options.queueID);
        // 如果本身已存在图片列表，对已存在的图片进行初始化处理，用于编辑的情况。
        if($queue.length) {
          var $data = $this.data('uploadifive');
          
          var $items = $queue.find('.uploadifive-queue-item');
          $items.each(function() {
            var $item = $(this);
            $item.addClass('complete');
            $data.uploads.count++;
            $data.queue.count++;
            if(options.inputHidden) {
              options.inputHidden.val(options.inputHidden.val() + $item.find('input:hidden').val());
            }
            
            $item.find('.close').bind('click', function() {
              $item.fadeOut(500, function() {
                $(this).remove();
              });
              if(options.inputHidden) {
                options.inputHidden.val(options.inputHidden.val().replace($item.find('input:hidden').val(), ''));
              }
              $data.uploads.count--;
              $data.queue.count--;
            });
          });
        }
      }
      
      options.itemTemplate = '<div class="uploadifive-queue-item">\
      <div class="uploadifive-queue-image" style="width:' + options.iwidth + 'px;height:' + options.iheight + 'px"></div>\
      <div class="uploadifive-progress">\
        <div class="uploadifive-progress-bar"></div>\
      </div>\
      <div class="uploadifive-queue-bar">\
        <i class="fa fa-trash close" title="删除"></i>\
      </div>\
    </div>';
      
      options.onError = function(errorType, file) {
        var errorMsg = '上传文件失败，';
        switch(errorType) {
            case '404_FILE_NOT_FOUND':
              errorMsg += '文件未找到。';
              break;
            case '403_FORBIDDEN':
              errorMsg += '您没有操作权限，请联系管理员。';
              break;
            case 'FORBIDDEN_FILE_TYPE':
              errorMsg += '上传的文件类型限制为：' + options.fileType + "。";
              break;
            case 'FILE_SIZE_LIMIT_EXCEEDED':
              errorMsg += '上传的文件大小限制为：' + options.fileSizeLimit + "。";
              break;
            case 'QUEUE_LIMIT_EXCEEDED':
              errorMsg += '上传的文件数量限制为：' + options.uploadLimit + "。";
              break;
            case 'UPLOAD_LIMIT_EXCEEDED':
              return;
            default:
                errorMsg += '发生未知异常，请重试或联系管理员。';
                break;
        };
        
        if(file && file.queueItem) {
          file.queueItem.remove();
        }
        alert(errorMsg);
      };
      
      options.onUploadComplete = function(file, data) {
        var $this = $(this);
        var $data = $this.data('uploadifive');
        var $fileDiv = file.queueItem;
        var result = DWZ.jsonEval(data);
        
        $fileDiv.find('.progress-bar').css('width', '100%');
        $fileDiv.find('.progress').slideUp(250);
        $fileDiv.addClass('complete');
        
        var $imgDiv = $fileDiv.find('.uploadifive-queue-image');
        var $img = $('<img src="' + result.path + '" />');
        var $input = $('<input type="hidden" name="' + options.iname + '" value="' + result.id + '" />');
        var $progressDiv = $fileDiv.find('.uploadifive-progress');
        
        $imgDiv.append($img);
        $imgDiv.append($input);
        
        $progressDiv.remove();
        
        if(options.inputHidden) {
          file.id = result.id;
          options.inputHidden.val(options.inputHidden.val() + result.id);
        }
        
        if(options.uploadLimit == 1) {
          $data.uploads.count--;
        }
      };
      
      options.onCancel = function(file) {
        var $data = $this.data('uploadifive');
        $data.uploads.count--;
        if(options.inputHidden) {
          options.inputHidden.val(options.inputHidden.val().replace(file.id, ''));
        }
      };
      
      $this.uploadifive(options);
    }
  });
})(jQuery);