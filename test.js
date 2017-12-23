const Benchmark = require('benchmark');
const protobuf = require("protobufjs");
const path = require('path');
const suite = new Benchmark.Suite;
const root = new protobuf.Root();

const PROTO_PATH = path.resolve(__dirname, './protobuf/msg.proto');
const protoRoot = root.loadSync(PROTO_PATH, { keepCase: true, enumsAsStrings:true });
const protoTypes = protoRoot.nested.whyun;
const Msg = protoTypes.Msg;

const testData = {
    question: 'What is the answer to life and everything?',
    answer: 23
};

const protoMsg = Msg.encode(Msg.create(testData)).finish();
const jsonMsg = JSON.stringify(testData);

// add tests
suite.add('JSON.stringify', function() {
  JSON.stringify(testData);
})
.add('protobuf encode', function() {
    Msg.encode(Msg.create(testData)).finish();
})
.add('JSON.parse',function() {
    JSON.parse(jsonMsg);
})
.add('protobuf decode',function() {
    Msg.decode(protoMsg);
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });


