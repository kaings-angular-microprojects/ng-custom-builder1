"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var core_1 = require("@angular-devkit/core");
var fs_1 = require("fs");
var dateformat_1 = __importDefault(require("dateformat"));
//const dateFormat = require('dateformat')
var TimestampBuilder = /** @class */ (function () {
    function TimestampBuilder(context) {
        this.context = context;
    }
    TimestampBuilder.prototype.run = function (builderConfig) {
        var _this = this;
        var root = this.context.workspace.root;
        var _a = builderConfig.options, path = _a.path, format = _a.format;
        var timestampFileName = core_1.getSystemPath(root) + "/" + path;
        var readFileObservable = rxjs_1.bindNodeCallback(fs_1.readFile);
        var writeFileObservable = rxjs_1.bindNodeCallback(fs_1.writeFile);
        return writeFileObservable(timestampFileName, dateformat_1.default(new Date(), format) + '\n').pipe(operators_1.map(function () { return readFileObservable(timestampFileName); }), operators_1.map(function (res) {
            _this.context.logger.info('Previous timestamp..... ' + res);
            return { success: true };
        }), operators_1.tap(function () { return _this.context.logger.info("Timestamp created"); }), operators_1.catchError(function (e) {
            _this.context.logger.error("Failed to create timestamp", e);
            return rxjs_1.of({ success: false });
        }));
    };
    return TimestampBuilder;
}());
exports.default = TimestampBuilder;
