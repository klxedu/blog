/**
 * 使用方法
 * 1、依赖模块：ngFileUpload、ngImgCrop模块
 * 2、使用指令：jcrop
 * 3、配置参数：option、data
 * 4、<div jcrop option="imgCrop.option"  data="imgCrop.data" do-file-upload="doFileUpload(file,data)"></div>
 * 5、参数说明
 * 5-1、option，JCrop参数配置
 * 5-2、data，图片裁剪参数集合
 * {
 *	"uploadFile":{
 *		"maxSize":"2MB",
 *		"accept":"image/jpeg,image/png",
 *		"file":{
 *		},
 *		"errorFile":{
 *		},
 *		"imfoMsg":"提示：请选择类型为jpg和png的图片，大小小于2MB",
 *		"errorMsg":{
 *			"maxSize":"警告：选择的图片大小超过2MB，请重新选择"
 *		}
 *	},
 *	"w_h_ratio":1.3333333333333333,
 *	"crop_w":[
 *		400,
 *		200,
 *		120
 *	],
 *  'init':true,//是否初始化显示图片
 *  'origin_url':'http://127.0.0.1/images/47e35bc0-2884-4205-a382-b1c2096302b4/47e35bc0-2884-4205-a382-b1c2096302b4_original.jpg',//源图url
 *  'crop_img_url':[//裁剪图片url
 *	'http://127.0.0.1/images/47e35bc0-2884-4205-a382-b1c2096302b4/47e35bc0-2884-4205-a382-b1c2096302b4_lg.jpg',
 *		'http://127.0.0.1/images/47e35bc0-2884-4205-a382-b1c2096302b4/47e35bc0-2884-4205-a382-b1c2096302b4_md.jpg',
 *		'http://127.0.0.1/images/47e35bc0-2884-4205-a382-b1c2096302b4/47e35bc0-2884-4205-a382-b1c2096302b4_sm.jpg'
 *		]
 *}
 * 5-3、doFileUpload(file,data),上传回调方法。
 * 
 */
