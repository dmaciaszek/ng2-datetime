"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var CUSTOM_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return NKDatetime; }),
    multi: true
};
var NKDatetime = /** @class */ (function () {
    function NKDatetime() {
        this.timepickerOptions = {};
        this.datepickerOptions = {};
        this.idDatePicker = uniqueId('q-datepicker_');
        this.idTimePicker = uniqueId('q-timepicker_');
        this.onChange = function (_) {
        };
        this.onTouched = function () {
        };
    }
    Object.defineProperty(NKDatetime.prototype, "tabindexAttr", {
        get: function () {
            return this.tabindex === undefined ? '-1' : undefined;
        },
        enumerable: true,
        configurable: true
    });
    NKDatetime.prototype.ngAfterViewInit = function () {
        this.init();
    };
    NKDatetime.prototype.ngOnDestroy = function () {
        if (this.datepicker) {
            this.datepicker.datepicker('destroy');
        }
        if (this.timepicker) {
            this.timepicker.timepicker('remove');
        }
    };
    NKDatetime.prototype.ngOnChanges = function (changes) {
        if (changes) {
            if (changes['datepickerOptions'] && this.datepicker) {
                this.datepicker.datepicker('destroy');
                if (changes['datepickerOptions'].currentValue) {
                    this.datepicker = null;
                    this.init();
                }
                else if (changes['datepickerOptions'].currentValue === false) {
                    this.datepicker.remove();
                }
            }
            if (changes['timepickerOptions'] && this.timepicker) {
                this.timepicker.timepicker('remove');
                if (changes['timepickerOptions'].currentValue) {
                    this.timepicker = null;
                    this.init();
                }
                else if (changes['timepickerOptions'].currentValue === false) {
                    this.timepicker.parent().remove();
                }
            }
        }
    };
    NKDatetime.prototype.writeValue = function (value) {
        if (this.date !== value) {
            this.date = value;
            if (isDate(this.date)) {
                this.updateModel(this.date);
            }
            else {
                this.clearModels();
            }
        }
    };
    NKDatetime.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    NKDatetime.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    NKDatetime.prototype.checkEmptyValue = function (e) {
        var value = e.target.value;
        if (value === '' && (this.timepickerOptions === false ||
            this.datepickerOptions === false ||
            (this.timeModel === '' && this.dateModel === ''))) {
            this.onChange(undefined);
        }
    };
    NKDatetime.prototype.clearModels = function () {
        this.onChange(undefined);
        if (this.timepicker) {
            this.timepicker.timepicker('setTime', null);
        }
        this.updateDatepicker(null);
    };
    NKDatetime.prototype.showTimepicker = function () {
        this.timepicker.timepicker('showWidget');
    };
    NKDatetime.prototype.showDatepicker = function () {
        this.datepicker.datepicker('show');
    };
    NKDatetime.prototype.setDisabledState = function (isDisabled) {
        this.readonly = isDisabled;
    };
    //////////////////////////////////
    NKDatetime.prototype.init = function () {
        var _this = this;
        if (!this.datepicker && this.datepickerOptions !== false) {
            var options = jQuery.extend({ enableOnReadonly: this.readonly }, this.datepickerOptions);
            this.datepicker = $('#' + this.idDatePicker).datepicker(options);
            this.datepicker
                .on('changeDate', function (e) {
                var newDate = e.date;
                if (isDate(_this.date) && isDate(newDate)) {
                    // get hours/minutes
                    newDate.setHours(_this.date.getHours());
                    newDate.setMinutes(_this.date.getMinutes());
                    newDate.setSeconds(_this.date.getSeconds());
                }
                _this.date = newDate;
                _this.onChange(newDate);
            });
        }
        else if (this.datepickerOptions === false) {
            $('#' + this.idDatePicker).remove();
        }
        if (!this.timepicker && this.timepickerOptions !== false) {
            var options = jQuery.extend({ defaultTime: false }, this.timepickerOptions);
            this.timepicker = $('#' + this.idTimePicker).timepicker(options);
            this.timepicker
                .on('changeTime.timepicker', function (e) {
                var _a = e.time, meridian = _a.meridian, hours = _a.hours;
                if (meridian) {
                    // has meridian -> convert 12 to 24h
                    if (meridian === 'PM' && hours < 12) {
                        hours = hours + 12;
                    }
                    if (meridian === 'AM' && hours === 12) {
                        hours = hours - 12;
                    }
                    hours = parseInt(_this.pad(hours), 10);
                }
                if (!isDate(_this.date)) {
                    _this.date = new Date();
                    _this.updateDatepicker(_this.date);
                }
                _this.date.setHours(hours);
                _this.date.setMinutes(e.time.minutes);
                _this.date.setSeconds(e.time.seconds);
                _this.onChange(_this.date);
            });
        }
        else if (this.timepickerOptions === false) {
            $('#' + this.idTimePicker).parent().remove();
        }
        if (isDate(this.date)) {
            this.updateModel(this.date);
        }
    };
    NKDatetime.prototype.updateModel = function (date) {
        this.updateDatepicker(date);
        // update timepicker
        if (this.timepicker !== undefined && isDate(date)) {
            var hours = date.getHours();
            if (this.timepickerOptions.showMeridian) {
                // Convert 24 to 12 hour system
                hours = (hours === 0 || hours === 12) ? 12 : hours % 12;
            }
            var meridian = date.getHours() >= 12 ? ' PM' : ' AM';
            var time = this.pad(hours) + ':' +
                this.pad(this.date.getMinutes()) + ':' +
                this.pad(this.date.getSeconds()) +
                (this.timepickerOptions.showMeridian || this.timepickerOptions.showMeridian === undefined
                    ? meridian : '');
            this.timepicker.timepicker('setTime', time);
            this.timeModel = time; // fix initial empty timeModel bug
        }
    };
    NKDatetime.prototype.updateDatepicker = function (date) {
        if (this.datepicker !== undefined) {
            this.datepicker.datepicker('update', date);
        }
    };
    NKDatetime.prototype.pad = function (value) {
        return value.toString().length < 2 ? '0' + value : value.toString();
    };
    __decorate([
        core_1.Input('timepicker'),
        __metadata("design:type", Object)
    ], NKDatetime.prototype, "timepickerOptions", void 0);
    __decorate([
        core_1.Input('datepicker'),
        __metadata("design:type", Object)
    ], NKDatetime.prototype, "datepickerOptions", void 0);
    __decorate([
        core_1.Input('hasClearButton'),
        __metadata("design:type", Boolean)
    ], NKDatetime.prototype, "hasClearButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NKDatetime.prototype, "readonly", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NKDatetime.prototype, "required", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NKDatetime.prototype, "tabindex", void 0);
    __decorate([
        core_1.HostListener('blur'),
        __metadata("design:type", Object)
    ], NKDatetime.prototype, "onTouched", void 0);
    __decorate([
        core_1.HostBinding('attr.tabindex'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], NKDatetime.prototype, "tabindexAttr", null);
    NKDatetime = __decorate([
        core_1.Component({
            selector: 'datetime',
            providers: [CUSTOM_ACCESSOR],
            template: "\n        <div class=\"ng2-datetime\">\n            <div [ngClass]=\"{ 'input-group': !datepickerOptions.hideIcon, 'date': true }\"\n                 [hidden]=\"!datepickerOptions\">\n                <input id=\"{{idDatePicker}}\" type=\"text\" class=\"form-control\" autocomplete=\"off\"\n                       [attr.readonly]=\"readonly || null\"\n                       [attr.required]=\"required || null\"\n                       [attr.placeholder]=\"datepickerOptions.placeholder || 'Choose date'\"\n                       [attr.tabindex]=\"tabindex\"\n                       [(ngModel)]=\"dateModel\"\n                       (blur)=\"onTouched()\"\n                       (keyup)=\"checkEmptyValue($event)\"/>\n                <div [hidden]=\"datepickerOptions.hideIcon || datepickerOptions === false\"\n                     (click)=\"showDatepicker()\"\n                     class=\"input-group-addon\">\n                    <span [ngClass]=\"datepickerOptions.icon || 'glyphicon glyphicon-th'\"></span>\n                </div>\n            </div>\n            <div [ngClass]=\"{ 'input-group': !timepickerOptions.hideIcon, 'bootstrap-timepicker timepicker': true }\"\n                 [hidden]=\"!timepickerOptions\">\n                <input id=\"{{idTimePicker}}\" type=\"text\" class=\"form-control input-small\" autocomplete=\"off\"\n                       [attr.readonly]=\"readonly || null\"\n                       [attr.required]=\"required || null\"\n                       [attr.placeholder]=\"timepickerOptions.placeholder || 'Set time'\"\n                       [attr.tabindex]=\"tabindex\"\n                       [(ngModel)]=\"timeModel\"\n                       (focus)=\"showTimepicker()\"\n                       (blur)=\"onTouched()\"\n                       (keyup)=\"checkEmptyValue($event)\">\n                <span [hidden]=\"timepickerOptions.hideIcon || false\" class=\"input-group-addon\">\n                    <i [ngClass]=\"timepickerOptions.icon || 'glyphicon glyphicon-time'\"></i>\n                </span>\n            </div>\n            <button *ngIf=\"hasClearButton\" type=\"button\" (click)=\"clearModels()\">Clear</button>\n        </div>\n    ",
            styles: [
                '.ng2-datetime *[hidden] { display: none; }'
            ]
        })
    ], NKDatetime);
    return NKDatetime;
}());
exports.NKDatetime = NKDatetime;
var id = 0;
function uniqueId(prefix) {
    return prefix + ++id;
}
function isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
}
//# sourceMappingURL=ng2-datetime.js.map