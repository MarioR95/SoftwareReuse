const {qonsole} = require('qonsole');

beforeAll(() => {
  //set missing console functionality for headless testing
  console.timeStamp = console.timeStamp || function(s){ console.log('timestamp: ',s);}
  console.groupCollapsed = console.groupCollapsed || function(s){ console.log('group collapsing: ',s);}
  console.groupEnd = console.groupEnd || function(s){ console.log('group ended: ',s);}
})
beforeEach(() => {
  //reset defaults
  qonsole.GLOBAL_SETTINGS_UPDATED = {setLogLevel:false,showGroups:false,debugCalled:false};
  qonsole.GLOBAL_SETTINGS_ERROR = false;
  qonsole.BROWSER_URL_OVERRIDE = 0;
  qonsole.GROUPS = {};
  delete qonsole.logLevel;
})

describe('qonsole setup', () => {
  test('is loaded', () => {
    expect(qonsole).toBeTruthy();
  });

  test('can set globals', () => {
    expect(qonsole.logLevel).toBeUndefined();
    qonsole.setLogLevel(qonsole.NORM);
    expect(qonsole.logLevel).toEqual(qonsole.NORM);
  });

  test('can set logLevel globals only once', () => {
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(false);
    qonsole.setLogLevel(qonsole.NORM);
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(false);
    qonsole.setLogLevel(qonsole.NORM);
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(true);
  });

  test('can set showGroup globals only once', () => {
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(false);
    qonsole.showGroups(['group1']);
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(false);
    qonsole.showGroups(['group2']);
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(true);
  });

  test('can set showGroup and logLevel globals', () => {
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(false);
    qonsole.setLogLevel(qonsole.NORM);
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(false);
    qonsole.showGroups(['group1']);
    expect(qonsole.GLOBAL_SETTINGS_ERROR).toEqual(false);
  });

});

describe('qonsole output', () => {
  test('log levels can be set', () => {
    expect(qonsole.logLevel).toBe(undefined);
    qonsole.setLogLevel(qonsole.NORM);
    expect(qonsole.logLevel).toBe(qonsole.NORM);
  });

  test('log types can be set, with default failover', () => {
    qonsole.debug('test debug1');
    qonsole.debug(qonsole.INFO,'test debug2');
    qonsole.debug(qonsole.NON_EXISTS,'test debug3');
    expect(true).toBeTruthy();//make sure nothing breaks
  });

  test('groups can be set', () => {
    qonsole.setGroup('group1',qonsole.NORM);
    expect(true).toBeTruthy();//make sure nothing breaks
  });
});

describe('qonsole overrides', () => {
  test('will not display with PROD', () => {
    expect(qonsole.debug('a')).toEqual(undefined);//no errors
    expect(qonsole.debug(qonsole.PROD,'b')).toBeFalsy();//stops display function
  });

  test('showGroups will set logLevel to PROD', () => {
    expect(qonsole.logLevel).toEqual(undefined);
    qonsole.setLogLevel(qonsole.NORM);
    expect(qonsole.logLevel).toEqual(qonsole.NORM);
    qonsole.showGroups(['group2']);
    expect(qonsole.logLevel).toEqual(qonsole.PROD);
  });

  test('url override is taken into account', () => {
    expect(qonsole.BROWSER_URL_OVERRIDE).toEqual(0);
    qonsole.browserOverride();
    expect(qonsole.BROWSER_URL_OVERRIDE).toEqual(2);
  });
});
