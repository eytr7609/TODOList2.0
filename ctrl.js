var myAppName = angular.module('myAppName', ['ngMaterial','ngMessages']);

myAppName.controller('taskCtrl', function($scope,$filter,$mdDialog){
	$scope.lists = [];
	$scope.pTask = '';

	$scope.add = function(){
		if ($scope.pTask && $scope.pDate){
				$scope.lists.push({
				task: $scope.pTask,
				//date: $filter('date')($scope.pDate, 'yyyy-MM-dd'),
				dateNO: $scope.pDate,
				checked: false
			});
			$scope.pTask = '';
			$scope.pDate = null;
		}
	};

	$scope.remove = function(index){
		$scope.lists.splice(index, 1);
	};
	
	$scope.remaining = function() 
	{
		var count = 0;
		
		angular.forEach($scope.lists, function(item) 
		{   
			checked = item.done;
			count += item.done ? 0 : 1;
		});
		return count;
	};
	
	$scope.delete = function()
	{
		var buffer = $scope.lists;
		$scope.lists = [];
		angular.forEach(buffer, function(item) 
		{
			if (!item.done) {
				$scope.lists.push(item);
			}
		});
	};
	
	$scope.sortBy = function(propertyName)
	{
		$scope.lists = $filter('orderBy')($scope.lists, propertyName);
	};
	
	function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
	
	$scope.answer = function(answer) {
		if (answer[0]=='yes') {
			if ($scope.mTask){
				answer[0] = $scope.mTask;
			}
			if ($scope.mDate){
				answer[1] = $scope.mDate;//$filter('date')($scope.mDate,'yyyy-MM-dd');
			}
		}
		$mdDialog.hide(answer);
    };
	}
	
	$scope.showDialog = function(ev,index) {
		if(ev.currentTarget.previousElementSibling.className!="done-true"){
			$mdDialog.show({
			  scope: $scope,
			  preserveScope: true,
			  controller: DialogController,
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:false,
			  template:
				  '<md-dialog>' +
				  '<md-dialog-actions layout="column">' +
				  '<div style="padding-top: 15px">' +
				  '<md-input-container md-no-float="" class="md-block">' +
				  '<input ng-model="mTask" placeholder="{{ mTask }}">' + 
				  '</md-input-container>' +
				  '</div>' +
				  '<div style="padding-bottom: 10px">' +
				  '<md-datepicker ng-model="mDate" md-placeholder="{{ mDate }}" md-open-on-focus></md-datepicker>' +
				  '</div>' +
				  '<div>' +
				  '<md-button ng-click="answer([' + "'no'" + ',' + "'no'" + '])">取消</md-button>' +
				  '<md-button ng-click="answer([' + "'yes'" + ',' + "'yes'" + '])">確認</md-button>' +
				  '<div>' +
				  '</md-dialog-actions>' +
				  '</md-dialog>' ,
			  fullscreen: $scope.customFullscreen,
			  bindToController: true,
			  locals: { mTask: $scope.lists[index].task,
						mDate: $scope.dateNO
						}
			})
			.then(function(answer) {
				if (answer[0] != 'yes' && answer[0] != 'no') {
					$scope.lists[index].task = answer[0];
				}
				if (answer[1] != 'yes' && answer[1] != 'no') {
					$scope.lists[index].dateNO = answer[1];
				}
				}, function() {
			});
		}
		$scope.mTask = $scope.lists[index].task;
		$scope.mDate = $scope.lists[index].dateNO;
	};  
});

myAppName.config(function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.months = ['一月', '二月', '三月', '四月', '五月', '六月', 
										'七月', '八月', '九月', '十月', '十一月', '十二月'];
	$mdDateLocaleProvider.shortMonths = ['一月', '二月', '三月', '四月', '五月', '六月', 
										'七月', '八月', '九月', '十月', '十一月', '十二月'];
	$mdDateLocaleProvider.days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	$mdDateLocaleProvider.shortDays = ['日', '一', '二', '三', '四', '五','六'];
	//$mdDateLocaleProvider.firstDayOfWeek = 0;
	$mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
		return '週 ' + weekNumber;
	};
	$mdDateLocaleProvider.formatDate = function(date) {
		if (date) {
			return moment(date).format('YYYY-MM-DD');
		}
		else {
			return null;
		}
	};
	$mdDateLocaleProvider.msgCalendar = '日曆';
	$mdDateLocaleProvider.msgOpenCalendar = '打開日曆';
});


