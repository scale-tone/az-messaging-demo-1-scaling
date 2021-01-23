"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_hubs_1 = require("@azure/event-hubs");
// AppInsights for sending custom events
const appInsights = __importStar(require("applicationinsights"));
const shared_1 = require("../shared");
// Sending a bunch of events at every Function startup
function SendSomeEventsAtStartup(numOfEvents) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new event_hubs_1.EventHubProducerClient(process.env['EventHubsConnection'], 'input');
        var batch = yield client.createBatch();
        for (var i = 0; i < numOfEvents; i++) {
            const body = `${new Date().toJSON()}: event${i}`;
            if (!batch.tryAdd({ body })) {
                yield client.sendBatch(batch);
                batch = yield client.createBatch();
                batch.tryAdd({ body });
            }
        }
        yield client.sendBatch(batch);
        yield client.close();
    });
}
SendSomeEventsAtStartup(shared_1.NumOfEventsToSend);
// Actual processing function
function default_1(context, eventHubMessages) {
    return __awaiter(this, void 0, void 0, function* () {
        for (var message of eventHubMessages) {
            // emulating a 100 ms processing delay
            yield new Promise(resolve => setTimeout(resolve, 100));
            context.log(`EventHubHandler got ${message}`);
            appInsights.defaultClient.trackMetric({ name: 'EventHubEventProcessed', value: 1 });
        }
    });
}
exports.default = default_1;
;
//# sourceMappingURL=index.js.map