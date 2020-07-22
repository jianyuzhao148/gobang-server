"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User() {
        this._id = "";
        this._name = "";
        this._title = "";
        this._total = 0;
        this._winning_probability = 0;
        this._wealth = 0;
    }
    Object.defineProperty(User.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (title) {
            this._title = title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "total", {
        get: function () {
            return this._total;
        },
        set: function (total) {
            this._total = total;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "winning_probability", {
        get: function () {
            return this._winning_probability;
        },
        set: function (winning_probability) {
            this._winning_probability = winning_probability;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "wealth", {
        get: function () {
            return this._wealth;
        },
        set: function (wealth) {
            this._wealth = wealth;
        },
        enumerable: false,
        configurable: true
    });
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map