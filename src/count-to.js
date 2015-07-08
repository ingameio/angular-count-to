var countTo = angular.module('countTo', [])
    .directive('countTo', ['$timeout', '$parse', 'numberFilter', function ($timeout, $parse, numberFilter) {
        return {
            replace: false,
            scope: true,
            link: function (scope, element, attrs) {

                var e = element[0];
                var num, refreshInterval, duration, steps, step, countTo, value, increment;
                var numberFormat = $parse(attrs.numberFormat)(scope);
                var numberFormatFractionSize = $parse(attrs.numberFormatFractionSize)(scope) || 0;

                var calculate = function () {
                    refreshInterval = 30;
                    step = 0;
                    scope.timoutId = null;
                    countTo = parseFloat(attrs.countTo) || 0;
                    scope.value = parseFloat(attrs.value, 10) || 0;
                    duration = (parseFloat(attrs.duration) * 1000) || 0;

                    steps = Math.ceil(duration / refreshInterval);
                    increment = ((countTo - scope.value) / steps);
                    num = scope.value;
                };

                var tick = function () {
                    scope.timoutId = $timeout(function () {
                        num += increment;
                        step++;
                        if (step >= steps) {
                            $timeout.cancel(scope.timoutId);
                            num = countTo;
                            if (numberFormat)
                                countTo = numberFilter(countTo, numberFormatFractionSize);
                            e.textContent = countTo;
                        } else {
                            roundedNum = num;
                            if (numberFormat)
                                roundedNum = numberFilter(num, numberFormatFractionSize);
                            e.textContent = roundedNum;
                            tick();
                        }
                    }, refreshInterval);

                }

                var start = function () {
                    if (scope.timoutId) {
                        $timeout.cancel(scope.timoutId);
                    }
                    calculate();
                    tick();
                }

                attrs.$observe('countTo', function (val) {
                    if (val) {
                        start();
                    }
                });

                attrs.$observe('value', function (val) {
                    start();
                });

                return true;
            }
        }

    }]);
