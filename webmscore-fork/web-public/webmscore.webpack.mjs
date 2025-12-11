
const libWasm = '/webmscore.lib.wasm'
const libData = '/webmscore.lib.data'
const libMem = '/webmscore.lib.mem.wasm'

const WebMscoreWorker = function () { 
(function () {

  var Module$1 = (function() {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
  function(Module) {
    Module = Module || {};



  // The Module object: Our interface to the outside world. We import
  // and export values on it. There are various ways Module can be used:
  // 1. Not defined. We create it here
  // 2. A function parameter, function(Module) { ..generated code.. }
  // 3. pre-run appended it, var Module = {}; ..generated code..
  // 4. External script tag defines var Module.
  // We need to check if Module already exists (e.g. case 3 above).
  // Substitution will be replaced with actual code on later stage of the build,
  // this way Closure Compiler will not mangle it (e.g. case 4. above).
  // Note that if you want to run closure, and also to use Module
  // after the generated code, you will need to define   var Module = {};
  // before the code. Then that object will be used in the code, and you
  // can continue to use Module afterwards as well.
  var Module = typeof Module !== 'undefined' ? Module : {};


  // Set up the promise that indicates the Module is initialized
  var readyPromiseResolve, readyPromiseReject;
  Module['ready'] = new Promise(function(resolve, reject) {
    readyPromiseResolve = resolve;
    readyPromiseReject = reject;
  });

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '___cxa_demangle')) {
          Object.defineProperty(Module['ready'], '___cxa_demangle', { configurable: true, get: function() { abort('You are getting ___cxa_demangle on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '___cxa_demangle', { configurable: true, set: function() { abort('You are setting ___cxa_demangle on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_stackSave')) {
          Object.defineProperty(Module['ready'], '_stackSave', { configurable: true, get: function() { abort('You are getting _stackSave on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_stackSave', { configurable: true, set: function() { abort('You are setting _stackSave on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_stackRestore')) {
          Object.defineProperty(Module['ready'], '_stackRestore', { configurable: true, get: function() { abort('You are getting _stackRestore on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_stackRestore', { configurable: true, set: function() { abort('You are setting _stackRestore on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_stackAlloc')) {
          Object.defineProperty(Module['ready'], '_stackAlloc', { configurable: true, get: function() { abort('You are getting _stackAlloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_stackAlloc', { configurable: true, set: function() { abort('You are setting _stackAlloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '___data_end')) {
          Object.defineProperty(Module['ready'], '___data_end', { configurable: true, get: function() { abort('You are getting ___data_end on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '___data_end', { configurable: true, set: function() { abort('You are setting ___data_end on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '___wasm_call_ctors')) {
          Object.defineProperty(Module['ready'], '___wasm_call_ctors', { configurable: true, get: function() { abort('You are getting ___wasm_call_ctors on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '___wasm_call_ctors', { configurable: true, set: function() { abort('You are setting ___wasm_call_ctors on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_fflush')) {
          Object.defineProperty(Module['ready'], '_fflush', { configurable: true, get: function() { abort('You are getting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_fflush', { configurable: true, set: function() { abort('You are setting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '___errno_location')) {
          Object.defineProperty(Module['ready'], '___errno_location', { configurable: true, get: function() { abort('You are getting ___errno_location on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '___errno_location', { configurable: true, set: function() { abort('You are setting ___errno_location on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_malloc')) {
          Object.defineProperty(Module['ready'], '_malloc', { configurable: true, get: function() { abort('You are getting _malloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_malloc', { configurable: true, set: function() { abort('You are setting _malloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_free')) {
          Object.defineProperty(Module['ready'], '_free', { configurable: true, get: function() { abort('You are getting _free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_free', { configurable: true, set: function() { abort('You are setting _free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_setThrew')) {
          Object.defineProperty(Module['ready'], '_setThrew', { configurable: true, get: function() { abort('You are getting _setThrew on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_setThrew', { configurable: true, set: function() { abort('You are setting _setThrew on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_memalign')) {
          Object.defineProperty(Module['ready'], '_memalign', { configurable: true, get: function() { abort('You are getting _memalign on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_memalign', { configurable: true, set: function() { abort('You are setting _memalign on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_memset')) {
          Object.defineProperty(Module['ready'], '_memset', { configurable: true, get: function() { abort('You are getting _memset on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_memset', { configurable: true, set: function() { abort('You are setting _memset on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strlen')) {
          Object.defineProperty(Module['ready'], '_strlen', { configurable: true, get: function() { abort('You are getting _strlen on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_strlen', { configurable: true, set: function() { abort('You are setting _strlen on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '__ZSt18uncaught_exceptionv')) {
          Object.defineProperty(Module['ready'], '__ZSt18uncaught_exceptionv', { configurable: true, get: function() { abort('You are getting __ZSt18uncaught_exceptionv on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '__ZSt18uncaught_exceptionv', { configurable: true, set: function() { abort('You are setting __ZSt18uncaught_exceptionv on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '__get_tzname')) {
          Object.defineProperty(Module['ready'], '__get_tzname', { configurable: true, get: function() { abort('You are getting __get_tzname on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '__get_tzname', { configurable: true, set: function() { abort('You are setting __get_tzname on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '__get_daylight')) {
          Object.defineProperty(Module['ready'], '__get_daylight', { configurable: true, get: function() { abort('You are getting __get_daylight on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '__get_daylight', { configurable: true, set: function() { abort('You are setting __get_daylight on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '__get_timezone')) {
          Object.defineProperty(Module['ready'], '__get_timezone', { configurable: true, get: function() { abort('You are getting __get_timezone on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '__get_timezone', { configurable: true, set: function() { abort('You are setting __get_timezone on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_realloc')) {
          Object.defineProperty(Module['ready'], '_realloc', { configurable: true, get: function() { abort('You are getting _realloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_realloc', { configurable: true, set: function() { abort('You are setting _realloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_testSetjmp')) {
          Object.defineProperty(Module['ready'], '_testSetjmp', { configurable: true, get: function() { abort('You are getting _testSetjmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_testSetjmp', { configurable: true, set: function() { abort('You are setting _testSetjmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_saveSetjmp')) {
          Object.defineProperty(Module['ready'], '_saveSetjmp', { configurable: true, get: function() { abort('You are getting _saveSetjmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_saveSetjmp', { configurable: true, set: function() { abort('You are setting _saveSetjmp on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_emscripten_main_thread_process_queued_calls')) {
          Object.defineProperty(Module['ready'], '_emscripten_main_thread_process_queued_calls', { configurable: true, get: function() { abort('You are getting _emscripten_main_thread_process_queued_calls on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_emscripten_main_thread_process_queued_calls', { configurable: true, set: function() { abort('You are setting _emscripten_main_thread_process_queued_calls on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_emscripten_GetProcAddress')) {
          Object.defineProperty(Module['ready'], '_emscripten_GetProcAddress', { configurable: true, get: function() { abort('You are getting _emscripten_GetProcAddress on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_emscripten_GetProcAddress', { configurable: true, set: function() { abort('You are setting _emscripten_GetProcAddress on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_strstr')) {
          Object.defineProperty(Module['ready'], '_strstr', { configurable: true, get: function() { abort('You are getting _strstr on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_strstr', { configurable: true, set: function() { abort('You are setting _strstr on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_emscripten_webgl_make_context_current')) {
          Object.defineProperty(Module['ready'], '_emscripten_webgl_make_context_current', { configurable: true, get: function() { abort('You are getting _emscripten_webgl_make_context_current on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_emscripten_webgl_make_context_current', { configurable: true, set: function() { abort('You are setting _emscripten_webgl_make_context_current on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], '_emscripten_webgl_get_current_context')) {
          Object.defineProperty(Module['ready'], '_emscripten_webgl_get_current_context', { configurable: true, get: function() { abort('You are getting _emscripten_webgl_get_current_context on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], '_emscripten_webgl_get_current_context', { configurable: true, set: function() { abort('You are setting _emscripten_webgl_get_current_context on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

        if (!Object.getOwnPropertyDescriptor(Module['ready'], 'onRuntimeInitialized')) {
          Object.defineProperty(Module['ready'], 'onRuntimeInitialized', { configurable: true, get: function() { abort('You are getting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
          Object.defineProperty(Module['ready'], 'onRuntimeInitialized', { configurable: true, set: function() { abort('You are setting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'); } });
        }
      

  // --pre-jses are emitted after the Module integration code, so that they can
  // refer to Module (if they choose; they can also define Module)

    if (!Module.expectedDataFileDownloads) {
      Module.expectedDataFileDownloads = 0;
    }
    Module.expectedDataFileDownloads++;
    (function() {
     var loadPackage = function(metadata) {
        if (typeof window === 'object') {
          window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
        } else if (typeof location !== 'undefined') {
          // worker
          encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
        } else {
          throw 'using preloaded data can only be done on a web page or in a web worker';
        }
        var PACKAGE_NAME = 'webmscore.lib.data';
        var REMOTE_PACKAGE_BASE = 'webmscore.lib.data';
        if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
          Module['locateFile'] = Module['locateFilePackage'];
          err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
        }
        var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
      
        var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
        metadata['package_uuid'];
      
        function fetchRemotePackage(packageName, packageSize, callback, errback) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', packageName, true);
          xhr.responseType = 'arraybuffer';
          xhr.onprogress = function(event) {
            var url = packageName;
            var size = packageSize;
            if (event.total) size = event.total;
            if (event.loaded) {
              if (!xhr.addedTotal) {
                xhr.addedTotal = true;
                if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                Module.dataFileDownloads[url] = {
                  loaded: event.loaded,
                  total: size
                };
              } else {
                Module.dataFileDownloads[url].loaded = event.loaded;
              }
              var total = 0;
              var loaded = 0;
              var num = 0;
              for (var download in Module.dataFileDownloads) {
              var data = Module.dataFileDownloads[download];
                total += data.total;
                loaded += data.loaded;
                num++;
              }
              total = Math.ceil(total * Module.expectedDataFileDownloads/num);
              if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
            } else if (!Module.dataFileDownloads) {
              if (Module['setStatus']) Module['setStatus']('Downloading data...');
            }
          };
          xhr.onerror = function(event) {
            throw new Error("NetworkError for: " + packageName);
          };
          xhr.onload = function(event) {
            if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
              var packageData = xhr.response;
              callback(packageData);
            } else {
              throw new Error(xhr.statusText + " : " + xhr.responseURL);
            }
          };
          xhr.send(null);
        }    
          var fetchedCallback = null;
          var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

          if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
            if (fetchedCallback) {
              fetchedCallback(data);
              fetchedCallback = null;
            } else {
              fetched = data;
            }
          });
        
      function runWithFS() {
    
        function assert(check, msg) {
          if (!check) throw msg + new Error().stack;
        }
    Module['FS_createPath']('/', 'fonts', true, true);
  Module['FS_createPath']('/fonts', 'musejazz', true, true);
  Module['FS_createPath']('/fonts', 'campania', true, true);
  Module['FS_createPath']('/fonts', 'edwin', true, true);
  Module['FS_createPath']('/fonts', 'leland', true, true);
  Module['FS_createPath']('/fonts', 'bravura', true, true);
  Module['FS_createPath']('/fonts', 'gootville', true, true);
  Module['FS_createPath']('/fonts', 'mscore', true, true);
  Module['FS_createPath']('/fonts', 'petaluma', true, true);
  Module['FS_createPath']('/fonts', 'finalemaestro', true, true);
  Module['FS_createPath']('/fonts', 'finalebroadway', true, true);
  Module['FS_createPath']('/fonts', 'smufl', true, true);
  Module['FS_createPath']('/', 'engraving', true, true);
  Module['FS_createPath']('/engraving', 'styles', true, true);
  Module['FS_createPath']('/', 'styles', true, true);
  Module['FS_createPath']('/', 'mpe', true, true);
    
      
        function processPackageData(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file failed.');
          assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
          var byteArray = new Uint8Array(arrayBuffer);
          
              var compressedData = {"data":null,"cachedOffset":4096164,"cachedIndexes":[-1,-1],"cachedChunks":[null,null],"offsets":[0,2041,4089,6137,8185,10233,12281,14329,16377,18425,20473,22521,24569,26617,28665,30713,32761,34809,36857,38905,40953,43001,45049,47097,49145,51193,53241,55289,57337,59385,61433,63481,65529,67577,69625,71673,73721,75769,77817,79865,81913,83961,86009,88057,90105,92153,94201,96249,98297,100345,102393,104441,106489,108537,110585,112633,114681,116729,118777,120825,122873,124921,126969,129017,131065,133113,135161,137209,139257,141305,143353,145401,147445,149493,151541,153589,155637,157685,159733,161781,163829,165877,167925,169973,172021,174069,176117,178165,180213,182261,184309,186357,188405,190453,192501,194549,196597,198645,200695,202743,204791,206839,208887,210935,212983,215031,217079,219127,221175,223223,225271,227319,229367,231415,233463,235511,237559,239607,241655,243703,245751,247799,249847,251895,253943,255997,258045,260093,262141,264189,266237,268285,270333,272381,274429,276477,278525,280573,282621,284669,286717,288765,290813,292861,294909,296957,299005,301053,303101,305149,307197,309245,311293,313347,315395,317451,319499,321547,323595,325643,327691,329739,331787,333835,335883,337931,339979,342027,344075,346123,348171,350219,352267,354315,356363,358411,360459,362514,364562,366610,368658,370706,372748,374796,376844,378892,380940,382982,385030,387078,389130,391178,393226,395274,397322,399370,401381,403437,405279,407327,409375,411376,413400,415415,417463,419386,421434,423469,425513,427484,429532,431580,433573,434919,435863,436459,437850,439898,441946,443994,446042,448090,450138,452186,454234,456282,458330,460378,462426,464474,466522,468570,470618,472666,474714,476762,478810,480858,482913,484961,487009,489057,491105,493153,495201,497249,499297,501345,503393,505441,507489,509537,511585,513633,515681,517729,519777,521825,523873,525921,527969,530017,532065,534113,536161,538209,540257,542305,544353,546401,548449,550497,552545,554593,556641,558689,560737,562785,564833,566881,568929,570977,573025,575073,577121,579169,581217,583265,585313,587361,589409,591457,593505,595553,597601,599649,601697,603745,605793,607841,609889,611937,613985,616033,618081,620129,622177,624225,626273,628321,630369,632417,634465,636513,638561,640609,642657,644705,646753,648801,650849,652897,654945,656993,659041,661089,663137,665185,667233,669281,671329,673377,675425,677473,679521,681569,683617,685665,687713,689761,691809,693857,695905,697953,700001,702049,704097,706145,708193,710241,712289,714337,716385,718433,720481,722529,724577,726625,728677,730733,732781,734829,736877,738925,740973,743021,745069,747117,749165,751213,753261,755309,757357,759405,761453,763501,765529,767343,769156,771016,772881,774623,776476,778270,780254,782302,784350,786398,788446,790489,792537,794585,796633,798681,800729,802777,804831,806879,808927,810975,813023,815071,817119,819167,821215,823263,825311,827359,829328,831311,833359,835407,837455,839503,841551,843599,845647,847695,849743,851791,853839,855887,857935,859983,862031,864079,866127,868175,870223,872271,874319,876367,878415,880463,882511,884559,886607,888655,890703,892751,894799,896847,898895,900943,902991,905039,907087,909135,911183,913231,915279,917327,919375,921423,923471,925519,927567,929615,931663,933711,935759,937807,939855,941903,943951,945999,948047,950095,952143,954191,956239,958287,960335,962383,964431,966479,968527,970575,972623,974671,976719,978767,980815,982863,984911,986959,989007,991055,993103,995151,997199,999247,1001295,1003343,1005391,1007439,1009487,1011535,1013583,1015631,1017679,1019727,1021775,1023823,1025871,1027919,1029967,1032015,1034063,1036111,1038159,1040207,1042255,1044303,1046351,1048399,1050447,1052495,1054548,1056596,1058644,1060692,1062740,1064788,1066836,1068884,1070932,1072980,1075028,1077076,1079124,1081172,1083220,1085268,1087316,1089364,1091412,1093460,1095508,1097556,1099613,1101661,1103709,1105753,1107801,1109849,1111897,1113945,1115993,1118041,1120089,1122137,1124185,1126233,1128287,1130335,1132383,1134431,1136479,1138527,1140575,1142623,1144671,1146719,1148767,1150815,1152863,1154911,1156959,1159002,1161050,1163098,1165146,1167194,1169242,1171290,1173338,1175386,1177434,1179482,1181530,1183578,1185626,1187674,1189722,1191770,1193818,1194978,1195298,1195687,1196185,1196683,1197129,1197589,1198104,1198406,1198755,1199110,1199517,1199902,1200278,1200611,1201768,1203816,1205864,1207914,1209537,1211352,1213400,1215448,1217496,1219544,1221592,1223640,1225688,1227736,1229784,1231832,1233880,1235928,1237976,1240024,1242072,1244120,1246168,1248216,1250264,1252312,1254360,1256408,1258456,1260504,1262552,1264600,1266648,1268696,1270744,1272792,1274840,1276888,1278936,1280984,1283032,1285080,1287128,1289176,1291224,1293272,1295320,1297368,1299416,1301464,1303512,1305560,1307608,1309656,1311704,1313752,1315800,1317848,1319896,1321944,1323992,1326040,1328088,1330136,1332184,1334232,1336280,1338328,1340376,1342424,1344472,1346520,1348568,1350616,1352664,1354712,1356760,1358808,1360856,1362904,1364952,1367000,1369048,1371096,1373144,1375192,1377240,1379288,1381336,1383384,1385432,1387480,1389528,1391576,1393624,1395672,1397720,1399768,1401816,1403864,1405912,1407960,1410008,1412056,1414104,1416152,1418200,1420248,1422296,1424344,1426392,1428440,1430488,1432536,1434584,1436632,1438680,1440728,1442776,1444824,1446637,1447326,1447760,1448284,1448756,1449256,1449682,1450203,1450704,1451184,1451646,1452167,1452733,1453127,1453580,1454018,1454493,1454983,1455761,1456462,1457117,1457828,1458564,1459256,1460022,1460678,1461428,1462197,1462764,1463460,1463928,1464449,1464979,1465701,1466035,1466430,1466763,1467229,1467764,1468232,1468889,1469492,1469960,1470523,1471157,1471628,1472114,1472646,1473230,1473768,1474239,1474709,1475499,1477547,1479595,1481643,1483691,1485739,1487787,1489835,1491883,1493397,1493868,1494214,1494499,1494733,1494995,1495281,1495540,1495818,1496188,1496522,1496935,1497343,1497711,1498128,1498527,1498894,1499209,1499609,1499961,1500451,1502220,1504268,1506316,1508364,1510412,1512460,1514508,1516556,1517834,1518304,1518816,1519290,1519766,1520245,1520764,1521283,1521763,1522277,1522799,1523317,1523800,1524278,1524803,1525297,1525794,1526240,1526691,1527200,1527499,1527800,1528145,1528478,1528827,1529193,1529779,1530070,1530331,1530636,1530902,1531202,1531468,1531829,1532233,1532624,1532991,1533346,1533837,1534284,1534709,1535103,1535485,1535950,1536351,1536722,1537016,1537377,1537740,1538166,1538517,1538982,1539415,1539780,1540098,1540407,1540720,1541017,1541783,1543831,1545879,1547927,1549975,1552023,1554071,1556119,1558167,1560215,1562263,1564311,1566359,1568407,1570455,1572503,1574551,1576599,1578647,1580695,1582743,1584791,1586839,1588887,1590935,1592983,1594896,1595612,1596152,1596676,1597191,1597647,1597981,1598448,1598925,1599428,1599896,1600427,1600971,1601525,1601850,1603830,1605878,1607635,1609683,1611731,1613779,1615827,1617875,1619923,1621971,1624019,1626067,1628115,1630163,1632211,1634259,1636307,1638355,1640403,1642451,1644499,1646547,1648595,1650643,1652691,1654739,1656787,1658835,1660883,1662931,1664979,1667027,1669075,1671123,1673171,1675219,1677267,1679315,1681363,1683411,1685459,1687507,1689555,1691603,1693651,1695699,1697747,1699795,1701843,1703891,1705939,1707987,1710035,1712083,1714131,1716179,1718227,1720275,1722323,1724371,1726419,1728467,1730515,1732563,1734611,1736659,1738707,1740755,1742803,1744851,1746899,1748947,1750995,1753043,1755091,1757139,1759187,1761235,1763283,1765331,1767379,1769427,1771475,1773523,1775571,1777619,1779667,1781715,1783763,1785811,1787859,1789907,1791955,1794003,1796051,1798099,1800147,1802195,1804243,1806291,1808339,1810387,1812435,1814483,1816531,1818579,1820627,1822675,1824723,1826771,1828819,1830867,1831774,1832250,1832735,1833243,1833749,1834169,1834728,1835247,1835685,1836236,1836755,1837259,1837686,1838130,1838585,1839068,1839750,1840468,1841137,1841860,1842550,1843304,1844040,1844805,1845572,1846057,1846609,1847322,1847624,1847915,1848204,1848795,1849452,1850071,1850719,1851442,1852055,1852694,1853301,1853946,1854438,1854900,1855926,1857974,1860027,1861561,1863552,1865600,1867648,1869696,1871744,1873792,1875840,1877888,1879936,1881984,1884032,1886080,1888128,1890176,1892224,1894272,1896320,1898368,1900416,1902464,1904512,1906560,1908608,1910656,1912704,1914752,1916800,1918848,1920896,1922944,1924992,1927040,1929088,1931136,1933184,1935232,1937280,1939328,1941376,1943424,1945472,1947520,1949568,1951616,1953664,1955712,1957760,1959808,1961856,1963904,1965952,1968000,1970048,1972096,1974144,1976192,1978240,1980288,1982336,1984384,1986432,1988480,1990528,1992576,1994624,1995682,1996143,1996520,1997078,1997713,1997962,1998214,1998521,1998989,1999397,1999942,2000456,2000996,2001529,2001917,2002477,2002994,2003636,2004140,2004636,2005090,2006954,2009010,2011058,2013106,2015154,2017202,2019250,2021298,2023346,2025394,2027442,2029490,2031538,2033586,2035634,2037682,2039730,2041778,2043826,2045874,2047922,2049970,2050846,2051400,2051982,2052712,2053348,2054067,2054829,2055570,2056262,2056839,2057450,2058083,2058635,2059263,2059980,2060514,2061160,2061816,2062422,2062965,2063520,2064177,2064713,2065289,2065941,2066568,2067296,2067957,2068632,2069334,2070012,2070673,2071392,2071819,2072568,2073123,2073672,2074280,2074801,2075465,2076079,2076731,2077481,2078135,2078797,2079430,2080105,2080827,2081445,2082094,2082690,2083332,2083946,2084616,2085254,2085761,2086347,2086878,2087490,2088081,2088693,2089179,2089721,2090405,2091058,2091723,2092446,2093208,2093834,2094487,2095129,2095765,2096494,2097159,2097866,2098516,2099076,2099695,2100432,2101186,2101788,2102312,2102891,2103376,2103802,2104374,2104923,2105568,2106125,2106776,2107340,2107832,2108392,2108897,2109450,2110027,2110579,2111077,2111696,2112267,2112876,2113332,2113920,2114576,2115220,2115820,2116405,2116959,2117555,2118212,2118786,2119244,2119906,2120561,2121253,2121976,2122678,2123475,2124118,2124655,2125175,2125721,2126310,2127008,2127753,2128418,2129194,2129970,2130727,2131419,2132137,2132858,2133568,2134338,2134905,2135483,2136240,2136951,2137731,2138207,2138795,2139353,2140034,2140682,2141362,2142056,2142572,2143144,2143617,2144202,2144950,2145739,2146430,2147166,2147933,2148596,2149202,2150084,2150985,2151849,2152704,2153550,2154385,2155056,2155769,2156501,2157255,2157996,2158919,2159872,2160736,2161595,2162430,2163193,2163818,2164568,2165268,2166181,2166947,2167624,2168253,2168949,2169639,2170373,2171029,2171835,2172787,2173542,2174251,2175110,2175870,2176676,2177402,2178171,2179014,2179808,2180593,2181497,2182341,2182974,2183440,2183968,2184507,2184977,2185604,2186073,2186543,2187182,2187648,2188129,2188756,2189224,2189771,2190297,2190767,2191398,2191865,2192337,2192988,2193453,2193929,2194618,2195232,2196106,2196679,2198181,2200229,2202286,2204334,2206382,2208430,2210478,2212526,2214574,2216622,2218670,2220718,2222766,2224814,2226862,2228910,2230958,2233006,2235054,2237102,2239150,2241198,2243246,2245294,2247342,2249390,2251438,2253486,2255534,2257582,2259630,2261678,2263726,2265774,2267822,2269870,2271918,2273966,2276014,2278062,2280110,2282158,2284206,2286254,2288302,2290350,2292398,2294446,2296494,2298542,2300590,2302638,2304686,2306734,2308782,2310830,2312878,2314926,2316974,2319022,2321070,2323118,2325166,2327214,2329262,2331310,2333358,2335406,2337454,2339502,2341550,2343598,2345646,2347694,2349742,2351790,2353838,2355886,2357934,2359982,2362030,2364078,2366126,2368174,2370222,2372270,2374318,2376366,2378414,2380462,2382510,2384558,2386606,2388654,2390702,2392750,2394798,2396846,2398894,2400942,2402990,2405038,2407086,2409134,2411182,2413230,2415278,2417326,2419374,2421422,2423470,2425518,2427566,2429614,2431662,2433710,2435758,2437806,2439854,2441902,2443950,2445998,2448046,2450094,2452142,2454190,2456238,2458286,2460334,2462382,2464430,2466472,2468527,2470575,2472631,2474679,2476727,2478775,2480823,2482871,2484919,2486967,2489015,2491063,2493111,2495159,2497207,2499255,2501303,2503359,2505407,2507455,2509503,2511551,2513599,2515647,2517695,2519743,2521791,2523839,2525887,2527935,2529983,2532031,2534079,2536127,2538175,2540223,2542271,2544319,2546367,2548415,2550463,2552511,2554559,2556607,2558655,2560703,2562751,2564799,2566847,2568895,2570943,2572991,2575039,2577087,2579135,2581183,2583231,2585279,2587327,2589375,2591423,2593471,2595519,2597567,2599615,2601663,2603711,2605759,2607807,2609855,2611903,2613951,2615999,2618047,2620095,2622143,2624191,2626239,2628287,2630335,2632383,2634431,2636479,2638527,2640575,2642623,2644671,2646719,2648767,2650815,2652863,2654911,2656959,2659007,2661055,2663103,2665151,2667199,2669247,2671295,2673343,2675391,2677439,2679487,2681535,2683583,2685631,2687679,2689727,2691775,2693823,2695871,2697919,2699967,2702015,2704063,2706111,2708159,2710207,2712255,2714303,2716351,2718399,2720447,2722495,2724543,2726591,2728639,2730687,2732735,2734783,2736831,2738879,2740927,2742975,2745023,2747071,2749119,2751167,2753215,2755263,2757311,2759359,2761407,2763455,2765503,2767551,2769599,2771647,2773695,2775743,2777791,2779839,2781887,2783935,2785983,2788031,2790079,2792127,2794175,2796223,2798271,2800319,2802367,2804415,2806463,2808511,2810559,2812607,2814655,2816703,2818751,2820799,2822847,2824895,2826943,2828991,2831039,2833087,2835135,2837183,2839231,2841279,2843327,2845375,2847423,2849471,2851519,2853567,2855615,2857663,2859711,2861759,2863807,2865855,2867903,2869951,2871999,2874047,2876095,2878143,2880191,2882239,2884287,2886335,2888383,2890431,2892479,2894527,2896575,2898623,2900671,2902719,2904767,2906815,2908863,2910911,2912959,2915007,2917055,2919103,2921151,2923199,2925247,2927295,2929343,2931391,2933439,2935487,2937535,2939583,2941631,2943679,2945727,2947775,2949823,2951871,2953919,2955967,2958015,2960063,2962111,2964159,2966207,2968255,2970303,2972351,2974399,2976447,2978495,2980543,2982591,2984639,2986687,2988735,2990783,2992831,2994879,2996927,2998975,3001023,3003071,3005119,3007167,3009215,3011263,3013311,3015359,3017407,3019455,3021503,3023551,3025599,3027647,3029695,3031743,3033791,3035839,3037887,3039935,3041983,3044031,3046079,3048127,3050175,3052223,3054271,3056319,3058367,3060415,3062463,3064511,3066559,3068607,3070655,3072703,3074751,3076799,3078847,3080895,3082943,3084991,3087039,3089087,3091135,3093183,3095231,3097279,3099327,3101375,3103423,3105471,3107519,3109567,3111615,3113663,3115711,3117759,3119807,3121855,3123903,3125951,3127999,3130047,3132095,3134143,3136191,3138239,3140287,3142335,3144383,3146431,3148479,3150527,3152575,3154623,3156671,3158719,3160767,3162815,3164863,3166911,3168959,3171007,3173055,3175103,3177151,3179199,3181247,3183295,3185343,3187391,3189439,3191487,3193535,3195583,3197631,3199679,3201727,3203775,3205823,3207871,3209919,3211967,3214015,3216063,3218111,3220159,3222207,3224255,3226303,3228351,3230399,3232447,3234495,3236543,3238591,3240639,3242687,3244735,3246783,3248831,3250879,3252927,3254975,3257023,3259071,3261119,3263167,3265215,3267263,3269311,3271359,3273407,3275455,3277503,3279551,3281599,3283647,3285695,3287743,3289791,3291839,3293887,3295930,3297978,3300026,3302074,3304122,3306170,3308218,3310266,3312314,3314362,3316410,3318458,3320506,3322554,3324602,3326650,3328698,3330746,3332794,3334842,3336890,3338938,3340986,3343034,3345082,3347130,3349178,3351226,3353274,3355322,3357370,3359418,3361466,3363514,3365562,3367610,3369658,3371706,3373754,3375802,3377850,3379898,3381946,3383994,3386042,3388090,3390138,3392186,3394234,3396282,3398330,3400378,3402426,3404474,3406522,3408570,3410618,3412666,3414714,3416762,3418810,3420858,3422906,3424954,3427002,3429050,3431098,3433146,3435194,3437242,3439290,3441338,3443386,3445434,3447482,3449530,3451578,3453626,3455674,3457722,3459770,3461818,3463866,3465914,3467962,3470010,3472058,3474106,3476152,3478200,3480248,3482296,3484344,3486392,3488440,3490488,3492536,3494584,3496632,3498680,3500728,3502776,3504824,3506872,3508920,3510968,3513016,3515064,3517112,3519160,3521208,3523256,3525304,3527352,3529400,3531448,3533496,3535544,3537592,3539640,3541688,3543736,3545784,3547832,3549880,3551928,3553976,3556024,3558072,3560120,3562168,3564216,3566264,3568312,3570360,3572408,3574456,3576504,3578552,3580600,3582648,3584696,3586744,3588792,3590840,3592878,3593587,3594338,3595234,3596130,3597000,3597902,3598697,3599427,3600170,3601149,3602125,3602681,3603557,3604361,3605058,3605668,3606261,3606867,3607569,3608226,3608919,3609567,3610244,3610890,3611595,3612288,3612982,3613719,3614537,3615507,3616311,3617186,3618051,3618800,3619396,3620349,3621372,3622046,3622859,3623681,3624371,3624991,3625581,3626163,3626853,3627525,3628229,3628913,3629600,3630261,3630982,3631674,3632364,3633046,3633811,3634760,3635545,3636426,3637324,3638146,3638745,3639664,3640691,3641505,3642162,3643079,3643826,3644480,3645052,3645644,3646285,3646971,3647657,3648300,3648985,3649680,3650417,3651119,3651809,3652496,3653248,3654205,3655109,3656000,3656909,3657769,3658547,3659194,3660146,3661145,3661940,3662641,3663574,3664332,3665067,3665744,3666372,3666982,3667675,3668416,3669132,3669897,3670591,3671305,3672056,3672741,3673484,3674207,3674928,3675638,3676403,3677324,3678365,3679455,3680319,3680676,3681102,3682353,3683062,3683586,3684104,3684633,3685199,3685878,3686522,3687281,3688050,3688669,3689377,3690026,3690680,3691326,3691915,3692466,3693114,3693851,3694467,3694996,3695634,3696234,3696813,3697392,3697933,3698463,3698991,3699585,3700106,3700689,3701345,3701934,3702618,3703340,3704015,3704685,3705437,3706114,3706691,3707306,3707893,3708485,3709127,3709689,3710287,3710865,3711430,3712011,3712637,3713187,3713752,3714299,3715006,3715675,3716286,3716967,3717593,3718246,3718981,3719743,3720480,3721239,3722055,3722654,3723242,3723941,3724620,3725357,3726022,3726700,3727445,3728187,3728763,3729436,3730112,3730859,3731510,3732229,3732772,3733476,3734153,3734926,3735636,3736399,3736933,3737446,3737967,3738494,3739024,3739582,3740164,3740719,3741236,3742028,3742684,3743282,3743917,3744548,3745304,3745946,3746617,3747216,3747898,3748511,3749231,3749882,3750580,3751335,3752040,3752778,3753414,3754005,3754560,3755210,3755808,3756564,3757201,3757850,3758540,3759251,3759896,3760512,3761135,3761729,3762382,3762941,3763610,3764264,3764872,3765352,3766046,3766605,3767195,3767918,3768530,3769234,3769828,3770592,3771178,3771870,3772370,3772950,3773586,3774310,3774979,3775569,3776251,3776956,3777672,3778465,3779109,3779627,3780253,3781007,3781808,3782485,3783090,3783709,3784332,3785100,3785853,3786659,3787261,3787853,3788407,3789005,3789694,3790499,3791182,3792064,3792828,3793618,3794422,3795188,3795908,3796634,3797404,3798206,3798982,3799748,3800522,3801276,3802106,3802826,3803559,3804292,3805047,3805796,3806591,3807321,3808125,3808913,3809658,3810414,3811171,3811906,3812724,3813427,3814180,3814980,3815766,3816505,3817259,3818041,3818463,3818852,3819234,3820082,3820886,3821598,3822279,3823070,3823811,3824667,3825377,3825883,3826668,3827102,3827498,3827872,3828681,3829042,3829594,3830293,3830633,3831515,3832230,3832991,3833660,3834213,3834781,3835335,3835874,3836581,3837134,3837808,3838510,3839156,3839777,3840495,3841181,3841830,3842483,3843111,3843770,3844465,3845213,3845875,3846570,3847245,3847892,3848545,3849140,3849780,3850421,3851162,3851866,3852499,3853149,3853799,3854477,3855113,3855909,3856671,3857331,3858141,3858821,3859591,3860403,3861160,3862014,3862746,3863526,3864228,3864963,3865697,3866492,3867316,3867997,3868770,3869595,3870381,3871129,3871928,3872601,3873260,3873983,3874618,3875365,3876129,3876921,3877541,3878192,3879001,3879849,3880677,3881531,3882289,3882952,3883625,3884347,3885067,3885759,3886412,3887045,3887703,3888326,3889001,3889667,3890415,3891178,3891944,3892635,3893394,3894118,3894880,3895643,3896338,3897002,3897682,3898370,3899080,3899877,3900539,3901133,3901835,3902451,3903276,3904020,3904754,3905454,3906146,3906436,3906785,3907064,3907367,3907632,3908004,3908319,3908566,3908890,3909186,3909514,3909816,3910133,3910428,3910761,3911056,3911385,3911637,3912022,3912376,3912627,3912942,3913239,3913555,3913845,3914179,3914482,3914873,3915151,3915506,3915799,3916179,3916477,3916711,3917007,3917291,3917623,3917900,3918232,3918509,3918901,3919170,3919528,3919797,3920169,3920443,3920725,3921048,3921351,3921664,3921965,3922305,3922588,3922942,3923215,3923605,3923895,3924242,3924574,3924878,3925194,3925499,3925807,3926105,3926438,3926709,3927055,3927323,3927695,3927984,3928342,3928646,3928940,3929252,3929547,3929866,3930149,3930495,3930769,3931119,3931387,3931771,3932062,3932384,3932705,3932985,3933308,3933593,3933920,3934209,3934577,3934851,3935196,3935460,3935836,3936183,3936497,3936844,3937129,3937502,3937798,3938173,3938484,3938879,3939164,3939513,3939785,3940158,3940450,3940784,3941066,3941356,3941676,3941973,3942306,3942598,3942922,3943199,3943543,3943799,3944178,3944463,3944760,3945057,3945356,3945652,3945955,3946275,3946539,3946884,3947167,3947550,3947810,3948191,3948489,3948760,3949057,3949358,3949661,3949961,3950277,3950560,3950898,3951170,3951512,3951786,3952164,3952520,3952828,3953126,3953425,3953704,3953985,3954302,3954588,3954916,3955196,3955541,3955805,3956194,3956480,3956763,3957049,3957347,3957654,3957943,3958278,3958544,3958913,3959186,3959548,3959843,3960127,3960425,3960720,3961037,3961338,3961648,3961945,3962297,3962569,3962921,3963183,3963556,3963825,3964127,3964420,3964718,3965049,3965326,3965669,3965939,3966287,3966551,3966890,3967188,3967445,3967734,3968018,3968338,3968630,3968961,3969251,3969574,3969845,3970162,3970432,3970783,3971081,3971380,3971696,3972003,3972328,3972629,3972978,3973263,3973607,3973868,3974234,3974509,3974849,3975130,3975436,3975746,3976048,3976365,3976649,3977002,3977276,3977619,3977883,3978257,3978548,3978859,3979137,3979443,3979756,3980057,3980382,3980673,3981016,3981294,3981653,3981917,3982295,3982618,3982860,3983175,3983466,3983798,3984084,3984428,3984716,3985077,3985350,3985704,3985961,3986348,3986633,3986917,3987223,3987519,3987843,3988122,3988459,3988723,3989072,3989337,3989713,3989990,3990350,3990618,3990894,3991197,3991488,3991800,3992096,3992434,3992714,3993059,3993332,3993702,3994005,3994354,3994698,3995014,3995340,3995629,3995920,3996213,3996548,3996826,3997175,3997447,3997831,3998127,3998474,3998770,3999069,3999385,3999690,4000024,4000325,4000665,4000947,4001295,4001560,4001933,4002224,4002562,4002845,4003139,4003455,4003742,4004079,4004362,4004708,4004982,4005333,4005601,4005992,4006275,4006591,4006892,4007167,4007457,4007763,4008081,4008373,4008717,4008978,4009324,4009571,4009950,4010248,4010497,4010812,4011109,4011429,4011731,4012081,4012376,4012730,4013007,4013359,4013608,4013982,4014283,4014550,4014855,4015129,4015447,4015736,4016067,4016347,4016690,4016962,4017312,4017580,4017970,4018247,4018530,4018835,4019132,4019439,4019742,4020071,4020372,4020721,4021002,4021377,4021669,4022017,4022322,4022624,4022933,4023240,4023565,4023866,4024265,4024548,4024896,4025152,4025482,4025785,4026133,4026411,4026696,4027009,4027306,4027610,4027872,4028221,4028495,4028856,4029121,4029504,4029802,4030106,4030401,4030700,4031005,4031310,4031670,4031963,4032353,4032628,4032938,4033184,4033557,4033866,4034105,4034425,4034715,4035028,4035319,4035625,4035896,4036206,4036484,4036806,4037101,4037449,4037790,4038094,4038442,4038748,4039060,4039354,4039731,4040009,4040357,4040626,4040991,4041286,4041632,4041917,4042221,4042532,4042838,4043216,4043508,4043869,4044152,4044501,4044774,4045150,4045434,4045756,4046071,4046345,4046666,4046957,4047278,4047558,4047911,4048186,4048571,4048826,4049205,4049548,4049862,4050160,4050454,4050780,4051059,4051378,4051646,4051994,4052264,4052620,4052884,4053258,4053558,4053834,4054134,4054427,4054742,4055039,4055350,4055642,4055989,4056267,4056612,4056876,4057247,4057553,4057800,4058159,4058451,4058764,4059047,4059367,4059642,4059987,4060283,4060669,4060974,4061398,4061699,4061954,4062236,4062517,4062830,4063120,4063441,4063723,4064059,4064323,4064688,4064972,4065323,4065604,4065901,4066201,4066484,4066801,4067064,4067422,4067683,4068022,4068279,4068652,4068981,4069234,4069544,4069835,4070141,4070423,4070752,4071042,4071370,4071636,4072014,4072298,4072629,4072909,4073182,4073477,4073771,4074096,4074354,4074701,4074962,4075314,4075559,4075934,4076229,4076500,4076795,4077097,4077418,4077717,4078055,4078348,4078688,4078962,4079322,4079586,4079962,4080277,4080532,4080831,4081113,4081428,4081719,4082042,4082312,4082654,4082920,4083280,4083535,4083897,4084174,4084451,4084759,4085051,4085388,4085681,4086029,4086311,4086670,4086944,4087319,4087584,4087943,4088232,4088531,4088845,4089149,4089475,4089776,4090123,4090408,4090744,4091016,4091387,4091677,4092015,4092295,4092571,4092882,4093174,4093527,4093789,4094138,4094413,4094763,4095030,4095405,4095710,4095994],"sizes":[2041,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2044,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2050,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2054,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2054,2048,2056,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2055,2048,2048,2048,2048,2042,2048,2048,2048,2048,2042,2048,2048,2052,2048,2048,2048,2048,2048,2011,2056,1842,2048,2048,2001,2024,2015,2048,1923,2048,2035,2044,1971,2048,2048,1993,1346,944,596,1391,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2055,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2052,2056,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2028,1814,1813,1860,1865,1742,1853,1794,1984,2048,2048,2048,2048,2043,2048,2048,2048,2048,2048,2048,2054,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,1969,1983,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2053,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2057,2048,2048,2044,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2054,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2043,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,1160,320,389,498,498,446,460,515,302,349,355,407,385,376,333,1157,2048,2048,2050,1623,1815,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,1813,689,434,524,472,500,426,521,501,480,462,521,566,394,453,438,475,490,778,701,655,711,736,692,766,656,750,769,567,696,468,521,530,722,334,395,333,466,535,468,657,603,468,563,634,471,486,532,584,538,471,470,790,2048,2048,2048,2048,2048,2048,2048,2048,1514,471,346,285,234,262,286,259,278,370,334,413,408,368,417,399,367,315,400,352,490,1769,2048,2048,2048,2048,2048,2048,2048,1278,470,512,474,476,479,519,519,480,514,522,518,483,478,525,494,497,446,451,509,299,301,345,333,349,366,586,291,261,305,266,300,266,361,404,391,367,355,491,447,425,394,382,465,401,371,294,361,363,426,351,465,433,365,318,309,313,297,766,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,1913,716,540,524,515,456,334,467,477,503,468,531,544,554,325,1980,2048,1757,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,907,476,485,508,506,420,559,519,438,551,519,504,427,444,455,483,682,718,669,723,690,754,736,765,767,485,552,713,302,291,289,591,657,619,648,723,613,639,607,645,492,462,1026,2048,2053,1534,1991,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,1058,461,377,558,635,249,252,307,468,408,545,514,540,533,388,560,517,642,504,496,454,1864,2056,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,876,554,582,730,636,719,762,741,692,577,611,633,552,628,717,534,646,656,606,543,555,657,536,576,652,627,728,661,675,702,678,661,719,427,749,555,549,608,521,664,614,652,750,654,662,633,675,722,618,649,596,642,614,670,638,507,586,531,612,591,612,486,542,684,653,665,723,762,626,653,642,636,729,665,707,650,560,619,737,754,602,524,579,485,426,572,549,645,557,651,564,492,560,505,553,577,552,498,619,571,609,456,588,656,644,600,585,554,596,657,574,458,662,655,692,723,702,797,643,537,520,546,589,698,745,665,776,776,757,692,718,721,710,770,567,578,757,711,780,476,588,558,681,648,680,694,516,572,473,585,748,789,691,736,767,663,606,882,901,864,855,846,835,671,713,732,754,741,923,953,864,859,835,763,625,750,700,913,766,677,629,696,690,734,656,806,952,755,709,859,760,806,726,769,843,794,785,904,844,633,466,528,539,470,627,469,470,639,466,481,627,468,547,526,470,631,467,472,651,465,476,689,614,874,573,1502,2048,2057,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2042,2055,2048,2056,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2056,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2043,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2046,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2048,2038,709,751,896,896,870,902,795,730,743,979,976,556,876,804,697,610,593,606,702,657,693,648,677,646,705,693,694,737,818,970,804,875,865,749,596,953,1023,674,813,822,690,620,590,582,690,672,704,684,687,661,721,692,690,682,765,949,785,881,898,822,599,919,1027,814,657,917,747,654,572,592,641,686,686,643,685,695,737,702,690,687,752,957,904,891,909,860,778,647,952,999,795,701,933,758,735,677,628,610,693,741,716,765,694,714,751,685,743,723,721,710,765,921,1041,1090,864,357,426,1251,709,524,518,529,566,679,644,759,769,619,708,649,654,646,589,551,648,737,616,529,638,600,579,579,541,530,528,594,521,583,656,589,684,722,675,670,752,677,577,615,587,592,642,562,598,578,565,581,626,550,565,547,707,669,611,681,626,653,735,762,737,759,816,599,588,699,679,737,665,678,745,742,576,673,676,747,651,719,543,704,677,773,710,763,534,513,521,527,530,558,582,555,517,792,656,598,635,631,756,642,671,599,682,613,720,651,698,755,705,738,636,591,555,650,598,756,637,649,690,711,645,616,623,594,653,559,669,654,608,480,694,559,590,723,612,704,594,764,586,692,500,580,636,724,669,590,682,705,716,793,644,518,626,754,801,677,605,619,623,768,753,806,602,592,554,598,689,805,683,882,764,790,804,766,720,726,770,802,776,766,774,754,830,720,733,733,755,749,795,730,804,788,745,756,757,735,818,703,753,800,786,739,754,782,422,389,382,848,804,712,681,791,741,856,710,506,785,434,396,374,809,361,552,699,340,882,715,761,669,553,568,554,539,707,553,674,702,646,621,718,686,649,653,628,659,695,748,662,695,675,647,653,595,640,641,741,704,633,650,650,678,636,796,762,660,810,680,770,812,757,854,732,780,702,735,734,795,824,681,773,825,786,748,799,673,659,723,635,747,764,792,620,651,809,848,828,854,758,663,673,722,720,692,653,633,658,623,675,666,748,763,766,691,759,724,762,763,695,664,680,688,710,797,662,594,702,616,825,744,734,700,692,290,349,279,303,265,372,315,247,324,296,328,302,317,295,333,295,329,252,385,354,251,315,297,316,290,334,303,391,278,355,293,380,298,234,296,284,332,277,332,277,392,269,358,269,372,274,282,323,303,313,301,340,283,354,273,390,290,347,332,304,316,305,308,298,333,271,346,268,372,289,358,304,294,312,295,319,283,346,274,350,268,384,291,322,321,280,323,285,327,289,368,274,345,264,376,347,314,347,285,373,296,375,311,395,285,349,272,373,292,334,282,290,320,297,333,292,324,277,344,256,379,285,297,297,299,296,303,320,264,345,283,383,260,381,298,271,297,301,303,300,316,283,338,272,342,274,378,356,308,298,299,279,281,317,286,328,280,345,264,389,286,283,286,298,307,289,335,266,369,273,362,295,284,298,295,317,301,310,297,352,272,352,262,373,269,302,293,298,331,277,343,270,348,264,339,298,257,289,284,320,292,331,290,323,271,317,270,351,298,299,316,307,325,301,349,285,344,261,366,275,340,281,306,310,302,317,284,353,274,343,264,374,291,311,278,306,313,301,325,291,343,278,359,264,378,323,242,315,291,332,286,344,288,361,273,354,257,387,285,284,306,296,324,279,337,264,349,265,376,277,360,268,276,303,291,312,296,338,280,345,273,370,303,349,344,316,326,289,291,293,335,278,349,272,384,296,347,296,299,316,305,334,301,340,282,348,265,373,291,338,283,294,316,287,337,283,346,274,351,268,391,283,316,301,275,290,306,318,292,344,261,346,247,379,298,249,315,297,320,302,350,295,354,277,352,249,374,301,267,305,274,318,289,331,280,343,272,350,268,390,277,283,305,297,307,303,329,301,349,281,375,292,348,305,302,309,307,325,301,399,283,348,256,330,303,348,278,285,313,297,304,262,349,274,361,265,383,298,304,295,299,305,305,360,293,390,275,310,246,373,309,239,320,290,313,291,306,271,310,278,322,295,348,341,304,348,306,312,294,377,278,348,269,365,295,346,285,304,311,306,378,292,361,283,349,273,376,284,322,315,274,321,291,321,280,353,275,385,255,379,343,314,298,294,326,279,319,268,348,270,356,264,374,300,276,300,293,315,297,311,292,347,278,345,264,371,306,247,359,292,313,283,320,275,345,296,386,305,424,301,255,282,281,313,290,321,282,336,264,365,284,351,281,297,300,283,317,263,358,261,339,257,373,329,253,310,291,306,282,329,290,328,266,378,284,331,280,273,295,294,325,258,347,261,352,245,375,295,271,295,302,321,299,338,293,340,274,360,264,376,315,255,299,282,315,291,323,270,342,266,360,255,362,277,277,308,292,337,293,348,282,359,274,375,265,359,289,299,314,304,326,301,347,285,336,272,371,290,338,280,276,311,292,353,262,349,275,350,267,375,305,284,170],"successes":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0,1,1,1,0,0,1,1,1,0,1,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
  ;
              compressedData['data'] = byteArray;
              assert(typeof LZ4 === 'object', 'LZ4 not present - was your app build with  -s LZ4=1  ?');
              LZ4.loadPackage({ 'metadata': metadata, 'compressedData': compressedData });
              Module['removeRunDependency']('datafile_webmscore.lib.data');
        
        }      Module['addRunDependency']('datafile_webmscore.lib.data');
      
        if (!Module.preloadResults) Module.preloadResults = {};
      
          Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
          if (fetched) {
            processPackageData(fetched);
            fetched = null;
          } else {
            fetchedCallback = processPackageData;
          }
        
      }
      if (Module['calledRun']) {
        runWithFS();
      } else {
        if (!Module['preRun']) Module['preRun'] = [];
        Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
      }
    
     };
     loadPackage({"files": [{"filename": "/fonts/musejazz/MuseJazzText.woff2", "start": 0, "end": 107796, "audio": 0}, {"filename": "/fonts/campania/Campania.woff2", "start": 107796, "end": 145484, "audio": 0}, {"filename": "/fonts/edwin/Edwin-Roman.woff2", "start": 145484, "end": 200512, "audio": 0}, {"filename": "/fonts/edwin/Edwin-Bold.woff2", "start": 200512, "end": 255796, "audio": 0}, {"filename": "/fonts/edwin/Edwin-Italic.woff2", "start": 255796, "end": 313016, "audio": 0}, {"filename": "/fonts/edwin/Edwin-BdIta.woff2", "start": 313016, "end": 371224, "audio": 0}, {"filename": "/fonts/mscoreTab.woff2", "start": 371224, "end": 381524, "audio": 0}, {"filename": "/fonts/mscore-BC.woff2", "start": 381524, "end": 385976, "audio": 0}, {"filename": "/fonts/leland/LelandText.woff2", "start": 385976, "end": 400628, "audio": 0}, {"filename": "/fonts/bravura/BravuraText.woff2", "start": 400628, "end": 794740, "audio": 0}, {"filename": "/fonts/gootville/GootvilleText.woff2", "start": 794740, "end": 810876, "audio": 0}, {"filename": "/fonts/mscore/MScoreText.woff2", "start": 810876, "end": 831088, "audio": 0}, {"filename": "/fonts/petaluma/PetalumaText.woff2", "start": 831088, "end": 1060180, "audio": 0}, {"filename": "/fonts/petaluma/PetalumaScript.woff2", "start": 1060180, "end": 1110288, "audio": 0}, {"filename": "/fonts/finalemaestro/FinaleMaestroText.woff2", "start": 1110288, "end": 1134316, "audio": 0}, {"filename": "/fonts/finalebroadway/FinaleBroadwayText.woff2", "start": 1134316, "end": 1163264, "audio": 0}, {"filename": "/fonts/leland/Leland.woff2", "start": 1163264, "end": 1200628, "audio": 0}, {"filename": "/fonts/leland/metadata.json", "start": 1200628, "end": 1232041, "audio": 0}, {"filename": "/fonts/bravura/Bravura.woff2", "start": 1232041, "end": 1478033, "audio": 0}, {"filename": "/fonts/bravura/metadata.json", "start": 1478033, "end": 1584714, "audio": 0}, {"filename": "/fonts/mscore/mscore.woff2", "start": 1584714, "end": 1602574, "audio": 0}, {"filename": "/fonts/mscore/metadata.json", "start": 1602574, "end": 1644933, "audio": 0}, {"filename": "/fonts/gootville/Gootville.woff2", "start": 1644933, "end": 1661561, "audio": 0}, {"filename": "/fonts/gootville/metadata.json", "start": 1661561, "end": 1781225, "audio": 0}, {"filename": "/fonts/musejazz/MuseJazz.woff2", "start": 1781225, "end": 1834617, "audio": 0}, {"filename": "/fonts/musejazz/metadata.json", "start": 1834617, "end": 1863839, "audio": 0}, {"filename": "/fonts/petaluma/Petaluma.woff2", "start": 1863839, "end": 2093211, "audio": 0}, {"filename": "/fonts/petaluma/metadata.json", "start": 2093211, "end": 2180394, "audio": 0}, {"filename": "/fonts/finalemaestro/FinaleMaestro.woff2", "start": 2180394, "end": 2320666, "audio": 0}, {"filename": "/fonts/finalemaestro/metadata.json", "start": 2320666, "end": 2363713, "audio": 0}, {"filename": "/fonts/finalebroadway/FinaleBroadway.woff2", "start": 2363713, "end": 2408417, "audio": 0}, {"filename": "/fonts/finalebroadway/metadata.json", "start": 2408417, "end": 2415949, "audio": 0}, {"filename": "/fonts/smufl/glyphnames.json", "start": 2415949, "end": 2717632, "audio": 0}, {"filename": "/fonts/smufl/ranges.json", "start": 2717632, "end": 2816428, "audio": 0}, {"filename": "/fonts/fonts_tablature.xml", "start": 2816428, "end": 2865736, "audio": 0}, {"filename": "/fonts/fonts_figuredbass.xml", "start": 2865736, "end": 2870098, "audio": 0}, {"filename": "/fonts/FreeSans.woff2", "start": 2870098, "end": 3138270, "audio": 0}, {"filename": "/fonts/FreeSerif.woff2", "start": 3138270, "end": 3762718, "audio": 0}, {"filename": "/fonts/FreeSerifBold.woff2", "start": 3762718, "end": 3966970, "audio": 0}, {"filename": "/fonts/FreeSerifItalic.woff2", "start": 3966970, "end": 4147954, "audio": 0}, {"filename": "/fonts/FreeSerifBoldItalic.woff2", "start": 4147954, "end": 4265822, "audio": 0}, {"filename": "/engraving/styles/migration-306-style-Edwin.mss", "start": 4265822, "end": 4270716, "audio": 0}, {"filename": "/engraving/styles/migration-306-style-Leland.mss", "start": 4270716, "end": 4271899, "audio": 0}, {"filename": "/engraving/styles/legacy-style-defaults-v2.mss", "start": 4271899, "end": 4325664, "audio": 0}, {"filename": "/engraving/styles/legacy-style-defaults-v3.mss", "start": 4325664, "end": 4379409, "audio": 0}, {"filename": "/engraving/styles/legacy-style-defaults-v1.mss", "start": 4379409, "end": 4433160, "audio": 0}, {"filename": "/engraving/styles/legacy-style-defaults-v302.mss", "start": 4433160, "end": 4495013, "audio": 0}, {"filename": "/engraving/styles/gp-style.mss", "start": 4495013, "end": 4496529, "audio": 0}, {"filename": "/styles/chords_std.xml", "start": 4496529, "end": 4507623, "audio": 0}, {"filename": "/instruments.xml", "start": 4507623, "end": 5186510, "audio": 0}, {"filename": "/mpe/general_strings_articulations_profile.json", "start": 5186510, "end": 5490517, "audio": 0}, {"filename": "/mpe/general_percussion_articulations_profile.json", "start": 5490517, "end": 5770927, "audio": 0}, {"filename": "/mpe/general_keyboard_articulations_profile.json", "start": 5770927, "end": 5964608, "audio": 0}, {"filename": "/mpe/general_winds_articulations_profile.json", "start": 5964608, "end": 6207560, "audio": 0}, {"filename": "/mpe/general_voice_articulations_profile.json", "start": 6207560, "end": 6442574, "audio": 0}], "remote_package_size": 4100260, "package_uuid": "b2223856-3ad0-4d8a-9700-51f41dedb7f7"});
    
    })();
    

      // All the pre-js content up to here must remain later on, we need to run
      // it.
      var necessaryPreJSTasks = Module['preRun'].slice();
    
      if (!Module['preRun']) throw 'Module.preRun should exist because file support used it; did a pre-js delete it?';
      necessaryPreJSTasks.forEach(function(task) {
        if (Module['preRun'].indexOf(task) < 0) throw 'All preRun tasks that exist before user pre-js code should remain after; did you replace Module or modify Module.preRun?';
      });
    

  // Sometimes an existing Module object exists with properties
  // meant to overwrite the default module functionality. Here
  // we collect those properties and reapply _after_ we configure
  // the current environment's defaults to avoid having to be so
  // defensive during initialization.
  var moduleOverrides = {};
  var key;
  for (key in Module) {
    if (Module.hasOwnProperty(key)) {
      moduleOverrides[key] = Module[key];
    }
  }
  var thisProgram = './this.program';
  var quit_ = function(status, toThrow) {
    throw toThrow;
  };

  // Determine the runtime environment we are in. You can customize this by
  // setting the ENVIRONMENT setting at compile time (see settings.js).

  var ENVIRONMENT_IS_WEB = false;
  var ENVIRONMENT_IS_WORKER = false;
  var ENVIRONMENT_IS_NODE = false;
  var ENVIRONMENT_IS_SHELL = false;
  ENVIRONMENT_IS_WEB = typeof window === 'object';
  ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  // N.b. Electron.js environment is simultaneously a NODE-environment, but
  // also a web environment.
  ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
  ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

  if (Module['ENVIRONMENT']) {
    throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
  }



  // `/` should be present at the end if `scriptDirectory` is not empty
  var scriptDirectory = '';
  function locateFile(path) {
    if (Module['locateFile']) {
      return Module['locateFile'](path, scriptDirectory);
    }
    return scriptDirectory + path;
  }

  // Hooks that are implemented differently in different runtime environments.
  var read_,
      readAsync,
      readBinary;

  var nodeFS;
  var nodePath;

  if (ENVIRONMENT_IS_NODE) {
    if (ENVIRONMENT_IS_WORKER) {
      scriptDirectory = require('path').dirname(scriptDirectory) + '/';
    } else {
      scriptDirectory = __dirname + '/';
    }




  read_ = function shell_read(filename, binary) {
    if (!nodeFS) nodeFS = require('fs');
    if (!nodePath) nodePath = require('path');
    filename = nodePath['normalize'](filename);
    return nodeFS['readFileSync'](filename, binary ? null : 'utf8');
  };

  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };



    if (process['argv'].length > 1) {
      thisProgram = process['argv'][1].replace(/\\/g, '/');
    }

    process['argv'].slice(2);

    // MODULARIZE will export the module in the proper place outside, we don't need to export here



    quit_ = function(status) {
      process['exit'](status);
    };

    Module['inspect'] = function () { return '[Emscripten Module object]'; };



  } else
  if (ENVIRONMENT_IS_SHELL) {


    if (typeof read != 'undefined') {
      read_ = function shell_read(f) {
        return read(f);
      };
    }

    readBinary = function readBinary(f) {
      var data;
      if (typeof readbuffer === 'function') {
        return new Uint8Array(readbuffer(f));
      }
      data = read(f, 'binary');
      assert(typeof data === 'object');
      return data;
    };

    if (typeof scriptArgs != 'undefined') {
      scriptArgs;
    }

    if (typeof quit === 'function') {
      quit_ = function(status) {
        quit(status);
      };
    }

    if (typeof print !== 'undefined') {
      // Prefer to use print/printErr where they exist, as they usually work better.
      if (typeof console === 'undefined') console = /** @type{!Console} */({});
      console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
      console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr !== 'undefined' ? printErr : print);
    }


  } else

  // Note that this includes Node.js workers when relevant (pthreads is enabled).
  // Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
  // ENVIRONMENT_IS_NODE.
  if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
      scriptDirectory = self.location.href;
    } else if (document.currentScript) { // web
      scriptDirectory = document.currentScript.src;
    }
    // When MODULARIZE, this JS may be executed later, after document.currentScript
    // is gone, so we saved it, and we use it here instead of any other info.
    if (_scriptDir) {
      scriptDirectory = _scriptDir;
    }
    // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
    // otherwise, slice off the final part of the url to find the script directory.
    // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
    // and scriptDirectory will correctly be replaced with an empty string.
    if (scriptDirectory.indexOf('blob:') !== 0) {
      scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/')+1);
    } else {
      scriptDirectory = '';
    }


    // Differentiate the Web Worker from the Node Worker case, as reading must
    // be done differently.
    {




    read_ = function shell_read(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        return xhr.responseText;
    };

    if (ENVIRONMENT_IS_WORKER) {
      readBinary = function readBinary(url) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, false);
          xhr.responseType = 'arraybuffer';
          xhr.send(null);
          return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
      };
    }

    readAsync = function readAsync(url, onload, onerror) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function xhr_onload() {
        if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
          onload(xhr.response);
          return;
        }
        onerror();
      };
      xhr.onerror = onerror;
      xhr.send(null);
    };




    }
  } else
  {
    throw new Error('environment detection error');
  }


  // Set up the out() and err() hooks, which are how we can print to stdout or
  // stderr, respectively.
  var out = Module['print'] || console.log.bind(console);
  var err = Module['printErr'] || console.warn.bind(console);

  // Merge back in the overrides
  for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
      Module[key] = moduleOverrides[key];
    }
  }
  // Free the object hierarchy contained in the overrides, this lets the GC
  // reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
  moduleOverrides = null;

  // Emit code to handle expected values on the Module object. This applies Module.x
  // to the proper local x. This has two benefits: first, we only emit it if it is
  // expected to arrive, and second, by using a local everywhere else that can be
  // minified.
  if (Module['arguments']) Module['arguments'];if (!Object.getOwnPropertyDescriptor(Module, 'arguments')) Object.defineProperty(Module, 'arguments', { configurable: true, get: function() { abort('Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];if (!Object.getOwnPropertyDescriptor(Module, 'thisProgram')) Object.defineProperty(Module, 'thisProgram', { configurable: true, get: function() { abort('Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });
  if (Module['quit']) quit_ = Module['quit'];if (!Object.getOwnPropertyDescriptor(Module, 'quit')) Object.defineProperty(Module, 'quit', { configurable: true, get: function() { abort('Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });

  // perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module['memoryInitializerPrefixURL'] === 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['pthreadMainPrefixURL'] === 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['cdInitializerPrefixURL'] === 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['filePackagePrefixURL'] === 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['read'] === 'undefined', 'Module.read option was removed (modify read_ in JS)');
  assert(typeof Module['readAsync'] === 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
  assert(typeof Module['readBinary'] === 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
  assert(typeof Module['setWindowTitle'] === 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
  assert(typeof Module['TOTAL_MEMORY'] === 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
  if (!Object.getOwnPropertyDescriptor(Module, 'read')) Object.defineProperty(Module, 'read', { configurable: true, get: function() { abort('Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });
  if (!Object.getOwnPropertyDescriptor(Module, 'readAsync')) Object.defineProperty(Module, 'readAsync', { configurable: true, get: function() { abort('Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });
  if (!Object.getOwnPropertyDescriptor(Module, 'readBinary')) Object.defineProperty(Module, 'readBinary', { configurable: true, get: function() { abort('Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });
  if (!Object.getOwnPropertyDescriptor(Module, 'setWindowTitle')) Object.defineProperty(Module, 'setWindowTitle', { configurable: true, get: function() { abort('Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });






  // {{PREAMBLE_ADDITIONS}}

  var STACK_ALIGN = 16;

  function alignMemory(size, factor) {
    if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
    return Math.ceil(size / factor) * factor;
  }

  function warnOnce(text) {
    if (!warnOnce.shown) warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
      warnOnce.shown[text] = 1;
      err(text);
    }
  }

  var tempRet0 = 0;

  var setTempRet0 = function(value) {
    tempRet0 = value;
  };

  var getTempRet0 = function() {
    return tempRet0;
  };




  // === Preamble library stuff ===

  // Documentation for the public APIs defined in this file must be updated in:
  //    site/source/docs/api_reference/preamble.js.rst
  // A prebuilt local version of the documentation is available at:
  //    site/build/text/docs/api_reference/preamble.js.txt
  // You can also build docs locally as HTML or other formats in site/
  // An online HTML version (which may be of a different version of Emscripten)
  //    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html


  var wasmBinary;if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];if (!Object.getOwnPropertyDescriptor(Module, 'wasmBinary')) Object.defineProperty(Module, 'wasmBinary', { configurable: true, get: function() { abort('Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });
  var noExitRuntime;if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];if (!Object.getOwnPropertyDescriptor(Module, 'noExitRuntime')) Object.defineProperty(Module, 'noExitRuntime', { configurable: true, get: function() { abort('Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });


  if (typeof WebAssembly !== 'object') {
    abort('no native wasm support detected');
  }




  // In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
  // In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

  /** @param {number} ptr
      @param {number} value
      @param {string} type
      @param {number|boolean=} noSafe */
  function setValue(ptr, value, type, noSafe) {
    type = type || 'i8';
    if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
      switch(type) {
        case 'i1': HEAP8[((ptr)>>0)]=value; break;
        case 'i8': HEAP8[((ptr)>>0)]=value; break;
        case 'i16': HEAP16[((ptr)>>1)]=value; break;
        case 'i32': HEAP32[((ptr)>>2)]=value; break;
        case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
        case 'float': HEAPF32[((ptr)>>2)]=value; break;
        case 'double': HEAPF64[((ptr)>>3)]=value; break;
        default: abort('invalid type for setValue: ' + type);
      }
  }

  /** @param {number} ptr
      @param {string} type
      @param {number|boolean=} noSafe */
  function getValue(ptr, type, noSafe) {
    type = type || 'i8';
    if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
      switch(type) {
        case 'i1': return HEAP8[((ptr)>>0)];
        case 'i8': return HEAP8[((ptr)>>0)];
        case 'i16': return HEAP16[((ptr)>>1)];
        case 'i32': return HEAP32[((ptr)>>2)];
        case 'i64': return HEAP32[((ptr)>>2)];
        case 'float': return HEAPF32[((ptr)>>2)];
        case 'double': return HEAPF64[((ptr)>>3)];
        default: abort('invalid type for getValue: ' + type);
      }
    return null;
  }






  // Wasm globals

  var wasmMemory;
  var wasmTable;


  //========================================
  // Runtime essentials
  //========================================

  // whether we are quitting the application. no code should run after this.
  // set in exit() and abort()
  var ABORT = false;

  /** @type {function(*, string=)} */
  function assert(condition, text) {
    if (!condition) {
      abort('Assertion failed: ' + text);
    }
  }

  // Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
  function getCFunc(ident) {
    var func = Module['_' + ident]; // closure exported function
    assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
    return func;
  }

  // C calling interface.
  /** @param {string|null=} returnType
      @param {Array=} argTypes
      @param {Arguments|Array=} args
      @param {Object=} opts */
  function ccall(ident, returnType, argTypes, args, opts) {
    // For fast lookup of conversion functions
    var toC = {
      'string': function(str) {
        var ret = 0;
        if (str !== null && str !== undefined && str !== 0) { // null string
          // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
          var len = (str.length << 2) + 1;
          ret = stackAlloc(len);
          stringToUTF8(str, ret, len);
        }
        return ret;
      },
      'array': function(arr) {
        var ret = stackAlloc(arr.length);
        writeArrayToMemory(arr, ret);
        return ret;
      }
    };

    function convertReturnValue(ret) {
      if (returnType === 'string') return UTF8ToString(ret);
      if (returnType === 'boolean') return Boolean(ret);
      return ret;
    }

    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    assert(returnType !== 'array', 'Return type should not be "array".');
    if (args) {
      for (var i = 0; i < args.length; i++) {
        var converter = toC[argTypes[i]];
        if (converter) {
          if (stack === 0) stack = stackSave();
          cArgs[i] = converter(args[i]);
        } else {
          cArgs[i] = args[i];
        }
      }
    }
    var ret = func.apply(null, cArgs);

    ret = convertReturnValue(ret);
    if (stack !== 0) stackRestore(stack);
    return ret;
  }

  /** @param {string=} returnType
      @param {Array=} argTypes
      @param {Object=} opts */
  function cwrap(ident, returnType, argTypes, opts) {
    return function() {
      return ccall(ident, returnType, argTypes, arguments);
    }
  }




  // runtime_strings.js: Strings related runtime functions that are part of both MINIMAL_RUNTIME and regular runtime.

  // Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
  // a copy of that string as a Javascript String object.

  var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

  /**
   * @param {number} idx
   * @param {number=} maxBytesToRead
   * @return {string}
   */
  function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
    // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
    // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
    while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
      return UTF8Decoder.decode(heap.subarray(idx, endPtr));
    } else {
      var str = '';
      // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heap[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heap[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heap[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
        }

        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
    }
    return str;
  }

  // Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
  // copy of that string as a Javascript String object.
  // maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
  //                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
  //                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
  //                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
  //                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
  //                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
  //                 throw JS JIT optimizations off, so it is worth to consider consistently using one
  //                 style or the other.
  /**
   * @param {number} ptr
   * @param {number=} maxBytesToRead
   * @return {string}
   */
  function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
  }

  // Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
  // encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
  // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
  // Parameters:
  //   str: the Javascript string to copy.
  //   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
  //   outIdx: The starting offset in the array to begin the copying.
  //   maxBytesToWrite: The maximum number of bytes this function can write to the array.
  //                    This count should include the null terminator,
  //                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
  //                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
  // Returns the number of bytes written, EXCLUDING the null terminator.

  function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
      return 0;

    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
    for (var i = 0; i < str.length; ++i) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
      var u = str.charCodeAt(i); // possibly a lead surrogate
      if (u >= 0xD800 && u <= 0xDFFF) {
        var u1 = str.charCodeAt(++i);
        u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
      }
      if (u <= 0x7F) {
        if (outIdx >= endIdx) break;
        heap[outIdx++] = u;
      } else if (u <= 0x7FF) {
        if (outIdx + 1 >= endIdx) break;
        heap[outIdx++] = 0xC0 | (u >> 6);
        heap[outIdx++] = 0x80 | (u & 63);
      } else if (u <= 0xFFFF) {
        if (outIdx + 2 >= endIdx) break;
        heap[outIdx++] = 0xE0 | (u >> 12);
        heap[outIdx++] = 0x80 | ((u >> 6) & 63);
        heap[outIdx++] = 0x80 | (u & 63);
      } else {
        if (outIdx + 3 >= endIdx) break;
        if (u >= 0x200000) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).');
        heap[outIdx++] = 0xF0 | (u >> 18);
        heap[outIdx++] = 0x80 | ((u >> 12) & 63);
        heap[outIdx++] = 0x80 | ((u >> 6) & 63);
        heap[outIdx++] = 0x80 | (u & 63);
      }
    }
    // Null-terminate the pointer to the buffer.
    heap[outIdx] = 0;
    return outIdx - startIdx;
  }

  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
  // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
  // Returns the number of bytes written, EXCLUDING the null terminator.

  function stringToUTF8(str, outPtr, maxBytesToWrite) {
    assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
    return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
  }

  // Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
  function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      var u = str.charCodeAt(i); // possibly a lead surrogate
      if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
      if (u <= 0x7F) ++len;
      else if (u <= 0x7FF) len += 2;
      else if (u <= 0xFFFF) len += 3;
      else len += 4;
    }
    return len;
  }

  // Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
  // a copy of that string as a Javascript String object.

  var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

  function UTF16ToString(ptr, maxBytesToRead) {
    assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
    var endPtr = ptr;
    // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
    // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
    var idx = endPtr >> 1;
    var maxIdx = idx + maxBytesToRead / 2;
    // If maxBytesToRead is not passed explicitly, it will be undefined, and this
    // will always evaluate to true. This saves on code size.
    while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
    endPtr = idx << 1;

    if (endPtr - ptr > 32 && UTF16Decoder) {
      return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
    } else {
      var i = 0;

      var str = '';
      while (1) {
        var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
        if (codeUnit == 0 || i == maxBytesToRead / 2) return str;
        ++i;
        // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
        str += String.fromCharCode(codeUnit);
      }
    }
  }

  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
  // Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
  // Parameters:
  //   str: the Javascript string to copy.
  //   outPtr: Byte address in Emscripten HEAP where to write the string to.
  //   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
  //                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
  //                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
  // Returns the number of bytes written, EXCLUDING the null terminator.

  function stringToUTF16(str, outPtr, maxBytesToWrite) {
    assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
    assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
    // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
    if (maxBytesToWrite === undefined) {
      maxBytesToWrite = 0x7FFFFFFF;
    }
    if (maxBytesToWrite < 2) return 0;
    maxBytesToWrite -= 2; // Null terminator.
    var startPtr = outPtr;
    var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
    for (var i = 0; i < numCharsToWrite; ++i) {
      // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
      var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
      HEAP16[((outPtr)>>1)]=codeUnit;
      outPtr += 2;
    }
    // Null-terminate the pointer to the HEAP.
    HEAP16[((outPtr)>>1)]=0;
    return outPtr - startPtr;
  }

  // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

  function lengthBytesUTF16(str) {
    return str.length*2;
  }

  function UTF32ToString(ptr, maxBytesToRead) {
    assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
    var i = 0;

    var str = '';
    // If maxBytesToRead is not passed explicitly, it will be undefined, and this
    // will always evaluate to true. This saves on code size.
    while (!(i >= maxBytesToRead / 4)) {
      var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
      if (utf32 == 0) break;
      ++i;
      // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      if (utf32 >= 0x10000) {
        var ch = utf32 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      } else {
        str += String.fromCharCode(utf32);
      }
    }
    return str;
  }

  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
  // Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
  // Parameters:
  //   str: the Javascript string to copy.
  //   outPtr: Byte address in Emscripten HEAP where to write the string to.
  //   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
  //                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
  //                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
  // Returns the number of bytes written, EXCLUDING the null terminator.

  function stringToUTF32(str, outPtr, maxBytesToWrite) {
    assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
    assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
    // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
    if (maxBytesToWrite === undefined) {
      maxBytesToWrite = 0x7FFFFFFF;
    }
    if (maxBytesToWrite < 4) return 0;
    var startPtr = outPtr;
    var endPtr = startPtr + maxBytesToWrite - 4;
    for (var i = 0; i < str.length; ++i) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
      if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
        var trailSurrogate = str.charCodeAt(++i);
        codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
      }
      HEAP32[((outPtr)>>2)]=codeUnit;
      outPtr += 4;
      if (outPtr + 4 > endPtr) break;
    }
    // Null-terminate the pointer to the HEAP.
    HEAP32[((outPtr)>>2)]=0;
    return outPtr - startPtr;
  }

  // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

  function lengthBytesUTF32(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      var codeUnit = str.charCodeAt(i);
      if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
      len += 4;
    }

    return len;
  }

  // Allocate heap space for a JS string, and write it there.
  // It is the responsibility of the caller to free() that memory.
  function allocateUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret) stringToUTF8Array(str, HEAP8, ret, size);
    return ret;
  }

  function writeArrayToMemory(array, buffer) {
    assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)');
    HEAP8.set(array, buffer);
  }

  /** @param {boolean=} dontAddNull */
  function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
      assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
      HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
    }
    // Null-terminate the pointer to the HEAP.
    if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
  }
  var WASM_PAGE_SIZE = 65536;

  function alignUp(x, multiple) {
    if (x % multiple > 0) {
      x += multiple - (x % multiple);
    }
    return x;
  }

  var /** @type {ArrayBuffer} */
    buffer,
  /** @type {Int8Array} */
    HEAP8,
  /** @type {Uint8Array} */
    HEAPU8,
  /** @type {Int16Array} */
    HEAP16,
  /** @type {Uint16Array} */
    HEAPU16,
  /** @type {Int32Array} */
    HEAP32,
  /** @type {Uint32Array} */
    HEAPU32,
  /** @type {Float32Array} */
    HEAPF32,
  /** @type {Float64Array} */
    HEAPF64;

  function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module['HEAP8'] = HEAP8 = new Int8Array(buf);
    Module['HEAP16'] = HEAP16 = new Int16Array(buf);
    Module['HEAP32'] = HEAP32 = new Int32Array(buf);
    Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
    Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
    Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
    Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
    Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
  }

  var STACK_BASE = 11442304,
      STACK_MAX = 6199424;

  assert(STACK_BASE % 16 === 0, 'stack must start aligned');



  var TOTAL_STACK = 5242880;
  if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime');

  var INITIAL_INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;if (!Object.getOwnPropertyDescriptor(Module, 'INITIAL_MEMORY')) Object.defineProperty(Module, 'INITIAL_MEMORY', { configurable: true, get: function() { abort('Module.INITIAL_MEMORY has been replaced with plain INITIAL_INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)'); } });

  assert(INITIAL_INITIAL_MEMORY >= TOTAL_STACK, 'INITIAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_INITIAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

  // check for full engine support (use string 'subarray' to avoid closure compiler confusion)
  assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
         'JS engine does not provide full typed array support');


  // In non-standalone/normal mode, we create the memory here.



  // Create the main memory. (Note: this isn't used in STANDALONE_WASM mode since the wasm
  // memory is created in the wasm, not in JS.)

    if (Module['wasmMemory']) {
      wasmMemory = Module['wasmMemory'];
    } else
    {
      wasmMemory = new WebAssembly.Memory({
        'initial': INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
        ,
        'maximum': 2147483648 / WASM_PAGE_SIZE
      });
    }


  if (wasmMemory) {
    buffer = wasmMemory.buffer;
  }

  // If the user provides an incorrect length, just use that length instead rather than providing the user to
  // specifically provide the memory length with Module['INITIAL_MEMORY'].
  INITIAL_INITIAL_MEMORY = buffer.byteLength;
  assert(INITIAL_INITIAL_MEMORY % WASM_PAGE_SIZE === 0);
  assert(65536 % WASM_PAGE_SIZE === 0);
  updateGlobalBufferAndViews(buffer);










  // Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
  function writeStackCookie() {
    assert((STACK_MAX & 3) == 0);
    // The stack grows downwards
    HEAPU32[(STACK_MAX >> 2)+1] = 0x2135467;
    HEAPU32[(STACK_MAX >> 2)+2] = 0x89BACDFE;
    // Also test the global address 0 for integrity.
    // We don't do this with ASan because ASan does its own checks for this.
    HEAP32[0] = 0x63736d65; /* 'emsc' */
  }

  function checkStackCookie() {
    var cookie1 = HEAPU32[(STACK_MAX >> 2)+1];
    var cookie2 = HEAPU32[(STACK_MAX >> 2)+2];
    if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
      abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x' + cookie2.toString(16) + ' ' + cookie1.toString(16));
    }
    // Also test the global address 0 for integrity.
    // We don't do this with ASan because ASan does its own checks for this.
    if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }





  // Endianness check (note: assumes compiler arch was little-endian)
  (function() {
    var h16 = new Int16Array(1);
    var h8 = new Int8Array(h16.buffer);
    h16[0] = 0x6373;
    if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';
  })();



  var __ATPRERUN__  = []; // functions called before the runtime is initialized
  var __ATINIT__    = []; // functions called during startup
  var __ATMAIN__    = []; // functions called when main() is to be run
  var __ATPOSTRUN__ = []; // functions called after the main() is called

  var runtimeInitialized = false;
  var runtimeExited = false;


  function preRun() {

    if (Module['preRun']) {
      if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
      while (Module['preRun'].length) {
        addOnPreRun(Module['preRun'].shift());
      }
    }

    callRuntimeCallbacks(__ATPRERUN__);
  }

  function initRuntime() {
    checkStackCookie();
    assert(!runtimeInitialized);
    runtimeInitialized = true;
    Module['___set_stack_limits'](STACK_BASE, STACK_MAX);
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
    callRuntimeCallbacks(__ATINIT__);
  }

  function preMain() {
    checkStackCookie();
    FS.ignorePermissions = false;
    callRuntimeCallbacks(__ATMAIN__);
  }

  function exitRuntime() {
    checkStackCookie();
    runtimeExited = true;
  }

  function postRun() {
    checkStackCookie();

    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
      while (Module['postRun'].length) {
        addOnPostRun(Module['postRun'].shift());
      }
    }

    callRuntimeCallbacks(__ATPOSTRUN__);
  }

  function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb);
  }

  function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb);
  }




  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

  assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
  assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
  assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
  assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');



  // A counter of dependencies for calling run(). If we need to
  // do asynchronous work before running, increment this and
  // decrement it. Incrementing must happen in a place like
  // Module.preRun (used by emcc to add file preloading).
  // Note that you can add dependencies in preRun, even though
  // it happens right before run - run will be postponed until
  // the dependencies are met.
  var runDependencies = 0;
  var runDependencyWatcher = null;
  var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
  var runDependencyTracking = {};

  function getUniqueRunDependency(id) {
    var orig = id;
    while (1) {
      if (!runDependencyTracking[id]) return id;
      id = orig + Math.random();
    }
  }

  function addRunDependency(id) {
    runDependencies++;

    if (Module['monitorRunDependencies']) {
      Module['monitorRunDependencies'](runDependencies);
    }

    if (id) {
      assert(!runDependencyTracking[id]);
      runDependencyTracking[id] = 1;
      if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
        // Check for missing dependencies every few seconds
        runDependencyWatcher = setInterval(function() {
          if (ABORT) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
            return;
          }
          var shown = false;
          for (var dep in runDependencyTracking) {
            if (!shown) {
              shown = true;
              err('still waiting on run dependencies:');
            }
            err('dependency: ' + dep);
          }
          if (shown) {
            err('(end of list)');
          }
        }, 10000);
      }
    } else {
      err('warning: run dependency added without ID');
    }
  }

  function removeRunDependency(id) {
    runDependencies--;

    if (Module['monitorRunDependencies']) {
      Module['monitorRunDependencies'](runDependencies);
    }

    if (id) {
      assert(runDependencyTracking[id]);
      delete runDependencyTracking[id];
    } else {
      err('warning: run dependency removed without ID');
    }
    if (runDependencies == 0) {
      if (runDependencyWatcher !== null) {
        clearInterval(runDependencyWatcher);
        runDependencyWatcher = null;
      }
      if (dependenciesFulfilled) {
        var callback = dependenciesFulfilled;
        dependenciesFulfilled = null;
        callback(); // can add another dependenciesFulfilled
      }
    }
  }

  Module["preloadedImages"] = {}; // maps url to image data
  Module["preloadedAudios"] = {}; // maps url to audio data

  /** @param {string|number=} what */
  function abort(what) {
    if (Module['onAbort']) {
      Module['onAbort'](what);
    }

    what += '';
    err(what);

    ABORT = true;

    var output = 'abort(' + what + ') at ' + stackTrace();
    what = output;

    // Use a wasm runtime error, because a JS error might be seen as a foreign
    // exception, which means we'd run destructors on it. We need the error to
    // simply make the program stop.
    var e = new WebAssembly.RuntimeError(what);

    readyPromiseReject(e);
    // Throw the error whether or not MODULARIZE is set because abort is used
    // in code paths apart from instantiation where an exception is expected
    // to be thrown when abort is called.
    throw e;
  }

  var memoryInitializer = "webmscore.lib.mem.wasm";











  function hasPrefix(str, prefix) {
    return String.prototype.startsWith ?
        str.startsWith(prefix) :
        str.indexOf(prefix) === 0;
  }

  // Prefix of data URIs emitted by SINGLE_FILE and related options.
  var dataURIPrefix = 'data:application/octet-stream;base64,';

  // Indicates whether filename is a base64 data URI.
  function isDataURI(filename) {
    return hasPrefix(filename, dataURIPrefix);
  }

  var fileURIPrefix = "file://";

  // Indicates whether filename is delivered via file protocol (as opposed to http/https)
  function isFileURI(filename) {
    return hasPrefix(filename, fileURIPrefix);
  }



  function createExportWrapper(name, fixedasm) {
    return function() {
      var displayName = name;
      var asm = fixedasm;
      if (!fixedasm) {
        asm = Module['asm'];
      }
      assert(runtimeInitialized, 'native function `' + displayName + '` called before runtime initialization');
      assert(!runtimeExited, 'native function `' + displayName + '` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
      if (!asm[name]) {
        assert(asm[name], 'exported native function `' + displayName + '` not found');
      }
      return asm[name].apply(null, arguments);
    };
  }


  var wasmBinaryFile = 'webmscore.lib.wasm';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

  function getBinary() {
    try {
      if (wasmBinary) {
        return new Uint8Array(wasmBinary);
      }

      if (readBinary) {
        return readBinary(wasmBinaryFile);
      } else {
        throw "both async and sync fetching of the wasm failed";
      }
    }
    catch (err) {
      abort(err);
    }
  }

  function getBinaryPromise() {
    // If we don't have the binary yet, and have the Fetch api, use that;
    // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function'
        // Let's not use fetch to get objects over file:// as it's most likely Cordova which doesn't support fetch for file://
        && !isFileURI(wasmBinaryFile)
        ) {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(function () {
        return getBinary();
      });
    }
    // Otherwise, getBinary should be able to get it synchronously
    return Promise.resolve().then(getBinary);
  }



  // Create the wasm instance.
  // Receives the wasm imports, returns the exports.
  function createWasm() {
    // prepare imports
    var info = {
      'env': asmLibraryArg,
      'wasi_snapshot_preview1': asmLibraryArg
    };
    // Load the wasm module and create an instance of using native support in the JS engine.
    // handle a generated wasm instance, receiving its exports and
    // performing other necessary setup
    /** @param {WebAssembly.Module=} module*/
    function receiveInstance(instance, module) {
      var exports = instance.exports;




      Module['asm'] = exports;

      wasmTable = Module['asm']['__indirect_function_table'];
      assert(wasmTable, "table not found in wasm exports");


      removeRunDependency('wasm-instantiate');
    }
    // we can't run yet (except in a pthread, where we have a custom sync instantiator)
    addRunDependency('wasm-instantiate');


    // Async compilation can be confusing when an error on the page overwrites Module
    // (for example, if the order of elements is wrong, and the one defining Module is
    // later), so we save Module and check it later.
    var trueModule = Module;
    function receiveInstantiatedSource(output) {
      // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
      // receiveInstance() will swap in the exports (to Module.asm) so they can be called
      assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
      trueModule = null;
      // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
      // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
      receiveInstance(output['instance']);
    }


    function instantiateArrayBuffer(receiver) {
      return getBinaryPromise().then(function(binary) {
        return WebAssembly.instantiate(binary, info);
      }).then(receiver, function(reason) {
        err('failed to asynchronously prepare wasm: ' + reason);


        abort(reason);
      });
    }

    // Prefer streaming instantiation if available.
    function instantiateAsync() {
      if (!wasmBinary &&
          typeof WebAssembly.instantiateStreaming === 'function' &&
          !isDataURI(wasmBinaryFile) &&
          // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
          !isFileURI(wasmBinaryFile) &&
          typeof fetch === 'function') {
        fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
          var result = WebAssembly.instantiateStreaming(response, info);
          return result.then(receiveInstantiatedSource, function(reason) {
              // We expect the most common failure cause to be a bad MIME type for the binary,
              // in which case falling back to ArrayBuffer instantiation should work.
              err('wasm streaming compile failed: ' + reason);
              err('falling back to ArrayBuffer instantiation');
              return instantiateArrayBuffer(receiveInstantiatedSource);
            });
        });
      } else {
        return instantiateArrayBuffer(receiveInstantiatedSource);
      }
    }
    // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
    // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
    // to any other async startup actions they are performing.
    if (Module['instantiateWasm']) {
      try {
        var exports = Module['instantiateWasm'](info, receiveInstance);
        return exports;
      } catch(e) {
        err('Module.instantiateWasm callback failed with error: ' + e);
        return false;
      }
    }

    instantiateAsync();
    return {}; // no exports yet; we'll fill them in later
  }

  // Globals used by JS i64 conversions
  var tempDouble;
  var tempI64;

    function callRuntimeCallbacks(callbacks) {
        while(callbacks.length > 0) {
          var callback = callbacks.shift();
          if (typeof callback == 'function') {
            callback(Module); // Pass the module as the first argument.
            continue;
          }
          var func = callback.func;
          if (typeof func === 'number') {
            if (callback.arg === undefined) {
              wasmTable.get(func)();
            } else {
              wasmTable.get(func)(callback.arg);
            }
          } else {
            func(callback.arg === undefined ? null : callback.arg);
          }
        }
      }

    function demangle(func) {
        // If demangle has failed before, stop demangling any further function names
        // This avoids an infinite recursion with malloc()->abort()->stackTrace()->demangle()->malloc()->...
        demangle.recursionGuard = (demangle.recursionGuard|0)+1;
        if (demangle.recursionGuard > 1) return func;
        var __cxa_demangle_func = Module['___cxa_demangle'] || Module['__cxa_demangle'];
        assert(__cxa_demangle_func);
        var stackTop = stackSave();
        try {
          var s = func;
          if (s.startsWith('__Z'))
            s = s.substr(1);
          var len = lengthBytesUTF8(s)+1;
          var buf = stackAlloc(len);
          stringToUTF8(s, buf, len);
          var status = stackAlloc(4);
          var ret = __cxa_demangle_func(buf, 0, 0, status);
          if (HEAP32[((status)>>2)] === 0 && ret) {
            return UTF8ToString(ret);
          }
          // otherwise, libcxxabi failed
        } catch(e) {
        } finally {
          _free(ret);
          stackRestore(stackTop);
          if (demangle.recursionGuard < 2) --demangle.recursionGuard;
        }
        // failure when using libcxxabi, don't demangle
        return func;
      }

    function demangleAll(text) {
        var regex =
          /\b_Z[\w\d_]+/g;
        return text.replace(regex,
          function(x) {
            var y = demangle(x);
            return x === y ? x : (y + ' [' + x + ']');
          });
      }

    function dynCallLegacy(sig, ptr, args) {
        assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
        if (args && args.length) {
          // j (64-bit integer) must be passed in as two numbers [low 32, high 32].
          assert(args.length === sig.substring(1).replace(/j/g, '--').length);
        } else {
          assert(sig.length == 1);
        }
        if (args && args.length) {
          return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
        }
        return Module['dynCall_' + sig].call(null, ptr);
      }
    function dynCall(sig, ptr, args) {
        // Without WASM_BIGINT support we cannot directly call function with i64 as
        // part of thier signature, so we rely the dynCall functions generated by
        // wasm-emscripten-finalize
        if (sig.indexOf('j') != -1) {
          return dynCallLegacy(sig, ptr, args);
        }
    
        return wasmTable.get(ptr).apply(null, args)
      }

    function jsStackTrace() {
        var error = new Error();
        if (!error.stack) {
          // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
          // so try that as a special-case.
          try {
            throw new Error();
          } catch(e) {
            error = e;
          }
          if (!error.stack) {
            return '(no stack trace available)';
          }
        }
        return error.stack.toString();
      }

    function stackTrace() {
        var js = jsStackTrace();
        if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
        return demangleAll(js);
      }

    function ___assert_fail(condition, filename, line, func) {
        abort('Assertion failed: ' + UTF8ToString(condition) + ', at: ' + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
      }

    var ExceptionInfoAttrs={DESTRUCTOR_OFFSET:0,REFCOUNT_OFFSET:4,TYPE_OFFSET:8,CAUGHT_OFFSET:12,RETHROWN_OFFSET:13,SIZE:16};
    function ___cxa_allocate_exception(size) {
        // Thrown object is prepended by exception metadata block
        return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE;
      }

    function _atexit(func, arg) {
      }
    function ___cxa_atexit(a0,a1
    ) {
    return _atexit();
    }

    var exceptionCaught= [];
    function ___cxa_rethrow() {
        var catchInfo = exceptionCaught.pop();
        var info = catchInfo.get_exception_info();
        var ptr = catchInfo.get_base_ptr();
        if (!info.get_rethrown()) {
          // Only pop if the corresponding push was through rethrow_primary_exception
          exceptionCaught.push(catchInfo);
          info.set_rethrown(true);
        } else {
          catchInfo.free();
        }
        throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
      }

    function ___cxa_thread_atexit(a0,a1
    ) {
    return _atexit();
    }

    function ExceptionInfo(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
    
        this.set_type = function(type) {
          HEAP32[(((this.ptr)+(ExceptionInfoAttrs.TYPE_OFFSET))>>2)]=type;
        };
    
        this.get_type = function() {
          return HEAP32[(((this.ptr)+(ExceptionInfoAttrs.TYPE_OFFSET))>>2)];
        };
    
        this.set_destructor = function(destructor) {
          HEAP32[(((this.ptr)+(ExceptionInfoAttrs.DESTRUCTOR_OFFSET))>>2)]=destructor;
        };
    
        this.get_destructor = function() {
          return HEAP32[(((this.ptr)+(ExceptionInfoAttrs.DESTRUCTOR_OFFSET))>>2)];
        };
    
        this.set_refcount = function(refcount) {
          HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)]=refcount;
        };
    
        this.set_caught = function (caught) {
          caught = caught ? 1 : 0;
          HEAP8[(((this.ptr)+(ExceptionInfoAttrs.CAUGHT_OFFSET))>>0)]=caught;
        };
    
        this.get_caught = function () {
          return HEAP8[(((this.ptr)+(ExceptionInfoAttrs.CAUGHT_OFFSET))>>0)] != 0;
        };
    
        this.set_rethrown = function (rethrown) {
          rethrown = rethrown ? 1 : 0;
          HEAP8[(((this.ptr)+(ExceptionInfoAttrs.RETHROWN_OFFSET))>>0)]=rethrown;
        };
    
        this.get_rethrown = function () {
          return HEAP8[(((this.ptr)+(ExceptionInfoAttrs.RETHROWN_OFFSET))>>0)] != 0;
        };
    
        // Initialize native structure fields. Should be called once after allocated.
        this.init = function(type, destructor) {
          this.set_type(type);
          this.set_destructor(destructor);
          this.set_refcount(0);
          this.set_caught(false);
          this.set_rethrown(false);
        };
    
        this.add_ref = function() {
          var value = HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)];
          HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)]=value + 1;
        };
    
        // Returns true if last reference released.
        this.release_ref = function() {
          var prev = HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)];
          HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)]=prev - 1;
          assert(prev > 0);
          return prev === 1;
        };
      }
    function ___cxa_throw(ptr, type, destructor) {
        var info = new ExceptionInfo(ptr);
        // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
        info.init(type, destructor);
        if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
          __ZSt18uncaught_exceptionv.uncaught_exceptions = 1;
        } else {
          __ZSt18uncaught_exceptionv.uncaught_exceptions++;
        }
        throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
      }

    function ___handle_stack_overflow() {
        abort('stack overflow');
      }

    function _tzset() {
        // TODO: Use (malleable) environment variables instead of system settings.
        if (_tzset.called) return;
        _tzset.called = true;
    
        // timezone is specified as seconds west of UTC ("The external variable
        // `timezone` shall be set to the difference, in seconds, between
        // Coordinated Universal Time (UTC) and local standard time."), the same
        // as returned by getTimezoneOffset().
        // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
        HEAP32[((__get_timezone())>>2)]=(new Date()).getTimezoneOffset() * 60;
    
        var currentYear = new Date().getFullYear();
        var winter = new Date(currentYear, 0, 1);
        var summer = new Date(currentYear, 6, 1);
        HEAP32[((__get_daylight())>>2)]=Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
    
        function extractZone(date) {
          var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
          return match ? match[1] : "GMT";
        }      var winterName = extractZone(winter);
        var summerName = extractZone(summer);
        var winterNamePtr = allocateUTF8(winterName);
        var summerNamePtr = allocateUTF8(summerName);
        if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
          // Northern hemisphere
          HEAP32[((__get_tzname())>>2)]=winterNamePtr;
          HEAP32[(((__get_tzname())+(4))>>2)]=summerNamePtr;
        } else {
          HEAP32[((__get_tzname())>>2)]=summerNamePtr;
          HEAP32[(((__get_tzname())+(4))>>2)]=winterNamePtr;
        }
      }
    function _localtime_r(time, tmPtr) {
        _tzset();
        var date = new Date(HEAP32[((time)>>2)]*1000);
        HEAP32[((tmPtr)>>2)]=date.getSeconds();
        HEAP32[(((tmPtr)+(4))>>2)]=date.getMinutes();
        HEAP32[(((tmPtr)+(8))>>2)]=date.getHours();
        HEAP32[(((tmPtr)+(12))>>2)]=date.getDate();
        HEAP32[(((tmPtr)+(16))>>2)]=date.getMonth();
        HEAP32[(((tmPtr)+(20))>>2)]=date.getFullYear()-1900;
        HEAP32[(((tmPtr)+(24))>>2)]=date.getDay();
    
        var start = new Date(date.getFullYear(), 0, 1);
        var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
        HEAP32[(((tmPtr)+(28))>>2)]=yday;
        HEAP32[(((tmPtr)+(36))>>2)]=-(date.getTimezoneOffset() * 60);
    
        // Attention: DST is in December in South, and some regions don't have DST at all.
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
        HEAP32[(((tmPtr)+(32))>>2)]=dst;
    
        var zonePtr = HEAP32[(((__get_tzname())+(dst ? 4 : 0))>>2)];
        HEAP32[(((tmPtr)+(40))>>2)]=zonePtr;
    
        return tmPtr;
      }
    function ___localtime_r(a0,a1
    ) {
    return _localtime_r(a0,a1);
    }

    var PATH={splitPath:function(filename) {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1);
        },normalizeArray:function(parts, allowAboveRoot) {
          // if the path tries to go above the root, `up` ends up > 0
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === '.') {
              parts.splice(i, 1);
            } else if (last === '..') {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          // if the path is allowed to go above the root, restore leading ..s
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift('..');
            }
          }
          return parts;
        },normalize:function(path) {
          var isAbsolute = path.charAt(0) === '/',
              trailingSlash = path.substr(-1) === '/';
          // Normalize the path
          path = PATH.normalizeArray(path.split('/').filter(function(p) {
            return !!p;
          }), !isAbsolute).join('/');
          if (!path && !isAbsolute) {
            path = '.';
          }
          if (path && trailingSlash) {
            path += '/';
          }
          return (isAbsolute ? '/' : '') + path;
        },dirname:function(path) {
          var result = PATH.splitPath(path),
              root = result[0],
              dir = result[1];
          if (!root && !dir) {
            // No dirname whatsoever
            return '.';
          }
          if (dir) {
            // It has a dirname, strip trailing slash
            dir = dir.substr(0, dir.length - 1);
          }
          return root + dir;
        },basename:function(path) {
          // EMSCRIPTEN return '/'' for '/', not an empty string
          if (path === '/') return '/';
          path = PATH.normalize(path);
          path = path.replace(/\/$/, "");
          var lastSlash = path.lastIndexOf('/');
          if (lastSlash === -1) return path;
          return path.substr(lastSlash+1);
        },extname:function(path) {
          return PATH.splitPath(path)[3];
        },join:function() {
          var paths = Array.prototype.slice.call(arguments, 0);
          return PATH.normalize(paths.join('/'));
        },join2:function(l, r) {
          return PATH.normalize(l + '/' + r);
        }};
    
    function setErrNo(value) {
        HEAP32[((___errno_location())>>2)]=value;
        return value;
      }
    
    function getRandomDevice() {
        if (typeof crypto === 'object' && typeof crypto['getRandomValues'] === 'function') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          return function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else
        if (ENVIRONMENT_IS_NODE) {
          // for nodejs with or without crypto support included
          try {
            var crypto_module = require('crypto');
            // nodejs has crypto support
            return function() { return crypto_module['randomBytes'](1)[0]; };
          } catch (e) {
            // nodejs doesn't have crypto support
          }
        }
        // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
        return function() { abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };"); };
      }
    
    var PATH_FS={resolve:function() {
          var resolvedPath = '',
            resolvedAbsolute = false;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = (i >= 0) ? arguments[i] : FS.cwd();
            // Skip empty and invalid entries
            if (typeof path !== 'string') {
              throw new TypeError('Arguments to path.resolve must be strings');
            } else if (!path) {
              return ''; // an invalid portion invalidates the whole thing
            }
            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = path.charAt(0) === '/';
          }
          // At this point the path should be resolved to a full absolute path, but
          // handle relative paths to be safe (might happen when process.cwd() fails)
          resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
            return !!p;
          }), !resolvedAbsolute).join('/');
          return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
        },relative:function(from, to) {
          from = PATH_FS.resolve(from).substr(1);
          to = PATH_FS.resolve(to).substr(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== '') break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== '') break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split('/'));
          var toParts = trim(to.split('/'));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push('..');
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join('/');
        }};
    
    var TTY={ttys:[],init:function () {
          // https://github.com/emscripten-core/emscripten/pull/1555
          // if (ENVIRONMENT_IS_NODE) {
          //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
          //   // device, it always assumes it's a TTY device. because of this, we're forcing
          //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
          //   // with text files until FS.init can be refactored.
          //   process['stdin']['setEncoding']('utf8');
          // }
        },shutdown:function() {
          // https://github.com/emscripten-core/emscripten/pull/1555
          // if (ENVIRONMENT_IS_NODE) {
          //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
          //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
          //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
          //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
          //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
          //   process['stdin']['pause']();
          // }
        },register:function(dev, ops) {
          TTY.ttys[dev] = { input: [], output: [], ops: ops };
          FS.registerDevice(dev, TTY.stream_ops);
        },stream_ops:{open:function(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
              throw new FS.ErrnoError(43);
            }
            stream.tty = tty;
            stream.seekable = false;
          },close:function(stream) {
            // flush any pending line data
            stream.tty.ops.flush(stream.tty);
          },flush:function(stream) {
            stream.tty.ops.flush(stream.tty);
          },read:function(stream, buffer, offset, length, pos /* ignored */) {
            if (!stream.tty || !stream.tty.ops.get_char) {
              throw new FS.ErrnoError(60);
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = stream.tty.ops.get_char(stream.tty);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },write:function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
              throw new FS.ErrnoError(60);
            }
            try {
              for (var i = 0; i < length; i++) {
                stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
              }
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }},default_tty_ops:{get_char:function(tty) {
            if (!tty.input.length) {
              var result = null;
              if (ENVIRONMENT_IS_NODE) {
                // we will read data by chunks of BUFSIZE
                var BUFSIZE = 256;
                var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
                var bytesRead = 0;
    
                try {
                  bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
                } catch(e) {
                  // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                  // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                  if (e.toString().indexOf('EOF') != -1) bytesRead = 0;
                  else throw e;
                }
    
                if (bytesRead > 0) {
                  result = buf.slice(0, bytesRead).toString('utf-8');
                } else {
                  result = null;
                }
              } else
              if (typeof window != 'undefined' &&
                typeof window.prompt == 'function') {
                // Browser.
                result = window.prompt('Input: ');  // returns null on cancel
                if (result !== null) {
                  result += '\n';
                }
              } else if (typeof readline == 'function') {
                // Command line.
                result = readline();
                if (result !== null) {
                  result += '\n';
                }
              }
              if (!result) {
                return null;
              }
              tty.input = intArrayFromString(result, true);
            }
            return tty.input.shift();
          },put_char:function(tty, val) {
            if (val === null || val === 10) {
              out(UTF8ArrayToString(tty.output, 0));
              tty.output = [];
            } else {
              if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
            }
          },flush:function(tty) {
            if (tty.output && tty.output.length > 0) {
              out(UTF8ArrayToString(tty.output, 0));
              tty.output = [];
            }
          }},default_tty1_ops:{put_char:function(tty, val) {
            if (val === null || val === 10) {
              err(UTF8ArrayToString(tty.output, 0));
              tty.output = [];
            } else {
              if (val != 0) tty.output.push(val);
            }
          },flush:function(tty) {
            if (tty.output && tty.output.length > 0) {
              err(UTF8ArrayToString(tty.output, 0));
              tty.output = [];
            }
          }}};
    
    function mmapAlloc(size) {
        var alignedSize = alignMemory(size, 16384);
        var ptr = _malloc(alignedSize);
        while (size < alignedSize) HEAP8[ptr + size++] = 0;
        return ptr;
      }
    var MEMFS={ops_table:null,mount:function(mount) {
          return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
        },createNode:function(parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            // no supported
            throw new FS.ErrnoError(63);
          }
          if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap,
                  msync: MEMFS.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
              }
            };
          }
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
            // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
            // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
            // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
            node.contents = null; 
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
          }
          node.timestamp = Date.now();
          // add the new node to the parent
          if (parent) {
            parent.contents[name] = node;
          }
          return node;
        },getFileDataAsRegularArray:function(node) {
          if (node.contents && node.contents.subarray) {
            var arr = [];
            for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
            return arr; // Returns a copy of the original data.
          }
          return node.contents; // No-op, the file contents are already in a JS array. Return as-is.
        },getFileDataAsTypedArray:function(node) {
          if (!node.contents) return new Uint8Array(0);
          if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
          return new Uint8Array(node.contents);
        },expandFileStorage:function(node, newCapacity) {
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
          // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
          // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
          // avoid overshooting the allocation cap by a very large margin.
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity); // Allocate new storage.
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
          return;
        },resizeFileStorage:function(node, newSize) {
          if (node.usedBytes == newSize) return;
          if (newSize == 0) {
            node.contents = null; // Fully decommit when requesting a resize to zero.
            node.usedBytes = 0;
            return;
          }
          if (!node.contents || node.contents.subarray) { // Resize a typed array if that is being used as the backing store.
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize); // Allocate new storage.
            if (oldContents) {
              node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
            }
            node.usedBytes = newSize;
            return;
          }
          // Backing with a JS array.
          if (!node.contents) node.contents = [];
          if (node.contents.length > newSize) node.contents.length = newSize;
          else while (node.contents.length < newSize) node.contents.push(0);
          node.usedBytes = newSize;
        },node_ops:{getattr:function(node) {
            var attr = {};
            // device numbers reuse inode numbers.
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
              attr.size = 4096;
            } else if (FS.isFile(node.mode)) {
              attr.size = node.usedBytes;
            } else if (FS.isLink(node.mode)) {
              attr.size = node.link.length;
            } else {
              attr.size = 0;
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
            //       but this is not required by the standard.
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr;
          },setattr:function(node, attr) {
            if (attr.mode !== undefined) {
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              node.timestamp = attr.timestamp;
            }
            if (attr.size !== undefined) {
              MEMFS.resizeFileStorage(node, attr.size);
            }
          },lookup:function(parent, name) {
            throw FS.genericErrors[44];
          },mknod:function(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev);
          },rename:function(old_node, new_dir, new_name) {
            // if we're overwriting a directory at new_name, make sure it's empty.
            if (FS.isDir(old_node.mode)) {
              var new_node;
              try {
                new_node = FS.lookupNode(new_dir, new_name);
              } catch (e) {
              }
              if (new_node) {
                for (var i in new_node.contents) {
                  throw new FS.ErrnoError(55);
                }
              }
            }
            // do the internal rewiring
            delete old_node.parent.contents[old_node.name];
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            old_node.parent = new_dir;
          },unlink:function(parent, name) {
            delete parent.contents[name];
          },rmdir:function(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
              throw new FS.ErrnoError(55);
            }
            delete parent.contents[name];
          },readdir:function(node) {
            var entries = ['.', '..'];
            for (var key in node.contents) {
              if (!node.contents.hasOwnProperty(key)) {
                continue;
              }
              entries.push(key);
            }
            return entries;
          },symlink:function(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
            node.link = oldpath;
            return node;
          },readlink:function(node) {
            if (!FS.isLink(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            return node.link;
          }},stream_ops:{read:function(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) { // non-trivial, and typed array
              buffer.set(contents.subarray(position, position + size), offset);
            } else {
              for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
            }
            return size;
          },write:function(stream, buffer, offset, length, position, canOwn) {
            // The data buffer should be a typed array view
            assert(!(buffer instanceof ArrayBuffer));
            // If the buffer is located in main memory (HEAP), and if
            // memory can grow, we can't hold on to references of the
            // memory buffer, as they may get invalidated. That means we
            // need to do copy its contents.
            if (buffer.buffer === HEAP8.buffer) {
              canOwn = false;
            }
    
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
    
            if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
              if (canOwn) {
                assert(position === 0, 'canOwn must imply no weird position inside the file');
                node.contents = buffer.subarray(offset, offset + length);
                node.usedBytes = length;
                return length;
              } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
                node.contents = buffer.slice(offset, offset + length);
                node.usedBytes = length;
                return length;
              } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
                node.contents.set(buffer.subarray(offset, offset + length), position);
                return length;
              }
            }
    
            // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
            MEMFS.expandFileStorage(node, position+length);
            if (node.contents.subarray && buffer.subarray) {
              // Use typed array write which is available.
              node.contents.set(buffer.subarray(offset, offset + length), position);
            } else {
              for (var i = 0; i < length; i++) {
               node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
              }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length;
          },llseek:function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
              position += stream.position;
            } else if (whence === 2) {
              if (FS.isFile(stream.node.mode)) {
                position += stream.node.usedBytes;
              }
            }
            if (position < 0) {
              throw new FS.ErrnoError(28);
            }
            return position;
          },allocate:function(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
          },mmap:function(stream, address, length, position, prot, flags) {
            // We don't currently support location hints for the address of the mapping
            assert(address === 0);
    
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            // Only make a new copy when MAP_PRIVATE is specified.
            if (!(flags & 2) && contents.buffer === buffer) {
              // We can't emulate MAP_SHARED when the file is not backed by the buffer
              // we're mapping to (e.g. the HEAP buffer).
              allocated = false;
              ptr = contents.byteOffset;
            } else {
              // Try to avoid unnecessary slices.
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length);
                }
              }
              allocated = true;
              ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48);
              }
              HEAP8.set(contents, ptr);
            }
            return { ptr: ptr, allocated: allocated };
          },msync:function(stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (mmapFlags & 2) {
              // MAP_PRIVATE calls need not to be synced back to underlying fs
              return 0;
            }
    
            MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            // should we check if bytesWritten and length are the same?
            return 0;
          }}};
    
    var ERRNO_MESSAGES={0:"Success",1:"Arg list too long",2:"Permission denied",3:"Address already in use",4:"Address not available",5:"Address family not supported by protocol family",6:"No more processes",7:"Socket already connected",8:"Bad file number",9:"Trying to read unreadable message",10:"Mount device busy",11:"Operation canceled",12:"No children",13:"Connection aborted",14:"Connection refused",15:"Connection reset by peer",16:"File locking deadlock error",17:"Destination address required",18:"Math arg out of domain of func",19:"Quota exceeded",20:"File exists",21:"Bad address",22:"File too large",23:"Host is unreachable",24:"Identifier removed",25:"Illegal byte sequence",26:"Connection already in progress",27:"Interrupted system call",28:"Invalid argument",29:"I/O error",30:"Socket is already connected",31:"Is a directory",32:"Too many symbolic links",33:"Too many open files",34:"Too many links",35:"Message too long",36:"Multihop attempted",37:"File or path name too long",38:"Network interface is not configured",39:"Connection reset by network",40:"Network is unreachable",41:"Too many open files in system",42:"No buffer space available",43:"No such device",44:"No such file or directory",45:"Exec format error",46:"No record locks available",47:"The link has been severed",48:"Not enough core",49:"No message of desired type",50:"Protocol not available",51:"No space left on device",52:"Function not implemented",53:"Socket is not connected",54:"Not a directory",55:"Directory not empty",56:"State not recoverable",57:"Socket operation on non-socket",59:"Not a typewriter",60:"No such device or address",61:"Value too large for defined data type",62:"Previous owner died",63:"Not super-user",64:"Broken pipe",65:"Protocol error",66:"Unknown protocol",67:"Protocol wrong type for socket",68:"Math result not representable",69:"Read only file system",70:"Illegal seek",71:"No such process",72:"Stale file handle",73:"Connection timed out",74:"Text file busy",75:"Cross-device link",100:"Device not a stream",101:"Bad font file fmt",102:"Invalid slot",103:"Invalid request code",104:"No anode",105:"Block device required",106:"Channel number out of range",107:"Level 3 halted",108:"Level 3 reset",109:"Link number out of range",110:"Protocol driver not attached",111:"No CSI structure available",112:"Level 2 halted",113:"Invalid exchange",114:"Invalid request descriptor",115:"Exchange full",116:"No data (for no delay io)",117:"Timer expired",118:"Out of streams resources",119:"Machine is not on the network",120:"Package not installed",121:"The object is remote",122:"Advertise error",123:"Srmount error",124:"Communication error on send",125:"Cross mount point (not really error)",126:"Given log. name not unique",127:"f.d. invalid for this operation",128:"Remote address changed",129:"Can   access a needed shared lib",130:"Accessing a corrupted shared lib",131:".lib section in a.out corrupted",132:"Attempting to link in too many libs",133:"Attempting to exec a shared library",135:"Streams pipe error",136:"Too many users",137:"Socket type not supported",138:"Not supported",139:"Protocol family not supported",140:"Can't send after socket shutdown",141:"Too many references",142:"Host is down",148:"No medium (in tape drive)",156:"Level 2 not synchronized"};
    
    var ERRNO_CODES={EPERM:63,ENOENT:44,ESRCH:71,EINTR:27,EIO:29,ENXIO:60,E2BIG:1,ENOEXEC:45,EBADF:8,ECHILD:12,EAGAIN:6,EWOULDBLOCK:6,ENOMEM:48,EACCES:2,EFAULT:21,ENOTBLK:105,EBUSY:10,EEXIST:20,EXDEV:75,ENODEV:43,ENOTDIR:54,EISDIR:31,EINVAL:28,ENFILE:41,EMFILE:33,ENOTTY:59,ETXTBSY:74,EFBIG:22,ENOSPC:51,ESPIPE:70,EROFS:69,EMLINK:34,EPIPE:64,EDOM:18,ERANGE:68,ENOMSG:49,EIDRM:24,ECHRNG:106,EL2NSYNC:156,EL3HLT:107,EL3RST:108,ELNRNG:109,EUNATCH:110,ENOCSI:111,EL2HLT:112,EDEADLK:16,ENOLCK:46,EBADE:113,EBADR:114,EXFULL:115,ENOANO:104,EBADRQC:103,EBADSLT:102,EDEADLOCK:16,EBFONT:101,ENOSTR:100,ENODATA:116,ETIME:117,ENOSR:118,ENONET:119,ENOPKG:120,EREMOTE:121,ENOLINK:47,EADV:122,ESRMNT:123,ECOMM:124,EPROTO:65,EMULTIHOP:36,EDOTDOT:125,EBADMSG:9,ENOTUNIQ:126,EBADFD:127,EREMCHG:128,ELIBACC:129,ELIBBAD:130,ELIBSCN:131,ELIBMAX:132,ELIBEXEC:133,ENOSYS:52,ENOTEMPTY:55,ENAMETOOLONG:37,ELOOP:32,EOPNOTSUPP:138,EPFNOSUPPORT:139,ECONNRESET:15,ENOBUFS:42,EAFNOSUPPORT:5,EPROTOTYPE:67,ENOTSOCK:57,ENOPROTOOPT:50,ESHUTDOWN:140,ECONNREFUSED:14,EADDRINUSE:3,ECONNABORTED:13,ENETUNREACH:40,ENETDOWN:38,ETIMEDOUT:73,EHOSTDOWN:142,EHOSTUNREACH:23,EINPROGRESS:26,EALREADY:7,EDESTADDRREQ:17,EMSGSIZE:35,EPROTONOSUPPORT:66,ESOCKTNOSUPPORT:137,EADDRNOTAVAIL:4,ENETRESET:39,EISCONN:30,ENOTCONN:53,ETOOMANYREFS:141,EUSERS:136,EDQUOT:19,ESTALE:72,ENOTSUP:138,ENOMEDIUM:148,EILSEQ:25,EOVERFLOW:61,ECANCELED:11,ENOTRECOVERABLE:56,EOWNERDEAD:62,ESTRPIPE:135};
    
    var LZ4={DIR_MODE:16895,FILE_MODE:33279,CHUNK_SIZE:-1,codec:null,init:function() {
          if (LZ4.codec) return;
          LZ4.codec = (function() {
            /*
    MiniLZ4: Minimal LZ4 block decoding and encoding.
    
    based off of node-lz4, https://github.com/pierrec/node-lz4
    
    ====
    Copyright (c) 2012 Pierre Curto
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    ====
    
    changes have the same license
    */
    
    var MiniLZ4 = (function() {
    
    var exports = {};
    
    /**
     * Decode a block. Assumptions: input contains all sequences of a 
     * chunk, output is large enough to receive the decoded data.
     * If the output buffer is too small, an error will be thrown.
     * If the returned value is negative, an error occured at the returned offset.
     *
     * @param {ArrayBufferView} input input data
     * @param {ArrayBufferView} output output data
     * @param {number=} sIdx
     * @param {number=} eIdx
     * @return {number} number of decoded bytes
     * @private
     */
    exports.uncompress = function (input, output, sIdx, eIdx) {
    	sIdx = sIdx || 0;
    	eIdx = eIdx || (input.length - sIdx);
    	// Process each sequence in the incoming data
    	for (var i = sIdx, n = eIdx, j = 0; i < n;) {
    		var token = input[i++];
    
    		// Literals
    		var literals_length = (token >> 4);
    		if (literals_length > 0) {
    			// length of literals
    			var l = literals_length + 240;
    			while (l === 255) {
    				l = input[i++];
    				literals_length += l;
    			}
    
    			// Copy the literals
    			var end = i + literals_length;
    			while (i < end) output[j++] = input[i++];
    
    			// End of buffer?
    			if (i === n) return j
    		}
    
    		// Match copy
    		// 2 bytes offset (little endian)
    		var offset = input[i++] | (input[i++] << 8);
    
    		// XXX 0 is an invalid offset value
    		if (offset === 0) return j
    		if (offset > j) return -(i-2)
    
    		// length of match copy
    		var match_length = (token & 0xf);
    		var l = match_length + 240;
    		while (l === 255) {
    			l = input[i++];
    			match_length += l;
    		}
    
    		// Copy the match
    		var pos = j - offset; // position of the match copy in the current output
    		var end = j + match_length + 4; // minmatch = 4
    		while (j < end) output[j++] = output[pos++];
    	}
    
    	return j
    };
    
    var maxInputSize	= 0x7E000000
    ,	minMatch		= 4
    // uint32() optimization
    ,	hashLog			= 16
    ,	hashShift		= (minMatch * 8) - hashLog
    ,	copyLength		= 8
    ,	mfLimit			= copyLength + minMatch
    ,	skipStrength	= 6
    
    ,	mlBits  		= 4
    ,	mlMask  		= (1 << mlBits) - 1
    ,	runBits 		= 8 - mlBits
    ,	runMask 		= (1 << runBits) - 1
    
    ,	hasher 			= /* XXX uint32( */ 2654435761; /* ) */
    
    assert(hashShift === 16);
    var hashTable = new Int16Array(1<<16);
    var empty = new Int16Array(hashTable.length);
    
    // CompressBound returns the maximum length of a lz4 block, given it's uncompressed length
    exports.compressBound = function (isize) {
    	return isize > maxInputSize
    		? 0
    		: (isize + (isize/255) + 16) | 0
    };
    
    /** @param {number=} sIdx
    	@param {number=} eIdx */
    exports.compress = function (src, dst, sIdx, eIdx) {
    	hashTable.set(empty);
    	return compressBlock(src, dst, 0, sIdx || 0, eIdx || dst.length)
    };
    
    function compressBlock (src, dst, pos, sIdx, eIdx) {
    	// XXX var Hash = uint32() // Reusable unsigned 32 bits integer
    	var dpos = sIdx;
    	var dlen = eIdx - sIdx;
    	var anchor = 0;
    
    	if (src.length >= maxInputSize) throw new Error("input too large")
    
    	// Minimum of input bytes for compression (LZ4 specs)
    	if (src.length > mfLimit) {
    		var n = exports.compressBound(src.length);
    		if ( dlen < n ) throw Error("output too small: " + dlen + " < " + n)
    
    		var 
    			step  = 1
    		,	findMatchAttempts = (1 << skipStrength) + 3
    		// Keep last few bytes incompressible (LZ4 specs):
    		// last 5 bytes must be literals
    		,	srcLength = src.length - mfLimit;
    
    		while (pos + minMatch < srcLength) {
    			// Find a match
    			// min match of 4 bytes aka sequence
    			var sequenceLowBits = src[pos+1]<<8 | src[pos];
    			var sequenceHighBits = src[pos+3]<<8 | src[pos+2];
    			// compute hash for the current sequence
    			var hash = Math.imul(sequenceLowBits | (sequenceHighBits << 16), hasher) >>> hashShift;
    			/* XXX Hash.fromBits(sequenceLowBits, sequenceHighBits)
    							.multiply(hasher)
    							.shiftr(hashShift)
    							.toNumber() */
    			// get the position of the sequence matching the hash
    			// NB. since 2 different sequences may have the same hash
    			// it is double-checked below
    			// do -1 to distinguish between initialized and uninitialized values
    			var ref = hashTable[hash] - 1;
    			// save position of current sequence in hash table
    			hashTable[hash] = pos + 1;
    
    			// first reference or within 64k limit or current sequence !== hashed one: no match
    			if ( ref < 0 ||
    				((pos - ref) >>> 16) > 0 ||
    				(
    					((src[ref+3]<<8 | src[ref+2]) != sequenceHighBits) ||
    					((src[ref+1]<<8 | src[ref]) != sequenceLowBits )
    				)
    			) {
    				// increase step if nothing found within limit
    				step = findMatchAttempts++ >> skipStrength;
    				pos += step;
    				continue
    			}
    
    			findMatchAttempts = (1 << skipStrength) + 3;
    
    			// got a match
    			var literals_length = pos - anchor;
    			var offset = pos - ref;
    
    			// minMatch already verified
    			pos += minMatch;
    			ref += minMatch;
    
    			// move to the end of the match (>=minMatch)
    			var match_length = pos;
    			while (pos < srcLength && src[pos] == src[ref]) {
    				pos++;
    				ref++;
    			}
    
    			// match length
    			match_length = pos - match_length;
    
    			// token
    			var token = match_length < mlMask ? match_length : mlMask;
    
    			// encode literals length
    			if (literals_length >= runMask) {
    				// add match length to the token
    				dst[dpos++] = (runMask << mlBits) + token;
    				for (var len = literals_length - runMask; len > 254; len -= 255) {
    					dst[dpos++] = 255;
    				}
    				dst[dpos++] = len;
    			} else {
    				// add match length to the token
    				dst[dpos++] = (literals_length << mlBits) + token;
    			}
    
    			// write literals
    			for (var i = 0; i < literals_length; i++) {
    				dst[dpos++] = src[anchor+i];
    			}
    
    			// encode offset
    			dst[dpos++] = offset;
    			dst[dpos++] = (offset >> 8);
    
    			// encode match length
    			if (match_length >= mlMask) {
    				match_length -= mlMask;
    				while (match_length >= 255) {
    					match_length -= 255;
    					dst[dpos++] = 255;
    				}
    
    				dst[dpos++] = match_length;
    			}
    
    			anchor = pos;
    		}
    	}
    
    	// cannot compress input
    	if (anchor == 0) return 0
    
    	// Write last literals
    	// encode literals length
    	literals_length = src.length - anchor;
    	if (literals_length >= runMask) {
    		// add match length to the token
    		dst[dpos++] = (runMask << mlBits);
    		for (var ln = literals_length - runMask; ln > 254; ln -= 255) {
    			dst[dpos++] = 255;
    		}
    		dst[dpos++] = ln;
    	} else {
    		// add match length to the token
    		dst[dpos++] = (literals_length << mlBits);
    	}
    
    	// write literals
    	pos = anchor;
    	while (pos < src.length) {
    		dst[dpos++] = src[pos++];
    	}
    
    	return dpos
    }
    
    exports.CHUNK_SIZE = 2048; // musl libc does readaheads of 1024 bytes, so a multiple of that is a good idea
    
    exports.compressPackage = function(data, verify) {
      if (verify) {
        var temp = new Uint8Array(exports.CHUNK_SIZE);
      }
      // compress the data in chunks
      assert(data instanceof ArrayBuffer);
      data = new Uint8Array(data);
      console.log('compressing package of size ' + data.length);
      var compressedChunks = [];
      var successes = [];
      var offset = 0;
      var total = 0;
      while (offset < data.length) {
        var chunk = data.subarray(offset, offset + exports.CHUNK_SIZE);
        //console.log('compress a chunk ' + [offset, total, data.length]);
        offset += exports.CHUNK_SIZE;
        var bound = exports.compressBound(chunk.length);
        var compressed = new Uint8Array(bound);
        var compressedSize = exports.compress(chunk, compressed);
        if (compressedSize > 0) {
          assert(compressedSize <= bound);
          compressed = compressed.subarray(0, compressedSize);
          compressedChunks.push(compressed);
          total += compressedSize;
          successes.push(1);
          if (verify) {
            var back = exports.uncompress(compressed, temp);
            assert(back === chunk.length, [back, chunk.length]);
            for (var i = 0; i < chunk.length; i++) {
              assert(chunk[i] === temp[i]);
            }
          }
        } else {
          assert(compressedSize === 0);
          // failure to compress :(
          compressedChunks.push(chunk);
          total += chunk.length; // last chunk may not be the full exports.CHUNK_SIZE size
          successes.push(0);
        }
      }
      data = null; // XXX null out pack['data'] too?
      var compressedData = {
        'data': new Uint8Array(total + exports.CHUNK_SIZE*2), // store all the compressed data, plus room for two cached decompressed chunk, in one fast array
        'cachedOffset': total,
        'cachedIndexes': [-1, -1], // cache last two blocks, so that reading 1,2,3 + preloading another block won't trigger decompress thrashing
        'cachedChunks': [null, null],
        'offsets': [], // chunk# => start in compressed data
        'sizes': [],
        'successes': successes, // 1 if chunk is compressed
      };
      offset = 0;
      for (var i = 0; i < compressedChunks.length; i++) {
        compressedData['data'].set(compressedChunks[i], offset);
        compressedData['offsets'][i] = offset;
        compressedData['sizes'][i] = compressedChunks[i].length;
        offset += compressedChunks[i].length;
      }
      console.log('compressed package into ' + [compressedData['data'].length]);
      assert(offset === total);
      return compressedData;
    };
    
    assert(exports.CHUNK_SIZE < (1 << 15)); // we use 16-bit ints as the type of the hash table, chunk size must be smaller
    
    return exports;
    
    })();
            return MiniLZ4;
          })();
          LZ4.CHUNK_SIZE = LZ4.codec.CHUNK_SIZE;
        },loadPackage:function (pack) {
          LZ4.init();
          var compressedData = pack['compressedData'];
          if (!compressedData) compressedData = LZ4.codec.compressPackage(pack['data']);
          assert(compressedData['cachedIndexes'].length === compressedData['cachedChunks'].length);
          for (var i = 0; i < compressedData['cachedIndexes'].length; i++) {
            compressedData['cachedIndexes'][i] = -1;
            compressedData['cachedChunks'][i] = compressedData['data'].subarray(compressedData['cachedOffset'] + i*LZ4.CHUNK_SIZE,
                                                                          compressedData['cachedOffset'] + (i+1)*LZ4.CHUNK_SIZE);
            assert(compressedData['cachedChunks'][i].length === LZ4.CHUNK_SIZE);
          }
          pack['metadata'].files.forEach(function(file) {
            var dir = PATH.dirname(file.filename);
            var name = PATH.basename(file.filename);
            FS.createPath('', dir, true, true);
            var parent = FS.analyzePath(dir).object;
            LZ4.createNode(parent, name, LZ4.FILE_MODE, 0, {
              compressedData: compressedData,
              start: file.start,
              end: file.end,
            });
          });
        },createNode:function (parent, name, mode, dev, contents, mtime) {
          var node = FS.createNode(parent, name, mode);
          node.mode = mode;
          node.node_ops = LZ4.node_ops;
          node.stream_ops = LZ4.stream_ops;
          node.timestamp = (mtime || new Date).getTime();
          assert(LZ4.FILE_MODE !== LZ4.DIR_MODE);
          if (mode === LZ4.FILE_MODE) {
            node.size = contents.end - contents.start;
            node.contents = contents;
          } else {
            node.size = 4096;
            node.contents = {};
          }
          if (parent) {
            parent.contents[name] = node;
          }
          return node;
        },node_ops:{getattr:function(node) {
            return {
              dev: 1,
              ino: node.id,
              mode: node.mode,
              nlink: 1,
              uid: 0,
              gid: 0,
              rdev: undefined,
              size: node.size,
              atime: new Date(node.timestamp),
              mtime: new Date(node.timestamp),
              ctime: new Date(node.timestamp),
              blksize: 4096,
              blocks: Math.ceil(node.size / 4096),
            };
          },setattr:function(node, attr) {
            if (attr.mode !== undefined) {
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              node.timestamp = attr.timestamp;
            }
          },lookup:function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
          },mknod:function (parent, name, mode, dev) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          },rename:function (oldNode, newDir, newName) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          },unlink:function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          },rmdir:function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          },readdir:function(node) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          },symlink:function(parent, newName, oldPath) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          },readlink:function(node) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }},stream_ops:{read:function (stream, buffer, offset, length, position) {
            //console.log('LZ4 read ' + [offset, length, position]);
            length = Math.min(length, stream.node.size - position);
            if (length <= 0) return 0;
            var contents = stream.node.contents;
            var compressedData = contents.compressedData;
            var written = 0;
            while (written < length) {
              var start = contents.start + position + written; // start index in uncompressed data
              var desired = length - written;
              //console.log('current read: ' + ['start', start, 'desired', desired]);
              var chunkIndex = Math.floor(start / LZ4.CHUNK_SIZE);
              var compressedStart = compressedData['offsets'][chunkIndex];
              var compressedSize = compressedData['sizes'][chunkIndex];
              var currChunk;
              if (compressedData['successes'][chunkIndex]) {
                var found = compressedData['cachedIndexes'].indexOf(chunkIndex);
                if (found >= 0) {
                  currChunk = compressedData['cachedChunks'][found];
                } else {
                  // decompress the chunk
                  compressedData['cachedIndexes'].pop();
                  compressedData['cachedIndexes'].unshift(chunkIndex);
                  currChunk = compressedData['cachedChunks'].pop();
                  compressedData['cachedChunks'].unshift(currChunk);
                  if (compressedData['debug']) {
                    console.log('decompressing chunk ' + chunkIndex);
                    Module['decompressedChunks'] = (Module['decompressedChunks'] || 0) + 1;
                  }
                  var compressed = compressedData['data'].subarray(compressedStart, compressedStart + compressedSize);
                  //var t = Date.now();
                  var originalSize = LZ4.codec.uncompress(compressed, currChunk);
                  //console.log('decompress time: ' + (Date.now() - t));
                  if (chunkIndex < compressedData['successes'].length-1) assert(originalSize === LZ4.CHUNK_SIZE); // all but the last chunk must be full-size
                }
              } else {
                // uncompressed
                currChunk = compressedData['data'].subarray(compressedStart, compressedStart + LZ4.CHUNK_SIZE);
              }
              var startInChunk = start % LZ4.CHUNK_SIZE;
              var endInChunk = Math.min(startInChunk + desired, LZ4.CHUNK_SIZE);
              buffer.set(currChunk.subarray(startInChunk, endInChunk), offset + written);
              var currWritten = endInChunk - startInChunk;
              written += currWritten;
            }
            return written;
          },write:function (stream, buffer, offset, length, position) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          },llseek:function (stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
              position += stream.position;
            } else if (whence === 2) {
              if (FS.isFile(stream.node.mode)) {
                position += stream.node.size;
              }
            }
            if (position < 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            }
            return position;
          }}};
    var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:function(e) {
          if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
          return setErrNo(e.errno);
        },lookupPath:function(path, opts) {
          path = PATH_FS.resolve(FS.cwd(), path);
          opts = opts || {};
    
          if (!path) return { path: '', node: null };
    
          var defaults = {
            follow_mount: true,
            recurse_count: 0
          };
          for (var key in defaults) {
            if (opts[key] === undefined) {
              opts[key] = defaults[key];
            }
          }
    
          if (opts.recurse_count > 8) {  // max recursive lookup of 8
            throw new FS.ErrnoError(32);
          }
    
          // split the path
          var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
            return !!p;
          }), false);
    
          // start at the root
          var current = FS.root;
          var current_path = '/';
    
          for (var i = 0; i < parts.length; i++) {
            var islast = (i === parts.length-1);
            if (islast && opts.parent) {
              // stop resolving
              break;
            }
    
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
    
            // jump to the mount's root node if this is a mountpoint
            if (FS.isMountpoint(current)) {
              if (!islast || (islast && opts.follow_mount)) {
                current = current.mounted.root;
              }
            }
    
            // by default, lookupPath will not follow a symlink if it is the final path component.
            // setting opts.follow = true will override this behavior.
            if (!islast || opts.follow) {
              var count = 0;
              while (FS.isLink(current.mode)) {
                var link = FS.readlink(current_path);
                current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
    
                var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
                current = lookup.node;
    
                if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                  throw new FS.ErrnoError(32);
                }
              }
            }
          }
    
          return { path: current_path, node: current };
        },getPath:function(node) {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
            }
            path = path ? node.name + '/' + path : node.name;
            node = node.parent;
          }
        },hashName:function(parentid, name) {
          var hash = 0;
    
    
          for (var i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
          }
          return ((parentid + hash) >>> 0) % FS.nameTable.length;
        },hashAddNode:function(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node;
        },hashRemoveNode:function(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break;
              }
              current = current.name_next;
            }
          }
        },lookupNode:function(parent, name) {
          var errCode = FS.mayLookup(parent);
          if (errCode) {
            throw new FS.ErrnoError(errCode, parent);
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node;
            }
          }
          // if we failed to find it in the cache, call into the VFS
          return FS.lookup(parent, name);
        },createNode:function(parent, name, mode, rdev) {
          var node = new FS.FSNode(parent, name, mode, rdev);
    
          FS.hashAddNode(node);
    
          return node;
        },destroyNode:function(node) {
          FS.hashRemoveNode(node);
        },isRoot:function(node) {
          return node === node.parent;
        },isMountpoint:function(node) {
          return !!node.mounted;
        },isFile:function(mode) {
          return (mode & 61440) === 32768;
        },isDir:function(mode) {
          return (mode & 61440) === 16384;
        },isLink:function(mode) {
          return (mode & 61440) === 40960;
        },isChrdev:function(mode) {
          return (mode & 61440) === 8192;
        },isBlkdev:function(mode) {
          return (mode & 61440) === 24576;
        },isFIFO:function(mode) {
          return (mode & 61440) === 4096;
        },isSocket:function(mode) {
          return (mode & 49152) === 49152;
        },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function(str) {
          var flags = FS.flagModes[str];
          if (typeof flags === 'undefined') {
            throw new Error('Unknown file open mode: ' + str);
          }
          return flags;
        },flagsToPermissionString:function(flag) {
          var perms = ['r', 'w', 'rw'][flag & 3];
          if ((flag & 512)) {
            perms += 'w';
          }
          return perms;
        },nodePermissions:function(node, perms) {
          if (FS.ignorePermissions) {
            return 0;
          }
          // return 0 if any user, group or owner bits are set.
          if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
            return 2;
          } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
            return 2;
          } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
            return 2;
          }
          return 0;
        },mayLookup:function(dir) {
          var errCode = FS.nodePermissions(dir, 'x');
          if (errCode) return errCode;
          if (!dir.node_ops.lookup) return 2;
          return 0;
        },mayCreate:function(dir, name) {
          try {
            var node = FS.lookupNode(dir, name);
            return 20;
          } catch (e) {
          }
          return FS.nodePermissions(dir, 'wx');
        },mayDelete:function(dir, name, isdir) {
          var node;
          try {
            node = FS.lookupNode(dir, name);
          } catch (e) {
            return e.errno;
          }
          var errCode = FS.nodePermissions(dir, 'wx');
          if (errCode) {
            return errCode;
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return 54;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return 10;
            }
          } else {
            if (FS.isDir(node.mode)) {
              return 31;
            }
          }
          return 0;
        },mayOpen:function(node, flags) {
          if (!node) {
            return 44;
          }
          if (FS.isLink(node.mode)) {
            return 32;
          } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
                (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
              return 31;
            }
          }
          return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
        },MAX_OPEN_FDS:4096,nextfd:function(fd_start, fd_end) {
          fd_start = fd_start || 0;
          fd_end = fd_end || FS.MAX_OPEN_FDS;
          for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
              return fd;
            }
          }
          throw new FS.ErrnoError(33);
        },getStream:function(fd) {
          return FS.streams[fd];
        },createStream:function(stream, fd_start, fd_end) {
          if (!FS.FSStream) {
            FS.FSStream = /** @constructor */ function(){};
            FS.FSStream.prototype = {
              object: {
                get: function() { return this.node; },
                set: function(val) { this.node = val; }
              },
              isRead: {
                get: function() { return (this.flags & 2097155) !== 1; }
              },
              isWrite: {
                get: function() { return (this.flags & 2097155) !== 0; }
              },
              isAppend: {
                get: function() { return (this.flags & 1024); }
              }
            };
          }
          // clone it, so we can return an instance of FSStream
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
          var fd = FS.nextfd(fd_start, fd_end);
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream;
        },closeStream:function(fd) {
          FS.streams[fd] = null;
        },chrdev_stream_ops:{open:function(stream) {
            var device = FS.getDevice(stream.node.rdev);
            // override node's stream ops with the device's
            stream.stream_ops = device.stream_ops;
            // forward the open call
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
          },llseek:function() {
            throw new FS.ErrnoError(70);
          }},major:function(dev) {
          return ((dev) >> 8);
        },minor:function(dev) {
          return ((dev) & 0xff);
        },makedev:function(ma, mi) {
          return ((ma) << 8 | (mi));
        },registerDevice:function(dev, ops) {
          FS.devices[dev] = { stream_ops: ops };
        },getDevice:function(dev) {
          return FS.devices[dev];
        },getMounts:function(mount) {
          var mounts = [];
          var check = [mount];
    
          while (check.length) {
            var m = check.pop();
    
            mounts.push(m);
    
            check.push.apply(check, m.mounts);
          }
    
          return mounts;
        },syncfs:function(populate, callback) {
          if (typeof(populate) === 'function') {
            callback = populate;
            populate = false;
          }
    
          FS.syncFSRequests++;
    
          if (FS.syncFSRequests > 1) {
            err('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
          }
    
          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;
    
          function doCallback(errCode) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            return callback(errCode);
          }
    
          function done(errCode) {
            if (errCode) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(errCode);
              }
              return;
            }
            if (++completed >= mounts.length) {
              doCallback(null);
            }
          }  
          // sync all mounts
          mounts.forEach(function (mount) {
            if (!mount.type.syncfs) {
              return done(null);
            }
            mount.type.syncfs(mount, populate, done);
          });
        },mount:function(type, opts, mountpoint) {
          if (typeof type === 'string') {
            // The filesystem was not included, and instead we have an error
            // message stored in the variable.
            throw type;
          }
          var root = mountpoint === '/';
          var pseudo = !mountpoint;
          var node;
    
          if (root && FS.root) {
            throw new FS.ErrnoError(10);
          } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
    
            mountpoint = lookup.path;  // use the absolute path
            node = lookup.node;
    
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
    
            if (!FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
          }
    
          var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
          };
    
          // create a root node for the fs
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;
    
          if (root) {
            FS.root = mountRoot;
          } else if (node) {
            // set as a mountpoint
            node.mounted = mount;
    
            // add the new mount to the current mount's children
            if (node.mount) {
              node.mount.mounts.push(mount);
            }
          }
    
          return mountRoot;
        },unmount:function (mountpoint) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
    
          if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28);
          }
    
          // destroy the nodes for this mount, and all its child mounts
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);
    
          Object.keys(FS.nameTable).forEach(function (hash) {
            var current = FS.nameTable[hash];
    
            while (current) {
              var next = current.name_next;
    
              if (mounts.indexOf(current.mount) !== -1) {
                FS.destroyNode(current);
              }
    
              current = next;
            }
          });
    
          // no longer a mountpoint
          node.mounted = null;
    
          // remove this mount from the child mounts
          var idx = node.mount.mounts.indexOf(mount);
          assert(idx !== -1);
          node.mount.mounts.splice(idx, 1);
        },lookup:function(parent, name) {
          return parent.node_ops.lookup(parent, name);
        },mknod:function(path, mode, dev) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name || name === '.' || name === '..') {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.mayCreate(parent, name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.mknod(parent, name, mode, dev);
        },create:function(path, mode) {
          mode = mode !== undefined ? mode : 438 /* 0666 */;
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0);
        },mkdir:function(path, mode) {
          mode = mode !== undefined ? mode : 511 /* 0777 */;
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0);
        },mkdirTree:function(path, mode) {
          var dirs = path.split('/');
          var d = '';
          for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += '/' + dirs[i];
            try {
              FS.mkdir(d, mode);
            } catch(e) {
              if (e.errno != 20) throw e;
            }
          }
        },mkdev:function(path, mode, dev) {
          if (typeof(dev) === 'undefined') {
            dev = mode;
            mode = 438 /* 0666 */;
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev);
        },symlink:function(oldpath, newpath) {
          if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44);
          }
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.symlink(parent, newname, oldpath);
        },rename:function(old_path, new_path) {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          // parents must exist
          var lookup, old_dir, new_dir;
    
          // let the errors from non existant directories percolate up
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
    
          if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
          // need to be part of the same mount
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75);
          }
          // source must exist
          var old_node = FS.lookupNode(old_dir, old_name);
          // old path should not be an ancestor of the new path
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== '.') {
            throw new FS.ErrnoError(28);
          }
          // new path should not be an ancestor of the old path
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== '.') {
            throw new FS.ErrnoError(55);
          }
          // see if the new path already exists
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
            // not fatal
          }
          // early out if nothing needs to change
          if (old_node === new_node) {
            return;
          }
          // we'll need to delete the old entry
          var isdir = FS.isDir(old_node.mode);
          var errCode = FS.mayDelete(old_dir, old_name, isdir);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          // need delete permissions if we'll be overwriting.
          // need create permissions if new doesn't already exist.
          errCode = new_node ?
            FS.mayDelete(new_dir, new_name, isdir) :
            FS.mayCreate(new_dir, new_name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
            throw new FS.ErrnoError(10);
          }
          // if we are going to change the parent, check write permissions
          if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, 'w');
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          try {
            if (FS.trackingDelegate['willMovePath']) {
              FS.trackingDelegate['willMovePath'](old_path, new_path);
            }
          } catch(e) {
            err("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
          }
          // remove the node from the lookup hash
          FS.hashRemoveNode(old_node);
          // do the underlying fs rename
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
          } catch (e) {
            throw e;
          } finally {
            // add the node back to the hash (in case node_ops.rename
            // changed its name)
            FS.hashAddNode(old_node);
          }
          try {
            if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
          } catch(e) {
            err("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
          }
        },rmdir:function(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, true);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          try {
            if (FS.trackingDelegate['willDeletePath']) {
              FS.trackingDelegate['willDeletePath'](path);
            }
          } catch(e) {
            err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
          try {
            if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
          } catch(e) {
            err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
          }
        },readdir:function(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54);
          }
          return node.node_ops.readdir(node);
        },unlink:function(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, false);
          if (errCode) {
            // According to POSIX, we should map EISDIR to EPERM, but
            // we instead do what Linux does (and we must, as we use
            // the musl linux libc).
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          try {
            if (FS.trackingDelegate['willDeletePath']) {
              FS.trackingDelegate['willDeletePath'](path);
            }
          } catch(e) {
            err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
          try {
            if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
          } catch(e) {
            err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
          }
        },readlink:function(path) {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) {
            throw new FS.ErrnoError(44);
          }
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28);
          }
          return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
        },stat:function(path, dontFollow) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          var node = lookup.node;
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63);
          }
          return node.node_ops.getattr(node);
        },lstat:function(path) {
          return FS.stat(path, true);
        },chmod:function(path, mode, dontFollow) {
          var node;
          if (typeof path === 'string') {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          node.node_ops.setattr(node, {
            mode: (mode & 4095) | (node.mode & ~4095),
            timestamp: Date.now()
          });
        },lchmod:function(path, mode) {
          FS.chmod(path, mode, true);
        },fchmod:function(fd, mode) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          FS.chmod(stream.node, mode);
        },chown:function(path, uid, gid, dontFollow) {
          var node;
          if (typeof path === 'string') {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          node.node_ops.setattr(node, {
            timestamp: Date.now()
            // we ignore the uid / gid for now
          });
        },lchown:function(path, uid, gid) {
          FS.chown(path, uid, gid, true);
        },fchown:function(fd, uid, gid) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          FS.chown(stream.node, uid, gid);
        },truncate:function(path, len) {
          if (len < 0) {
            throw new FS.ErrnoError(28);
          }
          var node;
          if (typeof path === 'string') {
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.nodePermissions(node, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
          });
        },ftruncate:function(fd, len) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28);
          }
          FS.truncate(stream.node, len);
        },utime:function(path, atime, mtime) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
          });
        },open:function(path, flags, mode, fd_start, fd_end) {
          if (path === "") {
            throw new FS.ErrnoError(44);
          }
          flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
          mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
          if ((flags & 64)) {
            mode = (mode & 4095) | 32768;
          } else {
            mode = 0;
          }
          var node;
          if (typeof path === 'object') {
            node = path;
          } else {
            path = PATH.normalize(path);
            try {
              var lookup = FS.lookupPath(path, {
                follow: !(flags & 131072)
              });
              node = lookup.node;
            } catch (e) {
              // ignore
            }
          }
          // perhaps we need to create the node
          var created = false;
          if ((flags & 64)) {
            if (node) {
              // if O_CREAT and O_EXCL are set, error out if the node already exists
              if ((flags & 128)) {
                throw new FS.ErrnoError(20);
              }
            } else {
              // node doesn't exist, try to create it
              node = FS.mknod(path, mode, 0);
              created = true;
            }
          }
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          // can't truncate a device
          if (FS.isChrdev(node.mode)) {
            flags &= ~512;
          }
          // if asked only for a directory, then this must be one
          if ((flags & 65536) && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
          // check permissions, if this is not a file we just created now (it is ok to
          // create and write to a file with read-only permissions; it is read-only
          // for later use)
          if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          // do truncation if necessary
          if ((flags & 512)) {
            FS.truncate(node, 0);
          }
          // we've already handled these, don't pass down to the underlying vfs
          flags &= ~(128 | 512 | 131072);
    
          // register the stream with the filesystem
          var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),  // we want the absolute path to the node
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            // used by the file family libc calls (fopen, fwrite, ferror, etc.)
            ungotten: [],
            error: false
          }, fd_start, fd_end);
          // call the new stream's open function
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
          if (Module['logReadFiles'] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
              FS.readFiles[path] = 1;
              err("FS.trackingDelegate error on read file: " + path);
            }
          }
          try {
            if (FS.trackingDelegate['onOpenFile']) {
              var trackingFlags = 0;
              if ((flags & 2097155) !== 1) {
                trackingFlags |= FS.tracking.openFlags.READ;
              }
              if ((flags & 2097155) !== 0) {
                trackingFlags |= FS.tracking.openFlags.WRITE;
              }
              FS.trackingDelegate['onOpenFile'](path, trackingFlags);
            }
          } catch(e) {
            err("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
          }
          return stream;
        },close:function(stream) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (stream.getdents) stream.getdents = null; // free readdir state
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream);
            }
          } catch (e) {
            throw e;
          } finally {
            FS.closeStream(stream.fd);
          }
          stream.fd = null;
        },isClosed:function(stream) {
          return stream.fd === null;
        },llseek:function(stream, offset, whence) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70);
          }
          if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28);
          }
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position;
        },read:function(stream, buffer, offset, length, position) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28);
          }
          var seeking = typeof position !== 'undefined';
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead;
        },write:function(stream, buffer, offset, length, position, canOwn) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28);
          }
          if (stream.seekable && stream.flags & 1024) {
            // seek to the end before writing in append mode
            FS.llseek(stream, 0, 2);
          }
          var seeking = typeof position !== 'undefined';
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          try {
            if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
          } catch(e) {
            err("FS.trackingDelegate['onWriteToFile']('"+stream.path+"') threw an exception: " + e.message);
          }
          return bytesWritten;
        },allocate:function(stream, offset, length) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138);
          }
          stream.stream_ops.allocate(stream, offset, length);
        },mmap:function(stream, address, length, position, prot, flags) {
          // User requests writing to file (prot & PROT_WRITE != 0).
          // Checking if we have permissions to write to the file unless
          // MAP_PRIVATE flag is set. According to POSIX spec it is possible
          // to write to file opened in read-only mode with MAP_PRIVATE flag,
          // as all modifications will be visible only in the memory of
          // the current process.
          if ((prot & 2) !== 0
              && (flags & 2) === 0
              && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2);
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43);
          }
          return stream.stream_ops.mmap(stream, address, length, position, prot, flags);
        },msync:function(stream, buffer, offset, length, mmapFlags) {
          if (!stream || !stream.stream_ops.msync) {
            return 0;
          }
          return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
        },munmap:function(stream) {
          return 0;
        },ioctl:function(stream, cmd, arg) {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59);
          }
          return stream.stream_ops.ioctl(stream, cmd, arg);
        },readFile:function(path, opts) {
          opts = opts || {};
          opts.flags = opts.flags || 'r';
          opts.encoding = opts.encoding || 'binary';
          if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
            throw new Error('Invalid encoding type "' + opts.encoding + '"');
          }
          var ret;
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === 'utf8') {
            ret = UTF8ArrayToString(buf, 0);
          } else if (opts.encoding === 'binary') {
            ret = buf;
          }
          FS.close(stream);
          return ret;
        },writeFile:function(path, data, opts) {
          opts = opts || {};
          opts.flags = opts.flags || 'w';
          var stream = FS.open(path, opts.flags, opts.mode);
          if (typeof data === 'string') {
            var buf = new Uint8Array(lengthBytesUTF8(data)+1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
          } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
          } else {
            throw new Error('Unsupported data type');
          }
          FS.close(stream);
        },cwd:function() {
          return FS.currentPath;
        },chdir:function(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          if (lookup.node === null) {
            throw new FS.ErrnoError(44);
          }
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54);
          }
          var errCode = FS.nodePermissions(lookup.node, 'x');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          FS.currentPath = lookup.path;
        },createDefaultDirectories:function() {
          FS.mkdir('/tmp');
          FS.mkdir('/home');
          FS.mkdir('/home/web_user');
        },createDefaultDevices:function() {
          // create /dev
          FS.mkdir('/dev');
          // setup /dev/null
          FS.registerDevice(FS.makedev(1, 3), {
            read: function() { return 0; },
            write: function(stream, buffer, offset, length, pos) { return length; }
          });
          FS.mkdev('/dev/null', FS.makedev(1, 3));
          // setup /dev/tty and /dev/tty1
          // stderr needs to print output using Module['printErr']
          // so we register a second tty just for it.
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev('/dev/tty', FS.makedev(5, 0));
          FS.mkdev('/dev/tty1', FS.makedev(6, 0));
          // setup /dev/[u]random
          var random_device = getRandomDevice();
          FS.createDevice('/dev', 'random', random_device);
          FS.createDevice('/dev', 'urandom', random_device);
          // we're not going to emulate the actual shm device,
          // just create the tmp dirs that reside in it commonly
          FS.mkdir('/dev/shm');
          FS.mkdir('/dev/shm/tmp');
        },createSpecialDirectories:function() {
          // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the name of the stream for fd 6 (see test_unistd_ttyname)
          FS.mkdir('/proc');
          FS.mkdir('/proc/self');
          FS.mkdir('/proc/self/fd');
          FS.mount({
            mount: function() {
              var node = FS.createNode('/proc/self', 'fd', 16384 | 511 /* 0777 */, 73);
              node.node_ops = {
                lookup: function(parent, name) {
                  var fd = +name;
                  var stream = FS.getStream(fd);
                  if (!stream) throw new FS.ErrnoError(8);
                  var ret = {
                    parent: null,
                    mount: { mountpoint: 'fake' },
                    node_ops: { readlink: function() { return stream.path } }
                  };
                  ret.parent = ret; // make it look like a simple root node
                  return ret;
                }
              };
              return node;
            }
          }, {}, '/proc/self/fd');
        },createStandardStreams:function() {
          // TODO deprecate the old functionality of a single
          // input / output callback and that utilizes FS.createDevice
          // and instead require a unique set of stream ops
    
          // by default, we symlink the standard streams to the
          // default tty devices. however, if the standard streams
          // have been overwritten we create a unique device for
          // them instead.
          if (Module['stdin']) {
            FS.createDevice('/dev', 'stdin', Module['stdin']);
          } else {
            FS.symlink('/dev/tty', '/dev/stdin');
          }
          if (Module['stdout']) {
            FS.createDevice('/dev', 'stdout', null, Module['stdout']);
          } else {
            FS.symlink('/dev/tty', '/dev/stdout');
          }
          if (Module['stderr']) {
            FS.createDevice('/dev', 'stderr', null, Module['stderr']);
          } else {
            FS.symlink('/dev/tty1', '/dev/stderr');
          }
    
          // open default streams for the stdin, stdout and stderr devices
          var stdin = FS.open('/dev/stdin', 'r');
          var stdout = FS.open('/dev/stdout', 'w');
          var stderr = FS.open('/dev/stderr', 'w');
          assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
          assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
          assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
        },ensureErrnoError:function() {
          if (FS.ErrnoError) return;
          FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = /** @this{Object} */ function(errno) {
              this.errno = errno;
              for (var key in ERRNO_CODES) {
                if (ERRNO_CODES[key] === errno) {
                  this.code = key;
                  break;
                }
              }
            };
            this.setErrno(errno);
            this.message = ERRNO_MESSAGES[errno];
    
            // Try to get a maximally helpful stack trace. On Node.js, getting Error.stack
            // now ensures it shows what we want.
            if (this.stack) {
              // Define the stack property for Node.js 4, which otherwise errors on the next line.
              Object.defineProperty(this, "stack", { value: (new Error).stack, writable: true });
              this.stack = demangleAll(this.stack);
            }
          };
          FS.ErrnoError.prototype = new Error();
          FS.ErrnoError.prototype.constructor = FS.ErrnoError;
          // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
          [44].forEach(function(code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = '<generic error, no stack>';
          });
        },staticInit:function() {
          FS.ensureErrnoError();
    
          FS.nameTable = new Array(4096);
    
          FS.mount(MEMFS, {}, '/');
    
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();
    
          FS.filesystems = {
            'MEMFS': MEMFS,
          };
        },init:function(input, output, error) {
          assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
          FS.init.initialized = true;
    
          FS.ensureErrnoError();
    
          // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
          Module['stdin'] = input || Module['stdin'];
          Module['stdout'] = output || Module['stdout'];
          Module['stderr'] = error || Module['stderr'];
    
          FS.createStandardStreams();
        },quit:function() {
          FS.init.initialized = false;
          // force-flush all streams, so we get musl std streams printed out
          var fflush = Module['_fflush'];
          if (fflush) fflush(0);
          // close all of our streams
          for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
              continue;
            }
            FS.close(stream);
          }
        },getMode:function(canRead, canWrite) {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode;
        },findObject:function(path, dontResolveLastLink) {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (ret.exists) {
            return ret.object;
          } else {
            setErrNo(ret.error);
            return null;
          }
        },analyzePath:function(path, dontResolveLastLink) {
          // operate from within the context of the symlink's target
          try {
            var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
          } catch (e) {
          }
          var ret = {
            isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
            parentExists: false, parentPath: null, parentObject: null
          };
          try {
            var lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === '/';
          } catch (e) {
            ret.error = e.errno;
          }        return ret;
        },createPath:function(parent, path, canRead, canWrite) {
          parent = typeof parent === 'string' ? parent : FS.getPath(parent);
          var parts = path.split('/').reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current);
            } catch (e) {
              // ignore EEXIST
            }
            parent = current;
          }
          return current;
        },createFile:function(parent, name, properties, canRead, canWrite) {
          var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(canRead, canWrite);
          return FS.create(path, mode);
        },createDataFile:function(parent, name, data, canRead, canWrite, canOwn) {
          var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
          var mode = FS.getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            if (typeof data === 'string') {
              var arr = new Array(data.length);
              for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
              data = arr;
            }
            // make sure we can write to the file
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 'w');
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
          }
          return node;
        },createDevice:function(parent, name, input, output) {
          var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(!!input, !!output);
          if (!FS.createDevice.major) FS.createDevice.major = 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          // Create a fake device that a set of stream ops to emulate
          // the old behavior.
          FS.registerDevice(dev, {
            open: function(stream) {
              stream.seekable = false;
            },
            close: function(stream) {
              // flush any pending line data
              if (output && output.buffer && output.buffer.length) {
                output(10);
              }
            },
            read: function(stream, buffer, offset, length, pos /* ignored */) {
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = input();
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === undefined && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset+i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write: function(stream, buffer, offset, length, pos) {
              for (var i = 0; i < length; i++) {
                try {
                  output(buffer[offset+i]);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            }
          });
          return FS.mkdev(path, mode, dev);
        },forceLoadFile:function(obj) {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          var success = true;
          if (typeof XMLHttpRequest !== 'undefined') {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          } else if (read_) {
            // Command-line.
            try {
              // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
              //          read() will try to parse UTF8.
              obj.contents = intArrayFromString(read_(obj.url), true);
              obj.usedBytes = obj.contents.length;
            } catch (e) {
              success = false;
            }
          } else {
            throw new Error('Cannot load without read() or XMLHttpRequest.');
          }
          if (!success) setErrNo(29);
          return success;
        },createLazyFile:function(parent, name, url, canRead, canWrite) {
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          /** @constructor */
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = /** @this{Object} */ function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize)|0;
            return this.getter(chunkNum)[chunkOffset];
          };
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          };
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
    
            var chunkSize = 1024*1024; // Chunk size in bytes
    
            if (!hasByteServing) chunkSize = datalength;
    
            // Function to get a range from the remote URL.
            var doXHR = (function(from, to) {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
    
              // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
    
              // Some hints to the browser that we want binary data.
              if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }
    
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
              } else {
                return intArrayFromString(xhr.responseText || '', true);
              }
            });
            var lazyArray = this;
            lazyArray.setDataGetter(function(chunkNum) {
              var start = chunkNum * chunkSize;
              var end = (chunkNum+1) * chunkSize - 1; // including this byte
              end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
              if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
              return lazyArray.chunks[chunkNum];
            });
    
            if (usesGzip || !datalength) {
              // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
              chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }
    
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          };
          if (typeof XMLHttpRequest !== 'undefined') {
            if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
            var lazyArray = new LazyUint8Array();
            Object.defineProperties(lazyArray, {
              length: {
                get: /** @this{Object} */ function() {
                  if(!this.lengthKnown) {
                    this.cacheLength();
                  }
                  return this._length;
                }
              },
              chunkSize: {
                get: /** @this{Object} */ function() {
                  if(!this.lengthKnown) {
                    this.cacheLength();
                  }
                  return this._chunkSize;
                }
              }
            });
    
            var properties = { isDevice: false, contents: lazyArray };
          } else {
            var properties = { isDevice: false, url: url };
          }
    
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          // This is a total hack, but I want to get this lazy file code out of the
          // core of MEMFS. If we want to keep this lazy file concept I feel it should
          // be its own thin LAZYFS proxying calls to MEMFS.
          if (properties.contents) {
            node.contents = properties.contents;
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
          }
          // Add a function that defers querying the file size until it is asked the first time.
          Object.defineProperties(node, {
            usedBytes: {
              get: /** @this {FSNode} */ function() { return this.contents.length; }
            }
          });
          // override each stream op with one that tries to force load the lazy file first
          var stream_ops = {};
          var keys = Object.keys(node.stream_ops);
          keys.forEach(function(key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
              if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(29);
              }
              return fn.apply(null, arguments);
            };
          });
          // use a custom read function
          stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(29);
            }
            var contents = stream.node.contents;
            if (position >= contents.length)
              return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) { // normal array
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i];
              }
            } else {
              for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
                buffer[offset + i] = contents.get(position + i);
              }
            }
            return size;
          };
          node.stream_ops = stream_ops;
          return node;
        },createPreloadedFile:function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
          Browser.init(); // XXX perhaps this method should move onto Browser?
          // TODO we should allow people to just pass in a complete filename instead
          // of parent and name being that we just join them anyways
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
          function processData(byteArray) {
            function finish(byteArray) {
              if (preFinish) preFinish();
              if (!dontCreateFile) {
                FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
              }
              if (onload) onload();
              removeRunDependency(dep);
            }
            var handled = false;
            Module['preloadPlugins'].forEach(function(plugin) {
              if (handled) return;
              if (plugin['canHandle'](fullname)) {
                plugin['handle'](byteArray, fullname, finish, function() {
                  if (onerror) onerror();
                  removeRunDependency(dep);
                });
                handled = true;
              }
            });
            if (!handled) finish(byteArray);
          }
          addRunDependency(dep);
          if (typeof url == 'string') {
            Browser.asyncLoad(url, function(byteArray) {
              processData(byteArray);
            }, onerror);
          } else {
            processData(url);
          }
        },indexedDB:function() {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        },DB_NAME:function() {
          return 'EM_FS_' + window.location.pathname;
        },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function(paths, onload, onerror) {
          onload = onload || function(){};
          onerror = onerror || function(){};
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            out('creating db');
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME);
          };
          openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
              if (fail == 0) onload(); else onerror();
            }
            paths.forEach(function(path) {
              var putRequest = files.put(FS.analyzePath(path).object.contents, path);
              putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish(); };
              putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish(); };
            });
            transaction.onerror = onerror;
          };
          openRequest.onerror = onerror;
        },loadFilesFromDB:function(paths, onload, onerror) {
          onload = onload || function(){};
          onerror = onerror || function(){};
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          openRequest.onupgradeneeded = onerror; // no database to load from
          openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
              var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
            } catch(e) {
              onerror(e);
              return;
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
              if (fail == 0) onload(); else onerror();
            }
            paths.forEach(function(path) {
              var getRequest = files.get(path);
              getRequest.onsuccess = function getRequest_onsuccess() {
                if (FS.analyzePath(path).exists) {
                  FS.unlink(path);
                }
                FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                ok++;
                if (ok + fail == total) finish();
              };
              getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish(); };
            });
            transaction.onerror = onerror;
          };
          openRequest.onerror = onerror;
        },absolutePath:function() {
          abort('FS.absolutePath has been removed; use PATH_FS.resolve instead');
        },createFolder:function() {
          abort('FS.createFolder has been removed; use FS.mkdir instead');
        },createLink:function() {
          abort('FS.createLink has been removed; use FS.symlink instead');
        },joinPath:function() {
          abort('FS.joinPath has been removed; use PATH.join instead');
        },mmapAlloc:function() {
          abort('FS.mmapAlloc has been replaced by the top level function mmapAlloc');
        },standardizePath:function() {
          abort('FS.standardizePath has been removed; use PATH.normalize instead');
        }};
    var SYSCALLS={mappings:{},DEFAULT_POLLMASK:5,umask:511,calculateAt:function(dirfd, path) {
          if (path[0] !== '/') {
            // relative path
            var dir;
            if (dirfd === -100) {
              dir = FS.cwd();
            } else {
              var dirstream = FS.getStream(dirfd);
              if (!dirstream) throw new FS.ErrnoError(8);
              dir = dirstream.path;
            }
            path = PATH.join2(dir, path);
          }
          return path;
        },doStat:function(func, path, buf) {
          try {
            var stat = func(path);
          } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
              // an error occurred while trying to look up the path; we should just report ENOTDIR
              return -54;
            }
            throw e;
          }
          HEAP32[((buf)>>2)]=stat.dev;
          HEAP32[(((buf)+(4))>>2)]=0;
          HEAP32[(((buf)+(8))>>2)]=stat.ino;
          HEAP32[(((buf)+(12))>>2)]=stat.mode;
          HEAP32[(((buf)+(16))>>2)]=stat.nlink;
          HEAP32[(((buf)+(20))>>2)]=stat.uid;
          HEAP32[(((buf)+(24))>>2)]=stat.gid;
          HEAP32[(((buf)+(28))>>2)]=stat.rdev;
          HEAP32[(((buf)+(32))>>2)]=0;
          (tempI64 = [stat.size>>>0,(tempDouble=stat.size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(40))>>2)]=tempI64[0],HEAP32[(((buf)+(44))>>2)]=tempI64[1]);
          HEAP32[(((buf)+(48))>>2)]=4096;
          HEAP32[(((buf)+(52))>>2)]=stat.blocks;
          HEAP32[(((buf)+(56))>>2)]=(stat.atime.getTime() / 1000)|0;
          HEAP32[(((buf)+(60))>>2)]=0;
          HEAP32[(((buf)+(64))>>2)]=(stat.mtime.getTime() / 1000)|0;
          HEAP32[(((buf)+(68))>>2)]=0;
          HEAP32[(((buf)+(72))>>2)]=(stat.ctime.getTime() / 1000)|0;
          HEAP32[(((buf)+(76))>>2)]=0;
          (tempI64 = [stat.ino>>>0,(tempDouble=stat.ino,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(80))>>2)]=tempI64[0],HEAP32[(((buf)+(84))>>2)]=tempI64[1]);
          return 0;
        },doMsync:function(addr, stream, len, flags, offset) {
          var buffer = HEAPU8.slice(addr, addr + len);
          FS.msync(stream, buffer, offset, len, flags);
        },doMkdir:function(path, mode) {
          // remove a trailing slash, if one - /a/b/ has basename of '', but
          // we want to create b in the context of this function
          path = PATH.normalize(path);
          if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
          FS.mkdir(path, mode, 0);
          return 0;
        },doMknod:function(path, mode, dev) {
          // we don't want this in the JS API as it uses mknod to create all nodes.
          switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
              break;
            default: return -28;
          }
          FS.mknod(path, mode, dev);
          return 0;
        },doReadlink:function(path, buf, bufsize) {
          if (bufsize <= 0) return -28;
          var ret = FS.readlink(path);
    
          var len = Math.min(bufsize, lengthBytesUTF8(ret));
          var endChar = HEAP8[buf+len];
          stringToUTF8(ret, buf, bufsize+1);
          // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
          // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
          HEAP8[buf+len] = endChar;
    
          return len;
        },doAccess:function(path, amode) {
          if (amode & ~7) {
            // need a valid mode
            return -28;
          }
          var node;
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
          if (!node) {
            return -44;
          }
          var perms = '';
          if (amode & 4) perms += 'r';
          if (amode & 2) perms += 'w';
          if (amode & 1) perms += 'x';
          if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
            return -2;
          }
          return 0;
        },doDup:function(path, flags, suggestFD) {
          var suggest = FS.getStream(suggestFD);
          if (suggest) FS.close(suggest);
          return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
        },doReadv:function(stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(((iov)+(i*8))>>2)];
            var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
            var curr = FS.read(stream, HEAP8,ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break; // nothing more to read
          }
          return ret;
        },doWritev:function(stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(((iov)+(i*8))>>2)];
            var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
            var curr = FS.write(stream, HEAP8,ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
          }
          return ret;
        },varargs:undefined,get:function() {
          assert(SYSCALLS.varargs != undefined);
          SYSCALLS.varargs += 4;
          var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
          return ret;
        },getStr:function(ptr) {
          var ret = UTF8ToString(ptr);
          return ret;
        },getStreamFromFD:function(fd) {
          var stream = FS.getStream(fd);
          if (!stream) throw new FS.ErrnoError(8);
          return stream;
        },get64:function(low, high) {
          if (low >= 0) assert(high === 0);
          else assert(high === -1);
          return low;
        }};
    function ___sys_access(path, amode) {try {
    
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doAccess(path, amode);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_chmod(path, mode) {try {
    
        path = SYSCALLS.getStr(path);
        FS.chmod(path, mode);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_fchmod(fd, mode) {try {
    
        FS.fchmod(fd, mode);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_fcntl64(fd, cmd, varargs) {SYSCALLS.varargs = varargs;
    try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (cmd) {
          case 0: {
            var arg = SYSCALLS.get();
            if (arg < 0) {
              return -28;
            }
            var newStream;
            newStream = FS.open(stream.path, stream.flags, 0, arg);
            return newStream.fd;
          }
          case 1:
          case 2:
            return 0;  // FD_CLOEXEC makes no sense for a single process.
          case 3:
            return stream.flags;
          case 4: {
            var arg = SYSCALLS.get();
            stream.flags |= arg;
            return 0;
          }
          case 12:
          /* case 12: Currently in musl F_GETLK64 has same value as F_GETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */ {
            
            var arg = SYSCALLS.get();
            var offset = 0;
            // We're always unlocked.
            HEAP16[(((arg)+(offset))>>1)]=2;
            return 0;
          }
          case 13:
          case 14:
          /* case 13: Currently in musl F_SETLK64 has same value as F_SETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
          /* case 14: Currently in musl F_SETLKW64 has same value as F_SETLKW, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
            
            
            return 0; // Pretend that the locking is successful.
          case 16:
          case 8:
            return -28; // These are for sockets. We don't have them fully implemented yet.
          case 9:
            // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fnctl() returns that, and we set errno ourselves.
            setErrNo(28);
            return -1;
          default: {
            return -28;
          }
        }
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_fstat64(fd, buf) {try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        return SYSCALLS.doStat(FS.stat, stream.path, buf);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_ftruncate64(fd, zero, low, high) {try {
    
        var length = SYSCALLS.get64(low, high);
        FS.ftruncate(fd, length);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_getcwd(buf, size) {try {
    
        if (size === 0) return -28;
        var cwd = FS.cwd();
        var cwdLengthInBytes = lengthBytesUTF8(cwd);
        if (size < cwdLengthInBytes + 1) return -68;
        stringToUTF8(cwd, buf, size);
        return buf;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_getdents64(fd, dirp, count) {try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (!stream.getdents) {
          stream.getdents = FS.readdir(stream.path);
        }
    
        var struct_size = 280;
        var pos = 0;
        var off = FS.llseek(stream, 0, 1);
    
        var idx = Math.floor(off / struct_size);
    
        while (idx < stream.getdents.length && pos + struct_size <= count) {
          var id;
          var type;
          var name = stream.getdents[idx];
          if (name[0] === '.') {
            id = 1;
            type = 4; // DT_DIR
          } else {
            var child = FS.lookupNode(stream.node, name);
            id = child.id;
            type = FS.isChrdev(child.mode) ? 2 :  // DT_CHR, character device.
                   FS.isDir(child.mode) ? 4 :     // DT_DIR, directory.
                   FS.isLink(child.mode) ? 10 :   // DT_LNK, symbolic link.
                   8;                             // DT_REG, regular file.
          }
          (tempI64 = [id>>>0,(tempDouble=id,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((dirp + pos)>>2)]=tempI64[0],HEAP32[(((dirp + pos)+(4))>>2)]=tempI64[1]);
          (tempI64 = [(idx + 1) * struct_size>>>0,(tempDouble=(idx + 1) * struct_size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((dirp + pos)+(8))>>2)]=tempI64[0],HEAP32[(((dirp + pos)+(12))>>2)]=tempI64[1]);
          HEAP16[(((dirp + pos)+(16))>>1)]=280;
          HEAP8[(((dirp + pos)+(18))>>0)]=type;
          stringToUTF8(name, dirp + pos + 19, 256);
          pos += struct_size;
          idx += 1;
        }
        FS.llseek(stream, idx * struct_size, 0);
        return pos;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_getegid32() {
        return 0;
      }
    function ___sys_geteuid32(
    ) {
    return ___sys_getegid32();
    }

    function ___sys_getpid() {
        return 42;
      }

    function ___sys_getuid32(
    ) {
    return ___sys_getegid32();
    }

    function ___sys_ioctl(fd, op, varargs) {SYSCALLS.varargs = varargs;
    try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (op) {
          case 21509:
          case 21505: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21510:
          case 21511:
          case 21512:
          case 21506:
          case 21507:
          case 21508: {
            if (!stream.tty) return -59;
            return 0; // no-op, not actually adjusting terminal settings
          }
          case 21519: {
            if (!stream.tty) return -59;
            var argp = SYSCALLS.get();
            HEAP32[((argp)>>2)]=0;
            return 0;
          }
          case 21520: {
            if (!stream.tty) return -59;
            return -28; // not supported
          }
          case 21531: {
            var argp = SYSCALLS.get();
            return FS.ioctl(stream, op, argp);
          }
          case 21523: {
            // TODO: in theory we should write to the winsize struct that gets
            // passed in, but for now musl doesn't read anything on it
            if (!stream.tty) return -59;
            return 0;
          }
          case 21524: {
            // TODO: technically, this ioctl call should change the window size.
            // but, since emscripten doesn't have any concept of a terminal window
            // yet, we'll just silently throw it away as we do TIOCGWINSZ
            if (!stream.tty) return -59;
            return 0;
          }
          default: abort('bad ioctl syscall ' + op);
        }
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_link(oldpath, newpath) {
        return -34; // no hardlinks for us
      }

    function ___sys_lstat64(path, buf) {try {
    
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.lstat, path, buf);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_mkdir(path, mode) {try {
    
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doMkdir(path, mode);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function syscallMmap2(addr, len, prot, flags, fd, off) {
        off <<= 12; // undo pgoffset
        var ptr;
        var allocated = false;
    
        // addr argument must be page aligned if MAP_FIXED flag is set.
        if ((flags & 16) !== 0 && (addr % 16384) !== 0) {
          return -28;
        }
    
        // MAP_ANONYMOUS (aka MAP_ANON) isn't actually defined by POSIX spec,
        // but it is widely used way to allocate memory pages on Linux, BSD and Mac.
        // In this case fd argument is ignored.
        if ((flags & 32) !== 0) {
          ptr = _memalign(16384, len);
          if (!ptr) return -48;
          _memset(ptr, 0, len);
          allocated = true;
        } else {
          var info = FS.getStream(fd);
          if (!info) return -8;
          var res = FS.mmap(info, addr, len, off, prot, flags);
          ptr = res.ptr;
          allocated = res.allocated;
        }
        SYSCALLS.mappings[ptr] = { malloc: ptr, len: len, allocated: allocated, fd: fd, prot: prot, flags: flags, offset: off };
        return ptr;
      }
    function ___sys_mmap2(addr, len, prot, flags, fd, off) {try {
    
        return syscallMmap2(addr, len, prot, flags, fd, off);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function syscallMunmap(addr, len) {
        if ((addr | 0) === -1 || len === 0) {
          return -28;
        }
        // TODO: support unmmap'ing parts of allocations
        var info = SYSCALLS.mappings[addr];
        if (!info) return 0;
        if (len === info.len) {
          var stream = FS.getStream(info.fd);
          if (info.prot & 2) {
            SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset);
          }
          SYSCALLS.mappings[addr] = null;
          if (info.allocated) {
            _free(info.malloc);
          }
        }
        return 0;
      }
    function ___sys_munmap(addr, len) {try {
    
        return syscallMunmap(addr, len);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_open(path, flags, varargs) {SYSCALLS.varargs = varargs;
    try {
    
        var pathname = SYSCALLS.getStr(path);
        var mode = SYSCALLS.get();
        var stream = FS.open(pathname, flags, mode);
        return stream.fd;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_poll(fds, nfds, timeout) {try {
    
        var nonzero = 0;
        for (var i = 0; i < nfds; i++) {
          var pollfd = fds + 8 * i;
          var fd = HEAP32[((pollfd)>>2)];
          var events = HEAP16[(((pollfd)+(4))>>1)];
          var mask = 32;
          var stream = FS.getStream(fd);
          if (stream) {
            mask = SYSCALLS.DEFAULT_POLLMASK;
            if (stream.stream_ops.poll) {
              mask = stream.stream_ops.poll(stream);
            }
          }
          mask &= events | 8 | 16;
          if (mask) nonzero++;
          HEAP16[(((pollfd)+(6))>>1)]=mask;
        }
        return nonzero;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_read(fd, buf, count) {try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        return FS.read(stream, HEAP8,buf, count);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_readlink(path, buf, bufsize) {try {
    
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doReadlink(path, buf, bufsize);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_rename(old_path, new_path) {try {
    
        old_path = SYSCALLS.getStr(old_path);
        new_path = SYSCALLS.getStr(new_path);
        FS.rename(old_path, new_path);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_rmdir(path) {try {
    
        path = SYSCALLS.getStr(path);
        FS.rmdir(path);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_stat64(path, buf) {try {
    
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.stat, path, buf);
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_symlink(target, linkpath) {try {
    
        target = SYSCALLS.getStr(target);
        linkpath = SYSCALLS.getStr(linkpath);
        FS.symlink(target, linkpath);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_truncate64(path, zero, low, high) {try {
    
        path = SYSCALLS.getStr(path);
        var length = SYSCALLS.get64(low, high);
        FS.truncate(path, length);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_uname(buf) {try {
    
        if (!buf) return -21
        var layout = {"__size__":390,"sysname":0,"nodename":65,"release":130,"version":195,"machine":260,"domainname":325};
        var copyString = function(element, value) {
          var offset = layout[element];
          writeAsciiToMemory(value, buf + offset);
        };
        copyString('sysname', 'Emscripten');
        copyString('nodename', 'emscripten');
        copyString('release', '1.0');
        copyString('version', '#1');
        copyString('machine', 'x86-JS');
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_unlink(path) {try {
    
        path = SYSCALLS.getStr(path);
        FS.unlink(path);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function ___sys_utimensat(dirfd, path, times, flags) {try {
    
        path = SYSCALLS.getStr(path);
        assert(flags === 0);
        path = SYSCALLS.calculateAt(dirfd, path);
        var seconds = HEAP32[((times)>>2)];
        var nanoseconds = HEAP32[(((times)+(4))>>2)];
        var atime = (seconds*1000) + (nanoseconds/(1000*1000));
        times += 8;
        seconds = HEAP32[((times)>>2)];
        nanoseconds = HEAP32[(((times)+(4))>>2)];
        var mtime = (seconds*1000) + (nanoseconds/(1000*1000));
        FS.utime(path, atime, mtime);
        return 0;  
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
    }

    function getShiftFromSize(size) {
        switch (size) {
            case 1: return 0;
            case 2: return 1;
            case 4: return 2;
            case 8: return 3;
            default:
                throw new TypeError('Unknown type size: ' + size);
        }
      }
    
    function embind_init_charCodes() {
        var codes = new Array(256);
        for (var i = 0; i < 256; ++i) {
            codes[i] = String.fromCharCode(i);
        }
        embind_charCodes = codes;
      }
    var embind_charCodes=undefined;
    function readLatin1String(ptr) {
        var ret = "";
        var c = ptr;
        while (HEAPU8[c]) {
            ret += embind_charCodes[HEAPU8[c++]];
        }
        return ret;
      }
    
    var awaitingDependencies={};
    
    var registeredTypes={};
    
    var typeDependencies={};
    
    var char_0=48;
    
    var char_9=57;
    function makeLegalFunctionName(name) {
        if (undefined === name) {
            return '_unknown';
        }
        name = name.replace(/[^a-zA-Z0-9_]/g, '$');
        var f = name.charCodeAt(0);
        if (f >= char_0 && f <= char_9) {
            return '_' + name;
        } else {
            return name;
        }
      }
    function createNamedFunction(name, body) {
        name = makeLegalFunctionName(name);
        /*jshint evil:true*/
        return new Function(
            "body",
            "return function " + name + "() {\n" +
            "    \"use strict\";" +
            "    return body.apply(this, arguments);\n" +
            "};\n"
        )(body);
      }
    function extendError(baseErrorType, errorName) {
        var errorClass = createNamedFunction(errorName, function(message) {
            this.name = errorName;
            this.message = message;
    
            var stack = (new Error(message)).stack;
            if (stack !== undefined) {
                this.stack = this.toString() + '\n' +
                    stack.replace(/^Error(:[^\n]*)?\n/, '');
            }
        });
        errorClass.prototype = Object.create(baseErrorType.prototype);
        errorClass.prototype.constructor = errorClass;
        errorClass.prototype.toString = function() {
            if (this.message === undefined) {
                return this.name;
            } else {
                return this.name + ': ' + this.message;
            }
        };
    
        return errorClass;
      }
    var BindingError=undefined;
    function throwBindingError(message) {
        throw new BindingError(message);
      }
    
    var InternalError=undefined;
    function throwInternalError(message) {
        throw new InternalError(message);
      }
    function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
        myTypes.forEach(function(type) {
            typeDependencies[type] = dependentTypes;
        });
    
        function onComplete(typeConverters) {
            var myTypeConverters = getTypeConverters(typeConverters);
            if (myTypeConverters.length !== myTypes.length) {
                throwInternalError('Mismatched type converter count');
            }
            for (var i = 0; i < myTypes.length; ++i) {
                registerType(myTypes[i], myTypeConverters[i]);
            }
        }
    
        var typeConverters = new Array(dependentTypes.length);
        var unregisteredTypes = [];
        var registered = 0;
        dependentTypes.forEach(function(dt, i) {
            if (registeredTypes.hasOwnProperty(dt)) {
                typeConverters[i] = registeredTypes[dt];
            } else {
                unregisteredTypes.push(dt);
                if (!awaitingDependencies.hasOwnProperty(dt)) {
                    awaitingDependencies[dt] = [];
                }
                awaitingDependencies[dt].push(function() {
                    typeConverters[i] = registeredTypes[dt];
                    ++registered;
                    if (registered === unregisteredTypes.length) {
                        onComplete(typeConverters);
                    }
                });
            }
        });
        if (0 === unregisteredTypes.length) {
            onComplete(typeConverters);
        }
      }
    /** @param {Object=} options */
    function registerType(rawType, registeredInstance, options) {
        options = options || {};
    
        if (!('argPackAdvance' in registeredInstance)) {
            throw new TypeError('registerType registeredInstance requires argPackAdvance');
        }
    
        var name = registeredInstance.name;
        if (!rawType) {
            throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
        }
        if (registeredTypes.hasOwnProperty(rawType)) {
            if (options.ignoreDuplicateRegistrations) {
                return;
            } else {
                throwBindingError("Cannot register type '" + name + "' twice");
            }
        }
    
        registeredTypes[rawType] = registeredInstance;
        delete typeDependencies[rawType];
    
        if (awaitingDependencies.hasOwnProperty(rawType)) {
            var callbacks = awaitingDependencies[rawType];
            delete awaitingDependencies[rawType];
            callbacks.forEach(function(cb) {
                cb();
            });
        }
      }
    function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
        var shift = getShiftFromSize(size);
    
        name = readLatin1String(name);
        registerType(rawType, {
            name: name,
            'fromWireType': function(wt) {
                // ambiguous emscripten ABI: sometimes return values are
                // true or false, and sometimes integers (0 or 1)
                return !!wt;
            },
            'toWireType': function(destructors, o) {
                return o ? trueValue : falseValue;
            },
            'argPackAdvance': 8,
            'readValueFromPointer': function(pointer) {
                // TODO: if heap is fixed (like in asm.js) this could be executed outside
                var heap;
                if (size === 1) {
                    heap = HEAP8;
                } else if (size === 2) {
                    heap = HEAP16;
                } else if (size === 4) {
                    heap = HEAP32;
                } else {
                    throw new TypeError("Unknown boolean type size: " + name);
                }
                return this['fromWireType'](heap[pointer >> shift]);
            },
            destructorFunction: null, // This type does not need a destructor
        });
      }

    var emval_free_list=[];
    
    var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];
    function __emval_decref(handle) {
        if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
            emval_handle_array[handle] = undefined;
            emval_free_list.push(handle);
        }
      }
    
    function count_emval_handles() {
        var count = 0;
        for (var i = 5; i < emval_handle_array.length; ++i) {
            if (emval_handle_array[i] !== undefined) {
                ++count;
            }
        }
        return count;
      }
    
    function get_first_emval() {
        for (var i = 5; i < emval_handle_array.length; ++i) {
            if (emval_handle_array[i] !== undefined) {
                return emval_handle_array[i];
            }
        }
        return null;
      }
    function init_emval() {
        Module['count_emval_handles'] = count_emval_handles;
        Module['get_first_emval'] = get_first_emval;
      }
    function __emval_register(value) {
    
        switch(value){
          case undefined :{ return 1; }
          case null :{ return 2; }
          case true :{ return 3; }
          case false :{ return 4; }
          default:{
            var handle = emval_free_list.length ?
                emval_free_list.pop() :
                emval_handle_array.length;
    
            emval_handle_array[handle] = {refcount: 1, value: value};
            return handle;
            }
          }
      }
    
    function simpleReadValueFromPointer(pointer) {
        return this['fromWireType'](HEAPU32[pointer >> 2]);
      }
    function __embind_register_emval(rawType, name) {
        name = readLatin1String(name);
        registerType(rawType, {
            name: name,
            'fromWireType': function(handle) {
                var rv = emval_handle_array[handle].value;
                __emval_decref(handle);
                return rv;
            },
            'toWireType': function(destructors, value) {
                return __emval_register(value);
            },
            'argPackAdvance': 8,
            'readValueFromPointer': simpleReadValueFromPointer,
            destructorFunction: null, // This type does not need a destructor
    
            // TODO: do we need a deleteObject here?  write a test where
            // emval is passed into JS via an interface
        });
      }

    function _embind_repr(v) {
        if (v === null) {
            return 'null';
        }
        var t = typeof v;
        if (t === 'object' || t === 'array' || t === 'function') {
            return v.toString();
        } else {
            return '' + v;
        }
      }
    
    function floatReadValueFromPointer(name, shift) {
        switch (shift) {
            case 2: return function(pointer) {
                return this['fromWireType'](HEAPF32[pointer >> 2]);
            };
            case 3: return function(pointer) {
                return this['fromWireType'](HEAPF64[pointer >> 3]);
            };
            default:
                throw new TypeError("Unknown float type: " + name);
        }
      }
    function __embind_register_float(rawType, name, size) {
        var shift = getShiftFromSize(size);
        name = readLatin1String(name);
        registerType(rawType, {
            name: name,
            'fromWireType': function(value) {
                return value;
            },
            'toWireType': function(destructors, value) {
                // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
                // avoid the following if() and assume value is of proper type.
                if (typeof value !== "number" && typeof value !== "boolean") {
                    throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
                }
                return value;
            },
            'argPackAdvance': 8,
            'readValueFromPointer': floatReadValueFromPointer(name, shift),
            destructorFunction: null, // This type does not need a destructor
        });
      }

    function new_(constructor, argumentList) {
        if (!(constructor instanceof Function)) {
            throw new TypeError('new_ called with constructor type ' + typeof(constructor) + " which is not a function");
        }
    
        /*
         * Previously, the following line was just:
    
         function dummy() {};
    
         * Unfortunately, Chrome was preserving 'dummy' as the object's name, even though at creation, the 'dummy' has the
         * correct constructor name.  Thus, objects created with IMVU.new would show up in the debugger as 'dummy', which
         * isn't very helpful.  Using IMVU.createNamedFunction addresses the issue.  Doublely-unfortunately, there's no way
         * to write a test for this behavior.  -NRD 2013.02.22
         */
        var dummy = createNamedFunction(constructor.name || 'unknownFunctionName', function(){});
        dummy.prototype = constructor.prototype;
        var obj = new dummy;
    
        var r = constructor.apply(obj, argumentList);
        return (r instanceof Object) ? r : obj;
      }
    
    function runDestructors(destructors) {
        while (destructors.length) {
            var ptr = destructors.pop();
            var del = destructors.pop();
            del(ptr);
        }
      }
    function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
        // humanName: a human-readable string name for the function to be generated.
        // argTypes: An array that contains the embind type objects for all types in the function signature.
        //    argTypes[0] is the type object for the function return value.
        //    argTypes[1] is the type object for function this object/class type, or null if not crafting an invoker for a class method.
        //    argTypes[2...] are the actual function parameters.
        // classType: The embind type object for the class to be bound, or null if this is not a method of a class.
        // cppInvokerFunc: JS Function object to the C++-side function that interops into C++ code.
        // cppTargetFunc: Function pointer (an integer to FUNCTION_TABLE) to the target C++ function the cppInvokerFunc will end up calling.
        var argCount = argTypes.length;
    
        if (argCount < 2) {
            throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
        }
    
        var isClassMethodFunc = (argTypes[1] !== null && classType !== null);
    
        // Free functions with signature "void function()" do not need an invoker that marshalls between wire types.
    // TODO: This omits argument count check - enable only at -O3 or similar.
    //    if (ENABLE_UNSAFE_OPTS && argCount == 2 && argTypes[0].name == "void" && !isClassMethodFunc) {
    //       return FUNCTION_TABLE[fn];
    //    }
    
    
        // Determine if we need to use a dynamic stack to store the destructors for the function parameters.
        // TODO: Remove this completely once all function invokers are being dynamically generated.
        var needsDestructorStack = false;
    
        for(var i = 1; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here.
            if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) { // The type does not define a destructor function - must use dynamic stack
                needsDestructorStack = true;
                break;
            }
        }
    
        var returns = (argTypes[0].name !== "void");
    
        var argsList = "";
        var argsListWired = "";
        for(var i = 0; i < argCount - 2; ++i) {
            argsList += (i!==0?", ":"")+"arg"+i;
            argsListWired += (i!==0?", ":"")+"arg"+i+"Wired";
        }
    
        var invokerFnBody =
            "return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n" +
            "if (arguments.length !== "+(argCount - 2)+") {\n" +
                "throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount - 2)+" args!');\n" +
            "}\n";
    
    
        if (needsDestructorStack) {
            invokerFnBody +=
                "var destructors = [];\n";
        }
    
        var dtorStack = needsDestructorStack ? "destructors" : "null";
        var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
        var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
    
    
        if (isClassMethodFunc) {
            invokerFnBody += "var thisWired = classParam.toWireType("+dtorStack+", this);\n";
        }
    
        for(var i = 0; i < argCount - 2; ++i) {
            invokerFnBody += "var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";
            args1.push("argType"+i);
            args2.push(argTypes[i+2]);
        }
    
        if (isClassMethodFunc) {
            argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
        }
    
        invokerFnBody +=
            (returns?"var rv = ":"") + "invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";
    
        if (needsDestructorStack) {
            invokerFnBody += "runDestructors(destructors);\n";
        } else {
            for(var i = isClassMethodFunc?1:2; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
                var paramName = (i === 1 ? "thisWired" : ("arg"+(i - 2)+"Wired"));
                if (argTypes[i].destructorFunction !== null) {
                    invokerFnBody += paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";
                    args1.push(paramName+"_dtor");
                    args2.push(argTypes[i].destructorFunction);
                }
            }
        }
    
        if (returns) {
            invokerFnBody += "var ret = retType.fromWireType(rv);\n" +
                             "return ret;\n";
        }
        invokerFnBody += "}\n";
    
        args1.push(invokerFnBody);
    
        var invokerFunction = new_(Function, args1).apply(null, args2);
        return invokerFunction;
      }
    
    function ensureOverloadTable(proto, methodName, humanName) {
        if (undefined === proto[methodName].overloadTable) {
            var prevFunc = proto[methodName];
            // Inject an overload resolver function that routes to the appropriate overload based on the number of arguments.
            proto[methodName] = function() {
                // TODO This check can be removed in -O3 level "unsafe" optimizations.
                if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                    throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
                }
                return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
            };
            // Move the previous function into the overload table.
            proto[methodName].overloadTable = [];
            proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
        }
      }
    /** @param {number=} numArguments */
    function exposePublicSymbol(name, value, numArguments) {
        if (Module.hasOwnProperty(name)) {
            if (undefined === numArguments || (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])) {
                throwBindingError("Cannot register public name '" + name + "' twice");
            }
    
            // We are exposing a function with the same name as an existing function. Create an overload table and a function selector
            // that routes between the two.
            ensureOverloadTable(Module, name, name);
            if (Module.hasOwnProperty(numArguments)) {
                throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
            }
            // Add the new function into the overload table.
            Module[name].overloadTable[numArguments] = value;
        }
        else {
            Module[name] = value;
            if (undefined !== numArguments) {
                Module[name].numArguments = numArguments;
            }
        }
      }
    
    function heap32VectorToArray(count, firstElement) {
        var array = [];
        for (var i = 0; i < count; i++) {
            array.push(HEAP32[(firstElement >> 2) + i]);
        }
        return array;
      }
    
    /** @param {number=} numArguments */
    function replacePublicSymbol(name, value, numArguments) {
        if (!Module.hasOwnProperty(name)) {
            throwInternalError('Replacing nonexistant public symbol');
        }
        // If there's an overload table for this symbol, replace the symbol in the overload table instead.
        if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
            Module[name].overloadTable[numArguments] = value;
        }
        else {
            Module[name] = value;
            Module[name].argCount = numArguments;
        }
      }
    
    function getDynCaller(sig, ptr) {
        assert(sig.indexOf('j') >= 0, 'getDynCaller should only be called with i64 sigs');
        var argCache = [];
        return function() {
          argCache.length = arguments.length;
          for (var i = 0; i < arguments.length; i++) {
            argCache[i] = arguments[i];
          }
          return dynCall(sig, ptr, argCache);
        };
      }
    function embind__requireFunction(signature, rawFunction) {
        signature = readLatin1String(signature);
    
        function makeDynCaller() {
          if (signature.indexOf('j') != -1) {
            return getDynCaller(signature, rawFunction);
          }
          return wasmTable.get(rawFunction);
        }
    
        var fp = makeDynCaller();
        if (typeof fp !== "function") {
            throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
        }
        return fp;
      }
    
    var UnboundTypeError=undefined;
    
    function getTypeName(type) {
        var ptr = ___getTypeName(type);
        var rv = readLatin1String(ptr);
        _free(ptr);
        return rv;
      }
    function throwUnboundTypeError(message, types) {
        var unboundTypes = [];
        var seen = {};
        function visit(type) {
            if (seen[type]) {
                return;
            }
            if (registeredTypes[type]) {
                return;
            }
            if (typeDependencies[type]) {
                typeDependencies[type].forEach(visit);
                return;
            }
            unboundTypes.push(type);
            seen[type] = true;
        }
        types.forEach(visit);
    
        throw new UnboundTypeError(message + ': ' + unboundTypes.map(getTypeName).join([', ']));
      }
    function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
        var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        name = readLatin1String(name);
    
        rawInvoker = embind__requireFunction(signature, rawInvoker);
    
        exposePublicSymbol(name, function() {
            throwUnboundTypeError('Cannot call ' + name + ' due to unbound types', argTypes);
        }, argCount - 1);
    
        whenDependentTypesAreResolved([], argTypes, function(argTypes) {
            var invokerArgsArray = [argTypes[0] /* return value */, null /* no class 'this'*/].concat(argTypes.slice(1) /* actual params */);
            replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null /* no class 'this'*/, rawInvoker, fn), argCount - 1);
            return [];
        });
      }

    function integerReadValueFromPointer(name, shift, signed) {
        // integers are quite common, so generate very specialized functions
        switch (shift) {
            case 0: return signed ?
                function readS8FromPointer(pointer) { return HEAP8[pointer]; } :
                function readU8FromPointer(pointer) { return HEAPU8[pointer]; };
            case 1: return signed ?
                function readS16FromPointer(pointer) { return HEAP16[pointer >> 1]; } :
                function readU16FromPointer(pointer) { return HEAPU16[pointer >> 1]; };
            case 2: return signed ?
                function readS32FromPointer(pointer) { return HEAP32[pointer >> 2]; } :
                function readU32FromPointer(pointer) { return HEAPU32[pointer >> 2]; };
            default:
                throw new TypeError("Unknown integer type: " + name);
        }
      }
    function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
        name = readLatin1String(name);
        if (maxRange === -1) { // LLVM doesn't have signed and unsigned 32-bit types, so u32 literals come out as 'i32 -1'. Always treat those as max u32.
            maxRange = 4294967295;
        }
    
        var shift = getShiftFromSize(size);
    
        var fromWireType = function(value) {
            return value;
        };
    
        if (minRange === 0) {
            var bitshift = 32 - 8*size;
            fromWireType = function(value) {
                return (value << bitshift) >>> bitshift;
            };
        }
    
        var isUnsignedType = (name.indexOf('unsigned') != -1);
    
        registerType(primitiveType, {
            name: name,
            'fromWireType': fromWireType,
            'toWireType': function(destructors, value) {
                // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
                // avoid the following two if()s and assume value is of proper type.
                if (typeof value !== "number" && typeof value !== "boolean") {
                    throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
                }
                if (value < minRange || value > maxRange) {
                    throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ', ' + maxRange + ']!');
                }
                return isUnsignedType ? (value >>> 0) : (value | 0);
            },
            'argPackAdvance': 8,
            'readValueFromPointer': integerReadValueFromPointer(name, shift, minRange !== 0),
            destructorFunction: null, // This type does not need a destructor
        });
      }

    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
        var typeMapping = [
            Int8Array,
            Uint8Array,
            Int16Array,
            Uint16Array,
            Int32Array,
            Uint32Array,
            Float32Array,
            Float64Array,
        ];
    
        var TA = typeMapping[dataTypeIndex];
    
        function decodeMemoryView(handle) {
            handle = handle >> 2;
            var heap = HEAPU32;
            var size = heap[handle]; // in elements
            var data = heap[handle + 1]; // byte offset into emscripten heap
            return new TA(buffer, data, size);
        }
    
        name = readLatin1String(name);
        registerType(rawType, {
            name: name,
            'fromWireType': decodeMemoryView,
            'argPackAdvance': 8,
            'readValueFromPointer': decodeMemoryView,
        }, {
            ignoreDuplicateRegistrations: true,
        });
      }

    function __embind_register_std_string(rawType, name) {
        name = readLatin1String(name);
        var stdStringIsUTF8
        //process only std::string bindings with UTF8 support, in contrast to e.g. std::basic_string<unsigned char>
        = (name === "std::string");
    
        registerType(rawType, {
            name: name,
            'fromWireType': function(value) {
                var length = HEAPU32[value >> 2];
    
                var str;
                if (stdStringIsUTF8) {
                    var decodeStartPtr = value + 4;
                    // Looping here to support possible embedded '0' bytes
                    for (var i = 0; i <= length; ++i) {
                        var currentBytePtr = value + 4 + i;
                        if (i == length || HEAPU8[currentBytePtr] == 0) {
                            var maxRead = currentBytePtr - decodeStartPtr;
                            var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                            if (str === undefined) {
                                str = stringSegment;
                            } else {
                                str += String.fromCharCode(0);
                                str += stringSegment;
                            }
                            decodeStartPtr = currentBytePtr + 1;
                        }
                    }
                } else {
                    var a = new Array(length);
                    for (var i = 0; i < length; ++i) {
                        a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
                    }
                    str = a.join('');
                }
    
                _free(value);
    
                return str;
            },
            'toWireType': function(destructors, value) {
                if (value instanceof ArrayBuffer) {
                    value = new Uint8Array(value);
                }
    
                var getLength;
                var valueIsOfTypeString = (typeof value === 'string');
    
                if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                    throwBindingError('Cannot pass non-string to std::string');
                }
                if (stdStringIsUTF8 && valueIsOfTypeString) {
                    getLength = function() {return lengthBytesUTF8(value);};
                } else {
                    getLength = function() {return value.length;};
                }
    
                // assumes 4-byte alignment
                var length = getLength();
                var ptr = _malloc(4 + length + 1);
                HEAPU32[ptr >> 2] = length;
                if (stdStringIsUTF8 && valueIsOfTypeString) {
                    stringToUTF8(value, ptr + 4, length + 1);
                } else {
                    if (valueIsOfTypeString) {
                        for (var i = 0; i < length; ++i) {
                            var charCode = value.charCodeAt(i);
                            if (charCode > 255) {
                                _free(ptr);
                                throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
                            }
                            HEAPU8[ptr + 4 + i] = charCode;
                        }
                    } else {
                        for (var i = 0; i < length; ++i) {
                            HEAPU8[ptr + 4 + i] = value[i];
                        }
                    }
                }
    
                if (destructors !== null) {
                    destructors.push(_free, ptr);
                }
                return ptr;
            },
            'argPackAdvance': 8,
            'readValueFromPointer': simpleReadValueFromPointer,
            destructorFunction: function(ptr) { _free(ptr); },
        });
      }

    function __embind_register_std_wstring(rawType, charSize, name) {
        name = readLatin1String(name);
        var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
        if (charSize === 2) {
            decodeString = UTF16ToString;
            encodeString = stringToUTF16;
            lengthBytesUTF = lengthBytesUTF16;
            getHeap = function() { return HEAPU16; };
            shift = 1;
        } else if (charSize === 4) {
            decodeString = UTF32ToString;
            encodeString = stringToUTF32;
            lengthBytesUTF = lengthBytesUTF32;
            getHeap = function() { return HEAPU32; };
            shift = 2;
        }
        registerType(rawType, {
            name: name,
            'fromWireType': function(value) {
                // Code mostly taken from _embind_register_std_string fromWireType
                var length = HEAPU32[value >> 2];
                var HEAP = getHeap();
                var str;
    
                var decodeStartPtr = value + 4;
                // Looping here to support possible embedded '0' bytes
                for (var i = 0; i <= length; ++i) {
                    var currentBytePtr = value + 4 + i * charSize;
                    if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                        var maxReadBytes = currentBytePtr - decodeStartPtr;
                        var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                        if (str === undefined) {
                            str = stringSegment;
                        } else {
                            str += String.fromCharCode(0);
                            str += stringSegment;
                        }
                        decodeStartPtr = currentBytePtr + charSize;
                    }
                }
    
                _free(value);
    
                return str;
            },
            'toWireType': function(destructors, value) {
                if (!(typeof value === 'string')) {
                    throwBindingError('Cannot pass non-string to C++ string type ' + name);
                }
    
                // assumes 4-byte alignment
                var length = lengthBytesUTF(value);
                var ptr = _malloc(4 + length + charSize);
                HEAPU32[ptr >> 2] = length >> shift;
    
                encodeString(value, ptr + 4, length + charSize);
    
                if (destructors !== null) {
                    destructors.push(_free, ptr);
                }
                return ptr;
            },
            'argPackAdvance': 8,
            'readValueFromPointer': simpleReadValueFromPointer,
            destructorFunction: function(ptr) { _free(ptr); },
        });
      }

    function __embind_register_void(rawType, name) {
        name = readLatin1String(name);
        registerType(rawType, {
            isVoid: true, // void return values can be optimized out sometimes
            name: name,
            'argPackAdvance': 0,
            'fromWireType': function() {
                return undefined;
            },
            'toWireType': function(destructors, o) {
                // TODO: assert if anything else is given?
                return undefined;
            },
        });
      }

    function requireHandle(handle) {
        if (!handle) {
            throwBindingError('Cannot use deleted val. handle = ' + handle);
        }
        return emval_handle_array[handle].value;
      }
    
    function requireRegisteredType(rawType, humanName) {
        var impl = registeredTypes[rawType];
        if (undefined === impl) {
            throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
        }
        return impl;
      }
    function __emval_as(handle, returnType, destructorsRef) {
        handle = requireHandle(handle);
        returnType = requireRegisteredType(returnType, 'emval::as');
        var destructors = [];
        var rd = __emval_register(destructors);
        HEAP32[destructorsRef >> 2] = rd;
        return returnType['toWireType'](destructors, handle);
      }

    function __emval_lookupTypes(argCount, argTypes) {
        var a = new Array(argCount);
        for (var i = 0; i < argCount; ++i) {
            a[i] = requireRegisteredType(
                HEAP32[(argTypes >> 2) + i],
                "parameter " + i);
        }
        return a;
      }
    function __emval_call(handle, argCount, argTypes, argv) {
        handle = requireHandle(handle);
        var types = __emval_lookupTypes(argCount, argTypes);
    
        var args = new Array(argCount);
        for (var i = 0; i < argCount; ++i) {
            var type = types[i];
            args[i] = type['readValueFromPointer'](argv);
            argv += type['argPackAdvance'];
        }
    
        var rv = handle.apply(undefined, args);
        return __emval_register(rv);
      }

    function __emval_allocateDestructors(destructorsRef) {
        var destructors = [];
        HEAP32[destructorsRef >> 2] = __emval_register(destructors);
        return destructors;
      }
    
    var emval_symbols={};
    function getStringOrSymbol(address) {
        var symbol = emval_symbols[address];
        if (symbol === undefined) {
            return readLatin1String(address);
        } else {
            return symbol;
        }
      }
    
    var emval_methodCallers=[];
    function __emval_call_method(caller, handle, methodName, destructorsRef, args) {
        caller = emval_methodCallers[caller];
        handle = requireHandle(handle);
        methodName = getStringOrSymbol(methodName);
        return caller(handle, methodName, __emval_allocateDestructors(destructorsRef), args);
      }

    function __emval_call_void_method(caller, handle, methodName, args) {
        caller = emval_methodCallers[caller];
        handle = requireHandle(handle);
        methodName = getStringOrSymbol(methodName);
        caller(handle, methodName, null, args);
      }


    function __emval_equals(first, second) {
        first = requireHandle(first);
        second = requireHandle(second);
        return first == second;
      }

    function emval_get_global() {
        if (typeof globalThis === 'object') {
          return globalThis;
        }
        return (function(){
          return Function;
        })()('return this')();
      }
    function __emval_get_global(name) {
        if(name===0){
          return __emval_register(emval_get_global());
        } else {
          name = getStringOrSymbol(name);
          return __emval_register(emval_get_global()[name]);
        }
      }

    function __emval_addMethodCaller(caller) {
        var id = emval_methodCallers.length;
        emval_methodCallers.push(caller);
        return id;
      }
    function __emval_get_method_caller(argCount, argTypes) {
        var types = __emval_lookupTypes(argCount, argTypes);
    
        var retType = types[0];
        var signatureName = retType.name + "_$" + types.slice(1).map(function (t) { return t.name; }).join("_") + "$";
    
        var params = ["retType"];
        var args = [retType];
    
        var argsList = ""; // 'arg0, arg1, arg2, ... , argN'
        for (var i = 0; i < argCount - 1; ++i) {
            argsList += (i !== 0 ? ", " : "") + "arg" + i;
            params.push("argType" + i);
            args.push(types[1 + i]);
        }
    
        var functionName = makeLegalFunctionName("methodCaller_" + signatureName);
        var functionBody =
            "return function " + functionName + "(handle, name, destructors, args) {\n";
    
        var offset = 0;
        for (var i = 0; i < argCount - 1; ++i) {
            functionBody +=
            "    var arg" + i + " = argType" + i + ".readValueFromPointer(args" + (offset ? ("+"+offset) : "") + ");\n";
            offset += types[i + 1]['argPackAdvance'];
        }
        functionBody +=
            "    var rv = handle[name](" + argsList + ");\n";
        for (var i = 0; i < argCount - 1; ++i) {
            if (types[i + 1]['deleteObject']) {
                functionBody +=
                "    argType" + i + ".deleteObject(arg" + i + ");\n";
            }
        }
        if (!retType.isVoid) {
            functionBody +=
            "    return retType.toWireType(destructors, rv);\n";
        }
        functionBody +=
            "};\n";
    
        params.push(functionBody);
        var invokerFunction = new_(Function, params).apply(null, args);
        return __emval_addMethodCaller(invokerFunction);
      }

    function __emval_get_module_property(name) {
        name = getStringOrSymbol(name);
        return __emval_register(Module[name]);
      }

    function __emval_get_property(handle, key) {
        handle = requireHandle(handle);
        key = requireHandle(key);
        return __emval_register(handle[key]);
      }

    function __emval_incref(handle) {
        if (handle > 4) {
            emval_handle_array[handle].refcount += 1;
        }
      }

    function __emval_is_string(handle) {
        handle = requireHandle(handle);
        return typeof handle === 'string';
      }

    function craftEmvalAllocator(argCount) {
        /*This function returns a new function that looks like this:
        function emval_allocator_3(constructor, argTypes, args) {
            var argType0 = requireRegisteredType(HEAP32[(argTypes >> 2)], "parameter 0");
            var arg0 = argType0.readValueFromPointer(args);
            var argType1 = requireRegisteredType(HEAP32[(argTypes >> 2) + 1], "parameter 1");
            var arg1 = argType1.readValueFromPointer(args + 8);
            var argType2 = requireRegisteredType(HEAP32[(argTypes >> 2) + 2], "parameter 2");
            var arg2 = argType2.readValueFromPointer(args + 16);
            var obj = new constructor(arg0, arg1, arg2);
            return __emval_register(obj);
        } */
        var argsList = "";
        for(var i = 0; i < argCount; ++i) {
            argsList += (i!==0?", ":"")+"arg"+i; // 'arg0, arg1, ..., argn'
        }
    
        var functionBody =
            "return function emval_allocator_"+argCount+"(constructor, argTypes, args) {\n";
    
        for(var i = 0; i < argCount; ++i) {
            functionBody +=
                "var argType"+i+" = requireRegisteredType(Module['HEAP32'][(argTypes >>> 2) + "+i+"], \"parameter "+i+"\");\n" +
                "var arg"+i+" = argType"+i+".readValueFromPointer(args);\n" +
                "args += argType"+i+"['argPackAdvance'];\n";
        }
        functionBody +=
            "var obj = new constructor("+argsList+");\n" +
            "return __emval_register(obj);\n" +
            "}\n";
    
        /*jshint evil:true*/
        return (new Function("requireRegisteredType", "Module", "__emval_register", functionBody))(
            requireRegisteredType, Module, __emval_register);
      }
    
    var emval_newers={};
    function __emval_new(handle, argCount, argTypes, args) {
        handle = requireHandle(handle);
    
        var newer = emval_newers[argCount];
        if (!newer) {
            newer = craftEmvalAllocator(argCount);
            emval_newers[argCount] = newer;
        }
    
        return newer(handle, argTypes, args);
      }

    function __emval_new_cstring(v) {
        return __emval_register(getStringOrSymbol(v));
      }

    function __emval_new_object() {
        return __emval_register({});
      }

    function __emval_run_destructors(handle) {
        var destructors = emval_handle_array[handle].value;
        runDestructors(destructors);
        __emval_decref(handle);
      }

    function __emval_set_property(handle, key, value) {
        handle = requireHandle(handle);
        key = requireHandle(key);
        value = requireHandle(value);
        handle[key] = value;
      }

    function __emval_take_value(type, argv) {
        type = requireRegisteredType(type, '_emval_take_value');
        var v = type['readValueFromPointer'](argv);
        return __emval_register(v);
      }

    function _abort() {
        abort();
      }

    var _emscripten_get_now;if (ENVIRONMENT_IS_NODE) {
      _emscripten_get_now = function() {
        var t = process['hrtime']();
        return t[0] * 1e3 + t[1] / 1e6;
      };
    } else if (typeof dateNow !== 'undefined') {
      _emscripten_get_now = dateNow;
    } else _emscripten_get_now = function() { return performance.now(); }
    ;
    
    var _emscripten_get_now_is_monotonic=true;  function _clock_gettime(clk_id, tp) {
        // int clock_gettime(clockid_t clk_id, struct timespec *tp);
        var now;
        if (clk_id === 0) {
          now = Date.now();
        } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
          now = _emscripten_get_now();
        } else {
          setErrNo(28);
          return -1;
        }
        HEAP32[((tp)>>2)]=(now/1000)|0; // seconds
        HEAP32[(((tp)+(4))>>2)]=((now % 1000)*1000*1000)|0; // nanoseconds
        return 0;
      }

    function _dlclose(handle) {
        abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
      }

    function _dlerror() {
        abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
      }

    function _dlopen(filename, flag) {
        abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
      }

    function _dlsym(handle, symbol) {
        abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
      }

    function _emscripten_set_main_loop_timing(mode, value) {
        Browser.mainLoop.timingMode = mode;
        Browser.mainLoop.timingValue = value;
    
        if (!Browser.mainLoop.func) {
          console.error('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
          return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
        }
    
        if (mode == 0 /*EM_TIMING_SETTIMEOUT*/) {
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
          };
          Browser.mainLoop.method = 'timeout';
        } else if (mode == 1 /*EM_TIMING_RAF*/) {
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner);
          };
          Browser.mainLoop.method = 'rAF';
        } else if (mode == 2 /*EM_TIMING_SETIMMEDIATE*/) {
          if (typeof setImmediate === 'undefined') {
            // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
            var setImmediates = [];
            var emscriptenMainLoopMessageId = 'setimmediate';
            var Browser_setImmediate_messageHandler = function(event) {
              // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
              // so check for both cases.
              if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                event.stopPropagation();
                setImmediates.shift()();
              }
            };
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            setImmediate = /** @type{function(function(): ?, ...?): number} */(function Browser_emulated_setImmediate(func) {
              setImmediates.push(func);
              if (ENVIRONMENT_IS_WORKER) {
                if (Module['setImmediates'] === undefined) Module['setImmediates'] = [];
                Module['setImmediates'].push(func);
                postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
              } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
            });
          }
          Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            setImmediate(Browser.mainLoop.runner);
          };
          Browser.mainLoop.method = 'immediate';
        }
        return 0;
      }
    function setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) {
        noExitRuntime = true;
    
        assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
    
        Browser.mainLoop.func = browserIterationFunc;
        Browser.mainLoop.arg = arg;
    
        var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
    
        Browser.mainLoop.runner = function Browser_mainLoop_runner() {
          if (ABORT) return;
          if (Browser.mainLoop.queue.length > 0) {
            var start = Date.now();
            var blocker = Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if (Browser.mainLoop.remainingBlockers) {
              var remaining = Browser.mainLoop.remainingBlockers;
              var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
              if (blocker.counted) {
                Browser.mainLoop.remainingBlockers = next;
              } else {
                // not counted, but move the progress along a tiny bit
                next = next + 0.5; // do not steal all the next one's progress
                Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
              }
            }
            console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
            Browser.mainLoop.updateStatus();
    
            // catches pause/resume main loop from blocker execution
            if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
    
            setTimeout(Browser.mainLoop.runner, 0);
            return;
          }
    
          // catch pauses from non-main loop sources
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
    
          // Implement very basic swap interval control
          Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
          if (Browser.mainLoop.timingMode == 1/*EM_TIMING_RAF*/ && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
            // Not the scheduled time to render this frame - skip.
            Browser.mainLoop.scheduler();
            return;
          } else if (Browser.mainLoop.timingMode == 0/*EM_TIMING_SETTIMEOUT*/) {
            Browser.mainLoop.tickStartTime = _emscripten_get_now();
          }
    
          // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
          // VBO double-buffering and reduce GPU stalls.
    
    
    
          if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
            warnOnce('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
            Browser.mainLoop.method = ''; // just warn once per call to set main loop
          }
    
          Browser.mainLoop.runIter(browserIterationFunc);
    
          checkStackCookie();
    
          // catch pauses from the main loop itself
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
    
          // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
          // to queue the newest produced audio samples.
          // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
          //       do not need to be hardcoded into this function, but can be more generic.
          if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
    
          Browser.mainLoop.scheduler();
        };
    
        if (!noSetTiming) {
          if (fps && fps > 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 1000.0 / fps);
          else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, 1); // Do rAF by rendering each frame (no decimating)
    
          Browser.mainLoop.scheduler();
        }
    
        if (simulateInfiniteLoop) {
          throw 'unwind';
        }
      }
    var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function() {
            Browser.mainLoop.scheduler = null;
            Browser.mainLoop.currentlyRunningMainloop++; // Incrementing this signals the previous main loop that it's now become old, and it must return.
          },resume:function() {
            Browser.mainLoop.currentlyRunningMainloop++;
            var timingMode = Browser.mainLoop.timingMode;
            var timingValue = Browser.mainLoop.timingValue;
            var func = Browser.mainLoop.func;
            Browser.mainLoop.func = null;
            setMainLoop(func, 0, false, Browser.mainLoop.arg, true /* do not set timing and call scheduler, we will do it on the next lines */);
            _emscripten_set_main_loop_timing(timingMode, timingValue);
            Browser.mainLoop.scheduler();
          },updateStatus:function() {
            if (Module['setStatus']) {
              var message = Module['statusMessage'] || 'Please wait...';
              var remaining = Browser.mainLoop.remainingBlockers;
              var expected = Browser.mainLoop.expectedBlockers;
              if (remaining) {
                if (remaining < expected) {
                  Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
                } else {
                  Module['setStatus'](message);
                }
              } else {
                Module['setStatus']('');
              }
            }
          },runIter:function(func) {
            if (ABORT) return;
            if (Module['preMainLoop']) {
              var preRet = Module['preMainLoop']();
              if (preRet === false) {
                return; // |return false| skips a frame
              }
            }
            try {
              func();
            } catch (e) {
              if (e instanceof ExitStatus) {
                return;
              } else if (e == 'unwind') {
                return;
              } else {
                if (e && typeof e === 'object' && e.stack) err('exception thrown: ' + [e, e.stack]);
                throw e;
              }
            }
            if (Module['postMainLoop']) Module['postMainLoop']();
          }},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function() {
          if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
    
          if (Browser.initted) return;
          Browser.initted = true;
    
          try {
            new Blob();
            Browser.hasBlobConstructor = true;
          } catch(e) {
            Browser.hasBlobConstructor = false;
            console.log("warning: no blob constructor, cannot create blobs with mimetypes");
          }
          Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
          Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
          if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
            console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
            Module.noImageDecoding = true;
          }
    
          // Support for plugins that can process preloaded files. You can add more of these to
          // your app by creating and appending to Module.preloadPlugins.
          //
          // Each plugin is asked if it can handle a file based on the file's name. If it can,
          // it is given the file's raw data. When it is done, it calls a callback with the file's
          // (possibly modified) data. For example, a plugin might decompress a file, or it
          // might create some side data structure for use later (like an Image element, etc.).
    
          var imagePlugin = {};
          imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
          };
          imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
            var b = null;
            if (Browser.hasBlobConstructor) {
              try {
                b = new Blob([byteArray], { type: Browser.getMimetype(name) });
                if (b.size !== byteArray.length) { // Safari bug #118630
                  // Safari's Blob can only take an ArrayBuffer
                  b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
                }
              } catch(e) {
                warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
              }
            }
            if (!b) {
              var bb = new Browser.BlobBuilder();
              bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
              b = bb.getBlob();
            }
            var url = Browser.URLObject.createObjectURL(b);
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var img = new Image();
            img.onload = function img_onload() {
              assert(img.complete, 'Image ' + name + ' could not be decoded');
              var canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              Module["preloadedImages"][name] = canvas;
              Browser.URLObject.revokeObjectURL(url);
              if (onload) onload(byteArray);
            };
            img.onerror = function img_onerror(event) {
              console.log('Image ' + url + ' could not be decoded');
              if (onerror) onerror();
            };
            img.src = url;
          };
          Module['preloadPlugins'].push(imagePlugin);
    
          var audioPlugin = {};
          audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
            return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
          };
          audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
            var done = false;
            function finish(audio) {
              if (done) return;
              done = true;
              Module["preloadedAudios"][name] = audio;
              if (onload) onload(byteArray);
            }
            function fail() {
              if (done) return;
              done = true;
              Module["preloadedAudios"][name] = new Audio(); // empty shim
              if (onerror) onerror();
            }
            if (Browser.hasBlobConstructor) {
              try {
                var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              } catch(e) {
                return fail();
              }
              var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
              assert(typeof url == 'string', 'createObjectURL must return a url as a string');
              var audio = new Audio();
              audio.addEventListener('canplaythrough', function() { finish(audio); }, false); // use addEventListener due to chromium bug 124926
              audio.onerror = function audio_onerror(event) {
                if (done) return;
                console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
                function encode64(data) {
                  var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                  var PAD = '=';
                  var ret = '';
                  var leftchar = 0;
                  var leftbits = 0;
                  for (var i = 0; i < data.length; i++) {
                    leftchar = (leftchar << 8) | data[i];
                    leftbits += 8;
                    while (leftbits >= 6) {
                      var curr = (leftchar >> (leftbits-6)) & 0x3f;
                      leftbits -= 6;
                      ret += BASE[curr];
                    }
                  }
                  if (leftbits == 2) {
                    ret += BASE[(leftchar&3) << 4];
                    ret += PAD + PAD;
                  } else if (leftbits == 4) {
                    ret += BASE[(leftchar&0xf) << 2];
                    ret += PAD;
                  }
                  return ret;
                }
                audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
                finish(audio); // we don't wait for confirmation this worked - but it's worth trying
              };
              audio.src = url;
              // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
              Browser.safeSetTimeout(function() {
                finish(audio); // try to use it even though it is not necessarily ready to play
              }, 10000);
            } else {
              return fail();
            }
          };
          Module['preloadPlugins'].push(audioPlugin);
    
    
          // Canvas event setup
    
          function pointerLockChange() {
            Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                                  document['mozPointerLockElement'] === Module['canvas'] ||
                                  document['webkitPointerLockElement'] === Module['canvas'] ||
                                  document['msPointerLockElement'] === Module['canvas'];
          }
          var canvas = Module['canvas'];
          if (canvas) {
            // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
            // Module['forcedAspectRatio'] = 4 / 3;
    
            canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                        canvas['mozRequestPointerLock'] ||
                                        canvas['webkitRequestPointerLock'] ||
                                        canvas['msRequestPointerLock'] ||
                                        function(){};
            canvas.exitPointerLock = document['exitPointerLock'] ||
                                     document['mozExitPointerLock'] ||
                                     document['webkitExitPointerLock'] ||
                                     document['msExitPointerLock'] ||
                                     function(){}; // no-op if function does not exist
            canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
    
            document.addEventListener('pointerlockchange', pointerLockChange, false);
            document.addEventListener('mozpointerlockchange', pointerLockChange, false);
            document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
            document.addEventListener('mspointerlockchange', pointerLockChange, false);
    
            if (Module['elementPointerLock']) {
              canvas.addEventListener("click", function(ev) {
                if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                  Module['canvas'].requestPointerLock();
                  ev.preventDefault();
                }
              }, false);
            }
          }
        },createContext:function(canvas, useWebGL, setInModule, webGLContextAttributes) {
          if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
    
          var ctx;
          var contextHandle;
          if (useWebGL) {
            // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
            var contextAttributes = {
              antialias: false,
              alpha: false,
              majorVersion: 1,
            };
    
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
    
            // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
            // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
            // Browser.createContext() should not even be emitted.
            if (typeof GL !== 'undefined') {
              contextHandle = GL.createContext(canvas, contextAttributes);
              if (contextHandle) {
                ctx = GL.getContext(contextHandle).GLctx;
              }
            }
          } else {
            ctx = canvas.getContext('2d');
          }
    
          if (!ctx) return null;
    
          if (setInModule) {
            if (!useWebGL) assert(typeof GLctx === 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
    
            Module.ctx = ctx;
            if (useWebGL) GL.makeContextCurrent(contextHandle);
            Module.useWebGL = useWebGL;
            Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback(); });
            Browser.init();
          }
          return ctx;
        },destroyContext:function(canvas, useWebGL, setInModule) {},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:function(lockPointer, resizeCanvas) {
          Browser.lockPointer = lockPointer;
          Browser.resizeCanvas = resizeCanvas;
          if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
          if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
    
          var canvas = Module['canvas'];
          function fullscreenChange() {
            Browser.isFullscreen = false;
            var canvasContainer = canvas.parentNode;
            if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
                 document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
                 document['webkitCurrentFullScreenElement']) === canvasContainer) {
              canvas.exitFullscreen = Browser.exitFullscreen;
              if (Browser.lockPointer) canvas.requestPointerLock();
              Browser.isFullscreen = true;
              if (Browser.resizeCanvas) {
                Browser.setFullscreenCanvasSize();
              } else {
                Browser.updateCanvasDimensions(canvas);
              }
            } else {
              // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
              canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
              canvasContainer.parentNode.removeChild(canvasContainer);
    
              if (Browser.resizeCanvas) {
                Browser.setWindowedCanvasSize();
              } else {
                Browser.updateCanvasDimensions(canvas);
              }
            }
            if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullscreen);
            if (Module['onFullscreen']) Module['onFullscreen'](Browser.isFullscreen);
          }
    
          if (!Browser.fullscreenHandlersInstalled) {
            Browser.fullscreenHandlersInstalled = true;
            document.addEventListener('fullscreenchange', fullscreenChange, false);
            document.addEventListener('mozfullscreenchange', fullscreenChange, false);
            document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
            document.addEventListener('MSFullscreenChange', fullscreenChange, false);
          }
    
          // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
          var canvasContainer = document.createElement("div");
          canvas.parentNode.insertBefore(canvasContainer, canvas);
          canvasContainer.appendChild(canvas);
    
          // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
          canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                              canvasContainer['mozRequestFullScreen'] ||
                                              canvasContainer['msRequestFullscreen'] ||
                                             (canvasContainer['webkitRequestFullscreen'] ? function() { canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']); } : null) ||
                                             (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']); } : null);
    
          canvasContainer.requestFullscreen();
        },requestFullScreen:function() {
          abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
        },exitFullscreen:function() {
          // This is workaround for chrome. Trying to exit from fullscreen
          // not in fullscreen state will cause "TypeError: Document not active"
          // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
          if (!Browser.isFullscreen) {
            return false;
          }
    
          var CFS = document['exitFullscreen'] ||
                    document['cancelFullScreen'] ||
                    document['mozCancelFullScreen'] ||
                    document['msExitFullscreen'] ||
                    document['webkitCancelFullScreen'] ||
              (function() {});
          CFS.apply(document, []);
          return true;
        },nextRAF:0,fakeRequestAnimationFrame:function(func) {
          // try to keep 60fps between calls to here
          var now = Date.now();
          if (Browser.nextRAF === 0) {
            Browser.nextRAF = now + 1000/60;
          } else {
            while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
              Browser.nextRAF += 1000/60;
            }
          }
          var delay = Math.max(Browser.nextRAF - now, 0);
          setTimeout(func, delay);
        },requestAnimationFrame:function(func) {
          if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(func);
            return;
          }
          var RAF = Browser.fakeRequestAnimationFrame;
          RAF(func);
        },safeCallback:function(func) {
          return function() {
            if (!ABORT) return func.apply(null, arguments);
          };
        },allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:function() {
          Browser.allowAsyncCallbacks = false;
        },resumeAsyncCallbacks:function() { // marks future callbacks as ok to execute, and synchronously runs any remaining ones right now
          Browser.allowAsyncCallbacks = true;
          if (Browser.queuedAsyncCallbacks.length > 0) {
            var callbacks = Browser.queuedAsyncCallbacks;
            Browser.queuedAsyncCallbacks = [];
            callbacks.forEach(function(func) {
              func();
            });
          }
        },safeRequestAnimationFrame:function(func) {
          return Browser.requestAnimationFrame(function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
              func();
            } else {
              Browser.queuedAsyncCallbacks.push(func);
            }
          });
        },safeSetTimeout:function(func, timeout) {
          noExitRuntime = true;
          return setTimeout(function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
              func();
            } else {
              Browser.queuedAsyncCallbacks.push(func);
            }
          }, timeout);
        },safeSetInterval:function(func, timeout) {
          noExitRuntime = true;
          return setInterval(function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
              func();
            } // drop it on the floor otherwise, next interval will kick in
          }, timeout);
        },getMimetype:function(name) {
          return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
          }[name.substr(name.lastIndexOf('.')+1)];
        },getUserMedia:function(func) {
          if(!window.getUserMedia) {
            window.getUserMedia = navigator['getUserMedia'] ||
                                  navigator['mozGetUserMedia'];
          }
          window.getUserMedia(func);
        },getMovementX:function(event) {
          return event['movementX'] ||
                 event['mozMovementX'] ||
                 event['webkitMovementX'] ||
                 0;
        },getMovementY:function(event) {
          return event['movementY'] ||
                 event['mozMovementY'] ||
                 event['webkitMovementY'] ||
                 0;
        },getMouseWheelDelta:function(event) {
          var delta = 0;
          switch (event.type) {
            case 'DOMMouseScroll':
              // 3 lines make up a step
              delta = event.detail / 3;
              break;
            case 'mousewheel':
              // 120 units make up a step
              delta = event.wheelDelta / 120;
              break;
            case 'wheel':
              delta = event.deltaY;
              switch(event.deltaMode) {
                case 0:
                  // DOM_DELTA_PIXEL: 100 pixels make up a step
                  delta /= 100;
                  break;
                case 1:
                  // DOM_DELTA_LINE: 3 lines make up a step
                  delta /= 3;
                  break;
                case 2:
                  // DOM_DELTA_PAGE: A page makes up 80 steps
                  delta *= 80;
                  break;
                default:
                  throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
              }
              break;
            default:
              throw 'unrecognized mouse wheel event: ' + event.type;
          }
          return delta;
        },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function(event) { // event should be mousemove, mousedown or mouseup
          if (Browser.pointerLock) {
            // When the pointer is locked, calculate the coordinates
            // based on the movement of the mouse.
            // Workaround for Firefox bug 764498
            if (event.type != 'mousemove' &&
                ('mozMovementX' in event)) {
              Browser.mouseMovementX = Browser.mouseMovementY = 0;
            } else {
              Browser.mouseMovementX = Browser.getMovementX(event);
              Browser.mouseMovementY = Browser.getMovementY(event);
            }
    
            // check if SDL is available
            if (typeof SDL != "undefined") {
              Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
              Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
            } else {
              // just add the mouse delta to the current absolut mouse position
              // FIXME: ideally this should be clamped against the canvas size and zero
              Browser.mouseX += Browser.mouseMovementX;
              Browser.mouseY += Browser.mouseMovementY;
            }
          } else {
            // Otherwise, calculate the movement based on the changes
            // in the coordinates.
            var rect = Module["canvas"].getBoundingClientRect();
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
    
            // Neither .scrollX or .pageXOffset are defined in a spec, but
            // we prefer .scrollX because it is currently in a spec draft.
            // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
            var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
            var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
            // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
            // and we have no viable fallback.
            assert((typeof scrollX !== 'undefined') && (typeof scrollY !== 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
    
            if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
              var touch = event.touch;
              if (touch === undefined) {
                return; // the "touch" property is only defined in SDL
    
              }
              var adjustedX = touch.pageX - (scrollX + rect.left);
              var adjustedY = touch.pageY - (scrollY + rect.top);
    
              adjustedX = adjustedX * (cw / rect.width);
              adjustedY = adjustedY * (ch / rect.height);
    
              var coords = { x: adjustedX, y: adjustedY };
    
              if (event.type === 'touchstart') {
                Browser.lastTouches[touch.identifier] = coords;
                Browser.touches[touch.identifier] = coords;
              } else if (event.type === 'touchend' || event.type === 'touchmove') {
                var last = Browser.touches[touch.identifier];
                if (!last) last = coords;
                Browser.lastTouches[touch.identifier] = last;
                Browser.touches[touch.identifier] = coords;
              }
              return;
            }
    
            var x = event.pageX - (scrollX + rect.left);
            var y = event.pageY - (scrollY + rect.top);
    
            // the canvas might be CSS-scaled compared to its backbuffer;
            // SDL-using content will want mouse coordinates in terms
            // of backbuffer units.
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);
    
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y;
          }
        },asyncLoad:function(url, onload, onerror, noRunDep) {
          var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
          readAsync(url, function(arrayBuffer) {
            assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
            onload(new Uint8Array(arrayBuffer));
            if (dep) removeRunDependency(dep);
          }, function(event) {
            if (onerror) {
              onerror();
            } else {
              throw 'Loading data file "' + url + '" failed.';
            }
          });
          if (dep) addRunDependency(dep);
        },resizeListeners:[],updateResizeListeners:function() {
          var canvas = Module['canvas'];
          Browser.resizeListeners.forEach(function(listener) {
            listener(canvas.width, canvas.height);
          });
        },setCanvasSize:function(width, height, noUpdates) {
          var canvas = Module['canvas'];
          Browser.updateCanvasDimensions(canvas, width, height);
          if (!noUpdates) Browser.updateResizeListeners();
        },windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:function() {
          // check if SDL is available
          if (typeof SDL != "undefined") {
            var flags = HEAPU32[((SDL.screen)>>2)];
            flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
            HEAP32[((SDL.screen)>>2)]=flags;
          }
          Browser.updateCanvasDimensions(Module['canvas']);
          Browser.updateResizeListeners();
        },setWindowedCanvasSize:function() {
          // check if SDL is available
          if (typeof SDL != "undefined") {
            var flags = HEAPU32[((SDL.screen)>>2)];
            flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
            HEAP32[((SDL.screen)>>2)]=flags;
          }
          Browser.updateCanvasDimensions(Module['canvas']);
          Browser.updateResizeListeners();
        },updateCanvasDimensions:function(canvas, wNative, hNative) {
          if (wNative && hNative) {
            canvas.widthNative = wNative;
            canvas.heightNative = hNative;
          } else {
            wNative = canvas.widthNative;
            hNative = canvas.heightNative;
          }
          var w = wNative;
          var h = hNative;
          if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
            if (w/h < Module['forcedAspectRatio']) {
              w = Math.round(h * Module['forcedAspectRatio']);
            } else {
              h = Math.round(w / Module['forcedAspectRatio']);
            }
          }
          if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
             var factor = Math.min(screen.width / w, screen.height / h);
             w = Math.round(w * factor);
             h = Math.round(h * factor);
          }
          if (Browser.resizeCanvas) {
            if (canvas.width  != w) canvas.width  = w;
            if (canvas.height != h) canvas.height = h;
            if (typeof canvas.style != 'undefined') {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          } else {
            if (canvas.width  != wNative) canvas.width  = wNative;
            if (canvas.height != hNative) canvas.height = hNative;
            if (typeof canvas.style != 'undefined') {
              if (w != wNative || h != hNative) {
                canvas.style.setProperty( "width", w + "px", "important");
                canvas.style.setProperty("height", h + "px", "important");
              } else {
                canvas.style.removeProperty( "width");
                canvas.style.removeProperty("height");
              }
            }
          }
        },wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:function() {
          var handle = Browser.nextWgetRequestHandle;
          Browser.nextWgetRequestHandle++;
          return handle;
        }};
    function _eglGetProcAddress(name_) {
        return _emscripten_GetProcAddress(name_);
      }

    function _emscripten_async_call(func, arg, millis) {
        noExitRuntime = true;
    
        function wrapper() {
          wasmTable.get(func)(arg);
        }
    
        if (millis >= 0) {
          Browser.safeSetTimeout(wrapper, millis);
        } else {
          Browser.safeRequestAnimationFrame(wrapper);
        }
      }

    function _emscripten_date_now() {
        return Date.now();
      }

    function _emscripten_force_exit(status) {
        warnOnce('emscripten_force_exit cannot actually shut down the runtime, as the build does not have EXIT_RUNTIME set');
        noExitRuntime = false;
        exit(status);
      }

    var JSEvents={inEventHandler:0,removeAllEventListeners:function() {
          for(var i = JSEvents.eventHandlers.length-1; i >= 0; --i) {
            JSEvents._removeHandler(i);
          }
          JSEvents.eventHandlers = [];
          JSEvents.deferredCalls = [];
        },registerRemoveEventListeners:function() {
          if (!JSEvents.removeEventListenersRegistered) {
            JSEvents.removeEventListenersRegistered = true;
          }
        },deferredCalls:[],deferCall:function(targetFunction, precedence, argsList) {
          function arraysHaveEqualContent(arrA, arrB) {
            if (arrA.length != arrB.length) return false;
    
            for(var i in arrA) {
              if (arrA[i] != arrB[i]) return false;
            }
            return true;
          }
          // Test if the given call was already queued, and if so, don't add it again.
          for(var i in JSEvents.deferredCalls) {
            var call = JSEvents.deferredCalls[i];
            if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
              return;
            }
          }
          JSEvents.deferredCalls.push({
            targetFunction: targetFunction,
            precedence: precedence,
            argsList: argsList
          });
    
          JSEvents.deferredCalls.sort(function(x,y) { return x.precedence < y.precedence; });
        },removeDeferredCalls:function(targetFunction) {
          for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
              JSEvents.deferredCalls.splice(i, 1);
              --i;
            }
          }
        },canPerformEventHandlerRequests:function() {
          return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
        },runDeferredCalls:function() {
          if (!JSEvents.canPerformEventHandlerRequests()) {
            return;
          }
          for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            var call = JSEvents.deferredCalls[i];
            JSEvents.deferredCalls.splice(i, 1);
            --i;
            call.targetFunction.apply(null, call.argsList);
          }
        },eventHandlers:[],removeAllHandlersOnTarget:function(target, eventTypeString) {
          for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == target && 
              (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
               JSEvents._removeHandler(i--);
             }
          }
        },_removeHandler:function(i) {
          var h = JSEvents.eventHandlers[i];
          h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
          JSEvents.eventHandlers.splice(i, 1);
        },registerOrRemoveHandler:function(eventHandler) {
          var jsEventHandler = function jsEventHandler(event) {
            // Increment nesting count for the event handler.
            ++JSEvents.inEventHandler;
            JSEvents.currentEventHandler = eventHandler;
            // Process any old deferred calls the user has placed.
            JSEvents.runDeferredCalls();
            // Process the actual event, calls back to user C code handler.
            eventHandler.handlerFunc(event);
            // Process any new deferred calls that were placed right now from this event handler.
            JSEvents.runDeferredCalls();
            // Out of event handler - restore nesting count.
            --JSEvents.inEventHandler;
          };
          
          if (eventHandler.callbackfunc) {
            eventHandler.eventListenerFunc = jsEventHandler;
            eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
            JSEvents.eventHandlers.push(eventHandler);
            JSEvents.registerRemoveEventListeners();
          } else {
            for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
              if (JSEvents.eventHandlers[i].target == eventHandler.target
               && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
                 JSEvents._removeHandler(i--);
               }
            }
          }
        },getNodeNameForTarget:function(target) {
          if (!target) return '';
          if (target == window) return '#window';
          if (target == screen) return '#screen';
          return (target && target.nodeName) ? target.nodeName : '';
        },fullscreenEnabled:function() {
          return document.fullscreenEnabled
          // Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitFullscreenEnabled.
          // TODO: If Safari at some point ships with unprefixed version, update the version check above.
          || document.webkitFullscreenEnabled
           ;
        }};
    
    function maybeCStringToJsString(cString) {
        // "cString > 2" checks if the input is a number, and isn't of the special
        // values we accept here, EMSCRIPTEN_EVENT_TARGET_* (which map to 0, 1, 2).
        // In other words, if cString > 2 then it's a pointer to a valid place in
        // memory, and points to a C string.
        return cString > 2 ? UTF8ToString(cString) : cString;
      }
    
    var specialHTMLTargets=[0, typeof document !== 'undefined' ? document : 0, typeof window !== 'undefined' ? window : 0];
    function findEventTarget(target) {
        target = maybeCStringToJsString(target);
        var domElement = specialHTMLTargets[target] || (typeof document !== 'undefined' ? document.querySelector(target) : undefined);
        return domElement;
      }
    
    function __getBoundingClientRect(e) {
        return specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {'left':0,'top':0};
      }
    function _emscripten_get_element_css_size(target, width, height) {
        target = findEventTarget(target);
        if (!target) return -4;
    
        var rect = __getBoundingClientRect(target);
        HEAPF64[((width)>>3)]=rect.width;
        HEAPF64[((height)>>3)]=rect.height;
    
        return 0;
      }

    function __webgl_enable_ANGLE_instanced_arrays(ctx) {
        // Extension available in WebGL 1 from Firefox 26 and Google Chrome 30 onwards. Core feature in WebGL 2.
        var ext = ctx.getExtension('ANGLE_instanced_arrays');
        if (ext) {
          ctx['vertexAttribDivisor'] = function(index, divisor) { ext['vertexAttribDivisorANGLE'](index, divisor); };
          ctx['drawArraysInstanced'] = function(mode, first, count, primcount) { ext['drawArraysInstancedANGLE'](mode, first, count, primcount); };
          ctx['drawElementsInstanced'] = function(mode, count, type, indices, primcount) { ext['drawElementsInstancedANGLE'](mode, count, type, indices, primcount); };
          return 1;
        }
      }
    
    function __webgl_enable_OES_vertex_array_object(ctx) {
        // Extension available in WebGL 1 from Firefox 25 and WebKit 536.28/desktop Safari 6.0.3 onwards. Core feature in WebGL 2.
        var ext = ctx.getExtension('OES_vertex_array_object');
        if (ext) {
          ctx['createVertexArray'] = function() { return ext['createVertexArrayOES'](); };
          ctx['deleteVertexArray'] = function(vao) { ext['deleteVertexArrayOES'](vao); };
          ctx['bindVertexArray'] = function(vao) { ext['bindVertexArrayOES'](vao); };
          ctx['isVertexArray'] = function(vao) { return ext['isVertexArrayOES'](vao); };
          return 1;
        }
      }
    
    function __webgl_enable_WEBGL_draw_buffers(ctx) {
        // Extension available in WebGL 1 from Firefox 28 onwards. Core feature in WebGL 2.
        var ext = ctx.getExtension('WEBGL_draw_buffers');
        if (ext) {
          ctx['drawBuffers'] = function(n, bufs) { ext['drawBuffersWEBGL'](n, bufs); };
          return 1;
        }
      }
    
    function __webgl_enable_WEBGL_multi_draw(ctx) {
        // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
        return !!(ctx.multiDrawWebgl = ctx.getExtension('WEBGL_multi_draw'));
      }
    var GL={counter:1,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:[],offscreenCanvases:{},timerQueriesEXT:[],programInfos:{},stringCache:{},unpackAlignment:4,recordError:function recordError(errorCode) {
          if (!GL.lastError) {
            GL.lastError = errorCode;
          }
        },getNewId:function(table) {
          var ret = GL.counter++;
          for (var i = table.length; i < ret; i++) {
            table[i] = null;
          }
          return ret;
        },getSource:function(shader, count, string, length) {
          var source = '';
          for (var i = 0; i < count; ++i) {
            var len = length ? HEAP32[(((length)+(i*4))>>2)] : -1;
            source += UTF8ToString(HEAP32[(((string)+(i*4))>>2)], len < 0 ? undefined : len);
          }
          return source;
        },createContext:function(canvas, webGLContextAttributes) {
    
    
    
    
    
          var ctx = 
            (canvas.getContext("webgl", webGLContextAttributes)
              // https://caniuse.com/#feat=webgl
              );
    
    
          if (!ctx) return 0;
    
          var handle = GL.registerContext(ctx, webGLContextAttributes);
    
    
    
          return handle;
        },registerContext:function(ctx, webGLContextAttributes) {
          // without pthreads a context is just an integer ID
          var handle = GL.getNewId(GL.contexts);
    
          var context = {
            handle: handle,
            attributes: webGLContextAttributes,
            version: webGLContextAttributes.majorVersion,
            GLctx: ctx
          };
    
    
          // Store the created context object so that we can access the context given a canvas without having to pass the parameters again.
          if (ctx.canvas) ctx.canvas.GLctxObject = context;
          GL.contexts[handle] = context;
          if (typeof webGLContextAttributes.enableExtensionsByDefault === 'undefined' || webGLContextAttributes.enableExtensionsByDefault) {
            GL.initExtensions(context);
          }
    
    
    
    
          return handle;
        },makeContextCurrent:function(contextHandle) {
    
          GL.currentContext = GL.contexts[contextHandle]; // Active Emscripten GL layer context object.
          Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx; // Active WebGL context object.
          return !(contextHandle && !GLctx);
        },getContext:function(contextHandle) {
          return GL.contexts[contextHandle];
        },deleteContext:function(contextHandle) {
          if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
          if (typeof JSEvents === 'object') JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas); // Release all JS event handlers on the DOM element that the GL context is associated with since the context is now deleted.
          if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined; // Make sure the canvas object no longer refers to the context object so there are no GC surprises.
          GL.contexts[contextHandle] = null;
        },initExtensions:function(context) {
          // If this function is called without a specific context object, init the extensions of the currently active context.
          if (!context) context = GL.currentContext;
    
          if (context.initExtensionsDone) return;
          context.initExtensionsDone = true;
    
          var GLctx = context.GLctx;
    
          // Detect the presence of a few extensions manually, this GL interop layer itself will need to know if they exist.
    
          // Extensions that are only available in WebGL 1 (the calls will be no-ops if called on a WebGL 2 context active)
          __webgl_enable_ANGLE_instanced_arrays(GLctx);
          __webgl_enable_OES_vertex_array_object(GLctx);
          __webgl_enable_WEBGL_draw_buffers(GLctx);
    
          GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
          __webgl_enable_WEBGL_multi_draw(GLctx);
    
          // These are the 'safe' feature-enabling extensions that don't add any performance impact related to e.g. debugging, and
          // should be enabled by default so that client GLES2/GL code will not need to go through extra hoops to get its stuff working.
          // As new extensions are ratified at http://www.khronos.org/registry/webgl/extensions/ , feel free to add your new extensions
          // here, as long as they don't produce a performance impact for users that might not be using those extensions.
          // E.g. debugging-related extensions should probably be off by default.
          var automaticallyEnabledExtensions = [ // Khronos ratified WebGL extensions ordered by number (no debug extensions):
                                                 "OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives",
                                                 "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture",
                                                 "OES_element_index_uint", "EXT_texture_filter_anisotropic", "EXT_frag_depth",
                                                 "WEBGL_draw_buffers", "ANGLE_instanced_arrays", "OES_texture_float_linear",
                                                 "OES_texture_half_float_linear", "EXT_blend_minmax", "EXT_shader_texture_lod",
                                                 "EXT_texture_norm16",
                                                 // Community approved WebGL extensions ordered by number:
                                                 "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float",
                                                 "EXT_sRGB", "WEBGL_compressed_texture_etc1", "EXT_disjoint_timer_query",
                                                 "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_astc", "EXT_color_buffer_float",
                                                 "WEBGL_compressed_texture_s3tc_srgb", "EXT_disjoint_timer_query_webgl2",
                                                 // Old style prefixed forms of extensions (but still currently used on e.g. iPhone Xs as
                                                 // tested on iOS 12.4.1):
                                                 "WEBKIT_WEBGL_compressed_texture_pvrtc"];
    
          var exts = GLctx.getSupportedExtensions() || []; // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
          exts.forEach(function(ext) {
            if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
              GLctx.getExtension(ext); // Calling .getExtension enables that extension permanently, no need to store the return value to be enabled.
            }
          });
        },populateUniformTable:function(program) {
          var p = GL.programs[program];
          var ptable = GL.programInfos[program] = {
            uniforms: {},
            maxUniformLength: 0, // This is eagerly computed below, since we already enumerate all uniforms anyway.
            maxAttributeLength: -1, // This is lazily computed and cached, computed when/if first asked, "-1" meaning not computed yet.
            maxUniformBlockNameLength: -1 // Lazily computed as well
          };
    
          var utable = ptable.uniforms;
          // A program's uniform table maps the string name of an uniform to an integer location of that uniform.
          // The global GL.uniforms map maps integer locations to WebGLUniformLocations.
          var numUniforms = GLctx.getProgramParameter(p, 0x8B86/*GL_ACTIVE_UNIFORMS*/);
          for (var i = 0; i < numUniforms; ++i) {
            var u = GLctx.getActiveUniform(p, i);
    
            var name = u.name;
            ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length+1);
    
            // If we are dealing with an array, e.g. vec4 foo[3], strip off the array index part to canonicalize that "foo", "foo[]",
            // and "foo[0]" will mean the same. Loop below will populate foo[1] and foo[2].
            if (name.slice(-1) == ']') {
              name = name.slice(0, name.lastIndexOf('['));
            }
    
            // Optimize memory usage slightly: If we have an array of uniforms, e.g. 'vec3 colors[3];', then
            // only store the string 'colors' in utable, and 'colors[0]', 'colors[1]' and 'colors[2]' will be parsed as 'colors'+i.
            // Note that for the GL.uniforms table, we still need to fetch the all WebGLUniformLocations for all the indices.
            var loc = GLctx.getUniformLocation(p, name);
            if (loc) {
              var id = GL.getNewId(GL.uniforms);
              utable[name] = [u.size, id];
              GL.uniforms[id] = loc;
    
              for (var j = 1; j < u.size; ++j) {
                var n = name + '['+j+']';
                loc = GLctx.getUniformLocation(p, n);
                id = GL.getNewId(GL.uniforms);
    
                GL.uniforms[id] = loc;
              }
            }
          }
        }};
    function _emscripten_glActiveTexture(x0) { GLctx['activeTexture'](x0); }

    function _emscripten_glAttachShader(program, shader) {
        GLctx.attachShader(GL.programs[program],
                                GL.shaders[shader]);
      }

    function _emscripten_glBeginQueryEXT(target, id) {
        GLctx.disjointTimerQueryExt['beginQueryEXT'](target, GL.timerQueriesEXT[id]);
      }

    function _emscripten_glBindAttribLocation(program, index, name) {
        GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
      }

    function _emscripten_glBindBuffer(target, buffer) {
    
        GLctx.bindBuffer(target, GL.buffers[buffer]);
      }

    function _emscripten_glBindFramebuffer(target, framebuffer) {
    
        GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
    
      }

    function _emscripten_glBindRenderbuffer(target, renderbuffer) {
        GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
      }

    function _emscripten_glBindTexture(target, texture) {
        GLctx.bindTexture(target, GL.textures[texture]);
      }

    function _emscripten_glBindVertexArrayOES(vao) {
        GLctx['bindVertexArray'](GL.vaos[vao]);
      }

    function _emscripten_glBlendColor(x0, x1, x2, x3) { GLctx['blendColor'](x0, x1, x2, x3); }

    function _emscripten_glBlendEquation(x0) { GLctx['blendEquation'](x0); }

    function _emscripten_glBlendEquationSeparate(x0, x1) { GLctx['blendEquationSeparate'](x0, x1); }

    function _emscripten_glBlendFunc(x0, x1) { GLctx['blendFunc'](x0, x1); }

    function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) { GLctx['blendFuncSeparate'](x0, x1, x2, x3); }

    function _emscripten_glBufferData(target, size, data, usage) {
    
          // N.b. here first form specifies a heap subarray, second form an integer size, so the ?: code here is polymorphic. It is advised to avoid
          // randomly mixing both uses in calling code, to avoid any potential JS engine JIT issues.
          GLctx.bufferData(target, data ? HEAPU8.subarray(data, data+size) : size, usage);
      }

    function _emscripten_glBufferSubData(target, offset, size, data) {
        GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
      }

    function _emscripten_glCheckFramebufferStatus(x0) { return GLctx['checkFramebufferStatus'](x0) }

    function _emscripten_glClear(x0) { GLctx['clear'](x0); }

    function _emscripten_glClearColor(x0, x1, x2, x3) { GLctx['clearColor'](x0, x1, x2, x3); }

    function _emscripten_glClearDepthf(x0) { GLctx['clearDepth'](x0); }

    function _emscripten_glClearStencil(x0) { GLctx['clearStencil'](x0); }

    function _emscripten_glColorMask(red, green, blue, alpha) {
        GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
      }

    function _emscripten_glCompileShader(shader) {
        GLctx.compileShader(GL.shaders[shader]);
      }

    function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
        GLctx['compressedTexImage2D'](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
      }

    function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
        GLctx['compressedTexSubImage2D'](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
      }

    function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexImage2D'](x0, x1, x2, x3, x4, x5, x6, x7); }

    function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexSubImage2D'](x0, x1, x2, x3, x4, x5, x6, x7); }

    function _emscripten_glCreateProgram() {
        var id = GL.getNewId(GL.programs);
        var program = GLctx.createProgram();
        program.name = id;
        GL.programs[id] = program;
        return id;
      }

    function _emscripten_glCreateShader(shaderType) {
        var id = GL.getNewId(GL.shaders);
        GL.shaders[id] = GLctx.createShader(shaderType);
        return id;
      }

    function _emscripten_glCullFace(x0) { GLctx['cullFace'](x0); }

    function _emscripten_glDeleteBuffers(n, buffers) {
        for (var i = 0; i < n; i++) {
          var id = HEAP32[(((buffers)+(i*4))>>2)];
          var buffer = GL.buffers[id];
    
          // From spec: "glDeleteBuffers silently ignores 0's and names that do not
          // correspond to existing buffer objects."
          if (!buffer) continue;
    
          GLctx.deleteBuffer(buffer);
          buffer.name = 0;
          GL.buffers[id] = null;
    
        }
      }

    function _emscripten_glDeleteFramebuffers(n, framebuffers) {
        for (var i = 0; i < n; ++i) {
          var id = HEAP32[(((framebuffers)+(i*4))>>2)];
          var framebuffer = GL.framebuffers[id];
          if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
          GLctx.deleteFramebuffer(framebuffer);
          framebuffer.name = 0;
          GL.framebuffers[id] = null;
        }
      }

    function _emscripten_glDeleteProgram(id) {
        if (!id) return;
        var program = GL.programs[id];
        if (!program) { // glDeleteProgram actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        GLctx.deleteProgram(program);
        program.name = 0;
        GL.programs[id] = null;
        GL.programInfos[id] = null;
      }

    function _emscripten_glDeleteQueriesEXT(n, ids) {
        for (var i = 0; i < n; i++) {
          var id = HEAP32[(((ids)+(i*4))>>2)];
          var query = GL.timerQueriesEXT[id];
          if (!query) continue; // GL spec: "unused names in ids are ignored, as is the name zero."
          GLctx.disjointTimerQueryExt['deleteQueryEXT'](query);
          GL.timerQueriesEXT[id] = null;
        }
      }

    function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
        for (var i = 0; i < n; i++) {
          var id = HEAP32[(((renderbuffers)+(i*4))>>2)];
          var renderbuffer = GL.renderbuffers[id];
          if (!renderbuffer) continue; // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
          GLctx.deleteRenderbuffer(renderbuffer);
          renderbuffer.name = 0;
          GL.renderbuffers[id] = null;
        }
      }

    function _emscripten_glDeleteShader(id) {
        if (!id) return;
        var shader = GL.shaders[id];
        if (!shader) { // glDeleteShader actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        GLctx.deleteShader(shader);
        GL.shaders[id] = null;
      }

    function _emscripten_glDeleteTextures(n, textures) {
        for (var i = 0; i < n; i++) {
          var id = HEAP32[(((textures)+(i*4))>>2)];
          var texture = GL.textures[id];
          if (!texture) continue; // GL spec: "glDeleteTextures silently ignores 0s and names that do not correspond to existing textures".
          GLctx.deleteTexture(texture);
          texture.name = 0;
          GL.textures[id] = null;
        }
      }

    function _emscripten_glDeleteVertexArraysOES(n, vaos) {
        for (var i = 0; i < n; i++) {
          var id = HEAP32[(((vaos)+(i*4))>>2)];
          GLctx['deleteVertexArray'](GL.vaos[id]);
          GL.vaos[id] = null;
        }
      }

    function _emscripten_glDepthFunc(x0) { GLctx['depthFunc'](x0); }

    function _emscripten_glDepthMask(flag) {
        GLctx.depthMask(!!flag);
      }

    function _emscripten_glDepthRangef(x0, x1) { GLctx['depthRange'](x0, x1); }

    function _emscripten_glDetachShader(program, shader) {
        GLctx.detachShader(GL.programs[program],
                                GL.shaders[shader]);
      }

    function _emscripten_glDisable(x0) { GLctx['disable'](x0); }

    function _emscripten_glDisableVertexAttribArray(index) {
        GLctx.disableVertexAttribArray(index);
      }

    function _emscripten_glDrawArrays(mode, first, count) {
    
        GLctx.drawArrays(mode, first, count);
    
      }

    function _emscripten_glDrawArraysInstancedANGLE(mode, first, count, primcount) {
        GLctx['drawArraysInstanced'](mode, first, count, primcount);
      }

    var tempFixedLengthArray=[];
    function _emscripten_glDrawBuffersWEBGL(n, bufs) {
    
        var bufArray = tempFixedLengthArray[n];
        for (var i = 0; i < n; i++) {
          bufArray[i] = HEAP32[(((bufs)+(i*4))>>2)];
        }
    
        GLctx['drawBuffers'](bufArray);
      }

    function _emscripten_glDrawElements(mode, count, type, indices) {
    
        GLctx.drawElements(mode, count, type, indices);
    
      }

    function _emscripten_glDrawElementsInstancedANGLE(mode, count, type, indices, primcount) {
        GLctx['drawElementsInstanced'](mode, count, type, indices, primcount);
      }

    function _emscripten_glEnable(x0) { GLctx['enable'](x0); }

    function _emscripten_glEnableVertexAttribArray(index) {
        GLctx.enableVertexAttribArray(index);
      }

    function _emscripten_glEndQueryEXT(target) {
        GLctx.disjointTimerQueryExt['endQueryEXT'](target);
      }

    function _emscripten_glFinish() { GLctx['finish'](); }

    function _emscripten_glFlush() { GLctx['flush'](); }

    function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
        GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget,
                                           GL.renderbuffers[renderbuffer]);
      }

    function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
        GLctx.framebufferTexture2D(target, attachment, textarget,
                                        GL.textures[texture], level);
      }

    function _emscripten_glFrontFace(x0) { GLctx['frontFace'](x0); }

    function __glGenObject(n, buffers, createFunction, objectTable
        ) {
        for (var i = 0; i < n; i++) {
          var buffer = GLctx[createFunction]();
          var id = buffer && GL.getNewId(objectTable);
          if (buffer) {
            buffer.name = id;
            objectTable[id] = buffer;
          } else {
            GL.recordError(0x502 /* GL_INVALID_OPERATION */);
          }
          HEAP32[(((buffers)+(i*4))>>2)]=id;
        }
      }
    function _emscripten_glGenBuffers(n, buffers) {
        __glGenObject(n, buffers, 'createBuffer', GL.buffers
          );
      }

    function _emscripten_glGenFramebuffers(n, ids) {
        __glGenObject(n, ids, 'createFramebuffer', GL.framebuffers
          );
      }

    function _emscripten_glGenQueriesEXT(n, ids) {
        for (var i = 0; i < n; i++) {
          var query = GLctx.disjointTimerQueryExt['createQueryEXT']();
          if (!query) {
            GL.recordError(0x502 /* GL_INVALID_OPERATION */);
            while(i < n) HEAP32[(((ids)+(i++*4))>>2)]=0;
            return;
          }
          var id = GL.getNewId(GL.timerQueriesEXT);
          query.name = id;
          GL.timerQueriesEXT[id] = query;
          HEAP32[(((ids)+(i*4))>>2)]=id;
        }
      }

    function _emscripten_glGenRenderbuffers(n, renderbuffers) {
        __glGenObject(n, renderbuffers, 'createRenderbuffer', GL.renderbuffers
          );
      }

    function _emscripten_glGenTextures(n, textures) {
        __glGenObject(n, textures, 'createTexture', GL.textures
          );
      }

    function _emscripten_glGenVertexArraysOES(n, arrays) {
        __glGenObject(n, arrays, 'createVertexArray', GL.vaos
          );
      }

    function _emscripten_glGenerateMipmap(x0) { GLctx['generateMipmap'](x0); }

    function __glGetActiveAttribOrUniform(funcName, program, index, bufSize, length, size, type, name) {
        program = GL.programs[program];
        var info = GLctx[funcName](program, index);
        if (info) { // If an error occurs, nothing will be written to length, size and type and name.
          var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
          if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
          if (size) HEAP32[((size)>>2)]=info.size;
          if (type) HEAP32[((type)>>2)]=info.type;
        }
      }
    function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
        __glGetActiveAttribOrUniform('getActiveAttrib', program, index, bufSize, length, size, type, name);
      }

    function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
        __glGetActiveAttribOrUniform('getActiveUniform', program, index, bufSize, length, size, type, name);
      }

    function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
        var result = GLctx.getAttachedShaders(GL.programs[program]);
        var len = result.length;
        if (len > maxCount) {
          len = maxCount;
        }
        HEAP32[((count)>>2)]=len;
        for (var i = 0; i < len; ++i) {
          var id = GL.shaders.indexOf(result[i]);
          HEAP32[(((shaders)+(i*4))>>2)]=id;
        }
      }

    function _emscripten_glGetAttribLocation(program, name) {
        return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
      }

    function readI53FromI64(ptr) {
        return HEAPU32[ptr>>2] + HEAP32[ptr+4>>2] * 4294967296;
      }
    
    function readI53FromU64(ptr) {
        return HEAPU32[ptr>>2] + HEAPU32[ptr+4>>2] * 4294967296;
      }
    function writeI53ToI64(ptr, num) {
        HEAPU32[ptr>>2] = num;
        HEAPU32[ptr+4>>2] = (num - HEAPU32[ptr>>2])/4294967296;
        var deserialized = (num >= 0) ? readI53FromU64(ptr) : readI53FromI64(ptr);
        if (deserialized != num) warnOnce('writeI53ToI64() out of range: serialized JS Number ' + num + ' to Wasm heap as bytes lo=0x' + HEAPU32[ptr>>2].toString(16) + ', hi=0x' + HEAPU32[ptr+4>>2].toString(16) + ', which deserializes back to ' + deserialized + ' instead!');
      }
    function emscriptenWebGLGet(name_, p, type) {
        // Guard against user passing a null pointer.
        // Note that GLES2 spec does not say anything about how passing a null pointer should be treated.
        // Testing on desktop core GL 3, the application crashes on glGetIntegerv to a null pointer, but
        // better to report an error instead of doing anything random.
        if (!p) {
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        var ret = undefined;
        switch(name_) { // Handle a few trivial GLES values
          case 0x8DFA: // GL_SHADER_COMPILER
            ret = 1;
            break;
          case 0x8DF8: // GL_SHADER_BINARY_FORMATS
            if (type != 0 && type != 1) {
              GL.recordError(0x500); // GL_INVALID_ENUM
            }
            return; // Do not write anything to the out pointer, since no binary formats are supported.
          case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
            ret = 0;
            break;
          case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
            // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be queried for length),
            // so implement it ourselves to allow C++ GLES2 code get the length.
            var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
            ret = formats ? formats.length : 0;
            break;
        }
    
        if (ret === undefined) {
          var result = GLctx.getParameter(name_);
          switch (typeof(result)) {
            case "number":
              ret = result;
              break;
            case "boolean":
              ret = result ? 1 : 0;
              break;
            case "string":
              GL.recordError(0x500); // GL_INVALID_ENUM
              return;
            case "object":
              if (result === null) {
                // null is a valid result for some (e.g., which buffer is bound - perhaps nothing is bound), but otherwise
                // can mean an invalid name_, which we need to report as an error
                switch(name_) {
                  case 0x8894: // ARRAY_BUFFER_BINDING
                  case 0x8B8D: // CURRENT_PROGRAM
                  case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                  case 0x8CA6: // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
                  case 0x8CA7: // RENDERBUFFER_BINDING
                  case 0x8069: // TEXTURE_BINDING_2D
                  case 0x85B5: // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
                  case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                    ret = 0;
                    break;
                  }
                  default: {
                    GL.recordError(0x500); // GL_INVALID_ENUM
                    return;
                  }
                }
              } else if (result instanceof Float32Array ||
                         result instanceof Uint32Array ||
                         result instanceof Int32Array ||
                         result instanceof Array) {
                for (var i = 0; i < result.length; ++i) {
                  switch (type) {
                    case 0: HEAP32[(((p)+(i*4))>>2)]=result[i]; break;
                    case 2: HEAPF32[(((p)+(i*4))>>2)]=result[i]; break;
                    case 4: HEAP8[(((p)+(i))>>0)]=result[i] ? 1 : 0; break;
                  }
                }
                return;
              } else {
                try {
                  ret = result.name | 0;
                } catch(e) {
                  GL.recordError(0x500); // GL_INVALID_ENUM
                  err('GL_INVALID_ENUM in glGet' + type + 'v: Unknown object returned from WebGL getParameter(' + name_ + ')! (error: ' + e + ')');
                  return;
                }
              }
              break;
            default:
              GL.recordError(0x500); // GL_INVALID_ENUM
              err('GL_INVALID_ENUM in glGet' + type + 'v: Native code calling glGet' + type + 'v(' + name_ + ') and it returns ' + result + ' of type ' + typeof(result) + '!');
              return;
          }
        }
    
        switch (type) {
          case 1: writeI53ToI64(p, ret); break;
          case 0: HEAP32[((p)>>2)]=ret; break;
          case 2:   HEAPF32[((p)>>2)]=ret; break;
          case 4: HEAP8[((p)>>0)]=ret ? 1 : 0; break;
        }
      }
    function _emscripten_glGetBooleanv(name_, p) {
        emscriptenWebGLGet(name_, p, 4);
      }

    function _emscripten_glGetBufferParameteriv(target, value, data) {
        if (!data) {
          // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
          // if data == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        HEAP32[((data)>>2)]=GLctx.getBufferParameter(target, value);
      }

    function _emscripten_glGetError() {
        var error = GLctx.getError() || GL.lastError;
        GL.lastError = 0/*GL_NO_ERROR*/;
        return error;
      }

    function _emscripten_glGetFloatv(name_, p) {
        emscriptenWebGLGet(name_, p, 2);
      }

    function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
        var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
        if (result instanceof WebGLRenderbuffer ||
            result instanceof WebGLTexture) {
          result = result.name | 0;
        }
        HEAP32[((params)>>2)]=result;
      }

    function _emscripten_glGetIntegerv(name_, p) {
        emscriptenWebGLGet(name_, p, 0);
      }

    function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = '(unknown error)';
        var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      }

    function _emscripten_glGetProgramiv(program, pname, p) {
        if (!p) {
          // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
    
        if (program >= GL.counter) {
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
    
        var ptable = GL.programInfos[program];
        if (!ptable) {
          GL.recordError(0x502 /* GL_INVALID_OPERATION */);
          return;
        }
    
        if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
          var log = GLctx.getProgramInfoLog(GL.programs[program]);
          if (log === null) log = '(unknown error)';
          HEAP32[((p)>>2)]=log.length + 1;
        } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
          HEAP32[((p)>>2)]=ptable.maxUniformLength;
        } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
          if (ptable.maxAttributeLength == -1) {
            program = GL.programs[program];
            var numAttribs = GLctx.getProgramParameter(program, 0x8B89/*GL_ACTIVE_ATTRIBUTES*/);
            ptable.maxAttributeLength = 0; // Spec says if there are no active attribs, 0 must be returned.
            for (var i = 0; i < numAttribs; ++i) {
              var activeAttrib = GLctx.getActiveAttrib(program, i);
              ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length+1);
            }
          }
          HEAP32[((p)>>2)]=ptable.maxAttributeLength;
        } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
          if (ptable.maxUniformBlockNameLength == -1) {
            program = GL.programs[program];
            var numBlocks = GLctx.getProgramParameter(program, 0x8A36/*GL_ACTIVE_UNIFORM_BLOCKS*/);
            ptable.maxUniformBlockNameLength = 0;
            for (var i = 0; i < numBlocks; ++i) {
              var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
              ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length+1);
            }
          }
          HEAP32[((p)>>2)]=ptable.maxUniformBlockNameLength;
        } else {
          HEAP32[((p)>>2)]=GLctx.getProgramParameter(GL.programs[program], pname);
        }
      }

    function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        var query = GL.timerQueriesEXT[id];
        var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
        var ret;
        if (typeof param == 'boolean') {
          ret = param ? 1 : 0;
        } else {
          ret = param;
        }
        writeI53ToI64(params, ret);
      }

    function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        var query = GL.timerQueriesEXT[id];
        var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
        var ret;
        if (typeof param == 'boolean') {
          ret = param ? 1 : 0;
        } else {
          ret = param;
        }
        HEAP32[((params)>>2)]=ret;
      }

    function _emscripten_glGetQueryObjectui64vEXT(id, pname, params) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        var query = GL.timerQueriesEXT[id];
        var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
        var ret;
        if (typeof param == 'boolean') {
          ret = param ? 1 : 0;
        } else {
          ret = param;
        }
        writeI53ToI64(params, ret);
      }

    function _emscripten_glGetQueryObjectuivEXT(id, pname, params) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        var query = GL.timerQueriesEXT[id];
        var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
        var ret;
        if (typeof param == 'boolean') {
          ret = param ? 1 : 0;
        } else {
          ret = param;
        }
        HEAP32[((params)>>2)]=ret;
      }

    function _emscripten_glGetQueryivEXT(target, pname, params) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        HEAP32[((params)>>2)]=GLctx.disjointTimerQueryExt['getQueryEXT'](target, pname);
      }

    function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if params == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        HEAP32[((params)>>2)]=GLctx.getRenderbufferParameter(target, pname);
      }

    function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      }

    function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
        var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
        HEAP32[((range)>>2)]=result.rangeMin;
        HEAP32[(((range)+(4))>>2)]=result.rangeMax;
        HEAP32[((precision)>>2)]=result.precision;
      }

    function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
        var result = GLctx.getShaderSource(GL.shaders[shader]);
        if (!result) return; // If an error occurs, nothing will be written to length or source.
        var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      }

    function _emscripten_glGetShaderiv(shader, pname, p) {
        if (!p) {
          // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
          var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
          if (log === null) log = '(unknown error)';
          // The GLES2 specification says that if the shader has an empty info log,
          // a value of 0 is returned. Otherwise the log has a null char appended.
          // (An empty string is falsey, so we can just check that instead of
          // looking at log.length.)
          var logLength = log ? log.length + 1 : 0;
          HEAP32[((p)>>2)]=logLength;
        } else if (pname == 0x8B88) { // GL_SHADER_SOURCE_LENGTH
          var source = GLctx.getShaderSource(GL.shaders[shader]);
          // source may be a null, or the empty string, both of which are falsey
          // values that we report a 0 length for.
          var sourceLength = source ? source.length + 1 : 0;
          HEAP32[((p)>>2)]=sourceLength;
        } else {
          HEAP32[((p)>>2)]=GLctx.getShaderParameter(GL.shaders[shader], pname);
        }
      }

    function stringToNewUTF8(jsString) {
        var length = lengthBytesUTF8(jsString)+1;
        var cString = _malloc(length);
        stringToUTF8(jsString, cString, length);
        return cString;
      }
    function _emscripten_glGetString(name_) {
        if (GL.stringCache[name_]) return GL.stringCache[name_];
        var ret;
        switch(name_) {
          case 0x1F03 /* GL_EXTENSIONS */:
            var exts = GLctx.getSupportedExtensions() || []; // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
            exts = exts.concat(exts.map(function(e) { return "GL_" + e; }));
            ret = stringToNewUTF8(exts.join(' '));
            break;
          case 0x1F00 /* GL_VENDOR */:
          case 0x1F01 /* GL_RENDERER */:
          case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
          case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
            var s = GLctx.getParameter(name_);
            if (!s) {
              GL.recordError(0x500/*GL_INVALID_ENUM*/);
            }
            ret = stringToNewUTF8(s);
            break;
    
          case 0x1F02 /* GL_VERSION */:
            var glVersion = GLctx.getParameter(0x1F02 /*GL_VERSION*/);
            // return GLES version string corresponding to the version of the WebGL context
            {
              glVersion = 'OpenGL ES 2.0 (' + glVersion + ')';
            }
            ret = stringToNewUTF8(glVersion);
            break;
          case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
            var glslVersion = GLctx.getParameter(0x8B8C /*GL_SHADING_LANGUAGE_VERSION*/);
            // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
              if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
              glslVersion = 'OpenGL ES GLSL ES ' + ver_num[1] + ' (' + glslVersion + ')';
            }
            ret = stringToNewUTF8(glslVersion);
            break;
          default:
            GL.recordError(0x500/*GL_INVALID_ENUM*/);
            return 0;
        }
        GL.stringCache[name_] = ret;
        return ret;
      }

    function _emscripten_glGetTexParameterfv(target, pname, params) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        HEAPF32[((params)>>2)]=GLctx.getTexParameter(target, pname);
      }

    function _emscripten_glGetTexParameteriv(target, pname, params) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if p == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        HEAP32[((params)>>2)]=GLctx.getTexParameter(target, pname);
      }

    /** @suppress {checkTypes} */
    function jstoi_q(str) {
        return parseInt(str);
      }
    function _emscripten_glGetUniformLocation(program, name) {
        name = UTF8ToString(name);
    
        var arrayIndex = 0;
        // If user passed an array accessor "[index]", parse the array index off the accessor.
        if (name[name.length - 1] == ']') {
          var leftBrace = name.lastIndexOf('[');
          arrayIndex = name[leftBrace+1] != ']' ? jstoi_q(name.slice(leftBrace + 1)) : 0; // "index]", parseInt will ignore the ']' at the end; but treat "foo[]" as "foo[0]"
          name = name.slice(0, leftBrace);
        }
    
        var uniformInfo = GL.programInfos[program] && GL.programInfos[program].uniforms[name]; // returns pair [ dimension_of_uniform_array, uniform_location ]
        if (uniformInfo && arrayIndex >= 0 && arrayIndex < uniformInfo[0]) { // Check if user asked for an out-of-bounds element, i.e. for 'vec4 colors[3];' user could ask for 'colors[10]' which should return -1.
          return uniformInfo[1] + arrayIndex;
        } else {
          return -1;
        }
      }

    /** @suppress{checkTypes} */
    function emscriptenWebGLGetUniform(program, location, params, type) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if params == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        var data = GLctx.getUniform(GL.programs[program], GL.uniforms[location]);
        if (typeof data == 'number' || typeof data == 'boolean') {
          switch (type) {
            case 0: HEAP32[((params)>>2)]=data; break;
            case 2: HEAPF32[((params)>>2)]=data; break;
          }
        } else {
          for (var i = 0; i < data.length; i++) {
            switch (type) {
              case 0: HEAP32[(((params)+(i*4))>>2)]=data[i]; break;
              case 2: HEAPF32[(((params)+(i*4))>>2)]=data[i]; break;
            }
          }
        }
      }
    function _emscripten_glGetUniformfv(program, location, params) {
        emscriptenWebGLGetUniform(program, location, params, 2);
      }

    function _emscripten_glGetUniformiv(program, location, params) {
        emscriptenWebGLGetUniform(program, location, params, 0);
      }

    function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
        if (!pointer) {
          // GLES2 specification does not specify how to behave if pointer is a null pointer. Since calling this function does not make sense
          // if pointer == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        HEAP32[((pointer)>>2)]=GLctx.getVertexAttribOffset(index, pname);
      }

    /** @suppress{checkTypes} */
    function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
        if (!params) {
          // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
          // if params == null, issue a GL error to notify user about it.
          GL.recordError(0x501 /* GL_INVALID_VALUE */);
          return;
        }
        var data = GLctx.getVertexAttrib(index, pname);
        if (pname == 0x889F/*VERTEX_ATTRIB_ARRAY_BUFFER_BINDING*/) {
          HEAP32[((params)>>2)]=data && data["name"];
        } else if (typeof data == 'number' || typeof data == 'boolean') {
          switch (type) {
            case 0: HEAP32[((params)>>2)]=data; break;
            case 2: HEAPF32[((params)>>2)]=data; break;
            case 5: HEAP32[((params)>>2)]=Math.fround(data); break;
          }
        } else {
          for (var i = 0; i < data.length; i++) {
            switch (type) {
              case 0: HEAP32[(((params)+(i*4))>>2)]=data[i]; break;
              case 2: HEAPF32[(((params)+(i*4))>>2)]=data[i]; break;
              case 5: HEAP32[(((params)+(i*4))>>2)]=Math.fround(data[i]); break;
            }
          }
        }
      }
    function _emscripten_glGetVertexAttribfv(index, pname, params) {
        // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttrib*f(),
        // otherwise the results are undefined. (GLES3 spec 6.1.12)
        emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
      }

    function _emscripten_glGetVertexAttribiv(index, pname, params) {
        // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttrib*f(),
        // otherwise the results are undefined. (GLES3 spec 6.1.12)
        emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
      }

    function _emscripten_glHint(x0, x1) { GLctx['hint'](x0, x1); }

    function _emscripten_glIsBuffer(buffer) {
        var b = GL.buffers[buffer];
        if (!b) return 0;
        return GLctx.isBuffer(b);
      }

    function _emscripten_glIsEnabled(x0) { return GLctx['isEnabled'](x0) }

    function _emscripten_glIsFramebuffer(framebuffer) {
        var fb = GL.framebuffers[framebuffer];
        if (!fb) return 0;
        return GLctx.isFramebuffer(fb);
      }

    function _emscripten_glIsProgram(program) {
        program = GL.programs[program];
        if (!program) return 0;
        return GLctx.isProgram(program);
      }

    function _emscripten_glIsQueryEXT(id) {
        var query = GL.timerQueriesEXT[id];
        if (!query) return 0;
        return GLctx.disjointTimerQueryExt['isQueryEXT'](query);
      }

    function _emscripten_glIsRenderbuffer(renderbuffer) {
        var rb = GL.renderbuffers[renderbuffer];
        if (!rb) return 0;
        return GLctx.isRenderbuffer(rb);
      }

    function _emscripten_glIsShader(shader) {
        var s = GL.shaders[shader];
        if (!s) return 0;
        return GLctx.isShader(s);
      }

    function _emscripten_glIsTexture(id) {
        var texture = GL.textures[id];
        if (!texture) return 0;
        return GLctx.isTexture(texture);
      }

    function _emscripten_glIsVertexArrayOES(array) {
    
        var vao = GL.vaos[array];
        if (!vao) return 0;
        return GLctx['isVertexArray'](vao);
      }

    function _emscripten_glLineWidth(x0) { GLctx['lineWidth'](x0); }

    function _emscripten_glLinkProgram(program) {
        GLctx.linkProgram(GL.programs[program]);
        GL.populateUniformTable(program);
      }

    function _emscripten_glPixelStorei(pname, param) {
        if (pname == 0xCF5 /* GL_UNPACK_ALIGNMENT */) {
          GL.unpackAlignment = param;
        }
        GLctx.pixelStorei(pname, param);
      }

    function _emscripten_glPolygonOffset(x0, x1) { GLctx['polygonOffset'](x0, x1); }

    function _emscripten_glQueryCounterEXT(id, target) {
        GLctx.disjointTimerQueryExt['queryCounterEXT'](GL.timerQueriesEXT[id], target);
      }

    function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
        function roundedToNextMultipleOf(x, y) {
          return (x + y - 1) & -y;
        }
        var plainRowSize = width * sizePerPixel;
        var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
        return height * alignedRowSize;
      }
    
    function __colorChannelsInGlTextureFormat(format) {
        // Micro-optimizations for size: map format to size by subtracting smallest enum value (0x1902) from all values first.
        // Also omit the most common size value (1) from the list, which is assumed by formats not on the list.
        var colorChannels = {
          // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
          // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
          5: 3,
          6: 4,
          // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
          8: 2,
          29502: 3,
          29504: 4,
        };
        return colorChannels[format - 0x1902]||1;
      }
    
    function heapObjectForWebGLType(type) {
        // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
        // smaller values for the heap, for shorter generated code size.
        // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
        // (since most types are HEAPU16)
        type -= 0x1400;
    
        if (type == 1) return HEAPU8;
    
    
        if (type == 4) return HEAP32;
    
        if (type == 6) return HEAPF32;
    
        if (type == 5
          || type == 28922
          )
          return HEAPU32;
    
        return HEAPU16;
      }
    
    function heapAccessShiftForWebGLHeap(heap) {
        return 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
      }
    function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
        var heap = heapObjectForWebGLType(type);
        var shift = heapAccessShiftForWebGLHeap(heap);
        var byteSize = 1<<shift;
        var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
        var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
        return heap.subarray(pixels >> shift, pixels + bytes >> shift);
      }
    function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
        var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels);
        if (!pixelData) {
          GL.recordError(0x500/*GL_INVALID_ENUM*/);
          return;
        }
        GLctx.readPixels(x, y, width, height, format, type, pixelData);
      }

    function _emscripten_glReleaseShaderCompiler() {
        // NOP (as allowed by GLES 2.0 spec)
      }

    function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) { GLctx['renderbufferStorage'](x0, x1, x2, x3); }

    function _emscripten_glSampleCoverage(value, invert) {
        GLctx.sampleCoverage(value, !!invert);
      }

    function _emscripten_glScissor(x0, x1, x2, x3) { GLctx['scissor'](x0, x1, x2, x3); }

    function _emscripten_glShaderBinary() {
        GL.recordError(0x500/*GL_INVALID_ENUM*/);
      }

    function _emscripten_glShaderSource(shader, count, string, length) {
        var source = GL.getSource(shader, count, string, length);
    
    
        GLctx.shaderSource(GL.shaders[shader], source);
      }

    function _emscripten_glStencilFunc(x0, x1, x2) { GLctx['stencilFunc'](x0, x1, x2); }

    function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) { GLctx['stencilFuncSeparate'](x0, x1, x2, x3); }

    function _emscripten_glStencilMask(x0) { GLctx['stencilMask'](x0); }

    function _emscripten_glStencilMaskSeparate(x0, x1) { GLctx['stencilMaskSeparate'](x0, x1); }

    function _emscripten_glStencilOp(x0, x1, x2) { GLctx['stencilOp'](x0, x1, x2); }

    function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) { GLctx['stencilOpSeparate'](x0, x1, x2, x3); }

    function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
        GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels) : null);
      }

    function _emscripten_glTexParameterf(x0, x1, x2) { GLctx['texParameterf'](x0, x1, x2); }

    function _emscripten_glTexParameterfv(target, pname, params) {
        var param = HEAPF32[((params)>>2)];
        GLctx.texParameterf(target, pname, param);
      }

    function _emscripten_glTexParameteri(x0, x1, x2) { GLctx['texParameteri'](x0, x1, x2); }

    function _emscripten_glTexParameteriv(target, pname, params) {
        var param = HEAP32[((params)>>2)];
        GLctx.texParameteri(target, pname, param);
      }

    function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
        var pixelData = null;
        if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels);
        GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
      }

    function _emscripten_glUniform1f(location, v0) {
        GLctx.uniform1f(GL.uniforms[location], v0);
      }

    var miniTempWebGLFloatBuffers=[];
    function _emscripten_glUniform1fv(location, count, value) {
    
    
    
        if (count <= 288) {
          // avoid allocation when uploading few enough uniforms
          var view = miniTempWebGLFloatBuffers[count-1];
          for (var i = 0; i < count; ++i) {
            view[i] = HEAPF32[(((value)+(4*i))>>2)];
          }
        } else
        {
          var view = HEAPF32.subarray((value)>>2,(value+count*4)>>2);
        }
        GLctx.uniform1fv(GL.uniforms[location], view);
      }

    function _emscripten_glUniform1i(location, v0) {
        GLctx.uniform1i(GL.uniforms[location], v0);
      }

    var __miniTempWebGLIntBuffers=[];
    function _emscripten_glUniform1iv(location, count, value) {
    
    
    
        if (count <= 288) {
          // avoid allocation when uploading few enough uniforms
          var view = __miniTempWebGLIntBuffers[count-1];
          for (var i = 0; i < count; ++i) {
            view[i] = HEAP32[(((value)+(4*i))>>2)];
          }
        } else
        {
          var view = HEAP32.subarray((value)>>2,(value+count*4)>>2);
        }
        GLctx.uniform1iv(GL.uniforms[location], view);
      }

    function _emscripten_glUniform2f(location, v0, v1) {
        GLctx.uniform2f(GL.uniforms[location], v0, v1);
      }

    function _emscripten_glUniform2fv(location, count, value) {
    
    
    
        if (count <= 144) {
          // avoid allocation when uploading few enough uniforms
          var view = miniTempWebGLFloatBuffers[2*count-1];
          for (var i = 0; i < 2*count; i += 2) {
            view[i] = HEAPF32[(((value)+(4*i))>>2)];
            view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          }
        } else
        {
          var view = HEAPF32.subarray((value)>>2,(value+count*8)>>2);
        }
        GLctx.uniform2fv(GL.uniforms[location], view);
      }

    function _emscripten_glUniform2i(location, v0, v1) {
        GLctx.uniform2i(GL.uniforms[location], v0, v1);
      }

    function _emscripten_glUniform2iv(location, count, value) {
    
    
    
        if (count <= 144) {
          // avoid allocation when uploading few enough uniforms
          var view = __miniTempWebGLIntBuffers[2*count-1];
          for (var i = 0; i < 2*count; i += 2) {
            view[i] = HEAP32[(((value)+(4*i))>>2)];
            view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
          }
        } else
        {
          var view = HEAP32.subarray((value)>>2,(value+count*8)>>2);
        }
        GLctx.uniform2iv(GL.uniforms[location], view);
      }

    function _emscripten_glUniform3f(location, v0, v1, v2) {
        GLctx.uniform3f(GL.uniforms[location], v0, v1, v2);
      }

    function _emscripten_glUniform3fv(location, count, value) {
    
    
    
        if (count <= 96) {
          // avoid allocation when uploading few enough uniforms
          var view = miniTempWebGLFloatBuffers[3*count-1];
          for (var i = 0; i < 3*count; i += 3) {
            view[i] = HEAPF32[(((value)+(4*i))>>2)];
            view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
            view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          }
        } else
        {
          var view = HEAPF32.subarray((value)>>2,(value+count*12)>>2);
        }
        GLctx.uniform3fv(GL.uniforms[location], view);
      }

    function _emscripten_glUniform3i(location, v0, v1, v2) {
        GLctx.uniform3i(GL.uniforms[location], v0, v1, v2);
      }

    function _emscripten_glUniform3iv(location, count, value) {
    
    
    
        if (count <= 96) {
          // avoid allocation when uploading few enough uniforms
          var view = __miniTempWebGLIntBuffers[3*count-1];
          for (var i = 0; i < 3*count; i += 3) {
            view[i] = HEAP32[(((value)+(4*i))>>2)];
            view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
            view[i+2] = HEAP32[(((value)+(4*i+8))>>2)];
          }
        } else
        {
          var view = HEAP32.subarray((value)>>2,(value+count*12)>>2);
        }
        GLctx.uniform3iv(GL.uniforms[location], view);
      }

    function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
        GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3);
      }

    function _emscripten_glUniform4fv(location, count, value) {
    
    
    
        if (count <= 72) {
          // avoid allocation when uploading few enough uniforms
          var view = miniTempWebGLFloatBuffers[4*count-1];
          // hoist the heap out of the loop for size and for pthreads+growth.
          var heap = HEAPF32;
          value >>= 2;
          for (var i = 0; i < 4 * count; i += 4) {
            var dst = value + i;
            view[i] = heap[dst];
            view[i + 1] = heap[dst + 1];
            view[i + 2] = heap[dst + 2];
            view[i + 3] = heap[dst + 3];
          }
        } else
        {
          var view = HEAPF32.subarray((value)>>2,(value+count*16)>>2);
        }
        GLctx.uniform4fv(GL.uniforms[location], view);
      }

    function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
        GLctx.uniform4i(GL.uniforms[location], v0, v1, v2, v3);
      }

    function _emscripten_glUniform4iv(location, count, value) {
    
    
    
        if (count <= 72) {
          // avoid allocation when uploading few enough uniforms
          var view = __miniTempWebGLIntBuffers[4*count-1];
          for (var i = 0; i < 4*count; i += 4) {
            view[i] = HEAP32[(((value)+(4*i))>>2)];
            view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
            view[i+2] = HEAP32[(((value)+(4*i+8))>>2)];
            view[i+3] = HEAP32[(((value)+(4*i+12))>>2)];
          }
        } else
        {
          var view = HEAP32.subarray((value)>>2,(value+count*16)>>2);
        }
        GLctx.uniform4iv(GL.uniforms[location], view);
      }

    function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
    
    
    
        if (count <= 72) {
          // avoid allocation when uploading few enough uniforms
          var view = miniTempWebGLFloatBuffers[4*count-1];
          for (var i = 0; i < 4*count; i += 4) {
            view[i] = HEAPF32[(((value)+(4*i))>>2)];
            view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
            view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
            view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
          }
        } else
        {
          var view = HEAPF32.subarray((value)>>2,(value+count*16)>>2);
        }
        GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, view);
      }

    function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
    
    
    
        if (count <= 32) {
          // avoid allocation when uploading few enough uniforms
          var view = miniTempWebGLFloatBuffers[9*count-1];
          for (var i = 0; i < 9*count; i += 9) {
            view[i] = HEAPF32[(((value)+(4*i))>>2)];
            view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
            view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
            view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
            view[i+4] = HEAPF32[(((value)+(4*i+16))>>2)];
            view[i+5] = HEAPF32[(((value)+(4*i+20))>>2)];
            view[i+6] = HEAPF32[(((value)+(4*i+24))>>2)];
            view[i+7] = HEAPF32[(((value)+(4*i+28))>>2)];
            view[i+8] = HEAPF32[(((value)+(4*i+32))>>2)];
          }
        } else
        {
          var view = HEAPF32.subarray((value)>>2,(value+count*36)>>2);
        }
        GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view);
      }

    function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
    
    
    
        if (count <= 18) {
          // avoid allocation when uploading few enough uniforms
          var view = miniTempWebGLFloatBuffers[16*count-1];
          // hoist the heap out of the loop for size and for pthreads+growth.
          var heap = HEAPF32;
          value >>= 2;
          for (var i = 0; i < 16 * count; i += 16) {
            var dst = value + i;
            view[i] = heap[dst];
            view[i + 1] = heap[dst + 1];
            view[i + 2] = heap[dst + 2];
            view[i + 3] = heap[dst + 3];
            view[i + 4] = heap[dst + 4];
            view[i + 5] = heap[dst + 5];
            view[i + 6] = heap[dst + 6];
            view[i + 7] = heap[dst + 7];
            view[i + 8] = heap[dst + 8];
            view[i + 9] = heap[dst + 9];
            view[i + 10] = heap[dst + 10];
            view[i + 11] = heap[dst + 11];
            view[i + 12] = heap[dst + 12];
            view[i + 13] = heap[dst + 13];
            view[i + 14] = heap[dst + 14];
            view[i + 15] = heap[dst + 15];
          }
        } else
        {
          var view = HEAPF32.subarray((value)>>2,(value+count*64)>>2);
        }
        GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view);
      }

    function _emscripten_glUseProgram(program) {
        GLctx.useProgram(GL.programs[program]);
      }

    function _emscripten_glValidateProgram(program) {
        GLctx.validateProgram(GL.programs[program]);
      }

    function _emscripten_glVertexAttrib1f(x0, x1) { GLctx['vertexAttrib1f'](x0, x1); }

    function _emscripten_glVertexAttrib1fv(index, v) {
    
        GLctx.vertexAttrib1f(index, HEAPF32[v>>2]);
      }

    function _emscripten_glVertexAttrib2f(x0, x1, x2) { GLctx['vertexAttrib2f'](x0, x1, x2); }

    function _emscripten_glVertexAttrib2fv(index, v) {
    
        GLctx.vertexAttrib2f(index, HEAPF32[v>>2], HEAPF32[v+4>>2]);
      }

    function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) { GLctx['vertexAttrib3f'](x0, x1, x2, x3); }

    function _emscripten_glVertexAttrib3fv(index, v) {
    
        GLctx.vertexAttrib3f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2]);
      }

    function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) { GLctx['vertexAttrib4f'](x0, x1, x2, x3, x4); }

    function _emscripten_glVertexAttrib4fv(index, v) {
    
        GLctx.vertexAttrib4f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2], HEAPF32[v+12>>2]);
      }

    function _emscripten_glVertexAttribDivisorANGLE(index, divisor) {
        GLctx['vertexAttribDivisor'](index, divisor);
      }

    function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
        GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
      }

    function _emscripten_glViewport(x0, x1, x2, x3) { GLctx['viewport'](x0, x1, x2, x3); }

    var IDBStore={indexedDB:function() {
        if (typeof indexedDB !== 'undefined') return indexedDB;
        var ret = null;
        if (typeof window === 'object') ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, 'IDBStore used, but indexedDB not supported');
        return ret;
      },DB_VERSION:22,DB_STORE_NAME:"FILE_DATA",dbs:{},blobs:[0],getDB:function(name, callback) {
        // check the cache first
        var db = IDBStore.dbs[name];
        if (db) {
          return callback(null, db);
        }
        var req;
        try {
          req = IDBStore.indexedDB().open(name, IDBStore.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
          if (db.objectStoreNames.contains(IDBStore.DB_STORE_NAME)) {
            transaction.objectStore(IDBStore.DB_STORE_NAME);
          } else {
            db.createObjectStore(IDBStore.DB_STORE_NAME);
          }
        };
        req.onsuccess = function() {
          db = req.result;
          // add to the cache
          IDBStore.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = /** @this{IDBOpenDBRequest} */ function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },getStore:function(dbName, type, callback) {
        IDBStore.getDB(dbName, function(error, db) {
          if (error) return callback(error);
          var transaction = db.transaction([IDBStore.DB_STORE_NAME], type);
          transaction.onerror = function(e) {
            callback(this.error || 'unknown error');
            e.preventDefault();
          };
          var store = transaction.objectStore(IDBStore.DB_STORE_NAME);
          callback(null, store);
        });
      },getFile:function(dbName, id, callback) {
        IDBStore.getStore(dbName, 'readonly', function(err, store) {
          if (err) return callback(err);
          var req = store.get(id);
          req.onsuccess = function(event) {
            var result = event.target.result;
            if (!result) {
              return callback('file ' + id + ' not found');
            } else {
              return callback(null, result);
            }
          };
          req.onerror = function(error) {
            callback(error);
          };
        });
      },setFile:function(dbName, id, data, callback) {
        IDBStore.getStore(dbName, 'readwrite', function(err, store) {
          if (err) return callback(err);
          var req = store.put(data, id);
          req.onsuccess = function(event) {
            callback();
          };
          req.onerror = function(error) {
            callback(error);
          };
        });
      },deleteFile:function(dbName, id, callback) {
        IDBStore.getStore(dbName, 'readwrite', function(err, store) {
          if (err) return callback(err);
          var req = store.delete(id);
          req.onsuccess = function(event) {
            callback();
          };
          req.onerror = function(error) {
            callback(error);
          };
        });
      },existsFile:function(dbName, id, callback) {
        IDBStore.getStore(dbName, 'readonly', function(err, store) {
          if (err) return callback(err);
          var req = store.count(id);
          req.onsuccess = function(event) {
            callback(null, event.target.result > 0);
          };
          req.onerror = function(error) {
            callback(error);
          };
        });
      }};
    function _emscripten_idb_async_delete(db, id, arg, ondelete, onerror) {
        IDBStore.deleteFile(UTF8ToString(db), UTF8ToString(id), function(error) {
          if (error) {
            if (onerror) wasmTable.get(onerror)(arg);
            return;
          }
          if (ondelete) wasmTable.get(ondelete)(arg);
        });
      }

    function _emscripten_idb_async_exists(db, id, arg, oncheck, onerror) {
        IDBStore.existsFile(UTF8ToString(db), UTF8ToString(id), function(error, exists) {
          if (error) {
            if (onerror) wasmTable.get(onerror)(arg);
            return;
          }
          if (oncheck) wasmTable.get(oncheck)(arg, exists);
        });
      }

    function _emscripten_idb_async_load(db, id, arg, onload, onerror) {
        IDBStore.getFile(UTF8ToString(db), UTF8ToString(id), function(error, byteArray) {
          if (error) {
            if (onerror) wasmTable.get(onerror)(arg);
            return;
          }
          var buffer = _malloc(byteArray.length);
          HEAPU8.set(byteArray, buffer);
          wasmTable.get(onload)(arg, buffer, byteArray.length);
          _free(buffer);
        });
      }

    function _emscripten_idb_async_store(db, id, ptr, num, arg, onstore, onerror) {
        // note that we copy the data here, as these are async operatins - changes to HEAPU8 meanwhile should not affect us!
        IDBStore.setFile(UTF8ToString(db), UTF8ToString(id), new Uint8Array(HEAPU8.subarray(ptr, ptr+num)), function(error) {
          if (error) {
            if (onerror) wasmTable.get(onerror)(arg);
            return;
          }
          if (onstore) wasmTable.get(onstore)(arg);
        });
      }

    function _emscripten_is_webgl_context_lost(contextHandle) {
        return !GL.contexts[contextHandle] || GL.contexts[contextHandle].GLctx.isContextLost(); // No context ~> lost context.
      }

    function reallyNegative(x) {
        return x < 0 || (x === 0 && (1/x) === -Infinity);
      }
    
    function convertI32PairToI53(lo, hi) {
        // This function should not be getting called with too large unsigned numbers
        // in high part (if hi >= 0x7FFFFFFFF, one should have been calling
        // convertU32PairToI53())
        assert(hi === (hi|0));
        return (lo >>> 0) + hi * 4294967296;
      }
    
    function convertU32PairToI53(lo, hi) {
        return (lo >>> 0) + (hi >>> 0) * 4294967296;
      }
    
    function reSign(value, bits) {
        if (value <= 0) {
          return value;
        }
        var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                              : Math.pow(2, bits-1);
        // for huge values, we can hit the precision limit and always get true here.
        // so don't do that but, in general there is no perfect solution here. With
        // 64-bit ints, we get rounding and errors
        // TODO: In i64 mode 1, resign the two parts separately and safely
        if (value >= half && (bits <= 32 || value > half)) {
          // Cannot bitshift half, as it may be at the limit of the bits JS uses in
          // bitshifts
          value = -2*half + value;
        }
        return value;
      }
    
    function unSign(value, bits) {
        if (value >= 0) {
          return value;
        }
        // Need some trickery, since if bits == 32, we are right at the limit of the
        // bits JS uses in bitshifts
        return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value
                          : Math.pow(2, bits)         + value;
      }
    function formatString(format, varargs) {
        assert((varargs & 3) === 0);
        var textIndex = format;
        var argIndex = varargs;
        // This must be called before reading a double or i64 vararg. It will bump the pointer properly.
        // It also does an assert on i32 values, so it's nice to call it before all varargs calls.
        function prepVararg(ptr, type) {
          if (type === 'double' || type === 'i64') {
            // move so the load is aligned
            if (ptr & 7) {
              assert((ptr & 7) === 4);
              ptr += 4;
            }
          } else {
            assert((ptr & 3) === 0);
          }
          return ptr;
        }
        function getNextArg(type) {
          // NOTE: Explicitly ignoring type safety. Otherwise this fails:
          //       int x = 4; printf("%c\n", (char)x);
          var ret;
          argIndex = prepVararg(argIndex, type);
          if (type === 'double') {
            ret = HEAPF64[((argIndex)>>3)];
            argIndex += 8;
          } else if (type == 'i64') {
            ret = [HEAP32[((argIndex)>>2)],
                   HEAP32[(((argIndex)+(4))>>2)]];
            argIndex += 8;
          } else {
            assert((argIndex & 3) === 0);
            type = 'i32'; // varargs are always i32, i64, or double
            ret = HEAP32[((argIndex)>>2)];
            argIndex += 4;
          }
          return ret;
        }
    
        var ret = [];
        var curr, next, currArg;
        while(1) {
          var startTextIndex = textIndex;
          curr = HEAP8[((textIndex)>>0)];
          if (curr === 0) break;
          next = HEAP8[((textIndex+1)>>0)];
          if (curr == 37) {
            // Handle flags.
            var flagAlwaysSigned = false;
            var flagLeftAlign = false;
            var flagAlternative = false;
            var flagZeroPad = false;
            var flagPadSign = false;
            flagsLoop: while (1) {
              switch (next) {
                case 43:
                  flagAlwaysSigned = true;
                  break;
                case 45:
                  flagLeftAlign = true;
                  break;
                case 35:
                  flagAlternative = true;
                  break;
                case 48:
                  if (flagZeroPad) {
                    break flagsLoop;
                  } else {
                    flagZeroPad = true;
                    break;
                  }
                case 32:
                  flagPadSign = true;
                  break;
                default:
                  break flagsLoop;
              }
              textIndex++;
              next = HEAP8[((textIndex+1)>>0)];
            }
    
            // Handle width.
            var width = 0;
            if (next == 42) {
              width = getNextArg('i32');
              textIndex++;
              next = HEAP8[((textIndex+1)>>0)];
            } else {
              while (next >= 48 && next <= 57) {
                width = width * 10 + (next - 48);
                textIndex++;
                next = HEAP8[((textIndex+1)>>0)];
              }
            }
    
            // Handle precision.
            var precisionSet = false, precision = -1;
            if (next == 46) {
              precision = 0;
              precisionSet = true;
              textIndex++;
              next = HEAP8[((textIndex+1)>>0)];
              if (next == 42) {
                precision = getNextArg('i32');
                textIndex++;
              } else {
                while(1) {
                  var precisionChr = HEAP8[((textIndex+1)>>0)];
                  if (precisionChr < 48 ||
                      precisionChr > 57) break;
                  precision = precision * 10 + (precisionChr - 48);
                  textIndex++;
                }
              }
              next = HEAP8[((textIndex+1)>>0)];
            }
            if (precision < 0) {
              precision = 6; // Standard default.
              precisionSet = false;
            }
    
            // Handle integer sizes. WARNING: These assume a 32-bit architecture!
            var argSize;
            switch (String.fromCharCode(next)) {
              case 'h':
                var nextNext = HEAP8[((textIndex+2)>>0)];
                if (nextNext == 104) {
                  textIndex++;
                  argSize = 1; // char (actually i32 in varargs)
                } else {
                  argSize = 2; // short (actually i32 in varargs)
                }
                break;
              case 'l':
                var nextNext = HEAP8[((textIndex+2)>>0)];
                if (nextNext == 108) {
                  textIndex++;
                  argSize = 8; // long long
                } else {
                  argSize = 4; // long
                }
                break;
              case 'L': // long long
              case 'q': // int64_t
              case 'j': // intmax_t
                argSize = 8;
                break;
              case 'z': // size_t
              case 't': // ptrdiff_t
              case 'I': // signed ptrdiff_t or unsigned size_t
                argSize = 4;
                break;
              default:
                argSize = null;
            }
            if (argSize) textIndex++;
            next = HEAP8[((textIndex+1)>>0)];
    
            // Handle type specifier.
            switch (String.fromCharCode(next)) {
              case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
                // Integer.
                var signed = next == 100 || next == 105;
                argSize = argSize || 4;
                currArg = getNextArg('i' + (argSize * 8));
                var argText;
                // Flatten i64-1 [low, high] into a (slightly rounded) double
                if (argSize == 8) {
                  currArg = next == 117 ? convertU32PairToI53(currArg[0], currArg[1]) : convertI32PairToI53(currArg[0], currArg[1]);
                }
                // Truncate to requested size.
                if (argSize <= 4) {
                  var limit = Math.pow(256, argSize) - 1;
                  currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
                }
                // Format the number.
                var currAbsArg = Math.abs(currArg);
                var prefix = '';
                if (next == 100 || next == 105) {
                  argText = reSign(currArg, 8 * argSize).toString(10);
                } else if (next == 117) {
                  argText = unSign(currArg, 8 * argSize).toString(10);
                  currArg = Math.abs(currArg);
                } else if (next == 111) {
                  argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
                } else if (next == 120 || next == 88) {
                  prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                  if (currArg < 0) {
                    // Represent negative numbers in hex as 2's complement.
                    currArg = -currArg;
                    argText = (currAbsArg - 1).toString(16);
                    var buffer = [];
                    for (var i = 0; i < argText.length; i++) {
                      buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                    }
                    argText = buffer.join('');
                    while (argText.length < argSize * 2) argText = 'f' + argText;
                  } else {
                    argText = currAbsArg.toString(16);
                  }
                  if (next == 88) {
                    prefix = prefix.toUpperCase();
                    argText = argText.toUpperCase();
                  }
                } else if (next == 112) {
                  if (currAbsArg === 0) {
                    argText = '(nil)';
                  } else {
                    prefix = '0x';
                    argText = currAbsArg.toString(16);
                  }
                }
                if (precisionSet) {
                  while (argText.length < precision) {
                    argText = '0' + argText;
                  }
                }
    
                // Add sign if needed
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    prefix = '+' + prefix;
                  } else if (flagPadSign) {
                    prefix = ' ' + prefix;
                  }
                }
    
                // Move sign to prefix so we zero-pad after the sign
                if (argText.charAt(0) == '-') {
                  prefix = '-' + prefix;
                  argText = argText.substr(1);
                }
    
                // Add padding.
                while (prefix.length + argText.length < width) {
                  if (flagLeftAlign) {
                    argText += ' ';
                  } else {
                    if (flagZeroPad) {
                      argText = '0' + argText;
                    } else {
                      prefix = ' ' + prefix;
                    }
                  }
                }
    
                // Insert the result into the buffer.
                argText = prefix + argText;
                argText.split('').forEach(function(chr) {
                  ret.push(chr.charCodeAt(0));
                });
                break;
              }
              case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
                // Float.
                currArg = getNextArg('double');
                var argText;
                if (isNaN(currArg)) {
                  argText = 'nan';
                  flagZeroPad = false;
                } else if (!isFinite(currArg)) {
                  argText = (currArg < 0 ? '-' : '') + 'inf';
                  flagZeroPad = false;
                } else {
                  var isGeneral = false;
                  var effectivePrecision = Math.min(precision, 20);
    
                  // Convert g/G to f/F or e/E, as per:
                  // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                  if (next == 103 || next == 71) {
                    isGeneral = true;
                    precision = precision || 1;
                    var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                    if (precision > exponent && exponent >= -4) {
                      next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                      precision -= exponent + 1;
                    } else {
                      next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                      precision--;
                    }
                    effectivePrecision = Math.min(precision, 20);
                  }
    
                  if (next == 101 || next == 69) {
                    argText = currArg.toExponential(effectivePrecision);
                    // Make sure the exponent has at least 2 digits.
                    if (/[eE][-+]\d$/.test(argText)) {
                      argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                    }
                  } else if (next == 102 || next == 70) {
                    argText = currArg.toFixed(effectivePrecision);
                    if (currArg === 0 && reallyNegative(currArg)) {
                      argText = '-' + argText;
                    }
                  }
    
                  var parts = argText.split('e');
                  if (isGeneral && !flagAlternative) {
                    // Discard trailing zeros and periods.
                    while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                           (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                      parts[0] = parts[0].slice(0, -1);
                    }
                  } else {
                    // Make sure we have a period in alternative mode.
                    if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                    // Zero pad until required precision.
                    while (precision > effectivePrecision++) parts[0] += '0';
                  }
                  argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
    
                  // Capitalize 'E' if needed.
                  if (next == 69) argText = argText.toUpperCase();
    
                  // Add sign.
                  if (currArg >= 0) {
                    if (flagAlwaysSigned) {
                      argText = '+' + argText;
                    } else if (flagPadSign) {
                      argText = ' ' + argText;
                    }
                  }
                }
    
                // Add padding.
                while (argText.length < width) {
                  if (flagLeftAlign) {
                    argText += ' ';
                  } else {
                    if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                      argText = argText[0] + '0' + argText.slice(1);
                    } else {
                      argText = (flagZeroPad ? '0' : ' ') + argText;
                    }
                  }
                }
    
                // Adjust case.
                if (next < 97) argText = argText.toUpperCase();
    
                // Insert the result into the buffer.
                argText.split('').forEach(function(chr) {
                  ret.push(chr.charCodeAt(0));
                });
                break;
              }
              case 's': {
                // String.
                var arg = getNextArg('i8*');
                var argLength = arg ? _strlen(arg) : '(null)'.length;
                if (precisionSet) argLength = Math.min(argLength, precision);
                if (!flagLeftAlign) {
                  while (argLength < width--) {
                    ret.push(32);
                  }
                }
                if (arg) {
                  for (var i = 0; i < argLength; i++) {
                    ret.push(HEAPU8[((arg++)>>0)]);
                  }
                } else {
                  ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
                }
                if (flagLeftAlign) {
                  while (argLength < width--) {
                    ret.push(32);
                  }
                }
                break;
              }
              case 'c': {
                // Character.
                if (flagLeftAlign) ret.push(getNextArg('i8'));
                while (--width > 0) {
                  ret.push(32);
                }
                if (!flagLeftAlign) ret.push(getNextArg('i8'));
                break;
              }
              case 'n': {
                // Write the length written so far to the next parameter.
                var ptr = getNextArg('i32*');
                HEAP32[((ptr)>>2)]=ret.length;
                break;
              }
              case '%': {
                // Literal percent sign.
                ret.push(curr);
                break;
              }
              default: {
                // Unknown specifiers remain untouched.
                for (var i = startTextIndex; i < textIndex + 2; i++) {
                  ret.push(HEAP8[((i)>>0)]);
                }
              }
            }
            textIndex += 2;
            // TODO: Support a/A (hex float) and m (last error) specifiers.
            // TODO: Support %1${specifier} for arg selection.
          } else {
            ret.push(curr);
            textIndex += 1;
          }
        }
        return ret;
      }
    
    function traverseStack(args) {
        if (!args || !args.callee || !args.callee.name) {
          return [null, '', ''];
        }
    
        args.callee.toString();
        var funcname = args.callee.name;
        var str = '(';
        var first = true;
        for (var i in args) {
          var a = args[i];
          if (!first) {
            str += ", ";
          }
          first = false;
          if (typeof a === 'number' || typeof a === 'string') {
            str += a;
          } else {
            str += '(' + typeof a + ')';
          }
        }
        str += ')';
        var caller = args.callee.caller;
        args = caller ? caller.arguments : [];
        if (first)
          str = '';
        return [args, funcname, str];
      }
    /** @param {number=} flags */
    function _emscripten_get_callstack_js(flags) {
        var callstack = jsStackTrace();
    
        // Find the symbols in the callstack that corresponds to the functions that report callstack information, and remove everything up to these from the output.
        var iThisFunc = callstack.lastIndexOf('_emscripten_log');
        var iThisFunc2 = callstack.lastIndexOf('_emscripten_get_callstack');
        var iNextLine = callstack.indexOf('\n', Math.max(iThisFunc, iThisFunc2))+1;
        callstack = callstack.slice(iNextLine);
    
        // If user requested to see the original source stack, but no source map information is available, just fall back to showing the JS stack.
        if (flags & 8/*EM_LOG_C_STACK*/ && typeof emscripten_source_map === 'undefined') {
          warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');
          flags ^= 8/*EM_LOG_C_STACK*/;
          flags |= 16/*EM_LOG_JS_STACK*/;
        }
    
        var stack_args = null;
        if (flags & 128 /*EM_LOG_FUNC_PARAMS*/) {
          // To get the actual parameters to the functions, traverse the stack via the unfortunately deprecated 'arguments.callee' method, if it works:
          stack_args = traverseStack(arguments);
          while (stack_args[1].indexOf('_emscripten_') >= 0)
            stack_args = traverseStack(stack_args[0]);
        }
    
        // Process all lines:
        var lines = callstack.split('\n');
        callstack = '';
        var newFirefoxRe = new RegExp('\\s*(.*?)@(.*?):([0-9]+):([0-9]+)'); // New FF30 with column info: extract components of form '       Object._main@http://server.com:4324:12'
        var firefoxRe = new RegExp('\\s*(.*?)@(.*):(.*)(:(.*))?'); // Old FF without column info: extract components of form '       Object._main@http://server.com:4324'
        var chromeRe = new RegExp('\\s*at (.*?) \\\((.*):(.*):(.*)\\\)'); // Extract components of form '    at Object._main (http://server.com/file.html:4324:12)'
    
        for (var l in lines) {
          var line = lines[l];
    
          var jsSymbolName = '';
          var file = '';
          var lineno = 0;
          var column = 0;
    
          var parts = chromeRe.exec(line);
          if (parts && parts.length == 5) {
            jsSymbolName = parts[1];
            file = parts[2];
            lineno = parts[3];
            column = parts[4];
          } else {
            parts = newFirefoxRe.exec(line);
            if (!parts) parts = firefoxRe.exec(line);
            if (parts && parts.length >= 4) {
              jsSymbolName = parts[1];
              file = parts[2];
              lineno = parts[3];
              column = parts[4]|0; // Old Firefox doesn't carry column information, but in new FF30, it is present. See https://bugzilla.mozilla.org/show_bug.cgi?id=762556
            } else {
              // Was not able to extract this line for demangling/sourcemapping purposes. Output it as-is.
              callstack += line + '\n';
              continue;
            }
          }
    
          // Try to demangle the symbol, but fall back to showing the original JS symbol name if not available.
          var cSymbolName = (flags & 32/*EM_LOG_DEMANGLE*/) ? demangle(jsSymbolName) : jsSymbolName;
          if (!cSymbolName) {
            cSymbolName = jsSymbolName;
          }
    
          var haveSourceMap = false;
    
          if (flags & 8/*EM_LOG_C_STACK*/) {
            var orig = emscripten_source_map.originalPositionFor({line: lineno, column: column});
            haveSourceMap = (orig && orig.source);
            if (haveSourceMap) {
              if (flags & 64/*EM_LOG_NO_PATHS*/) {
                orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf('/')+1);
              }
              callstack += '    at ' + cSymbolName + ' (' + orig.source + ':' + orig.line + ':' + orig.column + ')\n';
            }
          }
          if ((flags & 16/*EM_LOG_JS_STACK*/) || !haveSourceMap) {
            if (flags & 64/*EM_LOG_NO_PATHS*/) {
              file = file.substring(file.replace(/\\/g, "/").lastIndexOf('/')+1);
            }
            callstack += (haveSourceMap ? ('     = '+jsSymbolName) : ('    at '+cSymbolName)) + ' (' + file + ':' + lineno + ':' + column + ')\n';
          }
    
          // If we are still keeping track with the callstack by traversing via 'arguments.callee', print the function parameters as well.
          if (flags & 128 /*EM_LOG_FUNC_PARAMS*/ && stack_args[0]) {
            if (stack_args[1] == jsSymbolName && stack_args[2].length > 0) {
              callstack = callstack.replace(/\s+$/, '');
              callstack += ' with values: ' + stack_args[1] + stack_args[2] + '\n';
            }
            stack_args = traverseStack(stack_args[0]);
          }
        }
        // Trim extra whitespace at the end of the output.
        callstack = callstack.replace(/\s+$/, '');
        return callstack;
      }
    function _emscripten_log_js(flags, str) {
        if (flags & 24/*EM_LOG_C_STACK | EM_LOG_JS_STACK*/) {
          str = str.replace(/\s+$/, ''); // Ensure the message and the callstack are joined cleanly with exactly one newline.
          str += (str.length > 0 ? '\n' : '') + _emscripten_get_callstack_js(flags);
        }
    
        if (flags & 1 /*EM_LOG_CONSOLE*/) {
          if (flags & 4 /*EM_LOG_ERROR*/) {
            console.error(str);
          } else if (flags & 2 /*EM_LOG_WARN*/) {
            console.warn(str);
          } else if (flags & 512 /*EM_LOG_INFO*/) {
            console.info(str);
          } else if (flags & 256 /*EM_LOG_DEBUG*/) {
            console.debug(str);
          } else {
            console.log(str);
          }
        } else if (flags & 6 /*EM_LOG_ERROR|EM_LOG_WARN*/) {
          err(str);
        } else {
          out(str);
        }
      }
    function _emscripten_log(flags, format, varargs) {
        var result = formatString(format, varargs);
        var str = UTF8ArrayToString(result, 0);
        _emscripten_log_js(flags, str);
      }

    function _longjmp(env, value) {
        _setThrew(env, value || 1);
        throw 'longjmp';
      }
    function _emscripten_longjmp(a0,a1
    ) {
    return _longjmp(a0,a1);
    }

    function _emscripten_longjmp_jmpbuf(a0,a1
    ) {
    return _longjmp(a0,a1);
    }

    function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num);
      }

    function _emscripten_pause_main_loop() {
        Browser.mainLoop.pause();
      }

    function _emscripten_get_heap_size() {
        return HEAPU8.length;
      }
    
    function emscripten_realloc_buffer(size) {
        try {
          // round size grow request up to wasm page size (fixed 64KB per spec)
          wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16); // .grow() takes a delta compared to the previous size
          updateGlobalBufferAndViews(wasmMemory.buffer);
          return 1 /*success*/;
        } catch(e) {
          console.error('emscripten_realloc_buffer: Attempted to grow heap from ' + buffer.byteLength  + ' bytes to ' + size + ' bytes, but got error: ' + e);
        }
        // implicit 0 return to save code size (caller will cast "undefined" into 0
        // anyhow)
      }
    function _emscripten_resize_heap(requestedSize) {
        requestedSize = requestedSize >>> 0;
        var oldSize = _emscripten_get_heap_size();
        // With pthreads, races can happen (another thread might increase the size in between), so return a failure, and let the caller retry.
        assert(requestedSize > oldSize);
    
    
        // Memory resize rules:
        // 1. When resizing, always produce a resized heap that is at least 16MB (to avoid tiny heap sizes receiving lots of repeated resizes at startup)
        // 2. Always increase heap size to at least the requested size, rounded up to next page multiple.
        // 3a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap geometrically: increase the heap size according to 
        //                                         MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%),
        //                                         At most overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
        // 3b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap linearly: increase the heap size by at least MEMORY_GROWTH_LINEAR_STEP bytes.
        // 4. Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
        // 5. If we were unable to allocate as much memory, it may be due to over-eager decision to excessively reserve due to (3) above.
        //    Hence if an allocation fails, cut down on the amount of excess growth, in an attempt to succeed to perform a smaller allocation.
    
        // A limit was set for how much we can grow. We should not exceed that
        // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
        var maxHeapSize = 2147483648;
        if (requestedSize > maxHeapSize) {
          err('Cannot enlarge memory, asked to go up to ' + requestedSize + ' bytes, but the limit is ' + maxHeapSize + ' bytes!');
          return false;
        }
    
        var minHeapSize = 16777216;
    
        // Loop through potential heap size increases. If we attempt a too eager reservation that fails, cut down on the
        // attempted size and reserve a smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
        for(var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
          // but limit overreserving (default to capping at +96MB overgrowth at most)
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
    
    
          var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), 65536));
    
          var t0 = _emscripten_get_now();
          var replacement = emscripten_realloc_buffer(newSize);
          var t1 = _emscripten_get_now();
          console.log('Heap resize call from ' + oldSize + ' to ' + newSize + ' took ' + (t1 - t0) + ' msecs. Success: ' + !!replacement);
          if (replacement) {
    
            return true;
          }
        }
        err('Failed to grow the heap from ' + oldSize + ' bytes to ' + newSize + ' bytes, not enough memory!');
        return false;
      }

    function _emscripten_resume_main_loop() {
        Browser.mainLoop.resume();
      }

    function __registerFocusEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc( 256 );
    
        var focusEventHandlerFunc = function(ev) {
          var e = ev || event;
    
          var nodeName = JSEvents.getNodeNameForTarget(e.target);
          var id = e.target.id ? e.target.id : '';
    
          var focusEvent = JSEvents.focusEvent;
          stringToUTF8(nodeName, focusEvent + 0, 128);
          stringToUTF8(id, focusEvent + 128, 128);
    
          if (wasmTable.get(callbackfunc)(eventTypeId, focusEvent, userData)) e.preventDefault();
        };
    
        var eventHandler = {
          target: findEventTarget(target),
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: focusEventHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }
    function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus");
        return 0;
      }

    function __registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc( 164 );
    
        var keyEventHandlerFunc = function(e) {
          assert(e);
    
          var keyEventData = JSEvents.keyEvent;
          var idx = keyEventData >> 2;
    
          HEAP32[idx + 0] = e.location;
          HEAP32[idx + 1] = e.ctrlKey;
          HEAP32[idx + 2] = e.shiftKey;
          HEAP32[idx + 3] = e.altKey;
          HEAP32[idx + 4] = e.metaKey;
          HEAP32[idx + 5] = e.repeat;
          HEAP32[idx + 6] = e.charCode;
          HEAP32[idx + 7] = e.keyCode;
          HEAP32[idx + 8] = e.which;
          stringToUTF8(e.key || '', keyEventData + 36, 32);
          stringToUTF8(e.code || '', keyEventData + 68, 32);
          stringToUTF8(e.char || '', keyEventData + 100, 32);
          stringToUTF8(e.locale || '', keyEventData + 132, 32);
    
          if (wasmTable.get(callbackfunc)(eventTypeId, keyEventData, userData)) e.preventDefault();
        };
    
        var eventHandler = {
          target: findEventTarget(target),
          allowsDeferredCalls: true,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: keyEventHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }
    function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown");
        return 0;
      }

    function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup");
        return 0;
      }

    function _emscripten_set_main_loop_arg(func, arg, fps, simulateInfiniteLoop) {
        var browserIterationFunc = function() { wasmTable.get(func)(arg); };
        setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg);
      }

    function __fillMouseEventData(eventStruct, e, target) {
        assert(eventStruct % 4 == 0);
        var idx = eventStruct >> 2;
        HEAP32[idx + 0] = e.screenX;
        HEAP32[idx + 1] = e.screenY;
        HEAP32[idx + 2] = e.clientX;
        HEAP32[idx + 3] = e.clientY;
        HEAP32[idx + 4] = e.ctrlKey;
        HEAP32[idx + 5] = e.shiftKey;
        HEAP32[idx + 6] = e.altKey;
        HEAP32[idx + 7] = e.metaKey;
        HEAP16[idx*2 + 16] = e.button;
        HEAP16[idx*2 + 17] = e.buttons;
    
        HEAP32[idx + 9] = e["movementX"]
          ;
    
        HEAP32[idx + 10] = e["movementY"]
          ;
    
        var rect = __getBoundingClientRect(target);
        HEAP32[idx + 11] = e.clientX - rect.left;
        HEAP32[idx + 12] = e.clientY - rect.top;
    
      }
    function __registerMouseEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc( 64 );
        target = findEventTarget(target);
    
        var mouseEventHandlerFunc = function(ev) {
          var e = ev || event;
    
          // TODO: Make this access thread safe, or this could update live while app is reading it.
          __fillMouseEventData(JSEvents.mouseEvent, e, target);
    
          if (wasmTable.get(callbackfunc)(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
        };
    
        var eventHandler = {
          target: target,
          allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave', // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: mouseEventHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }
    function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown");
        return 0;
      }

    function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove");
        return 0;
      }

    function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup");
        return 0;
      }

    function __registerUiEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc( 36 );
    
        target = findEventTarget(target);
    
        var uiEventHandlerFunc = function(ev) {
          var e = ev || event;
          if (e.target != target) {
            // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
            // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
            // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
            // causing a new scroll, etc..
            return;
          }
          var uiEvent = JSEvents.uiEvent;
          var b = document.body; // Take document.body to a variable, Closure compiler does not outline access to it on its own.
          HEAP32[((uiEvent)>>2)]=e.detail;
          HEAP32[(((uiEvent)+(4))>>2)]=b.clientWidth;
          HEAP32[(((uiEvent)+(8))>>2)]=b.clientHeight;
          HEAP32[(((uiEvent)+(12))>>2)]=innerWidth;
          HEAP32[(((uiEvent)+(16))>>2)]=innerHeight;
          HEAP32[(((uiEvent)+(20))>>2)]=outerWidth;
          HEAP32[(((uiEvent)+(24))>>2)]=outerHeight;
          HEAP32[(((uiEvent)+(28))>>2)]=pageXOffset;
          HEAP32[(((uiEvent)+(32))>>2)]=pageYOffset;
          if (wasmTable.get(callbackfunc)(eventTypeId, uiEvent, userData)) e.preventDefault();
        };
    
        var eventHandler = {
          target: target,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: uiEventHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }
    function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize");
        return 0;
      }

    function __registerTouchEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc( 1684 );
    
        target = findEventTarget(target);
    
        var touchEventHandlerFunc = function(e) {
          assert(e);
          var touches = {};
          var et = e.touches;
          for(var i = 0; i < et.length; ++i) {
            var touch = et[i];
            // Verify that browser does not recycle touch objects with old stale data, but reports new ones each time.
            assert(!touch.isChanged);
            assert(!touch.onTarget);
            touches[touch.identifier] = touch;
          }
          et = e.changedTouches;
          for(var i = 0; i < et.length; ++i) {
            var touch = et[i];
            // Verify that browser does not recycle touch objects with old stale data, but reports new ones each time.
            assert(!touch.onTarget);
            touch.isChanged = 1;
            touches[touch.identifier] = touch;
          }
          et = e.targetTouches;
          for(var i = 0; i < et.length; ++i) {
            touches[et[i].identifier].onTarget = 1;
          }
    
          var touchEvent = JSEvents.touchEvent;
          var idx = touchEvent>>2; // Pre-shift the ptr to index to HEAP32 to save code size
          HEAP32[idx + 1] = e.ctrlKey;
          HEAP32[idx + 2] = e.shiftKey;
          HEAP32[idx + 3] = e.altKey;
          HEAP32[idx + 4] = e.metaKey;
          idx += 5; // Advance to the start of the touch array.
          var targetRect = __getBoundingClientRect(target);
          var numTouches = 0;
          for(var i in touches) {
            var t = touches[i];
            HEAP32[idx + 0] = t.identifier;
            HEAP32[idx + 1] = t.screenX;
            HEAP32[idx + 2] = t.screenY;
            HEAP32[idx + 3] = t.clientX;
            HEAP32[idx + 4] = t.clientY;
            HEAP32[idx + 5] = t.pageX;
            HEAP32[idx + 6] = t.pageY;
            HEAP32[idx + 7] = t.isChanged;
            HEAP32[idx + 8] = t.onTarget;
            HEAP32[idx + 9] = t.clientX - targetRect.left;
            HEAP32[idx + 10] = t.clientY - targetRect.top;
    
            idx += 13;
    
            if (++numTouches > 31) {
              break;
            }
          }
          HEAP32[((touchEvent)>>2)]=numTouches;
    
          if (wasmTable.get(callbackfunc)(eventTypeId, touchEvent, userData)) e.preventDefault();
        };
    
        var eventHandler = {
          target: target,
          allowsDeferredCalls: eventTypeString == 'touchstart' || eventTypeString == 'touchend',
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: touchEventHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }
    function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel");
        return 0;
      }

    function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend");
        return 0;
      }

    function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove");
        return 0;
      }

    function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart");
        return 0;
      }

    function __registerWheelEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc( 96 );
    
        // The DOM Level 3 events spec event 'wheel'
        var wheelHandlerFunc = function(ev) {
          var e = ev || event;
          var wheelEvent = JSEvents.wheelEvent;
          __fillMouseEventData(wheelEvent, e, target);
          HEAPF64[(((wheelEvent)+(64))>>3)]=e["deltaX"];
          HEAPF64[(((wheelEvent)+(72))>>3)]=e["deltaY"];
          HEAPF64[(((wheelEvent)+(80))>>3)]=e["deltaZ"];
          HEAP32[(((wheelEvent)+(88))>>2)]=e["deltaMode"];
          if (wasmTable.get(callbackfunc)(eventTypeId, wheelEvent, userData)) e.preventDefault();
        };
    
        var eventHandler = {
          target: target,
          allowsDeferredCalls: true,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: wheelHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }
    function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
        target = findEventTarget(target);
        if (typeof target.onwheel !== 'undefined') {
          __registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel");
          return 0;
        } else {
          return -1;
        }
      }

    function _emscripten_sleep() {
        throw 'Please compile your program with async support in order to use asynchronous operations like emscripten_sleep';
      }

    var __emscripten_webgl_power_preferences=['default', 'low-power', 'high-performance'];
    
    function findCanvasEventTarget(target) { return findEventTarget(target); }
    function _emscripten_webgl_do_create_context(target, attributes) {
        assert(attributes);
        var contextAttributes = {};
        var a = attributes >> 2;
        contextAttributes['alpha'] = !!HEAP32[a + (0>>2)];
        contextAttributes['depth'] = !!HEAP32[a + (4>>2)];
        contextAttributes['stencil'] = !!HEAP32[a + (8>>2)];
        contextAttributes['antialias'] = !!HEAP32[a + (12>>2)];
        contextAttributes['premultipliedAlpha'] = !!HEAP32[a + (16>>2)];
        contextAttributes['preserveDrawingBuffer'] = !!HEAP32[a + (20>>2)];
        var powerPreference = HEAP32[a + (24>>2)];
        contextAttributes['powerPreference'] = __emscripten_webgl_power_preferences[powerPreference];
        contextAttributes['failIfMajorPerformanceCaveat'] = !!HEAP32[a + (28>>2)];
        contextAttributes.majorVersion = HEAP32[a + (32>>2)];
        contextAttributes.minorVersion = HEAP32[a + (36>>2)];
        contextAttributes.enableExtensionsByDefault = HEAP32[a + (40>>2)];
        contextAttributes.explicitSwapControl = HEAP32[a + (44>>2)];
        contextAttributes.proxyContextToMainThread = HEAP32[a + (48>>2)];
        contextAttributes.renderViaOffscreenBackBuffer = HEAP32[a + (52>>2)];
    
        var canvas = findCanvasEventTarget(target);
    
    
    
        if (!canvas) {
          return 0;
        }
    
        if (contextAttributes.explicitSwapControl) {
          return 0;
        }
    
    
        var contextHandle = GL.createContext(canvas, contextAttributes);
        return contextHandle;
      }
    function _emscripten_webgl_create_context(a0,a1
    ) {
    return _emscripten_webgl_do_create_context(a0,a1);
    }

    function _emscripten_webgl_do_get_current_context() {
        return GL.currentContext ? GL.currentContext.handle : 0;
      }
    function _emscripten_webgl_get_current_context(
    ) {
    return _emscripten_webgl_do_get_current_context();
    }
    Module["_emscripten_webgl_get_current_context"] = _emscripten_webgl_get_current_context;
    
    function _emscripten_webgl_make_context_current(contextHandle) {
        var success = GL.makeContextCurrent(contextHandle);
        return success ? 0 : -5;
      }
    Module["_emscripten_webgl_make_context_current"] = _emscripten_webgl_make_context_current;
    function _emscripten_webgl_destroy_context(contextHandle) {
        if (GL.currentContext == contextHandle) GL.currentContext = 0;
        GL.deleteContext(contextHandle);
      }

    function _emscripten_webgl_init_context_attributes(attributes) {
        assert(attributes);
        var a = attributes >> 2;
        for(var i = 0; i < (56>>2); ++i) {
          HEAP32[a+i] = 0;
        }
    
        HEAP32[a + (0>>2)] =
        HEAP32[a + (4>>2)] = 
        HEAP32[a + (12>>2)] = 
        HEAP32[a + (16>>2)] = 
        HEAP32[a + (32>>2)] = 
        HEAP32[a + (40>>2)] = 1;
    
      }


    var ENV={};
    
    function getExecutableName() {
        return thisProgram || './this.program';
      }
    function getEnvStrings() {
        if (!getEnvStrings.strings) {
          // Default values.
          // Browser language detection #8751
          var lang = ((typeof navigator === 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
          var env = {
            'USER': 'web_user',
            'LOGNAME': 'web_user',
            'PATH': '/',
            'PWD': '/',
            'HOME': '/home/web_user',
            'LANG': lang,
            '_': getExecutableName()
          };
          // Apply the user-provided values, if any.
          for (var x in ENV) {
            env[x] = ENV[x];
          }
          var strings = [];
          for (var x in env) {
            strings.push(x + '=' + env[x]);
          }
          getEnvStrings.strings = strings;
        }
        return getEnvStrings.strings;
      }
    function _environ_get(__environ, environ_buf) {
        var bufSize = 0;
        getEnvStrings().forEach(function(string, i) {
          var ptr = environ_buf + bufSize;
          HEAP32[(((__environ)+(i * 4))>>2)]=ptr;
          writeAsciiToMemory(string, ptr);
          bufSize += string.length + 1;
        });
        return 0;
      }

    function _environ_sizes_get(penviron_count, penviron_buf_size) {
        var strings = getEnvStrings();
        HEAP32[((penviron_count)>>2)]=strings.length;
        var bufSize = 0;
        strings.forEach(function(string) {
          bufSize += string.length + 1;
        });
        HEAP32[((penviron_buf_size)>>2)]=bufSize;
        return 0;
      }

    function _exit(status) {
        // void _exit(int status);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
        exit(status);
      }

    function _fd_close(fd) {try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
    }

    function _fd_fdstat_get(fd, pbuf) {try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        // All character devices are terminals (other things a Linux system would
        // assume is a character device, like the mouse, we have special APIs for).
        var type = stream.tty ? 2 :
                   FS.isDir(stream.mode) ? 3 :
                   FS.isLink(stream.mode) ? 7 :
                   4;
        HEAP8[((pbuf)>>0)]=type;
        // TODO HEAP16[(((pbuf)+(2))>>1)]=?;
        // TODO (tempI64 = [?>>>0,(tempDouble=?,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((pbuf)+(8))>>2)]=tempI64[0],HEAP32[(((pbuf)+(12))>>2)]=tempI64[1]);
        // TODO (tempI64 = [?>>>0,(tempDouble=?,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((pbuf)+(16))>>2)]=tempI64[0],HEAP32[(((pbuf)+(20))>>2)]=tempI64[1]);
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
    }

    function _fd_read(fd, iov, iovcnt, pnum) {try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = SYSCALLS.doReadv(stream, iov, iovcnt);
        HEAP32[((pnum)>>2)]=num;
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
    }

    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {try {
    
        
        var stream = SYSCALLS.getStreamFromFD(fd);
        var HIGH_OFFSET = 0x100000000; // 2^32
        // use an unsigned operator on low and shift high by 32-bits
        var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
    
        var DOUBLE_LIMIT = 0x20000000000000; // 2^53
        // we also check for equality since DOUBLE_LIMIT + 1 == DOUBLE_LIMIT
        if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
          return -61;
        }
    
        FS.llseek(stream, offset, whence);
        (tempI64 = [stream.position>>>0,(tempDouble=stream.position,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((newOffset)>>2)]=tempI64[0],HEAP32[(((newOffset)+(4))>>2)]=tempI64[1]);
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
    }

    function _fd_sync(fd) {try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (stream.stream_ops && stream.stream_ops.fsync) {
          return -stream.stream_ops.fsync(stream);
        }
        return 0; // we can't do anything synchronously; the in-memory FS is already synced to
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
    }

    function _fd_write(fd, iov, iovcnt, pnum) {try {
    
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = SYSCALLS.doWritev(stream, iov, iovcnt);
        HEAP32[((pnum)>>2)]=num;
        return 0;
      } catch (e) {
      if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
    }

    function _flock(fd, operation) {
        // int flock(int fd, int operation);
        // Pretend to succeed
        return 0;
      }

    function _getTempRet0() {
        return (getTempRet0() | 0);
      }

    function _gettimeofday(ptr) {
        var now = Date.now();
        HEAP32[((ptr)>>2)]=(now/1000)|0; // seconds
        HEAP32[(((ptr)+(4))>>2)]=((now % 1000)*1000)|0; // microseconds
        return 0;
      }

    function _glActiveTexture(x0) { GLctx['activeTexture'](x0); }

    function _glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
        GLctx['compressedTexImage2D'](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
      }

    function _glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
        GLctx['compressedTexSubImage2D'](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
      }

    function _glGenerateMipmap(x0) { GLctx['generateMipmap'](x0); }

    function _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
        var pixelData = null;
        if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels);
        GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
      }

    function _glViewport(x0, x1, x2, x3) { GLctx['viewport'](x0, x1, x2, x3); }

    function _kill(pid, sig) {
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/kill.html
        // Makes no sense in a single-process environment.
    	  // Should kill itself somtimes depending on `pid`
        err('Calling stub instead of kill()');
        setErrNo(ERRNO_CODES.EPERM);
        return -1;
      }

    function _mktime(tmPtr) {
        _tzset();
        var date = new Date(HEAP32[(((tmPtr)+(20))>>2)] + 1900,
                            HEAP32[(((tmPtr)+(16))>>2)],
                            HEAP32[(((tmPtr)+(12))>>2)],
                            HEAP32[(((tmPtr)+(8))>>2)],
                            HEAP32[(((tmPtr)+(4))>>2)],
                            HEAP32[((tmPtr)>>2)],
                            0);
    
        // There's an ambiguous hour when the time goes back; the tm_isdst field is
        // used to disambiguate it.  Date() basically guesses, so we fix it up if it
        // guessed wrong, or fill in tm_isdst with the guess if it's -1.
        var dst = HEAP32[(((tmPtr)+(32))>>2)];
        var guessedOffset = date.getTimezoneOffset();
        var start = new Date(date.getFullYear(), 0, 1);
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dstOffset = Math.min(winterOffset, summerOffset); // DST is in December in South
        if (dst < 0) {
          // Attention: some regions don't have DST at all.
          HEAP32[(((tmPtr)+(32))>>2)]=Number(summerOffset != winterOffset && dstOffset == guessedOffset);
        } else if ((dst > 0) != (dstOffset == guessedOffset)) {
          var nonDstOffset = Math.max(winterOffset, summerOffset);
          var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
          // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
          date.setTime(date.getTime() + (trueOffset - guessedOffset)*60000);
        }
    
        HEAP32[(((tmPtr)+(24))>>2)]=date.getDay();
        var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
        HEAP32[(((tmPtr)+(28))>>2)]=yday;
    
        return (date.getTime() / 1000)|0;
      }

    function _usleep(useconds) {
        // int usleep(useconds_t useconds);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/usleep.html
        // We're single-threaded, so use a busy loop. Super-ugly.
        var start = _emscripten_get_now();
        while (_emscripten_get_now() - start < useconds / 1000) {
          // Do nothing.
        }
      }
    function _nanosleep(rqtp, rmtp) {
        // int nanosleep(const struct timespec  *rqtp, struct timespec *rmtp);
        if (rqtp === 0) {
          setErrNo(28);
          return -1;
        }
        var seconds = HEAP32[((rqtp)>>2)];
        var nanoseconds = HEAP32[(((rqtp)+(4))>>2)];
        if (nanoseconds < 0 || nanoseconds > 999999999 || seconds < 0) {
          setErrNo(28);
          return -1;
        }
        if (rmtp !== 0) {
          HEAP32[((rmtp)>>2)]=0;
          HEAP32[(((rmtp)+(4))>>2)]=0;
        }
        return _usleep((seconds * 1e6) + (nanoseconds / 1000));
      }

    function _pthread_create() {
        return 6;
      }

    function _pthread_join() {}

    function _pthread_mutexattr_destroy() {}

    function _pthread_mutexattr_init() {}

    function _pthread_mutexattr_settype() {}

    function _setTempRet0($i) {
        setTempRet0(($i) | 0);
      }

    function __isLeapYear(year) {
          return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
      }
    
    function __arraySum(array, index) {
        var sum = 0;
        for (var i = 0; i <= index; sum += array[i++]) {
          // no-op
        }
        return sum;
      }
    
    var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
    
    var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];
    function __addDays(date, days) {
        var newDate = new Date(date.getTime());
        while(days > 0) {
          var leap = __isLeapYear(newDate.getFullYear());
          var currentMonth = newDate.getMonth();
          var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
    
          if (days > daysInCurrentMonth-newDate.getDate()) {
            // we spill over to next month
            days -= (daysInCurrentMonth-newDate.getDate()+1);
            newDate.setDate(1);
            if (currentMonth < 11) {
              newDate.setMonth(currentMonth+1);
            } else {
              newDate.setMonth(0);
              newDate.setFullYear(newDate.getFullYear()+1);
            }
          } else {
            // we stay in current month
            newDate.setDate(newDate.getDate()+days);
            return newDate;
          }
        }
    
        return newDate;
      }
    function _strftime(s, maxsize, format, tm) {
        // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
        // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
    
        var tm_zone = HEAP32[(((tm)+(40))>>2)];
    
        var date = {
          tm_sec: HEAP32[((tm)>>2)],
          tm_min: HEAP32[(((tm)+(4))>>2)],
          tm_hour: HEAP32[(((tm)+(8))>>2)],
          tm_mday: HEAP32[(((tm)+(12))>>2)],
          tm_mon: HEAP32[(((tm)+(16))>>2)],
          tm_year: HEAP32[(((tm)+(20))>>2)],
          tm_wday: HEAP32[(((tm)+(24))>>2)],
          tm_yday: HEAP32[(((tm)+(28))>>2)],
          tm_isdst: HEAP32[(((tm)+(32))>>2)],
          tm_gmtoff: HEAP32[(((tm)+(36))>>2)],
          tm_zone: tm_zone ? UTF8ToString(tm_zone) : ''
        };
    
        var pattern = UTF8ToString(format);
    
        // expand format
        var EXPANSION_RULES_1 = {
          '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
          '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
          '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
          '%h': '%b',                       // Equivalent to %b
          '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
          '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
          '%T': '%H:%M:%S',                 // Replaced by the time
          '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
          '%X': '%H:%M:%S',                 // Replaced by the locale's appropriate time representation
          // Modified Conversion Specifiers
          '%Ec': '%c',                      // Replaced by the locale's alternative appropriate date and time representation.
          '%EC': '%C',                      // Replaced by the name of the base year (period) in the locale's alternative representation.
          '%Ex': '%m/%d/%y',                // Replaced by the locale's alternative date representation.
          '%EX': '%H:%M:%S',                // Replaced by the locale's alternative time representation.
          '%Ey': '%y',                      // Replaced by the offset from %EC (year only) in the locale's alternative representation.
          '%EY': '%Y',                      // Replaced by the full alternative year representation.
          '%Od': '%d',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading zeros if there is any alternative symbol for zero; otherwise, with leading <space> characters.
          '%Oe': '%e',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading <space> characters.
          '%OH': '%H',                      // Replaced by the hour (24-hour clock) using the locale's alternative numeric symbols.
          '%OI': '%I',                      // Replaced by the hour (12-hour clock) using the locale's alternative numeric symbols.
          '%Om': '%m',                      // Replaced by the month using the locale's alternative numeric symbols.
          '%OM': '%M',                      // Replaced by the minutes using the locale's alternative numeric symbols.
          '%OS': '%S',                      // Replaced by the seconds using the locale's alternative numeric symbols.
          '%Ou': '%u',                      // Replaced by the weekday as a number in the locale's alternative representation (Monday=1).
          '%OU': '%U',                      // Replaced by the week number of the year (Sunday as the first day of the week, rules corresponding to %U ) using the locale's alternative numeric symbols.
          '%OV': '%V',                      // Replaced by the week number of the year (Monday as the first day of the week, rules corresponding to %V ) using the locale's alternative numeric symbols.
          '%Ow': '%w',                      // Replaced by the number of the weekday (Sunday=0) using the locale's alternative numeric symbols.
          '%OW': '%W',                      // Replaced by the week number of the year (Monday as the first day of the week) using the locale's alternative numeric symbols.
          '%Oy': '%y',                      // Replaced by the year (offset from %C ) using the locale's alternative numeric symbols.
        };
        for (var rule in EXPANSION_RULES_1) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
        }
    
        var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        function leadingSomething(value, digits, character) {
          var str = typeof value === 'number' ? value.toString() : (value || '');
          while (str.length < digits) {
            str = character[0]+str;
          }
          return str;
        }
    
        function leadingNulls(value, digits) {
          return leadingSomething(value, digits, '0');
        }
    
        function compareByDay(date1, date2) {
          function sgn(value) {
            return value < 0 ? -1 : (value > 0 ? 1 : 0);
          }
    
          var compare;
          if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
              compare = sgn(date1.getDate()-date2.getDate());
            }
          }
          return compare;
        }
    
        function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0: // Sunday
                return new Date(janFourth.getFullYear()-1, 11, 29);
              case 1: // Monday
                return janFourth;
              case 2: // Tuesday
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3: // Wednesday
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4: // Thursday
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5: // Friday
                return new Date(janFourth.getFullYear()-1, 11, 31);
              case 6: // Saturday
                return new Date(janFourth.getFullYear()-1, 11, 30);
            }
        }
    
        function getWeekBasedYear(date) {
            var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
    
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
    
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
    
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              // this date is after the start of the first week of this year
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear()+1;
              } else {
                return thisDate.getFullYear();
              }
            } else {
              return thisDate.getFullYear()-1;
            }
        }
    
        var EXPANSION_RULES_2 = {
          '%a': function(date) {
            return WEEKDAYS[date.tm_wday].substring(0,3);
          },
          '%A': function(date) {
            return WEEKDAYS[date.tm_wday];
          },
          '%b': function(date) {
            return MONTHS[date.tm_mon].substring(0,3);
          },
          '%B': function(date) {
            return MONTHS[date.tm_mon];
          },
          '%C': function(date) {
            var year = date.tm_year+1900;
            return leadingNulls((year/100)|0,2);
          },
          '%d': function(date) {
            return leadingNulls(date.tm_mday, 2);
          },
          '%e': function(date) {
            return leadingSomething(date.tm_mday, 2, ' ');
          },
          '%g': function(date) {
            // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year.
            // In this system, weeks begin on a Monday and week 1 of the year is the week that includes
            // January 4th, which is also the week that includes the first Thursday of the year, and
            // is also the first week that contains at least four days in the year.
            // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of
            // the last week of the preceding year; thus, for Saturday 2nd January 1999,
            // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th,
            // or 31st is a Monday, it and any following days are part of week 1 of the following year.
            // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
    
            return getWeekBasedYear(date).toString().substring(2);
          },
          '%G': function(date) {
            return getWeekBasedYear(date);
          },
          '%H': function(date) {
            return leadingNulls(date.tm_hour, 2);
          },
          '%I': function(date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0) twelveHour = 12;
            else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2);
          },
          '%j': function(date) {
            // Day of the year (001-366)
            return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
          },
          '%m': function(date) {
            return leadingNulls(date.tm_mon+1, 2);
          },
          '%M': function(date) {
            return leadingNulls(date.tm_min, 2);
          },
          '%n': function() {
            return '\n';
          },
          '%p': function(date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
              return 'AM';
            } else {
              return 'PM';
            }
          },
          '%S': function(date) {
            return leadingNulls(date.tm_sec, 2);
          },
          '%t': function() {
            return '\t';
          },
          '%u': function(date) {
            return date.tm_wday || 7;
          },
          '%U': function(date) {
            // Replaced by the week number of the year as a decimal number [00,53].
            // The first Sunday of January is the first day of week 1;
            // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
            var janFirst = new Date(date.tm_year+1900, 0, 1);
            var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
            var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
    
            // is target date after the first Sunday?
            if (compareByDay(firstSunday, endDate) < 0) {
              // calculate difference in days between first Sunday and endDate
              var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
              var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
              var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
              return leadingNulls(Math.ceil(days/7), 2);
            }
    
            return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
          },
          '%V': function(date) {
            // Replaced by the week number of the year (Monday as the first day of the week)
            // as a decimal number [01,53]. If the week containing 1 January has four
            // or more days in the new year, then it is considered week 1.
            // Otherwise, it is the last week of the previous year, and the next week is week 1.
            // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
            var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
            var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
    
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
    
            var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
    
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
              // if given date is before this years first week, then it belongs to the 53rd week of last year
              return '53';
            }
    
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
              // if given date is after next years first week, then it belongs to the 01th week of next year
              return '01';
            }
    
            // given date is in between CW 01..53 of this calendar year
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
              // first CW of this year starts last year
              daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate();
            } else {
              // first CW of this year starts this year
              daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
            }
            return leadingNulls(Math.ceil(daysDifference/7), 2);
          },
          '%w': function(date) {
            return date.tm_wday;
          },
          '%W': function(date) {
            // Replaced by the week number of the year as a decimal number [00,53].
            // The first Monday of January is the first day of week 1;
            // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
            var janFirst = new Date(date.tm_year, 0, 1);
            var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
            var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
    
            // is target date after the first Monday?
            if (compareByDay(firstMonday, endDate) < 0) {
              var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
              var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
              var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
              return leadingNulls(Math.ceil(days/7), 2);
            }
            return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
          },
          '%y': function(date) {
            // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
            return (date.tm_year+1900).toString().substring(2);
          },
          '%Y': function(date) {
            // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
            return date.tm_year+1900;
          },
          '%z': function(date) {
            // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
            // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            // convert from minutes into hhmm format (which means 60 minutes = 100 units)
            off = (off / 60)*100 + (off % 60);
            return (ahead ? '+' : '-') + String("0000" + off).slice(-4);
          },
          '%Z': function(date) {
            return date.tm_zone;
          },
          '%%': function() {
            return '%';
          }
        };
        for (var rule in EXPANSION_RULES_2) {
          if (pattern.indexOf(rule) >= 0) {
            pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
          }
        }
    
        var bytes = intArrayFromString(pattern, false);
        if (bytes.length > maxsize) {
          return 0;
        }
    
        writeArrayToMemory(bytes, s);
        return bytes.length-1;
      }

    function _strftime_l(s, maxsize, format, tm) {
        return _strftime(s, maxsize, format, tm); // no locale support yet
      }

    function _sysconf(name) {
        // long sysconf(int name);
        // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
        switch(name) {
          case 30: return 16384;
          case 85:
            var maxHeapSize = 2147483648;
            return maxHeapSize / 16384;
          case 132:
          case 133:
          case 12:
          case 137:
          case 138:
          case 15:
          case 235:
          case 16:
          case 17:
          case 18:
          case 19:
          case 20:
          case 149:
          case 13:
          case 10:
          case 236:
          case 153:
          case 9:
          case 21:
          case 22:
          case 159:
          case 154:
          case 14:
          case 77:
          case 78:
          case 139:
          case 80:
          case 81:
          case 82:
          case 68:
          case 67:
          case 164:
          case 11:
          case 29:
          case 47:
          case 48:
          case 95:
          case 52:
          case 51:
          case 46:
          case 79:
            return 200809;
          case 27:
          case 246:
          case 127:
          case 128:
          case 23:
          case 24:
          case 160:
          case 161:
          case 181:
          case 182:
          case 242:
          case 183:
          case 184:
          case 243:
          case 244:
          case 245:
          case 165:
          case 178:
          case 179:
          case 49:
          case 50:
          case 168:
          case 169:
          case 175:
          case 170:
          case 171:
          case 172:
          case 97:
          case 76:
          case 32:
          case 173:
          case 35:
            return -1;
          case 176:
          case 177:
          case 7:
          case 155:
          case 8:
          case 157:
          case 125:
          case 126:
          case 92:
          case 93:
          case 129:
          case 130:
          case 131:
          case 94:
          case 91:
            return 1;
          case 74:
          case 60:
          case 69:
          case 70:
          case 4:
            return 1024;
          case 31:
          case 42:
          case 72:
            return 32;
          case 87:
          case 26:
          case 33:
            return 2147483647;
          case 34:
          case 1:
            return 47839;
          case 38:
          case 36:
            return 99;
          case 43:
          case 37:
            return 2048;
          case 0: return 2097152;
          case 3: return 65536;
          case 28: return 32768;
          case 44: return 32767;
          case 75: return 16384;
          case 39: return 1000;
          case 89: return 700;
          case 71: return 256;
          case 40: return 255;
          case 2: return 100;
          case 180: return 64;
          case 25: return 20;
          case 5: return 16;
          case 6: return 6;
          case 73: return 4;
          case 84: {
            if (typeof navigator === 'object') return navigator['hardwareConcurrency'] || 1;
            return 1;
          }
        }
        setErrNo(28);
        return -1;
      }

    function _time(ptr) {
        var ret = (Date.now()/1000)|0;
        if (ptr) {
          HEAP32[((ptr)>>2)]=ret;
        }
        return ret;
      }


  var FSNode = /** @constructor */ function(parent, name, mode, rdev) {
      if (!parent) {
        parent = this;  // root node sets parent to itself
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.mounted = null;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.node_ops = {};
      this.stream_ops = {};
      this.rdev = rdev;
    };
    var readMode = 292/*292*/ | 73/*73*/;
    var writeMode = 146/*146*/;
    Object.defineProperties(FSNode.prototype, {
     read: {
      get: /** @this{FSNode} */function() {
       return (this.mode & readMode) === readMode;
      },
      set: /** @this{FSNode} */function(val) {
       val ? this.mode |= readMode : this.mode &= ~readMode;
      }
     },
     write: {
      get: /** @this{FSNode} */function() {
       return (this.mode & writeMode) === writeMode;
      },
      set: /** @this{FSNode} */function(val) {
       val ? this.mode |= writeMode : this.mode &= ~writeMode;
      }
     },
     isFolder: {
      get: /** @this{FSNode} */function() {
       return FS.isDir(this.mode);
      }
     },
     isDevice: {
      get: /** @this{FSNode} */function() {
       return FS.isChrdev(this.mode);
      }
     }
    });
    FS.FSNode = FSNode;
    FS.staticInit();Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createDevice"] = FS.createDevice;Module["FS_unlink"] = FS.unlink;embind_init_charCodes();
  BindingError = Module['BindingError'] = extendError(Error, 'BindingError');InternalError = Module['InternalError'] = extendError(Error, 'InternalError');init_emval();UnboundTypeError = Module['UnboundTypeError'] = extendError(Error, 'UnboundTypeError');Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas) { Browser.requestFullscreen(lockPointer, resizeCanvas); };
    Module["requestFullScreen"] = function Module_requestFullScreen() { Browser.requestFullScreen(); };
    Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func); };
    Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates); };
    Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause(); };
    Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume(); };
    Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia(); };
    Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) { return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes) };
  var GLctx;for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
    for (/**@suppress{duplicate}*/var i = 0; i < 288; ++i) {
    miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i+1);
    }
  var __miniTempWebGLIntBuffersStorage = new Int32Array(288);
    for (/**@suppress{duplicate}*/var i = 0; i < 288; ++i) {
    __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(0, i+1);
    }



  /** @type {function(string, boolean=, number=)} */
  function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }



  __ATINIT__.push({ func: function() { ___wasm_call_ctors(); } });
  var asmLibraryArg = { "__assert_fail": ___assert_fail, "__cxa_allocate_exception": ___cxa_allocate_exception, "__cxa_atexit": ___cxa_atexit, "__cxa_rethrow": ___cxa_rethrow, "__cxa_thread_atexit": ___cxa_thread_atexit, "__cxa_throw": ___cxa_throw, "__handle_stack_overflow": ___handle_stack_overflow, "__localtime_r": ___localtime_r, "__sys_access": ___sys_access, "__sys_chmod": ___sys_chmod, "__sys_fchmod": ___sys_fchmod, "__sys_fcntl64": ___sys_fcntl64, "__sys_fstat64": ___sys_fstat64, "__sys_ftruncate64": ___sys_ftruncate64, "__sys_getcwd": ___sys_getcwd, "__sys_getdents64": ___sys_getdents64, "__sys_geteuid32": ___sys_geteuid32, "__sys_getpid": ___sys_getpid, "__sys_getuid32": ___sys_getuid32, "__sys_ioctl": ___sys_ioctl, "__sys_link": ___sys_link, "__sys_lstat64": ___sys_lstat64, "__sys_mkdir": ___sys_mkdir, "__sys_mmap2": ___sys_mmap2, "__sys_munmap": ___sys_munmap, "__sys_open": ___sys_open, "__sys_poll": ___sys_poll, "__sys_read": ___sys_read, "__sys_readlink": ___sys_readlink, "__sys_rename": ___sys_rename, "__sys_rmdir": ___sys_rmdir, "__sys_stat64": ___sys_stat64, "__sys_symlink": ___sys_symlink, "__sys_truncate64": ___sys_truncate64, "__sys_uname": ___sys_uname, "__sys_unlink": ___sys_unlink, "__sys_utimensat": ___sys_utimensat, "_embind_register_bool": __embind_register_bool, "_embind_register_emval": __embind_register_emval, "_embind_register_float": __embind_register_float, "_embind_register_function": __embind_register_function, "_embind_register_integer": __embind_register_integer, "_embind_register_memory_view": __embind_register_memory_view, "_embind_register_std_string": __embind_register_std_string, "_embind_register_std_wstring": __embind_register_std_wstring, "_embind_register_void": __embind_register_void, "_emval_as": __emval_as, "_emval_call": __emval_call, "_emval_call_method": __emval_call_method, "_emval_call_void_method": __emval_call_void_method, "_emval_decref": __emval_decref, "_emval_equals": __emval_equals, "_emval_get_global": __emval_get_global, "_emval_get_method_caller": __emval_get_method_caller, "_emval_get_module_property": __emval_get_module_property, "_emval_get_property": __emval_get_property, "_emval_incref": __emval_incref, "_emval_is_string": __emval_is_string, "_emval_new": __emval_new, "_emval_new_cstring": __emval_new_cstring, "_emval_new_object": __emval_new_object, "_emval_run_destructors": __emval_run_destructors, "_emval_set_property": __emval_set_property, "_emval_take_value": __emval_take_value, "abort": _abort, "clock_gettime": _clock_gettime, "dlclose": _dlclose, "dlerror": _dlerror, "dlopen": _dlopen, "dlsym": _dlsym, "eglGetProcAddress": _eglGetProcAddress, "emscripten_async_call": _emscripten_async_call, "emscripten_date_now": _emscripten_date_now, "emscripten_force_exit": _emscripten_force_exit, "emscripten_get_element_css_size": _emscripten_get_element_css_size, "emscripten_glActiveTexture": _emscripten_glActiveTexture, "emscripten_glAttachShader": _emscripten_glAttachShader, "emscripten_glBeginQueryEXT": _emscripten_glBeginQueryEXT, "emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation, "emscripten_glBindBuffer": _emscripten_glBindBuffer, "emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer, "emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer, "emscripten_glBindTexture": _emscripten_glBindTexture, "emscripten_glBindVertexArrayOES": _emscripten_glBindVertexArrayOES, "emscripten_glBlendColor": _emscripten_glBlendColor, "emscripten_glBlendEquation": _emscripten_glBlendEquation, "emscripten_glBlendEquationSeparate": _emscripten_glBlendEquationSeparate, "emscripten_glBlendFunc": _emscripten_glBlendFunc, "emscripten_glBlendFuncSeparate": _emscripten_glBlendFuncSeparate, "emscripten_glBufferData": _emscripten_glBufferData, "emscripten_glBufferSubData": _emscripten_glBufferSubData, "emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus, "emscripten_glClear": _emscripten_glClear, "emscripten_glClearColor": _emscripten_glClearColor, "emscripten_glClearDepthf": _emscripten_glClearDepthf, "emscripten_glClearStencil": _emscripten_glClearStencil, "emscripten_glColorMask": _emscripten_glColorMask, "emscripten_glCompileShader": _emscripten_glCompileShader, "emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D, "emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D, "emscripten_glCopyTexImage2D": _emscripten_glCopyTexImage2D, "emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D, "emscripten_glCreateProgram": _emscripten_glCreateProgram, "emscripten_glCreateShader": _emscripten_glCreateShader, "emscripten_glCullFace": _emscripten_glCullFace, "emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers, "emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers, "emscripten_glDeleteProgram": _emscripten_glDeleteProgram, "emscripten_glDeleteQueriesEXT": _emscripten_glDeleteQueriesEXT, "emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers, "emscripten_glDeleteShader": _emscripten_glDeleteShader, "emscripten_glDeleteTextures": _emscripten_glDeleteTextures, "emscripten_glDeleteVertexArraysOES": _emscripten_glDeleteVertexArraysOES, "emscripten_glDepthFunc": _emscripten_glDepthFunc, "emscripten_glDepthMask": _emscripten_glDepthMask, "emscripten_glDepthRangef": _emscripten_glDepthRangef, "emscripten_glDetachShader": _emscripten_glDetachShader, "emscripten_glDisable": _emscripten_glDisable, "emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray, "emscripten_glDrawArrays": _emscripten_glDrawArrays, "emscripten_glDrawArraysInstancedANGLE": _emscripten_glDrawArraysInstancedANGLE, "emscripten_glDrawBuffersWEBGL": _emscripten_glDrawBuffersWEBGL, "emscripten_glDrawElements": _emscripten_glDrawElements, "emscripten_glDrawElementsInstancedANGLE": _emscripten_glDrawElementsInstancedANGLE, "emscripten_glEnable": _emscripten_glEnable, "emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray, "emscripten_glEndQueryEXT": _emscripten_glEndQueryEXT, "emscripten_glFinish": _emscripten_glFinish, "emscripten_glFlush": _emscripten_glFlush, "emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer, "emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D, "emscripten_glFrontFace": _emscripten_glFrontFace, "emscripten_glGenBuffers": _emscripten_glGenBuffers, "emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers, "emscripten_glGenQueriesEXT": _emscripten_glGenQueriesEXT, "emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers, "emscripten_glGenTextures": _emscripten_glGenTextures, "emscripten_glGenVertexArraysOES": _emscripten_glGenVertexArraysOES, "emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap, "emscripten_glGetActiveAttrib": _emscripten_glGetActiveAttrib, "emscripten_glGetActiveUniform": _emscripten_glGetActiveUniform, "emscripten_glGetAttachedShaders": _emscripten_glGetAttachedShaders, "emscripten_glGetAttribLocation": _emscripten_glGetAttribLocation, "emscripten_glGetBooleanv": _emscripten_glGetBooleanv, "emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv, "emscripten_glGetError": _emscripten_glGetError, "emscripten_glGetFloatv": _emscripten_glGetFloatv, "emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv, "emscripten_glGetIntegerv": _emscripten_glGetIntegerv, "emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog, "emscripten_glGetProgramiv": _emscripten_glGetProgramiv, "emscripten_glGetQueryObjecti64vEXT": _emscripten_glGetQueryObjecti64vEXT, "emscripten_glGetQueryObjectivEXT": _emscripten_glGetQueryObjectivEXT, "emscripten_glGetQueryObjectui64vEXT": _emscripten_glGetQueryObjectui64vEXT, "emscripten_glGetQueryObjectuivEXT": _emscripten_glGetQueryObjectuivEXT, "emscripten_glGetQueryivEXT": _emscripten_glGetQueryivEXT, "emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv, "emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog, "emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat, "emscripten_glGetShaderSource": _emscripten_glGetShaderSource, "emscripten_glGetShaderiv": _emscripten_glGetShaderiv, "emscripten_glGetString": _emscripten_glGetString, "emscripten_glGetTexParameterfv": _emscripten_glGetTexParameterfv, "emscripten_glGetTexParameteriv": _emscripten_glGetTexParameteriv, "emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation, "emscripten_glGetUniformfv": _emscripten_glGetUniformfv, "emscripten_glGetUniformiv": _emscripten_glGetUniformiv, "emscripten_glGetVertexAttribPointerv": _emscripten_glGetVertexAttribPointerv, "emscripten_glGetVertexAttribfv": _emscripten_glGetVertexAttribfv, "emscripten_glGetVertexAttribiv": _emscripten_glGetVertexAttribiv, "emscripten_glHint": _emscripten_glHint, "emscripten_glIsBuffer": _emscripten_glIsBuffer, "emscripten_glIsEnabled": _emscripten_glIsEnabled, "emscripten_glIsFramebuffer": _emscripten_glIsFramebuffer, "emscripten_glIsProgram": _emscripten_glIsProgram, "emscripten_glIsQueryEXT": _emscripten_glIsQueryEXT, "emscripten_glIsRenderbuffer": _emscripten_glIsRenderbuffer, "emscripten_glIsShader": _emscripten_glIsShader, "emscripten_glIsTexture": _emscripten_glIsTexture, "emscripten_glIsVertexArrayOES": _emscripten_glIsVertexArrayOES, "emscripten_glLineWidth": _emscripten_glLineWidth, "emscripten_glLinkProgram": _emscripten_glLinkProgram, "emscripten_glPixelStorei": _emscripten_glPixelStorei, "emscripten_glPolygonOffset": _emscripten_glPolygonOffset, "emscripten_glQueryCounterEXT": _emscripten_glQueryCounterEXT, "emscripten_glReadPixels": _emscripten_glReadPixels, "emscripten_glReleaseShaderCompiler": _emscripten_glReleaseShaderCompiler, "emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage, "emscripten_glSampleCoverage": _emscripten_glSampleCoverage, "emscripten_glScissor": _emscripten_glScissor, "emscripten_glShaderBinary": _emscripten_glShaderBinary, "emscripten_glShaderSource": _emscripten_glShaderSource, "emscripten_glStencilFunc": _emscripten_glStencilFunc, "emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate, "emscripten_glStencilMask": _emscripten_glStencilMask, "emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate, "emscripten_glStencilOp": _emscripten_glStencilOp, "emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate, "emscripten_glTexImage2D": _emscripten_glTexImage2D, "emscripten_glTexParameterf": _emscripten_glTexParameterf, "emscripten_glTexParameterfv": _emscripten_glTexParameterfv, "emscripten_glTexParameteri": _emscripten_glTexParameteri, "emscripten_glTexParameteriv": _emscripten_glTexParameteriv, "emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D, "emscripten_glUniform1f": _emscripten_glUniform1f, "emscripten_glUniform1fv": _emscripten_glUniform1fv, "emscripten_glUniform1i": _emscripten_glUniform1i, "emscripten_glUniform1iv": _emscripten_glUniform1iv, "emscripten_glUniform2f": _emscripten_glUniform2f, "emscripten_glUniform2fv": _emscripten_glUniform2fv, "emscripten_glUniform2i": _emscripten_glUniform2i, "emscripten_glUniform2iv": _emscripten_glUniform2iv, "emscripten_glUniform3f": _emscripten_glUniform3f, "emscripten_glUniform3fv": _emscripten_glUniform3fv, "emscripten_glUniform3i": _emscripten_glUniform3i, "emscripten_glUniform3iv": _emscripten_glUniform3iv, "emscripten_glUniform4f": _emscripten_glUniform4f, "emscripten_glUniform4fv": _emscripten_glUniform4fv, "emscripten_glUniform4i": _emscripten_glUniform4i, "emscripten_glUniform4iv": _emscripten_glUniform4iv, "emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv, "emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv, "emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv, "emscripten_glUseProgram": _emscripten_glUseProgram, "emscripten_glValidateProgram": _emscripten_glValidateProgram, "emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f, "emscripten_glVertexAttrib1fv": _emscripten_glVertexAttrib1fv, "emscripten_glVertexAttrib2f": _emscripten_glVertexAttrib2f, "emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv, "emscripten_glVertexAttrib3f": _emscripten_glVertexAttrib3f, "emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv, "emscripten_glVertexAttrib4f": _emscripten_glVertexAttrib4f, "emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv, "emscripten_glVertexAttribDivisorANGLE": _emscripten_glVertexAttribDivisorANGLE, "emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer, "emscripten_glViewport": _emscripten_glViewport, "emscripten_idb_async_delete": _emscripten_idb_async_delete, "emscripten_idb_async_exists": _emscripten_idb_async_exists, "emscripten_idb_async_load": _emscripten_idb_async_load, "emscripten_idb_async_store": _emscripten_idb_async_store, "emscripten_is_webgl_context_lost": _emscripten_is_webgl_context_lost, "emscripten_log": _emscripten_log, "emscripten_longjmp": _emscripten_longjmp, "emscripten_longjmp_jmpbuf": _emscripten_longjmp_jmpbuf, "emscripten_memcpy_big": _emscripten_memcpy_big, "emscripten_pause_main_loop": _emscripten_pause_main_loop, "emscripten_resize_heap": _emscripten_resize_heap, "emscripten_resume_main_loop": _emscripten_resume_main_loop, "emscripten_set_focus_callback_on_thread": _emscripten_set_focus_callback_on_thread, "emscripten_set_keydown_callback_on_thread": _emscripten_set_keydown_callback_on_thread, "emscripten_set_keyup_callback_on_thread": _emscripten_set_keyup_callback_on_thread, "emscripten_set_main_loop_arg": _emscripten_set_main_loop_arg, "emscripten_set_mousedown_callback_on_thread": _emscripten_set_mousedown_callback_on_thread, "emscripten_set_mousemove_callback_on_thread": _emscripten_set_mousemove_callback_on_thread, "emscripten_set_mouseup_callback_on_thread": _emscripten_set_mouseup_callback_on_thread, "emscripten_set_resize_callback_on_thread": _emscripten_set_resize_callback_on_thread, "emscripten_set_touchcancel_callback_on_thread": _emscripten_set_touchcancel_callback_on_thread, "emscripten_set_touchend_callback_on_thread": _emscripten_set_touchend_callback_on_thread, "emscripten_set_touchmove_callback_on_thread": _emscripten_set_touchmove_callback_on_thread, "emscripten_set_touchstart_callback_on_thread": _emscripten_set_touchstart_callback_on_thread, "emscripten_set_wheel_callback_on_thread": _emscripten_set_wheel_callback_on_thread, "emscripten_sleep": _emscripten_sleep, "emscripten_webgl_create_context": _emscripten_webgl_create_context, "emscripten_webgl_destroy_context": _emscripten_webgl_destroy_context, "emscripten_webgl_init_context_attributes": _emscripten_webgl_init_context_attributes, "emscripten_webgl_make_context_current": _emscripten_webgl_make_context_current, "environ_get": _environ_get, "environ_sizes_get": _environ_sizes_get, "exit": _exit, "fd_close": _fd_close, "fd_fdstat_get": _fd_fdstat_get, "fd_read": _fd_read, "fd_seek": _fd_seek, "fd_sync": _fd_sync, "fd_write": _fd_write, "flock": _flock, "getTempRet0": _getTempRet0, "gettimeofday": _gettimeofday, "glActiveTexture": _glActiveTexture, "glCompressedTexImage2D": _glCompressedTexImage2D, "glCompressedTexSubImage2D": _glCompressedTexSubImage2D, "glGenerateMipmap": _glGenerateMipmap, "glTexSubImage2D": _glTexSubImage2D, "glViewport": _glViewport, "invoke_fi": invoke_fi, "invoke_ii": invoke_ii, "invoke_iii": invoke_iii, "invoke_iiii": invoke_iiii, "invoke_iiiif": invoke_iiiif, "invoke_iiiii": invoke_iiiii, "invoke_iiiiii": invoke_iiiiii, "invoke_iiiiiii": invoke_iiiiiii, "invoke_iiiiiiif": invoke_iiiiiiif, "invoke_iiiiiiiiii": invoke_iiiiiiiiii, "invoke_iiiiiiiiiii": invoke_iiiiiiiiiii, "invoke_iij": invoke_iij, "invoke_ji": invoke_ji, "invoke_v": invoke_v, "invoke_vi": invoke_vi, "invoke_vidd": invoke_vidd, "invoke_vii": invoke_vii, "invoke_viid": invoke_viid, "invoke_viii": invoke_viii, "invoke_viiif": invoke_viiif, "invoke_viiii": invoke_viiii, "invoke_viiiii": invoke_viiiii, "invoke_viiiiii": invoke_viiiiii, "invoke_viiiiiii": invoke_viiiiiii, "invoke_viiiiiiiii": invoke_viiiiiiiii, "kill": _kill, "memory": wasmMemory, "mktime": _mktime, "nanosleep": _nanosleep, "pthread_create": _pthread_create, "pthread_join": _pthread_join, "pthread_mutexattr_destroy": _pthread_mutexattr_destroy, "pthread_mutexattr_init": _pthread_mutexattr_init, "pthread_mutexattr_settype": _pthread_mutexattr_settype, "setTempRet0": _setTempRet0, "strftime": _strftime, "strftime_l": _strftime_l, "sysconf": _sysconf, "time": _time, "tzset": _tzset };
  createWasm();
  /** @type {function(...*):?} */
  var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

  /** @type {function(...*):?} */
  var _strlen = Module["_strlen"] = createExportWrapper("strlen");

  /** @type {function(...*):?} */
  var _memset = Module["_memset"] = createExportWrapper("memset");

  /** @type {function(...*):?} */
  Module["_version"] = createExportWrapper("version");

  /** @type {function(...*):?} */
  Module["_setLogLevel"] = createExportWrapper("setLogLevel");

  /** @type {function(...*):?} */
  Module["_init"] = createExportWrapper("init");

  /** @type {function(...*):?} */
  Module["_addFont"] = createExportWrapper("addFont");

  /** @type {function(...*):?} */
  Module["_load"] = createExportWrapper("load");

  /** @type {function(...*):?} */
  Module["_generateExcerpts"] = createExportWrapper("generateExcerpts");

  /** @type {function(...*):?} */
  Module["_title"] = createExportWrapper("title");

  /** @type {function(...*):?} */
  Module["_npages"] = createExportWrapper("npages");

  /** @type {function(...*):?} */
  Module["_saveXml"] = createExportWrapper("saveXml");

  /** @type {function(...*):?} */
  Module["_saveMxl"] = createExportWrapper("saveMxl");

  /** @type {function(...*):?} */
  Module["_saveMsc"] = createExportWrapper("saveMsc");

  /** @type {function(...*):?} */
  Module["_saveSvg"] = createExportWrapper("saveSvg");

  /** @type {function(...*):?} */
  Module["_savePng"] = createExportWrapper("savePng");

  /** @type {function(...*):?} */
  Module["_savePdf"] = createExportWrapper("savePdf");

  /** @type {function(...*):?} */
  Module["_saveMidi"] = createExportWrapper("saveMidi");

  /** @type {function(...*):?} */
  Module["_saveAudio"] = createExportWrapper("saveAudio");

  /** @type {function(...*):?} */
  Module["_selectElementAtPoint"] = createExportWrapper("selectElementAtPoint");

  /** @type {function(...*):?} */
  Module["_deleteSelection"] = createExportWrapper("deleteSelection");

  /** @type {function(...*):?} */
  Module["_pitchUp"] = createExportWrapper("pitchUp");

  /** @type {function(...*):?} */
  Module["_pitchDown"] = createExportWrapper("pitchDown");

  /** @type {function(...*):?} */
  Module["_doubleDuration"] = createExportWrapper("doubleDuration");

  /** @type {function(...*):?} */
  Module["_halfDuration"] = createExportWrapper("halfDuration");

  /** @type {function(...*):?} */
  Module["_undo"] = createExportWrapper("undo");

  /** @type {function(...*):?} */
  Module["_redo"] = createExportWrapper("redo");

  /** @type {function(...*):?} */
  Module["_relayout"] = createExportWrapper("relayout");

  /** @type {function(...*):?} */
  Module["_toggleDot"] = createExportWrapper("toggleDot");

  /** @type {function(...*):?} */
  Module["_toggleDoubleDot"] = createExportWrapper("toggleDoubleDot");

  /** @type {function(...*):?} */
  Module["_setVoice"] = createExportWrapper("setVoice");

  /** @type {function(...*):?} */
  Module["_setTimeSignature"] = createExportWrapper("setTimeSignature");

  /** @type {function(...*):?} */
  Module["_setClef"] = createExportWrapper("setClef");

  /** @type {function(...*):?} */
  Module["_synthAudio"] = createExportWrapper("synthAudio");

  /** @type {function(...*):?} */
  Module["_processSynth"] = createExportWrapper("processSynth");

  /** @type {function(...*):?} */
  Module["_processSynthBatch"] = createExportWrapper("processSynthBatch");

  /** @type {function(...*):?} */
  Module["_savePositions"] = createExportWrapper("savePositions");

  /** @type {function(...*):?} */
  Module["_saveMetadata"] = createExportWrapper("saveMetadata");

  /** @type {function(...*):?} */
  Module["_destroy"] = createExportWrapper("destroy");

  /** @type {function(...*):?} */
  var _malloc = Module["_malloc"] = createExportWrapper("malloc");

  /** @type {function(...*):?} */
  Module["_realloc"] = createExportWrapper("realloc");

  /** @type {function(...*):?} */
  var _free = Module["_free"] = createExportWrapper("free");

  /** @type {function(...*):?} */
  var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

  /** @type {function(...*):?} */
  Module["_fflush"] = createExportWrapper("fflush");

  /** @type {function(...*):?} */
  Module["_strstr"] = createExportWrapper("strstr");

  /** @type {function(...*):?} */
  Module["_testSetjmp"] = createExportWrapper("testSetjmp");

  /** @type {function(...*):?} */
  Module["_saveSetjmp"] = createExportWrapper("saveSetjmp");

  /** @type {function(...*):?} */
  var ___getTypeName = Module["___getTypeName"] = createExportWrapper("__getTypeName");

  /** @type {function(...*):?} */
  Module["___embind_register_native_and_builtin_types"] = createExportWrapper("__embind_register_native_and_builtin_types");

  /** @type {function(...*):?} */
  var _emscripten_GetProcAddress = Module["_emscripten_GetProcAddress"] = createExportWrapper("emscripten_GetProcAddress");

  /** @type {function(...*):?} */
  var __get_tzname = Module["__get_tzname"] = createExportWrapper("_get_tzname");

  /** @type {function(...*):?} */
  var __get_daylight = Module["__get_daylight"] = createExportWrapper("_get_daylight");

  /** @type {function(...*):?} */
  var __get_timezone = Module["__get_timezone"] = createExportWrapper("_get_timezone");

  /** @type {function(...*):?} */
  var stackSave = Module["stackSave"] = createExportWrapper("stackSave");

  /** @type {function(...*):?} */
  var stackRestore = Module["stackRestore"] = createExportWrapper("stackRestore");

  /** @type {function(...*):?} */
  var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

  /** @type {function(...*):?} */
  var _setThrew = Module["_setThrew"] = createExportWrapper("setThrew");

  /** @type {function(...*):?} */
  var __ZSt18uncaught_exceptionv = Module["__ZSt18uncaught_exceptionv"] = createExportWrapper("_ZSt18uncaught_exceptionv");

  /** @type {function(...*):?} */
  Module["___cxa_demangle"] = createExportWrapper("__cxa_demangle");

  /** @type {function(...*):?} */
  var _memalign = Module["_memalign"] = createExportWrapper("memalign");

  /** @type {function(...*):?} */
  Module["_emscripten_main_thread_process_queued_calls"] = createExportWrapper("emscripten_main_thread_process_queued_calls");

  /** @type {function(...*):?} */
  Module["___set_stack_limits"] = createExportWrapper("__set_stack_limits");

  /** @type {function(...*):?} */
  var dynCall_iij = Module["dynCall_iij"] = createExportWrapper("dynCall_iij");

  /** @type {function(...*):?} */
  Module["dynCall_viij"] = createExportWrapper("dynCall_viij");

  /** @type {function(...*):?} */
  Module["dynCall_viijii"] = createExportWrapper("dynCall_viijii");

  /** @type {function(...*):?} */
  Module["dynCall_vij"] = createExportWrapper("dynCall_vij");

  /** @type {function(...*):?} */
  var dynCall_ji = Module["dynCall_ji"] = createExportWrapper("dynCall_ji");

  /** @type {function(...*):?} */
  Module["dynCall_jiij"] = createExportWrapper("dynCall_jiij");

  /** @type {function(...*):?} */
  Module["dynCall_jij"] = createExportWrapper("dynCall_jij");

  /** @type {function(...*):?} */
  Module["dynCall_viiji"] = createExportWrapper("dynCall_viiji");

  /** @type {function(...*):?} */
  Module["dynCall_jiii"] = createExportWrapper("dynCall_jiii");

  /** @type {function(...*):?} */
  Module["dynCall_viijj"] = createExportWrapper("dynCall_viijj");

  /** @type {function(...*):?} */
  Module["dynCall_viiijj"] = createExportWrapper("dynCall_viiijj");

  /** @type {function(...*):?} */
  Module["dynCall_iiiij"] = createExportWrapper("dynCall_iiiij");

  /** @type {function(...*):?} */
  Module["dynCall_iiji"] = createExportWrapper("dynCall_iiji");

  /** @type {function(...*):?} */
  Module["dynCall_vijjii"] = createExportWrapper("dynCall_vijjii");

  /** @type {function(...*):?} */
  Module["dynCall_vijjiii"] = createExportWrapper("dynCall_vijjiii");

  /** @type {function(...*):?} */
  Module["dynCall_jjii"] = createExportWrapper("dynCall_jjii");

  /** @type {function(...*):?} */
  Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

  /** @type {function(...*):?} */
  Module["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij");

  /** @type {function(...*):?} */
  Module["dynCall_iiiiijj"] = createExportWrapper("dynCall_iiiiijj");

  /** @type {function(...*):?} */
  Module["dynCall_iiiiiijj"] = createExportWrapper("dynCall_iiiiiijj");


  function invoke_iiiii(index,a1,a2,a3,a4) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2,a3,a4);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_viiii(index,a1,a2,a3,a4) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3,a4);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iiii(index,a1,a2,a3) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2,a3);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_ii(index,a1) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_viii(index,a1,a2,a3) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_vii(index,a1,a2) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2,a3,a4,a5,a6);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iii(index,a1,a2) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iiiiiiif(index,a1,a2,a3,a4,a5,a6,a7) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iiiif(index,a1,a2,a3,a4) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2,a3,a4);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_vidd(index,a1,a2,a3) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_viiif(index,a1,a2,a3,a4) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3,a4);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_vi(index,a1) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1,a2,a3,a4,a5);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_viiiii(index,a1,a2,a3,a4,a5) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3,a4,a5);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_viid(index,a1,a2,a3) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_fi(index,a1) {
    var sp = stackSave();
    try {
      return wasmTable.get(index)(a1);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3,a4,a5,a6);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
    var sp = stackSave();
    try {
      wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_v(index) {
    var sp = stackSave();
    try {
      wasmTable.get(index)();
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_ji(index,a1) {
    var sp = stackSave();
    try {
      return dynCall_ji(index,a1);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }

  function invoke_iij(index,a1,a2,a3) {
    var sp = stackSave();
    try {
      return dynCall_iij(index,a1,a2,a3);
    } catch(e) {
      stackRestore(sp);
      if (e !== e+0 && e !== 'longjmp') throw e;
      _setThrew(1, 0);
    }
  }




  // === Auto-generated postamble setup entry stuff ===

  if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString")) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString")) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  Module["ccall"] = ccall;
  Module["cwrap"] = cwrap;
  Module["setValue"] = setValue;
  Module["getValue"] = getValue;
  if (!Object.getOwnPropertyDescriptor(Module, "allocate")) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString")) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  Module["UTF8ToString"] = UTF8ToString;
  if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array")) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  Module["stringToUTF8"] = stringToUTF8;
  if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8")) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun")) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "addOnInit")) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain")) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "addOnExit")) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun")) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory")) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory")) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory")) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  Module["addRunDependency"] = addRunDependency;
  Module["removeRunDependency"] = removeRunDependency;
  if (!Object.getOwnPropertyDescriptor(Module, "FS_createFolder")) Module["FS_createFolder"] = function() { abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  Module["FS_createPath"] = FS.createPath;
  Module["FS_createDataFile"] = FS.createDataFile;
  Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
  Module["FS_createLazyFile"] = FS.createLazyFile;
  if (!Object.getOwnPropertyDescriptor(Module, "FS_createLink")) Module["FS_createLink"] = function() { abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  Module["FS_createDevice"] = FS.createDevice;
  Module["FS_unlink"] = FS.unlink;
  if (!Object.getOwnPropertyDescriptor(Module, "getLEB")) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables")) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables")) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions")) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "addFunction")) Module["addFunction"] = function() { abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "removeFunction")) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint")) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt")) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting")) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "print")) Module["print"] = function() { abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "printErr")) Module["printErr"] = function() { abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0")) Module["getTempRet0"] = function() { abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0")) Module["setTempRet0"] = function() { abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "callMain")) Module["callMain"] = function() { abort("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "abort")) Module["abort"] = function() { abort("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stringToNewUTF8")) Module["stringToNewUTF8"] = function() { abort("'stringToNewUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emscripten_realloc_buffer")) Module["emscripten_realloc_buffer"] = function() { abort("'emscripten_realloc_buffer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ENV")) Module["ENV"] = function() { abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_CODES")) Module["ERRNO_CODES"] = function() { abort("'ERRNO_CODES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_MESSAGES")) Module["ERRNO_MESSAGES"] = function() { abort("'ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "setErrNo")) Module["setErrNo"] = function() { abort("'setErrNo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "DNS")) Module["DNS"] = function() { abort("'DNS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getHostByName")) Module["getHostByName"] = function() { abort("'getHostByName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "GAI_ERRNO_MESSAGES")) Module["GAI_ERRNO_MESSAGES"] = function() { abort("'GAI_ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "Protocols")) Module["Protocols"] = function() { abort("'Protocols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "Sockets")) Module["Sockets"] = function() { abort("'Sockets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getRandomDevice")) Module["getRandomDevice"] = function() { abort("'getRandomDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "traverseStack")) Module["traverseStack"] = function() { abort("'traverseStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "UNWIND_CACHE")) Module["UNWIND_CACHE"] = function() { abort("'UNWIND_CACHE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "withBuiltinMalloc")) Module["withBuiltinMalloc"] = function() { abort("'withBuiltinMalloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgsArray")) Module["readAsmConstArgsArray"] = function() { abort("'readAsmConstArgsArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgs")) Module["readAsmConstArgs"] = function() { abort("'readAsmConstArgs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "mainThreadEM_ASM")) Module["mainThreadEM_ASM"] = function() { abort("'mainThreadEM_ASM' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "jstoi_q")) Module["jstoi_q"] = function() { abort("'jstoi_q' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "jstoi_s")) Module["jstoi_s"] = function() { abort("'jstoi_s' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getExecutableName")) Module["getExecutableName"] = function() { abort("'getExecutableName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "listenOnce")) Module["listenOnce"] = function() { abort("'listenOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "autoResumeAudioContext")) Module["autoResumeAudioContext"] = function() { abort("'autoResumeAudioContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "dynCallLegacy")) Module["dynCallLegacy"] = function() { abort("'dynCallLegacy' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getDynCaller")) Module["getDynCaller"] = function() { abort("'getDynCaller' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "callRuntimeCallbacks")) Module["callRuntimeCallbacks"] = function() { abort("'callRuntimeCallbacks' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "abortStackOverflow")) Module["abortStackOverflow"] = function() { abort("'abortStackOverflow' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "reallyNegative")) Module["reallyNegative"] = function() { abort("'reallyNegative' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "unSign")) Module["unSign"] = function() { abort("'unSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "reSign")) Module["reSign"] = function() { abort("'reSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "formatString")) Module["formatString"] = function() { abort("'formatString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "PATH")) Module["PATH"] = function() { abort("'PATH' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "PATH_FS")) Module["PATH_FS"] = function() { abort("'PATH_FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "SYSCALLS")) Module["SYSCALLS"] = function() { abort("'SYSCALLS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "syscallMmap2")) Module["syscallMmap2"] = function() { abort("'syscallMmap2' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "syscallMunmap")) Module["syscallMunmap"] = function() { abort("'syscallMunmap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "JSEvents")) Module["JSEvents"] = function() { abort("'JSEvents' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "specialHTMLTargets")) Module["specialHTMLTargets"] = function() { abort("'specialHTMLTargets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "maybeCStringToJsString")) Module["maybeCStringToJsString"] = function() { abort("'maybeCStringToJsString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "findEventTarget")) Module["findEventTarget"] = function() { abort("'findEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "findCanvasEventTarget")) Module["findCanvasEventTarget"] = function() { abort("'findCanvasEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "polyfillSetImmediate")) Module["polyfillSetImmediate"] = function() { abort("'polyfillSetImmediate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "demangle")) Module["demangle"] = function() { abort("'demangle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "demangleAll")) Module["demangleAll"] = function() { abort("'demangleAll' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "jsStackTrace")) Module["jsStackTrace"] = function() { abort("'jsStackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getEnvStrings")) Module["getEnvStrings"] = function() { abort("'getEnvStrings' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "checkWasiClock")) Module["checkWasiClock"] = function() { abort("'checkWasiClock' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64")) Module["writeI53ToI64"] = function() { abort("'writeI53ToI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Clamped")) Module["writeI53ToI64Clamped"] = function() { abort("'writeI53ToI64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Signaling")) Module["writeI53ToI64Signaling"] = function() { abort("'writeI53ToI64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Clamped")) Module["writeI53ToU64Clamped"] = function() { abort("'writeI53ToU64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Signaling")) Module["writeI53ToU64Signaling"] = function() { abort("'writeI53ToU64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "readI53FromI64")) Module["readI53FromI64"] = function() { abort("'readI53FromI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "readI53FromU64")) Module["readI53FromU64"] = function() { abort("'readI53FromU64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "convertI32PairToI53")) Module["convertI32PairToI53"] = function() { abort("'convertI32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "convertU32PairToI53")) Module["convertU32PairToI53"] = function() { abort("'convertU32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "exceptionLast")) Module["exceptionLast"] = function() { abort("'exceptionLast' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "exceptionCaught")) Module["exceptionCaught"] = function() { abort("'exceptionCaught' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ExceptionInfoAttrs")) Module["ExceptionInfoAttrs"] = function() { abort("'ExceptionInfoAttrs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ExceptionInfo")) Module["ExceptionInfo"] = function() { abort("'ExceptionInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "CatchInfo")) Module["CatchInfo"] = function() { abort("'CatchInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "exception_addRef")) Module["exception_addRef"] = function() { abort("'exception_addRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "exception_decRef")) Module["exception_decRef"] = function() { abort("'exception_decRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "Browser")) Module["Browser"] = function() { abort("'Browser' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "funcWrappers")) Module["funcWrappers"] = function() { abort("'funcWrappers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "setMainLoop")) Module["setMainLoop"] = function() { abort("'setMainLoop' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "FS")) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "mmapAlloc")) Module["mmapAlloc"] = function() { abort("'mmapAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "MEMFS")) Module["MEMFS"] = function() { abort("'MEMFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "TTY")) Module["TTY"] = function() { abort("'TTY' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "PIPEFS")) Module["PIPEFS"] = function() { abort("'PIPEFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "SOCKFS")) Module["SOCKFS"] = function() { abort("'SOCKFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "tempFixedLengthArray")) Module["tempFixedLengthArray"] = function() { abort("'tempFixedLengthArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "miniTempWebGLFloatBuffers")) Module["miniTempWebGLFloatBuffers"] = function() { abort("'miniTempWebGLFloatBuffers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "heapObjectForWebGLType")) Module["heapObjectForWebGLType"] = function() { abort("'heapObjectForWebGLType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "heapAccessShiftForWebGLHeap")) Module["heapAccessShiftForWebGLHeap"] = function() { abort("'heapAccessShiftForWebGLHeap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "GL")) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGet")) Module["emscriptenWebGLGet"] = function() { abort("'emscriptenWebGLGet' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "computeUnpackAlignedImageSize")) Module["computeUnpackAlignedImageSize"] = function() { abort("'computeUnpackAlignedImageSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetTexPixelData")) Module["emscriptenWebGLGetTexPixelData"] = function() { abort("'emscriptenWebGLGetTexPixelData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetUniform")) Module["emscriptenWebGLGetUniform"] = function() { abort("'emscriptenWebGLGetUniform' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetVertexAttrib")) Module["emscriptenWebGLGetVertexAttrib"] = function() { abort("'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "writeGLArray")) Module["writeGLArray"] = function() { abort("'writeGLArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "AL")) Module["AL"] = function() { abort("'AL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "SDL_unicode")) Module["SDL_unicode"] = function() { abort("'SDL_unicode' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "SDL_ttfContext")) Module["SDL_ttfContext"] = function() { abort("'SDL_ttfContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "SDL_audio")) Module["SDL_audio"] = function() { abort("'SDL_audio' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "SDL")) Module["SDL"] = function() { abort("'SDL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "SDL_gfx")) Module["SDL_gfx"] = function() { abort("'SDL_gfx' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "GLUT")) Module["GLUT"] = function() { abort("'GLUT' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "EGL")) Module["EGL"] = function() { abort("'EGL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "GLFW_Window")) Module["GLFW_Window"] = function() { abort("'GLFW_Window' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "GLFW")) Module["GLFW"] = function() { abort("'GLFW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "GLEW")) Module["GLEW"] = function() { abort("'GLEW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "IDBStore")) Module["IDBStore"] = function() { abort("'IDBStore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "runAndAbortIfError")) Module["runAndAbortIfError"] = function() { abort("'runAndAbortIfError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emval_handle_array")) Module["emval_handle_array"] = function() { abort("'emval_handle_array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emval_free_list")) Module["emval_free_list"] = function() { abort("'emval_free_list' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emval_symbols")) Module["emval_symbols"] = function() { abort("'emval_symbols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "init_emval")) Module["init_emval"] = function() { abort("'init_emval' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "count_emval_handles")) Module["count_emval_handles"] = function() { abort("'count_emval_handles' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "get_first_emval")) Module["get_first_emval"] = function() { abort("'get_first_emval' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getStringOrSymbol")) Module["getStringOrSymbol"] = function() { abort("'getStringOrSymbol' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "requireHandle")) Module["requireHandle"] = function() { abort("'requireHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emval_newers")) Module["emval_newers"] = function() { abort("'emval_newers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "craftEmvalAllocator")) Module["craftEmvalAllocator"] = function() { abort("'craftEmvalAllocator' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emval_get_global")) Module["emval_get_global"] = function() { abort("'emval_get_global' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "emval_methodCallers")) Module["emval_methodCallers"] = function() { abort("'emval_methodCallers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "InternalError")) Module["InternalError"] = function() { abort("'InternalError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "BindingError")) Module["BindingError"] = function() { abort("'BindingError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "UnboundTypeError")) Module["UnboundTypeError"] = function() { abort("'UnboundTypeError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "PureVirtualError")) Module["PureVirtualError"] = function() { abort("'PureVirtualError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "init_embind")) Module["init_embind"] = function() { abort("'init_embind' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "throwInternalError")) Module["throwInternalError"] = function() { abort("'throwInternalError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "throwBindingError")) Module["throwBindingError"] = function() { abort("'throwBindingError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "throwUnboundTypeError")) Module["throwUnboundTypeError"] = function() { abort("'throwUnboundTypeError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ensureOverloadTable")) Module["ensureOverloadTable"] = function() { abort("'ensureOverloadTable' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "exposePublicSymbol")) Module["exposePublicSymbol"] = function() { abort("'exposePublicSymbol' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "replacePublicSymbol")) Module["replacePublicSymbol"] = function() { abort("'replacePublicSymbol' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "extendError")) Module["extendError"] = function() { abort("'extendError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "createNamedFunction")) Module["createNamedFunction"] = function() { abort("'createNamedFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "registeredInstances")) Module["registeredInstances"] = function() { abort("'registeredInstances' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getBasestPointer")) Module["getBasestPointer"] = function() { abort("'getBasestPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "registerInheritedInstance")) Module["registerInheritedInstance"] = function() { abort("'registerInheritedInstance' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "unregisterInheritedInstance")) Module["unregisterInheritedInstance"] = function() { abort("'unregisterInheritedInstance' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getInheritedInstance")) Module["getInheritedInstance"] = function() { abort("'getInheritedInstance' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getInheritedInstanceCount")) Module["getInheritedInstanceCount"] = function() { abort("'getInheritedInstanceCount' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getLiveInheritedInstances")) Module["getLiveInheritedInstances"] = function() { abort("'getLiveInheritedInstances' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "registeredTypes")) Module["registeredTypes"] = function() { abort("'registeredTypes' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "awaitingDependencies")) Module["awaitingDependencies"] = function() { abort("'awaitingDependencies' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "typeDependencies")) Module["typeDependencies"] = function() { abort("'typeDependencies' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "registeredPointers")) Module["registeredPointers"] = function() { abort("'registeredPointers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "registerType")) Module["registerType"] = function() { abort("'registerType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "whenDependentTypesAreResolved")) Module["whenDependentTypesAreResolved"] = function() { abort("'whenDependentTypesAreResolved' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "embind_charCodes")) Module["embind_charCodes"] = function() { abort("'embind_charCodes' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "embind_init_charCodes")) Module["embind_init_charCodes"] = function() { abort("'embind_init_charCodes' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "readLatin1String")) Module["readLatin1String"] = function() { abort("'readLatin1String' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getTypeName")) Module["getTypeName"] = function() { abort("'getTypeName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "heap32VectorToArray")) Module["heap32VectorToArray"] = function() { abort("'heap32VectorToArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "requireRegisteredType")) Module["requireRegisteredType"] = function() { abort("'requireRegisteredType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "getShiftFromSize")) Module["getShiftFromSize"] = function() { abort("'getShiftFromSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "integerReadValueFromPointer")) Module["integerReadValueFromPointer"] = function() { abort("'integerReadValueFromPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "enumReadValueFromPointer")) Module["enumReadValueFromPointer"] = function() { abort("'enumReadValueFromPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "floatReadValueFromPointer")) Module["floatReadValueFromPointer"] = function() { abort("'floatReadValueFromPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "simpleReadValueFromPointer")) Module["simpleReadValueFromPointer"] = function() { abort("'simpleReadValueFromPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "runDestructors")) Module["runDestructors"] = function() { abort("'runDestructors' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "new_")) Module["new_"] = function() { abort("'new_' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "craftInvokerFunction")) Module["craftInvokerFunction"] = function() { abort("'craftInvokerFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "embind__requireFunction")) Module["embind__requireFunction"] = function() { abort("'embind__requireFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "tupleRegistrations")) Module["tupleRegistrations"] = function() { abort("'tupleRegistrations' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "structRegistrations")) Module["structRegistrations"] = function() { abort("'structRegistrations' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "genericPointerToWireType")) Module["genericPointerToWireType"] = function() { abort("'genericPointerToWireType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "constNoSmartPtrRawPointerToWireType")) Module["constNoSmartPtrRawPointerToWireType"] = function() { abort("'constNoSmartPtrRawPointerToWireType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "nonConstNoSmartPtrRawPointerToWireType")) Module["nonConstNoSmartPtrRawPointerToWireType"] = function() { abort("'nonConstNoSmartPtrRawPointerToWireType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "init_RegisteredPointer")) Module["init_RegisteredPointer"] = function() { abort("'init_RegisteredPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer")) Module["RegisteredPointer"] = function() { abort("'RegisteredPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer_getPointee")) Module["RegisteredPointer_getPointee"] = function() { abort("'RegisteredPointer_getPointee' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer_destructor")) Module["RegisteredPointer_destructor"] = function() { abort("'RegisteredPointer_destructor' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer_deleteObject")) Module["RegisteredPointer_deleteObject"] = function() { abort("'RegisteredPointer_deleteObject' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer_fromWireType")) Module["RegisteredPointer_fromWireType"] = function() { abort("'RegisteredPointer_fromWireType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "runDestructor")) Module["runDestructor"] = function() { abort("'runDestructor' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "releaseClassHandle")) Module["releaseClassHandle"] = function() { abort("'releaseClassHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "finalizationGroup")) Module["finalizationGroup"] = function() { abort("'finalizationGroup' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "detachFinalizer_deps")) Module["detachFinalizer_deps"] = function() { abort("'detachFinalizer_deps' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "detachFinalizer")) Module["detachFinalizer"] = function() { abort("'detachFinalizer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "attachFinalizer")) Module["attachFinalizer"] = function() { abort("'attachFinalizer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "makeClassHandle")) Module["makeClassHandle"] = function() { abort("'makeClassHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "init_ClassHandle")) Module["init_ClassHandle"] = function() { abort("'init_ClassHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle")) Module["ClassHandle"] = function() { abort("'ClassHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_isAliasOf")) Module["ClassHandle_isAliasOf"] = function() { abort("'ClassHandle_isAliasOf' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "throwInstanceAlreadyDeleted")) Module["throwInstanceAlreadyDeleted"] = function() { abort("'throwInstanceAlreadyDeleted' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_clone")) Module["ClassHandle_clone"] = function() { abort("'ClassHandle_clone' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_delete")) Module["ClassHandle_delete"] = function() { abort("'ClassHandle_delete' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "deletionQueue")) Module["deletionQueue"] = function() { abort("'deletionQueue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_isDeleted")) Module["ClassHandle_isDeleted"] = function() { abort("'ClassHandle_isDeleted' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_deleteLater")) Module["ClassHandle_deleteLater"] = function() { abort("'ClassHandle_deleteLater' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "flushPendingDeletes")) Module["flushPendingDeletes"] = function() { abort("'flushPendingDeletes' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "delayFunction")) Module["delayFunction"] = function() { abort("'delayFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "setDelayFunction")) Module["setDelayFunction"] = function() { abort("'setDelayFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "RegisteredClass")) Module["RegisteredClass"] = function() { abort("'RegisteredClass' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "shallowCopyInternalPointer")) Module["shallowCopyInternalPointer"] = function() { abort("'shallowCopyInternalPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "downcastPointer")) Module["downcastPointer"] = function() { abort("'downcastPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "upcastPointer")) Module["upcastPointer"] = function() { abort("'upcastPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "validateThis")) Module["validateThis"] = function() { abort("'validateThis' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "char_0")) Module["char_0"] = function() { abort("'char_0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "char_9")) Module["char_9"] = function() { abort("'char_9' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "makeLegalFunctionName")) Module["makeLegalFunctionName"] = function() { abort("'makeLegalFunctionName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "LZ4")) Module["LZ4"] = function() { abort("'LZ4' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "warnOnce")) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stackSave")) Module["stackSave"] = function() { abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stackRestore")) Module["stackRestore"] = function() { abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc")) Module["stackAlloc"] = function() { abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString")) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii")) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString")) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16")) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16")) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString")) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32")) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32")) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8")) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8OnStack")) Module["allocateUTF8OnStack"] = function() { abort("'allocateUTF8OnStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
  Module["writeStackCookie"] = writeStackCookie;
  Module["checkStackCookie"] = checkStackCookie;if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL")) Object.defineProperty(Module, "ALLOC_NORMAL", { configurable: true, get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });
  if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK")) Object.defineProperty(Module, "ALLOC_STACK", { configurable: true, get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });

  if (memoryInitializer) {
    if (!isDataURI(memoryInitializer)) {
      memoryInitializer = locateFile(memoryInitializer);
    }
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      var data = readBinary(memoryInitializer);
      HEAPU8.set(data, 1024);
    } else {
      addRunDependency('memory initializer');
      var applyMemoryInitializer = function(data) {
        if (data.byteLength) data = new Uint8Array(data);
        for (var i = 0; i < data.length; i++) {
          assert(HEAPU8[1024 + i] === 0, "area for memory initializer should not have been touched before it's loaded");
        }
        HEAPU8.set(data, 1024);
        // Delete the typed array that contains the large blob of the memory initializer request response so that
        // we won't keep unnecessary memory lying around. However, keep the XHR object itself alive so that e.g.
        // its .status field can still be accessed later.
        if (Module['memoryInitializerRequest']) delete Module['memoryInitializerRequest'].response;
        removeRunDependency('memory initializer');
      };
      var doBrowserLoad = function() {
        readAsync(memoryInitializer, applyMemoryInitializer, function() {
          var e = new Error('could not load memory initializer ' + memoryInitializer);
            readyPromiseReject(e);
        });
      };
      if (Module['memoryInitializerRequest']) {
        // a network request has already been created, just use that
        var useRequest = function() {
          var request = Module['memoryInitializerRequest'];
          var response = request.response;
          if (request.status !== 200 && request.status !== 0) {
              // If you see this warning, the issue may be that you are using locateFile and defining it in JS. That
              // means that the HTML file doesn't know about it, and when it tries to create the mem init request early, does it to the wrong place.
              // Look in your browser's devtools network console to see what's going on.
              console.warn('a problem seems to have happened with Module.memoryInitializerRequest, status: ' + request.status + ', retrying ' + memoryInitializer);
              doBrowserLoad();
              return;
          }
          applyMemoryInitializer(response);
        };
        if (Module['memoryInitializerRequest'].response) {
          setTimeout(useRequest, 0); // it's already here; but, apply it asynchronously
        } else {
          Module['memoryInitializerRequest'].addEventListener('load', useRequest); // wait for it
        }
      } else {
        // fetch it from the network ourselves
        doBrowserLoad();
      }
    }
  }

  var calledRun;

  /**
   * @constructor
   * @this {ExitStatus}
   */
  function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status;
  }


  dependenciesFulfilled = function runCaller() {
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
  };





  /** @type {function(Array=)} */
  function run(args) {

    if (runDependencies > 0) {
      return;
    }

    writeStackCookie();

    preRun();

    if (runDependencies > 0) return; // a preRun added a dependency, run will be called later

    function doRun() {
      // run may have just been called through dependencies being fulfilled just in this very frame,
      // or while the async setStatus time below was happening
      if (calledRun) return;
      calledRun = true;
      Module['calledRun'] = true;

      if (ABORT) return;

      initRuntime();

      preMain();

      readyPromiseResolve(Module);
      if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

      assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

      postRun();
    }

    if (Module['setStatus']) {
      Module['setStatus']('Running...');
      setTimeout(function() {
        setTimeout(function() {
          Module['setStatus']('');
        }, 1);
        doRun();
      }, 1);
    } else
    {
      doRun();
    }
    if (!ABORT) checkStackCookie();
  }
  Module['run'] = run;

  function checkUnflushedContent() {
    // Compiler settings do not allow exiting the runtime, so flushing
    // the streams is not possible. but in ASSERTIONS mode we check
    // if there was something to flush, and if so tell the user they
    // should request that the runtime be exitable.
    // Normally we would not even include flush() at all, but in ASSERTIONS
    // builds we do so just for this check, and here we see if there is any
    // content to flush, that is, we check if there would have been
    // something a non-ASSERTIONS build would have not seen.
    // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
    // mode (which has its own special function for this; otherwise, all
    // the code is inside libc)
    var print = out;
    var printErr = err;
    var has = false;
    out = err = function(x) {
      has = true;
    };
    try { // it doesn't matter if it fails
      var flush = Module['_fflush'];
      if (flush) flush(0);
      // also flush in the JS FS layer
      ['stdout', 'stderr'].forEach(function(name) {
        var info = FS.analyzePath('/dev/' + name);
        if (!info) return;
        var stream = info.object;
        var rdev = stream.rdev;
        var tty = TTY.ttys[rdev];
        if (tty && tty.output && tty.output.length) {
          has = true;
        }
      });
    } catch(e) {}
    out = print;
    err = printErr;
    if (has) {
      warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
    }
  }

  /** @param {boolean|number=} implicit */
  function exit(status, implicit) {
    checkUnflushedContent();

    // if this is just main exit-ing implicitly, and the status is 0, then we
    // don't need to do anything here and can just leave. if the status is
    // non-zero, though, then we need to report it.
    // (we may have warned about this earlier, if a situation justifies doing so)
    if (implicit && noExitRuntime && status === 0) {
      return;
    }

    if (noExitRuntime) {
      // if exit() was called, we may warn the user if the runtime isn't actually being shut down
      if (!implicit) {
        var msg = 'program exited (with status: ' + status + '), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)';
        readyPromiseReject(msg);
        err(msg);
      }
    } else {

      exitRuntime();

      if (Module['onExit']) Module['onExit'](status);

      ABORT = true;
    }

    quit_(status, new ExitStatus(status));
  }

  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
    while (Module['preInit'].length > 0) {
      Module['preInit'].pop()();
    }
  }


    noExitRuntime = true;

  run();






  // {{MODULE_ADDITIONS}}





    return Module.ready
  }
  );
  })();

  const IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';

  const getSelfURL = () => {
      let url = "";  // transforms to "" in the generated bundle
      if (!url) {
          if (typeof document !== 'undefined') {
              url = document.currentScript && document.currentScript.src || document.baseURI;
          } else if (typeof location !== 'undefined') {
              url = location.href;
          }
      }
      return url
  };

  const moduleOptions = IS_NODE
      ? {
          locateFile(path) {
              const { join } = require('path');
              return join(__dirname, path)
          },
          getPreloadedPackage(remotePackageName) {
              const buf = require('fs').readFileSync(remotePackageName).buffer;
              return buf
          }
      }
      : {
          locateFile(path) {
              
// modern browsers that support WebAssembly 
if (path.endsWith('webmscore.lib.mem.wasm')) return new URL(MSCORE_LIB_MEM, MSCORE_BASEURL).href
if (path.endsWith('.wasm')) return new URL(MSCORE_LIB_WASM, MSCORE_BASEURL).href
if (path.endsWith('.data')) return new URL(MSCORE_LIB_DATA, MSCORE_BASEURL).href
if (path.endsWith('.wasm.js')) throw new Error('WebAssembly is not supported in your browser')

              // fix loading the preload pack in Browsers and WebWorkers
              const prefix = typeof MSCORE_SCRIPT_URL == 'string'
                  ? MSCORE_SCRIPT_URL  // to use like an environment variable
                  : getSelfURL();
              return new URL(path, prefix).href
          }
      };

  moduleOptions.getArguments = moduleOptions.getArguments || (() => ["-platform", "wasm"]);
  moduleOptions.arguments = moduleOptions.arguments || moduleOptions.getArguments();
  moduleOptions.ENV = moduleOptions.ENV || {};
  moduleOptions.ENV.QT_QPA_PLATFORM = moduleOptions.ENV.QT_QPA_PLATFORM || "wasm";
  moduleOptions.__cxa_atexit = moduleOptions.__cxa_atexit || function () { return 0 };
  moduleOptions.___cxa_atexit = moduleOptions.___cxa_atexit || moduleOptions.__cxa_atexit;

  /** @type {Record<string, any>} */
  let Module = moduleOptions;
  /** @type {Promise<any>} */
  const ModulePromise = Module$1(moduleOptions);

  /**
   * get the pointer to a js string, as utf-8 encoded char*
   * @param {string} str 
   * @returns {number}
   */
  const getStrPtr = (str) => {
      const maxSize = str.length * 4 + 1;
      const buf = Module._malloc(maxSize);
      Module.stringToUTF8(str, buf, maxSize);
      return buf
  };

  /**
   * get the pointer to a TypedArray, as char*
   * @typedef {Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array} TypedArray
   * @param {TypedArray} data 
   * @returns {number}
   */
  const getTypedArrayPtr = (data) => {
      const size = data.length * data.BYTES_PER_ELEMENT;
      const buf = Module._malloc(size);
      Module.HEAPU8.set(data, buf);
      return buf
  };

  class WasmRes {
      /**
       * Read responses from the wasm module
       * @param {number} ptr char* pointer to the responses data
       */
      constructor(ptr) {
          /** @type {number} */
          this._ptr = ptr;
          /** @type {number} */
          this._size = WasmRes._getUint32(this._sizePtr);
          this._checkRet();
      }

      /**
       * pointer to the error code
       * @private
       */
      get _retCodePtr() {
          return this._ptr
      }

      /**
       * pointer to the data size 
       * @private
       */
      get _sizePtr() {
          return this._retCodePtr + 4
      }

      /**
       * pointer to the data contents 
       * @private
       */
      get _dataPtr() {
          return this._sizePtr + 4
      }

      /**
       * @private 
       * throw error if not ok
       */
      _checkRet() {
          const retCode = WasmRes._getUint32(this._retCodePtr);
          if (retCode !== WasmError.CODE_OK) {
              // read the error message from data
              const retMsg = this.text();
              this.free();
              throw new WasmError(retCode, retMsg)
          }
      }

      /**
       * Read the data contents as Uint8Array
       * @returns {Uint8Array}
       */
      data() {
          return new Uint8Array( // make a copy
              Module.HEAPU8.subarray(this._dataPtr, this._dataPtr + this._size)
          )
      }

      /**
       * Read the data contents as UTF-8 string
       * @returns {string}
       */
      text() {
          return Module.UTF8ToString(this._dataPtr)
      }

      /**
       * Read the data contents as number
       * @returns {number}
       */
      number() {
          return WasmRes._getUint32(this._dataPtr)
      }

      free() {
          return freePtr(this._ptr)
      }

      /**
       * @private 
       * @param {number} ptr 
       * @returns {number}
       */
      static _getUint32(ptr) {
          const sizeData = new DataView(
              new Uint8Array(  // make a copy
                  Module.HEAPU8.subarray(ptr, ptr + 4)
              ).buffer
          );
          return sizeData.getUint32(0, true)
      }

      /**
       * @private 
       * @param {number} ptr 
       * @param {keyof WasmRes} method
       */
      static _readAndFree(ptr, method) {
          const res = new WasmRes(ptr);
          const s = res[method]();
          res.free();
          return s
      }

      /**
       * read wasm responses as Uint8Array  
       * @param {number} ptr 
       * @returns {Uint8Array}
       */
      static readData(ptr) {
          return WasmRes._readAndFree(ptr, 'data')
      }

      /**
       * read wasm responses as UTF-8 string 
       * @param {number} ptr 
       * @returns {string}
       */
      static readText(ptr) {
          return WasmRes._readAndFree(ptr, 'text')
      }

      /**
       * read wasm responses as number
       * @param {number} ptr 
       * @returns {number}
       */
      static readNum(ptr) {
          return WasmRes._readAndFree(ptr, 'number')
      }
  }

  /**
   * free a pointer
   * @param {number} bufPtr 
   */
  const freePtr = (bufPtr) => {
      Module._free(bufPtr);
  };

  /**
   * this promise is resolved when the runtime is fully initialized
   */
  const RuntimeInitialized = new Promise((resolve) => {
      ModulePromise.then((_Module) => {
          Module = _Module;
          Module.ccall('init');  // init libmscore
          resolve(undefined);
      });
  });

  class WasmError extends Error {
      /**
       * @param {number} errorCode 
       * @param {string} msg
       */
      constructor(errorCode, msg) {
          super();
          this.name = 'WasmError';
          this.errorCode = errorCode;
          this.errorName = msg;
          this.message = `WebMscore Err${this.errorName}`;
      }
  }

  /** @type {0} */
  WasmError.CODE_OK = 0;

  /** @see WebMscore.hasSoundfont */
  let _hasSoundfont = false;
  /**
   * Don't turn off logs if already set log level before `WebMscore.load(...)` is called
   * @see WebMscore.setLogLevel
   */
  let _hasLogLevelSet = false;

  class WebMscore {

      /**
       * This promise is resolved when the runtime is fully initialized
       * @returns {Promise<void>}
       */
      static get ready() {
          return RuntimeInitialized
      }

      /**
       * The maximum MSCZ/MSCX file format version supported by webmscore 
       * @returns {Promise<number>} e.g. `301`
       */
      static async version() {
          await WebMscore.ready;
          return Module.ccall('version', 'number')
      }

      /**
       * Set log level
       * @param {0 | 1 | 2} level - See https://github.com/LibreScore/webmscore/blob/v1.0.0/src/framework/global/thirdparty/haw_logger/logger/log_base.h#L30-L33
       *  - 0: Off
       *  - 1: Normal (`ERRR` or `WARN` or `INFO`)
       *  - 2: Debug  (`DEBG`)
       * @returns {Promise<void>}
       */
      static async setLogLevel(level) {
          _hasLogLevelSet = true;
          await WebMscore.ready;
          return Module.ccall('setLogLevel', null, ['number'], [level])
      }

      /**
       * Set custom stdout instead of `console.log`  
       * Available before `WebMscore.ready`
       * @private Node.js exclusive
       * @param {(byte: number) => any} write
       */
      static set stdout(write) {
          Module.stdout = write;
      }
      /** @private */
      static get stdout() {
          return Module.stdout
      }

      /**
       * Set custom stderr instead of `console.warn`  
       * Available before `WebMscore.ready`
       * @private Node.js exclusive
       * @param {(byte: number) => any} write
       * @example
       * ```js
       * WebMscore['stderr'] = function (byte) {
       *     process.stderr.write(new Uint8Array([byte]))
       * }
       * await WebMscore.ready
       * ```
       */
      static set stderr(write) {
          Module.stderr = write;
      }
      /** @private */
      static get stderr() {
          return Module.stderr
      }

      /**
       * Load score data
       * @param {import('../schemas').InputFileFormat} format 
       * @param {Uint8Array} data 
       * @param {Uint8Array[] | Promise<Uint8Array[]>} fonts load extra font files (CJK characters support)
       * @param {boolean} doLayout set to false if you only need the score metadata or the midi file (Super Fast, 3x faster than the musescore software)
       * @returns {Promise<WebMscore>}
       */
      static async load(format, data, fonts = [], doLayout = true) {
          const [_fonts] = await Promise.all([
              fonts,
              WebMscore.ready
          ]);

          for (const f of _fonts) {
              await WebMscore.addFont(f);
          }

          const fileformatptr = getStrPtr(format);
          const dataptr = getTypedArrayPtr(data);

          // get the pointer to the MasterScore class instance in C
          const resptr = Module.ccall('load',  // name of C function
              'number',  // return type
              ['number', 'number', 'number', 'boolean'],  // argument types
              [fileformatptr, dataptr, data.byteLength, doLayout]  // arguments
          );
          freePtr(fileformatptr);
          freePtr(dataptr);
          const scoreptr = WasmRes.readNum(resptr);

          if (!_hasLogLevelSet) {
              // turn off logs by default
              await WebMscore.setLogLevel(0);
          }

          const mscore = new WebMscore(scoreptr);
          return mscore
      }

      /**
       * Load (CJK) fonts on demand
       * @private
       * @param {string | Uint8Array} font
       *        * path to the font file in the virtual file system, or
       *        * the font file data
       * @returns {Promise<boolean>} success
       */
      static async addFont(font) {
          if (typeof font !== 'string') {
              const name = '' + Math.random();  // a random name
              // save the font data to the virtual file system
              Module['FS_createDataFile']('/fonts/', name, font, true, true);
              font = '/fonts/' + name;
          }

          const fontpathptr = getStrPtr(font);
          const success = Module.ccall('addFont', 'number', ['number'], [fontpathptr]);
          freePtr(fontpathptr);
          return !!success
      }

      /**
       * A soundfont file is loaded  
       * @private
       * @type {boolean}
       * @see setSoundFont and saveAudio
       */
      static get hasSoundfont() {
          return _hasSoundfont
      }
      /** @private */
      static set hasSoundfont(value) {
          _hasSoundfont = value;
      }

      /**
       * Set the soundfont (sf2/sf3) data  
       * (Audio needs soundfonts)
       * @private
       * @param {Uint8Array} data 
       * @returns {Promise<void>}
       */
      static async setSoundFont(data) {
          if (WebMscore.hasSoundfont) {
              // remove the old soundfont file
              Module['FS_unlink']('/MuseScore_General.sf3');
          }

          // put the soundfont file into the virtual file system
          // side effects: the soundfont is shared across all instances
          Module['FS_createDataFile']('/', 'MuseScore_General.sf3', data, true, true);

          WebMscore.hasSoundfont = true;
      }

      /**
       * @hideconstructor use `WebMscore.load`
       * @param {number} scoreptr the pointer to the MasterScore class instance in C++
       */
      constructor(scoreptr) {
          /** @private */
          this.scoreptr = scoreptr;

          /** @private */
          this.excerptId = -1;
      }

      /**
       * Only save this excerpt (linked parts) of the score  
       * 
       * if no excerpts, generate excerpts from existing instrument parts
       * 
       * @param {number} id  `-1` means the full score 
       */
      async setExcerptId(id) {
          this.excerptId = id;
      }

      async getExcerptId() {
          return this.excerptId
      }

      /**
       * Generate excerpts from Parts (only parts that are visible) if no existing excerpts
       * @returns {Promise<void>}
       */
      async generateExcerpts() {
          return Module.ccall('generateExcerpts', null, ['number'], [this.scoreptr])
      }

      /**
       * Get the score title
       * @returns {Promise<string>}
       */
      async title() {
          const dataptr = Module.ccall('title', 'number', ['number'], [this.scoreptr]);
          return WasmRes.readText(dataptr)
      }

      /**
       * Get the score title (filename safe, replaced some characters)
       */
      async titleFilenameSafe() {
          const title = await this.title();
          return title.replace(/[\s<>:{}"/\\|?*~.\0\cA-\cZ]+/g, '_')
      }

      /**
       * Get the number of pages in the score (or the excerpt if `excerptId` is set)
       * @returns {Promise<number>}
       */
      async npages() {
          const dataptr = Module.ccall('npages', 'number', ['number', 'number'], [this.scoreptr, this.excerptId]);
          return WasmRes.readNum(dataptr)
      }

      /**
       * Get score metadata
       * @returns {Promise<import('../schemas').ScoreMetadata>}
       */
      async metadata() {
          return JSON.parse(await this.saveMetadata())
      }

      /**
       * Get the positions of measures
       * @returns {Promise<import('../schemas').Positions>}
       */
      async measurePositions() {
          return JSON.parse(await this.savePositions(false))
      }

      /**
       * Get the positions of segments
       * @returns {Promise<import('../schemas').Positions>}
       */
      async segmentPositions() {
          return JSON.parse(await this.savePositions(true))
      }

      /**
       * Export score as MusicXML file
       * @returns {Promise<string>} contents of the MusicXML file (plain text)
       */
      async saveXml() {
          const dataptr = Module.ccall('saveXml', 'number', ['number', 'number'], [this.scoreptr, this.excerptId]);
          return WasmRes.readText(dataptr)
      }

      /**
       * Export score as compressed MusicXML file
       * @returns {Promise<Uint8Array>}
       */
      async saveMxl() {
          const dataptr = Module.ccall('saveMxl', 'number', ['number', 'number'], [this.scoreptr, this.excerptId]);
          return WasmRes.readData(dataptr)
      }

      /**
       * Save part score as MSCZ/MSCX file
       * @param {'mscz' | 'mscx'} format 
       * @returns {Promise<Uint8Array>}
       */
      async saveMsc(format = 'mscz') {
          const dataptr = Module.ccall('saveMsc', 'number', ['number', 'boolean', 'number'], [this.scoreptr, format == 'mscz', this.excerptId]);
          return WasmRes.readData(dataptr)
      }

      /**
       * Export score as the SVG file of one page
       * @param {number} pageNumber integer
       * @param {boolean} drawPageBackground 
       * @returns {Promise<string>} contents of the SVG file (plain text)
       */
      async saveSvg(pageNumber = 0, drawPageBackground = false) {
          const dataptr = Module.ccall('saveSvg',
              'number',
              ['number', 'number', 'boolean', 'number'],
              [this.scoreptr, pageNumber, drawPageBackground, this.excerptId]
          );
          return WasmRes.readText(dataptr)
      }

      /**
       * Export score as the PNG file of one page
       * @param {number} pageNumber integer
       * @param {boolean} drawPageBackground 
       * @param {boolean} transparent
       * @returns {Promise<Uint8Array>}
       */
      async savePng(pageNumber = 0, drawPageBackground = false, transparent = true) {
          const dataptr = Module.ccall('savePng',
              'number',
              ['number', 'number', 'boolean', 'boolean', 'number'],
              [this.scoreptr, pageNumber, drawPageBackground, transparent, this.excerptId]
          );
          return WasmRes.readData(dataptr)
      }

      /**
       * Export score as PDF file
       * @returns {Promise<Uint8Array>}
       */
      async savePdf() {
          const dataptr = Module.ccall('savePdf', 'number', ['number', 'number'], [this.scoreptr, this.excerptId]);
          return WasmRes.readData(dataptr)
      }

      /**
       * Export score as MIDI file
       * @param {boolean} midiExpandRepeats 
       * @param {boolean} exportRPNs 
       * @returns {Promise<Uint8Array>}
       */
      async saveMidi(midiExpandRepeats = true, exportRPNs = true) {
          const dataptr = Module.ccall('saveMidi',
              'number',
              ['number', 'boolean', 'boolean', 'number'],
              [this.scoreptr, midiExpandRepeats, exportRPNs, this.excerptId]
          );
          return WasmRes.readData(dataptr)
      }

      /**
       * Set the soundfont (sf2/sf3) data
       * @param {Uint8Array} data 
       */
      async setSoundFont(data) {
          return WebMscore.setSoundFont(data)
      }

      /**
       * Export score as audio file (wav/ogg/flac/mp3)
       * @param {'wav' | 'ogg' | 'flac' | 'mp3'} format 
       */
      async saveAudio(format) {
          if (!WebMscore.hasSoundfont) {
              throw new Error('The soundfont is not set.')
          }

          const fileformatptr = getStrPtr(format);
          const dataptr = Module.ccall('saveAudio',
              'number',
              ['number', 'number', 'number'],
              [this.scoreptr, fileformatptr, this.excerptId]
          );
          freePtr(fileformatptr);
          return WasmRes.readData(dataptr)
      }

      /**
       * Synthesize audio frames
       * 
       * `synthAudio` is single instance, i.e. you can't have multiple iterators. If you call `synthAudio` multiple times, it will reset the time offset of all iterators the function returned.
       * 
       * @param {number} starttime The start time offset in seconds
       * @returns {Promise<(cancel?: boolean) => Promise<import('../schemas').SynthRes>>} The iterator function, see `processSynth`
       */
      async synthAudio(starttime) {
          const fn = await this._synthAudio(starttime);
          return (cancel) => {
              return this.processSynth(fn, cancel)
          }
      }

      /**
       * Synthesize audio frames in bulk
       * @param {number} starttime - The start time offset in seconds
       * @param {number} batchSize - max number of result SynthRes' (n * 512 frames)
       * @returns {Promise<(cancel?: boolean) => Promise<import('../schemas').SynthRes[]>>}
       */
      async synthAudioBatch(starttime, batchSize) {
          const fn = await this._synthAudio(starttime);
          return (cancel) => {
              return this.processSynthBatch(fn, batchSize, cancel)
          }
      }

      /**
       * Synthesize audio frames
       * @private
       * @todo GC this iterator function
       * @param {number} starttime The start time offset in seconds
       * @returns {Promise<number>} Pointer to the iterator function
       */
      async _synthAudio(starttime = 0) {
          if (!WebMscore.hasSoundfont) {
              throw new Error('The soundfont is not set.')
          }

          const iteratorFnPtr = Module.ccall('synthAudio',
              'number',
              ['number', 'number', 'number'],
              [this.scoreptr, starttime, this.excerptId]
          );

          const success = iteratorFnPtr !== 0;
          if (!success) {
              throw new Error('synthAudio: Internal Error.')
          }

          return iteratorFnPtr
      }

      /**
       * Parse struct SynthRes, then free its memory
       * @private
       * @param {number} resptr - pointer to the SynthRes data
       * @returns {import('../schemas').SynthRes}
       */
      _parseSynthRes(resptr) {
          // struct SynthRes in synthres.h
          const done = Module.getValue(resptr + 0, 'i8');
          const startTime = +Module.getValue(resptr + 4, 'float');  // in seconds
          const endTime = +Module.getValue(resptr + 8, 'float');  // in seconds
          const chunkSize = Module.getValue(resptr + 12, 'i32');
          const chunkPtr = resptr + 16;

          const chunk = new Uint8Array(  // make a copy
              Module.HEAPU8.subarray(chunkPtr, chunkPtr + chunkSize)
          );

          freePtr(resptr);

          return {
              done: !!done,
              startTime, // The chunk's start time in seconds
              endTime,   // The current play time in seconds (the chunk's end time)
              chunk,     // The data chunk of audio frames, non-interleaved float32 PCM, 512 frames, 44100 Hz (44.1 kHz), 0.0116 s (512/44100)
          }
      }

      /**
       * @private
       * @param {number} fnptr - pointer to the iterator function
       * @param {boolean} cancel - cancel the audio synthesis worklet 
       * @returns {Promise<import('../schemas').SynthRes>}
       */
      async processSynth(fnptr, cancel = false) {
          const resptr = Module.ccall('processSynth',
              'number',
              ['number', 'boolean'],
              [fnptr, cancel]
          );
          return this._parseSynthRes(resptr)
      }

      /**
       * @private
       * @param {number} fnptr - pointer to the iterator function
       * @param {number} batchSize - see `synthAudioBatch`
       * @param {boolean} cancel - cancel the audio synthesis worklet 
       */
      async processSynthBatch(fnptr, batchSize, cancel = false) {
          const resArrPtr = Module.ccall('processSynthBatch',
              'number',
              ['number', 'number', 'boolean'],
              [fnptr, batchSize, cancel]
          );

          /** @type {import('../schemas').SynthRes[]} */
          const arr = [];
          for (let i = 0; i < batchSize; i++) {
              // visit the array of pointers to SynthRes data
              const resptr = Module.getValue(resArrPtr + 4 * i, '*'); // 32bit WASM, so one pointer is 4 bytes long
              const r = this._parseSynthRes(resptr);
              arr.push(r);
          }

          freePtr(resArrPtr);
          return arr
      }

      /**
       * Export positions of measures or segments (if `ofSegments` == true) as JSON
       * @param {boolean} ofSegments
       * @also `score.measurePositions()` and `score.segmentPositions()`
       * @returns {Promise<string>}
       */
      async savePositions(ofSegments) {
          const dataptr = Module.ccall('savePositions',
              'number',
              ['number', 'boolean', 'number'],
              [this.scoreptr, ofSegments, this.excerptId]
          );
          return WasmRes.readText(dataptr)
      }

      /**
       * Export score metadata as JSON text
       * @also `score.metadata()`
       * @returns {Promise<string>} contents of the JSON file
       */
      async saveMetadata() {
          const dataptr = Module.ccall('saveMetadata', 'number', ['number'], [this.scoreptr]);
          return WasmRes.readText(dataptr)
      }

      /**
       * Select the topmost selectable element near a page-relative point
       * @param {number} pageNumber zero-based page index
       * @param {number} x
       * @param {number} y
       * @returns {Promise<boolean>}
       */
      async selectElementAtPoint(pageNumber, x, y) {
          return Module.ccall('selectElementAtPoint',
              'boolean',
              ['number', 'number', 'number', 'number', 'number'],
              [this.scoreptr, pageNumber, x, y, this.excerptId]
          )
      }

      /**
       * Delete the current selection
       * @returns {Promise<boolean>}
       */
      async deleteSelection() {
          return Module.ccall('deleteSelection', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Raise pitch for the current selection
       */
      async pitchUp() {
          return Module.ccall('pitchUp', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Lower pitch for the current selection
       */
      async pitchDown() {
          return Module.ccall('pitchDown', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Double the duration of the current selection
       */
      async doubleDuration() {
          return Module.ccall('doubleDuration', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Halve the duration of the current selection
       */
      async halfDuration() {
          return Module.ccall('halfDuration', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Toggle dotted duration on the current selection
       */
      async toggleDot() {
          return Module.ccall('toggleDot', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Toggle double-dotted duration on the current selection
       */
      async toggleDoubleDot() {
          return Module.ccall('toggleDoubleDot', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Set voice index (0-3) for input/selection
       * @param {number} voiceIndex
       * @returns {Promise<boolean>}
       */
      async setVoice(voiceIndex) {
          return Module.ccall('setVoice', 'boolean', ['number', 'number', 'number'], [this.scoreptr, voiceIndex, this.excerptId])
      }

      /**
       * Undo the last command
       */
      async undo() {
          return Module.ccall('undo', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Redo the last undone command
       */
      async redo() {
          return Module.ccall('redo', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Force a relayout and update of the current score
       */
      async relayout() {
          return Module.ccall('relayout', 'boolean', ['number', 'number'], [this.scoreptr, this.excerptId])
      }

      /**
       * Set the time signature (global) at the start of the score
       * @param {number} numerator
       * @param {number} denominator
       * @returns {Promise<boolean>}
       */
      async setTimeSignature(numerator, denominator) {
          return Module.ccall('setTimeSignature', 'boolean', ['number', 'number', 'number', 'number'], [this.scoreptr, numerator, denominator, this.excerptId])
      }

      /**
       * Insert a clef at the current selection/input position
       * @param {number} clefType see engraving::ClefType enum
       * @returns {Promise<boolean>}
       */
      async setClef(clefType) {
          return Module.ccall('setClef', 'boolean', ['number', 'number', 'number'], [this.scoreptr, clefType, this.excerptId])
      }

      /**
       * @param {boolean=} soft (default `true`)
       *                 * `true`  destroy the score instance only, or
       *                 * `false` destroy the whole WebMscore context 
       * @returns {void}
       */
      destroy(soft = true) {
          if (!soft) {
              throw new Error('unimplemented')
          }

          Module.ccall('destroy', 'void', ['number'], [this.scoreptr]);
          freePtr(this.scoreptr);
      }

  }

  /** @type {WebMscore} */
  let score;

  /**
   * @typedef {{ id: number; method: Exclude<keyof import('./index').default, 'scoreptr' | 'excerptId'> | 'load' | 'ready' | 'setLogLevel'; params: any[]; }} RPCReq
   * @typedef {{ id: number; result?: any; error?: any; }} RPCRes
   * @param {number} id 
   * @param {any} result 
   * @param {Transferable[]} transfer
   */
  const rpcRes = (id, result, transfer = undefined) => {
      /** @type {RPCRes} */
      const res = {
          id,
          result,
      };
      self.postMessage(res, transfer);
  };

  /**
   * @param {number} id 
   * @param {Error} err 
   */
  const rpcErr = (id, err) => {
      /** @type {RPCRes} */
      const res = {
          id,
          error: {
              name: err.name,
              message: err.message,
              stack: err.stack,
          },
      };
      self.postMessage(res);
  };

  /**
   * @typedef {import('../schemas').SynthRes | Uint8Array | undefined} Res
   * @param {Res | Res[]} obj 
   * @returns {Transferable[] | undefined}
   */
  const getTransferable = (obj) => {
      if (!obj) return
      if (Array.isArray(obj)) {
          return obj.reduce((p, c) => p.concat(getTransferable(c)), []).filter(Boolean)
      } else if (obj instanceof Uint8Array) {
          return [obj.buffer]
      } else if (obj.chunk instanceof Uint8Array) {
          return [obj.chunk.buffer]
      }
  };

  self.onmessage = async (e) => {
      /** @type {RPCReq} */
      const req = e.data;  // JSON-RPC
      const { id, method, params } = req;

      try {
          switch (method) {
              case 'ready':
                  await WebMscore.ready;
                  rpcRes(id, 'done');
                  break

              case 'load':
                  await WebMscore.ready;
                  score = await WebMscore.load.apply(undefined, params);
                  rpcRes(id, 'done');
                  break;

              case 'setLogLevel':
                  await WebMscore.setLogLevel.apply(undefined, params);
                  rpcRes(id, 'done');
                  break

              default:
                  if (!score) { rpcErr(id, new Error('Score not loaded')); }
                  const result = await score[method].apply(score, params);
                  rpcRes(id, result, getTransferable(result));
          }
      } catch (err) {
          rpcErr(id, err);
      }
  };

})();
};

typeof process==='object'&&typeof process.versions==='object'&&typeof process.versions.node==='string';var getSelfURL=function getSelfURL(){var url="";if(!url){if(typeof document!=='undefined'){url=document.currentScript&&document.currentScript.src||document.baseURI;}else if(typeof location!=='undefined'){url=location.href;}}return url;};var shimDom=function shimDom(){var getGlobalThis=function getGlobalThis(){if(typeof self!=='undefined'){return self;}if(typeof window!=='undefined'){return window;}if(typeof global!=='undefined'){return global;}throw new Error('unable to locate global object');};var globalthis=getGlobalThis();if(!globalthis.window){if(typeof importScripts==='function'){globalthis.window=globalthis;}else {globalthis.window={addEventListener:function addEventListener(){},location:new URL("file:///"),encodeURIComponent:encodeURIComponent};}}if(!globalthis.navigator){try{globalthis.navigator={};}catch(_unused){}}};

function _toConsumableArray(r){return _arrayWithoutHoles(r)||_iterableToArray(r)||_unsupportedIterableToArray(r)||_nonIterableSpread();}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _iterableToArray(r){if("undefined"!=typeof Symbol&&null!=r[Symbol.iterator]||null!=r["@@iterator"])return Array.from(r);}function _arrayWithoutHoles(r){if(Array.isArray(r))return _arrayLikeToArray(r);}function _slicedToArray(r,e){return _arrayWithHoles(r)||_iterableToArrayLimit(r,e)||_unsupportedIterableToArray(r,e)||_nonIterableRest();}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(r,a){if(r){if("string"==typeof r)return _arrayLikeToArray(r,a);var t={}.toString.call(r).slice(8,-1);return "Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,a):void 0;}}function _arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n;}function _iterableToArrayLimit(r,l){var t=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(null!=t){var e,n,i,u,a=[],f=!0,o=!1;try{if(i=(t=t.call(r)).next,0===l){if(Object(t)!==t)return;f=!1;}else for(;!(f=(e=i.call(t)).done)&&(a.push(e.value),a.length!==l);f=!0);}catch(r){o=!0,n=r;}finally{try{if(!f&&null!=t.return&&(u=t.return(),Object(u)!==u))return;}finally{if(o)throw n;}}return a;}}function _arrayWithHoles(r){if(Array.isArray(r))return r;}function _regenerator(){var e,t,r="function"==typeof Symbol?Symbol:{},n=r.iterator||"@@iterator",o=r.toStringTag||"@@toStringTag";function i(r,n,o,i){var c=n&&n.prototype instanceof Generator?n:Generator,u=Object.create(c.prototype);return _regeneratorDefine2(u,"_invoke",function(r,n,o){var i,c,u,f=0,p=o||[],y=!1,G={p:0,n:0,v:e,a:d,f:d.bind(e,4),d:function d(t,r){return i=t,c=0,u=e,G.n=r,a;}};function d(r,n){for(c=r,u=n,t=0;!y&&f&&!o&&t<p.length;t++){var o,i=p[t],d=G.p,l=i[2];r>3?(o=l===n)&&(u=i[(c=i[4])?5:(c=3,3)],i[4]=i[5]=e):i[0]<=d&&((o=r<2&&d<i[1])?(c=0,G.v=n,G.n=i[1]):d<l&&(o=r<3||i[0]>n||n>l)&&(i[4]=r,i[5]=n,G.n=l,c=0));}if(o||r>1)return a;throw y=!0,n;}return function(o,p,l){if(f>1)throw TypeError("Generator is already running");for(y&&1===p&&d(p,l),c=p,u=l;(t=c<2?e:u)||!y;){i||(c?c<3?(c>1&&(G.n=-1),d(c,u)):G.n=u:G.v=u);try{if(f=2,i){if(c||(o="next"),t=i[o]){if(!(t=t.call(i,u)))throw TypeError("iterator result is not an object");if(!t.done)return t;u=t.value,c<2&&(c=0);}else 1===c&&(t=i.return)&&t.call(i),c<2&&(u=TypeError("The iterator does not provide a '"+o+"' method"),c=1);i=e;}else if((t=(y=G.n<0)?u:r.call(n,G))!==a)break;}catch(t){i=e,c=1,u=t;}finally{f=1;}}return {value:t,done:y};};}(r,o,i),!0),u;}var a={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}t=Object.getPrototypeOf;var c=[][n]?t(t([][n]())):(_regeneratorDefine2(t={},n,function(){return this;}),t),u=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(c);function f(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,GeneratorFunctionPrototype):(e.__proto__=GeneratorFunctionPrototype,_regeneratorDefine2(e,o,"GeneratorFunction")),e.prototype=Object.create(u),e;}return GeneratorFunction.prototype=GeneratorFunctionPrototype,_regeneratorDefine2(u,"constructor",GeneratorFunctionPrototype),_regeneratorDefine2(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName="GeneratorFunction",_regeneratorDefine2(GeneratorFunctionPrototype,o,"GeneratorFunction"),_regeneratorDefine2(u),_regeneratorDefine2(u,o,"Generator"),_regeneratorDefine2(u,n,function(){return this;}),_regeneratorDefine2(u,"toString",function(){return "[object Generator]";}),(_regenerator=function _regenerator(){return {w:i,m:f};})();}function _regeneratorDefine2(e,r,n,t){var i=Object.defineProperty;try{i({},"",{});}catch(e){i=0;}_regeneratorDefine2=function _regeneratorDefine(e,r,n,t){function o(r,n){_regeneratorDefine2(e,r,function(e){return this._invoke(r,n,e);});}r?i?i(e,r,{value:n,enumerable:!t,configurable:!t,writable:!t}):e[r]=n:(o("next",0),o("throw",1),o("return",2));},_regeneratorDefine2(e,r,n,t);}function asyncGeneratorStep(n,t,e,r,o,a,c){try{var i=n[a](c),u=i.value;}catch(n){return void e(n);}i.done?t(u):Promise.resolve(u).then(r,o);}function _asyncToGenerator(n){return function(){var t=this,e=arguments;return new Promise(function(r,o){var a=n.apply(t,e);function _next(n){asyncGeneratorStep(a,r,o,_next,_throw,"next",n);}function _throw(n){asyncGeneratorStep(a,r,o,_next,_throw,"throw",n);}_next(void 0);});};}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,_toPropertyKey(o.key),o);}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e;}function _toPropertyKey(t){var i=_toPrimitive(t,"string");return "symbol"==typeof i?i:i+"";}function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return ("string"===r?String:Number)(t);}function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function");}function _callSuper(t,o,e){return o=_getPrototypeOf(o),_possibleConstructorReturn(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],_getPrototypeOf(t).constructor):o.apply(t,e));}function _possibleConstructorReturn(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(t);}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e;}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_setPrototypeOf(t,e);}function _wrapNativeSuper(t){var r="function"==typeof Map?new Map():void 0;return _wrapNativeSuper=function _wrapNativeSuper(t){if(null===t||!_isNativeFunction(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==r){if(r.has(t))return r.get(t);r.set(t,Wrapper);}function Wrapper(){return _construct(t,arguments,_getPrototypeOf(this).constructor);}return Wrapper.prototype=Object.create(t.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(Wrapper,t);},_wrapNativeSuper(t);}function _construct(t,e,r){if(_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var o=[null];o.push.apply(o,e);var p=new(t.bind.apply(t,o))();return r&&_setPrototypeOf(p,r.prototype),p;}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return (_isNativeReflectConstruct=function _isNativeReflectConstruct(){return !!t;})();}function _isNativeFunction(t){try{return -1!==Function.toString.call(t).indexOf("[native code]");}catch(n){return "function"==typeof t;}}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t);},_getPrototypeOf(t);}var MSCORE_SCRIPT_URL$1=getSelfURL();var WorkerError=function(_Error){function WorkerError(err){var _this;_classCallCheck(this,WorkerError);_this=_callSuper(this,WorkerError);_this.name=err.name;_this.message=err.message;_this.originalStack=err.stack;return _this;}_inherits(WorkerError,_Error);return _createClass(WorkerError);}(_wrapNativeSuper(Error));var _logLevel=0;var WebMscoreW=function(){function WebMscoreW(){_classCallCheck(this,WebMscoreW);var refreshStub='var $RefreshSig$ = () => (type) => type; var $RefreshReg$ = () => {};';var url=URL.createObjectURL(new Blob(["(function () { var MSCORE_SCRIPT_URL = \"".concat(MSCORE_SCRIPT_URL$1,"\";")+refreshStub+'('+shimDom.toString()+')();'+"var MSCORE_LIB_WASM = \"".concat(libWasm,"\", MSCORE_LIB_DATA = \"").concat(libData,"\", MSCORE_LIB_MEM = \"").concat(libMem,"\", MSCORE_BASEURL = \"").concat(document.baseURI,"\";")+'('+WebMscoreWorker.toString()+')()'+'})()']));this.worker=new Worker(url);this.workerURL=url;}return _createClass(WebMscoreW,[{key:"rpc",value:(function(){var _rpc=_asyncToGenerator(_regenerator().m(function _callee(method){var _this2=this;var params,transfer,id,_args=arguments;return _regenerator().w(function(_context){while(1)switch(_context.n){case 0:params=_args.length>1&&_args[1]!==undefined?_args[1]:[];transfer=_args.length>2&&_args[2]!==undefined?_args[2]:[];id=Math.random();return _context.a(2,new Promise(function(resolve,reject){var _listener=function listener(e){var data=e.data;if(data.id===id){if(data.error){reject(new WorkerError(data.error));}_this2.worker.removeEventListener('message',_listener);resolve(data.result);}};_this2.worker.addEventListener('message',_listener);_this2.worker.postMessage({id:id,method:method,params:params},transfer);}));}},_callee);}));function rpc(_x){return _rpc.apply(this,arguments);}return rpc;}())},{key:"setExcerptId",value:function setExcerptId(id){return this.rpc('setExcerptId',[id]);}},{key:"getExcerptId",value:function getExcerptId(){return this.rpc('getExcerptId');}},{key:"generateExcerpts",value:function generateExcerpts(){return this.rpc('generateExcerpts');}},{key:"title",value:function title(){return this.rpc('title');}},{key:"titleFilenameSafe",value:function titleFilenameSafe(){return this.rpc('titleFilenameSafe');}},{key:"npages",value:function npages(){return this.rpc('npages');}},{key:"metadata",value:function metadata(){return this.rpc('metadata');}},{key:"measurePositions",value:function measurePositions(){return this.rpc('measurePositions');}},{key:"segmentPositions",value:function segmentPositions(){return this.rpc('segmentPositions');}},{key:"saveXml",value:function saveXml(){return this.rpc('saveXml');}},{key:"saveMxl",value:function saveMxl(){return this.rpc('saveMxl');}},{key:"saveMsc",value:function saveMsc(){var format=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'mscz';return this.rpc('saveMsc',[format]);}},{key:"saveSvg",value:function saveSvg(){var pageNumber=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var drawPageBackground=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;return this.rpc('saveSvg',[pageNumber,drawPageBackground]);}},{key:"savePng",value:function savePng(){var pageNumber=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var drawPageBackground=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var transparent=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;return this.rpc('savePng',[pageNumber,drawPageBackground,transparent]);}},{key:"savePdf",value:function savePdf(){return this.rpc('savePdf');}},{key:"saveMidi",value:function saveMidi(){var midiExpandRepeats=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;var exportRPNs=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;return this.rpc('saveMidi',[midiExpandRepeats,exportRPNs]);}},{key:"setSoundFont",value:function setSoundFont(data){return this.rpc('setSoundFont',[data],[data.buffer]);}},{key:"saveAudio",value:function saveAudio(format){return this.rpc('saveAudio',[format]);}},{key:"savePositions",value:function savePositions(ofSegments){return this.rpc('savePositions',[ofSegments]);}},{key:"synthAudio",value:(function(){var _synthAudio=_asyncToGenerator(_regenerator().m(function _callee2(){var _this3=this;var starttime,fnptr,_args2=arguments;return _regenerator().w(function(_context2){while(1)switch(_context2.n){case 0:starttime=_args2.length>0&&_args2[0]!==undefined?_args2[0]:0;_context2.n=1;return this.rpc('_synthAudio',[starttime]);case 1:fnptr=_context2.v;return _context2.a(2,function(cancel){return _this3.rpc('processSynth',[fnptr,cancel]);});}},_callee2,this);}));function synthAudio(){return _synthAudio.apply(this,arguments);}return synthAudio;}())},{key:"synthAudioBatch",value:(function(){var _synthAudioBatch=_asyncToGenerator(_regenerator().m(function _callee3(starttime,batchSize){var _this4=this;var fnptr;return _regenerator().w(function(_context3){while(1)switch(_context3.n){case 0:_context3.n=1;return this.rpc('_synthAudio',[starttime]);case 1:fnptr=_context3.v;return _context3.a(2,function(cancel){return _this4.rpc('processSynthBatch',[fnptr,batchSize,cancel]);});}},_callee3,this);}));function synthAudioBatch(_x2,_x3){return _synthAudioBatch.apply(this,arguments);}return synthAudioBatch;}())},{key:"saveMetadata",value:function saveMetadata(){return this.rpc('saveMetadata');}},{key:"selectElementAtPoint",value:function selectElementAtPoint(pageNumber,x,y){return this.rpc('selectElementAtPoint',[pageNumber,x,y]);}},{key:"deleteSelection",value:function deleteSelection(){return this.rpc('deleteSelection');}},{key:"pitchUp",value:function pitchUp(){return this.rpc('pitchUp');}},{key:"pitchDown",value:function pitchDown(){return this.rpc('pitchDown');}},{key:"doubleDuration",value:function doubleDuration(){return this.rpc('doubleDuration');}},{key:"halfDuration",value:function halfDuration(){return this.rpc('halfDuration');}},{key:"toggleDot",value:function toggleDot(){return this.rpc('toggleDot');}},{key:"toggleDoubleDot",value:function toggleDoubleDot(){return this.rpc('toggleDoubleDot');}},{key:"setVoice",value:function setVoice(voiceIndex){return this.rpc('setVoice',[voiceIndex]);}},{key:"undo",value:function undo(){return this.rpc('undo');}},{key:"redo",value:function redo(){return this.rpc('redo');}},{key:"relayout",value:function relayout(){return this.rpc('relayout');}},{key:"setTimeSignature",value:function setTimeSignature(numerator,denominator){return this.rpc('setTimeSignature',[numerator,denominator]);}},{key:"setClef",value:function setClef(clefType){return this.rpc('setClef',[clefType]);}},{key:"destroy",value:function destroy(){var soft=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;if(soft){this.rpc('destroy',[soft]);}else {this.worker.terminate();URL.revokeObjectURL(this.workerURL);}}}],[{key:"ready",get:function get(){return Promise.resolve();}},{key:"version",value:(function(){var _version=_asyncToGenerator(_regenerator().m(function _callee4(){return _regenerator().w(function(_context4){while(1)switch(_context4.n){case 0:return _context4.a(2,-1);}},_callee4);}));function version(){return _version.apply(this,arguments);}return version;}())},{key:"setLogLevel",value:(function(){var _setLogLevel=_asyncToGenerator(_regenerator().m(function _callee5(level){return _regenerator().w(function(_context5){while(1)switch(_context5.n){case 0:_logLevel=level;case 1:return _context5.a(2);}},_callee5);}));function setLogLevel(_x4){return _setLogLevel.apply(this,arguments);}return setLogLevel;}())},{key:"load",value:(function(){var _load=_asyncToGenerator(_regenerator().m(function _callee6(format,data){var fonts,doLayout,instance,_yield$Promise$all,_yield$Promise$all2,_fonts,_args6=arguments;return _regenerator().w(function(_context6){while(1)switch(_context6.n){case 0:fonts=_args6.length>2&&_args6[2]!==undefined?_args6[2]:[];doLayout=_args6.length>3&&_args6[3]!==undefined?_args6[3]:true;instance=new WebMscoreW();_context6.n=1;return Promise.all([fonts,instance.rpc('ready')]);case 1:_yield$Promise$all=_context6.v;_yield$Promise$all2=_slicedToArray(_yield$Promise$all,1);_fonts=_yield$Promise$all2[0];_context6.n=2;return instance.rpc('setLogLevel',[_logLevel]);case 2:_context6.n=3;return instance.rpc('load',[format,data,_fonts,doLayout],[data.buffer].concat(_toConsumableArray(_fonts.map(function(f){return f.buffer;}))));case 3:return _context6.a(2,instance);}},_callee6);}));function load(_x5,_x6){return _load.apply(this,arguments);}return load;}())}]);}();

export { WebMscoreW as default };
