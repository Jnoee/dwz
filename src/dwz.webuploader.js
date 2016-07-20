(function($) {
  $.fn.extend({
    webuploaderImg: function() {
      var $this = $(this);
      var containerId = $this.uniqueId();

      // 先查找是否有文件列表的div
      var $fileList = $this.children('div');
      if(!$fileList.length) {
        $fileList = $('<div></div>');
        $this.append($fileList);
      }
      $fileList.uniqueId();
      
      // 创建选择图片的按钮
      var $button = $('<div></div>');
      var buttonId = $button.uniqueId();
      $this.prepend($button);

      // 默认的参数
      var options = {
        auto: true,
        fileVal: 'attFile',
        pick: {
          id: '#' + buttonId,
          innerHTML: '选择图片',
          multiple: true
        },
        server: 'result/upload-success.json',
        accept: {
          title: 'Images',
          extensions: 'gif,jpg,jpeg,bmp,png',
          mimeTypes: 'image/*'
        },
        fileSingleSizeLimit: 1 * 1024 * 1024,
        duplicate: true,
        thumb: {
          width: 960,
          height: 960,
          quality: 100,
          allowMagnify: false,
          crop: false,
          type: 'image/jpeg'
        },
        hiddenName: 'pic',
        required: true,
        imgWidth: 100,
        imgHeight: 100
      };

      // 读取页面配置的参数合并到默认参数
      var uploaderOptions = DWZ.jsonEval($this.attr('webuploaderImg'));
      $.extend(true, options, uploaderOptions);
      
      // 如果指定是必填字段需要增加一个隐藏域来辅助实现必填校验
      if (options.required) {
        var requiredHidden = options.requiredHidden = $('<input type="hidden" class="required" />');
        var requiredHiddenId = requiredHidden.uniqueId();
        requiredHidden.attr('name', requiredHiddenId);
        $this.after(requiredHidden);
        
        requiredHidden.addFile = function(fileId) {
          $(this).val($(this).val() + fileId);
        };
        
        requiredHidden.removeFile = function(fileId) {
          $(this).val($(this).val().replace(fileId, ''));
        };
      }
      
      // 初始化时处理必填隐藏域的默认值和删除按钮动作
      $fileList.children().each(function() {
        var $li = $(this);
        var $imgHidden = $li.find('input:hidden');
        
        if($imgHidden.length && options.required) {
          options.requiredHidden.addFile($imgHidden.val());
        }
        
        $li.find('i.close').click(function() {
          if($imgHidden.length && options.required) {
            options.requiredHidden.removeFile($imgHidden.val());
          }
          $li.remove();
        });
      });

      // 创建上传组件
      var uploader = WebUploader.create(options);
      
      uploader.on('beforeFileQueued', function( file ) {
        // 如果限制为一张图片，重置上传队列，实现图片替换而不触发数量校验
        if(options.fileNumLimit == 1) {
          uploader.reset();
        }
      });
      
      // 当有文件添加进来的时候
      uploader.on('fileQueued', function(file) {
        var $li = $('<div id="' + file.id + '" class="webuploader-file-item thumbnail">\
                  <img width="' + options.imgWidth + '" height="' + options.imgHeight + '" />\
                  <div class="webuploader-file-info">' + file.name + '</div>\
                  <div class="webuploader-file-bar">\
                    <i class="fa fa-trash close" title="删除"></i>\
                  </div>\
                </div>');
        
        // 如果限制为一张图片，直接替换，否则新增
        if(options.fileNumLimit == 1) {
          $fileList.html($li);
          if(options.required) {
            options.requiredHidden.val('');
          }
        } else {
          $fileList.append($li);
        }

        // 创建缩略图
        var $img = $li.find('img');
        uploader.makeThumb(file, function(error, src) {
          if (error) {
            $img.replaceWith('<span>不能预览</span>');
            return;
          }
          $img.attr('src', src);
        });

        // 定义删除按钮动作
        $li.on('click', '.webuploader-file-bar > i', function() {
          uploader.removeFile(file, true);
          
          var $imgHidden = $li.find('input:hidden');
          if($imgHidden.length && options.required) {
            options.requiredHidden.removeFile($imgHidden.val());
          }
          $li.remove();
        });
      });
      
      uploader.on('error', function(type) {
        var errorMsg = '上传图片失败，';
        switch(type) {
        case 'Q_EXCEED_NUM_LIMIT':
          errorMsg += '图片数量限制为：' + options.fileNumLimit + '。';
          break;
        case 'F_EXCEED_SIZE':
          errorMsg += '图片大小限制为：' + WebUploader.Base.formatSize(options.fileSingleSizeLimit) + '。';
          break;
        case 'Q_TYPE_DENIED':
          errorMsg += '图片类型限制为：' + options.accept.extensions + '。';
          break;
        case 'F_DUPLICATE':
          errorMsg += '图片重复。';
          break;
        default:
          errorMsg += '发生未知异常，请重试或联系管理员。';
          break;
        }
        alertMsg.error(errorMsg);
      });

      uploader.on('uploadSuccess', function(file, response) {
        var $li = $('#' + file.id);
        var $hidden = $('<input type="hidden" />');
        $hidden.attr('name', options.hiddenName);
        $hidden.val(response.id);
        $li.append($hidden);
        
        if (options.required) {
          options.requiredHidden.addFile(response.id);
        }
        
        var $info = $li.find('div.webuploader-file-info');
        $info.addClass('success');
        $info.text('上传成功');
      });

      uploader.on('uploadError', function(file) {
        var $info = $('#' + file.id).find('div.webuploader-file-info');
        $info.addClass('error');
        $info.text('上传失败');
      });
    }
  });
})(jQuery);