var test = require('tape')
var core = require('./core')
var sinon = require('sinon')

test('when no username, calls registerUser (button NOT pressed)', function(t) {

  var fakeGeneratedUsername = '12345abcd'
  var fakeIP = '111.222.111.222'
  var apiStub = {
    registerUser:
      sinon.stub().withArgs(fakeIP, null, 'My nice node api thingee')
        .yields(new Error('Press button on bridge'))
  };

  var services = {
    hue: {
      nupnpSearch: sinon.stub().yields(null,
        [{"id":"001788ddde155085","ipaddress":fakeIP}]
      ),
      HueApi: sinon.stub().returns(apiStub)
    },
    fs: {
      readFile: sinon.stub().withArgs('./username.tmp').yields(new Error('Could not read file')),
      writeFile: sinon.spy()
    },
    console: {
      log: sinon.stub()
    }
  }

  core(services)

  t.ok(
    services.console.log.calledWith('Not authenticated. Please press the button on your bridge and run this script again.'),
    'asks user to press button')
  t.end()

})

test('when no username, calls registerUser (button pressed)', function(t) {

  var fakeGeneratedUsername = '12345abcd'
  var fakeIP = '111.222.111.222'
  var apiStub = {
    registerUser:
      sinon.stub().withArgs(fakeIP, null, 'My nice node api thingee')
        .yields(null, fakeGeneratedUsername)
  };

  var services = {
    hue: {
      nupnpSearch: sinon.stub().yields(null,
        [{"id":"001788ddde155085","ipaddress":fakeIP}]
      ),
      HueApi: sinon.stub().returns(apiStub)
    },
    fs: {
      readFile: sinon.stub().withArgs('./username.tmp').yields(new Error('Could not read file')),
      writeFile: sinon.spy()
    },
    console: {
      log: sinon.stub()
    }
  }

  core(services)

  t.ok(services.fs.writeFile.calledWith('./username.tmp', fakeGeneratedUsername))

  t.end()

})



test('when username exists, turns off workroom bulb', function(t) {

  var fakeGeneratedUsername = '12345abcd'
  var fakeIP = '111.222.111.222'
  var apiStub = {
    lights: sinon.stub().yields(null, {
      "lights": [
        {
          "id": "3",
          "type": "Extended color light",
          "name": "Dorren",
          "modelid": "LCT001",
          "uniqueid": "00:17:88:01:00:e7:a9:e6-0b",
          "swversion": "66013452"
        }, {
          "id": "15",
          "type": "Dimmable light",
          "name": "Arbetsrummet Tak",
          "modelid": "LWB004",
          "uniqueid": "00:17:88:01:00:da:0f:27-0b",
          "swversion": "66012040"
        }
      ]
    }),
    setLightState: sinon.spy()
  };

  var offState = {}
  var services = {
    hue: {
      nupnpSearch: sinon.stub().yields(null,
        [{"id":"001788ddde155085","ipaddress":fakeIP}]
      ),
      HueApi: sinon.stub()
        .withArgs(fakeIP, fakeGeneratedUsername)
        .returns(apiStub),
      lightState: {
        create: function() {
          return {
            off: function() { return offState }
          }
        }
      }
    },
    fs: {
      readFile: sinon.stub().withArgs('./username.tmp', 'utf8')
        .yields(null, fakeGeneratedUsername),
      writeFile: sinon.stub()
    },
    console: {
      log: sinon.stub()
    }
  }

  core(services)

  t.ok(
    apiStub.setLightState.calledWith('15', offState),
    'calls setLightState')

  t.ok(
    services.console.log.withArgs('All workroom lights turned off'),
    'logs message to console')

  t.end()

})

test('when username exists')