angular.module('ngImgCrop', [ 'ngFileUpload' ]).constant('defaultOption', {}).constant('defaultData', {
	'uploadFile' : {
		'maxSize' : '2MB',
		'accept' : 'image/jpeg,image/png',
		'file' : {},
		'errorFile' : {},
		'imfoMsg' : '提示：请选择类型为jpg和png的图片，大小小于2MB',
		'errorMsg' : {
			'maxSize' : '警告：选择的图片大小超过2MB，请重新选择'
		}
	},
	'w_h_ratio' : 4 / 3,
//	'setSelect' : [0,0,100,75],
	'crop_w' : [ 400, 200, 120 ]
//  'init':true
//	'origin_url':'http://127.0.0.1/images/47e35bc0-2884-4205-a382-b1c2096302b4/47e35bc0-2884-4205-a382-b1c2096302b4_original.jpg',
//	'crop_img_url':[
//		'http://127.0.0.1/images/47e35bc0-2884-4205-a382-b1c2096302b4/47e35bc0-2884-4205-a382-b1c2096302b4_lg.jpg',
//		'http://127.0.0.1/images/47e35bc0-2884-4205-a382-b1c2096302b4/47e35bc0-2884-4205-a382-b1c2096302b4_md.jpg',
//		'http://127.0.0.1/images/47e35bc0-2884-4205-a382-b1c2096302b4/47e35bc0-2884-4205-a382-b1c2096302b4_sm.jpg'
//		]
})
	.directive("jcrop", function($timeout) {
		return {
			restirct : "AE",
			replace : false,
			scope : {
				option : "=", //裁剪选项
				data : "=", //选区及图片值
				selectChange : "&", //用于返回选区及图片信息
				doFileUpload : "&"//图片上传
			},
			controller : function($scope, Upload, defaultOption, defaultData) {
				$scope.option = $scope.option || defaultOption;
				$scope.data = $scope.data || defaultData;
				$scope.uploadFile = $scope.data.uploadFile;
			},
			link : function($scope, element, atts, ctrl) {
				var jcrop_api,boundx,boundy,selectdisplaySize;
				var previewW = $scope.data.crop_w[0];
				var previewH = $scope.data.crop_w[0] / $scope.data.w_h_ratio;
				$scope.jcropInited = false;//插件是否初始化
				$scope.preImgCls = {
					'lg' : true,
					'md' : $scope.data.crop_w.length > 1,
					'sm' : $scope.data.crop_w.length > 2
				}
				$scope.preImgStyle = {
					'lg' : {
						'width' : previewW,
						'height' : previewH
					},
					'md' : $scope.preImgCls.md ? {
						'padding-left':'0',
						'width' : $scope.data.crop_w[1],
						'height' : $scope.data.crop_w[1] / $scope.data.w_h_ratio
					} : '',
					'sm' : $scope.preImgCls.md ? {
						'padding-left':'0',
						'margin-left' : '15px',
						'width' : $scope.data.crop_w[2],
						'height' : $scope.data.crop_w[2] / $scope.data.w_h_ratio
					} : ''
				};
				//设置缩略图样式
				showCoords = function(e) {
					selectdisplaySize = e;
					if(boundx&&boundy){
						for (i in $scope.preImgCls) {
							var _tag = $scope.preImgCls[i];
							if (_tag) {
								var rx = $scope.preImgStyle[i].width / e.w;
								var ry = $scope.preImgStyle[i].height / e.h;
								var _ele_style = ".img-content ." + i;
								element.find(_ele_style).css({
									width : Math.round(rx * boundx) + 'px',
									height : Math.round(ry * boundy) + 'px',
									marginLeft : '-' + Math.round(rx * e.x) + 'px',
									marginTop : '-' + Math.round(ry * e.y) + 'px'
								});
							}
						}
					}
				}
				//设置Jcrop optoins
				$scope.option.onChange = showCoords;
				$scope.option.onSelect = showCoords;
				$scope.option.aspectRatio = $scope.data.w_h_ratio;
				//初始化Jcrop
				$scope.option.jcropInit = function(){
					$scope.jcropInited = true;
					$scope.option.boxWidth = element.find(".imgcrop-content").width();
					element.find(".imgCrop").Jcrop($scope.option, function() {
							jcrop_api = this;
							boundx = jcrop_api.ui.stage.width;
							boundy = jcrop_api.ui.stage.height;
							$scope.jcrop_api = jcrop_api;
						}
					);
				}
				$scope.selectChange = function() {
					return {
						"selectActualSize" : selectdisplaySize,
						"imgActualSize" : [boundx,boundy]
					}
				}
				//文件变化
				$timeout(function(){
					$scope.$watch('uploadFile.file.$ngfBlobUrl', function(newValue, oldValue, scope) {
						if(newValue && scope.jcrop_api){
							$scope.data.init = false;
							element.find(".imgCrop")[0].onload = function(){
				            	scope.jcrop_api.ui.stage.redraw();
				            }
						}
					});
				});
				//文件选择
				$scope.fileSelected = function($files, $file, $event, $rejectedFiles){
					$scope.option.jcropInit();
				}
				//文件上传
				$scope.fileUpload = function() {
					$scope.doFileUpload({
						"file" : $scope.uploadFile.file,
						"data" : $scope.selectChange()
					});
				}
			},
			template : '  	<div class="row imgcropBox"> '
				+ '  		<div class="col-sm-11"> '
				+ '  			<label class="col-sm-9">'
				+ '					<span class="text-warning">{{uploadFile.invalidFile.$error?uploadFile.errorMsg[uploadFile.invalidFile.$error]:uploadFile.imfoMsg}}</span></label>'
				+ '             <label class="col-sm-3 text-right">'
				+ '				<a class="text-info" ngf-model-invalid="uploadFile.invalidFile" accept="{{uploadFile.accept}}" ngf-max-size="uploadFile.maxSize" ngf-select ngf-change="fileSelected($files, $file, $event, $rejectedFiles)" ng-model="uploadFile.file">选择文件</a>'
				+ '             <a class="btn btn-sm uploadfile m-l" ng-class="{true:\'btn-info\',false:\'btn-default\'}[!!uploadFile.file.name]" ng-disabled="!uploadFile.file.name" ng-click="fileUpload()">上传</a>'
				+ '             </label>'
				+ '  		</div>'
				+ '  		<div class="col-sm-6 imgcrop-content">'
				+ '  			<img style="display:none;" ngf-src="uploadFile.file" />'
				+ '  			<img id="imgCrop" class="img-responsive imgCrop" ng-src="{{data.init?data.origin_url:uploadFile.file.$ngfBlobUrl}}" /> '
				+ '  		</div> '
				+ '  		<div class="col-sm-5">'
				+ '  			<div class="row img-content" ng-style="preImgStyle.lg"><img class="lg" ng-src="{{data.init?data.crop_img_url[0]:uploadFile.file.$ngfBlobUrl}}"/> </div>'
				+ '  			<div class="row small"> '
				+ '  				<div class="col-sm-6 img-content" ng-if="preImgCls.md" ng-style="preImgStyle.md"> '
				+ '  					<img class="md" ng-src="{{data.init?data.crop_img_url[1]:uploadFile.file.$ngfBlobUrl}}"/> '
				+ '  				</div> '
				+ '  				<div class="col-sm-6 img-content" ng-if="preImgCls.sm" ng-style="preImgStyle.sm"> '
				+ '  					<img class="sm" ng-src="{{data.init?data.crop_img_url[2]:uploadFile.file.$ngfBlobUrl}}"/>'
				+ '  				</div> '
				+ '  			</div> '
				+ '  		</div> '
				+ '  	</div> '
		}
	})
