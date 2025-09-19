"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = exports.nodes = void 0;

const OpenStackSwiftApi_credentials_1 = require("./credentials/OpenStackSwiftApi.credentials");

const OpenStackSwift_node_1 = require("./nodes/OpenStackSwift/OpenStackSwift.node");

exports.nodes = [ OpenStackSwift_node_1.OpenStackSwift ];
exports.credentials = [ OpenStackSwiftApi_credentials_1.OpenStackSwiftApi ];
